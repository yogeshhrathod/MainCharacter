"use client";

import { useEffect, useState } from "react";

const CUES = [
  "HOLD ATTENTION",
  "AI-FIRST PRODUCTS",
  "SHARP INTERFACES",
  "MAIN CHARACTER ENERGY",
  "BUILT TO STAND OUT",
] as const;

const LEVELS = " ▁▂▃▄▅▆▇█";

function spectrum(frame: number, party: boolean, count: number) {
  const bars: string[] = [];
  for (let i = 0; i < count; i++) {
    const wave =
      Math.sin(frame * (party ? 0.38 : 0.12) + i * 0.55) * 0.5 +
      Math.sin(frame * (party ? 0.21 : 0.07) + i * 1.1) * 0.35 +
      0.5;
    const boost = party ? 0.25 + Math.sin(frame * 0.9 + i) * 0.15 : 0;
    const level = Math.max(0, Math.min(8, Math.floor((wave + boost) * 8)));
    bars.push(LEVELS[level]);
  }
  return bars.join("");
}

export default function StageCue({ party }: { party: boolean }) {
  const [cueIndex, setCueIndex] = useState(0);
  const [typed, setTyped] = useState(CUES[0].length);
  const [deleting, setDeleting] = useState(false);
  const [frame, setFrame] = useState(0);
  const [blink, setBlink] = useState(true);
  const [reduced, setReduced] = useState(false);

  const cue = CUES[cueIndex];

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setFrame((f) => f + 1), party ? 50 : 90);
    return () => clearInterval(id);
  }, [party, reduced]);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setBlink((b) => !b), 520);
    return () => clearInterval(id);
  }, [reduced]);

  useEffect(() => {
    if (reduced) {
      setTyped(cue.length);
      setDeleting(false);
      return;
    }

    let delay = 55;
    if (!deleting && typed === cue.length) delay = 1600;
    else if (deleting && typed === 0) delay = 280;
    else if (deleting) delay = 28;

    const id = setTimeout(() => {
      if (!deleting && typed < cue.length) {
        setTyped((t) => t + 1);
      } else if (!deleting && typed === cue.length) {
        setDeleting(true);
      } else if (deleting && typed > 0) {
        setTyped((t) => t - 1);
      } else {
        setDeleting(false);
        setCueIndex((i) => (i + 1) % CUES.length);
      }
    }, delay);

    return () => clearTimeout(id);
  }, [typed, deleting, cue, reduced]);

  const bars = reduced
    ? "▁▂▃▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅▄▃▂"
    : spectrum(frame, party, 28);

  return (
    <div
      className="pointer-events-none select-none flex flex-col items-center gap-2"
      aria-hidden="true"
    >
      <p
        className="font-mono text-[10px] uppercase tracking-[0.28em] sm:text-[11px]"
        style={{
          color: party ? undefined : "var(--hero-muted)",
          animation:
            party && !reduced
              ? "stage-cue-rainbow 1.2s linear infinite"
              : undefined,
          textShadow: party
            ? "0 0 18px rgba(255,140,64,0.35)"
            : "0 0 20px color-mix(in srgb, var(--hero-fg) 18%, transparent)",
        }}
      >
        <span className="opacity-50">▸ </span>
        {cue.slice(0, typed)}
        <span
          className="inline-block w-[0.55em]"
          style={{ opacity: reduced || blink ? 1 : 0.15 }}
        >
          _
        </span>
      </p>
      <pre
        className="font-mono text-[11px] leading-none tracking-[0.08em] sm:text-sm"
        style={{
          color: party ? undefined : "var(--hero-soft)",
          animation:
            party && !reduced
              ? "stage-cue-rainbow 0.8s linear infinite"
              : undefined,
          opacity: party ? 1 : 0.72,
        }}
      >
        {bars}
      </pre>
    </div>
  );
}
