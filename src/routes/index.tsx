import { createFileRoute, Link } from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { SiteHeader } from "@/components/SiteHeader";

// Dynamically import the Canvas so it doesn't cause SSR issues
const Canvas = lazy(() => import("@react-three/fiber").then((m) => ({ default: m.Canvas })));
const SpiralGallery = lazy(() => import("@/components/SpiralGallery").then((m) => ({ default: m.SpiralGallery })));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CODE 6 — Spiral Image Gallery" },
      {
        name: "description",
        content: "An atmospheric editorial-gallery website built around a 3D spiral image installation.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-[300vh] bg-[#050505] text-white selection:bg-white selection:text-black overflow-hidden relative">
      <SiteHeader />

      {/* 3D Canvas Background */}
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <Suspense fallback={null}>
          <Canvas camera={{ position: [0, 0, 8], fov: 40 }}>
            <fog attach="fog" args={['#050505', 5, 15]} />
            <ambientLight intensity={0.2} />
            <SpiralGallery />
          </Canvas>
        </Suspense>
      </div>

      {/* Editorial UI Overlay */}
      <div className="fixed inset-0 z-10 pointer-events-none flex flex-col justify-between p-6 md:p-12 mix-blend-difference">
        
        <header className="flex justify-between items-start pt-16">
          <div className="flex flex-col gap-1 text-[10px] uppercase tracking-[0.3em] font-mono text-white/50">
            <span>Registration: C-06</span>
            <span>Studio Dialect</span>
          </div>
          <div className="flex gap-8 text-[10px] uppercase tracking-[0.2em] font-mono">
            <Link to="/about" className="pointer-events-auto hover:text-white/70 transition-colors">Method</Link>
            <Link to="/mixer" className="pointer-events-auto hover:text-white/70 transition-colors">Archive</Link>
          </div>
        </header>

        <main className="max-w-4xl">
          <h1 className="font-display text-7xl md:text-[9rem] leading-[0.85] tracking-tight uppercase text-white drop-shadow-2xl">
            LAYER YOUR<br />
            <span className="text-white/40">PERFECT ATMOSPHERE</span>
          </h1>
          <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] max-w-sm text-white/60 leading-relaxed">
            Mix rain, fireplace, lofi beats, and dark fantasy boss music. Layer up to two ambient sounds to craft your own atmosphere.
          </p>
          
          <div className="mt-12 flex gap-4">
            <Link
              to="/login"
              className="pointer-events-auto inline-block border border-white/20 px-6 py-3 text-[10px] font-mono uppercase tracking-[0.3em] text-white transition-all hover:bg-white hover:text-black"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="pointer-events-auto inline-block border border-white/20 px-6 py-3 text-[10px] font-mono uppercase tracking-[0.3em] text-white transition-all hover:bg-white hover:text-black"
            >
              Sign Up
            </Link>
          </div>
        </main>

        <footer className="flex justify-between items-end pb-4 font-mono text-[9px] uppercase tracking-[0.4em] text-white/40">
          <span>01 / Scroll Field</span>
          <div className="flex gap-2">
            <span className="w-12 h-[1px] bg-white/20 mb-1" />
            <span>WebGL System Active</span>
          </div>
        </footer>
        
      </div>
      
      {/* Noise Texture Overlay */}
      <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
    </div>
  );
}
