# Repository Structure

This document describes the organized structure of the CyberSoluce repository.

## Directory Organization

### Root Level
Essential project files that must remain at the root for build tools and deployment platforms:

**Configuration Files**
- `package.json` - Node.js dependencies and scripts
- `package-lock.json` - Locked dependency versions
- `vite.config.ts` - Vite build configuration
- `vitest.config.ts` - Vitest test configuration
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `eslint.config.js` - ESLint configuration
- `components.json` - shadcn/ui components configuration
- `netlify.toml` - Netlify deployment configuration
- `performance-budget.json` - Performance budget configuration
- `.hintrc` - Webhint configuration
- `.nvmrc` - Node version specification

**Entry Points**
- `index.html` - Application entry point
- `index.js` - Additional entry point (if needed)

**Standard GitHub Files**
- `README.md` - Main project documentation
- `CONTRIBUTING.md` - Contribution guidelines
- `SECURITY.md` - Security policy
- `LICENSE` - License file

**Environment & Git**
- `.env.example` - Environment variables example
- `.env.local.example` - Local environment variables example
- `.gitignore` - Git ignore rules

**Workspace**
- `Asset-CyberSoluce.code-workspace` - VS Code workspace file

### `/docs` - Documentation
All project documentation organized by category:

**Subdirectories:**
- `deployment/` - Deployment guides, checklists, and troubleshooting (17 files)
- `guides/` - User guides, installation instructions, and how-to documents (14 files)
- `implementation/` - Implementation status, feature documentation, and integration reports (17 files)
- `migration/` - Migration guides, instructions, and verification reports (13 files)
- `status/` - Status reports, summaries, reviews, and checklists (30+ files)
- `todos/` - TODO items and future planning documents (17 files)
- Root `docs/` - General documentation, features, and miscellaneous files (15+ files)

**Key Files:**
- `README.md` - Documentation index with links to all categories
- `REPOSITORY_STRUCTURE.md` - This file

### `/scripts` - Utility Scripts
Automation and utility scripts:

- `deploy-production.ps1` - PowerShell script for production deployment
- `migrate-repo.sh` - Shell script for repository migration
- `generate-sbom-report.py` - Python script for SBOM report generation

### `/migrations` - Database Migrations
SQL migration files:

- `ALL_MIGRATIONS_COMBINED.sql` - Combined migration file

### `/src` - Source Code
Application source code:

- `/components` - React components
- `/services` - Business logic and services
- `/types` - TypeScript type definitions
- `/utils` - Utility functions
- `/workflows` - Workflow definitions
- `App.tsx` - Main application component
- `main.tsx` - Application entry point
- `index.css` - Global styles

### `/public` - Public Assets
Static assets served directly:

- Templates, images, and other static files

### Other Directories
- `/.github` - GitHub workflows and templates
- `/.bolt` - Bolt configuration (if applicable)
- `/test-data` - Test data files
- `/migrations-ready` - Migration preparation files
- `/supabase` - Supabase configuration (if applicable)

## File Organization Principles

1. **Root Level**: Only essential files required by build tools and deployment platforms
2. **Documentation**: All `.md` files (except standard GitHub files) organized in `/docs` subdirectories
3. **Scripts**: All utility scripts in `/scripts`
4. **Migrations**: All SQL migration files in `/migrations`
5. **Source Code**: All application code in `/src`
6. **Static Assets**: All public files in `/public`

## Benefits of This Structure

- **Cleaner Root**: Easier to find essential configuration files
- **Better Organization**: Related files grouped together by category
- **Easier Maintenance**: Clear separation of concerns
- **Standard Practice**: Follows common project structure conventions
- **Scalability**: Easy to add new documentation or scripts
- **Discoverability**: Documentation index makes finding files easy

## Statistics

- **Total Documentation Files**: 120+ markdown files organized into 6 categories
- **Scripts**: 3 utility scripts
- **Migrations**: 1 combined SQL file
- **Root Files**: ~25 essential configuration and standard files

## Migration Notes

If you're updating references to moved files:

- Documentation files: `docs/[category]/[filename].md`
- Scripts: `scripts/[scriptname]`
- Migrations: `migrations/[filename].sql`
- Scripts automatically handle path resolution to project root

