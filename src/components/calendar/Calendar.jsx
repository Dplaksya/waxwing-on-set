// src/components/calendar/Calendar.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { getAvailability } from "../../lib/availability.js";

/** Utilities */
function pad2(n) { return String(n).padStart(2, "0"); }
export function formatISO(d) { return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; }
function parseISO(s) { const [y,m,d] = s.split("-").map(Number); return new Date(y, m-1, d); }
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function isSameDay(a, b) { return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }
function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function endOfMonth(d) { return new Date(d.getFullYear(), d.getMonth() + 1, 0); }

/** Sunday-start month grid */
function buildMonthDays(cursor) {
  const first = startOfMonth(cursor);
  const last = endOfMonth(cursor);
  const days = [];
  const lead = first.getDay(); // 0 = Sun
  for (let i = 0; i < lead; i++) days.push(null);
  for (let d = 1; d <= last.getDate(); d++) {
    days.push(new Date(first.getFullYear(), first.getMonth(), d));
  }
  while (days.length % 7 !== 0) days.push(null);
  return days;
}

/** Sunday-first labels */
const WK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Unified Calendar
 * - variant: "select" | "preview"
 * - selectionMode: "single" | "multi" | "range"
 * - selected: ISO[]
 * - onChange(isos[]) and/or onToggle(iso)
 */
export default function Calendar({
  selected = [],
  onChange,
  onToggle,
  selectionMode = "single",
  variant = "select",
  readOnly: readOnlyProp = false,
  size = "sm",
  showLegend: showLegendProp,
  showNav = true,
  legendPosition,
}) {
  const today = new Date();
  const [cursor, setCursor] = useState(() => startOfMonth(today));
  const readOnly = variant === "preview" ? true : readOnlyProp;
  const showLegend = showLegendProp ?? (variant === "preview");
  const legendPos = !showLegend ? "none" : (legendPosition || "below");
  const isPreview = variant === "preview";
  const disableSofts = true; // unselectable soft holds site-wide

  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const days = useMemo(() => buildMonthDays(cursor), [cursor]);
  const monthIndex = cursor.getMonth();
  const year = cursor.getFullYear();

  const sizes = size === "lg"
    ? { text: "text-lg", cell: "gap-2", wk: "text-sm", chip: "w-9 h-9" }
    : { text: "text-base", cell: "gap-1", wk: "text-xs", chip: "w-8 h-8" };

  const monthName = cursor.toLocaleString("en-US", { month: "long", year: "numeric" });
  const goto = (delta) => setCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));

  /** Drag state for range selection */
  const dragging = useRef(false);
  const dragStart = useRef(null); // Date
  const [hoverRange, setHoverRange] = useState([]); // ISO[]
  const [hoverIso, setHoverIso] = useState(null);

  useEffect(() => {
    // End drag even if mouseup happens outside the grid
    function endDrag() {
      if (!dragging.current) return;
      dragging.current = false;
      if (selectionMode === "range" && hoverRange.length && onChange) {
        onChange([...hoverRange]);
      }
      setHoverRange([]);
      dragStart.current = null;
    }
    window.addEventListener("mouseup", endDrag);
    window.addEventListener("mouseleave", endDrag);
    return () => {
      window.removeEventListener("mouseup", endDrag);
      window.removeEventListener("mouseleave", endDrag);
    };
  }, [hoverRange, onChange, selectionMode]);

  function rangeBetween(a, b) {
    const start = a < b ? a : b;
    const end = a < b ? b : a;
    const out = [];
    for (let d = start; !isSameDay(d, addDays(end, 1)); d = addDays(d, 1)) {
      out.push(formatISO(d));
    }
    return out;
  }

  /** Legend (dimmed in preview) */
  const Legend = () => (
    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
      <span className={`${isPreview ? "bg-[color:var(--ww-yellow,#F8AF51)]/12" : "bg-[color:var(--ww-yellow,#F8AF51)]/18"} inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-black/80`}>
        <span className="text-[11px]" aria-hidden>⏳</span> Soft hold (48h)
      </span>
      <span className={`${isPreview ? "bg-[color:var(--ww-red,#E11D48)]/12" : "bg-[color:var(--ww-red,#E11D48)]/18"} inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-black/80`}>
        <span className="text-[11px]" aria-hidden>🔒</span> Booked
      </span>
      <span className={`${isPreview ? "bg-[color:var(--ww-mint,#EAF7EE)]/70" : "bg-[color:var(--ww-mint,#EAF7EE)]"} inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-black/80`}>
        <span className="text-[11px]" aria-hidden>✅</span> Today
      </span>
    </div>
  );

  function isSelectedISO(iso) {
    return hoverRange.length > 0 ? hoverRange.includes(iso) : selectedSet.has(iso);
  }

  return (
    <div className="w-full select-none">
      {/* Header / Nav */}
      {showNav && (
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => goto(-1)}
            className="rounded-lg px-2 py-1 text-sm hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-[color:var(--ww-orange)] focus-visible:ring-offset-2"
            aria-label="Previous month"
          >
            ←
          </button>
          <div className="font-medium">{monthName}</div>
          <button
            type="button"
            onClick={() => goto(1)}
            className="rounded-lg px-2 py-1 text-sm hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-[color:var(--ww-orange)] focus-visible:ring-offset-2"
            aria-label="Next month"
          >
            →
          </button>
        </div>
      )}

      {/* Legend ABOVE */}
      {legendPos === "above" && <Legend />}

      {/* Weekday header */}
      <div className={["grid grid-cols-7 text-center text-black/60", sizes.wk].join(" ")} aria-hidden="true">
        {WK.map((w) => (<div key={w} className="py-1">{w}</div>))}
      </div>

      {/* Days grid */}
      <div
        className={["grid grid-cols-7", sizes.cell].join(" ")}
        onMouseLeave={() => setHoverIso(null)}
      >
        {days.map((d, i) => {
          if (!d) return <div key={`pad-${i}`} className="opacity-0" />;
          const iso = formatISO(d);
          const inMonth = d.getMonth() === monthIndex && d.getFullYear() === year;
          const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const isPast = d < todayMid;

          const raw = getAvailability(iso);
          const status = typeof raw === "string" ? raw : (raw?.status || "available");
          const holdUntil = typeof raw === "object" && raw?.until ? new Date(raw.until) : null;

          const blocked = isPast || status === "booked" || (disableSofts && status === "soft");
          const isToday = isSameDay(d, today);
          const selectedHere = isSelectedISO(iso);

          const bookedBg = isPreview ? "bg-[color:var(--ww-red,#E11D48)]/12" : "bg-[color:var(--ww-red,#E11D48)]/18";
          const softBg   = isPreview ? "bg-[color:var(--ww-yellow,#F8AF51)]/12" : "bg-[color:var(--ww-yellow,#F8AF51)]/18";
          const todayBg  = isPreview ? "bg-[color:var(--ww-mint,#EAF7EE)]/70" : "bg-[color:var(--ww-mint,#EAF7EE)]";

          let title = "";
          if (isPast) title = "Past date — unavailable";
          else if (status === "booked") title = "Booked — unavailable";
          else if (status === "soft") {
            if (holdUntil && !isNaN(holdUntil)) {
              const when = holdUntil.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
              title = `Soft hold until ${when}`;
            } else {
              title = "Soft hold (releases within ~48h)";
            }
          } else title = "Available";

          function commitClick() {
            if (readOnly || blocked) return;
            if (selectionMode === "single") {
              onChange?.([iso]);
              onToggle?.(iso);
            } else if (selectionMode === "multi") {
              const next = new Set(selected);
              next.has(iso) ? next.delete(iso) : next.add(iso);
              const arr = [...next].sort();
              onChange?.(arr);
              onToggle?.(iso);
            } else if (selectionMode === "range") {
              // Single click = single-day range
              onChange?.([iso]);
            }
          }

          function onMouseDown() {
            if (readOnly || blocked || selectionMode !== "range") return;
            dragging.current = true;
            dragStart.current = d;
            setHoverRange([iso]);
          }
          function onMouseEnterCell() {
            setHoverIso(iso);
            if (!dragging.current || selectionMode !== "range") return;
            const start = dragStart.current;
            const list = rangeBetween(start, d);
            setHoverRange(list);
          }
          function onMouseUpCell() {
            if (!dragging.current) return;
            dragging.current = false;
            if (selectionMode === "range" && hoverRange.length && onChange) {
              onChange([...hoverRange]);
            }
            setHoverRange([]);
            dragStart.current = null;
          }

          const hoverablePreview = isPreview && !blocked;
          const hoverHalo = hoverablePreview && hoverIso === iso;

          return (
            <button
              key={iso}
              type="button"
              onClick={commitClick}
              onMouseDown={onMouseDown}
              onMouseEnter={onMouseEnterCell}
              onMouseUp={onMouseUpCell}
              title={title}
              aria-label={iso}
              aria-disabled={blocked}
              aria-pressed={selectedHere}
              className={[
                "relative rounded-xl border border-black/5 bg-white transition",
                hoverHalo ? "shadow-[0_0_0_2px_rgba(34,197,94,0.25)] -translate-y-[1px]" : "",
                blocked ? (isPreview ? "cursor-default opacity-60" : "cursor-not-allowed opacity-50") : "cursor-pointer",
              ].join(" ")}
              style={{ aspectRatio: "1 / 1" }}
              onMouseLeave={() => hoverIso === iso && setHoverIso(null)}
            >
              {/* Soft/booked/today chips behind the number if not selected */}
              {!selectedHere && (
                <div className="absolute inset-0 grid place-items-center">
                  <span className={[
                    "rounded-full",
                    isToday ? todayBg : "",
                    status === "booked" ? bookedBg : "",
                    status === "soft" ? softBg : "",
                    sizes.chip,
                  ].join(" ")} />
                </div>
              )}

              {/* Selection = GREEN OUTLINE ONLY (no fill) */}
              {selectedHere && (
                <span className="absolute inset-1 rounded-xl ring-2 ring-[color:var(--ww-green,#22C55E)] pointer-events-none" />
              )}

              {/* Number layer */}
              <div className="absolute inset-0 flex items-center justify-center" style={{ opacity: inMonth ? 1 : 0.35 }}>
                <span className={["relative z-10", sizes.text, "font-medium text-black"].join(" ")}>
                  {d.getDate()}
                </span>
                {status === "booked" && (
                  <span className="absolute top-1 right-1 text-[10px] leading-none select-none" aria-hidden>🔒</span>
                )}
                {isToday && !selectedHere && <span className="absolute inset-0 rounded-xl ring-1 ring-[color:var(--ww-mint,#EAF7EE)] pointer-events-none" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend BELOW */}
      {legendPos === "below" && <Legend />}
    </div>
  );
}
