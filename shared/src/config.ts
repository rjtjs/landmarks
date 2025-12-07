export const PRECISION_RADII_KM = {
  EXACT: 50,
  NARROW: 100,
  VAGUE: 250,
} as const;

export const PRECISION_POINTS = {
  EXACT: 25,
  NARROW: 10,
  VAGUE: 5,
} as const;

export const MAP_CONFIG = {
  maxZoomOnResult: 10,
  resultBoundsPadding: 100,
} as const;
