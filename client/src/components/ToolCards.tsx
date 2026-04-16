import { ssoNavigate } from "@/lib/sso";

const TOOLS = [
  { idx: "01", name: "Liminal", fn: "Questions belief", desc: "Six instruments for questioning what you believe.", href: "https://liminal-app.up.railway.app/", accent: "hover:border-[#9c8654]/40" },
  { idx: "02", name: "Parallax", fn: "Reveals pattern", desc: "Your patterns — what's stable, shifting, and recurring.", href: "https://parallaxapp.up.railway.app/", accent: "hover:border-[#4ECDC4]/40" },
  { idx: "03", name: "Praxis", fn: "Tests hypothesis", desc: "Design experiments. Test what you think you've learned.", href: "https://praxis-app.up.railway.app/", accent: "hover:border-[#E6A756]/40" },
  { idx: "04", name: "Axiom", fn: "Distills truth", desc: "Distill tested insights into governing principles.", href: "https://axiomtool-production.up.railway.app/#/", accent: "hover:border-[#6C8EBF]/40" },
];

export default function ToolCards() {
  return (
    <section className="py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {TOOLS.map((t) => (
          <article key={t.idx} className={`p-4 rounded-lg border border-border/30 bg-[var(--surface)]/50 transition-colors ${t.accent}`}>
            <p className="text-[9px] font-mono text-muted-foreground/20 mb-2">{t.idx}</p>
            <div className="flex items-center justify-between mb-0.5">
              <h3 className="font-serif text-base font-semibold text-foreground">{t.name}</h3>
              <button onClick={() => ssoNavigate(t.href)}
                className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground/40 hover:text-[var(--gold)] transition-colors">
                Enter
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[var(--gold)]/40 mb-2">{t.fn}</span>
            <p className="text-xs text-muted-foreground/40 leading-relaxed">{t.desc}</p>
          </article>
        ))}
      </div>

      {/* Architecture section */}
      <div className="text-center space-y-2 py-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/40">The Architecture</p>
        <h2 className="font-serif text-xl sm:text-2xl font-semibold text-foreground">Four instruments.<br />One recursive loop.</h2>
        <p className="text-sm text-muted-foreground/50 max-w-lg mx-auto leading-relaxed">
          Each tool operates independently, but their power is in sequence. Together they close a system of reflective inquiry — one that spirals toward earned understanding, not comfortable answers.
        </p>
      </div>
    </section>
  );
}
