/**
 * CSV Import Service
 * 
 * Service for importing CSV assets and recording signal history.
 * Handles the full import pipeline: CSV parsing → asset creation → signal snapshot recording.
 */

import { supabase, isSupabaseEnabled } from '@/lib/supabase';
import { handleSupabaseError } from '@/lib/supabase';
import { signalHistoryStore, BackendSignalHistoryStore, SignalSnapshotWithBatch } from '@/time/signalHistoryStore';
import { parseCsvFile, mapCsvRowToAsset, buildInitialSignalsForCsvAsset } from '@/import/csvAssetImportService';
import { Asset } from '@/types/asset';
import { assetService } from './assetService';
import { logger } from '../utils/logger';
import { AssetDeduplicationService } from './assetDeduplicationService';
import { MetadataEnrichmentService } from './metadataEnrichmentService';

/**
 * Import batch result
 */
export interface ImportBatchResult {
  batchId: string;
  assetCount: number;
  vendorLinkedAssets: number;
  duplicatesFound?: number;
  duplicatesMerged?: number;
  errors?: Array<{ assetName: string; error: string }>;
}

/**
 * Import CSV assets and record signal history
 * 
 * @param csvContent - CSV file content as string
 * @param sourceLabel - Label for this import batch (e.g., 'CustomerX CSV 2025-12-02')
 * @param createdBy - Optional user identifier
 * @returns Import batch result with summary
 */
export async function importCsvAssets(
  csvContent: string,
  sourceLabel: string,
  createdBy?: string
): Promise<ImportBatchResult> {
  if (!isSupabaseEnabled || !supabase) {
    throw new Error('CSV import requires Supabase to be configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }

  // Parse CSV
  const rows = parseCsvFile(csvContent);
  if (rows.length === 0) {
    throw new Error('CSV file is empty or could not be parsed.');
  }

  // Create import batch
  const { data: batchData, error: batchError } = await supabase
    .from('asset_import_batch')
    .insert({
      type: 'csv-assets',
      source_label: sourceLabel,
      created_by: createdBy ?? null,
    })
    .select('id')
    .single();

  if (batchError) {
    const errorMessage = handleSupabaseError(batchError);
    throw new Error(`Failed to create import batch: ${errorMessage}`);
  }

  const batchId = batchData.id;

  // Get existing assets for duplicate detection
  let existingAssets: Asset[] = [];
  try {
    existingAssets = await assetService.getAssets();
  } catch (error) {
    logger.warn('Could not fetch existing assets for duplicate detection', error);
  }

  // Process each row
  let vendorLinkedAssets = 0;
  const assets: Asset[] = [];
  const snapshots: Array<{ asset: Asset; signals: SignalSnapshotWithBatch }> = [];

  for (const row of rows) {
    // Map to asset
    let asset = mapCsvRowToAsset(row);

    // Enrich with metadata (environment, cloud provider, region)
    const { enriched } = MetadataEnrichmentService.enrichAsset(asset);
    asset = enriched;

    // Mark as imported
    asset = AssetDeduplicationService.markAsImported(asset);

    assets.push(asset);

    // Build signals
    const signals = buildInitialSignalsForCsvAsset(row);
    if (row.vendor_name) {
      vendorLinkedAssets++;
    }

    // Create snapshot
    const snapshot: SignalSnapshotWithBatch = {
      assetId: asset.id,
      capturedAt: new Date().toISOString(),
      source: 'cybersoluce',
      signals,
      importBatchId: batchId,
    };

    snapshots.push({ asset, signals: snapshot });
  }

  // Detect duplicates before importing
  const allAssetsForCheck = [...existingAssets, ...assets];
  const duplicates = AssetDeduplicationService.findDuplicates(allAssetsForCheck);
  const duplicateCount = duplicates.length;
  
  // Filter out duplicates from new assets (keep existing ones, skip new duplicates)
  const duplicateAssetIds = new Set<string>();
  duplicates.forEach(dup => {
    // If both assets are in the new import, mark the second one as duplicate
    const asset1IsNew = assets.some(a => a.id === dup.asset1.id);
    const asset2IsNew = assets.some(a => a.id === dup.asset2.id);
    
    if (asset1IsNew && asset2IsNew) {
      // Both are new - keep the first, mark second as duplicate
      duplicateAssetIds.add(dup.asset2.id);
    } else if (asset2IsNew && !asset1IsNew) {
      // Asset2 is new but asset1 exists - mark asset2 as duplicate
      duplicateAssetIds.add(dup.asset2.id);
    }
  });

  // Filter out duplicate assets
  const assetsToImport = assets.filter(asset => !duplicateAssetIds.has(asset.id));
  const duplicatesSkipped = assets.length - assetsToImport.length;

  if (duplicateCount > 0) {
    logger.info(`Found ${duplicateCount} duplicate pairs. Skipping ${duplicatesSkipped} duplicate assets from import.`);
  }

  // Record signal snapshots
  // Use BackendSignalHistoryStore directly to ensure we're using the backend
  const store = signalHistoryStore;
  if (!(store instanceof BackendSignalHistoryStore)) {
    throw new Error('CSV import requires backend signal history store. Set VITE_HISTORY_STORE_MODE=backend');
  }

  // Persist assets to the assets table (only non-duplicates)
  const persistedAssets: Asset[] = [];
  const errors: Array<{ asset: Asset; error: string }> = [];

  for (const asset of assetsToImport) {
    try {
      // Create asset using assetService (handles database persistence)
      const persistedAsset = await assetService.createAsset({
        name: asset.name,
        type: asset.type,
        criticality: asset.criticality,
        owner: asset.owner,
        location: asset.location,
        ipAddress: asset.ipAddress,
        description: asset.description,
        complianceFrameworks: asset.complianceFrameworks,
        riskScore: asset.riskScore,
        lastAssessed: asset.lastAssessed,
        tags: asset.tags,
        relationships: asset.relationships,
        vulnerabilities: asset.vulnerabilities,
        status: asset.status,
        dataClassification: asset.dataClassification,
        dataTypes: asset.dataTypes,
        retentionPeriod: asset.retentionPeriod,
        legalBasis: asset.legalBasis,
        dataSubjectRights: asset.dataSubjectRights,
        crossBorderTransfer: asset.crossBorderTransfer,
        thirdPartySharing: asset.thirdPartySharing,
        encryptionStatus: asset.encryptionStatus,
        accessControls: asset.accessControls,
        privacyImpactAssessment: asset.privacyImpactAssessment,
        dataBreachHistory: asset.dataBreachHistory,
        dependencies: asset.dependencies,
        requirements: asset.requirements,
      });
      persistedAssets.push(persistedAsset);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push({ asset, error: errorMessage });
      // Continue processing other assets even if one fails
    }
  }

  // Record signal snapshots for successfully persisted assets
  // Update snapshots with actual persisted asset IDs
  for (const { asset, signals: snapshot } of snapshots) {
    const persistedAsset = persistedAssets.find(pa => 
      pa.name === asset.name && 
      pa.type === asset.type &&
      pa.owner === asset.owner
    );
    
    if (persistedAsset) {
      // Update snapshot with persisted asset ID
      const updatedSnapshot: SignalSnapshotWithBatch = {
        ...snapshot,
        assetId: persistedAsset.id,
      };
      await store.recordSnapshot(updatedSnapshot);
    } else {
      // Still record snapshot with original asset ID if persistence failed
      await store.recordSnapshot(snapshot);
    }
  }

  // Log errors if any assets failed to persist
  if (errors.length > 0) {
    logger.warn(`CSV import completed with ${errors.length} asset persistence errors:`, errors);
  }

  return {
    batchId,
    assetCount: persistedAssets.length,
    vendorLinkedAssets,
    duplicatesFound: duplicateCount,
    duplicatesMerged: duplicatesSkipped,
    errors: errors.length > 0 ? errors.map(e => ({ assetName: e.asset.name, error: e.error })) : undefined,
  };
}

/**
 * Get import batch by ID
 */
export async function getImportBatch(batchId: string) {
  if (!isSupabaseEnabled || !supabase) {
    throw new Error('Requires Supabase to be configured.');
  }

  const { data, error } = await supabase
    .from('asset_import_batch')
    .select('*')
    .eq('id', batchId)
    .single();

  if (error) {
    const errorMessage = handleSupabaseError(error);
    throw new Error(`Failed to get import batch: ${errorMessage}`);
  }

  return data;
}

/**
 * List recent import batches
 */
export async function listImportBatches(limit: number = 10) {
  if (!isSupabaseEnabled || !supabase) {
    throw new Error('Requires Supabase to be configured.');
  }

  const { data, error } = await supabase
    .from('asset_import_batch')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    const errorMessage = handleSupabaseError(error);
    throw new Error(`Failed to list import batches: ${errorMessage}`);
  }

  return data;
}

