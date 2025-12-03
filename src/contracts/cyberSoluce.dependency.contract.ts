/**
 * CyberSoluce Dependency Contract
 * 
 * Authoritative data contract for dependencies exported from CyberSoluce.
 * 
 * RULES:
 * - NO optional "score", "risk", "compliance", "criticality" fields
 * - Only factual + qualitative descriptors
 * - Describes relationships between assets, not risk assessments
 * 
 * @internal This contract defines the boundary of what CyberSoluce can export about dependencies.
 */

export interface CyberSoluceDependencyContract {
  /** Unique identifier for the dependency */
  dependencyId: string;
  
  /** Source asset ID */
  sourceAssetId: string;
  
  /** Source asset name */
  sourceAssetName: string;
  
  /** Target asset ID */
  targetAssetId: string;
  
  /** Target asset name */
  targetAssetName: string;
  
  /** Type of relationship (factual) */
  relationshipType: 'Depends On' | 'Connects To' | 'Hosts' | 'Manages' | 'Accesses' | 'Processes' | 'Stores' | 'Transmits' | 'Shares' | 'Backs Up' | 'Replicates' | 'Synchronizes';
  
  /** Strength of relationship (qualitative descriptor, not risk) */
  strength: 'Strong' | 'Medium' | 'Weak';
  
  /** Direction of data flow (factual) */
  dataFlowDirection: 'Inbound' | 'Outbound' | 'Bidirectional' | 'None';
  
  /** Whether personal data flows through this relationship (factual) */
  isPersonalData: boolean;
  
  /** Purpose of the relationship (qualitative) */
  purpose: string;
  
  /** Description of the dependency (qualitative) */
  description?: string;
}

/**
 * Helper to convert internal Dependency to contract format
 * Strips out any scoring/risk/criticality fields
 */
export function toDependencyContract(dependency: {
  id: string;
  sourceId: string;
  sourceName: string;
  targetId: string;
  targetName: string;
  type: string;
  strength: string;
  dataFlowDirection?: string;
  isPersonalData?: boolean;
  purpose?: string;
  description?: string;
}): CyberSoluceDependencyContract {
  // Map strength to contract format (handle both 'critical'/'high'/'medium'/'low' and 'Strong'/'Medium'/'Weak')
  const mapStrength = (strength: string): CyberSoluceDependencyContract['strength'] => {
    const lower = strength.toLowerCase();
    if (lower === 'critical' || lower === 'strong') return 'Strong';
    if (lower === 'high' || lower === 'medium') return 'Medium';
    if (lower === 'low' || lower === 'weak') return 'Weak';
    return 'Medium'; // Default
  };

  return {
    dependencyId: dependency.id,
    sourceAssetId: dependency.sourceId,
    sourceAssetName: dependency.sourceName,
    targetAssetId: dependency.targetId,
    targetAssetName: dependency.targetName,
    relationshipType: dependency.type as CyberSoluceDependencyContract['relationshipType'],
    strength: mapStrength(dependency.strength),
    dataFlowDirection: (dependency.dataFlowDirection || 'None') as CyberSoluceDependencyContract['dataFlowDirection'],
    isPersonalData: dependency.isPersonalData ?? false,
    purpose: dependency.purpose || '',
    description: dependency.description,
  };
}

