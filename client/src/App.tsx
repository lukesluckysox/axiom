import { useState, useCallback } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import AuthGate from "@/components/AuthGate";
import BottomNav from "@/components/BottomNav";
import PipelineHealth from "@/components/PipelineHealth";
import HomePage from "@/pages/HomePage";
import ProfilePanel from "@/components/ProfilePanel";
import AboutModal from "@/components/AboutModal";
import OnboardingOverlay from "@/components/OnboardingOverlay";
import PwaBanner from "@/components/PwaBanner";

/* ── Palette dot colours (visual only — CSS vars handle the rest) ── */
const PALETTES = [
  { id: "lumen",    color: "#FFD166", label: "Lumen" },
  { id: "liminal",  color: "#9c8654", label: "Liminal" },
  { id: "parallax", color: "#4d8c9e", label: "Parallax" },
  { id: "praxis",   color: "#c4943e", label: "Praxis" },
  { id: "axiom",    color: "#3d7bba", label: "Axiom" },
] as const;

function Shell() {
  const { user, loading, logout } = useAuth();
  const { theme, palette, toggleTheme, setPalette } = useTheme();

  // Scroll reveal
  useScrollReveal();

  // Profile panel state
  const [profileOpen, setProfileOpen] = useState(false);

  // About modal state
  const [aboutOpen, setAboutOpen] = useState(false);

  const handleLogout = useCallback(() => {
    logout();
    window.location.reload();
  }, [logout]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <svg width="56" height="56" viewBox="0 0 100 100" fill="none" className="animate-pulse">
          <circle cx="50" cy="50" r="46" stroke="var(--gold)" strokeWidth="2" strokeDasharray="0 0 145 145" strokeLinecap="round" opacity="0.5" />
          <circle cx="50" cy="50" r="12" fill="var(--gold)" opacity="0.9" />
        </svg>
      </div>
    );
  }

  if (!user) {
    return <AuthGate onAuth={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ═══ Top Nav ═══ */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-2.5">
          {/* Left: Logo + Brand */}
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 64 64" fill="none" aria-hidden="true">
              <path d="M32 4C47.46 4 60 16.54 60 32S47.46 60 32 60" stroke="var(--gold)" strokeWidth="1.6" strokeLinecap="round" opacity=".6"/>
              <path d="M32 60C16.54 60 4 47.46 4 32S16.54 4 32 4" stroke="var(--gold)" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="4 3" opacity=".25"/>
              <circle cx="32" cy="4" r="2.5" fill="var(--gold)" opacity=".8"/>
              <circle cx="32" cy="32" r="5" fill="var(--gold)" opacity=".5"/>
              <circle cx="32" cy="32" r="3" fill="var(--gold)" opacity=".8"/>
              <circle cx="32" cy="32" r="1.5" fill="var(--gold)"/>
            </svg>
            <span className="font-serif text-base font-semibold tracking-tight text-foreground">LUMEN</span>
          </div>

          {/* Center: Nav Links (hidden on mobile) */}
          <ul className="hidden sm:flex items-center gap-8">
            <li><a href="#tools" className="text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">Tools</a></li>
            <li><a href="#cockpit" className="text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">Overview</a></li>
            <li>
              <button onClick={() => setAboutOpen(true)}
                className="text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                About
              </button>
            </li>
          </ul>

          {/* Right: Palette dots + Theme toggle + Pipeline + Username */}
          <div className="flex items-center gap-3">
            {/* Palette dots */}
            <div className="hidden sm:flex items-center gap-1.5">
              {PALETTES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPalette(p.id as any)}
                  className={`palette-dot ${palette === p.id ? "active" : ""}`}
                  style={{ backgroundColor: p.color }}
                  data-name={p.label}
                  aria-label={`Switch to ${p.label} palette`}
                />
              ))}
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-[34px] h-[34px] flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-[var(--border-raw)] transition-colors"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            >
              {theme === "dark" ? (
                /* Sun icon */
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                /* Moon icon */
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>

            {/* Pipeline health dots */}
            <PipelineHealth />

            {/* Username — click to open profile */}
            {user.username && (
              <button
                onClick={() => setProfileOpen(true)}
                className="text-[10px] font-mono text-muted-foreground/50 hover:text-foreground transition-colors cursor-pointer"
              >
                {user.username}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ═══ Main Content ═══ */}
      <HomePage userId={user.id} />

      {/* ═══ Bottom Nav ═══ */}
      <BottomNav />

      {/* ═══ Overlays ═══ */}
      <ProfilePanel open={profileOpen} onClose={() => setProfileOpen(false)} onLogout={handleLogout} />
      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <OnboardingOverlay />
      <PwaBanner />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Shell />
    </QueryClientProvider>
  );
}
