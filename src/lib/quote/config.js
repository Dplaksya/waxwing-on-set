// src/lib/quote/config.js
export const PACKAGES = {
  roll: {
    key: "roll",
    label: "Roll & Go",
    day: 500,
  },
  full: {
    key: "full",
    label: "Full Stack Van",
    day: 1200,        // sale price
    compareAt: 1500,  // optional strikethrough
    half: 700,        // 4–5 hr
  },
};

export const ADDON_GROUPS = [
  {
    key: "comms",
    title: "Comms",
    items: [
      { id: "walkies6", emoji: "📻", label: "Walkies (6) with headsets", price: 60, perDay: true },
      { id: "walkies12", emoji: "🎧", label: "Walkies (12) with headsets", price: 110, perDay: true },
    ],
  },
  {
    key: "rigging",
    title: "Rigging & Support",
    items: [
      { id: "popup", emoji: "⛺️", label: "10×10 pop-up", price: 25, perDay: true },
      { id: "ladder6", emoji: "🪜", label: "6’ ladder", price: 10, perDay: true },
      { id: "ladder8", emoji: "🪜", label: "8’ ladder", price: 12, perDay: true },
    ],
  },
  {
    key: "crew",
    title: "Extra Hands",
    items: [
      { id: "pa", emoji: "🧑‍🔧", label: "PA/driver (day)", price: 220, perDay: true },
    ],
  },
  {
    key: "utils",
    title: "Utilities",
    items: [
      { id: "heaters", emoji: "🔥", label: "Space heaters / fans", price: 20, perDay: true },
      { id: "distro", emoji: "⚡️", label: "Extra distro", price: 25, perDay: true },
      { id: "scout", emoji: "🗺️", label: "Scout day", price: 200, perDay: false },
      { id: "dump", emoji: "🗑️", label: "Dump run", price: 90, perDay: false },
    ],
  },
];

export const ADDONS_BY_ID = Object.fromEntries(
  ADDON_GROUPS.flatMap((g) => g.items).map((i) => [i.id, i])
);
