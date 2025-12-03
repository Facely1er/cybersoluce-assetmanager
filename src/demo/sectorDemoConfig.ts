/**
 * Sector Demo Configuration
 * 
 * Defines sector-specific demo configurations for guided sales demos.
 * Links sector, size, and scenario to default signals.
 */

import { CyberSoluceSignalContract } from '../contracts/cyberSoluce.signal.contract';

export type SectorId = 
  | 'healthcare'
  | 'financial'
  | 'saas'
  | 'manufacturing'
  | 'education'
  | 'publicSector';

export type OrgSize = 'small' | 'medium' | 'large';

export type PrimaryScenario = 
  | 'privacy'
  | 'ransomware'
  | 'vendor-risk'
  | 'software-supply-chain';

/**
 * Sector Demo Configuration
 * 
 * Defines the configuration for a sector-based demo, including
 * default signals that should be injected for the demo.
 */
export interface SectorDemoConfig {
  /** Sector identifier */
  sectorId: SectorId;
  
  /** Organization size */
  orgSize: OrgSize;
  
  /** Primary scenario focus */
  primaryScenario: PrimaryScenario;
  
  /** Default signals to inject for this demo */
  defaultSignals: CyberSoluceSignalContract[];
}

/**
 * Generate default signals for a sector demo configuration
 */
function generateDefaultSignals(
  sectorId: SectorId,
  primaryScenario: PrimaryScenario,
  assetIds: string[]
): CyberSoluceSignalContract[] {
  const signals: CyberSoluceSignalContract[] = [];
  const now = new Date().toISOString();
  
  // Select a subset of asset IDs for signals (3-5 assets)
  const selectedAssetIds = assetIds.slice(0, Math.min(5, assetIds.length));
  
  // Generate signals based on primary scenario
  switch (primaryScenario) {
    case 'privacy':
      signals.push({
        signalId: `demo-signal-privacy-1`,
        signalType: 'uncertainty',
        description: 'unclear vendor data processing terms',
        confidence: 'medium',
        source: 'inferred',
        timestamp: now,
        signalDomain: 'privacy',
        affectedAssetIds: selectedAssetIds.slice(0, 2),
        concentrationDescription: 'multiple assets share data with third-party vendors without documented processing agreements',
      });
      
      signals.push({
        signalId: `demo-signal-privacy-2`,
        signalType: 'dependency',
        description: 'unmapped third-party dependency',
        confidence: 'high',
        source: 'inferred',
        timestamp: now,
        signalDomain: 'privacy',
        affectedAssetIds: selectedAssetIds.slice(1, 3),
        concentrationDescription: 'data flows through vendor services without clear visibility into processing locations',
      });
      break;
      
    case 'ransomware':
      signals.push({
        signalId: `demo-signal-ransomware-1`,
        signalType: 'exposure',
        description: 'uncertain backup ownership',
        confidence: 'medium',
        source: 'inferred',
        timestamp: now,
        signalDomain: 'ransomware',
        affectedAssetIds: selectedAssetIds.slice(0, 2),
        concentrationDescription: 'critical assets have backup processes but ownership and recovery procedures are not clearly documented',
      });
      
      signals.push({
        signalId: `demo-signal-ransomware-2`,
        signalType: 'dependency',
        description: 'opaque SaaS-to-SaaS integration chain',
        confidence: 'high',
        source: 'inferred',
        timestamp: now,
        signalDomain: 'ransomware',
        affectedAssetIds: selectedAssetIds.slice(1, 3),
        concentrationDescription: 'multiple SaaS applications integrate with each other, creating complex dependency chains',
      });
      break;
      
    case 'vendor-risk':
      signals.push({
        signalId: `demo-signal-vendor-1`,
        signalType: 'uncertainty',
        description: 'unclear vendor data processing terms',
        confidence: 'medium',
        source: 'inferred',
        timestamp: now,
        signalDomain: 'vendor',
        affectedAssetIds: selectedAssetIds.slice(0, 3),
        concentrationDescription: 'vendor relationships exist but data processing agreements and security assessments are incomplete',
      });
      
      signals.push({
        signalId: `demo-signal-vendor-2`,
        signalType: 'dependency',
        description: 'unmapped third-party dependency',
        confidence: 'high',
        source: 'inferred',
        timestamp: now,
        signalDomain: 'vendor',
        affectedAssetIds: selectedAssetIds.slice(1, 4),
        concentrationDescription: 'critical business functions depend on vendor services without documented dependency maps',
      });
      break;
      
    case 'software-supply-chain':
      signals.push({
        signalId: `demo-signal-software-1`,
        signalType: 'uncertainty',
        description: 'unmapped third-party dependency',
        confidence: 'high',
        source: 'inferred',
        timestamp: now,
        signalDomain: 'software',
        affectedAssetIds: selectedAssetIds.slice(0, 3),
        concentrationDescription: 'application components depend on third-party libraries and services without complete inventory',
      });
      
      signals.push({
        signalId: `demo-signal-software-2`,
        signalType: 'dependency',
        description: 'opaque SaaS-to-SaaS integration chain',
        confidence: 'medium',
        source: 'inferred',
        timestamp: now,
        signalDomain: 'software',
        affectedAssetIds: selectedAssetIds.slice(1, 4),
        concentrationDescription: 'software components integrate with external services creating complex dependency networks',
      });
      break;
  }
  
  return signals;
}

/**
 * Sector Demo Configurations
 * 
 * Pre-configured demo scenarios covering different sectors, sizes, and scenarios.
 */
export const SECTOR_DEMO_CONFIGS: SectorDemoConfig[] = [
  // Healthcare - Privacy
  {
    sectorId: 'healthcare',
    orgSize: 'small',
    primaryScenario: 'privacy',
    defaultSignals: [], // Will be populated when assets are available
  },
  {
    sectorId: 'healthcare',
    orgSize: 'medium',
    primaryScenario: 'privacy',
    defaultSignals: [],
  },
  {
    sectorId: 'healthcare',
    orgSize: 'large',
    primaryScenario: 'privacy',
    defaultSignals: [],
  },
  // Healthcare - Ransomware
  {
    sectorId: 'healthcare',
    orgSize: 'small',
    primaryScenario: 'ransomware',
    defaultSignals: [],
  },
  {
    sectorId: 'healthcare',
    orgSize: 'medium',
    primaryScenario: 'ransomware',
    defaultSignals: [],
  },
  {
    sectorId: 'healthcare',
    orgSize: 'large',
    primaryScenario: 'ransomware',
    defaultSignals: [],
  },
  
  // Financial - Privacy
  {
    sectorId: 'financial',
    orgSize: 'small',
    primaryScenario: 'privacy',
    defaultSignals: [],
  },
  {
    sectorId: 'financial',
    orgSize: 'medium',
    primaryScenario: 'privacy',
    defaultSignals: [],
  },
  {
    sectorId: 'financial',
    orgSize: 'large',
    primaryScenario: 'privacy',
    defaultSignals: [],
  },
  // Financial - Vendor Risk
  {
    sectorId: 'financial',
    orgSize: 'small',
    primaryScenario: 'vendor-risk',
    defaultSignals: [],
  },
  {
    sectorId: 'financial',
    orgSize: 'medium',
    primaryScenario: 'vendor-risk',
    defaultSignals: [],
  },
  {
    sectorId: 'financial',
    orgSize: 'large',
    primaryScenario: 'vendor-risk',
    defaultSignals: [],
  },
  
  // SaaS - Software Supply Chain
  {
    sectorId: 'saas',
    orgSize: 'small',
    primaryScenario: 'software-supply-chain',
    defaultSignals: [],
  },
  {
    sectorId: 'saas',
    orgSize: 'medium',
    primaryScenario: 'software-supply-chain',
    defaultSignals: [],
  },
  {
    sectorId: 'saas',
    orgSize: 'large',
    primaryScenario: 'software-supply-chain',
    defaultSignals: [],
  },
  // SaaS - Ransomware
  {
    sectorId: 'saas',
    orgSize: 'small',
    primaryScenario: 'ransomware',
    defaultSignals: [],
  },
  {
    sectorId: 'saas',
    orgSize: 'medium',
    primaryScenario: 'ransomware',
    defaultSignals: [],
  },
  {
    sectorId: 'saas',
    orgSize: 'large',
    primaryScenario: 'ransomware',
    defaultSignals: [],
  },
];

/**
 * Get a sector demo config by sector, size, and scenario
 */
export function getSectorDemoConfig(
  sectorId: SectorId,
  orgSize: OrgSize,
  primaryScenario: PrimaryScenario
): SectorDemoConfig | undefined {
  return SECTOR_DEMO_CONFIGS.find(
    config =>
      config.sectorId === sectorId &&
      config.orgSize === orgSize &&
      config.primaryScenario === primaryScenario
  );
}

/**
 * Build signals for a sector demo configuration
 * This function generates signals based on the config and available assets
 */
export function buildSectorDemoSignalsForConfig(
  config: SectorDemoConfig,
  assetIds: string[]
): CyberSoluceSignalContract[] {
  return generateDefaultSignals(config.sectorId, config.primaryScenario, assetIds);
}

