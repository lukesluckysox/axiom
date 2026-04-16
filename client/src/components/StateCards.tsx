import { useQuery } from "@tanstack/react-query";
import { ssoNavigate } from "@/lib/sso";

interface LoopState {
  axiomCount: number;
  tensionCount: number;
  experimentCount: number;
  pendingCount: number;
}

const CARDS = [
  { id: "axiom", key: "axiomCount" as const, label: "Constitutional Principles", sub: "Proposals I examine and promote in Axiom become governing principles here", href: "https://axiomtool-production.up.railway.app/#/constitution", color: "text-[var(--gold)]" },
  { id: "tension", key: "tensionCount" as const, label: "Active Tensions", sub: "Competing truths I surface in Axiom show up here as live tensions", href: "https://axiomtool-production.up.railway.app/#/tensions", color: "text-red-400" },
  { id: "experiment", key: "experimentCount" as const, label: "Live Experiments", sub: "Experiments I design in Praxis to test my beliefs appear here", href: "https://praxis-app.up.railway.app/#/experiments", color: "text-amber-400" },
  { id: "pending", key: "pendingCount" as const, label: "Pending Inquiries", sub: "Open inquiries from my Liminal sessions collect here for follow-up", href: "https://liminal-app.up.railway.app/archive", color: "text-yellow-600" },
];

export default function StateCards() {
  const { data } = useQuery<LoopState>({
    queryKey: ["/api/loop/state"],
    queryFn: async () => {
      const r = await fetch("/api/loop/state", { credentials: "same-origin" });
      if (!r.ok) throw new Error("Failed");
      return r.json();
    },
  });

  return (
    <section className="py-5">
      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/40 mb-1">Current State</p>
      <h2 className="font-serif text-xl sm:text-2xl font-semibold text-foreground mb-4">Where things stand.</h2>
      <div className="grid grid-cols-2 gap-3">
        {CARDS.map((c) => (
          <button key={c.id} onClick={() => ssoNavigate(c.href)}
            className="text-left p-3 rounded-lg border border-border/30 bg-[var(--surface)]/50 hover:border-[var(--gold)]/20 transition-colors group relative">
            <svg className="absolute top-2 right-2 w-3 h-3 text-muted-foreground/20 group-hover:text-[var(--gold)]/40 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg>
            <span className="block text-[10px] font-mono text-muted-foreground/50 mb-1">{c.label}</span>
            <span className={`block font-serif text-2xl font-light ${c.color}`}>{data ? data[c.key] : "—"}</span>
            <span className="block text-[9px] text-muted-foreground/30 mt-1 leading-relaxed">{c.sub}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
