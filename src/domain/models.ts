/**
 * MailMyPDF Business domain model.
 *
 * Synthesized from MailMyPDF's vendor-agnostic mailing/proof concepts.
 * Keep these contracts independent from Lob, Stripe, Supabase, or any
 * workflow provider so the business layer can evolve without vendor lock-in.
 */

export type MailClass = 'standard' | 'certified' | 'registered'
export type MailStatus = 'draft' | 'scheduled' | 'queued' | 'submitted' | 'in_transit' | 'delivered' | 'returned' | 'completed' | 'failed' | 'cancelled'
export type OrganizationRole = 'owner' | 'admin' | 'member' | 'viewer'
export type TriggerType = 'date' | 'recurring' | 'event' | 'condition'

export interface Address {
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
  verified: boolean
}

export interface Business {
  id: string
  name: string
  members: { userId: string; role: OrganizationRole }[]
  timezone: string
  createdAt: string
}

export interface Contact {
  id: string
  businessId: string
  name: string
  company?: string
  email?: string
  phone?: string
  address: Address
  tags: string[]
}

export interface Document {
  id: string
  fileName: string
  sizeBytes: number
  contentType: string
  pageCount: number
  sha256?: string
  storagePath: string
  source: 'upload' | 'generated' | 'template'
  templateId?: string
  createdAt: string
}

export interface Template {
  id: string
  businessId: string
  name: string
  description?: string
  body: string
  variables: string[]
  defaultMailClass: MailClass
  active: boolean
}

export interface Schedule {
  id: string
  businessId: string
  name: string
  trigger: Trigger
  actions: WorkflowAction[]
  status: 'active' | 'paused' | 'draft'
  createdAt: string
}

export interface Trigger {
  type: TriggerType
  at?: string
  timezone?: string
  rrule?: string
  eventName?: string
  conditions?: Condition[]
}

export interface Condition {
  field: string
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'exists'
  value: string | number | boolean
}

export type WorkflowAction =
  | { type: 'generate_document'; templateId: string }
  | { type: 'require_approval'; approverRole?: OrganizationRole }
  | { type: 'send_mail'; mailClass: MailClass }
  | { type: 'wait'; durationSeconds: number }
  | { type: 'stop_if'; conditions: Condition[] }
  | { type: 'notify'; channel: 'email' | 'in_app' }

export interface MailJob {
  id: string
  businessId: string
  recipient: Contact
  document: Document
  mailClass: MailClass
  status: MailStatus
  scheduledAt?: string
  submittedAt?: string
  deliveredAt?: string
  tracking?: TrackingInfo
  proofOfMailing?: ProofOfMailing
  createdAt: string
  updatedAt: string
}

export interface TrackingInfo {
  carrier: string
  trackingNumber: string
  status: string
  events: TrackingEvent[]
}

export interface TrackingEvent {
  id: string
  eventType: string
  timestamp: string
  location?: string
}

export interface ProofOfMailing {
  id: string
  mailJobId: string
  trackingNumber: string
  documentSha256: string
  sentAt: string
  deliveredAt?: string
  custodyChain: { eventType: string; timestamp: string; eventHash: string; priorEventHash: string | null }[]
  generatedAt: string
}
