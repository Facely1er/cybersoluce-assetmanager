# TechnoSoluce Integration - Quick Reference

**Quick reference guide for developers working with TechnoSoluce integration.**

---

## 🚀 Quick Start

### Export to TechnoSoluce
```typescript
import { exportToTechnoSoluce } from '@/exports/toTechnoSoluce';
import { useTechnoSoluceExport } from '@/features/technoSoluce/useTechnoSoluceExport';

// In component
const { exportData, generateExport, downloadExport } = useTechnoSoluceExport();
```

### Import from TechnoSoluce
```typescript
import { importTechnoSoluceSignalsFromJson } from '@/imports/fromTechnoSoluce';

// Import signals
const result = await importTechnoSoluceSignalsFromJson(jsonContent);
```

---

## 📁 Key Files

| Purpose | File Path |
|---------|-----------|
| **Export Logic** | `src/exports/toTechnoSoluce.ts` |
| **Import Logic** | `src/imports/fromTechnoSoluce.ts` |
| **Export Hook** | `src/features/technoSoluce/useTechnoSoluceExport.ts` |
| **Export UI** | `src/features/technoSoluce/TechnoSoluceExportPanel.tsx` |
| **Import UI** | `src/features/technoSoluce/TechnoSoluceSignalImportPanel.tsx` |
| **Export Page** | `src/pages/TechnoSoluceExport.tsx` |
| **SBOM Signals Contract** | `src/contracts/technoSoluce.sbom.signals.ts` |
| **SBOM Intake Contract** | `src/contracts/technoSoluce.sbom.contract.ts` |

---

## 🔄 Data Flow

### Export: CyberSoluce → TechnoSoluce
```
Assets → Filter (software only) → Convert to Contracts → Generate JSON → Download
```

### Import: TechnoSoluce → CyberSoluce
```
JSON Upload → Validate → Convert to Signals → Record in History → Display
```

---

## 📊 Signal Types

| Signal Type | Description |
|-------------|-------------|
| `software-composition-known` | Full visibility into software components |
| `software-composition-partial` | Some visibility but incomplete |
| `software-composition-unknown` | No SBOM data available |
| `transitive-dependency-opacity` | Dependency depth exceeds visibility |
| `component-churn-detected` | Component count changes detected |

---

## 🎯 Key Principles

1. **Signal-Only**: Only qualitative visibility indicators
2. **No Risk Data**: No CVE, severity, score, or vulnerability language
3. **One-Way Flow**: Export assets → Import signals back
4. **Contract-Based**: All data follows defined contracts

---

## ⚠️ Forbidden Keywords

These are automatically blocked by `contractGuard.ts`:
- `score`, `rating`, `riskScore`, `riskRating`
- `compliance`, `compliant`, `complianceScore`
- `cve`, `vulnerability`, `vulnerabilities`
- `severity`, `exploit`, `patches`
- `secure`, `insecure`, `security`

---

## 📝 JSON Format

### Import Format (Expected from TechnoSoluce)
```json
{
  "assetIds": ["asset-1"],
  "signals": [{
    "signalId": "sbom-signal-123",
    "signalType": "software-composition-known",
    "description": "Software composition visibility available",
    "confidence": "high",
    "source": "import",
    "timestamp": "2025-01-15T10:30:00Z",
    "signalDomain": "software",
    "affectedAssetIds": ["asset-1"],
    "concentrationDescription": "SBOM provides visibility into 45 components"
  }],
  "sourceLabel": "TechnoSoluce Analysis",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

---

## 🔗 Routes

| Route | Purpose |
|-------|---------|
| `/technosoluce/export` | Export page |
| `/dashboard/data-imports` | Import page (TechnoSoluce Signals tab) |

---

## 📚 Full Documentation

- **[TECHNOSOLUCE_RELATIONSHIP_FINALIZED.md](./TECHNOSOLUCE_RELATIONSHIP_FINALIZED.md)** - Complete relationship documentation
- **[TECHNOSOLUCE_INTEGRATION_COMPLETE.md](./TECHNOSOLUCE_INTEGRATION_COMPLETE.md)** - Detailed integration guide
- **[cyberSoluce-to-technoSoluce.md](../data-contracts/cyberSoluce-to-technoSoluce.md)** - Data contract specification

---

**Last Updated**: December 2025

