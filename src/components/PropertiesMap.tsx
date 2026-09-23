"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { createPinIcon } from "@/lib/leaflet-icon";
import { formatINR } from "@/lib/format";

const DEFAULT_CENTER: [number, number] = [10.3, 77.18];
const pinIcon = createPinIcon("#2f5233");

type MapProperty = {
  id: string;
  title: string;
  price: number | null;
  latitude: number | null;
  longitude: number | null;
};

export default function PropertiesMap({
  properties,
  height = 500,
  zoom = 12,
}: {
  properties: MapProperty[];
  height?: number;
  zoom?: number;
}) {
  const pinned = properties.filter(
    (p) => p.latitude != null && p.longitude != null
  );

  const center: [number, number] =
    pinned.length > 0
      ? [pinned[0].latitude as number, pinned[0].longitude as number]
      : DEFAULT_CENTER;

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: `${height}px`, width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pinned.map((p) => (
          <Marker
            key={p.id}
            position={[p.latitude as number, p.longitude as number]}
            icon={pinIcon}
          >
            <Popup>
              <a href={`/property/${p.id}`} className="font-medium text-primary hover:underline">
                {p.title}
              </a>
              <p className="text-sm">{formatINR(p.price)}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
