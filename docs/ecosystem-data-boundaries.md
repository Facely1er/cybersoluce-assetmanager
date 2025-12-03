# Ecosystem Data Boundaries

## Overview

This document defines the data contract boundaries for CyberSoluce within the ERMITS ecosystem. It specifies what CyberSoluce can emit, what it explicitly cannot, and the ownership of interpretation across products.

**Critical Principle**: CyberSoluce never imports data back from other ERMITS products. All data flow is one-way: CyberSoluce → Other Products.

---

## What CyberSoluce Can Emit

CyberSoluce exports **factual data** and **qualitative descriptors** only. It does NOT export:

- Risk scores or ratings
- Compliance status or maturity assessments
- Posture evaluations
- Remediation recommendations
- Gap analyses

### Exportable Data Types

1. **Assets** (`CyberSoluceAssetContract`)
   - Factual attributes: ID, name, type, owner, location, status
   - Data classification (factual, not compliance status)
   - Encryption status (factual)
   - Compliance framework names (factual references, not compliance status)
   - Timestamps (created, updated, last assessed)

2. **Dependencies** (`CyberSoluceDependencyContract`)
   - Relationship types (factual)
   - Relationship strength (qualitative descriptor, not risk)
   - Data flow direction (factual)
   - Personal data indicators (factual boolean)

3. **Signals** (`CyberSoluceSignalContract`)
   - Signal type: exposure, dependency, change, uncertainty
   - Signal domain: privacy, ransomware, vendor, software, governance
   - Confidence level (qualitative descriptor)
   - Source: user, import, inferred
   - Affected asset IDs (factual)

4. **Signal History** (`SignalHistory`, `SignalSnapshot`)
   - Time-series snapshots of signals per asset
   - Point-in-time captures of signal state
   - Source system identifier (cybersoluce, technosoluce, vendorsoluce, cybercaution, demo)
   - ISO timestamps for observation windows
   - Used to derive visibility drift insights

5. **Drift Insights** (`DriftInsight`)
   - Qualitative drift status: no-history, stable-visibility, emerging-change, increasing-uncertainty, high-variance
   - Observation window (start/end timestamps)
   - Supporting narrative (text-only, no charts/dashboards)
   - Describes how visibility/signals change over time, NOT risk trends or posture

6. **Export Manifest** (`CyberSoluceExportManifest`)
   - Export metadata
   - Handoff intent
   - Next question prompt (UX guidance)

---

## What CyberSoluce Explicitly Cannot Emit

The following fields and concepts are **forbidden** in all exports:

### Forbidden Keywords

- `score` / `rating` / `riskScore` / `riskRating`
- `compliance` / `compliant` / `complianceScore` / `complianceStatus`
- `gap` / `gapAnalysis`
- `maturity` / `maturityLevel` / `maturityScore`
- `posture` / `postureScore`
- `trend` / `trend score` / `risk trend` (drift-related forbidden keywords)
- `improving` / `worsening` (risk trend language)
- `heatmap` (visual trend representation)
- `cve` / `vulnerability` / `vulnerabilities` (SBOM-related, belongs to TechnoSoluce)
- `severity` / `exploit` / `exploits` / `patch` / `patches` (SBOM-related)
- `secure` / `insecure` / `security` (SBOM-related interpretations)

### Forbidden Concepts

- Risk assessments or risk levels
- Compliance status (compliant/non-compliant)
- Maturity assessments
- Gap analyses
- Posture evaluations
- Remediation recommendations
- Priority rankings based on risk
- Risk trends or trend scores
- Visual trend representations (charts, heatmaps, dashboards)

**Enforcement**: The `contractGuard.ts` runtime guard automatically blocks any payload containing these forbidden keywords.

---

## Change-Over-Time (Visibility Drift)

### Overview

CyberSoluce tracks how qualitative signals evolve over time per asset. This enables **change-over-time intelligence** as a thin domain layer that derives "visibility drift" insights.

**Critical Principle**: Drift insights describe how our picture of an asset changes, not how "safe" or "compliant" it is.

### What Change-Over-Time Tracks

- **Signal History**: Time-series snapshots of signals per asset
- **Visibility Drift**: How signal types and patterns change over time
- **Observation Windows**: Start and end timestamps for analysis periods

### What Change-Over-Time Does NOT Track

- ❌ Risk scores or risk trends
- ❌ Posture improvements or degradations
- ❌ Compliance status changes
- ❌ Visual trend representations (charts, heatmaps, dashboards)

### Drift Status Types

1. **`no-history`**: No historical visibility data available
2. **`stable-visibility`**: Signal types have remained broadly consistent
3. **`emerging-change`**: New types of signals have appeared in recent observations
4. **`increasing-uncertainty`**: Uncertainty-related signals have increased over time
5. **`high-variance`**: Signal types have changed significantly between observations

### Language Rules

**✅ Allowed Language:**
- "Visibility has been broadly stable across observations"
- "Recent changes in how this asset appears in your landscape"
- "Signals indicate growing uncertainty around this asset"
- "Signal types have varied significantly over time"

**❌ Forbidden Language:**
- "Risk is trending upward/downward"
- "Posture is improving/worsening"
- "Compliance status is degrading"
- "Security score trend: 7.5 → 8.2"

### Implementation

- **History Store**: `src/time/signalHistoryStore.ts` - Pluggable store interface (in-memory by default)
- **Drift Analyzer**: `src/time/signalDriftAnalyzer.ts` - Analyzes signal history to derive drift insights
- **Contracts**: `cyberSoluce.signalHistory.contract.ts`, `cyberSoluce.drift.contract.ts`
- **UI Surface**: Text-based hints and micro-insights only (no charts/dashboards)

### Demo Data Exclusion

**Critical**: Demo flows do NOT record signal snapshots. Change-over-time insights require real operational data. Demo snapshots are explicitly filtered out from drift analysis.

---

## Product Ownership Table

Each ERMITS product owns the interpretation of CyberSoluce data within its domain:

| Product | Ownership | What They Interpret |
|---------|-----------|---------------------|
| **CyberCorrect** | Privacy interpretation | Privacy impact analysis, data protection compliance, GDPR/CCPA implications |
| **CyberCaution** | Threat & scenario interpretation | Ransomware readiness, attack path analysis, threat surface mapping, visibility drift hints |
| **VendorSoluce** | Third-party interpretation | Vendor risk assessment, third-party dependency analysis, vendor relationship management |
| **TechnoSoluce** | Software/SBOM interpretation | Component risk analysis, software dependency mapping, vulnerability correlation, SBOM ingestion and analysis |
| **ERMITS Advisory** | Governance interpretation | Compliance framework mapping, governance structure analysis, organizational risk |

---

## CyberCaution Visibility Drift Hints

### Overview

CyberCaution exports include **visibility drift hints** that describe how asset visibility has changed over time. These hints help CyberCaution prioritize which assets to include in scenarios, tabletop exercises, and investigations.

### What CyberCaution Receives

- **Drift Hints** (`CyberCautionDriftHint[]`): Optional array of text-only hints per asset
  - `assetId`: Asset identifier
  - `status`: Qualitative drift status (stable-visibility, emerging-change, increasing-uncertainty, high-variance)
  - `summary`: One-line explanation of the drift status
  - `details`: Bullet-level supporting hints (short, qualitative)

### What These Hints Describe

- ✅ How visibility around an asset has changed over time
- ✅ Whether signal types have remained stable or evolved
- ✅ Whether uncertainty about an asset has increased
- ✅ Whether signals have varied significantly between observations

### What These Hints Do NOT Describe

- ❌ Risk scores or risk trends
- ❌ Posture improvements or degradations
- ❌ Compliance status changes
- ❌ Security assessments

### Language Rules

**✅ Allowed Language:**
- "Visibility around this asset has been broadly stable across observations"
- "Recent updates have changed how this asset appears in your environment"
- "Signals indicate growing uncertainty about this asset's role or dependencies"
- "Signals about this asset have varied significantly over time"

**❌ Forbidden Language:**
- "Risk has increased/decreased"
- "Posture is improving/worsening"
- "More/less secure now"
- "Risk is trending up/down"

### Implementation

- **Contract**: `cyberCaution.driftHint.contract.ts` - Defines the drift hint structure
- **Export Adapter**: `toCyberCaution.ts` - Builds drift hints from signal history
- **Source**: Reuses `signalHistoryStore` and `analyzeSignalDrift` from change-over-time intelligence
- **Validation**: `contractGuard` validates drift hints to prevent forbidden language

### Usage by CyberCaution

CyberCaution receives these hints as part of the export payload and can use them to:
- Prioritize assets for scenario planning (assets with emerging-change may need attention)
- Understand which assets have stable vs evolving visibility
- Identify assets where uncertainty is increasing (may need investigation)
- Focus tabletop exercises on assets with high-variance signals

**Important**: These hints are purely qualitative and text-only. CyberCaution should interpret them in the context of threat scenarios, not as risk assessments.

---

## VendorSoluce – Supplier Visibility Drift Hints

### Overview

VendorSoluce exports include **visibility drift hints** that describe how visibility around vendor-related assets has changed over time. These hints help VendorSoluce prioritize which vendors and integrations may warrant closer review, refreshed questionnaires, or scenario analysis.

### What VendorSoluce Receives

- **Drift Hints** (`VendorSoluceDriftHint[]`): Optional array of text-only hints per vendor
  - `vendorId`: Vendor identifier (typically derived from asset owner or name for third-party services)
  - `relatedAssetIds`: Asset IDs related to this vendor
  - `status`: Qualitative drift status (stable-visibility, emerging-change, increasing-uncertainty, high-variance)
  - `summary`: One-line qualitative explanation of the drift status
  - `details`: Short bullet-level hints (qualitative, max 4 items)

### What These Hints Describe

- ✅ How visibility around vendor-related assets has changed over time
- ✅ Whether signals tied to vendor assets have remained stable or evolved
- ✅ Whether uncertainty around vendor asset mapping has increased
- ✅ Whether signals have varied significantly over time for vendor-related assets

### What These Hints Do NOT Describe

- ❌ Vendor risk scores or risk trends
- ❌ Vendor posture improvements or degradations
- ❌ Vendor compliance status (compliant/non-compliant)
- ❌ Vendor safety assessments ("vendor is safe/unsafe")
- ❌ Vendor risk ratings

### Language Rules

**✅ Allowed Language:**
- "Assets related to this vendor have shown broadly stable visibility across observations"
- "Recent updates have changed how vendor-related assets appear in your environment"
- "Signals indicate growing uncertainty around how this vendor's assets are mapped or understood"
- "Signals tied to this vendor's assets have varied significantly over time"

**❌ Forbidden Language:**
- "Vendor risk is increasing/decreasing"
- "Vendor posture is worsening/improving"
- "This vendor is high risk / low risk"
- "Vendor is compliant / non-compliant"
- "Vendor risk trend: up/down"

### Implementation

- **Contract**: `vendorSoluce.driftHint.contract.ts` - Defines the drift hint structure
- **Export Adapter**: `toVendorSoluce.ts` - Builds drift hints from signal history (includes optional supplier visibility drift hints)
- **Source**: Reuses `signalHistoryStore` and `analyzeSignalDrift` from change-over-time intelligence
- **Validation**: `contractGuard` validates drift hints to prevent forbidden language

### Usage by VendorSoluce

VendorSoluce receives these hints as part of the export payload and can use them to:
- Prioritize which vendors may warrant closer review (vendors with emerging-change or high-variance)
- Understand which vendors are backed by stable vs shifting/uncertain asset visibility
- Identify vendors where uncertainty is increasing (may need refreshed questionnaires)
- Focus scenario analysis on vendors with high-variance signals

**Important**: These hints are purely qualitative and text-only. They are not vendor risk ratings or compliance judgements. VendorSoluce should interpret them as prioritization context, not as risk scores.

---

## ERMITS Advisory / STEEL – Visibility Snapshot

### Overview

ERMITS Advisory exports include **STEEL visibility snapshots** that describe how well the organisation understands its assets, software composition, and vendor touchpoints over time. These snapshots provide textual, decision-support narratives suitable for board decks, STEEL assessments, and advisory deliverables.

### What ERMITS Advisory Receives

- **STEEL Visibility Snapshot** (`SteelOrgVisibilitySnapshot`): Complete organisational visibility snapshot
  - `capturedAt`: ISO timestamp when snapshot was captured
  - `assets`: Per-asset visibility summaries (`SteelAssetVisibilitySummary[]`)
    - `assetId`: Asset identifier
    - `keyRole`: Optional key role (e.g. 'payment-processing', 'ehr-db', 'clinical-records')
    - `driftStatus`: Qualitative drift status from drift analyzer
    - `hasSBOM`: True if asset has software composition documentation
    - `hasVendorLinks`: True if asset participates in vendor dependencies
  - `domains`: Per-domain visibility summaries (`SteelDomainVisibilitySummary[]`)
    - `domain`: One of 'privacy', 'ransomware', 'vendor', 'software-supply-chain'
    - `keyMessages`: Short 1–2 line messages describing visibility in this domain
  - `narrative`: 5–10 bullet-level lines suitable for STEEL report inserts

### What These Snapshots Describe

- ✅ How well assets are mapped and understood over time
- ✅ Whether visibility is stable, changing, or uncertain
- ✅ Which assets have documented software composition
- ✅ Which assets are linked to external vendors
- ✅ Domain-level visibility patterns (privacy, ransomware, vendor, software supply-chain)
- ✅ Overall organisational visibility narrative

### What These Snapshots Do NOT Describe

- ❌ Risk ratings or risk levels
- ❌ Posture scores or posture improvements/worsening
- ❌ Compliance status (compliant/non-compliant)
- ❌ Security assessments (secure/insecure)
- ❌ Risk trends or trend scores

### Language Rules

**✅ Allowed Language:**
- "Asset visibility is established for X assets in the current snapshot"
- "Visibility is stable / changing / uncertain"
- "Signals have evolved"
- "Asset mapping is clearer / remains unclear"
- "Software composition is documented / not documented"
- "Several assets are clearly linked to external vendors"
- "Some privacy-relevant assets show stable visibility across observations"
- "Several privacy-relevant assets exhibit changing or uncertain visibility, indicating the need for clearer mapping"

**❌ Forbidden Language:**
- "High risk / low risk / critical risk"
- "Posture has improved / worsened"
- "Compliant / non-compliant"
- "Secure / insecure"
- "Risk trend", "trend score"
- "Risk is increasing/decreasing"

### Implementation

- **Contract**: `ermitsAdvisory.steelVisibility.contract.ts` - Defines the STEEL visibility snapshot structure
- **Export Adapter**: `toERMITSAdvisory.ts` - Builds STEEL visibility snapshot from assets, signals, and drift analysis
- **Source**: Reuses `signalHistoryStore` and `analyzeSignalDrift` from change-over-time intelligence
- **Validation**: `contractGuard` validates snapshots to prevent forbidden language

### Usage by ERMITS Advisory

ERMITS Advisory receives these snapshots as part of the export payload and can use them to:
- Generate ready-to-drop narrative text for STEEL reports
- Provide board-level visibility summaries
- Support advisory deliverables with factual visibility descriptions
- Connect technical visibility with governance and compliance discussions

**Important**: These snapshots describe what we know and how stable that knowledge is, not whether the organisation is 'secure' or 'compliant'. The narrative can be treated as drop-in report text for STEEL assessments and advisory deliverables.

---

## TechnoSoluce (Software Composition Intelligence)

### SBOM Integration Boundaries

**Critical Principle**: TechnoSoluce is the **only** system that ingests and interprets SBOMs. CyberSoluce **never parses SBOMs**, never computes risk, never scores.

### SBOM Ingestion Responsibility

- **TechnoSoluce** is responsible for:
  - Ingesting SBOM files (SPDX, CycloneDX formats)
  - Parsing SBOM data
  - Analyzing software composition
  - Computing component risk and vulnerability correlation
  - Generating security assessments

- **CyberSoluce** responsibility:
  - Receives **signal-only** exports from TechnoSoluce
  - Never parses SBOM files
  - Never computes software risk
  - Never evaluates vulnerabilities

### Signal-Only Exports

TechnoSoluce exports SBOM-derived signals back to CyberSoluce using the `SBOMSignal` contract:

- **Signal Types**:
  - `software-composition-known`: Full visibility into software components
  - `software-composition-partial`: Some visibility but incomplete
  - `software-composition-unknown`: No SBOM data available
  - `transitive-dependency-opacity`: Dependency depth exceeds visibility
  - `component-churn-detected`: Component count changes detected over time

- **What CyberSoluce Can Say About Software**:
  - "Software composition visibility available via TechnoSoluce"
  - "Software components listed but dependency depth incomplete"
  - "No SBOM data available for these assets"
  - "Component count increased from X to Y over the past week"

- **What CyberSoluce Cannot Say About Software**:
  - ❌ "High risk due to vulnerable dependencies"
  - ❌ "CVE-2024-1234 detected in component X"
  - ❌ "Security score: 7.5/10"
  - ❌ "Compliance violation: missing patch"
  - ❌ Any CVE, severity, score, or vulnerability language

### Explicit Statement

**"CyberSoluce never evaluates software risk or vulnerabilities."**

All software risk assessment, vulnerability analysis, and security scoring belongs to TechnoSoluce. CyberSoluce only receives and displays qualitative signals about software composition visibility.

### SBOM Contract Files

- `technoSoluce.sbom.contract.ts` - SBOM intake contract (factual metadata only)
- `technoSoluce.sbom.signals.ts` - SBOM-derived signal types
- `technoSoluce/sbom/sbomSignalBuilder.ts` - Converts SBOM facts to signals
- `technoSoluce/sbom/sbomAssetBinding.ts` - Maps SBOMs to assets
- `exports/technoSoluceToCyberSoluce.ts` - Exports SBOM signals back to CyberSoluce

---

## Export Adapters

Each product has a dedicated export adapter that:

1. **Filters** allowed fields (product-specific)
2. **Adds** `handoffIntent` string (what the target product should focus on)
3. **Adds** `nextQuestionPrompt` (UX signal for user interaction)

### Export Adapters

- `toCyberCorrect.ts` - Privacy-focused export
- `toCyberCaution.ts` - Threat-focused export (includes visibility drift hints)
- `toVendorSoluce.ts` - Vendor-focused export (includes optional supplier visibility drift hints)
- `toTechnoSoluce.ts` - Software-focused export
- `toERMITSAdvisory.ts` - Governance-focused export (includes STEEL visibility snapshot)

---

## Data Contract Files

All contracts are defined in `/src/contracts/`:

- `cyberSoluce.asset.contract.ts` - Asset data contract
- `cyberSoluce.dependency.contract.ts` - Dependency data contract
- `cyberSoluce.signal.contract.ts` - Signal data contract
- `cyberSoluce.signalHistory.contract.ts` - Signal history (time-series) contract
- `cyberSoluce.drift.contract.ts` - Visibility drift insights contract
- `cyberSoluce.export.manifest.ts` - Export manifest contract
- `cyberCaution.driftHint.contract.ts` - CyberCaution drift hint contract
- `vendorSoluce.driftHint.contract.ts` - VendorSoluce drift hint contract
- `ermitsAdvisory.steelVisibility.contract.ts` - ERMITS Advisory STEEL visibility snapshot contract
- `technoSoluce.sbom.contract.ts` - SBOM intake contract (TechnoSoluce-only)
- `technoSoluce.sbom.signals.ts` - SBOM-derived signal types

---

## Runtime Enforcement

The `/src/guards/contractGuard.ts` module provides:

- **Validation**: Checks payloads against allowed fields
- **Keyword blocking**: Throws on forbidden keywords
- **Dev logging**: Logs blocked attempts in development mode

**Usage**:
```typescript
import { enforceContract } from '../guards/contractGuard';

// This will throw if forbidden keywords are found
enforceContract(exportData, allowedFields, 'exportToCyberCorrect');
```

---

## Funnel Logic

The `/src/funnel/useFocusFunnel.ts` hook:

- Consumes contract outputs only (no direct asset access)
- Makes decisions based on `signalType + userIntent`
- Outputs `destination product + rationale text`

**Key Principle**: Funnel logic operates on contracts, not raw asset objects. This enforces the data boundary.

---

## Preventing Scope Creep

This architecture prevents internal contradiction by:

1. **Strict contracts**: TypeScript interfaces define exactly what can be exported
2. **Runtime guards**: Automatic blocking of forbidden keywords
3. **One-way flow**: CyberSoluce never imports back
4. **Product ownership**: Each product interprets data in its domain
5. **Documentation**: This document serves as the authoritative reference

**Six months from now**, if someone tries to add a "riskScore" field to an export, the guard will block it automatically.

---

## Example Export Flow

```
1. User triggers export to CyberCorrect
   ↓
2. exportToCyberCorrect() filters assets/dependencies/signals
   ↓
3. Data converted to contracts (strips forbidden fields)
   ↓
4. contractGuard.enforceContract() validates payload
   ↓
5. Export manifest created with handoffIntent and nextQuestionPrompt
   ↓
6. Export payload sent to CyberCorrect
   ↓
7. CyberCorrect interprets data for privacy analysis
```

---

## Maintenance

- **Adding new fields**: Update contract interfaces and export adapters
- **Adding new products**: Create new export adapter following the pattern
- **Changing boundaries**: Update this document and contract interfaces
- **Forbidden keywords**: Add to `FORBIDDEN_KEYWORDS` in `contractGuard.ts`

---

## Questions?

If you're unsure whether a field should be included in an export:

1. Is it factual data (not an interpretation)?
2. Does it belong to CyberSoluce's domain (asset intelligence)?
3. Is it not a forbidden keyword?
4. Does the target product need it for its interpretation?

If all answers are "yes", it can be included. Otherwise, it should be excluded.

