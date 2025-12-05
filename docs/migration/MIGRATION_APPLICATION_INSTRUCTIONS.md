# Database Migration Application Instructions

**Date:** Current  
**Status:** Ready to Apply

---

## Quick Start

### Option 1: Apply All Migrations at Once (Recommended)

1. **Open Supabase SQL Editor:**
   - Go to: https://app.supabase.com/project/dfklqsdfycwjlcasfciu/sql/new

2. **Copy the Combined Migration File:**
   - Open: `ALL_MIGRATIONS_COMBINED.sql`
   - Copy the entire contents (Ctrl+A, Ctrl+C)

3. **Paste and Run:**
   - Paste into the SQL Editor
   - Click **"Run"** or press `Ctrl+Enter`
   - Wait for execution to complete

4. **Verify Success:**
   - Check for any errors in the output
   - Go to Table Editor and verify all 19 tables exist

---

### Option 2: Apply Migrations Individually

If you prefer to apply migrations one at a time:

1. **Migration 1:** `supabase/migrations/20250101000000_create_assets_table.sql`
2. **Migration 2:** `supabase/migrations/20250115000000_create_signal_history.sql`
3. **Migration 3:** `supabase/migrations/20250125000000_dependency_manager_features.sql`
4. **Migration 4:** `supabase/migrations/20250801112702_cold_firefly.sql`
5. **Migration 5:** `supabase/migrations/20250801114506_odd_flower.sql`

Apply each file in order via Supabase SQL Editor.

---

## Verification Queries

After applying migrations, run these queries to verify:

### Check All Tables Created:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

**Expected:** 19 tables

### Check RLS Enabled:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND rowsecurity = true
ORDER BY tablename;
```

**Expected:** All 19 tables should have `rowsecurity = true`

### Check Indexes:
```sql
SELECT tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

---

## Migration Files Summary

| # | File | Size | Tables Created |
|---|------|------|----------------|
| 1 | `20250101000000_create_assets_table.sql` | 8.92 KB | 4 (profiles, assets, asset_relationships, asset_vulnerabilities) |
| 2 | `20250115000000_create_signal_history.sql` | 3.43 KB | 2 (asset_import_batch, signal_history) |
| 3 | `20250125000000_dependency_manager_features.sql` | 11.06 KB | 9 (mitigation_actions, business_functions, business_impacts, continuity_plans, nist_controls, nist_mappings, nist_assessments, framework_phases, risks) |
| 4 | `20250801112702_cold_firefly.sql` | 2.13 KB | 1 (reports) |
| 5 | `20250801114506_odd_flower.sql` | 6.79 KB | 3 (organizations, organization_members, invitations) |

**Total:** 19 tables, ~32 KB of SQL

---

## Important Notes

✅ **All migrations are idempotent:**
- Use `CREATE TABLE IF NOT EXISTS`
- Use `CREATE INDEX IF NOT EXISTS`
- Use `DO $$ BEGIN ... END $$` blocks for conditional operations
- Safe to re-run if needed

✅ **RLS Policies:**
- All tables have Row Level Security enabled
- Policies enforce user/organization isolation
- Authenticated users can only access their own data

✅ **Performance:**
- Indexes created on all foreign keys
- Indexes on frequently queried columns
- Composite indexes for time-series queries

---

## Troubleshooting

### Error: "relation already exists"
- **Solution:** This is safe to ignore - migrations use `IF NOT EXISTS`

### Error: "permission denied"
- **Solution:** Ensure you're using the Supabase Dashboard (has full permissions)

### Error: "syntax error"
- **Solution:** Ensure entire migration file is copied, including all statements

---

## Next Steps After Migration

1. ✅ Verify all 19 tables created
2. ✅ Verify RLS enabled on all tables
3. ✅ Test authentication flow
4. ✅ Test asset creation
5. ✅ Get Supabase anon key for deployment
6. ✅ Deploy application

---

**Status:** ✅ Ready to apply  
**Recommended Method:** Option 1 (Combined file)  
**Estimated Time:** 2-5 minutes

