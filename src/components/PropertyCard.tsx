import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { MapPin, Ruler, ImageOff, Sparkles } from "lucide-react";
import { formatINR, formatSize, localizedLocationName } from "@/lib/format";
import { CATEGORY_ICONS } from "@/lib/category-icons";
import type { PropertyWithRelations } from "@/types/property";

export default async function PropertyCard({
  property,
}: {
  property: PropertyWithRelations;
}) {
  const t = await getTranslations("category");
  const locale = await getLocale();
  const cover = property.media.find((m) => m.type === "IMAGE");
  const CategoryIcon = CATEGORY_ICONS[property.category];

  return (
    <Link
      href={`/property/${property.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover.url}
            alt={property.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImageOff className="h-8 w-8" />
          </div>
        )}
        {property.featured && (
          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground shadow-sm">
            <Sparkles className="h-3 w-3" /> Featured
          </span>
        )}
        <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground shadow-sm">
          <CategoryIcon className="h-3 w-3" />
          {t(property.category)}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="line-clamp-1 font-semibold text-foreground">
          {property.title}
        </h3>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {localizedLocationName(property.location, locale)}
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Ruler className="h-3.5 w-3.5" />
          {formatSize(property.size, property.sizeUnit, locale)}
        </div>
        <p className="mt-2 text-lg font-semibold text-primary">
          {formatINR(property.price)}
        </p>
      </div>
    </Link>
  );
}
