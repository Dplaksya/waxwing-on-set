import { useEffect, useRef } from "react";

export default function useInput({ onLeft, onRight }) {
  const lastMoveAtRef = useRef(0);

  useEffect(() => {
    function onKey(e) {
      if (e.repeat) return;
      if (e.key === "ArrowLeft") {
        onLeft && onLeft();
      } else if (e.key === "ArrowRight") {
        onRight && onRight();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onLeft, onRight]);

  // simple swipe
  useEffect(() => {
    let startX = null;
    let startY = null;
    function touchStart(e) {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
    }
    function touchEnd(e) {
      if (startX == null || startY == null) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 24) {
        if (dx < 0) onLeft && onLeft();
        else onRight && onRight();
      }
      startX = startY = null;
    }
    window.addEventListener("touchstart", touchStart, { passive: true });
    window.addEventListener("touchend", touchEnd);
    return () => {
      window.removeEventListener("touchstart", touchStart);
      window.removeEventListener("touchend", touchEnd);
    };
  }, [onLeft, onRight]);
}
