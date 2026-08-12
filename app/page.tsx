"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import LoadingScreen from "@/components/LoadingScreen";
import SiteSections from "@/components/SiteSections";

export default function HomePage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const seen =
      window.sessionStorage.getItem("main-character:intro-seen") === "1";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    if (seen || reduced) {
      window.sessionStorage.setItem("main-character:intro-seen", "1");
      setLoaded(true);
    }
  }, []);

  const markLoaded = () => {
    window.sessionStorage.setItem("main-character:intro-seen", "1");
    setLoaded(true);
  };

  return (
    <>
      <Hero />
      <SiteSections />
      {!loaded && <LoadingScreen onDone={markLoaded} onSkip={markLoaded} />}
    </>
  );
}
