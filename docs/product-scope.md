# Product Scope

## What CPV is

CPV (Citizens' Proposed Vote) is a **civic participation prototype**: a SaaS that lets citizens discover community issues, draft proposals with optional AI assistance, deliberate, verify, vote, and prepare transparent submission packages for public authorities.

## What CPV is not

- **Not an official government voting system.** Votes in CPV are non-binding community signals.
- **Not an identity-verification system.** Phase 1 stores no real identity documents.
- **Not a blockchain product.** A future decentralized verification layer is planned but not deployed.
- **Not an autonomous AI agent.** The AI delegate role is advisory only — it cannot cast votes or transition proposals.

## Phase 1 (this MVP)

### In scope

- Dark-theme UI with premium visual quality
- 9 role-aware dashboards
- Full proposal lifecycle (draft → AI review → community → verification → vote → approved → submitted)
- Mock AI suggestions (deterministic, clearly labeled)
- Mock voting with single-vote-per-session guard
- Comments, versions, lifecycle events, audit logs
- Search, filter, sort, paginate across proposals
- English default with Persian (RTL) i18n architecture in place
- API route handlers (mock-backed)
- Unit tests for lifecycle + service layer
- Docker readiness + documentation

### Out of scope (deferred)

- Real authentication
- Real database
- Real AI provider integration
- Real blockchain integration
- Real payment integration
- Real government API integration
- Real-time websocket notifications (socket.io is available but unused)
- Mobile native apps

## Initial target market

Europe, with **Denmark** as the initial research and product-design target. The interface is in English by default; Persian localization is in progress for future markets.

## User journey

1. A citizen discovers a community issue.
2. A citizen or authorized proposer creates a proposal.
3. An AI-assisted interface helps improve clarity and structure.
4. The proposal enters community discussion.
5. Eligible participants review and vote.
6. Authorized verifiers review procedural requirements.
7. Results and the proposal's status are transparently recorded.
8. A designated representative may prepare a submission package for a relevant public authority.
9. The submission status is tracked without claiming that a government has accepted or acted on it.

## Future directions (proposed, not approved)

- Supabase authentication and PostgreSQL
- Polygon zkEVM or another blockchain network for transparency layer
- OpenAI, Hugging Face, Ollama, or another AI provider
- Tokenomics (reputation points, participation tokens)
- Docker-based production deployment
- n8n-based automation
- Advanced social consensus algorithms
- Policy impact simulations

None of these are committed. Each requires explicit approval before implementation.
