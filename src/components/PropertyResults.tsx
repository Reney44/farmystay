"use client";

import { useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { LayoutGrid, Map as MapIcon } from "lucide-react";

const PropertiesMap = dynamic(() => import("./PropertiesMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] items-center justify-center rounded-xl border border-border bg-muted text-sm text-muted-foreground">
      Loading map…
    </div>
  ),
});

type MapProperty = {
  id: string;
  title: string;
  price: number | null;
  latitude: number | null;
  longitude: number | null;
};

export default function PropertyResults({
  properties,
  children,
}: {
  properties: MapProperty[];
  children: ReactNode;
}) {
  const [view, setView] = useState<"list" | "map">("list");

  return (
    <div>
      <div className="mb-4 flex justify-end gap-1 rounded-md border border-border bg-card p-1">
        <button
          onClick={() => setView("list")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
            view === "list"
              ? "bg-primary text-primary-foreground"
              : "text-foreground hover:bg-muted"
          }`}
        >
          <LayoutGrid className="h-4 w-4" /> List
        </button>
        <button
          onClick={() => setView("map")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
            view === "map"
              ? "bg-primary text-primary-foreground"
              : "text-foreground hover:bg-muted"
          }`}
        >
          <MapIcon className="h-4 w-4" /> Map
        </button>
      </div>

      {view === "list" ? children : <PropertiesMap properties={properties} />}
    </div>
  );
}
