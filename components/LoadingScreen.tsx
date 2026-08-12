"use client";

import { useEffect, useRef, useState } from "react";
import { INTRO_COPY, INTRO_SEQUENCE } from "@/components/scene";
import { useTimedSequence } from "@/components/useTimedSequence";

const RAIN_CHARS = "|!:.'`il1/~;,";
const COL_W = 14;

export default function LoadingScreen({
  onDone,
  onSkip,
}: {
  onDone: () => void;
  onSkip: () => void;
}) {
  const rainRef = useRef<HTMLCanvasElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const [typedCount, setTypedCount] = useState(0);
  const phase = useTimedSequence(INTRO_SEQUENCE);
  const rainVisible = phase === "rain";
  const textVisible = phase === "typing";
  const flashActive = phase === "flashlight" || phase === "exit";
  const exiting = phase === "exit" || phase === "done";

  /* ── Rain canvas ─────────────────────────────────────────── */
  useEffect(() => {
    const canvas = rainRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const cols = Math.floor(canvas.width / COL_W);
    const drops = Array.from({ length: cols }, () => -Math.floor(Math.random() * 25));
    const speeds = Array.from({ length: cols }, () => 0.3 + Math.random() * 0.7);
    let frame = 0;
    let rafId: number;

    const draw = () => {
      frame++;
      ctx.fillStyle = "rgba(0,0,0,0.11)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${COL_W}px "Courier New", monospace`;

      for (let c = 0; c < cols; c++) {
        const x = c * COL_W + 1;
        const headY = drops[c] * COL_W;

        ctx.fillStyle = `rgba(185,218,255,${0.5 + Math.random() * 0.5})`;
        ctx.fillText(
          RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)],
          x,
          headY
        );

        for (let j = 1; j < 14; j++) {
          const ty = headY - j * COL_W;
          if (ty < 0) continue;
          ctx.fillStyle = `rgba(90,155,245,${(1 - j / 14) * 0.36})`;
          ctx.fillText(
            RAIN_CHARS[(frame + c * 7 + j * 13) % RAIN_CHARS.length],
            x,
            ty
          );
        }

        drops[c] += speeds[c];
        if (drops[c] * COL_W > canvas.height + 20) {
          drops[c] = -8 - Math.floor(Math.random() * 15);
          speeds[c] = 0.3 + Math.random() * 0.7;
        }
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  /* ── Typing ──────────────────────────────────────────────── */
  useEffect(() => {
    if (!textVisible) return;
    let count = 0;
    const iv = setInterval(() => {
      setTypedCount(++count);
      if (count >= INTRO_COPY.length) clearInterval(iv);
    }, 78);
    return () => clearInterval(iv);
  }, [textVisible]);

  /* ── Flashlight sweep ────────────────────────────────────── */
  useEffect(() => {
    if (!flashActive) return;
    const el = flashRef.current;
    if (!el) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    const cx = W / 2;

    /*
     * Hero positions its wordmark inside:
     *   flex items-center justify-center  pt-16 pb-32  (mobile)
     *   flex items-center justify-center  pt-28 pb-28  (md+)
     * On mobile the wordmark center sits ~32 px above H/2.
     * On desktop (equal padding) it's exactly H/2.
     * Split the difference.
     */
    const cy = H / 2 - 16;

    /* keyframes: [ms, x, y, radius] */
    const KF: [number, number, number, number][] = [
      [0,    cx - W * 0.27, cy,             0],  /* no beam yet */
      [360,  cx - W * 0.27, cy,           195],  /* beam appears — left half */
      [1400, cx - W * 0.27, cy,           195],  /* hold left */
      [2250, cx + W * 0.27, cy,           195],  /* sweep to right half */
      [3150, cx + W * 0.27, cy,           195],  /* hold right */
      [3800, cx,            cy,           195],  /* gather center */
      [4300, cx,            cy - H * 0.08, 1100], /* pull far — beam expanding */
      [4900, cx,            cy - H * 0.08, 2700], /* flood: full reveal */
    ];

    const ease = (t: number) =>
      t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const sample = (ms: number) => {
      for (let i = 0; i < KF.length - 1; i++) {
        const [t0, x0, y0, r0] = KF[i];
        const [t1, x1, y1, r1] = KF[i + 1];
        if (ms >= t0 && ms < t1) {
          const t = ease((ms - t0) / (t1 - t0));
          return { x: lerp(x0, x1, t), y: lerp(y0, y1, t), r: lerp(r0, r1, t) };
        }
      }
      const [, x, y, r] = KF[KF.length - 1];
      return { x, y, r };
    };

    let start: number | null = null;
    let rafId: number;
    const totalMs = KF[KF.length - 1][0];

    const tick = (ts: number) => {
      if (start === null) start = ts;
      const ms = Math.min(ts - start, totalMs + 300);
      const { x, y, r } = sample(ms);

      /* once radius exceeds ~2 000 px the dark overlay fades itself away */
      const overlayAlpha = r > 2000 ? Math.max(0, 1 - (r - 2000) / 700) : 1;

      el.style.opacity = String(overlayAlpha);
      el.style.background =
        overlayAlpha > 0.01
          ? `radial-gradient(circle ${r}px at ${x}px ${y}px, transparent 0%, transparent ${Math.max(0, r - 48)}px, rgba(0,0,0,0.97) ${r + 16}px)`
          : "transparent";

      if (ms < totalMs + 200) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [flashActive]);

  /* ── Sequence completion ─────────────────────────────────── */
  useEffect(() => {
    if (phase === "done") onDone();
  }, [onDone, phase]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Intro"
      className="fixed inset-0 overflow-hidden"
      style={{
        zIndex: 9999,
        /*
         * During rain + typing: bg-black so the hero underneath is hidden.
         * During flashlight: bg becomes transparent — the flashlight overlay
         * (child, z-30) is the only dark layer, and its radial-gradient hole
         * reveals the Hero's real AsciiWordmark directly. No duplicate canvas.
         */
        backgroundColor: flashActive ? "transparent" : "black",
        opacity: exiting ? 0 : 1,
        transition: exiting ? "opacity 0.95s ease" : undefined,
        pointerEvents: exiting ? "none" : "auto",
      }}
    >
      {/* Rain */}
      <canvas
        ref={rainRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full"
        style={{
          opacity: rainVisible ? 1 : 0,
          transition: "opacity 0.55s ease",
        }}
      />

      {/* "you are the" — shown during dark / typing phase only */}
      <div
        className="absolute inset-x-0 flex justify-center px-4"
        style={{
          /* sits comfortably above the wordmark which lives near H/2 */
          top: "calc(50% - clamp(90px, 22vh, 260px))",
          zIndex: 20,
          opacity: textVisible ? 1 : 0,
          transition: "opacity 0.45s ease",
          pointerEvents: "none",
        }}
      >
        <span className="font-sans text-2xl md:text-4xl font-bold tracking-[0.08em] text-white/80">
          {INTRO_COPY.slice(0, typedCount)}
          {textVisible && typedCount < INTRO_COPY.length && (
            <span className="opacity-55 animate-pulse">_</span>
          )}
        </span>
      </div>

      {/* Flashlight overlay — dark mask with moving radial-gradient hole.
          Positioned here (z-30) so it covers the now-transparent container
          and reveals the Hero wordmark through the hole. */}
      {flashActive && (
        <div
          ref={flashRef}
          className="absolute inset-0"
          style={{
            zIndex: 30,
            background: "rgba(0,0,0,0.97)",
            pointerEvents: "none",
            willChange: "background, opacity",
          }}
        />
      )}

      <button
        type="button"
        onClick={onSkip}
        className="absolute right-5 top-5 z-40 font-mono text-[11px] uppercase tracking-[0.2em] text-white/55 transition hover:text-white"
      >
        Skip intro
      </button>
    </div>
  );
}
