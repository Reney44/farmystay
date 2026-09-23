import { getTranslations } from "next-intl/server";
import { Bed, Home } from "lucide-react";

type Site = {
  id: string;
  label: string;
  villaType: string;
  bedrooms: number | null;
  highlight: string | null;
};

export default async function ProjectSites({ sites }: { sites: Site[] }) {
  const t = await getTranslations("property");

  if (sites.length === 0) return null;

  return (
    <div className="mt-6">
      <h2 className="mb-3 font-semibold text-foreground">{t("theSites")}</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {sites.map((site) => (
          <div key={site.id} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {site.label}
              </span>
              {site.bedrooms != null && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Bed className="h-3.5 w-3.5" /> {site.bedrooms} {t("bedrooms")}
                </span>
              )}
            </div>
            <p className="mt-1 flex items-center gap-1.5 font-medium text-foreground">
              <Home className="h-4 w-4 text-primary" /> {site.villaType}
            </p>
            {site.highlight && (
              <p className="mt-1 text-sm text-muted-foreground">{site.highlight}</p>
            )}
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm italic text-muted-foreground">{t("farmlandNote")}</p>
    </div>
  );
}
