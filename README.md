# Superteam Academy App

Frontend for the Superteam Academy Solana LMS bounty submission.

## Stack
- Next.js 16 (App Router, TypeScript strict)
- Tailwind CSS v4 + CSS tokens
- next-intl (EN, PT-BR, ES)
- Solana Wallet Adapter + Anchor client hooks
- NextAuth (Google/GitHub)
- Sanity (CMS with local JSON fallback)
- GA4 + Clarity + Sentry instrumentation

## App Routes
- `/{locale}` landing
- `/{locale}/courses`
- `/{locale}/courses/[courseId]`
- `/{locale}/courses/[courseId]/lessons/[lessonIndex]`
- `/{locale}/dashboard`
- `/{locale}/leaderboard`
- `/{locale}/profile`
- `/{locale}/profile/[username]`
- `/{locale}/settings`
- `/{locale}/certificates/[id]`
- `/{locale}/auth`

Locales: `en`, `pt-BR`, `es`.

## Quickstart
1. Install deps:
```bash
npm install
```
2. Create local env:
```bash
cp .env.example .env.local
```
3. Fill required vars (`NEXT_PUBLIC_RPC_URL`, auth/cms/analytics as needed).
4. Run dev server:
```bash
npm run dev
```
5. Open `http://localhost:3000`.

## Core Scripts
```bash
npm run dev
npm run type-check
npm run lint
npm run build
npm run audit:env
npm run audit:lighthouse
npm run audit:locales
npm run audit:mobile-overflow
npm run cms:seed
```

## Environment Variables
See `.env.example` for full list. Important groups:
- Solana: `NEXT_PUBLIC_RPC_URL`, `NEXT_PUBLIC_PROGRAM_ID`, `NEXT_PUBLIC_XP_MINT`, `BACKEND_SIGNER_KEYPAIR`, `HELIUS_API_KEY`
- CMS: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `SANITY_API_READ_TOKEN`
- Auth: `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID/SECRET`, `GITHUB_CLIENT_ID/SECRET`
- Analytics/observability: `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_CLARITY_PROJECT_ID`, `NEXT_PUBLIC_SENTRY_DSN`
- Security/ops: `INTERNAL_DIAGNOSTICS_TOKEN`, optional `UPSTASH_REDIS_REST_URL/TOKEN`

## Content Modes
- `local-json`: uses files in `src/content`
- `sanity-with-fallback`: uses Sanity and falls back to local content when unavailable

Check mode/status:
- `GET /api/cms-status`
- `GET /api/integration-status`

## Auth Model
- User is treated as logged in with either social session or connected wallet.
- On-chain actions require wallet signature.
- OAuth providers are optional in local dev but required for bounty verification.

## Deploy Notes
- Deploy on Vercel/Netlify.
- Set all production env vars.
- Verify OAuth callbacks and analytics dashboards.
- Use `../docs/DEPLOY-VERIFICATION-CHECKLIST.md` for final evidence steps.
