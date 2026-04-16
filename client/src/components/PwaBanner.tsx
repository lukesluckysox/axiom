import { useState, useEffect, useRef, useCallback } from "react";

export default function PwaBanner() {
  const [visible, setVisible] = useState(false);
  const deferredPromptRef = useRef<any>(null);

  useEffect(() => {
    const isInstalled = () => localStorage.getItem("lumen_pwa_installed") === "true";
    const isDismissed = () => localStorage.getItem("lumen_pwa_prompt_dismissed") === "true";

    const handler = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e;
      if (!isInstalled() && !isDismissed()) {
        setVisible(true);
      }
    };

    const installedHandler = () => {
      localStorage.setItem("lumen_pwa_installed", "true");
      setVisible(false);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    const prompt = deferredPromptRef.current;
    if (!prompt) return;
    prompt.prompt();
    const result = await prompt.userChoice;
    if (result.outcome === "accepted") {
      localStorage.setItem("lumen_pwa_installed", "true");
    } else {
      localStorage.setItem("lumen_pwa_prompt_dismissed", "true");
    }
    deferredPromptRef.current = null;
    setVisible(false);
  }, []);

  const handleDismiss = useCallback(() => {
    localStorage.setItem("lumen_pwa_prompt_dismissed", "true");
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[9999] flex items-center justify-between gap-3 border-t px-5 py-3 transition-all duration-300 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:max-w-[480px] sm:rounded-t-md sm:border sm:border-b-0`}
      style={{
        background: "var(--surface)",
        borderColor: "rgba(141,153,174,.17)",
        paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <p className="flex-1 text-[13px]" style={{ color: "var(--text)" }}>
        Add Lumen to your home screen for the full experience
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={handleInstall}
          className="whitespace-nowrap rounded px-4 py-2 text-xs font-semibold uppercase tracking-wider"
          style={{
            background: "var(--gold)",
            color: "#1a1a2e",
            minHeight: "44px",
          }}
        >
          Install
        </button>
        <button
          onClick={handleDismiss}
          className="flex items-center justify-center text-lg"
          style={{ color: "rgba(141,153,174,.4)", minWidth: "44px", minHeight: "44px" }}
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
}
