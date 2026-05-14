// src/components/game/PixelGameModal.jsx
import React, { useEffect, useRef, useState } from "react";
import PixelGameCanvas from "./PixelGameCanvas.jsx";

export default function PixelGameModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [won, setWon] = useState(false);
  const currentBookingKeyRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    const onOpen = (e) => {
      currentBookingKeyRef.current = e?.detail?.bookingKey || null;
      setWon(false);
      setIsOpen(true);
      setTimeout(() => closeBtnRef.current?.focus(), 0);
    };
    const onEsc = (e) => { if (e.key === "Escape") setIsOpen(false); };
    window.addEventListener("pixelGame:open", onOpen);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("pixelGame:open", onOpen);
      window.removeEventListener("keydown", onEsc);
    };
  }, []);

  const close = () => setIsOpen(false);
  const handleWinRequest = () => setWon(true);

  const applyAndClose = () => {
    const bookingKey = currentBookingKeyRef.current;
    window.dispatchEvent(new CustomEvent("pixelGame:win", { detail: { bookingKey } }));
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" role="dialog" aria-modal="true" aria-label="Waxwing mini-game">
      <div className="absolute inset-0 bg-black/55" onClick={close} />

      <div className="relative w-[min(92vw,860px)] rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="font-semibold text-[color:var(--ww-brown,#382F20)]">Waxwing Road Trip</div>
          <button
            ref={closeBtnRef}
            onClick={close}
            className="rounded-md px-2 py-1 text-sm text-[color:var(--ww-brown,#382F20)]/70 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-black/20"
          >
            Close
          </button>
        </div>

        <div className="relative overflow-hidden aspect-[16/9] h-[min(58vh,520px)]">
          <PixelGameCanvas bookingKey={currentBookingKeyRef.current} onWinRequest={handleWinRequest} />

          {won && (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="rounded-[18px] bg-black/78 backdrop-blur-sm border-4 border-white/20 shadow-[0_0_0_8px_rgba(0,0,0,.25)] text-center text-white px-8 py-7">
                <h2 className="text-2xl md:text-3xl font-extrabold mb-3 pixelish">CONGRATULATIONS!</h2>
                <p className="opacity-90">You did it — here’s your promo code:</p>

                {/* Promo code first */}
                <div className="mt-3 inline-block border-2 border-dashed border-white/70 px-4 py-2 rounded-lg font-mono text-lg tracking-wider select-all">
                  WAXWING10
                </div>

                {/* Button explicitly UNDER the code */}
                <PrimaryButton className="mt-5" onClick={applyAndClose}>
                  Apply code & close
                </PrimaryButton>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        .pixelish { font-family: "Press Start 2P", ui-sans-serif, system-ui, -apple-system; letter-spacing: .5px; }
      `}</style>
    </div>
  );
}

function PrimaryButton({ className = "", children, ...props }) {
  return (
    <button
      {...props}
      className={[
        "px-6 py-2 rounded-full bg-[color:var(--ww-orange,#F25F00)] text-white font-semibold",
        "hover:opacity-90 active:scale-95 transition",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
