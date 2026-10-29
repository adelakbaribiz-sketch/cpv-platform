# Architecture

## Overview

CPV is a **Next.js 16 App Router** application with a strict separation between presentation, domain logic, and data access. Phase 1 ships in **mock mode** — no external database, AI provider, blockchain, or government integration is contacted.

## Layers

```
┌──────────────────────────────────────────────┐
│ UI (App Router pages + components)           │
│   - AppShell, dashboards, proposal pages    │
└───────────────┬──────────────────────────────┘
                │ uses
┌───────────────▼──────────────────────────────┐
│ Repository (src/lib/repository.ts)           │
│   - getProvider() → IDataProvider            │
└───────────────┬──────────────────────────────┘
                │ implements
┌───────────────▼──────────────────────────────┐
│ MockDataProvider (services/mock-provider.ts) │
│   - in-memory store seeded from mock-data.ts │
│   - mutates state, records audit logs        │
└──────────────────────────────────────────────┘

Future: SupabaseDataProvider implements the same IDataProvider
interface, replacing mock calls with PostgreSQL queries + RLS.
```

## Domain

- **Types** (`lib/types.ts`): Proposal, Comment, Vote, AuditLog, Notification, etc.
- **Constants** (`lib/constants.ts`): Status/role/category labels, lifecycle transition table.
- **Lifecycle** (`lib/lifecycle.ts`): Pure, tested transition validator.

## State management

- **Role context** (`contexts/role-context.tsx`): Active demo role, persisted to `localStorage`.
- **Locale context** (`contexts/locale-context.tsx`): Active locale (`en`/`fa`), sets `dir` attribute on `<html>`.
- **Per-page state**: Each page manages its own data fetching via the repository. No global state library is used in Phase 1 — the mock provider is a singleton that holds the in-memory store for the demo session.

## Mock data

`lib/mock-data.ts` seeds the in-memory store with:

- 12 proposals across 8 categories
- 24 comments
- 12 proposal versions
- 20 audit logs
- 8 notifications
- 7 demo user profiles

All names are fictional. No real citizen data is represented.

## API routes

The Next.js Route Handlers under `src/app/api/` provide a REST-like interface that mirrors the service layer. They are mock-backed in Phase 1. When a real backend is added, these routes will delegate to the Supabase-backed provider instead of the mock.

## What is NOT in Phase 1

- Real authentication (NextAuth is available but not configured)
- Real database (Prisma is installed but unused)
- Real AI provider calls
- Real blockchain transactions
- Real payment integration
- Real government API integration

Each of these has an explicit extension point in the architecture (provider interface, route handler, or repository abstraction). See `docs/known-limitations.md`.
