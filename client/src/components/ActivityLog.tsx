import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface FeedEvent {
  sourceApp: string;
  eventType: string;
  summary?: string;
  createdAt: string;
}

const EVENT_VERBS: Record<string, string> = {
  belief_candidate: "surfaced a belief worth examining",
  tension_candidate: "revealed an unresolved tension",
  pattern_candidate: "detected a behavioral pattern",
  hypothesis_candidate: "proposed a hypothesis for testing",
  constitutional_promotion: "promoted a truth to constitutional status",
  truth_revision: "revised a foundational belief",
  experiment_completed: "completed a lived experiment",
  doctrine_crystallized: "crystallized a working doctrine",
};

const APP_COLORS: Record<string, string> = {
  liminal: "bg-[#9c8654]",
  parallax: "bg-[#4ECDC4]",
  praxis: "bg-[#E6A756]",
  axiom: "bg-[#6C8EBF]",
};

function relativeTime(iso: string) {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const m = Math.floor(diff / 60000), h = Math.floor(diff / 3600000), d = Math.floor(diff / 86400000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min${m === 1 ? "" : "s"} ago`;
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  if (d < 7) return `${d} day${d === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function ActivityLog() {
  const [open, setOpen] = useState(false);
  const { data: events } = useQuery<FeedEvent[]>({
    queryKey: ["/api/loop/feed"],
    queryFn: async () => {
      const r = await fetch("/api/loop/feed", { credentials: "same-origin" });
      if (!r.ok) throw new Error("Failed");
      return r.json();
    },
  });

  const shown = (events || []).slice(0, 10);

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/40 mb-0.5">Activity Log</p>
          <h2 className="font-serif text-lg font-semibold text-foreground">Event History</h2>
        </div>
        <button onClick={() => setOpen(!open)}
          className="text-[10px] font-mono text-muted-foreground/40 hover:text-[var(--gold)] transition-colors flex items-center gap-1">
          <span>{open ? "Hide activity log" : "View activity log"}</span>
          <svg className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
        </button>
      </div>
      {open && (
        <div className="space-y-1.5">
          {shown.length === 0 ? (
            <p className="text-xs text-muted-foreground/30">Nothing here yet. As I reflect in Liminal, run experiments in Praxis, and check in through Parallax, my activity will stream into this feed.</p>
          ) : (
            shown.map((ev, i) => (
              <article key={i} className="flex gap-2 items-start py-1.5">
                <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${APP_COLORS[ev.sourceApp] || "bg-muted-foreground/20"}`} />
                <div className="min-w-0">
                  <div className="flex items-center gap-1 flex-wrap text-[10px]">
                    <span className="font-medium text-muted-foreground/60">{ev.sourceApp?.charAt(0).toUpperCase() + ev.sourceApp?.slice(1)}</span>
                    <span className="text-muted-foreground/20">·</span>
                    <span className="text-muted-foreground/40">{EVENT_VERBS[ev.eventType] || "left a mark"}</span>
                    <span className="text-muted-foreground/20">·</span>
                    <time className="text-muted-foreground/25">{relativeTime(ev.createdAt)}</time>
                  </div>
                  {ev.summary && <p className="text-[10px] text-muted-foreground/35 mt-0.5">{ev.summary}</p>}
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </section>
  );
}
