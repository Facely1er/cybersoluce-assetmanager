/**
 * Export Adapter: CyberSoluce → ERMITS Advisory
 * 
 * One-way export only. CyberSoluce never imports back.
 * 
 * ERMITS Advisory focuses on governance and compliance advisory services.
 * This adapter filters assets and signals relevant to governance concerns.
 * Includes STEEL visibility snapshots for advisory reporting.
 */

import { CyberSoluceAssetContract, toAssetContract } from '../contracts/cyberSoluce.asset.contract';
import { CyberSoluceDependencyContract, toDependencyContract } from '../contracts/cyberSoluce.dependency.contract';
import { CyberSoluceSignalContract, toSignalContract, AssetSignal } from '../contracts/cyberSoluce.signal.contract';
import { CyberSoluceExportManifest, createExportManifest } from '../contracts/cyberSoluce.export.manifest';
import { SteelOrgVisibilitySnapshot, SteelAssetVisibilitySummary, SteelDomainVisibilitySummary } from '../contracts/ermitsAdvisory.steelVisibility.contract';
import { signalHistoryStore } from '../time/signalHistoryStore';
import { analyzeSignalDrift } from '../time/signalDriftAnalyzer';
import { Asset } from '../types/asset';
import { Dependency } from '../types/dependency';
import { FocusSignal } from '../types/enrichment';

export interface ERMITSAdvisoryExport {
  manifest: CyberSoluceExportManifest;
  assets: Partial<CyberSoluceAssetContract>[];
  dependencies: Partial<CyberSoluceDependencyContract>[];
  signals: Partial<CyberSoluceSignalContract>[];
  steelVisibilitySnapshot: SteelOrgVisibilitySnapshot;
}

/**
 * Fields allowed for ERMITS Advisory export
 * Focus: Governance, compliance frameworks, and organizational structure
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
 * Group signals by asset ID
 */
function groupSignalsByAssetId(signals: Partial<CyberSoluceSignalContract>[]): Map<string, AssetSignal[]> {
  const grouped = new Map<string, AssetSignal[]>();
  
  for (const signal of signals) {
    if (!signal.affectedAssetIds) continue;
    
    for (const assetId of signal.affectedAssetIds) {
      if (!grouped.has(assetId)) {
        grouped.set(assetId, []);
      }
      grouped.get(assetId)!.push(signal as AssetSignal);
    }
  }
  
  return grouped;
}

/**
 * Derive key role from asset name or tags
 * 
 * Simple heuristic for advisory text only.
 */
function deriveKeyRoleFromTagsOrName(asset: Partial<CyberSoluceAssetContract>): string | undefined {
  const name = (asset.name ?? '').toLowerCase();
  const tags = (asset.tags ?? []).map(t => String(t).toLowerCase());

  if (name.includes('ehr') || tags.some(t => t.includes('health'))) return 'clinical-records';
  if (name.includes('payment') || tags.some(t => t.includes('billing'))) return 'payment-processing';
  if (name.includes('crm')) return 'customer-relationship';
  if (name.includes('erp')) return 'core-business-platform';

  return undefined;
}

/**
 * Build per-asset visibility summaries
 */
async function buildAssetVisibilitySummaries(
  assets: Partial<CyberSoluceAssetContract>[],
  signalsByAssetId: Map<string, AssetSignal[]>
): Promise<SteelAssetVisibilitySummary[]> {
  const result: SteelAssetVisibilitySummary[] = [];

  for (const asset of assets) {
    if (!asset.assetId) continue;

    const assetId = asset.assetId;
    const signals = signalsByAssetId.get(assetId) ?? [];

    const history = await signalHistoryStore.getHistory(assetId, { limit: 20 });
    const insight = analyzeSignalDrift(history);

    const hasSBOM = signals.some(s =>
      String(s.signalType).includes('software-composition-known') ||
      String(s.signalType).includes('software-composition-partial'),
    );

    const hasVendorLinks = signals.some(s =>
      String(s.signalType).includes('vendor') ||
      s.signalDomain === 'vendor' ||
      String(s.description ?? '').toLowerCase().includes('third-party') ||
      String(s.description ?? '').toLowerCase().includes('vendor'),
    );

    const keyRole = deriveKeyRoleFromTagsOrName(asset);

    result.push({
      assetId,
      keyRole,
      driftStatus: insight.status,
      hasSBOM,
      hasVendorLinks,
    });
  }

  return result;
}

/**
 * Build privacy domain visibility summary
 */
function buildPrivacySummary(assets: SteelAssetVisibilitySummary[]): SteelDomainVisibilitySummary {
  const messages: string[] = [];

  if (!assets.length) {
    messages.push('No specific privacy-critical assets have been tagged or surfaced in the current view.');
  } else {
    const unstable = assets.filter(a =>
      a.driftStatus === 'emerging-change' || 
      a.driftStatus === 'increasing-uncertainty' || 
      a.driftStatus === 'high-variance',
    );
    const stable = assets.filter(a => a.driftStatus === 'stable-visibility');

    if (stable.length) {
      messages.push('Some privacy-relevant assets show stable visibility across observations.');
    }
    if (unstable.length) {
      messages.push('Several privacy-relevant assets exhibit changing or uncertain visibility, indicating the need for clearer mapping.');
    }
  }

  return {
    domain: 'privacy',
    keyMessages: messages,
  };
}

/**
 * Build ransomware domain visibility summary
 */
function buildRansomwareSummary(assets: SteelAssetVisibilitySummary[]): SteelDomainVisibilitySummary {
  const messages: string[] = [];

  const unstable = assets.filter(a =>
    a.driftStatus === 'emerging-change' || 
    a.driftStatus === 'increasing-uncertainty' || 
    a.driftStatus === 'high-variance',
  );
  const withSBOM = assets.filter(a => a.hasSBOM);

  if (unstable.length) {
    messages.push('Some assets show changing visibility patterns, which may affect understanding of ransomware exposure paths.');
  }
  if (withSBOM.length) {
    messages.push('Software composition is documented for some assets, enabling clearer discussion of technical dependencies without assessing risk directly.');
  } else if (assets.length > 0) {
    messages.push('Software composition visibility is limited across assets, which may constrain technical discussions of dependency chains.');
  }

  return {
    domain: 'ransomware',
    keyMessages: messages,
  };
}

/**
 * Build vendor domain visibility summary
 */
function buildVendorSummary(assets: SteelAssetVisibilitySummary[]): SteelDomainVisibilitySummary {
  const messages: string[] = [];

  if (!assets.length) {
    messages.push('No assets with clear vendor linkages have been identified in the current snapshot.');
  } else {
    const unstable = assets.filter(a =>
      a.driftStatus === 'emerging-change' || 
      a.driftStatus === 'increasing-uncertainty' || 
      a.driftStatus === 'high-variance',
    );

    messages.push(`Vendor linkages are documented for ${assets.length} asset${assets.length === 1 ? '' : 's'}, creating opportunities to connect technical visibility with supplier oversight.`);
    
    if (unstable.length) {
      messages.push('Some vendor-linked assets show changing visibility, which may indicate evolving supplier relationships or dependencies.');
    }
  }

  return {
    domain: 'vendor',
    keyMessages: messages,
  };
}

/**
 * Build software supply-chain domain visibility summary
 */
function buildSoftwareSupplyChainSummary(assets: SteelAssetVisibilitySummary[]): SteelDomainVisibilitySummary {
  const messages: string[] = [];

  if (!assets.length) {
    messages.push('Software composition has not yet been systematically documented across assets in this snapshot.');
  } else {
    const unstable = assets.filter(a =>
      a.driftStatus === 'emerging-change' || 
      a.driftStatus === 'increasing-uncertainty' || 
      a.driftStatus === 'high-variance',
    );

    messages.push(`Software composition is partially documented for ${assets.length} asset${assets.length === 1 ? '' : 's'}, enabling more informed technical discussions without assessing risk directly.`);
    
    if (unstable.length) {
      messages.push('Some assets with documented software composition show changing visibility, which may indicate evolving component dependencies.');
    }
  }

  return {
    domain: 'software-supply-chain',
    keyMessages: messages,
  };
}

/**
 * Aggregate into domain summaries
 */
function buildDomainVisibilitySummaries(
  assets: SteelAssetVisibilitySummary[]
): SteelDomainVisibilitySummary[] {
  const domains: SteelDomainVisibilitySummary[] = [];

  // Privacy domain
  const privacyAssets = assets.filter(a => 
    a.keyRole === 'clinical-records' || 
    a.keyRole === 'customer-relationship'
  );
  domains.push(buildPrivacySummary(privacyAssets));

  // Ransomware domain – use drift + SBOM presence as proxies
  domains.push(buildRansomwareSummary(assets));

  // Vendor domain – use hasVendorLinks
  const vendorAssets = assets.filter(a => a.hasVendorLinks);
  domains.push(buildVendorSummary(vendorAssets));

  // Software supply-chain domain – use hasSBOM
  const ssAssets = assets.filter(a => a.hasSBOM);
  domains.push(buildSoftwareSupplyChainSummary(ssAssets));

  return domains;
}

/**
 * Build overall organisational visibility narrative
 */
function buildOrgVisibilityNarrative(
  assets: SteelAssetVisibilitySummary[],
  domains: SteelDomainVisibilitySummary[]
): string[] {
  const lines: string[] = [];

  const unstableAssets = assets.filter(a =>
    a.driftStatus === 'emerging-change' || 
    a.driftStatus === 'increasing-uncertainty' || 
    a.driftStatus === 'high-variance',
  );

  const withSBOM = assets.filter(a => a.hasSBOM);
  const withVendor = assets.filter(a => a.hasVendorLinks);

  if (!assets.length) {
    lines.push('Asset visibility is not yet established in this snapshot; historical insights are limited.');
  } else {
    lines.push(`Asset visibility is established for ${assets.length} asset${assets.length === 1 ? '' : 's'} in the current snapshot.`);
  }

  if (unstableAssets.length) {
    lines.push('A subset of assets shows changing or uncertain visibility, which may warrant closer mapping or clarification.');
  }

  if (withSBOM.length) {
    lines.push('Software composition is partially documented for some assets, enabling more informed technical discussions without assessing risk directly.');
  } else if (assets.length > 0) {
    lines.push('Software composition has not yet been systematically documented across assets in this snapshot.');
  }

  if (withVendor.length) {
    lines.push('Several assets are clearly linked to external vendors, creating opportunities to connect technical visibility with supplier oversight.');
  }

  // Include domain-level key messages
  domains.forEach(d => {
    d.keyMessages.forEach(msg => lines.push(msg));
  });

  return lines;
}

/**
 * Export to ERMITS Advisory
 * 
 * Filters assets, dependencies, and signals to governance-relevant data.
 * Includes STEEL visibility snapshot for advisory reporting.
 */
export async function exportToERMITSAdvisory(
  assets: Asset[],
  dependencies: Dependency[],
  signals: FocusSignal[]
): Promise<ERMITSAdvisoryExport> {
  // Filter to governance-relevant assets (those with governance signals or compliance frameworks)
  const governanceRelevantAssetIds = new Set<string>();
  
  // Add assets with compliance frameworks
  assets.forEach(asset => {
    if (asset.complianceFrameworks.length > 0) {
      governanceRelevantAssetIds.add(asset.id);
    }
  });
  
  // Add assets from governance signals
  signals
    .filter(s => s.signal_domain === 'governance')
    .forEach(s => {
      s.affected_asset_ids.forEach(id => governanceRelevantAssetIds.add(id));
    });
  
  // Add all assets for comprehensive governance view
  assets.forEach(asset => governanceRelevantAssetIds.add(asset.id));
  
  // Filter assets
  const relevantAssets = assets.filter(a => governanceRelevantAssetIds.has(a.id));
  const contractAssets = relevantAssets.map(asset => {
    const contract = toAssetContract(asset);
    return filterFields(contract, ALLOWED_ASSET_FIELDS);
  });
  
  // Filter dependencies (all dependencies for governance context)
  const contractDependencies = dependencies.map(dep => {
    const contract = toDependencyContract(dep);
    return filterFields(contract, ALLOWED_DEPENDENCY_FIELDS);
  });
  
  // Filter signals (governance domain, plus all for context)
  const governanceSignals = signals.filter(s => s.signal_domain === 'governance');
  const contractSignals = governanceSignals.map(signal => {
    const contract = toSignalContract(signal);
    return filterFields(contract, ALLOWED_SIGNAL_FIELDS);
  });
  
  // Create manifest
  const excludedFields = [
    'ipAddress', // Technical detail, not governance
    'dataTypes', // Privacy-specific detail
    'legalBasis', // Privacy-specific detail
    'dataSubjectRights', // Privacy-specific detail
    'retentionPeriod', // Privacy-specific detail
    'crossBorderTransfer', // Privacy-specific detail
    'thirdPartySharing', // Vendor-specific detail
    'encryptionStatus', // Technical detail
    'strength', // Dependency strength not relevant for governance
    'dataFlowDirection', // Technical detail
    'isPersonalData', // Privacy-specific detail
  ];
  
  const manifest = createExportManifest(
    'ERMITSAdvisory',
    'governance-compliance-advisory',
    'What governance gaps exist in your asset management and compliance coverage?',
    contractAssets.length,
    contractDependencies.length,
    contractSignals.length,
    [...ALLOWED_ASSET_FIELDS, ...ALLOWED_DEPENDENCY_FIELDS, ...ALLOWED_SIGNAL_FIELDS].map(f => String(f)),
    excludedFields
  );

  // Build STEEL visibility snapshot
  const signalsByAssetId = groupSignalsByAssetId(contractSignals);
  const assetSummaries = await buildAssetVisibilitySummaries(contractAssets, signalsByAssetId);
  const domains = buildDomainVisibilitySummaries(assetSummaries);
  const narrative = buildOrgVisibilityNarrative(assetSummaries, domains);

  const steelVisibilitySnapshot: SteelOrgVisibilitySnapshot = {
    capturedAt: new Date().toISOString(),
    assets: assetSummaries,
    domains,
    narrative,
  };

  return {
    manifest,
    assets: contractAssets,
    dependencies: contractDependencies,
    signals: contractSignals,
    steelVisibilitySnapshot,
  };
}

