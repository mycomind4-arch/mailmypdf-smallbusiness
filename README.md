# MailMyPDF Business

A small-business correspondence operating system built around the MailMyPDF mailing and proof infrastructure.

## Product thesis

**Create → Schedule → Approve → Send → Track → Prove → Archive**

MailMyPDF remains the physical mailing and proof engine. This product adds the business layer: contacts, templates, scheduled mailings, recurring correspondence, approvals, conditional sequences, and a permanent proof archive.

## Synthesized foundations

The initial foundation was extracted/synthesized from the existing `mycomind4-arch/mailmypdf` architecture rather than forked wholesale. The parent product already uses a vendor-agnostic domain layer covering addresses, documents, recipients, mail jobs, tracking, audit events, proof-of-mailing, and organizations. Those concepts are preserved here and extended for business workflows.

The MailMyPDF repository currently identifies itself as a TypeScript application for mailing letters/PDFs through USPS and contains domain, service, provider, product, vertical, and integration layers. Its package uses React, TanStack, Supabase, Stripe, PDF tooling, and Lucide. See the source repository for the canonical implementation.

## Architecture direction

```text
MailMyPDF Business UI
        |
        +-- Business / Contacts
        +-- Templates
        +-- Correspondence
        +-- Scheduler
        +-- Workflow / Rules
        +-- Approvals
        +-- Proof Archive
        |
        v
MailMyPDF Mailing Engine
        |
        +-- document generation
        +-- payment
        +-- mailing provider
        +-- tracking
        +-- proof / custody chain
```

### Workflow engine

Use a durable TypeScript workflow/scheduling system such as Trigger.dev for scheduled and conditional execution rather than inventing a cron framework. Keep the application contracts provider-neutral.

### Integration layer

n8n can later be offered as an integration path for QuickBooks, Google Sheets, CRMs, webhooks, and other business systems. It should not become the core product runtime.

### CRM reference

Twenty is a useful architectural reference for business/contact/object/workflow concepts. Do not blindly fork it into this project. Review its license and isolate any third-party code before commercial incorporation.

## Initial UI

The first commit establishes a MailMyPDF-family visual system and an initial business command center with:

- scheduled mailing queue
- approval queue
- mail calendar
- next-best-action panel
- activity timeline
- delivery/scheduled metrics
- warm paper / navy / postal-red visual language

This is intentionally a foundation, not the finished product.

## Next implementation phases

1. Real business/contact persistence
2. Correspondence records and status lifecycle
3. Template builder with variables
4. Scheduled mailing engine
5. Recurring schedules and time-zone handling
6. Conditional correspondence sequences
7. Approval workflows
8. MailMyPDF API integration
9. Tracking webhooks
10. Proof archive
11. Bulk/personalized mailings
12. QuickBooks/n8n/API integrations

## Guardrails

- Never expose provider-specific types in domain contracts.
- Never claim a mailing was sent until the provider confirms submission.
- Never claim delivery until tracking confirms it.
- Keep immutable proof/audit records.
- Store timestamps in UTC and render in the business timezone.
- Require explicit approval for configurable high-impact mailing sequences.
- Treat scheduled mailings as durable jobs with idempotency keys.
