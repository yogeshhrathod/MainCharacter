"use client";

import { useState } from "react";
import Header from "@/components/Header";
import AsciiWordmark from "@/components/AsciiWordmark";
import DiscoCanvas from "@/components/DiscoCanvas";
import StageCue from "@/components/StageCue";
import { WORDMARK_LINES } from "@/components/scene";

export default function Hero() {
  const [party, setParty] = useState(false);

  return (
    <section
      id="top"
      className="relative isolate min-h-[100svh] w-full overflow-hidden bg-[var(--hero-bg)] text-[var(--hero-fg)]"
    >
      <h1 className="sr-only">Main Character — product and service studio</h1>

      {/* ── Cinematic stage lights — fade out when party takes over ─ */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: party ? 0 : 1,
          /* linger 1 s then fade over 2 s so lights are gone by beat 4 */
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

      {/* Compact CTAs — left, clear of the wordmark center */}
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

      <div className="absolute right-5 bottom-20 z-20 sm:right-6 sm:bottom-24 md:right-10 md:bottom-16">
        <button
          type="button"
          aria-pressed={party}
          aria-label={party ? "End party mode" : "Start party mode"}
          onClick={() => setParty((v) => !v)}
          className="group inline-flex items-center gap-3 rounded-full border border-[var(--hero-panel-border)] bg-[var(--hero-secondary-bg)] px-3 py-2 backdrop-blur-md transition hover:border-[var(--hero-soft)]"
          style={
            party
              ? {
                  boxShadow:
                    "0 0 18px rgba(255,140,64,0.24), 0 0 42px rgba(255,90,0,0.14)",
                }
              : undefined
          }
        >
          <span
            className="h-2.5 w-2.5 rounded-full transition"
            style={{
              background: party ? "#ff8f4c" : "var(--hero-soft)",
              boxShadow: party ? "0 0 14px rgba(255,143,76,0.85)" : "none",
            }}
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--hero-muted)] transition group-hover:text-[var(--hero-fg)] sm:text-[11px]">
            {party ? "End party mode" : "Party mode"}
          </span>
        </button>
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
