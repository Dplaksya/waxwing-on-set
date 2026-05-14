// Call this when a brand-new booking flow begins
export function beginNewBookingSession(id = Date.now().toString()) {
  // mark a fresh session (useful if you want to track/compare later)
  sessionStorage.setItem("waxwing_quote_session", id);

  // reset any prior game claim/auto-apply so the CTA is fresh
  localStorage.removeItem("waxwing_game_claimed");
  localStorage.removeItem("waxwing_autoapply_code");
}
