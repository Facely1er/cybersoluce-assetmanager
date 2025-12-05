/**
 * SBOM Types for CyberSoluce Lite
 */

export interface SBOMResult {
  assetId: string;
  assetName: string;
  status: 'auto-generated' | 'upload-required' | 'already-exists' | 'not-software' | 'error';
  baselineMatch?: BaselineSBOM;
  sbomData?: Record<string, unknown>;
  error?: string;
  message: string;
}

export interface BaselineSBOM {
  id: string;
  name: string;
  version: string;
  ecosystem?: string;
  path: string;
  format: 'CycloneDX' | 'SPDX' | 'SWID';
}

export interface SoftwareAssetDetection {
  assetId: string;
  assetName: string;
  confidence: 'high' | 'medium' | 'low';
  detectedType: 'application' | 'library' | 'framework' | 'container' | 'unknown';
  detectedEcosystem?: string;
  detectedName?: string;
  detectedVersion?: string;
}

