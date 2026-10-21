# Closet to Cash: handoff notes

_Last updated: 2026-10-21 (Google Drive backup added, sw.js VERSION ctc-v2). Grok Bot keeps building here too and updates this file with every change._

## What it is and who it's for
- **Who:** Michael's wife sells a lot of vintage clothing. She mainly uses an **Android phone**, and it should work on iPhone too.
- **What it does:** she photographs a piece, enters the details, and the app writes copy-paste listing text for Poshmark, eBay, Depop, Vinted and Mercari. It tracks where each item is listed or sold and warns her to delist elsewhere once something sells. It also compares sold prices and fees per site.
- **Name:** "Closet to Cash" is a **placeholder**. It hasn't been checked for trademarks or name clashes yet. Change it in the `APP_NAME` setting.
- **Where it runs:** client-side only, with no backend and no accounts of its own. Items and photos live in the phone's browser storage (IndexedDB). Google sign-in is optional and backs up to her own Google Drive.

## Where it lives
- **Live site:** https://bottledhatecom-cmd.github.io/closet-to-cash/ (GitHub Pages, served from the root of `main`, HTTPS, no custom domain)
- **Repo:** https://github.com/bottledhatecom-cmd/closet-to-cash (public)
- **Grok's working copy:** `/workspace/vintage-lister/` on Grok's box. Tests are in `/workspace/vltest/`.

## Current features
- **Adding items:**
  - "Take photo" opens the camera; "From gallery" picks several photos.
  - Photos are shrunk in the browser to at most 1600px, JPEG quality 0.8. You can pick the cover photo.
  - Fields: brand, type, era, size on tag, measurements (pit-to-pit, length, waist, inseam), color, material, condition and flaws, style keywords, cost and asking price.
  - SKUs number themselves V-0001, V-0002 and so on.
- **Listing generator:** builds text from templates only, no AI.

  | Site | Title | Description |
  |---|---|---|
  | Poshmark | 80 chars | 1500 chars |
  | eBay | 80 chars | includes an "ITEM SPECIFICS" block |
  | Depop | headline only | at most 1000 chars and 5 hashtags |
  | Vinted | 100 chars (estimate) | 2000 chars (estimate) |
  | Mercari | 80 chars | 1000 chars |

  - Character counts update as she types.
  - Copy title, Copy description and Copy all buttons work, with a backup copy method when the clipboard is blocked.
  - "Open site" goes to each site's create-listing page. Her edits are saved, and "Regenerate" resets them.
- **Photos to the marketplace apps:** "Share photos" uses the phone's share sheet to send photo files. "Download photos" is the fallback.
- **Status per site:** Not listed / Listed / Sold, plus an optional listing URL.
  - When something is sold anywhere, a "Sold on X — Remove from: Y, Z" banner appears with a "Removed" button per site.
  - The inventory also shows a ribbon and an alert at the top.
- **Inventory view:**
  - Grid or list, search, filters (unlisted / listed / sold / needs delisting) and sorting by date or price.
  - Dashboard: items, listed, sold, revenue, profit (sale price minus cost, for sold items) and in stock.
- **Value comparison per site:**
  - Stores low, median and high sold price, number of comps, and optional fee overrides.
  - Fee defaults: eBay 13.6% + $0.40; Poshmark $2.95 under $15, 20% from $15; Mercari 10%; Depop 3.3% + $0.45 (0% seller fee in the US); Vinted 0%.
  - Shows payout at the asking price and at each site's median. "★ Best" is the highest payout at that site's median.
  - Suggested price is the average of the site medians weighted by comp count.
  - "Search sold comps" buttons open each site's sold or search page.
- **Backup and import:** CSV export (no photos), full JSON backup (photos as base64), JSON import that merges, and comps import by SKU.
- **Google sign-in backup (new 2026-10-21):** Google Identity Services token client, saving to her Drive's hidden app folder (`appDataFolder`).
  - Backs up automatically 10s after the last edit and when the app is hidden, and also with "Back up now".
  - "Restore from Google Drive" asks before doing anything and only adds; it never deletes.
  - Account chip in the header, sign out, last-backup time, and clear error messages.
  - **Not live yet:** `GOOGLE_CLIENT_ID` is empty, so the button shows "Google backup coming soon".
- **Installable app (PWA):** `manifest.webmanifest` (standalone, theme #7a3a26, 192 and 512 PNG icons) and `sw.js` (keeps a copy for offline use). Chrome reports it installable with no errors.

## Files
| File | What it is |
|---|---|
| `index.html` | The whole app: inline CSS and JS, no build step, no dependencies. Works opened as a local file too, but without PWA features or Google backup. |
| `sw.js` | Service worker. Loads the page from the network first and falls back to the saved copy; other files come from the saved copy first. Never stores Google or other sites' traffic. |
| `manifest.webmanifest`, `icon-180/192/512.png` | Manifest and icons for installing the app |
| `README.md` | Public description, including the note that all data stays on the user's device |
| `HANDOFF-FOR-CLAUDE.md` | This file |

## How it's built
- **Settings block** at the top of the script: `APP_NAME`, `SKU_PREFIX`, image sizes, `GOOGLE_CLIENT_ID`, `GOOGLE_SCOPES`, `AUTO_BACKUP_DELAY_MS`, `PLATFORMS` (names, create URLs, character limits), `FEE_DEFAULTS` and `COMP_SEARCH` URLs.
- **Routing:** hash routes `#/`, `#/add`, `#/edit/<id>`, `#/item/<id>` and `#/backup`. Each view rebuilds `#app` as an HTML string.
- **IndexedDB** (database `closet-to-cash-db`, version 1):
  - `items` (key `id`): `{id, sku, createdAt, updatedAt, brand, type, era, size, pit, length, waist, inseam, color, material, condition, flaws, keywords, cost, price, status:{poshmark|ebay|depop|vinted|mercari:{state:'none'|'listed'|'sold', url}}, soldPrice, soldAt, custom:{<site>:{title?,desc?}}, comps:{<site>:{...}}, compQuery, thumb (small data-URL image), photoCount}`
  - `photos` (key `id`, index `itemId`): `{id, itemId, idx, type, buf (ArrayBuffer), hash}`. Stored as an ArrayBuffer because that's the most reliable option on Safari.
  - `meta` (key `k`):
    - `sku`: counter
    - `tombstones`: `{itemId: deletedAt}`, so deletes reach Drive
    - `lastBackup`: details of the last backup
- **Comps JSON shape:**
  - For one item (paste box): `{"ebay":{"low":45,"median":78,"high":140,"count":22,"feePct":13.6,"feeFixed":0.4}, "poshmark":{...}, "mercari":{...}, "depop":{...}, "vinted":{...}}`
    - Every field is optional. `{"comps":{...}}` also works.
    - Unknown keys are ignored, and sites left out keep their current values.
  - Many items at once (Backup page): `{"V-0001": {<same shape>}, "V-0002": {...}}`
- **Drive sync design** (all in the browser, scope `openid email profile https://www.googleapis.com/auth/drive.appdata`):
  - **Files in `appDataFolder`:**
    - `closet-to-cash-inventory.json`: `{format:'closet-to-cash-drive', version:1, updatedAt, contentHash, skuCounter, items[] (no thumbnails), photos[] ({id,itemId,idx,hash,type}), tombstones{}}`
    - `photo-<photoId>.jpg`, one per photo, tagged with `{kind:'photo', photoId, itemId, hash}`
  - **Backup** (`planBackup`, a pure function):
    1. List the folder and read the cloud inventory.
    2. Merge item by item: the newest `updatedAt` wins, items only in the cloud are kept, and deleted items are dropped.
    3. Upload only photos whose id or hash isn't in the cloud yet.
    4. Delete cloud photos nothing refers to any more.
    5. Write the inventory, or skip it if `contentHash` hasn't changed.
    - Backup never changes the data on the phone. Uploads are multipart (`POST` or `PATCH /upload/drive/v3/files?uploadType=multipart`).
  - **Restore** (`planRestore` plus `restoreFromDrive`):
    - Matches items by id, then by SKU.
    - Shows a confirm box listing items to add, items to replace (cloud copy newer) and items kept (phone copy newer).
    - Downloads only photos the phone doesn't have, rebuilds thumbnails and raises the SKU counter.
    - Never deletes items that exist only on the phone. No backup can run while a restore is running.
  - **Tokens:**
    - The access token (about 1 hour) and profile are saved in localStorage under `ctc-google-auth`.
    - When it expires: a quiet re-request (`prompt:''`) is tried once while the app is on screen. If that fails, the status says to tap "Back up now", which asks again from the tap.
    - A 401 from Drive leads to one token refresh and a retry.
    - Sign out revokes the token and keeps local data.
  - **Auto backup:** `markDirty()` runs on every item or photo write. It waits `AUTO_BACKUP_DELAY_MS` (10s) after the last edit, and backs up right away on `visibilitychange` (hidden) or `pagehide`. It can be turned off on the Backup page.
- **Service worker VERSION rule:** **bump `VERSION` in `sw.js` (currently `ctc-v2`) every time `index.html` or any cached file changes.** The page itself loads network-first, so changes show up when online, but bumping is what clears the old saved copies.

## How to run the tests (on Grok's box)
- `cd /workspace/vltest && node test.js`
  - Full UI test of the local file at 390×844 in headless Chrome, using playwright-core and `/usr/bin/google-chrome`.
  - Checks: adding an item with a generated photo, listing text and limits, copying, status changes and the delist banner, keeping data after a reload, filters and sorting, CSV and JSON export and import, comps, and that the Google button is disabled while the ID is empty.
  - Saves screenshots to `/workspace/vintage-lister/screenshots/`.
- `node sync-test.js`
  - Serves the folder on localhost and fills in a test client ID.
  - Mocks Google sign-in and the Drive REST API; no real Google calls.
  - Checks: sign-in, waiting before auto backup, backup when the app is hidden, skipping unchanged photos, uploading only new photos, deleting via tombstones, restore merge with cancel and accept, an expired token, a 401 retry, and sign out.
- `node live.js`: checks the live site at a mobile size (HTTP 200, no JS errors, service worker active, manifest read, works offline).
- `node inst.js`: Chrome's installability check, using a normal browser profile.
- **Last results (2026-10-21):**
  - test.js: all pass.
  - sync-test.js: all 28 checks pass.
  - live site: loads with no JS errors (checked after this push).

## Known limitations
- Data lives in one browser on one phone unless Google backup is switched on (needs the OAuth client below) or she exports JSON by hand. Browsers can clear storage under space pressure.
- It **cannot post listings**. These marketplaces have no public listing APIs for individuals; eBay has a Sell API, but it needs a developer account, OAuth and a server.
- Fees, character limits and search URL formats are estimates and change. Depop and Vinted search links can't filter to sold items.
- Share and download, camera capture and Google sign-in have **not been tested on a real phone** yet; only headless Chrome.
- Very large JSON exports are built in memory and could strain an older phone.
- Two phones editing the same item: the newer `updatedAt` wins for the whole item; there is no merging field by field.

## Decisions so far (from Michael)
- Value comparison per site, plus suggested price and best payout: **done**.
- Hosted on GitHub Pages under his account, as an installable app: **done**.
- Google sign-in so she has a personal account and items and photos back up automatically to **her own Drive** (`drive.appdata`): **built, waiting for the OAuth client ID**.
- **Michael wants the bot to post listings to Poshmark, eBay, Depop, Vinted and Mercari for her, from a signed-in browser, so she never has to touch those sites.** Not built yet. It would run on the bot's box with her accounts signed in, read new items from the Drive backup, and fill in each site's listing form.

## Open items
1. **OAuth client setup (Cloud Console, Michael's Google account):**
   - Create the project, enable the Drive API, set up the consent screen and make a Web client ID.
   - Allowed JavaScript origin: `https://bottledhatecom-cmd.github.io`.
   - Paste the client ID into `GOOGLE_CLIENT_ID`, bump the `sw.js` VERSION and push.
   - `gcloud` is not installed or signed in on Grok's box, so none of this has been done.
2. **Let the bot read new items:**
   - `drive.appdata` is private to the OAuth client that wrote it. The bot can only read it with a token from the same client ID and her consent.
   - Options: (a) the bot runs the same web app in its own browser signed in as her, (b) an "export for bot" file, or (c) a small backend.
   - Needs a decision.
3. **Real-phone testing** on her Android phone, then on an iPhone: camera, share sheet, install, Google sign-in popup, backup over mobile data.
4. Field-by-field conflict handling if she uses two devices.

## Proposed roadmap to an "official app" (proposals only, each needs Michael's OK)
- **Proposal:** keep the PWA and publish to the Play Store as a Trusted Web Activity (Bubblewrap or PWABuilder). Cheapest route to a store listing, and it reuses this code.
- **Proposal:** rebuild in React Native or Expo, or Capacitor around the current UI, if native camera, background sync or offline-first storage becomes necessary.
- **Proposal:** add a small backend with real accounts, multi-device sync and the bot's job queue for posting listings. It would replace Drive `appDataFolder` as the sync layer, or sit alongside it.
- **Proposal:** use the eBay Sell API (Inventory and Offer) for real eBay posting. It needs an eBay developer account, OAuth and a server. The other sites would stay with browser automation, which carries terms-of-service risk on each site.
- **Proposal:** check the name ("Closet to Cash" is unscreened) for trademarks, app stores and domains before anything public goes out.
- **Proposal:** optional AI help for titles, keywords and price suggestions, and automated comp gathering. This would need sign-off on cost and each site's rules.
