"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Search, RotateCcw } from "lucide-react";
import { localizedLocationName } from "@/lib/format";

type Location = { id: string; name: string; nameMl?: string | null };

const CATEGORIES = ["LAND", "LAND_WITH_BUILDING", "WETLAND", "DRYLAND"];
const SIZE_UNITS = ["CENT", "ACRE", "SQFT"];

export default function SearchFilters({
  locations,
  initial,
}: {
  locations: Location[];
  initial: Record<string, string | undefined>;
}) {
  const t = useTranslations("search");
  const tCategory = useTranslations("category");
  const tUnit = useTranslations("sizeUnit");
  const locale = useLocale();
  const router = useRouter();

  const [locationId, setLocationId] = useState(initial.locationId ?? "");
  const [category, setCategory] = useState(initial.category ?? "");
  const [minPrice, setMinPrice] = useState(initial.minPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(initial.maxPrice ?? "");
  const [minSize, setMinSize] = useState(initial.minSize ?? "");
  const [maxSize, setMaxSize] = useState(initial.maxSize ?? "");
  const [sizeUnit, setSizeUnit] = useState(initial.sizeUnit ?? "");

  function apply() {
    const query: Record<string, string> = {};
    if (locationId) query.locationId = locationId;
    if (category) query.category = category;
    if (minPrice) query.minPrice = minPrice;
    if (maxPrice) query.maxPrice = maxPrice;
    if (minSize) query.minSize = minSize;
    if (maxSize) query.maxSize = maxSize;
    if (sizeUnit) query.sizeUnit = sizeUnit;
    router.push({ pathname: "/search", query });
  }

  function reset() {
    setLocationId("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setMinSize("");
    setMaxSize("");
    setSizeUnit("");
    router.push({ pathname: "/search" });
  }

  return (
    <div className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">
          {t("location")}
        </label>
        <select
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="">{t("allLocations")}</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {localizedLocationName(loc, locale)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">
          {t("category")}
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="">{t("allCategories")}</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {tCategory(c)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            {t("minPrice")}
          </label>
          <input
            type="number"
            min={0}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            {t("maxPrice")}
          </label>
          <input
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            {t("minSize")}
          </label>
          <input
            type="number"
            min={0}
            value={minSize}
            onChange={(e) => setMinSize(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            {t("maxSize")}
          </label>
          <input
            type="number"
            min={0}
            value={maxSize}
            onChange={(e) => setMaxSize(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            {t("sizeUnit")}
          </label>
          <select
            value={sizeUnit}
            onChange={(e) => setSizeUnit(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">-</option>
            {SIZE_UNITS.map((u) => (
              <option key={u} value={u}>
                {tUnit(u)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-4">
        <button
          onClick={apply}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <Search className="h-4 w-4" />
          {t("apply")}
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          <RotateCcw className="h-4 w-4" />
          {t("reset")}
        </button>
      </div>
    </div>
  );
}
