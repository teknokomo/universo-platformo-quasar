# universo-platformo-quasar Development Guidelines

Auto-generated from all feature plans. **Last updated**: 2025-11-17

## ⚠️ CRITICAL: Modular Architecture (NON-NEGOTIABLE)

**ALL functionality MUST be implemented as workspace packages in `packages/` directory.**

This is a fundamental architectural requirement, not optional:
- ✅ ALL features go in `packages/` with `-frt` (frontend) or `-srv` (backend) suffix
- ✅ ALL shared code goes in `packages/` with `@universo/` namespace
- ✅ Each package has `base/` subdirectory for core implementation
- ❌ NEVER implement functionality outside `packages/` (except root config files)

**Why this matters**: Packages are designed from day one to be extractable into separate repositories. Non-modular implementation violates core architecture and prevents future scaling.

**Reference**: See universo-platformo-react repository for proven pattern (clusters-frt, clusters-srv, spaces-frt, spaces-srv, @universo/types, @universo/utils, etc.)

## Active Technologies

- TypeScript (strict mode), Node.js >=18.15.0 <19.0.0 || ^20 + Quasar Framework (frontend), NestJS (backend), PNPM >=9 (workspace management), Turborepo (build orchestration) (001-quasar-project-setup)
- Supabase (PostgreSQL via TypeORM) - architecture designed for future DBMS expansion (001-quasar-project-setup)

## Project Structure

⚠️ **CRITICAL**: ALL functionality must be in `packages/` directory. Each package has `base/` subdirectory.

```text
# Monorepo structure for Universo Platformo Quasar

# Root configuration (ONLY these types of files allowed in root)
package.json              # Workspace root, engines: Node.js >=18.15.0 <19.0.0 || ^20, PNPM >=9
pnpm-workspace.yaml       # Workspace config with catalog for centralized dependency versions
turbo.json               # Turborepo pipeline: build, test, dev, clean tasks
tsconfig.json            # Base TypeScript config with strict mode

# ALL FUNCTIONALITY in packages/ directory (modular architecture)
packages/
  # Shared infrastructure (@universo/* namespace)
  types/base/             # @universo/types - TypeScript definitions
  utils/base/             # @universo/utils - Utility functions
  i18n/base/              # @universo/i18n - Internationalization
  api-client/base/        # @universo/api-client - Type-safe API clients
  
  # Functional packages (separated into -frt and -srv)
  # Example from React repo: clusters-frt, clusters-srv, spaces-frt, spaces-srv
  clusters-frt/base/      # Clusters frontend (Quasar)
  clusters-srv/base/      # Clusters backend (NestJS)
  spaces-frt/base/        # Spaces frontend
  spaces-srv/base/        # Spaces backend
  
  # Authentication (split into frontend and backend)
  auth-frt/base/          # @universo/auth-frt - Authentication UI
  auth-srv/base/          # @universo/auth-srv - Authentication backend
```

**Workspace Configuration** (pnpm-workspace.yaml):
```yaml
packages:
    - 'packages/*'        # Top-level packages
    - 'packages/*/base'   # Base implementations
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
- **MODULAR ARCHITECTURE**: ALL functionality in `packages/` directory (NON-NEGOTIABLE)
- **Package structure**: Each package has `base/` subdirectory for core implementation
- **Bilingual documentation**: Always create README.md (English) and README-RU.md (Russian) with identical structure
- **Package naming**: 
  - `-frt` suffix for frontend packages (e.g., `clusters-frt`, `spaces-frt`)
  - `-srv` suffix for backend packages (e.g., `clusters-srv`, `spaces-srv`)
  - `@universo/*` namespace for shared packages (e.g., `@universo/types`, `@universo/utils`)
- **Workspace packages**: Designed from day one to be extractable into separate repositories

## Recent Changes

- 001-quasar-project-setup: Added TypeScript (strict mode), Node.js >=18.15.0 <19.0.0 || ^20 + Quasar Framework (frontend), NestJS (backend), PNPM >=9 (workspace management), Turborepo (build orchestration)

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
