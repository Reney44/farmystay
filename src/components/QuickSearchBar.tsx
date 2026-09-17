"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Search } from "lucide-react";
import { localizedLocationName } from "@/lib/format";

type Location = { id: string; name: string; nameMl?: string | null };

const CATEGORIES = ["LAND", "LAND_WITH_BUILDING", "WETLAND", "DRYLAND"];

export default function QuickSearchBar({ locations }: { locations: Location[] }) {
  const t = useTranslations("search");
  const tCategory = useTranslations("category");
  const locale = useLocale();
  const router = useRouter();

  const [locationId, setLocationId] = useState("");
  const [category, setCategory] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query: Record<string, string> = {};
    if (locationId) query.locationId = locationId;
    if (category) query.category = category;
    router.push({ pathname: "/search", query });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-2xl flex-col gap-2 rounded-xl border border-border bg-card p-2 shadow-sm sm:flex-row"
    >
      <select
        value={locationId}
        onChange={(e) => setLocationId(e.target.value)}
        className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
      >
        <option value="">{t("allLocations")}</option>
        {locations.map((loc) => (
          <option key={loc.id} value={loc.id}>
            {localizedLocationName(loc, locale)}
          </option>
        ))}
      </select>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
      >
        <option value="">{t("allCategories")}</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {tCategory(c)}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        <Search className="h-4 w-4" /> {t("apply")}
      </button>
    </form>
  );
}
