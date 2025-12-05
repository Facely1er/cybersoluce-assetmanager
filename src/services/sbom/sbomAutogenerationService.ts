/**
 * SBOM Autogeneration Service
 * 
 * Detects software assets in CyberSoluce and:
 * 1. Checks baseline directory for matching SBOMs
 * 2. Auto-generates SBOM if baseline exists
 * 3. Requests upload if no baseline available
 * 4. Links SBOM to asset via TechnoSoluce
 */

import { Asset } from '../../types/asset';
import { BaselineSBOM } from './baselineSBOMService';

export interface SBOMAutogenerationResult {
  assetId: string;
  assetName: string;
  status: 'auto-generated' | 'upload-required' | 'already-exists' | 'not-software' | 'error';
  baselineMatch?: BaselineSBOM;
  sbomData?: Record<string, unknown>;
  error?: string;
  message: string;
}

export interface SoftwareAssetDetection {
  asset: Asset;
  confidence: 'high' | 'medium' | 'low';
  detectedType: 'application' | 'library' | 'framework' | 'container' | 'unknown';
  detectedEcosystem?: string;
  detectedName?: string;
  detectedVersion?: string;
}

/**
 * SBOM Autogeneration Service
 */
export class SBOMAutogenerationService {
  /**
   * Detect software assets from asset inventory
   */
  static detectSoftwareAssets(assets: Asset[]): SoftwareAssetDetection[] {
    return assets
      .map(asset => this.detectSoftwareAsset(asset))
      .filter(detection => detection.confidence !== 'low' || detection.detectedType !== 'unknown');
  }

  /**
   * Detect if a single asset is software-related
   */
  private static detectSoftwareAsset(asset: Asset): SoftwareAssetDetection {
    // High confidence: Explicit software type
    if (asset.assetType === 'software' || asset.assetType === 'application') {
      return {
        asset,
        confidence: 'high',
        detectedType: asset.assetType === 'software' ? 'library' : 'application',
        detectedName: asset.name,
      };
    }

    // Medium confidence: Tags or name suggest software
    const name = asset.name.toLowerCase();
    const tags = asset.tags?.map(t => t.toLowerCase()) || [];
    
    // Check for software-related tags
    const softwareTags = ['software', 'app', 'application', 'component', 'library', 'framework', 'sbom', 'dependency'];
    const hasSoftwareTag = tags.some(tag => softwareTags.some(st => tag.includes(st)));
    
    // Check for common software patterns in name
    const softwarePatterns = [
      /^[a-z]+-[a-z]+/i, // npm-style: react-dom
      /^@[a-z]+\/[a-z-]+/i, // scoped: @angular/core
      /\.js$|\.ts$|\.py$|\.jar$|\.dll$/i, // file extensions
    ];
    const matchesPattern = softwarePatterns.some(pattern => pattern.test(name));

    if (hasSoftwareTag || matchesPattern) {
      // Try to extract ecosystem and version
      const ecosystem = this.detectEcosystem(name, tags);
      const version = this.extractVersion(name);
      
      return {
        asset,
        confidence: 'medium',
        detectedType: this.inferSoftwareType(name, tags),
        detectedEcosystem: ecosystem,
        detectedName: asset.name,
        detectedVersion: version,
      };
    }

    // Low confidence: Service type might be software
    if (asset.assetType === 'service') {
      return {
        asset,
        confidence: 'low',
        detectedType: 'application',
        detectedName: asset.name,
      };
    }

    return {
      asset,
      confidence: 'low',
      detectedType: 'unknown',
    };
  }

  /**
   * Detect ecosystem from asset name/tags
   */
  private static detectEcosystem(name: string, tags: string[]): string | undefined {
    const allText = `${name} ${tags.join(' ')}`.toLowerCase();
    
    if (allText.includes('npm') || allText.includes('node') || allText.includes('package.json')) {
      return 'npm';
    }
    if (allText.includes('pypi') || allText.includes('python') || allText.includes('pip')) {
      return 'pypi';
    }
    if (allText.includes('maven') || allText.includes('java') || allText.includes('gradle')) {
      return 'maven';
    }
    if (allText.includes('nuget') || allText.includes('.net') || allText.includes('c#')) {
      return 'nuget';
    }
    if (allText.includes('docker') || allText.includes('container')) {
      return 'docker';
    }
    
    return undefined;
  }

  /**
   * Extract version from asset name
   */
  private static extractVersion(name: string): string | undefined {
    // Common version patterns: v1.2.3, 1.2.3, @1.2.3
    const versionMatch = name.match(/(?:v|@)?(\d+\.\d+\.\d+(?:-\w+)?)/);
    return versionMatch ? versionMatch[1] : undefined;
  }

  /**
   * Infer software type from name/tags
   */
  private static inferSoftwareType(name: string, tags: string[]): 'application' | 'library' | 'framework' | 'container' {
    const allText = `${name} ${tags.join(' ')}`.toLowerCase();
    
    if (allText.includes('framework') || allText.includes('react') || allText.includes('angular') || allText.includes('vue')) {
      return 'framework';
    }
    if (allText.includes('docker') || allText.includes('container') || allText.includes('image')) {
      return 'container';
    }
    if (allText.includes('library') || allText.includes('lib') || allText.includes('package')) {
      return 'library';
    }
    
    return 'application';
  }

  /**
   * Check baseline directory for matching SBOM
   */
  static async checkBaselineForAsset(
    asset: Asset,
    baselines: BaselineSBOM[]
  ): Promise<BaselineSBOM | undefined> {
    const detection = this.detectSoftwareAsset(asset);
    
    if (detection.detectedType === 'unknown') {
      return undefined;
    }

    // Try to match by name
    const nameMatch = baselines.find(b => 
      b.name.toLowerCase() === asset.name.toLowerCase() ||
      b.name.toLowerCase().includes(asset.name.toLowerCase()) ||
      asset.name.toLowerCase().includes(b.name.toLowerCase())
    );
    
    if (nameMatch) {
      return nameMatch;
    }

    // Try to match by ecosystem
    if (detection.detectedEcosystem) {
      const ecosystemBaselines = baselines.filter(b => b.ecosystem === detection.detectedEcosystem);
      
      // If we have a version, try to match by version too
      if (detection.detectedVersion) {
        const versionMatch = ecosystemBaselines.find(b => 
          b.version === detection.detectedVersion ||
          b.name.toLowerCase().includes(detection.detectedName?.toLowerCase() || '')
        );
        if (versionMatch) return versionMatch;
      }
      
      // Return first ecosystem match if available
      if (ecosystemBaselines.length > 0) {
        return ecosystemBaselines[0];
      }
    }

    return undefined;
  }

  /**
   * Auto-generate SBOM for an asset using baseline
   */
  static async autogenerateSBOM(
    asset: Asset,
    baseline: BaselineSBOM
  ): Promise<SBOMAutogenerationResult> {
    try {
      // Check if asset already has SBOM data
      if (asset.technoSoluceData?.sbomAvailable) {
        return {
          assetId: asset.id,
          assetName: asset.name,
          status: 'already-exists',
          message: `Asset "${asset.name}" already has SBOM data`,
        };
      }

      // Load baseline SBOM file
      const response = await fetch(baseline.path);
      if (!response.ok) {
        throw new Error(`Failed to load baseline SBOM: ${response.statusText}`);
      }

      const sbomData: unknown = await response.json();

      // Transform baseline SBOM to match asset
      const transformedSBOM = this.transformBaselineSBOM(sbomData, asset, baseline);

      return {
        assetId: asset.id,
        assetName: asset.name,
        status: 'auto-generated',
        baselineMatch: baseline,
        sbomData: transformedSBOM as Record<string, unknown>,
        message: `SBOM auto-generated for "${asset.name}" using baseline "${baseline.name}"`,
      };
    } catch (error) {
      return {
        assetId: asset.id,
        assetName: asset.name,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        message: `Failed to auto-generate SBOM for "${asset.name}": ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Transform baseline SBOM to match asset
   */
  private static transformBaselineSBOM(
    baselineSBOM: unknown,
    asset: Asset,
    baseline: BaselineSBOM
  ): Record<string, unknown> {
    const sbom = baselineSBOM as Record<string, unknown>;
    const result: Record<string, unknown> = { ...sbom };
    
    // Update metadata to reflect the asset
    if (result.metadata && typeof result.metadata === 'object') {
      const metadata = result.metadata as Record<string, unknown>;
      if (metadata.component && typeof metadata.component === 'object') {
        const component = metadata.component as Record<string, unknown>;
        metadata.component = {
          ...component,
          name: asset.name,
          version: baseline.version,
        };
      }
    }

    // Add asset reference
    result.assetReference = {
      assetId: asset.id,
      assetName: asset.name,
      baselineSource: baseline.name,
      generatedAt: new Date().toISOString(),
    };

    return result;
  }

  /**
   * Process all software assets for SBOM autogeneration
   */
  static async processSoftwareAssets(
    assets: Asset[],
    baselines: BaselineSBOM[]
  ): Promise<SBOMAutogenerationResult[]> {
    const softwareAssets = this.detectSoftwareAssets(assets);
    const results: SBOMAutogenerationResult[] = [];

    for (const detection of softwareAssets) {
      const asset = detection.asset;

      // Check if already has SBOM
      if (asset.technoSoluceData?.sbomAvailable) {
        results.push({
          assetId: asset.id,
          assetName: asset.name,
          status: 'already-exists',
          message: `Asset "${asset.name}" already has SBOM data`,
        });
        continue;
      }

      // Check baseline
      const baselineMatch = await this.checkBaselineForAsset(asset, baselines);

      if (baselineMatch !== undefined) {
        // Auto-generate from baseline
        const result = await this.autogenerateSBOM(asset, baselineMatch);
        results.push(result);
      } else {
        // Request upload
        results.push({
          assetId: asset.id,
          assetName: asset.name,
          status: 'upload-required',
          message: `No baseline SBOM found for "${asset.name}". Please upload SBOM manually.`,
        });
      }
    }

    return results;
  }

  /**
   * Get autogeneration status for an asset
   */
  static getAutogenerationStatus(asset: Asset): {
    needsSBOM: boolean;
    hasSBOM: boolean;
    canAutogenerate: boolean;
    message: string;
  } {
    const detection = this.detectSoftwareAsset(asset);
    const hasSBOM = asset.technoSoluceData?.sbomAvailable || false;
    const needsSBOM = detection.detectedType !== 'unknown';
    const canAutogenerate = needsSBOM && !hasSBOM && detection.confidence !== 'low';

    let message = '';
    if (hasSBOM) {
      message = 'SBOM already exists';
    } else if (!needsSBOM) {
      message = 'Not a software asset';
    } else if (canAutogenerate) {
      message = 'Can auto-generate from baseline';
    } else {
      message = 'Upload required';
    }

    return {
      needsSBOM,
      hasSBOM,
      canAutogenerate,
      message,
    };
  }
}

