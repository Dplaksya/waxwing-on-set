// src/lib/quote/money.js
export function currency(n) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n);
}
