# Post-Migration Verification Checklist

**Date**: December 4, 2025  
**Status**: Migrations Applied ✅

---

## ✅ Migration Application Confirmed

All 5 database migrations have been successfully applied to Supabase.

---

## 🔍 Verification Steps

### 1. Verify Tables Created

Check that all 19 tables exist in Supabase Table Editor:

#### Core Tables (4)
- [ ] `profiles`
- [ ] `assets`
- [ ] `asset_relationships`
- [ ] `asset_vulnerabilities`

#### Signal History (2)
- [ ] `asset_import_batch`
- [ ] `signal_history`

#### Dependency Manager Features (9)
- [ ] `mitigation_actions`
- [ ] `business_functions`
- [ ] `business_impacts`
- [ ] `continuity_plans`
- [ ] `nist_controls`
- [ ] `nist_mappings`
- [ ] `nist_assessments`
- [ ] `framework_phases`
- [ ] `risks`

#### Reports (1)
- [ ] `reports`

#### Organizations (3)
- [ ] `organizations`
- [ ] `organization_members`
- [ ] `invitations`

---

### 2. Verify Row Level Security (RLS)

Check that RLS is enabled on all tables:

1. Go to Supabase Dashboard → Authentication → Policies
2. Verify RLS is enabled for all 19 tables
3. Verify policies exist for authenticated users

**Quick Check Query**:
```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

---

### 3. Verify Indexes

Check that indexes were created:

**Quick Check Query**:
```sql
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

Expected indexes:
- All foreign key columns should have indexes
- Frequently queried columns should have indexes
- Composite indexes for time-series queries (signal_history)

---

### 4. Verify Foreign Keys

Check that foreign key relationships are correct:

**Quick Check Query**:
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

### 5. Test Basic Operations

#### Test Asset Creation
```sql
-- This should work if RLS is properly configured
INSERT INTO assets (name, type, user_id)
VALUES ('Test Asset', 'Application', auth.uid())
RETURNING *;
```

#### Test Signal History
```sql
-- Create a test import batch
INSERT INTO asset_import_batch (type, source_label)
VALUES ('csv-assets', 'Test Import')
RETURNING *;

-- Create a test signal history entry
INSERT INTO signal_history (asset_id, captured_at, source, signals_json, import_batch_id)
VALUES (
  'test-asset-1',
  now(),
  'cybersoluce',
  '{"test": "signal"}'::jsonb,
  (SELECT id FROM asset_import_batch LIMIT 1)
)
RETURNING *;
```

---

### 6. Verify Triggers

Check that updated_at triggers are working:

**Quick Check Query**:
```sql
SELECT 
  trigger_name,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;
```

Expected triggers:
- `handle_assets_updated_at`
- `handle_asset_relationships_updated_at`
- `handle_asset_vulnerabilities_updated_at`
- `handle_reports_updated_at`
- `handle_organizations_updated_at`
- `update_mitigation_actions_updated_at`
- `update_business_functions_updated_at`
- `update_business_impacts_updated_at`
- `update_continuity_plans_updated_at`
- `update_nist_controls_updated_at`
- `update_nist_mappings_updated_at`
- `update_nist_assessments_updated_at`
- `update_framework_phases_updated_at`
- `update_risks_updated_at`

---

## 🧪 Functional Testing

### Test Service Layer Connections

Once the application is running, test that services can connect:

1. **Asset Service**
   - Create a test asset
   - Verify it appears in the database
   - Verify RLS is working (only your assets visible)

2. **Mitigation Service**
   - Create a test mitigation action
   - Verify it's saved to `mitigation_actions` table

3. **Business Impact Service**
   - Create a test business function
   - Create a test business impact
   - Verify relationships are correct

4. **NIST Service**
   - Create a test NIST control
   - Create a test NIST mapping
   - Verify data is saved correctly

5. **Signal History Service**
   - Import a CSV file
   - Verify `asset_import_batch` record is created
   - Verify `signal_history` records are created

---

## 🚨 Common Issues & Solutions

### Issue: RLS Policies Too Restrictive
**Symptom**: Cannot insert/update data even when authenticated
**Solution**: Check that policies use `auth.uid()` correctly and allow authenticated users

### Issue: Foreign Key Violations
**Symptom**: Cannot insert data due to foreign key constraints
**Solution**: Ensure parent records exist before inserting child records

### Issue: Missing Indexes
**Symptom**: Slow queries
**Solution**: Re-run migration or manually create missing indexes

### Issue: Triggers Not Firing
**Symptom**: `updated_at` timestamps not updating
**Solution**: Verify triggers are created and function exists

---

## ✅ Success Criteria

All migrations are successfully applied if:

- [x] All 19 tables exist
- [ ] RLS is enabled on all tables
- [ ] Policies allow authenticated users to access their data
- [ ] Indexes are created on foreign keys
- [ ] Foreign key relationships are correct
- [ ] Triggers are working (updated_at updates automatically)
- [ ] Test inserts work without errors
- [ ] Service layer can connect and perform CRUD operations

---

## 📝 Next Steps

After verification:

1. ✅ **Migrations Applied** - Complete
2. ⏳ **Get Supabase Credentials** - Next step
3. ⏳ **Deploy to Netlify**
4. ⏳ **Set Environment Variables**
5. ⏳ **Configure Authentication**
6. ⏳ **Test Deployment**

---

**Verification Date**: December 4, 2025  
**Status**: ✅ Migrations Applied - Ready for Verification

