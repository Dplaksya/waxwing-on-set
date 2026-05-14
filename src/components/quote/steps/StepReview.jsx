// src/components/quote/steps/StepReview.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import Button from "../../ui/Button.jsx";
import Container from "../../ui/Container.jsx";
import PromoGameGate from "../../game/PromoGameGate.jsx";
import PixelGameModal from "../../game/PixelGameModal.jsx";
import BookingModal from "../BookingModal.jsx";
import { makeBookingKey, isDiscountApplied, setDiscountApplied } from "../../game/promoStorage.js";

import { SERVICES } from "./AdditionalServices.jsx";

// ----- Config -----
const PKG_BASE = { full: 750, empty: 250 };
const HALF_DAY_FACTOR = 0.6;
const TAX_LABEL = "HST";
const TAX_RATE = 0.13;

// ----- Date helpers -----
function parseISO(s){ const [y,m,d]=s.split("-").map(Number); return new Date(y,m-1,d); }
function monthShort(d){ return d.toLocaleString("en-US",{month:"short"}); }
function weekdayShort(d){ return d.toLocaleString("en-US",{weekday:"short"}); }

function formatDateRanges(isoDates){
  if(!isoDates||isoDates.length===0) return "";
  const dates=[...isoDates].sort().map(parseISO);
  const out=[]; let start=dates[0], prev=dates[0];

  const push=(s,e)=>{
    const sM=monthShort(s), eM=monthShort(e);

    if(s.toDateString()===e.toDateString()) {
      out.push(`${sM} ${s.getDate()}`);
    } else if(sM===eM) {
      out.push(`${sM} ${s.getDate()}–${e.getDate()}`);
    } else {
      out.push(`${sM} ${s.getDate()}–${eM} ${e.getDate()}`);
    }
  };

  for(let i=1;i<dates.length;i++){
    const cur=dates[i];
    const diff=(cur - prev)/(24*3600*1000);

    if(diff===1){
      prev=cur;
    } else {
      push(start, prev);
      start=prev=cur;
    }
  }

  push(start, prev);

  return out.join(", ");
}

function formatWeekdayChip(isoDates){
  if(!isoDates||isoDates.length===0) return "";

  const dates=[...isoDates].sort().map(parseISO);

  const first = dates[0];
  const last = dates[dates.length-1];

  const a = weekdayShort(first);
  const b = weekdayShort(last);

  return first.toDateString()===last.toDateString() ? a : `${a}–${b}`;
}

const currency = (n) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

const isPerDay = (u) =>
  typeof u === "string" && u.toLowerCase().includes("/day");

const isFlat = (u) =>
  typeof u === "string" && u.toLowerCase().includes("flat");

const DISPLAY_PKG = {
  full: "Full Stack Package",
  empty: "Van Only"
};

function indexById(list){
  const m = new Map();
  (list||[]).forEach(it => m.set(it.id, it));
  return m;
}

const PROMO = {
  code: "WAXWING10",
  rate: 0.10
};

// ----- HOLD TIMER -----
const HOLD_HOURS = 48;

const holdKey = (bookingKey) => `holdStart:${bookingKey}`;

const hoursToMs = (h) => h * 3600 * 1000;

function loadHoldStart(bookingKey){
  const v = localStorage.getItem(holdKey(bookingKey));
  return v ? Number(v) : null;
}

function startHoldNow(bookingKey){
  const t = Date.now();
  localStorage.setItem(holdKey(bookingKey), String(t));
  return t;
}

function getRemainingMs(holdStart){
  if(!holdStart) return 0;

  const end = holdStart + hoursToMs(HOLD_HOURS);

  return Math.max(0, end - Date.now());
}

function fmtCountdown(ms){
  const totalSec = Math.floor(ms/1000);

  const h = Math.floor(totalSec/3600);
  const m = Math.floor((totalSec%3600)/60);
  const s = totalSec%60;

  const pad=n=>String(n).padStart(2,"0");

  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function computeExpiryTimestamp(holdStart){
  if(!holdStart) return null;
  return new Date(holdStart + hoursToMs(HOLD_HOURS));
}

function fmtFriendly(dt){
  if(!dt) return "";

  const day = dt.toLocaleDateString("en-US",{
    weekday:"short",
    month:"short",
    day:"numeric"
  });

  const time = dt.toLocaleTimeString("en-US",{
    hour:"numeric",
    minute:"2-digit"
  }).toLowerCase();

  return `${day} · ${time}`;
}

export default function StepReview({
  dates = [],
  pkg = "full",
  halfDay = false,
  services = [],
  basePrice,
  onBack,
}) {

  // base pricing
  const pkgBaseRaw = basePrice ?? PKG_BASE[pkg] ?? 0;

  const pkgBase = halfDay
    ? Math.round(pkgBaseRaw * HALF_DAY_FACTOR)
    : pkgBaseRaw;

  const days = Math.max(1, dates.length || 0);

  const dateSummary = useMemo(
    () => formatDateRanges(dates),
    [dates]
  );

  const weekdayChip = useMemo(
    () => formatWeekdayChip(dates),
    [dates]
  );

  // services
  const servicesIdx = useMemo(
    () => indexById(SERVICES),
    []
  );

  const selectedServices = useMemo(
    () => (services||[])
      .map(id=>servicesIdx.get(id))
      .filter(Boolean),
    [services,servicesIdx]
  );

  // pricing
  const baseSubtotal = pkgBase * days;

  const servicesPerDay = useMemo(
    () => selectedServices
      .filter(s=>isPerDay(s.unit))
      .reduce((s,x)=> s + Number(x.price||0),0),
    [selectedServices]
  );

  const servicesFlat = useMemo(
    () => selectedServices
      .filter(s=>isFlat(s.unit))
      .reduce((s,x)=> s + Number(x.price||0),0),
    [selectedServices]
  );

  const servicesSubtotal =
    servicesPerDay * days + servicesFlat;

  const subtotal =
    baseSubtotal + servicesSubtotal;

  // discount
  const bookingKey = useMemo(
    ()=> makeBookingKey({ pkg, isoDates: dates }),
    [pkg, dates]
  );

  const [discountApplied, setDiscountAppliedState] =
    useState(()=> isDiscountApplied(bookingKey));
const [bookingOpen, setBookingOpen] = useState(false);
  useEffect(()=>{
    setDiscountAppliedState(
      isDiscountApplied(bookingKey)
    );
  }, [bookingKey]);

  const applyDiscount = () => {
    setDiscountApplied(bookingKey);
    setDiscountAppliedState(true);
  };

  const discountedSubtotal = discountApplied
    ? Math.round(subtotal * (1 - PROMO.rate))
    : subtotal;

  const savings =
    Math.max(0, subtotal - discountedSubtotal);

  const taxAmount =
    Math.round(discountedSubtotal * TAX_RATE);

  const grandTotal =
    discountedSubtotal + taxAmount;

  // hold state
  const [holdStart, setHoldStart] =
    useState(()=> loadHoldStart(bookingKey));

  const [remainingMs, setRemainingMs] =
    useState(()=> getRemainingMs(holdStart));

  const expiryAt = useMemo(
    ()=> computeExpiryTimestamp(holdStart),
    [holdStart]
  );

  useEffect(()=>{
    if (!holdStart) return;

    const id=setInterval(()=>{
      setRemainingMs(getRemainingMs(holdStart));
    },1000);

    return ()=> clearInterval(id);
  },[holdStart]);

  const countdownLabel = fmtCountdown(remainingMs);

  const onPrimaryClick = useCallback(() => {
    if (!loadHoldStart(bookingKey)) {
      const t = startHoldNow(bookingKey);
      setHoldStart(t);
      setRemainingMs(getRemainingMs(t));
    }
  }, [bookingKey]);

  return (
    <section className="py-8 md:py-10">
      <Container>

        <header className="mb-6 md:mb-8">
          <div className="flex items-end justify-between gap-4">

            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-[color:var(--ww-brown)]">
                Lock Your Shoot Dates
              </h1>

<p className="mt-2 text-[color:var(--ww-muted)]">
  We’ll hold your dates while you review. Lock them in now — we’ll confirm everything with a quick call.
</p>            </div>

            {holdStart && (
              <div
                className="hidden md:flex items-center gap-2 rounded-xl px-3 py-2 border bg-amber-50 border-amber-200 text-amber-900"
              >
                <span className="text-xs font-medium">
                  ⏳ Soft hold
                </span>

                <span className="text-xs">
                  until <span className="font-medium">
                    {fmtFriendly(expiryAt)}
                  </span>
                </span>
              </div>
            )}

          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-8 items-start">

          {/* LEFT */}
          <div className="ww-card p-5 md:p-6 space-y-5">

            <div>
              <div className="text-sm font-semibold">
                Booking details
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-2">

                <span className="inline-flex items-center justify-center rounded-md bg-gray-100 text-gray-800 text-xs px-2 py-1">
                  {weekdayChip || "—"}
                </span>

                <span className="inline-flex items-center justify-center rounded-md bg-gray-100 text-gray-800 text-xs px-2 py-1">
                  {dates?.length
                    ? `${dates.length} day${dates.length>1?"s":""}`
                    : "—"}
                </span>

                <span className="truncate">
                  {dateSummary || "—"}
                </span>

              </div>
            </div>

            <hr className="border-black/10" />

            <div>
              <div className="text-sm font-semibold">
                Package
              </div>

              <div className="mt-1">
                {DISPLAY_PKG[pkg] || pkg}
                {halfDay ? " (Half-day)" : ""}
              </div>

              <div className="mt-1 text-sm text-[color:var(--ww-muted)]">
                Base/day: {currency(pkgBase)}
              </div>
            </div>

            <hr className="border-black/10" />

            <div>
              <div className="text-sm font-semibold">
                Additional services
              </div>

              {selectedServices.length === 0 ? (
                <div className="mt-1 text-[color:var(--ww-muted)]">
                  None selected
                </div>
              ) : (
                <ul className="mt-2 grid gap-1">

                  {selectedServices.map(s=>(
                    <li
                      key={s.id}
                      className="flex items-center justify-between"
                    >
                      <span>{s.name}</span>

                      <span className="text-sm text-gray-600">
                        {currency(s.price)}
                        {isPerDay(s.unit)
                          ? " / day"
                          : isFlat(s.unit)
                          ? " flat"
                          : ""}
                      </span>
                    </li>
                  ))}

                </ul>
              )}
            </div>

            <div className="pt-2">
              <Button variant="outline" onClick={onBack}>
                Back
              </Button>
            </div>

          </div>

          {/* RIGHT */}
          <div className="ww-card p-5 md:p-6">

            <PromoGameGate
              isoDates={dates}
              pkg={pkg}
              onApplyDiscount={applyDiscount}
              className="mb-5"
              variant="banner"
            />

            <div className="flex items-center justify-between">
              <span>
                Base
                <span className="text-[color:var(--ww-muted)]">
                  {" "}({days} × {currency(pkgBase)}/day)
                </span>
              </span>

              <span className="font-semibold tabular-nums">
                {currency(baseSubtotal)}
              </span>
            </div>

            <div className="flex items-center justify-between mt-2">

              <span>
                Services{" "}

                {(servicesPerDay > 0 || servicesFlat > 0) ? (
                  <span className="text-[color:var(--ww-muted)]">
                    (
                    {servicesPerDay > 0
                      ? `${days} × day-rate`
                      : ""}

                    {servicesPerDay>0 && servicesFlat>0
                      ? " + "
                      : ""}

                    {servicesFlat > 0
                      ? "flat"
                      : ""}

                    )
                  </span>
                ) : (
                  <span className="text-[color:var(--ww-muted)]">
                    (none)
                  </span>
                )}

              </span>

              <span className="font-semibold tabular-nums">
                {currency(servicesSubtotal)}
              </span>

            </div>

            <hr className="my-3 border-black/10" />

            {discountApplied && (
              <div className="flex items-center justify-between mt-1 text-emerald-700">

                <span>
                  Waxwing perk (
                  <span className="font-mono">
                    {PROMO.code}
                  </span>
                  )
                </span>

                <span className="font-semibold tabular-nums">
                  –{currency(savings)}
                </span>

              </div>
            )}

            <div className="flex items-center justify-between mt-3">

              <span>Subtotal</span>

              <span className="font-semibold tabular-nums">
                {currency(discountApplied
                  ? discountedSubtotal
                  : subtotal)}
              </span>

            </div>

            <div className="flex items-center justify-between mt-1">

              <span>
                Tax ({TAX_LABEL} {Math.round(TAX_RATE*100)}%)
              </span>

              <span className="font-semibold tabular-nums">
                {currency(taxAmount)}
              </span>

            </div>

            <hr className="my-4 border-black/10" />

            <div className="rounded-lg bg-gray-50 px-4 py-5 flex items-center justify-between">

              <div className="text-lg md:text-xl font-medium text-gray-700">
                Total
              </div>

              <div className="text-right">

                <div className="text-2xl md:text-3xl font-semibold tabular-nums">
                  {currency(grandTotal)}
                </div>

                <div className="text-xs text-gray-600 mt-0.5">
                  All-in for {days} day{days>1?"s":""} incl. tax
                </div>

              </div>

            </div>

            <p className="mt-4 text-sm text-[color:var(--ww-brown)]/70 text-center">
              Transparent pricing. Tax included up front.
              No surprises.
            </p>

            <div className="mt-3">

<Button
  onClick={() => {
    onPrimaryClick();
    setBookingOpen(true);
  }}
  className={[
    "w-full justify-center py-3 text-base rounded-xl",
    "bg-[#FF7A2E] hover:bg-[#F25F00] text-white",
    "shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5",
    "focus:outline-none focus:ring-2 focus:ring-[#FF7A2E]/40",
  ].join(" ")}
>
  Lock My Dates
</Button>
              <p className="mt-2 text-center text-xs text-gray-500">
                We’ll call to confirm — or call us anytime to finalize.
              </p>

            </div>

          </div>

        </div>
      </Container>

      {holdStart && (
        <div
          className="md:hidden fixed left-1/2 -translate-x-1/2 bottom-3 z-40 px-3 py-2 rounded-full border shadow-sm bg-amber-50 border-amber-200 text-amber-900"
        >
          <span className="text-xs font-medium mr-2">
            Soft hold
          </span>

          <span className="font-mono text-sm tabular-nums">
            {countdownLabel}
          </span>
        </div>
      )}
<BookingModal
  open={bookingOpen}
  onClose={() => setBookingOpen(false)}
  dates={dates}
  pkg={DISPLAY_PKG[pkg] || pkg}
  services={selectedServices.map((s) => s.name)}
  total={currency(grandTotal)}
/>
      <PixelGameModal />

    </section>
  );
}