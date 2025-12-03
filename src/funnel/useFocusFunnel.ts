/**
 * Focus Funnel Hook
 * 
 * Funnel logic that uses contract outputs only.
 * 
 * RULES:
 * - Funnel must consume contract outputs only
 * - No direct asset object access
 * - Funnel decision = signalType + user intent
 * - Output = destination product + rationale text
 * 
 * @internal This hook enforces the data contract boundary in funnel logic.
 */

import { useMemo } from 'react';
import { CyberSoluceSignalContract } from '../contracts/cyberSoluce.signal.contract';
import { toSignalContract } from '../contracts/cyberSoluce.signal.contract';
import { FocusSignal } from '../types/enrichment';

/**
 * Destination product for funnel routing
 */
export type FunnelDestination = 
  | 'CyberCorrect' 
  | 'CyberCaution' 
  | 'VendorSoluce' 
  | 'TechnoSoluce' 
  | 'ERMITSAdvisory';

/**
 * Funnel decision result
 */
export interface FunnelDecision {
  /** Destination product */
  destination: FunnelDestination;
  
  /** Rationale text explaining why this destination was chosen */
  rationale: string;
  
  /** Signal domain that triggered this decision */
  signalDomain: CyberSoluceSignalContract['signalDomain'];
  
  /** Signal type that triggered this decision */
  signalType: CyberSoluceSignalContract['signalType'];
  
  /** Number of signals contributing to this decision */
  signalCount: number;
  
  /** Affected asset IDs */
  affectedAssetIds: string[];
  
  /** Handoff intent for the destination product */
  handoffIntent: string;
  
  /** Next question prompt for UX */
  nextQuestionPrompt: string;
}

/**
 * User intent (can be inferred from signals or explicitly provided)
 */
export type UserIntent = 
  | 'privacy-concern'
  | 'threat-readiness'
  | 'vendor-management'
  | 'software-analysis'
  | 'governance-review'
  | 'unknown';

/**
 * Map signal domain to destination product
 */
function mapDomainToDestination(
  domain: CyberSoluceSignalContract['signalDomain']
): FunnelDestination {
  const mapping: Record<CyberSoluceSignalContract['signalDomain'], FunnelDestination> = {
    privacy: 'CyberCorrect',
    ransomware: 'CyberCaution',
    vendor: 'VendorSoluce',
    software: 'TechnoSoluce',
    governance: 'ERMITSAdvisory',
  };
  
  return mapping[domain];
}

/**
 * Generate handoff intent based on signal domain and type
 */
function generateHandoffIntent(
  domain: CyberSoluceSignalContract['signalDomain'],
  signalType: CyberSoluceSignalContract['signalType']
): string {
  const intents: Record<string, Record<string, string>> = {
    privacy: {
      exposure: 'privacy-impact-analysis',
      dependency: 'privacy-dependency-mapping',
      change: 'privacy-change-assessment',
      uncertainty: 'privacy-gap-identification',
    },
    ransomware: {
      exposure: 'threat-scenario-analysis',
      dependency: 'attack-path-mapping',
      change: 'threat-surface-change',
      uncertainty: 'readiness-gap-identification',
    },
    vendor: {
      exposure: 'third-party-dependency-analysis',
      dependency: 'vendor-relationship-mapping',
      change: 'vendor-change-impact',
      uncertainty: 'vendor-risk-identification',
    },
    software: {
      exposure: 'software-component-analysis',
      dependency: 'component-dependency-mapping',
      change: 'software-change-impact',
      uncertainty: 'component-risk-identification',
    },
    governance: {
      exposure: 'governance-compliance-advisory',
      dependency: 'governance-structure-mapping',
      change: 'governance-change-impact',
      uncertainty: 'governance-gap-identification',
    },
  };
  
  return intents[domain]?.[signalType] || `${domain}-analysis`;
}

/**
 * Generate next question prompt based on destination
 */
function generateNextQuestionPrompt(destination: FunnelDestination): string {
  const prompts: Record<FunnelDestination, string> = {
    CyberCorrect: 'Do personal or customer data flow through these assets?',
    CyberCaution: 'What are the critical paths an attacker could take through your infrastructure?',
    VendorSoluce: 'Which vendors have access to your critical business functions?',
    TechnoSoluce: 'What software components and versions are in your critical applications?',
    ERMITSAdvisory: 'What governance gaps exist in your asset management and compliance coverage?',
  };
  
  return prompts[destination];
}

/**
 * Generate rationale text for funnel decision
 */
function generateRationale(
  domain: CyberSoluceSignalContract['signalDomain'],
  signalType: CyberSoluceSignalContract['signalType'],
  signalCount: number,
  affectedAssetCount: number
): string {
  const domainDescriptions: Record<CyberSoluceSignalContract['signalDomain'], string> = {
    privacy: 'Privacy-related signals detected',
    ransomware: 'Ransomware exposure signals detected',
    vendor: 'Vendor dependency signals detected',
    software: 'Software concentration signals detected',
    governance: 'Governance ambiguity signals detected',
  };
  
  const typeDescriptions: Record<CyberSoluceSignalContract['signalType'], string> = {
    exposure: 'indicating potential exposure areas',
    dependency: 'indicating dependency patterns',
    change: 'indicating recent changes',
    uncertainty: 'indicating areas requiring clarification',
  };
  
  return `${domainDescriptions[domain]} (${signalCount} signal${signalCount !== 1 ? 's' : ''}) ${typeDescriptions[signalType]}, affecting ${affectedAssetCount} asset${affectedAssetCount !== 1 ? 's' : ''}.`;
}


/**
 * Focus Funnel Hook Options
 */
export interface UseFocusFunnelOptions {
  /** Optional explicit user intent (if not provided, inferred from signals) */
  userIntent?: UserIntent;
  
  /** Mode: 'live' for production, 'demo' for demo mode (no API calls, no persistence) */
  mode?: 'live' | 'demo';
}

/**
 * Focus Funnel Hook
 * 
 * Processes signals through contract layer and determines routing decisions.
 * 
 * @param signals - Array of FocusSignal (will be converted to contracts)
 * @param userIntentOrOptions - Optional explicit user intent, or options object with userIntent and mode
 * @returns Array of funnel decisions, one per signal domain
 */
export function useFocusFunnel(
  signals: FocusSignal[],
  userIntentOrOptions?: UserIntent | UseFocusFunnelOptions
): FunnelDecision[] {
  // Handle both old signature (userIntent) and new signature (options)
  const options: UseFocusFunnelOptions = typeof userIntentOrOptions === 'string' 
    ? { userIntent: userIntentOrOptions, mode: 'live' }
    : userIntentOrOptions || { mode: 'live' };
  
  const { userIntent, mode = 'live' } = options;
  
  // In demo mode, ensure no API calls or persistence
  // Demo mode: use only passed-in signals, no external calls
  // This is already the behavior, but we make it explicit
  void mode; // Explicitly mark mode as used (for future API call prevention)
  void userIntent; // Reserved for future use in decision logic
  
  return useMemo(() => {
    // Convert signals to contracts (enforcing boundary)
    const contractSignals: CyberSoluceSignalContract[] = signals.map(signal => 
      toSignalContract(signal)
    );
    
    // Group signals by domain
    const signalsByDomain = contractSignals.reduce((acc, signal) => {
      if (!acc[signal.signalDomain]) {
        acc[signal.signalDomain] = [];
      }
      acc[signal.signalDomain].push(signal);
      return acc;
    }, {} as Record<CyberSoluceSignalContract['signalDomain'], CyberSoluceSignalContract[]>);
    
    // Generate decisions for each domain
    const decisions: FunnelDecision[] = Object.entries(signalsByDomain).map(([domain, domainSignals]) => {
      const signalDomain = domain as CyberSoluceSignalContract['signalDomain'];
      
      // Use the most common signal type in this domain
      const signalTypeCounts = domainSignals.reduce((acc, signal) => {
        acc[signal.signalType] = (acc[signal.signalType] || 0) + 1;
        return acc;
      }, {} as Record<CyberSoluceSignalContract['signalType'], number>);
      
      const primarySignalType = Object.entries(signalTypeCounts).reduce((max, [type, count]) => {
        const typeKey = type as CyberSoluceSignalContract['signalType'];
        const countValue = typeof count === 'number' ? count : 0;
        return countValue > max.count ? { type: typeKey, count: countValue } : max;
      }, { type: 'uncertainty' as CyberSoluceSignalContract['signalType'], count: 0 });
      
      const destination = mapDomainToDestination(signalDomain);
      const affectedAssetIds = Array.from(
        new Set(domainSignals.flatMap(s => s.affectedAssetIds))
      );
      
      return {
        destination,
        rationale: generateRationale(
          signalDomain,
          primarySignalType.type,
          domainSignals.length,
          affectedAssetIds.length
        ),
        signalDomain,
        signalType: primarySignalType.type,
        signalCount: domainSignals.length,
        affectedAssetIds,
        handoffIntent: generateHandoffIntent(signalDomain, primarySignalType.type),
        nextQuestionPrompt: generateNextQuestionPrompt(destination),
      };
    });
    
    // Sort by signal count (descending) to prioritize domains with more signals
    return decisions.sort((a, b) => b.signalCount - a.signalCount);
  }, [signals]);
}

/**
 * Get the primary funnel decision (highest priority)
 */
export function usePrimaryFunnelDecision(
  signals: FocusSignal[],
  userIntentOrOptions?: UserIntent | UseFocusFunnelOptions
): FunnelDecision | null {
  const decisions = useFocusFunnel(signals, userIntentOrOptions);
  return decisions.length > 0 ? decisions[0] ?? null : null;
}

