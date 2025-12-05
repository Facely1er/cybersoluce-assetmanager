/**
 * Data Classification Service
 * Classifies data based on asset characteristics
 */

import { DataInventoryItem } from '../types/dataInventory';
import { LiteAsset } from '../types/assetLite';
import { DataClassification, ClassificationRule, ClassificationResult } from '../types/classification';

export class DataClassificationService {
  private static classificationRules: ClassificationRule[] = [
    {
      id: 'rule-1',
      name: 'Critical Asset Classification',
      description: 'Data on critical assets is classified as Restricted or higher',
      condition: 'asset.criticality === "Critical"',
      classification: 'Restricted',
      priority: 10,
    },
    {
      id: 'rule-2',
      name: 'High Criticality Asset',
      description: 'Data on high criticality assets is classified as Confidential or higher',
      condition: 'asset.criticality === "High"',
      classification: 'Confidential',
      priority: 9,
    },
    {
      id: 'rule-3',
      name: 'PII Data Classification',
      description: 'PII data is classified as Confidential or higher',
      condition: 'asset.dataTypes?.includes("PII")',
      classification: 'Confidential',
      priority: 8,
    },
    {
      id: 'rule-4',
      name: 'PHI Data Classification',
      description: 'PHI data is classified as Restricted',
      condition: 'asset.dataTypes?.includes("PHI")',
      classification: 'Restricted',
      priority: 9,
    },
    {
      id: 'rule-5',
      name: 'Financial Data Classification',
      description: 'Financial data is classified as Confidential',
      condition: 'asset.dataTypes?.includes("Financial")',
      classification: 'Confidential',
      priority: 8,
    },
    {
      id: 'rule-6',
      name: 'Database Asset Classification',
      description: 'Data in databases is typically Confidential',
      condition: 'asset.type === "Database"',
      classification: 'Confidential',
      priority: 6,
    },
    {
      id: 'rule-7',
      name: 'Default Internal Classification',
      description: 'Default classification for unclassified data',
      condition: 'true',
      classification: 'Internal',
      priority: 1,
    },
  ];

  /**
   * Classify data based on asset characteristics
   */
  static classifyDataFromAssets(
    assets: LiteAsset[],
    dataItems: DataInventoryItem[]
  ): ClassificationResult {
    const classifications = new Map<string, DataClassification>();
    let itemsClassified = 0;
    let itemsUnclassified = 0;

    // Sort rules by priority (highest first)
    const sortedRules = [...this.classificationRules].sort((a, b) => b.priority - a.priority);

    for (const dataItem of dataItems) {
      // Find assets related to this data item
      const relatedAssets = assets.filter(asset =>
        asset.relatedDataItems?.includes(dataItem.id) ||
        dataItem.supportingAssets?.includes(asset.id)
      );

      if (relatedAssets.length === 0) {
        itemsUnclassified++;
        continue;
      }

      // Apply classification rules
      let suggestedClassification: DataClassification['suggestedClassification'] = 'Internal';
      const reasoning: string[] = [];
      const rulesApplied: ClassificationRule[] = [];
      const basedOnAssets: string[] = [];

      for (const asset of relatedAssets) {
        basedOnAssets.push(asset.id);

        // Apply rules in priority order
        for (const rule of sortedRules) {
          if (this.evaluateRule(rule, asset)) {
            // Check if this rule suggests a higher classification
            if (this.isHigherClassification(rule.classification, suggestedClassification)) {
              suggestedClassification = rule.classification;
              reasoning.push(
                `Rule "${rule.name}": ${rule.description} (applied to asset "${asset.name}")`
              );
              if (!rulesApplied.some(r => r.id === rule.id)) {
                rulesApplied.push(rule);
              }
            }
          }
        }
      }

      const confidence = this.calculateConfidence(relatedAssets, rulesApplied);

      classifications.set(dataItem.id, {
        dataItemId: dataItem.id,
        suggestedClassification,
        confidence,
        reasoning,
        basedOnAssets,
        rulesApplied,
      });

      itemsClassified++;
    }

    const overallConfidence = this.calculateOverallConfidence(classifications);

    return {
      classifications,
      overallConfidence,
      itemsClassified,
      itemsUnclassified,
      rulesApplied: sortedRules.length,
    };
  }

  /**
   * Evaluate a classification rule against an asset
   */
  private static evaluateRule(rule: ClassificationRule, asset: LiteAsset): boolean {
    try {
      // Simple rule evaluation (in production, use a proper rule engine)
      switch (rule.condition) {
        case 'asset.criticality === "Critical"':
          return asset.criticality === 'Critical';
        case 'asset.criticality === "High"':
          return asset.criticality === 'High';
        case 'asset.dataTypes?.includes("PII")':
          return asset.dataTypes?.includes('PII') ?? false;
        case 'asset.dataTypes?.includes("PHI")':
          return asset.dataTypes?.includes('PHI') ?? false;
        case 'asset.dataTypes?.includes("Financial")':
          return asset.dataTypes?.includes('Financial') ?? false;
        case 'asset.type === "Database"':
          return asset.type === 'Database';
        case 'true':
          return true;
        default:
          return false;
      }
    } catch {
      return false;
    }
  }

  /**
   * Check if one classification is higher than another
   */
  private static isHigherClassification(
    classification1: DataClassification['suggestedClassification'],
    classification2: DataClassification['suggestedClassification']
  ): boolean {
    const levels: Record<DataClassification['suggestedClassification'], number> = {
      'Public': 1,
      'Internal': 2,
      'Confidential': 3,
      'Restricted': 4,
      'Top Secret': 5,
    };

    return levels[classification1] > levels[classification2];
  }

  /**
   * Calculate confidence for a classification
   */
  private static calculateConfidence(
    assets: LiteAsset[],
    rulesApplied: ClassificationRule[]
  ): 'high' | 'medium' | 'low' {
    if (assets.length === 0) return 'low';
    if (rulesApplied.length === 0) return 'low';

    // High confidence if multiple assets match and high-priority rules applied
    const highPriorityRules = rulesApplied.filter(r => r.priority >= 8);
    if (assets.length >= 2 && highPriorityRules.length > 0) return 'high';
    if (highPriorityRules.length > 0) return 'medium';
    if (assets.length >= 2) return 'medium';
    return 'low';
  }

  /**
   * Calculate overall confidence for all classifications
   */
  private static calculateOverallConfidence(
    classifications: Map<string, DataClassification>
  ): 'high' | 'medium' | 'low' {
    if (classifications.size === 0) return 'low';

    let highConfidence = 0;
    let mediumConfidence = 0;

    classifications.forEach(classification => {
      switch (classification.confidence) {
        case 'high':
          highConfidence++;
          break;
        case 'medium':
          mediumConfidence++;
          break;
        case 'low':
          // Low confidence items are implicitly counted via total - high - medium
          break;
      }
    });

    const total = classifications.size;
    const highRatio = highConfidence / total;
    const mediumRatio = mediumConfidence / total;

    if (highRatio >= 0.6) return 'high';
    if (highRatio + mediumRatio >= 0.7) return 'medium';
    return 'low';
  }

  /**
   * Get all classification rules
   */
  static getRules(): ClassificationRule[] {
    return [...this.classificationRules];
  }

  /**
   * Add a custom classification rule
   */
  static addRule(rule: ClassificationRule): void {
    this.classificationRules.push(rule);
    this.classificationRules.sort((a, b) => b.priority - a.priority);
  }
}

