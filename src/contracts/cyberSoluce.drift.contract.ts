/**
 * CyberSoluce Drift Contract
 * 
 * Contract for visibility drift insights derived from signal history.
 * 
 * RULES:
 * - NO risk posture, compliance status, or trend scoring
 * - Only describes how visibility/signals change over time
 * - Text-based insights only - no charts, dashboards, or visual trends
 * 
 * @internal This contract describes how our picture of an asset changes,
 * not how "safe" or "compliant" it is.
 */

/**
 * Drift Status
 * 
 * Qualitative descriptor of how signal visibility has changed over time.
 * These are NOT risk indicators - they describe signal stability/change.
 */
export type DriftStatus =
  | 'no-history'
  | 'stable-visibility'
  | 'emerging-change'
  | 'increasing-uncertainty'
  | 'high-variance';

/**
 * Drift Insight
 * 
 * Analysis result describing how signals for an asset have evolved.
 * Contains only factual observations about signal changes, not risk assessments.
 */
export interface DriftInsight {
  /** Asset identifier */
  assetId: string;
  
  /** Qualitative drift status */
  status: DriftStatus;
  
  /** Start of observation window (ISO timestamp) */
  windowStart: string | null;
  
  /** End of observation window (ISO timestamp) */
  windowEnd: string | null;
  
  /** Human-readable supporting narrative (text-only) */
  supportingSignals: string[];
}

