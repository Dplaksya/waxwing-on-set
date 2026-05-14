// src/hooks/useQuotePricing.js
import { ADDONS as ADDON_GROUPS } from "../components/quote/AddonsGrid.jsx";

const BASE = {
  full: 1200,
  roll: 500,
};
const HALF_DAY_FACTOR = 0.6; // 60% of day rate

function addonPriceMap() {
  const m = new Map();
  for (const g of ADDON_GROUPS) {
    for (const it of g.items) m.set(it.id, it.price);
  }
  return m;
}

export function useQuotePricing({ dates = [], pkg, halfDay, addons = [] }) {
  const days = Array.isArray(dates) ? dates.length : 0;
  const basePerDay = pkg ? (halfDay ? (BASE[pkg] * HALF_DAY_FACTOR) : BASE[pkg]) : 0;
  const addonMap = addonPriceMap();
  const addonsPerDay = addons.reduce((sum, id) => sum + (addonMap.get(id) || 0), 0);

  const base = basePerDay * days;
  const addonsCost = addonsPerDay * days;
  const total = base + addonsCost;

  return { days, basePerDay, base, addons: addonsCost, total };
}
