'use strict';
/* eBay Browse API provider (official API, allowed by eBay's API License Agreement).
   - OAuth 2.0 client-credentials grant (application token, scope https://api.ebay.com/oauth/api_scope)
   - GET /buy/browse/v1/item_summary/search
   Browse only returns ACTIVE listings, so these are ASKING prices, not sold prices. Every comp is labelled
   type:'asking', source:'ebay-browse'. Sold prices need eBay's Marketplace Insights API (restricted, by application).
   Turns on only when EBAY_CLIENT_ID and EBAY_CLIENT_SECRET are set. Secrets stay on the box, never in the app. */
const { priceStats, todayISO } = require('../lib');

const NAME = 'ebay';
function enabled(env = process.env) { return !!(env.EBAY_CLIENT_ID && env.EBAY_CLIENT_SECRET); }
function why(env = process.env) { return enabled(env) ? '' : 'EBAY_CLIENT_ID / EBAY_CLIENT_SECRET not set (eBay developer keys pending)'; }

function create(env = process.env) {
  const base = env.EBAY_API_BASE || (env.EBAY_ENV === 'sandbox' ? 'https://api.sandbox.ebay.com' : 'https://api.ebay.com');
  const marketplace = env.EBAY_MARKETPLACE || 'EBAY_US';
  const category = env.EBAY_CATEGORY_IDS === undefined ? '11450' : env.EBAY_CATEGORY_IDS; // 11450 = Clothing, Shoes & Accessories
  const limit = Math.min(200, Math.max(1, parseInt(env.EBAY_LIMIT || '100', 10)));
  let token = null, tokenExp = 0;

  async function getToken() {
    if (token && Date.now() < tokenExp - 60000) return token;
    const basic = Buffer.from(`${env.EBAY_CLIENT_ID}:${env.EBAY_CLIENT_SECRET}`).toString('base64');
    const r = await fetch(`${base}/identity/v1/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `Basic ${basic}` },
      body: 'grant_type=client_credentials&scope=' + encodeURIComponent('https://api.ebay.com/oauth/api_scope'),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.access_token) throw new Error(`eBay OAuth failed (${r.status}): ${j.error_description || j.error || 'no token'}`);
    token = j.access_token; tokenExp = Date.now() + (j.expires_in || 7200) * 1000;
    return token;
  }

  async function search(query) {
    const u = new URL(`${base}/buy/browse/v1/item_summary/search`);
    u.searchParams.set('q', query);
    u.searchParams.set('limit', String(limit));
    if (category) u.searchParams.set('category_ids', category);
    // Fixed-price only: an auction's current bid is not a meaningful price.
    u.searchParams.set('filter', 'buyingOptions:{FIXED_PRICE},priceCurrency:USD');
    const r = await fetch(u, { headers: { Authorization: `Bearer ${await getToken()}`, 'X-EBAY-C-MARKETPLACE-ID': marketplace, Accept: 'application/json' } });
    const j = await r.json().catch(() => ({}));
    if (r.status === 401) { token = null; throw new Error('eBay token rejected (401)'); }
    if (!r.ok) throw new Error(`eBay search failed (${r.status}): ${(j.errors && j.errors[0] && j.errors[0].message) || ''}`);
    const prices = (j.itemSummaries || []).filter(s => s.price && s.price.currency === 'USD').map(s => parseFloat(s.price.value));
    const st = priceStats(prices);
    if (!st) return null;
    return { ...st, source: 'ebay-browse', type: 'asking', date: todayISO(), query, total: j.total ?? null };
  }
  return { name: NAME, site: 'ebay', search };
}
module.exports = { name: NAME, enabled, why, create };
