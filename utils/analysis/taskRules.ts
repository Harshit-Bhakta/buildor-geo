export type RuleError =
  | "CRS_MISMATCH"
  | "BUFFER_BEFORE_CRS"
  | "MISSING_BUFFER"
  | "SJOIN_PREDICATE";

export const floodBufferTask = {
  id: "flood-buffer-kerala",

  rules: [
    {
      id: "CRS_MISMATCH" as RuleError,
      check: (code: string) =>
        !code.includes(".to_crs"),
    },
    {
      id: "BUFFER_BEFORE_CRS" as RuleError,
      check: (code: string) =>
        code.includes(".buffer") && !code.includes(".to_crs"),
    },
    {
      id: "MISSING_BUFFER" as RuleError,
      check: (code: string) =>
        !code.includes(".buffer(5000)"),
    },
    {
      id: "SJOIN_PREDICATE" as RuleError,
      check: (code: string) =>
        !code.includes("predicate"),
    },
  ],
};
