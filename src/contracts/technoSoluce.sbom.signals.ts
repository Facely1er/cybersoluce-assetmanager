/**
 * TechnoSoluce SBOM-Derived Signal Types
 * 
 * Signal types derived from SBOM facts that indicate software composition visibility.
 * These are qualitative signals only - no risk assessment, no scoring.
 * 
 * @internal These signals extend the CyberSoluce signal contract for SBOM-derived insights.
 */

import { CyberSoluceSignalContract } from './cyberSoluce.signal.contract';

/**
 * SBOM-derived signal types
 * 
 * These signal types indicate the state of software composition visibility:
 * - software-composition-known: Full visibility into software components
 * - software-composition-partial: Some visibility but incomplete
 * - software-composition-unknown: No SBOM data available
 * - transitive-dependency-opacity: Dependency depth exceeds visibility
 * - component-churn-detected: Component count changes detected over time
 */
export type SBOMSignalType =
  | 'software-composition-known'
  | 'software-composition-partial'
  | 'software-composition-unknown'
  | 'transitive-dependency-opacity'
  | 'component-churn-detected';

/**
 * SBOM Signal
 * 
 * Extends CyberSoluceSignalContract without adding fields.
 * The signalType field will contain SBOMSignalType values.
 * The signalDomain will always be 'software'.
 */
export type SBOMSignal = Omit<CyberSoluceSignalContract, 'signalType'> & {
  signalType: SBOMSignalType;
  signalDomain: 'software';
};

/**
 * Example wording rules for SBOM signals:
 * 
 * ✅ Allowed:
 * - "Software components listed but dependency depth incomplete"
 * - "SBOM data available for 45 components"
 * - "Component count increased from 120 to 145 over the past week"
 * - "Transitive dependencies beyond depth 3 lack component identifiers"
 * 
 * ❌ Forbidden:
 * - "High risk due to vulnerable dependencies"
 * - "CVE-2024-1234 detected in component X"
 * - "Security score: 7.5/10"
 * - "Compliance violation: missing patch"
 */

