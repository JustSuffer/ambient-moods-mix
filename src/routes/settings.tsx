import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState, FormEvent } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { useAuth } from "@/hooks/useAuth";
import { getMyProfile, updateProfile } from "@/lib/coins.functions";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — YourAmbience" },
      { name: "description", content: "Manage your profile and display name." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const fetchProfile = useServerFn(getMyProfile);
  const saveProfile = useServerFn(updateProfile);

  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "error" | "success" } | null>(null);

  // Local Storage Settings
  const [masterVolume, setMasterVolume] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem("masterVolume") === "true";
    return false;
  });
  const [autoplay, setAutoplay] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem("autoplay") === "true";
    return false;
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/login", replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile({})
        .then((r) => {
          setDisplayName(r.profile.display_name || "");
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [user, fetchProfile]);

  const toggleMasterVolume = () => {
    const next = !masterVolume;
    setMasterVolume(next);
    localStorage.setItem("masterVolume", next.toString());
  };

  const toggleAutoplay = () => {
    const next = !autoplay;
    setAutoplay(next);
    localStorage.setItem("autoplay", next.toString());
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setMsg({ text: "Display name cannot be empty.", type: "error" });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      await saveProfile({ data: { display_name: displayName } });
      setMsg({ text: "Profile updated successfully.", type: "success" });
    } catch (err: any) {
      setMsg({ text: err.message || "Failed to update profile.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <main className="mx-auto flex max-w-4xl flex-col px-6 py-16 text-center text-foreground/50 text-sm">
          Loading your preferences...
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Decorative background elements matching Pricing page */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(217,119,6,0.15) 0%, rgba(0,0,0,0) 70%)' }} />
      
      <SiteHeader />
      
      <main className="mx-auto max-w-5xl px-6 py-16 md:py-24 relative z-10">
        <header className="mb-16 text-center md:text-left">
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-amber-500/80 mb-3">Preferences</p>
          <h1 className="font-serif text-4xl md:text-6xl leading-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-50 via-amber-200 to-amber-700 tracking-tighter drop-shadow-2xl font-light">
            Account <em className="italic text-amber-300/90 font-serif">Settings</em>
          </h1>
        </header>

        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-8 space-y-8">
            
            {/* Profile Form */}
            <section className="rounded-3xl border border-foreground/10 bg-black/40 backdrop-blur-xl p-8 md:p-10 transition-all hover:border-foreground/20">
              <h2 className="text-2xl font-serif text-amber-100 mb-6 border-b border-foreground/10 pb-4">Profile Information</h2>
              <form onSubmit={onSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-foreground/50 mb-2">Email Address</label>
                  <div className="text-foreground/90 font-mono text-sm bg-foreground/5 rounded-lg px-4 py-3 border border-foreground/10 opacity-70">
                    {user?.email || "Not logged in"}
                  </div>
                </div>

                <label className="block">
                  <span className="block text-xs uppercase tracking-widest text-foreground/50 mb-2">
                    Display Name
                  </span>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your public name on the leaderboard"
                    maxLength={30}
                    className="w-full rounded-lg border border-amber-900/30 bg-black/60 px-4 py-3 text-sm text-foreground outline-none focus:border-amber-500/50 transition-colors placeholder:text-foreground/30 font-serif"
                  />
                </label>

                {msg && (
                  <div className={`rounded-lg px-4 py-3 text-xs ${msg.type === "error" ? "bg-rose-950/40 text-rose-400 border border-rose-900/50" : "bg-emerald-950/40 text-emerald-400 border border-emerald-900/50"}`}>
                    {msg.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-amber-600/20 border border-amber-500/50 px-8 py-3 text-xs font-serif uppercase tracking-[0.2em] text-amber-200 hover:bg-amber-600/40 transition-all shadow-[0_0_15px_rgba(217,119,6,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </section>

            {/* Audio Preferences */}
            <section className="rounded-3xl border border-foreground/10 bg-black/40 backdrop-blur-xl p-8 md:p-10 transition-all hover:border-foreground/20">
              <h2 className="text-2xl font-serif text-amber-100 mb-6 border-b border-foreground/10 pb-4">Audio Preferences</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-foreground/5 transition-colors">
                  <div>
                    <h3 className="text-sm font-medium text-foreground/90 font-serif text-lg">Master Volume Limiter</h3>
                    <p className="text-xs text-foreground/50 mt-1 max-w-[200px] md:max-w-none">Prevent sudden loud noises when switching ambiences</p>
                  </div>
                  <button 
                    onClick={toggleMasterVolume}
                    className={`rounded-full px-5 py-2 text-xs uppercase tracking-widest transition-all ${masterVolume ? 'bg-amber-900/50 border border-amber-700/50 text-amber-200' : 'bg-foreground/5 border border-foreground/10 text-foreground/50 hover:bg-foreground/10'}`}
                  >
                    {masterVolume ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-foreground/5 transition-colors">
                  <div>
                    <h3 className="text-sm font-medium text-foreground/90 font-serif text-lg">Autoplay on Load</h3>
                    <p className="text-xs text-foreground/50 mt-1 max-w-[200px] md:max-w-none">Automatically resume your last active sounds</p>
                  </div>
                  <button 
                    onClick={toggleAutoplay}
                    className={`rounded-full px-5 py-2 text-xs uppercase tracking-widest transition-all ${autoplay ? 'bg-amber-900/50 border border-amber-700/50 text-amber-200' : 'bg-foreground/5 border border-foreground/10 text-foreground/50 hover:bg-foreground/10'}`}
                  >
                    {autoplay ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>
            </section>
          </div>

          <div className="md:col-span-4 space-y-8">
            {/* Subscription Status */}
            <section className="rounded-3xl border border-amber-500/30 bg-amber-950/20 backdrop-blur-xl p-8 relative shadow-[0_0_30px_rgba(217,119,6,0.05)]">
              <h2 className="text-sm uppercase tracking-widest text-amber-500/80 mb-6 font-mono">Current Plan</h2>
              <div className="mb-6">
                <h3 className="text-3xl font-serif text-amber-100 mb-1">Wanderer</h3>
                <p className="text-amber-100/50 text-sm">Free Forever</p>
              </div>
              <ul className="space-y-3 mb-8 text-amber-100/70 text-sm">
                <li className="flex items-center gap-2"><span className="text-amber-500/50">❖</span> Max 2 sounds</li>
                <li className="flex items-center gap-2"><span className="text-amber-500/50">❖</span> Standard audio</li>
              </ul>
              <Link 
                to="/pricing"
                className="block text-center w-full rounded-full bg-amber-500 text-black px-4 py-3 text-xs font-serif uppercase tracking-[0.2em] hover:bg-amber-400 transition-all shadow-[0_0_15px_rgba(217,119,6,0.3)]"
              >
                Upgrade to Archmage
              </Link>
            </section>

            {/* Danger Zone */}
            <section className="rounded-3xl border border-rose-900/30 bg-rose-950/10 p-8 backdrop-blur-xl">
              <h2 className="text-sm uppercase tracking-widest text-rose-500/80 mb-4 font-mono">Danger Zone</h2>
              <p className="text-xs text-foreground/50 mb-6 leading-relaxed">Sign out of your account or permanently delete it. Note: Account deletion must be done via support.</p>
              <button 
                onClick={() => { if (window.confirm("Are you sure you want to sign out?")) signOut() }}
                className="w-full rounded-xl border border-rose-900/50 bg-rose-950/30 px-4 py-3 text-xs uppercase tracking-widest text-rose-400 hover:bg-rose-900/50 hover:text-rose-200 transition-colors"
              >
                Sign Out
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
