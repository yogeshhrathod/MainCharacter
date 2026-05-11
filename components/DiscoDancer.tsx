"use client";

import { useState, useEffect } from "react";

/*
  Beat-synced choreography dancer.

  Each entry: [art, beatFraction]
    beatFraction × (60 000 / bpm) = ms to hold this frame

  Party mode : 128 BPM  → 1 beat ≈ 469 ms
  Chill mode :  75 BPM  → 1 beat ≈ 800 ms

  Emotional arc per loop (~36 beats ≈ 9 bars):
    Phase 1 · INTRO       — eyes closed, just vibing, slow holds
    Phase 2 · FEELING IT  — wakes up, starts grooving
    Phase 3 · BUILD       — energy rising, quick cuts
    Phase 4 · THE DROP    — loses their mind (fastest frames)
    Phase 5 · SWAGGER     — sunglasses, moonwalk, main character
    Phase 6 · WIND DOWN   — eyes close again, loop
*/
type Step = [art: string, beats: number];

const CHOREO: Step[] = [

  // ─────────────────────────────────────────
  // Phase 1 · INTRO  (8 beats — smooth, slow)
  // ─────────────────────────────────────────
  // Eyes closed. Not trying. Just feeling it.
  ["        \n( - ᴗ - )\n   d  b ",  2.0],
  // One eye opens. Head tilts.
  ["   ♩    \n┌( ˘ᴗ˘)┘\n   d  b ",  1.0],
  // Both eyes. Gentle sway other way.
  ["   ♩    \n└(˘ᴗ˘ )┐\n   d  b ",  1.0],
  // Sunglasses materialise. LONG HOLD — this is the moment.
  ["   ★    \n└(⌐■ᴗ■)┘\n   d  b ",  2.0],
  // Running-man swagger walk.
  ["   ★    \n ᕕ(⌐■_■)ᕗ\n   d  d ",  1.0],
  // Cool point into the crowd.
  ["   ★    \n └(⌐■_■)ノ\n   d  b ",  1.0],

  // ─────────────────────────────────────────
  // Phase 2 · FEELING IT  (6 beats)
  // ─────────────────────────────────────────
  // Half-beat sways, left/right/left/right — finding the pocket.
  [" ♪      \n ヾ(•̀ᴗ•́) \n    d b ",  0.5],
  ["     ♪  \n  (•̀ᴗ•́)ノ\n   d b  ",  0.5],
  [" ♪      \n ヾ(•̀ᴗ•́) \n    d b ",  0.5],
  ["     ♪  \n  (•̀ᴗ•́)ノ\n   d b  ",  0.5],
  // On the downbeat: arms shoot up.
  ["  ♫     \n ヽ(•̀ᴗ•́)ノ\n   d  b ",  1.0],
  // Feet swap — offbeat syncopation.
  ["  ♫     \n └(•̀ᴗ•́)┘\n   b  d ",  0.5],
  ["  ♫     \n └(•̀ᴗ•́)┘\n   d  b ",  0.5],
  // Joy rising — face opens up.
  ["  ♫     \n ヽ(°ᗜ°)ノ \n   d  b ",  1.5],

  // ─────────────────────────────────────────
  // Phase 3 · BUILD  (5 beats — hype rising)
  // ─────────────────────────────────────────
  // Excited face, quick pulses.
  ["  ✦     \n ٩(˃ᗜ˂)۶ \n   ^ ^  ",  0.5],
  [" ✦✦     \n ٩(˃ᗜ˂)۶ \n   ^ ^  ",  0.5],
  // OH — the drop is coming. Face of pure realisation.
  ["  ✦✦    \n ヽ(°∀°)ノ \n   ^ ^  ",  0.5],
  [" ✦✦✦   \n ヽ(°∀°)ノ \n   ^ ^  ",  0.5],
  // FLEX — because why not.
  ["   !    \n ᕦ(ò_óˇ)ᕤ\n   | |  ",  1.0],
  // Fighter spirit — brace for impact.
  ["   !    \n (ง •̀_•́)ง\n   | |  ",  1.0],
  // CROUCH. Here. It. Comes.
  ["  !!!   \n ヽ(°o°ˋ)ノ\n   \\_/  ",  1.0],

  // ─────────────────────────────────────────
  // Phase 4 · THE DROP  (~4 beats — chaos)
  // ─────────────────────────────────────────
  // LAUNCH — fastest frame in the whole loop.
  ["  ↑↑↑   \n \\(°ᗜ°)/ \n    ↑   ",  0.25],
  // STAR EYES — mid-air.
  [" ★★★    \n \\(★ᗜ★)/ \n   ^ ^  ",  0.5],
  // PURE JOY — peak height.
  [" ✦✦✦   \n ٩(≧▽≦)۶ \n   ^ ^  ",  0.5],
  // Flash back to stars.
  [" ★★★    \n \\(★ᗜ★)/ \n   ^ ^  ",  0.5],
  // Still going.
  [" ✦★✦   \n ٩(≧▽≦)۶ \n   ^ ^  ",  0.5],
  // Land! Legs buckle.
  ["   !!   \n ヽ(≧▽≦)ノ\n   \\_/  ",  0.5],
  // Still bouncing — can't stop.
  ["  ♫♪    \n ヽ(°ᗜ°)ノ \n   ^ ^  ",  1.0],

  // ─────────────────────────────────────────
  // Phase 5 · SWAGGER  (8 beats — main char)
  // ─────────────────────────────────────────
  // Sunglasses back on. LONG HOLD. This is the walk-off.
  ["   ★    \n└(⌐■_■)┘ \n   d  b ",  2.0],
  // Running man / moonwalk — ultimate cool.
  ["   ★    \n ᕕ(⌐■_■)ᕗ\n   d  d ",  1.0],
  // Moonwalk steps — sunglasses the whole time.
  ["\n ヽ(⌐■_■)┘\n   \\ \\  ",  0.5],
  ["\n └(⌐■_■)ノ\n   / /  ",  0.5],
  ["\n ヽ(⌐■_■)┘\n   \\ \\  ",  0.5],
  ["\n └(⌐■_■)ノ\n   / /  ",  0.5],
  // Peace. Because they earned it.
  ["  ✌     \n └(^ω^)┘ \n   d  b ",  1.0],
  // Sunglasses one last time. Big hold.
  ["   ★    \n└(⌐■_■)┘ \n   d  b ",  2.0],

  // ─────────────────────────────────────────
  // Phase 6 · WIND DOWN  (5 beats — breathe)
  // ─────────────────────────────────────────
  // Arms float down.
  ["   ♩    \n ヽ(˘ᴗ˘)ノ \n   d  b ",  1.0],
  // Settle.
  ["   ♩    \n └(˘ᴗ˘)┘ \n   d  b ",  1.0],
  // Eyes close again. Ready to loop.
  ["        \n( - ᴗ - )\n   d  b ",  2.0],
  // One last breath — then it starts again.
  ["   ♩    \n ( ˘ᴗ˘ )  \n   d  b ",  1.0],
];

const FLOAT_NOTES = [
  { char: "♪", delay: "0s",    dur: "1.4s", anim: "note-0", hue: 0   },
  { char: "♫", delay: "0.35s", dur: "1.6s", anim: "note-1", hue: 72  },
  { char: "★", delay: "0.7s",  dur: "1.2s", anim: "note-2", hue: 144 },
  { char: "♬", delay: "1.0s",  dur: "1.8s", anim: "note-3", hue: 216 },
  { char: "✦", delay: "1.3s",  dur: "1.5s", anim: "note-4", hue: 288 },
];

export default function DiscoDancer({ party }: { party: boolean }) {
  const [frame, setFrame] = useState(0);

  // Each frame schedules the next with its own beat-fraction duration.
  // When `party` changes mid-frame, the effect re-fires with the new BPM.
  useEffect(() => {
    const bpm     = party ? 128 : 75;
    const beatMs  = 60_000 / bpm;
    const holdMs  = Math.round(CHOREO[frame][1] * beatMs);
    const id      = setTimeout(() => setFrame((f) => (f + 1) % CHOREO.length), holdMs);
    return () => clearTimeout(id);
  }, [frame, party]);

  const art = CHOREO[frame][0];

  return (
    <div className="relative flex flex-col items-center pointer-events-none select-none">
      {/* Floating notes — party mode only */}
      {party &&
        FLOAT_NOTES.map((n, i) => (
          <span
            key={i}
            className="absolute text-sm"
            style={{
              bottom: "6px",
              left: "50%",
              color: `hsl(${n.hue}deg, 100%, 72%)`,
              animation: `${n.anim} ${n.dur} ${n.delay} ease-out infinite`,
              zIndex: 1,
            }}
          >
            {n.char}
          </span>
        ))}

      {/*
        key={frame} remounts the <pre> on every step so the one-shot
        beat-pop / beat-flash animation restarts cleanly each time.
        The continuous bob / shake rides on top of that.
      */}
      <pre
        key={frame}
        className="font-mono text-[14px] leading-normal"
        style={{
          whiteSpace: "pre",
          minWidth: "110px",
          textAlign: "center",
          animation: party
            ? [
                "dancer-beat-flash 0.18s cubic-bezier(0.2,0,0.4,1)",
                "dancer-shake 0.28s ease-in-out infinite 0.18s",
                "dancer-rainbow-text 0.6s linear infinite",
              ].join(", ")
            : [
                "dancer-beat-pop 0.22s cubic-bezier(0.2,0,0.4,1)",
                "dancer-bob 1.6s ease-in-out infinite 0.22s",
              ].join(", "),
          color: party ? undefined : "rgba(180, 155, 255, 0.75)",
          textShadow: party
            ? undefined
            : "0 0 14px rgba(150, 100, 255, 0.45)",
          transition: "color 0.5s ease, text-shadow 0.5s ease",
        }}
      >
        {art}
      </pre>
    </div>
  );
}
