import { requireAuthenticatedUser, json } from "../_auth";

type Env = { SUPABASE_URL?: string; SUPABASE_SERVICE_ROLE_KEY?: string };
async function db(env: Env, path: string, init: RequestInit = {}) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase server configuration is incomplete.");
  return fetch(`${env.SUPABASE_URL.replace(/\/$/, "")}/rest/v1/${path}`, { ...init, headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`, "content-type": "application/json", ...(init.headers || {}) } });
}
export const onRequestPost = async ({ request, env }: { request: Request; env: Env }): Promise<Response> => {
  try {
    const user = await requireAuthenticatedUser(request, env);
    const input = await request.json() as { businessId?: string; intentId?: string; recipientId?: string; documentId?: string; scheduledFor?: string };
    if (!input.businessId || !input.intentId || !input.recipientId || !input.documentId) return json({ error: "Business, intent, recipient, and document are required." }, 400);
    const membership = await db(env, `business_members?business_id=eq.${encodeURIComponent(input.businessId)}&user_id=eq.${encodeURIComponent(user.id)}&select=business_id`);
    if (!membership.ok || (await membership.json() as unknown[]).length === 0) return json({ error: "Business access denied." }, 403);
    const intentResponse = await db(env, `mailing_intents?id=eq.${encodeURIComponent(input.intentId)}&business_id=eq.${encodeURIComponent(input.businessId)}&requested_by=eq.${encodeURIComponent(user.id)}&select=id,status,mail_job_id,mailing_method,draft_content,recipient`);
    if (!intentResponse.ok) return json({ error: "Unable to load mailing intent." }, 502);
    const intents = await intentResponse.json() as Array<{ id: string; status: string; mail_job_id?: string | null; mailing_method: string; draft_content: string; recipient: Record<string, unknown> }>;
    const intent = intents[0]; if (!intent) return json({ error: "Mailing intent not found." }, 404);
    if (intent.status !== "pending") return json({ error: "Only pending intents can be prepared." }, 409);
    if (intent.mail_job_id) return json({ mailJobId: intent.mail_job_id, reused: true });
    const job = await db(env, "mail_jobs", { method: "POST", headers: { prefer: "return=representation" }, body: JSON.stringify({ business_id: input.businessId, recipient_id: input.recipientId, document_id: input.documentId, mailing_method: intent.mailing_method, status: "draft", scheduled_for: input.scheduledFor || null, idempotency_key: `mailing-intent:${intent.id}` }) });
    if (!job.ok) return json({ error: "Unable to create mail job." }, 502);
    const rows = await job.json() as Array<{ id: string }>; const mailJobId = rows[0]?.id; if (!mailJobId) return json({ error: "Mail job was not created." }, 502);
    const update = await db(env, `mailing_intents?id=eq.${encodeURIComponent(intent.id)}`, { method: "PATCH", body: JSON.stringify({ mail_job_id: mailJobId, recipient_id: input.recipientId, document_id: input.documentId }) });
    if (!update.ok) return json({ error: "Mail job created but intent linkage failed." }, 502);
    return json({ ok: true, mailJobId, reused: false });
  } catch (error) { if (error instanceof Response) return error; return json({ error: error instanceof Error ? error.message : "Unable to prepare mail job." }, 502); }
};
