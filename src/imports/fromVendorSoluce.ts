/**
 * Import Adapter: VendorSoluce → CyberSoluce
 * 
 * Imports enriched vendor risk data from VendorSoluce back into CyberSoluce assets.
 * This enables bidirectional data flow for vendor assessments.
 */

import { assetService } from '../services/assetService';

export interface VendorSoluceImportData {
  assetId: string;
  vendorAssessment?: {
    overallRiskRating: 'low' | 'medium' | 'high' | 'critical';
    financialStability: number; // 0-100
    operationalMaturity: number; // 0-100
    securityPosture: number; // 0-100
    complianceAdherence: number; // 0-100
    assessedAt: Date;
  };
  vendorDetails?: {
    vendorName: string;
    vendorType: string;
    contractValue?: number;
    contractStartDate?: Date;
    contractEndDate?: Date;
    certifications: string[];
    hasSOC2: boolean;
    hasISO27001: boolean;
    hasGDPRCompliance: boolean;
  };
  riskGaps?: Array<{
    category: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    remediationRequired: boolean;
  }>;
}

/**
 * Import vendor data from VendorSoluce
 */
export async function importFromVendorSoluce(
  importData: VendorSoluceImportData[]
): Promise<{ success: boolean; updated: number; errors: string[] }> {
  const errors: string[] = [];
  let updated = 0;

  for (const data of importData) {
    try {
      // Get existing asset
      const asset = await assetService.getAsset(data.assetId);
      if (!asset) {
        errors.push(`Asset ${data.assetId} not found`);
        continue;
      }

      // Update vendorSoluceData extension
      const existingVendorSoluceData = asset.vendorSoluceData || {};
      const updatedVendorSoluceData = {
        ...existingVendorSoluceData,
        ...(data.vendorAssessment && {
          vendorAssessment: {
            ...existingVendorSoluceData.vendorAssessment,
            ...data.vendorAssessment,
          },
        }),
        ...(data.vendorDetails && {
          vendorDetails: {
            ...existingVendorSoluceData.vendorDetails,
            ...data.vendorDetails,
          },
        }),
        ...(data.riskGaps && {
          riskGaps: [
            ...(existingVendorSoluceData.riskGaps || []),
            ...data.riskGaps,
          ],
        }),
        lastEnrichedAt: new Date().toISOString(),
        enrichedBy: 'VendorSoluce',
      };

      // Update asset with enriched data
      await assetService.updateAsset(data.assetId, {
        vendorSoluceData: updatedVendorSoluceData,
      });

      updated++;
    } catch (error) {
      errors.push(
        `Failed to import data for asset ${data.assetId}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  return {
    success: errors.length === 0,
    updated,
    errors,
  };
}

/**
 * Import single asset vendor data
 */
export async function importAssetVendorData(
  _assetId: string,
  vendorData: VendorSoluceImportData
): Promise<boolean> {
  try {
    const result = await importFromVendorSoluce([vendorData]);
    return result.success && result.updated > 0;
  } catch {
    return false;
  }
}

