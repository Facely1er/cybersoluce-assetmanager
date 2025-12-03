/**
 * Asset Readiness Service
 * 
 * Derives scenario readiness for assets using existing signal spine.
 * 
 * RULES:
 * - NO risk posture, compliance status, or trend scoring
 * - Only describes visibility readiness for scenario planning
 * - Uses drift + SBOM + vendor signals (no risk scores)
 */

import { signalHistoryStore } from '@/time/signalHistoryStore';
import { analyzeSignalDrift } from '@/time/signalDriftAnalyzer';
import { AssetScenarioReadiness, mapDriftToReadiness } from './readinessMapper';
import { Asset } from '@/types/asset';
import { FocusSignal } from '@/types/enrichment';
import { toSignalContract, AssetSignal } from '@/contracts/cyberSoluce.signal.contract';

/**
 * Compute scenario readiness for all assets
 * 
 * Uses existing signal spine to determine:
 * - Drift status (from signal history)
 * - SBOM presence (from signals)
 * - Vendor links (from signals)
 * - Overall readiness (from drift mapping)
 */
export async function computeAssetScenarioReadiness(
  assets: Asset[],
  signals: FocusSignal[]
): Promise<AssetScenarioReadiness[]> {
  const result: AssetScenarioReadiness[] = [];

  // Group signals by asset ID for efficient lookup
  const signalsByAssetId = new Map<string, FocusSignal[]>();
  signals.forEach(signal => {
    signal.affected_asset_ids.forEach(assetId => {
      if (!signalsByAssetId.has(assetId)) {
        signalsByAssetId.set(assetId, []);
      }
      signalsByAssetId.get(assetId)!.push(signal);
    });
  });

  // Process each asset
  for (const asset of assets) {
    if (!asset.id) continue;

    const assetId = asset.id;
    const assetSignals = signalsByAssetId.get(assetId) ?? [];

    // Get signal history and analyze drift
    const history = await signalHistoryStore.getHistory(assetId, { limit: 20 });
    const driftInsight = analyzeSignalDrift(history);

    // Convert signals to contracts for type checking
    const assetSignalContracts: AssetSignal[] = assetSignals.map(signal =>
      toSignalContract(signal)
    );

    // Check for SBOM signals
    const hasSBOM = assetSignalContracts.some(s =>
      String(s.signalType).includes('dependency') &&
      (String(s.signalDomain).includes('software') ||
       String(s.description ?? '').toLowerCase().includes('sbom') ||
       String(s.description ?? '').toLowerCase().includes('software-composition') ||
       String(s.description ?? '').toLowerCase().includes('bom'))
    );

    // Check for vendor links
    const hasVendorLinks = assetSignalContracts.some(s =>
      String(s.signalDomain).includes('vendor') ||
      String(s.description ?? '').toLowerCase().includes('vendor') ||
      String(s.description ?? '').toLowerCase().includes('third-party') ||
      String(s.description ?? '').toLowerCase().includes('supplier')
    );

    // Map drift status to readiness
    const readiness = mapDriftToReadiness(driftInsight.status);

    result.push({
      assetId,
      name: asset.name,
      driftStatus: driftInsight.status,
      hasSBOM,
      hasVendorLinks,
      readiness,
    });
  }

  return result;
}

