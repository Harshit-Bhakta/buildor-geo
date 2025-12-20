import { RuleError } from "./taskRules";

const hints: Record<RuleError, string[]> = {
  CRS_MISMATCH: [
    "Your datasets may be using different coordinate systems.",
    "Distance-based operations require a projected CRS.",
    "Try converting both datasets using `.to_crs(epsg=32643)`.",
  ],

  BUFFER_BEFORE_CRS: [
    "Buffering geographic coordinates can give incorrect results.",
    "Convert CRS before applying buffer.",
  ],

  MISSING_BUFFER: [
    "This task requires identifying features within 5km.",
    "Try using `.buffer(5000)` to represent a 5km buffer.",
  ],

  SJOIN_PREDICATE: [
    "Your spatial join is missing a condition.",
    "Try adding `predicate='intersects'` to your spatial join.",
  ],
};

export function getHint(error: RuleError, attempt: number): string {
  const list = hints[error];
  return list[Math.min(attempt, list.length - 1)];
}
