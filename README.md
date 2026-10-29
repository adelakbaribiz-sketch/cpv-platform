# CPV — Citizens' Proposed Vote

**Civic participation infrastructure for Europe — discover a community issue, draft a proposal with AI assistance, deliberate, verify, vote, and prepare a transparent submission package for a public authority.**

> **Status: Demo / Prototype.** This is a portfolio-grade frontend demo, not a live product. There is no real authentication, no real database, no deployed blockchain, no real AI provider, and no government integration anywhere in this repository. Every role, vote, comment, audit log, and metric shown in the UI is synthetic and clearly labeled. A persistent "DEMO MODE" indicator appears in the sidebar, top bar, and footer of every page. See [`docs/known-limitations.md`](docs/known-limitations.md) for the full real-vs-simulated inventory.

![Citizen dashboard — followed proposals, open votes and recent activity (synthetic data)](docs/screenshots/dashboard-citizen.png)

## Problem
Citizen participation in Europe is fragmented: people can sign a petition, attend a town hall, or write to a representative — but there is no coherent, transparent, end-to-end workflow that takes a community issue from "noticed" to "submitted to an authority" with a verifiable record of who said what, when, and how the proposal evolved. Existing tools are either petition-only (change.org) or government-only (formal e-participation portals), with nothing unifying deliberation, procedural verification, and transparent submission tracking.

## Solution
CPV combines a structured proposal lifecycle (Draft → AI Review → Community Review → Verification → Public Vote → Approved → Submitted) with role-aware dashboards, an explicit transition validator, and a public audit trail — all behind a "demo mode" interface that lets a reviewer explore every role without authentication. The architecture is hybrid by design: centralized identity and compliance workflows today, with a planned decentralized verification layer for tamper-evidence tomorrow.

## Features (built in this demo)
- **Role-aware dashboards** — nine distinct information architectures for citizen, proposer, verifier, government observer, NGO, auditor, admin, AI delegate, and governance council.
- **Structured proposal lifecycle** — explicit, tested transition rules; no proposal can skip verification to reach a vote. Rejection paths at every review stage.
- **Proposal discovery** — search, filter by status and category, sort by activity or votes, with URL-synced state and pagination.
- **Proposal detail** — voting (support / oppose / abstain), threaded comments, version history, lifecycle events, AI suggestions, impact assessment, and related proposals.
- **Mock AI assistant** — deterministic, clearly-labeled suggestions for title, description, and tags. Never autonomous; never calls a real model.
- **Audit trail** — searchable, filterable log of every status transition, vote, comment, and verifier action. Phase 1 logs are simulated and clearly marked as not tamper-proof.
- **Notifications center** — read/unread state, mark-as-read, mark-all-read, with relevant empty states.
- **Settings** — demo role switcher, language selection (English / Persian-RTL architecture in place), theme info, privacy controls.
- **API layer** — REST-like route handlers (mock-backed) for every operation, ready to swap to a real backend.
- **Fully responsive** — desktop sidebar, mobile slide-in drawer, no horizontal overflow, appropriately sized touch targets.

## Screenshots
| Landing page | Proposals explorer |
|---|---|
| ![Landing page](docs/screenshots/landing.png) | ![Proposals explorer with search, filters and pagination](docs/screenshots/proposals-list.png) |
| **Proposal detail (overview)** | **Proposal detail (comments)** |
| ![Proposal detail with lifecycle, vote card and impact assessment](docs/screenshots/proposal-detail.png) | ![Discussion tab with comments and reply form](docs/screenshots/proposal-detail-comments.png) |
| **Version history** | **AI suggestions** |
| ![Version history tab showing proposal revisions](docs/screenshots/proposal-versions.png) | ![AI suggestions tab with deterministic mock advisory](docs/screenshots/proposal-ai-suggestions.png) |
| **New proposal form** | **New proposal with AI assistant** |
| ![New proposal form with title, description, category, tags](docs/screenshots/new-proposal.png) | ![AI assistant generating suggestions on the new proposal form](docs/screenshots/new-proposal-ai.png) |

### Role-aware dashboards

| Citizen | Proposer | Verifier |
|---|---|---|
| ![Citizen dashboard](docs/screenshots/dashboard-citizen.png) | ![Proposer dashboard](docs/screenshots/dashboard-proposer.png) | ![Verifier queue](docs/screenshots/dashboard-verifier.png) |
| **Government** | **NGO** | **Auditor** |
| ![Government observer dashboard](docs/screenshots/dashboard-government.png) | ![NGO dashboard](docs/screenshots/dashboard-ngo.png) | ![Auditor audit log explorer](docs/screenshots/dashboard-auditor.png) |
| **Admin** | **AI Delegate** | **Governance Council** |
| ![Admin platform health dashboard](docs/screenshots/dashboard-admin.png) | ![AI delegate advisory dashboard](docs/screenshots/dashboard-ai-delegate.png) | ![Governance council aggregate voting](docs/screenshots/dashboard-governance.png) |

### Operations pages

| Notifications | Audit trail | Settings | Sign in |
|---|---|---|---|
| ![Notifications center](docs/screenshots/notifications.png) | ![Audit trail with filters](docs/screenshots/audit-trail.png) | ![Settings page](docs/screenshots/settings.png) | ![Sign in page](docs/screenshots/login.png) |

### Mobile

<p>
  <img src="docs/screenshots/mobile.png" alt="Citizen dashboard on a phone-sized screen" width="260">
  &nbsp;
  <img src="docs/screenshots/landing-mobile.png" alt="Landing page on a phone-sized screen" width="260">
</p>

*Phone-sized screens (390 px wide). Captured from the demo running locally. Every figure, vote, comment, and audit entry is synthetic — the persistent "DEMO MODE" indicator at the top of every screen says so. The UI is dark-mode only by design; a light theme is architected via CSS variables but not exposed in the toggle.*

## Architecture
A single Next.js 16 (App Router, React 19, TypeScript, Tailwind v4, shadcn/ui) frontend rendering from a typed in-memory store seeded by deterministic mock data — no real backend, no database, no blockchain node, no AI API. A clean `IDataProvider` interface sits between the UI and the data, so a future Supabase implementation can replace the mock provider without rewriting any component. Full target-state architecture (what a real backend would look like, and exactly where it would plug in) is documented in [`docs/architecture.md`](docs/architecture.md).

```
┌──────────────────────────────────────────────┐
│ UI (App Router pages + components)           │
└───────────────┬──────────────────────────────┘
                │ uses
┌───────────────▼──────────────────────────────┐
│ Repository (lib/repository.ts)               │
│   getProvider() → IDataProvider              │
└───────────────┬──────────────────────────────┘
                │ implements
┌───────────────▼──────────────────────────────┐
│ MockDataProvider (services/mock-provider.ts) │
│ in-memory store seeded from mock-data.ts     │
└──────────────────────────────────────────────┘

Future: SupabaseDataProvider implements the same
IDataProvider interface, replacing mock calls with
PostgreSQL queries + Row-Level Security policies.
```

## Tech stack
Next.js 16 · React 19 · TypeScript 5 · Tailwind CSS 4 · shadcn/ui (New York) · lucide-react icons · vitest (24 unit tests) · Prisma ORM (installed, unused in Phase 1) · NextAuth.js (installed, unused in Phase 1) · Recharts (installed, reserved for future chart iterations) · recharts, react-hook-form + zod (installed, minimal use in Phase 1).

## Demo instructions
```bash
npm install
npm run dev
```
Then open http://localhost:3000. No environment variables required — the app runs entirely on in-repo mock data. Use the **role switcher** in the top bar (labeled "DEMO") to explore any of the nine roles. Use the **language selector** in Settings to switch to Persian (RTL) — Phase 1 ships partial Persian translation; the architecture is direction-aware.

## Installation / environment variables
No environment variables are required to run the demo. See [`.env.example`](.env.example) for what a real backend integration would eventually need (Supabase URL/keys, AI provider keys, blockchain RPC, n8n webhook) — none of it is wired up in Phase 1.

## Quality gates
| Check | Command | Status |
|---|---|---|
| TypeScript strict | `npx tsc --noEmit` | ✅ PASS |
| ESLint | `npm run lint` | ✅ PASS |
| Unit tests (lifecycle + services) | `npm run test` | ✅ PASS · 24 tests |
| Route smoke tests (all 18 routes) | manual + curl | ✅ PASS · all return 200 |
| Production build | `npm run build` | ⚠️ Not executed in sandbox — see [`docs/known-limitations.md`](docs/known-limitations.md) |
| Browser interactivity (form submit, vote, comment, role switch) | manual via headless browser | ✅ PASS |

## Project structure
```
cpv-platform/
├── src/
│   ├── app/                  Next.js App Router routes
│   │   ├── page.tsx          Landing page
│   │   ├── proposals/        list, detail, new
│   │   ├── dashboard/        9 role-specific dashboards
│   │   ├── notifications/    Notifications center
│   │   ├── audit/            Audit trail explorer
│   │   ├── settings/         Demo preferences
│   │   ├── login/            Demo sign-in
│   │   └── api/              Route handlers (mock-backed)
│   ├── components/
│   │   ├── layout/           AppShell, sidebar, topbar, nav config
│   │   ├── data-display/     StatusBadge
│   │   ├── dashboards/       Shared dashboard primitives
│   │   ├── feedback/         Empty / Loading / Error states
│   │   └── ui/               shadcn/ui component set
│   ├── contexts/             Role + Locale providers
│   ├── lib/
│   │   ├── types.ts          Domain types (Proposal, Vote, AuditLog…)
│   │   ├── constants.ts      Status / role / category labels, lifecycle table
│   │   ├── lifecycle.ts      Pure transition validator (tested)
│   │   ├── mock-data.ts      Deterministic mock content (12 proposals, 24 comments, 20 audit logs…)
│   │   ├── repository.ts     Provider entry point
│   │   └── services/
│   │       ├── types.ts      IDataProvider interface
│   │       └── mock-provider.ts  Mock implementation
│   └── tests/                vitest unit tests (lifecycle + services)
├── docs/                     Full documentation suite (see below)
├── Dockerfile                Multi-stage production image
├── docker-compose.yml        Local container orchestration
├── .env.example              Placeholders only — never commit .env.local
└── README.md                 This file
```

## Documentation
| Doc | What it covers |
|---|---|
| [architecture.md](docs/architecture.md) | Layered architecture, mock vs. target state, provider contract |
| [product-scope.md](docs/product-scope.md) | What CPV is and isn't; Phase 1 in/out of scope; user journey |
| [security.md](docs/security.md) | Phase 1 security posture; what's implemented and what isn't; future Supabase checklist |
| [deployment.md](docs/deployment.md) | Local dev, Docker, environment variables, future deployment targets |
| [github-push.md](docs/github-push.md) | How the repo was prepared and pushed; token-safety guidance |
| [known-limitations.md](docs/known-limitations.md) | Every open gap — strategic unknowns, acceptance criteria status, next three priorities |

## Domain model

### Roles
`citizen` · `proposer` · `verifier` · `government` · `ngo` · `auditor` · `admin` · `ai_delegate` · `governance_council`

### Proposal lifecycle
```
draft → ai_review → community_review → verification → public_vote → approved → submitted
                                                                                    ↘ rejected (at applicable stages)
```
Rejection is permitted at `ai_review`, `community_review`, `verification`, and `public_vote`. Rejected proposals can be revised back to `draft`. The lifecycle is enforced by a pure, tested validator in [`src/lib/lifecycle.ts`](src/lib/lifecycle.ts) — no UI button can bypass it.

### Mock data
12 proposals across 8 categories (transportation, housing, environment, accessibility, education, public services, infrastructure, culture) with 24 comments, 12 versions, 20 audit logs, 8 notifications, and 7 demo user profiles. All names are fictional — no real citizens are represented.

## Business & product overview
- **Target user:** Citizens who want to act on a local issue; proposers who author and shepherd proposals; verifiers who check procedural completeness; governments who observe; NGOs who amplify; auditors who inspect.
- **Initial target market:** Europe, with **Denmark** as the initial research and product-design target. English is the default interface language; Persian (RTL) localization is in progress for future markets.
- **Differentiation:** A structured lifecycle with explicit verification gates (not a petition free-for-all), a public audit trail (not a black box), and role-aware dashboards (not a one-size-fits-all form). Hybrid architecture: centralized compliance today, decentralized tamper-evidence tomorrow.
- **Monetization (proposed, unvalidated):** tiered SaaS subscriptions for municipalities and NGOs. No pricing has been tested with a real customer.
- **Current stage:** demo / prototype. No revenue, no users, no funding, no government contracts.

## Limitations
See [`docs/known-limitations.md`](docs/known-limitations.md) for the full list. Highlights: no real authentication (role switcher is a UI demonstration, not auth); no real database (in-memory mock); audit logs are not tamper-proof; mock AI is deterministic and clearly labeled; no real blockchain, AI provider, payment, or government integration is called; production `next build` not executed in the development sandbox; Persian (RTL) localization is partial; charts (Recharts) are available but unused in Phase 1.

## Portfolio case study

**What I built:** a demo-grade product experience for a civic-participation concept — taken from an unstructured product brief to a navigable, responsive, professionally-designed frontend with an honest documentation suite and a tested domain layer.

**Problem:** the source material was a master engineering prompt with extensive requirements (9 roles, full lifecycle, audit trail, AI assistance, hybrid architecture) but no code, no design, and several unresolved strategic decisions (final logo, jurisdiction, voting protocol, blockchain network, AI provider, tokenomics). The task was to turn it into something a reviewer could actually evaluate — without fabricating the parts that weren't real (government contracts, real citizens, a working blockchain, a real AI model).

**Approach:** classified the project as a civic-tech SaaS prototype, ran a gap analysis, then built "maximum credible frontend, minimum necessary backend" — a fully click-through UI on clearly-labeled synthetic data, with the lifecycle enforced by a pure tested validator rather than scattered if-statements, and a provider interface that documents exactly where a real Supabase implementation would plug in. Every role, vote, comment, and audit entry is seeded from a deterministic mock store.

**Key design decisions:**
- A custom "civic governance" visual identity — dark surfaces (`#0B0F17` / `#111827`), a calm blue primary (`#60A5FA`) with emerald accent (`#34D399`), amber for warnings, red for destructive — rather than a generic dashboard template.
- The role switcher is prominently labeled `DEMO MODE — SIMULATED ROLE` in the top bar, so a reviewer never mistakes demo role-switching for authentication.
- The lifecycle is enforced by a pure function (`canTransition` / `applyTransition`) with 10 unit tests, so the UI cannot drift from the domain rules even as features are added.
- The audit trail is searchable, filterable, and paginated — but every page carries a `Simulated` badge and a callout explaining that Phase 1 logs are in-memory and not tamper-proof.
- Mock AI is deterministic and clearly labeled "DEMO — deterministic mock" in the API response, so no reviewer mistakes it for a real model call.

**Challenges:** keeping every simulated interaction (voting, transitioning, commenting, AI suggestions) honest about what it actually is, without undermining how the product *feels* to use — solved with a consistent `DEMO MODE` indicator in the sidebar, top bar, and footer of every page, plus warning callouts on the audit page, the AI delegate dashboard, and the proposal detail's vote card, rather than scattered disclaimers.

**Current status:** Demo / Prototype (see badge at the top of this file).

**Limitations & future roadmap:** see [`docs/known-limitations.md`](docs/known-limitations.md). The three highest-priority next actions are: (1) run a real `npm run build` in a clean environment; (2) add a Supabase provider implementation behind the existing `IDataProvider` interface with RLS policies; (3) define and document the eligibility + verification rules before opening any real vote.

## License
Prototype — all rights reserved. No license is granted for production use without explicit written authorization. See the repository for terms.
