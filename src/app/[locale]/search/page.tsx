import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { buildPropertyWhere } from "@/lib/property-filters";
import SearchFilters from "@/components/SearchFilters";
import PropertyCard from "@/components/PropertyCard";
import PropertyResults from "@/components/PropertyResults";

type SearchPageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const t = await getTranslations("search");

  const [locations, properties] = await Promise.all([
    prisma.location.findMany({ orderBy: { name: "asc" } }),
    prisma.property.findMany({
      where: buildPropertyWhere(params),
      include: { location: true, media: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold text-foreground">{t("title")}</h1>

      <SearchFilters locations={locations} initial={params} />

      <p className="my-4 text-sm text-muted-foreground">
        {t("resultsCount", { count: properties.length })}
      </p>

      {properties.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
          {t("noResults")}
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
    </div>
  );
}
