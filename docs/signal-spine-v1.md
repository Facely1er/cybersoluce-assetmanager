# Signal Spine v1 Architecture

## Overview

The ERMITS Ecosystem Signal Spine is a foundational layer that provides qualitative visibility and stability tracking over time. It serves as the backbone for signal-based intelligence across the ERMITS ecosystem, connecting CyberSoluce with specialized products like CyberCaution, VendorSoluce, and ERMITS Advisory.

## Core Principles

1. **No scores or posture in this layer.** The Signal Spine only describes visibility and signal changes, never risk posture, compliance status, or security scores.

2. **Only qualitative visibility and stability over time.** All outputs are text-based narratives describing how signals evolve, not numeric assessments.

3. **Consumers decide how to act.** CyberCaution, VendorSoluce, and ERMITS Advisory interpret the qualitative signals and make their own decisions about prioritization and action.

## Architecture Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        CyberSoluce                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Assets     │  │   Signals    │  │  Signal History      │  │
│  │              │→ │              │→ │  Store               │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│                                 ↓                                │
│                    ┌──────────────────────┐                     │
│                    │  Drift Analyzer      │                     │
│                    │  (analyzeSignalDrift)│                     │
│                    └──────────────────────┘                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
        ┌─────────────────────┼─────────────────────┐
        ↓                     ↓                     ↓
┌───────────────┐   ┌───────────────┐   ┌─────────────────────┐
│ CyberCaution  │   │ VendorSoluce  │   │  ERMITS Advisory    │
│               │   │               │   │                     │
│ Asset drift   │   │ Vendor drift  │   │  STEEL visibility   │
│ hints         │   │ hints         │   │  snapshot           │
└───────────────┘   └───────────────┘   └─────────────────────┘
```

## Components

### 1. Signal History Store

**Location:** `src/time/signalHistoryStore.ts`

**Purpose:** Pluggable interface for recording and retrieving signal snapshots over time.

**Key Features:**
- `InMemorySignalHistoryStore`: Development/testing implementation
- `BackendSignalHistoryStore`: Placeholder for future backend integration
- Factory pattern with environment variable configuration (`VITE_HISTORY_STORE_MODE`)

**Interface:**
```typescript
interface SignalHistoryStore {
  recordSnapshot(snapshot: SignalSnapshot): Promise<void>;
  getHistory(assetId: string, options?: { limit?: number; since?: string }): Promise<SignalHistory | null>;
}
```

**Contract:** `src/contracts/cyberSoluce.signalHistory.contract.ts`

### 2. Signal Drift Analyzer

**Location:** `src/time/signalDriftAnalyzer.ts`

**Purpose:** Analyzes signal history to derive visibility drift insights.

**Key Features:**
- Analyzes how signal types change over time
- Derives qualitative drift status (stable-visibility, emerging-change, increasing-uncertainty, high-variance)
- Builds supporting narratives without forbidden language

**Drift Statuses:**
- `no-history`: No historical data available
- `stable-visibility`: Signal types remain consistent
- `emerging-change`: New signal types appear
- `increasing-uncertainty`: Uncertainty-related signals increase
- `high-variance`: Signal types vary significantly between snapshots

**Contract:** `src/contracts/cyberSoluce.drift.contract.ts`

### 3. Export Adapters

#### CyberCaution Export

**Location:** `src/exports/toCyberCaution.ts`

**Purpose:** Exports ransomware-relevant assets and signals with drift hints.

**Output:**
- Filtered assets (ransomware-relevant)
- Filtered dependencies
- Filtered signals (ransomware domain)
- `driftHints`: Per-asset visibility drift hints

**Contract:** `src/contracts/cyberCaution.driftHint.contract.ts`

#### VendorSoluce Export

**Location:** `src/exports/toVendorSoluce.ts`

**Purpose:** Exports vendor-relevant assets and signals with vendor-level drift hints.

**Output:**
- Filtered assets (third-party services and vendor-related)
- Filtered dependencies (vendor relationships)
- Filtered signals (vendor domain)
- `driftHints`: Per-vendor visibility drift hints (aggregated from related assets)

**Contract:** `src/contracts/vendorSoluce.driftHint.contract.ts`

#### ERMITS Advisory Export

**Location:** `src/exports/toERMITSAdvisory.ts`

**Purpose:** Exports governance-relevant data with STEEL visibility snapshot.

**Output:**
- Filtered assets (governance-relevant)
- Filtered dependencies
- Filtered signals (governance domain)
- `steelVisibilitySnapshot`: Complete organizational visibility snapshot
  - Per-asset visibility summaries
  - Per-domain visibility summaries (privacy, ransomware, vendor, software-supply-chain)
  - Overall narrative (5-10 lines)

**Contract:** `src/contracts/ermitsAdvisory.steelVisibility.contract.ts`

## Data Flow

### 1. Signal Collection (CyberSoluce)

```
Assets → Signals → Signal Snapshots → Signal History Store
```

- Assets are enriched with qualitative signals
- Signals are captured as snapshots at points in time
- Snapshots are stored in the Signal History Store

### 2. Drift Analysis

```
Signal History → Drift Analyzer → Drift Insight
```

- History is retrieved for an asset
- `analyzeSignalDrift` analyzes signal type changes over time
- Returns qualitative drift insight with status and supporting narrative

### 3. Export Generation

```
Assets + Signals + History → Export Adapter → Export Payload
```

- Export adapters filter assets/signals for their domain
- Drift hints are generated using drift analyzer
- Export payload includes filtered data + drift hints/STEEL snapshot

## Language Guardrails

The Signal Spine enforces strict language rules to prevent risk scoring or posture language:

**Forbidden Keywords:**
- risk
- posture
- compliant / non-compliant
- secure / insecure
- trend
- score

**Allowed Language:**
- visibility
- signals
- stability
- change
- uncertainty
- variance
- observations

**Testing:** `src/__tests__/forbiddenLanguageSnapshot.test.ts` ensures all narrative builders and summaries never contain forbidden language.

## Contracts

All data structures are defined in contracts:

- `src/contracts/cyberSoluce.signalHistory.contract.ts` - Signal snapshots and history
- `src/contracts/cyberSoluce.drift.contract.ts` - Drift insights
- `src/contracts/cyberCaution.driftHint.contract.ts` - CyberCaution drift hints
- `src/contracts/vendorSoluce.driftHint.contract.ts` - VendorSoluce drift hints
- `src/contracts/ermitsAdvisory.steelVisibility.contract.ts` - STEEL visibility snapshot

## Testing

### Unit Tests

- `src/time/__tests__/signalDriftAnalyzer.test.ts` - Tests all drift scenarios
- `src/exports/__tests__/toCyberCaution.test.ts` - Smoke tests for CyberCaution export
- `src/exports/__tests__/toVendorSoluce.test.ts` - Smoke tests for VendorSoluce export
- `src/exports/__tests__/toERMITSAdvisory.test.ts` - Smoke tests for ERMITS Advisory export

### Language Regression Tests

- `src/__tests__/forbiddenLanguageSnapshot.test.ts` - Ensures no forbidden language in narratives

## CSV Import v1

### Format

CSV files can be imported to establish asset visibility and create initial signal history snapshots.

**Required Columns:**
- `asset_id` - Unique identifier for the asset
- `asset_name` - Name of the asset

**Optional Columns:**
- `asset_type` - Type of asset (Server, Database, Application, etc.)
- `business_role` - Business role or function (e.g., "payment-processing", "ehr-db")
- `vendor_name` - Vendor name if asset is linked to a third-party vendor
- `owner_team` - Team or owner responsible for the asset
- `environment` - Environment (e.g., "prod", "test", "staging")
- `critical_flag` - Criticality flag (descriptive only, not used for risk assessment)

### Import Process

1. CSV file is parsed using `parseCsvFile()` in `src/import/csvAssetImportService.ts`
2. Each row is mapped to an `Asset` using `mapCsvRowToAsset()`
3. Initial signals are generated using `buildInitialSignalsForCsvAsset()`:
   - Visibility establishment signal (exposure type)
   - Vendor dependency signal (if vendor_name provided)
4. Signal snapshot is recorded via `BackendSignalHistoryStore.recordSnapshot()`
5. Import batch is created in `asset_import_batch` table

### Example CSV

```csv
asset_id,asset_name,asset_type,business_role,vendor_name,owner_team,environment
asset-001,Payment Gateway,Application,payment-processing,Stripe,Finance Team,prod
asset-002,EHR Database,Database,clinical-records,,IT Team,prod
asset-003,CRM System,Application,customer-relationship,Salesforce,Sales Team,prod
```

### UI Component

The `CsvAssetImportPanel` component (`src/features/import/CsvAssetImportPanel.tsx`) provides a simple interface for:
- Uploading CSV files
- Providing source labels
- Viewing import results (asset count, vendor-linked assets)

## SBOM Upload

### Supported Formats

- **SPDX** (JSON or tag-value format)
- **CycloneDX** (JSON or XML format)

### Upload Process

1. SBOM file is parsed using `parseSBOMFile()` in `src/services/sbomUploadService.ts`
2. SBOM metadata is extracted to create `SBOMIntake`:
   - Format, tool name, generation timestamp
   - Component count, license information, dependency graph presence
3. Signals are generated using `buildSBOMSignals()`:
   - `software-composition-known` - Full composition with dependencies
   - `software-composition-partial` - Components listed but no dependency graph
   - `software-composition-unknown` - No SBOM data available
4. Signal snapshot is recorded for each linked asset
5. Import batch is created with type `sbom-upload`

### UI Component

The `SbomUploadPanel` component (`src/features/technoSoluce/SbomUploadPanel.tsx`) provides:
- SBOM file upload
- Asset linking (select from available assets or enter manually)
- Upload results (component count, linked assets)

## Future Enhancements

### Additional Export Adapters

New export adapters can be added following the same pattern:
1. Filter assets/signals for domain
2. Generate drift hints using `analyzeSignalDrift`
3. Return export payload with contract validation

## Related Documentation

- `docs/ecosystem-data-boundaries.md` - Data boundaries between ERMITS products
- Contract files in `src/contracts/` - Type definitions for all data structures

