/** ISR revalidate windows (seconds) — single source of truth */
export const REVALIDATE = {
  /** Product catalog, charity list, blog index */
  CATALOG: 300,
  /** Event listings (may change more often) */
  EVENTS: 120,
  /** Legal / static content */
  STATIC: 86_400,
} as const;
