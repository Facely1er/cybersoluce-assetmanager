import { DriftStatus } from '../../contracts/cyberSoluce.drift.contract';

export type VendorVisibilityStatus =
  | 'stable'
  | 'changing'
  | 'uncertain'
  | 'no-history';

export interface VendorVisibilityItem {
  vendorId: string;
  vendorName?: string;
  relatedAssetIds: string[];
  driftStatus: DriftStatus;
  visibilityStatus: VendorVisibilityStatus;
  summary: string;
  details: string[];
}

/**
 * Map drift status to vendor visibility status
 * 
 * Terminology deliberately avoids "risk", "rating", or "posture".
 * This is purely about visibility stability.
 */
export function mapDriftToVendorVisibility(
  drift: DriftStatus
): VendorVisibilityStatus {
  switch (drift) {
    case 'stable-visibility':
      return 'stable';
    case 'emerging-change':
      return 'changing';
    case 'increasing-uncertainty':
    case 'high-variance':
      return 'uncertain';
    case 'no-history':
    default:
      return 'no-history';
  }
}

