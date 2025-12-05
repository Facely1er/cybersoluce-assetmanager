/**
 * Asset Discovery Service
 * Discovers supporting assets from data inventory items
 */

import { DataInventoryItem } from '../types/dataInventory';
import { LiteAsset } from '../types/assetLite';

export interface AssetDiscoveryResult {
  discoveredAssets: LiteAsset[];
  suggestedMappings: Map<string, string[]>; // dataItemId -> assetIds
  confidence: 'high' | 'medium' | 'low';
  reasoning: string[];
}

export class AssetDiscoveryService {
  /**
   * Discover supporting assets from data inventory
   */
  static discoverAssetsFromData(
    dataItems: DataInventoryItem[],
    existingAssets: LiteAsset[]
  ): AssetDiscoveryResult {
    const discoveredAssets: LiteAsset[] = [];
    const suggestedMappings = new Map<string, string[]>();
    const reasoning: string[] = [];

    for (const dataItem of dataItems) {
      const matchingAssets: string[] = [];

      // Match by location
      const locationMatches = existingAssets.filter(asset =>
        asset.location.toLowerCase() === dataItem.location.toLowerCase() ||
        asset.location.toLowerCase().includes(dataItem.location.toLowerCase()) ||
        dataItem.location.toLowerCase().includes(asset.location.toLowerCase())
      );

      // Match by owner
      const ownerMatches = existingAssets.filter(asset =>
        asset.owner.toLowerCase() === dataItem.owner.toLowerCase()
      );

      // Match by type (Database for data items)
      const typeMatches = existingAssets.filter(asset =>
        asset.type === 'Database' || asset.type === 'File System' || asset.type === 'Application'
      );

      // Combine matches with priority
      const allMatches = new Set<string>();
      
      // High priority: location + owner match
      locationMatches.forEach(asset => {
        if (ownerMatches.some(o => o.id === asset.id)) {
          allMatches.add(asset.id);
          matchingAssets.push(asset.id);
        }
      });

      // Medium priority: location match
      locationMatches.forEach(asset => {
        if (!allMatches.has(asset.id)) {
          allMatches.add(asset.id);
          matchingAssets.push(asset.id);
        }
      });

      // Low priority: type match
      typeMatches.forEach(asset => {
        if (!allMatches.has(asset.id) && matchingAssets.length < 3) {
          allMatches.add(asset.id);
          matchingAssets.push(asset.id);
        }
      });

      if (matchingAssets.length > 0) {
        suggestedMappings.set(dataItem.id, matchingAssets);
        reasoning.push(
          `Data item "${dataItem.name}" mapped to ${matchingAssets.length} asset(s) based on location, owner, and type matching`
        );
      } else {
        // Suggest creating a new asset
        const newAsset = this.suggestNewAsset(dataItem);
        discoveredAssets.push(newAsset);
        suggestedMappings.set(dataItem.id, [newAsset.id]);
        reasoning.push(
          `No existing assets found for "${dataItem.name}". Suggested new asset: ${newAsset.name}`
        );
      }
    }

    const confidence = this.calculateConfidence(suggestedMappings, existingAssets);

    return {
      discoveredAssets,
      suggestedMappings,
      confidence,
      reasoning,
    };
  }

  /**
   * Suggest a new asset based on data item
   */
  private static suggestNewAsset(dataItem: DataInventoryItem): LiteAsset {
    // Determine asset type based on data item characteristics
    let assetType: LiteAsset['type'] = 'Database';
    if (dataItem.location.toLowerCase().includes('file') || 
        dataItem.location.toLowerCase().includes('storage')) {
      assetType = 'File System';
    } else if (dataItem.location.toLowerCase().includes('app') ||
               dataItem.location.toLowerCase().includes('service')) {
      assetType = 'Application';
    }

    // Determine criticality based on classification
    let criticality: LiteAsset['criticality'] = 'Medium';
    if (dataItem.classification === 'Restricted' || dataItem.classification === 'Top Secret') {
      criticality = 'Critical';
    } else if (dataItem.classification === 'Confidential') {
      criticality = 'High';
    }

    return {
      id: `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `Supporting Asset for ${dataItem.name}`,
      type: assetType,
      criticality,
      owner: dataItem.owner,
      location: dataItem.location,
      description: `Auto-discovered asset supporting data item: ${dataItem.name}`,
      dataClassification: dataItem.classification,
      dataTypes: [dataItem.dataType],
      isSoftware: false,
      relatedDataItems: [dataItem.id],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Calculate confidence level for discovery results
   */
  private static calculateConfidence(
    mappings: Map<string, string[]>,
    existingAssets: LiteAsset[]
  ): 'high' | 'medium' | 'low' {
    if (mappings.size === 0) return 'low';

    let highConfidenceMatches = 0;

    mappings.forEach((assetIds) => {
      // High confidence if multiple assets match or assets have high criticality
      const matchedAssets = existingAssets.filter(a => assetIds.includes(a.id));
      if (matchedAssets.length > 1 || 
          matchedAssets.some(a => a.criticality === 'Critical' || a.criticality === 'High')) {
        highConfidenceMatches++;
      }
    });

    const highConfidenceRatio = highConfidenceMatches / mappings.size;
    
    if (highConfidenceRatio >= 0.7) return 'high';
    if (highConfidenceRatio >= 0.4) return 'medium';
    return 'low';
  }
}

