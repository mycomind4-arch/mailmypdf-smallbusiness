const AUTH_KEY = "mailmypdf_business_auth";

function runCheckoutReturn() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const result = params.get("checkout");
  const sessionId = params.get("session_id");
  if (result !== "success" || !sessionId) return;

  let session: { access_token?: string } | null = null;
  try { session = JSON.parse(localStorage.getItem(AUTH_KEY) || "null") as { access_token?: string } | null; } catch { session = null; }
  if (!session?.access_token) return;

  void fetch("/api/mail/response", {
    method: "POST",
    headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ stripeSessionId: sessionId }),
  }).then(async (response) => {
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) console.error("MailMyPDF Business checkout return failed:", payload?.error || response.status);
    const clean = new URL(window.location.href);
    clean.searchParams.delete("checkout");
    clean.searchParams.delete("session_id");
    window.history.replaceState({}, "", clean.toString());
    window.dispatchEvent(new CustomEvent("mailmypdf:checkout", { detail: payload }));
  }).catch((error) => console.error("MailMyPDF Business checkout return failed:", error));
}

runCheckoutReturn();
