import React, { useState, useEffect } from 'react';
import { Package, CheckCircle, AlertCircle, Upload, ChevronRight, ChevronDown, Eye, Network, Layers } from 'lucide-react';
import { SBOMAutogenerationService, SBOMAutogenerationResult } from '../../services/sbom/sbomAutogenerationService';
import BaselineSBOMService from '../../services/sbom/baselineSBOMService';
import { LiteAsset } from '../../types/assetLite';
import { SBOMResult } from '../../types/sbomLite';
import { Asset } from '../../types/asset';
import { StorageService } from '../../services/storageServiceLite';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { toast } from 'react-hot-toast';

interface SBOMComponent {
  name: string;
  version?: string;
  purl?: string;
  type?: string;
  dependencies?: string[];
  licenses?: string[];
}

interface DependencyTree {
  component: SBOMComponent;
  dependencies: DependencyTree[];
  level: number;
}

// Convert LiteAsset to Asset for SBOM processing
const convertLiteAssetToAsset = (liteAsset: LiteAsset): Asset => {
  return {
    id: liteAsset.id,
    name: liteAsset.name,
    type: liteAsset.type === 'Software' ? 'Application' : liteAsset.type as Asset['type'],
    assetType: liteAsset.isSoftware ? 'software' : 'application',
    criticality: liteAsset.criticality,
    owner: liteAsset.owner,
    location: liteAsset.location,
    description: liteAsset.description,
    dataClassification: liteAsset.dataClassification || 'Internal',
    dataTypes: liteAsset.dataTypes || [],
    tags: liteAsset.tags || [],
    complianceFrameworks: [],
    riskScore: 0,
    lastAssessed: new Date(),
    relationships: [],
    vulnerabilities: [],
    status: 'Active',
    createdAt: liteAsset.createdAt,
    updatedAt: liteAsset.updatedAt,
    crossBorderTransfer: false,
    thirdPartySharing: false,
    encryptionStatus: 'Unknown',
    accessControls: [],
    privacyImpactAssessment: null,
    dataBreachHistory: [],
    dependencies: [],
    requirements: [],
    legalBasis: [],
    dataSubjectRights: [],
    technoSoluceData: {
      sbomAvailable: liteAsset.sbomAvailable || false,
      sbomAnalysis: liteAsset.sbomData,
    },
  };
};

// Convert SBOMAutogenerationResult to SBOMResult
const convertSBOMResult = (result: SBOMAutogenerationResult): SBOMResult => {
  return {
    assetId: result.assetId,
    assetName: result.assetName,
    status: result.status,
    baselineMatch: result.baselineMatch ? {
      id: result.baselineMatch.id,
      name: result.baselineMatch.name,
      version: result.baselineMatch.version,
      ecosystem: result.baselineMatch.ecosystem,
      path: result.baselineMatch.path,
      format: (result.baselineMatch.format === 'CycloneDX' || 
               result.baselineMatch.format === 'SPDX' || 
               result.baselineMatch.format === 'SWID') 
        ? result.baselineMatch.format 
        : 'CycloneDX' as const,
    } : undefined,
    sbomData: result.sbomData,
    error: result.error,
    message: result.message,
  };
};

export const SBOMManager: React.FC = () => {
  const [assets, setAssets] = useState<LiteAsset[]>([]);
  const [sbomResults, setSbomResults] = useState<SBOMResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSBOM, setSelectedSBOM] = useState<{ asset: LiteAsset; result: SBOMResult } | null>(null);
  const [expandedAssets, setExpandedAssets] = useState<Set<string>>(new Set());
  const [expandedComponents, setExpandedComponents] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'list' | 'tree'>('list');

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = () => {
    const assetList = StorageService.getAssets();
    setAssets(assetList);
  };

  const handleProcessSBOMs = async () => {
    setLoading(true);
    try {
      const convertedAssets = assets.map(asset => convertLiteAssetToAsset(asset));
      const baselines = await BaselineSBOMService.getAllBaselines();
      const results = await SBOMAutogenerationService.processSoftwareAssets(convertedAssets, baselines);
      const convertedResults = results.map(result => convertSBOMResult(result));
      setSbomResults(convertedResults);
      toast.success(`Processed ${convertedResults.length} software assets`);
    } catch (error) {
      console.error('SBOM processing failed:', error);
      toast.error('Failed to process SBOMs');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      toast.error('Please upload a JSON SBOM file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const sbomData = JSON.parse(e.target?.result as string);
        
        // Find the asset to attach this SBOM to
        const assetName = sbomData.metadata?.component?.name || 
                         sbomData.component?.name || 
                         file.name.replace('.json', '');
        
        const asset = assets.find(a => 
          a.name.toLowerCase().includes(assetName.toLowerCase()) ||
          assetName.toLowerCase().includes(a.name.toLowerCase())
        );

        if (asset) {
          StorageService.updateAsset(asset.id, {
            sbomAvailable: true,
            sbomData: sbomData,
          });
          loadAssets();
          toast.success(`SBOM uploaded and attached to ${asset.name}`);
        } else {
          toast.error('Could not find matching asset. Please create the asset first.');
        }
      } catch (error) {
        toast.error('Failed to parse SBOM file');
      }
    };
    reader.readAsText(file);
  };

  const handleViewSBOM = (asset: LiteAsset, result: SBOMResult) => {
    setSelectedSBOM({ asset, result });
  };

  const toggleExpand = (assetId: string) => {
    const newExpanded = new Set(expandedAssets);
    if (newExpanded.has(assetId)) {
      newExpanded.delete(assetId);
    } else {
      newExpanded.add(assetId);
    }
    setExpandedAssets(newExpanded);
  };

  const toggleComponentExpand = (componentId: string) => {
    const newExpanded = new Set(expandedComponents);
    if (newExpanded.has(componentId)) {
      newExpanded.delete(componentId);
    } else {
      newExpanded.add(componentId);
    }
    setExpandedComponents(newExpanded);
  };

  const parseSBOMComponents = (sbomData: any): SBOMComponent[] => {
    if (!sbomData) return [];

    // CycloneDX format
    if (sbomData.components) {
      return sbomData.components.map((comp: any) => ({
        name: comp.name || comp.purl || 'Unknown',
        version: comp.version,
        purl: comp.purl,
        type: comp.type,
        dependencies: comp.dependencies?.map((dep: any) => dep.ref || dep) || [],
        licenses: comp.licenses?.map((lic: any) => 
          lic.license?.id || lic.license?.name || lic.expression || 'Unknown'
        ) || [],
      }));
    }

    // SPDX format
    if (sbomData.packages) {
      return sbomData.packages.map((pkg: any) => ({
        name: pkg.name || pkg.SPDXID || 'Unknown',
        version: pkg.versionInfo,
        purl: pkg.externalRefs?.find((ref: any) => ref.referenceType === 'purl')?.referenceLocator,
        type: pkg.primaryPackagePurpose,
        dependencies: pkg.dependencies || [],
        licenses: pkg.licenseDeclared ? [pkg.licenseDeclared] : [],
      }));
    }

    // Fallback for other formats
    if (sbomData.bom?.components) {
      return sbomData.bom.components.map((comp: any) => ({
        name: comp.name || 'Unknown',
        version: comp.version,
        purl: comp.purl,
        type: comp.type,
        dependencies: comp.dependencies || [],
        licenses: comp.licenses || [],
      }));
    }

    return [];
  };

  const buildDependencyTree = (components: SBOMComponent[]): DependencyTree[] => {
    const componentMap = new Map<string, SBOMComponent>();
    components.forEach(comp => {
      const key = comp.purl || comp.name;
      componentMap.set(key, comp);
    });

    const rootComponents: DependencyTree[] = [];
    const processed = new Set<string>();

    components.forEach(comp => {
      const key = comp.purl || comp.name;
      if (!processed.has(key)) {
        const tree = buildTreeRecursive(comp, componentMap, processed, 0);
        if (tree) {
          rootComponents.push(tree);
        }
      }
    });

    return rootComponents;
  };

  const buildTreeRecursive = (
    component: SBOMComponent,
    componentMap: Map<string, SBOMComponent>,
    processed: Set<string>,
    level: number
  ): DependencyTree | null => {
    const key = component.purl || component.name;
    if (processed.has(key)) {
      return null; // Circular dependency
    }

    processed.add(key);
    const dependencies: DependencyTree[] = [];

    if (component.dependencies) {
      component.dependencies.forEach(depRef => {
        const dep = componentMap.get(depRef);
        if (dep) {
          const depTree = buildTreeRecursive(dep, componentMap, new Set(processed), level + 1);
          if (depTree) {
            dependencies.push(depTree);
          }
        }
      });
    }

    return {
      component,
      dependencies,
      level,
    };
  };

  const renderComponentList = (components: SBOMComponent[]) => {
    return (
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {components.map((component, index) => {
          const componentId = `${component.purl || component.name}-${index}`;
          const isExpanded = expandedComponents.has(componentId);
          const hasDependencies = component.dependencies && component.dependencies.length > 0;

          return (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg">
              <div
                className="p-3 bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => hasDependencies && toggleComponentExpand(componentId)}
              >
                <div className="flex items-center gap-2">
                  {hasDependencies && (
                    isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )
                  )}
                  {!hasDependencies && <div className="w-4 h-4" />}
                  <Package className="w-4 h-4 text-blue-500" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{component.name}</p>
                    {component.version && (
                      <p className="text-xs text-gray-600 dark:text-gray-400">v{component.version}</p>
                    )}
                    {component.purl && (
                      <p className="text-xs text-gray-500 font-mono truncate">{component.purl}</p>
                    )}
                  </div>
                  {hasDependencies && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                      {component.dependencies!.length} deps
                    </span>
                  )}
                  {component.licenses && component.licenses.length > 0 && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded">
                      {component.licenses[0]}
                    </span>
                  )}
                </div>
              </div>
              {isExpanded && hasDependencies && (
                <div className="pl-8 pr-3 pb-3 space-y-1">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-2 mb-1">Dependencies:</p>
                  {component.dependencies!.map((dep, depIndex) => (
                    <div key={depIndex} className="pl-4 py-1 text-xs text-gray-600 dark:text-gray-400 border-l-2 border-gray-300 dark:border-gray-600">
                      <Network className="w-3 h-3 inline mr-1" />
                      {dep}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderDependencyTree = (tree: DependencyTree[], level: number = 0): React.ReactNode => {
    return (
      <div className="space-y-1">
        {tree.map((node, index) => {
          const componentId = `${node.component.purl || node.component.name}-${level}-${index}`;
          const isExpanded = expandedComponents.has(componentId);
          const hasDependencies = node.dependencies.length > 0;

          return (
            <div key={index} className="pl-4">
              <div
                className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  level === 0 ? 'bg-gray-50 dark:bg-gray-800' : ''
                }`}
                onClick={() => hasDependencies && toggleComponentExpand(componentId)}
              >
                {hasDependencies && (
                  isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )
                )}
                {!hasDependencies && <div className="w-4 h-4" />}
                <Layers className="w-4 h-4 text-purple-500" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{node.component.name}</p>
                  {node.component.version && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">v{node.component.version}</p>
                  )}
                </div>
                {hasDependencies && (
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded">
                    {node.dependencies.length}
                  </span>
                )}
              </div>
              {isExpanded && hasDependencies && (
                <div className="ml-4 border-l-2 border-gray-300 dark:border-gray-600">
                  {renderDependencyTree(node.dependencies, level + 1)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderSBOMComponents = (sbomData: Record<string, unknown>) => {
    const components = parseSBOMComponents(sbomData);
    if (components.length === 0) return <p className="text-sm text-gray-500">No components found</p>;

    const dependencyTree = buildDependencyTree(components);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">
            {components.length} component{components.length !== 1 ? 's' : ''} found
          </p>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              List View
            </Button>
            <Button
              variant={viewMode === 'tree' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('tree')}
            >
              Tree View
            </Button>
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {viewMode === 'list' ? (
            renderComponentList(components)
          ) : (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              {dependencyTree.length > 0 ? (
                renderDependencyTree(dependencyTree)
              ) : (
                <p className="text-sm text-gray-500">No dependency tree available. Showing list view.</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const getStatusIcon = (status: SBOMResult['status']) => {
    switch (status) {
      case 'auto-generated':
      case 'already-exists':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'upload-required':
        return <Upload className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: SBOMResult['status']) => {
    switch (status) {
      case 'auto-generated':
      case 'already-exists':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'upload-required':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const softwareAssets = assets.filter(a => a.isSoftware);
  const assetsWithSBOM = assets.filter(a => a.sbomAvailable);

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              SBOM Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage Software Bill of Materials and dependencies for software assets
            </p>
          </div>
          <div className="flex gap-2">
            <label>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button variant="outline" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload SBOM
                </span>
              </Button>
            </label>
            <Button
              onClick={handleProcessSBOMs}
              disabled={loading}
            >
              <Package className="w-4 h-4 mr-2" />
              {loading ? 'Processing...' : 'Process SBOMs'}
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Software Assets</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{softwareAssets.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">With SBOM</p>
              <p className="text-2xl font-bold text-green-600">{assetsWithSBOM.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{softwareAssets.length - assetsWithSBOM.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* SBOM Results */}
        {sbomResults.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>SBOM Processing Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sbomResults.map((result) => {
                  const asset = assets.find(a => a.id === result.assetId);
                  if (!asset) return null;

                  return (
                    <div
                      key={result.assetId}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="flex items-center gap-2">
                            {expandedAssets.has(asset.id) ? (
                              <ChevronDown
                                className="w-4 h-4 cursor-pointer"
                                onClick={() => toggleExpand(asset.id)}
                              />
                            ) : (
                              <ChevronRight
                                className="w-4 h-4 cursor-pointer"
                                onClick={() => toggleExpand(asset.id)}
                              />
                            )}
                            {getStatusIcon(result.status)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">{result.assetName}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{result.message}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(result.status)}`}>
                            {result.status}
                          </span>
                        </div>
                        {result.sbomData && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewSBOM(asset, result)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        )}
                      </div>
                      {expandedAssets.has(asset.id) && (
                        <div className="mt-4 pl-8 text-sm text-gray-600 dark:text-gray-400">
                          {result.baselineMatch && (
                            <p>Baseline: {result.baselineMatch.name} (v{result.baselineMatch.version})</p>
                          )}
                          {result.error && (
                            <p className="text-red-600">Error: {result.error}</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Assets with SBOM */}
        {assetsWithSBOM.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Assets with SBOM ({assetsWithSBOM.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {assetsWithSBOM.map((asset) => {
                  const components = parseSBOMComponents(asset.sbomData);
                  const totalDependencies = components.reduce((sum, comp) => 
                    sum + (comp.dependencies?.length || 0), 0
                  );

                  return (
                    <div
                      key={asset.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {expandedAssets.has(asset.id) ? (
                              <ChevronDown
                                className="w-4 h-4 cursor-pointer"
                                onClick={() => toggleExpand(asset.id)}
                              />
                            ) : (
                              <ChevronRight
                                className="w-4 h-4 cursor-pointer"
                                onClick={() => toggleExpand(asset.id)}
                              />
                            )}
                            <Package className="w-5 h-5 text-green-500" />
                            <p className="font-medium text-gray-900 dark:text-white">{asset.name}</p>
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded">
                              SBOM Available
                            </span>
                            {components.length > 0 && (
                              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                                {components.length} components
                              </span>
                            )}
                            {totalDependencies > 0 && (
                              <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded">
                                {totalDependencies} dependencies
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{asset.type} • {asset.criticality}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const result: SBOMResult = {
                              assetId: asset.id,
                              assetName: asset.name,
                              status: 'already-exists',
                              sbomData: asset.sbomData,
                              message: 'SBOM available',
                            };
                            handleViewSBOM(asset, result);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View SBOM
                        </Button>
                      </div>
                      {expandedAssets.has(asset.id) && asset.sbomData && (
                        <div className="mt-4 pl-8">
                          <h4 className="font-medium mb-2">SBOM Components & Dependencies</h4>
                          {renderSBOMComponents(asset.sbomData)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {sbomResults.length === 0 && assetsWithSBOM.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No SBOM results yet. Click "Process SBOMs" to analyze your software assets or upload an SBOM file.
              </p>
              {softwareAssets.length === 0 && (
                <p className="text-sm text-gray-500">
                  No software assets found. Mark assets as software in the asset management view.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* SBOM Detail Dialog */}
        {selectedSBOM && (
          <Dialog open={!!selectedSBOM} onOpenChange={() => setSelectedSBOM(null)}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>SBOM Details: {selectedSBOM.asset.name}</DialogTitle>
                <DialogDescription>
                  Software Bill of Materials with components and dependencies
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Asset Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Name:</span>{' '}
                      <span className="font-medium">{selectedSBOM.asset.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Type:</span>{' '}
                      <span className="font-medium">{selectedSBOM.asset.type}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>{' '}
                      <span className={`px-2 py-1 text-xs rounded ${getStatusColor(selectedSBOM.result.status)}`}>
                        {selectedSBOM.result.status}
                      </span>
                    </div>
                  </div>
                </div>
                {selectedSBOM.result.sbomData && (
                  <div>
                    <h3 className="font-semibold mb-2">Components & Dependencies</h3>
                    {renderSBOMComponents(selectedSBOM.result.sbomData)}
                  </div>
                )}
                {selectedSBOM.result.baselineMatch && (
                  <div>
                    <h3 className="font-semibold mb-2">Baseline Information</h3>
                    <div className="text-sm space-y-1">
                      <p><span className="text-gray-600 dark:text-gray-400">Name:</span> {selectedSBOM.result.baselineMatch.name}</p>
                      <p><span className="text-gray-600 dark:text-gray-400">Version:</span> {selectedSBOM.result.baselineMatch.version}</p>
                      {selectedSBOM.result.baselineMatch.ecosystem && (
                        <p><span className="text-gray-600 dark:text-gray-400">Ecosystem:</span> {selectedSBOM.result.baselineMatch.ecosystem}</p>
                      )}
                    </div>
                  </div>
                )}
                {selectedSBOM.result.sbomData && (
                  <div>
                    <h3 className="font-semibold mb-2">Raw SBOM Data</h3>
                    <pre className="p-4 bg-gray-50 dark:bg-gray-800 rounded text-xs overflow-x-auto max-h-64 overflow-y-auto">
                      {JSON.stringify(selectedSBOM.result.sbomData, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

