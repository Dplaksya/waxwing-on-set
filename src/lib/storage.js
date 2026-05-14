// src/lib/storage.js
export const storage = {
  get(key, fallback){ try{ return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback; } catch { return fallback; } },
  set(key, value){ try{ localStorage.setItem(key, JSON.stringify(value)); } catch {} },
  remove(key){ try{ localStorage.removeItem(key); } catch {} }
};
