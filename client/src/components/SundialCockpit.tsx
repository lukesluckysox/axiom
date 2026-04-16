import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/* ── Types ──────────────────────────────────────────────── */
interface DimensionBreakdown {
  parallaxBase: number;
  epistemicBoost: number;
  praxisBoost: number;
  integrityFactor?: number;
  topContributors?: string[];
}
interface Dimension {
  label: string;
  name: string;
  fed: number;
  target: number;
  breakdown?: DimensionBreakdown;
}
interface CockpitState {
  alignment: number;
  dimensions: Dimension[];
  sources: Record<string, boolean>;
}

const FALLBACK: CockpitState = {
  alignment: 50,
  dimensions: [
    { label: "Clarity", name: "clarity", fed: 20, target: 20 },
    { label: "Groundedness", name: "groundedness", fed: 20, target: 20 },
    { label: "Agency", name: "agency", fed: 20, target: 20 },
    { label: "Vitality", name: "vitality", fed: 20, target: 20 },
    { label: "Connection", name: "connection", fed: 20, target: 20 },
    { label: "Expression", name: "expression", fed: 20, target: 20 },
    { label: "Discovery", name: "discovery", fed: 20, target: 20 },
    { label: "Purpose", name: "purpose", fed: 20, target: 20 },
    { label: "Integrity", name: "integrity", fed: 20, target: 20 },
  ],
  sources: {},
};

const GOLD = "#FFD166";
const GOLD_DIM = "rgba(255,209,102,0.30)";
const GOLD_GLOW = "rgba(255,209,102,0.18)";
const MAX_PER_DIM = 40;

/* ── Canvas renderer ────────────────────────────────────── */
function renderCanvas(canvas: HTMLCanvasElement, state: CockpitState) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const W = canvas.width, H = canvas.height;
  const CX = W / 2, CY = H / 2;
  const SUN_R = W * 0.085;
  const INNER_R = W * 0.16;
  const MAX_R = W * 0.36;
  const LABEL_R = W * 0.41;
  const dims = state.dimensions;
  const N = dims.length;
  const STEP = (Math.PI * 2) / N;
  const OFFSET = -Math.PI / 2;

  function valRadius(v: number) {
    return INNER_R + (MAX_R - INNER_R) * Math.max(0, Math.min(1, v / MAX_PER_DIM));
  }
  function pt(angle: number, r: number) {
    return { x: CX + Math.cos(angle) * r, y: CY + Math.sin(angle) * r };
  }

  ctx.clearRect(0, 0, W, H);

  // reference circles
  [10, 20, 30, 40].forEach((v) => {
    ctx.beginPath();
    ctx.arc(CX, CY, valRadius(v), 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,209,102,0.07)";
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // ray axes
  for (let i = 0; i < N; i++) {
    const a = OFFSET + i * STEP;
    const pI = pt(a, INNER_R), pO = pt(a, MAX_R);
    ctx.beginPath(); ctx.moveTo(pI.x, pI.y); ctx.lineTo(pO.x, pO.y);
    ctx.strokeStyle = "rgba(255,209,102,0.10)"; ctx.lineWidth = 1; ctx.stroke();
  }

  // each dimension
  for (let i = 0; i < N; i++) {
    const a = OFFSET + i * STEP;
    const d = dims[i];
    const perpLen = 14;
    const perpX = Math.cos(a + Math.PI / 2) * perpLen;
    const perpY = Math.sin(a + Math.PI / 2) * perpLen;

    // target (dashed)
    const tP = pt(a, valRadius(d.target));
    ctx.beginPath(); ctx.moveTo(tP.x - perpX, tP.y - perpY); ctx.lineTo(tP.x + perpX, tP.y + perpY);
    ctx.strokeStyle = GOLD_DIM; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);

    // fed (solid bright)
    const fP = pt(a, valRadius(d.fed));
    ctx.beginPath(); ctx.moveTo(fP.x - perpX, fP.y - perpY); ctx.lineTo(fP.x + perpX, fP.y + perpY);
    ctx.strokeStyle = GOLD_GLOW; ctx.lineWidth = 6; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(fP.x - perpX, fP.y - perpY); ctx.lineTo(fP.x + perpX, fP.y + perpY);
    ctx.strokeStyle = GOLD; ctx.lineWidth = 2; ctx.globalAlpha = 0.9; ctx.stroke(); ctx.globalAlpha = 1;

    // label
    const lP = pt(a, LABEL_R);
    ctx.font = "500 17px Satoshi, sans-serif";
    ctx.fillStyle = "rgba(255,209,102,0.65)";
    ctx.textBaseline = "middle";
    const deg = ((a * 180 / Math.PI) % 360 + 360) % 360;
    if (deg > 85 && deg < 95) ctx.textAlign = "center";
    else if (deg > 265 && deg < 275) ctx.textAlign = "center";
    else if (deg > 90 && deg < 270) ctx.textAlign = "right";
    else ctx.textAlign = "left";
    ctx.fillText(d.label, lP.x, lP.y);

    // value
    const vP = pt(a, valRadius(d.fed) + 16);
    ctx.font = "600 13px Satoshi, sans-serif";
    ctx.fillStyle = "rgba(255,209,102,0.5)";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(d.fed.toFixed(1), vP.x, vP.y);
  }

  // sun
  const sunGrd = ctx.createRadialGradient(CX, CY, SUN_R * 0.3, CX, CY, SUN_R * 2);
  sunGrd.addColorStop(0, "rgba(255,209,102,0.18)"); sunGrd.addColorStop(1, "rgba(255,209,102,0)");
  ctx.beginPath(); ctx.arc(CX, CY, SUN_R * 2, 0, Math.PI * 2); ctx.fillStyle = sunGrd; ctx.fill();

  const orbGrd = ctx.createRadialGradient(CX, CY - SUN_R * 0.2, 0, CX, CY, SUN_R);
  orbGrd.addColorStop(0, "rgba(255,209,102,0.25)"); orbGrd.addColorStop(0.7, "rgba(255,209,102,0.10)"); orbGrd.addColorStop(1, "rgba(255,209,102,0.03)");
  ctx.beginPath(); ctx.arc(CX, CY, SUN_R, 0, Math.PI * 2); ctx.fillStyle = orbGrd; ctx.fill();

  ctx.beginPath(); ctx.arc(CX, CY, SUN_R, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,209,102,0.2)"; ctx.lineWidth = 1; ctx.stroke();
  ctx.beginPath(); ctx.arc(CX, CY, SUN_R * 0.55, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,209,102,0.12)"; ctx.lineWidth = 0.5; ctx.stroke();

  // alignment score
  let totalFed = 0, totalTarget = 0;
  dims.forEach((d) => { totalFed += d.fed; totalTarget += d.target; });
  const pct = totalTarget > 0 ? Math.min(100, Math.round((totalFed / totalTarget) * 100)) : 0;
  ctx.font = "300 48px Cormorant, serif"; ctx.fillStyle = GOLD;
  ctx.textAlign = "center"; ctx.textBaseline = "alphabetic"; ctx.fillText(String(pct), CX, CY + 4);
  ctx.font = "500 11px Satoshi, sans-serif"; ctx.fillStyle = "rgba(255,209,102,0.45)";
  ctx.textBaseline = "top"; ctx.fillText("ALIGNMENT", CX, CY + 16);
}

/* ── Sundial SVG ray builder ─────────────────────────────── */
const NUM_RAYS = 18;
const SC_CX = 100, SC_CY = 100, SC_INNER = 36, SC_OUTER = 88, SC_BASE_W = 7, SC_TIP_W = 2;

function buildRayPath(index: number, fillPct: number) {
  const a = (index / NUM_RAYS) * Math.PI * 2 - Math.PI / 2;
  const cosA = Math.cos(a), sinA = Math.sin(a);
  const perpCos = Math.cos(a + Math.PI / 2), perpSin = Math.sin(a + Math.PI / 2);
  const rayLen = SC_OUTER - SC_INNER;
  const filledLen = rayLen * Math.min(1, Math.max(0, fillPct));
  const filledOuter = SC_INNER + filledLen;
  const halfBase = SC_BASE_W / 2, halfTip = SC_TIP_W / 2;
  const t = filledLen / rayLen;
  const halfMid = halfBase + (halfTip - halfBase) * t;
  const paths: { d: string; filled: boolean }[] = [];

  if (filledLen > 0.5) {
    const ix1 = SC_CX + cosA * SC_INNER - perpCos * halfBase;
    const iy1 = SC_CY + sinA * SC_INNER - perpSin * halfBase;
    const fx1 = SC_CX + cosA * filledOuter - perpCos * halfMid;
    const fy1 = SC_CY + sinA * filledOuter - perpSin * halfMid;
    const fx2 = SC_CX + cosA * filledOuter + perpCos * halfMid;
    const fy2 = SC_CY + sinA * filledOuter + perpSin * halfMid;
    const ix2 = SC_CX + cosA * SC_INNER + perpCos * halfBase;
    const iy2 = SC_CY + sinA * SC_INNER + perpSin * halfBase;
    paths.push({
      d: `M${ix1.toFixed(2)},${iy1.toFixed(2)} L${fx1.toFixed(2)},${fy1.toFixed(2)} L${fx2.toFixed(2)},${fy2.toFixed(2)} L${ix2.toFixed(2)},${iy2.toFixed(2)} Z`,
      filled: true,
    });
  }
  if (filledLen < rayLen - 0.5) {
    const ux1 = SC_CX + cosA * filledOuter - perpCos * halfMid;
    const uy1 = SC_CY + sinA * filledOuter - perpSin * halfMid;
    const ox1 = SC_CX + cosA * SC_OUTER - perpCos * halfTip;
    const oy1 = SC_CY + sinA * SC_OUTER - perpSin * halfTip;
    const ox2 = SC_CX + cosA * SC_OUTER + perpCos * halfTip;
    const oy2 = SC_CY + sinA * SC_OUTER + perpSin * halfTip;
    const ux2 = SC_CX + cosA * filledOuter + perpCos * halfMid;
    const uy2 = SC_CY + sinA * filledOuter + perpSin * halfMid;
    paths.push({
      d: `M${ux1.toFixed(2)},${uy1.toFixed(2)} L${ox1.toFixed(2)},${oy1.toFixed(2)} L${ox2.toFixed(2)},${oy2.toFixed(2)} L${ux2.toFixed(2)},${uy2.toFixed(2)} Z`,
      filled: false,
    });
  }
  return paths;
}

function sundialRays(dims: Dimension[]) {
  const rayData: number[] = [];
  dims.forEach((d) => {
    const pct = d.target > 0 ? Math.min(1, d.fed / d.target) : 0;
    rayData.push(pct, pct);
  });
  const paths: JSX.Element[] = [];
  for (let r = 0; r < NUM_RAYS; r++) {
    const fill = r < rayData.length ? rayData[r] : 0;
    buildRayPath(r, fill).forEach((p, pi) =>
      paths.push(
        <path key={`${r}-${pi}`} d={p.d}
          fill={p.filled ? GOLD : "rgba(255,209,102,0.15)"}
          opacity={p.filled ? 0.9 : 1}
          filter={p.filled ? "url(#sc-ray-glow)" : undefined}
        />
      )
    );
  }
  return paths;
}

/* ── Component ──────────────────────────────────────────── */
export default function SundialCockpit() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [localTargets, setLocalTargets] = useState<Record<string, number>>({});
  const [activeDim, setActiveDim] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: state = FALLBACK } = useQuery<CockpitState>({
    queryKey: ["/api/cockpit/state"],
    queryFn: async () => {
      const r = await fetch("/api/cockpit/state", { credentials: "same-origin" });
      if (!r.ok) throw new Error("Failed");
      return r.json();
    },
  });

  // Merged state (API + local target overrides)
  const mergedState: CockpitState = {
    ...state,
    dimensions: state.dimensions.map((d) => ({
      ...d,
      target: localTargets[d.name] !== undefined ? localTargets[d.name] : d.target,
    })),
  };

  const saveMutation = useMutation({
    mutationFn: async (targets: Record<string, number>) => {
      const r = await fetch("/api/cockpit/targets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(targets),
      });
      return r.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cockpit/state"] });
      setLocalTargets({});
    },
  });

  // Draw canvas whenever expanded view changes
  useEffect(() => {
    if (expanded && canvasRef.current) {
      renderCanvas(canvasRef.current, mergedState);
    }
  }, [expanded, mergedState]);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    const cx = rect.width / 2, cy = rect.height / 2;
    const x = e.clientX - rect.left - cx, y = e.clientY - rect.top - cy;
    const sunR = c.width * 0.085 * 1.5 * (rect.width / c.width);
    if (Math.sqrt(x * x + y * y) <= sunR) setExpanded(false);
  }, []);

  const totalFed = mergedState.dimensions.reduce((s, d) => s + d.fed, 0);
  const totalTarget = mergedState.dimensions.reduce((s, d) => s + d.target, 0);
  const pct = totalTarget > 0 ? Math.min(100, Math.round((totalFed / totalTarget) * 100)) : 0;

  const sourceNames: Record<string, string> = { parallax: "Parallax", epistemic: "Loop", praxis: "Praxis", axiom: "Axiom" };

  return (
    <div className="mb-6">
      {/* ─ Compact sundial (collapsed) ─ */}
      {!expanded && (
        <button onClick={() => setExpanded(true)} className="w-full flex items-center gap-4 py-4 group cursor-pointer">
          <div className="w-20 h-20 flex-shrink-0">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <defs>
                <radialGradient id="sc-orb-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFD166" stopOpacity="0.25" />
                  <stop offset="70%" stopColor="#FFD166" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#FFD166" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="sc-orb-fill" cx="50%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#FFD166" stopOpacity="0.3" />
                  <stop offset="60%" stopColor="#FFD166" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#FFD166" stopOpacity="0.04" />
                </radialGradient>
                <filter id="sc-ray-glow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <g>{sundialRays(mergedState.dimensions)}</g>
              <circle cx="100" cy="100" r="36" stroke="rgba(255,209,102,0.1)" strokeWidth="0.5" fill="none" />
              <circle cx="100" cy="100" r="50" fill="url(#sc-orb-glow)" />
              <circle cx="100" cy="100" r="24" fill="url(#sc-orb-fill)" />
              <circle cx="100" cy="100" r="24" stroke="rgba(255,209,102,0.22)" strokeWidth="0.7" fill="none" />
              <circle cx="100" cy="100" r="15" stroke="rgba(255,209,102,0.1)" strokeWidth="0.4" fill="none" />
            </svg>
          </div>
          <div className="text-left">
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-2xl font-light text-[var(--gold)]">{pct}</span>
              <span className="text-xs text-[var(--gold)]/50">%</span>
              <span className="text-xs text-muted-foreground/40 ml-1">Alignment</span>
            </div>
            <div className="text-[10px] font-mono text-muted-foreground/30 mt-0.5">
              Current: <strong className="text-muted-foreground/50">{Math.round(totalFed)}</strong> / Target: <strong className="text-muted-foreground/50">{Math.round(totalTarget)}</strong>
            </div>
          </div>
        </button>
      )}

      {/* ─ Expanded view ─ */}
      {expanded && (
        <div className="py-4 space-y-4">
          {/* Canvas */}
          <div className="relative max-w-[420px] mx-auto aspect-square">
            <canvas ref={canvasRef} width={840} height={840} onClick={handleCanvasClick}
              className="w-full h-full cursor-default" style={{ cursor: "default" }} />
          </div>

          {/* Dimension detail */}
          <div className="grid grid-cols-3 gap-2">
            {mergedState.dimensions.map((d) => {
              const dp = d.target > 0 ? Math.min(100, Math.round((d.fed / d.target) * 100)) : 0;
              return (
                <button key={d.name} onClick={() => setActiveDim(activeDim === d.name ? null : d.name)}
                  className={`text-left p-2 rounded-md border transition-colors ${activeDim === d.name ? "border-[var(--gold)]/30 bg-[var(--gold-dim)]" : "border-border/30 bg-[var(--surface)]/50"}`}>
                  <div className="text-[10px] font-mono text-muted-foreground/60">{d.label}</div>
                  <div className="h-1 rounded-full bg-border/30 mt-1 mb-0.5">
                    <div className="h-full rounded-full bg-[var(--gold)]" style={{ width: `${dp}%` }} />
                  </div>
                  <div className="text-[9px] font-mono text-muted-foreground/30">{Math.round(d.fed)} / {Math.round(d.target)} — {dp}%</div>
                </button>
              );
            })}
          </div>

          {/* Drilldown */}
          {activeDim && (() => {
            const dim = mergedState.dimensions.find((d) => d.name === activeDim);
            if (!dim?.breakdown) return null;
            const bd = dim.breakdown;
            const bars = dim.name === "integrity"
              ? [{ label: "Integrity", value: bd.integrityFactor || 0, max: 40 }]
              : [{ label: "Parallax", value: bd.parallaxBase, max: 40 }, { label: "Epistemic", value: bd.epistemicBoost, max: 4 }, { label: "Praxis", value: bd.praxisBoost, max: 3 }];
            return (
              <div className="p-3 rounded-lg border border-border/30 bg-[var(--surface)]/50 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">{dim.label}</h3>
                  <button onClick={() => setActiveDim(null)} className="text-muted-foreground/40 hover:text-foreground">&times;</button>
                </div>
                {bars.map((b) => {
                  const bp = b.max > 0 ? Math.round(Math.min(100, (b.value / b.max) * 100)) : 0;
                  return (
                    <div key={b.label} className="flex items-center gap-2">
                      <span className="w-16 text-[10px] font-mono text-muted-foreground/50">{b.label}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-border/30"><div className="h-full rounded-full bg-[var(--gold)]" style={{ width: `${bp}%` }} /></div>
                      <span className="w-8 text-right text-[10px] font-mono text-muted-foreground/40">{(Math.round(b.value * 10) / 10)}</span>
                    </div>
                  );
                })}
                {bd.topContributors?.map((c, i) => (
                  <p key={i} className="text-[10px] text-muted-foreground/40">{c}</p>
                ))}
              </div>
            );
          })()}

          {/* Sources */}
          <div className="flex flex-wrap gap-3 justify-center">
            {Object.entries(sourceNames).map(([k, v]) => (
              <span key={k} className={`text-[9px] font-mono uppercase tracking-widest flex items-center gap-1.5 ${state.sources[k] ? "text-[var(--gold)]/60" : "text-muted-foreground/20"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${state.sources[k] ? "bg-[var(--gold)]" : "bg-muted-foreground/20"}`} />
                {v}
              </span>
            ))}
          </div>

          {/* Dimension chips */}
          <div className="flex flex-wrap gap-1.5 justify-center">
            {mergedState.dimensions.map((d) => (
              <button key={d.name} onClick={() => setActiveDim(activeDim === d.name ? null : d.name)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono border transition-colors ${activeDim === d.name ? "border-[var(--gold)]/40 text-[var(--gold)] bg-[var(--gold-dim)]" : "border-border/30 text-muted-foreground/50 hover:text-[var(--gold)]"}`}>
                {d.label} {Math.round(d.fed)}
              </button>
            ))}
          </div>

          {/* Settings toggle */}
          <div className="flex justify-center">
            <button onClick={() => setSettingsOpen(!settingsOpen)}
              className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/40 hover:text-[var(--gold)] transition-colors flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className={`transition-transform ${settingsOpen ? "rotate-180" : ""}`}>
                <path d="M12 15.5l-6-6h12l-6 6z" fill="currentColor" stroke="none" />
              </svg>
              Set Targets
            </button>
          </div>

          {/* Settings panel */}
          {settingsOpen && (
            <div className="p-4 rounded-lg border border-border/30 bg-[var(--surface)]/50 space-y-3">
              <div className="text-xs text-muted-foreground/50 text-center">
                Target Total: <strong className="text-foreground">{Math.round(totalTarget)}</strong> / 360
              </div>
              <div className="space-y-2">
                {mergedState.dimensions.map((d) => (
                  <div key={d.name} className="flex items-center gap-3">
                    <span className="w-24 text-[10px] font-mono text-muted-foreground/50">{d.label}</span>
                    <input type="range" min={0} max={40} step={1} value={d.target}
                      onChange={(e) => setLocalTargets((prev) => ({ ...prev, [d.name]: Number(e.target.value) }))}
                      className="flex-1 accent-[var(--gold)]" />
                    <span className="w-12 text-right text-[10px] font-mono text-muted-foreground/40">{Math.round(d.target)}/40</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center pt-1">
                <button
                  onClick={() => {
                    const targets: Record<string, number> = {};
                    mergedState.dimensions.forEach((d) => { targets[d.name] = d.target; });
                    saveMutation.mutate(targets);
                  }}
                  disabled={saveMutation.isPending}
                  className="px-6 py-1.5 rounded-md bg-[var(--gold)] text-background text-xs font-medium hover:opacity-90 disabled:opacity-40 transition-opacity"
                >
                  {saveMutation.isPending ? "Saving..." : saveMutation.isSuccess ? "Saved" : "Save Targets"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
