import { z } from "zod";

export const LngLatSchema = z.object({
  lng: z.number().min(-180).max(180),
  lat: z.number().min(-90).max(90),
});

export type LngLat = z.infer<typeof LngLatSchema>;

export const PrecisionLevelEnum = z.enum(["EXACT", "NARROW", "VAGUE"]);

export type PrecisionLevel = z.infer<typeof PrecisionLevelEnum>;

export const PrecisionLevel = {
  EXACT: "EXACT" as const,
  NARROW: "NARROW" as const,
  VAGUE: "VAGUE" as const,
} as const;

export const GuessSchema = z.object({
  landmarkId: z.string().min(1),
  location: LngLatSchema,
  precision: PrecisionLevelEnum,
});

export type Guess = z.infer<typeof GuessSchema>;

export const GuessResultSchema = z.object({
  isCorrect: z.boolean(),
  achievedPrecision: PrecisionLevelEnum.nullable(),
  actualLocation: LngLatSchema,
  distanceKm: z.number().min(0),
  wikiSummary: z.string(),
  wikiUrl: z.url(),
});

export type GuessResult = z.infer<typeof GuessResultSchema>;

export const LandmarkSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  location: LngLatSchema,
  detailsUrl: z.url(),
  images: z.array(z.url()).min(1),
});

export type Landmark = z.infer<typeof LandmarkSchema>;

export const LandmarkWithoutLocationSchema = LandmarkSchema.omit({
  location: true,
});

export type LandmarkWithoutLocation = z.infer<
  typeof LandmarkWithoutLocationSchema
>;
