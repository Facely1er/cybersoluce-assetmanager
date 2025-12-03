/**
 * VendorSoluce Drift Hint Contract
 * 
 * Visibility drift hints for VendorSoluce export.
 * 
 * VendorSoluce drift hints describe how visibility around vendor-related assets has changed over time.
 * They are qualitative and do not express vendor risk scores, posture, or compliance status.
 * 
 * @internal These hints are derived from historical signals and are intended
 * to help prioritize which vendors and integrations may warrant closer review,
 * refreshed questionnaires, or scenario analysis. They remain purely qualitative and text-only.
 */

import { DriftStatus } from './cyberSoluce.drift.contract';

/**
 * VendorSoluce Drift Hint
 * 
 * Text-only hint about how visibility around vendor-related assets has changed over time.
 * Used by VendorSoluce to understand which vendors are backed by stable vs shifting/uncertain asset visibility.
 */
export interface VendorSoluceDriftHint {
  /** Vendor identifier (typically derived from asset owner or name for third-party services) */
  vendorId: string;
  
  /** Asset IDs related to this vendor */
  relatedAssetIds: string[];
  
  /** Qualitative drift status */
  status: DriftStatus;
  
  /** One-line qualitative explanation */
  summary: string;
  
  /** Short bullet-level hints */
  details: string[];
}

