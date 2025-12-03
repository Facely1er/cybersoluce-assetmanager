/**
 * Signal History Store
 * 
 * Pluggable store interface for recording and retrieving signal snapshots over time.
 * 
 * This is deliberately simple and replaceable with a real backend later.
 * No dashboards, no scoring - just time-series facts.
 */

import { SignalSnapshot, SignalHistory } from '@/contracts/cyberSoluce.signalHistory.contract';
import { supabase, isSupabaseEnabled } from '@/lib/supabase';
import { handleSupabaseError } from '@/lib/supabase';

/**
 * Store interface for signal history
 */
export interface SignalHistoryStore {
  /**
   * Record a signal snapshot for an asset
   */
  recordSnapshot(snapshot: SignalSnapshot): Promise<void>;
  
  /**
   * Get signal history for an asset
   * 
   * @param assetId - Asset identifier
   * @param options - Optional filters
   * @param options.limit - Maximum number of snapshots to return (most recent)
   * @param options.since - ISO timestamp - only return snapshots after this time
   */
  getHistory(
    assetId: string,
    options?: { limit?: number; since?: string }
  ): Promise<SignalHistory | null>;
}

/**
 * In-memory implementation of SignalHistoryStore
 * 
 * This is a simple implementation for development/testing.
 * In production, this should be replaced with a persistent backend store.
 */
export class InMemorySignalHistoryStore implements SignalHistoryStore {
  private store = new Map<string, SignalSnapshot[]>();

  async recordSnapshot(snapshot: SignalSnapshot): Promise<void> {
    const list = this.store.get(snapshot.assetId) ?? [];
    list.push(snapshot);
    // Keep snapshots sorted by capturedAt (oldest first)
    list.sort((a, b) => 
      new Date(a.capturedAt).getTime() - new Date(b.capturedAt).getTime()
    );
    this.store.set(snapshot.assetId, list);
  }

  async getHistory(
    assetId: string,
    options?: { limit?: number; since?: string }
  ): Promise<SignalHistory | null> {
    let snapshots = this.store.get(assetId) ?? [];

    // Filter by since timestamp if provided
    if (options?.since) {
      const sinceTime = new Date(options.since).getTime();
      snapshots = snapshots.filter(s => 
        new Date(s.capturedAt).getTime() >= sinceTime
      );
    }

    // Apply limit (most recent snapshots)
    if (options?.limit && snapshots.length > options.limit) {
      snapshots = snapshots.slice(-options.limit);
    }

    if (!snapshots.length) {
      return null;
    }

    return {
      assetId,
      snapshots,
    };
  }
}

/**
 * Extended SignalSnapshot with optional import batch ID
 * Used internally for tracking which import batch created a snapshot
 */
export interface SignalSnapshotWithBatch extends SignalSnapshot {
  importBatchId?: string;
}

/**
 * Backend-backed implementation of SignalHistoryStore
 * 
 * Supabase/Postgres-backed implementation for persistent signal history storage.
 */
export class BackendSignalHistoryStore implements SignalHistoryStore {
  async recordSnapshot(snapshot: SignalSnapshot | SignalSnapshotWithBatch): Promise<void> {
    if (!supabase || !isSupabaseEnabled) {
      throw new Error('BackendSignalHistoryStore requires Supabase to be configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    }

    const snapshotWithBatch = snapshot as SignalSnapshotWithBatch;

    const { error } = await supabase
      .from('signal_history')
      .insert({
        asset_id: snapshot.assetId,
        captured_at: snapshot.capturedAt,
        source: snapshot.source,
        signals_json: snapshot.signals,
        import_batch_id: snapshotWithBatch.importBatchId ?? null,
      });

    if (error) {
      const errorMessage = handleSupabaseError(error);
      throw new Error(`Failed to record signal snapshot: ${errorMessage}`);
    }
  }

  async getHistory(
    assetId: string,
    options?: { limit?: number; since?: string }
  ): Promise<SignalHistory | null> {
    if (!supabase || !isSupabaseEnabled) {
      throw new Error('BackendSignalHistoryStore requires Supabase to be configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    }

    let query = supabase
      .from('signal_history')
      .select('asset_id, captured_at, source, signals_json')
      .eq('asset_id', assetId)
      .order('captured_at', { ascending: true });

    if (options?.since) {
      query = query.gte('captured_at', options.since);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      const errorMessage = handleSupabaseError(error);
      throw new Error(`Failed to get signal history: ${errorMessage}`);
    }

    if (!data || !data.length) {
      return null;
    }

    return {
      assetId,
      snapshots: data.map(row => ({
        assetId: row.asset_id,
        capturedAt: row.captured_at,
        source: row.source as SignalSnapshot['source'],
        signals: row.signals_json as SignalSnapshot['signals'],
      })),
    };
  }
}

/**
 * Factory function to create the appropriate signal history store
 * 
 * Uses VITE_HISTORY_STORE_MODE environment variable to determine which implementation to use.
 * Defaults to 'memory' if not specified.
 */
function createSignalHistoryStore(): SignalHistoryStore {
  const mode = import.meta.env.VITE_HISTORY_STORE_MODE ?? 'memory';
  if (mode === 'backend') {
    return new BackendSignalHistoryStore();
  }
  return new InMemorySignalHistoryStore();
}

/**
 * Default signal history store instance
 * 
 * This can be replaced with a backend implementation in production.
 * Use VITE_HISTORY_STORE_MODE=backend to enable backend mode (will throw until configured).
 */
export const signalHistoryStore: SignalHistoryStore = createSignalHistoryStore();

