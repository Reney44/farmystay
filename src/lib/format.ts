export function formatINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

const SIZE_UNIT_LABELS: Record<string, { en: string; enPlural: string; ml: string }> = {
  CENT: { en: "Cent", enPlural: "Cents", ml: "സെന്റ്" },
  ACRE: { en: "Acre", enPlural: "Acres", ml: "ഏക്കർ" },
  SQFT: { en: "Sq.ft", enPlural: "Sq.ft", ml: "ചതുരശ്ര അടി" },
};

export function formatSize(
  size: number,
  unit: "CENT" | "ACRE" | "SQFT",
  locale: string = "en"
): string {
  const labels = SIZE_UNIT_LABELS[unit];
  if (locale === "ml") return `${size} ${labels.ml}`;
  return `${size} ${size === 1 ? labels.en : labels.enPlural}`;
}

export function localizedLocationName(
  location: { name: string; nameMl?: string | null },
  locale: string
): string {
  return locale === "ml" && location.nameMl ? location.nameMl : location.name;
}
