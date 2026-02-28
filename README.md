# universo-platformo-quasar

Universo Platformo — the unified platform for knowledge, planning, creativity and collaboration,
built on Quasar (Vue 3) / NestJS / TypeScript as a PNPM monorepo.

This project is the Quasar/NestJS port of
[universo-platformo-react](https://github.com/teknokomo/universo-platformo-react).

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | [Quasar Framework](https://quasar.dev/) (Vue 3 + TypeScript) |
| Backend | [NestJS](https://nestjs.com/) + [Fastify](https://fastify.dev/) (TypeScript) |
| Auth / DB | [Supabase](https://supabase.com/) (PostgreSQL + Auth) |
| Monorepo | [PNPM Workspaces](https://pnpm.io/workspaces) + [Turborepo](https://turbo.build/) |
| i18n | [vue-i18n](https://vue-i18n.intlify.dev/) (English + Russian) |

---

## Architecture: Supabase Through the Backend

**All Supabase operations are performed server-side through the NestJS backend.**
The frontend has no direct access to Supabase — it communicates only with its own backend.

```
Browser (Quasar)
    │  POST /api/v1/auth/login  (email + password)
    │  GET  /api/v1/auth/me
    │  GET  /api/v1/onboarding/items
    ▼
NestJS Backend (start-srv)
    │  local JWT validation (SUPABASE_JWT_SECRET)
    │  signInWithPassword(email, password)
    ▼
Supabase Auth / PostgreSQL
```

**Session management** uses two HTTP-only cookies set by the backend after successful login:
a short-lived access token cookie (`sb_access_token`) and a longer-lived refresh token cookie
(`sb_refresh_token`). The access token cookie is sent automatically with every request
(`withCredentials: true`) and is validated locally using `SUPABASE_JWT_SECRET` — no extra
round-trip to Supabase on every request. When the access token expires, the frontend interceptor
calls `/auth/refresh`, and the backend uses the refresh token cookie to obtain a new access token
and rotate both cookies, without ever exposing tokens to frontend JavaScript.

---

## Project Structure

```
universo-platformo-quasar/
├── packages/
│   ├── start-frt/base/     # Quasar frontend (start pages, auth UI, i18n)
│   └── start-srv/base/     # NestJS backend (auth proxy, onboarding API)
├── package.json            # Root workspace — scripts, Prettier config
├── pnpm-workspace.yaml     # PNPM workspace + dependency catalog
├── turbo.json              # Turborepo pipeline (build / dev / test / lint)
└── tsconfig.json           # Base TypeScript config (shared by all packages)
```

### Frontend (`packages/start-frt/base/`)

| Path | Description |
|------|-------------|
| `src/pages/StartPage.vue` | Entry — renders GuestPage or AuthenticatedPage |
| `src/pages/GuestPage.vue` | Landing page for non-authenticated users |
| `src/pages/AuthenticatedPage.vue` | Onboarding wizard for authenticated users |
| `src/pages/AuthPage.vue` | Sign-in / sign-up form |
| `src/composables/useAuth.ts` | Auth state — calls `/api/v1/auth/*` |
| `src/composables/useOnboarding.ts` | Onboarding data — calls `/api/v1/onboarding/*` |
| `src/components/HeroSection.vue` | Hero with title, description, CTA button |
| `src/components/TestimonialsSection.vue` | Four Universo product cards |
| `src/components/OnboardingWizard.vue` | Multi-step interest selector |
| `src/components/StartFooter.vue` | Footer with contact links |
| `src/i18n/en-US/`, `src/i18n/ru-RU/` | Full EN / RU translations |

### Backend (`packages/start-srv/base/`)

| Path | Description |
|------|-------------|
| `src/auth/auth.controller.ts` | `POST /auth/login`, `POST /auth/register`, `POST /auth/logout`, `GET /auth/me` |
| `src/auth/supabase.service.ts` | Server-side Supabase proxy (signIn, signUp) |
| `src/auth/supabase.strategy.ts` | Passport JWT — extracts token from cookie or Bearer |
| `src/auth/auth.guard.ts` | Guards protected routes |
| `src/onboarding/onboarding.controller.ts` | `GET /onboarding/items`, `POST /onboarding/join` |
| `src/onboarding/onboarding.service.ts` | Onboarding business logic |

---

## API Endpoints

All endpoints are prefixed with `/api/v1`.

### Auth (no authentication required)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/auth/login` | Sign in; sets `sb_access_token` HTTP-only cookie |
| `POST` | `/auth/register` | Register new user |
| `POST` | `/auth/logout` | Clear session cookies |
| `POST` | `/auth/refresh` | Refresh access token using refresh cookie |

### Auth (authentication required)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/auth/me` | Return current authenticated user |

### Onboarding (authentication required)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/onboarding/items` | Get available onboarding items and selection status |
| `POST` | `/onboarding/join` | Save selected items and mark onboarding complete |

---

## Getting Started

### Prerequisites

- Node.js `>= 18.15.0` or `^20`
- PNPM `>= 9`
- A [Supabase](https://supabase.com/) project (free tier is sufficient)

### Installation

```bash
# Install all workspace dependencies
pnpm install

# Configure the backend
cp packages/start-srv/base/.env.example packages/start-srv/base/.env
# Edit .env — fill in SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_JWT_SECRET

# The frontend needs no Supabase credentials — just the proxy config
cp packages/start-frt/base/.env.example packages/start-frt/base/.env
```

### Development

```bash
# Terminal 1 — NestJS backend (http://localhost:3000)
cd packages/start-srv/base && pnpm dev

# Terminal 2 — Quasar frontend (http://localhost:9000)
cd packages/start-frt/base && pnpm dev
```

The frontend Vite dev server proxies `/api/*` to `http://localhost:3000`.

### Build

```bash
# Build all packages via Turborepo
pnpm build
```

---

## Environment Variables

### Backend (`packages/start-srv/base/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | ✅ | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | ✅ | Your Supabase anonymous key |
| `SUPABASE_JWT_SECRET` | ✅ | JWT secret (Project Settings → API → JWT Secret) |
| `PORT` | — | Server port (default: `3000`) |
| `FRONTEND_URL` | — | Frontend origin for CORS (default: `http://localhost:9000`) |
| `NODE_ENV` | — | `production` enables `Secure` cookie flag |

### Frontend (`packages/start-frt/base/.env`)

The frontend requires **no Supabase credentials**.
In production, configure a reverse proxy so `/api` points to the backend.

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_BASE_URL` | — | API base URL (default: `/api/v1` via Vite proxy) |

---

## Features

- **Guest Page** — landing page with hero section, four Universo product cards, footer
- **Auth Page** — sign-in / sign-up form; credentials go to the NestJS backend only
- **Authenticated Page** — onboarding wizard (Projects / Campaigns / Clusters selector)
- **HTTP-only cookie sessions** — no tokens in `localStorage` or JavaScript memory
- **Bilingual** — full English and Russian UI via `vue-i18n`
