import Header from "@/components/Header";
import AsciiWordmark from "@/components/AsciiWordmark";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative isolate min-h-dvh w-full overflow-hidden bg-[#050505] text-white"
      style={{
        backgroundImage:
          "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
        backgroundSize: "5px 5px",
      }}
    >
      <Header />

      <div className="absolute inset-0 flex items-center justify-center px-3 pt-16 pb-32 md:px-8 md:pt-28 md:pb-28">
        <div className="h-[36vh] w-full max-w-[1600px] md:h-[78vh]">
          <AsciiWordmark lines={["MAIN", "CHARACTER"]} cellMin={8} />
        </div>
      </div>

      <div className="absolute right-6 bottom-8 left-6 grid grid-cols-1 gap-4 md:right-10 md:bottom-10 md:left-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-4">
          <p className="font-mono text-[11px] leading-snug tracking-[0.18em] uppercase md:text-xs">
            Service &amp; Product
            <br />
            Studio.
          </p>
        </div>
        <div className="md:col-span-8 md:text-right">
          <p className="font-mono text-[11px] leading-snug tracking-[0.18em] uppercase md:text-xs">
            Main Character is a small studio designing services and shipping
            <br />
            products for founders, teams, and brands who refuse to play a
            supporting role.
          </p>
        </div>
      </div>
    </section>
  );
}
