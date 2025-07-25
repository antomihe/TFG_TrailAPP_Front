'use client';

import { Map, GeoJson, GeoJsonFeature } from "pigeon-maps";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Small } from "./typography";

type Props = {
  latitude: number;
  longitude: number;
  zoom?: number;
};

function MapHeader({ latitude, longitude, zoom = 10 }: Props) {
  const { theme } = useTheme();
  const [tilesUrl, setTilesUrl] = useState("");

  const geoJsonFeature = {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [+longitude, +latitude],
    },
    properties: { description: "Ubicación del evento" },
  };

  useEffect(() => {
    const url =
      theme === "dark"
        ? "https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
        : "https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png";
    setTilesUrl(url);
  }, [theme]);

  if (!tilesUrl) {
    return null;
  }

  if (!latitude || !longitude || latitude === 0 && longitude === 0) return (
    <div className="flex flex-col items-center justify-center h-full">
      <div style={{ opacity: 0.8 }}>
        <Image src="/map-not-avaible.png" alt="Mapa no disponible" width={120} height={60} />
      </div>
      <Small className="text-muted text-center mt-2">Ubicación no disponible</Small>
    </div>

  )

  return (
    <Map
      defaultCenter={[+latitude, +longitude]} 
      defaultZoom={zoom}
      provider={(x, y, z) => tilesUrl.replace("{z}", z.toString()).replace("{x}", x.toString()).replace("{y}", y.toString())}
    >
      <GeoJson
        svgAttributes={{
          fill: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(204, 204, 204, 0.7)",
          strokeWidth: "1",
          stroke: "white",
          r: "30",
        }}
      >
        <GeoJsonFeature feature={geoJsonFeature} />
      </GeoJson>
    </Map>
  );
}

export { MapHeader };
