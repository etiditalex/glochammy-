"use client";

import type { StoreBranch } from "@/lib/data/store-locations";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

const KENYA_CENTER: [number, number] = [-0.5, 37.8];
const DEFAULT_ZOOM = 6;

function goldDivIcon() {
  return L.divIcon({
    className: "glochammy-leaflet-marker",
    html: `
      <svg width="32" height="40" viewBox="0 0 32 40" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C9.373 0 4 5.292 4 11.816c0 8.816 12 27.184 12 27.184s12-18.368 12-27.184C28 5.292 22.627 0 16 0z" fill="#8b6f4a" stroke="#5c4a32" stroke-width="1"/>
        <circle cx="16" cy="12" r="5" fill="#faf9f7"/>
      </svg>`,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -36],
  });
}

function FitBounds({ locations }: { locations: StoreBranch[] }) {
  const map = useMap();
  const ids = useMemo(() => locations.map((l) => l.id).join(","), [locations]);
  useEffect(() => {
    const points = locations.map((l) => [l.lat, l.lng] as [number, number]);
    if (points.length === 0) {
      map.setView(KENYA_CENTER, DEFAULT_ZOOM);
      return;
    }
    if (points.length === 1) {
      map.setView(points[0], 11);
      return;
    }
    const b = L.latLngBounds(points);
    map.fitBounds(b, { padding: [56, 56], maxZoom: 9 });
  }, [map, ids, locations]);
  return null;
}

function FlyToHighlight({
  branch,
  locationsLen,
}: {
  branch: StoreBranch | null;
  locationsLen: number;
}) {
  const map = useMap();
  const id = branch?.id ?? "";
  useEffect(() => {
    if (!branch || locationsLen === 0) return;
    map.flyTo([branch.lat, branch.lng], 11, { duration: 0.55 });
  }, [map, branch, id, locationsLen]);
  return null;
}

type StoreLocatorMapProps = {
  locations: StoreBranch[];
  highlightId: string | null;
};

export function StoreLocatorMap({
  locations,
  highlightId,
}: StoreLocatorMapProps) {
  const center: [number, number] =
    locations.length > 0
      ? [locations[0].lat, locations[0].lng]
      : KENYA_CENTER;
  const highlight =
    locations.find((l) => l.id === highlightId) ??
    locations[0] ??
    null;

  return (
    <MapContainer
      center={center}
      zoom={DEFAULT_ZOOM}
      className="z-0 h-full min-h-[420px] w-full bg-subtle lg:min-h-0"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <FitBounds locations={locations} />
      <FlyToHighlight branch={highlight} locationsLen={locations.length} />
      {locations.map((loc) => (
        <Marker
          key={loc.id}
          position={[loc.lat, loc.lng]}
          icon={goldDivIcon()}
        >
          <Popup>
            <div className="min-w-[180px] font-sans text-sm text-ink">
              <p className="font-display text-base font-medium">{loc.name}</p>
              <p className="text-xs text-muted">{loc.category}</p>
              <p className="mt-2 text-xs leading-relaxed">
                {loc.addressLines.join(", ")}
              </p>
              <a
                href={loc.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs font-medium text-accent underline"
              >
                Directions
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
