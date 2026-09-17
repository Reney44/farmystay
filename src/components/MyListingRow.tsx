"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { ImageOff, Pencil, Trash2 } from "lucide-react";
import { formatINR, formatSize, localizedLocationName } from "@/lib/format";
import type { PropertyWithRelations } from "@/types/property";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-accent/20 text-accent",
  APPROVED: "bg-primary/15 text-primary",
  REJECTED: "bg-destructive/15 text-destructive",
};

export default function MyListingRow({
  property,
}: {
  property: PropertyWithRelations;
}) {
  const t = useTranslations("dashboard");
  const tProperty = useTranslations("property");
  const tCategory = useTranslations("category");
  const locale = useLocale();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const cover = property.media.find((m) => m.type === "IMAGE");

  async function handleDelete() {
    if (!confirm("Delete this listing? This cannot be undone.")) return;
    setDeleting(true);
    await fetch(`/api/properties/${property.id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-3">
      <div className="h-16 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover.url} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImageOff className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <Link href={`/property/${property.id}`} className="truncate font-medium text-foreground hover:underline">
          {property.title}
        </Link>
        <p className="text-sm text-muted-foreground">
          {localizedLocationName(property.location, locale)} · {tCategory(property.category)} ·{" "}
          {formatSize(property.size, property.sizeUnit, locale)}
        </p>
        <p className="text-sm font-semibold text-primary">{formatINR(property.price)}</p>
      </div>

      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[property.status]}`}
      >
        {tProperty(property.status.toLowerCase() as "pending" | "approved" | "rejected")}
      </span>

      <div className="flex shrink-0 gap-2">
        <Link
          href={`/dashboard/edit-property/${property.id}`}
          title={t("edit")}
          className="rounded-md border border-border p-2 text-foreground hover:bg-muted"
        >
          <Pencil className="h-4 w-4" />
        </Link>
        <button
          onClick={handleDelete}
          disabled={deleting}
          title={t("delete")}
          className="rounded-md border border-border p-2 text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
