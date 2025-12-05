import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, AlertCircle, ArrowRight, Plus, X, Check, Database, Server, Package } from 'lucide-react';
import { AssetDiscoveryService } from '../../services/assetDiscoveryService';
import { DataInventoryItem } from '../../types/dataInventory';
import { LiteAsset } from '../../types/assetLite';
import { StorageService } from '../../services/storageServiceLite';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'react-hot-toast';

interface MappingDisplay {
  dataItem: DataInventoryItem;
  suggestedAssets: LiteAsset[];
  isNewAsset: boolean;
  selectedAssetIds: string[];
  confidence: 'high' | 'medium' | 'low';
}

export const AssetDiscoveryView: React.FC = () => {
  const [dataItems, setDataItems] = useState<DataInventoryItem[]>([]);
  const [assets, setAssets] = useState<LiteAsset[]>([]);
  const [discoveryResult, setDiscoveryResult] = useState<any>(null);
  const [mappings, setMappings] = useState<MappingDisplay[]>([]);
  const [selectedMapping, setSelectedMapping] = useState<MappingDisplay | null>(null);
  const [isCreateAssetDialogOpen, setIsCreateAssetDialogOpen] = useState(false);
  const [newAssetData, setNewAssetData] = useState<Partial<LiteAsset>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const items = StorageService.getDataInventory();
    const assetList = StorageService.getAssets();
    setDataItems(items);
    setAssets(assetList);
  };

  const handleDiscover = () => {
    if (dataItems.length === 0) {
      toast.error('No data items found. Please add data items first.');
      return;
    }

    const result = AssetDiscoveryService.discoverAssetsFromData(dataItems, assets);
    setDiscoveryResult(result);

    // Build mapping display
    const mappingDisplays: MappingDisplay[] = [];
    result.suggestedMappings.forEach((assetIds, dataItemId) => {
      const dataItem = dataItems.find(d => d.id === dataItemId);
      if (!dataItem) return;

      const suggestedAssets = assetIds
        .map(id => assets.find(a => a.id === id))
        .filter((a): a is LiteAsset => a !== undefined);

      const isNewAsset = suggestedAssets.length === 0 && result.discoveredAssets.some(a => a.relatedDataItems?.includes(dataItemId));

      mappingDisplays.push({
        dataItem,
        suggestedAssets: isNewAsset 
          ? result.discoveredAssets.filter(a => a.relatedDataItems?.includes(dataItemId))
          : suggestedAssets,
        isNewAsset,
        selectedAssetIds: assetIds,
        confidence: result.confidence,
      });
    });

    setMappings(mappingDisplays);
    toast.success(`Discovery complete: ${mappingDisplays.length} mappings found`);
  };

  const handleAcceptMapping = (mapping: MappingDisplay) => {
    // Update data item with supporting assets
    StorageService.updateDataInventoryItem(mapping.dataItem.id, {
      supportingAssets: mapping.selectedAssetIds,
    });

    // If new assets, add them
    if (mapping.isNewAsset) {
      mapping.suggestedAssets.forEach(asset => {
        StorageService.addAsset(asset);
      });
    }

    // Update assets with related data items
    mapping.selectedAssetIds.forEach(assetId => {
      const asset = assets.find(a => a.id === assetId) || mapping.suggestedAssets.find(a => a.id === assetId);
      if (asset) {
        const relatedDataItems = [...(asset.relatedDataItems || []), mapping.dataItem.id];
        StorageService.updateAsset(assetId, { relatedDataItems });
      }
    });

    // Remove from mappings
    setMappings(mappings.filter(m => m.dataItem.id !== mapping.dataItem.id));
    loadData();
    toast.success('Mapping accepted and saved');
  };

  const handleRejectMapping = (mapping: MappingDisplay) => {
    setMappings(mappings.filter(m => m.dataItem.id !== mapping.dataItem.id));
    toast.success('Mapping rejected');
  };

  const handleCreateNewAsset = (mapping: MappingDisplay) => {
    const suggestedAsset = mapping.suggestedAssets[0];
    setNewAssetData({
      name: suggestedAsset.name,
      type: suggestedAsset.type,
      criticality: suggestedAsset.criticality,
      owner: suggestedAsset.owner,
      location: suggestedAsset.location,
      description: suggestedAsset.description,
      dataClassification: suggestedAsset.dataClassification,
      dataTypes: suggestedAsset.dataTypes,
      isSoftware: false,
      relatedDataItems: [mapping.dataItem.id],
    });
    setSelectedMapping(mapping);
    setIsCreateAssetDialogOpen(true);
  };

  const handleSaveNewAsset = () => {
    if (!newAssetData.name || !newAssetData.type || !newAssetData.owner || !newAssetData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newAsset: LiteAsset = {
      id: `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: newAssetData.name!,
      type: newAssetData.type!,
      criticality: newAssetData.criticality || 'Medium',
      owner: newAssetData.owner!,
      location: newAssetData.location!,
      description: newAssetData.description || '',
      dataClassification: newAssetData.dataClassification,
      dataTypes: newAssetData.dataTypes || [],
      isSoftware: newAssetData.isSoftware || false,
      relatedDataItems: newAssetData.relatedDataItems || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    StorageService.addAsset(newAsset);

    if (selectedMapping) {
      StorageService.updateDataInventoryItem(selectedMapping.dataItem.id, {
        supportingAssets: [newAsset.id],
      });
      setMappings(mappings.filter(m => m.dataItem.id !== selectedMapping.dataItem.id));
    }

    setIsCreateAssetDialogOpen(false);
    loadData();
    toast.success('Asset created and linked successfully');
  };

  const getAssetIcon = (type: LiteAsset['type']) => {
    switch (type) {
      case 'Database':
        return <Database className="w-5 h-5" />;
      case 'Server':
        return <Server className="w-5 h-5" />;
      case 'Software':
        return <Package className="w-5 h-5" />;
      default:
        return <Server className="w-5 h-5" />;
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Asset Discovery
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Discover supporting assets from your data inventory ({dataItems.length} data items, {assets.length} assets)
            </p>
          </div>
          <Button onClick={handleDiscover}>
            <Search className="w-4 h-4 mr-2" />
            Run Asset Discovery
          </Button>
        </div>

        {discoveryResult && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                {discoveryResult.confidence === 'high' ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-yellow-500" />
                )}
                <CardTitle>Discovery Results</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Confidence</p>
                  <p className={`mt-1 px-2 py-1 rounded text-sm font-medium inline-block ${getConfidenceColor(discoveryResult.confidence)}`}>
                    {discoveryResult.confidence}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Discovered Assets</p>
                  <p className="mt-1 text-lg font-semibold">{discoveryResult.discoveredAssets.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Mappings</p>
                  <p className="mt-1 text-lg font-semibold">{discoveryResult.suggestedMappings.size}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {mappings.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Suggested Mappings ({mappings.length})
            </h2>
            {mappings.map((mapping) => (
              <Card key={mapping.dataItem.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {mapping.dataItem.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {mapping.dataItem.location} • {mapping.dataItem.owner}
                          </p>
                          <span className={`mt-2 inline-block px-2 py-1 text-xs rounded ${getConfidenceColor(mapping.confidence)}`}>
                            {mapping.confidence} confidence
                          </span>
                        </div>
                        <ArrowRight className="w-6 h-6 text-gray-400" />
                        <div className="flex-1">
                          {mapping.suggestedAssets.length > 0 ? (
                            <div className="space-y-2">
                              {mapping.suggestedAssets.map((asset) => (
                                <div key={asset.id} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                                  {getAssetIcon(asset.type)}
                                  <div className="flex-1">
                                    <p className="font-medium text-sm text-gray-900 dark:text-white">
                                      {asset.name}
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                      {asset.type} • {asset.criticality}
                                    </p>
                                  </div>
                                  {mapping.isNewAsset && (
                                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                                      New
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">No assets found</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {mapping.isNewAsset ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCreateNewAsset(mapping)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create Asset
                        </Button>
                      ) : (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleAcceptMapping(mapping)}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Accept
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRejectMapping(mapping)}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!discoveryResult && mappings.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Click "Run Asset Discovery" to discover supporting assets for your data inventory items.
              </p>
              {dataItems.length === 0 && (
                <p className="text-sm text-gray-500">
                  No data items found. Add data items in the Data Inventory view first.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Create Asset Dialog */}
        <Dialog open={isCreateAssetDialogOpen} onOpenChange={setIsCreateAssetDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Asset</DialogTitle>
              <DialogDescription>
                Create a new asset based on the discovered data item
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <Input
                  value={newAssetData.name || ''}
                  onChange={(e) => setNewAssetData({ ...newAssetData, name: e.target.value })}
                  placeholder="Enter asset name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type *</label>
                  <Select
                    value={newAssetData.type}
                    onValueChange={(value) => setNewAssetData({ ...newAssetData, type: value as LiteAsset['type'] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Database">Database</SelectItem>
                      <SelectItem value="Server">Server</SelectItem>
                      <SelectItem value="Application">Application</SelectItem>
                      <SelectItem value="File System">File System</SelectItem>
                      <SelectItem value="Network">Network</SelectItem>
                      <SelectItem value="Software">Software</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Criticality *</label>
                  <Select
                    value={newAssetData.criticality}
                    onValueChange={(value) => setNewAssetData({ ...newAssetData, criticality: value as LiteAsset['criticality'] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select criticality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Owner *</label>
                  <Input
                    value={newAssetData.owner || ''}
                    onChange={(e) => setNewAssetData({ ...newAssetData, owner: e.target.value })}
                    placeholder="Enter owner"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location *</label>
                  <Input
                    value={newAssetData.location || ''}
                    onChange={(e) => setNewAssetData({ ...newAssetData, location: e.target.value })}
                    placeholder="Enter location"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Input
                  value={newAssetData.description || ''}
                  onChange={(e) => setNewAssetData({ ...newAssetData, description: e.target.value })}
                  placeholder="Enter description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateAssetDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveNewAsset}>
                Create Asset
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

