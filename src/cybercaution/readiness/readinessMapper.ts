/**
 * Scenario Readiness Mapper
 * 
 * Maps drift status to scenario readiness for CyberCaution pre-check.
 * 
 * RULES:
 * - NO risk posture, compliance status, or trend scoring
 * - Only describes visibility readiness for scenario planning
 * - Language focuses on stability and clarity, not security
 */

import { DriftStatus } from '@/contracts/cyberSoluce.drift.contract';

/**
 * Scenario Readiness Status
 * 
 * Describes how ready an asset is for inclusion in a scenario exercise
 * based on visibility stability.
 */
export type ScenarioReadiness =
  | 'ready'
  | 'needs-clarification'
  | 'unstable'
  | 'no-history';

/**
 * Asset Scenario Readiness
 * 
 * Complete readiness assessment for an asset in scenario planning context.
 */
export interface AssetScenarioReadiness {
  assetId: string;
  name?: string;
  driftStatus: DriftStatus;
  hasSBOM: boolean;
  hasVendorLinks: boolean;
  readiness: ScenarioReadiness;
}

/**
 * Map drift status to scenario readiness
 * 
 * This is visibility-readiness, not risk.
 * An asset with stable visibility is "ready" for scenario planning
 * because you have a clear, consistent picture of it.
 */
export function mapDriftToReadiness(status: DriftStatus): ScenarioReadiness {
  switch (status) {
    case 'stable-visibility':
      return 'ready';
    case 'emerging-change':
      return 'needs-clarification';
    case 'increasing-uncertainty':
    case 'high-variance':
      return 'unstable';
    case 'no-history':
    default:
      return 'no-history';
  }
}

