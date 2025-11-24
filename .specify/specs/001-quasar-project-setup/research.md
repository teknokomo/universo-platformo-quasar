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
- Use Pinia (official Vue 3 store) for client-side state management when needed
- Implement feature-based modular architecture for scalability

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

**Monorepo Structure Pattern**:
- **Our Approach**: `packages/*-frt` and `packages/*-srv` for library-first architecture where packages can be independently published and reused
- **Alternative Pattern**: Some Quasar+NestJS projects use `apps/api` + `apps/web` structure for application-first architecture
- Both patterns are valid; our choice supports the goal of modular, reusable packages that can eventually be moved to separate repositories while maintaining the base/ directory pattern for multiple implementations

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

### 4a. Build Tooling for Library Packages

**Decision**: tsdown (with alternatives documented)

**Rationale**:
- **Proven in React Repository**: Successfully used in universo-platformo-react for all @universo/* packages
- **Dual-Build Output**: Produces CommonJS, ES Modules, and TypeScript declarations in single command
- **Fast Builds**: Powered by esbuild for quick compilation times
- **Simple Configuration**: Minimal config file (tsdown.config.ts)
- **Framework Agnostic**: Works with any TypeScript code, not React-specific
- **Developer Experience**: Watch mode for development, clean builds for production

**Configuration Pattern** (from React repository):
```typescript
// packages/universo-types/base/tsdown.config.ts
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true
})
```

**Output Structure**:
```
dist/
├── index.js      # CommonJS build
├── index.mjs     # ES Modules build
└── index.d.ts    # TypeScript declarations
```

**Alternatives Evaluated**:

1. **tsup**:
   - Pros: Similar to tsdown, active development, bundle splitting support
   - Cons: Less proven in our context, different configuration syntax
   - Use Case: Consider if tsdown has issues

2. **rollup**:
   - Pros: Mature, excellent tree-shaking, flexible plugin system
   - Cons: More complex configuration, requires plugins for TypeScript
   - Use Case: Complex bundling requirements (not typical for type libraries)

3. **esbuild (direct)**:
   - Pros: Fastest build times, simple API
   - Cons: No TypeScript declaration generation, requires additional tooling
   - Use Case: Non-library packages where types not needed

4. **tsc (TypeScript Compiler)**:
   - Pros: Official tool, guaranteed TypeScript compatibility
   - Cons: Slower, requires separate builds for CJS/ESM, no bundling
   - Use Case: Backend packages where dual-build not critical (some React packages use this)

**Recommendation Strategy**:
- **Default for Library Packages** (@universo/types, @universo/utils, etc.): **tsdown**
- **Frontend Applications** (packages/*-frt): **Quasar CLI with Vite** (handles everything)
- **Backend Applications** (packages/*-srv): **NestJS CLI** or **tsc** (NestJS uses tsc by default)
- **Simple Type-Only Packages**: Could use **tsc** if no bundling needed

**Best Practices**:
- Configure `sideEffects: false` in package.json for pure libraries (enables better tree-shaking)
- Use `"files": ["dist", "src"]` to limit published package contents
- Enable `dts: true` for TypeScript declaration generation
- Use `clean: true` to remove old build artifacts
- Configure multiple entry points via exports field in package.json
- Test both CJS and ESM imports in consuming packages

**Package.json Pattern** (from React):
```json
{
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  },
  "sideEffects": false,
  "files": ["dist", "src"],
  "scripts": {
    "build": "tsdown",
    "dev": "tsdown --watch"
  }
}
```

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
| Language | TypeScript | strict mode (packages) | Type safety, maintainability |
| Package Manager | PNPM | >=9 | Workspace catalog, speed, strict deps |
| Build Orchestrator | Turborepo | latest stable | Incremental builds, caching |
| Library Build Tool | tsdown | latest stable | Dual-build (CJS+ESM+DTS), proven in React |
| Testing Framework | Vitest | latest stable | Performance, Vite integration |
| Database | Supabase | PostgreSQL | Managed PostgreSQL + auth/storage |
| ORM | TypeORM | latest stable | Type-safe entities, migrations |
| Authentication | Passport.js | with Supabase | NestJS integration, extensible |
| Code Quality | Husky + lint-staged | latest stable | Pre-commit enforcement |
| Linting | ESLint | latest stable | Code quality, unused-imports plugin |
| Formatting | Prettier | latest stable | Code style consistency |
| Containerization | Docker + docker-compose | latest stable | Production parity, orchestration |
| Internationalization | i18next | latest stable | Centralized instance, namespace support |

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

### 1a. Development Environment Integration

**Pattern**: Quasar Dev Proxy for API Requests

During development, configure Quasar's Vite dev server to proxy API requests to NestJS, eliminating CORS issues:

```javascript
// quasar.config.js (Vite mode)
export default defineConfig({
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
```

**Benefits**:
- Eliminates CORS issues during development
- Mimics production routing where NestJS serves both API and frontend
- Seamless integration for cookies/sessions (same domain)
- No need for CORS middleware in development
- Frontend can use relative paths: `fetch('/api/clusters')`

**Alternative Approach**: Run Quasar and NestJS on separate ports during development, use CORS middleware in NestJS, and configure absolute URLs in frontend. The proxy approach is recommended for simpler setup and production parity.

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

### 4. TypeScript Configuration Strategy

**Pattern**: Root permissive, packages strict (from React repository analysis)

**Root tsconfig.json**:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "baseUrl": "./",
    "paths": {
      "@testing/backend/*": ["tools/testing/backend/*"],
      "@testing/frontend": ["tools/testing/frontend/index.ts"],
      "@testing/frontend/*": ["tools/testing/frontend/*"]
    },
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "strict": false,
    "resolveJsonModule": true
  }
}
```

**Package tsconfig.json** (extends root with strict mode):
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Rationale**:
- **Root Permissive**: Allows tooling compatibility (some tools don't work well with strict mode)
- **Package Strict**: Enforces type safety in application code where it matters
- **Decorators**: Required for NestJS dependency injection (experimentalDecorators, emitDecoratorMetadata)
- **Path Aliases**: Clean imports for testing utilities (@testing/* pattern)
- **Consistent with React**: Matches proven pattern from universo-platformo-react

**Best Practices**:
- Always enable strict mode in package tsconfig.json
- Use path aliases for cross-package utilities
- Include decorators settings if using NestJS
- Use resolveJsonModule for importing JSON files

### 5. PNPM Overrides and Configuration

**Pattern**: Security patches and version consistency via overrides

**Root package.json**:
```json
{
  "pnpm": {
    "overrides": {
      "axios": "1.7.9",
      "typeorm": "0.3.6",
      "zod": "3.25.76"
    }
  }
}
```

**.npmrc Configuration**:
```
auto-install-peers = true
strict-peer-dependencies = false
prefer-workspace-packages = true
link-workspace-packages = deep
hoist = true
shamefully-hoist = true
```

**Rationale**:
- **Security**: Override vulnerable dependency versions across entire monorepo
- **Consistency**: Ensure all packages use same version of critical dependencies
- **Workspace Packages**: Prefer local packages over registry versions
- **Hoisting**: Optimize node_modules structure for compatibility

**Best Practices**:
- Use overrides sparingly (only for security patches or critical version conflicts)
- Document reason for each override
- Review overrides when dependencies update
- Test that overrides don't break functionality

### 6. Package Optimization Fields

**Pattern**: sideEffects and files for better bundling (from React packages)

**Pure Library** (no side effects):
```json
{
  "name": "@universo/types",
  "sideEffects": false,
  "files": ["dist", "src"]
}
```

**Package with Initialization** (has side effects):
```json
{
  "name": "@universo/i18n",
  "sideEffects": true,
  "files": ["dist", "src"]
}
```

**Rationale**:
- **sideEffects: false**: Enables aggressive tree-shaking (bundlers can safely remove unused exports)
- **sideEffects: true**: Preserves initialization code (i18n setup, global registrations)
- **files field**: Limits published package size (only includes necessary files)

**Best Practices**:
- Set sideEffects: false for type-only or pure utility packages
- Set sideEffects: true for packages that initialize globals or have setup code
- Always include "dist" and "src" in files array
- Test that sideEffects setting doesn't break consumers

### 7. Multiple Export Entry Points

**Pattern**: Specialized exports for lazy-loading (from React @universo/* packages)

**package.json exports**:
```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
    "./i18n": {
      "types": "./dist/i18n/index.d.ts",
      "import": "./dist/i18n/index.mjs",
      "require": "./dist/i18n/index.js"
    }
  }
}
```

**Usage**:
```typescript
// Main package
import { ClusterComponent } from '@universo/clusters-frt'

// Lazy-load translations
import i18n from '@universo/i18n'
import '@universo/clusters-frt/i18n'  // Registers cluster translations
```

**Rationale**:
- **Bundle Size**: Separate translations from main bundle
- **Lazy Loading**: Load translations on-demand or per-route
- **Modularity**: Consumers can import only what they need

**Best Practices**:
- Provide main export (.) for primary functionality
- Create specialized exports for translations, styles, or optional features
- Document all available exports in README
- Ensure TypeScript types are provided for all exports

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

## Research Validation (2025-11-17)

This research document was validated against current 2024-2025 best practices through:
- Web search across multiple authoritative sources (NestJS docs, Quasar docs, dev.to, GeeksforGeeks, etc.)
- Context7 MCP documentation for Quasar Framework (3009 snippets, score: 79.6) and NestJS (1943 snippets, score: 87.3)
- Community boilerplates: nikolas03/monorepo-nestjs-quasar, composite/quasar-ssr-nestjs-boilerplate

**Validation Results**: All major architectural decisions align with industry best practices. Minor enhancements added:
1. Pinia state management note for future frontend packages
2. API proxy pattern for development environment
3. Alternative monorepo structure pattern documented
4. Feature-based modular architecture emphasis

**Detailed Findings**: See `research-findings-2025-11-17.md` for comprehensive analysis of web and Context7 research results.
