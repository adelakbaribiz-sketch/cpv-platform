# Changelog

All notable changes to this project are documented in this file.
The format is loosely based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.1.0-mvp] — 2026-10-29

### Added
- **Initial public release** of CPV — Citizens' Proposed Vote, Phase 1 MVP demo.
- **Dark-mode UI** with a civic-governance visual identity (dark surfaces, calm blue primary, emerald accent, amber warnings).
- **Application shell** with collapsible desktop sidebar, mobile slide-in drawer, persistent top bar with search, notifications, role switcher, and profile menu.
- **Landing page** with hero, lifecycle walkthrough, capabilities grid, featured proposals, transparency section, and footer.
- **Proposal discovery** at `/proposals` with search, status filter, category filter, sort, URL-synced state, and pagination.
- **Proposal detail** at `/proposals/[id]` with lifecycle stepper, vote card (support / oppose / abstain), comments tab, versions tab, AI suggestions tab, related proposals, impact assessment, and audit excerpt.
- **New proposal form** at `/proposals/new` with title, description, category, tags, location, affected community, character counts, validation, preview dialog, save-as-draft, and submit-for-review actions.
- **Mock AI assistant** — deterministic suggestions for title, description, and tags, clearly labeled advisory; never autonomous.
- **Nine role-aware dashboards**: citizen, proposer, verifier (with approve/reject actions), government (with submission-package tracking), NGO (with topic aggregation), auditor (with searchable audit log), admin (with platform health), ai-delegate (advisory only, no autonomous voting), governance-council (with aggregate voting results).
- **Notifications center** at `/notifications` with read/unread state, mark-as-read, mark-all-read, and empty states.
- **Audit trail** at `/audit` with search, role filter, target-type filter, pagination, and a persistent "Simulated" badge.
- **Settings** at `/settings` with demo role switcher, language selection (English / Persian-RTL architecture), theme info, notification preferences, privacy controls, and clear-local-data action.
- **Login page** at `/login` — demo only, no real authentication backend.
- **Domain layer**: typed `Proposal`, `Comment`, `Vote`, `AuditLog`, `Notification`, `ImpactAssessment`, and supporting types in `src/lib/types.ts`.
- **Lifecycle validator** in `src/lib/lifecycle.ts` — pure functions `canTransition`, `nextStatuses`, `applyTransition` enforcing the explicit transition table.
- **Mock data** — 12 proposals across 8 categories, 24 comments, 12 versions, 20 audit logs, 8 notifications, 7 demo user profiles.
- **Service layer** with `IDataProvider` interface and `MockDataProvider` implementation, ready to swap to a Supabase-backed provider.
- **API route handlers** for proposals (GET/POST/PATCH), vote (POST), comments (GET/POST), notifications (GET/PATCH), audit-logs (GET), and AI suggest (POST) — all mock-backed with server-side validation.
- **Role + Locale contexts** with safe `localStorage` persistence and `dir` attribute management for RTL.
- **Not-found page** for unknown proposal IDs.
- **24 vitest unit tests** — 10 lifecycle transition tests + 14 service-layer tests — all passing.
- **ESLint** clean; **TypeScript strict** clean.
- **Dockerfile** (multi-stage Node 22 Alpine) + **docker-compose.yml** + **.dockerignore** + **.env.example** (placeholders only).
- **Documentation suite**: README.md (portfolio case-study style), architecture.md, product-scope.md, security.md, deployment.md, github-push.md, known-limitations.md.
- **23 screenshots** in `docs/screenshots/` covering every major route plus mobile views.

### Known limitations
- No real authentication, no real database, no real AI provider, no real blockchain, no real government integration.
- Audit logs are in-memory and not tamper-proof.
- Persian (RTL) localization is partial — architecture is direction-aware; full translation deferred.
- Light theme is architected via CSS variables but not exposed in the Settings toggle.
- Charts (Recharts) are installed but unused in Phase 1 — dashboards use numeric StatCards and tables.
- Production `next build` was not executed in the development sandbox; the dev server compiles all routes successfully.

### Quality gates
- TypeScript strict: PASS
- ESLint: PASS
- Unit tests (24): PASS
- Route smoke tests (18 routes): PASS
- Browser interactivity (form submit, vote, comment, role switch, AI suggestions): PASS

---

## Versioning

CPV uses a `MAJOR.MINOR.PATCH-stage` scheme during the prototype phase:
- `0.1.0-mvp` — initial demo release.
- Future `0.2.0` will introduce a real Supabase provider behind the existing `IDataProvider` interface.
- Future `1.0.0` will mark the first production-ready release (requires explicit approval, real authentication, real database, and a security review).
