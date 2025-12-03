/**
 * Export Adapter: CyberSoluce → TechnoSoluce
 * 
 * One-way export only. CyberSoluce never imports back.
 * 
 * TechnoSoluce focuses on software/SBOM interpretation and component risk analysis.
 * This adapter filters assets and signals relevant to software dependencies.
 */

import { CyberSoluceAssetContract, toAssetContract } from '../contracts/cyberSoluce.asset.contract';
import { CyberSoluceDependencyContract, toDependencyContract } from '../contracts/cyberSoluce.dependency.contract';
import { CyberSoluceSignalContract, toSignalContract } from '../contracts/cyberSoluce.signal.contract';
import { CyberSoluceExportManifest, createExportManifest } from '../contracts/cyberSoluce.export.manifest';
import { Asset } from '../types/asset';
import { Dependency } from '../types/dependency';
import { FocusSignal } from '../types/enrichment';

export interface TechnoSoluceExport {
  manifest: CyberSoluceExportManifest;
  assets: Partial<CyberSoluceAssetContract>[];
  dependencies: Partial<CyberSoluceDependencyContract>[];
  signals: Partial<CyberSoluceSignalContract>[];
}

/**
 * Fields allowed for TechnoSoluce export
 * Focus: Software components, applications, and technical dependencies
 */
const ALLOWED_ASSET_FIELDS: (keyof CyberSoluceAssetContract)[] = [
  'assetId',
  'name',
  'type',
  'owner',
  'location',
  'description',
  'status',
  'tags',
  'createdAt',
  'updatedAt',
  'lastAssessed',
];

const ALLOWED_DEPENDENCY_FIELDS: (keyof CyberSoluceDependencyContract)[] = [
  'dependencyId',
  'sourceAssetId',
  'sourceAssetName',
  'targetAssetId',
  'targetAssetName',
  'relationshipType',
  'strength',
  'purpose',
  'description',
];

const ALLOWED_SIGNAL_FIELDS: (keyof CyberSoluceSignalContract)[] = [
  'signalId',
  'signalType',
  'description',
  'confidence',
  'source',
  'timestamp',
  'signalDomain',
  'affectedAssetIds',
  'concentrationDescription',
];

/**
 * Filter object to only include allowed fields
 */
function filterFields<T extends object>(
  obj: T,
  allowedFields: (keyof T)[]
): Partial<T> {
  const filtered: Partial<T> = {};
  for (const field of allowedFields) {
    if (field in obj) {
      filtered[field] = obj[field];
    }
  }
  return filtered;
}

/**
 * Export to TechnoSoluce
 * 
 * Filters assets, dependencies, and signals to software-relevant data.
 */
export function exportToTechnoSoluce(
  assets: Asset[],
  dependencies: Dependency[],
  signals: FocusSignal[]
): TechnoSoluceExport {
  // Filter to software-relevant assets (applications, APIs, software components)
  const softwareRelevantAssetIds = new Set<string>();
  
  // Add software-related assets
  assets.forEach(asset => {
    if (
      asset.type === 'Application' ||
      asset.type === 'API' ||
      asset.type === 'Server' ||
      asset.type === 'Database'
    ) {
      softwareRelevantAssetIds.add(asset.id);
    }
  });
  
  // Add assets from software signals
  signals
    .filter(s => s.signal_domain === 'software')
    .forEach(s => {
      s.affected_asset_ids.forEach(id => softwareRelevantAssetIds.add(id));
    });
  
  // Add assets involved in technical dependencies
  dependencies
    .filter(dep => 
      dep.type === 'Depends On' ||
      dep.type === 'Hosts' ||
      dep.type === 'Connects To'
    )
    .forEach(dep => {
      softwareRelevantAssetIds.add(dep.sourceId);
      softwareRelevantAssetIds.add(dep.targetId);
    });
  
  // Filter assets
  const relevantAssets = assets.filter(a => softwareRelevantAssetIds.has(a.id));
  const contractAssets = relevantAssets.map(asset => {
    const contract = toAssetContract(asset);
    return filterFields(contract, ALLOWED_ASSET_FIELDS);
  });
  
  // Filter dependencies (technical dependencies only)
  const relevantDependencies = dependencies.filter(
    dep => 
      softwareRelevantAssetIds.has(dep.sourceId) || 
      softwareRelevantAssetIds.has(dep.targetId)
  );
  const contractDependencies = relevantDependencies.map(dep => {
    const contract = toDependencyContract(dep);
    return filterFields(contract, ALLOWED_DEPENDENCY_FIELDS);
  });
  
  // Filter signals (software domain)
  const softwareSignals = signals.filter(s => s.signal_domain === 'software');
  const contractSignals = softwareSignals.map(signal => {
    const contract = toSignalContract(signal);
    return filterFields(contract, ALLOWED_SIGNAL_FIELDS);
  });
  
  // Create manifest
  const excludedFields = [
    'ipAddress', // Network detail, not component detail
    'dataClassification', // Privacy-specific
    'dataTypes', // Privacy-specific
    'legalBasis', // Privacy-specific
    'dataSubjectRights', // Privacy-specific
    'retentionPeriod', // Privacy-specific
    'crossBorderTransfer', // Privacy-specific
    'thirdPartySharing', // Vendor-specific
    'encryptionStatus', // Security detail, not component detail
    'complianceFrameworks', // TechnoSoluce has its own compliance view
    'dataFlowDirection', // Not relevant for component analysis
    'isPersonalData', // Privacy-specific
  ];
  
  const manifest = createExportManifest(
    'TechnoSoluce',
    'software-component-analysis',
    'What software components and versions are in your critical applications?',
    contractAssets.length,
    contractDependencies.length,
    contractSignals.length,
    [...ALLOWED_ASSET_FIELDS, ...ALLOWED_DEPENDENCY_FIELDS, ...ALLOWED_SIGNAL_FIELDS].map(f => String(f)),
    excludedFields
  );
  
  return {
    manifest,
    assets: contractAssets,
    dependencies: contractDependencies,
    signals: contractSignals,
  };
}

