// src/components/ui/ScrollToHash.jsx
import { useEffect } from "react";

export default function ScrollToHash({ children }) {
  useEffect(() => {
    const onHash = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      const el = document.getElementById(id) || document.querySelector(`[data-hash='${id}']`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return children;
}
