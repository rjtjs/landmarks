import type { Map } from "mapbox-gl";
import { circle } from "@turf/circle";
import type { LngLat } from "@landmarks/shared";
import { CORRECTNESS_DISTANCES_KM } from "@landmarks/shared";

export function addCircleToMap(
  map: Map,
  sourceId: string,
  layerId: string,
  location: LngLat,
  radiusKm: number,
  fillColor: string,
  borderColor: string,
  borderWidth: number = 2,
): void {
  const circleGeoJson = circle([location.lng, location.lat], radiusKm, {
    units: "kilometers",
  });

  map.addSource(sourceId, {
    type: "geojson",
    data: circleGeoJson,
  });

  map.addLayer({
    id: `${layerId}-fill`,
    type: "fill",
    source: sourceId,
    paint: {
      "fill-color": fillColor,
      "fill-opacity": 1,
    },
  });

  map.addLayer({
    id: `${layerId}-outline`,
    type: "line",
    source: sourceId,
    paint: {
      "line-color": borderColor,
      "line-width": borderWidth,
    },
  });
}

export function removeCircleFromMap(
  map: Map,
  sourceId: string,
  layerId: string,
): void {
  if (map.getSource(sourceId)) {
    map.removeLayer(`${layerId}-fill`);
    map.removeLayer(`${layerId}-outline`);
    map.removeSource(sourceId);
  }
}

export function addGuessCircle(
  map: Map,
  location: LngLat,
  fillColor: string,
  borderColor: string,
): void {
  removeCircleFromMap(map, "guess-circle", "guess-circle");
  addCircleToMap(
    map,
    "guess-circle",
    "guess-circle",
    location,
    CORRECTNESS_DISTANCES_KM.CORRECT,
    fillColor,
    borderColor,
  );
}

export function addActualLocationCircles(
  map: Map,
  location: LngLat,
  closeColors: { fill: string; border: string },
  correctColors: { fill: string; border: string },
): void {
  removeCircleFromMap(map, "actual-circle-close", "actual-circle-close");
  removeCircleFromMap(map, "actual-circle-correct", "actual-circle-correct");

  addCircleToMap(
    map,
    "actual-circle-close",
    "actual-circle-close",
    location,
    CORRECTNESS_DISTANCES_KM.CLOSE,
    closeColors.fill,
    closeColors.border,
  );

  addCircleToMap(
    map,
    "actual-circle-correct",
    "actual-circle-correct",
    location,
    CORRECTNESS_DISTANCES_KM.CORRECT,
    correctColors.fill,
    correctColors.border,
  );
}

export function cleanupGuessCircle(map: Map): void {
  removeCircleFromMap(map, "guess-circle", "guess-circle");
}

export function cleanupActualLocationCircles(map: Map): void {
  removeCircleFromMap(map, "actual-circle-close", "actual-circle-close");
  removeCircleFromMap(map, "actual-circle-correct", "actual-circle-correct");
}
