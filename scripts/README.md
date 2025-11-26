# 🚀 Deployment Automation Scripts

This directory contains PowerShell scripts to automate the deployment process for CyberSoluce-AssetManager.

## 📋 Available Scripts

### 1. `verify-setup.ps1`
**Purpose**: Verify all prerequisites and setup before deployment

**Usage**:
```powershell
.\scripts\verify-setup.ps1
```

**What it checks**:
- Node.js version (18+)
- npm installation
- Dependencies (node_modules)
- Migration files
- Configuration files (netlify.toml, vite.config.ts)
- Build output (dist folder)
- Netlify CLI installation
- Git installation

**Run this first** to ensure everything is ready!

---

### 2. `prepare-migrations.ps1`
**Purpose**: Prepare migration files for easy copy-paste to Supabase SQL Editor

**Usage**:
```powershell
.\scripts\prepare-migrations.ps1
```

**What it does**:
- Reads migration files from `supabase/migrations/`
- Creates formatted versions with instructions
- Outputs to `migrations-ready/` directory
- Creates numbered files (1-, 2-, 3-) for easy ordering
- Includes copy-paste instructions in each file

**Output**:
- `migrations-ready/1-20250801112702_cold_firefly.sql`
- `migrations-ready/2-20250801114506_odd_flower.sql`
- `migrations-ready/3-20250125000000_dependency_manager_features.sql`
- `migrations-ready/ALL_MIGRATIONS_COMBINED.sql` (reference only)

**Next step**: Copy each file's content to Supabase SQL Editor and run.

---

### 3. `deploy-to-netlify.ps1`
**Purpose**: Automate Netlify deployment with environment variables

**Usage**:
```powershell
# Basic deployment (will prompt for Supabase key)
.\scripts\deploy-to-netlify.ps1

# With Supabase key provided
.\scripts\deploy-to-netlify.ps1 -SupabaseAnonKey "your-key-here"

# Skip build (if already built)
.\scripts\deploy-to-netlify.ps1 -SkipBuild

# Deploy preview (not production)
.\scripts\deploy-to-netlify.ps1 -Preview
```

**Parameters**:
- `-SupabaseUrl`: Supabase project URL (default: configured URL)
- `-SupabaseAnonKey`: Supabase anon key (will prompt if not provided)
- `-SkipBuild`: Skip building before deployment
- `-Preview`: Deploy preview instead of production

**What it does**:
1. Checks/installs Netlify CLI
2. Verifies Netlify login
3. Builds the project (unless skipped)
4. Initializes Netlify site (if needed)
5. Sets environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_APP_ENV=production`
   - `VITE_DEBUG_MODE=false`
   - `VITE_ENABLE_ERROR_REPORTING=true`
6. Deploys to Netlify

**Requirements**:
- Netlify CLI installed (`npm install -g netlify-cli`)
- Logged in to Netlify (`netlify login`)
- Supabase anon key

---

## 🚀 Quick Start Guide

### Step 1: Verify Setup
```powershell
cd C:\Users\facel\Downloads\GitHub\CyberSoluce-AssetManager
.\scripts\verify-setup.ps1
```

### Step 2: Prepare Migrations
```powershell
.\scripts\prepare-migrations.ps1
```

### Step 3: Apply Migrations to Supabase
1. Open prepared files in `migrations-ready/` folder
2. Copy content from each file (one at a time)
3. Go to: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/sql/new
4. Paste and run each migration in order

### Step 4: Get Supabase Anon Key
1. Go to: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/settings/api
2. Copy the `anon` `public` key

### Step 5: Deploy to Netlify
```powershell
# Install Netlify CLI (first time only)
npm install -g netlify-cli

# Login to Netlify (first time only)
netlify login

# Deploy (will prompt for Supabase key if not provided)
.\scripts\deploy-to-netlify.ps1 -SupabaseAnonKey "your-key-here"
```

### Step 6: Configure Authentication
1. Get your Netlify site URL from deployment output
2. Go to: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/auth/url-configuration
3. Set Site URL: `https://your-site-name.netlify.app`
4. Add Redirect URLs:
   - `https://your-site-name.netlify.app/**`
   - `https://your-site-name.netlify.app/auth/callback`

### Step 7: Test Deployment
Visit your deployed site and test:
- Authentication (sign up/sign in)
- Creating assets
- Database connection

---

## 📝 Manual Deployment Alternative

If you prefer manual deployment via Netlify Dashboard:

1. **Connect Repository**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository

2. **Configure Build**
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`

3. **Set Environment Variables**
   - Go to Site settings → Environment variables
   - Add all variables (see `deploy-to-netlify.ps1` for list)

4. **Deploy**
   - Click "Deploy site"

---

## 🆘 Troubleshooting

### Script Execution Policy Error
If you get an execution policy error:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Netlify CLI Not Found
```powershell
npm install -g netlify-cli
```

### Build Fails
```powershell
# Clear and reinstall dependencies
Remove-Item -Recurse -Force node_modules
npm install
npm run build
```

### Migration Errors
- Ensure migrations are run in order (1, 2, 3)
- Check Supabase project is active
- Verify SQL syntax is correct

---

## 📚 Additional Resources

- **Full Deployment Guide**: `../DEPLOYMENT_CHECKLIST.md`
- **Quick Deploy Guide**: `../QUICK_DEPLOY.md`
- **Production Readiness**: `../PRODUCTION_READINESS_ASSESSMENT.md`

---

**Last Updated**: January 2025

