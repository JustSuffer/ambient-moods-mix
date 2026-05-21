import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SOUNDS, SECTIONS, MAX_ACTIVE } from "@/lib/sounds";

export const Route = createFileRoute("/mixer")({
  head: () => ({
    meta: [
      { title: "Mixer — YourAmbience" },
      { name: "description", content: "Layer up to two ambient sounds and craft your own atmosphere." },
    ],
  }),
  component: Mixer,
});

function Mixer() {
  const [active, setActive] = useState<string[]>([]);
  const [volumes, setVolumes] = useState<Record<string, number>>(
    () => Object.fromEntries(SOUNDS.map((s) => [s.id, 0.7]))
  );
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});

  useEffect(() => {
    SOUNDS.forEach((s) => {
      const el = audioRefs.current[s.id];
      if (!el) return;
      el.preload = "auto";
      try { el.load(); } catch {}
    });
  }, []);

  useEffect(() => {
    SOUNDS.forEach((s) => {
      const el = audioRefs.current[s.id];
      if (!el) return;
      el.volume = volumes[s.id] ?? 0.7;
      if (active.includes(s.id)) {
        if (el.paused) el.play().catch(() => {});
      } else if (!el.paused) {
        el.pause();
      }
    });
  }, [active, volumes]);

  const toggle = (id: string) => {
    const el = audioRefs.current[id];
    setActive((prev) => {
      if (prev.includes(id)) {
        if (el && !el.paused) el.pause();
        return prev.filter((x) => x !== id);
      }
      if (el) {
        el.volume = volumes[id] ?? 0.7;
        el.play().catch(() => {});
      }
      if (prev.length >= MAX_ACTIVE) {
        const dropped = prev[0];
        const droppedEl = audioRefs.current[dropped];
        if (droppedEl && !droppedEl.paused) droppedEl.pause();
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const stopAll = () => {
    SOUNDS.forEach((s) => {
      const el = audioRefs.current[s.id];
      if (el && !el.paused) el.pause();
    });
    setActive([]);
  };

  const activeSounds = useMemo(
    () => active.map((id) => SOUNDS.find((s) => s.id === id)!).filter(Boolean),
    [active]
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Background layers — only render active ones */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        {activeSounds.length === 0 && (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black" />
        )}
        {activeSounds.map((s, i) => {
          const clip =
            activeSounds.length === 1
              ? ""
              : i === 0
              ? "polygon(0 0, 55% 0, 45% 100%, 0 100%)"
              : "polygon(55% 0, 100% 0, 100% 100%, 45% 100%)";
          return (
            <div
              key={s.id}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1200ms] animate-pan-slow"
              style={{
                backgroundImage: `url(${s.bg})`,
                clipPath: clip || undefined,
              }}
            />
          );
        })}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)]" />
      </div>

      {SOUNDS.map((s) => (
        <audio
          key={s.id}
          ref={(el) => { audioRefs.current[s.id] = el; }}
          src={s.src}
          loop
          preload="auto"
          crossOrigin="anonymous"
        />
      ))}

      <SiteHeader />

      <main className="mx-auto flex max-w-7xl flex-col px-6 py-10 md:px-10 md:py-14">
        <header className="flex items-start justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-foreground/60">
              The mixer
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-[0.95] tracking-tight md:text-5xl">
              Many worlds. <em className="italic text-amber-200/90">Two at a time.</em>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-foreground/70 md:text-base">
              Pick from five sections. Layer any two sounds. Tune their volumes independently.
            </p>
          </div>
          <div className="hidden shrink-0 items-center gap-3 md:flex">
            <button
              onClick={stopAll}
              disabled={active.length === 0}
              className="rounded-full border border-foreground/20 bg-background/40 px-4 py-2 text-xs uppercase tracking-widest backdrop-blur transition hover:bg-background/60 disabled:opacity-30"
            >
              Mute all
            </button>
          </div>
        </header>

        {SECTIONS.map((section) => {
          const items = SOUNDS.filter((s) => s.section === section);
          return (
            <section key={section} className="mt-14">
              <div className="mb-5 flex items-baseline justify-between border-b border-foreground/10 pb-3">
                <h2 className="font-serif text-2xl text-foreground/90 md:text-3xl">{section}</h2>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40">
                  {items.length} sounds
                </span>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((s) => {
                  const isActive = active.includes(s.id);
                  const order = active.indexOf(s.id);
                  const globalIndex = SOUNDS.indexOf(s) + 1;
                  return (
                    <article
                      key={s.id}
                      className={[
                        "group relative overflow-hidden rounded-2xl border transition-all duration-500",
                        isActive
                          ? "border-amber-200/40 shadow-[0_0_60px_-20px_rgba(255,200,120,0.55)]"
                          : "border-foreground/10 hover:border-foreground/30",
                      ].join(" ")}
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[1200ms] group-hover:scale-105"
                        style={{ backgroundImage: `url(${s.bg})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
                      <div className={`absolute inset-0 bg-gradient-to-t ${s.accent} opacity-0 transition-opacity duration-700 ${isActive ? "opacity-100" : ""}`} />

                      <div className="relative flex min-h-[220px] flex-col justify-between p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/70">
                              {String(globalIndex).padStart(2, "0")} · {s.tag}
                            </p>
                            <h3 className="mt-2 font-serif text-xl text-white md:text-2xl">{s.title}</h3>
                            <p className="mt-1 text-xs text-white/70">{s.subtitle}</p>
                          </div>
                          {isActive && (
                            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-white backdrop-blur">
                              <span className="relative flex h-1.5 w-1.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-200 opacity-75" />
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-200" />
                              </span>
                              live · {order + 1}
                            </span>
                          )}
                        </div>

                        <div className="mt-4 space-y-3">
                          <div className={`flex items-center gap-3 transition-opacity ${isActive ? "opacity-100" : "pointer-events-none opacity-0"}`}>
                            <span className="font-mono text-[10px] uppercase tracking-widest text-white/60">vol</span>
                            <input
                              type="range" min={0} max={1} step={0.01}
                              value={volumes[s.id] ?? 0.7}
                              onChange={(e) => setVolumes((v) => ({ ...v, [s.id]: parseFloat(e.target.value) }))}
                              className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/20 accent-amber-200"
                            />
                          </div>
                          <button
                            onClick={() => toggle(s.id)}
                            className={[
                              "w-full rounded-xl px-4 py-2.5 text-xs font-medium uppercase tracking-[0.2em] transition",
                              isActive ? "bg-white text-black hover:bg-white/90" : "bg-white/10 text-white backdrop-blur hover:bg-white/20",
                            ].join(" ")}
                          >
                            {isActive ? "Stop" : "Play"}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}

        <footer className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-foreground/10 pt-6 font-mono text-[11px] uppercase tracking-[0.3em] text-foreground/50">
          <span>{active.length}/{MAX_ACTIVE} sounds playing</span>
          <span>{SOUNDS.length} ambiences · 5 sections</span>
        </footer>
      </main>
    </div>
  );
}
