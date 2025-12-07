import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { LngLat } from "@landmarks/shared";
import styles from "./Map.module.css";

interface MapProps {
  onLocationSelect: (location: LngLat) => void;
  guessLocation: LngLat | null;
  actualLocation?: LngLat;
  correctnessColor?: "red" | "yellow" | "green";
  disabled?: boolean;
}

export default function Map({
  onLocationSelect,
  guessLocation,
  actualLocation,
  correctnessColor = "red",
  disabled = false,
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const guessMarker = useRef<mapboxgl.Marker | null>(null);
  const actualMarker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    mapboxgl.accessToken =
      (import.meta.env.VITE_MBX_TOKEN as string | undefined) || "";

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [0, 20],
      zoom: 1.5,
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    const handleClick = (e: mapboxgl.MapMouseEvent) => {
      if (disabled) return;
      onLocationSelect({ lng: e.lngLat.lng, lat: e.lngLat.lat });
    };

    map.current.on("click", handleClick);

    return () => {
      map.current?.off("click", handleClick);
    };
  }, [disabled, onLocationSelect]);

  useEffect(() => {
    if (!map.current || !guessLocation) return;

    if (guessMarker.current) {
      guessMarker.current.remove();
    }

    guessMarker.current = new mapboxgl.Marker({ color: correctnessColor })
      .setLngLat(guessLocation)
      .addTo(map.current);

    return () => {
      if (guessMarker.current) {
        guessMarker.current.remove();
        guessMarker.current = null;
      }
    };
  }, [guessLocation, correctnessColor]);

  useEffect(() => {
    if (!map.current || !actualLocation) return;

    if (actualMarker.current) {
      actualMarker.current.remove();
    }

    actualMarker.current = new mapboxgl.Marker({ color: "green" })
      .setLngLat(actualLocation)
      .addTo(map.current);

    return () => {
      if (actualMarker.current) {
        actualMarker.current.remove();
        actualMarker.current = null;
      }
    };
  }, [actualLocation]);

  return <div ref={mapContainer} className={styles.mapContainer} />;
}
