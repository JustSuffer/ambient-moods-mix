import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useServerFn } from "@tanstack/react-start";
import { getMyProfile } from "@/lib/coins.functions";
import { User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SiteHeader() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const fetchProfile = useServerFn(getMyProfile);
  const [coins, setCoins] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!user) { setCoins(null); return; }
    fetchProfile({})
      .then((r) => { if (!cancelled) setCoins(r.profile.coins ?? 0); })
      .catch(() => {});
    const id = setInterval(() => {
      fetchProfile({}).then((r) => { if (!cancelled) setCoins(r.profile.coins ?? 0); }).catch(() => {});
    }, 30000);
    return () => { cancelled = true; clearInterval(id); };
  }, [user, fetchProfile]);

  return (
    <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/70 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-serif text-lg tracking-tight text-foreground">
          <img src="/logo.png" alt="Logo" className="h-8 w-8 object-contain" />
          <span>Your<em className="italic text-amber-200/90">Ambience</em></span>
        </Link>
        <div className="flex items-center gap-5 font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/70">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground" }} className="hover:text-foreground">Home</Link>
          <Link to="/mixer" activeProps={{ className: "text-foreground" }} className="hover:text-foreground">Mixer</Link>
          <Link to="/pomodoro" activeProps={{ className: "text-foreground" }} className="hover:text-foreground">Pomodoro</Link>
          <Link to="/leaderboard" activeProps={{ className: "text-foreground" }} className="hover:text-foreground">Leaderboard</Link>
          <Link to="/about" activeProps={{ className: "text-foreground" }} className="hover:text-foreground">About</Link>
          {user ? (
            <>
              {coins !== null && (
                <span className="rounded-full border border-amber-200/40 bg-amber-200/10 px-3 py-1.5 text-amber-100">
                  ◈ {coins}
                </span>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/20 bg-background/50 hover:border-foreground/50 transition-colors">
                    <User className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-black/90 border-foreground/10 text-foreground backdrop-blur-md">
                  <DropdownMenuItem asChild className="cursor-pointer font-mono text-[10px] uppercase tracking-widest focus:bg-white/10">
                    <Link to="/settings" className="w-full">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer font-mono text-[10px] uppercase tracking-widest focus:bg-amber-500/20">
                    <Link to="/pricing" className="w-full text-amber-200">Pricing</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-foreground/10" />
                  <DropdownMenuItem 
                    onClick={() => signOut()} 
                    className="cursor-pointer font-mono text-[10px] uppercase tracking-widest focus:bg-rose-500/20 focus:text-rose-400"
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-foreground">Log in</Link>
              <Link to="/signup" className="rounded-full bg-white px-3 py-1.5 text-black hover:bg-white/90">Sign up</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
