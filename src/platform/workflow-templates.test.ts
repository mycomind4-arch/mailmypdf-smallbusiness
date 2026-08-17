import assert from 'node:assert/strict'
import test from 'node:test'
import { smallBusinessWorkflowTemplates } from './workflow-templates'

test('all flagship templates have evidence-oriented required facts and mailing class', () => {
  assert.equal(smallBusinessWorkflowTemplates.length, 5)
  for (const template of smallBusinessWorkflowTemplates) {
    assert.ok(template.requiredFacts.length >= 2)
    assert.ok(['FIRST_CLASS', 'CERTIFIED', 'REGISTERED'].includes(template.mailClass))
  }
})
