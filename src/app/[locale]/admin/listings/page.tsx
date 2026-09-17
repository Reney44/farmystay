import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/AdminNav";
import AdminListingRow from "@/components/AdminListingRow";

export default async function AdminListingsPage() {
  const t = await getTranslations("admin");

  const listings = await prisma.property.findMany({
    include: { location: true, media: true, owner: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-foreground">{t("title")}</h1>
      <AdminNav />
      <h2 className="mb-4 text-lg font-semibold text-foreground">{t("allListings")}</h2>

      <div className="flex flex-col gap-3">
        {listings.map((property) => (
          <AdminListingRow key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
