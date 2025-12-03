/**
 * Export Adapter: CyberSoluce → VendorSoluce
 * 
 * One-way export only. CyberSoluce never imports back.
 * 
 * VendorSoluce focuses on third-party interpretation and vendor dependency analysis.
 * This adapter filters assets and signals relevant to vendor dependencies.
 */

import { CyberSoluceAssetContract, toAssetContract } from '../contracts/cyberSoluce.asset.contract';
import { CyberSoluceDependencyContract, toDependencyContract } from '../contracts/cyberSoluce.dependency.contract';
import { CyberSoluceSignalContract, toSignalContract } from '../contracts/cyberSoluce.signal.contract';
import { CyberSoluceExportManifest, createExportManifest } from '../contracts/cyberSoluce.export.manifest';
import { VendorSoluceDriftHint } from '../contracts/vendorSoluce.driftHint.contract';
import { DriftStatus } from '../contracts/cyberSoluce.drift.contract';
import { Asset } from '../types/asset';
import { Dependency } from '../types/dependency';
import { FocusSignal } from '../types/enrichment';
import { signalHistoryStore } from '../time/signalHistoryStore';
import { analyzeSignalDrift } from '../time/signalDriftAnalyzer';
import { validateExport } from '../guards/contractGuard';

export interface VendorSoluceExport {
  manifest: CyberSoluceExportManifest;
  assets: Partial<CyberSoluceAssetContract>[];
  dependencies: Partial<CyberSoluceDependencyContract>[];
  signals: Partial<CyberSoluceSignalContract>[];
  driftHints?: VendorSoluceDriftHint[];
}

/**
 * Fields allowed for VendorSoluce export
 * Focus: Third-party services and vendor relationships
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
  'thirdPartySharing',
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
 * Build vendor-to-assets mapping
 * 
 * Groups vendor-relevant assets by vendor identifier.
 * Uses asset owner for third-party services, or derives from dependencies.
 */
function buildVendorToAssetMap(
  assets: Asset[],
  dependencies: Dependency[],
  signals: FocusSignal[]
): Map<string, string[]> {
  const vendorToAssets = new Map<string, string[]>();
  const vendorRelevantAssetIds = new Set<string>();
  
  // Identify vendor-relevant assets
  assets.forEach(asset => {
    if (
      asset.type === 'Third Party Service' ||
      asset.type === 'Cloud Service' ||
      asset.thirdPartySharing
    ) {
      vendorRelevantAssetIds.add(asset.id);
    }
  });
  
  // Add assets from vendor signals
  signals
    .filter(s => s.signal_domain === 'vendor')
    .forEach(s => {
      s.affected_asset_ids.forEach(id => vendorRelevantAssetIds.add(id));
    });
  
  // Add assets that depend on third-party services
  dependencies
    .filter(dep => {
      const targetAsset = assets.find(a => a.id === dep.targetId);
      return targetAsset && (
        targetAsset.type === 'Third Party Service' ||
        targetAsset.type === 'Cloud Service'
      );
    })
    .forEach(dep => {
      vendorRelevantAssetIds.add(dep.sourceId);
      vendorRelevantAssetIds.add(dep.targetId);
    });
  
  // Group assets by vendor (using owner for third-party services, or asset name as fallback)
  vendorRelevantAssetIds.forEach(assetId => {
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;
    
    // For third-party services, use owner as vendor identifier
    // For other assets connected via dependencies, find the vendor from the dependency target
    let vendorId: string;
    
    if (asset.type === 'Third Party Service' || asset.type === 'Cloud Service') {
      vendorId = asset.owner || asset.name;
    } else {
      // Find vendor from dependencies
      const vendorDependency = dependencies.find(dep => dep.sourceId === assetId);
      if (vendorDependency) {
        const targetAsset = assets.find(a => a.id === vendorDependency.targetId);
        vendorId = targetAsset?.owner || targetAsset?.name || 'Unknown Vendor';
      } else {
        // Fallback to owner
        vendorId = asset.owner || 'Unknown Vendor';
      }
    }
    
    if (!vendorToAssets.has(vendorId)) {
      vendorToAssets.set(vendorId, []);
    }
    vendorToAssets.get(vendorId)!.push(assetId);
  });
  
  return vendorToAssets;
}

/**
 * Build drift hints for vendors
 * 
 * Analyzes signal history for assets related to each vendor and generates qualitative drift hints.
 * Only includes hints for vendors with at least one asset that has history.
 */
async function buildVendorDriftHints(
  vendorToAssets: Map<string, string[]>
): Promise<VendorSoluceDriftHint[]> {
  const hints: VendorSoluceDriftHint[] = [];

  for (const [vendorId, assetIds] of vendorToAssets.entries()) {
    const statuses: DriftStatus[] = [];
    const narratives: string[] = [];

    for (const assetId of assetIds) {
      const history = await signalHistoryStore.getHistory(assetId, { limit: 20 });
      const insight = analyzeSignalDrift(history);

      if (insight.status === 'no-history') continue;

      statuses.push(insight.status);
      narratives.push(...insight.supportingSignals);
    }

    if (!statuses.length) {
      continue; // no history for any assets tied to this vendor
    }

    const aggregatedStatus = aggregateVendorDriftStatus(statuses);
    const summary = summarizeVendorDrift(aggregatedStatus);
    const details = dedupeAndTrimNarratives(narratives, 4);

    hints.push({
      vendorId,
      relatedAssetIds: assetIds,
      status: aggregatedStatus,
      summary,
      details,
    });
  }

  return hints;
}

/**
 * Aggregate drift statuses from multiple assets into a single vendor-level status
 * 
 * Uses a priority-based approach: high-variance > increasing-uncertainty > emerging-change > stable-visibility
 */
function aggregateVendorDriftStatus(statuses: DriftStatus[]): DriftStatus {
  // crude aggregation rules, explicit and readable:
  if (statuses.includes('high-variance')) return 'high-variance';
  if (statuses.includes('increasing-uncertainty')) return 'increasing-uncertainty';
  if (statuses.includes('emerging-change')) return 'emerging-change';
  if (statuses.includes('stable-visibility')) return 'stable-visibility';
  return 'no-history';
}

/**
 * Summarize vendor drift status into a one-line explanation
 * 
 * Language stays at "signal / visibility", never "risk going up/down" or "vendor is safe/unsafe"
 */
function summarizeVendorDrift(status: DriftStatus): string {
  switch (status) {
    case 'stable-visibility':
      return 'Assets related to this vendor have shown broadly stable visibility across observations.';
    case 'emerging-change':
      return 'Recent updates have changed how vendor-related assets appear in your environment.';
    case 'increasing-uncertainty':
      return 'Signals indicate growing uncertainty around how this vendor\'s assets are mapped or understood.';
    case 'high-variance':
      return 'Signals tied to this vendor\'s assets have varied significantly over time.';
    case 'no-history':
    default:
      return 'No historical visibility is available for assets tied to this vendor.';
  }
}

/**
 * Deduplicate and trim narratives to a maximum number of items
 */
function dedupeAndTrimNarratives(messages: string[], maxItems: number): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const msg of messages) {
    const trimmed = msg.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    result.push(trimmed);
    if (result.length >= maxItems) break;
  }
  return result;
}

/**
 * Export to VendorSoluce
 * 
 * Filters assets, dependencies, and signals to vendor-relevant data.
 * Includes visibility drift hints for vendors with historical signal data.
 */
export async function exportToVendorSoluce(
  assets: Asset[],
  dependencies: Dependency[],
  signals: FocusSignal[]
): Promise<VendorSoluceExport> {
  // Filter to vendor-relevant assets (third-party services and those with vendor signals)
  const vendorRelevantAssetIds = new Set<string>();
  
  // Add third-party service assets
  assets.forEach(asset => {
    if (
      asset.type === 'Third Party Service' ||
      asset.type === 'Cloud Service' ||
      asset.thirdPartySharing
    ) {
      vendorRelevantAssetIds.add(asset.id);
    }
  });
  
  // Add assets from vendor signals
  signals
    .filter(s => s.signal_domain === 'vendor')
    .forEach(s => {
      s.affected_asset_ids.forEach(id => vendorRelevantAssetIds.add(id));
    });
  
  // Add assets that depend on third-party services
  dependencies
    .filter(dep => {
      const targetAsset = assets.find(a => a.id === dep.targetId);
      return targetAsset && (
        targetAsset.type === 'Third Party Service' ||
        targetAsset.type === 'Cloud Service'
      );
    })
    .forEach(dep => {
      vendorRelevantAssetIds.add(dep.sourceId);
      vendorRelevantAssetIds.add(dep.targetId);
    });
  
  // Filter assets
  const relevantAssets = assets.filter(a => vendorRelevantAssetIds.has(a.id));
  const contractAssets = relevantAssets.map(asset => {
    const contract = toAssetContract(asset);
    return filterFields(contract, ALLOWED_ASSET_FIELDS);
  });
  
  // Filter dependencies (only those involving vendor assets)
  const relevantDependencies = dependencies.filter(
    dep => vendorRelevantAssetIds.has(dep.sourceId) || vendorRelevantAssetIds.has(dep.targetId)
  );
  const contractDependencies = relevantDependencies.map(dep => {
    const contract = toDependencyContract(dep);
    return filterFields(contract, ALLOWED_DEPENDENCY_FIELDS);
  });
  
  // Filter signals (vendor domain)
  const vendorSignals = signals.filter(s => s.signal_domain === 'vendor');
  const contractSignals = vendorSignals.map(signal => {
    const contract = toSignalContract(signal);
    return filterFields(contract, ALLOWED_SIGNAL_FIELDS);
  });
  
  // Create manifest
  const excludedFields = [
    'ipAddress', // Not relevant for vendor analysis
    'dataClassification', // Privacy-specific
    'dataTypes', // Privacy-specific
    'legalBasis', // Privacy-specific
    'dataSubjectRights', // Privacy-specific
    'retentionPeriod', // Privacy-specific
    'crossBorderTransfer', // Privacy-specific
    'encryptionStatus', // Technical detail, not vendor-specific
    'complianceFrameworks', // VendorSoluce has its own compliance view
    'dataFlowDirection', // Not relevant for vendor relationships
    'isPersonalData', // Privacy-specific
  ];
  
  // Build vendor-to-assets mapping and drift hints
  const vendorToAssets = buildVendorToAssetMap(assets, dependencies, signals);
  const driftHints = await buildVendorDriftHints(vendorToAssets);

  const manifest = createExportManifest(
    'VendorSoluce',
    'third-party-dependency-analysis',
    'Which vendors have access to your critical business functions?',
    contractAssets.length,
    contractDependencies.length,
    contractSignals.length,
    [...ALLOWED_ASSET_FIELDS, ...ALLOWED_DEPENDENCY_FIELDS, ...ALLOWED_SIGNAL_FIELDS].map(f => String(f)),
    excludedFields
  );
  
  const payload: VendorSoluceExport = {
    manifest,
    assets: contractAssets,
    dependencies: contractDependencies,
    signals: contractSignals,
    driftHints: driftHints.length > 0 ? driftHints : undefined,
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
    'exportToVendorSoluce'
  );

  if (!validation.valid && process.env.NODE_ENV === 'development') {
    console.warn('[VendorSoluce Export] Contract validation warnings:', validation.violations);
  }

  return payload;
}

