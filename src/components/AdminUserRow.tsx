"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

type UserRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  isBlocked: boolean;
  _count: { properties: number };
};

export default function AdminUserRow({ user }: { user: UserRow }) {
  const t = useTranslations("admin");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function patch(body: Record<string, unknown>) {
    setLoading(true);
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, ...body }),
    });
    router.refresh();
  }

  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-3">
      <div className="min-w-0 flex-1">
        <p className="font-medium text-foreground">{user.name}</p>
        <p className="text-sm text-muted-foreground">
          {user.email} {user.phone ? `· ${user.phone}` : ""}
        </p>
        <p className="text-xs text-muted-foreground">
          {user.role} · {user._count.properties} listing(s)
        </p>
      </div>

      {user.isBlocked && (
        <span className="rounded-full bg-destructive/15 px-2.5 py-1 text-xs font-medium text-destructive">
          Blocked
        </span>
      )}

      <div className="flex shrink-0 gap-2">
        {user.role !== "ADMIN" && (
          <button
            onClick={() => patch({ role: "ADMIN" })}
            disabled={loading}
            className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-60"
          >
            {t("makeAdmin")}
          </button>
        )}
        <button
          onClick={() => patch({ isBlocked: !user.isBlocked })}
          disabled={loading}
          className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-60"
        >
          {user.isBlocked ? t("unblock") : t("block")}
        </button>
      </div>
    </div>
  );
}
