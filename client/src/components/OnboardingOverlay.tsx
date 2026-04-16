import { useState, useEffect, useRef, useCallback } from "react";
import { ssoNavigate } from "@/lib/sso";

const STEPS = [
  { heading: "The examined life begins here.", body: "Lumen is four instruments working as one system. Each feeds the next. Start with one session in Liminal — everything else follows.", cta: "Begin in Liminal →", highlight: 0 },
  { heading: "Session complete.", body: "Your reflection is now flowing through the system. Parallax is reading it for patterns.", cta: "See what Parallax found →", highlight: 1 },
  { heading: "Patterns recognized.", body: "Parallax detected signals in your reflection. These become hypotheses for Praxis to test.", cta: "Review in Praxis →", highlight: 2 },
  { heading: "Hypothesis proposed.", body: "A belief surfaced for testing. As you observe and record results, the findings flow to Axiom.", cta: "See Axiom →", highlight: 3 },
  { heading: "The Loop is alive.", body: "Each session feeds the next. The more you reflect, the sharper the system becomes.", cta: "Enter Lumen", highlight: -1 },
];

const APP_URLS = [
  "https://liminal-app.up.railway.app",
  "https://parallaxapp.up.railway.app",
  "https://praxis-app.up.railway.app",
  "https://axiomtool-production.up.railway.app",
];

const NODES = [
  { name: "Liminal", color: "#9c8654", x: 100, y: 15 },
  { name: "Parallax", color: "#4d8c9e", x: 185, y: 100 },
  { name: "Praxis", color: "#c4943e", x: 100, y: 185 },
  { name: "Axiom", color: "#3d7bba", x: 15, y: 100 },
];

function getStepFromSummary(s: { sessions: number; patterns: number; experiments: number; axioms: number }) {
  if (!s || (s.sessions === 0 && s.patterns === 0 && s.experiments === 0 && s.axioms === 0)) return 0;
  if (s.sessions > 0 && s.patterns === 0) return 1;
  if (s.patterns > 0 && s.experiments === 0) return 2;
  if (s.experiments > 0 && s.axioms === 0) return 3;
  return 4;
}

export default function OnboardingOverlay() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const dismiss = useCallback(() => {
    localStorage.setItem("lumen_onboarding_complete", "true");
    setVisible(false);
    if (pollRef.current) clearInterval(pollRef.current);
  }, []);

  const checkAndShow = useCallback(async () => {
    if (localStorage.getItem("lumen_onboarding_complete")) return;
    try {
      const res = await fetch("/api/loop/summary", { credentials: "same-origin" });
      if (!res.ok) return;
      const data = await res.json();
      const s = getStepFromSummary(data);
      if (s < 4) {
        setStep(s);
        setVisible(true);
        pollRef.current = setInterval(async () => {
          try {
            const r = await fetch("/api/loop/summary", { credentials: "same-origin" });
            if (!r.ok) return;
            const d = await r.json();
            const ns = getStepFromSummary(d);
            if (ns > s) setStep(ns);
          } catch {}
        }, 5000);
      } else {
        /* User has completed the full loop — mark done automatically */
        localStorage.setItem("lumen_onboarding_complete", "true");
      }
    } catch {}
  }, []);

  useEffect(() => {
    const t = setTimeout(checkAndShow, 1200);
    return () => {
      clearTimeout(t);
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [checkAndShow]);

  const handleCta = useCallback(() => {
    if (step === 4) {
      dismiss();
      localStorage.setItem("lumen_first_session_completed", "true");
    } else {
      ssoNavigate(APP_URLS[step]);
    }
  }, [step, dismiss]);

  if (!visible) return null;

  const s = STEPS[step];

  /* ── Render as a dismissible bottom-anchored card, NOT full-screen blocker ── */
  return (
    <div id="onboarding-overlay" style={{
      position: "fixed",
      bottom: "calc(72px + env(safe-area-inset-bottom, 0px))",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 9998,
      width: "calc(100% - 2rem)",
      maxWidth: "440px",
      pointerEvents: "auto",
    }}>
      <div id="onboarding-card" style={{
        background: "var(--bg)",
        border: "1px solid rgba(255,209,102,0.18)",
        borderRadius: "12px",
        padding: "1.5rem",
        textAlign: "center",
        boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
      }}>
        {/* Dismiss / close */}
        <button onClick={dismiss} aria-label="Dismiss onboarding" style={{
          position: "absolute", top: "0.6rem", right: "0.8rem",
          background: "none", border: "none", color: "var(--muted)",
          fontSize: "18px", cursor: "pointer", opacity: 0.6, lineHeight: 1,
        }}>&times;</button>

        {/* Diamond diagram */}
        <svg width="120" height="132" viewBox="0 0 200 220" style={{ margin: "0 auto 1rem", display: "block" }}>
          <path d="M100,15 L185,100 L100,185 L15,100 Z" fill="none" stroke="rgba(255,209,102,0.1)" strokeWidth="1" />
          {NODES.map((n, i) => {
            const isHighlight = s.highlight === i || s.highlight === -1;
            return (
              <g key={n.name}>
                <circle cx={n.x} cy={n.y} r={isHighlight ? 7 : 5} fill={n.color} opacity={isHighlight ? 1 : 0.25} />
                <text x={n.x} y={n.y + 18} textAnchor="middle"
                  fill={isHighlight ? "rgba(255,209,102,0.7)" : "rgba(255,255,255,0.15)"}
                  fontSize="8" fontFamily="Satoshi, sans-serif" fontWeight="500" letterSpacing="0.12em">
                  {n.name.toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>

        <h2 style={{ fontFamily: "var(--font-head)", fontSize: "clamp(1rem, 2vw, 1.2rem)", fontWeight: 300, color: "var(--text)", marginBottom: "0.5rem" }}>{s.heading}</h2>
        <p style={{ fontSize: "var(--text-xs)", color: "var(--muted)", lineHeight: 1.6, marginBottom: "1rem", maxWidth: "34ch", marginInline: "auto" }}>{s.body}</p>
        <button onClick={handleCta} style={{
          fontSize: "var(--text-xs)", fontWeight: 500, letterSpacing: "0.05em",
          color: "var(--gold)", background: "rgba(255,209,102,0.08)",
          border: "1px solid rgba(255,209,102,0.2)", borderRadius: "6px",
          padding: "0.6rem 1.5rem", cursor: "pointer", transition: "background 0.2s",
        }}>
          {s.cta}
        </button>
      </div>
    </div>
  );
}
