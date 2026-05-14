// src/components/marketing/PackageShowcase.jsx
import React from "react";
import Button from "../ui/Button.jsx";
import packageFull from "../../assets/images/PackageCardFull.jpg";
import packageEmpty from "../../assets/images/PackageCardEmpty.jpg";

const packages = [
  {
    id: "full",
    name: "Full-Stack Van",
    price: 750,
    description: "Complete mobile support setup, ready to shoot.",
    bullets: ["Lighting support, distro, video village", "Driver included", "Ideal for agile crews"],
    gearHash: "#full",
  },
  {
    id: "empty",
    name: "Empty Van",
    price: 250,
    description: "Bring your own kit—use our van and loadout workflow.",
    bullets: ["Driver included", "Load assist", "Perfect for custom kits"],
    gearHash: "#empty",
  },
];

function Price({ value }) {
  return (
    <div className="text-right leading-none min-w-[6.5rem]">
      <div className="text-sm text-gray-500">from</div>
      <div className="text-lg md:text-xl font-semibold">
        {new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(value)}
      </div>
    </div>
  );
}

function Card({ item }) {
  return (
    <div className="ww-card overflow-hidden flex flex-col">
<div className="overflow-hidden h-[260px]">
  <img
    src={item.id === "full" ? packageFull : packageEmpty}
    alt={item.name}
    className="w-full h-full object-cover"
  />
</div>
      <div className="p-5 md:p-6 flex flex-col gap-3">
        <div className="flex items-end justify-between gap-3">
          <h3 className="text-xl md:text-2xl font-semibold">{item.name}</h3>
          <Price value={item.price} />
        </div>
        <p className="text-gray-600">{item.description}</p>
        <ul className="grid gap-1 text-gray-700 font-medium">
          {item.bullets.map((b) => <li key={b}>✅ {b}</li>)}
        </ul>
      </div>

      {/* CTA row with spacing (no edge touching) */}
      <div className="mt-auto border-t border-black/10">
        <div className="p-3 grid grid-cols-2 gap-3">
          <Button as="a" href="/quote#dates" className="rounded-lg w-full py-3 md:py-3.5 text-sm md:text-base">
            Start your quote
          </Button>
          <Button
            as="a"
            variant="outline"
            href={`/gear${item.gearHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg w-full py-3 md:py-3.5 text-sm md:text-base"
          >
            View gear →
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PackageShowcase() {
  return (
    <div className="grid gap-6 md:gap-8 md:grid-cols-2">
      {packages.map((p) => (
        <Card key={p.id} item={p} />
      ))}
    </div>
  );
}
