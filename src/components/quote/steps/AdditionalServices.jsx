import React, { useMemo, useState } from "react";
import Container from "../../ui/Container.jsx";
import Button from "../../ui/Button.jsx";

/** Exported so Review can compute totals */
export const SERVICES = [
  { id: "swing_ge", name: "Swing (G&E)", price: 350, unit: "/day", desc: "Extra hands for grip or electric to keep moves fast and safe.", icon: "⚡" },
  { id: "set_support", name: "Set Support", price: 300, unit: "/day", desc: "Continuity, light styling assists, and on-set logistics to stay on schedule.", icon: "🎨" },
  { id: "tech_scout", name: "Tech Scout", price: 250, unit: "flat", desc: "We join your scout to plan power, load-ins, and layout—fewer surprises.", icon: "🚐" }, // one-liner
  { id: "preprod_consult", name: "Pre-Production Gear Consult", price: 100, unit: "flat", desc: "Share your shot list; we tailor the loadout and flag smart add-ons.", icon: "📝" },
  { id: "dit_wrangling", name: "DIT / Data Wrangling", price: 300, unit: "/day", desc: "On-set card backups and organized handoff to client drives.", icon: "💻" },
  { id: "bts_stills_reels", name: "BTS Stills & Reels", price: 200, unit: "/day", desc: "Behind-the-scenes photos and quick vertical clips for socials.", icon: "📸" },
];

/** No-cents currency */
const currency = (n) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n || 0);

/** Price+unit with smart spacing: `$300/day` OR `$250 flat` */
function priceWithUnit(price, unit) {
  const u = unit || "";
  const needsSpace = u && !u.startsWith("/");
  return `${currency(price)}${needsSpace ? " " : ""}${u}`;
}

/** Single service card */
function ServiceCard({ item, selected, onToggle }) {
  const textStartClass = "ml-11"; // aligns status chip with text start (icon 2rem + gap 0.75rem)

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onToggle(item.id)}
      className={[
        "group w-full text-left rounded-2xl border bg-white p-4 pb-3 transition",
        // thinner selected outline (matches rest of flow)
        selected ? "border-green-600 ring-[0.8px] ring-green-600" : "border-black/10",
        "hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 grid size-8 shrink-0 place-items-center rounded-full bg-black/5 text-base">
          {item.icon}
        </div>
        <div>
          <div className="text-xs text-black/60">{priceWithUnit(item.price, item.unit)}</div>
          <div className="mt-0.5 text-base md:text-lg font-semibold leading-tight">{item.name}</div>
          {item.desc && <p className="mt-1.5 text-sm text-black/70">{item.desc}</p>}
        </div>
      </div>

      {/* Status chip aligned with text column */}
      <span
        className={[
          textStartClass,
          "pointer-events-none mt-1.5 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
          selected
            ? "bg-green-100 text-green-700"
            : "bg-black/5 text-black/60 opacity-0 group-hover:opacity-100",
          "transition-opacity",
        ].join(" ")}
      >
        {selected ? "Selected" : "Tap to add"}
      </span>
    </button>
  );
}

export default function AdditionalServices({
  selected = [], // array of IDs
  onChange,
  onNext,
  onBack,
}) {
  const [ids, setIds] = useState(new Set((selected || []).filter(Boolean)));

  const toggle = (id) => {
    if (!id) return;
    setIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      onChange?.(Array.from(next));
      return next;
    });
  };

  const { subtotal, count } = useMemo(() => {
    let sum = 0;
    const c = ids.size;
    ids.forEach((id) => {
      const it = SERVICES.find((s) => s.id === id);
      if (it) sum += it.price || 0;
    });
    return { subtotal: sum, count: c };
  }, [ids]);

  return (
    <section className="py-8 md:py-10">
      <Container>
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-[color:var(--ww-brown)]">
            Additional services <span className="text-sm font-normal text-[color:var(--ww-muted)]"></span>
          </h1>
          <p className="mt-2 text-[color:var(--ww-muted)]">
            Pick the support you need. Prices are per day unless noted.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SERVICES.map((it) => (
            <ServiceCard
              key={it.id}
              item={it}
              selected={ids.has(it.id)}
              onToggle={toggle}
            />
          ))}
        </div>

        {/* Footer: Back (left) bottom-aligned • Summary above Continue (right) */}
        <div className="mt-6 grid grid-cols-2 items-stretch gap-3">
          <div className="flex items-end">
            <Button variant="outline" onClick={onBack}>Back</Button>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className="text-sm text-[color:var(--ww-muted)] text-right">
              {count > 0 ? (
                <>
                  <span className="font-medium">
                    {count} {count === 1 ? "service" : "services"}
                  </span>{" "}
                  · <span className="font-semibold">{currency(subtotal)}</span>{" "}
                  <span>estimated pre-tax</span>
                </>
              ) : (
                "No services selected"
              )}
            </div>
            {/* Always enabled — optional */}
            <Button onClick={onNext}>Continue</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
