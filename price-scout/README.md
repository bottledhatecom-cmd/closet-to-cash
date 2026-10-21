# Hanger Hustle price scout

Box-side helper. Reads the app's JSON export and writes a comps file keyed by SKU that the app imports
(Settings > **Import comps by SKU (JSON)**). Official APIs only: it never loads Poshmark, Mercari, Vinted,
eBay's website or any other marketplace page. Keys live in environment variables on the box, never in the app.

```bash
cd /workspace/vintage-lister/price-scout
# 1. In the app: Settings > Export JSON  -> copy the file to the box, e.g. ~/hh/hanger-hustle-backup-2026-10-21.json
# 2. See what it would search (works with no keys):
node scout.js ~/hh/hanger-hustle-backup-2026-10-21.json --dry-run
# 3. With keys:
EBAY_CLIENT_ID=... EBAY_CLIENT_SECRET=... node scout.js ~/hh/hanger-hustle-backup-2026-10-21.json --out ~/hh/comps.json
# 4. In the app: Settings > Import comps by SKU (JSON) -> pick comps.json
```

Options: `--out file`, `--only V-0001,V-0002`, `--include-sold` (sold items are skipped by default), `--dry-run`, `--delay ms` (default 500 between API calls).

| Provider | Turns on when | What it returns |
|---|---|---|
| eBay Browse API (`providers/ebay.js`) | `EBAY_CLIENT_ID` + `EBAY_CLIENT_SECRET` | OAuth client-credentials token, then `item_summary/search` (fixed-price, USD, category 11450 Clothing, Shoes & Accessories, up to 100 results). **Active listings = asking prices, not sold prices.** Optional: `EBAY_ENV=sandbox`, `EBAY_MARKETPLACE`, `EBAY_CATEGORY_IDS` (empty = all), `EBAY_LIMIT` (max 200). |
| Etsy v3 (`providers/etsy.js`, stub) | `ETSY_API_KEY` + `ETSY_SHARED_SECRET` (or `ETSY_API_KEY=keystring:secret`) | `GET /v3/application/listings/active` with `x-api-key: keystring:shared_secret`. Asking prices. Not yet run against the live API (app pending approval). |

Each comp: `{"low","median","high","count","source","type","date","query","total"}`. low/high are the 10th/90th
percentile (ignores a few silly outliers), rounded to whole dollars. `type` is always `asking` for these two
providers; the app labels them "Asking · eBay API · Oct 21" and the suggested price counts them at half weight
and takes ~10% off. With no keys set, both providers skip with a reason and no file is written (exit 0).

Test (offline mock of both APIs): `node test/mock-test.js`.
