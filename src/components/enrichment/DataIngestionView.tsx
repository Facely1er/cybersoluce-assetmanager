import React, { useState, useEffect, useRef } from 'react';
import { Upload, FileDown, Database, Server, CheckCircle, AlertCircle, FileText, X, FileJson, FileSpreadsheet, Settings } from 'lucide-react';
import { StorageService } from '../../services/storageServiceLite';
import { FileIngestionService, FileFormat } from '../../services/fileIngestionService';
import { generateDataInventoryTemplate, generateAssetsTemplate, generateDataInventoryJSONTemplate, generateAssetsJSONTemplate, exportDataInventoryToCSV } from '../../utils/csvUtilsLite';
import { validateDataInventoryItem, validateAsset } from '../../utils/validation';
import { DataInventoryItem } from '../../types/dataInventory';
import { LiteAsset } from '../../types/assetLite';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { toast } from 'react-hot-toast';
import { formatFileSize, getFileSizeLimit, APP_CONFIG } from '../../utils/constantsLite';
import { logger } from '../../utils/logger';

interface ImportResult {
  success: boolean;
  imported: number;
  errors: string[];
  skipped: number;
  format: FileFormat;
}

export const DataIngestionView: React.FC = () => {
  const [importing, setImporting] = useState(false);
  const [importType, setImportType] = useState<'data-inventory' | 'assets' | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [exportFormat, setExportFormat] = useState<FileFormat>('csv');
  const [selectedFile, setSelectedFile] = useState<{
    file: File;
    size: number;
    limit: number;
    format: FileFormat;
  } | null>(null);
  const [fileSizeError, setFileSizeError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [customLimits, setCustomLimits] = useState<{
    CSV: number | null;
    JSON: number | null;
    XLSX: number | null;
  }>({
    CSV: null,
    JSON: null,
    XLSX: null,
  });
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Load custom limits on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.FILE_SIZE_LIMITS);
      if (saved) {
        setCustomLimits(JSON.parse(saved));
      }
    } catch (e) {
      logger.error('Failed to load file size limits', e instanceof Error ? e : new Error(String(e)));
    }
  }, []);

  // Update progress bar width when selectedFile changes
  useEffect(() => {
    if (progressBarRef.current && selectedFile) {
      const width = Math.min((selectedFile.size / selectedFile.limit) * 100, 100);
      progressBarRef.current.style.width = `${width}%`;
    }
  }, [selectedFile]);

  const handleFileSelect = (type: 'data-inventory' | 'assets') => {
    setImportType(type);
    setFileSizeError(null);
    setSelectedFile(null);
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.json,.xlsx,.xls';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const format = FileIngestionService.detectFileFormat(file);
        const sizeValidation = FileIngestionService.validateFileSize(file, format);
        
        setSelectedFile({
          file,
          size: file.size,
          limit: sizeValidation.limit,
          format,
        });

        if (!sizeValidation.valid) {
          setFileSizeError(sizeValidation.error || 'File size validation failed');
          toast.error(sizeValidation.error || 'File size validation failed');
          return;
        }

        // Show warning if file is large but still valid
        if (file.size > sizeValidation.limit * 0.8) {
          toast(
            `Large file detected (${formatFileSize(file.size)}). Processing may take longer.`,
            { 
              duration: 5000,
              icon: '⚠️',
              style: {
                background: '#fef3c7',
                color: '#92400e',
              }
            }
          );
        }

        // Proceed with import
        handleImport(file, type);
      }
    };
    input.click();
  };

  // Save custom limits
  const saveCustomLimits = () => {
    try {
      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.FILE_SIZE_LIMITS, JSON.stringify(customLimits));
      toast.success('File size limits updated');
      setShowSettings(false);
    } catch {
      toast.error('Failed to save file size limits');
    }
  };

  // Reset to defaults
  const resetCustomLimits = () => {
    setCustomLimits({ CSV: null, JSON: null, XLSX: null });
    localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.FILE_SIZE_LIMITS);
    toast.success('File size limits reset to defaults');
  };

  const handleImport = async (file: File, type: 'data-inventory' | 'assets') => {
    setImporting(true);
    setImportResult(null);

    try {
      const format = FileIngestionService.detectFileFormat(file);
      const parseResult = await FileIngestionService.ingestFile(file, type);
      
      if (parseResult.success && parseResult.imported > 0) {
        // Get parsed items
        const content = await FileIngestionService.readFileContent(file, format);
        let items: (Partial<DataInventoryItem> | Partial<LiteAsset>)[] = [];

        if (format === 'csv') {
          const csvResult = FileIngestionService.parseCSV(content as string, type);
          items = csvResult.items;
        } else if (format === 'json') {
          const jsonResult = FileIngestionService.parseJSON(content as string, type);
          items = jsonResult.items;
        } else if (format === 'xlsx') {
          const xlsxResult = await FileIngestionService.parseXLSX(content as ArrayBuffer, type);
          items = xlsxResult.items;
        }

        // Process and save items
        const result = await processAndSaveItems(items, type);
        setImportResult({
          ...result,
          format,
        });
      } else {
        setImportResult(parseResult);
      }
      
      setShowResultDialog(true);
    } catch (error) {
      toast.error(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setImportResult({
        success: false,
        imported: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        skipped: 0,
        format: 'csv',
      });
      setShowResultDialog(true);
    } finally {
      setImporting(false);
    }
  };

  const processAndSaveItems = async (
    items: (Partial<DataInventoryItem> | Partial<LiteAsset>)[],
    type: 'data-inventory' | 'assets'
  ): Promise<ImportResult> => {
    const result: ImportResult = {
      success: true,
      imported: 0,
      errors: [],
      skipped: 0,
      format: 'csv',
    };

    if (type === 'data-inventory') {
      const existingItems = StorageService.getDataInventory();
      const existingNames = new Set(existingItems.map(item => item.name.toLowerCase()));

      for (const item of items as Partial<DataInventoryItem>[]) {
        // Validate item
        const validation = validateDataInventoryItem(item);
        if (!validation.isValid) {
          result.errors.push(`${item.name || 'Unknown'}: ${validation.errors.join(', ')}`);
          result.skipped++;
          continue;
        }

        // Check for duplicates
        if (item.name && existingNames.has(item.name.toLowerCase())) {
          result.errors.push(`${item.name}: Already exists (skipped)`);
          result.skipped++;
          continue;
        }

        // Create new item
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
        result.imported++;
        if (item.name) {
          existingNames.add(item.name.toLowerCase());
        }
      }
    } else {
      const existingAssets = StorageService.getAssets();
      const existingNames = new Set(existingAssets.map(asset => asset.name.toLowerCase()));

      for (const item of items as Partial<LiteAsset>[]) {
        // Validate asset
        const validation = validateAsset(item);
        if (!validation.isValid) {
          result.errors.push(`${item.name || 'Unknown'}: ${validation.errors.join(', ')}`);
          result.skipped++;
          continue;
        }

        // Check for duplicates
        if (item.name && existingNames.has(item.name.toLowerCase())) {
          result.errors.push(`${item.name}: Already exists (skipped)`);
          result.skipped++;
          continue;
        }

        // Create new asset
        const newAsset: LiteAsset = {
          id: `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: item.name!,
          type: item.type!,
          criticality: item.criticality!,
          owner: item.owner!,
          location: item.location!,
          description: item.description || '',
          dataClassification: item.dataClassification,
          dataTypes: item.dataTypes || [],
          isSoftware: item.isSoftware || false,
          tags: item.tags || [],
          relatedDataItems: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        StorageService.addAsset(newAsset);
        result.imported++;
        if (item.name) {
          existingNames.add(item.name.toLowerCase());
        }
      }
    }

    if (result.imported > 0) {
      toast.success(`Imported ${result.imported} ${type === 'data-inventory' ? 'data inventory items' : 'assets'}`);
    }

    return result;
  };

  const handleExport = async (type: 'data-inventory' | 'assets') => {
    try {
      const data = type === 'data-inventory' 
        ? StorageService.getDataInventory()
        : StorageService.getAssets();

      if (data.length === 0) {
        toast.error(`No ${type === 'data-inventory' ? 'data items' : 'assets'} to export`);
        return;
      }

      switch (exportFormat) {
        case 'csv':
          if (type === 'data-inventory') {
            exportDataInventoryToCSV(data as DataInventoryItem[]);
          } else {
            const { exportAssetsToCSV } = await import('../../utils/csvUtilsLite');
            exportAssetsToCSV(data as LiteAsset[]);
          }
          toast.success('Exported to CSV');
          break;
        case 'json':
          FileIngestionService.exportToJSON(data, type);
          toast.success('Exported to JSON');
          break;
        case 'xlsx':
          await FileIngestionService.exportToXLSX(data, type);
          toast.success('Exported to Excel');
          break;
      }
    } catch (error) {
      toast.error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getFormatIcon = (format: FileFormat) => {
    switch (format) {
      case 'json':
        return <FileJson className="w-5 h-5" />;
      case 'xlsx':
        return <FileSpreadsheet className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getFormatLabel = (format: FileFormat) => {
    switch (format) {
      case 'json':
        return 'JSON';
      case 'xlsx':
        return 'Excel';
      default:
        return 'CSV';
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Data Ingestion
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Import and export data inventory and assets in multiple formats (CSV, JSON, Excel)
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowSettings(true)}
            size="sm"
            className="w-full sm:w-auto"
          >
            <Settings className="w-4 h-4 mr-2" />
            File Size Limits
          </Button>
        </div>

        {/* File Size Display */}
        {selectedFile && !fileSizeError && (
          <Card className="mb-4 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Selected File: {selectedFile.file.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Size: {formatFileSize(selectedFile.size)} / Limit: {formatFileSize(selectedFile.limit)}
                  </p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div
                      ref={progressBarRef}
                      className={`h-2 rounded-full transition-all ${
                        selectedFile.size > selectedFile.limit * 0.9
                          ? 'bg-red-600'
                          : selectedFile.size > selectedFile.limit * 0.7
                          ? 'bg-yellow-600'
                          : 'bg-green-600'
                      }`}
                    />
                  </div>
                </div>
                {selectedFile.size > selectedFile.limit * 0.8 && (
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 ml-4" />
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* File Size Error Display */}
        {fileSizeError && (
          <Card className="mb-4 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
            <CardContent className="pt-6">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900 dark:text-red-200">
                    File Size Error
                  </p>
                  <p className="text-xs text-red-800 dark:text-red-300 mt-1">
                    {fileSizeError}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Data Inventory Import */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Database className="w-8 h-8 text-[#005B96] dark:text-[#33A1DE]" />
                <CardTitle>Data Inventory</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Import data inventory items from CSV, JSON, or Excel files
              </p>
              <div className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    onClick={() => generateDataInventoryTemplate()}
                    size="sm"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    CSV
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => generateDataInventoryJSONTemplate()}
                    size="sm"
                  >
                    <FileJson className="w-4 h-4 mr-2" />
                    JSON
                  </Button>
                  <Button
                    onClick={() => handleFileSelect('data-inventory')}
                    disabled={importing}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {importing && importType === 'data-inventory' ? 'Importing...' : 'Import File'}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as FileFormat)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="xlsx">Excel</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={() => handleExport('data-inventory')}
                  >
                    <FileDown className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                <p className="font-medium mb-1">Supported formats:</p>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-xs">CSV</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded text-xs">JSON</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded text-xs">Excel</span>
                </div>
                <p className="font-medium mt-3 mb-1">Required columns:</p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Name</li>
                  <li>Data Type</li>
                  <li>Classification</li>
                  <li>Location</li>
                  <li>Owner</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Assets Import */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Server className="w-8 h-8 text-[#005B96] dark:text-[#33A1DE]" />
                <CardTitle>Assets</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Import assets from CSV, JSON, or Excel files
              </p>
              <div className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    onClick={() => generateAssetsTemplate()}
                    size="sm"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    CSV
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => generateAssetsJSONTemplate()}
                    size="sm"
                  >
                    <FileJson className="w-4 h-4 mr-2" />
                    JSON
                  </Button>
                  <Button
                    onClick={() => handleFileSelect('assets')}
                    disabled={importing}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {importing && importType === 'assets' ? 'Importing...' : 'Import File'}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as FileFormat)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="xlsx">Excel</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={() => handleExport('assets')}
                  >
                    <FileDown className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                <p className="font-medium mb-1">Supported formats:</p>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-xs">CSV</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded text-xs">JSON</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded text-xs">Excel</span>
                </div>
                <p className="font-medium mt-3 mb-1">Required columns:</p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Name</li>
                  <li>Type</li>
                  <li>Criticality</li>
                  <li>Owner</li>
                  <li>Location</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Import Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>File Format Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold">CSV Format</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Comma-separated values with header row. Best for simple data import/export.
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Download template</li>
                  <li>• Fill in Excel/Editor</li>
                  <li>• Save as .csv</li>
                </ul>
              </div>

              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileJson className="w-5 h-5 text-green-500" />
                  <h3 className="font-semibold">JSON Format</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Structured JSON format. Supports nested data and complex structures.
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Array of items</li>
                  <li>• Or object with items</li>
                  <li>• Preserves data types</li>
                </ul>
              </div>

              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileSpreadsheet className="w-5 h-5 text-purple-500" />
                  <h3 className="font-semibold">Excel Format</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Microsoft Excel (.xlsx) format. Best for complex data with formulas.
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• .xlsx or .xls</li>
                  <li>• First sheet used</li>
                  <li>• Header row required</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">JSON Format Examples</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium mb-1 text-blue-800 dark:text-blue-200">Array Format:</p>
                  <pre className="bg-white dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto">
{`[
  {
    "name": "Item 1",
    "dataType": "PII",
    ...
  }
]`}
                  </pre>
                </div>
                <div>
                  <p className="font-medium mb-1 text-blue-800 dark:text-blue-200">Object Format:</p>
                  <pre className="bg-white dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto">
{`{
  "dataInventory": [...],
  "assets": [...]
}`}
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Import Results Dialog */}
        {importResult && (
          <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Import Results</DialogTitle>
                <DialogDescription>
                  {importType === 'data-inventory' ? 'Data Inventory' : 'Assets'} import completed
                  {importResult.format && (
                    <span className="ml-2 inline-flex items-center gap-1">
                      {getFormatIcon(importResult.format)}
                      {getFormatLabel(importResult.format)}
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">{importResult.imported}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Imported</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                    <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-yellow-600">{importResult.skipped}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Skipped</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded">
                    <X className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-600">{importResult.errors.length}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Errors</p>
                  </div>
                </div>

                {importResult.errors.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Errors & Warnings</h3>
                    <div className="max-h-64 overflow-y-auto space-y-1">
                      {importResult.errors.map((error, index) => (
                        <div key={index} className="p-2 bg-red-50 dark:bg-red-900/20 rounded text-sm text-red-700 dark:text-red-300">
                          {error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {importResult.imported > 0 && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      ✓ Successfully imported {importResult.imported} {importResult.imported === 1 ? 'item' : 'items'} from {getFormatLabel(importResult.format)} file
                    </p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button onClick={() => setShowResultDialog(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* File Size Limits Settings Dialog */}
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent className="max-w-2xl w-[95vw] sm:w-full">
            <DialogHeader>
              <DialogTitle>File Size Limits Configuration</DialogTitle>
              <DialogDescription>
                Configure maximum file sizes for ingestion. Leave empty to use defaults.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    CSV Limit (MB)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max={APP_CONFIG.FILE_SIZE_LIMITS.MAX / (1024 * 1024)}
                    value={customLimits.CSV ? customLimits.CSV / (1024 * 1024) : ''}
                    onChange={(e) => setCustomLimits({
                      ...customLimits,
                      CSV: e.target.value ? parseInt(e.target.value) * 1024 * 1024 : null,
                    })}
                    placeholder={`Default: ${APP_CONFIG.FILE_SIZE_LIMITS.CSV / (1024 * 1024)}MB`}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Current: {formatFileSize(getFileSizeLimit('csv'))}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    JSON Limit (MB)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max={APP_CONFIG.FILE_SIZE_LIMITS.MAX / (1024 * 1024)}
                    value={customLimits.JSON ? customLimits.JSON / (1024 * 1024) : ''}
                    onChange={(e) => setCustomLimits({
                      ...customLimits,
                      JSON: e.target.value ? parseInt(e.target.value) * 1024 * 1024 : null,
                    })}
                    placeholder={`Default: ${APP_CONFIG.FILE_SIZE_LIMITS.JSON / (1024 * 1024)}MB`}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Current: {formatFileSize(getFileSizeLimit('json'))}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    XLSX Limit (MB)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max={APP_CONFIG.FILE_SIZE_LIMITS.MAX / (1024 * 1024)}
                    value={customLimits.XLSX ? customLimits.XLSX / (1024 * 1024) : ''}
                    onChange={(e) => setCustomLimits({
                      ...customLimits,
                      XLSX: e.target.value ? parseInt(e.target.value) * 1024 * 1024 : null,
                    })}
                    placeholder={`Default: ${APP_CONFIG.FILE_SIZE_LIMITS.XLSX / (1024 * 1024)}MB`}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Current: {formatFileSize(getFileSizeLimit('xlsx'))}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <p className="text-xs text-gray-500">
                  Maximum allowed: {formatFileSize(APP_CONFIG.FILE_SIZE_LIMITS.MAX)}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={resetCustomLimits} size="sm">
                    Reset to Defaults
                  </Button>
                  <Button onClick={saveCustomLimits} size="sm">
                    Save Limits
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
    </div>
  );
};

