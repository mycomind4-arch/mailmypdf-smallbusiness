import test from 'node:test'
import assert from 'node:assert/strict'
import { planWorkflowExecution } from './workflow-engine'

test('payment reminder can be ready with recipient and document', () => {
  const plan = planWorkflowExecution({ workflowId: 'payment-reminder', recipientId: 'r1', documentId: 'd1' })
  assert.equal(plan.status, 'READY')
})

test('high-risk payment demand is blocked without evidence', () => {
  const plan = planWorkflowExecution({ workflowId: 'payment-demand', recipientId: 'r1', documentId: 'd1' })
  assert.equal(plan.status, 'BLOCKED')
  assert.match(plan.reasons.join(' '), /evidence/)
})

test('high-risk payment demand requires approval with evidence', () => {
  const plan = planWorkflowExecution({ workflowId: 'payment-demand', recipientId: 'r1', documentId: 'd1', evidenceCount: 2 })
  assert.equal(plan.status, 'APPROVAL_REQUIRED')
})

test('missing recipient blocks every workflow', () => {
  const plan = planWorkflowExecution({ workflowId: 'payment-reminder', documentId: 'd1' })
  assert.equal(plan.status, 'BLOCKED')
})
