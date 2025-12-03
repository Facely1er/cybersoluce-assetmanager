/**
 * Internal Enrichment Types
 * 
 * NOTE:
 * Asset enrichment produces indicative focus signals.
 * It must not:
 * - Assert completeness
 * - Present risk posture
 * - Replace expert analysis
 */

import { Asset } from './asset';

/**
 * Internal enrichment overlay data (not exposed in UI)
 */
export interface AssetEnrichment {
  // Enrichment overlays
  privacy_relevance: boolean;
  ransomware_relevance: boolean;
  vendor_dependency: 'none' | 'partial' | 'heavy';
  software_dependency: 'low' | 'medium' | 'high';
  
  // Internal tracking
  source_type: 'imported' | 'manual' | 'inferred';
  last_updated: Date;
  confidence_level: 'low' | 'medium' | 'high';
}

/**
 * Focus signal (qualitative, non-numeric)
 */
export interface FocusSignal {
  id: string;
  signal_type: string;
  affected_asset_ids: string[];
  signal_domain: 'privacy' | 'ransomware' | 'vendor' | 'software' | 'governance';
  description: string;
  concentration_description: string; // Qualitative description of concentration
  detected_at: Date;
}

/**
 * Normalized asset fields for internal processing
 */
export interface NormalizedAssetFields {
  asset_type: string;
  owner: string;
  business_function?: string;
  vendor?: string;
  data_sensitivity?: 'Public' | 'Internal' | 'Confidential' | 'Restricted' | 'Top Secret';
  relationship_direction?: 'inbound' | 'outbound' | 'bidirectional' | 'none';
}

/**
 * Asset with internal enrichment (not exposed to users)
 */
export interface EnrichedAsset extends Asset {
  _enrichment?: AssetEnrichment;
  _normalized?: NormalizedAssetFields;
}

