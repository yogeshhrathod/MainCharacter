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
      className="relative isolate min-h-[100svh] w-full overflow-hidden bg-[#050505] text-white"
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "5px 5px",
        }}
      />

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
            background:
              "radial-gradient(ellipse 78% 58% at 50% -18%, rgba(215,158,52,0.14) 0%, rgba(180,120,30,0.05) 48%, transparent 72%)",
          }}
        />
        {/* Soft center fill */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 54% 52% at 50% 47%, rgba(255,248,235,0.05) 0%, transparent 62%)",
          }}
        />
        {/* Cool blue ambient from below */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 92% 36% at 50% 118%, rgba(28,52,165,0.10) 0%, transparent 68%)",
          }}
        />
        {/* Side rim lights */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(35,55,190,0.05) 0%, transparent 22%, transparent 78%, rgba(35,55,190,0.05) 100%)",
          }}
        />
        {/* Anamorphic lens sheen */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 34%, rgba(210,185,120,0.025) 48%, rgba(255,238,170,0.045) 50%, rgba(210,185,120,0.025) 52%, transparent 66%)",
          }}
        />
      </div>

      {/* Vignette — slightly eased in party mode to let disco colors breathe */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 118% 108% at 50% 50%, transparent 26%, rgba(0,0,0,0.62) 60%, rgba(0,0,0,0.90) 100%)",
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

      <Header />

      <div className="absolute inset-0 flex items-center justify-center px-3 pt-20 pb-64 md:px-8 md:pt-28 md:pb-28">
        <div className="h-[28vh] w-full max-w-[1600px] sm:h-[34vh] md:h-[78vh]">
          <AsciiWordmark lines={WORDMARK_LINES} cellMin={8} partyMode={party} />
        </div>
      </div>

      <div className="absolute inset-x-5 bottom-40 z-20 flex justify-center sm:bottom-44 md:bottom-36">
        <div className="flex max-w-sm flex-col items-center gap-4 text-center sm:max-w-xl">
          <p className="font-display text-lg leading-tight tracking-tight text-white/90 sm:text-xl md:text-3xl">
            Product and service company building AI-first experiences, sharp
            interfaces, and digital products that know how to hold attention.
          </p>
          <div className="flex w-full flex-col gap-3 rounded-[28px] border border-white/10 bg-white/6 p-2 backdrop-blur-md sm:w-auto sm:flex-row sm:items-center sm:justify-center">
            <a
              href="#work"
              className="w-full rounded-full bg-[#f3eadc] px-6 py-3 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-black transition hover:bg-white sm:w-auto"
            >
              View work
            </a>
            <a
              href="mailto:founder@maincharacter.one"
              className="w-full rounded-full border border-white/18 bg-black/20 px-6 py-3 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-white transition hover:border-white/40 hover:bg-white/8 sm:w-auto"
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
          className="group inline-flex items-center gap-3 rounded-full border border-white/12 bg-black/30 px-3 py-2 backdrop-blur-md transition hover:border-white/30 hover:bg-black/45"
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
              background: party ? "#ff8f4c" : "rgba(255,255,255,0.38)",
              boxShadow: party ? "0 0 14px rgba(255,143,76,0.85)" : "none",
            }}
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/78 transition group-hover:text-white sm:text-[11px]">
            {party ? "End party mode" : "Party mode"}
          </span>
        </button>
      </div>

      <div className="absolute right-5 bottom-5 left-5 grid grid-cols-1 gap-2 sm:right-6 sm:bottom-8 sm:left-6 md:right-10 md:bottom-10 md:left-10 md:grid-cols-12 md:gap-8">
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
