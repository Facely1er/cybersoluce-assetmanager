/**
 * CSV Import Service
 * 
 * Service for importing CSV assets and recording signal history.
 * Handles the full import pipeline: CSV parsing → asset creation → signal snapshot recording.
 */

import { supabase, isSupabaseEnabled } from '@/lib/supabase';
import { handleSupabaseError } from '@/lib/supabase';
import { signalHistoryStore, BackendSignalHistoryStore, SignalSnapshotWithBatch } from '@/time/signalHistoryStore';
import { parseCsvFile, mapCsvRowToAsset, buildInitialSignalsForCsvAsset, assetToContract, ParsedCsvAssetRow } from '@/import/csvAssetImportService';
import { Asset } from '@/types/asset';
import { CyberSoluceAssetContract } from '@/contracts/cyberSoluce.asset.contract';

/**
 * Import batch result
 */
export interface ImportBatchResult {
  batchId: string;
  assetCount: number;
  vendorLinkedAssets: number;
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

  // Process each row
  let vendorLinkedAssets = 0;
  const assets: Asset[] = [];
  const snapshots: Array<{ asset: Asset; signals: SignalSnapshotWithBatch }> = [];

  for (const row of rows) {
    // Map to asset
    const asset = mapCsvRowToAsset(row);
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

  // Record signal snapshots
  // Use BackendSignalHistoryStore directly to ensure we're using the backend
  const store = signalHistoryStore;
  if (!(store instanceof BackendSignalHistoryStore)) {
    throw new Error('CSV import requires backend signal history store. Set VITE_HISTORY_STORE_MODE=backend');
  }

  for (const { signals: snapshot } of snapshots) {
    await store.recordSnapshot(snapshot);
  }

  // TODO: Persist assets to your asset storage mechanism
  // For now, assets are only stored in signal history
  // You may want to also persist them to an assets table if you have one

  return {
    batchId,
    assetCount: assets.length,
    vendorLinkedAssets,
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

