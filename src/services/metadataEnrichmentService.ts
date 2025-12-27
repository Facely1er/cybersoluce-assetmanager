/**
 * Metadata Enrichment Service
 * Infers environment, cloud provider, region from asset metadata
 * 
 * Migrated from CyberSoluce-Lite and adapted for full Asset type
 */

import { Asset } from '../types/asset';

export interface MetadataEnrichmentResult {
  environment?: 'production' | 'staging' | 'development' | 'test';
  cloudProvider?: 'AWS' | 'Azure' | 'GCP' | 'Other';
  region?: string;
  inferred: boolean;
  confidence: 'high' | 'medium' | 'low';
}

export class MetadataEnrichmentService {
  /**
   * Infer environment from asset name/location
   */
  static inferEnvironment(asset: Asset): MetadataEnrichmentResult['environment'] {
    const name = asset.name.toLowerCase();
    const location = asset.location.toLowerCase();
    const description = (asset.description || '').toLowerCase();
    const combined = `${name} ${location} ${description}`;

    // Production indicators
    if (
      combined.includes('prod') ||
      combined.includes('production') ||
      combined.includes('live') ||
      combined.includes('prd')
    ) {
      return 'production';
    }

    // Staging indicators
    if (
      combined.includes('staging') ||
      combined.includes('stage') ||
      combined.includes('stg')
    ) {
      return 'staging';
    }

    // Development indicators
    if (
      combined.includes('dev') ||
      combined.includes('development') ||
      combined.includes('local')
    ) {
      return 'development';
    }

    // Test indicators
    if (
      combined.includes('test') ||
      combined.includes('qa') ||
      combined.includes('quality')
    ) {
      return 'test';
    }

    return undefined;
  }

  /**
   * Infer cloud provider from location/ID
   */
  static inferCloudProvider(asset: Asset): MetadataEnrichmentResult['cloudProvider'] {
    const location = asset.location.toLowerCase();
    const name = asset.name.toLowerCase();
    const description = (asset.description || '').toLowerCase();
    const combined = `${location} ${name} ${description}`;

    // AWS indicators
    if (
      combined.includes('aws') ||
      combined.includes('amazon') ||
      combined.includes('s3') ||
      combined.includes('ec2') ||
      combined.includes('rds') ||
      combined.includes('lambda') ||
      combined.includes('sns') ||
      combined.includes('sqs') ||
      location.includes('us-east-') ||
      location.includes('us-west-') ||
      location.includes('eu-west-') ||
      location.includes('ap-southeast-') ||
      location.includes('.amazonaws.com')
    ) {
      return 'AWS';
    }

    // Azure indicators
    if (
      combined.includes('azure') ||
      combined.includes('microsoft') ||
      combined.includes('blob') ||
      combined.includes('azure-') ||
      combined.includes('azure storage') ||
      location.includes('.azure.') ||
      location.includes('.azurewebsites.net') ||
      location.includes('.azure.com')
    ) {
      return 'Azure';
    }

    // GCP indicators
    if (
      combined.includes('gcp') ||
      combined.includes('google cloud') ||
      combined.includes('gcs') ||
      combined.includes('gke') ||
      combined.includes('google cloud platform') ||
      location.includes('.googleapis.com') ||
      location.includes('.gcp.com')
    ) {
      return 'GCP';
    }

    // Cloud-like but unknown
    if (
      location.includes('cloud') ||
      location.includes('compute') ||
      location.includes('storage') ||
      asset.type === 'Cloud Service'
    ) {
      return 'Other';
    }

    return undefined;
  }

  /**
   * Infer region from location
   */
  static inferRegion(asset: Asset): string | undefined {
    const location = asset.location.toLowerCase();
    const name = asset.name.toLowerCase();
    const combined = `${location} ${name}`;

    // AWS regions
    const awsRegions = [
      'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
      'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-central-1',
      'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'ap-northeast-2',
      'ap-south-1', 'sa-east-1', 'ca-central-1', 'eu-north-1',
    ];

    for (const region of awsRegions) {
      if (combined.includes(region)) {
        return region.toUpperCase();
      }
    }

    // Azure regions
    const azureRegions = [
      'eastus', 'westus', 'centralus', 'northeurope', 'westeurope',
      'southeastasia', 'eastasia', 'japaneast', 'japanwest',
      'brazilsouth', 'australiaeast', 'australiasoutheast',
      'canadacentral', 'canadaeast', 'uksouth', 'ukwest',
    ];

    for (const region of azureRegions) {
      if (combined.includes(region)) {
        return region.charAt(0).toUpperCase() + region.slice(1);
      }
    }

    // GCP regions
    const gcpRegions = [
      'us-central1', 'us-east1', 'us-west1', 'us-west2', 'us-west3', 'us-west4',
      'europe-west1', 'europe-west2', 'europe-west3', 'europe-west4',
      'asia-east1', 'asia-southeast1', 'asia-northeast1', 'asia-south1',
      'australia-southeast1', 'southamerica-east1',
    ];

    for (const region of gcpRegions) {
      if (combined.includes(region)) {
        return region.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
    }

    return undefined;
  }

  /**
   * Enrich asset with inferred metadata
   */
  static enrichAsset(asset: Asset): {
    enriched: Asset;
    enrichment: MetadataEnrichmentResult;
  } {
    const environment = this.inferEnvironment(asset);
    const cloudProvider = this.inferCloudProvider(asset);
    const region = this.inferRegion(asset);

    const enrichment: MetadataEnrichmentResult = {
      environment,
      cloudProvider,
      region,
      inferred: true,
      confidence: this.calculateConfidence(environment, cloudProvider, region),
    };

    // Add inferred metadata to tags
    const tags = asset.tags || [];
    if (environment && !tags.includes(`env:${environment}`)) {
      tags.push(`env:${environment}`);
    }
    if (cloudProvider && !tags.includes(`cloud:${cloudProvider}`)) {
      tags.push(`cloud:${cloudProvider}`);
    }
    if (region && !tags.includes(`region:${region}`)) {
      tags.push(`region:${region}`);
    }
    if (!tags.includes('metadata-inferred')) {
      tags.push('metadata-inferred');
    }

    return {
      enriched: { ...asset, tags },
      enrichment,
    };
  }

  /**
   * Calculate confidence level
   */
  private static calculateConfidence(
    environment?: MetadataEnrichmentResult['environment'],
    cloudProvider?: MetadataEnrichmentResult['cloudProvider'],
    region?: string
  ): 'high' | 'medium' | 'low' {
    let score = 0;
    if (environment) score += 2;
    if (cloudProvider) score += 2;
    if (region) score += 1;

    if (score >= 4) return 'high';
    if (score >= 2) return 'medium';
    return 'low';
  }

  /**
   * Mark field as manually overridden (remove inferred tag)
   */
  static markAsManual(asset: Asset, field: 'environment' | 'cloudProvider' | 'region'): Asset {
    const tags = asset.tags || [];
    const index = tags.findIndex(t => t.startsWith(`${field}:`));
    if (index !== -1) {
      tags.splice(index, 1);
    }
    tags.push(`${field}:manual`);
    return { ...asset, tags };
  }

  /**
   * Batch enrich multiple assets
   */
  static enrichAssets(assets: Asset[]): {
    enriched: Asset[];
    enrichments: Map<string, MetadataEnrichmentResult>;
  } {
    const enriched: Asset[] = [];
    const enrichments = new Map<string, MetadataEnrichmentResult>();

    for (const asset of assets) {
      const result = this.enrichAsset(asset);
      enriched.push(result.enriched);
      enrichments.set(asset.id, result.enrichment);
    }

    return { enriched, enrichments };
  }
}

