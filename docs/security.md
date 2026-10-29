# Security

## Phase 1 posture

Phase 1 is a **demo prototype** with no real authentication, no real database, and no real user data. Security controls are correspondingly minimal — but the architecture is designed so that production-grade controls can be added without rewriting the UI.

## What is implemented

- **No real auth tokens** are issued or stored. The role switcher is a UI demonstration, not authentication.
- **No real identity documents** are collected or stored.
- **Demo preferences** (role, locale, demo votes) are stored in `localStorage` only — never cookies, never transmitted.
- **Server-side validation** on all API route handlers (input shape, length, type).
- **HTTP status codes** are used consistently (200, 201, 400, 404, 422).
- **No service-role keys** in client code. No `.env.local` committed.
- **`.env.example`** contains only placeholder values.

## What is NOT implemented (Phase 1)

- Real authentication (NextAuth is available but not configured)
- Row-Level Security (no database in Phase 1)
- Rate limiting (the integration point is documented; not active)
- CSRF protections (no real auth to protect)
- Real audit log integrity (logs are in-memory and not tamper-proof)
- Content Security Policy headers (next.config can be extended)
- Real input sanitization for HTML (Phase 1 doesn't render user-supplied HTML)

## Future: when adding Supabase

MUST do before enabling real user data:

1. Configure Supabase Auth with email + OAuth provider(s).
2. Define RLS policies for every table.
3. Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser — server-only.
4. Validate every protected operation server-side.
5. Do not trust role values supplied by the client. Derive role from `auth.uid()` joins.
6. Add rate limiting at the edge (e.g. via middleware or Upstash).
7. Enable audit log tamper-evidence (hash chaining or a future decentralized layer).
8. Run a security review before going to production.

## Secrets handling

- `.env.local` is in `.gitignore` and is never committed.
- `.env.example` contains placeholders only.
- No GitHub tokens, API keys, or service keys are hard-coded in source.
- The GitHub Personal Access Token used for the initial push (if any) should be revoked by the user immediately after the push — see `docs/github-push.md`.

## Reporting a vulnerability

Phase 1 has no formal vulnerability management process. Future: see `SECURITY.md` once a maintainer is designated.
