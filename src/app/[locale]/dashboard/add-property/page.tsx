import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import PropertyForm from "@/components/PropertyForm";

export default async function AddPropertyPage() {
  const t = await getTranslations("nav");
  const session = await auth();
  const locations = await prisma.location.findMany({ orderBy: { name: "asc" } });

  const defaultSellerType =
    session?.user?.role === "BROKER" ? "BROKER" : "OWNER";

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">
        {t("addProperty")}
      </h1>
      <PropertyForm
        mode="create"
        locations={locations}
        defaultSellerType={defaultSellerType}
      />
    </div>
  );
}
