"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { Check, ImageOff, X } from "lucide-react";
import { formatINR, formatSize } from "@/lib/format";
import type { PropertyWithRelations } from "@/types/property";

export default function PendingListingRow({
  property,
}: {
  property: PropertyWithRelations & { owner: { name: string; email: string } };
}) {
  const t = useTranslations("admin");
  const tCategory = useTranslations("category");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const cover = property.media.find((m) => m.type === "IMAGE");

  async function approve() {
    setLoading(true);
    await fetch(`/api/properties/${property.id}/approve`, { method: "POST" });
    router.refresh();
  }

  async function reject() {
    const reason = prompt("Reason for rejection (optional):") ?? "";
    setLoading(true);
    await fetch(`/api/properties/${property.id}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
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
          {property.location.name} · {tCategory(property.category)} ·{" "}
          {formatSize(property.size, property.sizeUnit)}
        </p>
        <p className="text-sm font-semibold text-primary">{formatINR(property.price)}</p>
        <p className="text-xs text-muted-foreground">
          {property.owner.name} ({property.owner.email})
        </p>
      </div>

      <div className="flex shrink-0 gap-2">
        <button
          onClick={approve}
          disabled={loading}
          className="flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
        >
          <Check className="h-4 w-4" /> {t("approve")}
        </button>
        <button
          onClick={reject}
          disabled={loading}
          className="flex items-center gap-1 rounded-md bg-destructive px-3 py-1.5 text-sm font-medium text-destructive-foreground hover:opacity-90 disabled:opacity-60"
        >
          <X className="h-4 w-4" /> {t("reject")}
        </button>
      </div>
    </div>
  );
}
