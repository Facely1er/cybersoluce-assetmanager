/**
 * Smoke Tests for VendorSoluce Export
 * 
 * Validates export payload shapes and ensures no forbidden language appears.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportToVendorSoluce } from '../toVendorSoluce';
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

describe('exportToVendorSoluce smoke tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate valid export payload with drift hints per vendor', async () => {
    // Create test assets with vendor relationships
    const assets: Asset[] = [
      {
        id: 'asset-1',
        name: 'AWS Cloud Service',
        type: 'Cloud Service',
        criticality: 'High',
        owner: 'AWS',
        location: 'Cloud',
        description: 'Cloud infrastructure',
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
        thirdPartySharing: true,
        encryptionStatus: 'Encrypted',
        accessControls: [],
        privacyImpactAssessment: null,
        dataBreachHistory: [],
        dependencies: [],
        requirements: [],
      },
      {
        id: 'asset-2',
        name: 'Third Party CRM',
        type: 'Third Party Service',
        criticality: 'Medium',
        owner: 'Salesforce',
        location: 'Cloud',
        description: 'CRM service',
        complianceFrameworks: [],
        riskScore: 40,
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
        thirdPartySharing: true,
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
        signal_type: 'vendor-dependency',
        signal_domain: 'vendor',
        description: 'Vendor dependency detected',
        concentration_description: 'Medium concentration',
        detected_at: new Date('2024-01-01'),
        affected_asset_ids: ['asset-1', 'asset-2'],
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
              signalType: 'vendor-signal',
              description: 'Vendor signal',
              confidence: 'medium',
              source: 'test',
              timestamp: '2024-01-01T00:00:00Z',
              signalDomain: 'vendor',
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
      status: 'emerging-change' as DriftStatus,
      windowStart: '2024-01-01T00:00:00Z',
      windowEnd: '2024-01-01T00:00:00Z',
      supportingSignals: ['New types of signals have appeared in more recent observations.'],
    });

    // Call export function
    const result = await exportToVendorSoluce(assets, dependencies, signals);

    // Assert payload structure
    expect(result).toBeDefined();
    expect(result.manifest).toBeDefined();
    expect(result.assets).toBeDefined();
    expect(Array.isArray(result.assets)).toBe(true);
    expect(result.signals).toBeDefined();
    expect(Array.isArray(result.signals)).toBe(true);

    // Assert drift hints exist and have expected structure
    expect(result.driftHints).toBeDefined();
    expect(Array.isArray(result.driftHints)).toBe(true);
    expect(result.driftHints!.length).toBeGreaterThan(0);

    // Validate each drift hint
    result.driftHints!.forEach(hint => {
      expect(hint.vendorId).toBeDefined();
      expect(typeof hint.vendorId).toBe('string');
      expect(hint.relatedAssetIds).toBeDefined();
      expect(Array.isArray(hint.relatedAssetIds)).toBe(true);
      expect(hint.status).toBeDefined();
      expect(['no-history', 'stable-visibility', 'emerging-change', 'increasing-uncertainty', 'high-variance']).toContain(hint.status);
      expect(hint.summary).toBeDefined();
      expect(typeof hint.summary).toBe('string');
      expect(hint.summary.length).toBeGreaterThan(0);
      expect(hint.details).toBeDefined();
      expect(Array.isArray(hint.details)).toBe(true);

      // Check for forbidden language
      expect(containsForbiddenLanguage(hint.summary)).toBe(false);
      hint.details.forEach(detail => {
        expect(containsForbiddenLanguage(detail)).toBe(false);
      });
    });
  });

  it('should skip vendors with no history for any assets', async () => {
    const assets: Asset[] = [
      {
        id: 'asset-1',
        name: 'Third Party Service',
        type: 'Third Party Service',
        criticality: 'Medium',
        owner: 'Vendor A',
        location: 'Cloud',
        description: 'Service',
        complianceFrameworks: [],
        riskScore: 40,
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
        thirdPartySharing: true,
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

    // Mock no history
    vi.mocked(signalHistoryStore.getHistory).mockResolvedValue(null);
    vi.mocked(analyzeSignalDrift).mockReturnValue({
      assetId: 'asset-1',
      status: 'no-history' as DriftStatus,
      windowStart: null,
      windowEnd: null,
      supportingSignals: ['No historical visibility data available.'],
    });

    const result = await exportToVendorSoluce(assets, dependencies, signals);

    // Vendors with no history should be skipped
    expect(result.driftHints).toBeUndefined();
  });

  it('should not contain forbidden keywords in summary or details', async () => {
    const assets: Asset[] = [
      {
        id: 'asset-1',
        name: 'Third Party Service',
        type: 'Third Party Service',
        criticality: 'Medium',
        owner: 'Vendor A',
        location: 'Cloud',
        description: 'Service',
        complianceFrameworks: [],
        riskScore: 40,
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
        thirdPartySharing: true,
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

    const result = await exportToVendorSoluce(assets, dependencies, signals);

    if (result.driftHints) {
      result.driftHints.forEach(hint => {
        expect(containsForbiddenLanguage(hint.summary)).toBe(false);
        hint.details.forEach(detail => {
          expect(containsForbiddenLanguage(detail)).toBe(false);
        });
      });
    }
  });
});

