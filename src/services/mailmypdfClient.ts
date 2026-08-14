export type MailExecutionInput = {
  mailJobId: string;
  businessId: string;
  recipientId: string;
  documentId: string;
  mailClass: "standard" | "certified" | "registered";
  idempotencyKey: string;
};

export type MailExecutionResult = {
  mailJobId: string;
  status: string;
  trackingNumber?: string;
  proofId?: string;
};

export class MailMyPDFClient {
  constructor(private readonly baseUrl: string, private readonly apiKey: string) {}

  async executeMailJob(input: MailExecutionInput): Promise<MailExecutionResult> {
    const response = await fetch(`${this.baseUrl.replace(/\/$/, "")}/v1/business/mail-jobs/${input.mailJobId}/execute`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${this.apiKey}`,
        "idempotency-key": input.idempotencyKey,
      },
      body: JSON.stringify({
        businessId: input.businessId,
        recipientId: input.recipientId,
        documentId: input.documentId,
        mailClass: input.mailClass,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`MailMyPDF returned ${response.status}: ${body.slice(0, 500)}`);
    }

    return response.json() as Promise<MailExecutionResult>;
  }
}
