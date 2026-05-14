// src/components/game/assetLoader.js
// Zero-config loader that uses EXACT files already in:
//   src/components/game/assets/*
//   src/components/game/assets/obstacles/*
//
// It matches by name fragments (case-insensitive):
//   - intro background:  ["intro", "background"]
//   - game background:   ["pixel", "background"] (but not "intro")
//   - player:            ["playable", "character"] or ["player"]
//   - obstacles: everything in /obstacles except any name with "diva"

function makeImg(url) {
  const img = new Image();
  img.decoding = "async";
  img.loading = "eager";
  img.src = url;
  return img;
}
function onReady(img) {
  return new Promise((res) => {
    if (img.complete && img.naturalWidth > 0) return res(true);
    img.onload = () => res(img.naturalWidth > 0);
    img.onerror = () => res(false);
  });
}

// -------------- grab all URLs from your folders --------------
const baseGlobs = import.meta.glob(
  [
    // files right under assets
    "/src/components/game/assets/*.{png,jpg,jpeg,webp,gif}",
    // obstacle files
    "/src/components/game/assets/obstacles/*.{png,jpg,jpeg,webp,gif}",
  ],
  { eager: true, as: "url" }
);

// Make an index: filename (lowercased) -> { url, path }
const files = Object.entries(baseGlobs).map(([absPath, url]) => {
  const name = absPath.split("/").pop().toLowerCase();
  return { name, url, path: absPath.toLowerCase() };
});

// simple matcher
const hasAll = (s, needles) => needles.every((n) => s.includes(n));
const not = (s, needle) => !s.includes(needle);

// -------------- pick images by fuzzy filename --------------
function pickIntroBg() {
  // e.g. "intro_background.png"
  const hit = files.find((f) => hasAll(f.name, ["intro", "background"]));
  return hit?.url ?? null;
}
function pickGameBg() {
  // e.g. "pixel_game_background.png" (anything with "pixel" + "background", but not "intro")
  const hit =
    files.find((f) => hasAll(f.name, ["pixel", "background"]) && not(f.name, "intro")) ||
    files.find((f) => hasAll(f.name, ["game", "background"]) && not(f.name, "intro"));
  return hit?.url ?? null;
}
function pickPlayer() {
  // e.g. "PlayableCharacter.png", or anything with "player"
  const hit =
    files.find((f) => hasAll(f.name, ["playable", "character"])) ||
    files.find((f) => f.name.includes("player"));
  return hit?.url ?? null;
}
function pickObstacles() {
  // Everything under /obstacles except "diva"
  // Your set: apple_boxes, coffee, dead_battery, grip_cart, pizza, wires
  return files
    .filter((f) => f.path.includes("/assets/obstacles/"))
    .filter((f) => !f.name.includes("diva")) // remove interrupting person
    .map((f) => f.url);
}

// -------------- cache --------------
const cache = {
  primed: false,
  ready: false,
  bgIntro: null,
  bgGame: null,
  player: null,
  obstacles: [],
};

let primePromise = null;

async function prime() {
  if (primePromise) return primePromise;
  primePromise = (async () => {
    const introUrl = pickIntroBg();
    const gameUrl  = pickGameBg();
    const playerUrl = pickPlayer();
    const obstacleUrls = pickObstacles();

    cache.bgIntro = introUrl ? makeImg(introUrl) : null;
    cache.bgGame  = gameUrl  ? makeImg(gameUrl)  : null;
    cache.player  = playerUrl ? makeImg(playerUrl) : null;
    cache.obstacles = obstacleUrls.map(makeImg);

    const results = await Promise.all([
      cache.bgIntro ? onReady(cache.bgIntro) : Promise.resolve(false),
      cache.bgGame  ? onReady(cache.bgGame)  : Promise.resolve(false),
      cache.player  ? onReady(cache.player)  : Promise.resolve(false),
      ...cache.obstacles.map(onReady),
    ]);

    const [okIntro, okGame, okPlayer, ...okObs] = results;
    cache.obstacles = cache.obstacles.filter((_, i) => okObs[i]);

    cache.primed = true;
    cache.ready = !!okIntro && !!okGame && !!okPlayer && cache.obstacles.length > 0;

    if (!cache.ready) {
      const missing = [];
      if (!okIntro)  missing.push("intro background");
      if (!okGame)   missing.push("game background");
      if (!okPlayer) missing.push("player sprite");
      if (cache.obstacles.length === 0) missing.push("obstacles");
      console.warn("[assetLoader] Missing/failed:", missing.join(", "));
      console.log("[assetLoader] All known files:", files.map(f => f.name));
    }
  })();
  return primePromise;
}

// -------------- public API --------------
export async function whenAssetsReady() {
  await prime();
  return cache.ready;
}
export function assetsReady() {
  if (!cache.primed) void prime();
  return cache.ready;
}
export function getGameBackground() {
  if (!cache.primed) void prime();
  return cache.bgGame;
}
export function getIntroBackground() {
  if (!cache.primed) void prime();
  return cache.bgIntro;
}
export function getPlayer() {
  if (!cache.primed) void prime();
  return cache.player;
}
export function obstacleImages() {
  if (!cache.primed) void prime();
  return cache.obstacles;
}
