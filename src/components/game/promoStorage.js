// src/components/game/promoStorage.js
/**
 * Promo state is strictly scoped to the CURRENT booking only.
 * - bookingKey = session quoteId + pkg + dates.
 * - Uses sessionStorage (ephemeral per tab/session).
 */

const QUOTE_ID_KEY = "ww_quote_id";
const WON_PREFIX = "ww_promo_won::";           // boolean
const APPLIED_PREFIX = "ww_promo_applied::";   // boolean

function ssGet(key, fallback) {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function ssSet(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

/** Create/read a per-tab quoteId so a fresh Quote flow = fresh id */
export function getQuoteId() {
  let id = sessionStorage.getItem(QUOTE_ID_KEY);
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem(QUOTE_ID_KEY, id);
  }
  return id;
}

/** Build a booking key using the session quoteId + minimal selections */
export function makeBookingKey({ pkg = "full", isoDates = [] }) {
  const quoteId = getQuoteId();
  const dates = Array.isArray(isoDates) ? isoDates.join(",") : String(isoDates || "");
  return `${quoteId}|${pkg}|${dates}`;
}

/** Has the game been WON for THIS booking key? */
export function hasWon(bookingKey) {
  return !!ssGet(`${WON_PREFIX}${bookingKey}`, false);
}

/** Mark WON for THIS booking key */
export function setWon(bookingKey) {
  ssSet(`${WON_PREFIX}${bookingKey}`, true);
}

/** Has the discount been APPLIED for THIS booking key? */
export function isDiscountApplied(bookingKey) {
  return !!ssGet(`${APPLIED_PREFIX}${bookingKey}`, false);
}

/** Mark APPLIED for THIS booking key */
export function setDiscountApplied(bookingKey) {
  ssSet(`${APPLIED_PREFIX}${bookingKey}`, true);
}

/** Optional: Clear ALL win/applied flags for the CURRENT quoteId (e.g., "Start new booking") */
export function clearCurrentQuoteWins() {
  const quoteId = getQuoteId();
  try {
    const keys = Object.keys(sessionStorage);
    for (const k of keys) {
      if (k.includes(quoteId) && (k.startsWith(WON_PREFIX) || k.startsWith(APPLIED_PREFIX))) {
        sessionStorage.removeItem(k);
      }
    }
  } catch {}
}
