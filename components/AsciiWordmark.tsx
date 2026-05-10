"use client";

import { useEffect, useRef } from "react";

const ASCII_CHARS = Array.from({ length: 94 }, (_, i) =>
  String.fromCharCode(33 + i)
).join("");

const FIRE_CHARS = "^*!|.,~'`+";
const EMBER_CHARS = "@#$%&*!?^~|<>";
const ASH_CHARS = ".,`'·";

type Props = {
  lines?: string[];
  className?: string;
  cellMin?: number;
  cellMax?: number;
  partyMode?: boolean;
};

type StopMode = "idle" | "blast" | "return";

type Stop = {
  ch: string;
  chNext: string | null;
  blend: number;
  crossfadeStep: number;
  ox: number;
  oy: number;
  edge: boolean;
  interval: number;
  next: number;
  spawnHold: number;
  spawnFade: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
  mode: StopMode;
  blastAge: number;
  maxBlastAge: number;
  windX: number;
  /** Frames to wait at home (invisible) before popping back — set at blast time, closer = 0. */
  returnDelay: number;
  /** Per-frame turbulence forces (random walk). */
  turbX: number;
  turbY: number;
  /** Landing flash countdown — rapid char cycle when snapping back to grid. */
  landFlash: number;
};

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  maxAge: number;
  isAsh: boolean;
};

/** age < 0 = scheduled but not yet visible (used for aftershock delay). */
type Wave = { x: number; y: number; age: number };

type Confetti = {
  x: number; y: number;
  vx: number; vy: number;
  rotation: number;
  rotationSpeed: number;
  w: number; h: number;
  color: string;
  age: number;
  maxAge: number;
};

const GRAVITY = 0.34;
const WAVE_MAX_AGE = 22;
/** Cursor pull radius in CSS px — glyphs drift toward cursor within this zone. */
const PULL_R = 78;

const CONFETTI_COLORS = [
  "#ff0088", "#ff4400", "#ffcc00", "#00ff88", "#00ccff",
  "#8800ff", "#ff00ff", "#ff6600", "#00ffcc", "#ffff00",
  "#ff2244", "#44ff22", "#2255ff", "#ff22cc", "#22ffee",
  "#ffffff", "#ffdd00", "#ff88cc",
];

export default function AsciiWordmark({
  lines = ["MAIN", "CHARACTER"],
  className = "",
  cellMin = 16,
  cellMax = 26,
  partyMode = false,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const partyModeRef = useRef(partyMode);
  partyModeRef.current = partyMode;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    ctx.textRendering = "optimizeSpeed";

    const dpr = 1;
    let width = 0;
    let height = 0;
    let cellPx = 18;
    let inner: Stop[] = [];
    let edge: Stop[] = [];
    const sparks: Spark[] = [];
    const waves: Wave[] = [];
    const confetti: Confetti[] = [];
    let frame = 0;

    const pointer = { active: false, x: 0, y: 0 };

    /* ─── cached prefers-reduced-motion ──────────────────────────── */
    const reducedMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = reducedMQ.matches;

    /* ─── font-size binary search ─────────────────────────────────── */
    const fitFontSize = (
      octx: CanvasRenderingContext2D,
      text: string,
      maxW: number,
      maxH: number
    ) => {
      let lo = 8;
      let hi = Math.floor(Math.min(maxH * 1.25, maxW));
      let best = lo;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        octx.font = `900 ${mid}px "Inter", system-ui, sans-serif`;
        const w = octx.measureText(text).width;
        if (w <= maxW * 0.99 && mid <= maxH * 1.15) { best = mid; lo = mid + 1; }
        else hi = mid - 1;
      }
      return best;
    };

    /* ─── build mask + grid stops ─────────────────────────────────── */
    const buildMaskAndStops = () => {
      const off = document.createElement("canvas");
      off.width = width;
      off.height = height;
      const octx = off.getContext("2d")!;
      octx.textRendering = "optimizeSpeed";
      octx.fillStyle = "#fff";
      octx.textBaseline = "alphabetic";
      octx.textAlign = "center";

      const maxW = width * 0.97;
      const maxLineH = (height / lines.length) * 1.18;
      const fontSizes = lines.map((l) => fitFontSize(octx, l, maxW, maxLineH));
      const lineHeights = fontSizes.map((s) => s * 0.78);
      const gap = Math.round(height * 0.005);
      const totalH = lineHeights.reduce((a, b) => a + b, 0) + gap * (lines.length - 1);
      let y = (height - totalH) / 2;

      lines.forEach((line, i) => {
        const fs = fontSizes[i];
        octx.font = `900 ${fs}px "Inter", system-ui, sans-serif`;
        octx.fillText(line, width / 2, y + lineHeights[i] * 0.94);
        y += lineHeights[i] + gap;
      });

      const maskImg = octx.getImageData(0, 0, width, height);
      const mask = maskImg.data;
      for (let i = 3; i < mask.length; i += 4) mask[i] = mask[i] > 127 ? 255 : 0;

      const sample = (px: number, py: number) => {
        if (px < 0 || py < 0 || px >= width || py >= height) return 0;
        return mask[(py * width + px) * 4 + 3];
      };

      inner = [];
      edge = [];
      const cols = Math.floor(width / cellPx);
      const rows = Math.floor(height / cellPx);
      const step = cellPx;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * cellPx + cellPx / 2;
          const yy = r * cellPx + cellPx / 2;
          const a = sample(Math.floor(x), Math.floor(yy));
          if (a < 30) continue;

          const ns = [
            sample(Math.floor(x), Math.floor(yy - step)),
            sample(Math.floor(x), Math.floor(yy + step)),
            sample(Math.floor(x + step), Math.floor(yy)),
            sample(Math.floor(x - step), Math.floor(yy)),
          ];
          const isEdge = a < 160 || Math.min(...ns) < 80;

          const makeStop = (interval: number): Stop => ({
            ch: ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)],
            chNext: null,
            blend: 0,
            crossfadeStep: 0.06,
            ox: x,
            oy: yy,
            edge: isEdge,
            interval,
            next: Math.floor(Math.random() * interval),
            spawnHold: Math.floor(Math.random() * 72),
            spawnFade: 0,
            px: 0, py: 0,
            vx: 0, vy: 0,
            mode: "idle",
            blastAge: 0,
            maxBlastAge: 65,
            windX: 0,
            turbX: 0, turbY: 0,
            landFlash: 0,
            returnDelay: 0,
          });

          if (isEdge) {
            if (Math.random() < 0.18) continue;
            edge.push(makeStop(4 + Math.floor(Math.random() * 18)));
          } else {
            if (Math.random() < 0.02) continue;
            const r1 = Math.random();
            let iv: number;
            if (r1 < 0.55) iv = 60 + Math.floor(Math.random() * 120);
            else if (r1 < 0.85) iv = 20 + Math.floor(Math.random() * 40);
            else iv = 5 + Math.floor(Math.random() * 18);
            inner.push(makeStop(iv));
          }
        }
      }
    };

    /* ─── resize ──────────────────────────────────────────────────── */
    const resize = () => {
      const parent = canvas.parentElement!;
      width = parent.clientWidth;
      height = parent.clientHeight;
      cellPx = Math.max(cellMin, Math.min(cellMax, Math.round(width / 95)));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
      sparks.length = 0;
      waves.length = 0;
      confetti.length = 0;
      buildMaskAndStops();
      draw();
    };

    /* ─── draw ────────────────────────────────────────────────────── */
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.imageSmoothingEnabled = false;

      const glyphSize = Math.max(16, cellPx + 6);
      ctx.font = `${glyphSize}px "VT323", ui-monospace, monospace`;
      ctx.fillStyle = "#ffffff";

      const isParty = partyModeRef.current;

      /** Returns an HSL color string for a given grid position in party mode. */
      const partyHue = (ox: number, oy: number) =>
        ((ox / width) * 300 + (oy / height) * 60 + frame * 1.5) % 360;

      const glyph = (ch: string, x: number, y: number, a: number) => {
        if (a < 0.007 || !ch) return;
        ctx.globalAlpha = a;
        ctx.fillText(ch, x, y);
        ctx.fillText(ch, x + 1, y);
        ctx.globalAlpha = 1;
      };

      /* hover @ strength */
      const atStr = (ix: number, iy: number) => {
        if (!pointer.active) return 0;
        const r = Math.max(72, Math.min(width, height) * 0.22);
        const d = Math.hypot(ix - pointer.x, iy - pointer.y);
        if (d >= r) return 0;
        const t = 1 - d / r;
        return t * t;
      };

      /* shockwave rings — skip if age < 0 (aftershock not yet live) */
      const ringSpacing = Math.max(cellPx * 1.6, 28);
      for (const w of waves) {
        if (w.age < 0 || w.age >= WAVE_MAX_AGE) continue;
        const progress = w.age / WAVE_MAX_AGE;
        const radius = progress * Math.min(width, height) * 0.10;
        const alpha = (1 - progress) * (1 - progress) * 0.88;
        if (alpha < 0.02) continue;
        const count = Math.max(6, Math.floor((2 * Math.PI * radius) / ringSpacing));
        for (let k = 0; k < count; k++) {
          const ang = (k / count) * Math.PI * 2;
          const ch = FIRE_CHARS[k % FIRE_CHARS.length];
          glyph(
            ch,
            (w.x + Math.cos(ang) * radius + 0.5) | 0,
            (w.y + Math.sin(ang) * radius + 0.5) | 0,
            alpha
          );
        }
      }

      /* grid stops */
      const stops: Stop[] = (inner as Stop[]).concat(edge);
      for (let i = 0; i < stops.length; i++) {
        const s = stops[i];
        if (s.spawnFade < 0.007) continue;

        const ix = (s.ox + s.px + 0.5) | 0;
        const iy = (s.oy + s.py + 0.5) | 0;

        /* party LED color — set per-stop so every glyph call below inherits it */
        if (isParty) {
          const h = partyHue(s.ox, s.oy);
          const l = s.edge ? 72 : 60;
          ctx.fillStyle = `hsl(${h}, 100%, ${l}%)`;
        } else {
          ctx.fillStyle = "#ffffff";
        }

        if (s.mode === "blast") {
          let ch: string;
          if (s.blastAge < 20) {
            ch = FIRE_CHARS[Math.floor(s.blastAge * 0.7 + frame * 0.3) % FIRE_CHARS.length];
          } else if (s.blastAge < 55) {
            ch = EMBER_CHARS[Math.floor((s.blastAge - 20) * 0.4 + i * 0.17) % EMBER_CHARS.length];
          } else {
            ch = s.ch;
          }
          const distHome = Math.hypot(s.px, s.py);
          const fadeOut = Math.max(0.12, 1 - distHome / (Math.max(width, height) * 0.68));
          glyph(ch, ix, iy, s.spawnFade * fadeOut);

        } else if (s.mode === "return") {
          /* invisible while waiting — pops in when returnDelay hits 0 */

        } else {
          /* idle: landing flash → normal crossfade + @ hover */
          if (s.landFlash > 0) {
            glyph(s.ch, ix, iy, s.spawnFade);
          } else {
            const at = atStr(ix, iy);
            const bodyA = s.spawnFade * Math.max(0, 1 - at);
            if (at > 0.015) {
              if (s.chNext !== null) {
                glyph(s.ch, ix, iy, (1 - s.blend) * bodyA);
                glyph(s.chNext, ix, iy, s.blend * bodyA);
              } else {
                glyph(s.ch, ix, iy, bodyA);
              }
              glyph("@", ix, iy, s.spawnFade * at);
            } else if (s.chNext !== null) {
              glyph(s.ch, ix, iy, (1 - s.blend) * s.spawnFade);
              glyph(s.chNext, ix, iy, s.blend * s.spawnFade);
            } else {
              glyph(s.ch, ix, iy, s.spawnFade);
            }
          }
        }
      }

      /* reset fill to white for sparks/ash (or party-cycle for sparks too) */
      ctx.fillStyle = "#ffffff";

      /* spark + ash particles */
      for (const sp of sparks) {
        const t = 1 - sp.age / sp.maxAge;
        if (sp.isAsh) {
          const ch = ASH_CHARS[Math.floor(sp.age * 0.07) % ASH_CHARS.length];
          glyph(ch, (sp.x + 0.5) | 0, (sp.y + 0.5) | 0, t * 0.45);
        } else {
          if (isParty) {
            const h = (frame * 8 + sp.age * 15) % 360;
            ctx.fillStyle = `hsl(${h}, 100%, 65%)`;
          }
          const ch = FIRE_CHARS[Math.floor(sp.age * 0.55 + frame * 0.2) % FIRE_CHARS.length];
          glyph(ch, (sp.x + 0.5) | 0, (sp.y + 0.5) | 0, t * t * 0.95);
          if (isParty) ctx.fillStyle = "#ffffff";
        }
      }

      /* confetti pieces (party mode only) */
      for (const c of confetti) {
        const t = 1 - c.age / c.maxAge;
        const alpha = Math.min(1, t * 4) * t;
        if (alpha < 0.01) continue;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = c.color;
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rotation);
        ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
        ctx.restore();
      }
    };

    /* ─── char mutation ───────────────────────────────────────────── */
    const pickDistinct = (avoid: string) => {
      let c = avoid, g = 0;
      while (c === avoid && g++ < 16)
        c = ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
      return c;
    };

    const mutate = (list: Stop[]) => {
      for (let i = 0; i < list.length; i++) {
        const s = list[i];

        if (s.mode === "idle") {
          /* spawn-in */
          if (s.spawnHold > 0) { s.spawnHold--; continue; }
          if (s.spawnFade < 1) s.spawnFade = Math.min(1, s.spawnFade + 0.034);

          /* landing flash — rapid char shuffle on return */
          if (s.landFlash > 0) {
            s.landFlash--;
            if (s.landFlash % 2 === 0) s.ch = pickDistinct(s.ch);
            continue;
          }

          /* normal crossfade */
          if (s.chNext !== null) {
            s.blend += s.crossfadeStep;
            if (s.blend >= 1) {
              s.ch = s.chNext;
              s.chNext = null;
              s.blend = 0;
              s.next = Math.floor(s.interval * (0.7 + Math.random() * 0.6));
            }
            continue;
          }
          s.next--;
          if (s.next <= 0) {
            s.chNext = pickDistinct(s.ch);
            s.blend = 0;
            s.crossfadeStep =
              (s.edge ? 0.07 : 0.035) + Math.random() * (s.edge ? 0.1 : 0.055);
          }
        }
      }
    };

    /* ─── physics ─────────────────────────────────────────────────── */
    const integrateSprings = (list: Stop[]) => {
      for (let i = 0; i < list.length; i++) {
        const s = list[i];

        if (s.mode === "idle") {
          /* spring restoring force */
          const k = s.edge ? 0.09 : 0.07;
          const damp = s.edge ? 0.88 : 0.9;

          /* cursor gravity pull — glyphs lean toward pointer */
          let pullFx = 0, pullFy = 0;
          if (pointer.active) {
            const ddx = pointer.x - (s.ox + s.px);
            const ddy = pointer.y - (s.oy + s.py);
            const dd = Math.hypot(ddx, ddy);
            if (dd < PULL_R && dd > 0.5) {
              const t = 1 - dd / PULL_R;
              const strength = t * t * 0.28;
              pullFx = (ddx / dd) * strength;
              pullFy = (ddy / dd) * strength;
            }
          }

          s.vx = (s.vx - s.px * k + pullFx) * damp;
          s.vy = (s.vy - s.py * k + pullFy) * damp;
          s.px += s.vx;
          s.py += s.vy;

          const pl = Math.hypot(s.px, s.py);
          if (pl > cellPx * 1.4) {
            const sc = (cellPx * 1.4) / pl;
            s.px *= sc; s.py *= sc;
            s.vx *= 0.5; s.vy *= 0.5;
          }

        } else if (s.mode === "blast") {
          /* gravity + wind + turbulence */
          s.vy += GRAVITY;
          s.vx += s.windX;

          /* turbulence — slow random walk adds non-radial drift */
          s.turbX += (Math.random() - 0.5) * 0.09;
          s.turbY += (Math.random() - 0.5) * 0.09;
          s.turbX *= 0.94;
          s.turbY *= 0.94;
          s.vx += s.turbX;
          s.vy += s.turbY;

          s.vx *= 0.993;
          s.vy *= 0.993;
          s.px += s.vx;
          s.py += s.vy;
          s.blastAge++;

          const worldY = s.oy + s.py;
          const worldX = s.ox + s.px;
          if (
            s.blastAge >= s.maxBlastAge ||
            worldY > height + cellPx * 4 ||
            worldY < -cellPx * 6 ||
            worldX < -cellPx * 4 ||
            worldX > width + cellPx * 4
          ) {
            /* snap home immediately — invisible until returnDelay expires */
            s.mode = "return";
            s.px = 0; s.py = 0;
            s.vx = 0; s.vy = 0;
            s.turbX = 0; s.turbY = 0;
          }

        } else {
          /* return: invisible countdown, then hard pop + landing flash */
          if (s.returnDelay > 0) {
            s.returnDelay--;
          } else {
            s.mode = "idle";
            s.blastAge = 0;
            /* landing flash — char scramble sells the "block placed" moment */
            s.landFlash = 14;
          }
        }
      }
    };

    /* ─── sparks & ash ────────────────────────────────────────────── */
    const tickSparks = () => {
      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i];
        if (sp.isAsh) {
          sp.vy += 0.04;
          sp.vx += (Math.random() - 0.5) * 0.035;
          sp.vx *= 0.99;
          sp.vy *= 0.99;
        } else {
          sp.vy += 0.16;
          sp.vx *= 0.95;
          sp.vy *= 0.95;
        }
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.age++;
        if (sp.age >= sp.maxAge) sparks.splice(i, 1);
      }
    };

    /* ─── confetti ────────────────────────────────────────────────── */
    const tickConfetti = () => {
      for (let i = confetti.length - 1; i >= 0; i--) {
        const c = confetti[i];
        c.vy += 0.22;
        c.vx += Math.sin(c.age * 0.12) * 0.06;
        c.vx *= 0.99;
        c.vy *= 0.99;
        c.x += c.vx;
        c.y += c.vy;
        c.rotation += c.rotationSpeed;
        c.age++;
        if (c.age >= c.maxAge || c.y > height + 30) confetti.splice(i, 1);
      }
    };

    const spawnConfetti = (cx: number, cy: number) => {
      const count = 90;
      for (let i = 0; i < count; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 2 + Math.random() * 16;
        const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
        confetti.push({
          x: cx + (Math.random() - 0.5) * 24,
          y: cy + (Math.random() - 0.5) * 24,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - 7,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.35,
          w: 5 + Math.random() * 10,
          h: 3 + Math.random() * 5,
          color,
          age: 0,
          maxAge: 90 + Math.floor(Math.random() * 70),
        });
      }
    };

    /* ─── shockwaves ──────────────────────────────────────────────── */
    const tickWaves = () => {
      for (let i = waves.length - 1; i >= 0; i--) {
        waves[i].age++;
        if (waves[i].age >= WAVE_MAX_AGE) waves.splice(i, 1);
      }
    };

    /* ─── spawn blast ─────────────────────────────────────────────── */
    const spawnBlast = (cx: number, cy: number) => {
      const blastR = Math.max(width, height) * 0.10;

      /* pre-check: is there at least one glyph inside the blast radius?
         If the click lands on empty space, do nothing. */
      const allStops: Stop[] = (inner as Stop[]).concat(edge);
      const anyHit = allStops.some((s) => {
        const dist = Math.hypot(s.ox - cx, s.oy - cy);
        return (1 - dist / blastR) >= 0.02;
      });
      if (!anyHit) return;

      /* primary shockwave + aftershock ring (delayed 8 frames) */
      if (waves.length < 8) {
        waves.push({ x: cx, y: cy, age: 0 });
        waves.push({ x: cx, y: cy, age: -8 });
      }

      const kick = (list: Stop[]) => {
        for (let i = 0; i < list.length; i++) {
          const s = list[i];
          const dx = s.ox - cx;
          const dy = s.oy - cy;
          const dist = Math.hypot(dx, dy) + 0.5;
          const t = Math.max(0, 1 - dist / blastR);
          if (t < 0.02) continue;

          const nx = dx / dist;
          const ny = dy / dist;
          const power = t * t * 14 + 3;
          s.vx += nx * power + (Math.random() - 0.5) * 2;
          s.vy += ny * power - t * 6;
          s.windX = (Math.random() - 0.5) * 0.07;
          s.turbX = (Math.random() - 0.5) * 0.5;
          s.turbY = (Math.random() - 0.5) * 0.5;
          s.mode = "blast";
          s.blastAge = 0;
          s.chNext = null;
          s.blend = 0;
          /* all glyphs fly for the same duration, then wait at home.
             returnDelay staggers the pop-in bottom-to-top:
             bottom rows (oy ≈ height) → 0, top rows (oy ≈ 0) → ~50 frames. */
          s.maxBlastAge = 65;
          s.returnDelay = Math.floor((1 - s.oy / height) * 50);
        }
      };
      kick(inner);
      kick(edge);

      /* fire sparks */
      for (let i = 0; i < 18; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 1.5 + Math.random() * 5;
        sparks.push({
          x: cx + (Math.random() - 0.5) * cellPx,
          y: cy + (Math.random() - 0.5) * cellPx,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - 2.5,
          age: 0,
          maxAge: 38 + Math.floor(Math.random() * 42),
          isAsh: false,
        });
      }

      /* ash drift — slower, linger longer, settle downward */
      for (let i = 0; i < 14; i++) {
        sparks.push({
          x: cx + (Math.random() - 0.5) * blastR * 0.6,
          y: cy + (Math.random() - 0.5) * blastR * 0.3,
          vx: (Math.random() - 0.5) * 1.8,
          vy: -0.4 - Math.random() * 0.8,
          age: 0,
          maxAge: 80 + Math.floor(Math.random() * 60),
          isAsh: true,
        });
      }
    };

    /* ─── main loop ───────────────────────────────────────────────── */
    const loop = () => {
      frame++;
      if (!reducedMotion) {
        tickWaves();
        tickSparks();
        tickConfetti();
        integrateSprings(inner);
        integrateSprings(edge);
      }
      mutate(inner);
      mutate(edge);
      draw();
      rafRef.current = window.requestAnimationFrame(loop);
    };

    const freezeForReducedMotion = () => {
      sparks.length = 0;
      waves.length = 0;
      const snap = (list: Stop[]) => {
        for (let i = 0; i < list.length; i++) {
          const s = list[i];
          s.spawnHold = 0;
          s.spawnFade = 1;
          s.chNext = null;
          s.blend = 0;
          s.px = 0; s.py = 0;
          s.vx = 0; s.vy = 0;
          s.turbX = 0; s.turbY = 0;
          s.mode = "idle";
          s.blastAge = 0;
          s.landFlash = 0;
          s.returnDelay = 0;
        }
      };
      snap(inner);
      snap(edge);
    };

    /* ─── start ───────────────────────────────────────────────────── */
    const start = () => {
      resize();
      if (!reducedMotion) {
        rafRef.current = window.requestAnimationFrame(loop);
      } else {
        freezeForReducedMotion();
        draw();
      }
    };

    if (typeof document !== "undefined" && (document as Document).fonts) {
      Promise.race([
        document.fonts.load('20px "VT323"'),
        new Promise((res) => setTimeout(res, 500)),
      ]).then(start);
    } else {
      start();
    }

    /* ─── events ──────────────────────────────────────────────────── */
    const onReducedChange = (e: MediaQueryListEvent) => {
      reducedMotion = e.matches;
      if (reducedMotion) freezeForReducedMotion();
    };
    reducedMQ.addEventListener("change", onReducedChange);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    const trackEl = () => canvas.parentElement;
    const canvasPoint = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!trackEl()) return;
      const { x, y } = canvasPoint(e.clientX, e.clientY);
      pointer.x = x;
      pointer.y = y;
      pointer.active = true;
    };

    const onPointerLeave = (e: PointerEvent) => {
      const el = trackEl();
      const rel = e.relatedTarget as Node | null;
      if (el && rel && el.contains(rel)) return;
      pointer.active = false;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (reducedMotion) return;
      if (!trackEl()) return;
      const { x, y } = canvasPoint(e.clientX, e.clientY);
      pointer.x = x;
      pointer.y = y;
      pointer.active = true;
      if (partyModeRef.current) {
        spawnConfetti(x, y);
      } else {
        spawnBlast(x, y);
      }
    };

    const parent = trackEl();
    parent?.addEventListener("pointermove", onPointerMove, { passive: true });
    parent?.addEventListener("pointerleave", onPointerLeave);
    parent?.addEventListener("pointerdown", onPointerDown, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      reducedMQ.removeEventListener("change", onReducedChange);
      parent?.removeEventListener("pointermove", onPointerMove);
      parent?.removeEventListener("pointerleave", onPointerLeave);
      parent?.removeEventListener("pointerdown", onPointerDown);
    };
  }, [lines, cellMin, cellMax]);

  return (
    <canvas
      ref={canvasRef}
      className={`block h-full w-full ${className}`}
      style={{ imageRendering: "crisp-edges", WebkitFontSmoothing: "none" }}
      aria-label={lines.join(" ")}
      role="img"
    />
  );
}
