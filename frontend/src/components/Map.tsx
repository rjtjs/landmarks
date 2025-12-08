import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { LngLat, PrecisionLevelType } from "@landmarks/shared";
import { MAP_CONFIG } from "@landmarks/shared";
import {
  getMarkerColor,
  getGuessCircleColors,
  getActualLocationCircleColors,
} from "../utils/mapStyles";
import {
  addGuessCircle,
  addActualLocationCircles,
  cleanupGuessCircle,
  cleanupActualLocationCircles,
} from "../utils/mapLayers";
import styles from "./Map.module.css";

interface MapProps {
  onLocationSelect: (location: LngLat) => void;
  guessLocation: LngLat | null;
  selectedPrecision: PrecisionLevelType;
  actualLocation?: LngLat;
  achievedPrecision?: PrecisionLevelType | null;
  disabled?: boolean;
}

export default function Map({
  onLocationSelect,
  guessLocation,
  selectedPrecision,
  actualLocation,
  achievedPrecision = null,
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

    const handleClick = (e: mapboxgl.MapMouseEvent) => {
      if (!disabled) {
        onLocationSelect({ lng: e.lngLat.lng, lat: e.lngLat.lat });
      }
    };

    map.current.on("click", handleClick);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [disabled, onLocationSelect]);

  useEffect(() => {
    if (!map.current || !guessLocation) return;

    const mapInstance = map.current;
    const markerColor = getMarkerColor(achievedPrecision, !!actualLocation);
    const circleColors = getGuessCircleColors(
      achievedPrecision,
      !!actualLocation,
    );

    guessMarker.current?.remove();
    cleanupGuessCircle(mapInstance);

    addGuessCircle(
      mapInstance,
      guessLocation,
      selectedPrecision,
      circleColors.fill,
      circleColors.border,
    );

    guessMarker.current = new mapboxgl.Marker({ color: markerColor })
      .setLngLat(guessLocation)
      .addTo(mapInstance);

    return () => {
      guessMarker.current?.remove();
      cleanupGuessCircle(mapInstance);
    };
  }, [guessLocation, selectedPrecision, achievedPrecision, actualLocation]);

  useEffect(() => {
    if (!map.current || !actualLocation) return;

    const mapInstance = map.current;
    const circleColors = getActualLocationCircleColors();

    actualMarker.current?.remove();
    cleanupActualLocationCircles(mapInstance);

    addActualLocationCircles(mapInstance, actualLocation, circleColors.exact);

    actualMarker.current = new mapboxgl.Marker({ color: "green" })
      .setLngLat(actualLocation)
      .addTo(mapInstance);

    if (guessLocation) {
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend([guessLocation.lng, guessLocation.lat]);
      bounds.extend([actualLocation.lng, actualLocation.lat]);

      mapInstance.fitBounds(bounds, {
        padding: MAP_CONFIG.resultBoundsPadding,
        maxZoom: MAP_CONFIG.maxZoomOnResult,
      });
    }

    return () => {
      actualMarker.current?.remove();
      cleanupActualLocationCircles(mapInstance);
    };
  }, [actualLocation, guessLocation]);

  return <div ref={mapContainer} className={styles.mapContainer} />;
}
