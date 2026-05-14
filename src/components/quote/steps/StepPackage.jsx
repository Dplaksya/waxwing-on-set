// src/components/quote/steps/StepPackage.jsx
import React, { useEffect, useState } from "react";
import PackageCards from "../PackageCards.jsx";
import Button from "../../ui/Button.jsx";
import Container from "../../ui/Container.jsx";

export default function StepPackage({
  pkg,
  halfDay,
  onSelect,
  onHalfDayChange,
  onBack,
  onNext,
}) {
  const [localPkg, setLocalPkg] = useState(pkg || "full");
  const [localHalf, setLocalHalf] = useState(Boolean(halfDay));

  useEffect(() => { if (!pkg && onSelect) onSelect("full"); /* eslint-disable-next-line */ }, []);

  const handleSelect = (id) => { setLocalPkg(id); onSelect?.(id); };
  const handleHalf = (v) => { setLocalHalf(v); onHalfDayChange?.(v); };

  return (
    <section className="py-8 md:py-10">
      <Container>
        <header className="mb-6 md:mb-8">
          <h2 className="text-3xl md:text-4xl">Choose Your Package</h2>
          <p className="mt-3 text-gray-600">Pick a base van. Add items on the next step.</p>
        </header>

        <PackageCards
          selected={localPkg}
          onSelect={handleSelect}
          halfDay={localHalf}
          onHalfDayChange={handleHalf}
        />

        {/* Actions: Back left, Continue right */}
        <div className="mt-6 flex items-center justify-between">
          <Button variant="outline" onClick={onBack}>Back</Button>
          <Button onClick={onNext}>Continue</Button>
        </div>
      </Container>
    </section>
  );
}
