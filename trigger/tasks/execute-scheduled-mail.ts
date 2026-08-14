import { schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";

const payload = z.object({
  scheduleId: z.string(),
  occurrence: z.string().datetime(),
  approvalStatus: z.enum(["pending", "approved", "rejected", "cancelled"]),
});

export const executeScheduledMail = schemaTask({
  id: "execute-scheduled-mail",
  schema: payload,
  maxDuration: 300,
  retry: { maxAttempts: 5, minTimeoutInMs: 1000, maxTimeoutInMs: 30000, factor: 2 },
  run: async (input) => {
    // The application service is deliberately resolved at runtime so the Trigger
    // worker remains an execution boundary and all persistence/idempotency rules
    // stay in the shared domain layer.
    const baseUrl = process.env.SMALL_BUSINESS_API_URL;
    const apiKey = process.env.SMALL_BUSINESS_INTERNAL_API_KEY;
    if (!baseUrl || !apiKey) throw new Error("Missing SMALL_BUSINESS_API_URL or SMALL_BUSINESS_INTERNAL_API_KEY");

    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/internal/schedules/${input.scheduleId}/execute`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ occurrence: input.occurrence, approvalStatus: input.approvalStatus }),
    });
    if (!response.ok) throw new Error(`Execution API returned ${response.status}: ${(await response.text()).slice(0, 500)}`);
    return response.json();
  },
});
