/**
 * Unit Tests for Signal Drift Analyzer
 * 
 * Tests analyzeSignalDrift function covering all drift scenarios.
 * Ensures no forbidden language appears in outputs.
 */

import { describe, it, expect } from 'vitest';
import { analyzeSignalDrift } from '../signalDriftAnalyzer';
import { SignalHistory, SignalSnapshot } from '@/contracts/cyberSoluce.signalHistory.contract';
import { DriftStatus } from '@/contracts/cyberSoluce.drift.contract';

// Forbidden keywords that should never appear in drift insights
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

/**
 * Helper to check if text contains forbidden keywords (case-insensitive)
 */
function containsForbiddenLanguage(text: string): boolean {
  const lowerText = text.toLowerCase();
  return FORBIDDEN_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

/**
 * Helper to create a signal snapshot
 */
function createSnapshot(
  assetId: string,
  capturedAt: string,
  signalTypes: string[],
  source: SignalSnapshot['source'] = 'cybersoluce'
): SignalSnapshot {
  return {
    assetId,
    capturedAt,
    source,
    signals: signalTypes.map((type, idx) => ({
      signalId: `signal-${assetId}-${idx}`,
      signalType: type,
      description: `Test signal ${type}`,
      confidence: 'medium',
      source: 'test',
      timestamp: capturedAt,
      signalDomain: 'test',
      affectedAssetIds: [assetId],
    })),
  };
}

describe('analyzeSignalDrift', () => {
  describe('no-history scenarios', () => {
    it('should return no-history when history is null', () => {
      const result = analyzeSignalDrift(null);

      expect(result.status).toBe('no-history');
      expect(result.windowStart).toBeNull();
      expect(result.windowEnd).toBeNull();
      expect(result.supportingSignals).toHaveLength(1);
      expect(result.supportingSignals[0]).toContain('No historical visibility');
      
      // Check for forbidden language
      result.supportingSignals.forEach(signal => {
        expect(containsForbiddenLanguage(signal)).toBe(false);
      });
    });

    it('should return no-history when snapshots array is empty', () => {
      const history: SignalHistory = {
        assetId: 'asset-1',
        snapshots: [],
      };

      const result = analyzeSignalDrift(history);

      expect(result.status).toBe('no-history');
      expect(result.windowStart).toBeNull();
      expect(result.windowEnd).toBeNull();
      expect(result.supportingSignals.length).toBeGreaterThan(0);
      
      result.supportingSignals.forEach(signal => {
        expect(containsForbiddenLanguage(signal)).toBe(false);
      });
    });

    it('should return no-history when all snapshots are from demo source', () => {
      const history: SignalHistory = {
        assetId: 'asset-1',
        snapshots: [
          createSnapshot('asset-1', '2024-01-01T00:00:00Z', ['signal-a'], 'demo'),
          createSnapshot('asset-1', '2024-01-02T00:00:00Z', ['signal-b'], 'demo'),
        ],
      };

      const result = analyzeSignalDrift(history);

      expect(result.status).toBe('no-history');
      expect(result.supportingSignals.length).toBeGreaterThan(0);
      expect(result.supportingSignals[0]).toContain('real operational data');
    });
  });

  describe('stable-visibility scenarios', () => {
    it('should return stable-visibility for identical signal types across snapshots', () => {
      const history: SignalHistory = {
        assetId: 'asset-1',
        snapshots: [
          createSnapshot('asset-1', '2024-01-01T00:00:00Z', ['signal-a', 'signal-b']),
          createSnapshot('asset-1', '2024-01-02T00:00:00Z', ['signal-a', 'signal-b']),
          createSnapshot('asset-1', '2024-01-03T00:00:00Z', ['signal-a', 'signal-b']),
        ],
      };

      const result = analyzeSignalDrift(history);

      expect(result.status).toBe('stable-visibility');
      expect(result.windowStart).toBe('2024-01-01T00:00:00Z');
      expect(result.windowEnd).toBe('2024-01-03T00:00:00Z');
      expect(result.supportingSignals.length).toBeGreaterThan(0);
      expect(result.supportingSignals[0]).toContain('consistent');
      
      result.supportingSignals.forEach(signal => {
        expect(containsForbiddenLanguage(signal)).toBe(false);
      });
    });

    it('should return stable-visibility when signal types remain consistent with few distinct types', () => {
      const history: SignalHistory = {
        assetId: 'asset-1',
        snapshots: [
          createSnapshot('asset-1', '2024-01-01T00:00:00Z', ['signal-a']),
          createSnapshot('asset-1', '2024-01-02T00:00:00Z', ['signal-a']),
        ],
      };

      const result = analyzeSignalDrift(history);

      expect(result.status).toBe('stable-visibility');
      expect(result.supportingSignals.length).toBeGreaterThan(0);
    });
  });

  describe('emerging-change scenarios', () => {
    it('should return emerging-change when new signal types appear only in later snapshots', () => {
      const history: SignalHistory = {
        assetId: 'asset-1',
        snapshots: [
          createSnapshot('asset-1', '2024-01-01T00:00:00Z', ['signal-a']),
          createSnapshot('asset-1', '2024-01-02T00:00:00Z', ['signal-a', 'signal-b']),
          createSnapshot('asset-1', '2024-01-03T00:00:00Z', ['signal-a', 'signal-b', 'signal-c']),
        ],
      };

      const result = analyzeSignalDrift(history);

      expect(result.status).toBe('emerging-change');
      expect(result.supportingSignals.length).toBeGreaterThan(0);
      expect(result.supportingSignals[0]).toContain('New types');
      
      result.supportingSignals.forEach(signal => {
        expect(containsForbiddenLanguage(signal)).toBe(false);
      });
    });

    it('should return emerging-change when new types appear and uncertainty does not increase', () => {
      const history: SignalHistory = {
        assetId: 'asset-1',
        snapshots: [
          createSnapshot('asset-1', '2024-01-01T00:00:00Z', ['signal-a', 'uncertainty-low']),
          createSnapshot('asset-1', '2024-01-02T00:00:00Z', ['signal-a', 'signal-b', 'uncertainty-low']),
        ],
      };

      const result = analyzeSignalDrift(history);

      expect(result.status).toBe('emerging-change');
      expect(result.supportingSignals.length).toBeGreaterThan(0);
    });
  });

  describe('increasing-uncertainty scenarios', () => {
    it('should return increasing-uncertainty when uncertainty signals increase over time', () => {
      const history: SignalHistory = {
        assetId: 'asset-1',
        snapshots: [
          createSnapshot('asset-1', '2024-01-01T00:00:00Z', ['signal-a']),
          createSnapshot('asset-1', '2024-01-02T00:00:00Z', ['signal-a', 'uncertainty-medium']),
          createSnapshot('asset-1', '2024-01-03T00:00:00Z', ['signal-a', 'uncertainty-medium', 'uncertainty-high']),
        ],
      };

      const result = analyzeSignalDrift(history);

      expect(result.status).toBe('increasing-uncertainty');
      expect(result.supportingSignals.length).toBeGreaterThan(0);
      expect(result.supportingSignals[0]).toContain('Uncertainty');
      
      result.supportingSignals.forEach(signal => {
        expect(containsForbiddenLanguage(signal)).toBe(false);
      });
    });

    it('should return increasing-uncertainty when unknown signals increase', () => {
      const history: SignalHistory = {
        assetId: 'asset-1',
        snapshots: [
          createSnapshot('asset-1', '2024-01-01T00:00:00Z', ['signal-a']),
          createSnapshot('asset-1', '2024-01-02T00:00:00Z', ['signal-a', 'unknown-type']),
        ],
      };

      const result = analyzeSignalDrift(history);

      expect(result.status).toBe('increasing-uncertainty');
      expect(result.supportingSignals.length).toBeGreaterThan(0);
    });
  });

  describe('high-variance scenarios', () => {
    it('should return high-variance when signal types jump around between snapshots', () => {
      const history: SignalHistory = {
        assetId: 'asset-1',
        snapshots: [
          createSnapshot('asset-1', '2024-01-01T00:00:00Z', ['signal-a', 'signal-b']),
          createSnapshot('asset-1', '2024-01-02T00:00:00Z', ['signal-c', 'signal-d']),
          createSnapshot('asset-1', '2024-01-03T00:00:00Z', ['signal-e', 'signal-f']),
          createSnapshot('asset-1', '2024-01-04T00:00:00Z', ['signal-g', 'signal-h']),
        ],
      };

      const result = analyzeSignalDrift(history);

      expect(result.status).toBe('high-variance');
      expect(result.supportingSignals.length).toBeGreaterThan(0);
      expect(result.supportingSignals[0]).toContain('changed significantly');
      
      result.supportingSignals.forEach(signal => {
        expect(containsForbiddenLanguage(signal)).toBe(false);
      });
    });

    it('should return high-variance when multiple diff sets appear', () => {
      const history: SignalHistory = {
        assetId: 'asset-1',
        snapshots: [
          createSnapshot('asset-1', '2024-01-01T00:00:00Z', ['type-1']),
          createSnapshot('asset-1', '2024-01-02T00:00:00Z', ['type-2']),
          createSnapshot('asset-1', '2024-01-03T00:00:00Z', ['type-3']),
          createSnapshot('asset-1', '2024-01-04T00:00:00Z', ['type-4']),
        ],
      };

      const result = analyzeSignalDrift(history);

      expect(result.status).toBe('high-variance');
      expect(result.supportingSignals.length).toBeGreaterThan(0);
    });
  });

  describe('supporting signals requirements', () => {
    it('should always provide at least one meaningful supporting signal line', () => {
      const history: SignalHistory = {
        assetId: 'asset-1',
        snapshots: [
          createSnapshot('asset-1', '2024-01-01T00:00:00Z', ['signal-a']),
        ],
      };

      const result = analyzeSignalDrift(history);

      expect(result.supportingSignals.length).toBeGreaterThan(0);
      expect(result.supportingSignals[0].length).toBeGreaterThan(10); // Meaningful length
    });

    it('should never contain forbidden language in any status', () => {
      const testCases: Array<{ name: string; history: SignalHistory | null }> = [
        {
          name: 'null history',
          history: null,
        },
        {
          name: 'empty history',
          history: { assetId: 'asset-1', snapshots: [] },
        },
        {
          name: 'stable visibility',
          history: {
            assetId: 'asset-1',
            snapshots: [
              createSnapshot('asset-1', '2024-01-01T00:00:00Z', ['signal-a']),
              createSnapshot('asset-1', '2024-01-02T00:00:00Z', ['signal-a']),
            ],
          },
        },
        {
          name: 'emerging change',
          history: {
            assetId: 'asset-1',
            snapshots: [
              createSnapshot('asset-1', '2024-01-01T00:00:00Z', ['signal-a']),
              createSnapshot('asset-1', '2024-01-02T00:00:00Z', ['signal-a', 'signal-b']),
            ],
          },
        },
        {
          name: 'increasing uncertainty',
          history: {
            assetId: 'asset-1',
            snapshots: [
              createSnapshot('asset-1', '2024-01-01T00:00:00Z', ['signal-a']),
              createSnapshot('asset-1', '2024-01-02T00:00:00Z', ['signal-a', 'uncertainty-high']),
            ],
          },
        },
        {
          name: 'high variance',
          history: {
            assetId: 'asset-1',
            snapshots: [
              createSnapshot('asset-1', '2024-01-01T00:00:00Z', ['signal-a']),
              createSnapshot('asset-1', '2024-01-02T00:00:00Z', ['signal-b']),
              createSnapshot('asset-1', '2024-01-03T00:00:00Z', ['signal-c']),
            ],
          },
        },
      ];

      testCases.forEach(({ name, history }) => {
        const result = analyzeSignalDrift(history);
        
        result.supportingSignals.forEach((signal, idx) => {
          expect(
            containsForbiddenLanguage(signal),
            `Test case "${name}" has forbidden language in supporting signal ${idx}: "${signal}"`
          ).toBe(false);
        });
      });
    });
  });
});

