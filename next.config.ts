import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Produces a self-contained .next/standalone/server.js — what Hostinger's
  // Node.js Web App hosting (and most non-Vercel Node hosts) expects as the
  // app's entry file. See DEPLOYMENT.md.
  output: "standalone",
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default withNextIntl(nextConfig);
