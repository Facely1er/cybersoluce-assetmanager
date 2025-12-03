/**
 * CyberCaution Drift Hint Contract
 * 
 * Visibility drift hints for CyberCaution export.
 * 
 * These hints describe how visibility around an asset has changed over time.
 * They do not represent risk scores, posture, or compliance status.
 * 
 * @internal These hints are derived from historical signals and are intended
 * to help prioritize which assets to include in scenarios, tabletop exercises,
 * and investigations. They remain purely qualitative and text-only.
 */

import { DriftStatus } from './cyberSoluce.drift.contract';

/**
 * CyberCaution Drift Hint
 * 
 * Text-only hint about how asset visibility has changed over time.
 * Used by CyberCaution to understand which assets have stable vs evolving visibility.
 */
export interface CyberCautionDriftHint {
  /** Asset identifier */
  assetId: string;
  
  /** Qualitative drift status */
  status: DriftStatus;
  
  /** One-line explanation of the drift status */
  summary: string;
  
  /** Bullet-level hints (optional, short) */
  details: string[];
}

