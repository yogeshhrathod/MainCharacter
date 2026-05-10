"use client";

import { useState } from "react";
import Header from "@/components/Header";
import AsciiWordmark from "@/components/AsciiWordmark";
import DiscoCanvas from "@/components/DiscoCanvas";

export default function Hero() {
  const [party, setParty] = useState(false);

  return (
    <section
      id="top"
      className="relative isolate min-h-dvh w-full overflow-hidden bg-[#050505] text-white"
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
          transition: "opacity 0.9s ease",
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
          opacity: party ? 0.55 : 1,
          transition: "opacity 0.9s ease",
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

      <div className="absolute inset-0 flex items-center justify-center px-3 pt-16 pb-32 md:px-8 md:pt-28 md:pb-28">
        <div className="h-[36vh] w-full max-w-[1600px] md:h-[78vh]">
          <AsciiWordmark lines={["MAIN", "CHARACTER"]} cellMin={8} partyMode={party} />
        </div>
      </div>

      {/* ── Party mode button ──────────────────────────────────────── */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 md:bottom-24">
        <button
          onClick={() => setParty((v) => !v)}
          className="relative font-mono text-[11px] tracking-[0.18em] uppercase px-5 py-2.5 rounded-sm overflow-hidden transition-all duration-300"
          style={
            party
              ? {
                  background:
                    "linear-gradient(90deg,#ff00cc,#8800ff,#00ccff,#00ff88,#ffcc00,#ff00cc)",
                  backgroundSize: "300% 100%",
                  animation:
                    "party-btn-shimmer 2s linear infinite, party-btn-pulse 1.4s ease-in-out infinite",
                  color: "#fff",
                  border: "none",
                  textShadow: "0 0 8px rgba(255,255,255,0.9)",
                }
              : {
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: "rgba(255,255,255,0.65)",
                }
          }
        >
          {party ? "✕ End Party" : "🪩 Party Mode"}
        </button>
      </div>

      <div className="absolute right-6 bottom-8 left-6 grid grid-cols-1 gap-4 md:right-10 md:bottom-10 md:left-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-4">
          <p className="font-mono text-[11px] leading-snug tracking-[0.18em] uppercase md:text-xs">
            Service &amp; Product
            <br />
            Studio.
          </p>
        </div>
        <div className="md:col-span-8 md:text-right">
          <p className="font-mono text-[11px] leading-snug tracking-[0.18em] uppercase md:text-xs">
            Main Character is a small studio designing services and shipping
            <br />
            products for founders, teams, and brands who refuse to play a
            supporting role.
          </p>
        </div>
      </div>
    </section>
  );
}
