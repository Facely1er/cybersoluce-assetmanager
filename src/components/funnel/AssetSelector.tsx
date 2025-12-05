/**
 * Asset Selector Component
 * 
 * Allows users to select assets before routing to ERMITS services.
 * Pre-filters assets based on signal domain and service type.
 */

import React, { useState, useMemo } from 'react';
import { Asset } from '../../types/asset';
import { FocusSignal } from '../../types/enrichment';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Search, Filter, CheckCircle2, X } from 'lucide-react';
import { Input } from '../ui/input';

export interface AssetSelectorProps {
  assets: Asset[];
  signals: FocusSignal[];
  signalDomain: FocusSignal['signal_domain'];
  onSelectionChange?: (selectedAssetIds: string[]) => void;
  onConfirm?: (selectedAssetIds: string[]) => void;
  onCancel?: () => void;
  defaultSelected?: string[];
  maxSelections?: number;
}

export const AssetSelector: React.FC<AssetSelectorProps> = ({
  assets,
  signals,
  signalDomain,
  onSelectionChange,
  onConfirm,
  onCancel,
  defaultSelected = [],
  maxSelections,
}) => {
  const [selectedAssetIds, setSelectedAssetIds] = useState<Set<string>>(
    new Set(defaultSelected)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Filter assets relevant to the signal domain
  const relevantAssets = useMemo(() => {
    const signalAssetIds = signals
      .filter(s => s.signal_domain === signalDomain)
      .flatMap(s => s.affected_asset_ids);

    return assets.filter(asset => {
      // Include if mentioned in signals
      if (signalAssetIds.includes(asset.id)) return true;
      
      // Include based on signal domain
      switch (signalDomain) {
        case 'privacy':
          return asset.dataClassification === 'confidential' || 
                 asset.dataClassification === 'restricted' ||
                 asset.tags?.some(tag => 
                   tag.toLowerCase().includes('pii') || 
                   tag.toLowerCase().includes('privacy')
                 );
        case 'vendor':
          return asset.assetType === 'service' || 
                 asset.assetType === 'vendor' ||
                 asset.tags?.some(tag => 
                   tag.toLowerCase().includes('vendor') || 
                   tag.toLowerCase().includes('third-party')
                 );
        case 'software':
          return asset.assetType === 'software' || 
                 asset.assetType === 'application' ||
                 asset.tags?.some(tag => 
                   tag.toLowerCase().includes('software') || 
                   tag.toLowerCase().includes('component')
                 );
        default:
          return true;
      }
    });
  }, [assets, signals, signalDomain]);

  // Apply search and type filters
  const filteredAssets = useMemo(() => {
    let filtered = relevantAssets;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(query) ||
        asset.description?.toLowerCase().includes(query) ||
        asset.owner?.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(asset => asset.assetType === filterType);
    }

    return filtered;
  }, [relevantAssets, searchQuery, filterType]);

  // Get unique asset types for filter
  const assetTypes = useMemo(() => {
    const types = new Set(relevantAssets.map(a => a.assetType));
    return Array.from(types);
  }, [relevantAssets]);

  const handleToggleSelection = (assetId: string) => {
    setSelectedAssetIds(prev => {
      const newSet = new Set(prev);
      
      if (newSet.has(assetId)) {
        newSet.delete(assetId);
      } else {
        // Check max selections limit
        if (maxSelections && newSet.size >= maxSelections) {
          return prev; // Don't add if at limit
        }
        newSet.add(assetId);
      }
      
      // Notify parent of selection change
      if (onSelectionChange) {
        onSelectionChange(Array.from(newSet));
      }
      
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const allIds = new Set(filteredAssets.map(a => a.id));
    setSelectedAssetIds(allIds);
    if (onSelectionChange) {
      onSelectionChange(Array.from(allIds));
    }
  };

  const handleDeselectAll = () => {
    setSelectedAssetIds(new Set());
    if (onSelectionChange) {
      onSelectionChange([]);
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(Array.from(selectedAssetIds));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Select Assets for {signalDomain === 'privacy' ? 'Privacy' : 
                              signalDomain === 'vendor' ? 'Vendor' : 
                              signalDomain === 'software' ? 'Software' : 'Analysis'}
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedAssetIds.size} of {filteredAssets.length} selected
            </span>
            {maxSelections && (
              <span className="text-xs text-muted-foreground">
                (max {maxSelections})
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-9 pr-8 py-2 border rounded-md bg-background"
            >
              <option value="all">All Types</option>
              {assetTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Selection Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            disabled={filteredAssets.length === 0}
          >
            Select All ({filteredAssets.length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeselectAll}
            disabled={selectedAssetIds.size === 0}
          >
            Deselect All
          </Button>
        </div>

        {/* Asset List */}
        <div className="border rounded-md max-h-96 overflow-y-auto">
          {filteredAssets.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No assets found matching your criteria
            </div>
          ) : (
            <div className="divide-y">
              {filteredAssets.map(asset => {
                const isSelected = selectedAssetIds.has(asset.id);
                const isDisabled = maxSelections 
                  ? !isSelected && selectedAssetIds.size >= maxSelections
                  : false;

                return (
                  <div
                    key={asset.id}
                    className={`p-3 hover:bg-muted/50 cursor-pointer flex items-start gap-3 ${
                      isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={() => !isDisabled && handleToggleSelection(asset.id)}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => !isDisabled && handleToggleSelection(asset.id)}
                      disabled={isDisabled}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{asset.name}</span>
                        {isSelected && (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        <span className="capitalize">{asset.assetType}</span>
                        {asset.owner && (
                          <> • Owner: {asset.owner}</>
                        )}
                        {asset.dataClassification && (
                          <> • Classification: {asset.dataClassification}</>
                        )}
                      </div>
                      {asset.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {asset.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          )}
          {onConfirm && (
            <Button
              onClick={handleConfirm}
              disabled={selectedAssetIds.size === 0}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Confirm Selection ({selectedAssetIds.size})
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

