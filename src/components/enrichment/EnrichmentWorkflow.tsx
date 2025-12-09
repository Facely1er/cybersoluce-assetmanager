import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Database, Tag, Package, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { EnrichmentOrchestrator, EnrichmentResult } from '../../services/enrichmentOrchestrator';
import { StorageService } from '../../services/storageServiceLite';
import { DataInventoryItem } from '../../types/dataInventory';
import { LiteAsset } from '../../types/assetLite';
import { DataClassification } from '../../types/classification';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { toast } from 'react-hot-toast';
import { logger } from '../../utils/logger';

export const EnrichmentWorkflow: React.FC = () => {
  const [direction, setDirection] = useState<'data-to-assets' | 'assets-to-data' | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EnrichmentResult | null>(null);
  const [dataItems, setDataItems] = useState<DataInventoryItem[]>([]);
  const [assets, setAssets] = useState<LiteAsset[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const items = StorageService.getDataInventory();
    const assetList = StorageService.getAssets();
    setDataItems(items);
    setAssets(assetList);
  };

  const handleEnrich = async (dir: 'data-to-assets' | 'assets-to-data') => {
    setDirection(dir);
    setLoading(true);
    setResult(null);

    if (dir === 'data-to-assets' && dataItems.length === 0) {
      toast.error('No data items found. Please add data items first.');
      setLoading(false);
      return;
    }

    if (dir === 'assets-to-data' && assets.length === 0) {
      toast.error('No assets found. Please add assets first.');
      setLoading(false);
      return;
    }

    try {
      let enrichmentResult;
      if (dir === 'data-to-assets') {
        enrichmentResult = await EnrichmentOrchestrator.enrichDataToAssets(
          dataItems,
          assets
        );
        toast.success(`Discovery complete: ${enrichmentResult.assetDiscovery?.discoveredAssets.length || 0} assets discovered`);
      } else {
        enrichmentResult = await EnrichmentOrchestrator.enrichAssetsToData(
          assets,
          dataItems
        );
        toast.success(`Classification complete: ${enrichmentResult.dataClassification?.itemsClassified || 0} items classified`);
      }
      setResult(enrichmentResult);
    } catch (error) {
      logger.error('Enrichment failed', error instanceof Error ? error : new Error(String(error)));
      toast.error('Enrichment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyResults = () => {
    if (!result) return;

    if (result.direction === 'data-to-assets' && result.assetDiscovery) {
      // Add discovered assets
      result.assetDiscovery.discoveredAssets.forEach((asset: LiteAsset) => {
        StorageService.addAsset(asset);
      });

      // Update data items with supporting assets
      result.assetDiscovery.suggestedMappings.forEach((assetIds: string[], dataItemId: string) => {
        StorageService.updateDataInventoryItem(dataItemId, {
          supportingAssets: assetIds,
        });
      });

      toast.success('Asset discoveries applied successfully');
    } else if (result.direction === 'assets-to-data' && result.dataClassification) {
      // Apply classifications
      result.dataClassification.classifications.forEach((classification: DataClassification, dataItemId: string) => {
        StorageService.updateDataInventoryItem(dataItemId, {
          classification: classification.suggestedClassification,
        });
      });

      toast.success('Data classifications applied successfully');
    }

    loadData();
    setResult(null);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Enrichment Workflow
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Bidirectional data enrichment and classification
            </p>
          </div>
          <Button variant="outline" onClick={loadData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Data Items</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{dataItems.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Assets</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{assets.length}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Data to Assets */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Database className="w-8 h-8 text-[#005B96] dark:text-[#33A1DE]" />
                <CardTitle>Data → Assets</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Discover supporting assets from your data inventory
              </p>
              <Button
                onClick={() => handleEnrich('data-to-assets')}
                disabled={loading || dataItems.length === 0}
                className="w-full"
              >
                {loading && direction === 'data-to-assets' ? 'Processing...' : 'Start Discovery'}
              </Button>
              <Link
                to="/dashboard/asset-discovery"
                className="flex items-center gap-1 mt-4 text-sm text-[#005B96] dark:text-[#33A1DE] hover:underline"
              >
                View Asset Discovery <ArrowRight className="w-4 h-4" />
              </Link>
            </CardContent>
          </Card>

          {/* Assets to Data */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Tag className="w-8 h-8 text-[#005B96] dark:text-[#33A1DE]" />
                <CardTitle>Assets → Data</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Classify data based on asset characteristics
              </p>
              <Button
                onClick={() => handleEnrich('assets-to-data')}
                disabled={loading || assets.length === 0}
                className="w-full"
              >
                {loading && direction === 'assets-to-data' ? 'Processing...' : 'Start Classification'}
              </Button>
              <Link
                to="/dashboard/data-classification"
                className="flex items-center gap-1 mt-4 text-sm text-[#005B96] dark:text-[#33A1DE] hover:underline"
              >
                View Classification <ArrowRight className="w-4 h-4" />
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* SBOM Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-[#005B96] dark:text-[#33A1DE]" />
              <CardTitle>SBOM Management</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Manage Software Bill of Materials for identified software assets
            </p>
            <Link to="/dashboard/sbom">
              <Button variant="outline">Manage SBOMs</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {result.success ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-500" />
                  )}
                  <CardTitle>Enrichment Results</CardTitle>
                </div>
                {result.success && (
                  <Button onClick={handleApplyResults} size="sm">
                    Apply Results
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Direction:</span>{' '}
                    <span className="text-gray-600 dark:text-gray-400">{result.direction}</span>
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>{' '}
                    <span className={`px-2 py-1 rounded text-xs ${
                      result.success
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {result.success ? 'Success' : 'Failed'}
                    </span>
                  </div>
                </div>

                {result.assetDiscovery && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Asset Discovery Results</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Discovered Assets:</span>{' '}
                        <span className="text-gray-600 dark:text-gray-400">
                          {result.assetDiscovery.discoveredAssets.length}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">Mappings:</span>{' '}
                        <span className="text-gray-600 dark:text-gray-400">
                          {result.assetDiscovery.suggestedMappings.size}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">Confidence:</span>{' '}
                        <span className={`px-2 py-1 rounded text-xs ${
                          result.assetDiscovery.confidence === 'high'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : result.assetDiscovery.confidence === 'medium'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {result.assetDiscovery.confidence}
                        </span>
                      </p>
                      {result.assetDiscovery.reasoning.length > 0 && (
                        <div className="mt-2">
                          <p className="font-medium mb-1">Reasoning:</p>
                          <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                            {result.assetDiscovery.reasoning.slice(0, 3).map((reason: string, idx: number) => (
                              <li key={idx} className="text-xs">{reason}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {result.dataClassification && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Data Classification Results</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Items Classified:</span>{' '}
                        <span className="text-gray-600 dark:text-gray-400">
                          {result.dataClassification.itemsClassified}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">Items Unclassified:</span>{' '}
                        <span className="text-gray-600 dark:text-gray-400">
                          {result.dataClassification.itemsUnclassified}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">Overall Confidence:</span>{' '}
                        <span className={`px-2 py-1 rounded text-xs ${
                          result.dataClassification.overallConfidence === 'high'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : result.dataClassification.overallConfidence === 'medium'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {result.dataClassification.overallConfidence}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">Rules Applied:</span>{' '}
                        <span className="text-gray-600 dark:text-gray-400">
                          {result.dataClassification.rulesApplied}
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                {result.sbomResults && result.sbomResults.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">SBOM Processing</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {result.sbomResults.length} software assets processed for SBOM
                    </p>
                  </div>
                )}

                {result.errors && result.errors.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-red-600 mb-2">Errors</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
                      {result.errors.map((error: string, idx: number) => (
                        <li key={idx}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
};

