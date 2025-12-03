/**
 * Contract Guard
 * 
 * Runtime guardrails to enforce data contract boundaries.
 * 
 * This guard:
 * - Validates payloads against allowed fields
 * - Throws on forbidden keywords (score, rating, compliance, gap, compliant, maturity)
 * - Logs blocked attempts with dev-only warnings
 * 
 * This prevents accidental scope creep six months from now.
 * 
 * @internal Hard stop enforcement of CyberSoluce data contract boundaries.
 */

/**
 * Forbidden keywords that must never appear in exported data
 * These represent interpretations that belong to other ERMITS products, not CyberSoluce.
 * 
 * SBOM-related keywords (cve, vulnerability, severity, exploit, patch, secure/insecure)
 * belong downstream in TechnoSoluce, not in CyberSoluce exports.
 */
const FORBIDDEN_KEYWORDS = [
  'score',
  'rating',
  'compliance',
  'gap',
  'compliant',
  'maturity',
  'riskScore',
  'riskLevel',
  'riskRating',
  'complianceScore',
  'complianceStatus',
  'maturityLevel',
  'maturityScore',
  'gapAnalysis',
  'posture',
  'postureScore',
  // Drift/trend-related forbidden keywords
  'trend',
  'trend score',
  'risk trend',
  'improving',
  'worsening',
  'heatmap',
  // SBOM-related forbidden keywords
  'cve',
  'vulnerability',
  'vulnerabilities',
  'severity',
  'exploit',
  'exploits',
  'patch',
  'patches',
  'secure',
  'insecure',
  'security',
];

/**
 * Type representing any JSON-serializable value
 */
type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];

/**
 * Check if an object contains forbidden keywords in its keys or string values
 */
function containsForbiddenKeywords(obj: unknown, path: string = ''): string[] {
  const violations: string[] = [];
  
  if (obj === null || obj === undefined) {
    return violations;
  }
  
  if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
    // Check keys
    const objRecord = obj as Record<string, unknown>;
    for (const key of Object.keys(objRecord)) {
      const fullPath = path ? `${path}.${key}` : key;
      
      // Check if key contains forbidden keyword
      const lowerKey = key.toLowerCase();
      for (const forbidden of FORBIDDEN_KEYWORDS) {
        if (lowerKey.includes(forbidden.toLowerCase())) {
          violations.push(`Forbidden keyword "${forbidden}" found in key: ${fullPath}`);
        }
      }
      
      // Recursively check nested objects
      const value = objRecord[key];
      if (typeof value === 'object' && value !== null) {
        violations.push(...containsForbiddenKeywords(value, fullPath));
      } else if (typeof value === 'string') {
        // Check string values for forbidden keywords
        const lowerValue = value.toLowerCase();
        for (const forbidden of FORBIDDEN_KEYWORDS) {
          if (lowerValue.includes(forbidden.toLowerCase())) {
            violations.push(`Forbidden keyword "${forbidden}" found in value at: ${fullPath}`);
          }
        }
      }
    }
  } else if (Array.isArray(obj)) {
    // Handle arrays
    obj.forEach((item, index) => {
      const fullPath = path ? `${path}[${index}]` : `[${index}]`;
      violations.push(...containsForbiddenKeywords(item, fullPath));
    });
  }
  
  return violations;
}

/**
 * Validate that a payload only contains allowed fields
 */
function validateAllowedFields<T extends Record<string, unknown>>(
  payload: T,
  allowedFields: (keyof T)[]
): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  const payloadKeys = Object.keys(payload);
  
  for (const key of payloadKeys) {
    if (!allowedFields.includes(key as keyof T)) {
      violations.push(`Field "${key}" is not in allowed fields list`);
    }
  }
  
  return {
    valid: violations.length === 0,
    violations,
  };
}

/**
 * Contract validation result
 */
export interface ContractValidationResult {
  valid: boolean;
  violations: string[];
  warnings: string[];
}

/**
 * Validate a contract payload
 * 
 * @param payload - The payload to validate
 * @param allowedFields - List of allowed field names (optional, for field validation)
 * @param context - Context string for logging (e.g., "exportToCyberCorrect")
 * @returns Validation result
 */
export function validateContract(
  payload: unknown,
  allowedFields?: string[],
  context: string = 'unknown'
): ContractValidationResult {
  const violations: string[] = [];
  const warnings: string[] = [];
  
  // Check for forbidden keywords
  const keywordViolations = containsForbiddenKeywords(payload);
  if (keywordViolations.length > 0) {
    violations.push(...keywordViolations);
    
    // Log in dev mode
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[ContractGuard] Blocked forbidden keywords in ${context}:`, keywordViolations);
    }
  }
  
  // Validate allowed fields if provided
  if (allowedFields && Array.isArray(allowedFields) && typeof payload === 'object' && payload !== null && !Array.isArray(payload)) {
    const fieldValidation = validateAllowedFields(payload as Record<string, unknown>, allowedFields as string[]);
    if (!fieldValidation.valid) {
      violations.push(...fieldValidation.violations);
      
      // Log in dev mode
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[ContractGuard] Blocked disallowed fields in ${context}:`, fieldValidation.violations);
      }
    }
  }
  
  return {
    valid: violations.length === 0,
    violations,
    warnings,
  };
}

/**
 * Validate and throw if contract is violated
 * 
 * @throws {Error} If contract validation fails
 */
export function enforceContract(
  payload: unknown,
  allowedFields?: string[],
  context: string = 'unknown'
): void {
  const result = validateContract(payload, allowedFields, context);
  
  if (!result.valid) {
    const errorMessage = `Contract violation in ${context}:\n${result.violations.join('\n')}`;
    
    // Log in dev mode
    if (process.env.NODE_ENV === 'development') {
      console.error(`[ContractGuard] ${errorMessage}`);
    }
    
    throw new Error(errorMessage);
  }
}

/**
 * Validate an array of contract payloads
 */
export function validateContractArray(
  payloads: unknown[],
  allowedFields?: string[],
  context: string = 'unknown'
): ContractValidationResult {
  const allViolations: string[] = [];
  const allWarnings: string[] = [];
  
  payloads.forEach((payload, index) => {
    const result = validateContract(payload, allowedFields, `${context}[${index}]`);
    allViolations.push(...result.violations);
    allWarnings.push(...result.warnings);
  });
  
  return {
    valid: allViolations.length === 0,
    violations: allViolations,
    warnings: allWarnings,
  };
}

/**
 * Validate an export object (with manifest, assets, dependencies, signals, history, drift)
 */
export function validateExport(
  exportData: {
    manifest?: unknown;
    assets?: unknown[];
    dependencies?: unknown[];
    signals?: unknown[];
    history?: unknown[];
    drift?: unknown[];
  },
  context: string = 'export'
): ContractValidationResult {
  const allViolations: string[] = [];
  const allWarnings: string[] = [];
  
  // Validate manifest
  if (exportData.manifest) {
    const manifestResult = validateContract(exportData.manifest, undefined, `${context}.manifest`);
    allViolations.push(...manifestResult.violations);
    allWarnings.push(...manifestResult.warnings);
  }
  
  // Validate assets
  if (exportData.assets && Array.isArray(exportData.assets)) {
    const assetsResult = validateContractArray(exportData.assets, undefined, `${context}.assets`);
    allViolations.push(...assetsResult.violations);
    allWarnings.push(...assetsResult.warnings);
  }
  
  // Validate dependencies
  if (exportData.dependencies && Array.isArray(exportData.dependencies)) {
    const depsResult = validateContractArray(exportData.dependencies, undefined, `${context}.dependencies`);
    allViolations.push(...depsResult.violations);
    allWarnings.push(...depsResult.warnings);
  }
  
  // Validate signals
  if (exportData.signals && Array.isArray(exportData.signals)) {
    const signalsResult = validateContractArray(exportData.signals, undefined, `${context}.signals`);
    allViolations.push(...signalsResult.violations);
    allWarnings.push(...signalsResult.warnings);
  }
  
  // Validate history (signal history snapshots)
  if (exportData.history && Array.isArray(exportData.history)) {
    const historyResult = validateContractArray(exportData.history, undefined, `${context}.history`);
    allViolations.push(...historyResult.violations);
    allWarnings.push(...historyResult.warnings);
  }
  
  // Validate drift (drift insights)
  if (exportData.drift && Array.isArray(exportData.drift)) {
    const driftResult = validateContractArray(exportData.drift, undefined, `${context}.drift`);
    allViolations.push(...driftResult.violations);
    allWarnings.push(...driftResult.warnings);
  }
  
  return {
    valid: allViolations.length === 0,
    violations: allViolations,
    warnings: allWarnings,
  };
}

