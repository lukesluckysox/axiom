interface Props { open: boolean; onClose: () => void; }

const LOOP_STEPS = [
  { idx: "01", name: "Liminal", verb: "Questions belief", desc: "Surfaces hidden assumptions. Identifies what you believe that you have not chosen to believe." },
  { idx: "02", name: "Parallax", verb: "Reveals pattern", desc: "Reads across time. Finds recurring structures in thought, behavior, and emotional response." },
  { idx: "03", name: "Praxis", verb: "Tests hypothesis", desc: "Turns insight into experiment. Measures belief against lived experience before committing to it." },
  { idx: "04", name: "Axiom", verb: "Distills truth", desc: "Synthesizes what survived. Extracts durable principles, active tensions, and earned doctrines." },
];

const GLOSSARY = [
  { term: "Sensitivity", def: "Controls how readily the loop promotes recurring signals into candidates. Low = more exploratory, High = more conservative." },
  { term: "Candidate", def: "A piece of insight — a belief, pattern, tension, or hypothesis — that the loop has identified as worth examining further." },
  { term: "Promotion", def: "When a candidate meets the current sensitivity threshold, it advances to a destination app (Axiom, Praxis, or Liminal) for deeper processing." },
  { term: "Convergence", def: "When a belief from Liminal and a behavioral pattern from Parallax align on the same theme, they are paired and promoted together." },
  { term: "Doctrine", def: "A recurring belief or principle that has been observed across multiple reflections, strong enough to be proposed as a governing truth." },
  { term: "Tension", def: "A contradiction between two beliefs or between belief and behavior. Tensions are not errors — they are invitations to examine." },
  { term: "Alignment", def: "A measure of how closely your current state across all dimensions matches your stated targets. Shown in the sundial." },
  { term: "The Loop", def: "The recursive cycle connecting Liminal (questioning), Parallax (observing), Praxis (testing), and Axiom (governing). Each pass refines what came before." },
];

export default function AboutModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-background overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Back button */}
        <button onClick={onClose}
          className="sticky top-0 z-10 bg-background text-sm text-muted-foreground hover:text-foreground transition-colors py-2 mb-6 block">
          ← Back
        </button>

        {/* The Loop */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/40 mb-1">The Loop</p>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-3">Not a sequence.<br />A cycle.</h2>
            <p className="text-sm text-muted-foreground/50 max-w-lg mx-auto leading-relaxed">
              Each pass through the loop refines what came before. The light Lumen produces — the truths Axiom distills — becomes the next layer of darkness that Liminal interrogates. The cycle is the method.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {LOOP_STEPS.map((s) => (
              <div key={s.idx} className="text-center">
                <div className="w-10 h-10 rounded-full border border-[var(--gold)]/20 flex items-center justify-center mx-auto mb-2">
                  <span className="text-[10px] font-mono text-[var(--gold)]/50">{s.idx}</span>
                </div>
                <h3 className="font-serif text-sm font-semibold text-foreground">{s.name}</h3>
                <span className="block text-[10px] font-mono uppercase tracking-wider text-[var(--gold)]/40 mb-1">{s.verb}</span>
                <p className="text-[10px] text-muted-foreground/40 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Recursive callout */}
          <div className="flex items-start gap-3 p-4 rounded-lg border border-border/20 bg-[var(--surface)]/30 max-w-lg mx-auto">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--gold)]/40 flex-shrink-0 mt-0.5">
              <path d="M1 4v6h6M23 20v-6h-6" />
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" />
            </svg>
            <p className="text-xs text-muted-foreground/50 leading-relaxed">
              The truths distilled by <span className="text-[var(--gold)]/60 font-medium">Axiom</span> become the assumptions
              interrogated by <span className="text-[var(--gold)]/60 font-medium">Liminal</span> in the next cycle.
              The loop does not close — it deepens.
            </p>
          </div>
        </section>

        {/* Philosophy */}
        <section className="mb-12">
          <div className="h-px bg-border/20 mb-8" />
          <blockquote className="font-serif text-lg sm:text-xl text-center text-foreground/80 italic max-w-lg mx-auto mb-6 leading-relaxed">
            "A personal constitution is not found.
            It is constructed — question by question,
            experiment by experiment, revision by revision."
          </blockquote>
          <div className="w-8 h-px bg-[var(--gold)]/20 mx-auto mb-6" />
          <p className="text-sm text-muted-foreground/50 max-w-lg mx-auto leading-relaxed mb-4">
            Lumen is not a productivity system. It does not optimize your morning or aggregate your goals. It is a framework for building conviction from tested experience — for knowing, with some rigor, what you actually believe and why.
          </p>
          <p className="text-sm text-muted-foreground/50 max-w-lg mx-auto leading-relaxed">
            The examined life requires infrastructure. This is that infrastructure.
          </p>
        </section>

        {/* Glossary */}
        <section className="mb-12">
          <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Glossary</h3>
          <dl className="space-y-3">
            {GLOSSARY.map((g) => (
              <div key={g.term}>
                <dt className="text-xs font-medium text-foreground/70">{g.term}</dt>
                <dd className="text-xs text-muted-foreground/40 leading-relaxed mt-0.5">{g.def}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
