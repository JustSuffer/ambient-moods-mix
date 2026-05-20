import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { getLeaderboard } from "@/lib/coins.functions";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — YourAmbience" },
      { name: "description", content: "Top focus seekers ranked by ambience coins earned through Pomodoro work." },
    ],
  }),
  component: LeaderboardPage,
});

interface Row { id: string; display_name: string | null; coins: number }

function LeaderboardPage() {
  const fetchBoard = useServerFn(getLeaderboard);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBoard({})
      .then((r) => setRows(r.rows as Row[]))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [fetchBoard]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-14">
        <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-foreground/60">Hall of focus</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl tracking-tight">
          Leader<em className="italic text-amber-200/90">board</em>
        </h1>
        <p className="mt-3 max-w-xl text-sm text-foreground/70">
          Coins are earned only by completing Pomodoro work cycles. One minute of focused work equals one ambience coin.
        </p>

        <div className="mt-10 overflow-hidden rounded-2xl border border-foreground/10 bg-background/40 backdrop-blur">
          {loading ? (
            <div className="p-10 text-center font-mono text-xs uppercase tracking-widest text-foreground/50">Loading…</div>
          ) : rows.length === 0 ? (
            <div className="p-10 text-center text-foreground/60">
              No champions yet. <Link to="/pomodoro" className="underline hover:text-amber-200">Be the first.</Link>
            </div>
          ) : (
            <ol>
              {rows.map((r, i) => (
                <li key={r.id} className="flex items-center justify-between border-b border-foreground/5 px-6 py-4 last:border-0">
                  <div className="flex items-center gap-4">
                    <span className={`font-mono text-sm w-8 ${i < 3 ? "text-amber-200" : "text-foreground/50"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-serif text-lg">{r.display_name || "Anonymous Seeker"}</span>
                  </div>
                  <span className="font-mono text-sm text-amber-100">◈ {r.coins}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </main>
    </div>
  );
}
