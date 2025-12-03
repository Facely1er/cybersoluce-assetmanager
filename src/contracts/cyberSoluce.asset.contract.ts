/**
 * CyberSoluce Asset Contract
 * 
 * Authoritative data contract for assets exported from CyberSoluce.
 * 
 * RULES:
 * - NO optional "score", "risk", "compliance", "criticality" fields
 * - Only factual + qualitative descriptors
 * - This is the source of truth for what CyberSoluce can emit
 * 
 * @internal This contract defines the boundary of what CyberSoluce can export.
 * Products consuming this contract must interpret these facts according to their domain.
 */

export interface CyberSoluceAssetContract {
  /** Unique identifier for the asset */
  assetId: string;
  
  /** Asset name */
  name: string;
  
  /** Asset type (factual classification) */
  type: 'Server' | 'Database' | 'Application' | 'Network' | 'Endpoint' | 'Cloud Service' | 'Information Asset' | 'Data Repository' | 'API' | 'File System' | 'Document' | 'Personal Data' | 'Sensitive Data' | 'Business Process' | 'Third Party Service';
  
  /** Owner of the asset (factual) */
  owner: string;
  
  /** Location of the asset (factual) */
  location: string;
  
  /** IP address if applicable (factual) */
  ipAddress?: string;
  
  /** Description of the asset (qualitative) */
  description: string;
  
  /** Asset status (factual) */
  status: 'Active' | 'Inactive' | 'Retired' | 'Planned';
  
  /** Tags associated with the asset (factual) */
  tags: string[];
  
  /** Data classification (factual) */
  dataClassification: 'Public' | 'Internal' | 'Confidential' | 'Restricted' | 'Top Secret';
  
  /** Types of data stored/processed (factual) */
  dataTypes: string[];
  
  /** Retention period in days (factual) */
  retentionPeriod?: number;
  
  /** Legal basis for processing (factual) */
  legalBasis: string[];
  
  /** Data subject rights applicable (factual) */
  dataSubjectRights: string[];
  
  /** Whether data crosses borders (factual) */
  crossBorderTransfer: boolean;
  
  /** Whether data is shared with third parties (factual) */
  thirdPartySharing: boolean;
  
  /** Encryption status (factual) */
  encryptionStatus: 'Encrypted' | 'Not Encrypted' | 'Partially Encrypted' | 'Unknown';
  
  /** Compliance frameworks referenced (factual - names only, no compliance status) */
  complianceFrameworks: string[];
  
  /** When the asset was created (factual) */
  createdAt: string; // ISO 8601 timestamp
  
  /** When the asset was last updated (factual) */
  updatedAt: string; // ISO 8601 timestamp
  
  /** When the asset was last assessed (factual) */
  lastAssessed: string; // ISO 8601 timestamp
}

/**
 * Helper to convert internal Asset to contract format
 * Strips out any scoring/risk/compliance fields
 */
export function toAssetContract(asset: {
  id: string;
  name: string;
  type: string;
  owner: string;
  location: string;
  ipAddress?: string;
  description: string;
  status: string;
  tags: string[] | readonly string[];
  dataClassification: string;
  dataTypes: string[] | readonly string[];
  retentionPeriod?: number;
  legalBasis: string[] | readonly string[];
  dataSubjectRights: string[] | readonly string[];
  crossBorderTransfer: boolean;
  thirdPartySharing: boolean;
  encryptionStatus: string;
  complianceFrameworks: string[] | readonly string[];
  createdAt: Date | string;
  updatedAt: Date | string;
  lastAssessed: Date | string;
}): CyberSoluceAssetContract {
  return {
    assetId: asset.id,
    name: asset.name,
    type: asset.type as CyberSoluceAssetContract['type'],
    owner: asset.owner,
    location: asset.location,
    ipAddress: asset.ipAddress,
    description: asset.description,
    status: asset.status as CyberSoluceAssetContract['status'],
    tags: [...asset.tags],
    dataClassification: asset.dataClassification as CyberSoluceAssetContract['dataClassification'],
    dataTypes: [...asset.dataTypes],
    retentionPeriod: asset.retentionPeriod,
    legalBasis: [...asset.legalBasis],
    dataSubjectRights: [...asset.dataSubjectRights],
    crossBorderTransfer: asset.crossBorderTransfer,
    thirdPartySharing: asset.thirdPartySharing,
    encryptionStatus: asset.encryptionStatus as CyberSoluceAssetContract['encryptionStatus'],
    complianceFrameworks: [...asset.complianceFrameworks],
    createdAt: typeof asset.createdAt === 'string' ? asset.createdAt : asset.createdAt.toISOString(),
    updatedAt: typeof asset.updatedAt === 'string' ? asset.updatedAt : asset.updatedAt.toISOString(),
    lastAssessed: typeof asset.lastAssessed === 'string' ? asset.lastAssessed : asset.lastAssessed.toISOString(),
  };
}

