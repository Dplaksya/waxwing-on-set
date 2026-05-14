// src/components/game/PromoGameGate.jsx
import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import {
  makeBookingKey,
  isDiscountApplied,
  setDiscountApplied,
} from "./promoStorage";

// ---- Brand palette ----
const BRAND = {
  ORANGE: "#F25F00",
  BROWN: "#382F20",
  WHITE: "#FFFFFF",
  FILM_GREY: "#F4F4F4",
  STEEL_GREY: "#6B6B6B",
  BURNT_YELLOW: "#F8AF51",
  RUST_TAN: "#D0742F",
  SLATE_GREEN: "#49615B",
};

// ---- UI (greens + misc) ----
const UI = {
  GREEN_SOFT: "#4ADE80",            // hover green (soft)
  GREEN_ACTIVE: "#22C55E",          // active/pressed green (tad darker)
  MINT_BG: "#EAF7EE",
  BORDER_NEUTRAL: "rgba(0,0,0,0.10)",
  BORDER_NEUTRAL_HOVER: "rgba(0,0,0,0.14)",
  RADIUS: "18px",
  OUTLINE_THIN: "1px",
};

const DISCOUNT_CODE = "WAXWING10";
const DISCOUNT_PERCENT = 10;

export default function PromoGameGate({
  isoDates = [],
  pkg = "full",
  onApplyDiscount,
  className = "",
}) {
  const bookingKey = useMemo(() => makeBookingKey({ pkg, isoDates }), [pkg, isoDates]);

  const [applied, setApplied] = useState(() => isDiscountApplied(bookingKey));
  const prevKeyRef = useRef(bookingKey);
  const [pressed, setPressed] = useState(false);

  // keep UI in sync when the booking changes
  useEffect(() => {
    if (prevKeyRef.current !== bookingKey) {
      prevKeyRef.current = bookingKey;
      setApplied(isDiscountApplied(bookingKey));
    }
  }, [bookingKey]);

  const openGame = useCallback(() => {
    window.dispatchEvent(new CustomEvent("pixelGame:open", { detail: { bookingKey } }));
  }, [bookingKey]);

  // listen for win → set “applied” and notify parent for math
  useEffect(() => {
    const onWin = (e) => {
      const detail = e?.detail || {};
      if (detail.bookingKey !== bookingKey) return;

      if (!isDiscountApplied(bookingKey)) setDiscountApplied(bookingKey);
      setApplied(true);

      if (typeof onApplyDiscount === "function") {
        onApplyDiscount(DISCOUNT_CODE, DISCOUNT_PERCENT);
      }
    };

    window.addEventListener("pixelGame:win", onWin);
    return () => window.removeEventListener("pixelGame:win", onWin);
  }, [bookingKey, onApplyDiscount]);

  // Press interactions (mouse/touch/keyboard) — purely visual
  const startPress = () => setPressed(true);
  const endPress = () => setPressed(false);
  const onKeyDown = (e) => { if (e.key === " " || e.key === "Enter") startPress(); };
  const onKeyUp = (e) => { if (e.key === " " || e.key === "Enter") endPress(); };

  return (
    <>
      <style>{`
        /* Base button (no glow/shadow) */
        .ww-btn {
          padding: 8px 14px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 8px;

          color: ${BRAND.BROWN};
          background-color: ${BRAND.WHITE};
          border: 1px solid ${UI.BORDER_NEUTRAL};

          transition:
            transform 180ms cubic-bezier(.2,.7,.2,1),
            border-color 160ms ease,
            background-color 160ms ease,
            color 160ms ease;
          will-change: transform;
        }
        .ww-btn:hover,
        .ww-btn:focus-visible {
          transform: scale(1.06);
          background-color: ${UI.GREEN_SOFT};
          color: ${BRAND.WHITE};
          border-color: ${UI.GREEN_SOFT};
          outline: none;
        }
        .ww-btn:active { transform: scale(0.965); background-color: ${UI.GREEN_ACTIVE}; color: ${BRAND.WHITE}; border-color: ${UI.GREEN_ACTIVE}; }
        .ww-btn-pressed { transform: scale(0.965); background-color: ${UI.GREEN_ACTIVE}; color: ${BRAND.WHITE}; border-color: ${UI.GREEN_ACTIVE}; }

        /* Celebration bubble */
        .ww-celebrate {
          position: relative;
          border-radius: 999px;
          padding: 12px 16px;
          background: linear-gradient(180deg, rgba(16,185,129,0.14), rgba(16,185,129,0.08));
          border: 1px solid rgba(16,185,129,0.35);
          box-shadow: 0 1px 0 rgba(16,185,129,0.15) inset;
          display: flex; align-items: center; gap: 10px;
          animation: ww-pop 380ms ease-out both;
        }
        .ww-celebrate .ww-icon {
          font-size: 18px; line-height: 1;
        }
        .ww-celebrate .ww-title {
          color: ${BRAND.BROWN};
          font-weight: 700;
          font-size: 15px;
          line-height: 1.1;
        }
        .ww-celebrate .ww-sub {
          color: ${BRAND.SLATE_GREEN};
          font-size: 13px;
          line-height: 1.15;
        }

        /* Tiny confetti spritz (one-and-done, subtle) */
        .ww-confetti {
          position: absolute;
          inset: -4px -6px auto auto;
          width: 1px; height: 1px;
          box-shadow:
            0 0 #34d399,
            8px 2px #10b981,
            14px -1px #f59e0b,
            20px 3px #ef4444,
            26px -2px #3b82f6,
            32px 2px #a855f7,
            38px 0 #22c55e,
            44px -1px #f97316;
          opacity: 0;
          animation: ww-spritz 650ms ease-out 120ms 1 both;
        }

        @keyframes ww-pop {
          0% { transform: scale(0.92); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes ww-spritz {
          0% { transform: translateY(0); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(-10px); opacity: 0; }
        }
      `}</style>

      {applied ? (
        // ===================== APPLIED (celebration bubble) =====================
        <div
          className={["w-full", className].join(" ")}
          aria-live="polite"
          style={{ backgroundColor: BRAND.WHITE, borderRadius: UI.RADIUS }}
        >
          <div className="ww-celebrate">
            <span className="ww-icon" aria-hidden="true">🎉</span>
            <div className="min-w-0">
              <div className="ww-title">You beat the game! Perk applied.</div>
              <div className="ww-sub">
                {DISCOUNT_PERCENT}% off is already included in your total below.
              </div>
            </div>
            {/* subtle one-shot confetti */}
            <span className="ww-confetti" aria-hidden="true"></span>
          </div>
        </div>
      ) : (
        // ===================== INVITE =====================
        <section
          role="region"
          aria-label="Waxwing Perk mini-game"
          className={["w-full", className].join(" ")}
          style={{
            backgroundColor: BRAND.WHITE,
            border: `${UI.OUTLINE_THIN} solid ${UI.GREEN_SOFT}`,
            borderRadius: UI.RADIUS,
            padding: "12px 14px",
          }}
        >
          <p className="sr-only">
            Mini-game opens in a modal. No email or redirects. Discount applies to this booking if you win.
          </p>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div
                className="text-[11px] font-semibold uppercase tracking-wide"
                style={{ color: BRAND.STEEL_GREY }}
              >
                Waxwing Perk
              </div>
              <div
                className="font-semibold"
                style={{
                  color: BRAND.BROWN,
                  fontSize: "16px",
                  lineHeight: "1.15",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  marginTop: "2px",
                }}
              >
                We built a little pixel game just for you.
              </div>
              <div className="text-[13px]" style={{ color: BRAND.SLATE_GREEN }}>
                Win and we’ll knock {DISCOUNT_PERCENT}% off.
              </div>
            </div>

            <div className="sm:ml-6 shrink-0">
              <button
                type="button"
                onClick={openGame}
                onMouseDown={startPress}
                onMouseUp={endPress}
                onMouseLeave={endPress}
                onTouchStart={startPress}
                onTouchEnd={endPress}
                onBlur={endPress}
                onKeyDown={onKeyDown}
                onKeyUp={onKeyUp}
                className={`ww-btn ${pressed ? "ww-btn-pressed" : ""}`}
                aria-label={`Play mini-game to unlock ${DISCOUNT_PERCENT}% off`}
                title={`Play mini-game to unlock ${DISCOUNT_PERCENT}% off`}
              >
                <span aria-hidden="true" style={{ fontSize: 15, lineHeight: 1 }}>🎮</span>
                <span className="inline-block">Play</span>
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
