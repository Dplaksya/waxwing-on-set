// src/components/ui/Header.jsx
import React from "react";
import { Link, NavLink } from "react-router-dom";
import Container from "./Container.jsx";

import headerLogo from "../../assets/images/headerslogo.jpg";

function NavItem({ to, children, shortLabel }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "px-2 md:px-3 py-2 rounded-lg text-xs md:text-sm transition whitespace-nowrap",
          "hover:bg-[color:var(--ww-grey-50,#f4f2ef)]",
          isActive
            ? "text-[color:var(--ww-brown,#382F20)] font-semibold bg-[color:var(--ww-grey-50,#f4f2ef)]"
            : "text-[color:var(--ww-brown,#382F20)]/80",
        ].join(" ")
      }
    >
      <span className="hidden md:inline">{children}</span>
      <span className="md:hidden">{shortLabel || children}</span>
    </NavLink>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-[rgba(255,255,255,0.92)] backdrop-blur border-b border-black/10">

      <Container className="flex items-center justify-between gap-3 h-16">

        {/* LEFT */}
        <Link
          to="/"
          className="flex items-center gap-2 md:gap-3 min-w-0 shrink-0"
          aria-label="Waxwing On Set — Home"
        >
          <img
            src={headerLogo}
            alt="Waxwing Logo"
            className="h-10 md:h-12 w-auto object-contain shrink-0"
          />

          <span className="font-bold text-sm md:text-lg text-[color:var(--ww-brown,#382F20)] truncate">
            Waxwing On Set
          </span>
        </Link>

        {/* Responsive nav */}
        <nav className="flex items-center gap-1 shrink-0">

          <NavItem
            to="/gear"
            shortLabel="Gear"
          >
            Gear
          </NavItem>

          <NavItem
            to="/quote#dates"
            shortLabel="Quote"
          >
            Get a quote
          </NavItem>

          <NavItem
            to="/contact"
            shortLabel="Contact"
          >
            Contact
          </NavItem>

        </nav>

      </Container>

    </header>
  );
}