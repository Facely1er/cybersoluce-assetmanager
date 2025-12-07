import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Download, Upload, FileDown } from 'lucide-react';
import { DataInventoryItem } from '../../types/dataInventory';
import { StorageService } from '../../services/storageServiceLite';
import { exportDataInventoryToCSV, generateDataInventoryTemplate, generateDataInventoryJSONTemplate } from '../../utils/csvUtils';
import { FileIngestionService, FileFormat } from '../../services/fileIngestionService';
import { validateDataInventoryItem } from '../../utils/validation';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'react-hot-toast';
import { logger } from '../../utils/logger';

export const DataInventoryView: React.FC = () => {
  const [dataItems, setDataItems] = useState<DataInventoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterClassification, setFilterClassification] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DataInventoryItem | null>(null);
  const [formData, setFormData] = useState<Partial<DataInventoryItem>>({});
  const [exportFormat] = useState<FileFormat>('csv');
  const [, setImporting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const items = StorageService.getDataInventory();
    setDataItems(items);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      dataType: 'Other',
      classification: 'Internal',
      location: '',
      owner: '',
      description: '',
      tags: [],
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: DataInventoryItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      StorageService.deleteDataInventoryItem(id);
      loadData();
      toast.success('Item deleted successfully');
    }
  };

  const handleSave = () => {
    const validation = validateDataInventoryItem(formData);
    if (!validation.isValid) {
      toast.error(validation.errors.join(', '));
      return;
    }

    if (editingItem) {
      StorageService.updateDataInventoryItem(editingItem.id, formData);
      toast.success('Item updated successfully');
    } else {
      const newItem: DataInventoryItem = {
        id: `data-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: formData.name!,
        dataType: formData.dataType!,
        classification: formData.classification!,
        location: formData.location!,
        owner: formData.owner!,
        description: formData.description,
        retentionPeriod: formData.retentionPeriod,
        tags: formData.tags || [],
        supportingAssets: formData.supportingAssets || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      StorageService.addDataInventoryItem(newItem);
      toast.success('Item created successfully');
    }
    setIsDialogOpen(false);
    loadData();
  };

  const handleExport = async () => {
    if (dataItems.length === 0) {
      toast.error('No data to export');
      return;
    }

    try {
      switch (exportFormat) {
        case 'csv':
          exportDataInventoryToCSV(dataItems);
          toast.success('Data exported to CSV successfully');
          break;
        case 'json':
          FileIngestionService.exportToJSON(dataItems, 'data-inventory');
          toast.success('Data exported to JSON successfully');
          break;
        case 'xlsx':
          await FileIngestionService.exportToXLSX(dataItems, 'data-inventory');
          toast.success('Data exported to Excel successfully');
          break;
      }
    } catch (error) {
      toast.error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.json,.xlsx,.xls';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setImporting(true);
      try {
        const format = FileIngestionService.detectFileFormat(file);
        const parseResult = await FileIngestionService.ingestFile(file, 'data-inventory');
        
        if (parseResult.success && parseResult.imported > 0) {
          // Get parsed items
          const content = await FileIngestionService.readFileContent(file, format);
          let items: Partial<DataInventoryItem>[] = [];

          if (format === 'csv') {
            const csvResult = FileIngestionService.parseCSV(content as string, 'data-inventory');
            items = csvResult.items as Partial<DataInventoryItem>[];
          } else if (format === 'json') {
            const jsonResult = FileIngestionService.parseJSON(content as string, 'data-inventory');
            items = jsonResult.items as Partial<DataInventoryItem>[];
          } else if (format === 'xlsx') {
            const xlsxResult = await FileIngestionService.parseXLSX(content as ArrayBuffer, 'data-inventory');
            items = xlsxResult.items as Partial<DataInventoryItem>[];
          }

          // Process and save items
          const existingItems = StorageService.getDataInventory();
          const existingNames = new Set(existingItems.map(item => item.name.toLowerCase()));
          let imported = 0;
          let skipped = 0;
          const errors: string[] = [];

          for (const item of items) {
            const validation = validateDataInventoryItem(item);
            if (!validation.isValid) {
              errors.push(`${item.name || 'Unknown'}: ${validation.errors.join(', ')}`);
              skipped++;
              continue;
            }

            if (item.name && existingNames.has(item.name.toLowerCase())) {
              errors.push(`${item.name}: Already exists (skipped)`);
              skipped++;
              continue;
            }

            const newItem: DataInventoryItem = {
              id: `data-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              name: item.name!,
              dataType: item.dataType!,
              classification: item.classification!,
              location: item.location!,
              owner: item.owner!,
              description: item.description,
              retentionPeriod: item.retentionPeriod,
              tags: item.tags || [],
              supportingAssets: [],
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            StorageService.addDataInventoryItem(newItem);
            imported++;
            if (item.name) {
              existingNames.add(item.name.toLowerCase());
            }
          }

          loadData();
          if (imported > 0) {
            toast.success(`Imported ${imported} items from ${format.toUpperCase()}`);
          }
          if (skipped > 0 || errors.length > 0) {
            toast.error(`${skipped} skipped, ${errors.length} errors. Check console for details.`);
            logger.warn('Import errors:', errors);
          }
        } else {
          toast.error(`Import failed: ${parseResult.errors.join(', ')}`);
        }
      } catch (error) {
        toast.error(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setImporting(false);
      }
    };
    input.click();
  };

  const handleDownloadTemplate = (format: 'csv' | 'json' = 'csv') => {
    if (format === 'csv') {
      generateDataInventoryTemplate();
      toast.success('CSV template downloaded');
    } else {
      generateDataInventoryJSONTemplate();
      toast.success('JSON template downloaded');
    }
  };

  const filteredItems = dataItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase()) ||
      item.owner.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || item.dataType === filterType;
    const matchesClassification = filterClassification === 'all' || item.classification === filterClassification;
    return matchesSearch && matchesType && matchesClassification;
  });

  const dataTypes: DataInventoryItem['dataType'][] = ['PII', 'PHI', 'Financial', 'Intellectual Property', 'Business Data', 'Other'];
  const classifications: DataInventoryItem['classification'][] = ['Public', 'Internal', 'Confidential', 'Restricted', 'Top Secret'];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Data Inventory
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and track your organizational data ({dataItems.length} items)
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleDownloadTemplate()}>
              <FileDown className="w-4 h-4 mr-2" />
              Template
            </Button>
            <Button variant="outline" onClick={handleImport}>
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add Data Item
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search data inventory..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {dataTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterClassification} onValueChange={setFilterClassification}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Classifications" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classifications</SelectItem>
                {classifications.map(classification => (
                  <SelectItem key={classification} value={classification}>{classification}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Data Items Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                No data items found. Add your first data item to get started.
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Data Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Classification
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.dataType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.classification === 'Restricted' || item.classification === 'Top Secret'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : item.classification === 'Confidential'
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        {item.classification}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.owner}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Data Item' : 'Add Data Item'}</DialogTitle>
              <DialogDescription>
                {editingItem ? 'Update the data inventory item details' : 'Add a new item to your data inventory'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter data item name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Data Type *</label>
                  <Select
                    value={formData.dataType}
                    onValueChange={(value) => setFormData({ ...formData, dataType: value as DataInventoryItem['dataType'] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select data type" />
                    </SelectTrigger>
                    <SelectContent>
                      {dataTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Classification *</label>
                  <Select
                    value={formData.classification}
                    onValueChange={(value) => setFormData({ ...formData, classification: value as DataInventoryItem['classification'] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select classification" />
                    </SelectTrigger>
                    <SelectContent>
                      {classifications.map(classification => (
                        <SelectItem key={classification} value={classification}>{classification}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Location *</label>
                  <Input
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Enter location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Owner *</label>
                  <Input
                    value={formData.owner || ''}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    placeholder="Enter owner"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Input
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Retention Period (days)</label>
                <Input
                  type="number"
                  value={formData.retentionPeriod || ''}
                  onChange={(e) => setFormData({ ...formData, retentionPeriod: e.target.value ? parseInt(e.target.value) : undefined })}
                  placeholder="Enter retention period in days"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingItem ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

