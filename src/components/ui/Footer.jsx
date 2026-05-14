// src/components/ui/Footer.jsx
import React from "react";
import Container from "./Container.jsx";
import { Link } from "react-router-dom";

import logo from "../../assets/images/logo.jpg";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-black/10 py-10">

      <Container className="grid md:grid-cols-3 gap-6 items-center">

        {/* LEFT */}
        <div className="space-y-0.5">

          <div className="font-semibold text-lg text-[color:var(--ww-brown)] mb-1">
            Waxwing On Set
          </div>

          <div className="text-sm text-[color:var(--ww-brown)]/60">
            Transparent pricing · No hidden fees
          </div>

          <div className="text-sm text-[color:var(--ww-brown)]/60">
            <a
              className="hover:opacity-80 transition-opacity"
              href="tel:19059264886"
            >
              Jeff — 905-926-4886
            </a>
          </div>

          <div className="text-sm text-[color:var(--ww-brown)]/60">
            <a
              className="hover:opacity-80 transition-opacity"
              href="tel:14168454126"
            >
              Daryna — 416-845-4126
            </a>
          </div>

          <div className="text-sm text-[color:var(--ww-brown)]/60">
            <a
              className="hover:opacity-80 transition-opacity"
              href="mailto:waxwingonset@gmail.com"
            >
              waxwingonset@gmail.com
            </a>
          </div>

          <div className="text-xs text-[color:var(--ww-brown)]/50 pt-1">
            © {new Date().getFullYear()} Waxwing On Set
          </div>

        </div>

        {/* CENTER */}
        <div className="flex gap-6 justify-center text-sm text-black/55">

          <Link
            className="hover:text-[color:var(--ww-brown)] transition-colors"
            to="/gear"
          >
            Gear
          </Link>

          <Link
            className="hover:text-[color:var(--ww-brown)] transition-colors"
            to="/quote#dates"
          >
            Quote
          </Link>

          <Link
            className="hover:text-[color:var(--ww-brown)] transition-colors"
            to="/contact"
          >
            Contact
          </Link>

        </div>

        {/* RIGHT */}
        <div className="flex justify-start md:justify-end">

          <img
            src={logo}
            alt="Waxwing Logo"
            className="h-30 w-auto object-contain scale-x-[-1] opacity-90"
          />

        </div>

      </Container>

    </footer>
  );
}