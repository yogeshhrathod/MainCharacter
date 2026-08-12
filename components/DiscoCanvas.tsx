"use client";

import { useEffect, useRef } from "react";
import { PARTY_SEQUENCE } from "@/components/scene";

/* ── Types ──────────────────────────────────────────────────────── */
type Dot = {
  phi: number;    // azimuth on the spinning ball [0, 2π]
  theta: number;  // elevation [0, 1]  (0 = top/ceiling, 1 = equator)
  r: number; g: number; b: number;
  size: number;
  rotation: number;
};

/* ── Static config ──────────────────────────────────────────────── */
const PALETTE: [number, number, number][] = [
  [255, 0, 136], [255, 80, 0], [255, 210, 0],
  [0, 255, 140], [0, 200, 255], [160, 0, 255],
  [255, 0, 255], [255, 255, 255],
];

/*
 * 5 spotlight sources.
 * BEAT_THRESHOLD: the progress value (0-1) at which this light pops on.
 * Transition = 240 frames (4 s at 60 fps) → each 1/8 = 0.125 = one beat (120 BPM).
 *
 *  Beat 1 → bg tint starts (progress 0.000)
 *  Beat 2 → center cyan   (0.125)
 *  Beat 3 → left magenta  (0.250)
 *  Beat 4 → right green   (0.375)  + dots begin appearing
 *  Beat 5 → orange left   (0.500)
 *  Beat 6 → purple right  (0.625)  ← text coloring starts in AsciiWordmark
 *  Beat 7-8 → full        (0.750 → 1.000)
 */
const SPOTS = [
  { ox: 0.50, r: 0,   g: 210, b: 255, spd: 0.013, ph: 2.1,           sw: 0.90, ha: 0.036, threshold: 0.125 },
  { ox: 0.14, r: 255, g: 0,   b: 210, spd: 0.009, ph: 0.0,           sw: 1.05, ha: 0.044, threshold: 0.250 },
  { ox: 0.86, r: 140, g: 255, b: 0,   spd: 0.010, ph: 4.2,           sw: 1.05, ha: 0.044, threshold: 0.375 },
  { ox: 0.32, r: 255, g: 110, b: 0,   spd: 0.007, ph: Math.PI,       sw: 0.70, ha: 0.030, threshold: 0.500 },
  { ox: 0.68, r: 180, g: 0,   b: 255, spd: 0.011, ph: Math.PI + 1.5, sw: 0.70, ha: 0.030, threshold: 0.625 },
];

const NUM_DOTS = 170;

/* ── Helpers ────────────────────────────────────────────────────── */
/** Linear ramp: how far [0-1] progress is past threshold, over one beat (0.125). */
const beatRamp = (progress: number, threshold: number) =>
  Math.max(0, Math.min(1, (progress - threshold) / 0.125));

/* ── Component ──────────────────────────────────────────────────── */
export default function DiscoCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let width = 0;
    let height = 0;
    let frame = 0;
    let raf = 0;

    /* Transition progress: 0 = fully off, 1 = fully on */
    let progress = 0;

    /* Per-spotlight: flash brightness on activation, and whether it has been triggered */
    const spotFlash   = SPOTS.map(() => 0);
    const spotTripped = SPOTS.map(() => false);

    /* Pre-generate disco-ball mirror dots */
    const dots: Dot[] = Array.from({ length: NUM_DOTS }, () => {
      const [pr, pg, pb] = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      const mix = 0.30 + Math.random() * 0.70;
      return {
        phi:      Math.random() * Math.PI * 2,
        theta:    0.04 + Math.random() * 0.84,
        r: Math.round(pr * mix + 255 * (1 - mix)),
        g: Math.round(pg * mix + 255 * (1 - mix)),
        b: Math.round(pb * mix + 255 * (1 - mix)),
        size:     1.4 + Math.random() * 2.8,
        rotation: Math.random() * Math.PI,
      };
    });

    /* ── Resize ─────────────────────────────────────────────────── */
    const resize = () => {
      const p = canvas.parentElement!;
      width  = p.clientWidth;
      height = p.clientHeight;
      canvas.width  = width;
      canvas.height = height;
    };

    /* ── Draw ───────────────────────────────────────────────────── */
    const draw = () => {
      /* ── 0. Advance progress ──────────────────────────────────── */
      const target = activeRef.current ? 1 : 0;
      if (target > progress) {
        /* 4 s to fully on */
        progress = Math.min(1, progress + 1 / PARTY_SEQUENCE.enterFrames);
      } else if (target < progress) {
        /* 1.5 s to fully off — quick "lights out" */
        progress = Math.max(0, progress - 1 / PARTY_SEQUENCE.exitFrames);
      }

      ctx.clearRect(0, 0, width, height);
      if (progress <= 0.002) return;

      /* Beat: 120 BPM → period = 30 frames at 60 fps */
      const BEAT = 30;
      const beatT = (frame % BEAT) / BEAT;
      /* Sharp hit, quick exponential decay */
      const beat = Math.pow(Math.max(0, 1 - beatT * 2.2), 1.8);

      const floorY = height * 0.78;

      /* ── 1. Nightclub background tint (fades in with progress) ── */
      ctx.globalCompositeOperation = "source-over";
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0,   `rgba(14, 0, 36, ${progress * (0.88 + beat * 0.06)})`);
      bgGrad.addColorStop(0.6, `rgba(6,  0, 20, ${progress * 0.92})`);
      bgGrad.addColorStop(1,   `rgba(0,  0,  8, ${progress * 0.95})`);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      /* ── 2. Spotlight beams ─────────────────────────────────────
       *  Each light pops on at its beat threshold with a quick flash,
       *  then ramps to full brightness over the next beat.
       *  On exit, all lights fade uniformly with `progress`.        */
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = 1;

      for (let si = 0; si < SPOTS.length; si++) {
        const sp = SPOTS[si];

        /* Detect crossing the activation threshold → flash */
        if (progress >= sp.threshold && !spotTripped[si]) {
          spotTripped[si] = true;
          spotFlash[si]   = 1.0;
        }
        /* Reset so it can re-trigger if user cycles party mode */
        if (progress < sp.threshold * 0.5) {
          spotTripped[si] = false;
        }
        /* Flash decays over ~20 frames */
        spotFlash[si] *= 0.88;

        /* Opacity: staged entry (ramp over one beat after threshold),
         * uniform exit (scale by raw progress so all fade together). */
        const entryOpacity = activeRef.current
          ? beatRamp(progress, sp.threshold)
          : progress;

        const beamScale = Math.min(1.5, entryOpacity + spotFlash[si] * 0.55);
        if (beamScale < 0.01) continue;

        const angle = Math.sin(frame * sp.spd + sp.ph) * sp.sw;
        const sx = width * sp.ox;
        const sy = -15;
        const len = height * 1.7;
        const ex  = sx + Math.sin(angle) * len;
        const ey  = sy + Math.cos(angle) * len;

        /* Halo — wide cone, very transparent */
        const wHa = sp.ha * 3.8;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + Math.sin(angle - wHa) * len, sy + Math.cos(angle - wHa) * len);
        ctx.lineTo(sx + Math.sin(angle + wHa) * len, sy + Math.cos(angle + wHa) * len);
        ctx.closePath();
        const gH = ctx.createLinearGradient(sx, sy, ex, ey);
        const ha  = (0.05 + beat * 0.04) * beamScale;
        gH.addColorStop(0,    `rgba(${sp.r},${sp.g},${sp.b},${ha})`);
        gH.addColorStop(0.65, `rgba(${sp.r},${sp.g},${sp.b},${ha * 0.25})`);
        gH.addColorStop(1,    `rgba(${sp.r},${sp.g},${sp.b},0)`);
        ctx.fillStyle = gH;
        ctx.fill();

        /* Core — narrow cone, brighter */
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + Math.sin(angle - sp.ha) * len, sy + Math.cos(angle - sp.ha) * len);
        ctx.lineTo(sx + Math.sin(angle + sp.ha) * len, sy + Math.cos(angle + sp.ha) * len);
        ctx.closePath();
        const gC = ctx.createLinearGradient(sx, sy, ex, ey);
        const ca  = (0.22 + beat * 0.20) * beamScale;
        gC.addColorStop(0,   `rgba(${sp.r},${sp.g},${sp.b},${ca})`);
        gC.addColorStop(0.5, `rgba(${sp.r},${sp.g},${sp.b},${ca * 0.40})`);
        gC.addColorStop(1,   `rgba(${sp.r},${sp.g},${sp.b},0)`);
        ctx.fillStyle = gC;
        ctx.fill();

        /* Source flare — tiny bright circle at ceiling origin */
        const flareR  = 18 + spotFlash[si] * 14;
        const flareA  = (0.55 + beat * 0.3 + spotFlash[si] * 0.5) * Math.min(1, entryOpacity * 3);
        const flareGrad = ctx.createRadialGradient(sx, sy + 4, 0, sx, sy + 4, flareR);
        flareGrad.addColorStop(0, `rgba(${sp.r},${sp.g},${sp.b},${flareA})`);
        flareGrad.addColorStop(1, `rgba(${sp.r},${sp.g},${sp.b},0)`);
        ctx.fillStyle = flareGrad;
        ctx.beginPath();
        ctx.arc(sx, sy + 4, flareR, 0, Math.PI * 2);
        ctx.fill();
      }

      /* ── 3. Disco-ball scatter dots ──────────────────────────────
       *  Dots appear from beat 4 (progress 0.375) and fully settle by 1.0.
       *  On exit, they scale with progress like everything else.         */
      const dotsProgress = activeRef.current
        ? Math.max(0, Math.min(1, (progress - 0.375) / 0.625))
        : progress;

      if (dotsProgress > 0.01) {
        const ballAngle = frame * 0.0045;

        for (const d of dots) {
          const cosEl   = Math.cos(d.theta * Math.PI * 0.5);
          const spreadX = cosEl * width * 0.52;
          const screenX = width * 0.5 + Math.cos(d.phi + ballAngle) * spreadX;
          const screenY = d.theta * floorY * 0.90;

          const facing = Math.cos(d.phi + ballAngle);
          if (facing < 0.04) continue;

          const alpha = Math.min(1, facing * (0.75 + beat * 0.25) * dotsProgress);
          ctx.globalAlpha = alpha;
          ctx.fillStyle = `rgb(${d.r},${d.g},${d.b})`;

          /* Tiny rotated rectangle — like a real mirror facet */
          ctx.save();
          ctx.translate(screenX, screenY);
          ctx.rotate(d.rotation + ballAngle * 2);
          ctx.fillRect(-d.size, -d.size * 0.5, d.size * 2, d.size);
          ctx.restore();
        }
      }

      /* ── 4. Reset ───────────────────────────────────────────────── */
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    /* ── Loop — idle when party fully off ───────────────────── */
    const loop = () => {
      const target = activeRef.current ? 1 : 0;
      const idle = target === 0 && progress <= 0.002;
      if (idle) {
        ctx.clearRect(0, 0, width, height);
        raf = 0;
        return;
      }
      frame++;
      draw();
      raf = requestAnimationFrame(loop);
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    window.addEventListener("resize", resize);
    resize();
    kick();

    const watch = window.setInterval(() => {
      if (activeRef.current && !raf) kick();
    }, 200);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(watch);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
