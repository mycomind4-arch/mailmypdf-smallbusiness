export interface TriggerScheduleRequest {
  task: string;
  payload: Record<string, unknown>;
  cron: string;
  timezone: string;
  externalId: string;
}

/** Server-side adapter. Keep Trigger.dev behind this boundary. */
export async function createTriggerSchedule(input: TriggerScheduleRequest) {
  const baseUrl = process.env.TRIGGER_API_URL ?? "https://api.trigger.dev";
  const token = process.env.TRIGGER_SECRET_KEY;
  if (!token) throw new Error("TRIGGER_SECRET_KEY is not configured");

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/v1/schedules`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      task: input.task,
      cron: input.cron,
      timezone: input.timezone,
      externalId: input.externalId,
      payload: input.payload,
    }),
  });

  if (!response.ok) throw new Error(`Trigger.dev schedule creation failed: ${response.status}`);
  return response.json();
}
