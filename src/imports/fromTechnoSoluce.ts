/**
 * Import Adapter: TechnoSoluce → CyberSoluce
 * 
 * Imports SBOM-derived SIGNALS from TechnoSoluce back into CyberSoluce.
 * 
 * RULES:
 * - Only signals are imported (never raw SBOM data, risk scores, or vulnerabilities)
 * - Signals follow SBOMSignal contract
 * - All signals are qualitative visibility indicators only
 * - No CVE, severity, score, or risk language
 * 
 * TechnoSoluce is the ONLY system that ingests and interprets SBOMs.
 * CyberSoluce never parses SBOMs, never computes risk, never scores.
 */

import { SBOMSignal } from '../contracts/technoSoluce.sbom.signals';
import { signalHistoryStore, BackendSignalHistoryStore, SignalSnapshotWithBatch } from '../time/signalHistoryStore';
import { exportSBOMSignalsToCyberSoluce } from '../exports/technoSoluceToCyberSoluce';
import { CyberSoluceSignalContract } from '../contracts/cyberSoluce.signal.contract';

/**
 * TechnoSoluce Signal Import Data
 * 
 * Contains only signals - no risk assessments, vulnerabilities, or compliance status.
 */
export interface TechnoSoluceSignalImport {
  /** Asset IDs that these signals relate to */
  assetIds: string[];
  /** SBOM-derived signals from TechnoSoluce */
  signals: SBOMSignal[];
  /** Optional source label for this import */
  sourceLabel?: string;
  /** Optional timestamp (defaults to now) */
  timestamp?: string;
}

/**
 * Import SBOM signals from TechnoSoluce
 * 
 * Records signal snapshots for assets based on TechnoSoluce SBOM analysis.
 * Only signals are imported - no risk assessments or vulnerability data.
 * 
 * @param importData - Signal import data from TechnoSoluce
 * @returns Import result with success status and counts
 */
export async function importTechnoSoluceSignals(
  importData: TechnoSoluceSignalImport
): Promise<{ success: boolean; recorded: number; errors: string[] }> {
  const errors: string[] = [];
  let recorded = 0;

  // Validate signals
  if (!importData.signals || importData.signals.length === 0) {
    return {
      success: false,
      recorded: 0,
      errors: ['No signals provided in import data'],
    };
  }

  if (!importData.assetIds || importData.assetIds.length === 0) {
    return {
      success: false,
      recorded: 0,
      errors: ['No asset IDs provided in import data'],
    };
  }

  // Convert SBOM signals to CyberSoluce signal contracts
  let contractSignals: CyberSoluceSignalContract[];
  try {
    contractSignals = exportSBOMSignalsToCyberSoluce(importData.signals);
  } catch (error) {
    return {
      success: false,
      recorded: 0,
      errors: [`Failed to convert signals: ${error instanceof Error ? error.message : 'Unknown error'}`],
    };
  }

  // Get signal history store
  const store = signalHistoryStore;
  if (!(store instanceof BackendSignalHistoryStore)) {
    return {
      success: false,
      recorded: 0,
      errors: ['Signal history store must be backend mode. Set VITE_HISTORY_STORE_MODE=backend'],
    };
  }

  // Record signal snapshots for each asset
  const timestamp = importData.timestamp || new Date().toISOString();

  for (const assetId of importData.assetIds) {
    try {
      // Filter signals that affect this asset
      const assetSignals = contractSignals.filter(sig =>
        sig.affectedAssetIds.includes(assetId)
      );

      if (assetSignals.length === 0) {
        // Still record a snapshot even if no signals (indicates TechnoSoluce checked but found nothing)
        const emptySnapshot: SignalSnapshotWithBatch = {
          assetId,
          capturedAt: timestamp,
          source: 'technosoluce',
          signals: [],
        };
        await store.recordSnapshot(emptySnapshot);
        recorded++;
        continue;
      }

      // Create snapshot with signals for this asset
      const snapshot: SignalSnapshotWithBatch = {
        assetId,
        capturedAt: timestamp,
        source: 'technosoluce',
        signals: assetSignals,
      };

      await store.recordSnapshot(snapshot);
      recorded++;
    } catch (error) {
      errors.push(
        `Failed to record signals for asset ${assetId}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  return {
    success: errors.length === 0,
    recorded,
    errors,
  };
}

/**
 * Import TechnoSoluce signals from JSON file
 * 
 * Helper function to import signals from a JSON file exported by TechnoSoluce.
 * 
 * @param jsonContent - JSON string containing TechnoSoluceSignalImport data
 * @returns Import result
 */
export async function importTechnoSoluceSignalsFromJson(
  jsonContent: string
): Promise<{ success: boolean; recorded: number; errors: string[] }> {
  try {
    const importData = JSON.parse(jsonContent) as TechnoSoluceSignalImport;
    
    // Validate structure
    if (!importData.signals || !Array.isArray(importData.signals)) {
      return {
        success: false,
        recorded: 0,
        errors: ['Invalid import format: signals array is required'],
      };
    }

    if (!importData.assetIds || !Array.isArray(importData.assetIds)) {
      return {
        success: false,
        recorded: 0,
        errors: ['Invalid import format: assetIds array is required'],
      };
    }

    return await importTechnoSoluceSignals(importData);
  } catch (error) {
    return {
      success: false,
      recorded: 0,
      errors: [`Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`],
    };
  }
}

