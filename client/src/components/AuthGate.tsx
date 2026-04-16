import { useState } from "react";

interface AuthGateProps {
  onAuth: (username: string) => void;
}

/* ── Plan Card Data ── */
const PLANS = [
  {
    id: "aspirant",
    name: "Aspirant",
    price: "Free forever",
    fellow: false,
    sections: [
      { app: "Liminal", features: ["All six thinking tools", "8 sessions per month", "7-day session archive"] },
      { app: "Parallax", features: ["Check-ins and gauges", "Baseline radar chart", "Archetype tracking", "Trajectory (data-driven unlock)", "Decision evaluation"] },
      { app: "Praxis & Axiom", features: ["Full access"] },
    ],
  },
  {
    id: "fellow",
    name: "Fellow",
    price: "$15 / month · coming soon",
    fellow: true,
    sections: [
      { app: "Liminal", features: ["All six thinking tools", "Unlimited sessions", "Full session archive", "Session comparison", "Markdown export"] },
      { app: "Parallax", features: ["Everything in Aspirant", "Daily Reading", "Feeling interpretation", "Decision analysis & suggestions", "Writing analysis", "Sonic Reading", "Signal Forecast", "Identity Wrapped"] },
      { app: "Praxis & Axiom", features: ["Full access"] },
    ],
  },
];

function PlanCard({ plan }: { plan: (typeof PLANS)[0] }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`overflow-hidden rounded-md border text-left transition-colors ${
        plan.fellow
          ? "border-[var(--gold)]/18"
          : "border-border/30"
      }`}
      style={{
        background: plan.fellow
          ? "linear-gradient(135deg, var(--surface) 0%, rgba(255,209,102,.03) 100%)"
          : "var(--surface)",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-2.5 hover:bg-[rgba(141,153,174,.04)] transition-colors select-none"
        aria-expanded={open}
      >
        <span className="flex items-baseline gap-2">
          <span className={`font-serif text-sm ${plan.fellow ? "text-[var(--gold)]" : "text-foreground"}`}>
            {plan.name}
          </span>
          <span className="text-[10px] text-muted-foreground/40 tracking-wide">{plan.price}</span>
        </span>
        <span
          className="text-sm text-muted-foreground/40 leading-none transition-transform"
          style={{ transform: open ? "rotate(45deg)" : "none" }}
        >
          +
        </span>
      </button>

      <div
        className="overflow-hidden transition-all"
        style={{ maxHeight: open ? "400px" : "0", padding: open ? "0 1rem 0.75rem" : "0 1rem" }}
      >
        {plan.sections.map((sec) => (
          <div key={sec.app}>
            <p className="mt-2 mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {sec.app}
            </p>
            <ul>
              {sec.features.map((f) => (
                <li key={f} className="relative pl-3.5 text-[11px] leading-[1.7] text-muted-foreground">
                  <span
                    className="absolute left-1 top-0"
                    style={{ color: plan.fellow ? "var(--gold)" : undefined, opacity: plan.fellow ? 0.6 : undefined }}
                  >
                    ·
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AuthGate({ onAuth }: AuthGateProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!emailOrUsername || !password) { setError("Username or email and password required."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email: emailOrUsername, password }),
      });
      const data = await res.json();
      if (res.ok) { onAuth(data.username); }
      else { setError(data.error || "Login failed."); }
    } catch { setError("Network error. Try again."); }
    finally { setLoading(false); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!regUsername || !regEmail || !password || !confirmPassword) { setError("All fields required."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ username: regUsername, email: regEmail, password }),
      });
      const data = await res.json();
      if (res.ok) { onAuth(data.username); }
      else { setError(data.error || "Registration failed."); }
    } catch { setError("Network error. Try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-background overflow-y-auto">
      <div className="w-full max-w-sm px-6 py-8 space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <svg width="56" height="56" viewBox="0 0 100 100" fill="none" className="mx-auto">
            <circle cx="50" cy="50" r="46" stroke="var(--gold)" strokeWidth="2" strokeDasharray="0 0 145 145" strokeLinecap="round" opacity="0.5"/>
            <circle cx="50" cy="50" r="12" fill="var(--gold)" opacity="0.9"/>
          </svg>
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground">Lumen</h1>
          <p className="text-xs text-muted-foreground">An operating system for the examined life</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 justify-center border-b border-border/30 pb-1">
          <button onClick={() => { setMode("login"); setError(""); }}
            className={`text-xs font-mono uppercase tracking-wider pb-1 border-b-2 transition-colors ${mode === "login" ? "border-[var(--gold)] text-[var(--gold)]" : "border-transparent text-muted-foreground/40"}`}>
            Sign In
          </button>
          <button onClick={() => { setMode("register"); setError(""); }}
            className={`text-xs font-mono uppercase tracking-wider pb-1 border-b-2 transition-colors ${mode === "register" ? "border-[var(--gold)] text-[var(--gold)]" : "border-transparent text-muted-foreground/40"}`}>
            Register
          </button>
        </div>

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-3">
            <input type="text" placeholder="Username or email" value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)} autoFocus autoComplete="username"
              className="w-full px-3 py-2.5 rounded-lg bg-[var(--surface)] border border-border text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[var(--gold)]/30 transition-colors" />
            <input type="password" placeholder="Password" value={password}
              onChange={(e) => setPassword(e.target.value)} autoComplete="current-password"
              className="w-full px-3 py-2.5 rounded-lg bg-[var(--surface)] border border-border text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[var(--gold)]/30 transition-colors" />
            {error && <p className="text-xs text-red-400 text-center">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg bg-[var(--gold)] text-background text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-1.5">
              {loading ? "Signing in…" : <>Enter Lumen <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3">
            <input type="text" placeholder="Username" value={regUsername}
              onChange={(e) => setRegUsername(e.target.value)} autoFocus autoComplete="username"
              className="w-full px-3 py-2.5 rounded-lg bg-[var(--surface)] border border-border text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[var(--gold)]/30 transition-colors" />
            <input type="email" placeholder="Email" value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)} autoComplete="email"
              className="w-full px-3 py-2.5 rounded-lg bg-[var(--surface)] border border-border text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[var(--gold)]/30 transition-colors" />
            <input type="password" placeholder="Password" value={password}
              onChange={(e) => setPassword(e.target.value)} autoComplete="new-password"
              className="w-full px-3 py-2.5 rounded-lg bg-[var(--surface)] border border-border text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[var(--gold)]/30 transition-colors" />
            <input type="password" placeholder="Confirm password" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password"
              className="w-full px-3 py-2.5 rounded-lg bg-[var(--surface)] border border-border text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[var(--gold)]/30 transition-colors" />
            {error && <p className="text-xs text-red-400 text-center">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg bg-[var(--gold)] text-background text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-1.5">
              {loading ? "Creating account…" : <>Create account <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>}
            </button>
          </form>
        )}

        {/* Plan cards — collapsible, below auth form */}
        <div className="space-y-1.5 pt-2">
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </div>
  );
}
