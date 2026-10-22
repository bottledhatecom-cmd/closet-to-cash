> **Public copy, private details redacted.** Family emails and usernames are removed here. The full manual is on the box at /workspace/shared-library/manuals/HangHustle-Manual.md.

# HangHustle Manual

The running log of everything done on **Hanger Hustle**, Michael's wife's vintage resale app. All times are US Central (CT). Last updated: **2026-10-21 8:53 PM CT**.

- Master copy: `/workspace/shared-library/manuals/HangHustle-Manual.md` (Grok's box, shared by all of Michael's bots)
- Repo copy: [`HANGHUSTLE-MANUAL.md`](https://github.com/bottledhatecom-cmd/closet-to-cash/blob/main/HANGHUSTLE-MANUAL.md)
- Deep technical notes (architecture, storage, sync, tests): [`HANDOFF-FOR-CLAUDE.md`](https://github.com/bottledhatecom-cmd/closet-to-cash/blob/main/HANDOFF-FOR-CLAUDE.md) (box copy `/workspace/shared-library/docs/closet-to-cash-HANDOFF-FOR-CLAUDE.md`)

---

## 1. What Hanger Hustle is and who it's for
- **For:** Michael's wife, who sells a lot of vintage clothing. She mainly uses an **Android phone**; it also works on iPhone and desktop.
- **What it does:** she photographs a piece and types the details once. The app then:
  - writes the listing for each marketplace (Poshmark, eBay, Depop, Vinted, Mercari, Etsy; optional Facebook Marketplace and Grailed), within each site's limits;
  - makes posting quick (one "Post to …" button: copies the listing, sends the photos, opens the site);
  - keeps a closet per site plus All: she taps Not posted / Listed / Sold per site, and when it sells it lists where to delist;
  - compares sold prices and fees per site and suggests a price;
  - backs up to her own Google Drive when she signs in with Google.
- **How it's built:** one web page (installable app / PWA), no server. Her items and photos stay on her phone, plus a hidden backup folder in her own Google Drive.
- **Android app:** the same web app wrapped as a Play Store app (Trusted Web Activity), package `com.hangerhustle.app`.

## 2. Links
| What | Link |
|---|---|
| Live app | https://app.hangerhustle.com/ (HTTPS on, certificate issued 6:41 PM, expires 2027-01-19, GitHub renews it) |
| Old address (now redirects to the new one) | https://bottledhatecom-cmd.github.io/closet-to-cash/ |
| Repo | https://github.com/bottledhatecom-cmd/closet-to-cash |
| Privacy policy | https://app.hangerhustle.com/privacy.html (was …github.io/closet-to-cash/privacy.html) |
| Terms of use | https://app.hangerhustle.com/terms.html (was …github.io/closet-to-cash/terms.html) |
| Landing page | https://hangerhustle.com (live 7:07 PM 2026-10-21, HTTPS enforced; www redirects to it). Repo https://github.com/bottledhatecom-cmd/hangerhustle-site |
| Android APK download | https://github.com/bottledhatecom-cmd/hangerhustle-site/releases/download/v1.0.1/HangerHustle-1.0.1.apk (release v1.0.1) |
| Android asset links | https://app.hangerhustle.com/.well-known/assetlinks.json |
| Technical handoff | HANDOFF-FOR-CLAUDE.md (repo root) |

## 3. Decision log
Newest at the bottom. Every bot working on Hanger Hustle adds a line here in the same turn as the change.

| When (2026-10-21, CT) | Decision / event |
|---|---|
| 5:11 PM | App built: single-file web app at `/workspace/vintage-lister/index.html` (photos, item fields, auto SKU, listing generator for Poshmark/eBay/Depop/Vinted/Mercari, status tracking + delist warning, inventory + dashboard, CSV/JSON export/import). Working name "Closet to Cash". |
| 5:14 PM | Value comparison added per site: low/median/high sold, comp count, fees, net payout, best site, suggested price, "Search sold comps" buttons. |
| 5:33 PM | Hosted on GitHub Pages (repo `closet-to-cash`), installable app (manifest + service worker). |
| ~5:35 PM | Goal stated: Michael wants a bot to post listings for her so she rarely has to touch the marketplace sites. (Narrowed at 5:54, below.) |
| 5:40 PM | Google sign-in with automatic backup to her own Google Drive (hidden app folder, `drive.appdata` scope). |
| 5:41 PM | Claude handoff: Michael will also give the app to Claude to grow into an "official app" in his own codebase, while Grok keeps building here. `HANDOFF-FOR-CLAUDE.md` is kept current. |
| 5:45 PM | Name research: "Closet to Cash" judged **risky** for public use (crowded/used phrase). RackLister was the cleanest alternative screened (not chosen). |
| ~5:50 PM | Competitors reviewed: Vendoo, Crosslist, List Perfectly (see section 7). |
| 5:54 PM | **Safer posting plan chosen.** Bot posts to **eBay and Etsy via their official APIs** and to **Depop** (Depop allows crosslisting tools). **She publishes** on Poshmark, Mercari and Vinted (their terms ban bots), with everything pre-filled. Maybe more bot-posted sites later, with Michael's OK. Replaces "bot posts everywhere". |
| 5:54 PM | Etsy added to the app (140-char titles, 13 tags, 20+ years = vintage, fees). Wide research on other resale sites (section 8). FB Marketplace and Grailed added as optional "she publishes" sites, off by default. |
| 5:55 PM | Google OAuth client created in Cloud project `closet-to-cash`; client ID put in the app; privacy and terms pages added. |
| 6:00 PM | **Final name: "Hanger Hustle"** (two words, title case). Android package **`com.hangerhustle.app`**. Repo/URL stays `closet-to-cash` for now. |
| ~6:05 PM | Android TWA built in `/workspace/closet-android/` (signed .aab + .apk). Name screen for "Hanger Hustle": GO (section 6). |
| ~6:09 PM | eBay Developers account created (bottledhate.com@gmail.com), waiting on the email verification link. |
| ~6:16 PM | Etsy account for her shop created and signed in on the box browser with her Gmail (see private box manual); email + phone verified. |
| ~6:17 PM | Etsy developer app **"hanger-hustle"** registered: status Pending Personal Approval (details in section 4). |
| 6:17 PM | This manual started. Rule: every Hanger Hustle change gets logged here the same turn. |
| 6:19 PM | **Michael bought hangerhustle.com.** He wants a landing page there once there's enough to show; it grows with the app. DNS/hosting hookup needs his OK. |
| 6:19 PM | Michael approved moving the app to **app.hangerhustle.com** (bare hangerhustle.com reserved for the landing page). Registrar/DNS: **ChangeIP** (changeip.com). CNAME `app` → `bottledhatecom-cmd.github.io`. |
| ~6:21 PM | Fixed: on narrow phones (360px) the "Sign in" pill covered the title. The pill now sits on its own row under 520px wide. Service worker VERSION `ctc-v4`. `.well-known/assetlinks.json` added to the repo for the Android app. |
| ~6:22 PM | **App moved to app.hangerhustle.com:** repo `CNAME` file + GitHub Pages custom domain set; DNS check passed (CNAME found, HTTPS eligible). The old github.io address now redirects to the new one. HTTPS certificate requested from GitHub (Let's Encrypt), waiting for it before HTTPS can be enforced. |
| 6:24 PM | **Michael's idea, logged as the next planned feature (plan only):** AI drafts each item's listing description from photos and details, and when unsure (brand, size, material, era, flaws, measurements) shows quick tap-to-answer question cards instead of guessing. See section 9. |
| 6:25 PM | **Michael approved automatic price search** (first version): in-app "Find prices" and a box-side price scout using official APIs only. No scraping of Poshmark, Mercari, Vinted or eBay. |
| ~6:32 PM | Android app rebuilt for the new host: `com.hangerhustle.app` **1.0.1 (versionCode 2)**, start URL `https://app.hangerhustle.com/`. The 1.0.0 (github.io) build is obsolete. |
| 6:34 PM | **Field issue:** on Vinted she pasted the title "Maroon Skirt" and got "Pick no more than 100 characters for the title, Title contains too many symbol characters". The words were fine; the paste most likely carried hidden characters (or the whole title + description block, which the old Post button copied as one). |
| ~6:45 PM | **Fix for the Vinted paste issue (sw `ctc-v5`):** everything the app copies or shares is cleaned first: hidden zero-width characters, soft hyphens, direction marks and other invisible characters removed; odd spaces made normal; smart quotes/dashes made plain; repeated spaces and punctuation squashed; emoji dropped from titles. Titles are cut to each site's limit (Vinted 100, eBay 80, Poshmark 80, Mercari 80, Etsy 140, Grailed 60, FB 100; Depop has no title, its description's first line is the headline). Title and description are now copied **separately** as plain text: "Post to" copies only the title, then a "Copy description" button; every site card has visible **Copy title** / **Copy description** buttons. The counter shows the cleaned length and says "cleaned" when something will be removed. "Copy all" removed. |
| ~6:45 PM | **Price search v1 shipped (sw `ctc-v5`):** each item has a **Find prices** button: a smart search (brand + type + era + material, size for jeans/shoes) she can edit, one-tap links to each site's **sold** results where the site has them (eBay, Poshmark, Mercari, Grailed) or regular search marked "asking prices" (Depop, Vinted, Etsy, FB); a quick panel to jot low / typical / high / how many per site; a **Suggested price** (list price per site and overall, adjusted for condition, with plain-language reasons, a take-home goal and a "Use as my price" button). Every price row is labelled Sold or Asking, where it came from, and the date. Box-side **price scout** added (`price-scout/`): eBay Browse API (asking prices) turns on when the eBay keys exist; Etsy stub waits for approval. |
| 6:41 PM | HTTPS certificate issued for app.hangerhustle.com (GitHub had to be nudged by removing and re-adding the custom domain); **Enforce HTTPS turned on**. Verified: app, privacy, terms and `/.well-known/assetlinks.json` all load over HTTPS; Google's asset-links checker sees `com.hangerhustle.app`; service worker, offline, install check and no JS errors all pass on the new address. Old github.io links redirect to https://app.hangerhustle.com/. |
| 6:44 PM | Android 1.0.1 (versionCode 2) rebuilt straight from https://app.hangerhustle.com (final build in `dist/`). |
| 6:44 PM | **Michael: Google sign-in must always let her pick the account** (for people with several Gmail accounts). |
| ~6:50 PM | **Account chooser + Switch account (sw `ctc-v6`):** every sign-in she taps opens Google's account chooser (plus the consent screen only the first time on a device, or if she unticked Drive access). Quiet token renewals stay on the account she already picked, and if Google ever answers with a different account the app refuses it and stays on hers, never switching on its own. Settings shows **"Signed in as <email>"** in large type and a new **Switch account** button: it first warns that each Google account has its own backup and that her items stay on the phone (and that they'll also back up to the new account), then opens the chooser. Closing the chooser keeps her on the old account. |
| 7:07 PM | **Landing page live at https://hangerhustle.com** (go-live approved 6:46 PM, no preview). www.hangerhustle.com redirects to the apex. Repo **`bottledhatecom-cmd/hangerhustle-site`** (public; plain `index.html` + `style.css` + optimized images, GitHub Pages from `main` root, `CNAME` = `hangerhustle.com`, `.nojekyll`). Sections: hero with "Open the app" + "Android download", features, how it works (3 steps), supported sites, coming soon (eBay/Etsy direct posting, AI-drafted descriptions, Google Play), FAQ (APK + iPhone install), footer with privacy/terms, non-affiliation line, "© 2026 Hanger Hustle". Android download = release **v1.0.1** asset `HangerHustle-1.0.1.apk` (1.0.1 build 2, 1,054,482 bytes, Android 7.0+): https://github.com/bottledhatecom-cmd/hangerhustle-site/releases/download/v1.0.1/HangerHustle-1.0.1.apk. **DNS at ChangeIP:** apex A ×4 → 185.199.108.153 / .109 / .110 / .111; `www` CNAME → `bottledhatecom-cmd.github.io`; `app` CNAME → `bottledhatecom-cmd.github.io`. HTTPS: certificate request had to be nudged again (remove + re-add custom domain, ~6:55 PM); Let's Encrypt cert for hangerhustle.com + www (expires 2027-01-19), **Enforce HTTPS on 7:06 PM**. **Rule: the page grows as the app grows**: only list features that exist, keep planned ones under "Coming soon", update the APK link/version/size with each Android release. |
| 7:15 PM | **Field bug (her Samsung Android, Chrome):** tapping "Post to Poshmark" (and every she-publishes site) opened Android's generic share sheet ("3 images": contacts, Messages, WhatsApp, Gmail, Facebook…). Poshmark wasn't in it, so she was stuck. |
| ~7:30 PM | **Fix: one-tap Post to <site> without the share sheet (sw `ctc-v7`).** One tap now (1) saves the item's photos to the phone as separate files, metadata stripped (EXIF/GPS removed, no re-encode) and numbered `HH-V-0001-1.jpg`, `-2`…, using staggered downloads; (2) copies the title as clean plain text (same sanitizer + per-site limits; Depop copies the description); (3) opens the site's sell page in a new tab (on Android the https link opens the marketplace app if it's installed); (4) shows a step card: "Photos saved to your Gallery/Downloads, title copied. In Poshmark: add photos from Downloads, paste title, then tap Copy description." Copy title / Copy description stay. **Share photos…** is now a secondary button (card + gallery). **First time on an Android phone only:** Chrome may ask **"Download multiple files?"**: tap **Allow** once, then tap **Open <site>** on the card; after that it's one tap. If she tapped Block by mistake: Chrome ⋮ → Settings → Site settings → Automatic downloads → allow app.hangerhustle.com. **iPhone:** Safari can't save many files at once, so the photo step stays the share sheet (tap **Save Images**), then she taps **Open <site>** on the card. eBay's link changed to the real "List an item" page (`/sl/prelist/suggest`). No intent:// links (the https links already hand off to the apps). Tests: new `post-test.js` (mocked downloads, window.open and share) + all old harnesses pass. Not yet checked on her real phone. |
| 7:45 PM | **Approved: links from the app back to the website.** She couldn't find her way from the app to the landing page (her Chrome address bar cut off the "app." part). |
| ~7:50 PM | **Website links in the app (sw `ctc-v8`).** Settings now ends with an **About** block: a big **"Hanger Hustle website"** button (https://hangerhustle.com/), **Android app download** (https://hangerhustle.com/#install-apk) and **Help & FAQ** (https://hangerhustle.com/#faq); both anchors checked on the live landing page. The footer reads Privacy · Terms · Website. On the Inventory screen a small **ⓘ** next to "Hanger Hustle" opens a little panel (website, Help, Close); tapping the title itself does nothing, so she can't leave the inventory by accident (chosen over long-press, which phones use for text selection and nobody discovers). In the installed app the links open in the same window; in a normal browser tab they open a new tab. Tests: new `sitelink-test.js` + all harnesses pass. |
| 7:57 PM | **Approved: bigger, readable text.** The text in the app was too small to read on her Android phone. |
| ~8:07 PM | **Readable text on phones (sw `ctc-v9`, commit 4772c98).** All text sizes now use `rem` (1rem = the phone's normal text size, 16px), so nothing is set in tiny pixels any more. Normal text and every button: **16px**. Field labels (Brand, Size on tag…): **15px**. Hints, notes, counters, the footer, table text, the Sign-in pill and the bottom-bar labels (Inventory / Settings): **14px**. Smallest things (SKU numbers like V-0001, the PM/eB/Dp badges on cards, COVER, Sold/Asking labels, "Bot posts" badges): **13px** (some were 10px before). Every button, chip, the Not listed/Listed/Sold switch and the header **ⓘ** is at least **44px** tall for easy tapping. Grey hint text is darker (`#665548`, at least 5.7:1 contrast, above the WCAG AA 4.5:1 minimum). On narrow phones (380px or less) photos show 2 per row so the ✕ and ★ buttons don't overlap, and the price table wraps instead of running off the side. Pinch-zoom still works (nothing in the page blocks it), and her phone's own font-size setting still applies. Checked at 320/360/768px: nothing overflows or gets cut off. Tests: new `fontsize-test.js` + all harnesses pass, live checked. Undo: `git revert 4772c98`. |
| 8:27 PM | **Strategy Page written (HH-Strategy, research only, nothing in the app changed):** [Hanger Hustle strategy](https://cursor.com/canvas/store-66940967-4ce6-4e73-ad1e-2befa113c2a7/9ce848c8-f8ea-4b8e-bd68-2e9c3083c498). Competitor prices re-checked on their own pricing pages (Vendoo, List Perfectly, Crosslist, Flyp, PrimeLister, Nifty, OneShop, Listelf), where we win, a free + Plus plan that never costs Michael money (AI and API posting paid-only, capped), ranked feature ideas, risks, next 3 steps. |
| 8:00 PM | **Approved: one-tap Copy button per field** (build + deploy), so she can copy, switch to the site, paste, come back and copy the next field. |
| ~8:36 PM | **Copy fields one by one (sw `ctc-v10`, commit 1e93fe5).** Every site card on an item now has a **📋 Copy fields one by one** panel: one big **Copy** button per field (title, description, price, brand, size, condition, color, category, tags), listed **in that site's own sell-form order** (table in section 8), numbered 1, 2, 3…. Fields a site's form doesn't have are left out and named in a note (e.g. Depop has no title: the description's first line is the headline; Vinted and eBay have no tags; Etsy has no brand/condition field). Everything copied is cleaned plain text: hidden characters, odd spaces, smart quotes and emoji removed from short fields, whitespace trimmed; titles cut at a whole word to each site's limit (Vinted 100, eBay 80, Poshmark 80, Mercari 80, Etsy 140, Grailed 60, FB 100); **price is a plain number** (89 or 89.50, no $ or comma); condition uses each site's own words (e.g. Vinted "Very good", Mercari "Like New", eBay "Pre-owned - Excellent", Grailed "Gently Used"); tags fit each site (Poshmark 3 style tags, Etsy up to 13 × 20 characters, Grailed up to 10). After a tap the button turns green **"✓ Copied!"**, a message says "Copied! Brand for Poshmark — now paste it there", the row stays marked **✓ Copied** and the header counts "3 of 9 copied". Marks are per item and site and last for this session (a **Clear copied marks** button resets them). **Post to <site>** still works as before, and now also marks the title (Depop: description) as copied and opens the panel for the rest; the old Copy title / Copy description buttons mark their rows too. Edits she makes in "Edit text" are what gets copied. Copying uses the phone's clipboard API, falls back to the older copy method on old Android WebViews, and if both are blocked it shows the text selected in a box so she can long-press → Copy. Big and readable: 16px text and buttons, 44px+ buttons, works at 320/360px, AA contrast. Tests: new `copyfields-test.js` (52 checks, mocked clipboard) + all harnesses pass, local and live. Not yet checked on her real phone. Undo: `git revert 1e93fe5` and bump the sw version. |
| 8:03 PM | **Queued: closets:** a closet per selling site plus All, with a per-site Not posted / Listed / Sold status for each item; approved to build at 8:33 PM. |
| ~8:49 PM | **Closets (sw `ctc-v11`, commit 5a97ec0).** The Inventory screen now has **closet tabs** under the totals: **All** plus one per site she uses (Poshmark, eBay, Depop, Vinted, Mercari, Etsy by default; FB Marketplace and Grailed when switched on in Settings, or as soon as any item has a status there). Each tab shows a count (All = items, a site = items listed there), e.g. "Poshmark 3". **Inside a site closet** every item is one big card with three tap buttons, **Not posted / Listed / Sold** (52px tall, 16px text); one tap saves it and the counts update. Status filter chips with counts: All, Not posted (not on this site and not sold anywhere), Listed, Sold, ⚠ Delist here. The **All** closet keeps the old cards and filters (Not posted, Listed, Sold, ⚠ Needs delisting) with counts. Sort: newest, oldest, price high → low, low → high, and new **title A–Z**. Search works inside any closet. The app remembers the last closet she used. **Sold! Delist it here:** marking an item Sold on one site while it's still Listed elsewhere pops up a checklist of those sites (with **Open listing ↗** when she saved the listing link and **✓ Removed from <site>** buttons). It's a reminder only; the app never removes anything on the sites. The item page shows the same "Sold! Delist it here" banner and now also says Not posted / Listed / Sold. **Post to <site>:** nothing is marked by itself; when she comes back to the app after posting, a bar asks **"Did you post it on Vinted?" — ✓ Yes, mark Listed / Not yet**; the step card's "I published it — mark Listed on <site>" button stays. **Data:** statuses were already saved per item and site, and they're in the Google Drive backup and the JSON backup; a one-time **migration** on start (and on every JSON import and Drive restore) fills in every site, maps old values, and never changes the "last edited" time, so old backups still restore. Tests: new `closets-test.js` (55 checks) + all harnesses pass, local and live. Not yet checked on her real phone. Undo: `git revert 5a97ec0` and bump the sw version. |

## 4. Accounts & setup
**No passwords or secrets are stored by any bot.** Michael and his wife hold all passwords. Only public IDs are written here.

| Service | Status | Details |
|---|---|---|
| GitHub | done | Account `bottledhatecom-cmd`; public repo `closet-to-cash`; Pages from `main` root. |
| Google Cloud | done | Project `closet-to-cash` under **bottledhate.com@gmail.com**. OAuth Web client ID (public, not a secret): `196912346158-dasm934sl5l3ggd6fgr409fei0bkho82.apps.googleusercontent.com`. Scopes: `openid email profile drive.appdata`. **Consent screen: Testing.** Test user: **her Gmail (see private box manual)** (his wife). Authorized JavaScript origins: `https://bottledhatecom-cmd.github.io`, and **`https://app.hangerhustle.com` needs adding** for the domain move. |
| eBay Developers | started ~6:09 PM | Account with bottledhate.com@gmail.com; **pending the email verification link**. Next: create a keyset (sandbox + production), handle the account-deletion notification/opt-out, then RuName + OAuth. |
| Etsy (her shop) | account ~6:16 PM | Account her Gmail (see private box manual), signed in on Grok's box browser; email + phone verified. **She still needs to open an Etsy shop.** |
| Etsy developer app | registered ~6:17 PM | Name **hanger-hustle**; status **Pending Personal Approval**; keystring (public API key) `w652vgwg86fb34usxl7pfoga`; limits 5 requests/second, 5,000/day; app page https://www.etsy.com/developers/register/preview/1526349664115. Settings: Seller Tools + Mobile; just myself/colleagues; non-commercial; upload/edit listings + read sales data. **Shared secret not recorded** (Michael keeps it). Next: after approval, set the OAuth callback URL and connect her shop. |
| Depop | not started | Selling API by request: business@depop.com. |
| Domain | bought 6:19 PM | **hangerhustle.com** at **ChangeIP**. `app.hangerhustle.com` → GitHub Pages (CNAME). Bare domain reserved for a future landing page. |
| Google Play Console | not created | Uses Michael's personal developer account (same one as Sleevr). |

## 5. Android app
- **Folder:** `/workspace/closet-android/` on Grok's box. `README.md` there has full commands.
- **Config:** `app.config.json` is the single source of truth (name, package, host, colors, version). Now host `app.hangerhustle.com`, start `/`, versionCode 2 / 1.0.1.
- **Outputs (`dist/`):** current build **`com.hangerhustle.app-1.0.1-2-release.aab`** (Play upload) and **`com.hangerhustle.app-1.0.1-2-release-signed.apk`** (sideload to her phone). The 1.0.0-1 files point at the old github.io address; don't use them.
- **Signing key:** `keys/hangerhustle-upload.jks` + `keys/keystore-password.txt`. **Back both up offline / in a password manager. Never share them, never commit them.** Used only for this app.
- **Scripts:** `scripts/build.sh` (rebuild .aab/.apk + assetlinks), `scripts/rename.sh "Name" com.pkg.id` (rename + rebuild), `scripts/make_assetlinks.py <PLAY_SHA256>` (add Play's signing fingerprint after first upload).
- **Asset links (removes the browser bar in the app):** the file must sit at the domain root. With the move to app.hangerhustle.com it lives in the repo at `.well-known/assetlinks.json` → `https://app.hangerhustle.com/.well-known/assetlinks.json`. After the first Play upload, add Play's app-signing SHA-256 and republish.
- **Play checklist** (`store-listing/04-play-checklist.md`): personal account ⇒ **closed test with at least 12 testers opted in for 14 days in a row** before applying for production; device verification; target API 36; store listing text, icon, feature graphic and screenshots are drafted in `store-listing/`; data safety + content rating drafts; testers need to be Google OAuth test users while the consent screen is in Testing.

## 6. Name screen (summary)
- **"Closet to Cash":** risky (common phrase, used by others). Dropped.
- **"Hanger Hustle": GO** (informal, not legal advice; full table in `/workspace/closet-android/NAME-SCREEN.md`). No US trademark live or pending; no app with this name on Google Play or the App Store; domains were free (hangerhustle.com now bought). Small conflicts: reseller handles @hangerhustle on TikTok, Poshmark and Whatnot are taken, so use @hangerhustleapp or @gethangerhustle. Nearest app: "Hangar: Reseller Inventory" (UK, different word). Optional USPTO filing later ≈ $350 per class.

## 7. Competitors and where we win
| Tool | Price (Sep–Oct 2026) | How it posts |
|---|---|---|
| Vendoo | $14.99–59.99/mo | Chrome extension fills forms in your browser; eBay/Etsy via authorized tokens; mobile apps |
| List Perfectly | $29–99+/mo | Extension fills forms, you click Post; mobile app only on top plan |
| Crosslist | $29.99–44.99/mo | API where a site has one, otherwise extension; **mobile app launched in 2026** (this table said "no mobile app" until 2026-10-21; corrected after the HH-Strategy re-check) |

Sources: underpricedai.com/blog/best-cross-listing-apps, vylist.ai/crosslisting-app-pricing, crosslist.com/blog/vendoo-vs-list-perfectly.

**Where Hanger Hustle wins:**
- **Free**, no subscription, no listing caps.
- **Phone-first**, works offline, photos taken and shrunk on the phone.
- **Built for vintage:** era, measurements, flaws, Etsy 20-year rule, vintage-style keywords and tags.
- **Value comparison built in:** net payout per site after fees, best site, suggested price (competitors mostly don't price).
- **Private:** data stays on her phone and her own Drive.
- **Rule-safe:** only uses bots where a site allows it (official APIs, Depop crosslisting); she publishes elsewhere, so no account-ban risk.
- Where they win today: real auto-posting/auto-delisting across many sites, bulk tools, multi-user. We're behind until the eBay/Etsy/Depop bot is built.

## 8. Marketplace rules and API findings (researched 2026-10-21)
| Site | Bots allowed? | Official API | Our mode |
|---|---|---|---|
| eBay | Website bots banned | **Yes**, Sell/Inventory API (free developer program; OAuth; refresh token ~18 months; needs client secret ⇒ bot box or small backend; business policies + inventory location) | Bot posts (API) |
| Etsy | Website bots banned | **Yes**, Open API v3 (OAuth with PKCE; listings_w scope; draft listing → photos → activate; $0.20/listing) | Bot posts (API) |
| Depop | Terms allow crosslisting tools if sold items are removed promptly | Selling API by request (business@depop.com) | Bot posts (crosslisting) |
| Poshmark | Banned ("unauthorized programs or other forms of automation") | No | She publishes |
| Mercari | Banned | No | She publishes |
| Vinted | Banned | No | She publishes |
| FB Marketplace | Banned without Meta's written permission | No (not for individuals) | She publishes (optional, off) |
| Grailed | Banned: no "third-party tools … without our prior written consent" | No | She publishes (optional, off) |
| Whatnot | — | Seller API in preview, **not accepting new applicants** | Not added |
| Vestiaire | — | Seller API only for ~1,000 listings/month pros | Not added |
| Shopify | Allowed (your own store) | Full Admin API | Possible future home store |
| ThredUp-style | — | Consignment, no seller listings | Not a fit |

Sources: grailed.com/about/terms; facebook.com/legal/automated_data_collection_terms; developers.whatnot.com; Vestiaire Help Center "Professional seller: Listing Solutions"; help.etsy.com "How to Use Etsy's API"; developers.etsy.com; eBay developer docs.

### Sell-form field order (checked 2026-10-21 ~8:30 PM CT; used by "Copy fields one by one")
Sources: Depop Help Centre "How to list an item", Grailed "How to Sell" guide, Mercari Help "Creating a listing"; the others from each site's current listing form as known. Not checked inside a signed-in form; sites change these, so if she says the order is off, update `SELL_FORM` in index.html.
| Site | Order in the app (fields the site's form lacks are left out) |
|---|---|
| Poshmark | Title, Description, Category, Size, Condition (New With Tags), Brand, Color, Style tags (3), Listing price |
| Mercari | Title, Description, Category, Brand, Condition, Size, Color, Tags, Price |
| Vinted | Title, Description, Category, Brand, Size, Condition, Color, Price (no tags) |
| Depop | Description (headline + hashtags), Category, Brand, Condition, Size, Color, Price (no title, no tags field) |
| eBay | Title, Category, Brand, Size, Color (item specifics), Condition, Description, Price (no tags) |
| Etsy | Title, Category, Description, Price, Primary color, Size, Tags (13) (no brand/condition field) |
| FB Marketplace | Title, Price, Category, Condition, Description, Brand, Color, Size, Product tags |
| Grailed | Category, Designer, Size, Item name, Color, Condition, Description, Tags (10), Price |

### Sell-page links (checked 2026-10-21 ~7:20 PM CT, signed out, Android Chrome user agent)
What "Post to <site>" opens. A redirect to log in is expected when signed out; signed in (or in the app) they land on the listing form.
| Site | Link | Check |
|---|---|---|
| Poshmark | https://poshmark.com/create-listing | 302 → login?pmrd[url]=/create-listing (keeps the target) |
| Mercari | https://www.mercari.com/sell/ | curl 403 (Cloudflare); real Chrome → /login/?login_callback=/sell/ |
| Vinted | https://www.vinted.com/items/new | 307 → signup with ref_url=/items/new |
| Depop | https://www.depop.com/products/create/ | curl 403; real Chrome → /login/?redirect=/products/create/ |
| eBay | https://www.ebay.com/sl/prelist/suggest | 200 "List an item \| eBay" (Start your listing). Was /sl/sell, which is only the "Selling" landing page |
| Etsy | https://www.etsy.com/your/shops/me/listing-editor/create | 302 → signin from_page=/your/shops/me/listing-editor/create |
| FB Marketplace | https://www.facebook.com/marketplace/create/item | 302 → m.facebook.com/marketplace/create/item |
| Grailed | https://www.grailed.com/sell | 302 → /users/sign_up (no return link kept; /sell/new does the same). After signing in, tap Sell |

### Price-search links (checked 2026-10-21 ~6:30 PM CT)
These are links she taps herself; the app and the scout never load these sites.
| Site | Link opens | How checked |
|---|---|---|
| eBay | **Sold** (`LH_Sold=1&LH_Complete=1`, newest first `_sop=13`; eBay keeps ~90 days) | Current 2026 guides; eBay blocks plain fetches (403) |
| Poshmark | **Sold** (`availability=sold_out`) | Fetched once: page returned sold listings |
| Mercari | **Sold** (`status=sold_out`) | Current US search-parameter docs; Cloudflare blocks plain fetches |
| Grailed | **Sold** (`/sold?query=`) | Grailed asks for a login before showing sold results |
| Depop | Regular search = asking prices | No public sold filter (sold search only for boosted sellers) |
| Vinted | Regular search = asking prices | Vinted hides sold items and prices |
| Etsy | Regular search = asking prices | Etsy has no sold-item search |
| FB Marketplace | Regular search = asking prices | — |

**Etsy API key rule (2026):** every Etsy v3 request needs `x-api-key: <keystring>:<shared secret>` (keystring alone no longer works). We still need the shared secret once the app is approved.

## 9. Open to-dos
0c. **Check closets on her Samsung:** Inventory → tap the Poshmark tab → tap Listed on an item, then Sold → the "Sold! Delist it here" list should name the other sites where it's Listed; post an item with Post to Vinted, come back to the app and answer "Did you post it on Vinted?".
0b. **Check Copy fields one by one on her Samsung:** on an item, open a she-publishes site (e.g. Vinted), open **Copy fields one by one**, tap Copy on Title → switch to Vinted → paste → come back → Copy Description, and so on; confirm each paste is clean (no odd symbols), the row shows ✓ Copied, and the price pastes as a plain number.
0. **Check the new Post flow on her Samsung:** tap Post to Poshmark on an item with 3+ photos; answer Chrome's one-time "Download multiple files?" with Allow; confirm the photos show in Gallery (Download album) and in Poshmark's photo picker, and that the Poshmark link opens the Poshmark app.
1. **Finish the domain move to app.hangerhustle.com:**
   - ~~HTTPS certificate + Enforce HTTPS~~ done 6:41 PM.
   - Add `https://app.hangerhustle.com` to the Google OAuth client's **Authorized JavaScript origins** (Cloud Console, project closet-to-cash).
   - **Her browser data does not follow the move** (each web address has its own storage). The old github.io address now redirects, so anything saved only there can't be opened directly any more. If she saved items before 6:22 PM: restore them from Google Drive backup on the new address if she had signed in, otherwise ask a bot to temporarily remove the custom domain so she can export a JSON backup first.
   - Install the new Android build (1.0.1) / re-install the home-screen app from the new address.
2. **Landing page on hangerhustle.com:** LIVE since 7:07 PM 2026-10-21 (repo `bottledhatecom-cmd/hangerhustle-site`). Keep it growing with the app: add features only once they exist, move items out of "Coming soon" when they ship, and update the Android download link/version/size (new release on the site repo) with every APK.
3. **Google consent screen:** keep her as test user; publish it (privacy/terms are live) when ready. In Testing, sign-in must be renewed every 7 days.
4. **eBay:** click the verification email; create keysets; decide where the secret and refresh token live. Once the production keyset exists, put the App ID / Cert ID on the box as `EBAY_CLIENT_ID` / `EBAY_CLIENT_SECRET` (never in the app) and the price scout starts filling eBay asking prices. Real **sold** prices by API need eBay's Marketplace Insights API (restricted; apply separately).
5. **Etsy:** wait for personal-app approval; she opens her Etsy shop; set OAuth callback URL; connect the shop. For the price scout also note the app's **shared secret** (`ETSY_API_KEY` + `ETSY_SHARED_SECRET` on the box).
6. **Depop:** email business@depop.com for Selling API access.
7. **Build the bot posting** for eBay/Etsy/Depop (the app already has "Queue for bot"); decide how the bot reads new items (Drive appdata is private to the app).
8. **Play Console:** create the app, internal test, then closed test with 12 testers × 14 days; add Play's signing fingerprint to assetlinks.
9. **Real-phone testing** on her Android phone (camera, share sheet, Post flow, install, Google sign-in), then iPhone.
10. Back up the Android signing key offline.
11. **Real-phone check of the Vinted paste fix:** have her paste a title from the app into Vinted again and confirm it's accepted.
12. **Next planned feature (plan only, not built): AI listing drafts with question cards** (Michael's idea, 2026-10-21 6:24 PM CT)
    - The AI drafts each item's listing description from her photos and the details she entered.
    - When it isn't sure about something (brand, size, material, era, flaws, measurements), it does **not** guess. It shows quick **tap-to-answer question cards** instead, e.g. "Is this tag a size M or L?" with tap choices plus "not sure" / type-your-own; "I see a mark near the hem, is that a flaw?" (yes / no / photo was dirty); "Pit-to-pit?" with a number pad.
    - Her answers fill the item fields, then the draft is regenerated per site (titles still go through the same sanitizer and limits).
    - Open questions for Michael before building: which AI service and who pays; photos leave the phone for the AI call (needs privacy-policy update and her OK); runs in the app vs. on the bot's box; keys never in the client (needs a small backend or the box).

## 10. How to update this manual
- Every bot that works on Hanger Hustle **adds a line to the decision log (section 3) in the same turn** as the change, with the CT time.
- When something changes, **replace the old instruction or status** in sections 2, 4, 5, 9 instead of leaving it stale (the log keeps the history).
- Keep the repo copy `HANGHUSTLE-MANUAL.md` identical to the master; commit it with the change (pull first).
- Never write passwords, shared secrets, tokens or keystore passwords here. Public IDs are fine.
- Technical detail goes in `HANDOFF-FOR-CLAUDE.md`; keep both current.
