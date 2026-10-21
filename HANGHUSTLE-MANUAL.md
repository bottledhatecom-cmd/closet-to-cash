# HangHustle Manual

The running log of everything done on **Hanger Hustle**, Michael's wife's vintage resale app. All times are US Central (CT). Last updated: **2026-10-21 6:22 PM CT**.

- Master copy: `/workspace/shared-library/manuals/HangHustle-Manual.md` (Grok's box, shared by all of Michael's bots)
- Repo copy: [`HANGHUSTLE-MANUAL.md`](https://github.com/bottledhatecom-cmd/closet-to-cash/blob/main/HANGHUSTLE-MANUAL.md)
- Deep technical notes (architecture, storage, sync, tests): [`HANDOFF-FOR-CLAUDE.md`](https://github.com/bottledhatecom-cmd/closet-to-cash/blob/main/HANDOFF-FOR-CLAUDE.md) (box copy `/workspace/shared-library/docs/closet-to-cash-HANDOFF-FOR-CLAUDE.md`)

---

## 1. What Hanger Hustle is and who it's for
- **For:** Michael's wife, who sells a lot of vintage clothing. She mainly uses an **Android phone**; it also works on iPhone and desktop.
- **What it does:** she photographs a piece and types the details once. The app then:
  - writes the listing for each marketplace (Poshmark, eBay, Depop, Vinted, Mercari, Etsy; optional Facebook Marketplace and Grailed), within each site's limits;
  - makes posting quick (one "Post to …" button: copies the listing, sends the photos, opens the site);
  - tracks where each item is listed or sold and tells her where to delist once it sells;
  - compares sold prices and fees per site and suggests a price;
  - backs up to her own Google Drive when she signs in with Google.
- **How it's built:** one web page (installable app / PWA), no server. Her items and photos stay on her phone, plus a hidden backup folder in her own Google Drive.
- **Android app:** the same web app wrapped as a Play Store app (Trusted Web Activity), package `com.hangerhustle.app`.

## 2. Links
| What | Link |
|---|---|
| Live app (new home, being set up) | https://app.hangerhustle.com/ |
| Live app (original, redirects once the domain is live) | https://bottledhatecom-cmd.github.io/closet-to-cash/ |
| Repo | https://github.com/bottledhatecom-cmd/closet-to-cash |
| Privacy policy | https://app.hangerhustle.com/privacy.html (was …github.io/closet-to-cash/privacy.html) |
| Terms of use | https://app.hangerhustle.com/terms.html (was …github.io/closet-to-cash/terms.html) |
| Landing page (future) | https://hangerhustle.com (bought 6:19 PM; not built or connected yet) |
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
| ~6:16 PM | Etsy account for her shop created and signed in on the box browser (Etsy shows username "[REDACTED]"), [REDACTED]; email + phone verified. |
| ~6:17 PM | Etsy developer app **"hanger-hustle"** registered: status Pending Personal Approval (details in section 4). |
| 6:17 PM | This manual started. Rule: every Hanger Hustle change gets logged here the same turn. |
| 6:19 PM | **Michael bought hangerhustle.com.** He wants a landing page there once there's enough to show; it grows with the app. DNS/hosting hookup needs his OK. |
| 6:19 PM | Michael approved moving the app to **app.hangerhustle.com** (bare hangerhustle.com reserved for the landing page). Registrar/DNS: **ChangeIP** (changeip.com). CNAME `app` → `bottledhatecom-cmd.github.io`. |
| ~6:21 PM | Fixed: on narrow phones (360px) the "Sign in" pill covered the title. The pill now sits on its own row under 520px wide. Service worker VERSION `ctc-v4`. `.well-known/assetlinks.json` added to the repo for the Android app. |

## 4. Accounts & setup
**No passwords or secrets are stored by any bot.** Michael and his wife hold all passwords. Only public IDs are written here.

| Service | Status | Details |
|---|---|---|
| GitHub | done | Account `bottledhatecom-cmd`; public repo `closet-to-cash`; Pages from `main` root. |
| Google Cloud | done | Project `closet-to-cash` under **bottledhate.com@gmail.com**. OAuth Web client ID (public, not a secret): `196912346158-dasm934sl5l3ggd6fgr409fei0bkho82.apps.googleusercontent.com`. Scopes: `openid email profile drive.appdata`. **Consent screen: Testing.** Test user: **[REDACTED]** (his wife). Authorized JavaScript origins: `https://bottledhatecom-cmd.github.io`, and **`https://app.hangerhustle.com` needs adding** for the domain move. |
| eBay Developers | started ~6:09 PM | Account with bottledhate.com@gmail.com; **pending the email verification link**. Next: create a keyset (sandbox + production), handle the account-deletion notification/opt-out, then RuName + OAuth. |
| Etsy (her shop) | account ~6:16 PM | Account [REDACTED], signed in on Grok's box browser (Etsy username shows "[REDACTED]"); email + phone verified. **She still needs to open an Etsy shop.** |
| Etsy developer app | registered ~6:17 PM | Name **hanger-hustle**; status **Pending Personal Approval**; keystring (public API key) `w652vgwg86fb34usxl7pfoga`; limits 5 requests/second, 5,000/day; app page https://www.etsy.com/developers/register/preview/1526349664115. Settings: Seller Tools + Mobile; just myself/colleagues; non-commercial; upload/edit listings + read sales data. **Shared secret not recorded** (Michael keeps it). Next: after approval, set the OAuth callback URL and connect her shop. |
| Depop | not started | Selling API by request: business@depop.com. |
| Domain | bought 6:19 PM | **hangerhustle.com** at **ChangeIP**. `app.hangerhustle.com` → GitHub Pages (CNAME). Bare domain reserved for a future landing page. |
| Google Play Console | not created | Uses Michael's personal developer account (same one as Sleevr). |

## 5. Android app
- **Folder:** `/workspace/closet-android/` on Grok's box. `README.md` there has full commands.
- **Config:** `app.config.json` is the single source of truth (name, package, host, colors, version). Now host `app.hangerhustle.com`, start `/`, versionCode 2 / 1.0.1.
- **Outputs (`dist/`):** `com.hangerhustle.app-<version>-release.aab` (Play upload) and `…-release-signed.apk` (sideload to her phone).
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
| Crosslist | $29.99–44.99/mo | API where a site has one, otherwise extension; no mobile app |

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

## 9. Open to-dos
1. **Domain move to app.hangerhustle.com:** CNAME at ChangeIP → GitHub Pages custom domain → HTTPS certificate → enforce HTTPS; add `https://app.hangerhustle.com` to the Google OAuth client's JavaScript origins; rebuild the Android app for the new host. **Her browser data does not follow the move:** before switching, she should back up (Google backup or JSON export on the old github.io address), then restore on app.hangerhustle.com.
2. **Landing page on hangerhustle.com:** build once there's enough content; it grows with the app. DNS/hosting hookup needs Michael's OK.
3. **Google consent screen:** keep her as test user; publish it (privacy/terms are live) when ready. In Testing, sign-in must be renewed every 7 days.
4. **eBay:** click the verification email; create keysets; decide where the secret and refresh token live.
5. **Etsy:** wait for personal-app approval; she opens her Etsy shop; set OAuth callback URL; connect the shop.
6. **Depop:** email business@depop.com for Selling API access.
7. **Build the bot posting** for eBay/Etsy/Depop (the app already has "Queue for bot"); decide how the bot reads new items (Drive appdata is private to the app).
8. **Play Console:** create the app, internal test, then closed test with 12 testers × 14 days; add Play's signing fingerprint to assetlinks.
9. **Real-phone testing** on her Android phone (camera, share sheet, Post flow, install, Google sign-in), then iPhone.
10. Back up the Android signing key offline.

## 10. How to update this manual
- Every bot that works on Hanger Hustle **adds a line to the decision log (section 3) in the same turn** as the change, with the CT time.
- When something changes, **replace the old instruction or status** in sections 2, 4, 5, 9 instead of leaving it stale (the log keeps the history).
- Keep the repo copy `HANGHUSTLE-MANUAL.md` identical to the master; commit it with the change (pull first).
- Never write passwords, shared secrets, tokens or keystore passwords here. Public IDs are fine.
- Technical detail goes in `HANDOFF-FOR-CLAUDE.md`; keep both current.
