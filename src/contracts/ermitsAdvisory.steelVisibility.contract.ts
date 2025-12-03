/**
 * ERMITS Advisory / STEEL Visibility Contract
 * 
 * Contract for STEEL visibility summaries describing how well the organisation
 * understands its assets, software composition, and vendor touchpoints over time.
 * 
 * RULES:
 * - NO risk ratings, posture scores, or compliance conclusions
 * - Only describes visibility, stability, and documentation state
 * - Textual narratives suitable for STEEL reports and advisory deliverables
 * 
 * @internal STEEL visibility summaries describe what we know and how stable that
 * knowledge is, not whether the organisation is 'secure' or 'compliant'.
 */

import { DriftStatus } from './cyberSoluce.drift.contract';

/**
 * STEEL Asset Visibility Summary
 * 
 * Per-asset summary of visibility characteristics for STEEL reporting.
 */
export interface SteelAssetVisibilitySummary {
  /** Asset identifier */
  assetId: string;
  
  /** Optional key role derived from asset name/tags (e.g. 'payment-processing', 'ehr-db') */
  keyRole?: string;
  
  /** Drift status from drift analyzer */
  driftStatus: DriftStatus;
  
  /** True if asset has software-composition-known or software-composition-partial signals */
  hasSBOM: boolean;
  
  /** True if asset participates in vendor dependencies or has vendor-related signals */
  hasVendorLinks: boolean;
}

/**
 * STEEL Domain Visibility Summary
 * 
 * Per-domain visibility messages for STEEL reporting.
 */
export interface SteelDomainVisibilitySummary {
  /** Domain identifier */
  domain: 'privacy' | 'ransomware' | 'vendor' | 'software-supply-chain';
  
  /** Short 1–2 line messages describing visibility in this domain */
  keyMessages: string[];
}

/**
 * STEEL Organisation Visibility Snapshot
 * 
 * Complete snapshot of organisational visibility for STEEL reporting.
 * Contains per-asset summaries, per-domain messages, and overall narrative.
 */
export interface SteelOrgVisibilitySnapshot {
  /** ISO timestamp when snapshot was captured */
  capturedAt: string;
  
  /** Per-asset visibility summaries */
  assets: SteelAssetVisibilitySummary[];
  
  /** Per-domain visibility summaries */
  domains: SteelDomainVisibilitySummary[];
  
  /** 5–10 bullet-level lines suitable for STEEL report inserts */
  narrative: string[];
}

