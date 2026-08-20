import type { DomainCapability } from '@mailmypdf/platform'
import type { SmallBusinessWorkflowDefinition } from './workflows'

export type WorkflowCertification = {
  workflowId: string
  declaredCapabilities: DomainCapability[]
  missingCapabilities: DomainCapability[]
  executable: boolean
}

const requiredByWorkflow: Record<SmallBusinessWorkflowDefinition['id'], DomainCapability[]> = {
  'payment-reminder': ['classification', 'extraction', 'validation', 'mailing', 'tracking', 'proofAudit'],
  'payment-demand': ['classification', 'extraction', 'evidence', 'validation', 'approval', 'mailing', 'tracking', 'proofAudit'],
  'contract-renewal': ['classification', 'extraction', 'deadlines', 'validation', 'approval', 'mailing', 'tracking', 'proofAudit'],
  'compliance-notice': ['classification', 'extraction', 'deadlines', 'evidence', 'validation', 'approval', 'mailing', 'tracking', 'proofAudit'],
  'customer-dispute-response': ['classification', 'extraction', 'evidence', 'strategy', 'draft', 'validation', 'approval', 'mailing', 'tracking', 'proofAudit'],
}

export function certifyWorkflowCapability(
  workflow: SmallBusinessWorkflowDefinition,
  available: readonly DomainCapability[],
): WorkflowCertification {
  const declaredCapabilities = requiredByWorkflow[workflow.id]
  const missingCapabilities = declaredCapabilities.filter(capability => !available.includes(capability))
  return {
    workflowId: workflow.id,
    declaredCapabilities,
    missingCapabilities,
    executable: missingCapabilities.length === 0,
  }
}
