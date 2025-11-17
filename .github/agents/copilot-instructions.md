# universo-platformo-quasar Development Guidelines

Auto-generated from all feature plans. **Last updated**: 2025-11-17

## Active Technologies

- TypeScript (strict mode), Node.js >=18.15.0 <19.0.0 || ^20 + Quasar Framework (frontend), NestJS (backend), PNPM >=9 (workspace management), Turborepo (build orchestration) (001-quasar-project-setup)
- Supabase (PostgreSQL via TypeORM) - architecture designed for future DBMS expansion (001-quasar-project-setup)

## Project Structure

```text
# Monorepo structure for Universo Platformo Quasar

# Root configuration
package.json              # Workspace root, engines: Node.js >=18.15.0 <19.0.0 || ^20, PNPM >=9
pnpm-workspace.yaml       # Workspace config with catalog for centralized dependency versions
turbo.json               # Turborepo pipeline: build, test, dev, clean tasks
tsconfig.json            # Base TypeScript config with strict mode

# Shared infrastructure packages
packages/
  types/                # @universo/types - TypeScript definitions
  utils/                # @universo/utils - Utility functions
  i18n/                 # @universo/i18n - Internationalization
  api-client/           # @universo/api-client - Type-safe API clients

# Future functional packages
# packages/
#   auth-frt/           # @universo/auth-frt - Authentication UI
#   auth-srv/           # @universo/auth-srv - Authentication backend
#   clusters-frt/       # Clusters frontend (Quasar)
#   clusters-srv/       # Clusters backend (NestJS)
```

## Commands

```bash
# Development
pnpm turbo run dev        # Start all packages in dev mode
pnpm turbo run build      # Build all packages
pnpm turbo run test       # Run all tests
pnpm turbo run lint       # Lint all packages

# Package-specific
pnpm --filter @universo/types build
pnpm --filter @universo/types test
```

## Code Style

### TypeScript
- **Strict mode**: Always enabled in tsconfig.json
- **Type safety**: Explicit types, avoid 'any'
- **Naming conventions**: PascalCase for types/interfaces, camelCase for variables/functions
- **Imports**: Use absolute imports with TypeScript path aliases

### Quasar (Frontend)
- **Composition API**: Prefer Vue 3 Composition API
- **Components**: Use Quasar's built-in Material Design components
- **Structure**: Follow Quasar directory conventions (layouts, pages, components, boot)

### NestJS (Backend)
- **Modules**: One module per feature domain
- **Dependency Injection**: Use DI for all services and repositories
- **DTOs**: Use class-validator for validation
- **Naming**: *.controller.ts, *.service.ts, *.module.ts

### General
- **Bilingual documentation**: Always create README.md (English) and README-RU.md (Russian) with identical structure
- **Package naming**: -frt for frontend, -srv for backend, @universo/* for shared packages
- **base/ directory**: All packages must have base/ directory for core implementation

## Recent Changes

- 001-quasar-project-setup: Added TypeScript (strict mode), Node.js >=18.15.0 <19.0.0 || ^20 + Quasar Framework (frontend), NestJS (backend), PNPM >=9 (workspace management), Turborepo (build orchestration)

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
