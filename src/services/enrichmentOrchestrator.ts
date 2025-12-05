/**
 * Enrichment Orchestrator
 * Coordinates bidirectional enrichment workflows
 */

import { DataInventoryItem } from '../types/dataInventory';
import { LiteAsset } from '../types/assetLite';
import { AssetDiscoveryService, AssetDiscoveryResult } from './assetDiscoveryService';
import { DataClassificationService } from './dataClassificationService';
import { ClassificationResult } from '../types/classification';
import { SBOMAutogenerationService, SBOMAutogenerationResult } from './sbom/sbomAutogenerationService';
import { SBOMResult } from '../types/sbomLite';
import { Asset } from '../types/asset';
import BaselineSBOMService from './sbom/baselineSBOMService';

export interface EnrichmentResult {
  direction: 'data-to-assets' | 'assets-to-data';
  assetDiscovery?: AssetDiscoveryResult;
  dataClassification?: ClassificationResult;
  sbomResults?: SBOMResult[];
  timestamp: Date;
  success: boolean;
  errors?: string[];
}

export class EnrichmentOrchestrator {
  /**
   * Convert LiteAsset to Asset for SBOM processing
   */
  private static convertLiteAssetToAsset(liteAsset: LiteAsset): Asset {
    return {
      id: liteAsset.id,
      name: liteAsset.name,
      type: liteAsset.type === 'Software' ? 'Application' : liteAsset.type as Asset['type'],
      assetType: liteAsset.isSoftware ? 'software' : 'application',
      criticality: liteAsset.criticality,
      owner: liteAsset.owner,
      location: liteAsset.location,
      description: liteAsset.description,
      dataClassification: liteAsset.dataClassification || 'Internal',
      dataTypes: liteAsset.dataTypes || [],
      tags: liteAsset.tags || [],
      complianceFrameworks: [],
      riskScore: 0,
      lastAssessed: new Date(),
      relationships: [],
      vulnerabilities: [],
      status: 'Active',
      createdAt: liteAsset.createdAt,
      updatedAt: liteAsset.updatedAt,
      crossBorderTransfer: false,
      thirdPartySharing: false,
      encryptionStatus: 'Unknown',
      accessControls: [],
      privacyImpactAssessment: null,
      dataBreachHistory: [],
      dependencies: [],
      requirements: [],
      legalBasis: [],
      dataSubjectRights: [],
      technoSoluceData: {
        sbomAvailable: liteAsset.sbomAvailable || false,
        sbomAnalysis: liteAsset.sbomData,
      },
    };
  }

  /**
   * Convert SBOMAutogenerationResult to SBOMResult
   */
  private static convertSBOMResult(result: SBOMAutogenerationResult): SBOMResult {
    return {
      assetId: result.assetId,
      assetName: result.assetName,
      status: result.status,
      baselineMatch: result.baselineMatch ? {
        id: result.baselineMatch.id,
        name: result.baselineMatch.name,
        version: result.baselineMatch.version,
        ecosystem: result.baselineMatch.ecosystem,
        path: result.baselineMatch.path,
        format: (result.baselineMatch.format === 'CycloneDX' || 
                 result.baselineMatch.format === 'SPDX' || 
                 result.baselineMatch.format === 'SWID') 
          ? result.baselineMatch.format 
          : 'CycloneDX' as const,
      } : undefined,
      sbomData: result.sbomData,
      error: result.error,
      message: result.message,
    };
  }

  /**
   * Enrich from data inventory to assets
   */
  static async enrichDataToAssets(
    dataItems: DataInventoryItem[],
    existingAssets: LiteAsset[]
  ): Promise<EnrichmentResult> {
    const errors: string[] = [];

    try {
      // Discover assets from data
      const assetDiscovery = AssetDiscoveryService.discoverAssetsFromData(
        dataItems,
        existingAssets
      );

      // Process SBOMs for discovered software assets
      let sbomResults: SBOMResult[] = [];
      try {
        const allAssets = [...existingAssets, ...assetDiscovery.discoveredAssets];
        const convertedAssets = allAssets.map(asset => this.convertLiteAssetToAsset(asset));
        const baselines = await BaselineSBOMService.getAllBaselines();
        const autogenerationResults = await SBOMAutogenerationService.processSoftwareAssets(convertedAssets, baselines);
        sbomResults = autogenerationResults.map(result => this.convertSBOMResult(result));
      } catch (error) {
        errors.push(`SBOM processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      return {
        direction: 'data-to-assets',
        assetDiscovery,
        sbomResults,
        timestamp: new Date(),
        success: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined,
      };
    } catch (error) {
      return {
        direction: 'data-to-assets',
        timestamp: new Date(),
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  /**
   * Enrich from assets to data classification
   */
  static async enrichAssetsToData(
    assets: LiteAsset[],
    dataItems: DataInventoryItem[]
  ): Promise<EnrichmentResult> {
    const errors: string[] = [];

    try {
      // Classify data based on assets
      const dataClassification = DataClassificationService.classifyDataFromAssets(
        assets,
        dataItems
      );

      // Process SBOMs for software assets
      let sbomResults: SBOMResult[] = [];
      try {
        const convertedAssets = assets.map(asset => this.convertLiteAssetToAsset(asset));
        const baselines = await BaselineSBOMService.getAllBaselines();
        const autogenerationResults = await SBOMAutogenerationService.processSoftwareAssets(convertedAssets, baselines);
        sbomResults = autogenerationResults.map(result => this.convertSBOMResult(result));
      } catch (error) {
        errors.push(`SBOM processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      return {
        direction: 'assets-to-data',
        dataClassification,
        sbomResults,
        timestamp: new Date(),
        success: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined,
      };
    } catch (error) {
      return {
        direction: 'assets-to-data',
        timestamp: new Date(),
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  /**
   * Full bidirectional enrichment
   */
  static async enrichBidirectional(
    dataItems: DataInventoryItem[],
    assets: LiteAsset[]
  ): Promise<{
    dataToAssets: EnrichmentResult;
    assetsToData: EnrichmentResult;
  }> {
    const [dataToAssets, assetsToData] = await Promise.all([
      this.enrichDataToAssets(dataItems, assets),
      this.enrichAssetsToData(assets, dataItems),
    ]);

    return {
      dataToAssets,
      assetsToData,
    };
  }
}

