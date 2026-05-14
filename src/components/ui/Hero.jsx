// src/components/ui/Hero.jsx
import React from "react";
import Button from "./Button.jsx";
import Container from "./Container.jsx";

const ACCENT = "#FF5A00";

export default function Hero() {
  return (
    <section className="pt-10 md:pt-16 lg:pt-20 pb-16 md:pb-20 min-h-[70vh] grid content-center">
      <Container>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
              <span className="block">Lighting & Grip Van</span>
              <span className="block">that feels like crew.</span>
            </h1>
            <p className="text-lg text-black/70">
              All-in-one mobile kit for nimble film teams. Clean, organized, and fast. We show up with the gear,
              the carts, and the plan — you just shoot.
            </p>
            <div className="flex gap-3">
              <Button as="a" href="/quote#dates">Check availability</Button>
              <Button variant="outline" as="a" href="#reel">Watch the reel</Button>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <div className="size-3 rounded-full" style={{ background: ACCENT }} />
              <div className="text-sm text-black/60">48‑hour soft hold on every quote</div>
            </div>
          </div>
          <div className="aspect-video rounded-2xl bg-black/5 border border-black/10 grid place-items-center">
            <div className="text-black/50">Van / set photo placeholder</div>
          </div>
        </div>
      </Container>
    </section>
  );
}
