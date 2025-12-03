/**
 * SBOM Upload Service
 * 
 * Service for uploading SBOM files and recording signal history.
 * Handles SBOM parsing → SBOMIntake → signals → signal snapshot recording.
 */

import { supabase, isSupabaseEnabled } from '@/lib/supabase';
import { handleSupabaseError } from '@/lib/supabase';
import { signalHistoryStore, BackendSignalHistoryStore, SignalSnapshotWithBatch } from '@/time/signalHistoryStore';
import { buildSBOMSignals } from '@/technoSoluce/sbom/sbomSignalBuilder';
import { SBOMIntake, SBOMFormat, SBOMSource } from '@/contracts/technoSoluce.sbom.contract';

/**
 * SBOM upload result
 */
export interface SBOMUploadResult {
  batchId: string;
  sbomId: string;
  componentsCount: number;
  linkedAssetIds: string[];
}

/**
 * Parse SBOM file to extract metadata
 * 
 * This is a basic parser that extracts minimal metadata from SPDX and CycloneDX formats.
 * For production use, consider using a dedicated SBOM parsing library.
 */
export function parseSBOMFile(sbomContent: string, fileName: string): SBOMIntake {
  const sbomId = `sbom-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  let format: SBOMFormat = 'SPDX';
  let toolName = 'Unknown';
  let generatedAt = new Date().toISOString();
  let componentsCount = 0;
  let hasLicenses = false;
  let hasDependencies = false;

  // Detect format from content or filename
  const contentLower = sbomContent.toLowerCase();
  if (contentLower.includes('cyclonedx') || fileName.toLowerCase().includes('cyclonedx')) {
    format = 'CycloneDX';
  } else if (contentLower.includes('spdx') || fileName.toLowerCase().includes('spdx')) {
    format = 'SPDX';
  }

  try {
    // Try to parse as JSON (both SPDX and CycloneDX can be JSON)
    const json = JSON.parse(sbomContent);

    if (format === 'CycloneDX') {
      // CycloneDX format
      if (json.specVersion) {
        toolName = json.metadata?.tools?.[0]?.name || json.metadata?.tool?.name || 'CycloneDX Generator';
      }
      if (json.metadata?.timestamp) {
        generatedAt = json.metadata.timestamp;
      }
      if (Array.isArray(json.components)) {
        componentsCount = json.components.length;
      }
      if (json.dependencies && Array.isArray(json.dependencies) && json.dependencies.length > 0) {
        hasDependencies = true;
      }
      if (json.components?.some((c: any) => c.licenses)) {
        hasLicenses = true;
      }
    } else {
      // SPDX format
      if (json.spdxVersion) {
        toolName = json.creationInfo?.creators?.[0] || 'SPDX Generator';
        if (typeof toolName === 'string' && toolName.includes(':')) {
          toolName = toolName.split(':')[1] || toolName;
        }
      }
      if (json.creationInfo?.created) {
        generatedAt = json.creationInfo.created;
      }
      if (json.packages && Array.isArray(json.packages)) {
        componentsCount = json.packages.length;
      }
      if (json.relationships && Array.isArray(json.relationships) && json.relationships.length > 0) {
        hasDependencies = true;
      }
      if (json.packages?.some((p: any) => p.licenseDeclared || p.licenseConcluded)) {
        hasLicenses = true;
      }
    }
  } catch (e) {
    // Not JSON, try to parse as tag-value SPDX
    if (format === 'SPDX') {
      const lines = sbomContent.split('\n');
      for (const line of lines) {
        if (line.startsWith('PackageName:')) {
          componentsCount++;
        }
        if (line.startsWith('PackageLicenseDeclared:') || line.startsWith('PackageLicenseConcluded:')) {
          hasLicenses = true;
        }
        if (line.startsWith('Relationship:')) {
          hasDependencies = true;
        }
        if (line.startsWith('Creator:')) {
          const match = line.match(/Creator:\s*(.+)/);
          if (match) {
            toolName = match[1].trim();
          }
        }
        if (line.startsWith('Created:')) {
          const match = line.match(/Created:\s*(.+)/);
          if (match) {
            generatedAt = match[1].trim();
          }
        }
      }
    }
  }

  return {
    sbomId,
    format,
    generatedAt,
    toolName,
    componentsCount,
    hasLicenses,
    hasDependencies,
    source: 'upload' as SBOMSource,
  };
}

/**
 * Upload SBOM and record signal history
 * 
 * @param sbomFile - SBOM file (File object or content string)
 * @param sourceLabel - Label for this SBOM upload (e.g., 'Repo foo-service SBOM')
 * @param linkedAssetIds - Asset IDs that this SBOM is linked to
 * @param createdBy - Optional user identifier
 * @returns SBOM upload result
 */
export async function uploadSBOM(
  sbomFile: File | string,
  sourceLabel: string,
  linkedAssetIds: string[],
  createdBy?: string
): Promise<SBOMUploadResult> {
  if (!isSupabaseEnabled || !supabase) {
    throw new Error('SBOM upload requires Supabase to be configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }

  if (linkedAssetIds.length === 0) {
    throw new Error('At least one asset ID must be provided to link the SBOM.');
  }

  // Read file content
  let sbomContent: string;
  let fileName: string;

  if (typeof sbomFile === 'string') {
    sbomContent = sbomFile;
    fileName = 'sbom.json';
  } else {
    sbomContent = await sbomFile.text();
    fileName = sbomFile.name;
  }

  // Parse SBOM
  const sbomIntake = parseSBOMFile(sbomContent, fileName);

  // Create import batch
  const { data: batchData, error: batchError } = await supabase
    .from('asset_import_batch')
    .insert({
      type: 'sbom-upload',
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

  // Build signals from SBOM
  const signals = buildSBOMSignals(sbomIntake, linkedAssetIds);

  // Record signal snapshots for each linked asset
  const store = signalHistoryStore;
  if (!(store instanceof BackendSignalHistoryStore)) {
    throw new Error('SBOM upload requires backend signal history store. Set VITE_HISTORY_STORE_MODE=backend');
  }

  // Create a snapshot per asset (or combine all assets in one snapshot)
  // For simplicity, we'll create one snapshot with all linked assets
  const snapshot: SignalSnapshotWithBatch = {
    assetId: linkedAssetIds[0], // Primary asset ID
    capturedAt: new Date().toISOString(),
    source: 'technosoluce',
    signals,
    importBatchId: batchId,
  };

  await store.recordSnapshot(snapshot);

  // If multiple assets, create additional snapshots for each
  // (Signals already include all linked asset IDs, but we record per-asset for history tracking)
  for (let i = 1; i < linkedAssetIds.length; i++) {
    const additionalSnapshot: SignalSnapshotWithBatch = {
      assetId: linkedAssetIds[i],
      capturedAt: snapshot.capturedAt,
      source: 'technosoluce',
      signals: signals.map(sig => ({
        ...sig,
        affectedAssetIds: [linkedAssetIds[i]], // Individual asset for this snapshot
      })),
      importBatchId: batchId,
    };
    await store.recordSnapshot(additionalSnapshot);
  }

  return {
    batchId,
    sbomId: sbomIntake.sbomId,
    componentsCount: sbomIntake.componentsCount,
    linkedAssetIds,
  };
}

