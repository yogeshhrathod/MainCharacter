"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "main-character:theme";

function getSystemTheme(): Theme {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved === "light" || saved === "dark" ? saved : getSystemTheme();
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      aria-label={`Switch to ${nextTheme} theme`}
      aria-pressed={theme === "dark"}
      onClick={() => {
        setTheme(nextTheme);
        applyTheme(nextTheme);
        window.localStorage.setItem(STORAGE_KEY, nextTheme);
      }}
      className={`inline-flex items-center gap-2 rounded-full border border-[var(--hero-panel-border)] bg-[var(--hero-secondary-bg)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--hero-muted)] backdrop-blur transition hover:border-[var(--hero-soft)] hover:text-[var(--hero-fg)] ${className}`}
    >
      <span
        aria-hidden="true"
        className="relative h-3.5 w-3.5 rounded-full border border-current"
      >
        <span
          className={`absolute inset-0 rounded-full bg-current transition-transform ${
            theme === "dark" ? "scale-50" : "scale-100"
          }`}
        />
      </span>
      {theme}
    </button>
  );
}
