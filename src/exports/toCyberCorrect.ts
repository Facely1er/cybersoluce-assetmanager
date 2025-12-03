/**
 * Export Adapter: CyberSoluce → CyberCorrect
 * 
 * One-way export only. CyberSoluce never imports back.
 * 
 * CyberCorrect focuses on privacy impact analysis and compliance.
 * This adapter filters assets and signals relevant to privacy concerns.
 */

import { CyberSoluceAssetContract, toAssetContract } from '../contracts/cyberSoluce.asset.contract';
import { CyberSoluceDependencyContract, toDependencyContract } from '../contracts/cyberSoluce.dependency.contract';
import { CyberSoluceSignalContract, toSignalContract } from '../contracts/cyberSoluce.signal.contract';
import { CyberSoluceExportManifest, createExportManifest } from '../contracts/cyberSoluce.export.manifest';
import { Asset } from '../types/asset';
import { Dependency } from '../types/dependency';
import { FocusSignal } from '../types/enrichment';

export interface CyberCorrectExport {
  manifest: CyberSoluceExportManifest;
  assets: Partial<CyberSoluceAssetContract>[];
  dependencies: Partial<CyberSoluceDependencyContract>[];
  signals: Partial<CyberSoluceSignalContract>[];
}

/**
 * Fields allowed for CyberCorrect export
 * Focus: Privacy-relevant data only
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
  'dataClassification',
  'dataTypes',
  'retentionPeriod',
  'legalBasis',
  'dataSubjectRights',
  'crossBorderTransfer',
  'thirdPartySharing',
  'encryptionStatus',
  'complianceFrameworks',
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
  'dataFlowDirection',
  'isPersonalData',
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
 * Export to CyberCorrect
 * 
 * Filters assets, dependencies, and signals to privacy-relevant data only.
 */
export function exportToCyberCorrect(
  assets: Asset[],
  dependencies: Dependency[],
  signals: FocusSignal[]
): CyberCorrectExport {
  // Filter to privacy-relevant assets (those with personal data or privacy signals)
  const privacyRelevantAssetIds = new Set<string>();
  
  // Add assets with personal data indicators
  assets.forEach(asset => {
    if (
      asset.dataTypes.some(dt => ['PII', 'PHI', 'Personal Data'].includes(dt)) ||
      asset.dataClassification !== 'Public' ||
      asset.thirdPartySharing ||
      asset.crossBorderTransfer
    ) {
      privacyRelevantAssetIds.add(asset.id);
    }
  });
  
  // Add assets from privacy signals
  signals
    .filter(s => s.signal_domain === 'privacy')
    .forEach(s => {
      s.affected_asset_ids.forEach(id => privacyRelevantAssetIds.add(id));
    });
  
  // Filter assets
  const relevantAssets = assets.filter(a => privacyRelevantAssetIds.has(a.id));
  const contractAssets = relevantAssets.map(asset => {
    const contract = toAssetContract(asset);
    return filterFields(contract, ALLOWED_ASSET_FIELDS);
  });
  
  // Filter dependencies (only those involving privacy-relevant assets)
  const relevantDependencies = dependencies.filter(
    dep => privacyRelevantAssetIds.has(dep.sourceId) || privacyRelevantAssetIds.has(dep.targetId)
  );
  const contractDependencies = relevantDependencies.map(dep => {
    const contract = toDependencyContract(dep);
    return filterFields(contract, ALLOWED_DEPENDENCY_FIELDS);
  });
  
  // Filter signals (only privacy domain)
  const privacySignals = signals.filter(s => s.signal_domain === 'privacy');
  const contractSignals = privacySignals.map(signal => {
    const contract = toSignalContract(signal);
    return filterFields(contract, ALLOWED_SIGNAL_FIELDS);
  });
  
  // Create manifest
  const excludedFields = [
    'ipAddress', // Not relevant for privacy analysis
    'strength', // Dependency strength not relevant for privacy
  ];
  
  const manifest = createExportManifest(
    'CyberCorrect',
    'privacy-impact-analysis',
    'Do personal or customer data flow through these assets?',
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

