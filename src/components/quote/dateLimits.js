// Canonical booking date limits

function startOfDay(d){ const x = new Date(d); x.setHours(0,0,0,0); return x; }
function addMonths(d,n){ const x = new Date(d); x.setMonth(x.getMonth()+n); return x; }

// Today (no past bookings)
export const MIN_DT = startOfDay(new Date());

// Booking horizon: 12 months out (change 12 if you want)
export const MAX_DT = startOfDay(addMonths(new Date(), 12));

// Convenience for UIs that need “range in days”
export const DAYS_RANGE = Math.ceil((MAX_DT - MIN_DT) / (1000*60*60*24));
