"use client";

import { useEffect, useRef } from "react";

/* ── Types ──────────────────────────────────────────────────────── */
type Dot = {
  phi: number;    // azimuth on the spinning ball [0, 2π]
  theta: number;  // elevation [0, 1]  (0 = top/ceiling, 1 = equator)
  r: number; g: number; b: number;
  size: number;
  rotation: number; // for rectangular facet shape
};

/* ── Static config ──────────────────────────────────────────────── */
const PALETTE: [number, number, number][] = [
  [255, 0, 136],
  [255, 80, 0],
  [255, 210, 0],
  [0, 255, 140],
  [0, 200, 255],
  [160, 0, 255],
  [255, 0, 255],
  [255, 255, 255],
];

/* 5 spotlight sources: { x-fraction, RGB, sweep speed, phase, sweep arc, half-angle } */
const SPOTS = [
  { ox: 0.14, r: 255, g: 0,   b: 210, spd: 0.009, ph: 0.0,              sw: 1.05, ha: 0.044 },
  { ox: 0.50, r: 0,   g: 210, b: 255, spd: 0.013, ph: 2.1,              sw: 0.90, ha: 0.036 },
  { ox: 0.86, r: 140, g: 255, b: 0,   spd: 0.010, ph: 4.2,              sw: 1.05, ha: 0.044 },
  { ox: 0.32, r: 255, g: 110, b: 0,   spd: 0.007, ph: Math.PI,          sw: 0.70, ha: 0.030 },
  { ox: 0.68, r: 180, g: 0,   b: 255, spd: 0.011, ph: Math.PI + 1.5,   sw: 0.70, ha: 0.030 },
];

const NUM_DOTS = 170;

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

    /* ── Pre-generate disco-ball mirror dots ───────────────────── */
    const dots: Dot[] = Array.from({ length: NUM_DOTS }, () => {
      const [pr, pg, pb] = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      /* mix each dot color toward white (pastel-ish bright) */
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
      ctx.clearRect(0, 0, width, height);
      if (!activeRef.current) return;

      /* Beat: 120 BPM ≈ 30 frames at 60 fps */
      const BEAT = 30;
      const beatT = (frame % BEAT) / BEAT;
      /* Sharp attack, quick exponential decay */
      const beat = Math.pow(Math.max(0, 1 - beatT * 2.2), 1.8);

      const floorY = height * 0.76;

      /* ── 1. Nightclub background tint ──────────────────────── */
      ctx.globalCompositeOperation = "source-over";
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0,   `rgba(14, 0, 36, ${0.82 + beat * 0.06})`);
      bgGrad.addColorStop(0.6, `rgba(6,  0, 20, 0.88)`);
      bgGrad.addColorStop(1,   `rgba(0,  0,  8, 0.92)`);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);


      /* ── 3. Spotlight beams ─────────────────────────────────── */
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = 1;

      for (const sp of SPOTS) {
        const angle = Math.sin(frame * sp.spd + sp.ph) * sp.sw;
        const sx = width  * sp.ox;
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
        const ha  = 0.05 + beat * 0.04;
        gH.addColorStop(0,   `rgba(${sp.r},${sp.g},${sp.b},${ha})`);
        gH.addColorStop(0.65, `rgba(${sp.r},${sp.g},${sp.b},${ha * 0.25})`);
        gH.addColorStop(1,   `rgba(${sp.r},${sp.g},${sp.b},0)`);
        ctx.fillStyle = gH;
        ctx.fill();

        /* Core — narrow cone, brighter */
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + Math.sin(angle - sp.ha) * len, sy + Math.cos(angle - sp.ha) * len);
        ctx.lineTo(sx + Math.sin(angle + sp.ha) * len, sy + Math.cos(angle + sp.ha) * len);
        ctx.closePath();
        const gC = ctx.createLinearGradient(sx, sy, ex, ey);
        const ca  = 0.22 + beat * 0.20;
        gC.addColorStop(0,   `rgba(${sp.r},${sp.g},${sp.b},${ca})`);
        gC.addColorStop(0.5, `rgba(${sp.r},${sp.g},${sp.b},${ca * 0.40})`);
        gC.addColorStop(1,   `rgba(${sp.r},${sp.g},${sp.b},0)`);
        ctx.fillStyle = gC;
        ctx.fill();

        /* Source flare — tiny bright circle at origin */
        const flareGrad = ctx.createRadialGradient(sx, sy + 4, 0, sx, sy + 4, 22);
        flareGrad.addColorStop(0, `rgba(${sp.r},${sp.g},${sp.b},${0.55 + beat * 0.3})`);
        flareGrad.addColorStop(1, `rgba(${sp.r},${sp.g},${sp.b},0)`);
        ctx.fillStyle = flareGrad;
        ctx.beginPath();
        ctx.arc(sx, sy + 4, 22, 0, Math.PI * 2);
        ctx.fill();
      }

      /* ── 4. Disco-ball scatter dots ─────────────────────────── */
      const ballAngle = frame * 0.0045; /* very slow ball rotation */

      for (const d of dots) {
        /* Mirror elevation: how far from equator toward top of ball */
        const cosEl  = Math.cos(d.theta * Math.PI * 0.5);  /* 1 = top, 0 = equator */
        const spreadX = cosEl * width * 0.52;
        const screenX = width * 0.5 + Math.cos(d.phi + ballAngle) * spreadX;
        const screenY = d.theta * floorY * 0.90;

        /* Only mirrors facing the room (front hemisphere) */
        const facing = Math.cos(d.phi + ballAngle);
        if (facing < 0.04) continue;

        const alpha = Math.min(1, facing * (0.75 + beat * 0.25));
        ctx.globalAlpha = alpha;
        ctx.fillStyle = `rgb(${d.r},${d.g},${d.b})`;

        /* Tiny rotated rectangle — like a real mirror facet */
        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(d.rotation + ballAngle * 2);
        ctx.fillRect(-d.size, -d.size * 0.5, d.size * 2, d.size);
        ctx.restore();
      }

      /* ── 5. Reset ───────────────────────────────────────────── */
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    /* ── Loop ───────────────────────────────────────────────────── */
    const loop = () => {
      frame++;
      draw();
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("resize", resize);
    resize();
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        opacity: active ? 1 : 0,
        transition: "opacity 0.9s ease",
      }}
    />
  );
}
