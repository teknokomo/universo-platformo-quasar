# universo-platformo-quasar
Implementation of Universo Platformo / Universo MMOOMM / Universo Kiberplano built on Quasar / NestJS and related stack in TypeScript

## Overview

This is a TypeScript monorepo implementing the Universo Platformo platform using:
- **Frontend**: [Quasar Framework](https://quasar.dev/) (Vue 3) for the UI
- **Backend**: [NestJS](https://nestjs.com/) for the API
- **Authentication**: [Supabase](https://supabase.com/) for auth and data
- **Monorepo**: [PNPM Workspaces](https://pnpm.io/workspaces) + [Turborepo](https://turbo.build/)

This project is a Quasar/NestJS port of [universo-platformo-react](https://github.com/teknokomo/universo-platformo-react).

## Project Structure

```
universo-platformo-quasar/
├── packages/
│   ├── start-frt/base/     # Quasar frontend (start pages + Supabase auth)
│   └── start-srv/base/     # NestJS backend (onboarding API)
├── package.json            # Root workspace config
├── pnpm-workspace.yaml     # PNPM workspace + catalog
├── turbo.json              # Turborepo pipeline config
└── tsconfig.json           # Base TypeScript config
```

## Getting Started

### Prerequisites

- Node.js >= 18.15.0 or ^20
- PNPM >= 9

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp packages/start-frt/base/.env.example packages/start-frt/base/.env
cp packages/start-srv/base/.env.example packages/start-srv/base/.env
# Edit the .env files with your Supabase credentials
```

### Development

```bash
# Start frontend dev server (http://localhost:9000)
cd packages/start-frt/base && pnpm dev

# Start backend dev server (http://localhost:3000)
cd packages/start-srv/base && pnpm dev
```

### Build

```bash
# Build all packages
pnpm build
```

## Features

### Start Pages

- **Guest Page** (`/`) - Landing page for non-authenticated users with hero section, product testimonials, and footer
- **Authenticated Page** (`/`) - Onboarding wizard for newly authenticated users (shown after login)
- **Auth Page** (`/auth`) - Supabase sign-in / sign-up form

### Authentication

Authentication is handled via Supabase directly from the frontend using `@supabase/supabase-js`.
The backend validates Supabase JWT tokens using `passport-jwt`.

### Internationalization

The application supports English and Russian languages via `vue-i18n`.

## Environment Variables

### Frontend (`packages/start-frt/base/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key |

### Backend (`packages/start-srv/base/.env`)

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Your Supabase anonymous key |
| `SUPABASE_JWT_SECRET` | Your Supabase JWT secret (from Project Settings > API) |
| `PORT` | Server port (default: 3000) |
| `FRONTEND_URL` | Frontend URL for CORS (default: http://localhost:9000) |

<details>
<summary>In Russian / На русском</summary>

# universo-platformo-quasar
Реализация Universo Platformo / Universo MMOOMM / Universo Kiberplano на Quasar / NestJS и связанном стеке на TypeScript

## Обзор

Это TypeScript монорепозиторий, реализующий платформу Universo Platformo с использованием:
- **Фронтенд**: [Quasar Framework](https://quasar.dev/) (Vue 3) для UI
- **Бэкенд**: [NestJS](https://nestjs.com/) для API
- **Аутентификация**: [Supabase](https://supabase.com/) для авторизации и данных
- **Монорепо**: [PNPM Workspaces](https://pnpm.io/workspaces) + [Turborepo](https://turbo.build/)

Этот проект является портом [universo-platformo-react](https://github.com/teknokomo/universo-platformo-react) на Quasar/NestJS.

## Начало работы

### Установка

```bash
pnpm install
cp packages/start-frt/base/.env.example packages/start-frt/base/.env
cp packages/start-srv/base/.env.example packages/start-srv/base/.env
# Заполните .env файлы вашими учётными данными Supabase
```

### Разработка

```bash
# Запуск фронтенда (http://localhost:9000)
cd packages/start-frt/base && pnpm dev

# Запуск бэкенда (http://localhost:3000)
cd packages/start-srv/base && pnpm dev
```

</details>
