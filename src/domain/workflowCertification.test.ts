import { describe, expect, it } from 'vitest'
import { certifyWorkflowCapability } from './workflowCertification'
import { getWorkflow } from './workflows'

describe('small business workflow capability certification', () => {
  it('marks a workflow executable only when every declared capability exists', () => {
    const workflow = getWorkflow('contract-renewal')!
    const result = certifyWorkflowCapability(workflow, [
      'classification', 'extraction', 'deadlines', 'validation', 'approval', 'mailing', 'tracking', 'proofAudit',
    ])

    expect(result.executable).toBe(true)
    expect(result.missingCapabilities).toEqual([])
  })

  it('keeps incomplete workflows explicitly non-executable', () => {
    const workflow = getWorkflow('customer-dispute-response')!
    const result = certifyWorkflowCapability(workflow, [
      'classification', 'extraction', 'validation', 'approval', 'mailing', 'tracking', 'proofAudit',
    ])

    expect(result.executable).toBe(false)
    expect(result.missingCapabilities).toEqual(['evidence', 'strategy'])
  })
})
