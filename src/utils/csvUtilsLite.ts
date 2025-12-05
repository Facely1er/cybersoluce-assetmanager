import { DataInventoryItem } from '../types/dataInventory';
import { LiteAsset } from '../types/assetLite';

export interface CSVParseResult<T> {
  success: boolean;
  items: T[];
  errors: string[];
}

// Data Inventory CSV parsing
export const parseDataInventoryCSV = (content: string): CSVParseResult<Partial<DataInventoryItem>> => {
  try {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    
    if (lines.length < 2) {
      return {
        success: false,
        items: [],
        errors: ['CSV file must contain at least a header row and one data row']
      };
    }

    const firstLine = lines[0];
    if (!firstLine) {
      return {
        success: false,
        items: [],
        errors: ['CSV file has no header row']
      };
    }

    const headers = parseCSVLine(firstLine);
    const headerMap = createHeaderMap(headers);
    
    const items: Partial<DataInventoryItem>[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      try {
        const line = lines[i];
        if (!line) continue;
        const values = parseCSVLine(line);
        const item = parseDataInventoryFromRow(values, headerMap, i + 1);
        if (item) {
          items.push(item);
        }
      } catch (error) {
        errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Parse error'}`);
      }
    }

    return {
      success: items.length > 0,
      items,
      errors
    };
  } catch (error) {
    return {
      success: false,
      items: [],
      errors: [`Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`]
    };
  }
};

// Asset CSV parsing
export const parseAssetsCSV = (content: string): CSVParseResult<Partial<LiteAsset>> => {
  try {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    
    if (lines.length < 2) {
      return {
        success: false,
        items: [],
        errors: ['CSV file must contain at least a header row and one data row']
      };
    }

    const firstLine = lines[0];
    if (!firstLine) {
      return {
        success: false,
        items: [],
        errors: ['CSV file has no header row']
      };
    }

    const headers = parseCSVLine(firstLine);
    const headerMap = createHeaderMap(headers);
    
    const items: Partial<LiteAsset>[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      try {
        const line = lines[i];
        if (!line) continue;
        const values = parseCSVLine(line);
        const item = parseAssetFromRow(values, headerMap, i + 1);
        if (item) {
          items.push(item);
        }
      } catch (error) {
        errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Parse error'}`);
      }
    }

    return {
      success: items.length > 0,
      items,
      errors
    };
  } catch (error) {
    return {
      success: false,
      items: [],
      errors: [`Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`]
    };
  }
};

const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 2;
      } else {
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }
  
  result.push(current.trim());
  return result;
};

const createHeaderMap = (headers: string[]): Map<string, number> => {
  const map = new Map<string, number>();
  headers.forEach((header, index) => {
    const normalizedHeader = header.trim().replace(/"/g, '');
    map.set(normalizedHeader, index);
  });
  return map;
};

const parseDataInventoryFromRow = (
  values: string[],
  headerMap: Map<string, number>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _rowNumber: number
): Partial<DataInventoryItem> | null => {
  const getValue = (columnName: string): string => {
    const index = headerMap.get(columnName);
    if (index === undefined || index >= values.length) return '';
    const value = values[index];
    if (value === undefined) return '';
    return value.replace(/"/g, '').trim();
  };

  const name = getValue('Name');
  if (!name) {
    throw new Error('Name is required');
  }

  return {
    name,
    dataType: getValue('Data Type') as DataInventoryItem['dataType'] || 'Other',
    classification: getValue('Classification') as DataInventoryItem['classification'] || 'Internal',
    location: getValue('Location') || '',
    owner: getValue('Owner') || '',
    description: getValue('Description') || '',
    retentionPeriod: getValue('Retention Period') ? parseInt(getValue('Retention Period')) : undefined,
    tags: getValue('Tags') ? getValue('Tags').split(';').map(t => t.trim()).filter(t => t) : [],
  };
};

const parseAssetFromRow = (
  values: string[],
  headerMap: Map<string, number>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _rowNumber: number
): Partial<LiteAsset> | null => {
  const getValue = (columnName: string): string => {
    const index = headerMap.get(columnName);
    if (index === undefined || index >= values.length) return '';
    const value = values[index];
    if (value === undefined) return '';
    return value.replace(/"/g, '').trim();
  };

  const name = getValue('Name');
  if (!name) {
    throw new Error('Name is required');
  }

  const type = getValue('Type') as LiteAsset['type'] || 'Server';
  const validTypes: LiteAsset['type'][] = ['Server', 'Database', 'Application', 'Network', 'File System', 'Software', 'Service'];
  if (!validTypes.includes(type)) {
    throw new Error(`Invalid type: ${type}`);
  }

  const criticality = getValue('Criticality') as LiteAsset['criticality'] || 'Medium';
  const validCriticalities: LiteAsset['criticality'][] = ['Critical', 'High', 'Medium', 'Low'];
  if (!validCriticalities.includes(criticality)) {
    throw new Error(`Invalid criticality: ${criticality}`);
  }

  const owner = getValue('Owner') || '';
  if (!owner) {
    throw new Error('Owner is required');
  }

  const location = getValue('Location') || '';
  if (!location) {
    throw new Error('Location is required');
  }

  const isSoftware = getValue('Is Software')?.toLowerCase() === 'yes' || 
                     getValue('Is Software')?.toLowerCase() === 'true' ||
                     type === 'Software';

  return {
    name,
    type,
    criticality,
    owner,
    location,
    description: getValue('Description') || '',
    dataClassification: getValue('Data Classification') as LiteAsset['dataClassification'] || undefined,
    dataTypes: getValue('Data Types') ? getValue('Data Types').split(';').map(t => t.trim()).filter(t => t) : [],
    isSoftware,
    tags: getValue('Tags') ? getValue('Tags').split(';').map(t => t.trim()).filter(t => t) : [],
  };
};

// Export functions
export const exportDataInventoryToCSV = (items: DataInventoryItem[]): void => {
  const headers = [
    'Name',
    'Data Type',
    'Classification',
    'Location',
    'Owner',
    'Description',
    'Retention Period',
    'Tags',
    'Created At',
    'Updated At'
  ];

  const csvContent = [
    headers.join(','),
    ...items.map(item => [
      `"${item.name}"`,
      `"${item.dataType}"`,
      `"${item.classification}"`,
      `"${item.location}"`,
      `"${item.owner}"`,
      `"${item.description || ''}"`,
      item.retentionPeriod?.toString() || '',
      `"${(item.tags || []).join('; ')}"`,
      item.createdAt.toISOString().split('T')[0],
      item.updatedAt.toISOString().split('T')[0]
    ].join(','))
  ].join('\n');

  downloadCSV(csvContent, `data-inventory-export-${new Date().toISOString().split('T')[0]}.csv`);
};

export const exportAssetsToCSV = (assets: LiteAsset[]): void => {
  const headers = [
    'Name',
    'Type',
    'Criticality',
    'Owner',
    'Location',
    'Description',
    'Data Classification',
    'Data Types',
    'Is Software',
    'SBOM Available',
    'Tags',
    'Created At',
    'Updated At'
  ];

  const csvContent = [
    headers.join(','),
    ...assets.map(asset => [
      `"${asset.name}"`,
      `"${asset.type}"`,
      `"${asset.criticality}"`,
      `"${asset.owner}"`,
      `"${asset.location}"`,
      `"${asset.description}"`,
      `"${asset.dataClassification || ''}"`,
      `"${(asset.dataTypes || []).join('; ')}"`,
      asset.isSoftware ? 'Yes' : 'No',
      asset.sbomAvailable ? 'Yes' : 'No',
      `"${(asset.tags || []).join('; ')}"`,
      asset.createdAt.toISOString().split('T')[0],
      asset.updatedAt.toISOString().split('T')[0]
    ].join(','))
  ].join('\n');

  downloadCSV(csvContent, `assets-export-${new Date().toISOString().split('T')[0]}.csv`);
};

const downloadCSV = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

export const generateDataInventoryTemplate = (): void => {
  const headers = [
    'Name',
    'Data Type',
    'Classification',
    'Location',
    'Owner',
    'Description',
    'Retention Period',
    'Tags'
  ];

  const sampleRows = [
    [
      'Customer Database',
      'PII',
      'Confidential',
      'AWS S3',
      'IT Department',
      'Customer personal information',
      '2555',
      'customer-data; pii; database'
    ],
    [
      'Employee Records',
      'PII',
      'Confidential',
      'On-Premise Server',
      'HR Department',
      'Employee personal and employment data',
      '2555',
      'employee; hr; pii'
    ],
  ];

  const csvContent = [
    headers.join(','),
    ...sampleRows.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    )
  ].join('\n');

  downloadCSV(csvContent, 'data-inventory-template.csv');
};

export const generateAssetsTemplate = (): void => {
  const headers = [
    'Name',
    'Type',
    'Criticality',
    'Owner',
    'Location',
    'Description',
    'Data Classification',
    'Data Types',
    'Is Software',
    'Tags'
  ];

  const sampleRows = [
    [
      'Production Database Server',
      'Database',
      'Critical',
      'IT Department',
      'AWS S3',
      'Main production database',
      'Confidential',
      'PII; Financial',
      'No',
      'production; database; critical'
    ],
    [
      'Customer Web Application',
      'Application',
      'High',
      'Development Team',
      'AWS EC2',
      'Customer-facing web application',
      'Confidential',
      'PII',
      'Yes',
      'production; web-app; customer-facing'
    ],
    [
      'React UI Library',
      'Software',
      'Medium',
      'Development Team',
      'NPM Registry',
      'Frontend UI component library',
      'Internal',
      '',
      'Yes',
      'library; frontend; npm'
    ],
  ];

  const csvContent = [
    headers.join(','),
    ...sampleRows.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    )
  ].join('\n');

  downloadCSV(csvContent, 'assets-template.csv');
};

// JSON template generators
export const generateDataInventoryJSONTemplate = (): void => {
  const template: DataInventoryItem[] = [
    {
      id: 'example-1',
      name: 'Customer Database',
      dataType: 'PII',
      classification: 'Confidential',
      location: 'AWS S3',
      owner: 'IT Department',
      description: 'Customer personal information',
      retentionPeriod: 2555,
      tags: ['customer-data', 'pii', 'database'],
      supportingAssets: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'example-2',
      name: 'Employee Records',
      dataType: 'PII',
      classification: 'Confidential',
      location: 'On-Premise Server',
      owner: 'HR Department',
      description: 'Employee personal and employment data',
      retentionPeriod: 2555,
      tags: ['employee', 'hr', 'pii'],
      supportingAssets: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const jsonContent = JSON.stringify(template, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', 'data-inventory-template.json');
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

export const generateAssetsJSONTemplate = (): void => {
  const template: LiteAsset[] = [
    {
      id: 'example-1',
      name: 'Production Database Server',
      type: 'Database',
      criticality: 'Critical',
      owner: 'IT Department',
      location: 'AWS S3',
      description: 'Main production database',
      dataClassification: 'Confidential',
      dataTypes: ['PII', 'Financial'],
      isSoftware: false,
      tags: ['production', 'database', 'critical'],
      relatedDataItems: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'example-2',
      name: 'Customer Web Application',
      type: 'Application',
      criticality: 'High',
      owner: 'Development Team',
      location: 'AWS EC2',
      description: 'Customer-facing web application',
      dataClassification: 'Confidential',
      dataTypes: ['PII'],
      isSoftware: true,
      tags: ['production', 'web-app', 'customer-facing'],
      relatedDataItems: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const jsonContent = JSON.stringify(template, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', 'assets-template.json');
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

