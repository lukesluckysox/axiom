export default function Footer() {
  return (
    <footer className="py-6 border-t border-border/20 mt-8 mb-16">
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 64 64" fill="none" className="text-[var(--gold)]">
            <path d="M32 4C47.46 4 60 16.54 60 32S47.46 60 32 60" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
            <path d="M32 60C16.54 60 4 47.46 4 32S16.54 4 32 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="4 3" opacity="0.25" />
            <circle cx="32" cy="4" r="2.5" fill="currentColor" opacity="0.8" />
            <line x1="32" y1="14" x2="32" y2="22" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
            <circle cx="32" cy="32" r="5" fill="currentColor" opacity="0.5" />
            <circle cx="32" cy="32" r="3" fill="currentColor" opacity="0.8" />
            <circle cx="32" cy="32" r="1.5" fill="currentColor" />
          </svg>
          <span className="font-serif text-sm font-semibold text-foreground">Lumen</span>
        </div>
        <span className="text-[10px] text-muted-foreground/30 font-sans">An operating system for the examined life.</span>
      </div>
    </footer>
  );
}
