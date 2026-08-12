import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import SiteFooter from "@/components/SiteFooter";

const work = [
  {
    title: "Luna",
    role: "AI product · brand · launch UI",
    problem:
      "Needed a fast, opinionated AI product surface that felt distinct on first contact—not another generic dashboard.",
    outcome:
      "Shipped a live product with a sharp visual signature, clear interaction model, and velocity-first packaging.",
    href: "https://luna.wesparkvault.com/",
    linkLabel: "View Luna",
  },
  {
    title: "Scooty",
    role: "Product direction · motion · interface",
    problem:
      "Required a warmer, more minimal product direction that still felt intentional and commercially ready.",
    outcome:
      "Launched a brighter product system with motion, clarity, and a tone that stands apart from Luna while sharing the same execution bar.",
    href: "https://scooty.wesparkvault.com/",
    linkLabel: "View Scooty",
  },
  {
    title: "Service systems",
    role: "Studio focus · journeys · offers",
    problem:
      "Service-heavy businesses often bury the offer under process noise, weak digital touchpoints, and safe design.",
    outcome:
      "We restructure journeys, sharpen the offer, and build digital surfaces that make the business feel lead—not background.",
    href: "#contact",
    linkLabel: "Start a project",
  },
];

const process = [
  {
    step: "01",
    title: "Discover",
    body: "Clarify audience, offer, constraints, and what “main character” means for the business.",
  },
  {
    step: "02",
    title: "Shape",
    body: "Structure the product or service system, AI UX, and interface language before pixels get precious.",
  },
  {
    step: "03",
    title: "Ship",
    body: "Build launch-ready surfaces, tighten the story, and leave you with something that holds attention in market.",
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
    body: "Velocity, personality, and a distinctive visual signature. Fast, direct, and made to stand out.",
    note: "Live product",
  },
  {
    title: "Scooty",
    href: "https://scooty.wesparkvault.com/",
    image: "/products/scooty-logo.png",
    body: "Brighter, minimal direction with motion, warmth, and clear intent. Different tone, same sharp execution.",
    note: "Live product",
  },
];

export default function SiteSections() {
  return (
    <div className="bg-paper text-ink">
      <div
        aria-hidden="true"
        className="h-24 sm:hidden"
        style={{
          background:
            "linear-gradient(to bottom, var(--hero-bg) 0%, color-mix(in srgb, var(--hero-bg) 35%, var(--color-paper)) 42%, var(--color-paper) 100%)",
        }}
      />

      <section
        id="work"
        className="scroll-mt-24 px-5 pt-10 pb-16 sm:px-6 sm:pt-[5.5rem] sm:pb-20 md:px-10 md:pt-[7.5rem] md:pb-28"
      >
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
              Work
            </p>
            <h2 className="mt-4 max-w-xs font-display text-3xl leading-[0.98] tracking-tight md:text-5xl">
              Shipped products and systems built to lead.
            </h2>
          </div>

          <div className="grid gap-3 md:col-span-8">
            {work.map((item) => (
              <article
                key={item.title}
                className="border border-line bg-surface p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="font-display text-2xl tracking-tight">
                    {item.title}
                  </h3>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mute">
                    {item.role}
                  </p>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
                      Problem
                    </p>
                    <p className="mt-2 text-sm leading-6 text-mute">
                      {item.problem}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
                      Outcome
                    </p>
                    <p className="mt-2 text-sm leading-6 text-mute">
                      {item.outcome}
                    </p>
                  </div>
                </div>
                <a
                  href={item.href}
                  {...(item.href.startsWith("http")
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                  className="mt-5 inline-flex font-mono text-[11px] uppercase tracking-[0.2em] underline-offset-4 hover:underline"
                >
                  {item.linkLabel}
                </a>
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
            <div className="grid gap-3 sm:grid-cols-3">
              {process.map((item) => (
                <div key={item.step} className="border border-line bg-surface p-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
                    {item.step}
                  </p>
                  <h3 className="mt-3 font-display text-xl tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-mute">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <div
                  key={service}
                  className="bg-paper px-5 py-5 font-mono text-[11px] uppercase tracking-[0.18em]"
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
              Real products. Live signals.
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:col-span-8">
            {products.map((item) => (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="group border border-line bg-surface p-4 transition-transform duration-300 hover:-translate-y-1 sm:p-6"
              >
                <div className="relative overflow-hidden border border-line/70 bg-product">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.28),rgba(240,230,220,0.18),transparent_72%)]" />
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
                    {item.note}
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

      <section
        id="contact"
        className="scroll-mt-24 border-t border-line px-5 py-16 sm:px-6 sm:py-20 md:px-10 md:py-28"
      >
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
              Start a project
            </p>
            <h2 className="mt-4 max-w-xl font-display text-3xl leading-[0.98] tracking-tight md:text-5xl">
              If your business should feel more iconic, more useful, and more
              impossible to ignore, let&apos;s build it.
            </h2>
            <p className="mt-6 max-w-md text-sm leading-6 text-mute">
              Tell us what you&apos;re building. The form opens your email app
              with a ready message—no accounts, no third-party widgets.
            </p>
          </div>
          <div className="md:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
