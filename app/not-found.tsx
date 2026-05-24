import Link from "next/link";

export const dynamic = "force-static";

export default function NotFound() {
  return (
    <section className="flex min-h-dvh flex-col items-center justify-center bg-paper px-6 text-center text-ink">
      <p className="font-mono text-[11px] tracking-[0.22em] text-mute uppercase">
        404 — not found
      </p>
      <h1 className="font-display mt-5 max-w-md text-3xl tracking-tight md:text-4xl">
        This page is not in the script.
      </h1>
      <p className="mt-4 max-w-sm font-mono text-[11px] leading-relaxed tracking-[0.14em] text-mute uppercase">
        The URL may be wrong, or the scene was cut. Head back to the main
        story.
      </p>
      <Link
        href="/"
        className="mt-10 font-mono text-[11px] tracking-[0.22em] text-ink/80 uppercase underline decoration-ink/30 underline-offset-10 transition hover:text-ink"
      >
        Return home
      </Link>
    </section>
  );
}
