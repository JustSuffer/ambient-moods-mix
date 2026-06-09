import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const fetchProfile = useServerFn(getMyProfile);
  const saveProfile = useServerFn(updateProfile);

  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "error" | "success" } | null>(null);

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
        <main className="mx-auto flex max-w-md flex-col px-6 py-16 text-center text-foreground/50 text-sm">
          Loading...
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto flex max-w-md flex-col px-6 py-16 md:py-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-foreground/60">Preferences</p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight">Settings</h1>
        
        <form onSubmit={onSubmit} className="mt-10 space-y-5">
          <label className="block">
            <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/70">
              Display Name
            </span>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your public name on the leaderboard"
              maxLength={30}
              className="w-full rounded-lg border border-foreground/15 bg-background/40 px-4 py-3 text-sm outline-none focus:border-foreground/40"
            />
          </label>

          {msg && (
            <div className={`rounded-lg px-4 py-3 text-xs ${msg.type === "error" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
              {msg.text}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-amber-200 px-4 py-3 text-xs font-medium uppercase tracking-[0.2em] text-black hover:bg-amber-100 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </main>
    </div>
  );
}
