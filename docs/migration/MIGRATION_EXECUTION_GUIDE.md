# Database Migration Execution Guide

**Date:** Current  
**Project:** CyberSoluce Asset Manager  
**Status:** Ready to Execute

---

## Migration Overview

There are **5 migration files** that need to be applied in order:

1. `20250101000000_create_assets_table.sql` - Core assets and profiles
2. `20250115000000_create_signal_history.sql` - Signal history tracking
3. `20250125000000_dependency_manager_features.sql` - Dependency manager features
4. `20250801112702_cold_firefly.sql` - Reports system
5. `20250801114506_odd_flower.sql` - Organizations and multi-tenancy

---

## Method 1: Supabase Dashboard (Recommended)

### Step 1: Access Supabase SQL Editor

1. Go to: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/sql/new
2. Or navigate: Dashboard → SQL Editor → New Query

### Step 2: Apply Migrations in Order

For each migration file, follow these steps:

1. Open the migration file from `supabase/migrations/`
2. Copy the entire contents
3. Paste into the SQL Editor
4. Click **"Run"** or press `Ctrl+Enter`
5. Wait for success confirmation
6. Move to the next migration

### Migration Files Location:
```
supabase/migrations/
├── 20250101000000_create_assets_table.sql
├── 20250115000000_create_signal_history.sql
├── 20250125000000_dependency_manager_features.sql
├── 20250801112702_cold_firefly.sql
└── 20250801114506_odd_flower.sql
```

---

## Method 2: Using psql (PostgreSQL Client)

### Prerequisites:
- PostgreSQL client (`psql`) installed
- Database connection string

### Get Connection String:
1. Go to: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/settings/database
2. Copy the connection string under "Connection string" → "URI"
3. Format: `postgresql://postgres:[PASSWORD]@db.uvdrwbmhmtgacwzujfzc.supabase.co:5432/postgres`

### Run Migrations:

```powershell
# Set connection string
$env:DATABASE_URL = "postgresql://postgres:[PASSWORD]@db.uvdrwbmhmtgacwzujfzc.supabase.co:5432/postgres"

# Run the PowerShell script
.\scripts\apply-migrations-simple.ps1
```

Or manually with psql:

```bash
psql "$env:DATABASE_URL" -f supabase/migrations/20250101000000_create_assets_table.sql
psql "$env:DATABASE_URL" -f supabase/migrations/20250115000000_create_signal_history.sql
psql "$env:DATABASE_URL" -f supabase/migrations/20250125000000_dependency_manager_features.sql
psql "$env:DATABASE_URL" -f supabase/migrations/20250801112702_cold_firefly.sql
psql "$env:DATABASE_URL" -f supabase/migrations/20250801114506_odd_flower.sql
```

---

## Method 3: Using Supabase CLI

### Prerequisites:
- Supabase CLI installed: `npm install -g supabase`
- Authenticated: `supabase login`

### Link Project:
```bash
supabase link --project-ref uvdrwbmhmtgacwzujfzc
```

### Apply Migrations:
```bash
supabase db push
```

---

## Verification After Migration

### 1. Check Tables Created

Run this query in Supabase SQL Editor:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

**Expected Tables (19 total):**
- profiles
- assets
- asset_relationships
- asset_vulnerabilities
- asset_import_batch
- signal_history
- mitigation_actions
- business_functions
- business_impacts
- continuity_plans
- nist_controls
- nist_mappings
- nist_assessments
- framework_phases
- risks
- reports
- organizations
- organization_members
- invitations

### 2. Verify RLS is Enabled

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND rowsecurity = true
ORDER BY tablename;
```

All 19 tables should have `rowsecurity = true`.

### 3. Check Indexes

```sql
SELECT tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

### 4. Verify Foreign Keys

```sql
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name;
```

---

## Troubleshooting

### Error: "relation already exists"
- **Cause:** Migration already applied
- **Solution:** Migrations use `CREATE TABLE IF NOT EXISTS`, so this is safe to ignore

### Error: "permission denied"
- **Cause:** Using anon key instead of service role key
- **Solution:** Use service role key for migrations (via psql or Dashboard)

### Error: "syntax error"
- **Cause:** Copy-paste issue or incomplete SQL
- **Solution:** Ensure entire migration file is copied, including all statements

### Error: "column already exists"
- **Cause:** Partial migration applied previously
- **Solution:** Check which tables/columns exist, may need to drop and reapply

---

## Migration Safety

✅ **All migrations are idempotent:**
- Use `CREATE TABLE IF NOT EXISTS`
- Use `CREATE INDEX IF NOT EXISTS`
- Use `DO $$ BEGIN ... END $$` blocks for conditional operations

✅ **Safe to re-run:**
- Migrations can be executed multiple times safely
- No data loss on re-execution

---

## Post-Migration Checklist

After applying all migrations:

- [ ] All 19 tables created
- [ ] RLS enabled on all tables
- [ ] Indexes created
- [ ] Foreign keys established
- [ ] Test user can authenticate
- [ ] Test user can create assets
- [ ] RLS policies working correctly

---

## Next Steps After Migration

1. ✅ Verify migrations applied successfully
2. ✅ Get Supabase anon key from Dashboard
3. ✅ Set environment variables in Netlify
4. ✅ Deploy application
5. ✅ Test authentication flow
6. ✅ Test asset creation

---

**Status:** Ready to execute migrations  
**Recommended Method:** Supabase Dashboard (Method 1)  
**Estimated Time:** 10-15 minutes

