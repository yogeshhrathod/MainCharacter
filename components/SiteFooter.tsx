const FOOTER_NAV = [
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#products", label: "Products" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
] as const;

const FOOTER_PRODUCTS = [
  { href: "https://luna.wesparkvault.com/", label: "Luna" },
  { href: "https://scooty.wesparkvault.com/", label: "Scooty" },
] as const;

export default function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper text-ink">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-6 md:grid-cols-12 md:px-10 md:py-16">
        <div className="md:col-span-4">
          <a href="#top" className="font-display text-2xl tracking-tight">
            <span>main</span>
            <span className="italic">character</span>
          </a>
          <p className="mt-4 max-w-xs text-sm leading-6 text-mute">
            Product and service studio for AI-first experiences that know how to
            hold attention.
          </p>
          <a
            href="mailto:hello@maincharacter.one"
            className="mt-6 inline-block font-mono text-[11px] uppercase tracking-[0.2em] hover:opacity-60"
          >
            hello@maincharacter.one
          </a>
        </div>

        <div className="md:col-span-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
            Navigate
          </p>
          <ul className="mt-4 space-y-2 font-mono text-[11px] uppercase tracking-[0.18em]">
            {FOOTER_NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="hover:opacity-60">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
            Products
          </p>
          <ul className="mt-4 space-y-2 font-mono text-[11px] uppercase tracking-[0.18em]">
            {FOOTER_PRODUCTS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:opacity-60"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4 md:text-right">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
            Legal
          </p>
          <ul className="mt-4 space-y-2 font-mono text-[11px] uppercase tracking-[0.18em] md:flex md:flex-col md:items-end">
            <li>
              <a href="/privacy" className="hover:opacity-60">
                Privacy
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:opacity-60">
                Terms
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-mute sm:flex-row sm:items-center sm:justify-between sm:px-6 md:px-10">
          <p>© 2026 Main Character LLP</p>
          <p className="font-mono uppercase tracking-[0.18em]">
            Built to lead
          </p>
        </div>
      </div>
    </footer>
  );
}
