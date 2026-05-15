import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import bgDarkSouls from "@/assets/bg-darksouls.png";
import bgLofi from "@/assets/bg-lofi.png";
import bgFire from "@/assets/bg-fire.png";
import bgRain from "@/assets/bg-rain.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "YourAmbience — Layer your perfect atmosphere" },
      {
        name: "description",
        content:
          "Mix rain, fireplace, lofi beats, and dark fantasy boss music. Layer up to two ambient sounds to craft your own atmosphere.",
      },
    ],
  }),
  component: Landing,
});

const tiles = [
  { bg: bgDarkSouls, title: "Middle Earth", tag: "dark fantasy" },
  { bg: bgLofi, title: "Sofi's Room", tag: "lofi" },
  { bg: bgFire, title: "Fireplace", tag: "fire" },
  { bg: bgRain, title: "Window Rain", tag: "rain" },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-6 pb-16 pt-20 md:pt-28">
        <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-foreground/60">
          YourAmbience · v1
        </p>
        <h1 className="mt-4 font-serif text-5xl leading-[0.95] tracking-tight md:text-7xl">
          Mix your own <em className="italic text-amber-200/90">atmosphere</em>.
        </h1>
        <p className="mt-6 max-w-xl text-base text-foreground/70 md:text-lg">
          Four distinct worlds — boss-fight orchestras, lofi beats, crackling
          fire, soft window rain. Layer up to two at once and let the mood take
          over.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/mixer"
            className="rounded-full bg-white px-6 py-3 text-sm font-medium uppercase tracking-[0.2em] text-black transition hover:bg-white/90"
          >
            Open the mixer
          </Link>
          <Link
            to="/signup"
            className="rounded-full border border-foreground/30 px-6 py-3 text-sm font-medium uppercase tracking-[0.2em] text-foreground transition hover:border-foreground/60"
          >
            Create account
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-6 pb-24 md:grid-cols-4 md:gap-4">
        {tiles.map((t) => (
          <div
            key={t.title}
            className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-foreground/10"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[1200ms] group-hover:scale-110"
              style={{ backgroundImage: `url(${t.bg})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/70">
                {t.tag}
              </p>
              <h3 className="mt-1 font-serif text-lg text-white md:text-xl">{t.title}</h3>
            </div>
          </div>
        ))}
      </section>

      <footer className="border-t border-foreground/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6 font-mono text-[11px] uppercase tracking-[0.3em] text-foreground/50">
          <span>© YourAmbience</span>
          <Link to="/about" className="hover:text-foreground">About</Link>
        </div>
      </footer>
    </div>
  );
}
