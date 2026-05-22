import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { SiteHeader } from "@/components/SiteHeader";
import { SOUNDS, SECTIONS } from "@/lib/sounds";
import { awardCoins } from "@/lib/coins.functions";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/pomodoro")({
  head: () => ({
    meta: [
      { title: "Pomodoro — YourAmbience" },
      { name: "description", content: "A Middle Earth themed Pomodoro timer that earns you ambience coins for every minute of focused work." },
    ],
  }),
  component: PomodoroPage,
});

type Phase = "idle" | "work" | "break" | "done";

interface Config {
  sets: number;
  workMin: number;
  breakMin: number;
  picked: string[]; // up to 2 sound ids
}

const DEFAULTS: Config = { sets: 4, workMin: 25, breakMin: 5, picked: ["darksouls"] };

function PomodoroPage() {
  const { user } = useAuth();
  const grantCoins = useServerFn(awardCoins);

  const [configured, setConfigured] = useState(false);
  const [cfg, setCfg] = useState<Config>(DEFAULTS);

  const [phase, setPhase] = useState<Phase>("idle");
  const [currentSet, setCurrentSet] = useState(1);
  const [remaining, setRemaining] = useState(0); // seconds
  const [running, setRunning] = useState(false);
  const [volumes, setVolumes] = useState<Record<string, number>>(() =>
    Object.fromEntries(SOUNDS.map((s) => [s.id, 0.55]))
  );

  // pending coins (minutes of work completed since last award)
  const pendingMinutesRef = useRef(0);
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});

  // tick
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [running]);

  // award coins every full minute of WORK
  const lastTickRef = useRef<number>(0);
  useEffect(() => {
    if (phase !== "work" || !running) return;
    const now = Math.floor(Date.now() / 1000);
    if (lastTickRef.current === 0) lastTickRef.current = now;
    // accumulate one coin per full minute elapsed since last save
    const interval = setInterval(async () => {
      pendingMinutesRef.current += 1;
      if (user && pendingMinutesRef.current >= 1) {
        const amount = pendingMinutesRef.current;
        pendingMinutesRef.current = 0;
        try { await grantCoins({ data: { amount } }); } catch {}
      }
    }, 60_000);
    return () => clearInterval(interval);
  }, [phase, running, user, grantCoins]);

  // phase transitions
  useEffect(() => {
    if (!running || remaining > 0) return;
    if (phase === "work") {
      // flush remaining pending coins for partial minute if any (none — minute granularity)
      if (currentSet >= cfg.sets) {
        setPhase("done");
        setRunning(false);
        return;
      }
      setPhase("break");
      setRemaining(cfg.breakMin * 60);
    } else if (phase === "break") {
      setCurrentSet((s) => s + 1);
      setPhase("work");
      setRemaining(cfg.workMin * 60);
    }
  }, [remaining, running, phase, cfg, currentSet]);

  // manage ambient audio playback
  useEffect(() => {
    SOUNDS.forEach((s) => {
      const el = audioRefs.current[s.id];
      if (!el) return;
      const wants = cfg.picked.includes(s.id) && (phase === "work" || phase === "break");
      el.volume = volumes[s.id] ?? 0.55;
      if (wants && el.paused) el.play().catch(() => {});
      if (!wants && !el.paused) el.pause();
    });
  }, [cfg.picked, phase, volumes]);

  const startSession = () => {
    setConfigured(true);
    setCurrentSet(1);
    setPhase("work");
    setRemaining(cfg.workMin * 60);
    setRunning(true);
  };

  const togglePause = () => setRunning((r) => !r);
  const reset = () => {
    setRunning(false);
    setPhase("idle");
    setConfigured(false);
    setCurrentSet(1);
    setRemaining(0);
    SOUNDS.forEach((s) => { const el = audioRefs.current[s.id]; if (el && !el.paused) el.pause(); });
  };

  const skipPhase = () => setRemaining(0);

  const picked = useMemo(
    () => cfg.picked.map((id) => SOUNDS.find((s) => s.id === id)!).filter(Boolean),
    [cfg.picked]
  );

  const togglePick = (id: string) => {
    setCfg((c) => {
      if (c.picked.includes(id)) return { ...c, picked: c.picked.filter((x) => x !== id) };
      if (c.picked.length >= 2) return { ...c, picked: [c.picked[1], id] };
      return { ...c, picked: [...c.picked, id] };
    });
  };

  const totalSeconds =
    phase === "work" ? cfg.workMin * 60 : phase === "break" ? cfg.breakMin * 60 : 1;
  const progress = 1 - remaining / totalSeconds;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Slow-moving split backgrounds for picked sounds */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        {picked.length === 0 && (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black" />
        )}
        {picked.map((s, i) => {
          const clip =
            picked.length === 1
              ? ""
              : i === 0
              ? "polygon(0 0, 55% 0, 45% 100%, 0 100%)"
              : "polygon(55% 0, 100% 0, 100% 100%, 45% 100%)";
          return (
            <div
              key={s.id}
              className={`absolute inset-[-6%] bg-cover bg-center ${i === 0 ? "animate-[panLeft_60s_ease-in-out_infinite_alternate]" : "animate-[panRight_60s_ease-in-out_infinite_alternate]"}`}
              style={{ backgroundImage: `url(${(s as any).bg})`, clipPath: clip || undefined }}
            />
          );
        })}
        {picked.length > 0 && (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/20 to-black/55" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(0,0,0,0.55)_100%)]" />
          </>
        )}
      </div>

      {/* invisible audio */}
      {SOUNDS.map((s) => (
        <audio key={s.id} ref={(el) => { audioRefs.current[s.id] = el; }} src={s.src} loop preload="auto" crossOrigin="anonymous" />
      ))}

      <style>{`
        @keyframes panLeft { 0% { transform: translateX(0) scale(1.05);} 100% { transform: translateX(-3%) scale(1.08);} }
        @keyframes panRight { 0% { transform: translateX(0) scale(1.05);} 100% { transform: translateX(3%) scale(1.08);} }
      `}</style>

      <SiteHeader />

      <main className="mx-auto flex max-w-5xl flex-col px-6 py-10 md:px-10 md:py-14">
        {!configured ? (
          <SetupCard cfg={cfg} setCfg={setCfg} onStart={startSession} togglePick={togglePick} signedIn={!!user} />
        ) : (
          <SessionView
            cfg={cfg}
            setCfg={setCfg}
            phase={phase}
            currentSet={currentSet}
            remaining={remaining}
            running={running}
            progress={progress}
            togglePause={togglePause}
            skipPhase={skipPhase}
            reset={reset}
            togglePick={togglePick}
            signedIn={!!user}
            picked={picked}
            volumes={volumes}
            setVolumes={setVolumes}
          />
        )}
      </main>
    </div>
  );
}

function SetupCard({
  cfg, setCfg, onStart, togglePick, signedIn,
}: {
  cfg: Config; setCfg: (u: (c: Config) => Config) => void;
  onStart: () => void; togglePick: (id: string) => void; signedIn: boolean;
}) {
  return (
    <div className="mx-auto w-full max-w-2xl rounded-3xl border border-amber-200/20 bg-black/40 p-8 backdrop-blur-md md:p-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-amber-200/80">Begin the rite</p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight">Forge your <em className="italic text-amber-200/90">Pomodoro</em></h1>
      <p className="mt-2 text-sm text-foreground/70">
        Answer three questions. The bells will ring across Middle Earth as you focus.
      </p>

      {!signedIn && (
        <div className="mt-5 rounded-xl border border-amber-200/30 bg-amber-200/5 px-4 py-3 text-xs text-amber-100/90">
          You are not signed in — <Link to="/signup" className="underline">create an account</Link> to earn ambience coins and join the leaderboard.
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        <Field label="Sets" value={cfg.sets} min={1} max={12} onChange={(v) => setCfg((c) => ({ ...c, sets: v }))} suffix="rounds" />
        <Field label="Work" value={cfg.workMin} min={5} max={120} onChange={(v) => setCfg((c) => ({ ...c, workMin: v }))} suffix="min" />
        <Field label="Break" value={cfg.breakMin} min={1} max={60} onChange={(v) => setCfg((c) => ({ ...c, breakMin: v }))} suffix="min" />
      </div>

      <div className="mt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/60">Choose 1 or 2 ambiences</p>
        <SoundPicker picked={cfg.picked} togglePick={togglePick} />
      </div>

      <button
        onClick={onStart}
        disabled={cfg.picked.length === 0}
        className="mt-8 w-full rounded-xl bg-amber-200 px-6 py-3 font-mono text-xs uppercase tracking-[0.3em] text-black transition hover:bg-amber-100 disabled:opacity-40"
      >
        Begin · {cfg.sets} × {cfg.workMin}m work / {cfg.breakMin}m rest
      </button>
    </div>
  );
}

function Field({ label, value, min, max, onChange, suffix }: {
  label: string; value: number; min: number; max: number; suffix: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block rounded-xl border border-foreground/15 bg-background/30 p-4">
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/60">{label}</span>
      <div className="mt-2 flex items-center gap-3">
        <button onClick={() => onChange(Math.max(min, value - 1))} className="h-8 w-8 rounded-full border border-foreground/20 hover:border-amber-200/60">−</button>
        <input
          type="number"
          value={value}
          min={min} max={max}
          onChange={(e) => onChange(Math.max(min, Math.min(max, parseInt(e.target.value || "0", 10))))}
          className="w-full bg-transparent text-center font-serif text-3xl outline-none"
        />
        <button onClick={() => onChange(Math.min(max, value + 1))} className="h-8 w-8 rounded-full border border-foreground/20 hover:border-amber-200/60">+</button>
      </div>
      <span className="mt-1 block text-center font-mono text-[10px] uppercase tracking-widest text-foreground/40">{suffix}</span>
    </label>
  );
}

function SoundPicker({ picked, togglePick }: { picked: string[]; togglePick: (id: string) => void }) {
  return (
    <div className="mt-3 max-h-72 overflow-y-auto rounded-xl border border-foreground/10 bg-background/30 p-3">
      {SECTIONS.map((sec) => (
        <div key={sec} className="mb-3 last:mb-0">
          <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/40">{sec}</p>
          <div className="flex flex-wrap gap-2">
            {SOUNDS.filter((s) => s.section === sec).map((s) => {
              const on = picked.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => togglePick(s.id)}
                  className={[
                    "rounded-full border px-3 py-1.5 text-xs transition",
                    on
                      ? "border-amber-200/60 bg-amber-200/15 text-amber-100"
                      : "border-foreground/15 text-foreground/70 hover:border-foreground/40",
                  ].join(" ")}
                >
                  {s.title}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function pad(n: number) { return String(n).padStart(2, "0"); }
function fmt(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${pad(m)}:${pad(s)}`;
}

function SessionView({
  cfg, setCfg, phase, currentSet, remaining, running, progress,
  togglePause, skipPhase, reset, togglePick, signedIn, picked, volumes, setVolumes,
}: {
  cfg: Config;
  setCfg: (u: (c: Config) => Config) => void;
  phase: Phase; currentSet: number; remaining: number; running: boolean; progress: number;
  togglePause: () => void; skipPhase: () => void; reset: () => void;
  togglePick: (id: string) => void; signedIn: boolean;
  picked: { id: string; title: string; bg: string }[];
  volumes: Record<string, number>;
  setVolumes: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}) {
  const [edit, setEdit] = useState(false);
  const isWork = phase === "work";
  const phaseLabel = phase === "work" ? "Focus" : phase === "break" ? "Rest" : phase === "done" ? "Complete" : "Idle";

  // SVG ring
  const R = 140;
  const C = 2 * Math.PI * R;
  const dash = C * (1 - Math.min(1, Math.max(0, progress)));

  return (
    <div className="flex flex-col items-center text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-amber-200/80">
        Set {currentSet} / {cfg.sets} · {phaseLabel}
      </p>

      {/* Middle-Earth themed ring clock */}
      <div className="relative mt-8">
        <svg width="340" height="340" viewBox="0 0 340 340" className="drop-shadow-[0_0_60px_rgba(255,200,120,0.25)]">
          <defs>
            <radialGradient id="innerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,200,120,0.25)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
            <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={isWork ? "#fcd34d" : "#86efac"} />
              <stop offset="100%" stopColor={isWork ? "#b45309" : "#0f766e"} />
            </linearGradient>
          </defs>
          <circle cx="170" cy="170" r={R} fill="url(#innerGlow)" />
          {/* outer rune ring */}
          <circle cx="170" cy="170" r={R + 12} fill="none" stroke="rgba(255,220,160,0.25)" strokeWidth="1" strokeDasharray="3 9" />
          <circle cx="170" cy="170" r={R + 20} fill="none" stroke="rgba(255,220,160,0.12)" strokeWidth="1" />
          {/* base track */}
          <circle cx="170" cy="170" r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
          {/* progress */}
          <circle
            cx="170" cy="170" r={R}
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={dash}
            transform="rotate(-90 170 170)"
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
          {/* center text */}
          <text x="170" y="178" textAnchor="middle" className="fill-amber-100" style={{ fontFamily: "serif", fontSize: 64, fontWeight: 300, letterSpacing: 2 }}>
            {fmt(remaining)}
          </text>
          <text x="170" y="220" textAnchor="middle" className="fill-amber-200/70" style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 6, textTransform: "uppercase" }}>
            {phaseLabel}
          </text>
        </svg>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {phase !== "done" ? (
          <>
            <button onClick={togglePause} className="rounded-full bg-amber-200 px-6 py-2.5 font-mono text-xs uppercase tracking-[0.3em] text-black hover:bg-amber-100">
              {running ? "Pause" : "Resume"}
            </button>
            <button onClick={skipPhase} className="rounded-full border border-foreground/20 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.3em] hover:border-amber-200/60">
              Skip phase
            </button>
            <button onClick={() => setEdit((e) => !e)} className="rounded-full border border-foreground/20 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.3em] hover:border-amber-200/60">
              {edit ? "Close" : "Edit"}
            </button>
            <button onClick={reset} className="rounded-full border border-red-300/30 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.3em] text-red-200 hover:border-red-300/60">
              End
            </button>
          </>
        ) : (
          <>
            <p className="w-full font-serif text-2xl text-amber-100">The rite is complete.</p>
            <button onClick={reset} className="rounded-full bg-amber-200 px-6 py-2.5 font-mono text-xs uppercase tracking-[0.3em] text-black hover:bg-amber-100">
              New session
            </button>
            <Link to="/leaderboard" className="rounded-full border border-foreground/20 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.3em] hover:border-amber-200/60">
              View leaderboard
            </Link>
          </>
        )}
      </div>

      {picked.length > 0 && phase !== "done" && (
        <div className="mt-8 w-full max-w-xl rounded-2xl border border-amber-200/15 bg-black/40 px-5 py-4 backdrop-blur">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-amber-200/70">Ambience volume</p>
          <div className="space-y-3">
            {picked.map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <span className="w-32 shrink-0 truncate text-left font-serif text-sm text-amber-100/90">{s.title}</span>
                <input
                  type="range" min={0} max={1} step={0.01}
                  value={volumes[s.id] ?? 0.55}
                  onChange={(e) => setVolumes((v) => ({ ...v, [s.id]: parseFloat(e.target.value) }))}
                  className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/15 accent-amber-200"
                />
                <span className="w-10 text-right font-mono text-[10px] text-foreground/60">
                  {Math.round((volumes[s.id] ?? 0.55) * 100)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!signedIn && phase !== "done" && (
        <p className="mt-5 max-w-md text-xs text-amber-100/70">
          Sign in to earn ambience coins for completed focus minutes. <Link to="/login" className="underline">Log in</Link>
        </p>
      )}

      {edit && phase !== "done" && (
        <div className="mt-8 w-full max-w-2xl rounded-2xl border border-foreground/15 bg-black/40 p-6 text-left backdrop-blur">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/60">Adjust mid-session</p>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field label="Sets" value={cfg.sets} min={Math.max(1, currentSet)} max={12} onChange={(v) => setCfg((c) => ({ ...c, sets: v }))} suffix="rounds" />
            <Field label="Work" value={cfg.workMin} min={5} max={120} onChange={(v) => setCfg((c) => ({ ...c, workMin: v }))} suffix="min" />
            <Field label="Break" value={cfg.breakMin} min={1} max={60} onChange={(v) => setCfg((c) => ({ ...c, breakMin: v }))} suffix="min" />
          </div>
          <div className="mt-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/60">Ambiences</p>
            <SoundPicker picked={cfg.picked} togglePick={togglePick} />
          </div>
        </div>
      )}
    </div>
  );
}
