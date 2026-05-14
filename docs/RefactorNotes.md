# Refactor Notes

## Summary
- Consolidated calendar logic into a **single file** (`Calendar.jsx`) with clean props and consistent, stable selection mechanics.
- Range selection now commits on mouseup and remains selected. Multi-select toggles persist.
- Calendar visuals match your provided spec: green outline for selection, subtle booked/soft/today chips, calm hover halos in preview.
- Quote flow header copy updated to **Plan your shoot** with added breathing room; stepper alignment nudged for consistency.

## What to edit
- Availability data: `src/lib/availability.js`
- Calendar usage:
  - Homepage: `src/pages/HomePage.jsx` (unchanged)
  - Quote step dates: `src/components/quote/steps/StepDates.jsx` (uses `selected` + `onToggle`)

## Notes
- If you want contiguous ranges inside the quote flow, pass `selectionMode="range"` to the calendar in `StepDates`. For independent picks, use `"multi"` (current StepDates uses toggles).
