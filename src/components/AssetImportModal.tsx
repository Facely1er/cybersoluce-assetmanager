import React, { useState, useRef } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle, Download, FileSpreadsheet, HelpCircle } from 'lucide-react';
import { Asset } from '../types/asset';
import { validateAsset } from '../utils/validation';
import { parseCSVContent, generateEnhancedCSVTemplate } from '../utils/csvUtils';

interface AssetImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (assets: Asset[]) => void;
}

interface ImportResult {
  success: boolean;
  assets: Asset[];
  errors: string[];
  warnings: string[];
}

export const AssetImportModal: React.FC<AssetImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    // Validate file type
    const allowedExtensions = ['.csv'];
    const fileExtension = '.' + selectedFile.name.toLowerCase().split('.').pop();
    
    if (!allowedExtensions.includes(fileExtension)) {
      setImportResult({
        success: false,
        assets: [],
        errors: ['Please select a CSV file (.csv). Excel files are not currently supported.'],
        warnings: ['Convert your Excel file to CSV format using "Save As" → "CSV (Comma delimited)"']
      });
      return;
    }

    // Validate file size (10MB limit for CSV files)
    const maxSize = 10 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setImportResult({
        success: false,
        assets: [],
        errors: [`File size must be less than ${maxSize / (1024 * 1024)}MB`],
        warnings: []
      });
      return;
    }

    setFile(selectedFile);
    setImportResult(null);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelection(files[0]);
    }
  };

  const processFile = async () => {
    if (!file) return;

    setImporting(true);
    setImportResult(null);

    try {
      const content = await readFileAsText(file);
      const parseResult = parseCSVContent(content);
      
      if (!parseResult.success) {
        setImportResult({
          success: false,
          assets: [],
          errors: parseResult.errors,
          warnings: []
        });
        return;
      }

      // Validate each asset and generate complete Asset objects
      const validAssets: Asset[] = [];
      const errors: string[] = [];
      const warnings: string[] = [];

      parseResult.assets.forEach((assetData, index) => {
        const validationErrors = validateAsset(assetData);
        
        if (validationErrors.length > 0) {
          errors.push(`Row ${index + 2}: ${validationErrors.map(e => e.message).join(', ')}`);
        } else {
          // Generate complete Asset object
          const completeAsset: Asset = {
            ...assetData,
            id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date(),
            updatedAt: new Date(),
            relationships: assetData.relationships || [],
            vulnerabilities: assetData.vulnerabilities || [],
            lastAssessed: assetData.lastAssessed || new Date(),
          } as Asset;
          
          validAssets.push(completeAsset);
        }
      });

      if (validAssets.length === 0 && errors.length > 0) {
        setImportResult({
          success: false,
          assets: [],
          errors: ['No valid assets found in file', ...errors],
          warnings: []
        });
      } else {
        if (errors.length > 0) {
          warnings.push(`${errors.length} rows were skipped due to validation errors`);
        }
        
        setImportResult({
          success: true,
          assets: validAssets,
          errors: [],
          warnings: [...warnings, ...errors.slice(0, 10)] // Limit error display
        });
      }
    } catch (error) {
      setImportResult({
        success: false,
        assets: [],
        errors: [`Failed to process file: ${error instanceof Error ? error.message : 'Unknown error'}`],
        warnings: []
      });
    } finally {
      setImporting(false);
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  };

  const handleImport = () => {
    if (importResult?.success && importResult.assets.length > 0) {
      onImport(importResult.assets);
      onClose();
      resetModal();
    }
  };

  const resetModal = () => {
    setFile(null);
    setImportResult(null);
    setDragActive(false);
    setShowHelp(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    generateEnhancedCSVTemplate();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-command-blue-600 to-action-cyan-500 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-outfit font-bold">Import Assets from CSV</h2>
                <p className="text-sm opacity-90">Upload your asset inventory data to generate a comprehensive asset database</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                title="Show help"
              >
                <HelpCircle className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  onClose();
                  resetModal();
                }}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Import Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Template Download */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileSpreadsheet className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-blue-900">Download CSV Template</h3>
                      <p className="text-sm text-blue-700">Get our pre-formatted CSV template with examples</p>
                    </div>
                  </div>
                  <button
                    onClick={downloadTemplate}
                    className="inline-flex items-center px-3 py-2 border border-blue-300 rounded-lg text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </button>
                </div>
              </div>

              {/* File Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-command-blue-400 bg-command-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileInputChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-gray-600" />
                  </div>
                  
                  {file ? (
                    <div>
                      <p className="text-lg font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB • CSV file
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        Drop your CSV file here, or click to browse
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports CSV files up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Process Button */}
              {file && !importResult && (
                <div className="flex justify-center">
                  <button
                    onClick={processFile}
                    disabled={importing}
                    className="inline-flex items-center px-6 py-3 bg-command-blue-600 text-white rounded-lg hover:bg-command-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {importing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing File...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Process & Validate File
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Import Results */}
              {importResult && (
                <div className="space-y-4">
                  {importResult.success ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <div>
                          <h3 className="text-sm font-medium text-green-900">
                            Ready to Import
                          </h3>
                          <p className="text-sm text-green-700">
                            Found {importResult.assets.length} valid assets ready to import
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                        <div>
                          <h3 className="text-sm font-medium text-red-900">
                            Import Failed
                          </h3>
                          <p className="text-sm text-red-700">
                            Please fix the errors below and try again
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Errors */}
                  {importResult.errors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-h-40 overflow-y-auto">
                      <h4 className="text-sm font-medium text-red-900 mb-2">Errors:</h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        {importResult.errors.slice(0, 10).map((error, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-red-500 mr-2">•</span>
                            {error}
                          </li>
                        ))}
                        {importResult.errors.length > 10 && (
                          <li className="text-xs text-red-600 italic">
                            ... and {importResult.errors.length - 10} more errors
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Warnings */}
                  {importResult.warnings.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-h-40 overflow-y-auto">
                      <h4 className="text-sm font-medium text-yellow-900 mb-2">Warnings:</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        {importResult.warnings.slice(0, 10).map((warning, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-yellow-500 mr-2">•</span>
                            {warning}
                          </li>
                        ))}
                        {importResult.warnings.length > 10 && (
                          <li className="text-xs text-yellow-600 italic">
                            ... and {importResult.warnings.length - 10} more warnings
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Asset Preview */}
                  {importResult.success && importResult.assets.length > 0 && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Preview (first 5 assets):
                      </h4>
                      <div className="space-y-2">
                        {importResult.assets.slice(0, 5).map((asset, index) => (
                          <div key={index} className="flex items-center justify-between text-sm bg-white p-2 rounded">
                            <span className="font-medium">{asset.name}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-500">{asset.type}</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                asset.criticality === 'Critical' ? 'bg-red-100 text-red-800' :
                                asset.criticality === 'High' ? 'bg-orange-100 text-orange-800' :
                                asset.criticality === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {asset.criticality}
                              </span>
                            </div>
                          </div>
                        ))}
                        {importResult.assets.length > 5 && (
                          <p className="text-xs text-gray-500 text-center">
                            ... and {importResult.assets.length - 5} more assets
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Help Sidebar */}
            <div className="space-y-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Supported Format</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-green-600" />
                    CSV files (.csv)
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Excel files are not supported. Please convert to CSV format.
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Required Fields</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Asset Name</li>
                  <li>• Type (Server, Database, etc.)</li>
                  <li>• Criticality (Critical, High, Medium, Low)</li>
                  <li>• Owner</li>
                  <li>• Location</li>
                </ul>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Optional Fields</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• IP Address</li>
                  <li>• Description</li>
                  <li>• Risk Score (0-100)</li>
                  <li>• Status</li>
                  <li>• Compliance Frameworks</li>
                  <li>• Tags</li>
                </ul>
              </div>

              {showHelp && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-900 mb-3">Import Tips</h3>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li>• Use semicolons to separate multiple values</li>
                    <li>• Ensure column headers match expected names</li>
                    <li>• Remove empty rows before importing</li>
                    <li>• Check data types match requirements</li>
                    <li>• Download template for best results</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={() => {
              onClose();
              resetModal();
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          
          {importResult?.success && (
            <button
              onClick={handleImport}
              className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-green-700 transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import {importResult.assets.length} Assets
            </button>
          )}
        </div>
      </div>
    </div>
  );
};