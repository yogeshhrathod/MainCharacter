export const WORDMARK_LINES = ["MAIN", "CHARACTER"] as const;

export const PARTY_SEQUENCE = {
  enterFrames: 240,
  exitFrames: 90,
  textRevealStart: 0.625,
} as const;

export const INTRO_COPY = "you are the";

export type IntroPhase =
  | "rain"
  | "dark"
  | "typing"
  | "flashlight"
  | "exit"
  | "done";

export const INTRO_SEQUENCE: readonly {
  at: number;
  phase: IntroPhase;
}[] = [
  { at: 0, phase: "rain" },
  { at: 1300, phase: "dark" },
  { at: 1800, phase: "typing" },
  { at: 3150, phase: "flashlight" },
  { at: 8200, phase: "exit" },
  { at: 9100, phase: "done" },
] as const;
