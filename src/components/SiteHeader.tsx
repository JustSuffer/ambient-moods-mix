import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";

export function SiteHeader() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/70 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-serif text-lg tracking-tight text-foreground">
          Your<em className="italic text-amber-200/90">Ambience</em>
        </Link>
        <div className="flex items-center gap-5 font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/70">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground" }} className="hover:text-foreground">
            Home
          </Link>
          <Link to="/mixer" activeProps={{ className: "text-foreground" }} className="hover:text-foreground">
            Mixer
          </Link>
          <Link to="/about" activeProps={{ className: "text-foreground" }} className="hover:text-foreground">
            About
          </Link>
          {user ? (
            <button
              onClick={() => signOut()}
              className="rounded-full border border-foreground/20 px-3 py-1.5 hover:border-foreground/50"
            >
              Sign out
            </button>
          ) : (
            <>
              <Link to="/login" className="hover:text-foreground">Log in</Link>
              <Link
                to="/signup"
                className="rounded-full bg-white px-3 py-1.5 text-black hover:bg-white/90"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
