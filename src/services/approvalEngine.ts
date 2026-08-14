import { z } from "zod";

export const approvalStatusSchema = z.enum(["pending", "approved", "rejected", "cancelled"]);
export type ApprovalStatus = z.infer<typeof approvalStatusSchema>;

export type ApprovalRequest = {
  id: string;
  businessId: string;
  mailJobId: string;
  requiredRole: string;
  status: ApprovalStatus;
  requestedAt: string;
  decidedAt?: string;
  decidedBy?: string;
  reason?: string;
};

export function canExecuteMail(status: ApprovalStatus, requiresApproval: boolean): boolean {
  return !requiresApproval || status === "approved";
}

export function approve(request: ApprovalRequest, actorId: string, now = new Date()): ApprovalRequest {
  if (request.status !== "pending") throw new Error(`Approval ${request.id} is not pending`);
  return { ...request, status: "approved", decidedAt: now.toISOString(), decidedBy: actorId };
}

export function reject(request: ApprovalRequest, actorId: string, reason: string, now = new Date()): ApprovalRequest {
  if (request.status !== "pending") throw new Error(`Approval ${request.id} is not pending`);
  return { ...request, status: "rejected", decidedAt: now.toISOString(), decidedBy: actorId, reason };
}
