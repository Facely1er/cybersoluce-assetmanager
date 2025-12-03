-- Verification Queries for Signal History Migration
-- Run these in Supabase SQL Editor: https://app.supabase.com/project/dfklqsdfycwjlcasfciu/sql/new

-- ============================================================================
-- 1. Check Tables Exist
-- ============================================================================
SELECT 
  table_name,
  CASE 
    WHEN table_name = 'asset_import_batch' THEN '✅ asset_import_batch table exists'
    WHEN table_name = 'signal_history' THEN '✅ signal_history table exists'
    ELSE '❌ Unexpected table'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('asset_import_batch', 'signal_history')
ORDER BY table_name;

-- ============================================================================
-- 2. Check Table Columns
-- ============================================================================
-- asset_import_batch columns
SELECT 
  'asset_import_batch' as table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'asset_import_batch'
ORDER BY ordinal_position;

-- signal_history columns
SELECT 
  'signal_history' as table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'signal_history'
ORDER BY ordinal_position;

-- ============================================================================
-- 3. Check Indexes
-- ============================================================================
SELECT 
  indexname,
  indexdef,
  CASE 
    WHEN indexname LIKE 'idx_signal_history%' THEN '✅ Signal history index'
    WHEN indexname LIKE '%asset_import_batch%' THEN '✅ Import batch index'
    ELSE 'ℹ️  Other index'
  END as status
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND (
    tablename IN ('asset_import_batch', 'signal_history')
    OR indexname LIKE 'idx_signal_history%'
  )
ORDER BY tablename, indexname;

-- ============================================================================
-- 4. Check RLS is Enabled
-- ============================================================================
SELECT 
  tablename,
  rowsecurity as rls_enabled,
  CASE 
    WHEN rowsecurity = true THEN '✅ RLS enabled'
    ELSE '❌ RLS not enabled'
  END as status
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('asset_import_batch', 'signal_history')
ORDER BY tablename;

-- ============================================================================
-- 5. Check RLS Policies
-- ============================================================================
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd as command,
  CASE 
    WHEN cmd = 'SELECT' THEN '✅ Read policy'
    WHEN cmd = 'INSERT' THEN '✅ Write policy'
    ELSE 'ℹ️  Other policy'
  END as status
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename IN ('asset_import_batch', 'signal_history')
ORDER BY tablename, cmd, policyname;

-- ============================================================================
-- 6. Check Foreign Key Constraint
-- ============================================================================
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  CASE 
    WHEN ccu.table_name = 'asset_import_batch' THEN '✅ Foreign key to asset_import_batch exists'
    ELSE '❌ Foreign key missing'
  END as status
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'signal_history'
  AND ccu.table_name = 'asset_import_batch';

-- ============================================================================
-- 7. Test Insert (Optional - creates test data)
-- ============================================================================
-- Uncomment to test insert functionality:
/*
INSERT INTO asset_import_batch (type, source_label, created_by)
VALUES ('csv-assets', 'VERIFICATION_TEST', 'verification-script')
RETURNING id, type, source_label, created_at;

-- Insert test signal history
INSERT INTO signal_history (asset_id, captured_at, source, signals_json, import_batch_id)
SELECT 
  'test-asset-001',
  NOW(),
  'cybersoluce',
  '[]'::jsonb,
  id
FROM asset_import_batch
WHERE source_label = 'VERIFICATION_TEST'
LIMIT 1
RETURNING id, asset_id, captured_at, source;

-- Clean up test data
DELETE FROM signal_history WHERE asset_id = 'test-asset-001';
DELETE FROM asset_import_batch WHERE source_label = 'VERIFICATION_TEST';
*/

-- ============================================================================
-- Summary
-- ============================================================================
SELECT 
  'Migration Verification Summary' as summary,
  (SELECT COUNT(*) FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('asset_import_batch', 'signal_history')) as tables_created,
  (SELECT COUNT(*) FROM pg_indexes 
   WHERE schemaname = 'public' 
   AND tablename IN ('asset_import_batch', 'signal_history')) as indexes_created,
  (SELECT COUNT(*) FROM pg_policies 
   WHERE schemaname = 'public'
   AND tablename IN ('asset_import_batch', 'signal_history')) as policies_created,
  (SELECT COUNT(*) FROM pg_tables 
   WHERE schemaname = 'public' 
   AND tablename IN ('asset_import_batch', 'signal_history')
   AND rowsecurity = true) as tables_with_rls;

