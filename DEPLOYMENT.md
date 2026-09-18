# Deploying to Hostinger (farmystay.com)

## Status

- [x] Code pushed to GitHub — https://github.com/Reney44/farmystay
- [x] Postgres database (Supabase) created, migrated, and seeded
- [ ] Cloudinary account for photo/video storage
- [ ] Node.js Web App created in hPanel
- [ ] `farmystay.com` attached to the site

The app now runs on a real hosted Postgres (Supabase) for both local dev
and production — there's no more local SQLite file. Photo/video uploads
still fall back to local disk until Cloudinary is configured (fine for
dev, not for Hostinger, which doesn't keep local files between deploys).

## 1. Create a Cloudinary account for photo/video storage

1. Sign up at https://cloudinary.com (free tier).
2. From the dashboard, copy your **Cloud name**, **API key**, and
   **API secret**, and send them to me — I'll wire them into `.env` and
   `src/app/api/upload/route.ts` already switches to Cloudinary
   automatically once these three are set.

## 2. Environment variables you'll need on Hostinger

Once Cloudinary is set up, these all get entered as environment variables
in the Hostinger Node.js app's settings (hPanel → your site → Node.js →
Environment variables):

| Variable | Value |
|---|---|
| `DATABASE_URL` | The pooled (`:6543`, `pgbouncer=true`) Supabase connection string |
| `DIRECT_URL` | The session-mode (`:5432`) Supabase connection string |
| `AUTH_SECRET` | A long random string (e.g. from `openssl rand -base64 32`) — use a **different** one from local dev |
| `NEXTAUTH_URL` | `https://farmystay.com` |
| `CLOUDINARY_CLOUD_NAME` | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From Cloudinary dashboard |

## 3. Create the Node.js Web App in hPanel

1. In hPanel: **Websites → Add Website → Push your code, we host it → Node.js**.
2. Choose **Import Git Repository** and connect `Reney44/farmystay`
   (deploy from the `main` branch — that's the one protected by PRs).
3. Hostinger auto-detects Next.js and pre-fills the build command
   (`npm run build`) and entry file. The entry file should be
   `.next/standalone/server.js` (this repo is already configured with
   `output: "standalone"` in `next.config.ts` to produce this).
4. Add the environment variables from the table above.
5. Deploy. Hostinger will rebuild automatically on every future merge to
   `main`.

## 4. Point farmystay.com at the new site

Since the domain and hosting are on the same Hostinger account, attach
`farmystay.com` to this website from the site's **Domain** settings in
hPanel (this is usually just selecting the domain from a dropdown — no
external DNS changes needed since it's already with Hostinger).

## 5. After the first deploy

1. Log in with the seeded admin account and **change the admin password**
   (currently `admin@farmystay.com` / `ChangeMe123!` — fine for testing,
   must not stay as-is in production).
2. Delete or keep the "Demo Lister" sample listings from Admin → All
   Listings, as you like.

## If the site loads but looks unstyled / images 404

The standalone build doesn't automatically include the `public/` folder or
`.next/static` — Hostinger's Next.js build pipeline normally handles this
for you, but if you see missing CSS or broken static assets after deploy,
that's the cause. Let me know and I'll add a small postbuild script that
copies `public/` and `.next/static` into `.next/standalone/` to fix it.

## A note on local dev now sharing the production database

Since local dev and production point at the same Supabase project, be
careful with destructive local testing (e.g. deleting listings) once the
site is live with real users — it deletes for everyone. If that becomes
a problem, create a second free Supabase project for local dev and point
your local `.env` at that instead; nothing else needs to change.
