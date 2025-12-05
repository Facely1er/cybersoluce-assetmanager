/**
 * Data Classification Types
 */

export interface DataClassification {
  dataItemId: string;
  suggestedClassification: 'Public' | 'Internal' | 'Confidential' | 'Restricted' | 'Top Secret';
  confidence: 'high' | 'medium' | 'low';
  reasoning: string[];
  basedOnAssets: string[]; // Asset IDs used for classification
  rulesApplied: ClassificationRule[];
}

export interface ClassificationRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  classification: 'Public' | 'Internal' | 'Confidential' | 'Restricted' | 'Top Secret';
  priority: number; // Higher priority rules are applied first
}

export interface ClassificationResult {
  classifications: Map<string, DataClassification>;
  overallConfidence: 'high' | 'medium' | 'low';
  itemsClassified: number;
  itemsUnclassified: number;
  rulesApplied: number;
}

