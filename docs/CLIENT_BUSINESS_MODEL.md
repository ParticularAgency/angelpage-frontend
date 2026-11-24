# Angelpage — client business model

UK charity marketplace at [angelpage.co.uk](https://www.angelpage.co.uk). People and charity shops list pre-loved goods. Buyers pay by card. Most of each sale goes to a charity the seller chooses. The platform keeps a fee, holds the money until the order is safe, then pays out.

This note is for clients, partners, and charity teams. It describes the business, what is already in the product, and what is still to build (mobile app, installable web app, phone push).

**Status key**

| Mark | Meaning |
|------|---------|
| Live | Built in the current web product |
| Setup | Built, but needs accounts, keys, or legal copy before it works in production |
| Next | Not in the product yet. Included in the development plan below |

---

## 1. The offer in one line

Sell something you no longer need. Choose a UK charity. After a 10% platform fee, the rest can go entirely to that charity, or the seller can keep a share and still give the remainder.

Buyers shop pre-loved fashion, home, books, and electronics, and see which charity each listing supports.

---

## 2. Who it is for

| Audience | What they do on Angelpage |
|----------|---------------------------|
| Buyer | Browse, favourite, buy (including as a guest), track the order, message the seller, open a dispute |
| Individual seller | List items, pick a charity and a giving split, ship, see earnings |
| Charity or charity shop | Own storefront, staff logins, product import, payouts, blog, events, fundraising pages |
| Brand / CSR partner | List new or excess stock so sales support a chosen charity |
| Affiliate / inventory partner | Push catalogues in bulk or sync from their own shop |
| Angelpage team | Review listings, run orders and escrow, publish content, pay charities |

Public signup is for buyers, sellers, and charities. Admin accounts are created only by a Super Admin. There is no public admin registration.

---

## 3. How the money works

Figures below are what the software calculates today (`platformPolicy` and `profitSplit`).

1. Buyer pays the item price in GBP through Stripe. Card numbers are never stored on Angelpage.
2. Platform fee is **10%** of the sale price.
3. The remaining **90%** is the distributable amount.
4. By default the seller keeps **0%** of that 90%, so the charity receives **90% of the sale price**.
5. The seller can choose to keep part of the 90%. Example: a £100 item, seller keeps 20% of the distributable amount.

| | Amount |
|--|--------|
| Sale price | £100.00 |
| Platform fee (10%) | £10.00 |
| Left to split | £90.00 |
| Seller (20% of £90) | £18.00 |
| Charity | £72.00 |

Shipping is charged on top and is not part of the charity split. Fulfilment options on a listing:

- UK courier (ShipStation label)
- Personal delivery
- Buyer collects
- Local only

**Rules already in the product**

- Tangible goods only.
- Shipping countries: United Kingdom.
- Minimum listing price on bulk upload: £1.
- Funds sit in escrow for **14 days** after payment, then release automatically if there is no open dispute.
- Operations can release early, or hold a disputed order.
- Buyer can open a dispute. Operations marks it resolved.
- Guest checkout is allowed (name and email, no account).

**Say this to clients**

> Angelpage takes 10%. You choose how the other 90% is shared between you and your charity. If you give it all, the charity receives 90p in every pound. Shipping is separate. Your money is held for 14 days so the buyer can receive the item safely.

**Do not say this until the public pages are updated**

Some homepage and “how it works” text still says the buyer’s whole spend goes to charity, or that the buyer only pays shipping. That does not match the 10% fee in the product. Align that copy before a client launch. “Make an offer / counter-offer” is also written on the how-it-works page and is **not** built. Checkout is buy-now at the listed price.

**Still needs a decision before full launch**

Returns and refunds terms are not signed off. Until legal copy exists, refunds are handled in Stripe and the order is marked disputed or cancelled in admin. Do not release escrow until that decision is recorded.

---

## 4. What is already in the product

### Buy

- Home, search, category browse (Women, Men, Children, Clothing, Shoes, Bags, Accessories, Jewellery, Homeware, Books, Electronics, with subcategories).
- Filters, product pages, favourites, mini cart, stock limits.
- Stripe checkout and order confirmation.
- Guest checkout.
- Bought-items history.
- Product reviews (moderated in admin).
- Share a listing.

### Sell

- Account with email signup, show/hide password, and charity number on charity signup.
- Single listing with up to 10 photos, optional video, condition, brand, size, colour, material, weight, dimensions.
- Draft, submit for review, go live after approval, or remove.
- Promoted listings (admin can feature them on the site).
- Seller chooses the charity and the seller/charity split.
- Bulk listing from the website (CSV or Excel) or partner API, up to 50 products per request. Bulk create does not upload images; images are added on the listing afterwards.
- Sold orders, shipping label (ShipStation), shipped and delivered states.
- Earnings view and sales analytics (paid orders).

### Charity

- Charity profile, logo, address, payout/bank details.
- Public charity directory and a charity storefront.
- Staff accounts. Owner sees everything. Manager adds analytics. Staff can be limited to listings, sold orders, messages, notifications, and community.
- Product sync from the charity’s own shop: Shopify and WooCommerce (test connection, then import as drafts for review).
- Payouts panel.
- Blog and community events on the charity account.

### Trust, orders, and admin

Four admin panels:

| Panel | Can do |
|-------|--------|
| Super Admin | Everything, including team and audit |
| Operations | Orders, disputes, escrow release |
| Content | Listing review, product reviews, promoted items, charity import, affiliate import, gallery, social posting, blog, events |
| Finance | Revenue and charity payouts |

Also live: login activity, audit log, failed-payments table, listing review queue (Draft → Pending review → Live / Removed).

### Community and content

- Blog with categories (stories, impact, sustainability, fashion, community, guides, news). Charities can be allowed to publish.
- Events: general, fundraiser, live session. Cover image, dates, donation goal and amount raised, fund allocation, poll, optional livestream link. Can be featured on the home page. Event donations have their own checkout and receipt.
- Gallery: photos, documents, and short reels, tied to a product or charity, with a public reels feed.
- Social posting opt-in per listing or gallery item: Facebook, Instagram, TikTok (and X/Twitter on gallery). Posts can be scheduled. This needs Meta/TikTok tokens and Redis.

### AI (optional)

When a Gemini key is set, sellers and editors can:

- Read a product photo and draft a listing.
- Improve title and description.
- Write blog SEO.
- Suggest an event.
- Search in plain language.
- Search by photo.

If the key is not set, the rest of the marketplace still works.

### Partners and catalogues

- Partner bulk API: `POST /api/products/bulk` with a seller or charity login.
- Affiliate connections: point at an external product feed, map fields, import, then the buyer is sent to the partner to complete purchase (affiliate checkout) instead of Stripe.
- eBay affiliate import is a growth beta, not a finished channel.
- Planned, not built: partner webhooks when a product is approved or an order is paid, and batch image upload.

### Accounts and access

- Email and password.
- Password reset.
- Email verification.
- Google and Facebook login.
- Newsletter signup in the footer.
- CAPTCHA (Cloudflare Turnstile or hCaptcha) when keys are set.
- Delete account.

Password reset, verification email, newsletter, and social login are **Setup**: they need SendGrid on `angelpage.co.uk` and the OAuth apps configured.

---

## 5. Messaging (built)

Buyers and sellers (and charities) message each other inside the site. A conversation can be tied to a product, so both people see the item name, price, and photo.

**Live today**

- Inbox inside the user account and the charity account, and a full chat page.
- Real-time delivery (Socket.IO): new message, read receipts, “typing”.
- Unread / read state.
- A notification of type “new message” in the in-app notification centre, pushed over the same live connection while the person has the site open.
- Roles that can message: buyer accounts and charity accounts. Admin is not a chat participant.

**What messaging is for**

Questions before purchase, pickup arrangements, local delivery, and after-sale issues. It is not a payments channel. Money stays on Stripe and escrow.

**Next for messaging**

- Phone push when the app is closed (see section 7).
- Email digest of unread messages (the notification type exists; reliable email depends on SendGrid).
- Optional: attach a photo in chat, and let Operations join a thread when a dispute is open. Neither is built.

---

## 6. Notifications (built vs phone push)

### Live: in-app notification centre

While someone is on the site, these events create a notification and update the header bell over the live connection:

| Event | Who is told |
|-------|-------------|
| New message | Recipient |
| Item purchased | Seller |
| Item sold | Seller |
| Item shipped | Buyer and seller |
| Item delivered | Buyer |
| New product posted | Charity |
| Product assigned to a charity | Charity |
| Favourite marked | Seller |
| Escrow held / released / payment released | Relevant party |

Each person can open Notifications in their account and mark items read.

### Setup: email journeys

The same moments can start an email automation (Brevo, Customer.io, or a generic webhook):

- Signed up
- Order paid
- Order shipped
- Order delivered
- Escrow released
- Product approved
- Cart abandoned
- Seller has gone quiet

These send only after the email provider is connected. Day-to-day mail (reset password, order updates) uses SendGrid and needs the domain verified.

### Next: phone push

The privacy policy already mentions push if the person allows it. There is **no** push service in the app yet: no device token, no Apple/Google push, no Web Push subscription.

Phone push is part of the plan in section 8, not a feature you can turn on today.

---

## 7. Mobile, PWA, and push — honest status

| Channel | Status |
|---------|--------|
| Responsive website (phone browser) | Live. Layouts already adapt. This is how mobile users use Angelpage now. |
| Installable web app (PWA) | Next. No web app manifest or service worker in the frontend. |
| Web Push (Chrome, Edge, Android Chrome, desktop) | Next. Depends on the PWA service worker. |
| iOS / Android app in the stores | Next. No React Native, Flutter, or native project in either codebase. |
| Apple Push / Firebase (app closed) | Next. Comes with the native apps, or with Web Push on Android. |

iPhone limits matter for the plan: Web Push on iOS only works after the person installs the site to their home screen (iOS 16.4+). A store app is the reliable way to notify iPhone users who will not install a PWA.

---

## 8. Development plan

Phases are in the order a client launch should follow. Phase A is operations, not new features. Later phases assume Phase A is done.

### Phase A — Make the current site safe to show clients

Goal: the website you already have works with real email, real payments, and honest copy.

1. Verify SendGrid for `angelpage.co.uk` and send from `noreply@angelpage.co.uk`.
2. Set the public site URL, Stripe webhook, Shopify webhook secret, and eBay webhook token.
3. Turn on CAPTCHA and Google/Facebook login if those buttons stay on the page.
4. Connect Brevo or Customer.io if you want abandoned-cart and post-purchase emails.
5. Connect Meta and TikTok only if social auto-post stays in the demo.
6. Redis for scheduled posts and affiliate sync.
7. Replace “100% to charity” and “make an offer” copy with the 10% fee and buy-now.
8. Publish a returns policy, then wire refunds to that policy.
9. Confirm charity payout details and the finance report with the finance admin.

**Client result:** a UK website a buyer can trust, with email that actually arrives.

### Phase B — PWA and Web Push

Goal: “Add Angelpage to your home screen” and alerts when the browser is allowed to notify.

1. Web app manifest: name, purple brand icon (`#611192`), standalone display, start URL.
2. Service worker: app shell cache so the home, inbox, and account open offline with a clear “you are offline” state. Do not cache checkout or payment pages.
3. Install prompt on Android and desktop. On iPhone, a short “Share → Add to Home Screen” guide (iOS does not show an automatic install banner).
4. Web Push: VAPID keys on the server, subscribe endpoint, store the subscription on the user or charity.
5. Send push for the events that already exist: new message, purchased, shipped, delivered, escrow released, product approved.
6. Settings: push on/off per person, and a test notification.
7. iOS: push only after the PWA is installed. Say that in the settings screen.

**Client result:** a home-screen icon and phone alerts without an app-store release.

Suggested shape: one build after Phase A. No new marketplace features in this phase.

### Phase C — Native apps (iOS and Android)

Goal: store apps for buyers and sellers who live on their phone. Same API as the website. Do not fork the business rules.

Recommended approach: one shared app (React Native or Flutter) talking to the existing API.

**Version 1 (buyer + seller daily use)**

- Sign in, including Google and Apple (Apple requires Sign in with Apple if other social logins exist).
- Browse, search, product, favourites, cart, Stripe checkout (Apple Pay / Google Pay where Stripe supports them).
- List an item: camera, up to 10 photos, charity picker, split, submit for review.
- Orders: bought, sold, tracking, shipping status.
- Inbox: the same conversations, with push when a message arrives and the app is closed.
- Notification centre matching the website.
- Charity storefront browse and event donation.

**Version 1 leave on the website**

Admin panels, finance, bulk CSV, Shopify/Woo credentials, team permissions, blog editor, and gallery scheduling. Staff can keep using the desktop site. Putting admin in the app too early slows the store release.

**Push in the native app**

- Firebase Cloud Messaging for Android and iOS.
- Register the device token at login. Remove it on logout.
- Same event list as Web Push, so a person with both the PWA and the app is not double-messaged (one preference: “notify this device”).
- Deep link: a “shipped” push opens that order; a message push opens that chat.

**Client result:** App Store and Play Store listings aimed at donors and charity shoppers, with alerts that work on iPhone without a home-screen workaround.

### Phase D — Growth the product already points at

Do these after the client is trading, not before launch.

| Item | Why it is next |
|------|----------------|
| Make an offer / counter-offer | Described in marketing, not in the API |
| Returns flow in the account | Waiting on legal terms |
| Photo messages in chat | Support and dispute evidence |
| Partner webhooks (`product.approved`, `order.paid`) | So Shopify/eBay stock stays in step |
| Batch image upload on the bulk API | Partners currently create listings without photos |
| eBay affiliate as a real channel | Marked beta in operations |
| Richer seller analytics | Marked as design review, not a data gap |
| Offline draft listings in the PWA | Useful for charity shops photographing stock in-store |

---

## 9. Suggested client journey (what you demo)

**Buyer, 5 minutes**

1. Open the home page on a phone browser.
2. Search, open an item, show the charity and the amount that goes to them.
3. Guest checkout with a Stripe test card, or a saved account.
4. Open Bought, then message the seller about collection.
5. Show the bell: “purchased” on the seller side, “new message” on the buyer side.

**Charity, 5 minutes**

1. Charity login lands in the charity account.
2. Listings, product sync, storefront link.
3. Staff member who can message and manage listings but cannot see payouts.
4. An event with a donation goal.
5. Finance view only if the client’s finance lead is in the room (Finance admin).

**Do not demo until Phase A**

Password reset email, newsletter, “100% to charity”, make-an-offer, TikTok auto-post, and phone push.

---

## 10. Messages you can use

**For buyers**

> Buy pre-loved. The seller chooses a UK charity, and most of the sale goes to them. You pay by card. The money is held until the order is complete.

**For sellers and donors**

> List in minutes. Pick the charity. Choose how much of the sale you keep after Angelpage’s 10% fee. We hold the payment for 14 days, then release it.

**For charity shops**

> Your own storefront, your team logins, and a way to pull products from Shopify or WooCommerce. Supporters can also list into your shop from home.

**For brands**

> Move excess stock through Angelpage and send the charity share to a cause you name. Useful for CSR without building a shop.

**For the mobile story (only after Phase B or C)**

> Add Angelpage to your phone. We will tell you when a buyer messages you, when an item ships, and when funds are released.

**Words to keep**

Pre-loved. Chosen charity. Most of the sale. Held for 14 days. UK delivery or collection. Your storefront.

**Words to retire until the product matches**

“100% of what you spend.” “You only pay shipping.” “Make an offer.” “Push notifications” (until Phase B ships). “Download the app” (until Phase C ships).

---

## 11. What each client type gets on day one

| | Website now | After Phase A | After Phase B | After Phase C |
|--|-------------|---------------|---------------|---------------|
| Buyer shops and pays | Yes | Yes, with real emails | Home-screen app + push | Store app + Apple/Google Pay push |
| Seller lists and ships | Yes | Yes | Push when it sells or a message arrives | Camera-first listing in the app |
| Charity storefront and staff | Yes | Yes | Push to shop managers | Buyer app; staff tools stay on the web |
| Admin and finance | Yes | Yes | Web | Web |
| Social auto-post and AI listing help | Only if keys are set | If you choose to enable them | Same | Same |

---

## 12. Risks to tell the client up front

- Returns policy is not finished. Do not promise a self-serve refund button.
- Email and social features look present in the UI and stay quiet until the provider accounts exist.
- Escrow auto-release must actually be running in production (the worker is written; it has to be deployed).
- Affiliate and eBay import can send the buyer off Angelpage to pay. Those sales do not follow the Stripe escrow path. Say so if a client’s catalogue is affiliate-only.
- iPhone push is not free with a responsive website. It needs the home-screen app (Phase B) or the App Store app (Phase C).
