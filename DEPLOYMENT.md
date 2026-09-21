# Deploying to Hostinger (junbriz.com)

## Status

- [x] Code pushed to GitHub — https://github.com/Reney44/farmystay
      (repo name kept as-is; renaming it would need re-linking the
      Hostinger GitHub integration, so only rename if you specifically want to)
- [x] Postgres database (Supabase) created, migrated, and seeded
- [x] Cloudinary connected — photo/video uploads confirmed working
- [x] Node.js Web App created in hPanel, build succeeding (Business plan,
      running on a temporary `*.hostingersite.com` domain for now)
- [ ] `junbriz.com` attached to the site

The app now runs on a real hosted Postgres (Supabase) for both local dev
and production, and uploads go to Cloudinary instead of local disk.

## Known Hostinger build quirks (already fixed)

Hostinger's build container has an older glibc than Next.js's native
Turbopack/SWC bindings need, which caused two issues — both already fixed
in the codebase:
- `next.config.ts` → `next.config.mjs` (the WASM SWC fallback couldn't
  load a TypeScript config)
- `next build` → `next build --webpack` (Turbopack has no WASM fallback
  at all and hard-fails on this platform)

## Environment variables (already entered in hPanel)

| Variable | Value |
|---|---|
| `DATABASE_URL` | The pooled (`:6543`, `pgbouncer=true`) Supabase connection string |
| `DIRECT_URL` | The session-mode (`:5432`) Supabase connection string |
| `AUTH_SECRET` | A long random string — **different** from local dev |
| `NEXTAUTH_URL` | Must match whatever domain is actually live: the temporary Hostinger domain for now, `https://junbriz.com` once that's attached (see below) |
| `CLOUDINARY_CLOUD_NAME` | `caje1sco` |
| `CLOUDINARY_API_KEY` | From your Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From your Cloudinary dashboard |

## Point junbriz.com at the site

Once you're ready to go live on the real domain: attach `junbriz.com` to
this website from the site's **Domain** settings in hPanel, then update
`NEXTAUTH_URL` to `https://junbriz.com` and redeploy.

## After going live

1. Log in with the seeded admin account and **change the admin password**
   (currently `admin@junbriz.com` / `ChangeMe123!` — fine for testing,
   must not stay as-is once real users are around).
2. Delete or keep the "Demo Lister" sample listings from Admin → All
   Listings, as you like.

## If the site loads but looks unstyled / images 404

The standalone build doesn't automatically include the `public/` folder or
`.next/static` — Hostinger's Next.js build pipeline normally handles this
for you, but if you see missing CSS or broken static assets after deploy,
that's the cause. Let me know and I'll add a small postbuild script that
copies `public/` and `.next/static` into `.next/standalone/` to fix it.

## A note on local dev sharing the production database

Since local dev and production point at the same Supabase project, be
careful with destructive local testing (e.g. deleting listings) once the
site is live with real users — it deletes for everyone. If that becomes
a problem, create a second free Supabase project for local dev and point
your local `.env` at that instead; nothing else needs to change.
