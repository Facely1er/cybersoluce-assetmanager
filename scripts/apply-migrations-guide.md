# Supabase Migration Application Guide

**Date**: December 2025  
**Project**: CyberSoluce Asset Manager

## Overview

This guide provides step-by-step instructions for applying database migrations to the CyberSoluce Supabase project.

## Prerequisites

- Access to Supabase project: `uvdrwbmhmtgacwzujfzc`
- Supabase dashboard access: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc

## Migration Files

All migration files are located in: `supabase/migrations/`

### Core Migrations (Apply in Order)

1. **20250801112702_cold_firefly.sql** - Reports table
2. **20250801114506_odd_flower.sql** - Organizations table
3. **20250125000000_dependency_manager_features.sql** - All feature tables (assets, risks, mitigations, dependencies, BIA, frameworks)

### Additional Migrations (If Needed)

4. **20250101000000_create_assets_table.sql** - Assets table (if not in #3)
5. **20250115000000_create_signal_history.sql** - Signal history tracking
6. **20250130000000_create_feedback_submissions.sql** - Feedback system
7. **20250130000001_fix_feedback_linter_issues.sql** - Feedback fixes

## Step-by-Step Instructions

### Method 1: Using Supabase SQL Editor (Recommended)

1. **Open SQL Editor**
   - Go to: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/sql/new

2. **Apply Each Migration**
   - Open each migration file from `supabase/migrations/`
   - Copy the entire SQL content
   - Paste into SQL Editor
   - Click "Run" or press `Ctrl+Enter`
   - Wait for "Success" message

3. **Verify Migration**
   - Check Table Editor: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/editor
   - Verify tables were created
   - Check RLS policies are enabled

### Method 2: Using Supabase CLI

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref uvdrwbmhmtgacwzujfzc

# Apply all migrations
supabase db push

# Or apply specific migration
supabase migration up
```

### Method 3: Using PowerShell Script

```powershell
# Run the migration script
.\scripts\apply-migrations-direct.mjs

# Or use the Supabase CLI wrapper
.\scripts\apply-migrations-supabase-cli.ps1
```

## Verification Checklist

After applying migrations, verify:

- [ ] All tables exist in Table Editor
- [ ] RLS policies are enabled on all tables
- [ ] Indexes are created
- [ ] Foreign key constraints are in place
- [ ] Triggers are created (if any)
- [ ] Functions are created (if any)

## Troubleshooting

### Migration Fails with "Already Exists" Error
- This means the migration was already applied
- Skip to the next migration
- Check Table Editor to verify tables exist

### Migration Fails with Syntax Error
- Check SQL syntax in the migration file
- Verify you copied the entire file content
- Check Supabase SQL Editor for specific error details

### RLS Policies Not Working
- Verify RLS is enabled: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
- Check policies are created correctly
- Test with authenticated user

## Quick Reference

### Supabase Links
- **Dashboard**: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc
- **SQL Editor**: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/sql/new
- **Table Editor**: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/editor
- **Database**: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/database/tables

### Migration Files Location
```
supabase/migrations/
├── 20250101000000_create_assets_table.sql
├── 20250102000000_fix_linter_issues.sql
├── 20250102000001_fix_public_profiles_policies.sql
├── 20250102000002_consolidate_org_members_insert_policy.sql
├── 20250115000000_create_signal_history.sql
├── 20250125000000_dependency_manager_features.sql
├── 20250130000000_create_feedback_submissions.sql
├── 20250130000001_fix_feedback_linter_issues.sql
├── 20250801112702_cold_firefly.sql
└── 20250801114506_odd_flower.sql
```

## Support

If you encounter issues:
1. Check Supabase logs: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/logs/explorer
2. Review migration file syntax
3. Verify Supabase project is active
4. Check database connection

---

**Last Updated**: December 2025

