/**
 * Tests for TechnoSoluce Import Adapter
 * 
 * Validates signal import functionality, contract validation, and error handling.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { importTechnoSoluceSignals, importTechnoSoluceSignalsFromJson } from '../fromTechnoSoluce';
import { SBOMSignal } from '../../contracts/technoSoluce.sbom.signals';

// Mock the signal history store
const mockRecordSnapshot = vi.fn().mockResolvedValue(undefined);

class MockBackendSignalHistoryStore {
  recordSnapshot = mockRecordSnapshot;
}

const mockStore = new MockBackendSignalHistoryStore();

vi.mock('../../time/signalHistoryStore', () => ({
  signalHistoryStore: mockStore,
  BackendSignalHistoryStore: MockBackendSignalHistoryStore,
}));

vi.mock('../../exports/technoSoluceToCyberSoluce', () => ({
  exportSBOMSignalsToCyberSoluce: (signals: SBOMSignal[]) => {
    return signals.map(signal => ({
      signalId: signal.signalId,
      signalType: signal.signalType,
      description: signal.description,
      confidence: signal.confidence,
      source: signal.source,
      timestamp: signal.timestamp,
      signalDomain: 'software',
      affectedAssetIds: signal.affectedAssetIds,
      concentrationDescription: signal.concentrationDescription,
    }));
  },
}));

describe('importTechnoSoluceSignals', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validSignals: SBOMSignal[] = [
    {
      signalId: 'signal-1',
      signalType: 'software-composition-known',
      description: 'Software composition visibility available',
      confidence: 'high',
      source: 'import',
      timestamp: '2024-01-15T10:30:00Z',
      signalDomain: 'software',
      affectedAssetIds: ['asset-1'],
      concentrationDescription: 'SBOM provides visibility into 45 components',
    },
    {
      signalId: 'signal-2',
      signalType: 'software-composition-partial',
      description: 'Partial software composition visibility',
      confidence: 'medium',
      source: 'import',
      timestamp: '2024-01-15T10:30:00Z',
      signalDomain: 'software',
      affectedAssetIds: ['asset-2'],
      concentrationDescription: 'SBOM provides partial visibility',
    },
  ];

  const validImportData = {
    assetIds: ['asset-1', 'asset-2'],
    signals: validSignals,
    sourceLabel: 'TechnoSoluce Analysis - Repo foo-service',
    timestamp: '2024-01-15T10:30:00Z',
  };

  it('should successfully import valid signals', async () => {
    const result = await importTechnoSoluceSignals(validImportData);

    expect(result.success).toBe(true);
    expect(result.recorded).toBe(2);
    expect(result.errors).toEqual([]);
    expect(mockRecordSnapshot).toHaveBeenCalledTimes(2);
  });

  it('should record signal snapshots for each asset', async () => {
    await importTechnoSoluceSignals(validImportData);

    expect(mockRecordSnapshot).toHaveBeenCalledWith(
      expect.objectContaining({
        assetId: 'asset-1',
        source: 'technosoluce',
        signals: expect.arrayContaining([
          expect.objectContaining({
            signalId: 'signal-1',
            signalType: 'software-composition-known',
          }),
        ]),
      })
    );

    expect(mockRecordSnapshot).toHaveBeenCalledWith(
      expect.objectContaining({
        assetId: 'asset-2',
        source: 'technosoluce',
        signals: expect.arrayContaining([
          expect.objectContaining({
            signalId: 'signal-2',
            signalType: 'software-composition-partial',
          }),
        ]),
      })
    );
  });

  it('should fail when no signals provided', async () => {
    const result = await importTechnoSoluceSignals({
      assetIds: ['asset-1'],
      signals: [],
    });

    expect(result.success).toBe(false);
    expect(result.recorded).toBe(0);
    expect(result.errors).toContain('No signals provided in import data');
  });

  it('should fail when no asset IDs provided', async () => {
    const result = await importTechnoSoluceSignals({
      assetIds: [],
      signals: validSignals,
    });

    expect(result.success).toBe(false);
    expect(result.recorded).toBe(0);
    expect(result.errors).toContain('No asset IDs provided in import data');
  });

  it('should record empty snapshot for asset with no signals', async () => {
    const importData = {
      assetIds: ['asset-1', 'asset-2'],
      signals: [
        {
          ...validSignals[0],
          affectedAssetIds: ['asset-1'], // Only asset-1 has signals
        },
      ],
    };

    const result = await importTechnoSoluceSignals(importData);

    expect(result.success).toBe(true);
    expect(result.recorded).toBe(2);
    
    // Should record empty snapshot for asset-2
    expect(mockRecordSnapshot).toHaveBeenCalledWith(
      expect.objectContaining({
        assetId: 'asset-2',
        source: 'technosoluce',
        signals: [],
      })
    );
  });

  it('should use provided timestamp', async () => {
    const timestamp = '2024-01-20T12:00:00Z';
    await importTechnoSoluceSignals({
      ...validImportData,
      timestamp,
    });

    expect(mockRecordSnapshot).toHaveBeenCalledWith(
      expect.objectContaining({
        capturedAt: timestamp,
      })
    );
  });

  it('should use current timestamp when not provided', async () => {
    const before = new Date().toISOString();
    await importTechnoSoluceSignals({
      assetIds: ['asset-1'],
      signals: [validSignals[0]],
    });
    const after = new Date().toISOString();

    const call = mockRecordSnapshot.mock.calls[0][0];
    const capturedAt = call.capturedAt;
    
    expect(capturedAt).toBeDefined();
    expect(capturedAt >= before).toBe(true);
    expect(capturedAt <= after).toBe(true);
  });

  it('should handle errors when recording snapshots', async () => {
    mockRecordSnapshot.mockRejectedValueOnce(new Error('Storage error'));

    const result = await importTechnoSoluceSignals(validImportData);

    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toContain('Failed to record signals for asset');
  });

  it('should filter signals by affected asset', async () => {
    const signals: SBOMSignal[] = [
      {
        ...validSignals[0],
        affectedAssetIds: ['asset-1'],
      },
      {
        ...validSignals[1],
        affectedAssetIds: ['asset-1', 'asset-2'], // Affects both
      },
    ];

    await importTechnoSoluceSignals({
      assetIds: ['asset-1', 'asset-2'],
      signals,
    });

    // Asset-1 should have 2 signals
    const asset1Call = mockRecordSnapshot.mock.calls.find(
      call => call[0].assetId === 'asset-1'
    );
    expect(asset1Call[0].signals).toHaveLength(2);

    // Asset-2 should have 1 signal
    const asset2Call = mockRecordSnapshot.mock.calls.find(
      call => call[0].assetId === 'asset-2'
    );
    expect(asset2Call[0].signals).toHaveLength(1);
  });
});

describe('importTechnoSoluceSignalsFromJson', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validJson = JSON.stringify({
    assetIds: ['asset-1'],
    signals: [
      {
        signalId: 'signal-1',
        signalType: 'software-composition-known',
        description: 'Software composition visibility available',
        confidence: 'high',
        source: 'import',
        timestamp: '2024-01-15T10:30:00Z',
        signalDomain: 'software',
        affectedAssetIds: ['asset-1'],
        concentrationDescription: 'SBOM provides visibility',
      },
    ],
    sourceLabel: 'TechnoSoluce Analysis',
    timestamp: '2024-01-15T10:30:00Z',
  });

  it('should successfully import from valid JSON', async () => {
    const result = await importTechnoSoluceSignalsFromJson(validJson);

    expect(result.success).toBe(true);
    expect(result.recorded).toBe(1);
    expect(result.errors).toEqual([]);
  });

  it('should fail on invalid JSON', async () => {
    const result = await importTechnoSoluceSignalsFromJson('invalid json');

    expect(result.success).toBe(false);
    expect(result.recorded).toBe(0);
    expect(result.errors[0]).toContain('Failed to parse JSON');
  });

  it('should fail when signals array is missing', async () => {
    const invalidJson = JSON.stringify({
      assetIds: ['asset-1'],
    });

    const result = await importTechnoSoluceSignalsFromJson(invalidJson);

    expect(result.success).toBe(false);
    expect(result.recorded).toBe(0);
    expect(result.errors).toContain('Invalid import format: signals array is required');
  });

  it('should fail when assetIds array is missing', async () => {
    const invalidJson = JSON.stringify({
      signals: [],
    });

    const result = await importTechnoSoluceSignalsFromJson(invalidJson);

    expect(result.success).toBe(false);
    expect(result.recorded).toBe(0);
    expect(result.errors).toContain('Invalid import format: assetIds array is required');
  });

  it('should fail when signals is not an array', async () => {
    const invalidJson = JSON.stringify({
      assetIds: ['asset-1'],
      signals: 'not an array',
    });

    const result = await importTechnoSoluceSignalsFromJson(invalidJson);

    expect(result.success).toBe(false);
    expect(result.recorded).toBe(0);
    expect(result.errors).toContain('Invalid import format: signals array is required');
  });

  it('should fail when assetIds is not an array', async () => {
    const invalidJson = JSON.stringify({
      assetIds: 'not an array',
      signals: [],
    });

    const result = await importTechnoSoluceSignalsFromJson(invalidJson);

    expect(result.success).toBe(false);
    expect(result.recorded).toBe(0);
    expect(result.errors).toContain('Invalid import format: assetIds array is required');
  });
});

