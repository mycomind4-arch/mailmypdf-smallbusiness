import assert from 'node:assert/strict'
import test from 'node:test'
import { validateRequiredFacts } from './fact-validation'

test('validates complete business facts', () => {
  assert.deepEqual(validateRequiredFacts(['amount', 'invoiceNumber'], { amount: 100, invoiceNumber: 'INV-1' }), { valid: true, missing: [] })
})

test('reports missing business facts deterministically', () => {
  assert.deepEqual(validateRequiredFacts(['amount', 'invoiceNumber'], { amount: 100 }), { valid: false, missing: ['invoiceNumber'] })
})
