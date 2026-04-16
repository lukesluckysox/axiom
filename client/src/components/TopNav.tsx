interface TopNavProps {
  username?: string;
  onLogout: () => void;
}

export default function TopNav({ username, onLogout }: TopNavProps) {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/30">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-2.5">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="46" stroke="var(--gold)" strokeWidth="3" strokeDasharray="0 0 145 145" strokeLinecap="round" opacity="0.5"/>
            <circle cx="50" cy="50" r="12" fill="var(--gold)" opacity="0.9"/>
          </svg>
          <span className="font-serif text-base font-semibold tracking-tight text-foreground">LUMEN</span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {username && (
            <span className="text-[10px] font-mono text-muted-foreground/50">{username}</span>
          )}
          {username && (
            <button
              onClick={onLogout}
              className="text-[10px] font-mono text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors"
            >
              logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
