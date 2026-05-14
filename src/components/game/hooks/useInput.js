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

// mobile tap controls
useEffect(() => {
  function handleTap(e) {
    const t = e.changedTouches[0];
    const x = t.clientX;

    const screenMid = window.innerWidth / 2;

    if (x < screenMid) {
      onLeft && onLeft();
    } else {
      onRight && onRight();
    }
  }

  window.addEventListener("touchend", handleTap, { passive: true });

  return () => {
    window.removeEventListener("touchend", handleTap);
  };
}, [onLeft, onRight]);
}
