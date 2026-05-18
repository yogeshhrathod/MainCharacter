"use client";

import { useEffect, useState } from "react";

type Cue<TPhase extends string> = {
  at: number;
  phase: TPhase;
};

export function useTimedSequence<TPhase extends string>(
  cues: readonly Cue<TPhase>[]
) {
  const [phase, setPhase] = useState<TPhase>(cues[0].phase);

  useEffect(() => {
    const timers = cues.slice(1).map((cue) =>
      window.setTimeout(() => setPhase(cue.phase), cue.at)
    );

    return () => timers.forEach(window.clearTimeout);
  }, [cues]);

  return phase;
}
