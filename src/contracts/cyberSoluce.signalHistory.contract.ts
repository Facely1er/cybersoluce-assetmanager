/**
 * CyberSoluce Signal History Contract
 * 
 * Time-series contract for tracking how qualitative signals evolve over time per asset.
 * 
 * RULES:
 * - NO scores, risk posture, compliance claims, or dashboards
 * - Only factual snapshots of signal state at points in time
 * - Used to derive "visibility drift" insights (stable / emerging change / uncertainty / volatility)
 * - UX surfaces = text-based hints and micro-insights only
 * 
 * @internal This contract enables change-over-time intelligence as a thin domain layer.
 */

import { AssetSignal } from './cyberSoluce.signal.contract';

/**
 * Signal Snapshot
 * 
 * A point-in-time capture of signals for a specific asset.
 * Contains only factual data - no derived scores or assessments.
 */
export interface SignalSnapshot {
  /** Asset identifier this snapshot belongs to */
  assetId: string;
  
  /** ISO 8601 timestamp when this snapshot was captured */
  capturedAt: string;
  
  /** Array of signals present at this point in time */
  signals: AssetSignal[];
  
  /** Source system that generated this snapshot */
  source: 'cybersoluce' | 'technosoluce' | 'vendorsoluce' | 'cybercaution' | 'demo';
}

/**
 * Signal History
 * 
 * Complete time-series history of signal snapshots for a single asset.
 * Snapshots are ordered chronologically (oldest first).
 */
export interface SignalHistory {
  /** Asset identifier this history belongs to */
  assetId: string;
  
  /** Chronologically ordered array of signal snapshots */
  snapshots: SignalSnapshot[];
}

