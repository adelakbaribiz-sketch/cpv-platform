# CPV — Citizens' Proposed Vote

**Status:** Phase 1 MVP · Demo mode · Non-official prototype

CPV is a civic participation SaaS prototype: citizens discover community issues, draft proposals with optional AI assistance, deliberate, verify, vote, and prepare transparent submission packages for public authorities.

> **Disclaimer:** This is a non-official prototype. Roles, votes, and metrics are simulated and not legally binding. The platform is **not** affiliated with any government.

---

## Quick start (mock mode)

```bash
# Install dependencies
npm install

# Run the dev server
npm run dev

# Open http://localhost:3000
```

No external credentials are required to run the demo. The app starts in mock mode by default.

---

## Tech stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript 5
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Icons:** lucide-react
- **Forms:** react-hook-form + zod (already available; minimal use in Phase 1)
- **Charts:** recharts (available; charts reserved for future dashboard iterations)
- **Tests:** vitest (unit + service tests)
- **DB (future):** Prisma + PostgreSQL/Supabase (configured but unused in Phase 1)

---

## Project structure

```
src/
  app/                      # Next.js App Router routes
    page.tsx                # Landing page
    proposals/              # Proposal list, detail, new
    dashboard/              # 9 role-specific dashboards
    notifications/          # Notifications center
    audit/                  # Audit trail
    settings/               # Demo settings
    login/                  # Demo sign-in
    api/                    # Route handlers (mock-backed)
  components/
    layout/                 # AppShell, sidebar, topbar, nav config
    data-display/           # StatusBadge
    dashboards/             # Shared dashboard primitives
    feedback/               # Empty/Loading/Error states
    ui/                     # shadcn/ui components
  contexts/                 # Role + Locale providers
  lib/
    types.ts                # Domain types
    constants.ts            # Status / role / category labels, lifecycle rules
    lifecycle.ts            # Transition validator (tested)
    mock-data.ts            # Deterministic mock content
    utils.ts                # Format helpers, safe localStorage
    repository.ts           # Provider entry point
    services/
      types.ts              # IDataProvider interface
      mock-provider.ts      # Mock implementation
  tests/                    # vitest unit tests
docs/                       # Architecture, security, deployment docs
```

---

## Routes implemented

| Route | Description |
|---|---|
| `/` | Public landing page |
| `/proposals` | Proposal discovery (search, filter, sort, paginate) |
| `/proposals/[id]` | Proposal detail (vote, comment, lifecycle, versions, AI suggestions, related) |
| `/proposals/new` | Draft a new proposal with mock AI assistance |
| `/dashboard` | Redirects to active demo role's dashboard |
| `/dashboard/citizen` | Citizen dashboard |
| `/dashboard/proposer` | Proposer dashboard |
| `/dashboard/verifier` | Verifier queue + approve/reject |
| `/dashboard/government` | Approved proposals + submission packages |
| `/dashboard/ngo` | NGO topics and supported proposals |
| `/dashboard/auditor` | Audit log explorer |
| `/dashboard/admin` | User/role summaries + platform health |
| `/dashboard/ai-delegate` | Advisory AI summaries (no autonomous action) |
| `/dashboard/governance` | Governance council + aggregate voting |
| `/notifications` | Notification center |
| `/audit` | Full audit trail (searchable, filterable) |
| `/settings` | Demo preferences (role, locale, theme, privacy) |
| `/login` | Demo sign-in (no real auth backend) |

### API routes

| Method | Path | Description |
|---|---|---|
| GET | `/api/proposals` | List proposals (filters via query string) |
| POST | `/api/proposals` | Create a proposal |
| GET | `/api/proposals/[id]` | Get a proposal |
| PATCH | `/api/proposals/[id]` | Update or transition a proposal |
| POST | `/api/proposals/[id]/vote` | Cast a demo vote |
| GET | `/api/proposals/[id]/comments` | List comments |
| POST | `/api/proposals/[id]/comments` | Add a comment |
| GET | `/api/notifications` | List notifications |
| PATCH | `/api/notifications/[id]` | Mark as read |
| GET | `/api/audit-logs` | List audit logs (filterable) |
| POST | `/api/ai/suggest` | Generate mock AI suggestions (advisory only) |

---

## Domain model

### Roles

`citizen`, `proposer`, `verifier`, `government`, `ngo`, `auditor`, `admin`, `ai_delegate`, `governance_council`

### Proposal lifecycle

```
draft → ai_review → community_review → verification → public_vote → approved → submitted
                                                                                    ↘ rejected (at applicable stages)
```

Rejection is permitted at `ai_review`, `community_review`, `verification`, and `public_vote`. Rejected proposals can be revised back to `draft`. The lifecycle is enforced by a pure, tested validator (`src/lib/lifecycle.ts`).

### Demo data

12 proposals across 8 categories with comments, versions, audit logs, notifications, and impact assessments. All names are fictional — no real citizens are represented.

---

## Quality gates

| Check | Command | Status |
|---|---|---|
| TypeScript | `npx tsc --noEmit` | PASS |
| ESLint | `npm run lint` | PASS |
| Unit tests | `npm run test` | PASS (24 tests) |
| Production build | `npm run build` | See notes |

> The `npm run build` step uses Next.js standalone output. In this sandbox we did not execute a full standalone build; the dev server compiles all routes successfully. See `docs/known-limitations.md`.

---

## Documentation

- `docs/architecture.md` — Architecture overview
- `docs/product-scope.md` — Product scope and Phase 1 boundaries
- `docs/security.md` — Security posture and Phase 1 limitations
- `docs/deployment.md` — Local and Docker deployment
- `docs/github-push.md` — How this repo was pushed to GitHub
- `docs/known-limitations.md` — Known limitations and unknowns

---

## License

Prototype — all rights reserved. No license granted for production use without explicit written authorization.
