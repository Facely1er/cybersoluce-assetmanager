/**
 * Export Adapter: TechnoSoluce → CyberSoluce
 * 
 * Exports SBOM-derived signals back into the CyberSoluce ecosystem.
 * 
 * RULES:
 * - Export signals only (never raw SBOM data)
 * - Signal types must be from SBOMSignalType
 * - All text fields validated via contractGuard
 * - No CVE, severity, score, or risk language
 */

import { CyberSoluceSignalContract } from '../contracts/cyberSoluce.signal.contract';
import { SBOMSignal, SBOMSignalType } from '../contracts/technoSoluce.sbom.signals';
import { enforceContract } from '../guards/contractGuard';

/**
 * Export SBOM signals to CyberSoluce
 * 
 * Converts SBOM signals to CyberSoluce signal contracts and validates them.
 * 
 * @param signals - Array of SBOM signals to export
 * @returns Array of validated CyberSoluce signal contracts
 * @throws {Error} If contract validation fails
 */
export function exportSBOMSignalsToCyberSoluce(
  signals: SBOMSignal[]
): CyberSoluceSignalContract[] {
  // Convert SBOM signals to CyberSoluce signal contracts
  const contractSignals: CyberSoluceSignalContract[] = signals.map(signal => {
    // Map SBOMSignalType to CyberSoluceSignalContract signalType
    // SBOM signals map to 'uncertainty' or 'dependency' based on their type
    const mapSignalType = (sbomType: SBOMSignalType): CyberSoluceSignalContract['signalType'] => {
      switch (sbomType) {
        case 'software-composition-unknown':
        case 'software-composition-partial':
        case 'transitive-dependency-opacity':
          return 'uncertainty';
        case 'software-composition-known':
        case 'component-churn-detected':
          return 'dependency';
        default:
          return 'uncertainty';
      }
    };
    
    const contract: CyberSoluceSignalContract = {
      signalId: signal.signalId,
      signalType: mapSignalType(signal.signalType),
      description: signal.description,
      confidence: signal.confidence,
      source: signal.source,
      timestamp: signal.timestamp,
      signalDomain: 'software', // SBOM signals always have software domain
      affectedAssetIds: [...signal.affectedAssetIds],
      concentrationDescription: signal.concentrationDescription,
    };
    
    // Validate contract (enforces forbidden keywords)
    enforceContract(
      contract,
      [
        'signalId',
        'signalType',
        'description',
        'confidence',
        'source',
        'timestamp',
        'signalDomain',
        'affectedAssetIds',
        'concentrationDescription',
      ],
      'exportSBOMSignalsToCyberSoluce'
    );
    
    return contract;
  });
  
  return contractSignals;
}

