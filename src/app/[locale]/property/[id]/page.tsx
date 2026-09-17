import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Phone, MessageCircle, Mail, MapPin, Ruler } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatINR, formatSize, localizedLocationName } from "@/lib/format";
import { CATEGORY_ICONS } from "@/lib/category-icons";
import MediaGallery from "@/components/MediaGallery";
import SinglePropertyMap from "@/components/SinglePropertyMap";

type Props = { params: Promise<{ id: string; locale: string }> };

export default async function PropertyDetailPage({ params }: Props) {
  const { id, locale } = await params;
  const [property, session, t, tCategory, tStatus] = await Promise.all([
    prisma.property.findUnique({
      where: { id },
      include: { location: true, media: { orderBy: { order: "asc" } }, owner: true },
    }),
    auth(),
    getTranslations("property"),
    getTranslations("category"),
    getTranslations("property"),
  ]);

  if (!property) notFound();

  const isOwner = session?.user?.id === property.ownerId;
  const isAdmin = session?.user?.role === "ADMIN";

  if (property.status !== "APPROVED" && !isOwner && !isAdmin) {
    notFound();
  }

  const whatsappNumber = property.contactPhone.replace(/[^0-9]/g, "");
  const CategoryIcon = CATEGORY_ICONS[property.category];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {property.status !== "APPROVED" && (
        <div className="mb-4 rounded-lg border border-accent bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
          {property.status === "PENDING" ? tStatus("pending") : tStatus("rejected")}
          {property.rejectionReason ? ` — ${property.rejectionReason}` : ""}
        </div>
      )}

      <MediaGallery media={property.media} />

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold text-foreground">{property.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {localizedLocationName(property.location, locale)}
            </span>
            <span className="flex items-center gap-1">
              <Ruler className="h-4 w-4" /> {formatSize(property.size, property.sizeUnit, locale)}
            </span>
            <span className="flex items-center gap-1">
              <CategoryIcon className="h-4 w-4" /> {tCategory(property.category)}
            </span>
          </div>

          <p className="mt-4 text-2xl font-semibold text-primary">
            {formatINR(property.price)}
          </p>

          <div className="mt-6">
            <h2 className="mb-2 font-semibold text-foreground">{t("description")}</h2>
            <p className="whitespace-pre-line text-foreground/90">{property.description}</p>
          </div>

          {property.nearbyAttractions && (
            <div className="mt-6">
              <h2 className="mb-2 font-semibold text-foreground">
                {t("nearbyAttractions")}
              </h2>
              <p className="text-foreground/90">{property.nearbyAttractions}</p>
            </div>
          )}

          {property.addressDetails && (
            <div className="mt-6">
              <h2 className="mb-2 font-semibold text-foreground">{t("location")}</h2>
              <p className="text-foreground/90">{property.addressDetails}</p>
            </div>
          )}

          {property.latitude != null && property.longitude != null && (
            <div className="mt-6">
              <SinglePropertyMap
                id={property.id}
                title={property.title}
                price={property.price}
                latitude={property.latitude}
                longitude={property.longitude}
              />
            </div>
          )}
        </div>

        <div className="h-fit rounded-xl border border-border bg-card p-5">
          <h2 className="mb-1 font-semibold text-foreground">{t("contact")}</h2>
          <p className="mb-3 text-sm text-muted-foreground">
            {t("listedBy")}: {property.sellerType === "BROKER" ? t("broker") : t("owner")}
          </p>
          <p className="font-medium text-foreground">{property.contactName}</p>

          <div className="mt-4 flex flex-col gap-2">
            <a
              href={`tel:${property.contactPhone}`}
              className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              <Phone className="h-4 w-4" /> {property.contactPhone}
            </a>
            <a
              href={`https://wa.me/91${whatsappNumber.slice(-10)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            {property.contactEmail && (
              <a
                href={`mailto:${property.contactEmail}`}
                className="flex items-center justify-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                <Mail className="h-4 w-4" /> {property.contactEmail}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
