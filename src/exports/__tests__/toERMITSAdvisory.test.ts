/**
 * Smoke Tests for ERMITS Advisory Export
 * 
 * Validates export payload shapes and ensures no forbidden language appears.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportToERMITSAdvisory } from '../toERMITSAdvisory';
import { signalHistoryStore } from '../../time/signalHistoryStore';
import { analyzeSignalDrift } from '../../time/signalDriftAnalyzer';
import { Asset } from '../../types/asset';
import { Dependency } from '../../types/dependency';
import { FocusSignal } from '../../types/enrichment';
import { SignalHistory } from '../../contracts/cyberSoluce.signalHistory.contract';
import { DriftStatus } from '../../contracts/cyberSoluce.drift.contract';

// Forbidden keywords
const FORBIDDEN_KEYWORDS = [
  'risk',
  'posture',
  'compliant',
  'non-compliant',
  'secure',
  'insecure',
  'trend',
  'score',
];

function containsForbiddenLanguage(text: string): boolean {
  const lowerText = text.toLowerCase();
  return FORBIDDEN_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

// Mock the signal history store and drift analyzer
vi.mock('../../time/signalHistoryStore', () => ({
  signalHistoryStore: {
    getHistory: vi.fn(),
  },
}));

vi.mock('../../time/signalDriftAnalyzer', () => ({
  analyzeSignalDrift: vi.fn(),
}));

describe('exportToERMITSAdvisory smoke tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate valid export payload with STEEL visibility snapshot', async () => {
    // Create test assets
    const assets: Asset[] = [
      {
        id: 'asset-1',
        name: 'EHR Database',
        type: 'Database',
        criticality: 'High',
        owner: 'IT Team',
        location: 'Data Center',
        description: 'Electronic health records',
        complianceFrameworks: ['HIPAA'],
        riskScore: 50,
        lastAssessed: new Date('2024-01-01'),
        tags: ['health', 'clinical'],
        relationships: [],
        vulnerabilities: [],
        status: 'Active',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        dataClassification: 'Confidential',
        dataTypes: ['PHI'],
        legalBasis: [],
        dataSubjectRights: [],
        crossBorderTransfer: false,
        thirdPartySharing: false,
        encryptionStatus: 'Encrypted',
        accessControls: [],
        privacyImpactAssessment: null,
        dataBreachHistory: [],
        dependencies: [],
        requirements: [],
      },
      {
        id: 'asset-2',
        name: 'Payment Gateway',
        type: 'Application',
        criticality: 'High',
        owner: 'Finance Team',
        location: 'Cloud',
        description: 'Payment processing',
        complianceFrameworks: ['PCI-DSS'],
        riskScore: 60,
        lastAssessed: new Date('2024-01-01'),
        tags: ['billing', 'payment'],
        relationships: [],
        vulnerabilities: [],
        status: 'Active',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        dataClassification: 'Restricted',
        dataTypes: ['Financial'],
        legalBasis: [],
        dataSubjectRights: [],
        crossBorderTransfer: false,
        thirdPartySharing: false,
        encryptionStatus: 'Encrypted',
        accessControls: [],
        privacyImpactAssessment: null,
        dataBreachHistory: [],
        dependencies: [],
        requirements: [],
      },
    ];

    const dependencies: Dependency[] = [];
    const signals: FocusSignal[] = [
      {
        id: 'signal-1',
        signal_type: 'software-composition-known',
        signal_domain: 'governance',
        description: 'SBOM available',
        concentration_description: 'Full composition',
        detected_at: new Date('2024-01-01'),
        affected_asset_ids: ['asset-1'],
      },
      {
        id: 'signal-2',
        signal_type: 'vendor-dependency',
        signal_domain: 'vendor',
        description: 'Vendor dependency',
        concentration_description: 'Medium',
        detected_at: new Date('2024-01-01'),
        affected_asset_ids: ['asset-2'],
      },
    ];

    // Mock history and drift analysis
    const mockHistory: SignalHistory = {
      assetId: 'asset-1',
      snapshots: [
        {
          assetId: 'asset-1',
          capturedAt: '2024-01-01T00:00:00Z',
          source: 'cybersoluce',
          signals: [
            {
              signalId: 'sig-1',
              signalType: 'signal-a',
              description: 'Test signal',
              confidence: 'medium',
              source: 'test',
              timestamp: '2024-01-01T00:00:00Z',
              signalDomain: 'governance',
              affectedAssetIds: ['asset-1'],
            },
          ],
        },
      ],
    };

    vi.mocked(signalHistoryStore.getHistory).mockImplementation(async (assetId: string) => {
      if (assetId === 'asset-1' || assetId === 'asset-2') {
        return {
          ...mockHistory,
          assetId,
        };
      }
      return null;
    });

    vi.mocked(analyzeSignalDrift).mockReturnValue({
      assetId: 'asset-1',
      status: 'stable-visibility' as DriftStatus,
      windowStart: '2024-01-01T00:00:00Z',
      windowEnd: '2024-01-01T00:00:00Z',
      supportingSignals: ['Signal types have remained broadly consistent across observations.'],
    });

    // Call export function
    const result = await exportToERMITSAdvisory(assets, dependencies, signals);

    // Assert payload structure
    expect(result).toBeDefined();
    expect(result.manifest).toBeDefined();
    expect(result.assets).toBeDefined();
    expect(Array.isArray(result.assets)).toBe(true);
    expect(result.signals).toBeDefined();
    expect(Array.isArray(result.signals)).toBe(true);

    // Assert STEEL visibility snapshot exists
    expect(result.steelVisibilitySnapshot).toBeDefined();
    expect(result.steelVisibilitySnapshot.capturedAt).toBeDefined();
    expect(typeof result.steelVisibilitySnapshot.capturedAt).toBe('string');

    // Assert assets inside snapshot
    expect(result.steelVisibilitySnapshot.assets).toBeDefined();
    expect(Array.isArray(result.steelVisibilitySnapshot.assets)).toBe(true);
    expect(result.steelVisibilitySnapshot.assets.length).toBeGreaterThan(0);

    // Validate asset summaries
    result.steelVisibilitySnapshot.assets.forEach(asset => {
      expect(asset.assetId).toBeDefined();
      expect(asset.driftStatus).toBeDefined();
      expect(typeof asset.hasSBOM).toBe('boolean');
      expect(typeof asset.hasVendorLinks).toBe('boolean');
    });

    // Assert domains contains entries for the 4 domains
    expect(result.steelVisibilitySnapshot.domains).toBeDefined();
    expect(Array.isArray(result.steelVisibilitySnapshot.domains)).toBe(true);
    expect(result.steelVisibilitySnapshot.domains.length).toBe(4);

    const domainNames = result.steelVisibilitySnapshot.domains.map(d => d.domain);
    expect(domainNames).toContain('privacy');
    expect(domainNames).toContain('ransomware');
    expect(domainNames).toContain('vendor');
    expect(domainNames).toContain('software-supply-chain');

    // Validate domain summaries
    result.steelVisibilitySnapshot.domains.forEach(domain => {
      expect(domain.domain).toBeDefined();
      expect(domain.keyMessages).toBeDefined();
      expect(Array.isArray(domain.keyMessages)).toBe(true);
      domain.keyMessages.forEach(msg => {
        expect(typeof msg).toBe('string');
        expect(msg.length).toBeGreaterThan(0);
        expect(containsForbiddenLanguage(msg)).toBe(false);
      });
    });

    // Assert narrative has at least 5 lines, all plain text
    expect(result.steelVisibilitySnapshot.narrative).toBeDefined();
    expect(Array.isArray(result.steelVisibilitySnapshot.narrative)).toBe(true);
    expect(result.steelVisibilitySnapshot.narrative.length).toBeGreaterThanOrEqual(5);

    result.steelVisibilitySnapshot.narrative.forEach(line => {
      expect(typeof line).toBe('string');
      expect(line.length).toBeGreaterThan(0);
      expect(containsForbiddenLanguage(line)).toBe(false);
    });
  });

  it('should not contain forbidden keywords in narrative or domain messages', async () => {
    const assets: Asset[] = [
      {
        id: 'asset-1',
        name: 'Test Asset',
        type: 'Server',
        criticality: 'Medium',
        owner: 'IT Team',
        location: 'Data Center',
        description: 'Test server',
        complianceFrameworks: [],
        riskScore: 50,
        lastAssessed: new Date('2024-01-01'),
        tags: [],
        relationships: [],
        vulnerabilities: [],
        status: 'Active',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        dataClassification: 'Internal',
        dataTypes: [],
        legalBasis: [],
        dataSubjectRights: [],
        crossBorderTransfer: false,
        thirdPartySharing: false,
        encryptionStatus: 'Encrypted',
        accessControls: [],
        privacyImpactAssessment: null,
        dataBreachHistory: [],
        dependencies: [],
        requirements: [],
      },
    ];

    const dependencies: Dependency[] = [];
    const signals: FocusSignal[] = [];

    const mockHistory: SignalHistory = {
      assetId: 'asset-1',
      snapshots: [
        {
          assetId: 'asset-1',
          capturedAt: '2024-01-01T00:00:00Z',
          source: 'cybersoluce',
          signals: [],
        },
      ],
    };

    vi.mocked(signalHistoryStore.getHistory).mockResolvedValue(mockHistory);
    vi.mocked(analyzeSignalDrift).mockReturnValue({
      assetId: 'asset-1',
      status: 'stable-visibility' as DriftStatus,
      windowStart: '2024-01-01T00:00:00Z',
      windowEnd: '2024-01-01T00:00:00Z',
      supportingSignals: ['Signal types have remained broadly consistent across observations.'],
    });

    const result = await exportToERMITSAdvisory(assets, dependencies, signals);

    // Check narrative
    result.steelVisibilitySnapshot.narrative.forEach(line => {
      expect(containsForbiddenLanguage(line)).toBe(false);
    });

    // Check domain messages
    result.steelVisibilitySnapshot.domains.forEach(domain => {
      domain.keyMessages.forEach(msg => {
        expect(containsForbiddenLanguage(msg)).toBe(false);
      });
    });
  });
});

