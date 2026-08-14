# MailMyPDF Business

A small-business correspondence automation product built on the MailMyPDF mailing/proof architecture.

## Product thesis

**Create → Schedule → Approve → Send → Track → Prove → Archive**

MailMyPDF Business is designed for companies that repeatedly send important physical documents: payment reminders, notices, renewals, contract correspondence, compliance letters, customer communications, and other business mail.

## What is implemented

- MailMyPDF-family warm paper / navy / postal-red visual system
- Business workspace and navigation
- Upcoming correspondence queue
- One-time scheduled mailing composer
- Recurring-monthly scheduling preview
- Calendar view
- Searchable correspondence list
- Approval queue UX
- Automation sequence UX
- Contacts, templates, and proof-archive foundations
- Vendor-neutral domain contracts for Address, Document, Recipient, MailJob, TrackingEvent, ProofOfMailing and AuditEvent
- Scheduling primitives with one-time and simple recurring RRULE support
- Local prototype persistence for scheduled mailings

## Source synthesis

The domain layer was synthesized directly from the canonical MailMyPDF source architecture in `mycomind4-arch/mailmypdf`, particularly its vendor-neutral mailing/proof contracts and warm postal design system. The SMB layer adds business contacts, templates, schedules, triggers, conditions, approvals, and automation around those primitives.

This repository is intentionally **not** a blind fork of MailMyPDF. It is a focused product built from the source concepts and implementation patterns needed for the SMB product.

## Production architecture target

```text
MailMyPDF Business UI
        |
        +-- Business / Contacts / Templates
        +-- Scheduled Mailings
        +-- Automation Rules
        +-- Approval Gates
        |
        v
MailJob Domain
        |
        +-- Document generation/storage
        +-- Mail provider adapter
        +-- Tracking webhooks
        +-- Proof-of-mailing service
        |
        v
Permanent Correspondence Record
```

The scheduler is provider-neutral. A production deployment can use Trigger.dev, Cloudflare Queues, or another durable worker without changing the domain contracts.

## Development

```bash
npm install
npm run dev
npm run build
```

## Important

The current repository is the **working product foundation/prototype**. The next production phase is to connect the scheduler to the existing MailMyPDF backend, persist schedules and run records in the production database, implement idempotent worker execution, and wire actual mailing/tracking/proof APIs.
