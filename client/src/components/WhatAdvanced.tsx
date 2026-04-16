import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface PromotedItem {
  candidateType: string;
  targetApp?: string;
  title: string;
  explanation?: string;
  updatedAt: string;
}

function relativeTime(iso: string) {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const m = Math.floor(diff / 60000), h = Math.floor(diff / 3600000), d = Math.floor(diff / 86400000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min${m === 1 ? "" : "s"} ago`;
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  if (d < 7) return `${d} day${d === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function WhatAdvanced() {
  const [open, setOpen] = useState(false);
  const { data } = useQuery<{ promoted: PromotedItem[] }>({
    queryKey: ["/api/loop/promoted"],
    queryFn: async () => {
      const r = await fetch("/api/loop/promoted", { credentials: "same-origin" });
      if (!r.ok) throw new Error("Failed");
      return r.json();
    },
  });

  const items = data?.promoted?.slice(0, 3) || [];

  return (
    <section className="py-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/40 mb-0.5">The Loop</p>
          <h2 className="font-serif text-lg font-semibold text-foreground">What Advanced</h2>
        </div>
        <button onClick={() => setOpen(!open)}
          className="text-[10px] font-mono text-muted-foreground/40 hover:text-[var(--gold)] transition-colors flex items-center gap-1">
          <span>{open ? "Hide" : "Show recent"}</span>
          <svg className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
        </button>
      </div>
      {open && (
        <div className="space-y-2">
          {items.length === 0 ? (
            <p className="text-xs text-muted-foreground/30">Nothing has advanced yet. As the loop processes reflections and patterns, meaningful progress will appear here.</p>
          ) : (
            items.map((item, i) => (
              <article key={i} className="p-3 rounded-lg border border-border/30 bg-[var(--surface)]/50">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground/40">{item.candidateType.replace(/_/g, " ")}</span>
                  {item.targetApp && <span className="text-[9px] font-mono text-[var(--gold)]/40">→ {item.targetApp.charAt(0).toUpperCase() + item.targetApp.slice(1)}</span>}
                </div>
                <h3 className="text-sm text-foreground/90">{item.title}</h3>
                {item.explanation && <p className="text-[10px] text-muted-foreground/40 mt-1">{item.explanation}</p>}
                <time className="text-[9px] font-mono text-muted-foreground/25 mt-1 block">{relativeTime(item.updatedAt)}</time>
              </article>
            ))
          )}
        </div>
      )}
    </section>
  );
}
