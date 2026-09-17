"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { ImageOff, PlayCircle, Trash2, UploadCloud } from "lucide-react";
import { propertySchema, type PropertyInput } from "@/lib/validations";
import { localizedLocationName } from "@/lib/format";

const LocationPicker = dynamic(() => import("./LocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[260px] items-center justify-center rounded-md border border-border bg-muted text-sm text-muted-foreground">
      Loading map…
    </div>
  ),
});

type MediaItem = { url: string; type: "IMAGE" | "VIDEO" };
type Location = { id: string; name: string; nameMl?: string | null };

const CATEGORIES = ["LAND", "LAND_WITH_BUILDING", "WETLAND", "DRYLAND"] as const;
const SIZE_UNITS = ["CENT", "ACRE", "SQFT"] as const;

export default function PropertyForm({
  locations,
  mode,
  propertyId,
  defaultValues,
  defaultMedia = [],
  defaultSellerType = "OWNER",
}: {
  locations: Location[];
  mode: "create" | "edit";
  propertyId?: string;
  defaultValues?: Partial<PropertyInput>;
  defaultMedia?: MediaItem[];
  defaultSellerType?: "OWNER" | "BROKER";
}) {
  const t = useTranslations("form");
  const tCategory = useTranslations("category");
  const tUnit = useTranslations("sizeUnit");
  const tAuth = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();

  const [media, setMedia] = useState<MediaItem[]>(defaultMedia);
  const [uploading, setUploading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PropertyInput>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      category: "LAND",
      sizeUnit: "CENT",
      sellerType: defaultSellerType,
      locationId: locations[0]?.id ?? "",
      ...defaultValues,
      mediaUrls: defaultMedia,
    },
  });

  const pinnedLat = watch("latitude");
  const pinnedLng = watch("longitude");

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setServerError("");

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const body = await res.json();
      if (!res.ok) {
        setServerError(body.error || "Upload failed");
        continue;
      }
      setMedia((prev) => [...prev, { url: body.url, type: body.type }]);
    }

    setUploading(false);
  }

  function removeMedia(url: string) {
    setMedia((prev) => prev.filter((m) => m.url !== url));
  }

  async function onSubmit(data: PropertyInput) {
    setServerError("");

    if (media.length === 0) {
      setServerError("Add at least one photo");
      return;
    }

    const payload = { ...data, contactEmail: data.contactEmail || "", mediaUrls: media };

    const res = await fetch(
      mode === "create" ? "/api/properties" : `/api/properties/${propertyId}`,
      {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const body = await res.json();
      setServerError(body.error || "Something went wrong");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          {t("title")}
        </label>
        <input
          {...register("title")}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          {t("description")}
        </label>
        <textarea
          rows={4}
          {...register("description")}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
        {errors.description && (
          <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            {t("category")}
          </label>
          <select
            {...register("category")}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {tCategory(c)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            {t("location")}
          </label>
          <select
            {...register("locationId")}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {localizedLocationName(loc, locale)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          {t("location")} — {t("pinLocation")}
        </label>
        <LocationPicker
          value={{ lat: pinnedLat ?? null, lng: pinnedLng ?? null }}
          onChange={(lat, lng) => {
            setValue("latitude", lat, { shouldValidate: true });
            setValue("longitude", lng, { shouldValidate: true });
          }}
        />
        {(errors.latitude || errors.longitude) && (
          <p className="mt-1 text-xs text-destructive">
            {errors.latitude?.message || errors.longitude?.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            {t("price")}
          </label>
          <input
            type="number"
            step="any"
            {...register("price")}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
          {errors.price && (
            <p className="mt-1 text-xs text-destructive">{errors.price.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            {t("size")}
          </label>
          <input
            type="number"
            step="any"
            {...register("size")}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
          {errors.size && (
            <p className="mt-1 text-xs text-destructive">{errors.size.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            {t("sizeUnit")}
          </label>
          <select
            {...register("sizeUnit")}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            {SIZE_UNITS.map((u) => (
              <option key={u} value={u}>
                {tUnit(u)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          {t("addressDetails")}
        </label>
        <input
          {...register("addressDetails")}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          {t("nearbyAttractions")}
        </label>
        <input
          {...register("nearbyAttractions")}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
      </div>

      <div className="rounded-lg border border-border p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              {t("sellerType")}
            </label>
            <select
              {...register("sellerType")}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="OWNER">{tAuth("owner")}</option>
              <option value="BROKER">{tAuth("broker")}</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              {t("contactName")}
            </label>
            <input
              {...register("contactName")}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              {t("contactPhone")}
            </label>
            <input
              {...register("contactPhone")}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              {t("contactEmail")}
            </label>
            <input
              type="email"
              {...register("contactEmail")}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          {t("photos")} / {t("videos")}
        </label>
        <p className="mb-2 text-xs text-muted-foreground">{t("uploadHint")}</p>

        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed border-border p-6 text-sm text-muted-foreground hover:bg-muted">
          <UploadCloud className="h-5 w-5" />
          {uploading ? t("submitting") : t("photos")}
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>

        {media.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
            {media.map((m) => (
              <div key={m.url} className="relative h-24 w-24 overflow-hidden rounded-md border border-border">
                {m.type === "IMAGE" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-black/70">
                    <PlayCircle className="h-6 w-6 text-white" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeMedia(m.url)}
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {media.length === 0 && (
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <ImageOff className="h-3.5 w-3.5" /> No media uploaded yet
          </div>
        )}
      </div>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <button
        type="submit"
        disabled={isSubmitting || uploading}
        className="rounded-md bg-primary px-4 py-2.5 font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
