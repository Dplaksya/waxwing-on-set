// src/components/quote/constants.js
// Quote flow constants ONLY. Do not mix game constants here.

// Re-export the date window used by the calendar & availability views.
export { MIN_DT, MAX_DT, DAYS_RANGE } from "./dateLimits.js";

// Optionally expose a few quote-specific params (safe defaults).
export const QUOTE_CURRENCY = "CAD";

// If you later add quote-specific tuning knobs, keep them here
// (e.g., default tax rate, display formats) — but DO NOT import or
// re-export any game timing constants from this file.
