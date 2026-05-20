import { useState, useEffect } from "react";

export function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play a gentle chime when timer finishes
      try {
        const audio = new Audio("https://archive.org/download/singing-bowl-sound/singing-bowl.mp3");
        audio.volume = 0.5;
        audio.play();
      } catch (e) {}
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggle = () => setIsActive(!isActive);
  const reset = () => {
    setIsActive(false);
    setTimeLeft(mode === "focus" ? 25 * 60 : 5 * 60);
  };
  const switchMode = (m: "focus" | "break") => {
    setMode(m);
    setIsActive(false);
    setTimeLeft(m === "focus" ? 25 * 60 : 5 * 60);
  };

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const secs = (timeLeft % 60).toString().padStart(2, "0");

  return (
    <div className="relative flex flex-col items-center justify-center p-8 md:p-12 border border-amber-900/30 rounded-3xl bg-black/60 backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* Decorative Middle Earth elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
      <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-transparent via-amber-900/20 to-transparent" />
      <div className="absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-transparent via-amber-900/20 to-transparent" />
      
      {/* Ornate corner accents */}
      <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-amber-700/50" />
      <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-amber-700/50" />
      <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-amber-700/50" />
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-amber-700/50" />

      <div className="flex gap-4 mb-8 relative z-10">
        <button 
          onClick={() => switchMode("focus")}
          className={`px-5 py-2 text-xs tracking-[0.2em] uppercase transition-all rounded-full font-serif ${mode === "focus" ? "bg-amber-950/80 text-amber-200 border border-amber-600/40 shadow-[0_0_15px_rgba(217,119,6,0.2)]" : "text-foreground/50 hover:text-amber-100 border border-transparent"}`}
        >
          Focus
        </button>
        <button 
          onClick={() => switchMode("break")}
          className={`px-5 py-2 text-xs tracking-[0.2em] uppercase transition-all rounded-full font-serif ${mode === "break" ? "bg-amber-950/80 text-amber-200 border border-amber-600/40 shadow-[0_0_15px_rgba(217,119,6,0.2)]" : "text-foreground/50 hover:text-amber-100 border border-transparent"}`}
        >
          Break
        </button>
      </div>

      <div className="text-7xl md:text-9xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-amber-50 via-amber-200 to-amber-700 tracking-tighter drop-shadow-2xl font-light mb-10 relative z-10" style={{ textShadow: "0 4px 24px rgba(217,119,6,0.3)" }}>
        {mins}:{secs}
      </div>

      <div className="flex gap-6 relative z-10">
        <button 
          onClick={toggle}
          className="px-10 py-3.5 rounded-full bg-amber-950/80 border border-amber-600/50 text-amber-100 font-serif uppercase tracking-widest text-sm hover:bg-amber-900 transition-all shadow-[0_0_20px_rgba(217,119,6,0.2)] hover:shadow-[0_0_30px_rgba(217,119,6,0.4)] hover:scale-105"
        >
          {isActive ? "Pause" : "Start"}
        </button>
        <button 
          onClick={reset}
          className="px-8 py-3.5 rounded-full bg-black/50 border border-foreground/10 text-foreground/50 font-serif uppercase tracking-widest text-sm hover:text-white hover:border-foreground/30 transition-all"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
