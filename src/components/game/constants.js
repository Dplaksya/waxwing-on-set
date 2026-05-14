// src/components/game/constants.js

// ---- Brand (fallbacks—Tailwind/CSS vars still take precedence) ----
export const BRAND = {
  ORANGE: "#F25F00",
  BROWN: "#382F20",
  WHITE: "#FFFFFF",
  COPPER: "#D0742F",
};

// ---- Rendering ----
export const DPR_CAP = 2;                 // cap devicePixelRatio for perf
export const IMAGE_SMOOTHING = false;     // keep pixel art crisp

// ---- Lanes / geometry ----
export const NUM_LANES = 4;
export const PLAYER_BASE_SIZE_RATIO = 0.12;   // ~12% of canvas min-dim
export const OBSTACLE_SIZE_SCALE = 0.90;      // base; we often add +10% on spawn

// Hitboxes (slightly forgiving to feel fair)
export const GLOBAL_HITBOX_SCALE = 0.70;  // global scale for player collisions
export const OB_HITBOX_SCALE = 0.85;      // obstacle-specific tweak

// Baseline Y position of the player as a % of canvas height (0=top, 1=bottom)
// ⬇️ lower so the bird sits further down
export const BIRD_BASELINE_PCT = 0.86;

// ---- Scrolling & Spawns ----
export const START_SCROLL_SPEED = 280;    // px/sec
export const MAX_SCROLL_SPEED   = 560;    // px/sec at max difficulty ramp

// Spawn cadence (ms) → converted to seconds in the loop
export const START_SPAWN_DELAY_MS = 900;  // easy start
export const MIN_SPAWN_DELAY_MS   = 350;  // fastest spawn at peak difficulty

// Difficulty curve
export const DIFFICULTY_RAMP_SECONDS = 22; // time to reach max difficulty
export const MAX_SIMULTANEOUS_OBS    = 4;

// Input pacing
export const HORIZONTAL_MOVE_COOLDOWN = 110; // ms between lane changes

// ---- Win goal ----
export const WIN_SURVIVE_SECONDS = 30;

// ---- Countdown (reliable 3→2→1→GO!) ----
export const COUNTDOWN_VALUES = ["3", "2", "1", "GO!"];
export const COUNTDOWN_STEP_MS = 700;

// ---- Confetti ----
export const CONFETTI_COUNT    = 120;
export const CONFETTI_DURATION = 1600; // ms

// ---- Background layout sampling (percentages of bg width) ----
// These mark the painted road bounds inside the background art.
// ⬇️ wider road + tiny inset so edge lanes sit closer to the edges.
export const BG_ROAD_LEFT_PCT    = 0.285;
export const BG_ROAD_RIGHT_PCT   = 0.715;
export const ROAD_SAFE_INSET_PCT = 0.015;

// ---- Game loop safety clamp ----
export const MAX_FRAME_DT = 0.20;
// Backwards-compat alias so existing imports keep working:
export const MAX_DT = MAX_FRAME_DT;
