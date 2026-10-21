'use strict';
// Offline test: a local mock of the eBay OAuth + Browse endpoints and the Etsy v3 endpoint. No real site is contacted.
const http = require('http'), fs = require('fs'), os = require('os'), path = require('path'), assert = require('assert');
const { run } = require('../scout');
const { smartQuery } = require('../lib');
let fails = 0; const check = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
const seen = [];
const srv = http.createServer((q, r) => {
  const u = new URL(q.url, 'http://x'); seen.push({ path: u.pathname, h: q.headers, qs: Object.fromEntries(u.searchParams) });
  let body = ''; q.on('data', d => body += d); q.on('end', () => {
    const j = o => { r.writeHead(200, { 'content-type': 'application/json' }); r.end(JSON.stringify(o)); };
    if (u.pathname === '/identity/v1/oauth2/token') {
      const ok = q.headers.authorization === 'Basic ' + Buffer.from('cid:csecret').toString('base64') && /grant_type=client_credentials/.test(body) && /api_scope/.test(decodeURIComponent(body));
      if (!ok) { r.writeHead(401); return r.end('{"error":"invalid_client"}'); }
      return j({ access_token: 'TOKEN123', expires_in: 7200, token_type: 'Application Access Token' });
    }
    if (u.pathname === '/buy/browse/v1/item_summary/search') {
      if (q.headers.authorization !== 'Bearer TOKEN123') { r.writeHead(401); return r.end('{}'); }
      const prices = [20, 35, 40, 45, 50, 55, 60, 65, 70, 400];
      return j({ total: 1234, itemSummaries: prices.map((p, i) => ({ itemId: 'v1|' + i, title: 'x', price: { value: p.toFixed(2), currency: 'USD' } })).concat([{ price: { value: '9.00', currency: 'GBP' } }]) });
    }
    if (u.pathname === '/v3/application/listings/active') {
      if (q.headers['x-api-key'] !== 'w652vgwg86fb34usxl7pfoga:shh') { r.writeHead(403); return r.end('{"error":"Invalid API key"}'); }
      return j({ count: 3, results: [{ price: { amount: 5000, divisor: 100, currency_code: 'USD' } }, { price: { amount: 8800, divisor: 100, currency_code: 'USD' } }, { price: { amount: 12000, divisor: 100, currency_code: 'USD' } }] });
    }
    r.writeHead(404); r.end('{}');
  });
}).listen(0, async () => {
  const base = `http://127.0.0.1:${srv.address().port}`;
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'scout-'));
  const input = path.join(dir, 'backup.json');
  fs.writeFileSync(input, JSON.stringify({ format: 'closet-to-cash-backup', items: [
    { sku: 'V-0001', brand: 'Gunne Sax', type: 'dress', era: '70s', material: 'cotton lace', status: {} },
    { sku: 'V-0002', brand: "Levi's", type: 'jeans', era: '90s', size: '29', material: 'denim', compQuery: 'levis 501 w29' },
    { sku: 'V-0003', brand: 'Coach', type: 'bag', era: 'Y2K', status: { poshmark: { state: 'sold' } } },
  ], photos: [] }));
  const logs = []; const log = s => logs.push(s);
  try {
    // 1. no keys: skips cleanly, writes nothing
    let r = await run([input], {}, log);
    check(r.code === 0 && r.out === null && logs.some(l => /skip ebay: EBAY_CLIENT_ID/.test(l)) && logs.some(l => /skip etsy: ETSY_API_KEY/.test(l)), 'no keys: both providers skip cleanly, exit 0, no file');
    check(logs.some(l => l.includes('V-0001  "Gunne Sax vintage 70s lace dress"')) && logs.some(l => l.includes('"levis 501 w29"')) && !logs.some(l => l.includes('V-0003')), 'lists smart queries, honours her edited query, skips sold items');
    check(smartQuery({ brand: 'Gunne Sax', type: 'dress', era: '70s', material: 'cotton lace' }) === 'Gunne Sax vintage 70s lace dress', 'same smart query as the app');
    // 2. Etsy key without secret: skipped with a clear reason
    logs.length = 0; r = await run([input, '--dry-run'], { ETSY_API_KEY: 'w652vgwg86fb34usxl7pfoga' }, log);
    check(logs.some(l => /skip etsy: ETSY_SHARED_SECRET not set/.test(l)), 'Etsy keystring alone: skipped (needs keystring:shared_secret)');
    // 3. both on against the mock
    logs.length = 0; const out = path.join(dir, 'comps.json');
    r = await run([input, '--out', out, '--delay', '0'], { EBAY_CLIENT_ID: 'cid', EBAY_CLIENT_SECRET: 'csecret', EBAY_API_BASE: base, ETSY_API_KEY: 'w652vgwg86fb34usxl7pfoga', ETSY_SHARED_SECRET: 'shh', ETSY_API_BASE: base }, log);
    const C = JSON.parse(fs.readFileSync(out, 'utf8'));
    console.log('   ' + JSON.stringify(C['V-0001']));
    check(r.code === 0 && Object.keys(C).join() === 'V-0001,V-0002', 'comps file keyed by SKU (sold V-0003 skipped)');
    const e = C['V-0001'].ebay;
    check(e.type === 'asking' && e.source === 'ebay-browse' && /^\d{4}-\d{2}-\d{2}$/.test(e.date) && e.count === 10 && e.median === 53 && e.low === 34 && e.high === 103, 'eBay comp: asking, ebay-browse, dated, p10/median/p90, non-USD dropped');
    const t = C['V-0001'].etsy; check(t.type === 'asking' && t.source === 'etsy-api' && t.median === 88 && t.count === 3, 'Etsy comp: asking, etsy-api, price amount/divisor');
    const tok = seen.filter(s => s.path === '/identity/v1/oauth2/token').length; check(tok === 1, 'eBay OAuth token fetched once and reused (' + tok + ')');
    const s = seen.find(s => s.path === '/buy/browse/v1/item_summary/search');
    check(s.h['x-ebay-c-marketplace-id'] === 'EBAY_US' && s.qs.filter.includes('FIXED_PRICE') && s.qs.category_ids === '11450' && s.qs.q === 'Gunne Sax vintage 70s lace dress', 'Browse request: marketplace header, fixed-price filter, clothing category, query');
    // 4. bad eBay secret: errors reported, Etsy still works
    logs.length = 0; r = await run([input, '--out', out, '--delay', '0', '--only', 'V-0002'], { EBAY_CLIENT_ID: 'cid', EBAY_CLIENT_SECRET: 'wrong', EBAY_API_BASE: base, ETSY_API_KEY: 'w652vgwg86fb34usxl7pfoga:shh', ETSY_API_BASE: base }, log);
    check(r.errors.length === 1 && /OAuth failed \(401\)/.test(r.errors[0]) && JSON.parse(fs.readFileSync(out, 'utf8'))['V-0002'].etsy, 'bad eBay secret: clear error, other provider still runs; combined Etsy key accepted');
  } catch (e) { console.error(e); fails++; }
  srv.close(); console.log(fails ? fails + ' FAILURES' : 'ALL PASSED'); process.exit(fails ? 1 : 0);
});
