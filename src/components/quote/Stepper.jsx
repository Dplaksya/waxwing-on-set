import React from "react";

const STEPS = ["dates", "package", "services", "review"];

export default function Stepper({ value = "dates" }) {
  const currentIndex = STEPS.indexOf(value);

  return (
    <>
      {/* DESKTOP */}
      <div
        className="hidden sm:flex items-center gap-2 text-sm mb-6"
        aria-label="Steps"
      >
        {STEPS.map((s, i) => {
          const active = s === value;
          const complete = i < currentIndex;

          return (
            <div key={s} className="flex items-center gap-2">
              <div
                className={[
                  "size-7 rounded-full grid place-items-center border transition",
                  active
                    ? "bg-black text-white border-black"
                    : complete
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-white text-black border-black/10",
                ].join(" ")}
              >
                {i + 1}
              </div>

              <div
                className={[
                  "transition",
                  active
                    ? "font-semibold text-black"
                    : "text-black/60",
                ].join(" ")}
              >
                {s[0].toUpperCase() + s.slice(1)}
              </div>

              {i < STEPS.length - 1 && (
                <div
                  className={[
                    "w-8 h-px",
                    i < currentIndex
                      ? "bg-green-500"
                      : "bg-black/20",
                  ].join(" ")}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* MOBILE */}
      <div className="sm:hidden mb-5">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold text-black">
            Step {currentIndex + 1} of {STEPS.length}
          </div>

          <div className="text-xs uppercase tracking-wide text-black/50">
            {value}
          </div>
        </div>

        <div className="h-2 w-full rounded-full bg-black/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-black transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / STEPS.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </>
  );
}