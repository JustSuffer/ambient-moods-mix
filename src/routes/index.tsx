import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import bgDarkSouls from "@/assets/bg-darksouls.png";
import bgLofi from "@/assets/bg-lofi.png";
import bgFire from "@/assets/bg-fire.png";
import bgRain from "@/assets/bg-rain.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "YourAmbience — Mix & Listen" },
      {
        name: "description",
        content:
          "Mix rain, fireplace crackle, lofi beats, and dark fantasy boss themes. Layer up to two ambient sounds and craft your own atmosphere.",
      },
    ],
  }),
  component: Index,
});

type SoundId = "darksouls" | "lofi" | "fire" | "rain";

interface SoundDef {
  id: SoundId;
  title: string;
  subtitle: string;
  tag: string;
  bg: string;
  src: string;
  accent: string;
}

const SOUNDS: SoundDef[] = [
  {
    id: "darksouls",
    title: "Middle Earth",
    subtitle: "Boss fight · grand orchestral dread",
    tag: "dark fantasy",
    bg: bgDarkSouls,
    src: "https://archive.org/download/great-grey-wolf-sif/Gwyn%2C%20Lord%20of%20Cinder.mp3",
    accent: "from-amber-300/60 to-amber-100/10",
  },
  {
    id: "lofi",
    title: "Sofi's Room",
    subtitle: "Lofi beats · late night study",
    tag: "lofi",
    bg: bgLofi,
    src: "https://archive.org/download/jamendo-429174/01-1817528-Alexey%20Anisimov-Lo-Fi%20Chill%20Hip-Hop%20_Instrumental_.mp3",
    accent: "from-rose-300/60 to-rose-100/10",
  },
  {
    id: "fire",
    title: "Fireplace",
    subtitle: "Crackling flames · warm embers",
    tag: "fire",
    bg: bgFire,
    src: "https://archive.org/download/crackling-fireplace_daniel-simion/crackling-fireplace_daniel-simion.mp3",
    accent: "from-orange-400/70 to-yellow-200/10",
  },
  {
    id: "rain",
    title: "Window Rain",
    subtitle: "Soft drops tapping the glass",
    tag: "rain",
    bg: bgRain,
    src: "https://archive.org/download/aporee_2104_35714/berlinBuerkner9HhofEisregen160223.mp3",
    accent: "from-sky-300/60 to-slate-100/10",
  },
];

const MAX_ACTIVE = 2;

function Index() {
  const [active, setActive] = useState<SoundId[]>([]);
  const [volumes, setVolumes] = useState<Record<SoundId, number>>({
    darksouls: 0.7,
    lofi: 0.7,
    fire: 0.7,
    rain: 0.7,
  });
  const audioRefs = useRef<Record<SoundId, HTMLAudioElement | null>>({
    darksouls: null,
    lofi: null,
    fire: null,
    rain: null,
  });

  // Preload all tracks aggressively so play() responds instantly.
  useEffect(() => {
    SOUNDS.forEach((s) => {
      const el = audioRefs.current[s.id];
      if (!el) return;
      el.preload = "auto";
      try {
        el.load();
      } catch {}
    });
  }, []);

  useEffect(() => {
    SOUNDS.forEach((s) => {
      const el = audioRefs.current[s.id];
      if (!el) return;
      el.volume = volumes[s.id];
      if (active.includes(s.id)) {
        if (el.paused) el.play().catch(() => {});
      } else {
        if (!el.paused) el.pause();
      }
    });
  }, [active, volumes]);

  const toggle = (id: SoundId) => {
    // Kick the audio element synchronously inside the user-gesture handler
    // so playback starts immediately (no perceived 2s delay).
    const el = audioRefs.current[id];
    setActive((prev) => {
      if (prev.includes(id)) {
        if (el && !el.paused) el.pause();
        return prev.filter((x) => x !== id);
      }
      if (el) {
        el.volume = volumes[id];
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

  const bgLayers = useMemo(() => {
    if (active.length === 0) {
      return SOUNDS.map((s) => ({ src: s.bg, opacity: 0.18, clip: "" }));
    }
    return SOUNDS.map((s) => {
      const idx = active.indexOf(s.id);
      if (idx === -1) return { src: s.bg, opacity: 0, clip: "" };
      if (active.length === 1) return { src: s.bg, opacity: 1, clip: "" };
      const clip =
        idx === 0
          ? "polygon(0 0, 55% 0, 45% 100%, 0 100%)"
          : "polygon(55% 0, 100% 0, 100% 100%, 45% 100%)";
      return { src: s.bg, opacity: 1, clip };
    });
  }, [active]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Background layers */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        {SOUNDS.map((s, i) => {
          const layer = bgLayers[i];
          return (
            <div
              key={s.id}
              className="absolute inset-0 bg-cover bg-center transition-all duration-[1400ms] ease-out"
              style={{
                backgroundImage: `url(${layer.src})`,
                opacity: layer.opacity,
                clipPath: layer.clip || undefined,
              }}
            />
          );
        })}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.65)_100%)]" />
      </div>

      {/* Hidden audio — preload auto so play() is instant */}
      {SOUNDS.map((s) => (
        <audio
          key={s.id}
          ref={(el) => {
            audioRefs.current[s.id] = el;
          }}
          src={s.src}
          loop
          preload="auto"
          crossOrigin="anonymous"
        />
      ))}

      <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10 md:px-10 md:py-14">
        <header className="flex items-start justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-foreground/60">
              YourAmbience · v1
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-[0.95] tracking-tight md:text-6xl">
              Mix your own <em className="italic text-amber-200/90">atmosphere</em>.
            </h1>
            <p className="mt-4 max-w-xl text-sm text-foreground/70 md:text-base">
              Four worlds. Up to two sounds at once. Pick a card, then layer a
              second one — the background and mood shift with them.
            </p>
          </div>
          <button
            onClick={stopAll}
            disabled={active.length === 0}
            className="hidden shrink-0 rounded-full border border-foreground/20 bg-background/40 px-4 py-2 text-xs uppercase tracking-widest backdrop-blur transition hover:bg-background/60 disabled:opacity-30 md:block"
          >
            Mute all
          </button>
        </header>

        <section className="mt-12 grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">
          {SOUNDS.map((s) => {
            const isActive = active.includes(s.id);
            const order = active.indexOf(s.id);
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${s.accent} opacity-0 transition-opacity duration-700 ${
                    isActive ? "opacity-100" : ""
                  }`}
                />

                <div className="relative flex min-h-[220px] flex-col justify-between p-5 md:min-h-[260px] md:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/70">
                        {String(SOUNDS.indexOf(s) + 1).padStart(2, "0")} · {s.tag}
                      </p>
                      <h2 className="mt-2 font-serif text-2xl text-white md:text-3xl">
                        {s.title}
                      </h2>
                      <p className="mt-1 text-xs text-white/70 md:text-sm">{s.subtitle}</p>
                    </div>
                    {isActive && (
                      <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-white backdrop-blur">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-200 opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-200" />
                        </span>
                        live · {order + 1}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div
                      className={`flex items-center gap-3 transition-opacity ${
                        isActive ? "opacity-100" : "pointer-events-none opacity-0"
                      }`}
                    >
                      <span className="font-mono text-[10px] uppercase tracking-widest text-white/60">
                        vol
                      </span>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={volumes[s.id]}
                        onChange={(e) =>
                          setVolumes((v) => ({ ...v, [s.id]: parseFloat(e.target.value) }))
                        }
                        className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/20 accent-amber-200"
                      />
                    </div>
                    <button
                      onClick={() => toggle(s.id)}
                      className={[
                        "w-full rounded-xl px-4 py-3 text-sm font-medium uppercase tracking-[0.2em] transition",
                        isActive
                          ? "bg-white text-black hover:bg-white/90"
                          : "bg-white/10 text-white backdrop-blur hover:bg-white/20",
                      ].join(" ")}
                    >
                      {isActive ? "Stop" : "Play"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-foreground/50">
          <span>
            {active.length}/{MAX_ACTIVE} sounds playing
          </span>
          <span>pick a second card to layer</span>
        </footer>
      </main>
    </div>
  );
}
