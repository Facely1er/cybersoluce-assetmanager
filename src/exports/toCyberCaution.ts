/**
 * Export Adapter: CyberSoluce → CyberCaution
 * 
 * One-way export only. CyberSoluce never imports back.
 * 
 * CyberCaution focuses on threat & scenario interpretation, ransomware readiness.
 * This adapter filters assets and signals relevant to ransomware exposure.
 */

import { CyberSoluceAssetContract, toAssetContract } from '../contracts/cyberSoluce.asset.contract';
import { CyberSoluceDependencyContract, toDependencyContract } from '../contracts/cyberSoluce.dependency.contract';
import { CyberSoluceSignalContract, toSignalContract } from '../contracts/cyberSoluce.signal.contract';
import { CyberSoluceExportManifest, createExportManifest } from '../contracts/cyberSoluce.export.manifest';
import { CyberCautionDriftHint } from '../contracts/cyberCaution.driftHint.contract';
import { DriftStatus } from '../contracts/cyberSoluce.drift.contract';
import { ScenarioReadiness } from '../cybercaution/readiness/readinessMapper';
import { Asset } from '../types/asset';
import { Dependency } from '../types/dependency';
import { FocusSignal } from '../types/enrichment';
import { signalHistoryStore } from '../time/signalHistoryStore';
import { analyzeSignalDrift } from '../time/signalDriftAnalyzer';
import { validateExport } from '../guards/contractGuard';
import { computeAssetScenarioReadiness } from '../cybercaution/readiness/assetReadinessService';

/**
 * Asset scenario readiness information for CyberCaution export
 */
export interface CyberCautionAssetReadiness {
  assetId: string;
  name?: string;
  driftStatus: DriftStatus;
  scenarioReadiness: ScenarioReadiness;
  hasSBOM: boolean;
  hasVendorLinks: boolean;
}

export interface CyberCautionExport {
  manifest: CyberSoluceExportManifest;
  assets: Partial<CyberSoluceAssetContract>[];
  dependencies: Partial<CyberSoluceDependencyContract>[];
  signals: Partial<CyberSoluceSignalContract>[];
  driftHints?: CyberCautionDriftHint[];
  readinessHints?: CyberCautionAssetReadiness[];
}

/**
 * Fields allowed for CyberCaution export
 * Focus: Ransomware-relevant data (network topology, dependencies, access patterns)
 */
const ALLOWED_ASSET_FIELDS: (keyof CyberSoluceAssetContract)[] = [
  'assetId',
  'name',
  'type',
  'owner',
  'location',
  'ipAddress',
  'description',
  'status',
  'tags',
  'dataClassification',
  'encryptionStatus',
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
  'dataFlowDirection',
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
 * Build drift hints for assets
 * 
 * Analyzes signal history for each asset and generates qualitative drift hints.
 * Only includes hints for assets with actual history (skips no-history).
 */
async function buildDriftHintsForAssets(assetIds: string[]): Promise<CyberCautionDriftHint[]> {
  const hints: CyberCautionDriftHint[] = [];

  for (const assetId of assetIds) {
    const history = await signalHistoryStore.getHistory(assetId, { limit: 20 });
    const insight = analyzeSignalDrift(history);

    if (insight.status === 'no-history') {
      continue; // don't spam CyberCaution with "no history"
    }

    const summary = summarizeDriftStatus(insight.status);
    const details = insight.supportingSignals;

    hints.push({
      assetId,
      status: insight.status,
      summary,
      details,
    });
  }

  return hints;
}

/**
 * Summarize drift status into a one-line explanation
 * 
 * Language stays at "signal / visibility", never "risk going up/down"
 */
function summarizeDriftStatus(status: DriftStatus): string {
  switch (status) {
    case 'stable-visibility':
      return 'Visibility around this asset has been broadly stable across observations.';
    case 'emerging-change':
      return 'Recent updates have changed how this asset appears in your environment.';
    case 'increasing-uncertainty':
      return 'Signals indicate growing uncertainty about this asset\'s role or dependencies.';
    case 'high-variance':
      return 'Signals about this asset have varied significantly over time.';
    case 'no-history':
    default:
      return 'No historical visibility is available for this asset.';
  }
}

/**
 * Export to CyberCaution
 * 
 * Filters assets, dependencies, and signals to ransomware-relevant data.
 * Includes visibility drift hints for assets with historical signal data.
 */
export async function exportToCyberCaution(
  assets: Asset[],
  dependencies: Dependency[],
  signals: FocusSignal[]
): Promise<CyberCautionExport> {
  // Filter to ransomware-relevant assets (those with ransomware signals or critical dependencies)
  const ransomwareRelevantAssetIds = new Set<string>();
  
  // Add assets from ransomware signals
  signals
    .filter(s => s.signal_domain === 'ransomware')
    .forEach(s => {
      s.affected_asset_ids.forEach(id => ransomwareRelevantAssetIds.add(id));
    });
  
  // Add assets with high-value data or critical infrastructure indicators
  assets.forEach(asset => {
    if (
      asset.dataClassification === 'Confidential' ||
      asset.dataClassification === 'Restricted' ||
      asset.dataClassification === 'Top Secret' ||
      asset.type === 'Database' ||
      asset.type === 'Server' ||
      asset.type === 'Application'
    ) {
      ransomwareRelevantAssetIds.add(asset.id);
    }
  });
  
  // Add assets involved in critical dependencies
  dependencies
    .filter(dep => dep.strength === 'critical' || dep.strength === 'Strong')
    .forEach(dep => {
      ransomwareRelevantAssetIds.add(dep.sourceId);
      ransomwareRelevantAssetIds.add(dep.targetId);
    });
  
  // Filter assets
  const relevantAssets = assets.filter(a => ransomwareRelevantAssetIds.has(a.id));
  const contractAssets = relevantAssets.map(asset => {
    const contract = toAssetContract(asset);
    return filterFields(contract, ALLOWED_ASSET_FIELDS);
  });
  
  // Filter dependencies (all dependencies are relevant for threat analysis)
  const contractDependencies = dependencies.map(dep => {
    const contract = toDependencyContract(dep);
    return filterFields(contract, ALLOWED_DEPENDENCY_FIELDS);
  });
  
  // Filter signals (ransomware domain)
  const ransomwareSignals = signals.filter(s => s.signal_domain === 'ransomware');
  const contractSignals = ransomwareSignals.map(signal => {
    const contract = toSignalContract(signal);
    return filterFields(contract, ALLOWED_SIGNAL_FIELDS);
  });
  
  // Create manifest
  const excludedFields = [
    'dataTypes', // Not needed for threat analysis
    'legalBasis', // Privacy-specific, not threat-specific
    'dataSubjectRights', // Privacy-specific
    'retentionPeriod', // Privacy-specific
    'isPersonalData', // Privacy-specific
  ];
  
  // Build drift hints for relevant assets
  const assetIds = Array.from(ransomwareRelevantAssetIds);
  const driftHints = await buildDriftHintsForAssets(assetIds);

  // Build readiness hints for relevant assets
  const readinessHints = await computeAssetScenarioReadiness(relevantAssets, signals);
  const readinessHintsForExport: CyberCautionAssetReadiness[] = readinessHints.map(r => ({
    assetId: r.assetId,
    name: r.name,
    driftStatus: r.driftStatus,
    scenarioReadiness: r.readiness,
    hasSBOM: r.hasSBOM,
    hasVendorLinks: r.hasVendorLinks,
  }));

  const manifest = createExportManifest(
    'CyberCaution',
    'threat-scenario-analysis',
    'What are the critical paths an attacker could take through your infrastructure?',
    contractAssets.length,
    contractDependencies.length,
    contractSignals.length,
    [
      ...ALLOWED_ASSET_FIELDS.map(f => String(f)),
      ...ALLOWED_DEPENDENCY_FIELDS.map(f => String(f)),
      ...ALLOWED_SIGNAL_FIELDS.map(f => String(f)),
    ],
    excludedFields
  );

  const payload: CyberCautionExport = {
    manifest,
    assets: contractAssets,
    dependencies: contractDependencies,
    signals: contractSignals,
    driftHints: driftHints.length > 0 ? driftHints : undefined,
    readinessHints: readinessHintsForExport.length > 0 ? readinessHintsForExport : undefined,
  };

  // Validate export payload (including drift hints)
  const validation = validateExport(
    {
      manifest: payload.manifest,
      assets: payload.assets,
      dependencies: payload.dependencies,
      signals: payload.signals,
      drift: payload.driftHints,
    },
    'exportToCyberCaution'
  );

  if (!validation.valid && process.env.NODE_ENV === 'development') {
    console.warn('[CyberCaution Export] Contract validation warnings:', validation.violations);
  }

  return payload;
}

