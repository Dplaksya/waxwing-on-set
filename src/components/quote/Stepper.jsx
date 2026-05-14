import React from "react";

const STEPS = ["dates", "package", "services", "review"];
export default function Stepper({ value = "dates" }) {
  return (
    <div className="flex items-center gap-2 text-sm mb-6" aria-label="Steps">
      {STEPS.map((s, i) => {
        const active = s === value;
        return (
          <div key={s} className="flex items-center gap-2">
            <div
              className={[
                "size-6 rounded-full grid place-items-center border border-black/10",
                active ? "bg-black text-white" : "bg-white text-black"
              ].join(" ")}
            >
              {i + 1}
            </div>
            <div className={active ? "font-semibold" : "text-black/70"}>
              {s[0].toUpperCase() + s.slice(1)}
            </div>
            {i < STEPS.length - 1 && <div className="w-6 h-px bg-black/20" />}
          </div>
        );
      })}
    </div>
  );
}
