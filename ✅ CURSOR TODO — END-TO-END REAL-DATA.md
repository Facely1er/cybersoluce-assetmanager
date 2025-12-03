✅ CURSOR TODO — END-TO-END REAL-DATA DRY RUN
CyberSoluce → CyberCaution → VendorSoluce → STEEL → Scenario Brief

GOAL:
Prove that one real import produces coherent outcomes across every layer without fixing things by hand.

## ✅ PREPARATION COMPLETE

All test files have been created and are ready for the dry run:

**CSV Files:**
- `test-data/dryrun_assets.csv` - Initial import (10 assets with intentional imperfections)
- `test-data/dryrun_assets_v2.csv` - Re-import for stable visibility testing
- `test-data/dryrun_assets_v3_legacy-crm.csv` - First variation for high-variance testing
- `test-data/dryrun_assets_v4_legacy-crm.csv` - Second variation (adds vendor)
- `test-data/dryrun_assets_v5_legacy-crm.csv` - Third variation (removes vendor)

**SBOM Files:**
- `test-data/sbom-payments-core-api-v1.json` - Initial SBOM (3 components)
- `test-data/sbom-payments-core-api-v2.json` - Updated SBOM (5 components, different versions)

**Documentation:**
- `DRY_RUN_EXECUTION_GUIDE.md` - Complete step-by-step execution guide

**Next Steps:**
1. Verify environment variables are set (VITE_RUN_MODE=client, VITE_HISTORY_STORE_MODE=backend)
2. Ensure Supabase migrations are applied
3. Follow the execution guide to perform the dry run

TODO 0 — Preconditions (do first, no code)

 Ensure environment:

VITE_RUN_MODE=client

VITE_HISTORY_STORE_MODE=backend

 Confirm Supabase migrations applied:

signal_history

asset_import_batch

 Clear existing test/demo data (new org context preferred)

TODO 1 — Create Dirty, Realistic CSV Asset File
1.1 Create CSV file

Filename: dryrun_assets.csv

Minimum 10 rows with intentional imperfections.

Required columns:

assetId,name,assetType,environment,owner,vendor


Example rows:

assetId,name,assetType,environment,owner,vendor
payments-core-api,Payments Core API,Application,prod,,Acme Cloud
payments-worker,Payment Background Worker,Application,prod,FinOps,ACME CLOUD
idp-main,Identity Provider,Service,prod,Security,Okta
ehr-db-primary,EHR Database,Database,prod,,HealthData Inc
ehr-api,EHR API,Application,prod,AppTeam,HealthData-Inc
shared-file-server,Shared File Server,Server,prod,IT,
legacy-crm,Legacy CRM,Application,prod,,LegacySoft
supplier-portal,Supplier Portal,Application,prod,,Acme Cloud
build-pipeline,CI Pipeline,Pipeline,prod,DevOps,
email-gateway,Email Gateway,Service,prod,IT,MailCo


✅ Purpose: vendor naming collisions, missing owners, mixed asset types.

1.2 Import CSV via UI

Navigate to Data Imports → CSV Assets

Upload dryrun_assets.csv

Source label: dry-run-csv

✅ Verify:

asset_import_batch contains new batch

signal_history contains initial snapshots per asset

❌ Do not “fix” anything yet.

TODO 2 — Upload SBOMs (force time-based change)
2.1 Select anchor asset

Choose:

payments-core-api

2.2 Upload SBOM v1

Navigate to TechnoSoluce → SBOM Upload

Select asset: payments-core-api

Upload small SBOM (few components)

Source label: sbom-v1

✅ Verify:

Signal snapshot recorded

SBOM-derived signals attached

Drift state should still be no-history or equivalent until next snapshot

2.3 Upload SBOM v2 (different composition)

Upload SBOM again:

Different components OR different transitive dependencies

Source label: sbom-v2

✅ Verify:

Second snapshot recorded

Drift analysis shows emerging-change OR high-variance

No vulnerability, CVE, score language anywhere

TODO 3 — Force Asset Drift States

You now deliberately manipulate inputs.

3.1 Create “stable visibility” asset

Re-import dryrun_assets.csv unchanged

Same source label or dry-run-csv-v2

✅ Expected:

Most assets become stable-visibility

Especially infrastructure/simple services

3.2 Create “increasing uncertainty”

For shared-file-server:

Re-import CSV with:

assetType changed

vendor left blank

Owner changed

✅ Expected:

Signal history shows growing ambiguity

Drift status becomes increasing-uncertainty

3.3 Create “high variance”

For legacy-crm:

First import: vendor blank

Second import: vendor set

Third import: vendor removed

✅ Expected:

Drift status = high-variance

TODO 4 — CyberSoluce Asset Verification

For each drift state asset:

Open Asset Detail

Confirm:

“Visibility Over Time” text matches reality

No charts

No scores

No “improving / worsening” language

If this fails, STOP and fix mapping — not UI copy.

TODO 5 — CyberCaution Scenario Pre-Check

Navigate to:

/cybercaution/precheck


✅ Verify:

Assets grouped into:

Ready

Needs clarification

Unstable

No history

payments-core-api:

Ready OR Needs Clarification (depending on SBOM drift)

Copy text is descriptive and calm

TODO 6 — VendorSoluce Visibility Watchlist

Navigate to:

/vendorsoluce/watchlist


✅ Verify:

Vendors grouped:

Stable

Changing

Uncertain

No history

Acme Cloud correctly aggregates:

payments-core-api

supplier-portal

Visibility state makes sense given mixed inputs

TODO 7 — STEEL v3 Results → Scenario Brief

Navigate to STEEL results view.

✅ Verify:

Exposure band selected (manual is fine)

Band narrative appears

Ransomware Scenario Brief Panel renders

✅ Open Scenario Brief:

Anchor assets listed correctly

Messy assets appear under “Requires clarification”

Discussion prompts match exposure band

✅ Copy markdown

Paste into editor

Verify structure reads like a tabletop brief — not a report

TODO 8 — Export Pack Validation

If export enabled:

Download:

Scenario Brief (.md)

Export Pack (.json)

✅ Validate JSON:

Includes:

readiness hints

drift hints

steel snapshot

Contains no forbidden language

TODO 9 — Failure Conditions (must confirm)

You have failed the dry-run if any of the following occur:

Drift shown without multiple snapshots

Demo data mixed into real history

Any instance of:

“risk level”

“security posture”

“assessment”

“compliant / non-compliant”

Scenario brief refers to conclusions instead of uncertainty

✅ EXIT CRITERIA (non-negotiable)

You can only say “ready” if:

One CSV + 2 SBOM uploads result in:

Asset drift

Vendor drift

Scenario readiness

STEEL narrative

Tabletop scenario brief

Without code edits between steps