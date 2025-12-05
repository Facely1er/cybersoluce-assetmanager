# Remaining Integrations & External Dependencies

**Date**: December 4, 2025  
**Status**: ✅ **CyberSoluce Side Complete** | ⏳ **External Coordination Needed**

---

## 📊 Summary

### CyberSoluce Status: ✅ **Ready to Integrate**
- All export adapters implemented
- All import panels ready
- All contracts defined
- All guardrails in place

### External Dependencies: ⏳ **Coordination Needed**
- **CyberCaution**: STEEL summary export needed
- **VendorSoluce**: Supplier visibility watchlist (optional)
- **TechnoSoluce**: SBOM signal exports (optional, can work standalone)
- **ERMITS Advisory**: STEEL visibility annex (optional)

---

## 🔴 High Priority: CyberCaution Integration

### What CyberSoluce Has ✅

**Completed**:
- ✅ STEEL contract types defined (`src/features/steel/index.ts`)
- ✅ Import panel implemented (`src/features/cyberCaution/SteelSummaryImportPanel.tsx`)
- ✅ README guardrails in place (`src/features/steel/README.md`)
- ✅ Export adapter ready (`exports/toCyberCaution.ts`)

**Contract**:
```typescript
export type SteelExposureBand = 'low' | 'medium' | 'elevated' | 'high';

export interface SteelReadinessSummary {
  band: SteelExposureBand;
  keySignals: string[];
  generatedAt: string;    // ISO timestamp
  source?: 'cyberCaution';
}
```

### What CyberCaution Needs to Do ⏳

**Required Tasks** (in CyberCaution repository):

1. **Create Summary Builder** (`src/features/steel/steelReadinessSummary.ts`)
   - Define matching contract types
   - Implement `buildSteelReadinessSummary()` function
   - Map STEEL answers to key signals
   - Generate summary object

2. **Add JSON Export Button** (in STEEL results component)
   - Add "Download STEEL summary (JSON)" button
   - Call `buildSteelReadinessSummary()` when generating
   - Implement download helper function
   - Label clearly as "summary" (not assessment/audit)

3. **Verify Guardrails**
   - Confirm README states: "STEEL produces readiness signals only"
   - Ensure no asset/platform logic in STEEL module

**Reference**: `# TODO[STEEL-SUMMARY-INTEGRATION].md`

**Status**: ⏳ **Blocking** - CyberSoluce is ready, waiting on CyberCaution export

---

## 🟡 Medium Priority: VendorSoluce Integration

### What CyberSoluce Has ✅

**Completed**:
- ✅ Export adapter (`exports/toVendorSoluce.ts`)
- ✅ Vendor visibility watchlist panel (`features/vendorSoluce/VendorVisibilityWatchlistPanel.tsx`)
- ✅ Drift hint contract (`contracts/vendorSoluce.driftHint.contract.ts`)
- ✅ Watchlist service (`vendorsoluce/watchlist/vendorWatchlistService.ts`)

### What VendorSoluce Needs to Do ⏳

**Optional Tasks** (in VendorSoluce repository):

1. **Consume Supplier Visibility Watchlist**
   - Accept vendor visibility data from CyberSoluce export
   - Display supplier visibility hints
   - Use drift hints for vendor prioritization

2. **Optional: Export Vendor Risk Signals**
   - Export vendor risk signals back to CyberSoluce (if desired)
   - Follow signal contract format
   - Use `vendor` signal domain

**Reference**: `# TODO – VendorSoluce Supplier.md`

**Status**: ⏳ **Optional** - CyberSoluce can work standalone, integration enhances value

---

## 🟡 Medium Priority: TechnoSoluce Integration

### What CyberSoluce Has ✅

**Completed**:
- ✅ SBOM upload service (`services/sbomUploadService.ts`)
- ✅ SBOM signal builder (`technoSoluce/sbom/sbomSignalBuilder.ts`)
- ✅ SBOM contracts (`contracts/technoSoluce.sbom.*.ts`)
- ✅ Historical tracking for component churn
- ✅ Export adapter (`exports/toTechnoSoluce.ts`)

### What TechnoSoluce Needs to Do ⏳

**Optional Tasks** (in TechnoSoluce repository):

1. **Consume SBOM Signals from CyberSoluce**
   - Accept software composition signals
   - Use signals for prioritization
   - Display visibility status

2. **Optional: Export Enhanced SBOM Analysis**
   - Export detailed SBOM analysis back to CyberSoluce (if desired)
   - Follow signal contract format
   - Use `software` signal domain

**Status**: ⏳ **Optional** - CyberSoluce can ingest SBOMs directly, TechnoSoluce integration enhances analysis

**Note**: CyberSoluce can work standalone with SBOM uploads. TechnoSoluce integration would provide deeper analysis but is not required.

---

## 🟡 Medium Priority: ERMITS Advisory Integration

### What CyberSoluce Has ✅

**Completed**:
- ✅ Export adapter (`exports/toERMITSAdvisory.ts`)
- ✅ STEEL visibility annex preview (`features/ermitsAdvisory/SteelVisibilityAnnexPreview.tsx`)
- ✅ STEEL visibility contract (`contracts/ermitsAdvisory.steelVisibility.contract.ts`)
- ✅ Visibility annex generator (`ermitsAdvisory/steelVisibilityAnnex.ts`)

### What ERMITS Advisory Needs to Do ⏳

**Optional Tasks** (in ERMITS Advisory repository):

1. **Consume STEEL Visibility Snapshots**
   - Accept STEEL visibility snapshots from CyberSoluce export
   - Use snapshots for board-level narratives
   - Generate ready-to-drop report text

2. **Optional: Export Governance Signals**
   - Export governance signals back to CyberSoluce (if desired)
   - Follow signal contract format
   - Use `governance` signal domain

**Reference**: `# TODO – ERMITS Advisory STEEL Visibility Annex.md`

**Status**: ⏳ **Optional** - CyberSoluce can generate visibility annexes standalone

---

## 🟢 Low Priority: CyberCorrect Integration

### What CyberSoluce Has ✅

**Completed**:
- ✅ Export adapter (`exports/toCyberCorrect.ts`)
- ✅ Import adapter (`imports/fromCyberCorrect.ts`)
- ✅ Privacy-focused signal detection
- ✅ Data classification support

### What CyberCorrect Needs to Do ⏳

**Optional Tasks** (in CyberCorrect repository):

1. **Consume Privacy Signals**
   - Accept privacy-focused exports from CyberSoluce
   - Use signals for privacy impact analysis
   - Display asset visibility status

2. **Optional: Export Privacy Assessment Signals**
   - Export privacy assessment signals back to CyberSoluce (if desired)
   - Follow signal contract format
   - Use `privacy` signal domain

**Status**: ⏳ **Optional** - Basic integration exists, enhanced signals optional

---

## 📋 Integration Checklist by Product

### CyberCaution ⚠️ **REQUIRED**

- [ ] **CyberCaution**: Create `steelReadinessSummary.ts` with summary builder
- [ ] **CyberCaution**: Add JSON export button to STEEL results page
- [ ] **CyberCaution**: Implement `buildSteelReadinessSummary()` function
- [ ] **CyberCaution**: Verify guardrails in README
- [x] **CyberSoluce**: Contract types defined ✅
- [x] **CyberSoluce**: Import panel ready ✅
- [x] **CyberSoluce**: Export adapter ready ✅

**Blocking**: Yes - This is the only required integration

---

### VendorSoluce ⏳ **OPTIONAL**

- [ ] **VendorSoluce**: Consume supplier visibility watchlist
- [ ] **VendorSoluce**: Display vendor drift hints
- [x] **CyberSoluce**: Export adapter ready ✅
- [x] **CyberSoluce**: Watchlist panel ready ✅
- [x] **CyberSoluce**: Drift hint contract ready ✅

**Blocking**: No - CyberSoluce works standalone

---

### TechnoSoluce ⏳ **OPTIONAL**

- [ ] **TechnoSoluce**: Consume SBOM signals from CyberSoluce
- [ ] **TechnoSoluce**: Export enhanced SBOM analysis (optional)
- [x] **CyberSoluce**: SBOM upload service ready ✅
- [x] **CyberSoluce**: SBOM signal builder ready ✅
- [x] **CyberSoluce**: Historical tracking ready ✅

**Blocking**: No - CyberSoluce can ingest SBOMs directly

---

### ERMITS Advisory ⏳ **OPTIONAL**

- [ ] **ERMITS Advisory**: Consume STEEL visibility snapshots
- [ ] **ERMITS Advisory**: Use snapshots for board narratives
- [x] **CyberSoluce**: Export adapter ready ✅
- [x] **CyberSoluce**: Visibility annex generator ready ✅
- [x] **CyberSoluce**: STEEL visibility contract ready ✅

**Blocking**: No - CyberSoluce can generate visibility annexes standalone

---

### CyberCorrect ⏳ **OPTIONAL**

- [ ] **CyberCorrect**: Consume privacy signals (enhanced)
- [ ] **CyberCorrect**: Export privacy assessment signals (optional)
- [x] **CyberSoluce**: Export adapter ready ✅
- [x] **CyberSoluce**: Import adapter ready ✅

**Blocking**: No - Basic integration exists

---

## 🔄 Data Flow Direction

### Critical Principle: One-Way Flow

**CyberSoluce → Other Products**: ✅ **Implemented**
- Export adapters ready
- Contracts defined
- Guardrails in place

**Other Products → CyberSoluce**: ⏳ **Optional**
- Import panels ready (for manual imports)
- Signal contracts defined
- Can work standalone if products don't export

---

## 📝 Integration Contracts

All contracts are defined in `src/contracts/`:

### CyberSoluce Exports
- ✅ `cyberSoluce.asset.contract.ts` - Asset data
- ✅ `cyberSoluce.dependency.contract.ts` - Dependency data
- ✅ `cyberSoluce.signal.contract.ts` - Signal data
- ✅ `cyberSoluce.signalHistory.contract.ts` - Signal history
- ✅ `cyberSoluce.drift.contract.ts` - Drift insights

### Product-Specific Contracts
- ✅ `cyberCaution.driftHint.contract.ts` - Drift hints for CyberCaution
- ✅ `vendorSoluce.driftHint.contract.ts` - Drift hints for VendorSoluce
- ✅ `ermitsAdvisory.steelVisibility.contract.ts` - STEEL visibility for ERMITS Advisory
- ✅ `technoSoluce.sbom.contract.ts` - SBOM intake contract
- ✅ `technoSoluce.sbom.signals.ts` - SBOM signal types

### Import Contracts (Optional)
- ✅ `steelReadinessSummary` - STEEL summary from CyberCaution
- ✅ Signal contracts - For any product that wants to export signals back

---

## 🚀 Next Steps

### Immediate (Required)
1. **Coordinate with CyberCaution team**:
   - Share STEEL contract definition
   - Request JSON export implementation
   - Test end-to-end integration

### Short Term (Optional Enhancements)
2. **Coordinate with VendorSoluce team**:
   - Share supplier visibility watchlist format
   - Discuss drift hint usage

3. **Coordinate with TechnoSoluce team**:
   - Share SBOM signal format
   - Discuss enhanced analysis exports

4. **Coordinate with ERMITS Advisory team**:
   - Share STEEL visibility snapshot format
   - Discuss narrative generation

---

## ✅ CyberSoluce Readiness

**Status**: ✅ **100% Ready for Integration**

- All export adapters implemented
- All import panels ready
- All contracts defined
- All guardrails in place
- All documentation complete

**CyberSoluce can work standalone** - All integrations are enhancements, not requirements.

---

## 📞 Coordination Contacts

For integration coordination, reference:
- **STEEL Integration**: `# TODO[STEEL-SUMMARY-INTEGRATION].md`
- **Ecosystem Boundaries**: `docs/ecosystem-data-boundaries.md`
- **Contract Definitions**: `src/contracts/`

---

**Last Updated**: December 4, 2025  
**Status**: ✅ **CyberSoluce Ready** | ⏳ **External Coordination Needed**

