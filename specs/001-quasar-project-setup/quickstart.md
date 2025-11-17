# Quickstart Guide: Universo Platformo Quasar

**Feature**: 001-quasar-project-setup  
**Date**: 2025-11-17  
**Last Updated**: 2025-11-17

## Overview

This guide helps you get started with the Universo Platformo Quasar monorepo. Follow these steps to set up your development environment, understand the repository structure, and begin contributing.

## Prerequisites

### Required Software

1. **Node.js**: Version >=18.15.0 <19.0.0 OR ^20
   - Check version: `node --version`
   - Download: https://nodejs.org/

2. **PNPM**: Version >=9
   - Check version: `pnpm --version`
   - Install: `npm install -g pnpm@latest`
   - Or via Corepack: `corepack enable pnpm`

3. **Git**: Latest stable version
   - Check version: `git --version`
   - Download: https://git-scm.com/

### Optional Tools

- **Docker Desktop**: For containerized development
  - Download: https://www.docker.com/products/docker-desktop/

- **VS Code**: Recommended IDE with extensions
  - Volar (Vue 3 support)
  - ESLint
  - Prettier
  - TypeScript Vue Plugin

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/teknokomo/universo-platformo-quasar.git
cd universo-platformo-quasar
```

### 2. Install Dependencies

```bash
# Install all workspace dependencies
pnpm install

# This will:
# - Install all dependencies for root and all packages
# - Set up git hooks (Husky)
# - Link workspace packages
```

**Expected Output**:
```
Packages: +500 (or more as packages are added)
Progress: resolved 500, reused 450, downloaded 50, added 500
Done in 30s
```

### 3. Verify Installation

```bash
# Check that all packages are linked
pnpm list -r

# Run build to ensure everything compiles
pnpm turbo run build

# Run tests to verify everything works
pnpm turbo run test
```

## Repository Structure

```
universo-platformo-quasar/
├── .github/                 # GitHub configuration
│   ├── instructions/        # Development guidelines
│   └── workflows/          # CI/CD pipelines (future)
├── .husky/                 # Git hooks
├── .specify/               # Specification templates and scripts
├── docker/                 # Docker configuration
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── .env.example
├── packages/               # Workspace packages
│   ├── types/             # @universo/types
│   ├── utils/             # @universo/utils
│   ├── i18n/              # @universo/i18n
│   └── api-client/        # @universo/api-client
├── specs/                  # Feature specifications
├── tools/                  # Utility scripts
│   ├── docs/              # Documentation validation
│   └── testing/           # Testing utilities
├── .eslintrc.json         # ESLint configuration
├── .gitignore             # Git ignore rules
├── .npmrc                 # PNPM configuration
├── .prettierrc            # Prettier configuration
├── LICENSE                # Omsk Open License
├── package.json           # Root workspace configuration
├── pnpm-workspace.yaml    # PNPM workspace + catalog
├── README.md              # English documentation (you are here)
├── README-RU.md           # Russian documentation
├── SECURITY.md            # Security policy
├── tsconfig.json          # Base TypeScript config
└── turbo.json             # Turborepo configuration
```

## Common Commands

### Development

```bash
# Start development server for all packages
pnpm turbo run dev

# Start specific package in dev mode
pnpm --filter @universo/types dev

# Build all packages
pnpm turbo run build

# Build specific package
pnpm --filter @universo/types build

# Clean all build artifacts
pnpm turbo run clean
```

### Testing

```bash
# Run all tests
pnpm turbo run test

# Run tests for specific package
pnpm --filter @universo/types test

# Run tests in watch mode
pnpm --filter @universo/types test --watch

# Generate coverage report
pnpm turbo run test -- --coverage
```

### Code Quality

```bash
# Lint all packages
pnpm turbo run lint

# Lint and fix
pnpm turbo run lint -- --fix

# Format all files
pnpm prettier --write .

# Type check
pnpm turbo run type-check
```

### Package Management

```bash
# Add dependency to specific package using catalog
cd packages/types/base
pnpm add typescript --save-dev
# Edit package.json to use: "typescript": "catalog:"

# Add dependency to root workspace
pnpm add -w <package-name>

# Update all dependencies
pnpm update -r

# Check for outdated dependencies
pnpm outdated -r
```

## Creating a New Package

### 1. Create Package Directory Structure

```bash
mkdir -p packages/my-package/base/src
cd packages/my-package/base
```

### 2. Create package.json

```json
{
  "name": "@universo/my-package",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch",
    "test": "vitest run",
    "lint": "eslint src --ext .ts"
  },
  "dependencies": {},
  "devDependencies": {
    "typescript": "catalog:",
    "tsup": "catalog:",
    "vitest": "catalog:"
  }
}
```

### 3. Create tsconfig.json

```json
{
  "extends": "../../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 4. Create src/index.ts

```typescript
// Your package exports
export * from './types';
export * from './utils';
```

### 5. Create README Files

Create both `README.md` and `README-RU.md` following the package README template (see `.github/instructions/i18n-docs.md`).

### 6. Install and Build

```bash
# Install dependencies
pnpm install

# Build the package
pnpm build

# Run tests
pnpm test
```

## Working with Shared Packages

### Using @universo/types

```typescript
// In any package
import { Cluster, Domain, Resource } from '@universo/types';

const cluster: Cluster = {
  id: '123',
  name: 'My Cluster',
  // ...
};
```

### Using @universo/utils

```typescript
import { formatDate, validateEmail } from '@universo/utils';

const formatted = formatDate(new Date());
const isValid = validateEmail('user@example.com');
```

### Using @universo/i18n

```typescript
import { i18n, t } from '@universo/i18n';

// In frontend component
const welcomeMessage = t('common.welcome');

// In backend service
const errorMessage = t('errors.validation', { field: 'email' });
```

### Using @universo/api-client

```typescript
import { ClustersApiClient } from '@universo/api-client';

const apiClient = new ClustersApiClient();
const clusters = await apiClient.getClusters();
```

## Docker Development

### Using Docker Compose

```bash
# Copy environment template
cp docker/.env.example docker/.env

# Edit .env with your configuration
nano docker/.env

# Start all services
cd docker
docker-compose up

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Building Production Image

```bash
# Build the image
docker build -t universo-platformo-quasar -f docker/Dockerfile .

# Run the container
docker run -p 3000:3000 universo-platformo-quasar
```

## Git Workflow

### Pre-commit Hooks

Git hooks are automatically installed via Husky. Before each commit:

1. **lint-staged** runs on staged files
2. **ESLint** checks for code quality issues
3. **Prettier** formats code

If issues are found, the commit is blocked. Fix the issues and try again.

```bash
# To bypass hooks (use sparingly!)
git commit --no-verify -m "Emergency fix"
```

### Creating Feature Branches

```bash
# Create feature branch with issue number prefix
git checkout -b 002-feature-name

# Make changes
git add .
git commit -m "feat: implement feature"

# Push to remote
git push origin 002-feature-name
```

### Pull Request Workflow

1. Create GitHub Issue following `.github/instructions/github-issues.md`
2. Create feature branch named `###-feature-name`
3. Implement changes
4. Create Pull Request following `.github/instructions/github-pr.md`
5. Include "Fixes #123" in PR description

## Environment Configuration

### Supabase Setup

1. Create Supabase project: https://app.supabase.com/
2. Get your project URL and anon key
3. Create `.env` file in backend package:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
```

### TypeORM Configuration

```typescript
// packages/your-srv/base/src/config/database.config.ts
export const databaseConfig = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  synchronize: false, // Use migrations in production
};
```

## Troubleshooting

### PNPM Installation Issues

```bash
# Clear PNPM cache
pnpm store prune

# Remove node_modules and reinstall
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### Build Errors

```bash
# Clean all build artifacts
pnpm turbo run clean

# Rebuild from scratch
pnpm install
pnpm turbo run build
```

### TypeScript Errors

```bash
# Check TypeScript configuration
pnpm tsc --showConfig

# Verify types are properly exported
pnpm --filter @universo/types build
```

### Git Hook Failures

```bash
# Manually run lint-staged
pnpm lint-staged

# Fix linting issues
pnpm turbo run lint -- --fix

# Format all files
pnpm prettier --write .
```

### Docker Issues

```bash
# Remove all containers and images
docker-compose down -v
docker system prune -a

# Rebuild from scratch
docker-compose build --no-cache
docker-compose up
```

## Additional Resources

### Documentation

- **Constitution**: `.specify/memory/constitution.md` - Project principles and standards
- **GitHub Guidelines**: `.github/instructions/` - Issue, PR, and label conventions
- **Specification Templates**: `.specify/templates/` - Feature specification templates
- **React Reference**: https://github.com/teknokomo/universo-platformo-react

### Technology Documentation

- **Quasar Framework**: https://quasar.dev/
- **NestJS**: https://nestjs.com/
- **PNPM Workspaces**: https://pnpm.io/workspaces
- **Turborepo**: https://turbo.build/repo
- **Vitest**: https://vitest.dev/
- **TypeORM**: https://typeorm.io/
- **Supabase**: https://supabase.com/docs

### Community

- GitHub Issues: Report bugs and request features
- GitHub Discussions: Ask questions and share ideas
- Pull Requests: Contribute code following PR guidelines

## Next Steps

After completing this quickstart:

1. **Read the Constitution**: Understand project principles (`.specify/memory/constitution.md`)
2. **Review Specifications**: Check `specs/` directory for implemented features
3. **Explore Packages**: Look at existing packages in `packages/` for examples
4. **Create Your First Issue**: Follow `.github/instructions/github-issues.md`
5. **Make Your First Contribution**: Follow the git workflow and PR guidelines

## Getting Help

- Check existing documentation in `.github/instructions/`
- Review the specification for current feature (`specs/001-quasar-project-setup/`)
- Create a GitHub Issue with the `question` label
- Refer to the React implementation for conceptual guidance (not code copying)

---

**Welcome to Universo Platformo Quasar!** 🚀

This quickstart should have you up and running. For detailed information on specific features, refer to their specification documents in the `specs/` directory.
