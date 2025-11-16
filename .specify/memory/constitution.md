<!--
Sync Impact Report (2025-11-16 - Update 1)
================================
Version: 1.0.0 → 1.1.0 (MINOR - Clarifications and expansions)

Modified Principles:
- Principle VII (Clean Implementation Standards): Added explicit bi-weekly monitoring frequency and 4-point evaluation criteria for React feature porting

Added Sections:
- Development Workflow > Project Development Sequence: Added 4-phase sequential development approach
- Development Workflow > React Repository Monitoring: Added detailed monitoring process with frequency and criteria

Enhanced Sections:
- Development Workflow > Feature Development Process: Added "BEFORE starting any specification work" emphasis for issue creation
- Development Workflow > Quality Gates: Added issue-first workflow requirement

Removed Sections:
- None

Templates Status:
✅ .specify/templates/plan-template.md - Reviewed, no updates needed
✅ .specify/templates/spec-template.md - Reviewed, no updates needed
✅ .specify/templates/tasks-template.md - Reviewed, no updates needed

Follow-up TODOs:
- None

Notes:
- Updated based on comprehensive gap analysis from project-alignment checklist review
- Specification 001-quasar-project-setup enhanced with 10 new functional requirements (FR-017 through FR-026)
- All changes are clarifications and expansions, no breaking changes to existing principles
- Maintains backward compatibility with previous version 1.0.0

Previous Sync Impact Report (2025-11-16 - Initial)
================================
Version: 0.0.0 → 1.0.0 (MAJOR - Initial ratification)

Modified Principles:
- All principles: Initial definition

Added Sections:
- Core Principles (7 principles)
- Technology Stack
- Development Workflow
- Governance

Removed Sections:
- None (initial version)

Notes:
- Initial constitution ratification for Universo Platformo Quasar project
- Based on requirements from GitHub issue for Quasar/NestJS implementation
- Aligned with existing .github/instructions guidelines
-->

# Universo Platformo Quasar Constitution

## Project Context

This project is the **Quasar/NestJS implementation** of Universo Platformo, part of a multi-technology ecosystem. Universo Platformo has multiple parallel implementations:
- **React/Express** (reference implementation at github.com/teknokomo/universo-platformo-react)
- **Quasar/NestJS** (this project)
- **Godot** (game engine implementation)
- **PlayCanvas** (web 3D implementation)

Each implementation shares the same architectural principles but uses different technology stacks. The React implementation serves as the conceptual reference, while this Quasar implementation focuses on production-grade TypeScript development with Quasar Framework and NestJS.

## Core Principles

### I. Monorepo Package Structure

All functionality MUST be organized in a monorepo using PNPM workspace management. Packages MUST be placed in `packages/` directory with clear separation:
- Frontend packages use `-frt` suffix (e.g., `packages/clusters-frt`)
- Backend packages use `-srv` suffix (e.g., `packages/clusters-srv`)
- Each package MUST contain a `base/` root directory to support multiple future implementations
- Packages MUST be self-contained with clear dependencies

**Rationale**: This structure enables modular development, allows for technology stack variations, and supports the future migration of packages to separate repositories while maintaining the base implementation pattern established in Universo Platformo React.

### II. TypeScript-First Development

All code MUST be written in TypeScript for both frontend and backend. No JavaScript exceptions permitted except for configuration files where absolutely necessary.
- Type safety MUST be enforced with strict TypeScript compiler options
- Type definitions MUST be explicit and comprehensive
- Shared types MUST be defined in dedicated packages to ensure consistency
- Any type assertions MUST be justified with comments

**Rationale**: TypeScript provides type safety, better IDE support, and improved maintainability across the Quasar frontend and NestJS backend, preventing runtime errors and enabling confident refactoring.

### III. Technology Stack Adherence

The project MUST use the following core technologies following their best practices:
- **Frontend**: Quasar Framework for UI components and application structure
- **Backend**: NestJS for API services and business logic
- **UI Library**: Quasar's built-in Material Design components for consistent design
- **Authentication**: Passport.js with Supabase connector
- **Database**: Supabase as primary (extensible to other DBMS in future)
- **Package Manager**: PNPM for workspace and dependency management

**Rationale**: These technologies were selected for their maturity, community support, and alignment with TypeScript development. Quasar provides comprehensive Material Design components out of the box, eliminating the need for separate UI libraries. They provide a solid foundation different from the React/Express stack while maintaining consistency with Universo Platformo architectural principles.

### IV. Bilingual Documentation (NON-NEGOTIABLE)

All documentation MUST be created in both English and Russian:
- English documentation is the PRIMARY and MUST be created first
- Russian documentation MUST be an exact translation with identical structure and line count
- Files MUST follow naming convention: `README.md` (English), `README-RU.md` (Russian)
- Both versions MUST be updated together - no version can be outdated
- Content verification MUST confirm identical structure and line count

**Rationale**: This project serves a bilingual user base. Maintaining exact structural parity ensures consistency and prevents information gaps between language versions, supporting effective collaboration across language boundaries.

### V. GitHub Integration Standards

All GitHub interactions MUST follow established guidelines:
- **Issues**: Created per `.github/instructions/github-issues.md` with English text and Russian translation in `<details><summary>In Russian</summary>` spoiler
- **Pull Requests**: Created per `.github/instructions/github-pr.md` with GH# prefix and bilingual description
- **Labels**: Applied per `.github/instructions/github-labels.md` using existing repository labels only
- Issue MUST be created before starting specification work
- PR MUST reference the closing issue with `Fixes #123` syntax

**Rationale**: Standardized GitHub workflows ensure traceability, enable automation, maintain bilingual accessibility, and create a clear audit trail for all development activities.

### VI. Incremental Feature Development

Features MUST be developed following the base entity pattern:
- Start with base structure: three-entity hierarchy (Parent/Child/Resource)
- Example: Clusters → Domains → Resources
- Replicate pattern for other features (Metaverses → Sections → Entities)
- Build foundational CRUD operations before adding specialized functionality
- Each feature MUST be independently testable before integration

**Rationale**: The three-entity hierarchy provides a proven, repeatable pattern from Universo Platformo React that accelerates development while maintaining consistency. Starting with base functionality enables early validation before investing in complex features.

### VII. Clean Implementation Standards

The project MUST avoid legacy patterns from Universo Platformo React:
- Do NOT create `docs/` directory (will be separate repository)
- Do NOT create AI agent configuration files (user creates as needed)
- Do NOT port unfinished or poorly implemented code from React version
- Do NOT port Flowise legacy code from React version (the React version contains partially rewritten Flowise code that should not be ported)
- Follow Quasar and NestJS best practices for the current stack
- Prioritize clean, maintainable code over feature parity with React version
- Monitor React repository bi-weekly to identify new features worth porting, evaluating each feature against 4 criteria: stability (2+ weeks in React), pattern alignment (fits Quasar/NestJS), code quality (no Flowise legacy), and value proposition (clear benefit for users)

**Rationale**: This is an opportunity to implement Universo Platformo concepts correctly using modern frameworks. The React version is based on Flowise AI and still contains legacy code being gradually rewritten. We learn from the React version's architecture and selectively port proven features, but implement with Quasar/NestJS best practices, avoiding technical debt from the beginning. The bi-weekly monitoring with explicit criteria ensures we capture valuable innovations while maintaining code quality.

## Technology Stack

### Required Technologies

- **Frontend Framework**: Quasar Framework (latest stable)
- **Backend Framework**: NestJS (latest stable)
- **Language**: TypeScript (strict mode enabled)
- **Package Manager**: PNPM (workspace configuration)
- **UI Components**: Quasar's built-in Material Design components
- **Authentication**: Passport.js with Supabase strategy
- **Primary Database**: Supabase (PostgreSQL-based)
- **Version Control**: Git with GitHub

### Architecture Patterns

- Frontend packages MUST use Quasar's modular architecture
- Backend packages MUST follow NestJS module-based structure
- Shared types MUST be in dedicated packages accessible to both frontend and backend
- API communication MUST use RESTful principles with clear contract definitions
- Database access MUST be abstracted to support future DBMS additions

## Development Workflow

### Project Development Sequence

The project MUST be developed in sequential phases to ensure solid foundation:

1. **Phase 1 - Repository Foundation**: Initialize repository with configuration, documentation, PNPM workspace, GitHub infrastructure
2. **Phase 2 - Base Package Structure**: Create packages/ directory with naming conventions and base/ pattern
3. **Phase 3 - Clusters Feature**: Implement first functional feature establishing three-entity pattern (Clusters → Domains → Resources)
4. **Phase 4 - Pattern Replication**: Extend proven patterns to other features (Metaverses, Uniques, Spaces/Canvases)

This sequence ensures each phase builds on previous successes, validating patterns before scaling.

### Feature Development Process

1. **Specification Phase**:
   - Create GitHub issue per `.github/instructions/github-issues.md` BEFORE starting any specification work
   - Apply appropriate labels per `.github/instructions/github-labels.md`
   - Write specification following `.specify/templates/spec-template.md`
   - Get specification approval before implementation

2. **Implementation Phase**:
   - Create feature branch with issue number prefix
   - Implement following `.specify/templates/tasks-template.md`
   - Ensure TypeScript strict mode compliance
   - Follow package structure conventions (base/ directory, -frt/-srv suffixes)

3. **Documentation Phase**:
   - Create English README.md first
   - Create Russian README-RU.md as exact translation
   - Verify identical structure and line count per `.github/instructions/i18n-docs.md`
   - Update relevant documentation in packages

4. **Review Phase**:
   - Create Pull Request per `.github/instructions/github-pr.md`
   - Include bilingual PR description
   - Reference closing issue with `Fixes #N` syntax
   - Apply appropriate labels
   - Address review feedback

### React Repository Monitoring

- **Frequency**: Bi-weekly review of React implementation commits
- **Evaluation Criteria**: 
  1. Stability: Feature tested in React for 2+ weeks
  2. Pattern Alignment: Can be implemented with Quasar/NestJS best practices
  3. Code Quality: Free of Flowise legacy code
  4. Value Proposition: Clear benefit for Quasar implementation users
- **Action**: Feature meeting all criteria gets new specification; others documented as skipped with rationale

### Quality Gates

- All TypeScript code MUST compile without errors or warnings
- All tests MUST pass before PR merge
- Both English and Russian documentation MUST be present and verified
- Code MUST follow Quasar and NestJS best practices
- No legacy patterns from React version may be merged
- Issue-first workflow MUST be followed (no specification work without GitHub issue)

## Governance

### Constitution Authority

This constitution supersedes all other development practices and guidelines for the Universo Platformo Quasar project. When conflicts arise between this constitution and other documentation, this constitution takes precedence.

### Amendment Process

- Amendments MUST be proposed via GitHub issue
- Changes MUST be reviewed by project maintainers
- MAJOR version bump: Backward-incompatible governance changes, principle removals
- MINOR version bump: New principles added, material expansions to guidance
- PATCH version bump: Clarifications, wording improvements, non-semantic refinements
- Amended constitution MUST include sync impact report
- Dependent templates and documentation MUST be updated consistently

### Compliance

- All pull requests MUST verify compliance with constitution principles
- Violations MUST be justified in PR description with rationale
- Template compliance checks MUST reference current constitution version
- Regular constitution reviews SHOULD occur quarterly or when major features planned

### Licensing

This project follows the **Omsk Open License** as stated in the reference React implementation. The license emphasizes:
- New code developed for this project is under Omsk Open License
- Individual packages and dependencies may have their own licenses
- Package-level license information MUST be clearly documented

**Note**: The Omsk Open License is referenced in the React implementation. Detailed license text and terms should be established and documented in this repository's LICENSE file during initial repository setup.

### Related Guidance

For runtime development guidance, refer to:
- `.github/instructions/` directory for GitHub workflow standards
- `.specify/templates/` directory for specification and planning templates
- Package-level README files for implementation-specific guidance

**Version**: 1.1.0 | **Ratified**: 2025-11-16 | **Last Amended**: 2025-11-16
