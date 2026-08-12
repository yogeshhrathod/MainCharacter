"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import AsciiWordmark from "@/components/AsciiWordmark";
import DiscoCanvas from "@/components/DiscoCanvas";
import StageCue from "@/components/StageCue";
import { useSiteTheme } from "@/components/ThemeProvider";
import { WORDMARK_LINES } from "@/components/scene";

export default function Hero() {
  const { party } = useSiteTheme();
  /* Lock first painted height so mobile URL-bar show/hide doesn't
     resize the stage and restart the ASCII wordmark. */
  const [stageMinH, setStageMinH] = useState<string>("100svh");

  useEffect(() => {
    const h = Math.max(window.innerHeight, document.documentElement.clientHeight);
    setStageMinH(`${h}px`);
  }, []);

  return (
    <section
      id="top"
      className="relative isolate w-full overflow-hidden bg-[var(--hero-bg)] text-[var(--hero-fg)]"
      style={{ minHeight: stageMinH }}
    >
      <h1 className="sr-only">Main Character — product and service studio</h1>

      {/* ── Cinematic stage lights — fade out when party takes over ─ */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: party ? 0 : 1,
          transition: party ? "opacity 2s ease 1s" : "opacity 1.5s ease",
        }}
      >
        <div
          className="absolute inset-0"
          style={{ background: "var(--hero-stage-key)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "var(--hero-stage-fill)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "var(--hero-stage-low)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "var(--hero-stage-rim)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "var(--hero-stage-sheen)" }}
        />
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "var(--hero-vignette)",
          opacity: party ? 0.45 : 1,
          transition: party ? "opacity 3s ease" : "opacity 1.5s ease",
        }}
      />

      <svg
        className="absolute inset-0 h-full w-full pointer-events-none opacity-[0.14] mix-blend-overlay"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="hero-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.70"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-grain)" />
      </svg>

      <DiscoCanvas active={party} />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-64 sm:h-56 md:h-72"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, color-mix(in srgb, var(--hero-bg) 70%, transparent) 30%, color-mix(in srgb, var(--color-paper) 82%, transparent) 74%, var(--color-paper) 100%)",
        }}
      />

      <Header />

      <div className="absolute inset-0 z-0">
        <AsciiWordmark
          lines={WORDMARK_LINES}
          cellMin={6}
          cellMax={16}
          partyMode={party}
        />
      </div>

      <div className="absolute bottom-28 left-5 z-20 flex flex-col gap-2 sm:bottom-24 sm:left-6 md:bottom-28 md:left-10">
        <a
          href="#contact"
          className="inline-flex w-fit items-center justify-center rounded-full bg-[var(--hero-primary-bg)] px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--hero-primary-fg)] transition opacity-95 hover:opacity-100 sm:text-[11px]"
        >
          Start a project
        </a>
        <a
          href="#work"
          className="inline-flex w-fit items-center justify-center rounded-full border border-[var(--hero-panel-border)] bg-[var(--hero-secondary-bg)] px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--hero-fg)] backdrop-blur-md transition hover:border-[var(--hero-soft)] sm:text-[11px]"
        >
          View work
        </a>
      </div>

      <div className="absolute bottom-[5.5rem] left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center sm:bottom-24 sm:flex md:bottom-24">
        <StageCue party={party} />
      </div>

      <div className="absolute right-5 bottom-5 left-5 z-20 grid grid-cols-1 gap-2 sm:right-6 sm:bottom-8 sm:left-6 sm:grid-cols-2 md:right-10 md:bottom-10 md:left-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-4">
          <p className="font-mono text-[10px] leading-snug tracking-[0.18em] uppercase text-[var(--hero-muted)] sm:text-[11px] md:text-xs md:text-[var(--hero-fg)]">
            Service &amp; Product
            <br />
            Studio.
          </p>
        </div>
        <div className="md:col-span-8 md:text-right">
          <p className="font-mono text-[10px] leading-snug tracking-[0.18em] uppercase text-[var(--hero-muted)] sm:text-[11px] md:text-xs md:text-[var(--hero-fg)]">
            Ai products. Ai design. Business with main character energy.
          </p>
        </div>
      </div>
    </section>
  );
}
