import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/pricing")({
  component: Pricing,
});

function Pricing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(217,119,6,0.15) 0%, rgba(0,0,0,0) 70%)' }} />
      
      <SiteHeader />
      
      <main className="mx-auto max-w-5xl px-6 py-20 md:py-28 relative z-10">
        <header className="text-center mb-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-amber-500/80 mb-4">Upgrade Your Experience</p>
          <h1 className="font-serif text-5xl md:text-7xl leading-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-50 via-amber-200 to-amber-700 tracking-tighter drop-shadow-2xl font-light mb-6">
            Deeper <em className="italic text-amber-300/90 font-serif">Immersion</em>
          </h1>
          <p className="text-foreground/60 max-w-xl mx-auto text-lg leading-relaxed">
            Unlock the full potential of your focus environment with our premium tier. Layer more sounds and access exclusive ambiences.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Basic Tier */}
          <div className="rounded-3xl border border-foreground/10 bg-black/40 backdrop-blur-xl p-10 flex flex-col transition-transform hover:-translate-y-1 duration-500">
            <div className="mb-8">
              <h2 className="text-2xl font-serif text-foreground/90 mb-2">Wanderer</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-light tracking-tight text-foreground/80">Free</span>
                <span className="text-sm text-foreground/50">forever</span>
              </div>
            </div>
            
            <ul className="space-y-4 mb-10 flex-grow text-foreground/70 text-sm">
              <li className="flex items-center gap-3">
                <span className="text-amber-500/50">❖</span>
                Play up to 2 sounds simultaneously
              </li>
              <li className="flex items-center gap-3">
                <span className="text-amber-500/50">❖</span>
                Access to basic ambient libraries
              </li>
              <li className="flex items-center gap-3">
                <span className="text-amber-500/50">❖</span>
                Standard Pomodoro timer
              </li>
              <li className="flex items-center gap-3 opacity-40">
                <span className="text-foreground/30">❖</span>
                <span className="line-through decoration-foreground/30">Exclusive Middle Earth soundscapes</span>
              </li>
            </ul>

            <button disabled className="w-full rounded-full border border-foreground/20 bg-foreground/5 py-4 text-xs font-serif uppercase tracking-[0.2em] text-foreground/50 cursor-not-allowed">
              Current Plan
            </button>
          </div>

          {/* Premium Tier */}
          <div className="rounded-3xl border border-amber-500/30 bg-amber-950/20 backdrop-blur-xl p-10 flex flex-col relative shadow-[0_0_50px_rgba(217,119,6,0.1)] transition-transform hover:-translate-y-2 duration-500">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-amber-500/20 border-b border-l border-amber-500/30 rounded-bl-2xl rounded-tr-3xl text-[10px] uppercase tracking-widest text-amber-200 font-mono">
              Most Popular
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-serif text-amber-200 mb-2">Archmage</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-light tracking-tight text-amber-50">$4.99</span>
                <span className="text-sm text-amber-200/50">/month</span>
              </div>
            </div>
            
            <ul className="space-y-4 mb-10 flex-grow text-amber-100/80 text-sm">
              <li className="flex items-center gap-3 text-amber-100 font-medium">
                <span className="text-amber-400">❖</span>
                Play up to 4 sounds simultaneously
              </li>
              <li className="flex items-center gap-3">
                <span className="text-amber-400">❖</span>
                Access to premium fantasy libraries
              </li>
              <li className="flex items-center gap-3">
                <span className="text-amber-400">❖</span>
                Customizable Pomodoro timer themes
              </li>
              <li className="flex items-center gap-3">
                <span className="text-amber-400">❖</span>
                Save unlimited sound mixes
              </li>
            </ul>

            <Link 
              to="/settings" 
              className="w-full text-center rounded-full bg-amber-600/20 border border-amber-500/50 py-4 text-xs font-serif uppercase tracking-[0.2em] text-amber-200 hover:bg-amber-600/40 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(217,119,6,0.2)]"
            >
              Upgrade Now
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
