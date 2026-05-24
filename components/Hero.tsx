"use client";

import { useState } from "react";
import Header from "@/components/Header";
import AsciiWordmark from "@/components/AsciiWordmark";
import DiscoCanvas from "@/components/DiscoCanvas";
import DiscoDancer from "@/components/DiscoDancer";
import { WORDMARK_LINES } from "@/components/scene";

export default function Hero() {
  const [party, setParty] = useState(false);

  return (
    <section
      id="top"
      className="relative isolate min-h-[100svh] w-full overflow-hidden bg-[var(--hero-bg)] text-[var(--hero-fg)]"
    >
      {/* ── Cinematic stage lights — fade out when party takes over ─ */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: party ? 0 : 1,
          /* linger 1 s then fade over 2 s so lights are gone by beat 4 */
          transition: party ? "opacity 2s ease 1s" : "opacity 1.5s ease",
        }}
      >
        {/* Warm overhead key light */}
        <div
          className="absolute inset-0"
          style={{
            background: "var(--hero-stage-key)",
          }}
        />
        {/* Soft center fill */}
        <div
          className="absolute inset-0"
          style={{
            background: "var(--hero-stage-fill)",
          }}
        />
        {/* Cool blue ambient from below */}
        <div
          className="absolute inset-0"
          style={{
            background: "var(--hero-stage-low)",
          }}
        />
        {/* Side rim lights */}
        <div
          className="absolute inset-0"
          style={{
            background: "var(--hero-stage-rim)",
          }}
        />
        {/* Anamorphic lens sheen */}
        <div
          className="absolute inset-0"
          style={{
            background: "var(--hero-stage-sheen)",
          }}
        />
      </div>

      {/* Vignette — slightly eased in party mode to let disco colors breathe */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "var(--hero-vignette)",
          opacity: party ? 0.45 : 1,
          transition: party ? "opacity 3s ease" : "opacity 1.5s ease",
        }}
      />

      {/* Film grain overlay */}
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

      {/* ── Disco canvas — full scene: bg tint, floor, beams, dots ─ */}
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

      {/* ── Full-screen ASCII Grid and Wordmark ── */}
      <div className="absolute inset-0 z-0">
        <AsciiWordmark lines={WORDMARK_LINES} cellMin={6} cellMax={16} partyMode={party} />
      </div>

      <div className="absolute inset-x-5 bottom-40 z-20 flex justify-center sm:bottom-44 md:bottom-36">
        <div className="flex max-w-sm flex-col items-center gap-4 text-center sm:max-w-xl">
          <p className="font-display text-lg leading-tight tracking-tight text-[var(--hero-muted)] sm:text-xl md:text-3xl">
            Product and service company building AI-first experiences, sharp
            interfaces, and digital products that know how to hold attention.
          </p>
          <div className="flex w-full flex-col gap-3 rounded-[28px] border border-[var(--hero-panel-border)] bg-[var(--hero-panel)] p-2 backdrop-blur-md sm:w-auto sm:flex-row sm:items-center sm:justify-center">
            <a
              href="#work"
              className="w-full rounded-full bg-[var(--hero-primary-bg)] px-6 py-3 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--hero-primary-fg)] transition opacity-95 hover:opacity-100 sm:w-auto"
            >
              View work
            </a>
            <a
              href="mailto:founder@maincharacter.one"
              className="w-full rounded-full border border-[var(--hero-panel-border)] bg-[var(--hero-secondary-bg)] px-6 py-3 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--hero-fg)] transition hover:border-[var(--hero-soft)] sm:w-auto"
            >
              Start a project
            </a>
          </div>
        </div>
      </div>

      {/* ── Disco dancer ──────────────────────────────────────────── */}
      <div className="absolute bottom-20 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3 sm:bottom-24 md:bottom-24">
        <DiscoDancer party={party} />
      </div>

      <div className="absolute right-5 bottom-18 z-20 sm:right-6 sm:bottom-24 md:right-10 md:bottom-16">
        <button
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

      <div className="absolute right-5 bottom-5 left-5 z-20 hidden grid-cols-1 gap-2 sm:right-6 sm:bottom-8 sm:left-6 sm:grid md:right-10 md:bottom-10 md:left-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-4">
          <p className="font-mono text-[10px] leading-snug tracking-[0.18em] uppercase sm:text-[11px] md:text-xs">
            Service &amp; Product
            <br />
            Studio.
          </p>
        </div>
        <div className="md:col-span-8 md:text-right">
          <p className="font-mono text-[10px] leading-snug tracking-[0.18em] uppercase sm:text-[11px] md:text-xs">
            Ai products. Ai design. Business with main character energy.
          </p>
        </div>
      </div>
    </section>
  );
}
