import { useState, useEffect, useCallback } from "react";

interface ProfileData {
  username: string;
  email: string;
  sensitivity: string;
  plan: string;
  createdAt: string;
  isOwner: boolean;
}

interface OracleUser {
  id: number;
  username?: string;
  name?: string;
  email?: string;
  role?: string;
  plan?: string;
  createdAt?: string;
  created_at?: string;
}

interface OracleData {
  lumen: OracleUser[];
  liminal: OracleUser[];
  parallax: OracleUser[];
  praxis: OracleUser[];
  axiom: OracleUser[];
  subAppStatus: Record<string, string>;
}

const APPS = ["lumen", "liminal", "parallax", "praxis", "axiom"] as const;
const APP_LABELS: Record<string, string> = { lumen: "Lumen", liminal: "Liminal", parallax: "Parallax", praxis: "Praxis", axiom: "Axiom" };

function formatDate(iso?: string) {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }); }
  catch { return iso; }
}

interface Props { open: boolean; onClose: () => void; onLogout: () => void; }

export default function ProfilePanel({ open, onClose, onLogout }: Props) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [oracleData, setOracleData] = useState<OracleData | null>(null);
  const [oracleTab, setOracleTab] = useState("lumen");
  const [oracleLoading, setOracleLoading] = useState(false);
  const [wide, setWide] = useState(false);

  // Load profile when opened
  useEffect(() => {
    if (!open) return;
    fetch("/api/auth/profile", { credentials: "same-origin" })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        if (d) {
          setProfile(d);
          if (d.isOwner) loadOracle();
        }
      })
      .catch(() => {});
  }, [open]);

  const loadOracle = useCallback(async () => {
    setOracleLoading(true);
    try {
      const res = await fetch("/api/oracle/users", { credentials: "same-origin" });
      if (res.ok) setOracleData(await res.json());
    } catch {}
    setOracleLoading(false);
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  async function setPlan(userId: number, plan: string) {
    try {
      const res = await fetch(`/api/oracle/users/${userId}/plan`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "same-origin",
        body: JSON.stringify({ plan }),
      });
      if (!res.ok) { const e = await res.json(); alert(e.error || "Failed"); return; }
      setOracleData((prev) => {
        if (!prev) return prev;
        return { ...prev, lumen: prev.lumen.map((u) => u.id === userId ? { ...u, plan } : u) };
      });
    } catch (e: any) { alert("Error: " + e.message); }
  }

  async function deleteUser(userId: number, username: string) {
    if (!confirm(`Delete user "${username}" from Lumen AND all sub-apps? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/oracle/users/${userId}`, { method: "DELETE", credentials: "same-origin" });
      if (!res.ok) { const e = await res.json(); alert(e.error || "Failed"); return; }
      setOracleData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          lumen: prev.lumen.filter((u) => u.id !== userId),
          liminal: prev.liminal.filter((u) => (u.username || u.name) !== username),
          parallax: prev.parallax.filter((u) => (u.username || u.name) !== username),
          praxis: prev.praxis.filter((u) => (u.username || u.name) !== username),
          axiom: prev.axiom.filter((u) => (u.username || u.name) !== username),
        };
      });
    } catch (e: any) { alert("Error: " + e.message); }
  }

  async function deleteAppUser(app: string, username: string, email: string) {
    if (!confirm(`Delete user "${username}" from ${app} only?`)) return;
    try {
      const res = await fetch(`/api/oracle/app/${app}/user`, {
        method: "DELETE", credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email }),
      });
      if (!res.ok) { const e = await res.json(); alert(e.error || "Failed"); return; }
      setOracleData((prev) => {
        if (!prev) return prev;
        return { ...prev, [app]: (prev as any)[app].filter((u: OracleUser) => (u.username || u.name) !== username) };
      });
    } catch (e: any) { alert("Error: " + e.message); }
  }

  if (!open) return null;

  const oracleRows = oracleData ? (oracleData as any)[oracleTab] || [] : [];
  const hasEmail = oracleRows.some((u: OracleUser) => u.email);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[998] bg-black/50 transition-opacity" onClick={onClose} />

      {/* Panel */}
      <div className={`fixed top-0 right-0 bottom-0 z-[999] bg-background border-l border-border/30 overflow-y-auto transition-all ${wide ? "w-[90vw] max-w-[800px]" : "w-[340px] max-w-[90vw]"}`}>
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm flex items-center justify-between px-4 py-3 border-b border-border/20">
          <h2 className="font-serif text-base font-semibold text-foreground">Profile</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setWide(!wide)}
              className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 border border-border/30 rounded px-2 py-0.5 hover:text-foreground hover:border-foreground/30 transition-colors">
              {wide ? "Collapse" : "Expand"}
            </button>
            <button onClick={onClose} className="text-muted-foreground/40 hover:text-foreground transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Profile info */}
          {profile && (
            <div className="space-y-2">
              <p className="font-serif text-lg font-semibold text-foreground">{profile.username}</p>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="font-mono uppercase tracking-wider text-muted-foreground/40">Email</span>
                  <span className="text-muted-foreground/60">{profile.email}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="font-mono uppercase tracking-wider text-muted-foreground/40">Member since</span>
                  <span className="text-muted-foreground/60">{formatDate(profile.createdAt)}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="font-mono uppercase tracking-wider text-muted-foreground/40">Sensitivity</span>
                  <span className="text-muted-foreground/60 capitalize">{profile.sensitivity || "medium"}</span>
                </div>
              </div>
              <button onClick={onLogout}
                className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground/40 hover:text-red-400 transition-colors mt-2">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                </svg>
                Sign out
              </button>
            </div>
          )}

          {/* Oracle section */}
          {profile?.isOwner && (
            <div className="border-t border-border/20 pt-4">
              <div className="flex items-center gap-1.5 mb-3">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                  <ellipse cx="12" cy="12" rx="10" ry="4" />
                  <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                </svg>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--gold)]/60">Oracle</span>
              </div>

              {oracleLoading ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground/40">
                  <div className="w-3 h-3 border border-[var(--gold)]/30 border-t-[var(--gold)] rounded-full animate-spin" />
                  Loading oracle data...
                </div>
              ) : oracleData ? (
                <>
                  {/* Tabs */}
                  <div className="flex gap-1 mb-3 flex-wrap">
                    {APPS.map((app) => {
                      const status = app === "lumen" ? "online" : (oracleData.subAppStatus[app] || "offline");
                      return (
                        <button key={app} onClick={() => setOracleTab(app)}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${oracleTab === app ? "bg-[var(--gold-dim)] text-[var(--gold)] border border-[var(--gold)]/20" : "text-muted-foreground/40 border border-transparent hover:text-muted-foreground/60"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status === "online" ? "bg-green-400" : "bg-muted-foreground/20"}`} />
                          {APP_LABELS[app]}
                        </button>
                      );
                    })}
                  </div>

                  {/* Table */}
                  {oracleRows.length === 0 ? (
                    <p className="text-[10px] text-muted-foreground/30">
                      {oracleTab !== "lumen" && oracleData.subAppStatus[oracleTab] === "offline"
                        ? "Service offline — unable to fetch users."
                        : "No registered users."}
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <p className="text-[10px] text-muted-foreground/40 mb-1">
                        <strong>{oracleRows.length}</strong> registered user{oracleRows.length !== 1 ? "s" : ""}
                      </p>
                      <table className="w-full text-[10px]">
                        <thead>
                          <tr className="text-left text-muted-foreground/30 border-b border-border/20">
                            <th className="pb-1 pr-2 font-mono">Username</th>
                            {hasEmail && <th className="pb-1 pr-2 font-mono">Email</th>}
                            <th className="pb-1 pr-2 font-mono">Joined</th>
                            <th className="pb-1 pr-2 font-mono">Plan</th>
                            <th className="pb-1 font-mono"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {oracleRows.map((u: OracleUser, i: number) => {
                            const uname = u.username || u.name || "—";
                            const joined = formatDate(u.createdAt || u.created_at);
                            const currentPlan = u.plan || "aspirant";
                            const isOracle = u.role === "oracle";
                            return (
                              <tr key={i} className="border-b border-border/10">
                                <td className="py-1 pr-2 text-muted-foreground/60">
                                  {uname} {isOracle && <span className="text-[var(--gold)] text-[9px]">◆</span>}
                                </td>
                                {hasEmail && <td className="py-1 pr-2 text-muted-foreground/30">{u.email || "—"}</td>}
                                <td className="py-1 pr-2 text-muted-foreground/30 whitespace-nowrap">{joined}</td>
                                <td className="py-1 pr-2">
                                  {oracleTab === "lumen" ? (
                                    <span className="flex gap-0.5">
                                      {["aspirant", "fellow", "founder"].map((p) => (
                                        <button key={p} onClick={() => setPlan(u.id, p)}
                                          className={`px-1.5 py-0.5 rounded text-[9px] font-mono transition-colors ${currentPlan === p ? "bg-[var(--gold-dim)] text-[var(--gold)] border border-[var(--gold)]/20" : "text-muted-foreground/30 border border-border/20 hover:text-muted-foreground/50"}`}>
                                          {p}
                                        </button>
                                      ))}
                                    </span>
                                  ) : (
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[var(--gold-dim)] text-[var(--gold)]">{currentPlan}</span>
                                  )}
                                </td>
                                <td className="py-1">
                                  {!isOracle && (
                                    <button onClick={() => oracleTab === "lumen" ? deleteUser(u.id, uname) : deleteAppUser(oracleTab, uname, u.email || "")}
                                      className="text-muted-foreground/20 hover:text-red-400 transition-colors text-sm" title={oracleTab === "lumen" ? "Delete from Lumen + all sub-apps" : `Delete from ${oracleTab} only`}>
                                      ×
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
