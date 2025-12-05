# Feature Migration Status: CyberSoluce Lite → CyberSoluce

## Completed ✅

### Services
- ✅ enrichmentOrchestrator.ts
- ✅ assetDiscoveryService.ts
- ✅ dataClassificationService.ts
- ✅ fileIngestionService.ts

### Types
- ✅ dataInventory.ts
- ✅ assetLite.ts (LiteAsset)
- ✅ classification.ts
- ✅ sbomLite.ts

## In Progress 🔄

### Services (Remaining)
- ⏳ storageService.ts
- ⏳ reportGenerationService.ts
- ⏳ sbom/sbomAutogenerationService.ts
- ⏳ sbom/baselineSBOMService.ts

### Utilities (Remaining)
- ⏳ csvUtils.ts
- ⏳ validation.ts
- ⏳ constants.ts

### Components (Remaining)
- ⏳ EnrichmentWorkflow.tsx
- ⏳ DataIngestionView.tsx
- ⏳ DataInventoryView.tsx
- ⏳ AssetDiscoveryView.tsx
- ⏳ DataClassificationView.tsx
- ⏳ SBOMManager.tsx
- ⏳ ReportsView.tsx

## Pending 📋

### Integration
- ⏳ Update MainLayout.tsx to include new routes
- ⏳ Update package.json (add docx, file-saver)
- ⏳ Update type exports in types/index.ts

## Notes
- All services use correct import paths (assetLite, sbomLite)
- Need to ensure storageService uses localStorage (Lite version) vs database (main version)
- Components need to be integrated into MainLayout routing

