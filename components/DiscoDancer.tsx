"use client";

import { useState, useEffect } from "react";

/* ─────────────────────────────────────────────────────────────
   39-frame kaomoji disco dancer.
   Arms: └┘  ヽノ  \\/ <> ᕦᕤ ٩۶  etc.
   Faces: •̀ᴗ•́  ⌐■_■  °ᗜ°  ᵔ◡ᵔ  ≧ᴗ≦  ò_ó  ^ω^  °o°
   Legs:  d b  | |  / \  \\ \\  / /  ^ ^  \\_/
───────────────────────────────────────────────────────────── */
const FRAMES = [
  // ── Entrance / main character ─────────────────────────────
  "  |=|\n└(•̀ᴗ•́)┘\n  d b",           //  0  classic stance
  "  |=|\n\\(•̀ᴗ•́)/\n  d b",           //  1  arms wide up
  "  |=|\nヽ(•̀ᴗ•́)ノ\n  d b",          //  2  hands raised
  "  |=|\n└(⌐■_■)┘\n  d b",            //  3  sunglasses cool
  "  ★\n└(⌐■_■)ノ\n  d b",             //  4  sunglasses point

  // ── Groove left & right ───────────────────────────────────
  " ♪\nヾ(•̀ᴗ•́) \n   d b",            //  5  lean left wave
  "    ♪\n (•̀ᴗ•́)ノ\n  d b",           //  6  lean right wave
  "  ♪\n└(°ᗜ°)┘\n  b d",              //  7  happy bounce
  " ♫\nヽ(°ᗜ°)ノ\n  d b",              //  8  ecstatic arms
  "  ♪\n└(ᵔ◡ᵔ)┘\n  d b",             //  9  sweet groove
  "  ♫\n└(≧ᴗ≦)┘\n  d b",             // 10  intense happy
  " ♪\n└(•̀ᴗ•́)┘\n  b d",             // 11  feet swap bounce

  // ── Arm wave sequence ─────────────────────────────────────
  " ♫\n٩(•̀ᴗ•́)۶\n  ^ ^",             // 12  both arms explode
  "  ~\nヾ(•̀ᴗ•́)ノ\n   b",             // 13  wave right
  " ~\nヽ(•̀ᴗ•́)ゞ\n b  ",             // 14  wave left
  "  ♫\n└(^ω^)ノ\n  d b",             // 15  music toss

  // ── Character power moves ─────────────────────────────────
  " ★★\n└(⌐■_■)ノ\n  d b",            // 16  sunglasses point
  "  ★\nᕦ(ò_óˇ)ᕤ\n  | |",            // 17  flex biceps!
  " ✦\n(ง •̀_•́)ง\n  | |",            // 18  fighting spirit
  " ✦\n( •̀ᴗ•́)و\n  d b",             // 19  fist pump
  "   ~\nヽ(⌐■_■)ノ\n  d b",           // 20  too-cool spin

  // ── Jump sequence ─────────────────────────────────────────
  "  !\nヽ(°o°)ノ\n  \\_/",            // 21  crouch & gasp
  "↑↑\n\\(°ᗜ°)/\n   ↑",              // 22  LAUNCH!
  " ★\n\\(°ᗜ°)/\n  / \\",             // 23  peak spread-eagle
  "  !\nヽ(°ᗜ°)ノ\n  \\_/",            // 24  land crouch
  " ♪\nヽ(•̀ᴗ•́)ノ\n  d b",            // 25  bounce recovery

  // ── Pointing all directions ───────────────────────────────
  " ★\nヽ(•̀ᴗ•́)>\n  d b",             // 26  point right
  "↑\n└(•̀ᴗ•́)┘\n  d b",              // 27  point up
  " ★\n<(•̀ᴗ•́)ノ\n  d b",             // 28  point left
  " ✦\n(•̀ᴗ•́)b\n  | |",              // 29  thumbs up
  " ✌\n└(^ω^)┘\n  d b",              // 30  peace sign ✌

  // ── Hip shakes ────────────────────────────────────────────
  "  ♪\nヽ(•̀ᴗ•́)┘\n  / \\",           // 31  hip R
  "  ♪\n└(•̀ᴗ•́)ノ\n  / \\",           // 32  hip L
  "  !\nヽ(•̀ᴗ•́)ノ\n  > \\",           // 33  kick right
  "  !\nヽ(•̀ᴗ•́)ノ\n  / <",           // 34  kick left

  // ── Moonwalk ──────────────────────────────────────────────
  "\nヽ(⌐■_■)┘\n  \\ \\",             // 35  moonwalk 1
  "\nヽ(⌐■_■)┘\n  / /",              // 36  moonwalk 2
  "\n└(⌐■_■)ノ\n  \\ \\",             // 37  moonwalk 3
  "\n└(⌐■_■)ノ\n  / /",              // 38  moonwalk 4

  // ── Grand finale ──────────────────────────────────────────
  "★✦★\n\\(⌐■_■)/\n  | |",           // 39  MC victory pose
  "✦★✦\nヽ(°ᗜ°)ノ\n  ^ ^",           // 40  pure ecstasy
  "♪✦♫\n٩(•̀ᴗ•́)۶\n  ^ ^",           // 41  music explosion
  "  ✦\n└(•̀ᴗ•́)┘\n  d b",           // 42  back to cool
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

  useEffect(() => {
    const ms = party ? 115 : 340;
    const id = setInterval(() => setFrame((f) => (f + 1) % FRAMES.length), ms);
    return () => clearInterval(id);
  }, [party]);

  return (
    <div className="relative flex flex-col items-center pointer-events-none select-none">
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

      <pre
        className="font-mono text-[14px] leading-[1.45]"
        style={{
          whiteSpace: "pre",
          minWidth: "100px",
          textAlign: "center",
          animation: party
            ? "dancer-shake 0.3s ease-in-out infinite, dancer-rainbow-text 0.65s linear infinite"
            : "dancer-bob 1.4s ease-in-out infinite",
          color: party
            ? undefined
            : "rgba(180, 160, 255, 0.7)",
          textShadow: party
            ? undefined
            : "0 0 12px rgba(160, 120, 255, 0.4)",
          transition: "color 0.5s ease, text-shadow 0.5s ease",
        }}
      >
        {FRAMES[frame]}
      </pre>
    </div>
  );
}
