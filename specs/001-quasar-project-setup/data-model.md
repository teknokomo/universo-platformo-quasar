# Data Model: Universo Platformo Quasar Project Setup

**Feature**: 001-quasar-project-setup  
**Date**: 2025-11-17  
**Status**: Complete

## Purpose

This document defines the key entities and their relationships for the Universo Platformo Quasar repository setup. Since this is an infrastructure setup feature rather than a functional feature with user-facing data, the "entities" here represent configuration objects and architectural components.

## Key Entities

### 1. Repository Configuration

**Description**: Root-level configuration defining the monorepo workspace, build orchestration, and tooling.

**Fields**:
- `name`: string - Repository name ("universo-platformo-quasar")
- `version`: string - Semantic version (e.g., "0.1.0")
- `engines.node`: string - Node.js version constraint (">=18.15.0 <19.0.0 || ^20")
- `engines.pnpm`: string - PNPM version constraint (">=9")
- `workspaces`: string[] - Package glob patterns (["packages/*"])
- `private`: boolean - Workspace root is not publishable (true)

**Configuration Files**:
- `package.json` - Root workspace configuration
- `pnpm-workspace.yaml` - PNPM workspace definition with catalog
- `turbo.json` - Turborepo pipeline configuration
- `.npmrc` - PNPM behavior configuration

**Validation Rules**:
- Node.js version MUST be >=18.15.0
- PNPM version MUST be >=9
- TypeScript MUST be in strict mode
- All packages MUST be in packages/ directory

**Example**:
```json
{
  "name": "universo-platformo-quasar",
  "version": "0.1.0",
  "private": true,
  "engines": {
    "node": ">=18.15.0 <19.0.0 || ^20",
    "pnpm": ">=9"
  }
}
```

### 2. Workspace Catalog

**Description**: Centralized dependency version management for consistent versions across all packages.

**Fields**:
- `dependencies`: Map<string, string> - Production dependency versions
- `devDependencies`: Map<string, string> - Development dependency versions

**Structure** (in pnpm-workspace.yaml):
```yaml
catalog:
  # Core
  typescript: ^5.3.0
  
  # Frontend
  quasar: ^2.14.0
  '@quasar/app-vite': ^1.8.0
  vue: ^3.4.0
  
  # Backend
  '@nestjs/core': ^10.0.0
  '@nestjs/common': ^10.0.0
  '@nestjs/platform-express': ^10.0.0
  
  # Database
  '@supabase/supabase-js': ^2.39.0
  typeorm: ^0.3.0
  pg: ^8.11.0
  
  # Testing
  vitest: ^1.0.0
  '@vitest/coverage-v8': ^1.0.0
  happy-dom: ^12.0.0
  
  # Build tools
  turbo: ^1.11.0
  
  # Code quality
  eslint: ^8.56.0
  prettier: ^3.1.0
  husky: ^8.0.0
  lint-staged: ^15.0.0
```

**Validation Rules**:
- All shared dependencies MUST be in catalog
- Package-specific dependencies MAY override catalog versions (rare)
- Catalog entries MUST use semver ranges (^, ~, or exact)

### 3. Package

**Description**: Individual functional or infrastructure package within the monorepo.

**Fields**:
- `name`: string - Package name with @universo/ scope or project name
- `version`: string - Package semantic version
- `type`: enum - Package type: "shared-infrastructure" | "frontend" | "backend" | "application"
- `suffix`: enum | null - "-frt" (frontend) | "-srv" (backend) | null (shared)
- `hasBase`: boolean - Contains base/ directory for alternative implementations
- `dependencies`: string[] - List of dependency names
- `exports`: object - Package.json exports configuration
- `main`: string - Main entry point (CommonJS)
- `module`: string - ES Module entry point
- `types`: string - TypeScript declarations entry point

**Package Types**:

1. **Shared Infrastructure** (no suffix, @universo/ scope):
   - `@universo/types` - TypeScript type definitions
   - `@universo/utils` - Utility functions
   - `@universo/i18n` - Internationalization
   - `@universo/api-client` - API communication

2. **Frontend Packages** (-frt suffix):
   - `@universo/auth-frt` - Authentication UI components
   - `packages/clusters-frt` - Clusters frontend (future)

3. **Backend Packages** (-srv suffix):
   - `@universo/auth-srv` - Authentication backend services
   - `packages/clusters-srv` - Clusters API (future)

**Directory Structure**:
```
packages/{package-name}/
├── base/                   # Core implementation
│   ├── src/               
│   │   ├── index.ts       # Public API
│   │   └── ...
│   ├── dist/              # Build output (CJS + ESM + types)
│   ├── package.json       
│   ├── tsconfig.json      
│   ├── README.md          # English
│   └── README-RU.md       # Russian
└── package.json           # Workspace package config
```

**Validation Rules**:
- Package name MUST use @universo/ scope for shared packages
- Frontend packages MUST end with -frt suffix
- Backend packages MUST end with -srv suffix
- Each package MUST have base/ directory
- README.md and README-RU.md MUST have identical structure
- TypeScript MUST be configured with strict mode

**Example Package.json** (@universo/types):
```json
{
  "name": "@universo/types",
  "version": "0.1.0",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts"
}
```

### 4. Build Pipeline

**Description**: Turborepo pipeline configuration defining task dependencies and caching.

**Fields**:
- `pipeline`: Map<string, PipelineTask> - Task definitions
- `PipelineTask.dependsOn`: string[] - Task dependencies
- `PipelineTask.outputs`: string[] - Cacheable output paths
- `PipelineTask.cache`: boolean - Enable caching
- `PipelineTask.persistent`: boolean - Long-running task

**Pipeline Tasks**:

1. **build**: Compile TypeScript, bundle assets
   - Depends on: `^build` (dependencies built first)
   - Outputs: `["dist/**", ".next/**"]`
   - Cache: true

2. **test**: Run unit and integration tests
   - Depends on: `["build"]`
   - Cache: false (always run)

3. **dev**: Development server
   - Cache: false
   - Persistent: true

4. **lint**: Code quality checks
   - Cache: true
   - Outputs: none

5. **clean**: Remove build artifacts
   - Cache: false

**Example turbo.json**:
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "cache": false
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "cache": true
    },
    "clean": {
      "cache": false
    }
  }
}
```

**Validation Rules**:
- build task MUST depend on ^build (dependencies)
- dev and test tasks MUST have cache: false
- persistent tasks MUST have cache: false

### 5. Documentation Entity

**Description**: Bilingual documentation files following i18n requirements.

**Fields**:
- `englishPath`: string - Path to English documentation (primary)
- `russianPath`: string - Path to Russian documentation (translation)
- `content`: string - Documentation content
- `lineCount`: number - Number of lines (must match between languages)
- `structure`: string[] - Section headings (must match between languages)

**Types**:
1. **Root README**: Repository overview
2. **Package README**: Package-specific documentation
3. **SECURITY.md**: Security policy
4. **LICENSE**: License information

**Validation Rules**:
- English documentation MUST be created first
- Russian documentation MUST have identical structure
- Line count MUST match exactly between EN and RU
- File naming: `{name}.md` (EN), `{name}-RU.md` (RU)

**Example Structure**:
```
README.md (200 lines)
README-RU.md (200 lines) ✓

packages/types/base/README.md (150 lines)
packages/types/base/README-RU.md (150 lines) ✓
```

### 6. Git Hook Configuration

**Description**: Husky git hooks for code quality enforcement.

**Fields**:
- `hookName`: string - Git hook name (e.g., "pre-commit")
- `command`: string - Command to execute
- `blocking`: boolean - Whether to block commit on failure

**Hooks**:

1. **pre-commit**: Run lint-staged
   - Executes: `npx lint-staged`
   - Blocking: true
   - Purpose: Format and lint staged files

**lint-staged Configuration**:
```json
{
  "*.{ts,tsx,vue}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{json,md}": [
    "prettier --write"
  ]
}
```

**Validation Rules**:
- Husky MUST be initialized with `pnpm dlx husky-init`
- pre-commit hook MUST run lint-staged
- lint-staged MUST auto-fix issues when possible

### 7. Docker Configuration

**Description**: Container configuration for deployment.

**Fields**:
- `baseImage`: string - Docker base image (e.g., "node:20-alpine")
- `workdir`: string - Container working directory
- `ports`: number[] - Exposed ports
- `environment`: Map<string, string> - Environment variables
- `volumes`: string[] - Mounted volumes

**Files**:
- `docker/Dockerfile` - Multi-stage production build
- `docker/docker-compose.yml` - Service orchestration
- `docker/.env.example` - Environment template

**Multi-stage Build Structure**:
```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN corepack enable pnpm
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Stage 2: Builder
FROM node:20-alpine AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm turbo run build

# Stage 3: Runner
FROM node:20-alpine AS runner
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/main.js"]
```

**Validation Rules**:
- MUST use alpine images for size optimization
- MUST use multi-stage builds (deps → build → run)
- Secrets MUST NOT be in Dockerfile (use .env)
- .dockerignore MUST exclude node_modules, .git, dist

### 8. Testing Configuration

**Description**: Vitest testing infrastructure.

**Fields**:
- `environment`: string - Test environment ("happy-dom")
- `globals`: boolean - Enable global test APIs (true)
- `coverage.provider`: string - Coverage provider ("v8")
- `coverage.reporter`: string[] - Coverage report formats
- `coverage.threshold`: object - Coverage thresholds

**Example vitest.config.ts**:
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80
    }
  }
});
```

**Validation Rules**:
- Test environment MUST be "happy-dom" for frontend
- Coverage thresholds MUST be defined
- Tests MUST use describe/it structure

## Entity Relationships

```
Repository Configuration (1)
  ├── contains many → Workspace Catalog (1)
  ├── contains many → Package (n)
  ├── defines → Build Pipeline (1)
  ├── requires → Git Hook Configuration (n)
  └── supports → Docker Configuration (1)

Package (n)
  ├── uses → Workspace Catalog (1)
  ├── has many → Documentation Entity (2: EN + RU)
  ├── executes in → Build Pipeline (1)
  └── tested by → Testing Configuration (1)

Documentation Entity (n)
  ├── belongs to → Package (1) or Repository (1)
  └── paired with → Documentation Entity (1: EN ↔ RU)

Build Pipeline (1)
  ├── orchestrates → Package (n) builds
  └── caches → Build Artifacts

Git Hook Configuration (n)
  ├── validates → Code Quality
  └── enforces → Standards
```

## State Transitions

### Package Lifecycle

```
[Created]
   ↓
[Configured] → package.json, tsconfig.json, README files
   ↓
[Built] → dist/ directory with CJS + ESM + types
   ↓
[Tested] → test execution passed
   ↓
[Published] → available for consumption (internal workspace or npm)
```

### Documentation Lifecycle

```
[Planned]
   ↓
[English Draft] → README.md created (primary source)
   ↓
[Russian Translation] → README-RU.md created (identical structure)
   ↓
[Validated] → line count match, structure verified
   ↓
[Published] → committed to repository
```

## Validation Summary

### Required Validations

1. **Repository Level**:
   - ✓ Node.js version constraint enforced
   - ✓ PNPM version constraint enforced
   - ✓ TypeScript strict mode enabled
   - ✓ All packages in packages/ directory

2. **Package Level**:
   - ✓ Naming convention (-frt, -srv, @universo/*)
   - ✓ base/ directory exists
   - ✓ Dual-build output (CJS + ESM + types)
   - ✓ README.md and README-RU.md present

3. **Documentation Level**:
   - ✓ English created first
   - ✓ Russian matches structure
   - ✓ Line count identical
   - ✓ Sections match exactly

4. **Build Level**:
   - ✓ Turborepo pipeline defined
   - ✓ Task dependencies correct
   - ✓ Caching configured appropriately

5. **Quality Level**:
   - ✓ Husky hooks installed
   - ✓ lint-staged configured
   - ✓ Pre-commit runs successfully

## Future Considerations

### Phase 3: Clusters Feature

When implementing the Clusters feature (first functional feature), new entities will include:

1. **Cluster** (parent entity)
   - id, name, description, ownerId
   - hasMany: Domain

2. **Domain** (child entity)
   - id, name, clusterId
   - hasMany: Resource

3. **Resource** (grandchild entity)
   - id, name, type, domainId

This three-entity hierarchy will establish the pattern for replication to other features (Metaverses → Sections → Entities, etc.).

## Notes

- This data model focuses on infrastructure entities for repository setup
- Functional data entities (Clusters, Metaverses, etc.) will be defined in their respective feature specifications
- All entity configurations follow constitutional principles (TypeScript strict, bilingual docs, PNPM catalog, etc.)
