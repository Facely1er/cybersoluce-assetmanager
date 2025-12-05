/**
 * Active Funnel Router Service
 * 
 * Routes assets to ERMITS services (CyberCorrect, VendorSoluce, TechnoSoluce)
 * with prepared export payloads and data context.
 * 
 * This service enables active routing from CyberSoluce to other services,
 * preparing the data and navigating with context.
 */

import { Asset } from '../types/asset';
import { FocusSignal } from '../types/enrichment';
import { Dependency } from '../types/dependency';
import { exportToCyberCorrect, CyberCorrectExport } from '../exports/toCyberCorrect';
import { exportToVendorSoluce, VendorSoluceExport } from '../exports/toVendorSoluce';
import { exportToTechnoSoluce, TechnoSoluceExport } from '../exports/toTechnoSoluce';

export type FunnelDestination = 'CyberCorrect' | 'VendorSoluce' | 'TechnoSoluce' | 'CyberCaution' | 'ERMITSAdvisory';

export interface RoutingContext {
  destination: FunnelDestination;
  selectedAssets: Asset[];
  signals: FocusSignal[];
  dependencies: Dependency[];
  exportPayload: CyberCorrectExport | VendorSoluceExport | TechnoSoluceExport;
  handoffIntent: string;
  rationale: string;
}

export interface RoutingResult {
  success: boolean;
  destination: FunnelDestination;
  assetCount: number;
  exportPayloadSize: number;
  navigationUrl: string;
  error?: string;
}

/**
 * Active Funnel Router Service
 */
export class ActiveFunnelRouter {
  /**
   * Route assets to CyberCorrect for privacy analysis
   */
  static async routeToCyberCorrect(
    assets: Asset[],
    signals: FocusSignal[],
    dependencies: Dependency[] = []
  ): Promise<RoutingResult> {
    try {
      // Filter assets relevant to privacy
      const privacyAssets = this.filterPrivacyAssets(assets, signals);
      
      if (privacyAssets.length === 0) {
        return {
          success: false,
          destination: 'CyberCorrect',
          assetCount: 0,
          exportPayloadSize: 0,
          navigationUrl: '/services/cybercorrect',
          error: 'No privacy-relevant assets found',
        };
      }

      // Prepare export payload
      const exportPayload = exportToCyberCorrect(privacyAssets, dependencies || [], signals);

      // Store export payload in session storage for the target service
      this.storeExportPayload('CyberCorrect', exportPayload);

      return {
        success: true,
        destination: 'CyberCorrect',
        assetCount: privacyAssets.length,
        exportPayloadSize: JSON.stringify(exportPayload).length,
        navigationUrl: `/services/cybercorrect?source=cybersoluce&assetCount=${privacyAssets.length}`,
      };
    } catch (error) {
      return {
        success: false,
        destination: 'CyberCorrect',
        assetCount: 0,
        exportPayloadSize: 0,
        navigationUrl: '/services/cybercorrect',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Route assets to VendorSoluce for vendor risk analysis
   */
  static async routeToVendorSoluce(
    assets: Asset[],
    signals: FocusSignal[],
    dependencies: Dependency[] = []
  ): Promise<RoutingResult> {
    try {
      // Filter assets relevant to vendors
      const vendorAssets = this.filterVendorAssets(assets, signals);
      
      if (vendorAssets.length === 0) {
        return {
          success: false,
          destination: 'VendorSoluce',
          assetCount: 0,
          exportPayloadSize: 0,
          navigationUrl: '/services/vendorsoluce',
          error: 'No vendor-relevant assets found',
        };
      }

      // Prepare export payload
      const exportPayload = await exportToVendorSoluce(vendorAssets, dependencies || [], signals);

      // Store export payload in session storage
      this.storeExportPayload('VendorSoluce', exportPayload);

      return {
        success: true,
        destination: 'VendorSoluce',
        assetCount: vendorAssets.length,
        exportPayloadSize: JSON.stringify(exportPayload).length,
        navigationUrl: `/services/vendorsoluce?source=cybersoluce&assetCount=${vendorAssets.length}`,
      };
    } catch (error) {
      return {
        success: false,
        destination: 'VendorSoluce',
        assetCount: 0,
        exportPayloadSize: 0,
        navigationUrl: '/services/vendorsoluce',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Route assets to TechnoSoluce for SBOM analysis
   */
  static async routeToTechnoSoluce(
    assets: Asset[],
    signals: FocusSignal[],
    dependencies: Dependency[] = []
  ): Promise<RoutingResult> {
    try {
      // Filter software assets
      const softwareAssets = this.filterSoftwareAssets(assets, signals);
      
      if (softwareAssets.length === 0) {
        return {
          success: false,
          destination: 'TechnoSoluce',
          assetCount: 0,
          exportPayloadSize: 0,
          navigationUrl: '/services/technosoluce',
          error: 'No software assets found',
        };
      }

      // Prepare export payload
      const exportPayload = exportToTechnoSoluce(softwareAssets, dependencies || [], signals);

      // Store export payload in session storage
      this.storeExportPayload('TechnoSoluce', exportPayload);

      return {
        success: true,
        destination: 'TechnoSoluce',
        assetCount: softwareAssets.length,
        exportPayloadSize: JSON.stringify(exportPayload).length,
        navigationUrl: `/services/technosoluce?source=cybersoluce&assetCount=${softwareAssets.length}`,
      };
    } catch (error) {
      return {
        success: false,
        destination: 'TechnoSoluce',
        assetCount: 0,
        exportPayloadSize: 0,
        navigationUrl: '/services/technosoluce',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get routing context for a destination
   */
  static getRoutingContext(destination: FunnelDestination): RoutingContext | null {
    const stored = sessionStorage.getItem(`funnel_export_${destination}`);
    if (!stored) return null;

    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  /**
   * Clear routing context
   */
  static clearRoutingContext(destination: FunnelDestination): void {
    sessionStorage.removeItem(`funnel_export_${destination}`);
  }

  /**
   * Filter assets relevant to privacy concerns
   */
  private static filterPrivacyAssets(assets: Asset[], signals: FocusSignal[]): Asset[] {
    const privacySignalIds = signals
      .filter(s => s.signal_domain === 'privacy')
      .flatMap(s => s.affected_asset_ids);

    return assets.filter(asset => {
      // Include if mentioned in privacy signals
      if (privacySignalIds.includes(asset.id)) return true;
      
      // Include if has privacy-relevant tags or classifications
      if (asset.dataClassification && ['confidential', 'restricted'].includes(asset.dataClassification)) {
        return true;
      }
      
      // Include if has privacy-related tags
      if (asset.tags?.some(tag => 
        tag.toLowerCase().includes('pii') || 
        tag.toLowerCase().includes('privacy') ||
        tag.toLowerCase().includes('gdpr') ||
        tag.toLowerCase().includes('ccpa')
      )) {
        return true;
      }

      return false;
    });
  }

  /**
   * Filter assets relevant to vendor concerns
   */
  private static filterVendorAssets(assets: Asset[], signals: FocusSignal[]): Asset[] {
    const vendorSignalIds = signals
      .filter(s => s.signal_domain === 'vendor')
      .flatMap(s => s.affected_asset_ids);

    return assets.filter(asset => {
      // Include if mentioned in vendor signals
      if (vendorSignalIds.includes(asset.id)) return true;
      
      // Include if has vendor-related tags
      if (asset.tags?.some(tag => 
        tag.toLowerCase().includes('vendor') || 
        tag.toLowerCase().includes('third-party') ||
        tag.toLowerCase().includes('supplier')
      )) {
        return true;
      }

      // Include if asset type suggests vendor relationship
      if (asset.assetType === 'service' || asset.assetType === 'vendor') {
        return true;
      }

      return false;
    });
  }

  /**
   * Filter software assets
   */
  private static filterSoftwareAssets(assets: Asset[], signals: FocusSignal[]): Asset[] {
    const softwareSignalIds = signals
      .filter(s => s.signal_domain === 'software')
      .flatMap(s => s.affected_asset_ids);

    return assets.filter(asset => {
      // Include if mentioned in software signals
      if (softwareSignalIds.includes(asset.id)) return true;
      
      // Include if asset type is software-related
      if (asset.assetType === 'software' || asset.assetType === 'application') {
        return true;
      }

      // Include if has software-related tags
      if (asset.tags?.some(tag => 
        tag.toLowerCase().includes('software') || 
        tag.toLowerCase().includes('component') ||
        tag.toLowerCase().includes('sbom') ||
        tag.toLowerCase().includes('dependency')
      )) {
        return true;
      }

      return false;
    });
  }

  /**
   * Store export payload in session storage
   */
  private static storeExportPayload(
    destination: FunnelDestination,
    payload: CyberCorrectExport | VendorSoluceExport | TechnoSoluceExport
  ): void {
    try {
      const context: RoutingContext = {
        destination,
        selectedAssets: [], // Will be populated by target service
        signals: (payload.signals as FocusSignal[]) || [],
        dependencies: (payload.dependencies as Dependency[]) || [],
        exportPayload: payload,
        handoffIntent: this.getHandoffIntent(destination),
        rationale: this.getRationale(destination, payload),
      };

      sessionStorage.setItem(
        `funnel_export_${destination}`,
        JSON.stringify(context)
      );
    } catch (error) {
      console.error('Failed to store export payload:', error);
    }
  }

  /**
   * Get handoff intent for destination
   */
  private static getHandoffIntent(destination: FunnelDestination): string {
    const intents: Record<FunnelDestination, string> = {
      CyberCorrect: 'privacy-impact-analysis',
      VendorSoluce: 'vendor-risk-assessment',
      TechnoSoluce: 'sbom-analysis',
      CyberCaution: 'threat-assessment',
      ERMITSAdvisory: 'governance-advisory',
    };
    return intents[destination];
  }

  /**
   * Get rationale for routing
   */
  private static getRationale(
    destination: FunnelDestination,
    payload: CyberCorrectExport | VendorSoluceExport | TechnoSoluceExport
  ): string {
    const assetCount = payload.assets?.length || 0;
    const signalCount = payload.signals?.length || 0;

    const rationales: Record<FunnelDestination, string> = {
      CyberCorrect: `${assetCount} asset(s) with privacy signals (${signalCount} signal(s)) routed for privacy impact analysis`,
      VendorSoluce: `${assetCount} asset(s) with vendor dependencies (${signalCount} signal(s)) routed for vendor risk assessment`,
      TechnoSoluce: `${assetCount} software asset(s) (${signalCount} signal(s)) routed for SBOM analysis`,
      CyberCaution: `${assetCount} asset(s) routed for threat assessment`,
      ERMITSAdvisory: `${assetCount} asset(s) routed for governance advisory`,
    };
    return rationales[destination];
  }
}

