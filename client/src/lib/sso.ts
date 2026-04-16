/** Navigate to a sub-app with SSO token if available (opens in new tab) */
export async function ssoNavigate(destUrl: string) {
  // Open a blank tab immediately (must be in response to user gesture)
  const newWin = window.open("about:blank", "_blank");

  try {
    const res = await fetch("/api/auth/sso-token", { credentials: "same-origin" });
    if (res.ok) {
      const data = await res.json();
      const parsed = new URL(destUrl);
      const deepLink = parsed.pathname + parsed.search + parsed.hash;
      const finalDest =
        parsed.origin +
        "/api/auth/sso?token=" +
        encodeURIComponent(data.token) +
        "&redirect=" +
        encodeURIComponent(deepLink);
      if (newWin) {
        newWin.location.href = finalDest;
      } else {
        window.open(finalDest, "_blank");
      }
      return;
    }
  } catch {}

  // Fallback: just navigate to the dest
  if (newWin) {
    newWin.location.href = destUrl;
  } else {
    window.open(destUrl, "_blank");
  }
}
