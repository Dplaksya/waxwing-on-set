// src/components/quote/steps/StepDates.jsx
import React, { useMemo, useState } from "react";
import Calendar from "../../calendar/Calendar.jsx";
import Button from "../../ui/Button.jsx";
import Container from "../../ui/Container.jsx";

function parseISO(s){ const [y,m,d]=s.split("-").map(Number); return new Date(y,m-1,d); }
function monthShort(d){ return d.toLocaleString("en-US",{month:"short"}); }
function formatRanges(isoDates){
  if(!isoDates||isoDates.length===0) return "";
  const dts=[...isoDates].sort().map(parseISO);
  const out=[]; let start=dts[0], prev=dts[0];
  const push=(s,e)=>{ const sM=monthShort(s), eM=monthShort(e);
    if(s.toDateString()===e.toDateString()) out.push(`${sM} ${s.getDate()}`);
    else if(sM===eM) out.push(`${sM} ${s.getDate()}–${e.getDate()}`);
    else out.push(`${sM} ${s.getDate()}–${eM} ${e.getDate()}`); };
  for(let i=1;i<dts.length;i++){
    const cur=dts[i]; const diff=(cur - prev)/(24*3600*1000);
    if(diff===1){ prev=cur; } else { push(start, prev); start=prev=cur; }
  }
  push(start, prev);
  return out.join(", ");
}

export default function StepDates({ selected = [], onChange, onNext }) {
  const [local, setLocal] = useState(new Set(selected));
  const selectedArr = useMemo(() => [...local].sort(), [local]);
  const summary = useMemo(() => formatRanges(selectedArr), [selectedArr]);

  const toggle = (iso) => {
    setLocal(prev => {
      const next = new Set(prev);
      if (next.has(iso)) next.delete(iso); else next.add(iso);
      onChange?.([...next]);
      return next;
    });
  };

  return (
    <section className="py-8 md:py-10">
      <Container>
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-[color:var(--ww-brown)]">Check Dates</h1>
          <p className="mt-2 text-[color:var(--ww-muted)]">Pick your shoot days on the left, then continue to choose a package and add-ons.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            {/* Calendar uses ring markers (no fills) */}
            <Calendar selected={[...local]} onToggle={toggle} />
          </div>

          {/* Selected dates */}
          <div className="ww-card p-4">
            <h3 className="text-lg font-semibold">Selected dates</h3>
            <p className="mt-2 text-[color:var(--ww-brown)] min-h-[2.5rem]" aria-live="polite">
              {summary || <span className="text-[color:var(--ww-muted)]">No dates selected yet.</span>}
            </p>
          </div>
        </div>

        {/* Continue (lower spacing) */}
        <div className="mt-8">
          <Button className="w-full" onClick={onNext}>Continue</Button>
        </div>
      </Container>
    </section>
  );
}
