import { describe, expect, it } from 'vitest'
import { runSmallBusinessGoldWorkflow } from './goldStandardWorkflow'
import { getWorkflow } from './workflows'

const successfulDependencies = () => ({
  evaluateTrigger: async () => true,
  generateDocument: async () => true,
  validate: async () => true,
  requestApproval: async () => true,
  sendMail: async () => true,
  verifyTracking: async () => true,
  verifyProof: async () => true,
  archive: async () => true,
})

describe('small business gold-standard workflow', () => {
  it('executes every consequential lifecycle gate for an approval workflow', async () => {
    const workflow = getWorkflow('payment-demand')!
    const result = await runSmallBusinessGoldWorkflow(workflow, successfulDependencies())

    expect(result.status).toBe('completed')
    expect(result.stages.map(stage => stage.stage)).toEqual([
      'trigger', 'document', 'validation', 'approval', 'mailing', 'tracking', 'proof', 'archive',
    ])
  })

  it('does not invent approval for workflows that do not require it', async () => {
    const workflow = getWorkflow('payment-reminder')!
    const result = await runSmallBusinessGoldWorkflow(workflow, successfulDependencies())

    expect(result.status).toBe('completed')
    expect(result.stages.some(stage => stage.stage === 'approval')).toBe(false)
  })

  it('blocks before mailing when validation fails', async () => {
    const workflow = getWorkflow('payment-demand')!
    const dependencies = successfulDependencies()
    dependencies.validate = async () => false

    const result = await runSmallBusinessGoldWorkflow(workflow, dependencies)

    expect(result.status).toBe('blocked')
    expect(result.stages.at(-1)).toEqual({
      stage: 'validation',
      status: 'blocked',
      messages: ['validation gate did not pass'],
    })
    expect(result.stages.some(stage => stage.stage === 'mailing')).toBe(false)
  })

  it('blocks approval workflows when approval is denied', async () => {
    const workflow = getWorkflow('contract-renewal')!
    const dependencies = successfulDependencies()
    dependencies.requestApproval = async () => false

    const result = await runSmallBusinessGoldWorkflow(workflow, dependencies)

    expect(result.status).toBe('blocked')
    expect(result.stages.at(-1)?.stage).toBe('approval')
    expect(result.stages.some(stage => stage.stage === 'mailing')).toBe(false)
  })

  it('requires real tracking and proof before completion', async () => {
    const workflow = getWorkflow('payment-reminder')!
    const dependencies = successfulDependencies()
    dependencies.verifyProof = async () => false

    const result = await runSmallBusinessGoldWorkflow(workflow, dependencies)

    expect(result.status).toBe('blocked')
    expect(result.stages.at(-1)?.stage).toBe('proof')
    expect(result.stages.some(stage => stage.stage === 'archive')).toBe(false)
  })
})
