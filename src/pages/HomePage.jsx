// src/pages/HomePage.jsx
import React from "react";
import Container from "../components/ui/Container.jsx";
import PackageShowcase from "../components/marketing/PackageShowcase.jsx";
import CalendarPreview from "../components/calendar/CalendarPreview.jsx";
import heroImage from "../assets/images/HeroImage.jpg";

function Hero() {
  return (
    <section className="py-16 md:py-24 bg-white border-b border-black/10">
      <Container>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-semibold leading-[1.05] tracking-tight">
              <span className="block">Don’t Wing It.</span>
              <span className="block text-[color:var(--ww-orange)]">Waxwing It.</span>
            </h1>

            <p className="mt-5 text-base md:text-lg text-gray-600">
              Toronto’s everything-but-the-camera G&amp;E van. Packages, add-ons, and crew—ready when you are.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/quote#dates"
                className="inline-flex items-center justify-center h-11 px-5 text-base font-medium rounded-xl bg-[color:var(--ww-orange)] text-white hover:bg-[color:var(--ww-orange)] active:bg-[color:var(--ww-orange)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ww-orange)]/40"
              >
                Start your quote
              </a>
              <a
                href="/gear"
                className="inline-flex items-center justify-center h-11 px-5 text-base font-medium rounded-xl border border-black/10 bg-white hover:bg-black/5"
              >
                View gear list
              </a>
            </div>
          </div>

<div className="rounded-2xl overflow-hidden shadow-2xl h-[520px]">
  <img
    src={heroImage}
    alt="Waxwing production van on set"
    className="object-cover object-center w-full h-full"
  />
</div>
        </div>
      </Container>
    </section>
  );
}

function ServicesSection() {
  const services = [
    {
      icon: "⚡",
      title: "Swing (G&E)",
      blurb: "Extra hands for grip or electric to keep moves fast and safe.",
      price: "$350/day",
    },
    {
      icon: "🎨",
      title: "Set Support",
      blurb: "Continuity, light styling assists, and on-set logistics to stay on schedule.",
      price: "$300/day",
    },
    {
      icon: "🚐",
      title: "Tech Scout",
      blurb: "We join your scout to plan power, load-ins, and layout—fewer surprises on the day.",
      price: "$250 flat",
    },
    {
      icon: "📝",
      title: "Pre-Production Gear Consult",
      blurb: "Share your shot list; we tailor the loadout and flag smart add-ons.",
      price: "$100 flat",
    },
    {
      icon: "💻",
      title: "DIT / Data Wrangling",
      blurb: "On-set card backups and organized handoff to client drives.",
      price: "$300/day",
    },
    {
      icon: "📸",
      title: "BTS Stills & Reels",
      blurb: "Behind-the-scenes photos and quick vertical clips for socials.",
      price: "$200/day",
    },
  ];

  return (
    <section className="py-14 md:py-18 bg-white border-t border-black/10">
      <Container>
        <header className="mb-7 md:mb-9">
          <h2 className="text-3xl md:text-4xl">Additional Services</h2>
          <p className="mt-3 text-gray-600">
            The van is just the start. Add extra crew and support services <span className="whitespace-nowrap">during booking</span> to tailor the day to your needs.
          </p>
        </header>

        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {services.map((s) => (
            <li
              key={s.title}
              className="rounded-2xl border border-black/10 bg-white p-5 md:p-6 hover:bg-black/5 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div
                  className="h-10 w-10 shrink-0 rounded-xl bg-black/5 flex items-center justify-center text-xl"
                  aria-hidden="true"
                >
                  <span>{s.icon}</span>
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold leading-tight">{s.title}</h3>
                  <div className="mt-1 text-sm font-medium text-black/60">{s.price}</div>

                  <p className="mt-2 text-sm text-gray-600">{s.blurb}</p>

                  <div className="mt-3">
                    <span
                      className="inline-flex items-center rounded-full border border-black/10 px-2.5 py-1 text-[11px] uppercase tracking-wide text-black/60"
                      aria-label="Choose during booking"
                      title="Choose during booking"
                    >
                      Choose during booking
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export default function HomePage() {
  return (
    <main className="flex flex-col">
      {/* 1) Hero */}
      <Hero />

      {/* 2) Packages */}
      <section className="py-14 md:py-18 bg-white">
        <Container>
          <header className="mb-7 md:mb-9">
            <h2 className="text-3xl md:text-4xl">Packages</h2>
            <p className="mt-3 text-gray-600">
              Two clean options. Full-Stack comes pre-loaded with support gear; Empty Van is built for your kit.
            </p>
          </header>
          <PackageShowcase />
        </Container>
      </section>

      {/* 2.5) Additional Services */}
      <ServicesSection />

      {/* 3) Reel (no CTAs below) */}

      {/* 4) Calendar Preview at the bottom */}
      <CalendarPreview />
    </main>
  );
}
