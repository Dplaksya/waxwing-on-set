// src/components/ui/Container.jsx
import React from "react";

export default function Container({ className = "", size = "lg", children, as }) {
  const Comp = as || "div";
  const sizes = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-7xl",
    xl: "max-w-[1200px]"
  };
  return (
    <Comp className={[sizes[size] || sizes.lg, "mx-auto px-4 sm:px-6 lg:px-8", className].join(" ").trim()}>
      {children}
    </Comp>
  );
}
