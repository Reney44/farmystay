import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { Link } from "@/i18n/navigation";
import LocaleSwitcher from "./LocaleSwitcher";
import LogoutButton from "./LogoutButton";
import Logo from "./Logo";
import { Plus } from "lucide-react";

export default async function Navbar() {
  const t = await getTranslations("nav");
  const site = await getTranslations("site");
  const session = await auth();
  const role = session?.user?.role;
  const canList = role === "OWNER" || role === "BROKER" || role === "ADMIN";

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5">
        <Link href="/" className="flex items-center gap-3">
          <Logo className="h-11 w-11 shrink-0" />
          <span className="flex flex-col leading-tight">
            <span className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {site("name")}
            </span>
            <span className="hidden text-xs text-muted-foreground sm:block">
              {site("tagline")}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/search" className="rounded-md px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted">
            {t("search")}
          </Link>
          {canList && (
            <Link href="/dashboard" className="rounded-md px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted">
              {t("dashboard")}
            </Link>
          )}
          {role === "ADMIN" && (
            <Link href="/admin" className="rounded-md px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted">
              {t("admin")}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/add-property"
            className="hidden items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground hover:opacity-90 sm:flex"
          >
            <Plus className="h-4 w-4" />
            {t("addProperty")}
          </Link>
          {session?.user ? (
            <LogoutButton />
          ) : (
            <>
              <Link href="/login" className="rounded-md px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted">
                {t("login")}
              </Link>
              <Link href="/register" className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90">
                {t("register")}
              </Link>
            </>
          )}
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}
