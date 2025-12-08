/**
 * Signal Detection – focuses on WHERE attention may be needed,
 * not WHAT to do next.
 *
 * Outputs must remain:
 * - Qualitative
 * - Non-prescriptive
 * - Free of scoring / posture claims
 * 
 * @internal
 * This service is internal to CyberSoluce and should not be exported beyond the CyberSoluce boundary.
 * 
 * HARD LOCK: Any change that introduces scoring, posture, or recommendations
 * violates CyberSoluce design principles.
 * 
 * Detects qualitative focus signals from enriched assets.
 * Signals are descriptive and avoid numeric scoring.
 */

import { Asset } from '../types/asset';
import { FocusSignal } from '../types/enrichment';
import { assetEnrichmentService } from './assetEnrichmentService';
import { toSignalContract, AssetSignal } from '../contracts/cyberSoluce.signal.contract';
import { signalHistoryStore } from '../time/signalHistoryStore';
import { SignalSnapshot } from '../contracts/cyberSoluce.signalHistory.contract';
import { logger } from '../utils/logger';

class SignalDetectionService {
  /**
   * Detect all focus signals from assets
   * 
   * Also records signal snapshots for change-over-time intelligence.
   * Does NOT record snapshots for demo/sample data.
   */
  async detectSignals(assets: Asset[], options?: { isDemo?: boolean }): Promise<FocusSignal[]> {
    // First, enrich all assets
    await assetEnrichmentService.enrichAllAssets(assets);

    // Then detect signals
    const signals = assetEnrichmentService.detectFocusSignals(assets);

    // Record snapshots for live data only (not demo)
    if (!options?.isDemo && signals.length > 0) {
      await this.recordSignalSnapshots(assets, signals);
    }

    return signals;
  }

  /**
   * Record signal snapshots per asset for change-over-time intelligence
   * 
   * @internal Only called for live operational data, not demo/sample data
   */
  private async recordSignalSnapshots(assets: Asset[], signals: FocusSignal[]): Promise<void> {
    // Group signals by asset ID
    const signalsByAsset = new Map<string, FocusSignal[]>();
    
    signals.forEach(signal => {
      signal.affected_asset_ids.forEach(assetId => {
        if (!signalsByAsset.has(assetId)) {
          signalsByAsset.set(assetId, []);
        }
        signalsByAsset.get(assetId)!.push(signal);
      });
    });

    // Record snapshot for each asset that has signals
    const snapshotPromises: Promise<void>[] = [];
    
    signalsByAsset.forEach((assetSignals, assetId) => {
      // Convert FocusSignal[] to AssetSignal[]
      const assetSignalContracts: AssetSignal[] = assetSignals.map(signal =>
        toSignalContract(signal)
      );

      const snapshot: SignalSnapshot = {
        assetId,
        capturedAt: new Date().toISOString(),
        signals: assetSignalContracts,
        source: 'cybersoluce',
      };

      snapshotPromises.push(signalHistoryStore.recordSnapshot(snapshot));
    });

    // Record all snapshots (fire and forget - don't block signal detection)
    Promise.all(snapshotPromises).catch(error => {
      // Log but don't throw - snapshot recording is non-blocking
      logger.warn('[SignalDetectionService] Failed to record signal snapshots:', error);
    });
  }

  /**
   * Get signals by domain
   */
  getSignalsByDomain(signals: FocusSignal[]): Record<FocusSignal['signal_domain'], FocusSignal[]> {
    return signals.reduce((acc, signal) => {
      if (!acc[signal.signal_domain]) {
        acc[signal.signal_domain] = [];
      }
      acc[signal.signal_domain].push(signal);
      return acc;
    }, {} as Record<FocusSignal['signal_domain'], FocusSignal[]>);
  }

  /**
   * Get signal summary
   */
  getSignalSummary(signals: FocusSignal[]): {
    total: number;
    byDomain: Record<FocusSignal['signal_domain'], number>;
    totalAffectedAssets: number;
  } {
    const byDomain = this.getSignalsByDomain(signals);
    const totalAffectedAssets = new Set(
      signals.flatMap(s => s.affected_asset_ids)
    ).size;

    return {
      total: signals.length,
      byDomain: Object.keys(byDomain).reduce((acc, domain) => {
        acc[domain as FocusSignal['signal_domain']] = byDomain[domain as FocusSignal['signal_domain']].length;
        return acc;
      }, {} as Record<FocusSignal['signal_domain'], number>),
      totalAffectedAssets,
    };
  }
}

export const signalDetectionService = new SignalDetectionService();

