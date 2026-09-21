# JunBriz

*Where Nature Becomes Home.*

A bilingual (English/Malayalam) community site for people who love nature
and farming, built around discovering land, farms and homes across Kerala.
No single location is favored — admins can add any location, and the site
is designed to grow organically as the community does.

## Features

- **Search properties** — filter by location, price range, size, and
  category (land / land with building / wetland / dryland).
- **Add property** — owners and brokers can list a property with photos,
  videos, price, size, category, location and contact details.
- **Admin dashboard** — every new listing starts as *Pending* and only goes
  live after an admin approves it. Admins can also reject listings, delete
  any listing, block/unblock users, promote a user to admin, and add new
  locations at any time — the location list is fully admin-managed.
- **English + Malayalam** — toggle in the top-right of every page.

## Tech stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma ORM — Postgres (Supabase), shared between local dev and production
- NextAuth (Credentials + JWT sessions) with roles: `ADMIN`, `OWNER`,
  `BROKER`
- next-intl for English/Malayalam
- Leaflet for the map view and the pin-drop location picker
- Photos/videos are stored under `public/uploads` locally, or Cloudinary
  once `CLOUDINARY_*` env vars are set (see `DEPLOYMENT.md`)

## Getting started (local development)

Copy `.env.example` to `.env` and fill in a Supabase connection string
(`DATABASE_URL` + `DIRECT_URL` — see `.env.example` for where to find
these), then:

```bash
npm install
npx prisma migrate dev
npm run seed
npm run dev
```

Then open http://localhost:3000.

`npm run seed` creates:
- The two starting locations: Marayoor and Kanthalloor
- One admin account (check the terminal output for the email/password —
  configurable via `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` env vars
  before seeding)

Regular users register themselves from the "Register" page as either an
**Owner** or a **Broker**. Admin accounts are not self-service — they're
seeded directly, or promoted by an existing admin from **Admin → Users**.

## Project structure

- `src/app/[locale]/...` — pages (home, search, property detail, login,
  register, dashboard, admin), one folder per locale-aware route
- `src/app/api/...` — API routes (auth, register, properties, upload,
  locations, admin/users)
- `prisma/schema.prisma` — database schema
- `messages/en.json`, `messages/ml.json` — UI translations

## Going to production

See `DEPLOYMENT.md` — it tracks the remaining steps to deploy to Hostinger
at junbriz.com.
