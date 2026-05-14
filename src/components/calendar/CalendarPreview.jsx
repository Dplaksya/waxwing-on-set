// src/components/calendar/CalendarPreview.jsx
import React, { useMemo } from "react";
import Container from "../ui/Container.jsx";
import Calendar from "./Calendar.jsx";

function buildPlaceholders(base = new Date()) {
  const y = base.getFullYear();
  const m = base.getMonth();
  const last = new Date(y, m + 1, 0).getDate();
  const booked = new Set();
  const soft = new Set();
  for (let d = 1; d <= last; d++) {
    const iso = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    if (d % 7 === 0) booked.add(iso);
    else if (d % 5 === 0) soft.add(iso);
  }
  return { booked, soft };
}

export default function CalendarPreview() {
  const now = useMemo(() => new Date(), []);
  const placeholders = useMemo(() => buildPlaceholders(now), [now]); // reserved for API wiring

  return (
    <section className="ww-section">
      <Container>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left: Copy + CTA */}
          <div className="order-1">
            <span className="ww-kicker">Availability</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-[color:var(--ww-brown)]">
              Live Availability
            </h2>
            <p className="mt-3 text-[color:var(--ww-muted)]">
              Plan your shoot dates here. Book in the quote flow—dates with a ring are held or
              booked.
            </p>

            {/* Legend (Selected removed) */}
            <div
              className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[color:var(--ww-muted)]"
              aria-label="Calendar legend"
            >
              <div className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-[color:var(--ww-yellow)]" />
                <span>Soft hold (48h)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-[#D6432F]" />
                <span>Booked</span>
              </div>
            </div>

            <a href="/quote#dates" className="mt-6 inline-flex">
              <span className="inline-flex items-center justify-center h-11 px-5 rounded-xl bg-[color:var(--ww-orange)] text-white font-medium hover:brightness-95 active:brightness-90">
                Check dates & start a quote
              </span>
            </a>
          </div>

          {/* Right: Calendar preview (read-only) */}
          <div className="order-2">
            <Calendar selected={[]} onToggle={() => {}} readOnly />
          </div>
        </div>
      </Container>
    </section>
  );
}
