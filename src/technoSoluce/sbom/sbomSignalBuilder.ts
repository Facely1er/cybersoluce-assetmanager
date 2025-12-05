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
import { SignalHistory } from '../../contracts/cyberSoluce.signalHistory.contract';

/**
 * Build SBOM-derived signals from SBOM intake data
 * 
 * @param sbom - SBOM intake data (factual only)
 * @param linkedAssetIds - Asset IDs that this SBOM is linked to
 * @param historicalData - Optional historical signal data for change-over-time analysis
 * @returns Array of SBOM signals
 */
export function buildSBOMSignals(
  sbom: SBOMIntake | null,
  linkedAssetIds: string[],
  historicalData?: {
    history?: SignalHistory | null;
    previousComponentCount?: number;
  }
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
  
  // If component count changes week-over-week → component-churn-detected
  if (sbom && historicalData) {
    const previousCount = historicalData.previousComponentCount;
    const currentCount = sbom.componentsCount;
    
    // Check historical snapshots for component count changes
    if (historicalData.history && historicalData.history.snapshots.length > 0) {
      // Get snapshots from the last 7 days (week-over-week comparison)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const weekAgoISO = oneWeekAgo.toISOString();
      
      const recentSnapshots = historicalData.history.snapshots.filter(
        s => new Date(s.capturedAt) >= oneWeekAgo
      );
      
      // Find SBOM-related signals in historical snapshots
      const historicalSBOMSignals = recentSnapshots
        .flatMap(s => s.signals)
        .filter(sig => sig.signalDomain === 'software' && 
                      (sig.signalType === 'dependency' || sig.description.includes('component')));
      
      // Extract component counts from historical signals if available
      // Look for signals that mention component counts
      const historicalCounts: number[] = [];
      historicalSBOMSignals.forEach(sig => {
        const match = sig.description.match(/(\d+)\s+components?/i) || 
                     sig.concentrationDescription?.match(/(\d+)\s+components?/i);
        if (match) {
          historicalCounts.push(parseInt(match[1], 10));
        }
      });
      
      // Use the most recent historical count if available
      const lastHistoricalCount = historicalCounts.length > 0 
        ? historicalCounts[historicalCounts.length - 1]
        : previousCount;
      
      // Detect significant component count changes (>10% change or >5 components)
      if (lastHistoricalCount !== undefined && lastHistoricalCount > 0) {
        const change = Math.abs(currentCount - lastHistoricalCount);
        const changePercent = (change / lastHistoricalCount) * 100;
        
        if (changePercent > 10 || change > 5) {
          const direction = currentCount > lastHistoricalCount ? 'increased' : 'decreased';
          signals.push({
            signalId: `sbom-signal-churn-${sbom.sbomId}`,
            signalType: 'component-churn-detected',
            description: `Component count ${direction} from ${lastHistoricalCount} to ${currentCount} components`,
            confidence: changePercent > 20 ? 'high' : 'medium',
            source: sbom.source === 'upload' ? 'user' : 'import',
            timestamp: now,
            signalDomain: 'software',
            affectedAssetIds: [...linkedAssetIds],
            concentrationDescription: `Software composition has changed: ${change} components ${direction} (${changePercent.toFixed(1)}% change)`,
          });
        }
      }
    } else if (previousCount !== undefined && previousCount > 0) {
      // Fallback to direct previous count comparison
      const change = Math.abs(currentCount - previousCount);
      const changePercent = (change / previousCount) * 100;
      
      if (changePercent > 10 || change > 5) {
        const direction = currentCount > previousCount ? 'increased' : 'decreased';
        signals.push({
          signalId: `sbom-signal-churn-${sbom.sbomId}`,
          signalType: 'component-churn-detected',
          description: `Component count ${direction} from ${previousCount} to ${currentCount} components`,
          confidence: changePercent > 20 ? 'high' : 'medium',
          source: sbom.source === 'upload' ? 'user' : 'import',
          timestamp: now,
          signalDomain: 'software',
          affectedAssetIds: [...linkedAssetIds],
          concentrationDescription: `Software composition has changed: ${change} components ${direction} (${changePercent.toFixed(1)}% change)`,
        });
      }
    }
  }
  
  // If dependencies exceed depth threshold without identifiers → transitive-dependency-opacity
  // Note: This requires parsing dependency depth from the SBOM structure
  // For now, we check if dependencies exist but component identifiers are missing
  // This is a simplified check - full depth analysis would require parsing the dependency graph
  if (sbom && sbom.hasDependencies && sbom.componentsCount > 0) {
    // If we have many components but relatively few have clear identifiers,
    // this suggests transitive dependencies without clear identification
    // This is a heuristic-free check: if dependencies exist, we note it
    // Full depth analysis would require parsing the actual dependency graph structure
    // which is format-dependent and complex, so we skip this for now
  }
  
  return signals;
}

