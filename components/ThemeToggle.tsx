"use client";

import { useSiteTheme } from "@/components/ThemeProvider";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme, party } = useSiteTheme();
  const nextTheme = party ? "dark" : "party";

  return (
    <button
      type="button"
      aria-label={`Switch to ${nextTheme} theme`}
      aria-pressed={party}
      onClick={toggleTheme}
      className={`group inline-flex items-center gap-2 rounded-full border border-[var(--hero-panel-border)] bg-[var(--hero-secondary-bg)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--hero-muted)] backdrop-blur transition hover:border-[var(--hero-soft)] hover:text-[var(--hero-fg)] ${className}`}
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
        aria-hidden="true"
        className="h-2.5 w-2.5 rounded-full transition"
        style={{
          background: party ? "#ff8f4c" : "var(--hero-soft)",
          boxShadow: party ? "0 0 14px rgba(255,143,76,0.85)" : "none",
        }}
      />
      <span className="transition group-hover:text-[var(--hero-fg)]">
        {theme}
      </span>
    </button>
  );
}
