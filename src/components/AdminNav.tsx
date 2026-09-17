import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function AdminNav() {
  const t = await getTranslations("admin");

  const items = [
    { href: "/admin", label: t("pending") },
    { href: "/admin/listings", label: t("allListings") },
    { href: "/admin/users", label: t("users") },
    { href: "/admin/locations", label: t("locations") },
  ];

  return (
    <div className="mb-6 flex flex-wrap gap-2 border-b border-border pb-3">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-md px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
