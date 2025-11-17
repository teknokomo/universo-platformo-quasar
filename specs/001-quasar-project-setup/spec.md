# Feature Specification: Universo Platformo Quasar Project Setup

**Feature Branch**: `001-quasar-project-setup`  
**Created**: 2025-11-16  
**Status**: Draft  
**Input**: User description: "Initialize Universo Platformo Quasar project with monorepo structure, PNPM workspace, and base packages following the React implementation as reference"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Repository Initialization and Documentation (Priority: P1)

A developer clones the Universo Platformo Quasar repository and finds comprehensive bilingual documentation explaining the project's purpose, structure, and how it relates to the React implementation. The repository includes proper configuration files, licensing information, clear instructions for getting started, and follows established architectural patterns from the React implementation.

**Why this priority**: Without proper repository setup and documentation, no development work can proceed. This is the foundation that all other work depends on, and must include all infrastructure patterns discovered in the React repository.

**Independent Test**: Clone the repository, read the README files in both English and Russian, verify all configuration files exist and contain valid settings, check that Turborepo and PNPM workspace catalog are properly configured.

**Acceptance Scenarios**:

1. **Given** an empty repository, **When** the setup is complete, **Then** README.md and README-RU.md exist with identical structure and bilingual content
2. **Given** the repository is cloned, **When** a developer opens it, **Then** they can understand the project's purpose, architecture, relationship to Universo Platformo React (including that React version has Flowise legacy code), and the shared infrastructure package architecture
3. **Given** the repository documentation, **When** a developer reads the license information, **Then** they understand the Omsk Open License application and individual package licensing
4. **Given** configuration files exist, **When** validated, **Then** they include proper TypeScript (strict mode), ESLint, Prettier, gitignore, Turborepo, PNPM catalog, .npmrc, and Husky settings
5. **Given** Docker support files, **When** examined, **Then** they include Dockerfile, docker-compose.yml, and .env.example in docker/ directory
6. **Given** security documentation, **When** accessed, **Then** SECURITY.md exists with vulnerability reporting procedures
7. **Given** tools directory, **When** reviewed, **Then** it includes documentation validation and testing utility scripts

---

### User Story 2 - Monorepo Infrastructure with PNPM (Priority: P2)

A developer needs to set up the development environment with PNPM workspaces and workspace catalog, enabling them to manage multiple packages efficiently with centralized dependency version management. The monorepo structure allows independent package development while sharing common dependencies and maintaining version consistency through the catalog pattern.

**Why this priority**: The monorepo structure with workspace catalog is essential for the multi-package architecture that mirrors the React implementation. Without it, package management and dependency version consistency becomes unmanageable.

**Independent Test**: Run `pnpm install` and verify all workspaces are recognized, dependencies are installed correctly using catalog versions, workspace structure allows cross-package references, and Turborepo can orchestrate builds.

**Acceptance Scenarios**:

1. **Given** PNPM is installed, **When** `pnpm install` is executed, **Then** all workspace packages are recognized and dependencies are installed using catalog versions
2. **Given** the workspace configuration, **When** packages reference each other, **Then** TypeScript can resolve the references correctly
3. **Given** multiple packages exist, **When** building, **Then** Turborepo handles dependencies in the correct order with appropriate caching
4. **Given** the pnpm-workspace.yaml file, **When** examined, **Then** it defines the packages directory structure following the patterns from React implementation and includes a catalog section for centralized dependency management
5. **Given** .npmrc configuration, **When** validated, **Then** it includes proper workspace settings (auto-install-peers, prefer-workspace-packages, link-workspace-packages deep, hoist configuration)
6. **Given** turbo.json configuration, **When** reviewed, **Then** it defines pipelines for build, test, dev, and clean tasks with appropriate caching and dependency settings

---

### User Story 3 - Base Package Structure and Shared Infrastructure (Priority: P3)

A developer creates the foundational package structure following the established naming convention with separate frontend (-frt) and backend (-srv) packages, each containing a base/ directory for core implementations. Additionally, shared infrastructure packages (@universo/types, @universo/utils, @universo/i18n, @universo/api-client) are established to promote code reuse across functional packages, following the architectural patterns discovered in the React implementation.

**Why this priority**: Establishes the package structure pattern and shared infrastructure that all future packages will follow, ensuring consistency with the React implementation's architecture and promoting code reuse.

**Independent Test**: Create shared infrastructure packages and a sample package pair (e.g., clusters-frt and clusters-srv), verify they have base/ directories, can import from shared packages, can be built independently using Turborepo, and follow the established structure.

**Acceptance Scenarios**:

1. **Given** the packages directory, **When** a new functional area is added, **Then** it consists of separate -frt and -srv packages with base/ directories
2. **Given** each package, **When** inspected, **Then** it contains a base/ directory for core implementation and follows the package README template
3. **Given** package naming conventions, **When** applied, **Then** frontend packages end with -frt and backend packages end with -srv
4. **Given** the package structure, **When** compared to React implementation, **Then** it follows the same organizational patterns while using Quasar/NestJS instead of React/Express
5. **Given** shared infrastructure packages, **When** created, **Then** @universo/types, @universo/utils, @universo/i18n, and @universo/api-client exist with proper dual-build configuration
6. **Given** a functional package, **When** it needs shared functionality, **Then** it can import from shared infrastructure packages using workspace references
7. **Given** package TypeScript configuration, **When** examined, **Then** strict mode is enabled in all tsconfig.json files
8. **Given** Vitest configuration, **When** tests are run, **Then** testing infrastructure works consistently across all packages

---

### User Story 4 - GitHub Issues Infrastructure (Priority: P4)

A project maintainer needs to organize tasks using GitHub Issues with appropriate labels following the repository's label conventions. Issues must be created in bilingual format (English with Russian translation).

**Why this priority**: Enables proper task tracking and project management from the start, ensuring all work is documented and organized according to established conventions.

**Independent Test**: Create test issues with appropriate labels, verify they follow the bilingual format, and check that labels match the repository's label conventions.

**Acceptance Scenarios**:

1. **Given** GitHub Issues, **When** creating a new issue, **Then** it includes both English content and Russian translation in a spoiler with `<summary>In Russian</summary>`
2. **Given** the repository labels, **When** fetched via API, **Then** they include standard labels (bug, enhancement, documentation, feature) and project-specific labels
3. **Given** an issue about repository setup, **When** labels are applied, **Then** they include relevant type and area labels (e.g., repository, documentation)
4. **Given** issue templates, **When** used, **Then** they guide users to create properly formatted bilingual issues

---

### User Story 5 - Development Environment and Code Quality (Priority: P5)

A developer sets up their local development environment with necessary tools and dependencies to start contributing to the project. The environment supports both Quasar frontend development and NestJS backend development, with automated code quality checks via Husky git hooks and comprehensive testing infrastructure via Vitest.

**Why this priority**: While important for development, this can be done after the repository structure and shared infrastructure is established. Developers need the basic infrastructure first, then can set up their local environment with code quality tools.

**Independent Test**: Follow installation instructions, install Node.js, PNPM, run basic commands to verify the environment works correctly, trigger pre-commit hooks, run tests with Vitest.

**Acceptance Scenarios**:

1. **Given** Node.js version requirements, **When** checked, **Then** the project specifies compatible versions (>=18.15.0 <19.0.0 || ^20) in package.json engines
2. **Given** PNPM requirements, **When** verified, **Then** the project requires PNPM >=9 in package.json engines
3. **Given** development dependencies, **When** installed, **Then** TypeScript, ESLint, Prettier, Husky, and Vitest are configured and working
4. **Given** environment configuration, **When** needed, **Then** documentation explains how to set up Supabase, TypeORM, and other required services
5. **Given** Husky git hooks, **When** attempting to commit, **Then** pre-commit hook runs lint-staged to check code quality
6. **Given** code quality tools, **When** lint-staged runs, **Then** ESLint checks staged files and blocks commit if linting fails
7. **Given** testing infrastructure, **When** `pnpm test` is executed, **Then** Vitest runs tests across all packages with proper configuration
8. **Given** Docker support, **When** `docker-compose up` is executed in docker/ directory, **Then** development environment starts with all required services

---

### Edge Cases

- What happens when a developer tries to use npm or yarn instead of PNPM? (Should show clear error message directing them to use PNPM via package.json engines field)
- How does the system handle when README.md is updated but README-RU.md is not? (Development guidelines should require both to be updated together; tools/docs validation script can check this)
- What happens if package naming conventions are not followed? (Linting and documentation should catch this during code review)
- How does the system handle dependencies that conflict between Quasar and NestJS? (PNPM workspace configuration should isolate dependencies appropriately; workspace catalog ensures version consistency)
- What happens if someone tries to add actual @mui/material package? (Documentation should clarify Quasar's Material Design components are used instead)
- How is React repository monitoring coordinated? (Should establish regular review schedule and decision criteria for porting features)
- What if Flowise-related code is accidentally ported from React? (Code review should catch and reject such changes)
- How to handle dependency version conflicts across multiple packages? (PNPM workspace catalog provides single source of truth for dependency versions)
- What if a package needs a different version of a shared dependency? (Document exceptions in pnpm.overrides if absolutely necessary, but prefer catalog consistency)
- How to ensure all packages use the same build tooling? (Turborepo pipeline ensures consistent build process; package templates standardize configuration)
- What happens if Husky pre-commit hooks fail? (Commit is blocked until issues are resolved; developers can bypass with --no-verify in emergencies but should be rare)
- How to handle packages that need both CJS and ESM outputs? (Bundler configuration should support dual-build; library packages require this for maximum compatibility)
- What if a developer forgets to update package README? (Package README template and review process should catch incomplete documentation)
- How to manage TypeScript path aliases across packages? (Each package maintains its own tsconfig.json with appropriate extends; shared base tsconfig can be created)
- What happens when Turborepo cache becomes stale? (Cache can be cleared with clean commands; cache: false can be set for specific tasks in turbo.json)
- How to handle secrets in Docker containers? (Use .env files not committed to repository; docker/.env.example provides template)
- What if Vitest tests fail in CI but pass locally? (Environment differences should be documented; CI should use same Node.js version as local development)
- How to handle workspace package circular dependencies? (Architecture should avoid these; TypeORM entities can be shared via separate package if needed)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Repository MUST include README.md and README-RU.md with identical structure and content (one in English, one in Russian)
- **FR-002**: Repository MUST use PNPM workspace configuration for monorepo management
- **FR-003**: Repository MUST define package structure in packages/ directory following React implementation patterns
- **FR-004**: Packages MUST be organized with -frt suffix for frontend and -srv suffix for backend functionality
- **FR-005**: Each package MUST contain a base/ directory for core implementations to support future alternative implementations
- **FR-006**: Repository MUST include proper TypeScript configuration for both Quasar and NestJS development with strict mode enabled
- **FR-007**: Repository MUST include ESLint and Prettier configuration for code quality and consistency
- **FR-008**: Repository MUST include comprehensive .gitignore for Node.js, TypeScript, and IDE files
- **FR-009**: Documentation MUST reference Universo Platformo React as the conceptual basis while noting this is a Quasar/NestJS implementation and that React version contains Flowise legacy code not to be ported
- **FR-010**: Repository MUST include license information stating Omsk Open License (with detailed terms to be established) and notes about individual package licenses
- **FR-011**: Repository MUST include proper package.json with workspace configuration and engine requirements (Node.js >=18.15.0 <19.0.0 || ^20, PNPM >=9)
- **FR-012**: Documentation MUST explain the relationship to other Universo Platformo implementations (React, Godot, PlayCanvas)
- **FR-013**: Repository MUST follow GitHub Issues guidelines with bilingual format using exact spoiler tag `<summary>In Russian</summary>`
- **FR-014**: Repository MUST create initial label set per github-labels.md as part of setup, then use only existing repository labels for future issues
- **FR-015**: Repository MUST follow GitHub PR guidelines with bilingual descriptions and proper labeling
- **FR-016**: Repository MUST follow i18n documentation guidelines ensuring English and Russian versions have identical structure, with English documentation created first as primary source, then Russian as exact translation
- **FR-017**: Repository MUST use Quasar Framework for frontend, NestJS for backend, TypeScript for all code, and PNPM for package management as the mandatory technology stack
- **FR-018**: Repository MUST use Supabase as primary database with TypeORM integration for PostgreSQL, with architecture designed to support future expansion to other DBMS
- **FR-019**: Repository MUST use Passport.js with Supabase connector strategy for authentication implementation
- **FR-020**: Repository MUST follow Quasar and NestJS framework best practices, avoiding direct porting of implementation patterns from React/Express version that don't align with these frameworks' conventions
- **FR-021**: Repository MUST exclude docs/ directory from project structure (documentation will be maintained in separate repository)
- **FR-022**: Repository MUST NOT include pre-created AI agent configuration files in .github/agents or similar locations (users create these as needed for their workflow)
- **FR-023**: Repository development MUST follow phased approach: (Phase 1) Repository setup and documentation, (Phase 2) Base package structure creation, (Phase 3) First functional feature implementation (Clusters pattern), (Phase 4) Pattern replication to other features
- **FR-024**: Repository MUST establish React repository monitoring process with defined frequency (bi-weekly review of React implementation commits) and explicit criteria for feature porting decisions (feature stability, alignment with Quasar/NestJS patterns, absence of Flowise legacy code)
- **FR-025**: GitHub workflow MUST require Issue creation before starting specification work for any new feature or significant change
- **FR-026**: Repository MUST document environment setup requirements including Supabase connection configuration, authentication setup, and local development environment preparation
- **FR-027**: Repository MUST implement PNPM workspace catalog for centralized dependency version management across all packages
- **FR-028**: Repository MUST use Turborepo for efficient monorepo build orchestration with appropriate caching strategies
- **FR-029**: Repository MUST include shared infrastructure packages (types, utils, i18n, api-client) following the naming pattern @universo/* for code reuse across functional packages
- **FR-030**: Repository MUST establish package README template for consistent documentation across all packages, including sections for Overview, Key Features, Installation, Usage, Architecture, File Structure, Development, Testing, and License
- **FR-031**: Repository MUST include .npmrc configuration with workspace settings (auto-install-peers, prefer-workspace-packages, link-workspace-packages deep, hoist configuration)
- **FR-032**: Repository MUST implement Git hooks using Husky for pre-commit code quality checks (linting, formatting via lint-staged)
- **FR-033**: Repository MUST provide Docker containerization support with Dockerfile and docker-compose.yml for deployment scenarios
- **FR-034**: Repository MUST use Vitest as testing framework for unit and integration tests across all packages
- **FR-035**: Repository MUST implement dual-build system for library packages (CommonJS + ES Modules + TypeScript declarations) using appropriate bundler for Quasar/NestJS ecosystem
- **FR-036**: Repository MUST include tools/ directory for utility scripts (documentation validation, testing utilities) that support development workflows
- **FR-037**: Repository MUST implement SECURITY.md file documenting security reporting procedures and policies
- **FR-038**: Repository structure MUST support workspace packages pattern where shared backend services can be imported as packages (e.g., @universo/package-srv) by main server
- **FR-039**: Root tsconfig.json MUST include experimentalDecorators and emitDecoratorMetadata compiler options for NestJS compatibility (decorators are core to NestJS dependency injection)
- **FR-040**: Root tsconfig.json MUST include path aliases for @testing/* utilities to enable clean imports in test files across all packages
- **FR-041**: Package template MUST include sideEffects field in package.json (false for pure libraries without initialization code, true for packages with side effects like i18n initialization)
- **FR-042**: Package template MUST include files field in package.json to limit published content (typically ["dist", "src"]) for smaller package sizes
- **FR-043**: tools/docs directory MUST include check-i18n-docs.mjs utility script for validating English/Russian documentation parity (line count, structure matching)
- **FR-044**: Prettier configuration MUST be defined in root package.json with settings: printWidth 140, singleQuote true, trailingComma none, tabWidth 4, semi false, endOfLine auto
- **FR-045**: Root package.json MUST include pnpm.overrides section for security patches and version consistency (format: "package-name": "version")
- **FR-046**: Repository MUST include TEMPLATE-README-GUIDE.md documenting how to use the package README template, with guidance on required sections, bilingual requirements, and code examples
- **FR-047**: Package template MUST support multiple export entry points pattern (main export + specialized exports like /i18n for lazy-loading translations)
- **FR-048**: ESLint configuration MUST include unused-imports plugin to automatically detect and report unused import statements
- **FR-049**: Build tooling for library packages MUST be documented with selected tool (tsdown recommended based on React patterns) and rationale for dual-build output

### Key Entities

- **Repository Configuration**: Represents the foundational setup including package.json, pnpm-workspace.yaml, tsconfig.json, turbo.json, .npmrc, and other configuration files
- **Package**: Represents a functional module with either -frt (frontend using Quasar) or -srv (backend using NestJS) suffix, containing a base/ directory for core implementation
- **Workspace Catalog**: PNPM catalog feature for centralized dependency version management across all packages, defined in pnpm-workspace.yaml
- **Shared Infrastructure Package**: Core packages (@universo/types, @universo/utils, @universo/i18n, @universo/api-client) that provide reusable functionality across functional packages
- **Documentation**: Represents bilingual README files and other documentation following i18n guidelines with exact structural parity
- **Issue Label**: Represents categorization tags used in GitHub Issues following the repository's labeling system (initial set created during setup)
- **License Information**: Represents Omsk Open License application and individual package license documentation
- **React Repository Reference**: Represents the conceptual basis and monitoring source for feature evaluation (excluding Flowise legacy code)
- **Build Tool Configuration**: Turborepo and bundler configurations for efficient monorepo build orchestration
- **Git Hook**: Husky-managed pre-commit hooks for code quality enforcement
- **Docker Configuration**: Dockerfile and docker-compose.yml for containerized deployment
- **Package Template**: Standardized README template and directory structure for consistent package documentation

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Developers can clone the repository and understand its purpose within 5 minutes of reading the README
- **SC-002**: Running `pnpm install` successfully installs all dependencies without errors
- **SC-003**: Both README.md and README-RU.md have exactly the same number of lines and section structure
- **SC-004**: All configuration files are valid and can be successfully used by development tools without errors
- **SC-005**: The repository structure clearly mirrors the React implementation's organization with appropriate technology substitutions (Quasar Material Design components, NestJS backend)
- **SC-006**: Documentation references are accurate and all mentioned files exist in the repository
- **SC-007**: License information clearly states Omsk Open License application with note about establishing detailed terms
- **SC-008**: Package structure supports future addition of new packages following the established patterns
- **SC-009**: All GitHub Issues created follow the bilingual format with exact spoiler tag formatting
- **SC-010**: Repository labels are properly configured and used according to the labeling guidelines (initial set created during setup)
- **SC-011**: Documentation clearly explains React repository monitoring process (bi-weekly reviews) and selective feature porting strategy with 4 explicit criteria
- **SC-012**: Repository documentation explicitly states technology stack requirements (Quasar, NestJS, TypeScript, PNPM) in requirements or setup guide
- **SC-013**: Documentation includes environment setup instructions covering Supabase configuration and Passport.js authentication setup
- **SC-014**: Repository structure explicitly excludes docs/ directory with explanation about separate documentation repository
- **SC-015**: No AI agent configuration files exist in repository at setup; documentation notes these are user-created
- **SC-016**: Development phases (repository setup → base structure → Clusters → replication) are clearly documented in specification or project documentation
- **SC-017**: Package structure documentation explains both dual-package scenario (-frt + -srv) and single-package scenario (one suffix only)
- **SC-018**: PNPM workspace catalog is properly configured in pnpm-workspace.yaml with centralized dependency versions
- **SC-019**: Turborepo configuration (turbo.json) exists with appropriate pipeline definitions for build, test, dev, and clean tasks
- **SC-020**: Shared infrastructure packages (@universo/types, @universo/utils, @universo/i18n, @universo/api-client) are defined in package structure
- **SC-021**: Package README template is documented and follows standardized structure (Overview, Features, Installation, Usage, Architecture, Development, Testing, License)
- **SC-022**: .npmrc configuration exists with proper workspace settings (auto-install-peers, prefer-workspace-packages, link-workspace-packages deep)
- **SC-023**: Husky is configured with pre-commit hooks for linting and formatting (lint-staged integration)
- **SC-024**: Docker support files (Dockerfile, docker-compose.yml, .env.example) exist in docker/ directory
- **SC-025**: Vitest configuration exists for testing infrastructure across packages
- **SC-026**: tools/ directory exists with utility scripts for documentation validation and testing
- **SC-027**: SECURITY.md file exists documenting security reporting procedures
- **SC-028**: Build configuration supports dual-output (CommonJS + ES Modules + TypeScript declarations) for library packages
- **SC-029**: Workspace packages pattern is documented showing how backend services can be imported as packages
- **SC-030**: TypeScript strict mode is enabled in all package tsconfig.json files
- **SC-031**: Root tsconfig.json includes experimentalDecorators and emitDecoratorMetadata for NestJS compatibility
- **SC-032**: TypeScript path aliases are configured for @testing/* utilities in root tsconfig.json
- **SC-033**: Package template includes sideEffects and files fields in package.json
- **SC-034**: tools/docs/check-i18n-docs.mjs exists and validates English/Russian documentation parity
- **SC-035**: Prettier configuration is defined in root package.json with specified settings
- **SC-036**: TEMPLATE-README-GUIDE.md exists with comprehensive guidance on using package template
- **SC-037**: Package template demonstrates multiple export entry points pattern
- **SC-038**: ESLint configuration includes unused-imports plugin
- **SC-039**: Build tooling for library packages is documented with tool selection and rationale
- **SC-040**: pnpm.overrides section exists in root package.json for dependency management

## Development Workflow & Sequencing *(optional)*

### Shared Infrastructure Architecture

The repository follows a layered architecture with shared infrastructure packages that promote code reuse and maintain consistency across functional packages:

**Core Shared Packages** (to be created in Phase 2):

1. **@universo/types** - Shared TypeScript type definitions
   - UPDL interfaces and types
   - Platform-wide type definitions
   - API request/response types
   - Pure type-only package with no runtime dependencies
   - Dual build: CJS + ESM + TypeScript declarations

2. **@universo/utils** - Shared utility functions
   - Processing utilities for data transformation
   - Common helper functions used across packages
   - Template-agnostic utility implementations
   - Dual build: CJS + ESM + TypeScript declarations

3. **@universo/i18n** - Centralized internationalization
   - Single i18next configuration instance
   - Translation file management (English + Russian)
   - Language detection and switching
   - Namespace support for modular translations
   - Shared across all frontend packages

4. **@universo/api-client** - Type-safe API clients
   - Axios-based HTTP communication layer
   - Type-safe client implementations for backend services
   - Request/response type definitions
   - Error handling and retry logic
   - Dual build: CJS + ESM + TypeScript declarations

**Shared Component Packages** (to be created after base packages):

5. **@universo/auth-frt** - Authentication UI primitives
   - Login/logout components
   - Session management hooks
   - Auth guard components
   - Integration with Supabase auth

6. **@universo/auth-srv** - Authentication backend
   - Passport.js strategies
   - Supabase session management
   - Express middleware for authentication
   - Session validation routes

**Template Pattern**: Each shared package follows consistent structure:
```
packages/{package-name}/
├── base/                   # Default implementation
│   ├── src/               # Source code
│   │   ├── index.ts       # Public API entry point
│   │   └── ...            # Package-specific directories
│   ├── dist/              # Compiled output (CJS, ESM, types)
│   ├── package.json       # Package configuration
│   ├── tsconfig.json      # TypeScript configuration
│   ├── README.md          # English documentation
│   └── README-RU.md       # Russian documentation
└── package.json           # Workspace package configuration
```

### Phased Development Approach

The project follows a structured, sequential development approach to ensure solid foundation before adding complexity:

**Phase 1: Repository Foundation** (Priority: P1)
- Initialize repository with proper configuration files
- Create bilingual README documentation
- Set up PNPM workspace structure with catalog
- Configure TypeScript, ESLint, Prettier
- Establish GitHub Issues labels and templates
- Document license information (Omsk Open License)
- Configure Turborepo for build orchestration
- Set up Husky git hooks for code quality
- Create Docker containerization support
- Establish tools/ directory with utility scripts
- Create SECURITY.md file

**Phase 2: Base Package Structure** (Priority: P2-P3)
- Create packages/ directory structure
- Define package naming conventions (-frt/-srv suffixes)
- Implement base/ directory pattern in each package
- Create shared infrastructure packages:
  - @universo/types (type definitions)
  - @universo/utils (utility functions)
  - @universo/i18n (internationalization)
  - @universo/api-client (API communication)
- Set up cross-package TypeScript references
- Establish package dependency patterns
- Create package README template
- Configure Vitest for testing infrastructure

**Phase 3: First Functional Feature - Clusters Pattern** (Future Specification)
- Implement three-entity hierarchy: Clusters → Domains → Resources
- Create separate packages: clusters-frt (Quasar) and clusters-srv (NestJS)
- Establish CRUD operations pattern
- Set up Supabase integration pattern with TypeORM
- Implement Passport.js authentication flow
- Create authentication packages: @universo/auth-frt and @universo/auth-srv
- This pattern becomes the template for replication

**Phase 4: Pattern Replication to Other Features** (Future Specifications)
- Metaverses feature: Metaverses → Sections → Entities (similar structure)
- Uniques feature: Multiple entity levels (extended pattern)
- Additional features: Spaces/Canvases with node graph system
- Each feature follows established patterns with feature-specific additions

### React Repository Monitoring Process

**Monitoring Frequency**: Bi-weekly review of React implementation commits

**Review Criteria**: For each new feature or change in React version, evaluate:
1. **Stability**: Has the feature been tested and stable in React version for at least 2 weeks?
2. **Pattern Alignment**: Can it be implemented following Quasar/NestJS best practices?
3. **Code Quality**: Is it free of Flowise legacy code and well-implemented?
4. **Value Proposition**: Does it provide clear value for Quasar implementation users?

**Key Architectural Patterns to Monitor**:
- Shared infrastructure packages architecture (@universo/* pattern)
- Workspace packages pattern for backend services
- Build tooling evolution (migration from legacy build systems to modern bundlers)
- Testing infrastructure and patterns (Vitest integration)
- Docker and containerization patterns
- Git workflow and automation (Husky hooks, lint-staged)
- Documentation templates and i18n patterns
- TypeORM entity and migration patterns
- PNPM workspace catalog usage for dependency management
- Turborepo pipeline configurations

**Decision Process**:
- Feature meets all 4 criteria → Create specification for Quasar adaptation
- Feature fails any criterion → Document decision to skip with rationale
- Unclear cases → Discuss with maintainers before deciding

**Exclusions** (Never Port):
- Flowise AI legacy code or patterns
- docs/ directory content (separate documentation repository)
- AI agent configurations (user-created)
- React/Express specific implementation patterns that conflict with Quasar/NestJS conventions
- UI framework-specific code (React components, MUI-specific patterns)

### Issue-First Development Workflow

**Before any specification work**:
1. Create GitHub Issue following `.github/instructions/github-issues.md`
2. Include bilingual description (English + Russian in spoiler)
3. Apply appropriate labels per `.github/instructions/github-labels.md`
4. Reference related issues if applicable

**During feature development**:
1. Create feature branch with issue number prefix
2. Write specification following `.specify/templates/spec-template.md`
3. Implement following planned tasks
4. Maintain bilingual documentation (English first, then Russian)
5. Create PR per `.github/instructions/github-pr.md` with `Fixes #N` reference

This workflow ensures traceability and proper documentation for all changes.

### Build System and Tooling

**Monorepo Build Orchestration** (Turborepo):
- Configured in `turbo.json` at repository root
- Pipeline definitions for: build, test, dev, clean
- Caching strategies for efficient incremental builds
- Dependency-aware parallel execution
- No cache for dev tasks to ensure live reloading

**Package Build Configuration**:
- Library packages: Dual-build (CommonJS + ES Modules + TypeScript declarations)
- Frontend applications: Quasar/Vite build system
- Backend applications: NestJS build system
- Consistent TypeScript configuration with strict mode

**Bundler Selection Guidelines**:
- **Library packages**: Modern bundler supporting dual-build (evaluate options like tsup, rollup, or esbuild)
- **Quasar frontend**: Use Quasar CLI with Vite for optimal HMR
- **NestJS backend**: Use standard NestJS CLI build system
- **Avoid**: Direct porting of React's tsdown configuration; select tools appropriate for Quasar/NestJS ecosystem

**Testing Infrastructure** (Vitest):
- Configured in `vitest.config.ts` per package
- Unit and integration test support
- Coverage reporting with @vitest/coverage-v8
- Happy DOM for browser environment simulation
- Consistent test patterns across all packages

**Code Quality Tools**:
- **ESLint**: Code linting with Quasar/NestJS-appropriate rules
- **Prettier**: Code formatting with project-wide configuration
- **Husky**: Git hooks for pre-commit validation
- **lint-staged**: Runs linters only on staged files
- Pre-commit hook workflow:
  1. Stage files for commit
  2. Husky triggers pre-commit hook
  3. lint-staged runs ESLint on staged files
  4. If linting passes, commit proceeds
  5. If linting fails, commit is blocked

**PNPM Configuration** (.npmrc):
```
auto-install-peers = true          # Automatically install peer dependencies
strict-peer-dependencies = false   # Don't fail on peer dependency conflicts
prefer-workspace-packages = true   # Prefer local workspace packages over registry
link-workspace-packages = deep     # Link nested workspace dependencies
hoist = true                       # Hoist dependencies to root node_modules
shamefully-hoist = true            # Hoist all dependencies (compatibility)
```

**Workspace Catalog Pattern**:
- Defined in `pnpm-workspace.yaml` under `catalog:` section
- Single source of truth for dependency versions
- Format: `package-name: version-spec`
- Usage in package.json: `"dependency": "catalog:"`
- Benefits: Version consistency, easier updates, reduced conflicts

**Docker Support**:
- `docker/Dockerfile` for production container image
- `docker/docker-compose.yml` for multi-service orchestration
- `docker/.env.example` for environment variable template
- Support for worker processes if needed (following React pattern)
- Optimized multi-stage builds

**Development Tools** (tools/ directory):
- `tools/docs/` - Documentation validation scripts
  - Check i18n documentation consistency (EN/RU line count matching)
  - Validate markdown structure
  - Check broken links
- `tools/testing/` - Testing utilities
  - Test setup helpers
  - Mock data generators
  - Integration test utilities

**Security Configuration**:
- `SECURITY.md` - Security policy and vulnerability reporting
- `.env.example` files for environment configuration templates
- No secrets in repository (enforced by .gitignore and code review)
- Security scanning in CI/CD pipeline

## Assumptions

- Developers have basic familiarity with monorepo concepts and PNPM workspaces
- The Quasar framework and NestJS are chosen as the technology stack (no alternatives being considered)
- Supabase will be used for database functionality with architecture designed for future DBMS expansion (TypeORM entities for PostgreSQL)
- The project will use TypeScript exclusively for both frontend and backend with strict mode enabled in packages (root tsconfig can be permissive for tooling compatibility)
- Quasar's built-in Material Design components will be used for UI consistency (not a separate @mui/material package like React's MUI)
- The project structure follows the React implementation conceptually but not at the code level - implementation patterns must follow Quasar/NestJS best practices
- The React implementation (github.com/teknokomo/universo-platformo-react) contains Flowise legacy code that will NOT be ported
- React repository will be monitored bi-weekly for new proven features worth adapting to Quasar/NestJS stack
- Feature porting from React requires: (a) feature stability in React version, (b) alignment with Quasar/NestJS patterns, (c) absence of Flowise legacy code, (d) clear value for Quasar implementation
- GitHub Issues and Pull Requests will be the primary tools for task management, with Issue creation required before specification work
- tsdown (or documented alternative like tsup, rollup, esbuild) will be used for library package dual-build (CJS + ESM + DTS)
- Root tsconfig.json includes NestJS-required compiler options (experimentalDecorators, emitDecoratorMetadata) while packages maintain strict mode
- Prettier configuration in root package.json ensures consistent code formatting across entire monorepo
- PNPM overrides mechanism will be used for security patches and dependency version consistency
- Package optimization fields (sideEffects, files) will be included for better tree-shaking and smaller published packages
- Multiple export entry points pattern (e.g., /i18n) enables lazy-loading and modular imports
- ESLint with unused-imports plugin enforces clean imports across all TypeScript code
- check-i18n-docs.mjs utility automates validation of bilingual documentation parity
- Documentation will be maintained in both English and Russian languages only (not additional languages initially), with English created first as primary source
- The Omsk Open License applies to new code (detailed license terms to be established), while dependencies and packages may have their own licenses that must be documented
- Initial repository setup includes creating base label set per github-labels.md; afterwards only existing labels are used
- The docs/ directory is deliberately excluded from this repository (will be maintained in separate documentation repository in future)
- AI agent configuration files are not pre-created; users create them as needed for their specific workflow
- Development follows phased approach: repository setup → base structure → first feature (Clusters pattern with 3-entity hierarchy) → pattern replication
- Clusters functionality will establish the base three-entity pattern (Clusters/Domains/Resources) that will be replicated for other features (Metaverses/Sections/Entities, etc.)
- Package structure supports scenarios where: (a) functionality needs both frontend and backend (use -frt and -srv packages), (b) functionality needs only one side (use single package with appropriate suffix)
- Code review and approval process will be established during initial repository setup but specifics are deferred to governance documentation
- Future features like Spaces/Canvases, LangChain graph nodes, and UPDL-nodes are acknowledged but specifications are deferred to separate feature specs
- Build tooling will use modern bundlers appropriate for Quasar/NestJS (not necessarily tsdown; evaluate Vite for Quasar, standard NestJS tooling for backend)
- Shared infrastructure packages (types, utils, i18n, api-client) will be created to promote code reuse across functional packages
- Testing infrastructure will use Vitest for unit/integration tests, following patterns suitable for Quasar and NestJS
- Docker containerization support will be included for deployment scenarios
- Git hooks (Husky) will enforce code quality checks (linting, formatting) pre-commit
- Package README template will be established for consistent documentation across all packages
- PNPM workspace catalog feature will be used for centralized dependency version management
- Turborepo will be used for efficient monorepo build orchestration with caching strategies
