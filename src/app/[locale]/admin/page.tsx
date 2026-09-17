import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/AdminNav";
import PendingListingRow from "@/components/PendingListingRow";

export default async function AdminPendingPage() {
  const t = await getTranslations("admin");

  const pending = await prisma.property.findMany({
    where: { status: "PENDING" },
    include: { location: true, media: true, owner: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-foreground">{t("title")}</h1>
      <AdminNav />
      <h2 className="mb-4 text-lg font-semibold text-foreground">{t("pending")}</h2>

      {pending.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
          {t("noPending")}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {pending.map((property) => (
            <PendingListingRow key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
