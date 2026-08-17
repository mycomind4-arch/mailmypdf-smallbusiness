import assert from 'node:assert/strict'
import test from 'node:test'
import { planWorkflowExecution } from './workflow-execution'

test('ready plan reaches mailing and tracking', () => {
  const plan = planWorkflowExecution({ workflowId: 'payment-reminder', recipient: 'customer@example.com', documentProvided: true, risk: 'LOW', requiresApproval: false })
  assert.equal(plan.status, 'READY')
  assert.deepEqual(plan.stages, ['PLAN', 'REVIEW', 'MAIL', 'TRACK'])
})

test('approval-required plan cannot reach mailing', () => {
  const plan = planWorkflowExecution({ workflowId: 'payment-demand', recipient: 'customer@example.com', documentProvided: true, risk: 'HIGH', evidenceProvided: true, requiresApproval: true })
  assert.equal(plan.status, 'APPROVAL_REQUIRED')
  assert.ok(!plan.stages.includes('MAIL'))
})

test('blocked plan cannot reach mailing', () => {
  const plan = planWorkflowExecution({ workflowId: 'payment-demand', recipient: '', documentProvided: false, risk: 'HIGH', requiresApproval: true })
  assert.equal(plan.status, 'BLOCKED')
  assert.ok(!plan.stages.includes('MAIL'))
})
