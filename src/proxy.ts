import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { auth } from "@/lib/auth";

const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
  const { nextUrl } = req;
  const segments = nextUrl.pathname.split("/").filter(Boolean);
  const hasLocalePrefix = routing.locales.includes(
    segments[0] as (typeof routing.locales)[number]
  );
  const locale = hasLocalePrefix ? segments[0] : routing.defaultLocale;
  const pathWithoutLocale =
    "/" + segments.slice(hasLocalePrefix ? 1 : 0).join("/");

  const isAdminRoute = pathWithoutLocale.startsWith("/admin");
  const isDashboardRoute = pathWithoutLocale.startsWith("/dashboard");

  if (isAdminRoute || isDashboardRoute) {
    const session = req.auth;

    if (!session?.user) {
      const loginUrl = new URL(`/${locale}/login`, req.url);
      loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isAdminRoute && session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL(`/${locale}`, req.url));
    }
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
