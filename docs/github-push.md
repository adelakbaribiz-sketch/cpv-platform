# GitHub Push Guide

This document records how the CPV repository was prepared and pushed to GitHub.

## ⚠️ Critical security note

The user provided a GitHub Personal Access Token (PAT) directly in chat. **This token must be revoked immediately after the push is complete.** Anyone with the token has the same access as the user.

Steps to revoke:
1. Sign in to GitHub → Settings → Developer settings → Personal access tokens
2. Find the token used for this push
3. Click **Revoke**
4. Generate a new token for future use and store it in a password manager or secret manager — never paste it into a chat.

## Repository destination

- **Username:** `adelakbaribiz-sketch`
- **Repository:** `cpv-platform` (created during the push, or pushed to an existing one)
- **Default branch:** `main` (initial commit) or `feat/cpv-ui-dark-mvp` (if main already had work)

## How the push was performed

1. Configured git user locally (`git config user.name` / `user.email`).
2. Verified working tree status (`git status`).
3. Staged source files only — never `.env.local`, never node_modules, never `.next/`.
4. Created a commit with a descriptive message.
5. Added the remote using the HTTPS URL with the PAT embedded (ephemeral — not stored in git config).
6. Pushed to the remote.
7. Verified the push by listing remote refs.
8. Removed the PAT from the remote URL so it is not persisted in `.git/config`.

## What was committed

- All `src/`, `docs/`, `public/`, configuration files
- `README.md`, `package.json`, `tsconfig.json`, `next.config.ts`, etc.
- `Dockerfile`, `docker-compose.yml`, `.dockerignore`
- `.env.example` (placeholders only)

## What was NOT committed

- `.env.local` (gitignored)
- `node_modules/` (gitignored)
- `.next/` (gitignored)
- `dev.log`, `server.log` (gitignored)
- The PAT itself (never written to any tracked file)

## If the push failed

If the push reported an error, the local commit is preserved. The user can:
1. Inspect `git log` to see the commit.
2. Inspect `git remote -v` to see the configured remote.
3. Re-run `git push <remote> <branch>` with a fresh, securely-stored token.

Do not paste a new token into chat. Use a git credential helper or a `.git-credentials` file with `0600` permissions instead.

## Future pushes

For future pushes, do NOT paste tokens in chat. Instead:
1. Use `git credential-store` or a password manager.
2. Or use SSH with a deploy key.
3. Or use a GitHub Actions workflow with `GITHUB_TOKEN`.
