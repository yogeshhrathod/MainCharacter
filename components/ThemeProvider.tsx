"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type SiteTheme = "dark" | "party";

const STORAGE_KEY = "main-character:theme";

type ThemeContextValue = {
  theme: SiteTheme;
  setTheme: (theme: SiteTheme) => void;
  toggleTheme: () => void;
  party: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function readStoredTheme(): SiteTheme {
  if (typeof window === "undefined") return "dark";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === "party") return "party";
  return "dark";
}

export function applySiteTheme(theme: SiteTheme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<SiteTheme>("dark");

  useEffect(() => {
    const initial = readStoredTheme();
    setThemeState(initial);
    applySiteTheme(initial);
  }, []);

  const setTheme = useCallback((next: SiteTheme) => {
    setThemeState(next);
    applySiteTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: SiteTheme = prev === "party" ? "dark" : "party";
      applySiteTheme(next);
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      party: theme === "party",
    }),
    [theme, setTheme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useSiteTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useSiteTheme must be used within ThemeProvider");
  }
  return ctx;
}
