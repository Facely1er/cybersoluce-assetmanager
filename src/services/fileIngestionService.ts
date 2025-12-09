/**
 * File Ingestion Service
 * Handles multiple file formats for data ingestion
 */

import { DataInventoryItem } from '../types/dataInventory';
import { LiteAsset } from '../types/assetLite';
import { parseDataInventoryCSV, parseAssetsCSV } from '../utils/csvUtilsLite';
import { getFileSizeLimit, ERROR_MESSAGES } from '../utils/constantsLite';

export type FileFormat = 'csv' | 'json' | 'xlsx';
export type DataType = 'data-inventory' | 'assets';

export interface IngestionResult {
  success: boolean;
  imported: number;
  errors: string[];
  skipped: number;
  format: FileFormat;
}

export class FileIngestionService {
  /**
   * Detect file format from file name or content
   */
  static detectFileFormat(file: File): FileFormat {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'csv':
        return 'csv';
      case 'json':
        return 'json';
      case 'xlsx':
      case 'xls':
        return 'xlsx';
      default:
        // Try to detect from content type
        if (file.type.includes('json')) return 'json';
        if (file.type.includes('csv') || file.type.includes('text')) return 'csv';
        if (file.type.includes('spreadsheet') || file.type.includes('excel')) return 'xlsx';
        return 'csv'; // Default to CSV
    }
  }

  /**
   * Validate file size against format-specific limits
   */
  static validateFileSize(file: File, format: FileFormat): {
    valid: boolean;
    limit: number;
    error?: string;
  } {
    const limit = getFileSizeLimit(format);
    const fileSize = file.size;

    if (fileSize > limit) {
      return {
        valid: false,
        limit,
        error: ERROR_MESSAGES.FILE_TOO_LARGE(fileSize, limit),
      };
    }

    return {
      valid: true,
      limit,
    };
  }

  /**
   * Read file content based on format
   */
  static async readFileContent(file: File, format: FileFormat): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        resolve(e.target?.result || '');
      };
      
      reader.onerror = reject;

      if (format === 'json' || format === 'csv') {
        reader.readAsText(file);
      } else if (format === 'xlsx') {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    });
  }

  /**
   * Parse JSON file
   */
  static parseJSON(content: string, dataType: DataType): {
    success: boolean;
    items: (Partial<DataInventoryItem> | Partial<LiteAsset>)[];
    errors: string[];
  } {
    try {
      const data = JSON.parse(content);
      const errors: string[] = [];
      let items: (Partial<DataInventoryItem> | Partial<LiteAsset>)[] = [];

      // Handle array of items
      if (Array.isArray(data)) {
        items = data;
      } 
      // Handle object with items array
      else if (data.items && Array.isArray(data.items)) {
        items = data.items;
      }
      // Handle object with dataInventory or assets property
      else if (dataType === 'data-inventory' && data.dataInventory) {
        items = Array.isArray(data.dataInventory) ? data.dataInventory : [];
      }
      else if (dataType === 'assets' && data.assets) {
        items = Array.isArray(data.assets) ? data.assets : [];
      }
      // Handle single item object
      else if (data.name) {
        items = [data];
      }
      else {
        errors.push('Invalid JSON structure. Expected array of items or object with items/dataInventory/assets property');
        return { success: false, items: [], errors };
      }

      return {
        success: items.length > 0,
        items,
        errors,
      };
    } catch (error) {
      return {
        success: false,
        items: [],
        errors: [`Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`],
      };
    }
  }

  /**
   * Parse XLSX file (using xlsx library)
   * @param buffer - The Excel file buffer
   * @param _dataType - Data type (currently unused, kept for API consistency)
   */
  static async parseXLSX(
    buffer: ArrayBuffer,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _dataType: DataType
  ): Promise<{
    success: boolean;
    items: (Partial<DataInventoryItem> | Partial<LiteAsset>)[];
    errors: string[];
  }> {
    try {
      // Dynamic import to avoid loading xlsx if not needed
      const XLSX = await import('xlsx');
      const workbook = XLSX.read(buffer, { type: 'array' });
      
      // Get first sheet
      const firstSheetName = workbook.SheetNames[0];
      if (!firstSheetName) {
        return {
          success: false,
          items: [],
          errors: ['Excel file has no sheets'],
        };
      }

      const worksheet = workbook.Sheets[firstSheetName];
      if (!worksheet) {
        return {
          success: false,
          items: [],
          errors: ['Excel file sheet is invalid'],
        };
      }

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false }) as Record<string, unknown>[];

      // Convert to our format
      const items = jsonData.map((row) => {
        // Normalize keys (handle spaces, case differences)
        const normalized: Record<string, unknown> = {};
        Object.keys(row).forEach(key => {
          const normalizedKey = key.trim().replace(/\s+/g, ' ');
          normalized[normalizedKey] = row[key];
        });
        return normalized;
      });

      return {
        success: items.length > 0,
        items: items as (Partial<DataInventoryItem> | Partial<LiteAsset>)[],
        errors: [],
      };
    } catch (error) {
      return {
        success: false,
        items: [],
        errors: [`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`],
      };
    }
  }

  /**
   * Parse CSV file
   */
  static parseCSV(content: string, dataType: DataType): {
    success: boolean;
    items: (Partial<DataInventoryItem> | Partial<LiteAsset>)[];
    errors: string[];
  } {
    if (dataType === 'data-inventory') {
      return parseDataInventoryCSV(content);
    } else {
      return parseAssetsCSV(content);
    }
  }

  /**
   * Main ingestion method - handles all file formats
   */
  static async ingestFile(
    file: File,
    dataType: DataType
  ): Promise<IngestionResult> {
    const format = this.detectFileFormat(file);
    const content = await this.readFileContent(file, format);

    let parseResult: {
      success: boolean;
      items: (Partial<DataInventoryItem> | Partial<LiteAsset>)[];
      errors: string[];
    };

    switch (format) {
      case 'csv':
        parseResult = this.parseCSV(content as string, dataType);
        break;
      case 'json':
        parseResult = this.parseJSON(content as string, dataType);
        break;
      case 'xlsx':
        parseResult = await this.parseXLSX(content as ArrayBuffer, dataType);
        break;
      default:
        return {
          success: false,
          imported: 0,
          errors: [`Unsupported file format: ${format}`],
          skipped: 0,
          format,
        };
    }

    return {
      success: parseResult.success,
      imported: parseResult.items.length,
      errors: parseResult.errors,
      skipped: 0,
      format,
    };
  }

  /**
   * Export to JSON
   */
  static exportToJSON(data: DataInventoryItem[] | LiteAsset[], dataType: DataType): void {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${dataType === 'data-inventory' ? 'data-inventory' : 'assets'}-${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  /**
   * Export to XLSX
   */
  static async exportToXLSX(data: DataInventoryItem[] | LiteAsset[], dataType: DataType): Promise<void> {
    try {
      const XLSX = await import('xlsx');
      
      // Convert data to worksheet format
      const worksheetData = data.map(item => {
        if (dataType === 'data-inventory') {
          const di = item as DataInventoryItem;
          return {
            Name: di.name,
            'Data Type': di.dataType,
            Classification: di.classification,
            Location: di.location,
            Owner: di.owner,
            Description: di.description || '',
            'Retention Period': di.retentionPeriod || '',
            Tags: (di.tags || []).join('; '),
            'Created At': di.createdAt.toISOString().split('T')[0],
            'Updated At': di.updatedAt.toISOString().split('T')[0],
          };
        } else {
          const asset = item as LiteAsset;
          return {
            Name: asset.name,
            Type: asset.type,
            Criticality: asset.criticality,
            Owner: asset.owner,
            Location: asset.location,
            Description: asset.description,
            'Data Classification': asset.dataClassification || '',
            'Data Types': (asset.dataTypes || []).join('; '),
            'Is Software': asset.isSoftware ? 'Yes' : 'No',
            'SBOM Available': asset.sbomAvailable ? 'Yes' : 'No',
            Tags: (asset.tags || []).join('; '),
            'Created At': asset.createdAt.toISOString().split('T')[0],
            'Updated At': asset.updatedAt.toISOString().split('T')[0],
          };
        }
      });

      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, dataType === 'data-inventory' ? 'Data Inventory' : 'Assets');

      XLSX.writeFile(workbook, `${dataType === 'data-inventory' ? 'data-inventory' : 'assets'}-${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      throw new Error(`Failed to export to Excel: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

