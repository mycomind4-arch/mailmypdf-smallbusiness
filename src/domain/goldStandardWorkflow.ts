import type { SmallBusinessWorkflowDefinition } from './workflows'

export type SmallBusinessGoldStage =
  | 'trigger'
  | 'document'
  | 'validation'
  | 'approval'
  | 'mailing'
  | 'tracking'
  | 'proof'
  | 'archive'

export type GoldStageResult = {
  stage: SmallBusinessGoldStage
  status: 'passed' | 'blocked' | 'failed'
  messages: string[]
}

export type GoldWorkflowDependencies = {
  evaluateTrigger: () => Promise<boolean>
  generateDocument: () => Promise<boolean>
  validate: () => Promise<boolean>
  requestApproval: () => Promise<boolean>
  sendMail: () => Promise<boolean>
  verifyTracking: () => Promise<boolean>
  verifyProof: () => Promise<boolean>
  archive: () => Promise<boolean>
}

export type GoldWorkflowResult = {
  workflowId: string
  status: 'completed' | 'blocked' | 'failed'
  stages: GoldStageResult[]
}

/**
 * Enforces the SMB lifecycle without pretending that an integration exists.
 * Every stage is an injected executable dependency; a missing/false result
 * blocks the workflow rather than being inferred from catalog metadata.
 */
export async function runSmallBusinessGoldWorkflow(
  workflow: SmallBusinessWorkflowDefinition,
  dependencies: GoldWorkflowDependencies,
): Promise<GoldWorkflowResult> {
  const stages: GoldStageResult[] = []

  const run = async (
    stage: SmallBusinessGoldStage,
    action: () => Promise<boolean>,
  ) => {
    try {
      const passed = await action()
      stages.push({
        stage,
        status: passed ? 'passed' : 'blocked',
        messages: passed ? [] : [`${stage} gate did not pass`],
      })
      return passed
    } catch (error) {
      stages.push({
        stage,
        status: 'failed',
        messages: [error instanceof Error ? error.message : String(error)],
      })
      return false
    }
  }

  if (!(await run('trigger', dependencies.evaluateTrigger))) return { workflowId: workflow.id, status: 'blocked', stages }
  if (!(await run('document', dependencies.generateDocument))) return { workflowId: workflow.id, status: 'blocked', stages }
  if (!(await run('validation', dependencies.validate))) return { workflowId: workflow.id, status: 'blocked', stages }

  if (workflow.requiresApproval && !(await run('approval', dependencies.requestApproval))) {
    return { workflowId: workflow.id, status: 'blocked', stages }
  }

  if (!(await run('mailing', dependencies.sendMail))) return { workflowId: workflow.id, status: 'blocked', stages }
  if (!(await run('tracking', dependencies.verifyTracking))) return { workflowId: workflow.id, status: 'blocked', stages }
  if (!(await run('proof', dependencies.verifyProof))) return { workflowId: workflow.id, status: 'blocked', stages }
  if (!(await run('archive', dependencies.archive))) return { workflowId: workflow.id, status: 'blocked', stages }

  return { workflowId: workflow.id, status: 'completed', stages }
}
