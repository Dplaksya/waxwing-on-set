// src/components/game/InlineGameCTA.jsx
import React from "react";
import PromoGameGate from "./PromoGameGate.jsx";

/**
 * InlineGameCTA (wrapper)
 * Use the unified PromoGameGate everywhere.
 * - Pass booking context via isoDates + pkg.
 * - Bubble discount info through onDiscountApplied (optional).
 * NOTE: PixelGameModal should be mounted once at the page level (e.g., StepReview).
 */
export default function InlineGameCTA({
  className = "",
  isoDates = [],
  pkg = "full",
  onDiscountApplied, // optional callback { code, percent }
}) {
  const handleApply = (code = "WAXWING10", percent = 10) => {
    onDiscountApplied?.({ code, percent });
  };

  return (
    <PromoGameGate
      isoDates={isoDates}
      pkg={pkg}
      onApplyDiscount={handleApply}
      className={className}
      variant="banner"
    />
  );
}
