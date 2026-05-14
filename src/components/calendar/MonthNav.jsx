// src/components/calendar/MonthNav.jsx
import React from "react";
import { addMonths } from "./useCalendar.jsx";

export default function MonthNav({ cursor, setCursor }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <button className="px-2 py-1 rounded bg-black/5" onClick={() => setCursor(addMonths(cursor, -1))}>←</button>
      <div className="font-semibold">
        {cursor.toLocaleString(undefined, { month: "long", year: "numeric" })}
      </div>
      <button className="px-2 py-1 rounded bg-black/5" onClick={() => setCursor(addMonths(cursor, 1))}>→</button>
    </div>
  );
}
