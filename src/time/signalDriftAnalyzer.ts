/**
 * Signal Drift Analyzer
 * 
 * Analyzes signal history to derive visibility drift insights.
 * 
 * RULES:
 * - Language stays at "signal / visibility", never "risk going up/down"
 * - No scoring, no posture assessment
 * - Only describes how signals change over time
 */

import { SignalHistory } from '@/contracts/cyberSoluce.signalHistory.contract';
import { DriftInsight, DriftStatus } from '@/contracts/cyberSoluce.drift.contract';

/**
 * Analyze signal drift from history
 * 
 * @param history - Signal history for an asset (or null if no history)
 * @returns Drift insight describing how signals have evolved
 */
export function analyzeSignalDrift(history: SignalHistory | null): DriftInsight {
  if (!history || history.snapshots.length === 0) {
    return {
      assetId: history?.assetId ?? 'unknown',
      status: 'no-history',
      windowStart: null,
      windowEnd: null,
      supportingSignals: ['No historical visibility data available.'],
    };
  }

  // Filter out demo snapshots - drift insights require real operational data
  const realSnapshots = history.snapshots.filter(s => s.source !== 'demo');
  
  if (realSnapshots.length === 0) {
    return {
      assetId: history.assetId,
      status: 'no-history',
      windowStart: null,
      windowEnd: null,
      supportingSignals: ['Change-over-time insights require real operational data.'],
    };
  }

  // Ensure snapshots are sorted chronologically (oldest first)
  const snapshots = [...realSnapshots].sort(
    (a, b) => new Date(a.capturedAt).getTime() - new Date(b.capturedAt).getTime(),
  );

  const windowStart = snapshots[0].capturedAt;
  const windowEnd = snapshots[snapshots.length - 1].capturedAt;

  // Extract signal types over time
  const signalTypesOverTime: string[][] = snapshots.map(s =>
    s.signals.map(sig => sig.signalType),
  );

  const status: DriftStatus = deriveDriftStatus(signalTypesOverTime);
  const supportingSignals = buildSupportingNarrative(signalTypesOverTime, status);

  return {
    assetId: history.assetId,
    status,
    windowStart,
    windowEnd,
    supportingSignals,
  };
}

/**
 * Derive drift status from signal types over time
 */
function deriveDriftStatus(signalTypesOverTime: string[][]): DriftStatus {
  if (!signalTypesOverTime.length) return 'no-history';

  const first = new Set(signalTypesOverTime[0]);
  const last = new Set(signalTypesOverTime[signalTypesOverTime.length - 1]);

  const allTypes = new Set(signalTypesOverTime.flat());
  const distinctCount = allTypes.size;

  // Count "uncertainty" style types
  const uncertaintyKeywords = ['uncertainty', 'unknown'];
  const uncertaintyCountFirst = signalTypesOverTime[0].filter(t =>
    uncertaintyKeywords.some(k => t.includes(k)),
  ).length;
  const uncertaintyCountLast = signalTypesOverTime[signalTypesOverTime.length - 1].filter(t =>
    uncertaintyKeywords.some(k => t.includes(k)),
  ).length;

  const hasNewTypesInLast = [...last].some(t => !first.has(t));

  // Stable: few distinct types, no new types, uncertainty unchanged
  if (distinctCount <= 2 && !hasNewTypesInLast && uncertaintyCountLast === uncertaintyCountFirst) {
    return 'stable-visibility';
  }

  // Emerging change: new types appeared, uncertainty not increasing
  if (hasNewTypesInLast && uncertaintyCountLast <= uncertaintyCountFirst) {
    return 'emerging-change';
  }

  // Increasing uncertainty: more uncertainty signals over time
  if (uncertaintyCountLast > uncertaintyCountFirst) {
    return 'increasing-uncertainty';
  }

  // High variance: large differences between snapshots
  const varianceScore = estimateVariance(signalTypesOverTime);
  if (varianceScore > 0.6) {
    return 'high-variance';
  }

  // Default to emerging change if we can't classify
  return 'emerging-change';
}

/**
 * Estimate variance in signal types across snapshots
 * Returns a score between 0 (no variance) and 1 (high variance)
 */
function estimateVariance(signalTypesOverTime: string[][]): number {
  if (signalTypesOverTime.length < 2) return 0;
  
  let changes = 0;
  let comparisons = 0;

  for (let i = 1; i < signalTypesOverTime.length; i++) {
    const prev = new Set(signalTypesOverTime[i - 1]);
    const curr = new Set(signalTypesOverTime[i]);
    const all = new Set([...prev, ...curr]);
    
    let diff = 0;
    all.forEach(t => {
      const inPrev = prev.has(t);
      const inCurr = curr.has(t);
      if (inPrev !== inCurr) diff++;
    });
    
    if (all.size > 0) {
      changes += diff / all.size;
      comparisons++;
    }
  }

  return comparisons === 0 ? 0 : changes / comparisons;
}

/**
 * Build supporting narrative for drift status
 * 
 * Language stays at "signal / visibility", never "risk going up/down"
 */
function buildSupportingNarrative(
  signalTypesOverTime: string[][],
  status: DriftStatus
): string[] {
  const messages: string[] = [];

  switch (status) {
    case 'stable-visibility':
      messages.push('Signal types have remained broadly consistent across observations.');
      break;
    case 'emerging-change':
      messages.push('New types of signals have appeared in more recent observations.');
      break;
    case 'increasing-uncertainty':
      messages.push('Uncertainty-related signals have increased over recent observations.');
      break;
    case 'high-variance':
      messages.push('Signal types for this asset have changed significantly between observations.');
      break;
    case 'no-history':
    default:
      messages.push('No historical visibility data is available for this asset.');
      break;
  }

  return messages;
}

