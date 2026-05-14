// src/lib/quote/dates.js
export function summarizeDates(dates = []) {
  if (!dates || dates.length === 0) return "No dates selected";
  const list = [...dates].sort();
  if (list.length === 1) return new Date(list[0]).toLocaleDateString();
  return list.map((d) => new Date(d).toLocaleDateString()).join(" · ");
}
