import { getTranslations } from "next-intl/server";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Link } from "@/i18n/navigation";
import MyListingRow from "@/components/MyListingRow";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");
  const tNav = await getTranslations("nav");
  const session = await auth();

  const properties = session?.user
    ? await prisma.property.findMany({
        where: { ownerId: session.user.id },
        include: { location: true, media: true },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
        <Link
          href="/dashboard/add-property"
          className="flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> {tNav("addProperty")}
        </Link>
      </div>

      {properties.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
          {t("empty")}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {properties.map((property) => (
            <MyListingRow key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
