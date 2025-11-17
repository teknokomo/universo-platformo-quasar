# Implementation Plan: Universo Platformo Quasar Project Setup

**Branch**: `001-quasar-project-setup` | **Date**: 2025-11-17 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-quasar-project-setup/spec.md`

**Note**: This plan follows the planning workflow defined in agent instructions.

## Summary

Initialize the Universo Platformo Quasar repository with complete monorepo infrastructure using PNPM workspaces, Turborepo orchestration, and shared infrastructure packages. Establish bilingual documentation, code quality tools, testing infrastructure, and Docker support following best practices for Quasar/NestJS development. This foundation enables phased development starting with base packages, then implementing the Clusters feature pattern, followed by replication to other features.

## Technical Context

**Language/Version**: TypeScript (strict mode), Node.js >=18.15.0 <19.0.0 || ^20  
**Primary Dependencies**: Quasar Framework (frontend), NestJS (backend), PNPM >=9 (workspace management), Turborepo (build orchestration)  
**Storage**: Supabase (PostgreSQL via TypeORM) - architecture designed for future DBMS expansion  
**Testing**: Vitest for unit and integration tests with @vitest/coverage-v8 and Happy DOM  
**Target Platform**: Web applications (Quasar SPA/PWA) + Node.js server (NestJS API), Docker containerization support  
**Project Type**: Monorepo web application with separate frontend (-frt) and backend (-srv) packages  
**Performance Goals**: Development HMR <1s, production build caching via Turborepo, <200ms API response time  
**Constraints**: TypeScript strict mode enforced, PNPM-only (no npm/yarn), bilingual documentation required (EN/RU identical structure)  
**Scale/Scope**: Monorepo with 10+ packages initially (4 shared infrastructure + functional packages), designed for 50+ packages long-term

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Monorepo Package Structure ✅
- **Status**: PASS - Specification explicitly requires PNPM workspace with catalog (FR-027), Turborepo (FR-028), packages/ directory (FR-003), -frt/-srv suffixes (FR-004), base/ directories (FR-005), @universo/* namespace for shared packages (FR-029)
- **Evidence**: FR-002, FR-003, FR-004, FR-005, FR-027, FR-028, FR-029

### Principle II: TypeScript-First Development ✅
- **Status**: PASS - Specification mandates TypeScript strict mode (FR-006, FR-030), centralized types in @universo/types (FR-029), dual-build for libraries (FR-035)
- **Evidence**: FR-006, FR-017, FR-029, FR-030, FR-035

### Principle III: Technology Stack Adherence ✅
- **Status**: PASS - Specification explicitly requires Quasar, NestJS, TypeScript, PNPM (FR-017), Supabase (FR-018), Passport.js (FR-019)
- **Evidence**: FR-017, FR-018, FR-019, FR-020

### Principle IV: Bilingual Documentation ✅
- **Status**: PASS - Specification requires README.md + README-RU.md with identical structure (FR-001, FR-016), English-first approach per i18n-docs.md
- **Evidence**: FR-001, FR-016, .github/instructions/i18n-docs.md reference

### Principle V: GitHub Integration Standards ✅
- **Status**: PASS - Specification requires Issue creation before specification work (FR-025), following github-issues.md (FR-013), github-pr.md (FR-015), github-labels.md (FR-014)
- **Evidence**: FR-013, FR-014, FR-015, FR-025

### Principle VI: Incremental Feature Development ✅
- **Status**: PASS - Specification defines phased approach (FR-023) with Clusters three-entity pattern as foundation (Phase 3 in Development Workflow)
- **Evidence**: FR-023, Specification section "Development Workflow & Sequencing"

### Principle VII: Clean Implementation Standards ✅
- **Status**: PASS - Specification excludes docs/ directory (FR-021), AI agent configs (FR-022), establishes React monitoring process (FR-024) with bi-weekly reviews and 4-point criteria
- **Evidence**: FR-009, FR-020, FR-021, FR-022, FR-024

### Additional Constitutional Requirements ✅
- Shared infrastructure packages (@universo/types, utils, i18n, api-client): FR-029 ✅
- Package README template: FR-030 ✅
- Git hooks (Husky): FR-032 ✅
- Docker support: FR-033 ✅
- SECURITY.md: FR-037 ✅
- Tools directory: FR-036 ✅

### Overall Gate Status: ✅ PASS

All constitutional principles are satisfied by the specification. No violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/001-quasar-project-setup/
├── plan.md              # This file (implementation plan)
├── research.md          # Phase 0 output (technology research and decisions)
├── data-model.md        # Phase 1 output (key entities and relationships)
├── quickstart.md        # Phase 1 output (getting started guide)
├── contracts/           # Phase 1 output (API contracts if applicable)
└── tasks.md             # Phase 2 output (NOT created by this command)
```

### Source Code (repository root)

```text
# Monorepo structure for Universo Platformo Quasar

# Root configuration
package.json              # Workspace root, engines: Node.js >=18.15.0 <19.0.0 || ^20, PNPM >=9
pnpm-workspace.yaml       # Workspace config with catalog for centralized dependency versions
turbo.json               # Turborepo pipeline: build, test, dev, clean tasks
tsconfig.json            # Base TypeScript config with strict mode
.npmrc                   # PNPM config: auto-install-peers, prefer-workspace-packages, link-workspace-packages deep
.gitignore               # Node.js, TypeScript, IDE files
.prettierrc              # Code formatting
.eslintrc.json           # Linting rules for Quasar/NestJS

# Documentation
README.md                # English documentation (primary)
README-RU.md             # Russian documentation (identical structure)
LICENSE                  # Omsk Open License
SECURITY.md              # Security reporting procedures

# Git hooks
.husky/                  # Husky git hooks
  pre-commit            # Runs lint-staged for code quality

# Docker support
docker/
  Dockerfile            # Production container image
  docker-compose.yml    # Multi-service orchestration
  .env.example          # Environment variables template

# Utilities
tools/
  docs/                 # Documentation validation scripts
  testing/              # Testing utilities

# Shared infrastructure packages (Phase 2)
packages/
  types/                # @universo/types - TypeScript definitions
    base/
      src/
      package.json
      tsconfig.json
      README.md
      README-RU.md
  
  utils/                # @universo/utils - Utility functions
    base/
      src/
      package.json
      tsconfig.json
      README.md
      README-RU.md
  
  i18n/                 # @universo/i18n - Internationalization
    base/
      src/
      package.json
      tsconfig.json
      README.md
      README-RU.md
  
  api-client/           # @universo/api-client - Type-safe API clients
    base/
      src/
      package.json
      tsconfig.json
      README.md
      README-RU.md

# Future functional packages (Phase 3+)
# packages/
#   auth-frt/           # @universo/auth-frt - Authentication UI
#   auth-srv/           # @universo/auth-srv - Authentication backend
#   clusters-frt/       # Clusters frontend (Quasar)
#   clusters-srv/       # Clusters backend (NestJS)
```

**Structure Decision**: 
- **Monorepo with PNPM workspace catalog**: Centralized dependency management prevents version conflicts
- **Turborepo orchestration**: Efficient caching for build tasks across packages
- **Separate -frt/-srv packages**: Clear frontend/backend separation, independent deployment
- **base/ directories in packages**: Supports future alternative implementations
- **@universo/* namespace**: Shared infrastructure packages for code reuse
- **Docker support in docker/**: Production containerization separated from development files
- **tools/ directory**: Utility scripts for documentation validation and testing
- **Bilingual documentation**: README.md (English primary) + README-RU.md (exact translation)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitutional violations - all requirements align with project principles. No complexity justification needed.
