"use client";

import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function LogoutButton() {
  const t = useTranslations("nav");

  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-md px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
    >
      {t("logout")}
    </button>
  );
}
