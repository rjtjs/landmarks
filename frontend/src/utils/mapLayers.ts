import type { Map } from "mapbox-gl";
import { circle } from "@turf/circle";
import type { LngLat, PrecisionLevelType } from "@landmarks/shared";
import { PRECISION_RADII_KM } from "@landmarks/shared";

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
  precision: PrecisionLevelType,
  fillColor: string,
  borderColor: string,
): void {
  removeCircleFromMap(map, "guess-circle", "guess-circle");
  const radiusKm = PRECISION_RADII_KM[precision];
  addCircleToMap(
    map,
    "guess-circle",
    "guess-circle",
    location,
    radiusKm,
    fillColor,
    borderColor,
  );
}

export function addActualLocationCircles(
  map: Map,
  location: LngLat,
  narrowColors: { fill: string; border: string },
  exactColors: { fill: string; border: string },
): void {
  removeCircleFromMap(map, "actual-circle-narrow", "actual-circle-narrow");
  removeCircleFromMap(map, "actual-circle-exact", "actual-circle-exact");

  addCircleToMap(
    map,
    "actual-circle-narrow",
    "actual-circle-narrow",
    location,
    PRECISION_RADII_KM.NARROW,
    narrowColors.fill,
    narrowColors.border,
  );

  addCircleToMap(
    map,
    "actual-circle-exact",
    "actual-circle-exact",
    location,
    PRECISION_RADII_KM.EXACT,
    exactColors.fill,
    exactColors.border,
  );
}

export function cleanupGuessCircle(map: Map): void {
  removeCircleFromMap(map, "guess-circle", "guess-circle");
}

export function cleanupActualLocationCircles(map: Map): void {
  removeCircleFromMap(map, "actual-circle-narrow", "actual-circle-narrow");
  removeCircleFromMap(map, "actual-circle-exact", "actual-circle-exact");
}
