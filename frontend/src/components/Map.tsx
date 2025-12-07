import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { LngLat, PrecisionLevelType } from "@landmarks/shared";
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
  const mapLoaded = useRef(false);

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

    map.current.on("load", () => {
      mapLoaded.current = true;
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        mapLoaded.current = false;
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
    if (!map.current || !guessLocation || !mapLoaded.current) return;

    const mapInstance = map.current;
    const markerColor = getMarkerColor(achievedPrecision, !!actualLocation);
    const circleColors = getGuessCircleColors(
      achievedPrecision,
      !!actualLocation,
    );

    if (guessMarker.current) {
      guessMarker.current.remove();
    }

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
      if (guessMarker.current) {
        guessMarker.current.remove();
        guessMarker.current = null;
      }
      cleanupGuessCircle(mapInstance);
    };
  }, [guessLocation, selectedPrecision, achievedPrecision, actualLocation]);

  useEffect(() => {
    if (!map.current || !actualLocation || !mapLoaded.current) return;

    const mapInstance = map.current;
    const circleColors = getActualLocationCircleColors();

    if (actualMarker.current) {
      actualMarker.current.remove();
    }

    addActualLocationCircles(mapInstance, actualLocation, circleColors.exact);

    actualMarker.current = new mapboxgl.Marker({ color: "green" })
      .setLngLat(actualLocation)
      .addTo(mapInstance);

    return () => {
      if (actualMarker.current) {
        actualMarker.current.remove();
        actualMarker.current = null;
      }
      cleanupActualLocationCircles(mapInstance);
    };
  }, [actualLocation]);

  return <div ref={mapContainer} className={styles.mapContainer} />;
}
