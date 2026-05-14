// Keep this file even if it seems redundant—older code often imports from here.
function startOfDay(d){ const x=new Date(d); x.setHours(0,0,0,0); return x; }
function addMonths(d,n){ const x=new Date(d); x.setMonth(x.getMonth()+n); return x; }
export const MIN_DT = startOfDay(new Date());
export const MAX_DT = startOfDay(addMonths(new Date(), 12));
export const DAYS_RANGE = Math.ceil((MAX_DT - MIN_DT) / (1000*60*60*24));
