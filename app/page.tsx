"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import LoadingScreen from "@/components/LoadingScreen";

export default function HomePage() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <Hero />
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}
    </>
  );
}
