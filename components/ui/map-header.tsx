'use client';

import { Map, GeoJson, GeoJsonFeature } from "pigeon-maps";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type Props = {
  coordinates: [number, number]; // [latitude, longitude]
  zoom?: number;
};

function MapHeader({ coordinates, zoom = 10 }: Props) {
  const { theme } = useTheme();
  const [tilesUrl, setTilesUrl] = useState("");

  const geoJsonFeature = {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [+coordinates[1], +coordinates[0]], // GeoJSON usa formato [longitude, latitude]
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

  return (
    <Map
      defaultCenter={[+coordinates[0], +coordinates[1]]}
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
