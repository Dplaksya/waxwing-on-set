import { useMemo, useState, useCallback } from "react";

export function formatISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
export function formatMonthLabel(d) {
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long" });
}
function buildMonthGrid(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const jsDow = firstOfMonth.getDay();
  const mondayIndex = (jsDow + 6) % 7;
  const start = new Date(year, month, 1 - mondayIndex);
  const days = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}
export default function useCalendar(initialMonth = new Date()) {
  const [month, setMonth] = useState(new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1));
  const days = useMemo(() => buildMonthGrid(month), [month]);
  const goPrev = useCallback(() => setMonth((m)=> new Date(m.getFullYear(), m.getMonth()-1, 1)), []);
  const goNext = useCallback(() => setMonth((m)=> new Date(m.getFullYear(), m.getMonth()+1, 1)), []);
  const formatMonth = useCallback((d)=> formatMonthLabel(d), []);
  return { month, days, goPrev, goNext, formatMonth };
}
