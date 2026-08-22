-- Gold-standard integrity hardening for executable Business mailings.
-- Keep the relational graph intact and make retries safe at the database boundary.

alter table mail_jobs
  alter column lookup_token set default encode(gen_random_bytes(12), 'hex');

create unique index if not exists mail_jobs_intent_idempotency_idx
  on mail_jobs(idempotency_key);

create index if not exists contacts_business_name_idx
  on contacts(business_id, lower(name));

create index if not exists documents_business_created_idx
  on documents(business_id, created_at desc);

-- A successful preparation must always point at a real recipient and document.
-- These are already NOT NULL foreign keys in 001; this migration documents the
-- invariant and adds the most useful operational lookup indexes.
create index if not exists mail_jobs_recipient_idx on mail_jobs(recipient_id);
create index if not exists mail_jobs_document_idx on mail_jobs(document_id);

-- Prevent more than one live job from being created for a single durable intent
-- when callers retry after a network timeout. The preparation endpoint uses
-- mailing-intent:<intent-id> as the idempotency key.
comment on column mail_jobs.idempotency_key is
  'Stable execution key. Business preparation uses mailing-intent:<mailing_intent_id>.';
