import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/authClient";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in — YourAmbience" }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const { error } = await authClient.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setErr(error.message); return; }
    navigate({ to: "/mixer" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto flex max-w-md flex-col px-6 py-16 md:py-24">
        <h1 className="font-serif text-4xl tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-foreground/60">Log in to continue mixing.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <input
            type="email" required placeholder="Email"
            value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-foreground/15 bg-background/40 px-4 py-3 text-sm outline-none focus:border-foreground/40"
          />
          <input
            type="password" required placeholder="Password"
            value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-foreground/15 bg-background/40 px-4 py-3 text-sm outline-none focus:border-foreground/40"
          />
          {err && <p className="text-xs text-rose-400">{err}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full rounded-lg bg-white px-4 py-3 text-sm font-medium uppercase tracking-[0.2em] text-black hover:bg-white/90 disabled:opacity-50"
          >
            {loading ? "..." : "Log in"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-foreground/60">
          No account?{" "}
          <Link to="/signup" className="text-foreground underline">Sign up</Link>
        </p>
      </main>
    </div>
  );
}
