# Tasks: Universo Platformo Quasar Project Setup

**Input**: Design documents from `/.specify/specs/001-quasar-project-setup/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Tests are NOT requested in the feature specification - no test tasks included per template guidelines.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a monorepo project with packages in `packages/` directory. All functional code goes in packages, root contains only configuration.

## Scope of This Tasks File

**Feature 001**: Repository Setup and Shared Infrastructure ONLY

This tasks.md covers the foundational repository setup that enables all future feature development:
- Repository configuration and tooling
- PNPM workspace with catalog
- Turborepo build orchestration
- Shared infrastructure packages (@universo/types, utils, i18n, api-client)
- Code quality tools and documentation framework
- Testing infrastructure

**NOT Included** (separate feature specifications required):
- Authentication/authorization functionality
- Uniks, Metaverses, Clusters entities
- Spaces/Canvases with node systems
- LangChain or UPDL node libraries
- Publishing system

See "Future Features Roadmap" section at the end of this document for planned features.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Repository initialization and basic configuration structure

- [ ] T001 Initialize root package.json with workspace configuration, engines (Node.js >=18.15.0 <19.0.0 || ^20, PNPM >=9), private: true, and Prettier configuration (printWidth: 140, singleQuote: true, trailingComma: none, tabWidth: 4, semi: false, endOfLine: auto)
- [ ] T002 Create pnpm-workspace.yaml with packages configuration (packages/*, packages/*/base patterns) and catalog section for centralized dependency versions (TypeScript ^5.3.0, Quasar ^2.14.0, NestJS ^10.0.0, Vitest ^1.0.0, etc.)
- [ ] T003 Create .npmrc with PNPM workspace settings (auto-install-peers: true, strict-peer-dependencies: false, prefer-workspace-packages: true, link-workspace-packages: deep, hoist: true, shamefully-hoist: true)
- [ ] T004 Create turbo.json with pipeline definitions for build (dependsOn: ^build, outputs: dist/**), test (dependsOn: build, cache: false), dev (cache: false, persistent: true), lint (cache: true), and clean (cache: false) tasks
- [ ] T005 [P] Create root tsconfig.json with base configuration, strict: false (root permissive), experimentalDecorators: true, emitDecoratorMetadata: true for NestJS, and path aliases for @testing/* utilities
- [ ] T006 [P] Create .eslintrc.json with TypeScript rules, Quasar/Vue3 support, NestJS support, and unused-imports plugin configuration
- [ ] T007 [P] Create .prettierrc file (or confirm settings in package.json) with project code formatting rules
- [ ] T008 [P] Create comprehensive .gitignore for Node.js (node_modules, dist, .env, coverage, .turbo, etc.), TypeScript, and IDE files
- [ ] T009 [P] Create LICENSE file with Omsk Open License statement and note about individual package licenses
- [ ] T010 [P] Create SECURITY.md with security vulnerability reporting procedures and policies
- [ ] T011 [P] Initialize Husky for git hooks with `pnpm dlx husky-init` in repository root
- [ ] T012 Configure .husky/pre-commit hook to run `npx lint-staged` for code quality enforcement
- [ ] T013 [P] Create lint-staged configuration in package.json or separate file for TypeScript (*.ts, *.tsx, *.vue: eslint --fix, prettier --write) and documentation (*.json, *.md: prettier --write)
- [ ] T014 [P] Create docker/Dockerfile with multi-stage build (deps stage with PNPM install, builder stage with turbo build, runner stage)
- [ ] T015 [P] Create docker/docker-compose.yml for service orchestration with environment variables
- [ ] T016 [P] Create docker/.env.example with template for environment variables (DATABASE_URL, SUPABASE_URL, SUPABASE_ANON_KEY, etc.)
- [ ] T017 [P] Create docker/.dockerignore excluding node_modules, .git, dist, coverage, and development files
- [ ] T018 [P] Create tools/docs/ directory structure for documentation validation utilities
- [ ] T019 [P] Create tools/docs/check-i18n-docs.mjs script to validate English/Russian documentation parity (line count, structure matching)
- [ ] T020 [P] Create tools/testing/ directory structure for testing utilities and helpers

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure and documentation that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T021 Create README.md (English) with project overview, relationship to Universo Platformo React (noting React has Flowise legacy), technology stack (Quasar/NestJS/TypeScript/PNPM), monorepo structure explanation, critical modular architecture warning, installation instructions, development commands, contribution guidelines
- [ ] T022 Create README-RU.md (Russian) as exact translation of README.md with identical structure and line count
- [ ] T023 [P] Create TEMPLATE-README-GUIDE.md documenting how to use package README template with guidance on required sections, bilingual requirements, code examples, and @universo/* namespace usage
- [ ] T024 Create GitHub issue labels per .github/instructions/github-labels.md as initial label set (type: bug/enhancement/documentation/feature, area: repository/packages/infrastructure, priority, status)
- [ ] T025 [P] Create .github/ISSUE_TEMPLATE/ directory with issue templates for bugs, features, and questions following bilingual format
- [ ] T026 [P] Create .github/PULL_REQUEST_TEMPLATE.md with PR template following bilingual format and requirement to reference issue with "Fixes #N"
- [ ] T027 Create packages/ root directory to establish monorepo packages structure
- [ ] T028 Add pnpm.overrides section to root package.json for security patches and version consistency management

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Repository Initialization and Documentation (Priority: P1) 🎯 MVP

**Goal**: Establish complete repository structure with bilingual documentation, configuration files, and clear architectural guidelines

**Independent Test**: Clone repository, read both README files, verify all configuration files exist with valid settings, confirm Turborepo and PNPM workspace catalog are properly configured, validate Docker support files

### Implementation for User Story 1

- [ ] T029 [P] [US1] Create .specify/specs/ directory and document feature specification structure in repository root
- [ ] T030 [P] [US1] Create .specify/ directory structure (.specify/memory/, .specify/scripts/, .specify/templates/) in repository root
- [ ] T031 [P] [US1] Create .vscode/ directory with recommended extensions for Quasar/NestJS development (Volar, ESLint, Prettier, TypeScript Vue Plugin)
- [ ] T032 [P] [US1] Document React repository monitoring process in README.md (bi-weekly review schedule, 4-point evaluation criteria: stability, pattern alignment, code quality, value proposition)
- [ ] T033 [P] [US1] Document phased development approach in README.md (repository setup → shared infrastructure → Clusters pattern → replication)
- [ ] T034 [P] [US1] Add section to README.md explaining modular architecture with critical warnings about packages/ directory requirements
- [ ] T035 [P] [US1] Add references to .github/instructions/ guidelines in README.md (github-issues.md, github-pr.md, github-labels.md, i18n-docs.md)
- [ ] T036 [US1] Verify all changes are mirrored in README-RU.md with identical structure and line count using tools/docs/check-i18n-docs.mjs
- [ ] T037 [US1] Create root .gitattributes file for line ending normalization and linguist language statistics
- [ ] T038 [US1] Validate all root configuration files are valid (package.json, pnpm-workspace.yaml, turbo.json, tsconfig.json, .eslintrc.json)
- [ ] T039 [US1] Test PNPM installation with `pnpm install` to verify workspace configuration
- [ ] T040 [US1] Test Husky hooks are installed correctly after `pnpm install`

**Checkpoint**: At this point, User Story 1 should be fully functional - repository is properly initialized with complete bilingual documentation and configuration

---

## Phase 4: User Story 2 - Monorepo Infrastructure with PNPM (Priority: P2)

**Goal**: Complete PNPM workspace configuration enabling multi-package development with centralized dependency management through catalog

**Independent Test**: Run `pnpm install` and verify all workspaces recognized, dependencies installed using catalog versions, workspace structure allows cross-package references, Turborepo can orchestrate builds

### Implementation for User Story 2

- [ ] T041 [P] [US2] Add core dependencies to pnpm-workspace.yaml catalog (TypeScript ^5.3.0, Vitest ^1.0.0, Happy DOM ^12.0.0, ESLint ^8.56.0, Prettier ^3.1.0)
- [ ] T042 [P] [US2] Add Quasar dependencies to catalog (@quasar/app-vite ^1.8.0, quasar ^2.14.0, vue ^3.4.0, pinia for state management)
- [ ] T043 [P] [US2] Add NestJS dependencies to catalog (@nestjs/core ^10.0.0, @nestjs/common ^10.0.0, @nestjs/platform-express ^10.0.0, @nestjs/passport for auth, @nestjs/typeorm for database)
- [ ] T044 [P] [US2] Add database dependencies to catalog (@supabase/supabase-js ^2.39.0, typeorm ^0.3.0, pg ^8.11.0 for PostgreSQL)
- [ ] T045 [P] [US2] Add build tool dependencies to catalog (turbo ^1.11.0, tsup or tsdown for library building, Vite via Quasar)
- [ ] T046 [P] [US2] Add code quality dependencies to catalog (husky ^8.0.0, lint-staged ^15.0.0, eslint-plugin-unused-imports)
- [ ] T047 [P] [US2] Add testing dependencies to catalog (@vitest/coverage-v8 ^1.0.0, test utilities)
- [ ] T048 [US2] Document catalog usage in README.md explaining how packages reference catalog versions with "catalog:" syntax
- [ ] T049 [US2] Document Turborepo pipeline in README.md explaining build orchestration, caching strategies, and task dependencies
- [ ] T050 [US2] Create development workflow documentation in README.md for common PNPM workspace commands (install, build, test, lint)
- [ ] T051 [US2] Test catalog functionality by creating a temporary test package that uses catalog dependencies
- [ ] T052 [US2] Verify Turborepo pipelines work correctly with `pnpm turbo run build --dry-run`
- [ ] T053 [US2] Update README-RU.md with exact translation of all User Story 2 documentation changes

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - PNPM workspace with catalog is fully functional

---

## Phase 5: User Story 3 - Base Package Structure and Shared Infrastructure (Priority: P3)

**Goal**: Create foundational package structure with shared infrastructure packages (@universo/types, utils, i18n, api-client) that promote code reuse across functional packages

**Independent Test**: Create shared infrastructure packages, verify they have base/ directories, can be built independently using Turborepo, follow established structure, and can be imported by other packages

### Implementation for User Story 3

#### Shared Infrastructure Package: @universo/types

- [ ] T054 [P] [US3] Create packages/types/ directory structure with base/ subdirectory
- [ ] T055 [P] [US3] Create packages/types/base/package.json with name "@universo/types", dual-build exports (CJS + ESM + types), catalog dependencies, sideEffects: false, files: ["dist", "src"]
- [ ] T056 [P] [US3] Create packages/types/base/tsconfig.json extending root config with strict: true and outDir: ./dist
- [ ] T057 [P] [US3] Create packages/types/base/src/index.ts as main export entry point
- [ ] T058 [P] [US3] Create packages/types/base/src/updl/ directory for UPDL type definitions (platform-wide types)
- [ ] T059 [P] [US3] Create packages/types/base/src/api/ directory for API request/response types
- [ ] T060 [P] [US3] Add build script to packages/types/base/package.json using tsup or documented bundler for dual-build
- [ ] T061 [P] [US3] Create packages/types/base/README.md with package overview, installation, usage examples, architecture explanation
- [ ] T062 [P] [US3] Create packages/types/base/README-RU.md as exact translation with identical structure

#### Shared Infrastructure Package: @universo/utils

- [ ] T063 [P] [US3] Create packages/utils/ directory structure with base/ subdirectory
- [ ] T064 [P] [US3] Create packages/utils/base/package.json with name "@universo/utils", dual-build exports, catalog dependencies, sideEffects: false, files: ["dist", "src"]
- [ ] T065 [P] [US3] Create packages/utils/base/tsconfig.json extending root config with strict: true
- [ ] T066 [P] [US3] Create packages/utils/base/src/index.ts as main export entry point
- [ ] T067 [P] [US3] Create packages/utils/base/src/processors/ directory for data transformation utilities
- [ ] T068 [P] [US3] Create packages/utils/base/src/helpers/ directory for common helper functions
- [ ] T069 [P] [US3] Add build script using tsup or documented bundler for dual-build
- [ ] T070 [P] [US3] Create packages/utils/base/README.md with package documentation
- [ ] T071 [P] [US3] Create packages/utils/base/README-RU.md as exact translation

#### Shared Infrastructure Package: @universo/i18n

- [ ] T072 [P] [US3] Create packages/i18n/ directory structure with base/ subdirectory
- [ ] T073 [P] [US3] Create packages/i18n/base/package.json with name "@universo/i18n", multiple export entry points (main + /locales for lazy loading), catalog dependencies including i18next, sideEffects: true (has initialization code)
- [ ] T074 [P] [US3] Create packages/i18n/base/tsconfig.json extending root config with strict: true
- [ ] T075 [P] [US3] Create packages/i18n/base/src/index.ts with centralized i18next configuration (single instance)
- [ ] T076 [P] [US3] Create packages/i18n/base/src/locales/ directory structure with en/ and ru/ subdirectories
- [ ] T077 [P] [US3] Create packages/i18n/base/src/locales/en/common.json with English translations
- [ ] T078 [P] [US3] Create packages/i18n/base/src/locales/ru/common.json with Russian translations
- [ ] T079 [P] [US3] Implement language detection and switching logic in src/index.ts
- [ ] T080 [P] [US3] Implement namespace support for modular translations in src/index.ts
- [ ] T081 [P] [US3] Create packages/i18n/base/README.md with usage examples for frontend and backend
- [ ] T082 [P] [US3] Create packages/i18n/base/README-RU.md as exact translation

#### Shared Infrastructure Package: @universo/api-client

- [ ] T083 [P] [US3] Create packages/api-client/ directory structure with base/ subdirectory
- [ ] T084 [P] [US3] Create packages/api-client/base/package.json with name "@universo/api-client", dual-build exports, catalog dependencies including axios, sideEffects: false
- [ ] T085 [P] [US3] Create packages/api-client/base/tsconfig.json extending root config with strict: true
- [ ] T086 [P] [US3] Create packages/api-client/base/src/index.ts as main export
- [ ] T087 [P] [US3] Create packages/api-client/base/src/base-client.ts with Axios-based HTTP communication layer
- [ ] T088 [P] [US3] Implement error handling and retry logic in base-client.ts
- [ ] T089 [P] [US3] Create packages/api-client/base/src/types/ directory for request/response types (import from @universo/types)
- [ ] T090 [P] [US3] Create packages/api-client/base/README.md with type-safe client usage examples
- [ ] T091 [P] [US3] Create packages/api-client/base/README-RU.md as exact translation

#### Package Structure Validation

- [ ] T092 [US3] Create workspace package reference in root package.json workspaces field confirming packages/* and packages/*/base patterns
- [ ] T093 [US3] Test cross-package TypeScript references by having one package import from another
- [ ] T094 [US3] Build all shared infrastructure packages with `pnpm turbo run build --filter="@universo/*"`
- [ ] T095 [US3] Verify dual-build outputs (CJS, ESM, DTS) exist in dist/ directories
- [ ] T096 [US3] Test package imports from node with both require() and import syntax
- [ ] T097 [US3] Validate all package README files using tools/docs/check-i18n-docs.mjs for EN/RU parity
- [ ] T098 [US3] Update root README.md with shared infrastructure package documentation and usage examples
- [ ] T099 [US3] Update README-RU.md with exact translation of package documentation

**Checkpoint**: All shared infrastructure packages (@universo/types, utils, i18n, api-client) are built, tested, and ready for use by functional packages

---

## Phase 6: User Story 4 - GitHub Issues Infrastructure (Priority: P4)

**Goal**: Establish GitHub Issues workflow with proper labels and bilingual issue templates

**Independent Test**: Create test issues with appropriate labels, verify they follow bilingual format, check labels match repository conventions

### Implementation for User Story 4

- [ ] T100 [P] [US4] Verify GitHub labels were created in Phase 2 (T024) and document label usage in .github/instructions/github-labels.md
- [ ] T101 [P] [US4] Create .github/ISSUE_TEMPLATE/bug_report.md with bilingual structure (English content + Russian in spoiler)
- [ ] T102 [P] [US4] Create .github/ISSUE_TEMPLATE/feature_request.md with bilingual structure
- [ ] T103 [P] [US4] Create .github/ISSUE_TEMPLATE/question.md with bilingual structure
- [ ] T104 [P] [US4] Update .github/ISSUE_TEMPLATE/config.yml to configure issue template chooser
- [ ] T105 [US4] Document issue creation workflow in README.md referencing .github/instructions/github-issues.md
- [ ] T106 [US4] Document that issues must be created BEFORE specification work per Issue-First Development Workflow
- [ ] T107 [US4] Add issue workflow documentation to repository's contribution guidelines
- [ ] T108 [US4] Update README-RU.md with exact translation of issue workflow documentation
- [ ] T109 [US4] Test issue creation workflow by creating a test issue and verifying it follows the bilingual format

**Checkpoint**: GitHub Issues infrastructure is complete with proper labels and bilingual templates

---

## Phase 7: User Story 5 - Development Environment and Code Quality (Priority: P5)

**Goal**: Complete development environment setup with code quality tools, testing infrastructure, and Docker support

**Independent Test**: Follow installation instructions, verify Node.js/PNPM versions, run development commands, trigger pre-commit hooks, run tests with Vitest, start Docker containers

### Implementation for User Story 5

- [ ] T110 [P] [US5] Create detailed Node.js version installation instructions in README.md (>=18.15.0 <19.0.0 || ^20)
- [ ] T111 [P] [US5] Create detailed PNPM installation instructions in README.md (>=9, via npm or corepack)
- [ ] T112 [P] [US5] Document development dependencies installation process with `pnpm install`
- [ ] T113 [P] [US5] Create vitest.config.ts in repository root for shared Vitest configuration (globals: true, environment: 'happy-dom', coverage provider: v8)
- [ ] T114 [P] [US5] Document testing commands in README.md (`pnpm turbo run test`, `pnpm test --watch`, coverage generation)
- [ ] T115 [P] [US5] Create environment configuration guide in README.md for Supabase setup (project creation, URL, keys)
- [ ] T116 [P] [US5] Create .env.example files documentation explaining environment variables structure
- [ ] T117 [P] [US5] Document TypeORM configuration pattern in README.md (PostgreSQL connection, entities, migrations)
- [ ] T118 [P] [US5] Create Passport.js authentication setup guide in README.md (Supabase connector strategy)
- [ ] T119 [US5] Document Docker development workflow in README.md (docker-compose commands, container management)
- [ ] T120 [US5] Test Docker build process with `docker build -f docker/Dockerfile .`
- [ ] T121 [US5] Test Docker Compose with `cd docker && docker-compose up` (may fail without actual services, document expected behavior)
- [ ] T122 [US5] Document troubleshooting section in README.md (PNPM issues, build errors, TypeScript errors, git hook failures, Docker issues)
- [ ] T123 [US5] Create quickstart validation checklist based on .specify/specs/001-quasar-project-setup/quickstart.md
- [ ] T124 [US5] Test pre-commit hooks by staging files and attempting commit
- [ ] T125 [US5] Verify ESLint runs on TypeScript files and catches issues
- [ ] T126 [US5] Verify Prettier formats code correctly
- [ ] T127 [US5] Test unused-imports ESLint plugin by creating test file with unused imports
- [ ] T128 [US5] Update README-RU.md with exact translation of all development environment documentation
- [ ] T129 [US5] Validate complete English/Russian documentation parity using tools/docs/check-i18n-docs.mjs

**Checkpoint**: All user stories (1-5) are complete - development environment is fully functional with quality tools and testing infrastructure

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements affecting multiple components

- [ ] T130 [P] Review all package README files for completeness and consistency with TEMPLATE-README-GUIDE.md
- [ ] T131 [P] Verify all bilingual documentation pairs (README.md + README-RU.md) have identical structure using tools/docs/check-i18n-docs.mjs
- [ ] T132 [P] Run comprehensive linting across entire repository with `pnpm turbo run lint`
- [ ] T133 [P] Fix any linting issues discovered with `pnpm turbo run lint -- --fix`
- [ ] T134 Run comprehensive build across entire repository with `pnpm turbo run build`
- [ ] T135 Verify all build artifacts are generated correctly in packages/*/base/dist/
- [ ] T136 Test Turborepo caching by running build twice and verifying cache hits on second run
- [ ] T137 [P] Review SECURITY.md for completeness and clarity
- [ ] T138 [P] Review LICENSE for proper Omsk Open License statement
- [ ] T139 [P] Validate all root configuration files one final time (package.json, pnpm-workspace.yaml, turbo.json, etc.)
- [ ] T140 Create final validation checklist based on .specify/specs/001-quasar-project-setup/quickstart.md
- [ ] T141 Execute quickstart.md validation: Clone repository in fresh directory, follow all setup steps, verify everything works
- [ ] T142 Document known limitations or future work in repository documentation
- [ ] T143 Create GitHub Issue for next feature (likely Clusters feature per phased development approach)
- [ ] T144 Final review of all Success Criteria from spec.md to ensure 100% completion

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User Story 1 (Repository & Docs): Can start after Foundational
  - User Story 2 (PNPM Infrastructure): Can start after Foundational, recommended after US1 for context
  - User Story 3 (Package Structure): Depends on US1 and US2 being complete (needs directory structure and catalog)
  - User Story 4 (GitHub Issues): Can start after Foundational, can run parallel with US1-US3
  - User Story 5 (Dev Environment): Can start after Foundational, benefits from US1-US3 being complete for testing
- **Polish (Phase 8)**: Depends on all user stories (1-5) being complete

### User Story Dependencies

```
Foundational (Phase 2) [BLOCKING]
    ├── User Story 1 (P1) - Repository & Documentation [No dependencies]
    ├── User Story 2 (P2) - PNPM Infrastructure [After US1 recommended]
    ├── User Story 3 (P3) - Package Structure [Requires US1, US2]
    ├── User Story 4 (P4) - GitHub Issues [Independent, can parallel with US1-US3]
    └── User Story 5 (P5) - Dev Environment [Benefits from US1-US3 complete]
```

### Within Each Phase

**Phase 1 (Setup)**: Most tasks marked [P] can run in parallel
**Phase 2 (Foundational)**: Tasks marked [P] can run in parallel
**Phase 3 (US1)**: Tasks marked [P] can run in parallel, sequential tasks have dependencies
**Phase 4 (US2)**: Catalog additions [P] can run in parallel, documentation and testing sequential
**Phase 5 (US3)**: Each infrastructure package can be built in parallel, validation tasks sequential
**Phase 6 (US4)**: Template creation [P] can run in parallel, workflow documentation sequential
**Phase 7 (US5)**: Documentation additions [P] can run in parallel, validation tasks sequential
**Phase 8 (Polish)**: Review and validation tasks mostly sequential to ensure completeness

### Critical Path

```
T001-T028 (Setup + Foundational) 
  → T029-T040 (US1: Repository & Docs)
  → T041-T053 (US2: PNPM Catalog)
  → T054-T099 (US3: Package Structure) [LONGEST - 46 tasks]
  → T130-T144 (Polish)
```

**Estimated Critical Path**: ~120-130 tasks with many opportunities for parallelization

### Parallel Opportunities

#### Phase 1: Setup
- Configuration files (T005-T008, T014-T017, T018-T020) - can all be created in parallel
- Git hooks setup (T011-T013) - can run parallel with Docker and tools setup

#### Phase 2: Foundational
- README creation (T021-T023) and GitHub templates (T025-T026) - can run in parallel
- Label creation (T024) can happen independently

#### Phase 3: User Story 1
- Directory structure creation (T029-T031) - all parallel
- Documentation sections (T032-T035) - can be added in parallel
- Testing and validation (T038-T040) - sequential after implementation

#### Phase 4: User Story 2
- All catalog additions (T041-T047) - can run in parallel
- Documentation (T048-T050) - can be done in parallel
- Testing (T051-T053) - sequential after catalog setup

#### Phase 5: User Story 3 (Highest Parallelization)
Each infrastructure package can be built by different team members simultaneously:
- @universo/types (T054-T062) - Package Team A
- @universo/utils (T063-T071) - Package Team B
- @universo/i18n (T072-T082) - Package Team C
- @universo/api-client (T083-T091) - Package Team D
- Validation (T092-T099) - sequential after all packages complete

#### Phase 6: User Story 4
- All issue templates (T101-T104) - can run in parallel
- Documentation (T105-T108) - sequential, then validation (T109)

#### Phase 7: User Story 5
- Documentation sections (T110-T119) - can be created in parallel
- Testing and validation (T120-T129) - mix of parallel and sequential

#### Phase 8: Polish
- Reviews (T130-T133, T137-T139) - can run in parallel
- Build and validation (T134-T136, T140-T144) - mostly sequential

---

## Parallel Example: User Story 3 - Package Creation

```bash
# Four team members can work simultaneously on different packages:

Team Member 1 - @universo/types:
  T054: Create packages/types/ directory
  T055: Create package.json
  T056: Create tsconfig.json
  T057-T060: Implement source files and build
  T061-T062: Create README files

Team Member 2 - @universo/utils:
  T063: Create packages/utils/ directory
  T064: Create package.json
  T065: Create tsconfig.json
  T066-T069: Implement source files and build
  T070-T071: Create README files

Team Member 3 - @universo/i18n:
  T072: Create packages/i18n/ directory
  T073: Create package.json
  T074: Create tsconfig.json
  T075-T080: Implement i18n configuration and locales
  T081-T082: Create README files

Team Member 4 - @universo/api-client:
  T083: Create packages/api-client/ directory
  T084: Create package.json
  T085: Create tsconfig.json
  T086-T089: Implement API client
  T090-T091: Create README files

# After all packages complete, one person validates:
  T092-T099: Cross-package validation and testing
```

---

## Implementation Strategy

### MVP First (User Stories 1-2 Only)

1. Complete Phase 1: Setup (T001-T020)
2. Complete Phase 2: Foundational (T021-T028) - **CRITICAL BLOCKER**
3. Complete Phase 3: User Story 1 (T029-T040) - **MVP Core**
4. Complete Phase 4: User Story 2 (T041-T053) - **MVP Core**
5. **STOP and VALIDATE**: Repository is initialized with working PNPM workspace and catalog
6. Can proceed with package development or stop here with functional monorepo structure

### Incremental Delivery (Recommended)

1. **Foundation** (Phases 1-2): Setup + Foundational → Repository and configuration ready
2. **MVP Release** (Phase 3-4): US1 + US2 → Documented repository with PNPM workspace
3. **Infrastructure Release** (Phase 5): US3 → Shared packages available for use
4. **Workflow Release** (Phase 6): US4 → GitHub Issues infrastructure ready
5. **Developer Release** (Phase 7): US5 → Complete development environment with quality tools
6. **Production Release** (Phase 8): Polish → Production-ready repository

### Parallel Team Strategy

With multiple developers (recommended minimum: 4):

1. **Phase 1-2**: All team members collaborate on setup and foundational work (15-20 tasks)
2. **Once Foundational complete**, split work:
   - **Developer A**: User Story 1 (Repository & Documentation) - T029-T040
   - **Developer B**: User Story 2 (PNPM Infrastructure) - T041-T053
   - **Developer C**: User Story 4 (GitHub Issues) - T100-T109
   - **Developer D**: Prepare for User Story 3
3. **After US1-US2 complete**, all developers on User Story 3 (Package Structure):
   - Each developer takes one shared infrastructure package
   - Work in parallel on separate packages (T054-T091)
   - Collaborate on validation (T092-T099)
4. **Developer A or B**: User Story 5 (Dev Environment) - T110-T129
5. **All developers**: Phase 8 (Polish) - divide review tasks

**Total Estimated Effort**: 
- Sequential: ~144 tasks
- With 4-person team: ~50-60% time reduction due to parallelization
- Critical path focuses on User Story 3 (package structure) which has most tasks

---

## Notes

- **[P] marker**: Tasks can run in parallel (different files, no dependencies on incomplete work)
- **[Story] label**: Maps task to specific user story for traceability and independent testing
- **No tests**: Feature specification does not request tests, so no test tasks included per template guidelines
- **Tests are optional**: If tests are requested in future, they would be added per user story BEFORE implementation
- **Strict checklist format**: Every task follows `- [ ] [TaskID] [P?] [Story?] Description with file path` format
- **File paths**: All tasks include specific file paths for implementation
- **Independent stories**: Each user story can be tested independently after completion
- **Checkpoint validation**: Use checkpoints to verify story completion before moving to next priority
- **Commit strategy**: Commit after each logical group of tasks or at checkpoints
- **Bilingual requirement**: All documentation must have EN + RU versions with identical structure
- **Constitution compliance**: All tasks follow constitution principles (TypeScript strict in packages, modular architecture, PNPM catalog, bilingual docs)
- **Phased approach**: Repository setup → Shared infrastructure → Future features (Clusters, etc.)

---

## Success Validation

Upon completion of all tasks, verify against Success Criteria from spec.md:

✅ **Repository Structure** (SC-001 to SC-005): Complete repository initialization
✅ **Configuration Files** (SC-002, SC-004): All config files valid
✅ **Documentation** (SC-001, SC-003, SC-006, SC-011-SC-016): Bilingual docs complete
✅ **PNPM Workspace** (SC-018, SC-019, SC-022): Catalog and Turborepo configured
✅ **Shared Packages** (SC-020, SC-021): @universo/* packages created
✅ **Code Quality** (SC-023, SC-035, SC-038): Husky, ESLint, Prettier configured
✅ **Docker Support** (SC-024, SC-025): Docker files in docker/ directory
✅ **Testing Infrastructure** (SC-025): Vitest configured
✅ **Tools & Security** (SC-026, SC-027): tools/ directory and SECURITY.md exist
✅ **Build System** (SC-028, SC-039): Dual-build and tsconfig configured
✅ **TypeScript** (SC-030, SC-031, SC-032): Strict mode and decorators configured
✅ **Package Standards** (SC-033, SC-036, SC-037, SC-040): Package template with all fields
✅ **Documentation Tools** (SC-034): check-i18n-docs.mjs exists

All 40 Success Criteria should be met upon completion of Phase 8.

---

**Total Tasks**: 144 tasks organized across 8 phases
**Task Count by User Story**:
- Setup (Phase 1): 20 tasks
- Foundational (Phase 2): 8 tasks
- User Story 1 (P1): 12 tasks  
- User Story 2 (P2): 13 tasks
- User Story 3 (P3): 46 tasks (highest - package creation)
- User Story 4 (P4): 10 tasks
- User Story 5 (P5): 20 tasks
- Polish (Phase 8): 15 tasks

**Parallel Opportunities**: ~50-60% of tasks can run in parallel with proper team coordination
**MVP Scope**: Phases 1-4 (User Stories 1-2) = 53 tasks = Functional monorepo with documentation
**Recommended First Delivery**: Phases 1-5 (User Stories 1-3) = 99 tasks = Monorepo + Shared Infrastructure

---

## Future Features Roadmap

**Important**: This tasks.md covers ONLY feature 001 (repository setup and shared infrastructure). The complete Universo Platformo functionality will be implemented through subsequent feature specifications, each with its own tasks.md file.

### Planned Feature Sequence

The following features will be implemented in separate specifications, following the modular package architecture established in feature 001:

#### Feature 002: Authentication & Authorization (Priority: CRITICAL)
**Packages**: `@universo/auth-frt`, `@universo/auth-srv`
- User registration and login pages (Quasar UI)
- Passport.js + Supabase authentication backend
- Session management and JWT tokens
- Protected routes and authentication guards
- User profile management
- Password reset and email verification

#### Feature 003: Clusters Management (Priority: HIGH)
**Packages**: `@universo/clusters-frt`, `@universo/clusters-srv`
**Pattern**: Three-entity hierarchy (Clusters → Domains → Resources)
- Cluster CRUD operations
- Domain management within clusters
- Resource management within domains
- TypeORM entities and migrations
- RESTful API endpoints
- This establishes the base pattern for other hierarchical features

#### Feature 004: Uniks (Unique Characters) (Priority: HIGH)
**Packages**: `@universo/uniks-frt`, `@universo/uniks-srv`
- Unik character creation and management
- Character properties and attributes
- Character relationships and hierarchies
- Integration with other entities

#### Feature 005: Metaverses (Priority: HIGH)
**Packages**: `@universo/metaverses-frt`, `@universo/metaverses-srv`
**Pattern**: Similar to Clusters (Metaverses → Sections → Entities)
- Metaverse CRUD operations
- Section management
- Entity management within sections
- Reuses patterns from Clusters feature

#### Feature 006: Spaces/Canvases Foundation (Priority: MEDIUM)
**Packages**: `@universo/spaces-frt`, `@universo/spaces-srv`
- Workspace/canvas creation and management
- Canvas layout and basic interactions
- Foundation for node-based systems
- Visual editor UI components (Quasar + canvas libraries)

#### Feature 007: Node System Infrastructure (Priority: MEDIUM)
**Packages**: `@universo/node-engine`, `@universo/node-ui`
- Base node graph engine
- Node creation, connection, and execution
- Visual node editor integration with Spaces
- Node serialization and persistence
- Event system for node interactions

#### Feature 008: LangChain Nodes Library (Priority: MEDIUM)
**Packages**: `@universo/langchain-nodes-frt`, `@universo/langchain-nodes-srv`
**Reference**: Similar to React version's flowise-components but optimized modular structure
- LangChain integration nodes
- LLM provider nodes (OpenAI, Anthropic, etc.)
- Chain composition nodes
- Vector store nodes
- Embedding nodes
- Agent nodes
- Tool nodes
- Document loader nodes

#### Feature 009: UPDL Nodes Library (Priority: MEDIUM)
**Packages**: `@universo/updl-nodes-frt`, `@universo/updl-nodes-srv`
**Reference**: Based on React version's packages/updl/base
- UPDL protocol node implementations
- Data transformation nodes
- Integration nodes with Uniks and Metaverses
- Custom UPDL node types

#### Feature 010: Additional Node Libraries (Priority: LOW)
**Packages**: Various `@universo/*-nodes` packages
- Custom business logic nodes
- Integration nodes for external services
- Utility and helper nodes
- Community-contributed node libraries

#### Feature 011: Application Publishing System (Priority: LOW)
**Packages**: `@universo/publisher-frt`, `@universo/publisher-srv`
- Canvas/workflow export functionality
- Standalone application generation
- Deployment configurations
- Version management
- Access control and permissions

#### Feature 012: Marketplace & Sharing (Priority: LOW)
**Packages**: `@universo/marketplace-frt`, `@universo/marketplace-srv`
- Template sharing platform
- Node library marketplace
- User-contributed content
- Rating and review system

### Architecture Principles for All Features

All future features MUST follow these principles established in feature 001:

1. **Modular Package Structure**:
   - Frontend: `@universo/{feature}-frt` with Quasar components
   - Backend: `@universo/{feature}-srv` with NestJS services
   - Each package in `packages/{feature}-{frt|srv}/base/`

2. **Shared Infrastructure Usage**:
   - Use `@universo/types` for shared TypeScript types
   - Use `@universo/utils` for common utilities
   - Use `@universo/i18n` for internationalization
   - Use `@universo/api-client` for API communication

3. **Quality Standards**:
   - Bilingual documentation (EN/RU)
   - TypeScript strict mode
   - Comprehensive tests (unit + integration)
   - ESLint and Prettier compliance
   - Git hooks validation

4. **React Reference with Caution**:
   - Monitor https://github.com/teknokomo/universo-platformo-react for proven features
   - **AVOID** porting Flowise legacy code (monolithic structure)
   - Adapt patterns to Quasar/NestJS best practices
   - Create optimal modular structure from the start

### Development Workflow for Each Feature

1. Create GitHub Issue for the feature
2. Create feature specification (`.specify/specs/{###-feature-name}/`)
   - `spec.md` - User stories and requirements
   - `plan.md` - Technical approach
   - `research.md` - Technology decisions
   - `data-model.md` - Entities and relationships
   - `contracts/` - API contracts
   - `tasks.md` - Implementation tasks
3. Implement following the tasks
4. Create separate frontend and backend packages
5. Write comprehensive tests
6. Document in bilingual README files
7. Integration with existing features
8. Code review and quality checks
9. Merge and deploy

### Estimated Timeline

- Feature 002 (Auth): 2-3 weeks
- Feature 003 (Clusters): 2-3 weeks
- Feature 004 (Uniks): 2-3 weeks
- Feature 005 (Metaverses): 2 weeks (pattern reuse)
- Feature 006 (Spaces): 3-4 weeks
- Feature 007 (Node System): 4-5 weeks
- Feature 008 (LangChain Nodes): 4-6 weeks
- Feature 009 (UPDL Nodes): 3-4 weeks
- Feature 010 (Additional Nodes): Ongoing
- Feature 011 (Publishing): 3-4 weeks
- Feature 012 (Marketplace): 4-5 weeks

**Total Estimated Development**: ~6-9 months for core features (002-009)

### Next Steps After Feature 001

1. Complete all 144 tasks in this file (feature 001)
2. Validate repository setup is fully functional
3. Create GitHub Issue for Feature 002 (Authentication)
4. Begin specification process for Authentication feature
5. Implement authentication following the modular patterns
6. Continue sequentially through features 003-012
