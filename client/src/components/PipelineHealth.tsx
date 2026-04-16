import { useEffect, useState } from "react";

const APP_URLS: Record<string, string> = {
  liminal: "https://liminal-app.up.railway.app",
  parallax: "https://parallaxapp.up.railway.app",
  praxis: "https://praxis-app.up.railway.app",
  axiom: "https://axiomtool-production.up.railway.app",
};

type Status = "ok" | "warn" | "err" | "off";
const STATUS_COLORS: Record<Status, string> = {
  ok: "bg-green-400",
  warn: "bg-amber-400",
  err: "bg-red-400",
  off: "bg-muted-foreground/20",
};
const STATUS_LABELS: Record<Status, string> = { ok: "Online", warn: "Slow", err: "Down", off: "Unknown" };

export default function PipelineHealth() {
  const [results, setResults] = useState<Record<string, Status>>({});
  const [tooltipOpen, setTooltipOpen] = useState(false);

  useEffect(() => {
    async function check() {
      const entries = Object.entries(APP_URLS);
      const res = await Promise.all(
        entries.map(async ([name, url]) => {
          try {
            const ctrl = new AbortController();
            const tm = setTimeout(() => ctrl.abort(), 6000);
            await fetch(url, { mode: "no-cors", signal: ctrl.signal });
            clearTimeout(tm);
            return [name, "ok" as Status] as const;
          } catch (e: any) {
            return [name, e.name === "AbortError" ? "warn" as Status : "err" as Status] as const;
          }
        })
      );
      setResults(Object.fromEntries(res));
    }
    check();
  }, []);

  return (
    <div className="relative inline-flex items-center gap-1">
      <button onClick={() => setTooltipOpen(!tooltipOpen)} className="flex items-center gap-0.5">
        {Object.keys(APP_URLS).map((name) => (
          <span key={name} className={`w-1.5 h-1.5 rounded-full ${STATUS_COLORS[results[name] || "off"]}`} />
        ))}
      </button>
      {tooltipOpen && (
        <div className="absolute top-full right-0 mt-2 z-50 bg-[var(--surface)] border border-border/30 rounded-lg p-2.5 min-w-[160px] shadow-lg">
          {Object.keys(APP_URLS).map((name) => {
            const st = results[name] || "off";
            return (
              <div key={name} className="flex items-center justify-between py-0.5 text-[10px] font-mono">
                <span className="text-muted-foreground/60">{name.charAt(0).toUpperCase() + name.slice(1)}</span>
                <span className={`${st === "ok" ? "text-green-400" : st === "warn" ? "text-amber-400" : st === "err" ? "text-red-400" : "text-muted-foreground/30"}`}>
                  {STATUS_LABELS[st]}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
