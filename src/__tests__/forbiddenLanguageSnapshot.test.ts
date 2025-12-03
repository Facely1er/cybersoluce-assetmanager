/**
 * Language Regression Guard
 * 
 * Snapshot test to ensure narrative builders and summaries never contain forbidden keywords.
 * This is a blunt instrument, but it will catch the inevitable "someone added a nice-sounding
 * phrase that breaks your guardrails".
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analyzeSignalDrift } from '../time/signalDriftAnalyzer';
import { exportToCyberCaution } from '../exports/toCyberCaution';
import { exportToVendorSoluce } from '../exports/toVendorSoluce';
import { exportToERMITSAdvisory } from '../exports/toERMITSAdvisory';
import { SignalHistory, SignalSnapshot } from '../contracts/cyberSoluce.signalHistory.contract';
import { DriftStatus } from '../contracts/cyberSoluce.drift.contract';
import { Asset } from '../types/asset';
import { Dependency } from '../types/dependency';
import { FocusSignal } from '../types/enrichment';
import { InMemorySignalHistoryStore } from '../time/signalHistoryStore';
import { signalHistoryStore } from '../time/signalHistoryStore';

// Forbidden keywords that should never appear in drift insights or narratives
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

/**
 * Helper to create a test asset
 */
function createTestAsset(id: string, overrides?: Partial<Asset>): Asset {
  return {
    id,
    name: `Test Asset ${id}`,
    type: 'Server',
    criticality: 'Medium',
    owner: 'Test Owner',
    location: 'Test Location',
    description: 'Test description',
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
    ...overrides,
  };
}

// Mock the signal history store
vi.mock('../time/signalHistoryStore', async () => {
  const actual = await vi.importActual('../time/signalHistoryStore');
  return {
    ...actual,
    signalHistoryStore: new InMemorySignalHistoryStore(),
  };
});

describe('Language Regression Guard', () => {
  let mockStore: InMemorySignalHistoryStore;

  beforeEach(() => {
    mockStore = new InMemorySignalHistoryStore();
    // Replace the store methods
    vi.spyOn(signalHistoryStore, 'getHistory').mockImplementation(
      (assetId: string, options?) => mockStore.getHistory(assetId, options)
    );
    vi.spyOn(signalHistoryStore, 'recordSnapshot').mockImplementation(
      (snapshot) => mockStore.recordSnapshot(snapshot)
    );
  });

  describe('signalDriftAnalyzer.buildSupportingNarrative', () => {
    it('should not contain forbidden language for all drift statuses', () => {
      const statuses: DriftStatus[] = [
        'no-history',
        'stable-visibility',
        'emerging-change',
        'increasing-uncertainty',
        'high-variance',
      ];

      statuses.forEach(status => {
        const history: SignalHistory = {
          assetId: 'asset-1',
          snapshots: [
            createSnapshot('asset-1', '2024-01-01T00:00:00Z', ['signal-a']),
            createSnapshot('asset-1', '2024-01-02T00:00:00Z', ['signal-b']),
          ],
        };

        const result = analyzeSignalDrift(history);

        // Override status to test each one
        if (status === 'no-history') {
          const noHistoryResult = analyzeSignalDrift(null);
          noHistoryResult.supportingSignals.forEach(signal => {
            expect(containsForbiddenLanguage(signal)).toBe(false);
          });
        } else {
          // Create history that will produce the desired status
          let testHistory: SignalHistory | null = null;
          
          if (status === 'stable-visibility') {
            testHistory = {
              assetId: 'asset-1',
              snapshots: [
                createSnapshot('asset-1', '2024-01-01T00:00:00Z', ['signal-a']),
                createSnapshot('asset-1', '2024-01-02T00:00:00Z', ['signal-a']),
              ],
            };
          } else if (status === 'emerging-change') {
            testHistory = {
              assetId: 'asset-1',
              snapshots: [
                createSnapshot('asset-1', '2024-01-01T00:00:00Z', ['signal-a']),
                createSnapshot('asset-1', '2024-01-02T00:00:00Z', ['signal-a', 'signal-b']),
              ],
            };
          } else if (status === 'increasing-uncertainty') {
            testHistory = {
              assetId: 'asset-1',
              snapshots: [
                createSnapshot('asset-1', '2024-01-01T00:00:00Z', ['signal-a']),
                createSnapshot('asset-1', '2024-01-02T00:00:00Z', ['signal-a', 'uncertainty-high']),
              ],
            };
          } else if (status === 'high-variance') {
            testHistory = {
              assetId: 'asset-1',
              snapshots: [
                createSnapshot('asset-1', '2024-01-01T00:00:00Z', ['signal-a']),
                createSnapshot('asset-1', '2024-01-02T00:00:00Z', ['signal-b']),
                createSnapshot('asset-1', '2024-01-03T00:00:00Z', ['signal-c']),
                createSnapshot('asset-1', '2024-01-04T00:00:00Z', ['signal-d']),
              ],
            };
          }

          if (testHistory) {
            const result = analyzeSignalDrift(testHistory);
            result.supportingSignals.forEach(signal => {
              expect(
                containsForbiddenLanguage(signal),
                `Status "${status}" contains forbidden language: "${signal}"`
              ).toBe(false);
            });
          }
        }
      });
    });
  });

  describe('summarizeDriftStatus (CyberCaution)', () => {
    it('should not contain forbidden language for all drift statuses', async () => {
      const statuses: DriftStatus[] = [
        'no-history',
        'stable-visibility',
        'emerging-change',
        'increasing-uncertainty',
        'high-variance',
      ];

      for (const status of statuses) {
        const asset = createTestAsset('asset-1');
        
        // Create history that will produce the desired status
        if (status !== 'no-history') {
          const snapshots: SignalSnapshot[] = [];
          
          if (status === 'stable-visibility') {
            snapshots.push(
              createSnapshot('asset-1', '2024-01-01T00:00:00Z', ['signal-a']),
              createSnapshot('asset-1', '2024-01-02T00:00:00Z', ['signal-a'])
            );
          } else if (status === 'emerging-change') {
            snapshots.push(
              createSnapshot('asset-1', '2024-01-01T00:00:00Z', ['signal-a']),
              createSnapshot('asset-1', '2024-01-02T00:00:00Z', ['signal-a', 'signal-b'])
            );
          } else if (status === 'increasing-uncertainty') {
            snapshots.push(
              createSnapshot('asset-1', '2024-01-01T00:00:00Z', ['signal-a']),
              createSnapshot('asset-1', '2024-01-02T00:00:00Z', ['signal-a', 'uncertainty-high'])
            );
          } else if (status === 'high-variance') {
            snapshots.push(
              createSnapshot('asset-1', '2024-01-01T00:00:00Z', ['signal-a']),
              createSnapshot('asset-1', '2024-01-02T00:00:00Z', ['signal-b']),
              createSnapshot('asset-1', '2024-01-03T00:00:00Z', ['signal-c']),
              createSnapshot('asset-1', '2024-01-04T00:00:00Z', ['signal-d'])
            );
          }

          for (const snapshot of snapshots) {
            await mockStore.recordSnapshot(snapshot);
          }
        }

        const signals: FocusSignal[] = [
          {
            id: 'signal-1',
            signal_type: 'ransomware-exposure',
            signal_domain: 'ransomware',
            description: 'Test signal',
            concentration_description: 'Test',
            detected_at: new Date('2024-01-01'),
            affected_asset_ids: ['asset-1'],
          },
        ];

        const result = await exportToCyberCaution([asset], [], signals);

        if (result.driftHints && result.driftHints.length > 0) {
          result.driftHints.forEach(hint => {
            expect(
              containsForbiddenLanguage(hint.summary),
              `Status "${status}" summary contains forbidden language: "${hint.summary}"`
            ).toBe(false);
            hint.details.forEach(detail => {
              expect(
                containsForbiddenLanguage(detail),
                `Status "${status}" detail contains forbidden language: "${detail}"`
              ).toBe(false);
            });
          });
        }

      }
    });
  });

  describe('summarizeVendorDrift (VendorSoluce)', () => {
    it('should not contain forbidden language for all drift statuses', async () => {
      const statuses: DriftStatus[] = [
        'stable-visibility',
        'emerging-change',
        'increasing-uncertainty',
        'high-variance',
      ];

      for (const status of statuses) {
        const asset = createTestAsset('asset-1', {
          type: 'Third Party Service',
          owner: 'Test Vendor',
        });

        // Create history
        const snapshots: SignalSnapshot[] = [];
        if (status === 'stable-visibility') {
          snapshots.push(
            createSnapshot('asset-1', '2024-01-01T00:00:00Z', ['signal-a']),
            createSnapshot('asset-1', '2024-01-02T00:00:00Z', ['signal-a'])
          );
        } else if (status === 'emerging-change') {
          snapshots.push(
            createSnapshot('asset-1', '2024-01-01T00:00:00Z', ['signal-a']),
            createSnapshot('asset-1', '2024-01-02T00:00:00Z', ['signal-a', 'signal-b'])
          );
        } else if (status === 'increasing-uncertainty') {
          snapshots.push(
            createSnapshot('asset-1', '2024-01-01T00:00:00Z', ['signal-a']),
            createSnapshot('asset-1', '2024-01-02T00:00:00Z', ['signal-a', 'uncertainty-high'])
          );
        } else if (status === 'high-variance') {
          snapshots.push(
            createSnapshot('asset-1', '2024-01-01T00:00:00Z', ['signal-a']),
            createSnapshot('asset-1', '2024-01-02T00:00:00Z', ['signal-b']),
            createSnapshot('asset-1', '2024-01-03T00:00:00Z', ['signal-c']),
            createSnapshot('asset-1', '2024-01-04T00:00:00Z', ['signal-d'])
          );
        }

        // Clear store and add new snapshots
        mockStore = new InMemorySignalHistoryStore();
        vi.spyOn(signalHistoryStore, 'getHistory').mockImplementation(
          (assetId: string, options?) => mockStore.getHistory(assetId, options)
        );
        vi.spyOn(signalHistoryStore, 'recordSnapshot').mockImplementation(
          (snapshot) => mockStore.recordSnapshot(snapshot)
        );

        for (const snapshot of snapshots) {
          await mockStore.recordSnapshot(snapshot);
        }

        const signals: FocusSignal[] = [
          {
            id: 'signal-1',
            signal_type: 'vendor-dependency',
            signal_domain: 'vendor',
            description: 'Test signal',
            concentration_description: 'Test',
            detected_at: new Date('2024-01-01'),
            affected_asset_ids: ['asset-1'],
          },
        ];

        const result = await exportToVendorSoluce([asset], [], signals);

        if (result.driftHints && result.driftHints.length > 0) {
          result.driftHints.forEach(hint => {
            expect(
              containsForbiddenLanguage(hint.summary),
              `Status "${status}" vendor summary contains forbidden language: "${hint.summary}"`
            ).toBe(false);
            hint.details.forEach(detail => {
              expect(
                containsForbiddenLanguage(detail),
                `Status "${status}" vendor detail contains forbidden language: "${detail}"`
              ).toBe(false);
            });
          });
        }
      }
    });
  });

  describe('buildOrgVisibilityNarrative (ERMITS Advisory)', () => {
    it('should not contain forbidden language in narrative', async () => {

      const assets: Asset[] = [
        createTestAsset('asset-1', {
          name: 'EHR Database',
          type: 'Database',
          tags: ['health'],
        }),
        createTestAsset('asset-2', {
          name: 'Payment Gateway',
          type: 'Application',
          tags: ['billing'],
        }),
      ];

      // Add some history
      await mockStore.recordSnapshot(
        createSnapshot('asset-1', '2024-01-01T00:00:00Z', ['signal-a'])
      );
      await mockStore.recordSnapshot(
        createSnapshot('asset-2', '2024-01-01T00:00:00Z', ['signal-b'])
      );

      const signals: FocusSignal[] = [
        {
          id: 'signal-1',
          signal_type: 'software-composition-known',
          signal_domain: 'governance',
          description: 'SBOM available',
          concentration_description: 'Full',
          detected_at: new Date('2024-01-01'),
          affected_asset_ids: ['asset-1'],
        },
      ];

      const result = await exportToERMITSAdvisory(assets, [], signals);

      // Check narrative
      result.steelVisibilitySnapshot.narrative.forEach((line, idx) => {
        expect(
          containsForbiddenLanguage(line),
          `Narrative line ${idx} contains forbidden language: "${line}"`
        ).toBe(false);
      });

      // Check domain messages
      result.steelVisibilitySnapshot.domains.forEach(domain => {
        domain.keyMessages.forEach((msg, idx) => {
          expect(
            containsForbiddenLanguage(msg),
            `Domain "${domain.domain}" message ${idx} contains forbidden language: "${msg}"`
          ).toBe(false);
        });
      });
    });
  });

  describe('STEEL domain summary builders', () => {
    it('should not contain forbidden language in all domain summaries', async () => {

      const assets: Asset[] = [
        createTestAsset('asset-1', {
          name: 'EHR Database',
          type: 'Database',
          tags: ['health'],
        }),
        createTestAsset('asset-2', {
          name: 'Payment Gateway',
          type: 'Application',
          tags: ['billing'],
        }),
        createTestAsset('asset-3', {
          type: 'Third Party Service',
          owner: 'Vendor A',
        }),
        createTestAsset('asset-4', {
          name: 'Application Server',
          type: 'Server',
        }),
      ];

      // Add history
      for (const asset of assets) {
        await mockStore.recordSnapshot(
          createSnapshot(asset.id, '2024-01-01T00:00:00Z', ['signal-a'])
        );
      }

      const signals: FocusSignal[] = [
        {
          id: 'signal-1',
          signal_type: 'software-composition-known',
          signal_domain: 'governance',
          description: 'SBOM available',
          concentration_description: 'Full',
          detected_at: new Date('2024-01-01'),
          affected_asset_ids: ['asset-1', 'asset-4'],
        },
        {
          id: 'signal-2',
          signal_type: 'vendor-dependency',
          signal_domain: 'vendor',
          description: 'Vendor dependency',
          concentration_description: 'Medium',
          detected_at: new Date('2024-01-01'),
          affected_asset_ids: ['asset-3'],
        },
      ];

      const result = await exportToERMITSAdvisory(assets, [], signals);

      // Verify all 4 domains are present
      expect(result.steelVisibilitySnapshot.domains.length).toBe(4);

      // Check each domain for forbidden language
      result.steelVisibilitySnapshot.domains.forEach(domain => {
        domain.keyMessages.forEach((msg, idx) => {
          expect(
            containsForbiddenLanguage(msg),
            `Domain "${domain.domain}" message ${idx} contains forbidden language: "${msg}"`
          ).toBe(false);
        });
      });
    });
  });
});

