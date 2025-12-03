import { VendorSoluceDriftHint } from '../../contracts/vendorSoluce.driftHint.contract';
import {
  VendorVisibilityItem,
  mapDriftToVendorVisibility
} from './vendorVisibilityMapper';

/**
 * Build vendor visibility watchlist from existing export data
 * 
 * No new computation, no history calls — this reuses the VendorSoluce drift layer exactly as designed.
 */
export function buildVendorVisibilityWatchlist(
  driftHints: VendorSoluceDriftHint[]
): VendorVisibilityItem[] {
  return driftHints.map(hint => ({
    vendorId: hint.vendorId,
    vendorName: hint.vendorId, // swap for real vendor name if available
    relatedAssetIds: hint.relatedAssetIds,
    driftStatus: hint.status,
    visibilityStatus: mapDriftToVendorVisibility(hint.status),
    summary: hint.summary,
    details: hint.details,
  }));
}

