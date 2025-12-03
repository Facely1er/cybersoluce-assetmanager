/**
 * SBOM Signal Builder
 * 
 * Pure function that converts SBOM facts into qualitative signals.
 * 
 * RULES:
 * - No heuristics
 * - No scoring
 * - No vulnerability logic
 * - Simple, explicit logic only
 */

import { SBOMIntake } from '../../contracts/technoSoluce.sbom.contract';
import { SBOMSignal, SBOMSignalType } from '../../contracts/technoSoluce.sbom.signals';

/**
 * Build SBOM-derived signals from SBOM intake data
 * 
 * @param sbom - SBOM intake data (factual only)
 * @param linkedAssetIds - Asset IDs that this SBOM is linked to
 * @returns Array of SBOM signals
 */
export function buildSBOMSignals(
  sbom: SBOMIntake | null,
  linkedAssetIds: string[]
): SBOMSignal[] {
  const signals: SBOMSignal[] = [];
  const now = new Date().toISOString();
  
  // If no SBOM → software-composition-unknown
  if (!sbom) {
    if (linkedAssetIds.length > 0) {
      signals.push({
        signalId: `sbom-signal-unknown-${Date.now()}`,
        signalType: 'software-composition-unknown',
        description: 'No SBOM data available for these assets',
        confidence: 'low',
        source: 'inferred',
        timestamp: now,
        signalDomain: 'software',
        affectedAssetIds: [...linkedAssetIds],
        concentrationDescription: 'Software composition visibility is not available for these assets',
      });
    }
    return signals;
  }
  
  // If components listed but no dependency graph → software-composition-partial
  if (sbom.componentsCount > 0 && !sbom.hasDependencies) {
    signals.push({
      signalId: `sbom-signal-partial-${sbom.sbomId}`,
      signalType: 'software-composition-partial',
      description: 'Software components listed but dependency depth incomplete',
      confidence: 'medium',
      source: sbom.source === 'upload' ? 'user' : 'import',
      timestamp: now,
      signalDomain: 'software',
      affectedAssetIds: [...linkedAssetIds],
      concentrationDescription: `SBOM contains ${sbom.componentsCount} components but dependency graph information is missing`,
    });
  }
  
  // If components listed with dependencies → software-composition-known
  if (sbom.componentsCount > 0 && sbom.hasDependencies) {
    signals.push({
      signalId: `sbom-signal-known-${sbom.sbomId}`,
      signalType: 'software-composition-known',
      description: 'Software composition visibility available',
      confidence: 'high',
      source: sbom.source === 'upload' ? 'user' : 'import',
      timestamp: now,
      signalDomain: 'software',
      affectedAssetIds: [...linkedAssetIds],
      concentrationDescription: `SBOM provides visibility into ${sbom.componentsCount} components with dependency relationships`,
    });
  }
  
  // If component count changes week-over-week (stub for now) → component-churn-detected
  // TODO: This requires historical tracking - for now, we'll skip this signal
  // Future implementation will compare component counts over time
  
  // If dependencies exceed depth threshold without identifiers → transitive-dependency-opacity
  // TODO: This requires parsing dependency depth - for now, we'll skip this signal
  // Future implementation will analyze dependency graph depth
  
  return signals;
}

