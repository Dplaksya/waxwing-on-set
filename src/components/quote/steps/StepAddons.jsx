import React, { useMemo, useState } from "react";
import Container from "../../ui/Container.jsx";
import Button from "../../ui/Button.jsx";

/** Exported so Review can compute totals */
export const ADDONS = [
  { id: "extra_battery", name: "Extra Battery Kit", price: 45, unit: "/day", desc: "Spare batteries to keep cameras rolling all day.", icon: "🔋" },
  { id: "monitor", name: "Director’s Monitor", price: 60, unit: "/day", desc: "Wireless handheld monitor for directors or clients.", icon: "📺" },
  { id: "sandbags", name: "Sandbag Pack", price: 40, unit: "/day", desc: "Set of heavy sandbags for securing stands and rigs.", icon: "🏋️" },
  { id: "cables", name: "Extra Cable Kit", price: 25, unit: "/day", desc: "Backup power, SDI, and XLR cables for peace of mind.", icon: "🔌" },
  { id: "walkies", name: "Walkie Talkies (x4)", price: 20, unit: "/day", desc: "4 radios for team comms, with headsets included.", icon: "📡" },
  { id: "clamp_lights", name: "Clamp Light Set", price: 15, unit: "/day", desc: "Handy clamp lights for small setups and quick fills.", icon: "💡" },
];

/** No-cents currency */
const currency = (n) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n || 0);

/** Price+unit with smart spacing */
function priceWithUnit(price, unit) {
  const u = unit || "/day";
  const needsSpace = u && !u.startsWith("/");
  return `${currency(price)}${needsSpace ? " " : ""}${u}`;
}

function AddonCard({ item, selected, onToggle }) {
  const textStartClass = "ml-11"; // align status chip with text column

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onToggle(item.id)}
      className={[
        "group w-full text-left rounded-2xl border bg-white p-4 pb-3 transition",
        selected ? "border-green-600 ring-[0.8px] ring-green-600" : "border-black/10",
        "hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 grid size-8 shrink-0 place-items-center rounded-full bg-black/5 text-base">
          {item.icon || ""}
        </div>
        <div>
          <div className="text-xs text-black/60">{priceWithUnit(item.price, item.unit)}</div>
          <div className="mt-0.5 text-base md:text-lg font-semibold leading-tight">{item.name}</div>
          {item.desc && <p className="mt-1.5 text-sm text-black/70">{item.desc}</p>}
        </div>
      </div>

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

export default function StepAddons({
  selected = [],
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
      onChange?.(Array.from(next)); // lift plain array of IDs
      return next;
    });
  };

  const { subtotalPerDay, count } = useMemo(() => {
    let sum = 0;
    const c = ids.size;
    ids.forEach((id) => {
      const it = ADDONS.find((a) => a.id === id);
      if (it) sum += it.price || 0;
    });
    return { subtotalPerDay: sum, count: c };
  }, [ids]);

  return (
    <section className="py-8 md:py-10">
      <Container>
        {/* Match Additional Services spacing (header + subhead inside header) */}
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-[color:var(--ww-brown)]">Add-ons</h1>
          <p className="mt-2 text-[color:var(--ww-muted)]">Dial in the kit. Pricing below is per shoot day.</p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ADDONS.map((it) => (
            <AddonCard
              key={it.id}
              item={it}
              selected={ids.has(it.id)}
              onToggle={toggle}
            />
          ))}
        </div>

        {/* Footer with Back left (bottom-aligned), summary above Continue (right) */}
        <div className="mt-6 grid grid-cols-2 items-stretch gap-3">
          <div className="flex items-end">
            <Button variant="outline" onClick={onBack}>Back</Button>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className="text-sm text-[color:var(--ww-muted)] text-right">
              {count > 0 ? (
                <>
                  <span className="font-medium">
                    {count} {count === 1 ? "add-on" : "add-ons"}
                  </span>{" "}
                  · <span className="font-semibold">{currency(subtotalPerDay)}</span>{" "}
                  <span>/ day</span>
                </>
              ) : (
                "No add-ons selected"
              )}
            </div>
            {/* Always enabled to match Services */}
            <Button onClick={onNext}>Continue</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
