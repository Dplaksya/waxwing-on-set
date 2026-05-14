// src/components/calendar/CalendarGrid.jsx
import React from "react";
import { formatISO } from "./Calendar.jsx";
import { getAvailability } from "../../lib/availability.js";

const WK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CalendarGrid({
  days,
  month,
  selectedSet,
  onToggle,
  size = "sm",
  readOnly = false,
}) {
  const sizes =
    size === "xs"
      ? { cell: "h-9 md:h-10", text: "text-[11px]", head: "text-[10px] md:text-[11px]" }
      : size === "sm"
      ? { cell: "h-11 md:h-12", text: "text-xs", head: "text-[11px] md:text-xs" }
      : { cell: "h-12 md:h-14", text: "text-sm", head: "text-xs" };

  return (
    <div>
      {/* Week headers */}
      <div className="grid grid-cols-7 gap-2 mb-1 text-[11px] text-[color:var(--ww-muted)]">
        {WK.map((w) => (
          <div key={w} className="py-1 text-center">
            {w}
          </div>
        ))}
      </div>

      {/* Grid with comfy spacing; rings-only (no fills anywhere) */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((d, i) => {
          if (!d) return <div key={`b${i}`} className="aspect-square" aria-hidden="true" />;

          const iso = formatISO(d);
          const inMonth = d.getMonth() === month;
          const status = getAvailability(iso); // 'available' | 'soft' | 'booked'
          const selected = selectedSet?.has?.(iso);
          const disabled = status === "booked";

          const handle = () => {
            if (readOnly || disabled) return;
            onToggle?.(iso);
          };

          return (
            <button
              key={iso}
              type="button"
              onClick={handle}
              aria-label={iso}
              aria-disabled={disabled}
              aria-selected={Boolean(selected)}
              className={[
                "relative select-none rounded-xl border border-black/5 bg-white",
                "focus-visible:ring-2 focus-visible:ring-[color:var(--ww-orange)] focus-visible:ring-offset-2",
                disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-black/5",
              ].join(" ")}
              style={{ aspectRatio: "1 / 1" }}
            >
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ opacity: inMonth ? 1 : 0.35 }}
              >
                <span
                  className={[
                    "tabular-nums relative grid place-items-center rounded-full bg-transparent",
                    sizes.text,
                  ].join(" ")}
                  style={{ width: "2rem", height: "2rem", background: "transparent" }}
                >
                  <span className="relative z-10">{d.getDate()}</span>

                  {/* Rings only, no fills */}
                  <span
                    aria-hidden="true"
                    className={[
                      "absolute inset-0 rounded-full bg-transparent",
                      selected ? "ring-selected" : "",
                      status === "soft" ? "ring-soft" : "",
                      status === "booked" ? "ring-booked" : "",
                    ].join(" ")}
                    style={{ background: "transparent" }}
                  />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
