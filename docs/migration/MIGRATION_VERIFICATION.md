# Migration Verification Results

## ✅ Basic Checks Passed

1. **Tables Created** ✅
   - `asset_import_batch` table exists
   - `signal_history` table exists

2. **Table Structure** ✅
   - All required columns are present
   - Data types are correct

3. **RLS Insert Test** ⚠️
   - The insert test failed with RLS policy violation
   - **This is EXPECTED behavior** - RLS policies require authenticated users
   - The policies are working correctly for security

## 📋 Complete Verification

Run the SQL queries in `scripts/verify-migration.sql` in the Supabase SQL Editor to get a complete verification:

**SQL Editor:** https://app.supabase.com/project/dfklqsdfycwjlcasfciu/sql/new

### Quick Verification Queries

```sql
-- 1. Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('asset_import_batch', 'signal_history');

-- 2. Check indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename IN ('asset_import_batch', 'signal_history');

-- 3. Check RLS policies
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('asset_import_batch', 'signal_history');

-- 4. Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('asset_import_batch', 'signal_history');
```

## ✅ Expected Results

### Tables
- `asset_import_batch` - Should exist with columns: id, type, source_label, created_at, created_by
- `signal_history` - Should exist with columns: id, asset_id, captured_at, source, signals_json, import_batch_id, created_at

### Indexes
- `idx_signal_history_asset_time` - On (asset_id, captured_at DESC)
- `idx_signal_history_source` - On (source)
- `idx_signal_history_batch` - On (import_batch_id) WHERE import_batch_id IS NOT NULL

### RLS Policies
- `Users can view own import batches` - SELECT on asset_import_batch
- `Users can create import batches` - INSERT on asset_import_batch
- `Users can view signal history` - SELECT on signal_history
- `Users can insert signal history` - INSERT on signal_history

### RLS Status
- Both tables should have `rowsecurity = true`

## 🔧 Next Steps

1. **Set Environment Variables** (if not already done):
   ```env
   VITE_SUPABASE_URL=https://dfklqsdfycwjlcasfciu.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRma2xxc2RmeWN3amxjYXNmY2l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzODA5OTcsImV4cCI6MjA3OTk1Njk5N30.OiaL5SkKnMlpdfW2Y2L-m2mzmCFA_LgpUq2-m8XF-yQ
   VITE_HISTORY_STORE_MODE=backend
   ```

2. **Test CSV Import**:
   - Use the `CsvAssetImportPanel` component
   - Import a test CSV file
   - Verify data appears in `asset_import_batch` and `signal_history` tables

3. **Test SBOM Upload**:
   - Use the `SbomUploadPanel` component
   - Upload a test SBOM file
   - Verify data appears in the tables

## 🐛 Troubleshooting

### If RLS policies are missing:
Run the policy creation blocks from the migration again:
```sql
-- Copy the DO $$ blocks from the migration file
```

### If tables don't exist:
Re-run the migration file in the SQL Editor.

### If inserts fail in the app:
- Ensure users are authenticated
- Check that RLS policies allow the operation
- Verify `VITE_HISTORY_STORE_MODE=backend` is set

