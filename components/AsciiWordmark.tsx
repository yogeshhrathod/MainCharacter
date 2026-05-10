"use client";

import { useEffect, useRef } from "react";

const INNER_CHARS = "MAINCHARTERFT34@#*+=%RT3F4RT";
const EDGE_CHARS = ".-:,'`*+=~^\"";

type Props = {
  lines?: string[];
  className?: string;
  cellMin?: number;
  cellMax?: number;
  /** Cursor displacement radius in px */
  pushRadius?: number;
  /** Push strength multiplier */
  pushStrength?: number;
  /** Spring constant pulling chars to origin (0..1, smaller = looser) */
  spring?: number;
  /** Velocity damping (0..1, closer to 1 = floatier) */
  damping?: number;
};

type Stop = {
  ch: string;
  ox: number;
  oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  alive: boolean;
  edge: boolean;
  interval: number;
  next: number;
  flickerOdds: number;
};

export default function AsciiWordmark({
  lines = ["MAIN", "CHARACTER"],
  className = "",
  cellMin = 16,
  cellMax = 26,
  pushRadius = 150,
  pushStrength = 8,
  spring = 0.08,
  damping = 0.82,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: -1e6, y: -1e6, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Force 1:1 pixel rendering — combined with `image-rendering: pixelated`
    // below, retina displays nearest-neighbor upscale this canvas, killing
    // text antialiasing for a crisp pixel-font look.
    const dpr = 1;
    let width = 0;
    let height = 0;
    let cellPx = 18;
    let inner: Stop[] = [];
    let edge: Stop[] = [];

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
        if (w <= maxW * 0.99 && mid <= maxH * 1.15) {
          best = mid;
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }
      return best;
    };

    const buildMaskAndStops = () => {
      const off = document.createElement("canvas");
      off.width = width;
      off.height = height;
      const octx = off.getContext("2d")!;
      octx.fillStyle = "#fff";
      octx.textBaseline = "alphabetic";
      octx.textAlign = "center";

      const maxW = width * 0.97;
      const maxLineH = (height / lines.length) * 1.18;
      const fontSizes = lines.map((l) => fitFontSize(octx, l, maxW, maxLineH));
      const lineHeights = fontSizes.map((s) => s * 0.78);
      const gap = Math.round(height * 0.005);
      const totalH =
        lineHeights.reduce((a, b) => a + b, 0) + gap * (lines.length - 1);
      let y = (height - totalH) / 2;

      lines.forEach((line, i) => {
        const fs = fontSizes[i];
        octx.font = `900 ${fs}px "Inter", system-ui, sans-serif`;
        const baseline = y + lineHeights[i] * 0.94;
        octx.fillText(line, width / 2, baseline);
        y += lineHeights[i] + gap;
      });

      const mask = octx.getImageData(0, 0, width, height).data;
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
          const minN = Math.min(...ns);
          const isEdge = a < 160 || minN < 80;

          const baseStop = (
            chSet: string,
            interval: number,
            flickerOdds: number
          ): Stop => ({
            ch: chSet[Math.floor(Math.random() * chSet.length)],
            ox: x,
            oy: yy,
            x,
            y: yy,
            vx: 0,
            vy: 0,
            alive: true,
            edge: isEdge,
            interval,
            next: Math.floor(Math.random() * interval),
            flickerOdds,
          });

          if (isEdge) {
            if (Math.random() < 0.18) continue;
            edge.push(
              baseStop(EDGE_CHARS, 4 + Math.floor(Math.random() * 18), 0.08)
            );
          } else {
            if (Math.random() < 0.02) continue;
            const r1 = Math.random();
            let interval: number;
            if (r1 < 0.55) interval = 60 + Math.floor(Math.random() * 120);
            else if (r1 < 0.85) interval = 20 + Math.floor(Math.random() * 40);
            else interval = 5 + Math.floor(Math.random() * 18);
            inner.push(baseStop(INNER_CHARS, interval, 0.005));
          }
        }
      }
    };

    const resize = () => {
      const parent = canvas.parentElement!;
      width = parent.clientWidth;
      height = parent.clientHeight;
      cellPx = Math.max(
        cellMin,
        Math.min(cellMax, Math.round(width / 95))
      );
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
      buildMaskAndStops();
      draw();
    };

    const physics = () => {
      const m = mouseRef.current;
      const r2 = pushRadius * pushRadius;
      const tick = (s: Stop) => {
        if (m.active) {
          const dx = s.x - m.x;
          const dy = s.y - m.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < r2 && d2 > 0.5) {
            const d = Math.sqrt(d2);
            const t = 1 - d / pushRadius;
            const force = t * t * pushStrength;
            s.vx += (dx / d) * force;
            s.vy += (dy / d) * force;
          }
        }
        s.vx += (s.ox - s.x) * spring;
        s.vy += (s.oy - s.y) * spring;
        s.vx *= damping;
        s.vy *= damping;
        s.x += s.vx;
        s.y += s.vy;
      };
      for (let i = 0; i < inner.length; i++) tick(inner[i]);
      for (let i = 0; i < edge.length; i++) tick(edge[i]);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.imageSmoothingEnabled = false;

      // Inner — bright, big, faux-bold by drawing twice with 1px x-offset
      const innerSize = Math.max(16, cellPx + 6);
      ctx.font = `${innerSize}px "VT323", ui-monospace, monospace`;
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < inner.length; i++) {
        const s = inner[i];
        if (!s.alive) continue;
        const ix = (s.x + 0.5) | 0;
        const iy = (s.y + 0.5) | 0;
        ctx.fillText(s.ch, ix, iy);
        ctx.fillText(s.ch, ix + 1, iy);
      }

      // Edge — slightly smaller, single-render for natural decay
      const edgeSize = Math.max(14, cellPx + 2);
      ctx.font = `${edgeSize}px "VT323", ui-monospace, monospace`;
      ctx.fillStyle = "#e8e8e8";
      for (let i = 0; i < edge.length; i++) {
        const s = edge[i];
        if (!s.alive) continue;
        const ix = (s.x + 0.5) | 0;
        const iy = (s.y + 0.5) | 0;
        ctx.fillText(s.ch, ix, iy);
      }
    };

    const mutate = (list: Stop[]) => {
      for (let i = 0; i < list.length; i++) {
        const s = list[i];
        s.next--;
        if (s.next <= 0) {
          const set = s.edge ? EDGE_CHARS : INNER_CHARS;
          s.ch = set[Math.floor(Math.random() * set.length)];
          s.next = Math.floor(s.interval * (0.7 + Math.random() * 0.6));
          if (Math.random() < s.flickerOdds) {
            s.alive = Math.random() > 0.35;
          } else if (!s.alive && Math.random() < 0.18) {
            s.alive = true;
          }
        }
      }
    };

    const loop = () => {
      mutate(inner);
      mutate(edge);
      physics();
      draw();
      rafRef.current = window.requestAnimationFrame(loop);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };
    const onPointerLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -1e6;
      mouseRef.current.y = -1e6;
    };

    const start = () => {
      resize();
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (!reduce) {
        rafRef.current = window.requestAnimationFrame(loop);
      } else {
        draw();
      }
    };

    // Wait for VT323 to be loaded so first paint isn't fallback
    if (typeof document !== "undefined" && (document as Document).fonts) {
      Promise.race([
        document.fonts.load('20px "VT323"'),
        new Promise((res) => setTimeout(res, 500)),
      ]).then(start);
    } else {
      start();
    }

    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [lines, cellMin, cellMax, pushRadius, pushStrength, spring, damping]);

  return (
    <canvas
      ref={canvasRef}
      className={`block h-full w-full ${className}`}
      style={{
        imageRendering: "pixelated",
        WebkitFontSmoothing: "none",
      }}
      aria-label={lines.join(" ")}
      role="img"
    />
  );
}
