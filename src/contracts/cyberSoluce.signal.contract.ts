/**
 * CyberSoluce Signal Contract
 * 
 * Authoritative data contract for signals exported from CyberSoluce.
 * 
 * RULES:
 * - NO optional "score", "risk", "compliance", "criticality" fields
 * - Only factual + qualitative descriptors
 * - Signals indicate WHERE attention may be needed, not WHAT to do
 * 
 * @internal This contract defines the boundary of what CyberSoluce can export about signals.
 * Products consuming this contract must interpret these signals according to their domain.
 */

export interface CyberSoluceSignalContract {
  /** Unique identifier for the signal */
  signalId: string;
  
  /** Type of signal (factual classification) */
  signalType: 'exposure' | 'dependency' | 'change' | 'uncertainty';
  
  /** Description of the signal (qualitative) */
  description: string;
  
  /** Confidence level in the signal (qualitative descriptor) */
  confidence: 'low' | 'medium' | 'high';
  
  /** Source of the signal (factual) */
  source: 'user' | 'import' | 'inferred';
  
  /** Timestamp when signal was detected (factual) */
  timestamp: string; // ISO 8601 timestamp
  
  /** Domain this signal relates to (factual classification) */
  signalDomain: 'privacy' | 'ransomware' | 'vendor' | 'software' | 'governance';
  
  /** Asset IDs affected by this signal (factual) */
  affectedAssetIds: string[];
  
  /** Concentration description (qualitative) */
  concentrationDescription?: string;
}

/**
 * Asset Signal
 * 
 * Type alias for signals associated with assets.
 * Used for signal history tracking and time-series analysis.
 */
export type AssetSignal = CyberSoluceSignalContract;

/**
 * Helper to convert internal FocusSignal to contract format
 * Strips out any scoring/risk fields
 */
export function toSignalContract(signal: {
  id: string;
  signal_type?: string;
  signal_domain: string;
  description: string;
  concentration_description?: string;
  detected_at: Date | string;
  affected_asset_ids: string[];
}): CyberSoluceSignalContract {
  // Map signal_type to contract signalType
  const mapSignalType = (type?: string): CyberSoluceSignalContract['signalType'] => {
    if (type === 'exposure' || type === 'dependency' || type === 'change' || type === 'uncertainty') {
      return type;
    }
    // Infer from domain if type not provided
    if (signal.signal_domain === 'privacy' || signal.signal_domain === 'ransomware') {
      return 'exposure';
    }
    if (signal.signal_domain === 'vendor' || signal.signal_domain === 'software') {
      return 'dependency';
    }
    return 'uncertainty';
  };

  // Infer confidence from signal characteristics
  const inferConfidence = (): CyberSoluceSignalContract['confidence'] => {
    // If multiple assets affected, higher confidence
    if (signal.affected_asset_ids.length > 5) return 'high';
    if (signal.affected_asset_ids.length > 2) return 'medium';
    return 'low';
  };

  // Infer source (default to inferred for now)
  const inferSource = (): CyberSoluceSignalContract['source'] => {
    return 'inferred';
  };

  return {
    signalId: signal.id,
    signalType: mapSignalType(signal.signal_type),
    description: signal.description,
    confidence: inferConfidence(),
    source: inferSource(),
    timestamp: typeof signal.detected_at === 'string' ? signal.detected_at : signal.detected_at.toISOString(),
    signalDomain: signal.signal_domain as CyberSoluceSignalContract['signalDomain'],
    affectedAssetIds: [...signal.affected_asset_ids],
    concentrationDescription: signal.concentration_description,
  };
}

