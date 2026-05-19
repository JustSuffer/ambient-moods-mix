import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import bgDarkSouls from "@/assets/bg-darksouls.png";
import bgLofi from "@/assets/bg-lofi.png";
import bgFire from "@/assets/bg-fire.png";
import bgRain from "@/assets/bg-rain.jpg";
import bgCoffee from "@/assets/bg-coffeeshop.jpg";
import bgLibrary from "@/assets/bg-library.jpg";
import bgTrain from "@/assets/bg-train.jpg";
import bgBrook from "@/assets/bg-brook.jpg";
import bgWoods from "@/assets/bg-woods.jpg";
import bgThunder from "@/assets/bg-thunder.jpg";
import bgSurf from "@/assets/bg-surf.jpg";
import bgClassical from "@/assets/bg-classical.jpg";
import bgStrings from "@/assets/bg-strings.jpg";
import bgChimes from "@/assets/bg-chimes.jpg";
import bgDojo from "@/assets/bg-dojo.jpg";
import bgElden from "@/assets/bg-elden.jpg";
import bgTavern from "@/assets/bg-tavern.jpg";
import bgKeyboard from "@/assets/bg-keyboard.jpg";
import bgServer from "@/assets/bg-server.jpg";
import bgWhiteNoise from "@/assets/bg-whitenoise.jpg";

export const Route = createFileRoute("/mixer")({
  head: () => ({
    meta: [
      { title: "Mixer — YourAmbience" },
      { name: "description", content: "Layer up to two ambient sounds and craft your own atmosphere." },
    ],
  }),
  component: Mixer,
});

interface SoundDef {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  bg: string;
  src: string;
  accent: string;
  section: string;
}

const mix = (id: number) => `https://assets.mixkit.co/active_storage/sfx/${id}/${id}-preview.mp3`;

const SOUNDS: SoundDef[] = [
  // ───────── Nature ─────────
  { id: "rain", title: "Window Rain", subtitle: "Soft drops tapping the glass",
    tag: "rain", section: "Nature", bg: bgRain, accent: "from-sky-300/60 to-slate-100/10",
    src: mix(1248) },
  { id: "fire", title: "Fireplace", subtitle: "Crackling flames · warm embers",
    tag: "fire", section: "Nature", bg: bgFire, accent: "from-orange-400/70 to-yellow-200/10",
    src: mix(1326) },
  { id: "brook", title: "Babbling Brook", subtitle: "Clear stream over mossy stones",
    tag: "water", section: "Nature", bg: bgBrook, accent: "from-emerald-300/60 to-cyan-100/10",
    src: mix(1180) },
  { id: "woods", title: "Morning Woods", subtitle: "Birdsong and rustling leaves",
    tag: "forest", section: "Nature", bg: bgWoods, accent: "from-lime-300/60 to-amber-100/10",
    src: mix(1210) },
  { id: "thunder", title: "Distant Thunderstorm", subtitle: "Rolling thunder beyond the plains",
    tag: "storm", section: "Nature", bg: bgThunder, accent: "from-indigo-400/60 to-slate-100/10",
    src: mix(1258) },
  { id: "surf", title: "Midnight Surf", subtitle: "Slow deep ocean waves",
    tag: "ocean", section: "Nature", bg: bgSurf, accent: "from-blue-400/60 to-indigo-200/10",
    src: mix(1172) },

  // ───────── Urban & Life ─────────
  { id: "coffee", title: "Bustling Coffee Shop", subtitle: "Espresso hisses and quiet chatter",
    tag: "café", section: "Urban & Life", bg: bgCoffee, accent: "from-amber-400/60 to-orange-100/10",
    src: mix(133) },
  { id: "library", title: "Old Library", subtitle: "Turning pages, silent halls",
    tag: "silence", section: "Urban & Life", bg: bgLibrary, accent: "from-stone-300/60 to-amber-100/10",
    src: mix(123) },
  { id: "train", title: "Night Train Journey", subtitle: "Rhythmic wheels on the rails",
    tag: "travel", section: "Urban & Life", bg: bgTrain, accent: "from-yellow-300/50 to-zinc-200/10",
    src: mix(1628) },
  { id: "keyboard", title: "Mechanical Keyboard", subtitle: "Tactile clack of focused typing",
    tag: "productivity", section: "Urban & Life", bg: bgKeyboard, accent: "from-rose-400/60 to-violet-200/10",
    src: mix(1386) },
  { id: "server", title: "Server Room Hum", subtitle: "Low hypnotic machine drone",
    tag: "drone", section: "Urban & Life", bg: bgServer, accent: "from-cyan-400/60 to-blue-200/10",
    src: mix(2636) },

  // ───────── Music ─────────
  { id: "lofi", title: "Sofi's Room", subtitle: "Lofi beats · late night study",
    tag: "lofi", section: "Music", bg: bgLofi, accent: "from-rose-300/60 to-rose-100/10",
    src: "https://archive.org/download/jamendo-429174/01-1817528-Alexey%20Anisimov-Lo-Fi%20Chill%20Hip-Hop%20_Instrumental_.mp3" },
  { id: "classical", title: "Classical Masterpieces", subtitle: "Mind-opening, mathematical pieces",
    tag: "classical", section: "Music", bg: bgClassical, accent: "from-amber-300/60 to-yellow-100/10",
    src: mix(1941) },
  { id: "strings", title: "Melancholic Strings", subtitle: "Solo piano and violin reflections",
    tag: "strings", section: "Music", bg: bgStrings, accent: "from-violet-300/60 to-rose-100/10",
    src: "https://archive.org/download/MoonlightSonata_755/Beethoven-MoonlightSonata.mp3" },
  { id: "chimes", title: "Wind Chimes", subtitle: "Random meditative wooden tones",
    tag: "meditation", section: "Music", bg: bgChimes, accent: "from-pink-300/60 to-amber-100/10",
    src: mix(1046) },

  // ───────── Fantasy & Focus ─────────
  { id: "darksouls", title: "Middle Earth", subtitle: "Boss fight · grand orchestral dread",
    tag: "dark fantasy", section: "Fantasy & Focus", bg: bgDarkSouls, accent: "from-amber-300/60 to-amber-100/10",
    src: "https://archive.org/download/great-grey-wolf-sif/Gwyn%2C%20Lord%20of%20Cinder.mp3" },
  { id: "elden", title: "Elden's Echo", subtitle: "Ancient ruined world · golden silence",
    tag: "epic", section: "Fantasy & Focus", bg: bgElden, accent: "from-yellow-400/60 to-amber-100/10",
    src: mix(2279) },
  { id: "tavern", title: "Tavern of Acoria", subtitle: "Dim inn · fire, mugs, distant lute",
    tag: "tavern", section: "Fantasy & Focus", bg: bgTavern, accent: "from-orange-400/60 to-yellow-100/10",
    src: mix(1958) },
  { id: "dojo", title: "Zen Dojo", subtitle: "Bamboo whisper · disciplined calm",
    tag: "zen", section: "Fantasy & Focus", bg: bgDojo, accent: "from-emerald-300/60 to-stone-200/10",
    src: mix(1153) },

  // ───────── Pure Frequency ─────────
  { id: "whitenoise", title: "Deep White Noise", subtitle: "Pure acoustic frequency mask",
    tag: "white noise", section: "Pure Frequency", bg: bgWhiteNoise, accent: "from-zinc-300/60 to-zinc-100/10",
    src: mix(1041) },
];

const SECTIONS = ["Nature", "Urban & Life", "Music", "Fantasy & Focus", "Pure Frequency"] as const;
const MAX_ACTIVE = 2;

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
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1200ms]"
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
              Twenty worlds. <em className="italic text-amber-200/90">Two at a time.</em>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-foreground/70 md:text-base">
              Pick from five sections. Layer any two sounds. Tune their volumes independently.
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
