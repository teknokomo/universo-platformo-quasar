# Modular Architecture Validation Checklist

**Purpose**: Ensure all implementations strictly follow the modular package architecture mandated by the project constitution.

**Version**: 1.0.0  
**Last Updated**: 2025-11-17  
**Applies To**: All features and implementations

## Critical Requirements ⚠️

### Package Organization (NON-NEGOTIABLE)

- [ ] **ALL functionality is in `packages/` directory**
  - No business logic, UI components, or services in repository root
  - Only configuration and tooling files allowed in root
  
- [ ] **Each functional package has proper structure**
  - Frontend packages use `-frt` suffix: `packages/{feature}-frt/`
  - Backend packages use `-srv` suffix: `packages/{feature}-srv/`
  - Each package contains `base/` subdirectory
  
- [ ] **Shared infrastructure uses @universo/ namespace**
  - Type definitions: `@universo/types`
  - Utilities: `@universo/utils`
  - Internationalization: `@universo/i18n`
  - API client: `@universo/api-client`
  - Authentication frontend: `@universo/auth-frt`
  - Authentication backend: `@universo/auth-srv`

## Package Structure Validation

### Directory Structure

```text
✅ CORRECT:
packages/
  clusters-frt/
    base/
      src/
      package.json      # name: "@universo/clusters-frt"
      tsconfig.json
      README.md
      README-RU.md
  clusters-srv/
    base/
      src/
      package.json      # name: "@universo/clusters-srv"
      tsconfig.json
      README.md
      README-RU.md

❌ INCORRECT:
src/clusters/           # Functionality in root - VIOLATES ARCHITECTURE
frontend/clusters/      # Not using packages/ - VIOLATES ARCHITECTURE
packages/clusters/      # Combined frontend/backend - VIOLATES SEPARATION
```

### Package Naming Convention

- [ ] **Frontend package names**
  - Format: `@universo/{feature}-frt`
  - Examples: `@universo/clusters-frt`, `@universo/spaces-frt`, `@universo/metaverses-frt`
  
- [ ] **Backend package names**
  - Format: `@universo/{feature}-srv`
  - Examples: `@universo/clusters-srv`, `@universo/spaces-srv`, `@universo/metaverses-srv`
  
- [ ] **Shared package names**
  - Format: `@universo/{name}` (no suffix)
  - Examples: `@universo/types`, `@universo/utils`, `@universo/i18n`

### Workspace Configuration

- [ ] **pnpm-workspace.yaml includes both patterns**
  ```yaml
  packages:
      - 'packages/*'        # Top-level package directories
      - 'packages/*/base'   # Base implementation subdirectories
  ```

- [ ] **PNPM workspace catalog defined**
  ```yaml
  catalog:
    typescript: ^5.3.0
    quasar: ^2.14.0
    '@nestjs/core': ^10.0.0
    # ... other shared dependencies
  ```

## Root Directory Validation

### Allowed in Root (Configuration Only)

- [ ] **Workspace configuration**
  - `package.json` (workspace root, not publishable)
  - `pnpm-workspace.yaml`
  - `turbo.json`
  - `.npmrc`

- [ ] **TypeScript configuration**
  - `tsconfig.json` (base configuration)
  - `tsconfig.test.json` (test configuration)

- [ ] **Code quality tools**
  - `.eslintrc.*`
  - `.prettierrc` or `prettier` in package.json
  - `.editorconfig`

- [ ] **Git configuration**
  - `.gitignore`
  - `.gitattributes`
  - `.husky/` (git hooks)

- [ ] **Documentation**
  - `README.md`, `README-RU.md` (root documentation only)
  - `LICENSE`
  - `SECURITY.md`

- [ ] **Development tools**
  - `docker/` (containerization)
  - `tools/` (utility scripts only, no business logic)
  - `.specify/` (specification framework: memory, scripts, specs, templates)

### NOT Allowed in Root

- [ ] **Verify NO business logic in root**
  - ❌ `src/` directory with application code
  - ❌ `lib/` directory with shared libraries
  - ❌ `components/` directory with UI components
  - ❌ `services/` directory with business services
  - ❌ `models/` directory with data models
  - ❌ `controllers/` directory with API controllers

- [ ] **Verify NO mixed frontend/backend in root**
  - ❌ `frontend/` directory (should be separate `-frt` packages)
  - ❌ `backend/` directory (should be separate `-srv` packages)
  - ❌ `server/` directory (should be in `-srv` packages)
  - ❌ `client/` directory (should be in `-frt` packages)

## Package Independence Validation

- [ ] **Each package has own package.json**
  - Declares own dependencies
  - Uses workspace references for inter-package dependencies
  - Uses catalog versions for shared dependencies

- [ ] **Each package has own tsconfig.json**
  - Extends root configuration
  - Configured for package-specific needs (frontend vs backend)
  - Includes proper path aliases if needed

- [ ] **Each package has bilingual documentation**
  - `README.md` (English, primary)
  - `README-RU.md` (Russian, exact translation)
  - Identical structure and line count

- [ ] **Each package is independently buildable**
  - Can run `pnpm --filter @universo/{package} build`
  - Build doesn't require building unrelated packages
  - Turborepo handles dependency order

## Future Extraction Readiness

- [ ] **Package can be moved to separate repository**
  - All dependencies explicitly declared
  - No implicit dependencies on repository structure
  - Build and test can run independently
  - Documentation is self-contained

- [ ] **Package follows standard structure**
  - Uses `base/` subdirectory pattern
  - Supports future alternative implementations
  - Clear entry points defined in package.json

- [ ] **Package has proper exports**
  - Main export defined
  - Type definitions included
  - Additional exports documented (e.g., `/i18n`)

## Reference Implementation Comparison

Compare with universo-platformo-react repository:

- [ ] **Similar package count and organization**
  - Multiple functional packages with `-frt`/`-srv` split
  - Shared infrastructure packages with `@universo/` namespace
  - Each package has `base/` subdirectory

- [ ] **Workspace configuration matches pattern**
  - `pnpm-workspace.yaml` includes both `packages/*` and `packages/*/base`
  - PNPM workspace catalog for dependency management

- [ ] **Package naming follows convention**
  - Frontend: `@universo/{feature}-frt`
  - Backend: `@universo/{feature}-srv`
  - Shared: `@universo/{name}`

## Violation Reporting

If any violations are found:

1. **Document the violation**
   - What: Describe what violates the modular architecture
   - Where: Exact file paths or directory structure
   - Why: Explain why it violates the principle

2. **Propose correction**
   - Target package location
   - Required refactoring steps
   - Impact assessment

3. **Update relevant documentation**
   - Specification updates if needed
   - README updates
   - Migration notes if breaking change

## Compliance Statement

Before merging any feature implementation, verify:

```text
✅ All functional code is in packages/ directory
✅ Frontend and backend are separated into -frt and -srv packages
✅ Each package has base/ subdirectory
✅ Shared code uses @universo/ namespace
✅ No business logic in repository root
✅ Package structure supports future extraction to separate repositories
✅ Workspace configuration includes both packages/* and packages/*/base
✅ All packages use proper naming conventions
```

**Reviewer Signature**: ________________  
**Date**: ________________  
**Feature/PR**: ________________

---

**Note**: This checklist is derived from Constitution v1.4.0 Principle I (Monorepo Package Structure). Any updates to the constitution should be reflected here.
