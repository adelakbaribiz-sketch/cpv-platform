# Deployment

## Local development (mock mode)

```bash
npm install
npm run dev
```

Open http://localhost:3000. No external credentials required.

## Production build

```bash
npm run build
npm run start
```

The build uses Next.js standalone output. The standalone server runs from `.next/standalone/server.js`.

## Docker

A multi-stage `Dockerfile` and `docker-compose.yml` are provided.

```bash
# Build the image
docker build -t cpv-platform:0.1.0-mvp .

# Run on port 3000
docker run -p 3000:3000 --env-file .env.example cpv-platform:0.1.0-mvp

# Or via docker compose
docker compose up --build
```

The Docker image runs the standalone Next.js server with a minimal footprint. Health check is included.

## Environment variables

Phase 1 requires **no** environment variables to run in mock mode. The following are placeholders for future phases — see `.env.example`:

```
# Future: Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # server-only, never expose to browser

# Future: AI provider
AI_PROVIDER=mock                    # mock | openai | hf | ollama
OPENAI_API_KEY=                     # server-only

# Future: blockchain
BLOCKCHAIN_NETWORK=
BLOCKCHAIN_RPC_URL=

# Future: automation
N8N_WEBHOOK_URL=
```

**Never commit `.env.local`.** Only `.env.example` is tracked.

## Deployment targets (future)

- Vercel (recommended for Next.js)
- Self-hosted with Docker + Caddy/Nginx
- Cloud provider (AWS, GCP, Azure) with managed Postgres

Phase 1 has no preferred target — this is a prototype. Production deployment requires explicit user approval.
