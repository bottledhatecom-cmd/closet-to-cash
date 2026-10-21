#!/usr/bin/env node
'use strict';
/* Hanger Hustle price scout (runs on the box, not in the app).
   Reads the app's JSON export (Settings > Backup > "Export JSON") and writes a comps file keyed by SKU,
   ready for the app's Settings > "Import comps by SKU (JSON)".
   Official APIs only. It never scrapes Poshmark, Mercari, Vinted, eBay's website or any other site.

   usage: node scout.js <backup.json> [--out comps.json] [--only V-0001,V-0002] [--include-sold] [--dry-run] [--delay 500]
   env:   EBAY_CLIENT_ID + EBAY_CLIENT_SECRET   -> eBay Browse API (active listings = asking prices)
          ETSY_API_KEY (+ ETSY_SHARED_SECRET)     -> Etsy v3 active listings (stub; asking prices)                */
const fs = require('fs'), path = require('path');
const { queryFor, todayISO, sleep } = require('./lib');
const PROVIDERS = [require('./providers/ebay'), require('./providers/etsy')];

function parseArgs(argv) {
  const a = { input: null, out: null, only: null, includeSold: false, dryRun: false, delay: 500 };
  for (let i = 0; i < argv.length; i++) {
    const v = argv[i];
    if (v === '--out' || v === '-o') a.out = argv[++i];
    else if (v === '--only') a.only = String(argv[++i] || '').split(',').map(s => s.trim()).filter(Boolean);
    else if (v === '--include-sold') a.includeSold = true;
    else if (v === '--dry-run') a.dryRun = true;
    else if (v === '--delay') a.delay = parseInt(argv[++i], 10) || 0;
    else if (v === '-h' || v === '--help') a.help = true;
    else if (!a.input) a.input = v;
    else throw new Error('Unexpected argument: ' + v);
  }
  return a;
}
const isSold = it => Object.values(it.status || {}).some(s => s && s.state === 'sold');

async function run(argv = process.argv.slice(2), env = process.env, log = console.log) {
  const a = parseArgs(argv);
  if (a.help || !a.input) { log('usage: node scout.js <hanger-hustle-backup.json> [--out comps.json] [--only V-0001,V-0002] [--include-sold] [--dry-run] [--delay ms]'); return { code: a.help ? 0 : 2 }; }
  const data = JSON.parse(fs.readFileSync(a.input, 'utf8'));
  const items = Array.isArray(data) ? data : data.items;
  if (!Array.isArray(items)) throw new Error('Not a Hanger Hustle JSON export (no "items" array)');
  let todo = items.filter(it => it && it.sku);
  if (a.only) todo = todo.filter(it => a.only.includes(it.sku));
  if (!a.includeSold) todo = todo.filter(it => !isSold(it));

  const on = [], off = [];
  for (const P of PROVIDERS) (P.enabled(env) ? on : off).push(P);
  off.forEach(P => log(`skip ${P.name}: ${P.why(env)}`));
  log(`${todo.length} item(s) to price; providers on: ${on.map(p => p.name).join(', ') || 'none'}`);

  if (a.dryRun || !on.length) {
    todo.forEach(it => log(`  ${it.sku}  "${queryFor(it)}"`));
    if (!on.length) log('No price providers enabled, so no comps file written. Set EBAY_CLIENT_ID/EBAY_CLIENT_SECRET (or ETSY_API_KEY + ETSY_SHARED_SECRET) and re-run.');
    return { code: 0, out: null, comps: {} };
  }
  const prov = on.map(P => P.create(env));
  const comps = {}, errors = [];
  for (const it of todo) {
    const q = queryFor(it);
    for (const p of prov) {
      try {
        const c = await p.search(q);
        if (c) { (comps[it.sku] = comps[it.sku] || {})[p.site] = c; log(`  ${it.sku} ${p.site}: $${c.low}-$${c.high}, typical $${c.median} (${c.count} ${c.type} prices) "${q}"`); }
        else log(`  ${it.sku} ${p.site}: no results for "${q}"`);
      } catch (e) { errors.push(`${it.sku} ${p.site}: ${e.message}`); log(`  ${it.sku} ${p.site}: ERROR ${e.message}`); }
      if (a.delay) await sleep(a.delay);
    }
  }
  const out = a.out || path.join(path.dirname(path.resolve(a.input)), `hanger-hustle-comps-${todayISO()}.json`);
  fs.writeFileSync(out, JSON.stringify(comps, null, 2));
  log(`Wrote comps for ${Object.keys(comps).length} item(s) to ${out}${errors.length ? ` (${errors.length} error(s))` : ''}`);
  log('Import it in the app: Settings > "Import comps by SKU (JSON)". These are ASKING prices (active listings), labelled as such.');
  return { code: errors.length && !Object.keys(comps).length ? 1 : 0, out, comps, errors };
}
module.exports = { run, parseArgs };
if (require.main === module) run().then(r => process.exit(r.code)).catch(e => { console.error('price-scout: ' + e.message); process.exit(1); });
