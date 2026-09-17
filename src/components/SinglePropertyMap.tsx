"use client";

import dynamic from "next/dynamic";

const PropertiesMap = dynamic(() => import("./PropertiesMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[300px] items-center justify-center rounded-xl border border-border bg-muted text-sm text-muted-foreground">
      Loading map…
    </div>
  ),
});

export default function SinglePropertyMap({
  id,
  title,
  price,
  latitude,
  longitude,
}: {
  id: string;
  title: string;
  price: number;
  latitude: number;
  longitude: number;
}) {
  return (
    <PropertiesMap
      properties={[{ id, title, price, latitude, longitude }]}
      height={300}
      zoom={14}
    />
  );
}
