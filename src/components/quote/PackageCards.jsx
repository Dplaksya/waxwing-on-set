// src/components/quote/PackageCards.jsx
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import packageFull from "../../assets/images/PackageCardFull.jpg";
import packageEmpty from "../../assets/images/PackageCardEmpty.jpg";

const PKGS = [
  {
    id: "full",
    name: "Full-Stack Van",
    price: 750,
    blurb: "Complete mobile support setup, ready to shoot.",
    bullets: [
      "Lighting support, distro, video village",
      "Driver included",
      "Ideal for agile crews",
    ],
    gearHash: "#full",
    imageAlt: "Full-Stack van package image",
  },
  {
    id: "empty",
    name: "Empty Van",
    price: 250,
    blurb: "Bring your own kit—use our van, ramps, and loadout workflow.",
    bullets: [
      "Driver included",
      "Ramps + load assist",
      "Perfect for custom kits",
    ],
    gearHash: "#empty",
    imageAlt: "Empty Van package image",
  },
];

// Fixed width for the price column so alignment is identical across cards
const PRICE_COL_WIDTH_REM = 8.5;

function currency(n) {
  return Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n || 0);
}

/** `$1200/day` or `$1200 flat` (adds a space only when unit doesn't start with "/") */
function priceWithUnit(price, unit = "/day") {
  const needsSpace = unit && !unit.startsWith("/");
return `${currency(price)}${needsSpace ? " " : ""}${unit}`;}

/**
 * Price block:
 * - The number baseline aligns with the package name.
 * - "from" is positioned absolutely, so it doesn't affect baseline.
 */
function Price({ value, halfDay }) {
    const label = "from";
const adjustedValue = halfDay ? value / 2 : value;
const priceText = useMemo(
  () => priceWithUnit(adjustedValue, "/day"),
  [adjustedValue]
);
  return (
    <div
      className="relative leading-none self-start text-right"
      style={{ width: `${PRICE_COL_WIDTH_REM}rem` }}
      aria-label={`Price ${priceText}`}
    >
      {/* Absolutely-positioned small label so baseline is the big number */}
      <div className="absolute -top-3 right-0 text-xs text-gray-500">{label}</div>
      {/* Price line sits on the baseline used for alignment with the name */}
<div className="text-lg md:text-xl font-semibold">
  {priceText}
</div>

{halfDay && (
  <div className="text-xs text-green-600 mt-1 font-medium">
    Half-Day Rate
  </div>
)}    </div>
  );
}

function PackageCard({ item, selected, onSelect, halfDay, onHalfDayChange }) {
  const isActive = selected === item.id;

  return (
    <button
      type="button"
      onClick={() => onSelect?.(item.id)}
      className={[
"text-left ww-card overflow-hidden transition-shadow border",        isActive
? "border-2 border-green-600"
: "border-2 border-black/10 hover:shadow-md",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      ].join(" ")}
      aria-pressed={isActive}
    >
      {/* Top image */}
<div className="overflow-hidden aspect-[16/10]">
  <img
    src={item.id === "full" ? packageFull : packageEmpty}
    alt={item.imageAlt}
    className="w-full h-full object-cover"
  />
</div>
      {/* Body: tightened top padding; 2-col grid [content | fixed price] */}
      <div
className="px-5 md:px-6 pt-4 md:pt-5 pb-5 md:pb-6 grid gap-x-3 gap-y-3 items-start"        style={{ gridTemplateColumns: `minmax(0,1fr) ${PRICE_COL_WIDTH_REM}rem` }}
      >
        {/* Badge row — reduced vertical footprint to pull everything up */}
        <div className="col-[1/2] min-h-[0.75rem]">
          {isActive && (
            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              Selected
            </span>
          )}
        </div>
        {/* spacer to keep grid alignment */}
        <div className="col-[2/3]" />

        {/* Name + Price in the SAME ROW and baseline-aligned */}
        <div className="col-[1/3] flex items-baseline justify-between">
          <h3 className="text-xl md:text-2xl font-semibold leading-tight">
            {item.name}
          </h3>
<Price value={item.price} halfDay={isActive ? halfDay : false} />
        </div>

        {/* Blurb (content col) */}
        <p className="col-[1/2] text-gray-600 self-start">{item.blurb}</p>

        {/* Bullets (content col) */}
        <ul className="col-[1/2] mt-1 space-y-1 text-gray-700 font-medium self-start">
          {item.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2">
              <span className="opacity-90">✔︎ {b}</span>
            </li>
          ))}
        </ul>

        {/* Half-day (content col) */}
        <div className="col-[1/2] mt-3 flex items-center gap-2 self-start">
          <input
            id={`half-${item.id}`}
            type="checkbox"
            className="h-[22px] w-[22px] rounded-md"
            style={{ accentColor: "#22c55e" }} // same green
            checked={isActive ? halfDay : false}
            onChange={(e) => isActive && onHalfDayChange?.(e.target.checked)}
            onClick={(e) => e.stopPropagation()}
            disabled={!isActive}
          />
          <label htmlFor={`half-${item.id}`} className="text-sm font-medium select-none">
            Half-day
          </label>
        </div>

        {/* Underlined link (span both cols) */}
        <div className="col-[1/3] mt-4 self-end">
          <a
            href={`/gear${item.gearHash}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="underline underline-offset-4 text-[color:var(--ww-brown)] hover:opacity-80"
          >
            View gear &amp; details →
          </a>
        </div>
      </div>
    </button>
  );
}

export default function PackageCards({
  selected,
  defaultSelected = "full",
  onSelect,
  halfDay = false,
  onHalfDayChange,
  className = "",
}) {
  const active = selected || defaultSelected;

  return (
<div className={["grid gap-5 md:gap-6 md:grid-cols-2 items-start", className].join(" ")}>      {PKGS.map((item) => (
        <PackageCard
          key={item.id}
          item={item}
          selected={active}
          onSelect={onSelect}
          halfDay={halfDay}
          onHalfDayChange={onHalfDayChange}
        />
      ))}
    </div>
  );
}

PackageCards.propTypes = {
  selected: PropTypes.string,
  defaultSelected: PropTypes.string,
  onSelect: PropTypes.func,
  halfDay: PropTypes.bool,
  onHalfDayChange: PropTypes.func,
  className: PropTypes.string,
};
