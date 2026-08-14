import { schemaTask } from "@trigger.dev/sdk";
import { z } from "zod";

const payloadSchema = z.object({
  mailJobId: z.string().min(1),
  businessId: z.string().min(1),
  recipientId: z.string().min(1),
  documentId: z.string().min(1),
  mailClass: z.enum(["standard", "certified", "registered"]),
  idempotencyKey: z.string().min(1),
});

/**
 * Durable execution boundary for a MailMyPDF Business mailing.
 *
 * The task intentionally calls the MailMyPDF application API rather than a
 * carrier directly. That keeps provider-specific mailing/proof logic inside
 * MailMyPDF while Trigger.dev owns scheduling, retries, and execution state.
 */
export const executeMailJob = schemaTask({
  id: "execute-mail-job",
  schema: payloadSchema,
  retry: {
    maxAttempts: 5,
    factor: 2,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 30000,
    randomize: true,
  },
  run: async (payload) => {
    const baseUrl = process.env.MAILMYPDF_API_URL;
    const apiKey = process.env.MAILMYPDF_API_KEY;

    if (!baseUrl || !apiKey) {
      throw new Error("MAILMYPDF_API_URL and MAILMYPDF_API_KEY must be configured");
    }

    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/v1/business/mail-jobs/${payload.mailJobId}/execute`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
        "idempotency-key": payload.idempotencyKey,
      },
      body: JSON.stringify({
        businessId: payload.businessId,
        recipientId: payload.recipientId,
        documentId: payload.documentId,
        mailClass: payload.mailClass,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`MailMyPDF execution failed (${response.status}): ${body.slice(0, 500)}`);
    }

    return (await response.json()) as {
      mailJobId: string;
      status: string;
      trackingNumber?: string;
      proofId?: string;
    };
  },
});
