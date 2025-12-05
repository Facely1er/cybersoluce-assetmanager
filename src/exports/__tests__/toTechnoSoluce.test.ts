/**
 * Tests for TechnoSoluce Export Adapter
 * 
 * Validates export payload shapes, field filtering, and ensures no forbidden language appears.
 */

import { describe, it, expect } from 'vitest';
import { exportToTechnoSoluce } from '../toTechnoSoluce';
import { Asset } from '../../types/asset';
import { Dependency } from '../../types/dependency';
import { FocusSignal } from '../../types/enrichment';

// Forbidden keywords that should never appear in exports
const FORBIDDEN_KEYWORDS = [
  'risk',
  'posture',
  'compliant',
  'non-compliant',
  'secure',
  'insecure',
  'trend',
  'score',
  'cve',
  'vulnerability',
  'severity',
  'exploit',
];

function containsForbiddenLanguage(text: string): boolean {
  const lowerText = text.toLowerCase();
  return FORBIDDEN_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

function checkObjectForForbiddenLanguage(obj: any, path = ''): string[] {
  const violations: string[] = [];
  
  if (typeof obj === 'string') {
    if (containsForbiddenLanguage(obj)) {
      violations.push(`${path}: "${obj}"`);
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      violations.push(...checkObjectForForbiddenLanguage(item, `${path}[${index}]`));
    });
  } else if (obj && typeof obj === 'object') {
    Object.keys(obj).forEach(key => {
      const newPath = path ? `${path}.${key}` : key;
      violations.push(...checkObjectForForbiddenLanguage(obj[key], newPath));
    });
  }
  
  return violations;
}

describe('exportToTechnoSoluce', () => {
  const mockAssets: Asset[] = [
    {
      id: 'asset-1',
      name: 'Payment API',
      type: 'API',
      owner: 'Engineering Team',
      location: 'AWS us-east-1',
      description: 'Payment processing API',
      status: 'active',
      tags: ['critical', 'payment'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
      lastAssessed: '2024-01-15T00:00:00Z',
    },
    {
      id: 'asset-2',
      name: 'User Database',
      type: 'Database',
      owner: 'Data Team',
      location: 'AWS us-east-1',
      description: 'User profile database',
      status: 'active',
      tags: ['user-data'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
      lastAssessed: '2024-01-15T00:00:00Z',
    },
    {
      id: 'asset-3',
      name: 'Marketing Website',
      type: 'Website',
      owner: 'Marketing Team',
      location: 'Cloudflare',
      description: 'Public marketing site',
      status: 'active',
      tags: ['public'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
      lastAssessed: '2024-01-15T00:00:00Z',
    },
  ];

  const mockDependencies: Dependency[] = [
    {
      id: 'dep-1',
      sourceId: 'asset-1',
      targetId: 'asset-2',
      type: 'Depends On',
      strength: 'critical',
      purpose: 'Data storage',
      description: 'API depends on database',
    },
    {
      id: 'dep-2',
      sourceId: 'asset-1',
      targetId: 'asset-3',
      type: 'Connects To',
      strength: 'low',
      purpose: 'Data sync',
      description: 'API connects to website',
    },
  ];

  const mockSignals: FocusSignal[] = [
    {
      id: 'signal-1',
      signal_type: 'software_composition_known',
      signal_domain: 'software',
      affected_asset_ids: ['asset-1'],
      description: 'Software composition visibility available',
      confidence: 'high',
      source: 'import',
      detected_at: new Date('2024-01-15T00:00:00Z'),
      concentration_description: 'SBOM provides visibility into 45 components',
    },
    {
      id: 'signal-2',
      signal_type: 'dependency_opacity',
      signal_domain: 'privacy',
      affected_asset_ids: ['asset-2'],
      description: 'Privacy-related signal',
      confidence: 'medium',
      source: 'user',
      detected_at: new Date('2024-01-15T00:00:00Z'),
      concentration_description: 'Privacy concern',
    },
  ];

  it('should generate valid export payload', () => {
    const result = exportToTechnoSoluce(mockAssets, mockDependencies, mockSignals);

    expect(result).toBeDefined();
    expect(result.manifest).toBeDefined();
    expect(result.assets).toBeDefined();
    expect(result.dependencies).toBeDefined();
    expect(result.signals).toBeDefined();
  });

  it('should include manifest with correct metadata', () => {
    const result = exportToTechnoSoluce(mockAssets, mockDependencies, mockSignals);

    expect(result.manifest.targetProduct).toBe('TechnoSoluce');
    expect(result.manifest.handoffIntent).toBe('software-component-analysis');
    expect(result.manifest.nextQuestionPrompt).toBe('What software components and versions are in your critical applications?');
    expect(result.manifest.assetCount).toBeGreaterThan(0);
    expect(result.manifest.dependencyCount).toBeGreaterThan(0);
    expect(result.manifest.signalCount).toBeGreaterThan(0);
  });

  it('should filter to software-relevant assets only', () => {
    const result = exportToTechnoSoluce(mockAssets, mockDependencies, mockSignals);

    // Should include API and Database (software-relevant)
    const assetIds = result.assets.map(a => a.assetId);
    expect(assetIds).toContain('asset-1'); // API
    expect(assetIds).toContain('asset-2'); // Database
    
    // Should NOT include Website (not software-relevant)
    expect(assetIds).not.toContain('asset-3'); // Website
  });

  it('should filter to software domain signals only', () => {
    const result = exportToTechnoSoluce(mockAssets, mockDependencies, mockSignals);

    // Should include software domain signal
    const softwareSignals = result.signals.filter(s => s.signalDomain === 'software');
    expect(softwareSignals.length).toBeGreaterThan(0);
    
    // Should NOT include privacy domain signals
    const privacySignals = result.signals.filter(s => s.signalDomain === 'privacy');
    expect(privacySignals.length).toBe(0);
  });

  it('should filter to technical dependencies only', () => {
    const result = exportToTechnoSoluce(mockAssets, mockDependencies, mockSignals);

    // Should include technical dependencies
    const depTypes = result.dependencies.map(d => d.relationshipType);
    expect(depTypes).toContain('Depends On');
    expect(depTypes).toContain('Connects To');
  });

  it('should only include allowed asset fields', () => {
    const result = exportToTechnoSoluce(mockAssets, mockDependencies, mockSignals);

    const allowedFields = [
      'assetId',
      'name',
      'type',
      'owner',
      'location',
      'description',
      'status',
      'tags',
      'createdAt',
      'updatedAt',
      'lastAssessed',
    ];

    result.assets.forEach(asset => {
      Object.keys(asset).forEach(key => {
        expect(allowedFields).toContain(key);
      });
    });
  });

  it('should exclude forbidden asset fields', () => {
    const result = exportToTechnoSoluce(mockAssets, mockDependencies, mockSignals);

    const forbiddenFields = [
      'ipAddress',
      'dataClassification',
      'dataTypes',
      'legalBasis',
      'dataSubjectRights',
      'retentionPeriod',
      'crossBorderTransfer',
      'thirdPartySharing',
      'encryptionStatus',
      'complianceFrameworks',
      'dataFlowDirection',
      'isPersonalData',
    ];

    result.assets.forEach(asset => {
      forbiddenFields.forEach(field => {
        expect(asset).not.toHaveProperty(field);
      });
    });
  });

  it('should only include allowed signal fields', () => {
    const result = exportToTechnoSoluce(mockAssets, mockDependencies, mockSignals);

    const allowedFields = [
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

    result.signals.forEach(signal => {
      Object.keys(signal).forEach(key => {
        expect(allowedFields).toContain(key);
      });
    });
  });

  it('should not contain forbidden language in export', () => {
    const result = exportToTechnoSoluce(mockAssets, mockDependencies, mockSignals);

    const violations = checkObjectForForbiddenLanguage(result);
    expect(violations).toEqual([]);
  });

  it('should handle empty assets array', () => {
    const result = exportToTechnoSoluce([], mockDependencies, mockSignals);

    expect(result.assets).toEqual([]);
    expect(result.manifest.assetCount).toBe(0);
  });

  it('should handle empty dependencies array', () => {
    const result = exportToTechnoSoluce(mockAssets, [], mockSignals);

    expect(result.dependencies).toEqual([]);
    expect(result.manifest.dependencyCount).toBe(0);
  });

  it('should handle empty signals array', () => {
    const result = exportToTechnoSoluce(mockAssets, mockDependencies, []);

    expect(result.signals).toEqual([]);
    expect(result.manifest.signalCount).toBe(0);
  });

  it('should include assets referenced by software signals', () => {
    const signalsWithAsset: FocusSignal[] = [
      {
        id: 'signal-3',
        signal_type: 'software_composition_known',
        signal_domain: 'software',
        affected_asset_ids: ['asset-3'], // Website - not normally included
        description: 'Software composition available',
        confidence: 'high',
        source: 'import',
        detected_at: new Date('2024-01-15T00:00:00Z'),
        concentration_description: 'SBOM available',
      },
    ];

    const result = exportToTechnoSoluce(mockAssets, mockDependencies, signalsWithAsset);

    // Asset-3 should be included because it's referenced by a software signal
    const assetIds = result.assets.map(a => a.assetId);
    expect(assetIds).toContain('asset-3');
  });

  it('should include assets involved in technical dependencies', () => {
    const dependencies: Dependency[] = [
      {
        id: 'dep-3',
        sourceId: 'asset-3', // Website
        targetId: 'asset-1', // API
        type: 'Depends On',
        strength: 'critical',
        purpose: 'API integration',
        description: 'Website depends on API',
      },
    ];

    const result = exportToTechnoSoluce(mockAssets, dependencies, mockSignals);

    // Both assets should be included because they're in a technical dependency
    const assetIds = result.assets.map(a => a.assetId);
    expect(assetIds).toContain('asset-1');
    expect(assetIds).toContain('asset-3');
  });

  it('should create valid JSON export structure', () => {
    const result = exportToTechnoSoluce(mockAssets, mockDependencies, mockSignals);

    // Should be JSON serializable
    const json = JSON.stringify(result);
    expect(json).toBeDefined();
    
    // Should be parseable
    const parsed = JSON.parse(json);
    expect(parsed.manifest).toBeDefined();
    expect(parsed.assets).toBeDefined();
    expect(parsed.dependencies).toBeDefined();
    expect(parsed.signals).toBeDefined();
  });
});

