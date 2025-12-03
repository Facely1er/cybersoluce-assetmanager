/**
 * TechnoSoluce SBOM Intake Contract
 * 
 * This contract represents software composition facts, not security posture.
 * 
 * TechnoSoluce is the ONLY system that ingests and interprets SBOMs.
 * CyberSoluce never parses SBOMs, never computes risk, never scores.
 * 
 * RULES:
 * - Only factual SBOM metadata
 * - No CVE, severity, score, compliance, pass/fail
 * - Supported formats: SPDX, CycloneDX (as metadata only)
 * 
 * @internal This contract defines the boundary of SBOM data intake for TechnoSoluce.
 */

/**
 * SBOM format types
 */
export type SBOMFormat = 'SPDX' | 'CycloneDX';

/**
 * SBOM source types
 */
export type SBOMSource = 'upload' | 'repo' | 'ci';

/**
 * SBOM Intake Contract
 * 
 * Represents factual SBOM data only - no security interpretations.
 */
export interface SBOMIntake {
  /** Unique identifier for the SBOM */
  sbomId: string;
  
  /** SBOM format (SPDX or CycloneDX) */
  format: SBOMFormat;
  
  /** Timestamp when SBOM was generated (ISO 8601) */
  generatedAt: string;
  
  /** Tool name that generated the SBOM */
  toolName: string;
  
  /** Number of components listed in the SBOM */
  componentsCount: number;
  
  /** Whether the SBOM includes license information */
  hasLicenses: boolean;
  
  /** Whether the SBOM includes dependency graph information */
  hasDependencies: boolean;
  
  /** Source of the SBOM */
  source: SBOMSource;
}

/**
 * Explicitly forbidden fields (for documentation and validation)
 * These must NEVER appear in SBOM intake data:
 * - CVE
 * - severity
 * - score
 * - compliance
 * - pass/fail
 * - risk
 * - vulnerability
 * - exploit
 * - patch
 * - secure/insecure
 */
export const FORBIDDEN_SBOM_FIELDS = [
  'cve',
  'severity',
  'score',
  'compliance',
  'pass',
  'fail',
  'risk',
  'vulnerability',
  'exploit',
  'patch',
  'secure',
  'insecure',
] as const;

