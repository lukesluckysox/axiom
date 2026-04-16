import { useQuery } from "@tanstack/react-query";

interface PulseDay {
  date: string;
  count: number;
  tools: {
    liminal: number;
    parallax: number;
    praxis: number;
    axiom: number;
  };
}

interface PulseData {
  days: PulseDay[];
  toolBreakdown: {
    liminal: number;
    parallax: number;
    praxis: number;
    axiom: number;
  };
}

interface LoopPulseProps {
  data?: PulseData;
}

const TOOL_COLORS: Record<string, string> = {
  liminal: "#9c8654",
  parallax: "#4ECDC4",
  praxis: "#E6A756",
  axiom: "#6C8EBF",
};

function formatDayLabel(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { weekday: "short" }).charAt(0);
  } catch {
    return "·";
  }
}

export default function LoopPulse({ data: propData }: LoopPulseProps) {
  const { data: fetchedData, isLoading } = useQuery<PulseData>({
    queryKey: ["/api/loop/pulse"],
    queryFn: async () => {
      const res = await fetch("/api/loop/pulse", { credentials: "same-origin" });
      if (!res.ok) throw new Error("Failed to fetch pulse");
      return res.json();
    },
    enabled: !propData,
  });

  const data = propData ?? fetchedData;

  const totalReflections = data
    ? Object.values(data.toolBreakdown).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <section aria-label="Loop activity pulse" className="py-5">
      {/* Header */}
      <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--gold)] mb-1">
        Loop Pulse
      </p>
      <h2 className="font-serif text-xl sm:text-2xl font-semibold text-foreground mb-3">
        Last 7 Days
      </h2>

      <div className="flex flex-col sm:flex-row sm:items-start gap-6">
        {/* Meta */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <p className="text-xs text-muted-foreground/50">Loading…</p>
          ) : data ? (
            <>
              <p className="text-sm text-muted-foreground mb-3">
                <span className="text-[var(--gold)] font-semibold">{totalReflections}</span>{" "}
                total reflections
              </p>

              {/* Tool breakdown pills */}
              <div className="flex flex-wrap gap-2">
                {(["liminal", "parallax", "praxis", "axiom"] as const).map((tool) => (
                  <span
                    key={tool}
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border/50 bg-[var(--surface)] text-[10px] font-mono uppercase tracking-wider text-muted-foreground"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: TOOL_COLORS[tool] }}
                    />
                    {tool} {data.toolBreakdown[tool]}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="text-xs text-muted-foreground/50">No data yet.</p>
          )}
        </div>

        {/* Day dots chart */}
        {data && (
          <div className="flex items-end gap-2" aria-label="Seven-day activity sparkline">
            {data.days.map((day, i) => {
              const active = day.count > 0;
              return (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  {/* Stacked tool dots */}
                  <div className="flex flex-col gap-0.5 items-center">
                    {active ? (
                      (["liminal", "parallax", "praxis", "axiom"] as const).map((tool) =>
                        day.tools[tool] > 0 ? (
                          <span
                            key={tool}
                            className="w-2 h-2 rounded-full"
                            style={{ background: TOOL_COLORS[tool] }}
                            title={`${tool}: ${day.tools[tool]}`}
                          />
                        ) : null
                      )
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-border/30" />
                    )}
                  </div>
                  {/* Day label */}
                  <span className="text-[9px] font-mono text-muted-foreground/40 uppercase">
                    {formatDayLabel(day.date)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
