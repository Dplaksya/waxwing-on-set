// src/pages/ContactPage.jsx
import React from "react";
import Container from "../components/ui/Container.jsx";

export default function ContactPage() {
  return (
    <main className="py-16">
      <Container>

        <div className="max-w-6xl mx-auto">

          {/* HERO */}
          <div className="mb-14">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[color:var(--ww-brown)]/[0.08] text-sm text-[color:var(--ww-brown)] mb-6">
              📍 Toronto & GTA Production Support
            </div>

            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[0.95] text-[color:var(--ww-brown)] mb-6">
              Let’s plan your shoot.
            </h1>

            <div className="w-20 h-[2px] bg-[color:var(--ww-brown)]/40 mb-6" />

            <p className="text-lg md:text-xl text-black/65 leading-relaxed max-w-2xl">
              Fastest way to book is to call or text directly.
              We’ll confirm availability, answer questions, and place
              your requested dates on a 48-hour soft hold.
            </p>

          </div>

          {/* CONTACT GRID */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* DARYNA */}
            <div className="rounded-3xl border border-[color:var(--ww-brown)]/20 bg-white p-8 shadow-sm hover:shadow-lg transition-all duration-300">

              <div className="mb-8">

                <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--ww-brown)] mb-3 font-medium">
                  Production Contact
                </div>

                <h2 className="text-3xl font-semibold mb-3 text-[color:var(--ww-brown)]">
                  Daryna Plaksia
                </h2>

                <p className="text-black/60 leading-relaxed">
                  Bookings, scheduling, logistics &
                  client coordination
                </p>

              </div>

              <div className="border-t border-black/10 pt-6">

                <a
                  href="tel:14168454126"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[color:var(--ww-brown)]/[0.04] hover:bg-[color:var(--ww-brown)]/[0.07] transition-colors"
                >

                  <div className="w-12 h-12 rounded-full bg-[color:var(--ww-brown)] text-white flex items-center justify-center text-lg">
                    ☎
                  </div>

                  <div>
                    <div className="text-sm text-black/45">
                      Call or Text
                    </div>

                    <div className="text-2xl font-semibold text-[color:var(--ww-brown)]">
                      416-845-4126
                    </div>
                  </div>

                </a>

              </div>

            </div>

            {/* JEFF */}
            <div className="rounded-3xl border border-[color:var(--ww-brown)]/20 bg-white p-8 shadow-sm hover:shadow-lg transition-all duration-300">

              <div className="mb-8">

                <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--ww-brown)] mb-3 font-medium">
                  On-Set Operations
                </div>

                <h2 className="text-3xl font-semibold mb-3 text-[color:var(--ww-brown)]">
                  Jeffrey Feldcamp
                </h2>

                <p className="text-black/60 leading-relaxed">
                  Gear coordination, transportation &
                  on-set production support
                </p>

              </div>

              <div className="border-t border-black/10 pt-6">

                <a
                  href="tel:19059264886"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[color:var(--ww-brown)]/[0.04] hover:bg-[color:var(--ww-brown)]/[0.07] transition-colors"
                >

                  <div className="w-12 h-12 rounded-full bg-[color:var(--ww-brown)] text-white flex items-center justify-center text-lg">
                    ☎
                  </div>

                  <div>
                    <div className="text-sm text-black/45">
                      Direct Line
                    </div>

                    <div className="text-2xl font-semibold text-[color:var(--ww-brown)]">
                      905-926-4886
                    </div>
                  </div>

                </a>

              </div>

            </div>

          </div>

          {/* SHARED EMAIL */}
          <div className="mt-8 rounded-3xl border border-[color:var(--ww-brown)]/15 bg-[color:var(--ww-brown)]/[0.03] p-8">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

              <div>

                <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--ww-brown)] mb-3 font-medium">
                  General Inquiries
                </div>

                <a
                  href="mailto:waxwingonset@gmail.com"
                  className="text-2xl md:text-3xl font-semibold text-[color:var(--ww-brown)] hover:opacity-70 transition-opacity break-all"
                >
                  waxwingonset@gmail.com
                </a>

                <p className="text-black/55 mt-3 leading-relaxed max-w-2xl">
                  For bookings, production questions,
                  availability, and general inquiries.
                </p>

              </div>

<a
  href="mailto:waxwingonset@gmail.com"
  className="w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center text-2xl shrink-0 hover:scale-105 hover:opacity-90 transition-all duration-200"
>
  ✉
</a>
            </div>

          </div>

          {/* FOOTER */}
          <div className="mt-14 pt-8 border-t border-black/10 text-sm text-black/50 flex flex-col md:flex-row md:items-center gap-3 md:gap-6">

            <div className="flex items-center gap-2">
              📍 Based in Toronto, Ontario
            </div>

            <div className="hidden md:block w-1 h-1 rounded-full bg-[color:var(--ww-brown)]/30" />

            <div>
              Commercial • Branded • Documentary • Music Video • Production Support
            </div>

          </div>

        </div>

      </Container>
    </main>
  );
}