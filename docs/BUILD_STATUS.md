# Build status

## Implemented

- MailMyPDF Business domain model for businesses, contacts, documents, templates, schedules, mail jobs, approvals, tracking, and proof.
- Deterministic schedule calculation for one-time, daily, weekly, and monthly schedules.
- Idempotency-key generation for every scheduled occurrence.
- Conditional workflow evaluation with equality, containment, existence, and numeric comparisons.
- Trigger.dev execution boundary with retries and authenticated MailMyPDF API calls.
- Typed MailMyPDF application client.
- Provider boundaries for CRM and integration systems.

## Next integration boundary

The remaining production step is wiring the UI/API persistence layer to the scheduler and Trigger.dev task, then connecting MailMyPDF's real authenticated API endpoint and webhook events.

No production mailing should occur until those environment variables and API credentials are configured and an explicit approval policy is enabled for the business.
