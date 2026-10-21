'use strict';
/* Etsy Open API v3 provider: STUB until the Etsy app is approved (keystring w652vgwg86fb34usxl7pfoga is pending).
   - GET /v3/application/listings/active (findAllListingsActive), header x-api-key.
   - Since 2026 Etsy requires x-api-key = "<keystring>:<shared_secret>". Set ETSY_API_KEY to the keystring and
     ETSY_SHARED_SECRET to the secret (or ETSY_API_KEY to the combined "keystring:secret").
   Active listings = ASKING prices (Etsy has no sold-price search). Labelled type:'asking', source:'etsy-api'.
   Not yet run against the live API: check field names against the reference once the key works. */
const { priceStats, todayISO } = require('../lib');

const NAME = 'etsy';
function apiKey(env) { const k = env.ETSY_API_KEY || ''; if (!k) return ''; if (k.includes(':')) return k; return env.ETSY_SHARED_SECRET ? `${k}:${env.ETSY_SHARED_SECRET}` : ''; }
function enabled(env = process.env) { return !!apiKey(env); }
function why(env = process.env) {
  if (!env.ETSY_API_KEY) return 'ETSY_API_KEY not set (Etsy app approval pending)';
  if (!apiKey(env)) return 'ETSY_SHARED_SECRET not set (Etsy needs x-api-key = keystring:shared_secret)';
  return '';
}
function create(env = process.env) {
  const base = env.ETSY_API_BASE || 'https://api.etsy.com';
  const key = apiKey(env), limit = Math.min(100, Math.max(1, parseInt(env.ETSY_LIMIT || '100', 10)));
  async function search(query) {
    const u = new URL(`${base}/v3/application/listings/active`);
    u.searchParams.set('keywords', query);
    u.searchParams.set('limit', String(limit));
    u.searchParams.set('sort_on', 'score');
    const r = await fetch(u, { headers: { 'x-api-key': key, Accept: 'application/json' } });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(`Etsy search failed (${r.status}): ${j.error || ''}`);
    const prices = (j.results || []).filter(l => l.price && (l.price.currency_code || 'USD') === 'USD')
      .map(l => l.price.amount / (l.price.divisor || 100));
    const st = priceStats(prices);
    if (!st) return null;
    return { ...st, source: 'etsy-api', type: 'asking', date: todayISO(), query, total: j.count ?? null };
  }
  return { name: NAME, site: 'etsy', search };
}
module.exports = { name: NAME, enabled, why, create };
