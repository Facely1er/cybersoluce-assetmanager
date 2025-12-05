/**
 * Simplified Asset Types for CyberSoluce Lite
 */

export interface LiteAsset {
  readonly id: string;
  name: string;
  type: 'Server' | 'Database' | 'Application' | 'Network' | 'File System' | 'Software' | 'Service';
  criticality: 'Critical' | 'High' | 'Medium' | 'Low';
  owner: string;
  location: string;
  description: string;
  dataClassification?: 'Public' | 'Internal' | 'Confidential' | 'Restricted' | 'Top Secret';
  dataTypes?: string[]; // e.g., ['PII', 'PHI', 'Financial']
  isSoftware: boolean;
  sbomAvailable?: boolean;
  sbomData?: Record<string, unknown>;
  relatedDataItems?: string[]; // Data inventory item IDs
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AssetFilters {
  search: string;
  types: string[];
  criticalities: string[];
  owners: string[];
  locations: string[];
  isSoftware?: boolean;
  hasSBOM?: boolean;
}

export interface AssetStats {
  total: number;
  byType: Record<string, number>;
  byCriticality: Record<string, number>;
  softwareAssets: number;
  withSBOM: number;
  withDataClassification: number;
}

