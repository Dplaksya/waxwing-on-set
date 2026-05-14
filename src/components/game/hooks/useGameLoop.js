// src/components/game/hooks/useGameLoop.js
import { useEffect, useRef } from "react";
import { MAX_FRAME_DT as _MAX_FRAME_DT, MAX_DT as _MAX_DT } from "../constants.js";

// Clamp dt to avoid physics spikes (tab switches, throttling)
const CLAMP =
  (typeof _MAX_FRAME_DT === "number" && _MAX_FRAME_DT) ||
  (typeof _MAX_DT === "number" && _MAX_DT) ||
  0.20; // seconds

export default function useGameLoop(step) {
  const rafRef = useRef(0);
  const lastRef = useRef(0);

  useEffect(() => {
    let mounted = true;

    function loop(ts) {
      if (!mounted) return;
      if (!lastRef.current) lastRef.current = ts;

      let dt = (ts - lastRef.current) / 1000; // seconds
      lastRef.current = ts;
      if (dt > CLAMP) dt = CLAMP;

      try {
        step(dt, ts);
      } catch (err) {
        // Never let an exception kill the loop silently
        // eslint-disable-next-line no-console
        console.error("[useGameLoop] step error:", err);
      }
      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);

    // When visibility changes, reset last timestamp so we don't get a huge dt.
    const onVis = () => {
      lastRef.current = performance.now();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [step]);
}
