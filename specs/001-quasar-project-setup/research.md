# Research Document: Universo Platformo Quasar Project Setup

**Feature**: 001-quasar-project-setup  
**Date**: 2025-11-17  
**Status**: Complete

## Purpose

This document consolidates research findings and technology decisions for the Universo Platformo Quasar project setup. All technical unknowns from the Technical Context have been resolved, and rationale for each technology choice is documented below.

## Research Areas

### 1. Frontend Framework Selection

**Decision**: Quasar Framework (latest stable)

**Rationale**:
- **Material Design Built-in**: Quasar provides comprehensive Material Design components out of the box, eliminating need for separate UI library (unlike React implementation requiring MUI)
- **Multi-Platform Support**: Supports SPA, PWA, SSR, Mobile (Cordova/Capacitor), and Electron from single codebase
- **Vue 3 + TypeScript**: Full TypeScript support with Vue 3 Composition API for modern reactive development
- **Performance**: Optimized bundle sizes with automatic tree-shaking and code splitting
- **Ecosystem Maturity**: Active community, extensive documentation, proven in production environments
- **Development Experience**: Quasar CLI with Vite provides excellent HMR (<1s rebuilds) and developer tools

**Alternatives Considered**:
- **React + Material-UI**: Used in reference implementation but adds dependency overhead and configuration complexity
- **Angular Material**: Heavy framework with steep learning curve, less flexible than Quasar
- **Vuetify**: Similar to Quasar but less comprehensive tooling and smaller ecosystem

**Best Practices**:
- Use Quasar CLI for project scaffolding and build optimization
- Leverage Composition API for component logic reusability
- Utilize Quasar's boot files for application initialization (i18n, API client, auth)
- Follow Quasar's directory structure conventions (layouts, pages, components, boot)
- Use Quasar's built-in utilities (Platform detection, LocalStorage, Notify, Dialog)

### 2. Backend Framework Selection

**Decision**: NestJS (latest stable)

**Rationale**:
- **Enterprise-Grade Architecture**: Modular structure with dependency injection, perfect for scalable monorepo
- **TypeScript Native**: Built for TypeScript from ground up, excellent type safety and IntelliSense
- **Express-Compatible**: Uses Express under the hood but adds structure and best practices
- **Microservices Ready**: Built-in support for microservices, message queues, and gRPC (future-proof)
- **Comprehensive Ecosystem**: Official modules for TypeORM, Passport, GraphQL, WebSockets, Bull queues
- **Testing Infrastructure**: Excellent testing utilities with Jest/Vitest integration
- **Community & Documentation**: Large community, extensive official documentation, proven patterns

**Alternatives Considered**:
- **Express (used in React implementation)**: Lower-level, requires more boilerplate, lacks architectural patterns
- **Fastify**: Faster but less mature ecosystem and fewer official integrations
- **Koa**: Minimalist, requires more custom middleware, smaller community

**Best Practices**:
- Follow NestJS module-based architecture (one module per feature domain)
- Use dependency injection for all services and repositories
- Implement DTOs (Data Transfer Objects) with class-validator for request validation
- Use Guards for authentication/authorization logic
- Leverage Interceptors for cross-cutting concerns (logging, transformation)
- Implement Pipes for data validation and transformation
- Use Exception Filters for centralized error handling
- Follow NestJS naming conventions: \*.controller.ts, \*.service.ts, \*.module.ts

### 3. Monorepo Package Management

**Decision**: PNPM >=9 with Workspace Catalog

**Rationale**:
- **Disk Efficiency**: Content-addressable storage saves 70-80% disk space vs npm/yarn
- **Speed**: 2-3x faster installs than npm/yarn due to hard linking and better caching
- **Strict Dependencies**: Prevents phantom dependencies, ensures explicit dependency declarations
- **Workspace Catalog**: Centralized dependency version management prevents version conflicts
- **Monorepo Native**: Designed for monorepos with excellent workspace support
- **Security**: No dependency hoisting by default, better isolation between packages
- **NPM Compatible**: Can use npm registry, supports all npm CLI features

**Workspace Catalog Pattern**:
```yaml
# pnpm-workspace.yaml
catalog:
  typescript: ^5.3.0
  vitest: ^1.0.0
  '@quasar/app-vite': ^1.8.0
  '@nestjs/core': ^10.0.0
```

Usage in package.json:
```json
{
  "devDependencies": {
    "typescript": "catalog:",
    "vitest": "catalog:"
  }
}
```

**Alternatives Considered**:
- **npm workspaces**: Slower, no catalog feature, phantom dependency issues
- **Yarn workspaces**: Better than npm but slower than PNPM, less strict, no catalog
- **Lerna**: Legacy tool, now deprecated in favor of workspace managers

**Best Practices**:
- Define all shared dependencies in workspace catalog
- Use `catalog:` for dependencies shared across multiple packages
- Configure .npmrc with: auto-install-peers=true, prefer-workspace-packages=true
- Use `pnpm install --frozen-lockfile` in CI/CD
- Leverage `pnpm recursive` commands for monorepo operations

### 4. Build Orchestration

**Decision**: Turborepo (latest stable)

**Rationale**:
- **Incremental Builds**: Caches build outputs, rebuilds only changed packages
- **Parallel Execution**: Runs tasks across packages in parallel with dependency awareness
- **Remote Caching**: Optional remote cache for team collaboration (Vercel hosting)
- **Simple Configuration**: Single turbo.json file defines all pipelines
- **Framework Agnostic**: Works with any build tool (Vite, NestJS CLI, tsc)
- **Developer Experience**: Clear terminal output, progress indicators, task dependency visualization

**Pipeline Configuration**:
```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "cache": false
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

**Alternatives Considered**:
- **Nx**: More complex, opinionated architecture, steeper learning curve
- **Rush**: Microsoft tool, excellent but requires more setup
- **Lerna**: Legacy, limited caching, slower builds

**Best Practices**:
- Define clear task dependencies in pipeline
- Use outputs to cache only necessary files
- Set cache: false for dev and test tasks
- Leverage `turbo run build --filter=...` for selective builds
- Use persistent: true for long-running dev servers

### 5. Testing Infrastructure

**Decision**: Vitest with @vitest/coverage-v8 and Happy DOM

**Rationale**:
- **Vite Native**: Seamless integration with Vite (used by Quasar)
- **Jest Compatible API**: Easy migration path, familiar syntax
- **Performance**: 10x faster than Jest due to Vite's ESM-based architecture
- **TypeScript Support**: Native TypeScript support, no additional configuration
- **Watch Mode**: Instant re-runs with HMR-like experience
- **Coverage**: Built-in coverage with v8 provider (native Node.js coverage)
- **Happy DOM**: Lightweight DOM implementation for component testing

**Configuration Pattern**:
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov']
    }
  }
});
```

**Alternatives Considered**:
- **Jest**: Slower, requires babel/ts-jest configuration, heavy setup
- **AVA**: Less ecosystem support, not Jest-compatible
- **Mocha + Chai**: Requires more configuration, less integrated

**Best Practices**:
- Use `describe` and `it` for test organization
- Leverage Vitest's snapshot testing for component contracts
- Use `vi.mock()` for module mocking
- Configure coverage thresholds in vitest.config.ts
- Separate unit tests from integration tests by directory

### 6. Code Quality Automation

**Decision**: Husky + lint-staged + ESLint + Prettier

**Rationale**:
- **Pre-commit Enforcement**: Prevents bad code from entering repository
- **Fast Execution**: lint-staged only runs on staged files (seconds vs minutes)
- **Zero Config Required**: Works with existing ESLint/Prettier setup
- **Git Integration**: Native git hooks, no additional CI step needed
- **Developer Experience**: Instant feedback, fails fast on local machine

**Configuration Pattern**:
```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx,vue}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

**Alternatives Considered**:
- **Pre-push hooks**: Too late, waste developer time
- **CI-only linting**: Slows down feedback loop, wastes CI resources
- **Manual linting**: Human error, inconsistent application

**Best Practices**:
- Keep lint-staged fast (auto-fix only, no heavy operations)
- Configure ESLint with project-appropriate rules
- Use Prettier for formatting, ESLint for logic errors
- Allow `--no-verify` for emergency commits (rare)
- Include type checking in separate script, not pre-commit (too slow)

### 7. Docker Containerization

**Decision**: Docker with docker-compose, multi-stage builds

**Rationale**:
- **Production Parity**: Dev environment matches production
- **Service Orchestration**: docker-compose manages multiple services (API, DB, Redis)
- **Build Optimization**: Multi-stage builds reduce image size (600MB → 150MB)
- **Dependency Isolation**: Each service has isolated dependencies
- **Reproducible Builds**: Same image works everywhere (dev, staging, prod)

**Multi-stage Build Pattern**:
```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN corepack enable pnpm
WORKDIR /app
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm turbo run build

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/main.js"]
```

**Alternatives Considered**:
- **No containerization**: Environment inconsistencies, deployment complexity
- **Kubernetes from start**: Over-engineering, too complex for initial phase
- **Podman**: Less mature tooling, smaller ecosystem

**Best Practices**:
- Use .dockerignore to exclude node_modules, .git, dist
- Leverage multi-stage builds for smaller images
- Use alpine base images for security and size
- Configure health checks for containers
- Use docker-compose profiles for different environments
- Store secrets in .env files (not in image)

### 8. Database Strategy

**Decision**: Supabase (PostgreSQL) with TypeORM

**Rationale**:
- **PostgreSQL Foundation**: Industry-standard relational database
- **Supabase Benefits**: Hosted PostgreSQL with auth, storage, and real-time subscriptions
- **TypeORM Integration**: Type-safe database access with entity decorators
- **Migration Support**: Automatic migration generation from entities
- **Multi-DBMS Support**: TypeORM abstracts database layer for future flexibility
- **Development Experience**: Excellent CLI tools, migration management

**Architecture Pattern**:
```typescript
// TypeORM Entity
@Entity('clusters')
export class Cluster {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => User)
  owner: User;
}
```

**Alternatives Considered**:
- **Prisma**: Better DX but less flexible, custom migration language
- **Sequelize**: Legacy ORM, less TypeScript support
- **Knex**: Query builder, not ORM, requires more boilerplate

**Best Practices**:
- Use entities for type safety and validation
- Generate migrations for all schema changes
- Use transactions for multi-step operations
- Implement soft deletes for user data
- Use database indexes for performance
- Separate read/write repositories if needed

### 9. Authentication Strategy

**Decision**: Passport.js with Supabase Strategy

**Rationale**:
- **NestJS Integration**: Official @nestjs/passport module
- **Strategy Pattern**: Pluggable authentication (JWT, OAuth, local)
- **Supabase Auth**: Built-in user management, email verification, password reset
- **Session Management**: Flexible (JWT tokens or server-side sessions)
- **Extensible**: Can add additional strategies (Google, GitHub) easily

**Implementation Pattern**:
```typescript
// Supabase Strategy
@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, 'supabase') {
  async validate(token: string): Promise<User> {
    const { data, error } = await supabase.auth.getUser(token);
    if (error) throw new UnauthorizedException();
    return data.user;
  }
}
```

**Alternatives Considered**:
- **Custom JWT**: Requires more security code, reinventing the wheel
- **Firebase Auth**: Vendor lock-in, less flexible
- **Auth0**: External dependency, additional cost

**Best Practices**:
- Use JWT tokens for stateless authentication
- Implement refresh token rotation
- Store tokens securely (httpOnly cookies or secure storage)
- Use Guards for route protection
- Implement rate limiting on auth endpoints

### 10. Internationalization (i18n)

**Decision**: i18next with @universo/i18n shared package

**Rationale**:
- **Framework Agnostic**: Works with Vue (Quasar) and Node.js (NestJS)
- **Namespace Support**: Modular translations per package
- **Lazy Loading**: Load translations on demand for performance
- **Interpolation**: Dynamic values in translations
- **Pluralization**: Automatic plural forms per language
- **Centralized Config**: Single i18next instance shared across packages

**Architecture Pattern**:
```typescript
// @universo/i18n package
export const i18n = i18next.createInstance({
  fallbackLng: 'en',
  supportedLngs: ['en', 'ru'],
  ns: ['common', 'auth', 'clusters'],
  interpolation: { escapeValue: false }
});
```

**Alternatives Considered**:
- **Vue I18n**: Frontend only, can't share with backend
- **FormatJS**: More complex, less flexible
- **Custom solution**: Reinventing the wheel, no pluralization

**Best Practices**:
- Organize translations by namespace (feature-based)
- Use English as source language (primary)
- Keep Russian translations in sync (exact structure)
- Use interpolation for dynamic values
- Implement language detection from browser/headers

## Technology Stack Summary

| Category | Technology | Version Constraint | Rationale |
|----------|-----------|-------------------|-----------|
| Frontend Framework | Quasar | latest stable | Material Design built-in, multi-platform |
| Backend Framework | NestJS | latest stable | Enterprise architecture, TypeScript native |
| Language | TypeScript | strict mode | Type safety, maintainability |
| Package Manager | PNPM | >=9 | Workspace catalog, speed, strict deps |
| Build Orchestrator | Turborepo | latest stable | Incremental builds, caching |
| Testing Framework | Vitest | latest stable | Performance, Vite integration |
| Database | Supabase | PostgreSQL | Managed PostgreSQL + auth/storage |
| ORM | TypeORM | latest stable | Type-safe entities, migrations |
| Authentication | Passport.js | with Supabase | NestJS integration, extensible |
| Code Quality | Husky + lint-staged | latest stable | Pre-commit enforcement |
| Linting | ESLint | latest stable | Code quality, consistency |
| Formatting | Prettier | latest stable | Code style consistency |
| Containerization | Docker + docker-compose | latest stable | Production parity, orchestration |
| Internationalization | i18next | latest stable | Framework agnostic, namespace support |

## Integration Patterns

### 1. Frontend-Backend Communication

**Pattern**: RESTful API with type-safe client (@universo/api-client)

```typescript
// @universo/api-client
export class ClustersApiClient {
  async getClusters(): Promise<Cluster[]> {
    return this.http.get<Cluster[]>('/api/clusters');
  }
}
```

**Benefits**:
- Type safety end-to-end
- Single source of truth for API contracts
- Easy mocking for frontend development
- Automatic error handling

### 2. Shared Types Across Stack

**Pattern**: @universo/types package

```typescript
// @universo/types/src/entities/cluster.ts
export interface Cluster {
  id: string;
  name: string;
  description: string;
  ownerId: string;
}
```

**Benefits**:
- Frontend and backend use identical types
- No type drift between layers
- Compile-time validation
- Easy refactoring

### 3. Monorepo Dependency Management

**Pattern**: PNPM workspace with catalog

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'

catalog:
  typescript: ^5.3.0
  '@nestjs/core': ^10.0.0
  quasar: ^2.14.0
```

**Benefits**:
- Single dependency version across all packages
- No version conflicts
- Easy updates
- Clear dependency graph

## Unresolved Questions

None. All technical context is fully specified and researched.

## Next Steps

1. Proceed to Phase 1: Generate data-model.md (key entities)
2. Generate contracts/ directory (API specifications if applicable)
3. Generate quickstart.md (getting started guide)
4. Update agent context with technology decisions
5. Re-evaluate Constitution Check after design phase

## References

- Quasar Framework: https://quasar.dev/
- NestJS: https://nestjs.com/
- PNPM Workspaces: https://pnpm.io/workspaces
- Turborepo: https://turbo.build/repo
- Vitest: https://vitest.dev/
- TypeORM: https://typeorm.io/
- Universo Platformo React (reference): https://github.com/teknokomo/universo-platformo-react
