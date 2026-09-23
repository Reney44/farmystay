import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import PropertyForm from "@/components/PropertyForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditPropertyPage({ params }: Props) {
  const { id } = await params;
  const t = await getTranslations("dashboard");
  const session = await auth();

  const [property, locations] = await Promise.all([
    prisma.property.findUnique({
      where: { id },
      include: { media: { orderBy: { order: "asc" } } },
    }),
    prisma.location.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!property) notFound();

  const isOwner = session?.user?.id === property.ownerId;
  const isAdmin = session?.user?.role === "ADMIN";
  if (!isOwner && !isAdmin) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">{t("edit")}</h1>
      <PropertyForm
        mode="edit"
        propertyId={property.id}
        locations={locations}
        defaultValues={{
          title: property.title,
          description: property.description,
          category: property.category,
          price: property.price ?? undefined,
          size: property.size,
          sizeUnit: property.sizeUnit,
          locationId: property.locationId,
          latitude: property.latitude ?? undefined,
          longitude: property.longitude ?? undefined,
          addressDetails: property.addressDetails ?? "",
          nearbyAttractions: property.nearbyAttractions ?? "",
          sellerType: property.sellerType as "OWNER" | "BROKER",
          contactName: property.contactName,
          contactPhone: property.contactPhone,
          contactEmail: property.contactEmail ?? "",
        }}
        defaultMedia={property.media.map((m) => ({ url: m.url, type: m.type }))}
      />
    </div>
  );
}
