# ✅ End-to-End Dry Run Checklist
## CyberSoluce → CyberCaution → VendorSoluce → STEEL → Scenario Brief

**Purpose**  
Validate that a single real data flow produces coherent outcomes across the entire ecosystem **without code changes**.

This is not a demo checklist.  
This is a **production behavior validation**.

---

## 0. Preconditions (MANDATORY)

- [ ] `VITE_RUN_MODE=client`
- [ ] `VITE_HISTORY_STORE_MODE=backend`
- [ ] Supabase migrations applied:
  - [ ] `signal_history`
  - [ ] `asset_import_batch`
- [ ] Clean org context (no legacy demo data)
- [ ] No feature flags accidentally enabling demo behavior

❌ If any item fails → STOP.

---

## 1. CSV Asset Import (Dirty Data)

### 1.1 CSV file created

File: `dryrun_assets.csv`

- [ ] At least 10 assets
- [ ] Intentional imperfections:
  - [ ] Inconsistent vendor names
  - [ ] Missing owners
  - [ ] Mixed asset types
  - [ ] Blank vendor rows

Required columns:
assetId,name,assetType,environment,owner,vendor

yaml
Copy code

---

### 1.2 CSV imported via UI

- [ ] Navigate: **Data Imports → CSV Assets**
- [ ] Upload `dryrun_assets.csv`
- [ ] Source label: `dry-run-csv`

✅ Verify (DB):
- [ ] `asset_import_batch` row created
- [ ] Initial `signal_history` snapshot created per asset

❌ No manual corrections allowed.

---

## 2. SBOM Uploads (Time-Based Change)

### 2.1 Select anchor asset

Chosen asset:
- [ ] `payments-core-api` (or equivalent mission-critical asset)

---

### 2.2 SBOM Upload – v1

- [ ] Navigate: **TechnoSoluce → SBOM Upload**
- [ ] Upload SBOM v1 (small component set)
- [ ] Source label: `sbom-v1`

✅ Verify:
- [ ] Snapshot recorded
- [ ] SBOM-derived signals attached
- [ ] No CVE / vulnerability language appears anywhere

---

### 2.3 SBOM Upload – v2

- [ ] Upload SBOM v2 (different composition or dependencies)
- [ ] Source label: `sbom-v2`

✅ Verify:
- [ ] New snapshot recorded
- [ ] Drift detected (`emerging-change` or `high-variance`)
- [ ] Still no security evaluation language

---

## 3. Force Drift States (Controlled Manipulation)

### 3.1 Stable Visibility

- [ ] Re-import CSV unchanged
- [ ] Source label: `dry-run-csv-v2`

✅ Expected:
- [ ] Majority of assets → `stable-visibility`

---

### 3.2 Increasing Uncertainty

Target asset:
- [ ] `shared-file-server` (or equivalent)

Changes:
- [ ] assetType changed
- [ ] owner changed or removed
- [ ] vendor blank

✅ Expected:
- [ ] Drift status → `increasing-uncertainty`

---

### 3.3 High Variance

Target asset:
- [ ] `legacy-crm` (or equivalent)

Sequence:
- [ ] Import with vendor
- [ ] Import without vendor
- [ ] Import with different vendor

✅ Expected:
- [ ] Drift status → `high-variance`

---

## 4. CyberSoluce Asset Detail Verification

For **each drift state asset**:

- [ ] Open Asset Detail view
- [ ] “Visibility Over Time” text matches reality
- [ ] No charts
- [ ] No scores
- [ ] No trend language (improving/worsening)

❌ If mismatch occurs → fix mapping logic, not copy.

---

## 5. CyberCaution Scenario Pre-Check

- [ ] Navigate: `/cybercaution/precheck`

✅ Verify:
- [ ] Assets sorted into:
  - Ready  
  - Needs clarification  
  - Unstable  
  - No history
- [ ] `payments-core-api` lands logically
- [ ] SBOM and vendor indicators make sense

---

## 6. VendorSoluce Visibility Watchlist

- [ ] Navigate: `/vendorsoluce/watchlist`

✅ Verify:
- [ ] Vendors grouped into:
  - Stable
  - Changing
  - Uncertain
  - No history
- [ ] Vendors aggregate multiple assets correctly
- [ ] Naming inconsistencies do not duplicate vendors incorrectly

---

## 7. STEEL v3 Results & Scenario Brief

- [ ] Navigate to STEEL results view
- [ ] Exposure band selected (manual acceptable)

✅ Verify:
- [ ] Band narrative renders correctly
- [ ] No assessment/posture language
- [ ] **Ransomware Scenario Brief Panel appears**

Scenario Brief:
- [ ] Anchor assets look plausible
- [ ] Unstable assets called out explicitly
- [ ] Prompts match exposure band
- [ ] Markdown reads like a tabletop brief

---

## 8. Export Pack (If Enabled)

- [ ] Download Scenario Brief (.md)
- [ ] Download Export Pack (.json)

✅ Validate:
- [ ] JSON contains:
  - readiness hints
  - drift hints
  - STEEL snapshot
- [ ] No forbidden terms found in files

---

## 9. Forbidden Language Scan (MANDATORY)

Search across:
- UI  
- Markdown exports  
- JSON exports  

Forbidden terms:
- [ ] risk level
- [ ] security posture
- [ ] assessment
- [ ] audit
- [ ] compliant / non-compliant
- [ ] score / rating
- [ ] maturity

❌ Any occurrence = FAILURE.

---

## ✅ Final Exit Criteria

This dry run **passes only if**:

- [ ] One CSV import + two SBOM uploads produce:
  - Asset drift
  - Vendor drift
  - Scenario readiness
  - STEEL narrative
  - Scenario Brief
- [ ] No manual edits between steps
- [ ] No forbidden language anywhere
- [ ] System behavior feels credible under messy data

If all boxes are checked, the system is **demo-safe, sales-safe, and advisory-safe**.

---

_End of checklist._