// src/pages/QuotePage.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Container from "../components/ui/Container.jsx";
import Stepper from "../components/quote/Stepper.jsx";

import StepDates from "../components/quote/steps/StepDates.jsx";
import StepPackage from "../components/quote/steps/StepPackage.jsx";
import StepReview from "../components/quote/steps/StepReview.jsx";
import AdditionalServices from "../components/quote/steps/AdditionalServices.jsx";

function useHashStep() {
  const { hash } = useLocation();
  return hash?.replace("#", "") || "dates";
}

export default function QuotePage() {
  const [dates, setDates] = useState([]);
  const [pkg, setPkg] = useState("full");
  const [halfDay, setHalfDay] = useState(false);
  const [services, setServices] = useState([]);

  const [step, setStep] = useState("dates");

  const hashStep = useHashStep();

  useEffect(() => {
    if (["dates", "package", "services", "review"].includes(hashStep)) {
      setStep(hashStep);
    }
  }, [hashStep]);
  useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}, [step]);

  const go = (s) => () => setStep(s);

  return (
    <main className="py-10">
      <Container>
        <h1 className="text-2xl font-semibold mb-4 md:mb-6">
          Plan your shoot
        </h1>

        <div className="max-w-7xl">
          <Stepper value={step} />
        </div>

        {step === "dates" && (
          <StepDates
            value={dates}
            onChange={setDates}
            onNext={go("package")}
          />
        )}

        {step === "package" && (
          <StepPackage
            pkg={pkg}
            halfDay={halfDay}
            onSelect={setPkg}
            onHalfDayChange={setHalfDay}
            onBack={go("dates")}
            onNext={go("services")}
          />
        )}

        {step === "services" && (
          <AdditionalServices
            selected={services}
            onChange={setServices}
            onBack={go("package")}
            onNext={go("review")}
          />
        )}

        {step === "review" && (
          <StepReview
            dates={dates}
            pkg={pkg}
            halfDay={halfDay}
            services={services}
            onBack={go("services")}
          />
        )}
      </Container>
    </main>
  );
}
