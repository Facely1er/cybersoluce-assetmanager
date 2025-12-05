/**
 * Enhanced Baseline SBOM Service
 * Supports business applications, dependency mappings, and usage heat maps
 * Ported from CyberSoluce-Lite with full feature parity
 */

export interface BaselineSBOM {
  id: string;
  name: string;
  version: string;
  ecosystem?: string;
  category?: string;
  path: string;
  format: 'CycloneDX' | 'SPDX' | 'SWID';
  description?: string;
  purl?: string;
  license?: string;
}

export interface ComponentDependency {
  componentId: string;
  relationship: 'uses' | 'depends-on' | 'includes';
  criticality: 'low' | 'medium' | 'high' | 'critical';
  usage: string;
}

export interface BusinessApplication {
  id: string;
  name: string;
  version: string;
  category: string;
  industry: string[];
  path: string;
  description: string;
  vendor: string;
  deployment: 'cloud' | 'on-premise' | 'hybrid';
  license: string;
  usage: {
    marketShare?: number;
    enterpriseAdoption?: number;
    downloads?: number;
    activeUsers?: number;
    heatMapScore: number;
  };
  functions: string[];
  dependencies: ComponentDependency[];
  sbomComponents: string[];
  lastUpdated: string;
  format: string;
}

export interface ComponentUsage {
  appId: string;
  appName: string;
  usage: string;
  criticality: string;
}

export interface ComponentMapping {
  usedBy: ComponentUsage[];
  usageCount: number;
  heatMapScore: number;
}

export interface ApplicationMapping {
  directDependencies: string[];
  transitiveDependencies: string[];
  dependencyDepth: number;
  totalComponents: number;
}

export interface DependencyMapping {
  byComponent: Record<string, ComponentMapping>;
  byApplication: Record<string, ApplicationMapping>;
}

export interface CategoryHeatMap {
  score: number;
  applications?: string[];
  components?: string[];
  totalUsage: number;
}

export interface UsageHeatMap {
  byCategory: Record<string, CategoryHeatMap>;
  byFunction: Record<string, number>;
  byIndustry: Record<string, number>;
}

export interface BaselineIndex {
  version: string;
  lastUpdated: string;
  description: string;
  baselineSBOMs: BaselineSBOM[];
  businessApplications?: BusinessApplication[];
  dependencyMappings?: DependencyMapping;
  usageHeatMap?: UsageHeatMap;
  categories?: Record<string, string>;
  ecosystems?: Record<string, string>;
}

class BaselineSBOMService {
  private static indexCache: BaselineIndex | null = null;
  private static loadPromise: Promise<BaselineIndex> | null = null;

  /**
   * Load the baseline SBOM index
   */
  static async loadIndex(): Promise<BaselineIndex> {
    // Return cached index if available
    if (this.indexCache) {
      return this.indexCache;
    }

    // Return existing promise if already loading
    if (this.loadPromise) {
      return this.loadPromise;
    }

    // Load index from Unified Platform or local baseline directory
    this.loadPromise = fetch('/baseline-sboms/index.json')
      .then(response => {
        if (!response.ok) {
          // If baseline directory not available, return empty index
          console.warn('Baseline SBOM index not available, using empty index');
          return {
            version: '1.0.0',
            lastUpdated: new Date().toISOString(),
            description: 'Empty baseline index',
            baselineSBOMs: [],
            businessApplications: [],
            dependencyMappings: { byComponent: {}, byApplication: {} },
            usageHeatMap: { byCategory: {}, byFunction: {}, byIndustry: {} },
            categories: {},
            ecosystems: {},
          };
        }
        return response.json();
      })
      .then((data: BaselineIndex) => {
        this.indexCache = data;
        return data;
      })
      .catch(error => {
        console.error('Error loading baseline SBOM index:', error);
        this.loadPromise = null;
        // Return empty index on error
        return {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          description: 'Empty baseline index (error)',
          baselineSBOMs: [],
          businessApplications: [],
          dependencyMappings: { byComponent: {}, byApplication: {} },
          usageHeatMap: { byCategory: {}, byFunction: {}, byIndustry: {} },
          categories: {},
          ecosystems: {},
        };
      });

    return this.loadPromise;
  }

  /**
   * Get all baseline SBOMs
   */
  static async getAllBaselines(): Promise<BaselineSBOM[]> {
    const index = await this.loadIndex();
    return index.baselineSBOMs || [];
  }

  /**
   * Get baseline SBOMs by ecosystem
   */
  static async getByEcosystem(ecosystem: string): Promise<BaselineSBOM[]> {
    const baselines = await this.getAllBaselines();
    return baselines.filter(b => b.ecosystem === ecosystem);
  }

  /**
   * Get baseline SBOMs by category
   */
  static async getByCategory(category: string): Promise<BaselineSBOM[]> {
    const baselines = await this.getAllBaselines();
    return baselines.filter(b => b.category === category);
  }

  /**
   * Search baseline SBOMs by name or description
   */
  static async search(query: string): Promise<BaselineSBOM[]> {
    const baselines = await this.getAllBaselines();
    const lowerQuery = query.toLowerCase();
    return baselines.filter(b => 
      b.name.toLowerCase().includes(lowerQuery) ||
      (b.description?.toLowerCase().includes(lowerQuery) ?? false)
    );
  }

  /**
   * Get a specific baseline SBOM by ID
   */
  static async getById(id: string): Promise<BaselineSBOM | undefined> {
    const baselines = await this.getAllBaselines();
    return baselines.find(b => b.id === id);
  }

  /**
   * Get available ecosystems
   */
  static async getEcosystems(): Promise<string[]> {
    const index = await this.loadIndex();
    return Object.keys(index.ecosystems || {});
  }

  /**
   * Get available categories
   */
  static async getCategories(): Promise<string[]> {
    const index = await this.loadIndex();
    return Object.keys(index.categories || {});
  }

  /**
   * Download a baseline SBOM file
   */
  static async downloadBaseline(path: string, filename: string): Promise<void> {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error('Failed to download baseline file');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading baseline:', error);
      throw error;
    }
  }

  /**
   * Get ecosystem icon (for UI)
   */
  static getEcosystemIcon(ecosystem: string): string {
    const icons: Record<string, string> = {
      npm: '📦',
      pypi: '🐍',
      maven: '☕',
      nuget: '🔷',
      docker: '🐳',
    };
    return icons[ecosystem.toLowerCase()] || '📄';
  }

  /**
   * Get category color (for UI)
   */
  static getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      framework: 'bg-blue-100 text-blue-800',
      library: 'bg-green-100 text-green-800',
      application: 'bg-purple-100 text-purple-800',
      container: 'bg-orange-100 text-orange-800',
    };
    return colors[category.toLowerCase()] || 'bg-gray-100 text-gray-800';
  }

  // Business application methods
  static async getBusinessApplications(): Promise<BusinessApplication[]> {
    const index = await this.loadIndex();
    return index.businessApplications || [];
  }

  static async getBusinessAppById(id: string): Promise<BusinessApplication | undefined> {
    const apps = await this.getBusinessApplications();
    return apps.find(app => app.id === id);
  }

  static async getBusinessAppsByCategory(category: string): Promise<BusinessApplication[]> {
    const apps = await this.getBusinessApplications();
    return apps.filter(app => app.category === category);
  }

  static async getBusinessAppsByIndustry(industry: string): Promise<BusinessApplication[]> {
    const apps = await this.getBusinessApplications();
    return apps.filter(app => app.industry.includes(industry));
  }

  static async searchBusinessApps(query: string): Promise<BusinessApplication[]> {
    const apps = await this.getBusinessApplications();
    const lowerQuery = query.toLowerCase();
    return apps.filter(app => 
      app.name.toLowerCase().includes(lowerQuery) ||
      app.description.toLowerCase().includes(lowerQuery) ||
      app.vendor.toLowerCase().includes(lowerQuery) ||
      app.functions.some(f => f.toLowerCase().includes(lowerQuery))
    );
  }

  // Dependency mapping methods
  static async getDependencyMappings(): Promise<DependencyMapping> {
    const index = await this.loadIndex();
    return index.dependencyMappings || { byComponent: {}, byApplication: {} };
  }

  static async getAppsUsingComponent(componentId: string): Promise<ComponentUsage[]> {
    const mappings = await this.getDependencyMappings();
    const componentMapping = mappings.byComponent[componentId];
    return componentMapping?.usedBy || [];
  }

  static async getComponentDependencies(appId: string): Promise<string[]> {
    const mappings = await this.getDependencyMappings();
    const appMapping = mappings.byApplication[appId];
    if (!appMapping) return [];
    
    return [
      ...(appMapping.directDependencies || []),
      ...(appMapping.transitiveDependencies || [])
    ];
  }

  static async getDirectDependencies(appId: string): Promise<string[]> {
    const mappings = await this.getDependencyMappings();
    return mappings.byApplication[appId]?.directDependencies || [];
  }

  static async getTransitiveDependencies(appId: string): Promise<string[]> {
    const mappings = await this.getDependencyMappings();
    return mappings.byApplication[appId]?.transitiveDependencies || [];
  }

  static async getComponentUsageStats(componentId: string): Promise<ComponentMapping | null> {
    const mappings = await this.getDependencyMappings();
    return mappings.byComponent[componentId] || null;
  }

  static async getApplicationMapping(appId: string): Promise<ApplicationMapping | null> {
    const mappings = await this.getDependencyMappings();
    return mappings.byApplication[appId] || null;
  }

  // Usage heat map methods
  static async getUsageHeatMap(): Promise<UsageHeatMap> {
    const index = await this.loadIndex();
    return index.usageHeatMap || { byCategory: {}, byFunction: {}, byIndustry: {} };
  }

  static async getCategoryHeatMap(category: string): Promise<CategoryHeatMap | null> {
    const heatMap = await this.getUsageHeatMap();
    return heatMap.byCategory[category] || null;
  }

  static async getFunctionHeatMap(functionName: string): Promise<number | null> {
    const heatMap = await this.getUsageHeatMap();
    return heatMap.byFunction[functionName] || null;
  }

  static async getIndustryHeatMap(industry: string): Promise<number | null> {
    const heatMap = await this.getUsageHeatMap();
    return heatMap.byIndustry[industry] || null;
  }

  static async getTopComponentsByUsage(limit: number = 10): Promise<Array<{ componentId: string; usageCount: number; heatMapScore: number }>> {
    const mappings = await this.getDependencyMappings();
    const components = Object.entries(mappings.byComponent || {})
      .map(([componentId, mapping]) => ({
        componentId,
        usageCount: mapping.usageCount,
        heatMapScore: mapping.heatMapScore
      }))
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
    
    return components;
  }

  static async getTopBusinessAppsByUsage(limit: number = 10): Promise<BusinessApplication[]> {
    const apps = await this.getBusinessApplications();
    return apps
      .sort((a, b) => (b.usage.heatMapScore || 0) - (a.usage.heatMapScore || 0))
      .slice(0, limit);
  }

  // Combined search across baselines and business apps
  static async searchAll(query: string): Promise<{
    baselines: BaselineSBOM[];
    businessApps: BusinessApplication[];
  }> {
    const [baselines, businessApps] = await Promise.all([
      this.search(query),
      this.searchBusinessApps(query)
    ]);
    
    return { baselines, businessApps };
  }

  // Clear cache (useful for testing or forced refresh)
  static clearCache(): void {
    this.indexCache = null;
    this.loadPromise = null;
  }
}

export default BaselineSBOMService;
