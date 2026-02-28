# universo-platformo-quasar

Universo Platformo — единая платформа для знаний, планирования, творчества и совместной работы,
построенная на Quasar (Vue 3) / NestJS / TypeScript в виде PNPM-монорепозитория.

Этот проект является портом
[universo-platformo-react](https://github.com/teknokomo/universo-platformo-react) на Quasar/NestJS.

---

## Технологический стек

| Слой | Технология |
|------|------------|
| Фронтенд | [Quasar Framework](https://quasar.dev/) (Vue 3 + TypeScript) |
| Бэкенд | [NestJS](https://nestjs.com/) + [Fastify](https://fastify.dev/) (TypeScript) |
| Auth / БД | [Supabase](https://supabase.com/) (PostgreSQL + Auth) |
| Монорепо | [PNPM Workspaces](https://pnpm.io/workspaces) + [Turborepo](https://turbo.build/) |
| i18n | [vue-i18n](https://vue-i18n.intlify.dev/) (английский + русский) |

---

## Архитектура: Supabase через бэкенд

**Все операции с Supabase выполняются на стороне сервера через бэкенд NestJS.**
Фронтенд не имеет прямого доступа к Supabase — он взаимодействует только со своим бэкендом.

```
Браузер (Quasar)
    │  POST /api/v1/auth/login  (email + password)
    │  GET  /api/v1/auth/me
    │  GET  /api/v1/onboarding/items
    ▼
NestJS Бэкенд (start-srv)
    │  signInWithPassword(email, password)
    │  getUser(accessToken)
    ▼
Supabase Auth / PostgreSQL
```

**Управление сессией** использует пару HTTP-only кук, установленных бэкендом после успешного входа:
короткоживущую `sb_access_token` (соответствует времени жизни JWT Supabase, обычно ~1 час) и
долгоживущую `sb_refresh_token` (7 дней) для обновления access-токена. Access-кука передаётся
автоматически с каждым запросом (`withCredentials: true`). Бэкенд проверяет JWT Supabase локально
с помощью `SUPABASE_JWT_SECRET` — без лишних обращений к Supabase при каждом запросе. Когда
access-токен истекает, фронтенд-интерсептор вызывает `/auth/refresh`, и бэкенд использует refresh-куку
для получения нового access-токена и ротации обеих кук, не раскрывая токены JavaScript-коду фронтенда.

---

## Структура проекта

```
universo-platformo-quasar/
├── packages/
│   ├── start-frt/base/     # Quasar фронтенд (стартовые страницы, UI авторизации, i18n)
│   └── start-srv/base/     # NestJS бэкенд (прокси авторизации, API онбординга)
├── package.json            # Корень монорепо — скрипты, конфигурация Prettier
├── pnpm-workspace.yaml     # PNPM воркспейс + каталог зависимостей
├── turbo.json              # Turborepo пайплайн (build / dev / test / lint)
└── tsconfig.json           # Базовая конфигурация TypeScript (общая для всех пакетов)
```

### Фронтенд (`packages/start-frt/base/`)

| Путь | Описание |
|------|----------|
| `src/pages/StartPage.vue` | Точка входа — отображает GuestPage или AuthenticatedPage |
| `src/pages/GuestPage.vue` | Лендинг для неавторизованных пользователей |
| `src/pages/AuthenticatedPage.vue` | Мастер онбординга для авторизованных пользователей |
| `src/pages/AuthPage.vue` | Форма входа / регистрации |
| `src/composables/useAuth.ts` | Состояние авторизации — обращается к `/api/v1/auth/*` |
| `src/composables/useOnboarding.ts` | Данные онбординга — обращается к `/api/v1/onboarding/*` |
| `src/components/HeroSection.vue` | Герой с заголовком, описанием, кнопкой CTA |
| `src/components/TestimonialsSection.vue` | Четыре карточки продуктов Universo |
| `src/components/OnboardingWizard.vue` | Многошаговый выбор интересов |
| `src/components/StartFooter.vue` | Подвал с контактными ссылками |
| `src/i18n/en-US/`, `src/i18n/ru-RU/` | Полные переводы EN / RU |

### Бэкенд (`packages/start-srv/base/`)

| Путь | Описание |
|------|----------|
| `src/auth/auth.controller.ts` | `POST /auth/login`, `POST /auth/register`, `POST /auth/logout`, `GET /auth/me` |
| `src/auth/supabase.service.ts` | Серверный прокси Supabase (signIn, signUp) |
| `src/auth/supabase.strategy.ts` | Passport JWT — извлекает токен из куки или Bearer |
| `src/auth/auth.guard.ts` | Защищает маршруты, требующие авторизации |
| `src/onboarding/onboarding.controller.ts` | `GET /onboarding/items`, `POST /onboarding/join` |
| `src/onboarding/onboarding.service.ts` | Бизнес-логика онбординга |

---

## API Эндпоинты

Все эндпоинты имеют префикс `/api/v1`.

### Авторизация (без аутентификации)

| Метод | Путь | Описание |
|-------|------|----------|
| `POST` | `/auth/login` | Вход; устанавливает HTTP-only куку `sb_access_token` |
| `POST` | `/auth/register` | Регистрация нового пользователя |
| `POST` | `/auth/logout` | Очистка кук сессии |
| `POST` | `/auth/refresh` | Обновление access-токена с помощью refresh-куки |

### Авторизация (требуется аутентификация)

| Метод | Путь | Описание |
|-------|------|----------|
| `GET` | `/auth/me` | Возврат данных текущего авторизованного пользователя |

### Онбординг (требуется аутентификация)

| Метод | Путь | Описание |
|-------|------|----------|
| `GET` | `/onboarding/items` | Получить доступные элементы и статус выбора |
| `POST` | `/onboarding/join` | Сохранить выбранные элементы и завершить онбординг |

---

## Быстрый старт

### Требования

- Node.js `>= 18.15.0` или `^20`
- PNPM `>= 9`
- Проект [Supabase](https://supabase.com/) (бесплатный тариф достаточен)

### Установка

```bash
# Установить все зависимости воркспейса
pnpm install

# Настроить бэкенд
cp packages/start-srv/base/.env.example packages/start-srv/base/.env
# Заполните .env — укажите SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_JWT_SECRET

# Фронтенду не нужны учётные данные Supabase — только конфигурация прокси
cp packages/start-frt/base/.env.example packages/start-frt/base/.env
```

### Разработка

```bash
# Терминал 1 — NestJS бэкенд (http://localhost:3000)
cd packages/start-srv/base && pnpm dev

# Терминал 2 — Quasar фронтенд (http://localhost:9000)
cd packages/start-frt/base && pnpm dev
```

Dev-сервер Vite проксирует `/api/*` на `http://localhost:3000`.

### Сборка

```bash
# Собрать все пакеты через Turborepo
pnpm build
```

---

## Переменные окружения

### Бэкенд (`packages/start-srv/base/.env`)

| Переменная | Обязательно | Описание |
|------------|-------------|----------|
| `SUPABASE_URL` | ✅ | URL вашего проекта Supabase |
| `SUPABASE_ANON_KEY` | ✅ | Анонимный ключ Supabase |
| `SUPABASE_JWT_SECRET` | ✅ | JWT-секрет (Project Settings → API → JWT Secret) |
| `PORT` | — | Порт сервера (по умолчанию: `3000`) |
| `FRONTEND_URL` | — | Origin фронтенда для CORS (по умолчанию: `http://localhost:9000`) |
| `NODE_ENV` | — | `production` включает флаг `Secure` для куки |

### Фронтенд (`packages/start-frt/base/.env`)

Фронтенду **не нужны учётные данные Supabase**.
В production настройте обратный прокси так, чтобы `/api` указывал на бэкенд.

| Переменная | Обязательно | Описание |
|------------|-------------|----------|
| `VITE_API_BASE_URL` | — | Базовый URL API (по умолчанию: `/api/v1` через прокси Vite) |

---

## Возможности

- **Гостевая страница** — лендинг с секцией-героем, четырьмя карточками продуктов Universo, подвалом
- **Страница авторизации** — форма входа/регистрации; учётные данные передаются только бэкенду
- **Страница авторизованного пользователя** — мастер онбординга (выбор Проектов / Кампаний / Кластеров)
- **Сессии в HTTP-only куках** — никаких токенов в `localStorage` или памяти JavaScript
- **Двуязычный** — полный английский и русский интерфейс через `vue-i18n`
