import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — YourAmbience" },
      { name: "description", content: "What YourAmbience is and how the mixer works." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-foreground/60">About</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">
          Many worlds. <em className="italic text-amber-200/90">Two at a time.</em>
        </h1>
        <div className="mt-8 space-y-5 text-foreground/80 leading-relaxed">
          <p>
            YourAmbience is a curated ambient mixer. It exists because finding the
            right background for writing, reading, or simply zoning out shouldn't
            require ten browser tabs.
          </p>
          <p>
            Explore five distinct sonic environments: immerse yourself in natural soundscapes,
            feel the rhythm of urban life, study to late-night lofi, escape into fantasy,
            or focus deeply with pure healing frequencies.
          </p>
          <p>
            Layer up to two ambiences and tune their volumes independently to craft your perfect atmosphere.
            Create an account to save your preferences across visits.
          </p>
        </div>
        <div className="mt-10">
          <Link
            to="/mixer"
            className="rounded-full bg-white px-6 py-3 text-sm font-medium uppercase tracking-[0.2em] text-black hover:bg-white/90"
          >
            Open the mixer
          </Link>
        </div>
      </main>
    </div>
  );
}
