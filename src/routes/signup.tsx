import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/authClient";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign up — YourAmbience" }] }),
  component: Signup,
});

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null); setInfo(null); setLoading(true);
    const { data, error } = await authClient.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) { setErr(error.message); return; }
    if (data.session) {
      navigate({ to: "/mixer" });
    } else {
      setInfo("Check your email to confirm your account.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto flex max-w-md flex-col px-6 py-16 md:py-24">
        <h1 className="font-serif text-4xl tracking-tight">Create your account</h1>
        <p className="mt-2 text-sm text-foreground/60">Save your atmosphere across sessions.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <input
            type="email" required placeholder="Email"
            value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-foreground/15 bg-background/40 px-4 py-3 text-sm outline-none focus:border-foreground/40"
          />
          <input
            type="password" required minLength={6} placeholder="Password (min 6)"
            value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-foreground/15 bg-background/40 px-4 py-3 text-sm outline-none focus:border-foreground/40"
          />
          {err && <p className="text-xs text-rose-400">{err}</p>}
          {info && <p className="text-xs text-emerald-400">{info}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full rounded-lg bg-white px-4 py-3 text-sm font-medium uppercase tracking-[0.2em] text-black hover:bg-white/90 disabled:opacity-50"
          >
            {loading ? "..." : "Sign up"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-foreground/60">
          Already have an account?{" "}
          <Link to="/login" className="text-foreground underline">Log in</Link>
        </p>
      </main>
    </div>
  );
}
