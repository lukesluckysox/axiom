import { Link } from "wouter";
import { ArrowLeft, ArrowRight, FlaskConical } from "lucide-react";

export default function DecisionsPage() {
  return (
    <div className="min-h-screen bg-background pb-20 noise-overlay">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Link
            href="/snapshot"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Reflection
          </Link>
          <h1 className="text-base font-bold">Decision Lab</h1>
          <div />
        </header>

        {/* Migration card */}
        <div className="p-6 rounded-[10px] border border-border/30 bg-card/20 space-y-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(255,209,102,0.1)" }}
            >
              <FlaskConical className="w-5 h-5" style={{ color: "#c4943e" }} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Decision experiments have moved to Praxis</h2>
              <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                Decisions are experiments, not observations — they belong in the laboratory.
              </p>
            </div>
          </div>

          <a
            href="https://praxis-app.up.railway.app/#/decision-experiments"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-[10px] border border-border/20 bg-card/10 hover:bg-card/30 transition-colors group"
          >
            <span className="text-xs text-muted-foreground/50 group-hover:text-muted-foreground/70 transition-colors">
              Open Decision Experiments in Praxis
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-muted-foreground/50 transition-colors" />
          </a>
        </div>
      </div>
    </div>
  );
}
