// src/components/game/PixelGameCanvas.jsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  BRAND, DPR_CAP, NUM_LANES, PLAYER_BASE_SIZE_RATIO, OBSTACLE_SIZE_SCALE,
  BIRD_BASELINE_PCT, START_SCROLL_SPEED, MAX_SCROLL_SPEED,
  START_SPAWN_DELAY_MS, MIN_SPAWN_DELAY_MS,
  DIFFICULTY_RAMP_SECONDS, MAX_SIMULTANEOUS_OBS,
  HORIZONTAL_MOVE_COOLDOWN, WIN_SURVIVE_SECONDS, IMAGE_SMOOTHING,
  BG_ROAD_LEFT_PCT, BG_ROAD_RIGHT_PCT, ROAD_SAFE_INSET_PCT,
  COUNTDOWN_VALUES, COUNTDOWN_STEP_MS, CONFETTI_COUNT, CONFETTI_DURATION,
  GLOBAL_HITBOX_SCALE, OB_HITBOX_SCALE,
} from "./constants.js";
import useGameLoop from "./hooks/useGameLoop.js";
import useInput from "./hooks/useInput.js";
import { getGameBackground, getIntroBackground, getPlayer, obstacleImages } from "./assetLoader.js";
import { setWon } from "./promoStorage.js";

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp  = (a, b, t) => a + (b - a) * t;

function useContainerSize() {
  const containerRef = useRef(null);
  const [size, setSize] = useState({ w: 640, h: 360 });
  useEffect(() => {
    const ro = new ResizeObserver(() => {
      const el = containerRef.current;
      if (!el) return;
      setSize({ w: el.clientWidth, h: el.clientHeight });
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);
  return { containerRef, size };
}

export default function PixelGameCanvas({ onWinRequest, bookingKey }) {
  // PHASE: intro | countdown | playing | gameover
  const [phase, setPhase] = useState("intro");
  const [win, setWin] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);

  // lives: 2 hearts (3rd hit = game over)
  const [hearts, setHearts] = useState(2);

  // HUD timer
  const [secondsLeft, setSecondsLeft] = useState(WIN_SURVIVE_SECONDS);

  const { containerRef, size } = useContainerSize();
  const canvasRef = useRef(null);

  // World
  const layoutRef = useRef(null);
  const playerRef = useRef({ lane: 1 });
  const obstaclesRef = useRef([]);
  const spawnCooldownRef = useRef(0);
  const timeRef = useRef(0);
  const lastMoveAtRef = useRef(0);
  const lastSpawnLaneRef = useRef(null);

  // i-frames
  const invulnMsRef = useRef(0);

  // Countdown
  const [countdownIdx, setCountdownIdx] = useState(0);
  const countdownTimeoutsRef = useRef([]);
  const countdownStartedRef = useRef(false);

  // Confetti
  const confettiRef = useRef([]);

  // Preload check
  useEffect(() => {
    const bg = getGameBackground();
    const pl = getPlayer();
    const obs = obstacleImages();
    if (bg && pl && obs.length > 0) setAssetsReady(true);
  }, []);

  // Input
  useInput({
    onLeft: () => { if (phase === "intro" || (phase === "gameover" && !win)) onStart(); tryMove(-1); },
    onRight: () => { if (phase === "intro" || (phase === "gameover" && !win)) onStart(); tryMove(1); },
  });
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        if (phase === "intro") onStart();
        else if (phase === "gameover" && !win) onRetry();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, win]);

  function tryMove(dir) {
    if (phase !== "playing") return;
    const now = performance.now();
    if (now - lastMoveAtRef.current < HORIZONTAL_MOVE_COOLDOWN) return;
    const p = playerRef.current;
    const L = layoutRef.current;
    if (!L) return;

    const nextLane = clamp(p.lane + dir, 0, NUM_LANES - 1);
    if (nextLane !== p.lane) {
      p.lane = nextLane;
      p.targetX = L.laneCenters[p.lane];
      // snap to exact center
      p.x = p.targetX;
      p.y = L.yBase;
      lastMoveAtRef.current = now;
    }
  }

  function computeLayoutFromBackgroundRect(W, H, bgDX, bgDY, bgDW, bgDH) {
    // float math (no rounding bias)
    const roadL = bgDX + bgDW * BG_ROAD_LEFT_PCT;
    const roadR = bgDX + bgDW * BG_ROAD_RIGHT_PCT;
    const roadW = roadR - roadL;
    const inset = roadW * ROAD_SAFE_INSET_PCT;
    const safeL = roadL + inset;
    const safeR = roadR - inset;
    const laneW = (safeR - safeL) / NUM_LANES;
    const laneCenters = Array.from({ length: NUM_LANES }, (_, i) => safeL + laneW * (i + 0.5));
    const yBase = H * BIRD_BASELINE_PCT;
    return { safeL, safeR, laneCenters, yBase, bgDX, bgDY, bgDW, bgDH };
  }

  // Game loop
  useGameLoop((dt) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = size.w, H = size.h;
    draw(canvas, W, H);

    const L = layoutRef.current;
    if (!L) return;
    const p = playerRef.current;
    if (!p.initialized) {
      p.size = Math.min(W, H) * PLAYER_BASE_SIZE_RATIO;
      p.yBase = L.yBase;
      p.lane = 1;
      p.x = p.targetX = L.laneCenters[p.lane];
      p.y = p.yBase;
      p.initialized = true;
    }

    if (phase === "playing") {
      timeRef.current += dt;
      setSecondsLeft(Math.max(0, Math.ceil(WIN_SURVIVE_SECONDS - timeRef.current)));

      const diffT = clamp(timeRef.current / DIFFICULTY_RAMP_SECONDS, 0, 1);
      const speed = lerp(START_SCROLL_SPEED, MAX_SCROLL_SPEED, diffT);
      const spawnDelaySec = lerp(START_SPAWN_DELAY_MS, MIN_SPAWN_DELAY_MS, diffT) / 1000;

      // we snap, so skip easing:
      // p.x = lerp(p.x, p.targetX, Math.min(1, dt * 16));
      p.x = clamp(p.x, L.safeL + 2, L.safeR - 2);

      spawnCooldownRef.current -= dt;
      if (spawnCooldownRef.current <= 0 && obstaclesRef.current.length < MAX_SIMULTANEOUS_OBS) {
        spawnObstacle(L, p.size, timeRef.current);
        spawnCooldownRef.current = spawnDelaySec;
      }

      for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
        const o = obstaclesRef.current[i];
        o.y += speed * dt;
        if (o.y > H + o.size) obstaclesRef.current.splice(i, 1);
      }

      if (invulnMsRef.current > 0) invulnMsRef.current -= dt * 1000;

      if (invulnMsRef.current <= 0 && checkCollision(p, obstaclesRef.current)) {
        if (hearts > 0) {
          setHearts((v) => v - 1);
          invulnMsRef.current = 900; // flicker window
        } else {
          endGame(false);
        }
      }

      if (timeRef.current >= WIN_SURVIVE_SECONDS) endGame(true);
    }

    if (phase === "gameover" && win) updateConfetti(dt);
  });

  function endGame(winState) {
    setPhase("gameover");
    setWin(winState);
    if (winState) {
      setWon(bookingKey);
      spawnConfetti();
      onWinRequest?.();
    }
  }

  function spawnObstacle(L, playerSize, t) {
    const sprites = obstacleImages();
    let lane = Math.floor(Math.random() * NUM_LANES);
    if (t < 6 && lastSpawnLaneRef.current !== null && Math.random() < 0.8) {
      while (lane === lastSpawnLaneRef.current) lane = Math.floor(Math.random() * NUM_LANES);
    }
    lastSpawnLaneRef.current = lane;

    obstaclesRef.current.push({
      lane,
      x: L.laneCenters[lane],
      y: -playerSize,
      size: Math.floor(playerSize * OBSTACLE_SIZE_SCALE),
      spriteIdx: Math.floor(Math.random() * sprites.length),
    });
  }

  function checkCollision(p, obs) {
    const pw = p.size * GLOBAL_HITBOX_SCALE;
    const ph = p.size * GLOBAL_HITBOX_SCALE;
    const px0 = p.x - pw / 2, px1 = p.x + pw / 2;
    const py0 = p.y - ph / 2, py1 = p.y + ph / 2;
    for (const o of obs) {
      const ow = o.size * OB_HITBOX_SCALE;
      const oh = o.size * OB_HITBOX_SCALE;
      const ox0 = o.x - ow / 2, ox1 = o.x + ow / 2;
      const oy0 = o.y - oh / 2, oy1 = o.y + oh / 2;
      if (px0 < ox1 && px1 > ox0 && py0 < oy1 && py1 > oy0) return true;
    }
    return false;
  }

  // ---------- Countdown (reliable 3→2→1→GO!) ----------
  function runCountdown() {
    if (countdownStartedRef.current) return;
    countdownStartedRef.current = true;
    setPhase("countdown");
    setCountdownIdx(0); // show "3" immediately
    const timers = [];

    for (let i = 1; i < COUNTDOWN_VALUES.length; i++) {
      timers.push(setTimeout(() => setCountdownIdx(i), COUNTDOWN_STEP_MS * i));
    }
    const total = COUNTDOWN_STEP_MS * (COUNTDOWN_VALUES.length - 1) + 450;
    timers.push(setTimeout(() => {
      setPhase("playing");
      spawnCooldownRef.current = 0.2;
    }, total));

    countdownTimeoutsRef.current = timers;
  }
  function clearCountdown() {
    countdownTimeoutsRef.current.forEach((id) => clearTimeout(id));
    countdownTimeoutsRef.current = [];
    countdownStartedRef.current = false;
  }

  const draw = useCallback((canvas, W, H) => {
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = IMAGE_SMOOTHING;

    const bg = phase === "intro" ? getIntroBackground() : getGameBackground();
    let bgDX = 0, bgDY = 0, bgDW = W, bgDH = H;
    if (bg && bg.complete) {
      const scale = Math.max(W / bg.width, H / bg.height);
      bgDW = bg.width * scale;
      bgDH = bg.height * scale;
      bgDX = (W - bgDW) / 2;
      bgDY = (H - bgDH) / 2;
      ctx.drawImage(bg, bgDX, bgDY, bgDW, bgDH);
    } else {
      ctx.fillStyle = "#0e0e0e"; ctx.fillRect(0, 0, W, H);
    }

    layoutRef.current = computeLayoutFromBackgroundRect(W, H, bgDX, bgDY, bgDW, bgDH);

    if (phase === "intro") { ctx.fillStyle = "rgba(0,0,0,0.35)"; ctx.fillRect(0, 0, W, H); }

    // player
    const L = layoutRef.current;
    const pr = playerRef.current;
    const bird = getPlayer();
    const w = pr.size || Math.min(W, H) * PLAYER_BASE_SIZE_RATIO;
    const h = w;
    const px = (pr.x || L.laneCenters?.[1] || W/2) - w/2;
    const py = (pr.y || L.yBase || Math.floor(H * BIRD_BASELINE_PCT)) - h/2;

    const flickerOn = invulnMsRef.current > 0 ? Math.floor((performance.now() / 120) % 2) === 0 : true;
    if (flickerOn) {
      if (bird && bird.complete) ctx.drawImage(bird, px, py, w, h);
      else { ctx.fillStyle = BRAND.ORANGE; ctx.beginPath(); ctx.arc(px + w/2, py + h/2, w/2, 0, Math.PI*2); ctx.fill(); }
    }

    // obstacles
    const sprites = obstacleImages();
    for (const o of obstaclesRef.current) {
      const s = sprites[o.spriteIdx];
      if (s && s.complete) ctx.drawImage(s, o.x - o.size/2, o.y - o.size/2, o.size, o.size);
      else { ctx.fillStyle = BRAND.COPPER; ctx.fillRect(o.x - o.size/2, o.y - o.size/2, o.size, o.size); }
    }

    // visible countdown
    if (phase === "countdown") {
      const label = COUNTDOWN_VALUES[countdownIdx] ?? "1";
      const isGo = label.startsWith("GO");
      const t = performance.now() * 0.003;
      const scale = 1 + (isGo ? 0.06 : 0.12) * Math.sin(t);
      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,0.40)";
      ctx.fillRect(0, 0, W, H);
      ctx.translate(W/2, H/2);
      ctx.scale(scale, scale);
      ctx.font = "900 112px 'Press Start 2P', ui-sans-serif, system-ui, -apple-system";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.lineWidth = 10; ctx.strokeStyle = "rgba(0,0,0,0.35)";
      ctx.strokeText(String(label), 0, 0);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(String(label), 0, 0);
      ctx.restore();
    }

    if (phase === "gameover" && win) {
      for (const cf of confettiRef.current) {
        ctx.save(); ctx.translate(cf.x, cf.y); ctx.rotate(cf.rot);
        ctx.fillStyle = `hsl(${cf.hue} 90% 55%)`;
        ctx.fillRect(-cf.size/2, -cf.size/2, cf.size, cf.size);
        ctx.restore();
      }
    }
  }, [phase, win]);

  function spawnConfetti() {
    const W = size.w, H = size.h;
    const parts = [];
    for (let i = 0; i < CONFETTI_COUNT; i++) {
      parts.push({
        x: W/2, y: H/3, vx: (Math.random()-0.5)*300, vy: -200 - Math.random()*200,
        size: 4 + Math.random()*4, rot: Math.random()*Math.PI*2, vr: (Math.random()-0.5)*8,
        lifeMs: CONFETTI_DURATION, hue: 20 + Math.random()*40,
      });
    }
    confettiRef.current = parts;
  }
  function updateConfetti(dt) {
    const parts = confettiRef.current;
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.vy += 600 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
      p.lifeMs -= dt * 1000; if (p.lifeMs <= 0) parts.splice(i, 1);
    }
  }

  function resetWorld() {
    setWin(false);
    setHearts(2);
    setSecondsLeft(WIN_SURVIVE_SECONDS);
    timeRef.current = 0;
    obstaclesRef.current = [];
    playerRef.current.initialized = false;
    lastSpawnLaneRef.current = null;
    invulnMsRef.current = 0;
  }

  function onStart() {
    if (!assetsReady) return;
    clearCountdown();
    resetWorld();
    runCountdown();
  }
  function onRetry() { onStart(); }
  useEffect(() => () => clearCountdown(), []);

  // -------- React overlays: intro + HUD + loss --------

  const Heart = ({ filled = true }) => (
    <svg aria-hidden="true" width="18" height="16" viewBox="0 0 24 22" className="inline-block">
      <path d="M12 21s-7.5-4.7-10-8.9C.1 9.6 1.3 5.8 4.9 4.6 7.1 3.9 9.4 4.8 11 6.4c1.6-1.6 3.9-2.5 6.1-1.8 3.6 1.2 4.8 5 2.9 7.5C19.5 16.3 12 21 12 21z"
        fill={filled ? "#FF6161" : "none"} stroke="#FF6161" strokeWidth="2"/>
    </svg>
  );

  const Kbd = ({ children, className = "" }) => (
    <kbd className={["px-2 py-1 text-sm rounded border border-white/40 bg-black/20", className].join(" ")}>{children}</kbd>
  );

  const PrimaryButton = ({ className = "", children, ...props }) => (
    <button
      {...props}
      className={[
        "px-6 py-2 rounded-full bg-[color:var(--ww-orange,#F25F00)] text-white font-semibold",
        "hover:opacity-90 active:scale-95 transition",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );

  return (
<div
  ref={containerRef}
  className="absolute inset-0 touch-none"
>      <canvas ref={canvasRef} className="block w-full h-full" />

      {/* INTRO */}
      {phase === "intro" && (
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="rounded-[18px] bg-black/72 backdrop-blur-sm border-4 border-white/20 shadow-[0_0_0_8px_rgba(0,0,0,.25)] text-center px-6 py-6">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2 pixelish tracking-wide">WAXWING ROAD TRIP</h1>
            <p className="text-white/90 mb-4 text-sm md:text-base">Dodge on-set chaos. Survive {WIN_SURVIVE_SECONDS}s to win a code.</p>
            <div className="flex items-center justify-center gap-2 text-white/90 mb-4 text-xs">
              <Kbd>←</Kbd><Kbd>→</Kbd><span className="opacity-80">to move</span>
            </div>
            <PrimaryButton disabled={!assetsReady} onClick={onStart}>
              {assetsReady ? "Start" : "Loading..."}
            </PrimaryButton>
          </div>
        </div>
      )}

      {/* HUD */}
      {(phase === "playing" || phase === "countdown") && (
        <div className="absolute top-3 inset-x-0 px-3">
          <div className="mx-auto w-[min(92%,880px)] flex items-center justify-between px-3 py-2 bg-black/65 border-2 border-white/25 rounded-md shadow-[0_0_0_4px_rgba(0,0,0,.35)]">
            <div className="flex items-baseline gap-2 text-white pixelish text-xs">
              <span className="opacity-80">TIME</span>
              <span className="text-base">{secondsLeft}s</span>
            </div>
            <div className="text-white/90 pixelish text-xs tracking-wider">WAXWING ROAD TRIP</div>
            <div className="flex items-center gap-1"><Heart filled={hearts >= 1} /><Heart filled={hearts >= 2} /></div>
          </div>
        </div>
      )}

      {/* LOSS */}
      {phase === "gameover" && !win && (
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="rounded-[18px] bg-black/78 backdrop-blur-sm border-4 border-white/20 shadow-[0_0_0_8px_rgba(0,0,0,.25)] text-center text-white px-8 py-7">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-2 pixelish">TRY AGAIN</h2>
            <p className="opacity-90">You clipped a rig — one more run?</p>
            <PrimaryButton className="mt-4" onClick={onRetry}>Play again</PrimaryButton>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        .pixelish { font-family: "Press Start 2P", ui-sans-serif, system-ui, -apple-system; }
      `}</style>
    </div>
  );
}
