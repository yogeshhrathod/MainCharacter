import type { ReactNode } from "react";

const links = [
  ["Privacy", "/privacy"],
  ["Terms", "/terms"],
] as const;

export default function StudioLegalPage({
  title,
  summary,
  children,
}: {
  title: string;
  summary: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-[var(--color-paper)] text-[var(--color-ink)]">
      <header className="border-b border-[var(--color-line)]">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <a className="font-display text-xl tracking-tight" href="/">
            <span>main</span>
            <span className="italic">character</span>
          </a>
          <nav aria-label="Legal" className="flex gap-5 text-sm">
            {links.map(([label, href]) => (
              <a
                className="underline-offset-4 hover:underline"
                href={href}
                key={href}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <p className="font-mono text-sm uppercase tracking-[0.18em] text-[var(--color-mute)]">
          Main Character LLP
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--color-mute)]">
          {summary}
        </p>
        <p className="mt-4 text-sm text-[var(--color-mute)]">
          Effective 12 August 2026
        </p>

        <article className="mt-12 space-y-9 text-[15px] leading-7 [&_a]:underline [&_a]:underline-offset-4 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
          {children}
        </article>
      </div>

      <footer className="border-t border-[var(--color-line)]">
        <div className="mx-auto max-w-3xl px-6 py-8 text-sm text-[var(--color-mute)]">
          © 2026 Main Character LLP ·{" "}
          <a
            className="underline underline-offset-4"
            href="mailto:hello@maincharacter.one"
          >
            hello@maincharacter.one
          </a>
        </div>
      </footer>
    </div>
  );
}
