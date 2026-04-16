import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import AuthGate from "@/components/AuthGate";
import TopNav from "@/components/TopNav";
import BottomNav from "@/components/BottomNav";
import PipelineHealth from "@/components/PipelineHealth";
import HomePage from "@/pages/HomePage";

function Shell() {
  const { user, loading, logout } = useAuth();

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
      {/* Top nav with pipeline health in right side */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="46" stroke="var(--gold)" strokeWidth="3" strokeDasharray="0 0 145 145" strokeLinecap="round" opacity="0.5" />
              <circle cx="50" cy="50" r="12" fill="var(--gold)" opacity="0.9" />
            </svg>
            <span className="font-serif text-base font-semibold tracking-tight text-foreground">LUMEN</span>
          </div>
          <div className="flex items-center gap-3">
            <PipelineHealth />
            {user.username && (
              <span className="text-[10px] font-mono text-muted-foreground/50">{user.username}</span>
            )}
            <button onClick={logout}
              className="text-[10px] font-mono text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors">
              logout
            </button>
          </div>
        </div>
      </header>

      <HomePage userId={user.id} />
      <BottomNav />
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
