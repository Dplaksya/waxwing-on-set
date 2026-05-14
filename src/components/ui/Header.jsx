// src/components/ui/Header.jsx
import React from "react";
import { Link, NavLink } from "react-router-dom";
import Container from "./Container.jsx";

import headerLogo from "../../assets/images/headerslogo.jpg";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "px-2 md:px-3 py-2 rounded-lg text-xs md:text-sm hover:bg-[color:var(--ww-grey-50)] transition",
          isActive
            ? "text-[color:var(--ww-brown,#382F20)] font-semibold bg-[color:var(--ww-grey-50,#f4f2ef)]"
            : "text-[color:var(--ww-brown,#382F20)]/80",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--bg,rgba(255,255,255,0.9))]/70 backdrop-blur border-b border-black/10">

      <Container className="flex items-center justify-between h-16">

        {/* LEFT */}
        <Link
          to="/"
          className="flex items-center gap-2 md:gap-3 min-w-0"
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

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">

          <NavItem to="/gear">
            Gear
          </NavItem>

          <NavItem to="/quote#dates">
            Get a quote
          </NavItem>

          <NavItem to="/contact">
            Contact
          </NavItem>

        </nav>

        {/* Mobile nav */}
        <nav className="md:hidden flex items-center gap-1">

          <NavItem to="/gear">
            Gear
          </NavItem>

          <NavItem to="/quote#dates">
            Quote
          </NavItem>

          <NavItem to="/contact">
            Contact
          </NavItem>

        </nav>

      </Container>

    </header>
  );
}