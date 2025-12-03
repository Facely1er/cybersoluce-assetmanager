/**
 * CyberSoluce Export Manifest
 * 
 * Metadata about an export from CyberSoluce to another ERMITS product.
 * 
 * This manifest accompanies every export to provide context and intent.
 * 
 * @internal This manifest ensures traceability and prevents scope creep.
 */

export interface CyberSoluceExportManifest {
  /** Version of the export format */
  version: string;
  
  /** Timestamp when export was created */
  exportedAt: string; // ISO 8601 timestamp
  
  /** Source product (always "CyberSoluce") */
  sourceProduct: 'CyberSoluce';
  
  /** Target product receiving the export */
  targetProduct: 'CyberCorrect' | 'CyberCaution' | 'VendorSoluce' | 'TechnoSoluce' | 'ERMITSAdvisory';
  
  /** Intent of the handoff (what the target product should focus on) */
  handoffIntent: string;
  
  /** Next question prompt for UX (guides user interaction) */
  nextQuestionPrompt: string;
  
  /** Count of assets in this export */
  assetCount: number;
  
  /** Count of dependencies in this export */
  dependencyCount: number;
  
  /** Count of signals in this export */
  signalCount: number;
  
  /** Filtered fields that were included (for transparency) */
  includedFields: string[];
  
  /** Fields that were excluded (for transparency) */
  excludedFields: string[];
  
  /** Export ID for traceability */
  exportId: string;
}

/**
 * Create a new export manifest
 */
export function createExportManifest(
  targetProduct: CyberSoluceExportManifest['targetProduct'],
  handoffIntent: string,
  nextQuestionPrompt: string,
  assetCount: number,
  dependencyCount: number,
  signalCount: number,
  includedFields: string[],
  excludedFields: string[]
): CyberSoluceExportManifest {
  return {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    sourceProduct: 'CyberSoluce',
    targetProduct,
    handoffIntent,
    nextQuestionPrompt,
    assetCount,
    dependencyCount,
    signalCount,
    includedFields,
    excludedFields,
    exportId: `export-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };
}

