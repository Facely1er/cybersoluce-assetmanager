/**
 * Import Adapter: CyberCorrect → CyberSoluce
 * 
 * Imports enriched privacy data from CyberCorrect back into CyberSoluce assets.
 * This enables bidirectional data flow for privacy assessments.
 */

import { assetService } from '../services/assetService';

export interface CyberCorrectImportData {
  assetId: string;
  privacyAssessment?: {
    dataTypes: string[];
    processingPurposes: string[];
    privacyRisk: 'low' | 'medium' | 'high' | 'very-high';
    gdprCompliant: boolean;
    ccpaCompliant: boolean;
    dataSubjectRights: string[];
    crossBorderTransfers: boolean;
    assessedAt: Date;
  };
  dpias?: Array<{
    required: boolean;
    conducted: boolean;
    conductedDate?: Date;
    riskRating: 'low' | 'medium' | 'high' | 'very-high';
  }>;
  dataSubjectRequests?: {
    access: number;
    deletion: number;
    portability: number;
    averageResponseTime: number;
  };
}

/**
 * Import privacy data from CyberCorrect
 */
export async function importFromCyberCorrect(
  importData: CyberCorrectImportData[]
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

      // Update cyberCorrectData extension
      const existingCyberCorrectData = asset.cyberCorrectData || {};
      const updatedCyberCorrectData = {
        ...existingCyberCorrectData,
        ...(data.privacyAssessment && {
          privacyAssessment: {
            ...existingCyberCorrectData.privacyAssessment,
            ...data.privacyAssessment,
          },
        }),
        ...(data.dpias && {
          dpias: data.dpias,
        }),
        ...(data.dataSubjectRequests && {
          dataSubjectRequests: {
            ...existingCyberCorrectData.dataSubjectRequests,
            ...data.dataSubjectRequests,
          },
        }),
        lastEnrichedAt: new Date().toISOString(),
        enrichedBy: 'CyberCorrect',
      };

      // Update asset with enriched data
      await assetService.updateAsset(data.assetId, {
        cyberCorrectData: updatedCyberCorrectData,
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
 * Import single asset privacy data
 */
export async function importAssetPrivacyData(
  _assetId: string,
  privacyData: CyberCorrectImportData
): Promise<boolean> {
  try {
    const result = await importFromCyberCorrect([privacyData]);
    return result.success && result.updated > 0;
  } catch {
    return false;
  }
}

