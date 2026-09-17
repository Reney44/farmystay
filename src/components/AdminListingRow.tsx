"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { Check, ImageOff, Trash2, X } from "lucide-react";
import { formatINR, formatSize } from "@/lib/format";
import type { PropertyWithRelations } from "@/types/property";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-accent/20 text-accent",
  APPROVED: "bg-primary/15 text-primary",
  REJECTED: "bg-destructive/15 text-destructive",
};

export default function AdminListingRow({
  property,
}: {
  property: PropertyWithRelations & { owner: { name: string; email: string } };
}) {
  const t = useTranslations("admin");
  const tProperty = useTranslations("property");
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

  async function remove() {
    if (!confirm("Delete this listing permanently?")) return;
    setLoading(true);
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
          {property.location.name} · {tCategory(property.category)} ·{" "}
          {formatSize(property.size, property.sizeUnit)}
        </p>
        <p className="text-sm font-semibold text-primary">{formatINR(property.price)}</p>
        <p className="text-xs text-muted-foreground">
          {property.owner.name} ({property.owner.email})
        </p>
      </div>

      <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[property.status]}`}>
        {tProperty(property.status.toLowerCase() as "pending" | "approved" | "rejected")}
      </span>

      <div className="flex shrink-0 gap-2">
        {property.status !== "APPROVED" && (
          <button
            onClick={approve}
            disabled={loading}
            className="rounded-md bg-primary p-2 text-primary-foreground hover:opacity-90 disabled:opacity-60"
            title={t("approve")}
          >
            <Check className="h-4 w-4" />
          </button>
        )}
        {property.status !== "REJECTED" && (
          <button
            onClick={reject}
            disabled={loading}
            className="rounded-md bg-secondary p-2 text-secondary-foreground hover:opacity-90 disabled:opacity-60"
            title={t("reject")}
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={remove}
          disabled={loading}
          className="rounded-md border border-border p-2 text-destructive hover:bg-destructive/10"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
