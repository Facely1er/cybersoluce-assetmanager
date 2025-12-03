/**
 * Sector Demo Signals
 * 
 * Builds demo signals for sector-based guided demos.
 * Signals describe exposure, dependency, change, and uncertainty - no risk/compliance wording.
 */

import { CyberSoluceSignalContract } from '../contracts/cyberSoluce.signal.contract';
import { CyberSoluceAssetContract } from '../contracts/cyberSoluce.asset.contract';
import { SectorDemoConfig } from './sectorDemoConfig';
import { buildSectorDemoSignalsForConfig } from './sectorDemoConfig';

/**
 * Build sector demo signals
 * 
 * Combines config.defaultSignals with asset-specific signals generated
 * based on the configuration.
 * 
 * @param assets - Assets to generate signals for
 * @param config - Sector demo configuration
 * @returns Array of signals for the demo
 */
export function buildSectorDemoSignals(
  assets: CyberSoluceAssetContract[],
  config: SectorDemoConfig
): CyberSoluceSignalContract[] {
  const assetIds = assets.map(a => a.assetId);
  
  // Generate signals based on config
  const generatedSignals = buildSectorDemoSignalsForConfig(config, assetIds);
  
  // Combine with any pre-configured signals from config
  const allSignals = [...config.defaultSignals, ...generatedSignals];
  
  // Add a few asset-specific signals based on asset characteristics
  const assetSpecificSignals: CyberSoluceSignalContract[] = [];
  const now = new Date().toISOString();
  
  // Find assets with third-party sharing
  const thirdPartyAssets = assets.filter(a => a.thirdPartySharing);
  if (thirdPartyAssets.length > 0) {
    assetSpecificSignals.push({
      signalId: `demo-signal-${config.sectorId}-third-party-1`,
      signalType: 'uncertainty',
      description: 'unclear vendor data processing terms',
      confidence: 'medium',
      source: 'inferred',
      timestamp: now,
      signalDomain: config.primaryScenario === 'privacy' ? 'privacy' : 'vendor',
      affectedAssetIds: thirdPartyAssets.slice(0, 3).map(a => a.assetId),
      concentrationDescription: 'assets share data with third parties but processing terms are not fully documented',
    });
  }
  
  // Find assets with cross-border transfers
  const crossBorderAssets = assets.filter(a => a.crossBorderTransfer);
  if (crossBorderAssets.length > 0) {
    assetSpecificSignals.push({
      signalId: `demo-signal-${config.sectorId}-cross-border-1`,
      signalType: 'dependency',
      description: 'unmapped third-party dependency',
      confidence: 'high',
      source: 'inferred',
      timestamp: now,
      signalDomain: config.primaryScenario === 'privacy' ? 'privacy' : 'vendor',
      affectedAssetIds: crossBorderAssets.slice(0, 2).map(a => a.assetId),
      concentrationDescription: 'data crosses borders through vendor services without clear visibility into processing locations',
    });
  }
  
  // Find cloud services (potential SaaS integrations)
  const cloudAssets = assets.filter(a => 
    a.type === 'Cloud Service' || 
    a.location.toLowerCase().includes('cloud')
  );
  if (cloudAssets.length > 2) {
    assetSpecificSignals.push({
      signalId: `demo-signal-${config.sectorId}-saas-1`,
      signalType: 'dependency',
      description: 'opaque SaaS-to-SaaS integration chain',
      confidence: 'medium',
      source: 'inferred',
      timestamp: now,
      signalDomain: config.primaryScenario === 'software-supply-chain' ? 'software' : 'vendor',
      affectedAssetIds: cloudAssets.slice(0, 4).map(a => a.assetId),
      concentrationDescription: 'multiple cloud services integrate with each other, creating complex dependency chains',
    });
  }
  
  // Add SBOM-derived signals for SaaS and Manufacturing sectors
  if (config.sectorId === 'saas' || config.sectorId === 'manufacturing') {
    // Find application assets (likely to have SBOM data)
    const applicationAssets = assets.filter(a => 
      a.type === 'Application' || 
      a.type === 'API' ||
      a.type === 'Server'
    );
    
    if (applicationAssets.length > 0) {
      // Inject mock SBOM-derived signals
      const sbomAssetIds = applicationAssets.slice(0, 3).map(a => a.assetId);
      
      // Software composition partial signal
      assetSpecificSignals.push({
        signalId: `demo-signal-${config.sectorId}-sbom-partial-1`,
        signalType: 'uncertainty',
        description: 'Software components listed but dependency depth incomplete',
        confidence: 'low',
        source: 'inferred',
        timestamp: now,
        signalDomain: 'software',
        affectedAssetIds: sbomAssetIds,
        concentrationDescription: 'Software composition visibility available via TechnoSoluce. SBOM data indicates components are listed but dependency graph information is incomplete',
      });
      
      // Software composition unknown signal (for some assets)
      if (applicationAssets.length > 3) {
        const unknownAssetIds = applicationAssets.slice(3, 5).map(a => a.assetId);
        assetSpecificSignals.push({
          signalId: `demo-signal-${config.sectorId}-sbom-unknown-1`,
          signalType: 'uncertainty',
          description: 'No SBOM data available for these assets',
          confidence: 'low',
          source: 'inferred',
          timestamp: now,
          signalDomain: 'software',
          affectedAssetIds: unknownAssetIds,
          concentrationDescription: 'Software composition visibility is not available for these assets. Software composition visibility available via TechnoSoluce',
        });
      }
    }
  }
  
  return [...allSignals, ...assetSpecificSignals];
}

