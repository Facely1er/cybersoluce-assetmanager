/**
 * Multistakeholder Report Service
 * 
 * Generates reports that aggregate data from all ERMITS services:
 * - CyberSoluce (asset inventory)
 * - CyberCorrect (privacy data)
 * - VendorSoluce (vendor risk)
 * - TechnoSoluce (SBOM analysis)
 * 
 * Creates stakeholder-specific reports for:
 * - Executive/Board
 * - Technical teams
 * - Compliance teams
 * - Vendor management
 */

import { Asset } from '../../types/asset';
import { FocusSignal } from '../../types/enrichment';

export type StakeholderType = 'executive' | 'technical' | 'compliance' | 'vendor-management' | 'comprehensive';

export interface StakeholderReport {
  stakeholderType: StakeholderType;
  title: string;
  generatedAt: Date;
  summary: ReportSummary;
  sections: ReportSection[];
  recommendations: string[];
  metrics: ReportMetrics;
  dataSources: string[];
}

export interface ReportSummary {
  totalAssets: number;
  criticalAssets: number;
  highRiskAssets: number;
  privacyAssets: number;
  vendorAssets: number;
  softwareAssets: number;
  overallRiskScore: number;
  complianceStatus: 'compliant' | 'partial' | 'non-compliant';
  keyFindings: string[];
}

export interface ReportSection {
  title: string;
  content: string;
  charts?: ChartData[];
  tables?: TableData[];
  priority: 'high' | 'medium' | 'low';
}

export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'donut';
  title: string;
  data: number[];
  labels: string[];
}

export interface TableData {
  headers: string[];
  rows: string[][];
  title: string;
}

export interface ReportMetrics {
  assetCount: number;
  riskDistribution: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  complianceCoverage: {
    framework: string;
    coverage: number;
  }[];
  privacyExposure: {
    piiAssets: number;
    highRiskPrivacy: number;
  };
  vendorRisk: {
    totalVendors: number;
    highRiskVendors: number;
    criticalVendors: number;
  };
  softwareRisk: {
    totalSoftware: number;
    withSBOM: number;
    vulnerabilities: number;
  };
}

/**
 * Multistakeholder Report Service
 */
export class MultistakeholderReportService {
  /**
   * Generate report for specific stakeholder type
   */
  static async generateReport(
    assets: Asset[],
    signals: FocusSignal[],
    stakeholderType: StakeholderType,
    enrichedData?: {
      cyberCorrect?: unknown[];
      vendorSoluce?: unknown[];
      technoSoluce?: unknown[];
    }
  ): Promise<StakeholderReport> {
    const summary = this.calculateSummary(assets, signals, enrichedData);
    const metrics = this.calculateMetrics(assets, enrichedData);
    const sections = this.generateSections(assets, signals, stakeholderType, enrichedData);
    const recommendations = this.generateRecommendations(assets, signals, stakeholderType, summary);

    return {
      stakeholderType,
      title: this.getReportTitle(stakeholderType),
      generatedAt: new Date(),
      summary,
      sections,
      recommendations,
      metrics,
      dataSources: this.getDataSources(enrichedData),
    };
  }

  /**
   * Calculate report summary
   */
  private static calculateSummary(
    assets: Asset[],
    signals: FocusSignal[],
    enrichedData?: {
      cyberCorrect?: unknown[];
      vendorSoluce?: unknown[];
      technoSoluce?: unknown[];
    }
  ): ReportSummary {
    void enrichedData; // Reserved for future use
    const criticalAssets = assets.filter(a => a.criticality === 'Critical').length;
    const highRiskAssets = assets.filter(a => (a.riskScore || 0) >= 70).length;
    
    const privacyAssets = assets.filter(a => 
      a.dataClassification === 'Confidential' || 
      a.dataClassification === 'Restricted' ||
      signals.some(s => s.signal_domain === 'privacy' && s.affected_asset_ids.includes(a.id))
    ).length;

    const vendorAssets = assets.filter(a =>
      a.assetType === 'vendor' ||
      a.assetType === 'service' ||
      signals.some(s => s.signal_domain === 'vendor' && s.affected_asset_ids.includes(a.id))
    ).length;

    const softwareAssets = assets.filter(a =>
      a.assetType === 'software' ||
      a.assetType === 'application' ||
      signals.some(s => s.signal_domain === 'software' && s.affected_asset_ids.includes(a.id))
    ).length;

    const overallRiskScore = this.calculateOverallRiskScore(assets);
    const complianceStatus = this.determineComplianceStatus(assets);

    const keyFindings = this.extractKeyFindings(assets, signals);

    return {
      totalAssets: assets.length,
      criticalAssets,
      highRiskAssets,
      privacyAssets,
      vendorAssets,
      softwareAssets,
      overallRiskScore,
      complianceStatus,
      keyFindings,
    };
  }

  /**
   * Calculate report metrics
   */
  private static calculateMetrics(
    assets: Asset[],
    enrichedData?: {
      cyberCorrect?: unknown[];
      vendorSoluce?: unknown[];
      technoSoluce?: Array<{ vulnerabilityCount?: number } | unknown>;
    }
  ): ReportMetrics {
    const riskDistribution = {
      critical: assets.filter(a => (a.riskScore || 0) >= 80).length,
      high: assets.filter(a => (a.riskScore || 0) >= 60 && (a.riskScore || 0) < 80).length,
      medium: assets.filter(a => (a.riskScore || 0) >= 40 && (a.riskScore || 0) < 60).length,
      low: assets.filter(a => (a.riskScore || 0) < 40).length,
    };

    const complianceCoverage = this.calculateComplianceCoverage(assets);

    const privacyExposure = {
      piiAssets: assets.filter(a => 
        a.dataClassification === 'Confidential' || a.dataClassification === 'Restricted'
      ).length,
      highRiskPrivacy: assets.filter(a => 
        (a.riskScore || 0) >= 70 && 
        (a.dataClassification === 'Confidential' || a.dataClassification === 'Restricted')
      ).length,
    };

    const vendorRisk = {
      totalVendors: assets.filter(a => a.assetType === 'vendor' || a.assetType === 'service').length,
      highRiskVendors: assets.filter(a => 
        (a.assetType === 'vendor' || a.assetType === 'service') && 
        (a.riskScore || 0) >= 70
      ).length,
      criticalVendors: assets.filter(a => 
        (a.assetType === 'vendor' || a.assetType === 'service') && 
        a.businessCriticality === 'critical'
      ).length,
    };

    const softwareRisk = {
      totalSoftware: assets.filter(a => a.assetType === 'software' || a.assetType === 'application').length,
      withSBOM: assets.filter(a => a.technoSoluceData?.sbomAvailable).length,
      vulnerabilities: enrichedData?.technoSoluce?.reduce((sum: number, item: { vulnerabilityCount?: number } | unknown) => {
        const vulnItem = item as { vulnerabilityCount?: number };
        return sum + (vulnItem.vulnerabilityCount || 0);
      }, 0) || 0,
    };

    return {
      assetCount: assets.length,
      riskDistribution,
      complianceCoverage,
      privacyExposure,
      vendorRisk,
      softwareRisk,
    };
  }

  /**
   * Generate report sections based on stakeholder type
   */
  private static generateSections(
    assets: Asset[],
    signals: FocusSignal[],
    stakeholderType: StakeholderType,
    enrichedData?: {
      cyberCorrect?: unknown[];
      vendorSoluce?: unknown[];
      technoSoluce?: unknown[];
    }
  ): ReportSection[] {
    switch (stakeholderType) {
      case 'executive':
        return this.generateExecutiveSections(assets, signals, enrichedData);
      case 'technical':
        return this.generateTechnicalSections(assets, signals, enrichedData);
      case 'compliance':
        return this.generateComplianceSections(assets, signals, enrichedData);
      case 'vendor-management':
        return this.generateVendorSections(assets, signals, enrichedData);
      case 'comprehensive':
        return this.generateComprehensiveSections(assets, signals, enrichedData);
      default:
        return [];
    }
  }

  /**
   * Generate executive report sections
   */
  private static generateExecutiveSections(
    assets: Asset[],
    signals: FocusSignal[],
    enrichedData?: {
      cyberCorrect?: unknown[];
      vendorSoluce?: unknown[];
      technoSoluce?: unknown[];
    }
  ): ReportSection[] {
    void enrichedData; // Reserved for future use
    return [
      {
        title: 'Executive Summary',
        content: `Total assets: ${assets.length}. Critical assets: ${assets.filter(a => a.businessCriticality === 'critical').length}. Overall risk score: ${this.calculateOverallRiskScore(assets)}/100.`,
        priority: 'high',
        charts: [
          {
            type: 'donut',
            title: 'Risk Distribution',
            data: this.getRiskDistributionData(assets),
            labels: ['Critical', 'High', 'Medium', 'Low'],
          },
        ],
      },
      {
        title: 'Key Risk Areas',
        content: this.generateKeyRiskAreasContent(assets, signals),
        priority: 'high',
      },
      {
        title: 'Strategic Recommendations',
        content: this.generateStrategicRecommendations(assets, signals),
        priority: 'high',
      },
    ];
  }

  /**
   * Generate technical report sections
   */
  private static generateTechnicalSections(
    assets: Asset[],
    signals: FocusSignal[],
    enrichedData?: {
      cyberCorrect?: unknown[];
      vendorSoluce?: unknown[];
      technoSoluce?: unknown[];
    }
  ): ReportSection[] {
    void signals; // Reserved for future use
    void enrichedData; // Reserved for future use
    return [
      {
        title: 'Asset Inventory Overview',
        content: `Total assets: ${assets.length}. Software assets: ${assets.filter(a => a.assetType === 'software' || a.assetType === 'application').length}.`,
        priority: 'high',
        tables: [
          {
            title: 'Top Risk Assets',
            headers: ['Asset', 'Type', 'Risk Score', 'Criticality'],
            rows: assets
              .sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0))
              .slice(0, 10)
              .map(a => [
                a.name,
                a.type,
                (a.riskScore || 0).toString(),
                a.criticality || 'N/A',
              ]),
          },
        ],
      },
      {
        title: 'SBOM Status',
        content: `Software assets with SBOM: ${assets.filter(a => a.technoSoluceData?.sbomAvailable).length} of ${assets.filter(a => a.assetType === 'software' || a.assetType === 'application').length}.`,
        priority: 'medium',
      },
    ];
  }

  /**
   * Generate compliance report sections
   */
  private static generateComplianceSections(
    assets: Asset[],
    signals: FocusSignal[],
    enrichedData?: {
      cyberCorrect?: unknown[];
      vendorSoluce?: unknown[];
      technoSoluce?: unknown[];
    }
  ): ReportSection[] {
    void signals; // Reserved for future use
    void enrichedData; // Reserved for future use
    return [
      {
        title: 'Compliance Framework Coverage',
        content: this.generateComplianceCoverageContent(assets),
        priority: 'high',
        charts: [
          {
            type: 'bar',
            title: 'Framework Coverage',
            data: this.getComplianceCoverageData(assets),
            labels: this.getComplianceFrameworks(assets),
          },
        ],
      },
      {
        title: 'Privacy Compliance',
        content: `Assets with PII: ${assets.filter(a => a.dataClassification === 'Confidential' || a.dataClassification === 'Restricted').length}.`,
        priority: 'high',
      },
    ];
  }

  /**
   * Generate vendor management sections
   */
  private static generateVendorSections(
    assets: Asset[],
    signals: FocusSignal[],
    enrichedData?: {
      cyberCorrect?: unknown[];
      vendorSoluce?: unknown[];
      technoSoluce?: unknown[];
    }
  ): ReportSection[] {
    void signals; // Reserved for future use
    void enrichedData; // Reserved for future use
    const vendorAssets = assets.filter(a => a.assetType === 'vendor' || a.assetType === 'service');
    
    return [
      {
        title: 'Vendor Risk Overview',
        content: `Total vendors: ${vendorAssets.length}. High-risk vendors: ${vendorAssets.filter(a => (a.riskScore || 0) >= 70).length}.`,
        priority: 'high',
        tables: [
          {
            title: 'Vendor Risk Matrix',
            headers: ['Vendor', 'Risk Score', 'Criticality', 'Status'],
            rows: vendorAssets
              .sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0))
              .slice(0, 10)
              .map(a => [
                a.name,
                (a.riskScore || 0).toString(),
                a.criticality || 'N/A',
                a.status || 'Active',
              ]),
          },
        ],
      },
    ];
  }

  /**
   * Generate comprehensive sections
   */
  private static generateComprehensiveSections(
    assets: Asset[],
    signals: FocusSignal[],
    enrichedData?: {
      cyberCorrect?: unknown[];
      vendorSoluce?: unknown[];
      technoSoluce?: unknown[];
    }
  ): ReportSection[] {
    return [
      ...this.generateExecutiveSections(assets, signals, enrichedData),
      ...this.generateTechnicalSections(assets, signals, enrichedData),
      ...this.generateComplianceSections(assets, signals, enrichedData),
      ...this.generateVendorSections(assets, signals, enrichedData),
    ];
  }

  /**
   * Generate recommendations
   */
  private static generateRecommendations(
    assets: Asset[],
    signals: FocusSignal[],
    stakeholderType: StakeholderType,
    summary: ReportSummary
  ): string[] {
    const recommendations: string[] = [];

    if (summary.highRiskAssets > 0) {
      recommendations.push(`Address ${summary.highRiskAssets} high-risk assets to reduce overall risk exposure`);
    }

    if (summary.privacyAssets > 0 && stakeholderType !== 'technical') {
      recommendations.push(`Conduct privacy impact assessments for ${summary.privacyAssets} privacy-relevant assets`);
    }

    if (summary.vendorAssets > 0 && stakeholderType === 'vendor-management') {
      recommendations.push(`Complete vendor risk assessments for ${summary.vendorAssets} vendor relationships`);
    }

    const softwareAssets = assets.filter(a => a.assetType === 'software' || a.assetType === 'application');
    const withSBOM = softwareAssets.filter(a => a.technoSoluceData?.sbomAvailable).length;
    if (softwareAssets.length > 0 && withSBOM < softwareAssets.length) {
      recommendations.push(`Generate SBOMs for ${softwareAssets.length - withSBOM} software assets without SBOM data`);
    }

    // Use signals to generate additional contextual recommendations
    const privacySignals = signals.filter(s => s.signal_domain === 'privacy');
    if (privacySignals.length > 0 && stakeholderType !== 'technical') {
      recommendations.push(`Review ${privacySignals.length} privacy-related signals for compliance requirements`);
    }

    const vendorSignals = signals.filter(s => s.signal_domain === 'vendor');
    if (vendorSignals.length > 0 && (stakeholderType === 'vendor-management' || stakeholderType === 'executive')) {
      recommendations.push(`Investigate ${vendorSignals.length} vendor dependency signals for supply chain risks`);
    }

    const softwareSignals = signals.filter(s => s.signal_domain === 'software');
    if (softwareSignals.length > 0 && stakeholderType === 'technical') {
      recommendations.push(`Address ${softwareSignals.length} software-related signals for security vulnerabilities`);
    }

    return recommendations;
  }

  /**
   * Export report to various formats
   */
  static exportReport(
    report: StakeholderReport,
    format: 'json' | 'pdf' | 'csv'
  ): Blob | string {
    switch (format) {
      case 'json':
        return JSON.stringify(report, null, 2);
      case 'csv':
        return this.exportToCSV(report);
      case 'pdf':
        // PDF export would require a PDF library
        // For now, return JSON as fallback
        return JSON.stringify(report, null, 2);
      default:
        return JSON.stringify(report, null, 2);
    }
  }

  /**
   * Export to CSV format
   */
  private static exportToCSV(report: StakeholderReport): string {
    const lines: string[] = [];
    
    // Header
    lines.push(`Report: ${report.title}`);
    lines.push(`Generated: ${report.generatedAt.toISOString()}`);
    lines.push('');
    
    // Summary
    lines.push('Summary');
    lines.push(`Total Assets,${report.summary.totalAssets}`);
    lines.push(`Critical Assets,${report.summary.criticalAssets}`);
    lines.push(`High Risk Assets,${report.summary.highRiskAssets}`);
    lines.push(`Overall Risk Score,${report.summary.overallRiskScore}`);
    lines.push('');
    
    // Recommendations
    lines.push('Recommendations');
    report.recommendations.forEach((rec, idx) => {
      lines.push(`${idx + 1},${rec}`);
    });
    
    return lines.join('\n');
  }

  // Helper methods
  private static calculateOverallRiskScore(assets: Asset[]): number {
    if (assets.length === 0) return 0;
    const total = assets.reduce((sum, a) => sum + (a.riskScore || 0), 0);
    return Math.round(total / assets.length);
  }

  private static determineComplianceStatus(assets: Asset[]): 'compliant' | 'partial' | 'non-compliant' {
    const withFrameworks = assets.filter(a => 
      a.complianceFrameworks && a.complianceFrameworks.length > 0
    ).length;
    
    const coverage = assets.length > 0 ? withFrameworks / assets.length : 0;
    
    if (coverage >= 0.8) return 'compliant';
    if (coverage >= 0.5) return 'partial';
    return 'non-compliant';
  }

  private static extractKeyFindings(assets: Asset[], signals: FocusSignal[]): string[] {
    const findings: string[] = [];
    
    const criticalAssets = assets.filter(a => a.businessCriticality === 'critical').length;
    if (criticalAssets > 0) {
      findings.push(`${criticalAssets} critical assets require immediate attention`);
    }
    
    const privacySignals = signals.filter(s => s.signal_domain === 'privacy').length;
    if (privacySignals > 0) {
      findings.push(`${privacySignals} privacy-related signals detected`);
    }
    
    const vendorSignals = signals.filter(s => s.signal_domain === 'vendor').length;
    if (vendorSignals > 0) {
      findings.push(`${vendorSignals} vendor dependency signals detected`);
    }
    
    return findings;
  }

  private static calculateComplianceCoverage(assets: Asset[]): { framework: string; coverage: number }[] {
    const frameworks = new Set<string>();
    assets.forEach(a => {
      a.complianceFrameworks?.forEach(f => frameworks.add(f));
    });
    
    return Array.from(frameworks).map(framework => {
      const withFramework = assets.filter(a => 
        a.complianceFrameworks?.includes(framework)
      ).length;
      return {
        framework,
        coverage: assets.length > 0 ? (withFramework / assets.length) * 100 : 0,
      };
    });
  }

  private static getReportTitle(stakeholderType: StakeholderType): string {
    const titles: Record<StakeholderType, string> = {
      executive: 'Executive Risk & Compliance Report',
      technical: 'Technical Asset Inventory Report',
      compliance: 'Compliance Status Report',
      'vendor-management': 'Vendor Risk Management Report',
      comprehensive: 'Comprehensive Asset Intelligence Report',
    };
    return titles[stakeholderType];
  }

  private static getDataSources(enrichedData?: {
    cyberCorrect?: unknown[];
    vendorSoluce?: unknown[];
    technoSoluce?: unknown[];
  }): string[] {
    const sources = ['CyberSoluce'];
    if (enrichedData?.cyberCorrect) sources.push('CyberCorrect');
    if (enrichedData?.vendorSoluce) sources.push('VendorSoluce');
    if (enrichedData?.technoSoluce) sources.push('TechnoSoluce');
    return sources;
  }

  private static getRiskDistributionData(assets: Asset[]): number[] {
    return [
      assets.filter(a => (a.riskScore || 0) >= 80).length,
      assets.filter(a => (a.riskScore || 0) >= 60 && (a.riskScore || 0) < 80).length,
      assets.filter(a => (a.riskScore || 0) >= 40 && (a.riskScore || 0) < 60).length,
      assets.filter(a => (a.riskScore || 0) < 40).length,
    ];
  }

  private static generateKeyRiskAreasContent(assets: Asset[], signals: FocusSignal[]): string {
    const areas: string[] = [];
    
    const criticalAssets = assets.filter(a => a.criticality === 'Critical');
    if (criticalAssets.length > 0) {
      areas.push(`${criticalAssets.length} critical assets`);
    }
    
    const privacySignals = signals.filter(s => s.signal_domain === 'privacy');
    if (privacySignals.length > 0) {
      areas.push(`${privacySignals.length} privacy exposure areas`);
    }
    
    return areas.length > 0 
      ? `Key risk areas identified: ${areas.join(', ')}.`
      : 'No significant risk areas identified.';
  }

  private static generateStrategicRecommendations(assets: Asset[], signals: FocusSignal[]): string {
    void signals; // Reserved for future use
    const recommendations: string[] = [];
    
    if (assets.filter(a => (a.riskScore || 0) >= 70).length > 0) {
      recommendations.push('Prioritize remediation of high-risk assets');
    }
    
    if (signals.filter((s: FocusSignal) => s.signal_domain === 'privacy').length > 0) {
      recommendations.push('Conduct privacy impact assessments');
    }
    
    return recommendations.length > 0
      ? recommendations.join('. ') + '.'
      : 'Continue monitoring asset inventory for emerging risks.';
  }

  private static generateComplianceCoverageContent(assets: Asset[]): string {
    const frameworks = this.getComplianceFrameworks(assets);
    const coverage = this.calculateComplianceCoverage(assets);
    
    return `Compliance frameworks tracked: ${frameworks.join(', ')}. Coverage ranges from ${Math.min(...coverage.map(c => c.coverage)).toFixed(0)}% to ${Math.max(...coverage.map(c => c.coverage)).toFixed(0)}%.`;
  }

  private static getComplianceFrameworks(assets: Asset[]): string[] {
    const frameworks = new Set<string>();
    assets.forEach(a => {
      a.complianceFrameworks?.forEach(f => frameworks.add(f));
    });
    return Array.from(frameworks);
  }

  private static getComplianceCoverageData(assets: Asset[]): number[] {
    return this.calculateComplianceCoverage(assets).map(c => c.coverage);
  }
}

