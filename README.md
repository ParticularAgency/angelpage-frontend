# Angelpage Frontend

UK charity marketplace UI for [angelpage.co.uk](https://www.angelpage.co.uk).

Sellers list second-hand goods; ~**90%** of sale proceeds go to a chosen charity. Buyers checkout with Stripe; ShipStation handles shipping; funds sit in escrow before release.

## Stack

- **Next.js 16.3** (App Router, Turbopack by default) · **React 19.2** · TypeScript/JS
- NextAuth (JWT sessions) · Redux Toolkit / RTK Query
- Tailwind + DaisyUI · Stripe Elements · Socket.IO

**Runtime:** Node.js **≥ 20.9** (recommend current LTS / 22+)

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

| Script | Purpose |
|--------|---------|
| `npm run dev` | Dev server (Turbopack — recommended in 16.3) |
| `npm run dev:webpack` | Dev server with Webpack if Turbopack misbehaves |
| `npm run build` / `start` | Production build & serve |
Required env:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base (e.g. `http://localhost:5000/api`) |
| `NEXTAUTH_URL` / `NEXTAUTH_SECRET` | Auth |
| OAuth / Turnstile | Optional — see `.env.example` |

Launch flags:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SHOW_ENV_BANNER=true` | Force Test/Demo header banner in production |
| `NEXT_PUBLIC_ALLOW_INDEXING=true` | Allow SEO indexing (removes global `noindex` header) |

## Roles

| Role | Primary UI |
|------|------------|
| Guest | Browse, guest checkout |
| `USER` | `/user/account/[id]` |
| `CHARITY` / staff | `/charity/account/[id]`, storefront |
| Admin roles | `/admin` (OPS / CONTENT / FINANCE panels) |

Public admin registration is **disabled**. Create admins via Super Admin → Team, or backend bootstrap seed.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |

## Related

- Backend: `angelpage-backend`
- Partner bulk listing: backend `docs/PARTNER_BULK_API.md`
- Ops: backend `docs/OPS_RUNBOOK.md`
