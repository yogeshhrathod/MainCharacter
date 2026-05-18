import Image from "next/image";

const work = [
  {
    title: "AI Product Design",
    body: "We shape AI-first products that feel useful, legible, and confident from the first interaction.",
  },
  {
    title: "Service Systems",
    body: "We turn service-heavy businesses into cleaner journeys, clearer offers, and stronger digital touchpoints.",
  },
  {
    title: "Launch-Ready Interfaces",
    body: "From product structure to final UI, we build surfaces that feel polished, practical, and business-ready.",
  },
];

const services = [
  "AI product strategy",
  "AI UX / UI design",
  "Product and service design",
  "MVP design",
  "Design systems",
  "Product direction",
  "Launch websites",
  "Growth-ready interfaces",
];

const products = [
  {
    title: "Luna",
    href: "https://luna.wesparkvault.com/",
    image: "/products/luna-logo.png",
    body: "A product built with velocity, personality, and a distinctive visual signature. Fast, direct, and made to stand out.",
  },
  {
    title: "Scooty",
    href: "https://scooty.wesparkvault.com/",
    image: "/products/scooty-logo.png",
    body: "A brighter, more minimal product direction with motion, warmth, and clear intent. Different tone, same sharp execution.",
  },
];

export default function SiteSections() {
  return (
    <div className="bg-paper text-ink">
      <section
        id="work"
        className="scroll-mt-24 border-t border-line px-5 py-16 sm:px-6 sm:py-20 md:px-10 md:py-28"
      >
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
              Selected focus
            </p>
            <h2 className="mt-4 max-w-xs font-display text-3xl leading-[0.98] tracking-tight md:text-5xl">
              We build products and services that act like the main character.
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:col-span-8 md:grid-cols-3">
            {work.map((item) => (
              <article
                key={item.title}
                className="border border-line bg-white/70 p-5 transition-transform duration-300 hover:-translate-y-1"
              >
                <h3 className="font-display text-xl tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-mute">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="services"
        className="scroll-mt-24 border-t border-line px-5 py-16 sm:px-6 sm:py-20 md:px-10 md:py-28"
      >
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
              Services
            </p>
            <h2 className="mt-4 max-w-sm font-display text-3xl leading-[0.98] tracking-tight md:text-5xl">
              Strategy, AI design, and product execution in one place.
            </h2>
          </div>

          <div className="md:col-span-8">
            <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service}
                  className="bg-paper px-5 py-6 font-mono text-xs uppercase tracking-[0.2em]"
                >
                  {service}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="products"
        className="scroll-mt-24 border-t border-line px-5 py-16 sm:px-6 sm:py-20 md:px-10 md:py-28"
      >
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
              Products
            </p>
            <h2 className="mt-4 max-w-sm font-display text-3xl leading-[0.98] tracking-tight md:text-5xl">
              Real products. Real signals. Not placeholder case studies.
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:col-span-8">
            {products.map((item) => (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="group border border-line p-4 transition-transform duration-300 hover:-translate-y-1 sm:p-6"
              >
                <div className="relative overflow-hidden rounded-2xl border border-line/70 bg-[#f4efe8]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.75),rgba(240,230,220,0.35),transparent_72%)]" />
                  <div className="relative aspect-square">
                    <Image
                      src={item.image}
                      alt={`${item.title} logo`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 40vw"
                      unoptimized
                    />
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between gap-4">
                  <h3 className="font-display text-2xl tracking-tight">
                    {item.title}
                  </h3>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute transition group-hover:text-ink">
                    Open
                  </span>
                </div>
                <p className="mt-4 max-w-md text-sm leading-6 text-mute">
                  {item.body}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section
        id="about"
        className="scroll-mt-24 border-t border-line px-5 py-16 sm:px-6 sm:py-20 md:px-10 md:py-28"
      >
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
              About
            </p>
          </div>

          <div className="md:col-span-8">
            <p className="max-w-3xl font-display text-2xl leading-tight tracking-tight md:text-4xl">
              Main Character is a product and service company for businesses
              that want more than safe design. We build AI-aware products,
              memorable interfaces, and digital experiences with commercial
              clarity.
            </p>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-mute md:text-base">
              Our name is the brief. The brand, the product, and the customer
              experience should not feel like background noise. They should feel
              visible, confident, and built to lead.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-line px-5 py-16 sm:px-6 sm:py-20 md:px-10 md:py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
              Start a project
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-3xl leading-[0.98] tracking-tight md:text-5xl">
              If your business should feel more iconic, more useful, and more
              impossible to ignore, let&apos;s build it.
            </h2>
          </div>

          <a
            href="mailto:founder@maincharacter.one"
            className="inline-flex w-fit items-center justify-center border border-ink bg-ink px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-paper transition hover:bg-transparent hover:text-ink"
          >
            Start a project
          </a>
        </div>
      </section>
    </div>
  );
}
