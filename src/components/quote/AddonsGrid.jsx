// src/components/quote/AddonsGrid.jsx
import React from "react";

function Currency({ value = 0 }) {
  return <span>{new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(value)}</span>;
}

/**
 * Add-on catalog with placeholder pricing.
 * Emojis appear only inside item labels (not headers).
 */
const CATALOG = [
  {
    id: "power",
    title: "Power & Distro",
    items: [
      { id: "batt-kit", label: "🔋 V-mount battery kit", price: 45 },
      { id: "stingers", label: "🔌 Extra stingers & distro", price: 25 },
    ],
  },
  {
    id: "village",
    title: "Video Village",
    items: [
      { id: "client-mon", label: "🖥️ Client monitor setup", price: 60 },
      { id: "chairs", label: "🪑 Director chairs (2)", price: 20 },
    ],
  },
  {
    id: "essentials",
    title: "On-Set Essentials",
    items: [
      { id: "tent", label: "⛺ Pop-up tent", price: 40 },
      { id: "cooler", label: "🥤 Cooler + water station", price: 15 },
    ],
  },
];

export default function AddonsGrid({ selected = [], onToggle }) {
  const chosen = new Set(selected);
  const isChecked = (id) => chosen.has(id);

  return (
    <div className="grid gap-8">
      {CATALOG.map((cat) => (
        <section key={cat.id}>
          {/* Header WITHOUT emojis */}
          <h3 className="text-xl md:text-2xl font-semibold">{cat.title}</h3>

          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cat.items.map((item) => {
              const inputId = `addon-${item.id}`;
              return (
                <label
                  key={item.id}
                  htmlFor={inputId}
                  className="ww-card p-4 flex items-start gap-3 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <input
                    id={inputId}
                    type="checkbox"
                    className="mt-1 h-5 w-5 rounded-md"
                    style={{ accentColor: "#22c55e" }}  // green checkmark
                    checked={isChecked(item.id)}
                    onChange={() => onToggle?.(item.id)}  // 🔒 send ONLY the ID
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-sm text-gray-600"><Currency value={item.price} /></span>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

// Named exports for pricing hooks and other consumers
export { CATALOG as ADDONS_CATALOG };
export const ADDONS = CATALOG; // backward-compat alias
