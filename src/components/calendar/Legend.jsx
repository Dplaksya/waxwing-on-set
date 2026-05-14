import React from "react";

export default function Legend() {
  const Item = ({ color, label }) => (
    <div className="flex items-center gap-2 text-sm">
      <span className="inline-block size-3 rounded-full" style={{ background: color }} />
      <span className="text-black/80">{label}</span>
    </div>
  );

  return (
    <div className="rounded-xl border border-black/10 bg-white shadow-sm p-3">
      <div className="text-sm font-semibold mb-2">Availability key</div>
      <div className="flex flex-wrap gap-4">
        <Item color="#10B981" label="Available" />
        <Item color="#F59E0B" label="Soft hold (48h)" />
        <Item color="#EF4444" label="Booked" />
      </div>
    </div>
  );
}
