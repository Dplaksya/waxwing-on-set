// src/hooks/useAutoScroll.js
import { useEffect, useRef } from "react";

/**
 * Auto scroll helper.
 *  - options.to === "top"      → scroll the WINDOW to the very top
 *  - options.to === "element"  → scroll the element into view (default)
 */
export function useAutoScroll(ref, deps = [], options = { to: "element" }) {
  const lastKey = useRef("");

  useEffect(() => {
    const key = JSON.stringify(deps ?? []);
    if (lastKey.current === key) return;
    lastKey.current = key;

    const run = () => {
      if (options?.to === "top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const el = ref?.current;
      if (!el) return;
      try {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch {
        const top = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top, behavior: "smooth" });
      }
    };

    const id = requestAnimationFrame(run);
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
