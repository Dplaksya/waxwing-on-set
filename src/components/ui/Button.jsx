// src/components/ui/Button.jsx
import React from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl transition-colors duration-150 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--ww-orange)] disabled:opacity-50 disabled:pointer-events-none select-none";

const variants = {
  solid: "bg-[color:var(--ww-orange)] text-white hover:brightness-95 active:brightness-90",
  outline: "border border-black/10 bg-white text-[color:var(--ww-brown)] hover:bg-black/5",
  ghost: "bg-transparent text-[color:var(--ww-brown)] hover:bg-black/5",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export default function Button({
  children,
  variant = "solid",
  size = "md",
  className = "",
  as,
  ...rest
}) {
  const Comp = as || "button";
  const v = variant === "primary" ? "solid" : variant;
  return (
    <Comp className={[base, variants[v], sizes[size], className].join(" ")} {...rest}>
      {children}
    </Comp>
  );
}
