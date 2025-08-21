export interface Asset {
  id: string;
  name: string;
  type: 'Server' | 'Database' | 'Application' | 'Network' | 'Endpoint' | 'Cloud Service';
  criticality: 'Critical' | 'High' | 'Medium' | 'Low';
  owner: string;
  location: string;
  ipAddress?: string;
  description: string;
  complianceFrameworks: string[];
  riskScore: number;
  lastAssessed: Date;
  tags: string[];
  relationships: AssetRelationship[];
  vulnerabilities: Vulnerability[];
  status: 'Active' | 'Inactive' | 'Retired' | 'Planned';
  createdAt: Date;
  updatedAt: Date;
  // Temporary field for bulk editing
  addTags?: string;
}

export interface AssetRelationship {
  id: string;
  relatedAssetId: string;
  relatedAssetName: string;
  relationshipType: 'Depends On' | 'Connects To' | 'Hosts' | 'Manages' | 'Accesses';
  strength: 'Strong' | 'Medium' | 'Weak';
}

export interface Vulnerability {
  id: string;
  cveId?: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  discoveredAt: Date;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Accepted Risk';
}

export interface AssetFilters {
  search: string;
  types: string[];
  criticalities: string[];
  owners: string[];
  locations: string[];
  complianceFrameworks: string[];
  status: string[];
  tags: string[];
  riskScoreRange: [number, number];
}

export interface SortConfig {
  key: keyof Asset | null;
  direction: 'asc' | 'desc';
}

export interface AssetInventoryState {
  assets: Asset[];
  filteredAssets: Asset[];
  selectedAssets: string[];
  filters: AssetFilters;
  sortConfig: SortConfig;
  currentPage: number;
  itemsPerPage: number;
  loading: boolean;
  selectedAsset: Asset | null;
  showDetailModal: boolean;
  showImportModal: boolean;
  searchDebounce: number;
}

export interface AssetStats {
  total: number;
  critical: number;
  untagged: number;
  recentlyAdded: number;
  byType: Record<string, number>;
  byCriticality: Record<string, number>;
  byStatus: Record<string, number>;
}