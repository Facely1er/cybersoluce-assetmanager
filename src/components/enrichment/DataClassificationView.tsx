import React, { useState, useEffect } from 'react';
import { Tag, CheckCircle, AlertCircle, RefreshCw, Check, X } from 'lucide-react';
import { DataClassificationService } from '../../services/dataClassificationService';
import { StorageService } from '../../services/storageServiceLite';
import { DataInventoryItem } from '../../types/dataInventory';
import { LiteAsset } from '../../types/assetLite';
import { DataClassification } from '../../types/classification';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { toast } from 'react-hot-toast';

export const DataClassificationView: React.FC = () => {
  const [assets, setAssets] = useState<LiteAsset[]>([]);
  const [dataItems, setDataItems] = useState<DataInventoryItem[]>([]);
  const [classificationResult, setClassificationResult] = useState<any>(null);
  const [selectedClassification, setSelectedClassification] = useState<{ item: DataInventoryItem; classification: DataClassification } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const items = StorageService.getDataInventory();
    const assetList = StorageService.getAssets();
    setDataItems(items);
    setAssets(assetList);
  };

  const handleClassify = () => {
    if (assets.length === 0) {
      toast.error('No assets found. Please add assets first.');
      return;
    }

    if (dataItems.length === 0) {
      toast.error('No data items found. Please add data items first.');
      return;
    }

    const result = DataClassificationService.classifyDataFromAssets(assets, dataItems);
    setClassificationResult(result);
    toast.success(`Classification complete: ${result.itemsClassified} items classified`);
  };

  const handleApplyAll = () => {
    if (!classificationResult) return;

    let applied = 0;
    classificationResult.classifications.forEach((classification: DataClassification, dataItemId: string) => {
      StorageService.updateDataInventoryItem(dataItemId, {
        classification: classification.suggestedClassification,
      });
      applied++;
    });

    toast.success(`Applied ${applied} classifications`);
    loadData();
    setClassificationResult(null);
  };

  const handleApplySingle = (dataItemId: string, classification: DataClassification) => {
    StorageService.updateDataInventoryItem(dataItemId, {
      classification: classification.suggestedClassification,
    });
    toast.success('Classification applied');
    loadData();
    
    // Remove from results
    if (classificationResult) {
      const newClassifications = new Map(classificationResult.classifications);
      newClassifications.delete(dataItemId);
      setClassificationResult({
        ...classificationResult,
        classifications: newClassifications,
        itemsClassified: newClassifications.size,
      });
    }
  };

  const handleViewDetails = (item: DataInventoryItem, classification: DataClassification) => {
    setSelectedClassification({ item, classification });
  };

  const classifications = classificationResult 
    ? Array.from(classificationResult.classifications.entries()).map(([id, classification]) => ({
        dataItem: dataItems.find(d => d.id === id)!,
        classification: classification as DataClassification,
      })).filter(item => item.dataItem)
    : [];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Data Classification
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Classify data based on asset characteristics ({dataItems.length} data items, {assets.length} assets)
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleClassify} disabled={assets.length === 0 || dataItems.length === 0}>
              <Tag className="w-4 h-4 mr-2" />
              Run Classification
            </Button>
          </div>
        </div>

        {classificationResult && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {classificationResult.overallConfidence === 'high' ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-yellow-500" />
                  )}
                  <CardTitle>Classification Results</CardTitle>
                </div>
                <Button onClick={handleApplyAll} size="sm">
                  Apply All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Items Classified</p>
                  <p className="text-2xl font-bold">{classificationResult.itemsClassified}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Unclassified</p>
                  <p className="text-2xl font-bold">{classificationResult.itemsUnclassified}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Confidence</p>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    classificationResult.overallConfidence === 'high'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : classificationResult.overallConfidence === 'medium'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {classificationResult.overallConfidence}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Rules Applied</p>
                  <p className="text-2xl font-bold">{classificationResult.rulesApplied}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {classifications.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Classification Suggestions ({classifications.length})
            </h2>
            {classifications.map(({ dataItem, classification }) => (
              <Card key={dataItem.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {dataItem.name}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded ${
                          dataItem.classification === 'Restricted' || dataItem.classification === 'Top Secret'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : dataItem.classification === 'Confidential'
                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          Current: {dataItem.classification}
                        </span>
                        <span className="text-gray-400">→</span>
                        <span className={`px-2 py-1 text-xs rounded ${
                          classification.suggestedClassification === 'Restricted' || classification.suggestedClassification === 'Top Secret'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : classification.suggestedClassification === 'Confidential'
                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          Suggested: {classification.suggestedClassification}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded ${
                          classification.confidence === 'high'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : classification.confidence === 'medium'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {classification.confidence} confidence
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {dataItem.location} • {dataItem.owner}
                      </p>
                      {classification.reasoning.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Reasoning:</p>
                          <ul className="list-disc list-inside space-y-1">
                            {classification.reasoning.slice(0, 2).map((reason, idx) => (
                              <li key={idx} className="text-xs text-gray-600 dark:text-gray-400">{reason}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(dataItem, classification)}
                      >
                        Details
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleApplySingle(dataItem.id, classification)}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Apply
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!classificationResult && (
          <Card>
            <CardContent className="p-12 text-center">
              <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Click "Run Classification" to classify your data items based on asset characteristics.
              </p>
              {(assets.length === 0 || dataItems.length === 0) && (
                <p className="text-sm text-gray-500">
                  {assets.length === 0 && 'No assets found. '}
                  {dataItems.length === 0 && 'No data items found. '}
                  Please add data in the respective views first.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Classification Details Dialog */}
        {selectedClassification && (
          <Dialog open={!!selectedClassification} onOpenChange={() => setSelectedClassification(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Classification Details: {selectedClassification.item.name}</DialogTitle>
                <DialogDescription>
                  Detailed classification reasoning and rules applied
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Suggested Classification</h3>
                  <p className={`px-3 py-2 rounded ${
                    selectedClassification.classification.suggestedClassification === 'Restricted' || selectedClassification.classification.suggestedClassification === 'Top Secret'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : selectedClassification.classification.suggestedClassification === 'Confidential'
                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {selectedClassification.classification.suggestedClassification}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Confidence</h3>
                  <span className={`px-2 py-1 rounded text-sm ${
                    selectedClassification.classification.confidence === 'high'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : selectedClassification.classification.confidence === 'medium'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {selectedClassification.classification.confidence}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Reasoning</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {selectedClassification.classification.reasoning.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Based on Assets</h3>
                  <div className="space-y-1">
                    {selectedClassification.classification.basedOnAssets.map((assetId) => {
                      const asset = assets.find(a => a.id === assetId);
                      return asset ? (
                        <div key={assetId} className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                          {asset.name} ({asset.type}, {asset.criticality})
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Rules Applied</h3>
                  <div className="space-y-1">
                    {selectedClassification.classification.rulesApplied.map((rule) => (
                      <div key={rule.id} className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                        <p className="font-medium">{rule.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{rule.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedClassification(null)}>
                  Close
                </Button>
                <Button onClick={() => {
                  handleApplySingle(selectedClassification.item.id, selectedClassification.classification);
                  setSelectedClassification(null);
                }}>
                  Apply Classification
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

