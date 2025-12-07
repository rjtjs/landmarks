import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { LngLat } from "@landmarks/shared";

mapboxgl.accessToken =
  (import.meta.env.VITE_MBX_TOKEN as string | undefined) || "";

export default function App() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);
  const [_location, _setLocation] = useState<LngLat | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [0, 20],
      zoom: 1.5,
    });

    map.current.on("click", (e) => {
      if (!map.current) return;

      if (marker) {
        marker.setLngLat(e.lngLat);
      } else {
        const newMarker = new mapboxgl.Marker({ color: "red" })
          .setLngLat(e.lngLat)
          .addTo(map.current);
        setMarker(newMarker);
      }
    });
  }, [marker]);

  return (
    <div>
      <h1>Click on the map to place a marker</h1>
      <div
        ref={mapContainer}
        style={{ width: "100%", height: "400px", border: "1px solid #ccc" }}
      />
    </div>
  );
}
