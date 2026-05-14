// src/pages/GearListPage.jsx
import React, { useMemo, useState } from "react";
import Container from "../components/ui/Container.jsx";
import Button from "../components/ui/Button.jsx";

/** Compact pill toggle */
function Toggle({ active, onChange, label }) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={active}
      style={{ WebkitTapHighlightColor: "transparent" }}
      className={[
        "inline-flex items-center justify-center px-4 py-2 rounded-full select-none",
        "text-sm font-semibold",
        "transition duration-150 ease-out motion-reduce:transition-none",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ww-orange)]/35",
        "active:scale-105",
        active
          ? "bg-[color:var(--ww-orange)] text-white shadow-sm"
          : "border border-black/10 text-[color:var(--ww-brown)] hover:bg-black/5",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function GearCard({ title, children }) {
  return (
    <article className="ww-card px-5 py-4 md:px-6 md:py-5 flex flex-col gap-2 h-auto break-inside-avoid mb-6">
      <h3 className="text-lg md:text-xl font-semibold">{title}</h3>
      <div className="text-[15px] md:text-base">{children}</div>
    </article>
  );
}

function GearList({ items }) {
  return (
    <ul className="grid gap-2">
      {items.map((t) => (
        <li key={t} className="flex items-start gap-2">
          <span
            className="mt-[7px] inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--ww-orange)]"
            aria-hidden
          />
          <span className="opacity-90">{t}</span>
        </li>
      ))}
    </ul>
  );
}

export default function GearListPage() {
  const [pkg, setPkg] = useState("full"); // "full" | "empty"

  const data = useMemo(() => {
    if (pkg === "empty") {
      return {
        heading: "Bring Your Kit. We’ll Bring the Wheels.",
        intro:
          "Prefer your own gear? Grab a clean cargo van and a pro driver. Simple, insured, on time.",
        topBadge: null,
        groups: [
          {
            title: "🚚 Transport & Logistics",
            items: [
              "GMC Savana 2500 cargo van",
              "Load assist",
              "Driver included",
              "Fuel included",
            ],
          },
          {
            title: "🧰 Support & Safety",
            items: [
              "Apple boxes (assorted set)",
              "Collapsible ladder",
              "Safety chains ×12",
              "Ratchet straps (assorted)",
            ],
          },
        ],
      };
    }

    // FULL-STACK VAN — INVENTORY + ORDER UPDATED
    return {
      heading: "All the Support Gear, None of the Hassle.",
      intro:
        "Skip the truck rentals and milk runs. Our Full-Stack Van includes lights, diffusion, support, grip, power & distro, and transport—ready to roll.",
      topBadge: "INCLUDED IN EVERY FULL-STACK VAN",
      groups: [
        {
          title: "💡 Lights",
          items: [
            "Aputure P600c ×2",
            "Aputure 600x Pro",
            "Amaran 300c",
            "Amaran F22c",
            "Amaran PT2c",
            "Amaran 100x",
          ],
        },
        {
          title: "✨ Diffusion",
          items: [
            "8’×8’ Silent 1/2 Grid Cloth",
            "8’×8’ Solid Black Rag",
            "4’×4’ Frame (empty)",
            "5-in-1 reflector",
            "Rosco Opal diffusion roll",
            "Rosco Grid Cloth roll",
            "P600c softbox ×2",
            "F22c softbox + grid",
            "Bowens-mount parabolic softbox",
          ],
        },
        {
          title: "🧰 Support & Safety",
          items: [
            "Apple boxes (assorted set)",
            "Collapsible ladder",
            "Safety chains ×12",
            "Ratchet straps (assorted)",
          ],
        },
        {
          title: "🛠️ Grip",
          items: [
            "C-stands ×4",
            "2-tier combo rollers ×2",
            "Lightweight light stands ×3",
            "“Fishing pole” extension bar ×1",
            "Telescopic backdrop crossbar",
            "Cardellini clamps ×3",
            "Grip heads (assorted)",
            "Painter’s pole",
            "Pony clamps (assorted)",
          ],
        },
        {
          title: "⚡ Power & Distro",
          items: [
            "Cube taps ×6",
            "AC extension 25’ ×5",
            "AC extension 50’ ×5",
          ],
        },
        {
          title: "🚚 Transport & Logistics",
          items: [
            "GMC Savana 2500 cargo van",
            "Load assist",
            "Driver included",
            "Fuel included",
          ],
        },
      ],
    };
  }, [pkg]);

  return (
    <main className="ww-section">
      <section>
        <Container>
          <div className="grid md:grid-cols-[1fr] gap-6 items-start">
            {/* Pills row */}
            <div className="flex flex-wrap items-center gap-2">
              <Toggle
                active={pkg === "full"}
                onChange={() => setPkg("full")}
                label="Full-Stack Van"
              />
              <Toggle
                active={pkg === "empty"}
                onChange={() => setPkg("empty")}
                label="Empty Van"
              />
            </div>

            {/* Heading + intro */}
<div className="flex flex-col">
  <h1 className="text-[32px] md:text-5xl font-semibold tracking-tight leading-tight">
    {data.heading}
  </h1>
  <p className="max-w-3xl text-[15px] md:text-lg opacity-70 mt-2 md:mt-3">
    {data.intro}
  </p>

  {data.topBadge && (
    <div className="mt-2.5">
      <span className="inline-flex w-auto items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[color:var(--ww-orange)] border border-[color:var(--ww-orange)]/40">
        {data.topBadge}
      </span>
    </div>
  )}
</div>

          </div>
        </Container>
      </section>

      <section>
        <Container className="pt-6 md:pt-10 pb-24">
          {/* Masonry-style two columns so cards hug their content */}
          <div className="columns-1 sm:columns-2 gap-6 [column-fill:_balance]">
            {data.groups.map((g) => (
              <GearCard key={g.title} title={g.title}>
                <GearList items={g.items} />
              </GearCard>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button as="a" href="/quote#dates">
              Start your quote
            </Button>
            <Button as="a" variant="outline" href="/contact">
              Talk to us
            </Button>
          </div>
        </Container>
      </section>
    </main>
  );
}
