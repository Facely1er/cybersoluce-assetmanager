# Testing Guide - Data Imports & Signal History

## Quick Start

1. **Set Environment Variables** (`.env.local`):
   ```env
   VITE_SUPABASE_URL=https://dfklqsdfycwjlcasfciu.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRma2xxc2RmeWN3amxjYXNmY2l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzODA5OTcsImV4cCI6MjA3OTk1Njk5N30.OiaL5SkKnMlpdfW2Y2L-m2mzmCFA_LgpUq2-m8XF-yQ
   VITE_HISTORY_STORE_MODE=backend
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Access Data Imports Page**:
   - URL: http://localhost:5173/imports
   - Or: Dashboard → Tools & Resources → Data Imports

## Test CSV Import

### Step 1: Prepare Test CSV

Use the sample file: `test-data/sample-assets.csv`

Or create your own with this format:
```csv
asset_id,asset_name,asset_type,business_role,vendor_name,owner_team,environment
asset-001,Test Server,Server,web-hosting,,IT Team,prod
asset-002,Test Database,Database,data-storage,,IT Team,prod
```

### Step 2: Import CSV

1. Go to `/imports` page
2. Click "CSV Asset Import" tab
3. Enter source label: "Test Import 2025-01-15"
4. Select CSV file
5. Click "Import CSV"
6. Verify success message shows asset count

### Step 3: Verify in Database

Run in Supabase SQL Editor:
```sql
-- Check import batch was created
SELECT * FROM asset_import_batch 
WHERE source_label LIKE '%Test%' 
ORDER BY created_at DESC 
LIMIT 1;

-- Check signal history was recorded
SELECT 
  asset_id,
  source,
  captured_at,
  jsonb_array_length(signals_json) as signal_count
FROM signal_history
WHERE source = 'cybersoluce'
ORDER BY captured_at DESC
LIMIT 10;
```

## Test SBOM Upload

### Step 1: Prepare Test SBOM

Create a minimal SPDX JSON file (`test-sbom.json`):
```json
{
  "spdxVersion": "SPDX-2.3",
  "dataLicense": "CC0-1.0",
  "SPDXID": "SPDXRef-DOCUMENT",
  "name": "Test SBOM",
  "creationInfo": {
    "created": "2025-01-15T00:00:00Z",
    "creators": ["Tool: Test-SBOM-Generator"]
  },
  "packages": [
    {
      "SPDXID": "SPDXRef-Package-1",
      "name": "test-package",
      "versionInfo": "1.0.0"
    }
  ]
}
```

### Step 2: Upload SBOM

1. Go to `/imports` page
2. Click "SBOM Upload" tab
3. Enter source label: "Test SBOM Upload"
4. Upload SBOM file
5. Enter asset ID (or select from dropdown if assets exist)
6. Click "Upload SBOM"
7. Verify success message shows component count

### Step 3: Verify in Database

```sql
-- Check SBOM import batch
SELECT * FROM asset_import_batch 
WHERE type = 'sbom-upload'
ORDER BY created_at DESC 
LIMIT 1;

-- Check signal history with technosoluce source
SELECT 
  asset_id,
  source,
  captured_at,
  signals_json
FROM signal_history
WHERE source = 'technosoluce'
ORDER BY captured_at DESC
LIMIT 5;
```

## Test Drift Analysis

### Step 1: Import Same Assets Multiple Times

1. Import CSV with assets (first import)
2. Wait a few seconds
3. Import CSV again with same assets but different data (second import)
4. This creates multiple snapshots for drift analysis

### Step 2: Verify Drift

The drift analyzer will detect changes between snapshots:

```sql
-- Check history for an asset
SELECT 
  asset_id,
  captured_at,
  source,
  jsonb_array_length(signals_json) as signal_count
FROM signal_history
WHERE asset_id = 'asset-001'
ORDER BY captured_at ASC;
```

### Step 3: Test Export with Drift Hints

After multiple imports, test exports:
- CyberCaution export should include drift hints
- VendorSoluce export should include vendor drift hints
- ERMITS Advisory export should include STEEL visibility snapshot

## Verification Queries

### Check Import Batches
```sql
SELECT 
  id,
  type,
  source_label,
  created_at,
  created_by
FROM asset_import_batch
ORDER BY created_at DESC;
```

### Check Signal History
```sql
SELECT 
  asset_id,
  COUNT(*) as snapshot_count,
  MIN(captured_at) as first_snapshot,
  MAX(captured_at) as last_snapshot
FROM signal_history
GROUP BY asset_id
ORDER BY snapshot_count DESC;
```

### Check Signal Types Over Time
```sql
SELECT 
  asset_id,
  captured_at,
  jsonb_array_elements(signals_json)->>'signalType' as signal_type
FROM signal_history
WHERE asset_id = 'asset-001'
ORDER BY captured_at ASC;
```

## Expected Results

### After CSV Import
- ✅ Import batch created in `asset_import_batch`
- ✅ Signal snapshots created in `signal_history` (one per asset)
- ✅ Signals include: visibility establishment + vendor dependency (if vendor_name provided)
- ✅ Source = 'cybersoluce'

### After SBOM Upload
- ✅ Import batch created with type = 'sbom-upload'
- ✅ Signal snapshots created in `signal_history`
- ✅ Signals include: software-composition-known or software-composition-partial
- ✅ Source = 'technosoluce'

### After Multiple Imports
- ✅ Multiple snapshots per asset
- ✅ Drift analysis detects changes
- ✅ Export adapters include drift hints
- ✅ Drift status reflects signal changes over time

## Troubleshooting

### Import fails silently
- Check browser console for errors
- Verify Supabase connection
- Check `VITE_HISTORY_STORE_MODE=backend` is set
- Verify RLS policies allow inserts

### No data in database
- Check migration was run successfully
- Verify tables exist
- Check RLS policies
- Verify environment variables

### Drift analysis shows "no-history"
- Ensure multiple snapshots exist for the asset
- Check snapshots are not all from 'demo' source
- Verify snapshots have different captured_at timestamps

