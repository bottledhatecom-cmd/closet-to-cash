# Hanger Hustle: handoff notes

_Last updated: 2026-10-21 ~6:25 PM CT (moved to custom domain app.hangerhustle.com, assetlinks.json, 360px header fix, sw.js VERSION ctc-v4; earlier today: Etsy, posting modes, Google client ID, privacy/terms, renamed Hanger Hustle). The running decision log is HANGHUSTLE-MANUAL.md (box master: /workspace/shared-library/manuals/HangHustle-Manual.md). Grok Bot keeps building here too and updates this file with every change._

## What it is and who it's for
- **Who:** Michael's wife sells a lot of vintage clothing. She mainly uses an **Android phone**, and it should work on iPhone too.
- **What it does:** she photographs a piece, enters the details, and the app writes listing text for each marketplace. It tracks where each item is listed or sold, warns her to delist elsewhere once something sells, and compares sold prices and fees per site.
- **Name:** **Hanger Hustle** (two words, title case), picked by Michael on 2026-10-21. Set in `APP_NAME`, the manifest, page titles, privacy/terms and README. Not yet screened for trademarks/app-store clashes.
  - The repo and URL stay `closet-to-cash` for now. Internal storage names also stay `closet-to-cash` (IndexedDB `closet-to-cash-db`, Drive file `closet-to-cash-inventory.json`, localStorage `ctc-*`, sw cache `ctc-vN`) so existing data keeps working. Don't rename those without a migration.
  - **Android package ID:** `com.hangerhustle.app`. TWA in `/workspace/closet-android/` (config `app.config.json`: host `app.hangerhustle.com`, start `/`, versionCode 2 / 1.0.1, rebuilt ~6:32 PM CT: `dist/com.hangerhustle.app-1.0.1-2-release.aab` + `-release-signed.apk`; build with `scripts/build.sh`).
- **Where it runs:** client-side only, no backend. Items and photos live in the phone's browser storage (IndexedDB). Google sign-in is optional and backs up to her own Google Drive.

## Where it lives
- **Live site:** https://app.hangerhustle.com/ (GitHub Pages custom domain, set 2026-10-21 ~6:22 PM CT; DNS at **ChangeIP**, CNAME `app` → `bottledhatecom-cmd.github.io`). The old https://bottledhatecom-cmd.github.io/closet-to-cash/ redirects there automatically (GitHub does this because of the `CNAME` file).
  - **Browser data does not follow the move.** IndexedDB is per-origin, so anything saved on the github.io address stays there. She should back up first (Google backup or JSON export on the old address), then restore on app.hangerhustle.com. Redirects mean she may need to export before the redirect kicks in, or restore from Google Drive (Drive backup works from either origin once the new origin is authorized).
  - Bare **hangerhustle.com** (bought 6:19 PM CT) is reserved for a future landing page; not connected.
- **Privacy policy:** https://app.hangerhustle.com/privacy.html
- **Terms of use:** https://app.hangerhustle.com/terms.html
- **Android asset links:** https://app.hangerhustle.com/.well-known/assetlinks.json (repo `.well-known/assetlinks.json`, `.nojekyll` keeps the dot-folder). Copy of `/workspace/closet-android/assetlinks/assetlinks.json`; add Play's app-signing SHA-256 after the first Play upload.
- **Repo:** https://github.com/bottledhatecom-cmd/closet-to-cash (public; `CNAME` file = `app.hangerhustle.com`)
- **Grok's working copy:** `/workspace/vintage-lister/`; push clone `/workspace/ctc-deploy/`; tests in `/workspace/vltest/`.

## Current features
- **Adding items:** camera or gallery (several photos), shrunk in the browser to max 1600px JPEG 0.8, choose cover photo. Fields: brand, type, era, size on tag, measurements (pit-to-pit, length, waist, inseam), color, material, condition and flaws, style keywords, cost, asking price. SKUs V-0001, V-0002…
- **Sites** (template text only, no AI). Each site can be switched on/off in Settings ("Sites I sell on"); a site that already has a status on an item still shows for that item.

  | Site | Default | Posting mode | Title | Description / extras |
  |---|---|---|---|---|
  | Poshmark | on | She publishes (pre-filled) | 80 | 1500 |
  | eBay | on | Bot posts (official API) | 80 | ITEM SPECIFICS block |
  | Depop | on | Bot posts (allowed crosslisting) | headline | 1000, 5 hashtags |
  | Vinted | on | She publishes (pre-filled) | 100 (est.) | 2000 (est.) |
  | Mercari | on | She publishes (pre-filled) | 80 | 1000 |
  | Etsy | on | Bot posts (official API) | 140 | 13 tags, max 20 chars each; warns if era is under 20 years (Etsy "vintage" = 20+ years old) |
  | FB Marketplace | off | She publishes (pre-filled) | 100 | plain; local pickup is free |
  | Grailed | off | She publishes (pre-filled) | — | mostly menswear/streetwear |

- **Listing cards:** live character counts, Copy title / Copy description / Copy all (with fallback copy method), "Open site", her edits are saved per site and "Regenerate" resets them.
  - **She-publishes sites:** one big **"Post to <site>"** button: copies the full listing (title + blank line + description), sends photos through the phone share sheet (or downloads them where sharing isn't available), and opens the site's create-listing page. A short checklist appears (paste title, paste description, add photos, set price/size/category, publish) with an **"I published it"** button that marks the site Listed.
  - **Bot sites (eBay, Etsy, Depop):** shows the mode and a note; a **"Queue for bot"** toggle stores `status[site].botQueued` for the future bot. The manual copy/Open-site path still works today. **No bot posting is built yet.**
- **Status per site:** Not listed / Listed / Sold plus listing URL. Sold anywhere ⇒ "Sold on X — Remove from: Y, Z" banner with a "Removed" button per site; ribbon and alert in the inventory.
- **Inventory:** grid/list, search, filters (unlisted / listed / sold / needs delisting), sort by date or price; dashboard (items, listed, sold, revenue, profit, in stock).
- **Value comparison per site** (all shown sites incl. Etsy/FB/Grailed): low/median/high sold, comp count, optional fee overrides; payout at asking price and at each site's median; "★ Best"; suggested price (comp-weighted median); "Search sold comps" buttons. Fee defaults (`FEE_DEFAULTS`, `FEES_CHECKED = '2026-10-21'`): eBay 13.6% + $0.40; Poshmark $2.95 under $15 / 20%; Mercari 10%; Depop 0% seller fee US + ~3.3% + $0.45 processing; Vinted 0%; **Etsy 6.5% transaction + 3% + $0.25 processing + $0.20 listing**; FB 10% shipped (min $0.80), $0 local; Grailed 6% under $120 (min $1.99) / 9% at $120+, plus 3.49% + $0.49.
- **Backup and import:** CSV (no photos), full JSON (photos base64), JSON import that merges, comps import by SKU.
- **Google sign-in backup:** live. `GOOGLE_CLIENT_ID = '196912346158-dasm934sl5l3ggd6fgr409fei0bkho82.apps.googleusercontent.com'` (Cloud project `closet-to-cash`; public ID, not a secret). The Google script is only loaded when she taps Sign in. **The OAuth client needs the JavaScript origin `https://app.hangerhustle.com` added** (besides `https://bottledhatecom-cmd.github.io`) or sign-in fails on the new domain. **The OAuth consent screen is currently in Testing** (test user: her Gmail), so only Google accounts added as test users can sign in, and tokens/consent expire after 7 days in Testing. Publishing it needs the privacy/terms URLs above.
- **Installable app (PWA):** `manifest.webmanifest` (standalone, theme #7a3a26, 192/512 icons) and `sw.js` (offline copy). Chrome reports it installable.

## Files
| File | What it is |
|---|---|
| `index.html` | The whole app: inline CSS and JS, no build step, no dependencies |
| `privacy.html`, `terms.html` | Plain privacy policy and terms (dated 2026-10-21, contact bottledhate.com@gmail.com), linked from the Settings/Backup page footer; cached for offline |
| `sw.js` | Service worker. Pages network-first with cached fallback; other own files cache-first. Never caches Google or other sites' traffic |
| `manifest.webmanifest`, `icon-180/192/512.png` | Manifest and icons |
| `README.md` | Public description |
| `HANDOFF-FOR-CLAUDE.md` | This file |
| `HANGHUSTLE-MANUAL.md` | Plain-language running manual + decision log (copy of the box master) |
| `CNAME`, `.well-known/assetlinks.json`, `.nojekyll` | Custom domain, Android asset links, keep Jekyll from hiding dot-folders |

## How it's built
- **Settings block** at the top of the script: `APP_NAME`, `SKU_PREFIX`, image sizes, `GOOGLE_CLIENT_ID`, `GOOGLE_SCOPES`, `AUTO_BACKUP_DELAY_MS`, `POST_MODES` (`api` / `crosslist` / `prefill`), `PLATFORMS` (name, create URL, limits, `tagsMax`/`tagLen` for Etsy, `mode`, `on` default, `modeNote`), `FEES_CHECKED`, `FEE_DEFAULTS`, `COMP_SEARCH`.
  - `PKEYS` = all sites; `activeKeys()` = sites switched on (localStorage `ctc-sites`); `shownKeys(item)` = switched on, or already has a status on that item.
- **Routing:** hash routes `#/`, `#/add`, `#/edit/<id>`, `#/item/<id>`, `#/backup`.
- **IndexedDB** (`closet-to-cash-db`, version 1):
  - `items` (key `id`): `{id, sku, createdAt, updatedAt, brand, type, era, size, pit, length, waist, inseam, color, material, condition, flaws, keywords, cost, price, status:{<site>:{state:'none'|'listed'|'sold', url, botQueued?}}, soldPrice, soldAt, custom:{<site>:{title?,desc?,tags?}}, comps:{<site>:{...}}, compQuery, thumb, photoCount}`. `<site>` is any of poshmark, ebay, depop, vinted, mercari, etsy, facebook, grailed.
  - `photos` (key `id`, index `itemId`): `{id, itemId, idx, type, buf (ArrayBuffer), hash}`
  - `meta` (key `k`): `sku` counter, `tombstones` `{itemId: deletedAt}`, `lastBackup`
- **Comps JSON shape:** per item `{"ebay":{"low":45,"median":78,"high":140,"count":22,"feePct":13.6,"feeFixed":0.4}, "etsy":{...}, ...}` (any site key above; every field optional; `{"comps":{...}}` also works; unknown keys ignored). Many items: `{"V-0001": {<same>}, "V-0002": {...}}`.
- **Drive sync design** (browser only, scope `openid email profile https://www.googleapis.com/auth/drive.appdata`):
  - Files in `appDataFolder`: `closet-to-cash-inventory.json` `{format:'closet-to-cash-drive', version:1, updatedAt, contentHash, skuCounter, items[], photos[], tombstones{}}` and one `photo-<photoId>.jpg` per photo (appProperties `kind, photoId, itemId, hash`).
  - Backup (`planBackup`): merge by item (newest `updatedAt` wins, cloud-only items kept, tombstoned dropped), upload only new photo ids/hashes, delete unreferenced cloud photos, skip inventory write if `contentHash` unchanged. Never changes phone data.
  - Restore (`planRestore` + `restoreFromDrive`): match by id then SKU, confirm box (add / replace / keep), download only missing photos, never deletes phone-only items.
  - Tokens: ~1h access token in localStorage `ctc-google-auth`; quiet re-request (`prompt:''`) once when visible, else "tap Back up now"; 401 ⇒ one refresh + retry; sign out revokes, keeps data.
  - Auto backup: `markDirty()` on writes, 10s debounce, immediate on hide/pagehide; can be turned off.
- **Service worker VERSION rule:** **bump `VERSION` in `sw.js` (currently `ctc-v4`) every time `index.html` or any cached file changes.**

## How to run the tests (on Grok's box)
- `cd /workspace/vltest && node test.js` — full UI test of the local file at 390×844 (playwright-core + `/usr/bin/google-chrome`): add item with generated photo, listing text and limits for all 6 default sites, Etsy title/tags limits, posting-mode labels, one-tap "Post to Poshmark" (copies full listing, opens create page, downloads photos, checklist, "I published it" ⇒ Listed), "Queue for bot" toggle, copy, status + delist banner, reload persistence, filters/sort, CSV/JSON export/import, comps, Google button enabled but script not loaded until tapped, privacy/terms footer links, site on/off toggles. Screenshots to `/workspace/vintage-lister/screenshots/`.
- `node sync-test.js` — mocked Google sign-in + Drive REST (no real Google calls): sign-in, debounce, backup on hide, incremental photo skip, tombstone delete, restore merge cancel/accept, token expiry, 401 retry, sign out.
- `node layout.js` — header check at 320/360/390/412/768px, signed out and signed in: the account pill must not cover the title.
- `node live.js` — live site at mobile size: HTTP 200, title, no JS errors, service worker `ctc-v3` active, manifest, offline reload.
- `node inst.js` — Chrome installability check.
- **Last results (2026-10-21 ~6:05 PM CT):** test.js all pass; sync-test.js all pass; live check after push (see git log / Grok's report).

## Known limitations
- Data lives on one phone unless Google backup is on or she exports JSON. While the consent screen is in Testing, sign-in works only for listed test users and needs re-consent every 7 days.
- **No bot posting exists yet.** "Queue for bot" only records intent.
- Fees, limits and search URLs are estimates and change. Depop, Vinted, Etsy and FB search links can't filter to sold items by URL.
- Share sheet, camera, Google popup and "Post to" flow untested on a real phone (headless Chrome only). On Android the share sheet is used for photos; on desktop photos are downloaded.
- Big JSON exports are built in memory. Two devices editing one item: newer `updatedAt` wins for the whole item.

## Decisions so far (from Michael)
- Value comparison per site, suggested price, best payout: **done**.
- GitHub Pages hosting as an installable app: **done**.
- Google sign-in backup to **her own Drive** (`drive.appdata`): **live, consent screen in Testing**.
- Name **Hanger Hustle**; Android package `com.hangerhustle.app` (TWA in progress elsewhere); repo name unchanged.
- **Posting plan, decided 2026-10-21 ~5:54 PM CT — "start safer", maybe add more bot-posted sites later:**
  - Poshmark, Mercari, Vinted and eBay terms ban bots/automated tools on their websites. Depop's terms allow third-party crosslisting tools if the item is removed promptly once sold elsewhere. eBay and Etsy have official APIs.
  - **Bot posts via official API:** eBay (Sell Inventory API) and Etsy (Open API v3).
  - **Bot posts via allowed crosslisting:** Depop (through Depop's official Selling API, access by request to business@depop.com; not by driving the Depop website).
  - **She publishes (pre-filled, one tap):** Poshmark, Mercari, Vinted (plus FB Marketplace and Grailed when switched on).
  - This replaces the earlier idea of the bot driving signed-in browsers on every site.

## API findings for bot posting (researched 2026-10-21, nothing signed up)
- **eBay Sell / Inventory API**
  - Free eBay Developers Program account (developer.ebay.com) ⇒ create an app keyset (Sandbox + Production: App ID/client ID, Cert ID/client secret). Production keys require either a marketplace-account-deletion notification endpoint or an opt-out declaration.
  - OAuth 2.0 authorization-code flow with a RuName (redirect URL name); scopes `sell.inventory` and `sell.account` (plus `sell.fulfillment` to see sales). User access token ~2 hours; refresh token ~18 months. Refreshing needs the **client secret**, so a small **backend (or the bot's box) must hold the secret and refresh token**; it can't live in the public web app.
  - Her account needs business policies (payment, return, fulfillment) — opt into Business Policies — and an inventory location (`createInventoryLocation`).
  - Flow: upload/host photos (eBay picture URLs or `createImageFromUrl`/Media API) ⇒ `createOrReplaceInventoryItem` (SKU, condition, aspects, image URLs) ⇒ `createOffer` (marketplace EBAY_US, category id, price, policy ids, location) ⇒ `publishOffer` ⇒ listing id. Mark sold via `getOrders` (Fulfillment API) or notifications.
  - No app review for standard Sell APIs; default Inventory API call limits are far above her needs. No cost besides normal eBay selling fees.
- **Etsy Open API v3**
  - Register at developers.etsy.com with her Etsy account (or Michael's, then she authorizes). For your own shop, a **seller/personal app** is usually approved within minutes to ~2 weeks; commercial access only needed for tools used by many sellers. Get keystring (x-api-key) + shared secret.
  - OAuth 2.0 authorization code **with PKCE**; scopes `listings_w listings_r shops_r` (plus `transactions_r` for sales). Access token 1 hour, refresh token 90 days. PKCE means a pure browser flow is possible, but keeping the refresh token safe for a bot still points to the bot's box or a small backend.
  - Flow: `createDraftListing` (POST `/v3/application/shops/{shop_id}/listings`: quantity, title ≤140, description, price, `who_made=someone_else`, `when_made` e.g. `1970s` (20+ years for vintage), `taxonomy_id`, tags ≤13, shipping/processing profile / `readiness_state_id`) ⇒ `uploadListingImage` per photo ⇒ `updateListing state=active`. Each active listing costs the normal $0.20 fee.
  - Rate limit 10,000 requests/day, 10/second. No charge for the API.
- **Depop:** official Selling API by request (business@depop.com); no public signup.

## Other sites researched (not added as bot sites)
- **Facebook Marketplace:** no listing API for individuals; Meta terms ban automated access without written permission. Good for local vintage sales (no fee local). Added as an optional **she-publishes** site, off by default.
- **Grailed:** terms ban "applications, browser extensions, plugins, or third-party tools that interact with our Services without our prior written consent". Mostly menswear/streetwear. Added as optional she-publishes, off by default.
- **Whatnot:** has a Seller API (GraphQL) but it's in Developer Preview and **not accepting new applicants**; live-auction format. Not now.
- **Vestiaire Collective:** Seller API exists but only for professional sellers listing ~1,000 items/month; luxury/designer focus. Not a fit.
- **Shopify (own store):** full official Admin API, bots fully allowed, but monthly plan cost and she'd need to drive her own traffic. Possible later "home base" store.
- **ThredUp-style consignment:** you mail items in, they price them, low payouts, no seller listing. Not a fit for curated vintage.

## Open items
0. **Finish the domain move:** add `https://app.hangerhustle.com` to the OAuth client's JS origins; she backs up on the old address and restores on the new one.
1. **Publish the OAuth consent screen** (now Testing): use the privacy/terms URLs above; add her Google account as a test user meanwhile.
2. **Bot posting for eBay/Etsy/Depop:** Michael creates the eBay developer keyset and Etsy app (steps above); decide where the client secret and refresh tokens live (bot's box vs. small backend); email Depop for API access.
3. **Let the bot read new items:** `drive.appdata` is private to this OAuth client. Options: (a) bot runs the same web app signed in as her, (b) "export for bot" file, (c) small backend. Needs a decision.
4. Real-phone testing on her Android phone (camera, share sheet, "Post to" flow, install, Google popup), then iPhone.
5. Field-by-field conflict handling for two devices.

## Proposed roadmap to an "official app" (proposals only, each needs Michael's OK)
- **Proposal:** publish the PWA to Play Store as a TWA (`com.hangerhustle.app`, in progress).
- **Proposal:** React Native/Expo or Capacitor later if native camera/background sync is needed.
- **Proposal:** small backend for accounts, multi-device sync, bot job queue and safe storage of eBay/Etsy secrets and refresh tokens.
- **Proposal:** screen the name "Hanger Hustle" (trademarks, app stores, domains) before public launch; consider renaming the repo/URL then (keep storage names).
- **Proposal:** optional AI help for titles, tags and price suggestions, and automated comp gathering (cost and site rules need sign-off).
