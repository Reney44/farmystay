import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Logo from "./Logo";
import Wordmark from "./Wordmark";

export default async function Footer() {
  const site = await getTranslations("site");
  const t = await getTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <Logo className="h-9 w-9" />
            <Wordmark className="text-lg" />
          </div>
          <p className="mt-2 max-w-xs text-sm italic text-muted-foreground">{site("tagline")}</p>
        </div>

        <div className="flex gap-6 text-sm">
          <Link href="/search" className="text-muted-foreground hover:text-foreground">
            {t("search")}
          </Link>
          <Link href="/dashboard/add-property" className="text-muted-foreground hover:text-foreground">
            {t("addProperty")}
          </Link>
        </div>
      </div>
      <div className="border-t border-border/60">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-muted-foreground">
          &copy; {year} {site("name")}. All listings are verified by our team before going live.
        </p>
      </div>
    </footer>
  );
}
