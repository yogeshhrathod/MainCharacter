"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

const NAV_LEFT = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
];

const NAV_MID = [
  { href: "#services", label: "Services" },
  { href: "#products", label: "Products" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-30 text-[var(--hero-fg)]">
      <div className="grid grid-cols-2 items-start gap-4 px-5 py-5 md:grid-cols-12 md:gap-8 md:px-8 md:py-7">
        <div className="md:col-span-3">
          <Link
            href="/"
            className="font-display text-xl tracking-tight md:text-2xl"
          >
            <span>main</span>
            <span className="italic">character</span>
          </Link>
        </div>

        <div className="hidden md:col-span-3 md:block">
          <ul className="space-y-1.5 font-mono text-[11px] tracking-[0.18em] uppercase">
            {NAV_LEFT.map((i) => (
              <li key={i.href}>
                <a href={i.href} className="hover:opacity-60">
                  {i.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden md:col-span-3 md:block">
          <ul className="space-y-1.5 font-mono text-[11px] tracking-[0.18em] uppercase">
            {NAV_MID.map((i) => (
              <li key={i.href}>
                <a href={i.href} className="hover:opacity-60">
                  {i.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden text-right md:col-span-3 md:flex md:flex-col md:items-end md:gap-3">
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase">
            Service &amp; Product Studio
          </p>
          <a
            href="mailto:founder@maincharacter.one"
            className="block font-mono text-[11px] tracking-[0.18em] uppercase hover:opacity-60"
          >
            founder@maincharacter.one
          </a>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 justify-self-end md:hidden">
          <ThemeToggle className="px-2.5" />
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="font-mono text-[11px] tracking-[0.18em] uppercase"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[var(--hero-panel-border)] bg-[var(--hero-panel-strong)] px-5 py-6 backdrop-blur md:hidden">
          <ul className="space-y-3 font-mono text-xs tracking-[0.18em] uppercase">
            {[...NAV_LEFT, ...NAV_MID].map((i) => (
              <li key={i.href}>
                <a
                  href={i.href}
                  onClick={() => setOpen(false)}
                  className="hover:opacity-60"
                >
                  {i.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href="mailto:founder@maincharacter.one"
                className="hover:opacity-60"
              >
                founder@maincharacter.one
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
