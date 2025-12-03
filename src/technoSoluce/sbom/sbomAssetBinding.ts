/**
 * SBOM Asset Binding
 * 
 * Lightweight binding model for mapping SBOMs to assets.
 * 
 * RULES:
 * - No automatic inference beyond declared links
 * - Multiple assets can reference the same SBOM
 * - Binding source must be explicit
 */

/**
 * SBOM Asset Binding
 * 
 * Represents a link between an SBOM and one or more assets.
 */
export type SBOMAssetBinding = {
  /** SBOM identifier */
  sbomId: string;
  
  /** Asset identifier */
  assetId: string;
  
  /** Source of the binding */
  bindingSource: 'user-declared' | 'repository-link' | 'ci-pipeline';
  
  /** Timestamp when binding was created */
  createdAt: string; // ISO 8601 timestamp
};

/**
 * Get asset IDs linked to a specific SBOM
 * 
 * @param bindings - Array of SBOM asset bindings
 * @param sbomId - SBOM identifier
 * @returns Array of asset IDs
 */
export function getAssetIdsForSBOM(
  bindings: SBOMAssetBinding[],
  sbomId: string
): string[] {
  return bindings
    .filter(binding => binding.sbomId === sbomId)
    .map(binding => binding.assetId);
}

/**
 * Get SBOM IDs linked to a specific asset
 * 
 * @param bindings - Array of SBOM asset bindings
 * @param assetId - Asset identifier
 * @returns Array of SBOM IDs
 */
export function getSBOMIdsForAsset(
  bindings: SBOMAssetBinding[],
  assetId: string
): string[] {
  return bindings
    .filter(binding => binding.assetId === assetId)
    .map(binding => binding.sbomId);
}

/**
 * Create a new SBOM asset binding
 * 
 * @param sbomId - SBOM identifier
 * @param assetId - Asset identifier
 * @param bindingSource - Source of the binding
 * @returns New binding object
 */
export function createSBOMAssetBinding(
  sbomId: string,
  assetId: string,
  bindingSource: SBOMAssetBinding['bindingSource']
): SBOMAssetBinding {
  return {
    sbomId,
    assetId,
    bindingSource,
    createdAt: new Date().toISOString(),
  };
}

