/**
 * Data Inventory Types
 * Core types for data inventory items
 */

export interface DataInventoryItem {
  readonly id: string;
  name: string;
  dataType: 'PII' | 'PHI' | 'Financial' | 'Intellectual Property' | 'Business Data' | 'Other';
  classification: 'Public' | 'Internal' | 'Confidential' | 'Restricted' | 'Top Secret';
  location: string;
  owner: string;
  description?: string;
  retentionPeriod?: number; // in days
  supportingAssets?: string[]; // Asset IDs that support this data
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DataInventoryFilters {
  search: string;
  dataTypes: string[];
  classifications: string[];
  owners: string[];
  locations: string[];
}

export interface DataInventoryStats {
  total: number;
  byDataType: Record<string, number>;
  byClassification: Record<string, number>;
  withSupportingAssets: number;
  withoutSupportingAssets: number;
}

