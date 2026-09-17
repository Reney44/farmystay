import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Plus, MapPin, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { localizedLocationName } from "@/lib/format";
import PropertyCard from "@/components/PropertyCard";
import PropertyResults from "@/components/PropertyResults";
import QuickSearchBar from "@/components/QuickSearchBar";

const HOME_LISTING_LIMIT = 12;

export default async function HomePage() {
  const t = await getTranslations("home");
  const locale = await getLocale();

  const [properties, totalCount, locations] = await Promise.all([
    prisma.property.findMany({
      where: { status: "APPROVED" },
      include: { location: true, media: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: HOME_LISTING_LIMIT,
    }),
    prisma.property.count({ where: { status: "APPROVED" } }),
    prisma.location.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <section className="border-b border-border bg-gradient-to-b from-primary/10 to-transparent">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-14 text-center">
          <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("heroTitle")}
          </h1>
          <p className="max-w-xl text-muted-foreground">{t("heroSubtitle")}</p>

          <QuickSearchBar locations={locations} />

          <Link
            href="/dashboard/add-property"
            className="flex items-center gap-2 text-sm font-medium text-accent hover:underline"
          >
            <Plus className="h-4 w-4" />
            {t("addCta")}
          </Link>
        </div>
      </section>

      {locations.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-8">
          <div className="flex flex-wrap gap-2">
            {locations.map((loc) => (
              <Link
                key={loc.id}
                href={{ pathname: "/search", query: { locationId: loc.id } }}
                className="flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                <MapPin className="h-3.5 w-3.5 text-primary" />
                {localizedLocationName(loc, locale)}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            {t("allProperties")}
          </h2>
          {totalCount > HOME_LISTING_LIMIT && (
            <Link
              href="/search"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              {t("viewAll")} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {properties.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
            {t("noProperties")}
          </p>
        ) : (
          <PropertyResults properties={properties}>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </PropertyResults>
        )}
      </section>
    </div>
  );
}
