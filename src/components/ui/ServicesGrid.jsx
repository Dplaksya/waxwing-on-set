// src/components/ui/ServicesGrid.jsx
import React from "react";
import Button from "./Button.jsx";

export default function ServicesGrid() {
  return (
    <section className="py-8">
      <div className="grid md:grid-cols-3 gap-5">
        <article className="ww-card p-5 flex flex-col">
          <h3 className="text-lg font-semibold">Full Stack Van</h3>
          <p className="text-sm text-black/70 mt-2 flex-1">
            The works: lighting, grip, carts, fabrics, distro, and a driver who knows set life.
          </p>
          <Button as="a" href="/quote#package" className="mt-4">Get a quote</Button>
        </article>
        <article className="ww-card p-5 flex flex-col">
          <h3 className="text-lg font-semibold">Roll & Go</h3>
          <p className="text-sm text-black/70 mt-2 flex-1">
            A leaner kit for run‑and‑gun days. Bring your own camera and lenses.
          </p>
          <Button as="a" href="/quote#package" className="mt-4">Get a quote</Button>
        </article>
        <article className="ww-card p-5 flex flex-col">
          <h3 className="text-lg font-semibold">Full Stack Gear List</h3>
          <p className="text-sm text-black/70 mt-2 flex-1">
            See exactly what’s included in the Full Stack package.
          </p>
          <Button as="a" href="/gear" className="mt-4" variant="outline">View gear</Button>
        </article>
      </div>
    </section>
  );
}
