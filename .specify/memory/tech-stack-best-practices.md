# Technology Stack Best Practices

**Date**: 2025-11-18  
**Version**: 1.0.0  
**Purpose**: Document best practices for Quasar/NestJS implementation based on React repository patterns and tech stack research

## Executive Summary

This document consolidates best practices for the Universo Platformo Quasar implementation, combining:
1. Architectural patterns from the React reference implementation (universo-platformo-react)
2. Quasar Framework and NestJS best practices from industry research
3. Tech stack-specific patterns adapted for Quasar/NestJS

## Sources

### Primary Sources
- **React Repository**: https://github.com/teknokomo/universo-platformo-react
- **Web Research**: Quasar/NestJS monorepo patterns, communication best practices
- **Context7 Documentation**: Quasar Framework and NestJS official documentation
- **Quasar Project Constitution**: v1.4.0 (2025-11-17)

### Research Findings
- Monorepo organization with PNPM workspaces
- Feature-first architecture (not layer-first)
- Shared type contracts between frontend and backend
- Modular package structure with clear separation
- TypeScript strict mode enforcement
- RESTful API communication patterns

---

## 1. Monorepo Architecture

### 1.1 Workspace Structure

**Pattern from React Repository**:
```yaml
# pnpm-workspace.yaml
packages:
    - 'packages/*'
    - 'packages/*/base'
```

**Quasar/NestJS Adaptation**:
- ✅ Use identical structure
- ✅ All packages in `packages/` directory
- ✅ Each package has `base/` subdirectory
- ✅ Supports multiple implementations per package

**Rationale**: The `base/` pattern allows for technology-specific implementations while maintaining consistent interface. Future alternate implementations can coexist (e.g., `packages/clusters-frt/base/` and `packages/clusters-frt/material-variant/`).

### 1.2 Package Naming Convention

**Pattern from React Repository**:
- Frontend packages: `clusters-frt`, `spaces-frt`, `metaverses-frt`
- Backend packages: `clusters-srv`, `spaces-srv`, `metaverses-srv`
- Shared packages: `universo-types`, `universo-utils`, `universo-i18n`
- Package names: `@universo/clusters-frt`, `@universo/types`

**Quasar/NestJS Application**:
- ✅ Use `-frt` suffix for Quasar frontend packages
- ✅ Use `-srv` suffix for NestJS backend packages
- ✅ Use `universo-*` prefix for shared infrastructure
- ✅ All packages use `@universo/` namespace

**Example Structure**:
```
packages/
├── clusters-frt/base/           # Quasar frontend
│   ├── package.json            # name: "@universo/clusters-frt"
│   ├── src/
│   └── quasar.config.js
├── clusters-srv/base/           # NestJS backend
│   ├── package.json            # name: "@universo/clusters-srv"
│   ├── src/
│   └── nest-cli.json
├── universo-types/base/         # Shared types
│   ├── package.json            # name: "@universo/types"
│   └── src/
└── universo-utils/base/         # Shared utilities
    ├── package.json            # name: "@universo/utils"
    └── src/
```

### 1.3 Dependency Management

**Pattern from React Repository** (PNPM Catalog):
```yaml
catalog:
    typescript: ^5.8.3
    react: ^18.3.1
    axios: ^1.7.9
    # ... centralized versions
```

**Quasar/NestJS Adaptation**:
```yaml
catalog:
    typescript: ^5.8.3
    quasar: ^2.16.0
    '@nestjs/core': ^10.0.0
    axios: ^1.7.9
    vitest: ^2.1.8
    # ... Quasar/NestJS specific
```

**Best Practices**:
- ✅ Use workspace catalog for all shared dependencies
- ✅ Pin major versions, allow minor/patch updates
- ✅ Document version selection rationale
- ✅ Use PNPM overrides for security patches
- ✅ Consistent TypeScript version across all packages

---

## 2. Frontend Architecture (Quasar)

### 2.1 Quasar Project Structure

**Industry Best Practices** (from research):
- Feature-first organization (not layer-first)
- Modular directory structure using Quasar conventions
- Centralize API calls in composables or stores
- Use Quasar boot files for initialization

**Recommended Structure**:
```
packages/clusters-frt/base/
├── src/
│   ├── boot/                # Boot files (auth, i18n, api)
│   ├── pages/               # Page components (feature-first)
│   │   ├── ClustersPage.vue
│   │   ├── DomainsPage.vue
│   │   └── ResourcesPage.vue
│   ├── components/          # Reusable components
│   │   └── clusters/
│   │       ├── ClusterCard.vue
│   │       └── ClusterList.vue
│   ├── composables/         # Composition API functions
│   │   └── useClusters.ts
│   ├── stores/              # Pinia stores
│   │   └── clusters.ts
│   ├── api/                 # API client functions
│   │   └── clusters.ts
│   └── router/
│       └── routes.ts
├── quasar.config.js
└── package.json
```

### 2.2 Quasar Components

**Best Practices**:
- ✅ Use Quasar's built-in Material Design components
- ✅ No need for separate UI library (Quasar provides comprehensive component set)
- ✅ Leverage Quasar's responsive utilities
- ✅ Use Quasar's theming system
- ❌ Don't install MUI or other UI libraries (unnecessary overhead)

**Quasar vs React Difference**:
- React implementation uses MUI v6
- Quasar has built-in Material Design components
- Result: Cleaner dependencies, better integration

### 2.3 State Management

**Best Practices**:
- ✅ Use Pinia (Quasar/Vue 3 standard) instead of Redux
- ✅ Create stores per feature domain (clusters, spaces, etc.)
- ✅ Co-locate stores with feature packages
- ✅ Use TypeScript for type-safe stores

**Example Store**:
```typescript
// packages/clusters-frt/base/src/stores/clusters.ts
import { defineStore } from 'pinia';
import type { Cluster } from '@universo/types';

export const useClustersStore = defineStore('clusters', {
  state: () => ({
    clusters: [] as Cluster[],
    loading: false,
  }),
  actions: {
    async fetchClusters() {
      this.loading = true;
      // ... fetch logic
    }
  }
});
```

### 2.4 API Communication

**Pattern from Research**:
- Use Axios for HTTP requests
- Configure dev server proxy to avoid CORS
- Centralize API calls in dedicated modules
- Use shared types from `@universo/types`

**Quasar Configuration**:
```javascript
// quasar.config.js
devServer: {
  proxy: {
    '/api': {
      target: 'http://localhost:3001', // NestJS server
      changeOrigin: true,
    }
  }
}
```

**API Client Module**:
```typescript
// packages/clusters-frt/base/src/api/clusters.ts
import axios from 'axios';
import type { Cluster, CreateClusterDto } from '@universo/types';

export const clustersApi = {
  async getAll(): Promise<Cluster[]> {
    const { data } = await axios.get('/api/v1/clusters');
    return data;
  },
  
  async create(dto: CreateClusterDto): Promise<Cluster> {
    const { data } = await axios.post('/api/v1/clusters', dto);
    return data;
  }
};
```

---

## 3. Backend Architecture (NestJS)

### 3.1 NestJS Module Structure

**Industry Best Practices** (from research):
- Feature-first structure (not layer-first)
- Each feature as self-contained module
- Apply SOLID principles
- Avoid "dumping ground" shared modules

**Recommended Structure**:
```
packages/clusters-srv/base/
├── src/
│   ├── clusters/                # Feature module
│   │   ├── clusters.controller.ts
│   │   ├── clusters.service.ts
│   │   ├── clusters.module.ts
│   │   ├── dto/
│   │   │   ├── create-cluster.dto.ts
│   │   │   └── update-cluster.dto.ts
│   │   └── entities/
│   │       └── cluster.entity.ts
│   ├── domains/                 # Feature module
│   ├── resources/               # Feature module
│   └── main.ts
├── nest-cli.json
└── package.json
```

### 3.2 DTOs and Validation

**Best Practices** (from research):
- ✅ Use DTOs for all API inputs/outputs
- ✅ Implement class-validator for validation
- ✅ Share DTO types via `@universo/types`
- ✅ Validate at controller level

**Example DTO**:
```typescript
// packages/universo-types/base/src/clusters/dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateClusterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;
}
```

**Controller Usage**:
```typescript
// packages/clusters-srv/base/src/clusters/clusters.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { CreateClusterDto } from '@universo/types';

@Controller('clusters')
export class ClustersController {
  @Post()
  async create(@Body() dto: CreateClusterDto) {
    // DTO automatically validated by class-validator
    return this.clustersService.create(dto);
  }
}
```

### 3.3 Authentication

**Pattern from React Repository**:
- Passport.js with Supabase connector
- JWT-based authentication
- Separate auth packages: `auth-frt` and `auth-srv`

**NestJS Implementation**:
```typescript
// packages/auth-srv/base/src/strategies/supabase.strategy.ts
import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, 'supabase') {
  async validate(req: any): Promise<any> {
    // Supabase JWT validation logic
  }
}
```

### 3.4 Database (TypeORM + Supabase)

**Pattern from React Repository**:
- TypeORM for ORM layer
- Supabase (PostgreSQL) as primary database
- Architecture supports future DBMS additions

**NestJS Configuration**:
```typescript
// packages/clusters-srv/base/src/clusters/entities/cluster.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('clusters')
export class ClusterEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;
}
```

---

## 4. Shared Infrastructure Packages

### 4.1 @universo/types

**Purpose**: Centralized TypeScript type definitions

**Pattern from React Repository**:
- Single source of truth for types
- Used by both frontend and backend
- Prevents duplication and ensures consistency

**Structure**:
```
packages/universo-types/base/
├── src/
│   ├── clusters/
│   │   ├── types.ts        # Cluster, Domain, Resource types
│   │   └── dto.ts          # CreateClusterDto, etc.
│   ├── auth/
│   │   └── types.ts
│   └── index.ts            # Re-export all types
└── package.json
```

**Best Practices**:
- ✅ Export interfaces and types (not classes)
- ✅ Use TypeScript strict mode
- ✅ Provide JSDoc comments
- ✅ Version carefully (breaking changes affect all packages)

### 4.2 @universo/utils

**Purpose**: Shared utility functions

**Pattern from React Repository**:
- Pure functions
- No framework dependencies
- Well-tested utilities

**Example**:
```typescript
// packages/universo-utils/base/src/validation.ts
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}
```

### 4.3 @universo/i18n

**Purpose**: Centralized internationalization

**Pattern from React Repository**:
- Single i18next instance
- Shared translation keys
- Used by both frontend and backend

**Quasar/NestJS Adaptation**:
```typescript
// packages/universo-i18n/base/src/config.ts
import i18next from 'i18next';

export const i18nConfig = {
  fallbackLng: 'en',
  supportedLngs: ['en', 'ru'],
  defaultNS: 'common',
  ns: ['common', 'clusters', 'auth'],
};

export function initI18n() {
  return i18next.init({
    ...i18nConfig,
    resources: {
      en: {
        common: require('./locales/en/common.json'),
        clusters: require('./locales/en/clusters.json'),
      },
      ru: {
        common: require('./locales/ru/common.json'),
        clusters: require('./locales/ru/clusters.json'),
      }
    }
  });
}
```

### 4.4 @universo/api-client

**Purpose**: Type-safe API client implementations

**Pattern from React Repository**:
- Axios-based HTTP client
- Type-safe request/response
- Error handling

**Example**:
```typescript
// packages/universo-api-client/base/src/clusters.ts
import axios, { AxiosInstance } from 'axios';
import type { Cluster, CreateClusterDto } from '@universo/types';

export class ClustersApiClient {
  constructor(private readonly axios: AxiosInstance) {}

  async getAll(): Promise<Cluster[]> {
    const { data } = await this.axios.get('/api/v1/clusters');
    return data;
  }

  async create(dto: CreateClusterDto): Promise<Cluster> {
    const { data } = await this.axios.post('/api/v1/clusters', dto);
    return data;
  }
}
```

---

## 5. Build System and Tooling

### 5.1 Turborepo Configuration

**Pattern from React Repository**:
```json
{
    "$schema": "https://turbo.build/schema.json",
    "pipeline": {
        "build": {
            "dependsOn": ["^build"],
            "outputs": ["dist/**", "build/**"],
            "cache": false
        },
        "test": {},
        "dev": {
            "cache": false,
            "persistent": true
        },
        "clean": {
            "cache": false
        }
    }
}
```

**Quasar/NestJS Adaptation**:
- ✅ Use identical structure
- ✅ Add Quasar-specific outputs
- ✅ Add NestJS-specific outputs

**Enhanced Configuration**:
```json
{
    "$schema": "https://turbo.build/schema.json",
    "pipeline": {
        "build": {
            "dependsOn": ["^build"],
            "outputs": ["dist/**", "build/**", ".quasar/**"],
            "cache": false
        },
        "build:quasar": {
            "dependsOn": ["^build"],
            "outputs": ["dist/spa/**", "dist/pwa/**"]
        },
        "build:nest": {
            "dependsOn": ["^build"],
            "outputs": ["dist/**"]
        },
        "test": {},
        "dev": {
            "cache": false,
            "persistent": true
        },
        "clean": {
            "cache": false
        }
    }
}
```

### 5.2 Dual-Build for Libraries

**Pattern from React Repository**:
- Build CJS + ESM + TypeScript declarations
- Use tsdown or similar bundler
- Optimize for tree-shaking

**Package.json Configuration**:
```json
{
  "name": "@universo/types",
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  },
  "files": ["dist", "src"],
  "sideEffects": false
}
```

### 5.3 TypeScript Configuration

**Pattern from React Repository**:
- Root tsconfig.json with base settings
- Package-specific extends
- Strict mode in packages
- Decorators for NestJS

**Root tsconfig.json**:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "paths": {
      "@universo/*": ["packages/*/base/src"],
      "@testing/*": ["tools/testing/*"]
    }
  }
}
```

**NestJS Package tsconfig.json**:
```json
{
  "extends": "../../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "test"]
}
```

---

## 6. Frontend-Backend Communication

### 6.1 API Contract Pattern

**Best Practices** (from research):
- Define clear RESTful endpoints
- Use API versioning (`/api/v1/`)
- Share DTOs via `@universo/types`
- Document with OpenAPI/Swagger

**Example Contract**:
```typescript
// @universo/types - Shared between frontend and backend
export interface Cluster {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}

export interface CreateClusterDto {
  name: string;
  description: string;
}

// API Endpoints Contract
// GET    /api/v1/clusters       -> Cluster[]
// POST   /api/v1/clusters       -> Cluster
// GET    /api/v1/clusters/:id   -> Cluster
// PUT    /api/v1/clusters/:id   -> Cluster
// DELETE /api/v1/clusters/:id   -> void
```

### 6.2 Error Handling

**Best Practices**:
- ✅ Standardize error response format
- ✅ Use HTTP status codes correctly
- ✅ Provide user-friendly error messages
- ✅ Log errors on backend

**Error Response Format**:
```typescript
// @universo/types
export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
  timestamp: string;
}
```

**NestJS Exception Filter**:
```typescript
// packages/clusters-srv/base/src/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
```

### 6.3 Authentication Flow

**Pattern**:
1. Frontend sends credentials to `/api/v1/auth/login`
2. Backend validates with Supabase
3. Backend returns JWT token
4. Frontend stores token (HttpOnly cookie preferred)
5. Frontend includes token in subsequent requests
6. Backend validates token with Passport.js guard

**Implementation**:
```typescript
// Frontend (Quasar boot file)
// boot/auth.ts
import { boot } from 'quasar/wrappers';
import axios from 'axios';

export default boot(({ app, router }) => {
  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
});
```

```typescript
// Backend (NestJS guard)
// auth-srv/base/src/guards/jwt.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

// Usage in controller
@Controller('clusters')
@UseGuards(JwtAuthGuard)
export class ClustersController {
  // Protected endpoints
}
```

---

## 7. Testing Strategy

### 7.1 Vitest Configuration

**Pattern from React Repository**:
- Vitest for unit and integration tests
- Happy DOM for browser simulation
- Coverage with @vitest/coverage-v8

**Quasar Package Configuration**:
```typescript
// packages/clusters-frt/base/vitest.config.ts
import { defineConfig } from 'vitest/config';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    quasar()
  ],
  test: {
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
});
```

**NestJS Package Configuration**:
```typescript
// packages/clusters-srv/base/vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
});
```

### 7.2 Testing Best Practices

**Frontend Testing**:
- ✅ Test components with @testing-library/vue
- ✅ Test composables independently
- ✅ Test API clients with mock axios
- ✅ Test stores with Pinia testing utilities

**Backend Testing**:
- ✅ Test services with mocked dependencies
- ✅ Test controllers with NestJS testing utilities
- ✅ Test e2e with supertest
- ✅ Test database operations with test database

---

## 8. Code Quality and Automation

### 8.1 ESLint Configuration

**Pattern from React Repository**:
```javascript
// .eslintrc.js (root)
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['unused-imports'],
  rules: {
    'unused-imports/no-unused-imports': 'error',
  }
};
```

**Quasar/NestJS Additions**:
```javascript
// .eslintrc.js (root)
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended', // For Quasar
  ],
  plugins: ['unused-imports'],
  rules: {
    'unused-imports/no-unused-imports': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
  }
};
```

### 8.2 Husky and lint-staged

**Pattern from React Repository**:
```json
// package.json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{ts,tsx,vue}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

**Husky Pre-commit Hook**:
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
```

---

## 9. Documentation Standards

### 9.1 Package README Template

**Pattern from React Repository**:
- Standardized structure for all packages
- TEMPLATE-README.md as reference
- TEMPLATE-README-GUIDE.md with instructions

**Sections** (from React repo):
1. Package Overview
2. Features
3. Installation
4. Usage
5. API Reference
6. Architecture
7. Development
8. Testing
9. Contributing
10. License

### 9.2 Bilingual Documentation

**Pattern from Constitution**:
- English (README.md) as primary
- Russian (README-RU.md) as translation
- Identical structure and line count
- Validation with check-i18n-docs.mjs

**Example**:
```markdown
<!-- README.md -->
# Clusters Frontend Package

This package provides the Quasar-based frontend for cluster management.

## Features

- Cluster listing and filtering
- Cluster creation and editing
```

```markdown
<!-- README-RU.md -->
# Пакет фронтенда кластеров

Этот пакет предоставляет фронтенд на базе Quasar для управления кластерами.

## Функции

- Список и фильтрация кластеров
- Создание и редактирование кластеров
```

---

## 10. Key Differences from React Implementation

### 10.1 UI Framework

**React Implementation**:
- Uses MUI v6 for UI components
- Separate @mui/material, @mui/icons-material packages
- Custom theming with MUI theme provider

**Quasar Implementation**:
- ✅ Uses Quasar's built-in Material Design components
- ✅ No separate UI library needed
- ✅ Quasar's theming system (simpler)
- ✅ Tighter integration with build system

**Impact**: Fewer dependencies, simpler configuration, better performance

### 10.2 Backend Framework

**React Implementation**:
- Uses Express for backend
- Manual routing setup
- Middleware composition

**Quasar Implementation**:
- ✅ Uses NestJS for backend
- ✅ Decorator-based routing
- ✅ Dependency injection
- ✅ Module system
- ✅ Better TypeScript integration

**Impact**: More structured backend, easier testing, better maintainability

### 10.3 State Management

**React Implementation**:
- React Redux for state management
- Redux Toolkit for simplified Redux

**Quasar Implementation**:
- ✅ Pinia for state management (Vue 3 standard)
- ✅ Composition API compatible
- ✅ TypeScript friendly
- ✅ Simpler API

**Impact**: Less boilerplate, easier learning curve, better DX

---

## 11. Implementation Checklist

### Phase 1: Repository Foundation
- [ ] Create root configuration files (package.json, pnpm-workspace.yaml, turbo.json)
- [ ] Configure PNPM catalog with Quasar/NestJS dependencies
- [ ] Set up TypeScript with decorators support
- [ ] Configure ESLint for Vue and TypeScript
- [ ] Set up Prettier
- [ ] Configure Husky and lint-staged
- [ ] Create Docker configuration
- [ ] Create SECURITY.md
- [ ] Create tools/ directory structure
- [ ] Create package README templates

### Phase 2: Shared Infrastructure
- [ ] Create @universo/types package
- [ ] Create @universo/utils package
- [ ] Create @universo/i18n package with i18next
- [ ] Create @universo/api-client package
- [ ] Create @universo/auth-frt package (Quasar)
- [ ] Create @universo/auth-srv package (NestJS + Passport.js)
- [ ] Set up Vitest for each package
- [ ] Write tests for shared packages

### Phase 3: First Feature (Clusters)
- [ ] Create clusters-frt package with Quasar
- [ ] Create clusters-srv package with NestJS
- [ ] Implement TypeORM entities
- [ ] Implement Supabase integration
- [ ] Implement CRUD operations
- [ ] Implement authentication flow
- [ ] Test frontend-backend communication
- [ ] Write comprehensive tests

### Phase 4: Pattern Replication
- [ ] Replicate pattern for Metaverses
- [ ] Replicate pattern for Spaces
- [ ] Replicate pattern for Uniques (Uniks)
- [ ] Add feature-specific functionality
- [ ] Ensure all packages follow templates
- [ ] Validate modular architecture

---

## 12. Common Pitfalls and Solutions

### 12.1 Module Resolution Issues

**Problem**: TypeScript can't resolve `@universo/*` imports

**Solution**:
```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@universo/*": ["packages/*/base/src"]
    }
  }
}
```

### 12.2 Quasar Build Issues

**Problem**: Quasar CLI can't find dependencies

**Solution**: Use PNPM workspace links correctly
```yaml
# pnpm-workspace.yaml must include packages/*/base
packages:
    - 'packages/*'
    - 'packages/*/base'
```

### 12.3 NestJS Decorators Not Working

**Problem**: TypeScript errors with decorators

**Solution**: Enable decorator support
```json
// tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### 12.4 CORS Issues in Development

**Problem**: Frontend can't access backend API

**Solution**: Configure Quasar dev server proxy
```javascript
// quasar.config.js
devServer: {
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
    }
  }
}
```

### 12.5 Type Sharing Between Packages

**Problem**: Frontend and backend have duplicate types

**Solution**: Centralize in `@universo/types`
```typescript
// @universo/types/base/src/clusters/types.ts
export interface Cluster {
  id: string;
  name: string;
}

// Both packages import from here
import type { Cluster } from '@universo/types';
```

---

## 13. References and Resources

### React Repository Patterns
- Repository: https://github.com/teknokomo/universo-platformo-react
- Key Files:
  - `pnpm-workspace.yaml` - Workspace configuration with catalog
  - `turbo.json` - Build orchestration
  - `packages/TEMPLATE-README.md` - Package documentation template
  - `packages/TEMPLATE-README-GUIDE.md` - Template usage guide

### Quasar Framework
- Documentation: https://quasar.dev
- Best Practices: Feature-first organization, boot files, composition API
- Context7 ID: `/websites/quasar_dev` (3009 snippets)

### NestJS
- Documentation: https://docs.nestjs.com
- Best Practices: Modular architecture, SOLID principles, DTOs
- Context7 ID: `/websites/nestjs` (1943 snippets)

### Web Research Sources
- Monorepo patterns: PNPM workspaces, Turborepo
- Quasar/NestJS integration: Dev server proxy, shared types
- TypeScript best practices: Strict mode, dual-build

---

## 14. Validation and Compliance

### Constitution Compliance
- ✅ Principle I: Monorepo package structure with `packages/`, `base/`, `-frt`/`-srv` suffixes
- ✅ Principle II: TypeScript-first development with strict mode
- ✅ Principle III: Technology stack adherence (Quasar, NestJS, Supabase)
- ✅ Principle IV: Bilingual documentation (English + Russian)
- ✅ Principle V: GitHub integration standards
- ✅ Principle VI: Incremental feature development
- ✅ Principle VII: Clean implementation (no legacy patterns)

### Specification Compliance
- ✅ FR-000: Critical modular implementation requirement
- ✅ FR-002 through FR-046: All functional requirements aligned

### Best Practices Integration
- ✅ React repository architectural patterns adapted
- ✅ Quasar Framework best practices incorporated
- ✅ NestJS best practices incorporated
- ✅ Tech stack-specific optimizations applied

---

## Conclusion

This document consolidates best practices for the Universo Platformo Quasar implementation by:

1. **Learning from React Repository**: Adopting proven patterns (PNPM catalog, Turborepo, package structure, shared infrastructure)
2. **Adapting for Tech Stack**: Optimizing for Quasar (built-in components, boot files, Pinia) and NestJS (decorators, modules, guards)
3. **Following Industry Standards**: Applying researched best practices for monorepo architecture and frontend-backend communication
4. **Maintaining Consistency**: Ensuring alignment with project constitution and specifications

The result is a comprehensive, validated set of practices that ensures:
- ✅ Modular, extractable packages
- ✅ Type-safe frontend-backend communication
- ✅ Scalable architecture
- ✅ Maintainable codebase
- ✅ Clear development workflow

**Version**: 1.0.0  
**Last Updated**: 2025-11-18  
**Next Review**: After Phase 2 implementation completion
