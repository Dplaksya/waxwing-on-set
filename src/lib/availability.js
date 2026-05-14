// src/lib/availability.js
/**
 * Return availability for an ISO date: 'available' | 'soft' | 'booked'
 * Replace with your backend/API once ready.
 */
const EXAMPLE = new Map([
    // Example: mark some dates this month
    // ["2025-09-12", "soft"],
    // ["2025-09-18", "booked"],
  ]);
  
  export function getAvailability(iso) {
    return EXAMPLE.get(iso) || "available";
  }
  