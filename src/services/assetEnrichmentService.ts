/**
 * CyberSoluce Asset Intelligence Layer
 *
 * NOTE:
 * - This logic surfaces QUALITATIVE focus signals only.
 * - It must never claim:
 *     - Overall security posture
 *     - Compliance / certification
 *     - Formal risk ratings
 * - Outputs are indicative and require deeper, asset-based evaluation
 *   in the relevant ERMITS products (CyberCorrect, CyberCaution, VendorSoluce, TechnoSoluce, ERMITS Advisory).
 * 
 * @internal
 * This service is internal to CyberSoluce and should not be exported beyond the CyberSoluce boundary.
 * 
 * HARD LOCK: Any change that introduces scoring, posture, or recommendations
 * violates CyberSoluce design principles.
 * 
 * Asset enrichment produces indicative focus signals.
 * It must not:
 * - Assert completeness
 * - Present risk posture
 * - Replace expert analysis
 * 
 * This service enriches assets internally and generates qualitative focus signals.
 * All enrichment data is hidden from the UI - only focus signals are exposed.
 */

import { Asset } from '../types/asset';
import { AssetEnrichment, FocusSignal, NormalizedAssetFields } from '../types/enrichment';
import { logError } from '../utils/errorHandling';

class AssetEnrichmentService {
  private enrichmentCache = new Map<string, AssetEnrichment>();
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Normalize asset fields internally
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  normalizeAsset(asset: Asset, _sourceType: 'imported' | 'manual' | 'inferred' = 'manual'): NormalizedAssetFields {
    return {
      asset_type: asset.type,
      owner: asset.owner,
      business_function: this.inferBusinessFunction(asset),
      vendor: this.inferVendor(asset),
      data_sensitivity: asset.dataClassification || this.inferDataSensitivity(asset),
      relationship_direction: this.inferRelationshipDirection(asset),
    };
  }

  /**
   * Enrich asset with internal overlays
   */
  async enrichAsset(asset: Asset, allAssets: Asset[] = []): Promise<AssetEnrichment> {
    const cacheKey = `enrichment_${asset.id}`;
    const cached = this.enrichmentCache.get(cacheKey);
    
    if (cached && this.isCacheValid(cacheKey)) {
      return cached;
    }

    try {
      const enrichment: AssetEnrichment = {
        privacy_relevance: this.determinePrivacyRelevance(asset, allAssets),
        ransomware_relevance: this.determineRansomwareRelevance(asset, allAssets),
        vendor_dependency: this.determineVendorDependency(asset, allAssets),
        software_dependency: this.determineSoftwareDependency(asset, allAssets),
        source_type: 'inferred', // Will be set by caller if known
        last_updated: new Date(),
        confidence_level: this.calculateConfidenceLevel(asset),
      };

      this.enrichmentCache.set(cacheKey, enrichment);
      return enrichment;
    } catch (error) {
      logError(error, 'AssetEnrichmentService.enrichAsset', { assetId: asset.id });
      throw error;
    }
  }

  /**
   * Detect focus signals (qualitative only, no numeric scoring)
   */
  detectFocusSignals(assets: Asset[]): FocusSignal[] {
    const signals: FocusSignal[] = [];

    // Privacy signals
    const privacySignals = this.detectPrivacySignals(assets);
    signals.push(...privacySignals);

    // Ransomware signals
    const ransomwareSignals = this.detectRansomwareSignals(assets);
    signals.push(...ransomwareSignals);

    // Vendor dependency signals
    const vendorSignals = this.detectVendorDependencySignals(assets);
    signals.push(...vendorSignals);

    // Software dependency signals
    const softwareSignals = this.detectSoftwareDependencySignals(assets);
    signals.push(...softwareSignals);

    // Governance signals
    const governanceSignals = this.detectGovernanceSignals(assets);
    signals.push(...governanceSignals);

    return signals;
  }

  /**
   * Determine privacy relevance
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private determinePrivacyRelevance(asset: Asset, _allAssets: Asset[]): boolean {
    // Check data classification
    if (asset.dataClassification === 'Confidential' || asset.dataClassification === 'Restricted' || asset.dataClassification === 'Top Secret') {
      return true;
    }

    // Check data types
    if (asset.dataTypes && asset.dataTypes.length > 0) {
      const privacyDataTypes = ['PII', 'PHI', 'Financial', 'Personal Data'];
      if (asset.dataTypes.some(dt => privacyDataTypes.includes(dt))) {
        return true;
      }
    }

    // Check relationships for personal data flow
    if (asset.relationships && asset.relationships.some(rel => rel.isPersonalData)) {
      return true;
    }

    // Check for cross-border transfer
    if (asset.crossBorderTransfer) {
      return true;
    }

    // Check for third-party sharing
    if (asset.thirdPartySharing) {
      return true;
    }

    return false;
  }

  /**
   * Determine ransomware relevance
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private determineRansomwareRelevance(asset: Asset, _allAssets: Asset[]): boolean {
    // High criticality assets
    if (asset.criticality === 'Critical' || asset.criticality === 'High') {
      return true;
    }

    // Assets with vulnerabilities
    if (asset.vulnerabilities && asset.vulnerabilities.length > 0) {
      const criticalVulns = asset.vulnerabilities.filter(v => v.severity === 'Critical' || v.severity === 'High');
      if (criticalVulns.length > 0) {
        return true;
      }
    }

    // Assets with weak encryption
    if (asset.encryptionStatus === 'Not Encrypted' || asset.encryptionStatus === 'Partially Encrypted') {
      return true;
    }

    // Assets with unclear execution indicators (high dependency + weak controls)
    const hasHighDependency = asset.dependencies && asset.dependencies.some(dep => dep.criticality === 'Critical' || dep.criticality === 'High');
    const hasWeakControls = !asset.accessControls || asset.accessControls.length === 0;
    if (hasHighDependency && hasWeakControls) {
      return true;
    }

    return false;
  }

  /**
   * Determine vendor dependency
   */
  private determineVendorDependency(asset: Asset, allAssets: Asset[]): 'none' | 'partial' | 'heavy' {
    // Check if asset is a third-party service
    if (asset.type === 'Third Party Service' || asset.type === 'Cloud Service') {
      return 'heavy';
    }

    // Check relationships to third-party services
    if (asset.relationships) {
      const thirdPartyRelationships = asset.relationships.filter(rel => {
        const relatedAsset = allAssets.find(a => a.id === rel.relatedAssetId);
        return relatedAsset && (relatedAsset.type === 'Third Party Service' || relatedAsset.type === 'Cloud Service');
      });

      if (thirdPartyRelationships.length > 3) {
        return 'heavy';
      } else if (thirdPartyRelationships.length > 0) {
        return 'partial';
      }
    }

    // Check vendor concentration in dependencies
    if (asset.dependencies) {
      const vendorDeps = asset.dependencies.filter(dep => {
        const depAsset = allAssets.find(a => a.id === dep.dependentAssetId);
        return depAsset && (depAsset.type === 'Third Party Service' || depAsset.type === 'Cloud Service');
      });

      if (vendorDeps.length > 2) {
        return 'heavy';
      } else if (vendorDeps.length > 0) {
        return 'partial';
      }
    }

    return 'none';
  }

  /**
   * Determine software dependency
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private determineSoftwareDependency(asset: Asset, _allAssets: Asset[]): 'low' | 'medium' | 'high' {
    // Count dependencies
    const dependencyCount = asset.dependencies ? asset.dependencies.length : 0;
    const relationshipCount = asset.relationships ? asset.relationships.length : 0;
    const totalDependencies = dependencyCount + relationshipCount;

    if (totalDependencies > 5) {
      return 'high';
    } else if (totalDependencies > 2) {
      return 'medium';
    }

    // Check for critical dependencies
    if (asset.dependencies) {
      const criticalDeps = asset.dependencies.filter(dep => dep.criticality === 'Critical' || dep.criticality === 'High');
      if (criticalDeps.length > 2) {
        return 'high';
      } else if (criticalDeps.length > 0) {
        return 'medium';
      }
    }

    return 'low';
  }

  /**
   * Detect privacy focus signals
   */
  private detectPrivacySignals(assets: Asset[]): FocusSignal[] {
    const signals: FocusSignal[] = [];

    // Sensitive data + unclear lineage
    const sensitiveDataAssets = assets.filter(asset => {
      const enrichment = this.enrichmentCache.get(`enrichment_${asset.id}`);
      return enrichment?.privacy_relevance && 
             (asset.dataTypes?.length === 0 || !asset.relationships || asset.relationships.length === 0);
    });

    if (sensitiveDataAssets.length > 0) {
      signals.push({
        id: `privacy-${Date.now()}`,
        signal_type: 'sensitive_data_unclear_lineage',
        affected_asset_ids: sensitiveDataAssets.map(a => a.id),
        signal_domain: 'privacy',
        description: 'Assets with sensitive data classifications have unclear data lineage',
        concentration_description: `Concentration of sensitive data assets (${sensitiveDataAssets.length}) with incomplete relationship mapping`,
        detected_at: new Date(),
      });
    }

    return signals;
  }

  /**
   * Detect ransomware focus signals
   */
  private detectRansomwareSignals(assets: Asset[]): FocusSignal[] {
    const signals: FocusSignal[] = [];

    // High dependency + weak execution indicators
    const highRiskAssets = assets.filter(asset => {
      const enrichment = this.enrichmentCache.get(`enrichment_${asset.id}`);
      return enrichment?.ransomware_relevance && 
             enrichment?.software_dependency === 'high' &&
             (!asset.accessControls || asset.accessControls.length === 0);
    });

    if (highRiskAssets.length > 0) {
      signals.push({
        id: `ransomware-${Date.now()}`,
        signal_type: 'high_dependency_weak_execution',
        affected_asset_ids: highRiskAssets.map(a => a.id),
        signal_domain: 'ransomware',
        description: 'Assets with high dependency concentration show weak execution indicators',
        concentration_description: `Concentration of high-dependency assets (${highRiskAssets.length}) with limited access control visibility`,
        detected_at: new Date(),
      });
    }

    return signals;
  }

  /**
   * Detect vendor dependency signals
   */
  private detectVendorDependencySignals(assets: Asset[]): FocusSignal[] {
    const signals: FocusSignal[] = [];

    // Vendor concentration paths
    const vendorHeavyAssets = assets.filter(asset => {
      const enrichment = this.enrichmentCache.get(`enrichment_${asset.id}`);
      return enrichment?.vendor_dependency === 'heavy';
    });

    if (vendorHeavyAssets.length > 3) {
      signals.push({
        id: `vendor-${Date.now()}`,
        signal_type: 'vendor_concentration',
        affected_asset_ids: vendorHeavyAssets.map(a => a.id),
        signal_domain: 'vendor',
        description: 'Multiple assets show heavy vendor dependency concentration',
        concentration_description: `Concentration of vendor-dependent assets (${vendorHeavyAssets.length}) across the inventory`,
        detected_at: new Date(),
      });
    }

    return signals;
  }

  /**
   * Detect software dependency signals
   */
  private detectSoftwareDependencySignals(assets: Asset[]): FocusSignal[] {
    const signals: FocusSignal[] = [];

    // Software component concentration
    const highSoftwareDeps = assets.filter(asset => {
      const enrichment = this.enrichmentCache.get(`enrichment_${asset.id}`);
      return enrichment?.software_dependency === 'high';
    });

    if (highSoftwareDeps.length > 5) {
      signals.push({
        id: `software-${Date.now()}`,
        signal_type: 'software_concentration',
        affected_asset_ids: highSoftwareDeps.map(a => a.id),
        signal_domain: 'software',
        description: 'Multiple assets show high software dependency concentration',
        concentration_description: `Concentration of software-dependent assets (${highSoftwareDeps.length}) requiring attention`,
        detected_at: new Date(),
      });
    }

    return signals;
  }

  /**
   * Detect governance signals
   */
  private detectGovernanceSignals(assets: Asset[]): FocusSignal[] {
    const signals: FocusSignal[] = [];

    // Governance ambiguity (assets without clear compliance frameworks or ownership)
    const ambiguousAssets = assets.filter(asset => 
      (asset.complianceFrameworks.length === 0 || !asset.owner || asset.owner.trim() === '') &&
      asset.criticality !== 'Low'
    );

    if (ambiguousAssets.length > 3) {
      signals.push({
        id: `governance-${Date.now()}`,
        signal_type: 'governance_ambiguity',
        affected_asset_ids: ambiguousAssets.map(a => a.id),
        signal_domain: 'governance',
        description: 'Assets with governance ambiguity detected',
        concentration_description: `Concentration of assets (${ambiguousAssets.length}) with unclear compliance frameworks or ownership`,
        detected_at: new Date(),
      });
    }

    return signals;
  }

  /**
   * Calculate confidence level
   */
  private calculateConfidenceLevel(asset: Asset): 'low' | 'medium' | 'high' {
    let score = 0;

    // More complete data = higher confidence
    if (asset.description && asset.description.length > 20) score += 1;
    if (asset.relationships && asset.relationships.length > 0) score += 1;
    if (asset.complianceFrameworks && asset.complianceFrameworks.length > 0) score += 1;
    if (asset.dataTypes && asset.dataTypes.length > 0) score += 1;
    if (asset.accessControls && asset.accessControls.length > 0) score += 1;

    if (score >= 4) return 'high';
    if (score >= 2) return 'medium';
    return 'low';
  }

  /**
   * Infer business function from asset
   */
  private inferBusinessFunction(asset: Asset): string | undefined {
    // Infer from tags, description, or type
    if (asset.tags && asset.tags.length > 0) {
      const businessTags = asset.tags.filter(tag => 
        ['production', 'customer-facing', 'internal', 'development', 'testing'].includes(tag.toLowerCase())
      );
      if (businessTags.length > 0) {
        return businessTags[0];
      }
    }

    return undefined;
  }

  /**
   * Infer vendor from asset
   */
  private inferVendor(asset: Asset): string | undefined {
    // Check tags for vendor names
    if (asset.tags && asset.tags.length > 0) {
      const vendorTags = asset.tags.filter(tag => 
        ['aws', 'azure', 'gcp', 'microsoft', 'oracle', 'salesforce'].some(v => tag.toLowerCase().includes(v))
      );
      if (vendorTags.length > 0) {
        return vendorTags[0];
      }
    }

    // Check description
    if (asset.description) {
      const vendorKeywords = ['aws', 'azure', 'gcp', 'microsoft', 'oracle', 'salesforce'];
      for (const vendor of vendorKeywords) {
        if (asset.description.toLowerCase().includes(vendor)) {
          return vendor;
        }
      }
    }

    return undefined;
  }

  /**
   * Infer data sensitivity
   */
  private inferDataSensitivity(asset: Asset): 'Public' | 'Internal' | 'Confidential' | 'Restricted' | 'Top Secret' {
    // Use existing dataClassification if available
    if (asset.dataClassification) {
      return asset.dataClassification;
    }

    // Infer from criticality
    if (asset.criticality === 'Critical') {
      return 'Confidential';
    } else if (asset.criticality === 'High') {
      return 'Internal';
    }

    return 'Internal';
  }

  /**
   * Infer relationship direction
   */
  private inferRelationshipDirection(asset: Asset): 'inbound' | 'outbound' | 'bidirectional' | 'none' {
    if (!asset.relationships || asset.relationships.length === 0) {
      return 'none';
    }

    const hasInbound = asset.relationships.some(rel => rel.dataFlowDirection === 'Inbound' || rel.dataFlowDirection === 'Bidirectional');
    const hasOutbound = asset.relationships.some(rel => rel.dataFlowDirection === 'Outbound' || rel.dataFlowDirection === 'Bidirectional');

    if (hasInbound && hasOutbound) {
      return 'bidirectional';
    } else if (hasInbound) {
      return 'inbound';
    } else if (hasOutbound) {
      return 'outbound';
    }

    return 'none';
  }

  /**
   * Check if cache entry is valid
   */
  private isCacheValid(cacheKey: string): boolean {
    const entry = this.enrichmentCache.get(cacheKey);
    if (!entry) return false;

    const age = Date.now() - entry.last_updated.getTime();
    return age < this.CACHE_TTL;
  }

  /**
   * Clear enrichment cache
   */
  clearCache(): void {
    this.enrichmentCache.clear();
  }

  /**
   * Enrich all assets
   */
  async enrichAllAssets(assets: Asset[]): Promise<Map<string, AssetEnrichment>> {
    const enrichmentMap = new Map<string, AssetEnrichment>();

    // Enrich all assets in parallel
    const enrichmentPromises = assets.map(async (asset) => {
      try {
        const enrichment = await this.enrichAsset(asset, assets);
        enrichmentMap.set(asset.id, enrichment);
      } catch (error) {
        logError(error, 'AssetEnrichmentService.enrichAllAssets', { assetId: asset.id });
      }
    });

    await Promise.all(enrichmentPromises);
    return enrichmentMap;
  }

  // ============================================================================
  // PHASE 2 HOOKS (Future Features - DO NOT IMPLEMENT YET)
  // ============================================================================
  
  /**
   * TODO[PHASE-2]: Change-over-time signal tracking
   * - Track signal evolution over time
   * - Historical signal comparison
   * - Trend analysis
   * 
   * RULE: Do NOT implement until Phase 2
   */
  
  /**
   * TODO[PHASE-2]: Comparative signal trends
   * - Compare signals across time periods
   * - Identify signal patterns
   * - Trend visualization
   * 
   * RULE: Do NOT implement until Phase 2
   */
  
  /**
   * TODO[PHASE-2]: Cross-product signal correlation
   * - Correlate signals across ERMITS products
   * - Identify cross-product patterns
   * - Unified signal view
   * 
   * RULE: Do NOT implement until Phase 2
   */
}

export const assetEnrichmentService = new AssetEnrichmentService();

