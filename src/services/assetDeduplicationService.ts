/**
 * Asset Deduplication Service
 * Handles normalization, duplicate detection, and merge suggestions
 * 
 * Migrated from CyberSoluce-Lite and adapted for full Asset type
 */

import { Asset } from '../types/asset';

export interface DuplicateMatch {
  asset1: Asset;
  asset2: Asset;
  confidence: 'high' | 'medium' | 'low';
  reasons: string[];
  suggestedMerge: Partial<Asset>;
}

export class AssetDeduplicationService {
  /**
   * Normalize asset name for comparison
   */
  static normalizeName(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ') // Multiple spaces to single
      .replace(/[^\w\s-]/g, '') // Remove special chars except hyphens
      .replace(/-+/g, '-') // Multiple hyphens to single
      .trim();
  }

  /**
   * Normalize identifier (hostname, domain, cloud ID)
   */
  static normalizeIdentifier(identifier: string): string {
    return identifier
      .toLowerCase()
      .trim()
      .replace(/^https?:\/\//, '') // Remove protocol
      .replace(/^www\./, '') // Remove www
      .replace(/\/$/, '') // Remove trailing slash
      .trim();
  }

  /**
   * Check if two assets are likely duplicates
   */
  static areDuplicates(asset1: Asset, asset2: Asset): {
    isDuplicate: boolean;
    confidence: 'high' | 'medium' | 'low';
    reasons: string[];
  } {
    const reasons: string[] = [];
    let confidence: 'high' | 'medium' | 'low' = 'low';

    // Exact name match (normalized)
    const name1 = this.normalizeName(asset1.name);
    const name2 = this.normalizeName(asset2.name);
    if (name1 === name2 && name1.length > 0) {
      reasons.push('Exact name match');
      confidence = 'high';
    }

    // Similar name (fuzzy match)
    if (name1 !== name2 && name1.length > 0 && name2.length > 0) {
      const similarity = this.calculateSimilarity(name1, name2);
      if (similarity > 0.9) {
        reasons.push(`Very similar names (${Math.round(similarity * 100)}% match)`);
        if (confidence === 'low') confidence = 'high';
      } else if (similarity > 0.8) {
        reasons.push(`Similar names (${Math.round(similarity * 100)}% match)`);
        if (confidence === 'low') confidence = 'medium';
      }
    }

    // Same location and type
    if (asset1.location && asset2.location && asset1.type === asset2.type) {
      const loc1 = this.normalizeIdentifier(asset1.location);
      const loc2 = this.normalizeIdentifier(asset2.location);
      if (loc1 === loc2 && loc1.length > 0) {
        reasons.push('Same location and type');
        if (confidence === 'low') confidence = 'medium';
      }
    }

    // Same IP address (if available)
    if (asset1.ipAddress && asset2.ipAddress && asset1.ipAddress === asset2.ipAddress) {
      reasons.push('Same IP address');
      if (confidence === 'low') confidence = 'high';
    }

    // Same owner and similar name
    if (asset1.owner && asset2.owner && asset1.owner.toLowerCase() === asset2.owner.toLowerCase()) {
      if (name1.length > 0 && name2.length > 0) {
        const similarity = this.calculateSimilarity(name1, name2);
        if (similarity > 0.7) {
          reasons.push('Same owner with similar name');
          if (confidence === 'low') confidence = 'medium';
        }
      }
    }

    // Check for identifier matches in description or tags
    const desc1 = (asset1.description || '').toLowerCase();
    const desc2 = (asset2.description || '').toLowerCase();
    if (desc1.length > 10 && desc2.length > 10) {
      const commonWords = this.findCommonWords(desc1, desc2);
      if (commonWords.length >= 3) {
        reasons.push('Similar descriptions');
        if (confidence === 'low') confidence = 'low';
      }
    }

    return {
      isDuplicate: confidence !== 'low' || reasons.length >= 2,
      confidence,
      reasons,
    };
  }

  /**
   * Calculate string similarity (Levenshtein-based)
   */
  private static calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  /**
   * Calculate Levenshtein distance
   */
  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  /**
   * Find common words between two strings
   */
  private static findCommonWords(str1: string, str2: string): string[] {
    const words1 = str1.split(/\s+/).filter(w => w.length > 3);
    const words2 = str2.split(/\s+/).filter(w => w.length > 3);
    const set2 = new Set(words2);
    return words1.filter(w => set2.has(w));
  }

  /**
   * Find all duplicate pairs in asset list
   */
  static findDuplicates(assets: Asset[]): DuplicateMatch[] {
    const duplicates: DuplicateMatch[] = [];
    const processed = new Set<string>();

    for (let i = 0; i < assets.length; i++) {
      for (let j = i + 1; j < assets.length; j++) {
        const pairKey = `${assets[i].id}-${assets[j].id}`;
        if (processed.has(pairKey)) continue;

        const match = this.areDuplicates(assets[i], assets[j]);
        if (match.isDuplicate) {
          duplicates.push({
            asset1: assets[i],
            asset2: assets[j],
            confidence: match.confidence,
            reasons: match.reasons,
            suggestedMerge: this.suggestMerge(assets[i], assets[j]),
          });
          processed.add(pairKey);
        }
      }
    }

    return duplicates;
  }

  /**
   * Suggest merged asset from two duplicates
   */
  static suggestMerge(asset1: Asset, asset2: Asset): Partial<Asset> {
    // Prefer the more complete asset (more fields filled)
    const asset1Completeness = this.calculateCompleteness(asset1);
    const asset2Completeness = this.calculateCompleteness(asset2);
    const primary = asset1Completeness >= asset2Completeness ? asset1 : asset2;
    const secondary = primary === asset1 ? asset2 : asset1;

    // Merge relationships
    const mergedRelationships = [
      ...(primary.relationships || []),
      ...(secondary.relationships || []).filter(
        rel => !primary.relationships?.some(pRel => pRel.id === rel.id)
      ),
    ];

    // Merge dependencies
    const mergedDependencies = [
      ...(primary.dependencies || []),
      ...(secondary.dependencies || []).filter(
        dep => !primary.dependencies?.some(pDep => pDep.id === dep.id)
      ),
    ];

    // Merge vulnerabilities
    const mergedVulnerabilities = [
      ...(primary.vulnerabilities || []),
      ...(secondary.vulnerabilities || []).filter(
        vuln => !primary.vulnerabilities?.some(pVuln => pVuln.id === vuln.id)
      ),
    ];

    // Merge compliance frameworks
    const mergedFrameworks = [
      ...new Set([...(primary.complianceFrameworks || []), ...(secondary.complianceFrameworks || [])]),
    ];

    return {
      name: primary.name, // Use primary name
      type: primary.type || secondary.type,
      criticality: this.chooseHigherCriticality(primary.criticality, secondary.criticality),
      owner: primary.owner || secondary.owner,
      location: primary.location || secondary.location,
      ipAddress: primary.ipAddress || secondary.ipAddress,
      description: primary.description || secondary.description || this.mergeDescriptions(primary.description, secondary.description),
      dataClassification: primary.dataClassification || secondary.dataClassification,
      dataTypes: [...new Set([...(primary.dataTypes || []), ...(secondary.dataTypes || [])])],
      tags: [...new Set([...(primary.tags || []), ...(secondary.tags || [])])],
      relationships: mergedRelationships,
      dependencies: mergedDependencies,
      vulnerabilities: mergedVulnerabilities,
      complianceFrameworks: mergedFrameworks,
      status: primary.status || secondary.status,
      encryptionStatus: primary.encryptionStatus || secondary.encryptionStatus,
      crossBorderTransfer: primary.crossBorderTransfer || secondary.crossBorderTransfer,
      thirdPartySharing: primary.thirdPartySharing || secondary.thirdPartySharing,
    };
  }

  /**
   * Calculate asset completeness score
   */
  private static calculateCompleteness(asset: Asset): number {
    let score = 0;
    if (asset.name) score += 2;
    if (asset.type) score += 1;
    if (asset.owner) score += 1;
    if (asset.location) score += 1;
    if (asset.description) score += 1;
    if (asset.dataClassification) score += 1;
    if (asset.tags && asset.tags.length > 0) score += 1;
    if (asset.relationships && asset.relationships.length > 0) score += 1;
    if (asset.complianceFrameworks && asset.complianceFrameworks.length > 0) score += 1;
    if (asset.dependencies && asset.dependencies.length > 0) score += 1;
    return score;
  }

  /**
   * Choose higher criticality level
   */
  private static chooseHigherCriticality(
    crit1: Asset['criticality'],
    crit2: Asset['criticality']
  ): Asset['criticality'] {
    const levels: Record<Asset['criticality'], number> = {
      'Critical': 4,
      'High': 3,
      'Medium': 2,
      'Low': 1,
    };
    return levels[crit1] >= levels[crit2] ? crit1 : crit2;
  }

  /**
   * Merge descriptions
   */
  private static mergeDescriptions(desc1?: string, desc2?: string): string {
    if (!desc1 && !desc2) return '';
    if (!desc1) return desc2 || '';
    if (!desc2) return desc1;
    if (desc1 === desc2) return desc1;
    return `${desc1}. ${desc2}`;
  }

  /**
   * Mark asset as imported (vs manually created)
   */
  static markAsImported(asset: Asset): Asset {
    const tags = asset.tags || [];
    if (!tags.includes('imported')) {
      tags.push('imported');
    }
    return { ...asset, tags };
  }

  /**
   * Get canonical asset ID (for tracking merged assets)
   */
  static getCanonicalId(asset: Asset, mergedFrom?: string[]): string {
    // Store merged IDs in tags for tracking
    if (mergedFrom && mergedFrom.length > 0) {
      const tags = asset.tags || [];
      const mergedTag = `merged-from:${mergedFrom.join(',')}`;
      if (!tags.includes(mergedTag)) {
        tags.push(mergedTag);
      }
      return { ...asset, tags }.id;
    }
    return asset.id;
  }
}

