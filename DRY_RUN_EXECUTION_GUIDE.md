# End-to-End Dry Run Execution Guide

This guide walks through the complete dry run process to verify the entire ERMITS pipeline works with real data.

## Pre-Flight Checklist

### Environment Variables
Ensure these are set in your `.env.local` or environment:
- `VITE_RUN_MODE=client`
- `VITE_HISTORY_STORE_MODE=backend`
- `VITE_SUPABASE_URL` (your Supabase project URL)
- `VITE_SUPABASE_ANON_KEY` (your Supabase anon key)

### Database Migrations
Verify these migrations are applied in Supabase:
- `20250115000000_create_signal_history.sql` (creates `signal_history` and `asset_import_batch` tables)

### Clear Test Data (Optional)
If you want a clean slate, consider clearing existing test data or using a new organization context.

---

## Step-by-Step Execution

### TODO 1: Import Initial CSV Assets

**File:** `test-data/dryrun_assets.csv`

1. Navigate to **Data Imports** → **CSV Assets** in the UI
2. Upload `dryrun_assets.csv`
3. Source label: `dry-run-csv`
4. Click **Import CSV**

**Verification:**
- ✅ Success message shows 10 assets imported
- ✅ Check Supabase: `asset_import_batch` table has new row with `source_label = 'dry-run-csv'`
- ✅ Check Supabase: `signal_history` table has 10 new rows (one per asset)
- ❌ **Do not fix anything yet** - we want to see the raw state

---

### TODO 2: Upload SBOMs to Trigger Drift

#### 2.1 Upload SBOM v1

**File:** `test-data/sbom-payments-core-api-v1.json`

1. Navigate to **TechnoSoluce** → **SBOM Upload**
2. Select asset: `payments-core-api`
3. Upload `sbom-payments-core-api-v1.json`
4. Source label: `sbom-v1`
5. Click **Upload SBOM**

**Verification:**
- ✅ Success message shows components recognized
- ✅ Check Supabase: New signal snapshot recorded for `payments-core-api`
- ✅ SBOM-derived signals attached
- ✅ Drift state should be `no-history` or equivalent (first snapshot)

#### 2.2 Upload SBOM v2 (Different Composition)

**File:** `test-data/sbom-payments-core-api-v2.json`

1. Navigate to **TechnoSoluce** → **SBOM Upload** again
2. Select asset: `payments-core-api`
3. Upload `sbom-payments-core-api-v2.json` (has different components)
4. Source label: `sbom-v2`
5. Click **Upload SBOM**

**Verification:**
- ✅ Second snapshot recorded
- ✅ Drift analysis shows `emerging-change` OR `high-variance`
- ✅ **No vulnerability, CVE, or score language anywhere**

---

### TODO 3: Force Asset Drift States

#### 3.1 Create "Stable Visibility" Assets

**File:** `test-data/dryrun_assets_v2.csv` (unchanged from v1, just re-import)

1. Navigate to **Data Imports** → **CSV Assets**
2. Upload `dryrun_assets_v2.csv` (same data as v1)
3. Source label: `dry-run-csv-v2`
4. Click **Import CSV**

**Expected:**
- ✅ Most assets become `stable-visibility`
- ✅ Especially infrastructure/simple services (e.g., `shared-file-server`, `email-gateway`)

#### 3.2 Create "Increasing Uncertainty"

**File:** `test-data/dryrun_assets_v2.csv` (modified: `shared-file-server` changed)

The v2 file already has `shared-file-server` with:
- `asset_type` changed to `Network` (was `Server`)
- `vendor_name` left blank (was blank)
- `owner_team` unchanged: `IT`

**Expected:**
- ✅ Signal history shows growing ambiguity
- ✅ Drift status becomes `increasing-uncertainty` for `shared-file-server`

#### 3.3 Create "High Variance"

**File Sequence:**
1. `dryrun_assets.csv` - `legacy-crm` has no vendor
2. `dryrun_assets_v3_legacy-crm.csv` - `legacy-crm` has owner `Sales`, no vendor
3. `dryrun_assets_v4_legacy-crm.csv` - `legacy-crm` has vendor `LegacySoft`
4. `dryrun_assets_v5_legacy-crm.csv` - `legacy-crm` has vendor removed again

**Steps:**
1. Import `dryrun_assets_v3_legacy-crm.csv` with source label `dry-run-csv-v3`
2. Import `dryrun_assets_v4_legacy-crm.csv` with source label `dry-run-csv-v4`
3. Import `dryrun_assets_v5_legacy-crm.csv` with source label `dry-run-csv-v5`

**Expected:**
- ✅ Drift status = `high-variance` for `legacy-crm`

---

### TODO 4: CyberSoluce Asset Verification

For each drift state asset, open **Asset Detail** view:

**Check:**
- ✅ "Visibility Over Time" text matches reality
- ✅ **No charts**
- ✅ **No scores**
- ✅ **No "improving / worsening" language**

**If this fails:** STOP and fix mapping — not UI copy.

---

### TODO 5: CyberCaution Scenario Pre-Check

Navigate to: `/cybercaution/precheck`

**Verify:**
- ✅ Assets grouped into:
  - Ready
  - Needs clarification
  - Unstable
  - No history
- ✅ `payments-core-api`: Ready OR Needs Clarification (depending on SBOM drift)
- ✅ Copy text is descriptive and calm (no risk language)

---

### TODO 6: VendorSoluce Visibility Watchlist

Navigate to: `/vendorsoluce/watchlist`

**Verify:**
- ✅ Vendors grouped:
  - Stable
  - Changing
  - Uncertain
  - No history
- ✅ `Acme Cloud` correctly aggregates:
  - `payments-core-api`
  - `supplier-portal`
- ✅ Visibility state makes sense given mixed inputs

---

### TODO 7: STEEL v3 Results → Scenario Brief

Navigate to **STEEL results view**.

**Verify:**
- ✅ Exposure band selected (manual is fine)
- ✅ Band narrative appears
- ✅ Ransomware Scenario Brief Panel renders

**Open Scenario Brief:**
- ✅ Anchor assets listed correctly
- ✅ Messy assets appear under "Requires clarification"
- ✅ Discussion prompts match exposure band

**Copy markdown:**
- ✅ Paste into editor
- ✅ Verify structure reads like a tabletop brief — not a report

---

### TODO 8: Export Pack Validation

If export enabled:

**Download:**
- Scenario Brief (.md)
- Export Pack (.json)

**Validate JSON:**
- ✅ Includes:
  - `readiness hints`
  - `drift hints`
  - `steel snapshot`
- ✅ Contains no forbidden language

---

### TODO 9: Failure Conditions Check

**You have failed the dry-run if any of the following occur:**

- ❌ Drift shown without multiple snapshots
- ❌ Demo data mixed into real history
- ❌ Any instance of:
  - "risk level"
  - "security posture"
  - "assessment"
  - "compliant / non-compliant"
- ❌ Scenario brief refers to conclusions instead of uncertainty

---

## ✅ EXIT CRITERIA (Non-Negotiable)

You can only say "ready" if:

✅ One CSV + 2 SBOM uploads result in:
- Asset drift
- Vendor drift
- Scenario readiness
- STEEL narrative
- Tabletop scenario brief

**Without code edits between steps.**

---

## Files Created for This Dry Run

- `test-data/dryrun_assets.csv` - Initial CSV import (10 assets)
- `test-data/dryrun_assets_v2.csv` - Re-import for stable visibility
- `test-data/dryrun_assets_v3_legacy-crm.csv` - First variation for legacy-crm
- `test-data/dryrun_assets_v4_legacy-crm.csv` - Second variation (adds vendor)
- `test-data/dryrun_assets_v5_legacy-crm.csv` - Third variation (removes vendor)
- `test-data/sbom-payments-core-api-v1.json` - Initial SBOM (3 components)
- `test-data/sbom-payments-core-api-v2.json` - Updated SBOM (5 components, different versions)

---

## Notes

- All steps should be performed in sequence without code changes
- If any step fails, document the failure and stop
- The goal is to prove the system works end-to-end with real, imperfect data
- No manual data fixes should be needed between steps

