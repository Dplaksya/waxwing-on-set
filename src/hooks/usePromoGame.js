// src/hooks/useQuotePricing.js
import { useMemo } from "react";
import { PACKAGES, ADDONS_BY_ID } from "../lib/quote/config.js";

export function useQuotePricing({ dates = [], pkg = "full", halfDay = false, addons = new Set() }) {
  return useMemo(() => {
    const days = dates.length;
    const pkgCfg = PACKAGES[pkg];

    const lineItems = [];

    // package line
    const dayRate = halfDay && pkg === "full" ? pkgCfg.half : pkgCfg.day;
    const pkgTotal = dayRate * days;
    lineItems.push({
      label: `${pkgCfg.label}${halfDay && pkg === "full" ? " — Half-day" : ""} × ${days} day${days !== 1 ? "s" : ""}`,
      amount: pkgTotal,
    });

    // add-ons
    let addonsTotal = 0;
    for (const id of addons) {
      const a = ADDONS_BY_ID[id];
      if (!a) continue;
      const amt = a.perDay ? a.price * days : a.price;
      addonsTotal += amt;
      lineItems.push({ label: `${a.label}${a.perDay ? ` × ${days} day${days !== 1 ? "s" : ""}` : ""}`, amount: amt });
    }

    const subtotal = pkgTotal + addonsTotal;
    const tax = Math.round(subtotal * 0.13 * 100) / 100;
    const total = subtotal + tax;

    return { days, lineItems, subtotal, tax, total };
  }, [dates, pkg, halfDay, addons]);
}
