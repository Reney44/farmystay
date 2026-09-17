# FarmyStay

A bilingual (English/Malayalam) real-estate listing site for land, farms and
homes around Marayoor, Kanthalloor and other hill-country locations in
Kerala. Built so it's easy to expand to more villages/towns over time.

## Features

- **Search properties** — filter by location, price range, size, and
  category (land / land with building / wetland / dryland).
- **Add property** — owners and brokers can list a property with photos,
  videos, price, size, category, location and contact details.
- **Admin dashboard** — every new listing starts as *Pending* and only goes
  live after an admin approves it. Admins can also reject listings, delete
  any listing, block/unblock users, promote a user to admin, and add new
  locations as the site expands beyond Marayoor/Kanthalloor.
- **English + Malayalam** — toggle in the top-right of every page.

## Tech stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Prisma ORM — SQLite for local development, swaps to Postgres for
  production (see `DEPLOYMENT.md`)
- NextAuth (Credentials + JWT sessions) with roles: `ADMIN`, `OWNER`,
  `BROKER`
- next-intl for English/Malayalam
- Photos/videos are stored under `public/uploads` locally; see
  `DEPLOYMENT.md` for swapping to cloud storage before a serverless deploy.

## Getting started (local development)

```bash
npm install
npx prisma migrate dev --name init
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

See `DEPLOYMENT.md` — it walks through switching the database to a hosted
Postgres instance and moving photo/video storage to Cloudinary before
deploying to Vercel or Netlify (both platforms run this as serverless
functions, which don't keep local files permanently).
