# Deploying to Hostinger (farmystay.com)

Locally this app uses SQLite (a file on disk) and stores uploaded
photos/videos under `public/uploads`. Hostinger's Node.js Web App hosting
rebuilds your app from source on every deploy and doesn't keep local files
between deploys, so before going live, swap two things:

1. **Database**: SQLite → a hosted Postgres (Supabase)
2. **Media storage**: local `public/uploads` → Cloudinary

Both are free to start, and the app already supports both — Prisma and
`src/app/api/upload/route.ts` just need the right environment variables.
Nothing below changes how `npm run dev` works locally.

## 1. Push the code to GitHub

Hostinger's Node.js hosting deploys straight from a GitHub repo (auto
rebuilding on every push), which is the easiest way to keep the live site
updated.

1. Create a free GitHub account if you don't have one: https://github.com/signup
2. Create a new **empty** repository (no README/license) — e.g. `farmystay`.
3. Tell me the repository's URL and I'll commit and push this project to it.

(If you'd rather skip GitHub entirely, Hostinger also supports uploading a
zipped copy of the project directly in hPanel — ask and I'll prepare that
zip instead.)

## 2. Create a hosted Postgres database (Supabase)

1. Sign up at https://supabase.com (free tier).
2. Create a new project — pick a region close to India (e.g. Singapore).
3. In **Project Settings → Database → Connection string**, copy the URI
   (looks like `postgresql://postgres:[password]@[host]:5432/postgres`).
4. Share that connection string with me (or set it yourself — see step 5),
   and I'll switch `prisma/schema.prisma` to Postgres and run the one-time
   `prisma db push` + `npm run seed` against it to create the tables and
   your admin account.

## 3. Create a Cloudinary account for photo/video storage

1. Sign up at https://cloudinary.com (free tier).
2. From the dashboard, copy your **Cloud name**, **API key**, and
   **API secret**.

## 4. Environment variables you'll need on Hostinger

Once you have the values from steps 2–3, these all get entered as
environment variables in the Hostinger Node.js app's settings (hPanel →
your site → Node.js → Environment variables):

| Variable | Value |
|---|---|
| `DATABASE_URL` | Your Supabase connection string |
| `AUTH_SECRET` | A long random string (e.g. from `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | `https://farmystay.com` |
| `CLOUDINARY_CLOUD_NAME` | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From Cloudinary dashboard |

## 5. Create the Node.js Web App in hPanel

1. In hPanel: **Websites → Add Website → Push your code, we host it → Node.js**.
2. Choose **Import Git Repository** and connect the GitHub repo from step 1.
3. Hostinger auto-detects Next.js and pre-fills the build command
   (`npm run build`) and entry file. The entry file should be
   `.next/standalone/server.js` (this repo is already configured with
   `output: "standalone"` in `next.config.ts` to produce this).
4. Add the environment variables from the table above.
5. Deploy. Hostinger will rebuild automatically on every future push to
   the connected branch.

## 6. Point farmystay.com at the new site

Since the domain and hosting are on the same Hostinger account, attach
`farmystay.com` to this website from the site's **Domain** settings in
hPanel (this is usually just selecting the domain from a dropdown — no
external DNS changes needed since it's already with Hostinger).

## 7. First-time production setup

Once the site is live with the environment variables above:

1. Run the one-time database setup (I can do this for you once I have the
   `DATABASE_URL`): `npx prisma db push` then `npm run seed`.
2. Log in with the seeded admin account and **change the admin password**
   (currently `admin@farmystay.com` / `ChangeMe123!` — fine for local
   testing, must not stay as-is in production).
3. Delete or keep the "Demo Lister" sample listings from Admin → All
   Listings, as you like.

## If the site loads but looks unstyled / images 404

The standalone build doesn't automatically include the `public/` folder or
`.next/static` — Hostinger's Next.js build pipeline normally handles this
for you, but if you see missing CSS or broken static assets after deploy,
that's the cause. Let me know and I'll add a small postbuild script that
copies `public/` and `.next/static` into `.next/standalone/` to fix it.

## Local development is unaffected

None of the above changes anything about running the app locally with
`npm run dev` — that keeps using SQLite and local file storage.
