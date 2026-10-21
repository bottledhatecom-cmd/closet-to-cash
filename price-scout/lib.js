'use strict';
// Shared helpers: the same smart search query the app builds, and price statistics.
const TYPE_LABEL = { 't-shirt': 'T-Shirt' };
const NOTABLE_MATERIALS = ['cashmere','silk','leather','suede','wool','mohair','angora','linen','velvet','velour','lace','sequin','beaded','denim','corduroy','satin','chiffon','fur','shearling','tweed','crochet','knit','mesh','pvc','vinyl','rayon','cotton'];
const SIZE_MATTERS = { jeans: 'w', pants: 'w', shoes: 'shoe' };
const titleCase = s => String(s || '').replace(/(^|[\s\-\/])([a-z])/g, (m, a, c) => a + c.toUpperCase());
const typeLabel = t => TYPE_LABEL[t] || titleCase(t || '');
const kwList = it => String(it.keywords || '').split(/[,#\n]+/).map(s => s.trim()).filter(Boolean);

// Keep in sync with smartQuery() in index.html.
function smartQuery(it) {
  const words = [], brand = String(it.brand || '').trim(), ty = it.type === 'other' ? '' : typeLabel(it.type).toLowerCase();
  const era = it.era && it.era !== 'Unknown' ? (it.era === 'Y2K' ? 'y2k' : it.era === '2010s' ? '' : 'vintage ' + it.era) : 'vintage';
  if (brand) words.push(brand);
  if (era) words.push(era);
  const matTxt = String(it.material || '').toLowerCase();
  const mat = NOTABLE_MATERIALS.find(m => new RegExp('\\b' + m + '\\b').test(matTxt));
  if (mat && (mat !== 'cotton' || !brand) && !(mat === 'denim' && it.type === 'jeans')) words.push(mat);
  if (!brand) { const kw = kwList(it)[0]; if (kw && kw.split(' ').length <= 2) words.push(kw.toLowerCase()); }
  if (ty) words.push(ty);
  const sz = String(it.size || '').trim();
  if (sz && SIZE_MATTERS[it.type] === 'w' && /^\d{2}$/.test(sz)) words.push('w' + sz);
  else if (sz && SIZE_MATTERS[it.type] === 'shoe' && /^\d{1,2}(\.5)?$/.test(sz)) words.push('size ' + sz);
  return words.join(' ').replace(/\s+/g, ' ').trim();
}
const queryFor = it => (it.compQuery && String(it.compQuery).trim()) || smartQuery(it);

function percentile(sorted, p) {
  if (!sorted.length) return null;
  const i = (sorted.length - 1) * p, lo = Math.floor(i), hi = Math.ceil(i);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo);
}
// low = 10th percentile, median, high = 90th percentile (ignores a few silly outliers), whole dollars.
function priceStats(prices) {
  const s = prices.filter(n => typeof n === 'number' && isFinite(n) && n > 0).sort((a, b) => a - b);
  if (!s.length) return null;
  const r = n => Math.round(n);
  return { low: r(percentile(s, 0.1)), median: r(percentile(s, 0.5)), high: r(percentile(s, 0.9)), count: s.length };
}
function todayISO() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
const sleep = ms => new Promise(r => setTimeout(r, ms));

module.exports = { smartQuery, queryFor, priceStats, percentile, todayISO, sleep };
