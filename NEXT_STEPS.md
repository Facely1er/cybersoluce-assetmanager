# Next Steps - Signal History & Data Imports

## ✅ Completed

1. ✅ Database migration created and ready
2. ✅ BackendSignalHistoryStore implemented
3. ✅ CSV import service created
4. ✅ SBOM upload service created
5. ✅ UI components created
6. ✅ Route added to app (`/imports`)
7. ✅ Navigation item added

## 🔧 Setup Required

### 1. Environment Variables

Create or update `.env.local` file:

```env
VITE_SUPABASE_URL=https://dfklqsdfycwjlcasfciu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRma2xxc2RmeWN3amxjYXNmY2l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzODA5OTcsImV4cCI6MjA3OTk1Njk5N30.OiaL5SkKnMlpdfW2Y2L-m2mzmCFA_LgpUq2-m8XF-yQ
VITE_HISTORY_STORE_MODE=backend
```

### 2. Run Migration

The migration has been run. Verify it completed successfully:

**Option A: Run verification script**
```bash
node scripts/verify-migration.mjs
```

**Option B: Run SQL queries**
Open: https://app.supabase.com/project/dfklqsdfycwjlcasfciu/sql/new

Run queries from `scripts/verify-migration.sql`

### 3. Restart Development Server

After setting environment variables:
```bash
npm run dev
```

## 🧪 Testing

### Test CSV Import

1. Navigate to: http://localhost:5173/imports (or your dev server URL)
2. Click on "CSV Asset Import" tab
3. Use the sample CSV file: `test-data/sample-assets.csv`
4. Enter a source label (e.g., "Test Import 2025-01-15")
5. Click "Import CSV"
6. Verify:
   - Success message shows asset count
   - Recent imports section shows the batch
   - Check database tables for data

### Test SBOM Upload

1. Navigate to: http://localhost:5173/imports
2. Click on "SBOM Upload" tab
3. Upload an SBOM file (SPDX or CycloneDX format)
4. Enter a source label (e.g., "Test SBOM Upload")
5. Enter or select asset IDs to link
6. Click "Upload SBOM"
7. Verify:
   - Success message shows component count
   - Recent imports section shows the batch
   - Check database for signal history

### Verify Signal History

After importing data, verify signal history is being recorded:

```sql
-- Check import batches
SELECT * FROM asset_import_batch ORDER BY created_at DESC LIMIT 5;

-- Check signal history
SELECT 
  asset_id,
  source,
  captured_at,
  jsonb_array_length(signals_json) as signal_count
FROM signal_history
ORDER BY captured_at DESC
LIMIT 10;
```

### Test Drift Analysis

After multiple imports, test drift analysis:

1. Import the same CSV twice with different data
2. Check drift hints in exports (CyberCaution, VendorSoluce, ERMITS Advisory)
3. Verify drift status reflects changes

## 📋 Verification Checklist

- [ ] Environment variables set in `.env.local`
- [ ] Migration verified (tables exist, RLS enabled, policies created)
- [ ] Development server restarted
- [ ] CSV import tested successfully
- [ ] SBOM upload tested successfully
- [ ] Data appears in database tables
- [ ] Recent imports section shows batches
- [ ] Signal history is being recorded
- [ ] Drift analysis works after multiple imports

## 🐛 Troubleshooting

### Import fails with "BackendSignalHistoryStore requires Supabase"
- Check `VITE_HISTORY_STORE_MODE=backend` is set
- Verify Supabase environment variables are correct
- Restart development server

### RLS policy violations
- Ensure users are authenticated
- Check RLS policies exist (run verification SQL)
- Verify policies allow the operation

### Tables don't exist
- Re-run migration in Supabase SQL Editor
- Check migration file: `migrations-ready/4-20250115000000_create_signal_history.sql`

### No data in tables after import
- Check browser console for errors
- Verify Supabase connection
- Check RLS policies allow inserts
- Verify `VITE_HISTORY_STORE_MODE=backend` is set

## 📚 Documentation

- Migration setup: `MIGRATION_SETUP.md`
- Migration verification: `MIGRATION_VERIFICATION.md`
- Signal Spine architecture: `docs/signal-spine-v1.md`

## 🎯 Access the Features

**Data Imports Page:** http://localhost:5173/imports

Or navigate via:
- Dashboard → Tools & Resources → Data Imports
- Direct URL: `/imports`

