# Feature Specification: Universo Platformo Quasar Project Setup

**Feature Branch**: `001-quasar-project-setup`  
**Created**: 2025-11-16  
**Status**: Draft  
**Input**: User description: "Initialize Universo Platformo Quasar project with monorepo structure, PNPM workspace, and base packages following the React implementation as reference"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Repository Initialization and Documentation (Priority: P1)

A developer clones the Universo Platformo Quasar repository and finds comprehensive bilingual documentation explaining the project's purpose, structure, and how it relates to the React implementation. The repository includes proper configuration files, licensing information, and clear instructions for getting started.

**Why this priority**: Without proper repository setup and documentation, no development work can proceed. This is the foundation that all other work depends on.

**Independent Test**: Clone the repository, read the README files in both English and Russian, verify all configuration files exist and contain valid settings.

**Acceptance Scenarios**:

1. **Given** an empty repository, **When** the setup is complete, **Then** README.md and README-RU.md exist with identical structure and bilingual content
2. **Given** the repository is cloned, **When** a developer opens it, **Then** they can understand the project's purpose, architecture, and relationship to Universo Platformo React (including that React version has Flowise legacy code and other Universo implementations exist)
3. **Given** the repository documentation, **When** a developer reads the license information, **Then** they understand the Omsk Open License application and individual package licensing
4. **Given** configuration files exist, **When** validated, **Then** they include proper TypeScript, ESLint, Prettier, and gitignore settings

---

### User Story 2 - Monorepo Infrastructure with PNPM (Priority: P2)

A developer needs to set up the development environment with PNPM workspaces, enabling them to manage multiple packages efficiently. The monorepo structure allows independent package development while sharing common dependencies.

**Why this priority**: The monorepo structure is essential for the multi-package architecture that mirrors the React implementation. Without it, package management becomes unmanageable.

**Independent Test**: Run `pnpm install` and verify all workspaces are recognized, dependencies are installed correctly, and the workspace structure allows cross-package references.

**Acceptance Scenarios**:

1. **Given** PNPM is installed, **When** `pnpm install` is executed, **Then** all workspace packages are recognized and dependencies are installed
2. **Given** the workspace configuration, **When** packages reference each other, **Then** TypeScript can resolve the references correctly
3. **Given** multiple packages exist, **When** building, **Then** the build system handles dependencies in the correct order
4. **Given** the pnpm-workspace.yaml file, **When** examined, **Then** it defines the packages directory structure following the patterns from React implementation

---

### User Story 3 - Base Package Structure (Priority: P3)

A developer creates the first functional package following the established naming convention with separate frontend (-frt) and backend (-srv) packages, each containing a base/ directory for core implementations.

**Why this priority**: Establishes the package structure pattern that all future packages will follow, ensuring consistency with the React implementation's architecture.

**Independent Test**: Create a sample package pair (e.g., clusters-frt and clusters-srv), verify they have base/ directories, can be built independently, and follow the established structure.

**Acceptance Scenarios**:

1. **Given** the packages directory, **When** a new functional area is added, **Then** it consists of separate -frt and -srv packages
2. **Given** each package, **When** inspected, **Then** it contains a base/ directory for core implementation
3. **Given** package naming conventions, **When** applied, **Then** frontend packages end with -frt and backend packages end with -srv
4. **Given** the package structure, **When** compared to React implementation, **Then** it follows the same organizational patterns while using Quasar/NestJS instead of React/Express

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

### User Story 5 - Development Environment Setup (Priority: P5)

A developer sets up their local development environment with necessary tools and dependencies to start contributing to the project. The environment supports both Quasar frontend development and NestJS backend development.

**Why this priority**: While important for development, this can be done after the repository structure is established. Developers need the basic infrastructure first.

**Independent Test**: Follow installation instructions, install Node.js, PNPM, and run basic commands to verify the environment works correctly.

**Acceptance Scenarios**:

1. **Given** Node.js version requirements, **When** checked, **Then** the project specifies compatible versions (>=18.15.0 <19.0.0 || ^20)
2. **Given** PNPM requirements, **When** verified, **Then** the project requires PNPM >=9
3. **Given** development dependencies, **When** installed, **Then** TypeScript, ESLint, and Prettier are configured and working
4. **Given** environment configuration, **When** needed, **Then** documentation explains how to set up Supabase and other required services

---

### Edge Cases

- What happens when a developer tries to use npm or yarn instead of PNPM? (Should show clear error message directing them to use PNPM)
- How does the system handle when README.md is updated but README-RU.md is not? (Development guidelines should require both to be updated together)
- What happens if package naming conventions are not followed? (Linting and documentation should catch this during code review)
- How does the system handle dependencies that conflict between Quasar and NestJS? (PNPM workspace configuration should isolate dependencies appropriately)
- What happens if someone tries to add actual @mui/material package? (Documentation should clarify Quasar's Material Design components are used instead)
- How is React repository monitoring coordinated? (Should establish regular review schedule and decision criteria for porting features)
- What if Flowise-related code is accidentally ported from React? (Code review should catch and reject such changes)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Repository MUST include README.md and README-RU.md with identical structure and content (one in English, one in Russian)
- **FR-002**: Repository MUST use PNPM workspace configuration for monorepo management
- **FR-003**: Repository MUST define package structure in packages/ directory following React implementation patterns
- **FR-004**: Packages MUST be organized with -frt suffix for frontend and -srv suffix for backend functionality
- **FR-005**: Each package MUST contain a base/ directory for core implementations to support future alternative implementations
- **FR-006**: Repository MUST include proper TypeScript configuration for both Quasar and NestJS development
- **FR-007**: Repository MUST include ESLint and Prettier configuration for code quality and consistency
- **FR-008**: Repository MUST include comprehensive .gitignore for Node.js, TypeScript, and IDE files
- **FR-009**: Documentation MUST reference Universo Platformo React as the conceptual basis while noting this is a Quasar/NestJS implementation and that React version contains Flowise legacy code not to be ported
- **FR-010**: Repository MUST include license information stating Omsk Open License (with detailed terms to be established) and notes about individual package licenses
- **FR-011**: Repository MUST include proper package.json with workspace configuration and engine requirements
- **FR-012**: Documentation MUST explain the relationship to other Universo Platformo implementations (React, Godot, PlayCanvas)
- **FR-013**: Repository MUST follow GitHub Issues guidelines with bilingual format using exact spoiler tag `<summary>In Russian</summary>`
- **FR-014**: Repository MUST create initial label set per github-labels.md as part of setup, then use only existing repository labels for future issues
- **FR-015**: Repository MUST follow GitHub PR guidelines with bilingual descriptions and proper labeling
- **FR-016**: Repository MUST follow i18n documentation guidelines ensuring English and Russian versions have identical structure
- **FR-017**: Repository MUST establish process for monitoring React implementation for new features and evaluating them for Quasar/NestJS adaptation

### Key Entities

- **Repository Configuration**: Represents the foundational setup including package.json, pnpm-workspace.yaml, tsconfig.json, and other configuration files
- **Package**: Represents a functional module with either -frt (frontend using Quasar) or -srv (backend using NestJS) suffix, containing a base/ directory for core implementation
- **Documentation**: Represents bilingual README files and other documentation following i18n guidelines with exact structural parity
- **Issue Label**: Represents categorization tags used in GitHub Issues following the repository's labeling system (initial set created during setup)
- **License Information**: Represents Omsk Open License application and individual package license documentation
- **React Repository Reference**: Represents the conceptual basis and monitoring source for feature evaluation (excluding Flowise legacy code)

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
- **SC-011**: Documentation clearly explains React repository monitoring process and selective feature porting strategy

## Assumptions

- Developers have basic familiarity with monorepo concepts and PNPM workspaces
- The Quasar framework and NestJS are chosen as the technology stack (no alternatives being considered)
- Supabase will be used for database functionality similar to the React implementation
- The project will use TypeScript exclusively for both frontend and backend
- Quasar's built-in Material Design components will be used for UI consistency (not a separate MUI package)
- The project structure follows the React implementation conceptually but not at the code level
- The React implementation (github.com/teknokomo/universo-platformo-react) contains Flowise legacy code that will NOT be ported
- React repository will be monitored regularly for new proven features worth adapting to Quasar/NestJS stack
- GitHub Issues and Pull Requests will be the primary tools for task management
- Documentation will be maintained in both English and Russian languages only (not additional languages initially)
- The Omsk Open License applies to new code (detailed license terms to be established), while dependencies and packages may have different licenses
- Initial repository setup includes creating base label set; afterwards only existing labels are used
