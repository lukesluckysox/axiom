import { useState, useEffect } from "react";

const LEVELS = ["low", "medium", "high"] as const;
type Level = typeof LEVELS[number];

const DESCRIPTIONS: Record<Level, string> = {
  low: "The loop is casting a wide net — more signals will be promoted sooner.",
  medium: "Balanced sensitivity — patterns need moderate repetition to advance.",
  high: "The loop is conservative — only well-evidenced patterns will advance.",
};

const DETAIL_DL = [
  { dt: "Low", dd: "Surfaces more possibilities sooner. Good for exploration." },
  { dt: "Medium", dd: "Balanced. Waits for modest repetition before promoting." },
  { dt: "High", dd: "Waits for strong repetition and evidence. Promotes less, but with more conviction." },
];

interface Props { userId?: number }

export default function LoopSensitivity({ userId }: Props) {
  const [value, setValue] = useState<Level>("medium");
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/epistemic/sensitivity/${userId}`, { credentials: "include" })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.sensitivity) setValue(d.sensitivity); })
      .catch(() => {});
  }, [userId]);

  async function set(v: Level) {
    setValue(v);
    try {
      await fetch(`/api/epistemic/sensitivity/${userId || 1}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ sensitivity: v }),
      });
    } catch {}
  }

  return (
    <div>
      <div className="p-3 rounded-lg border border-border/30 flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/50 mb-0.5">Loop Sensitivity</div>
          <div className="text-[10px] text-muted-foreground/30">Controls how readily the loop promotes signals to candidates</div>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          {LEVELS.map((l) => (
            <button key={l} onClick={() => set(l)}
              className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-wider border transition-all ${value === l ? "border-[var(--gold)] text-[var(--gold)] bg-[var(--gold-dim)]" : "border-border/50 text-muted-foreground/40 hover:border-[var(--gold)]/30"}`}>
              {l === "medium" ? "MED" : l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-2">
        <p className="text-[10px] text-muted-foreground/40">{DESCRIPTIONS[value]}</p>
        <button onClick={() => setShowDetail(!showDetail)}
          className="text-[10px] text-[var(--gold)]/40 hover:text-[var(--gold)] mt-1 transition-colors">
          {showDetail ? "Hide details" : "What does this control?"}
        </button>
        {showDetail && (
          <div className="mt-2 text-[10px] text-muted-foreground/40 space-y-1">
            <p>Sensitivity determines how quickly the loop promotes recurring material into candidates, prompts, and downstream actions.</p>
            {DETAIL_DL.map((d) => (
              <p key={d.dt}><strong className="text-muted-foreground/60">{d.dt}:</strong> {d.dd}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
