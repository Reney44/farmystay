import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/AdminNav";
import AddLocationForm from "@/components/AddLocationForm";

export default async function AdminLocationsPage() {
  const t = await getTranslations("admin");

  const locations = await prisma.location.findMany({
    include: { _count: { select: { properties: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-foreground">{t("title")}</h1>
      <AdminNav />
      <h2 className="mb-4 text-lg font-semibold text-foreground">{t("locations")}</h2>

      <AddLocationForm />

      <div className="flex flex-col gap-2">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
          >
            <div>
              <p className="font-medium text-foreground">
                {loc.name} {loc.nameMl ? `· ${loc.nameMl}` : ""}
              </p>
              {loc.district && (
                <p className="text-sm text-muted-foreground">{loc.district}</p>
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {loc._count.properties} listing(s)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
