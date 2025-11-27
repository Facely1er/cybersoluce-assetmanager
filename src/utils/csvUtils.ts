import { Asset } from '../types/asset';

export interface CSVParseResult {
  success: boolean;
  assets: Partial<Asset>[];
  errors: string[];
}

// CSV column mapping
const CSV_COLUMNS = {
  name: 'Name',
  type: 'Type',
  criticality: 'Criticality',
  owner: 'Owner',
  location: 'Location',
  ipAddress: 'IP Address',
  description: 'Description',
  riskScore: 'Risk Score',
  status: 'Status',
  complianceFrameworks: 'Compliance Frameworks',
  tags: 'Tags'
};

const REQUIRED_COLUMNS = ['Name', 'Type', 'Criticality', 'Owner', 'Location'];

export const parseCSVContent = (content: string): CSVParseResult => {
  try {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    
    if (lines.length < 2) {
      return {
        success: false,
        assets: [],
        errors: ['CSV file must contain at least a header row and one data row']
      };
    }

    // Parse header
    const headers = parseCSVLine(lines[0]);
    const headerMap = createHeaderMap(headers);
    
    // Validate required columns
    const missingColumns = REQUIRED_COLUMNS.filter(col => !headerMap.has(col));
    if (missingColumns.length > 0) {
      return {
        success: false,
        assets: [],
        errors: [`Missing required columns: ${missingColumns.join(', ')}`]
      };
    }

    // Parse data rows
    const assets: Partial<Asset>[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = parseCSVLine(lines[i]);
        const asset = parseAssetFromRow(values, headerMap, i + 1);
        
        if (asset) {
          assets.push(asset);
        }
      } catch (error) {
        errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Parse error'}`);
      }
    }

    return {
      success: assets.length > 0,
      assets,
      errors
    };
  } catch (error) {
    return {
      success: false,
      assets: [],
      errors: [`Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`]
    };
  }
};

const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i += 2;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }
  
  // Add the last field
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

const parseAssetFromRow = (values: string[], headerMap: Map<string, number>, rowNumber: number): Partial<Asset> | null => {
  const getValue = (columnName: string): string => {
    const index = headerMap.get(columnName);
    if (index === undefined || index >= values.length) return '';
    return values[index].replace(/"/g, '').trim();
  };

  const name = getValue('Name');
  if (!name) {
    throw new Error('Name is required');
  }

  const type = getValue('Type') as Asset['type'];
  const validTypes: Asset['type'][] = ['Server', 'Database', 'Application', 'Network', 'Endpoint', 'Cloud Service'];
  if (!validTypes.includes(type)) {
    throw new Error(`Invalid type: ${type}. Must be one of: ${validTypes.join(', ')}`);
  }

  const criticality = getValue('Criticality') as Asset['criticality'];
  const validCriticalities: Asset['criticality'][] = ['Critical', 'High', 'Medium', 'Low'];
  if (!validCriticalities.includes(criticality)) {
    throw new Error(`Invalid criticality: ${criticality}. Must be one of: ${validCriticalities.join(', ')}`);
  }

  const owner = getValue('Owner');
  if (!owner) {
    throw new Error('Owner is required');
  }

  const location = getValue('Location');
  if (!location) {
    throw new Error('Location is required');
  }

  const riskScoreStr = getValue('Risk Score');
  let riskScore = 50; // Default value
  if (riskScoreStr) {
    const parsed = parseInt(riskScoreStr);
    if (isNaN(parsed) || parsed < 0 || parsed > 100) {
      throw new Error('Risk Score must be a number between 0 and 100');
    }
    riskScore = parsed;
  }

  const status = getValue('Status') as Asset['status'] || 'Active';
  const validStatuses: Asset['status'][] = ['Active', 'Inactive', 'Retired', 'Planned'];
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}`);
  }

  // Parse arrays
  const complianceFrameworks = getValue('Compliance Frameworks')
    .split(';')
    .map(f => f.trim())
    .filter(f => f);

  const tags = getValue('Tags')
    .split(';')
    .map(t => t.trim())
    .filter(t => t);

  const ipAddress = getValue('IP Address') || undefined;

  return {
    name,
    type,
    criticality,
    owner,
    location,
    ipAddress,
    description: getValue('Description') || '',
    riskScore,
    status,
    complianceFrameworks,
    tags,
    relationships: [],
    vulnerabilities: [],
    lastAssessed: new Date()
  };
};

export const generateCSVTemplate = (): void => {
  const headers = [
    'Name',
    'Type',
    'Criticality',
    'Owner',
    'Location',
    'IP Address',
    'Description',
    'Risk Score',
    'Status',
    'Compliance Frameworks',
    'Tags'
  ];

  const sampleRows = [
    [
      'Production Web Server',
      'Server',
      'Critical',
      'DevOps Team',
      'Data Center A',
      '192.168.1.10',
      'Primary web server for customer applications',
      '85',
      'Active',
      'SOC 2; PCI DSS',
      'production; web-server; customer-facing'
    ],
    [
      'Customer Database',
      'Database',
      'Critical',
      'Database Team',
      'Data Center A',
      '192.168.1.20',
      'Primary customer data repository',
      '92',
      'Active',
      'SOC 2; PCI DSS; GDPR',
      'production; database; customer-data'
    ],
    [
      'Office Network Switch',
      'Network',
      'High',
      'Network Team',
      'Office Building A',
      '192.168.100.1',
      'Core network switch for office connectivity',
      '65',
      'Active',
      'ISO 27001',
      'network; infrastructure; office'
    ]
  ];

  const csvContent = [
    headers.join(','),
    ...sampleRows.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', 'asset-inventory-template.csv');
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

export const exportAssetsToCSV = (assets: Asset[]): void => {
  const headers = [
    'Name',
    'Type',
    'Criticality',
    'Owner',
    'Location',
    'IP Address',
    'Description',
    'Risk Score',
    'Status',
    'Last Assessed',
    'Compliance Frameworks',
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
      `"${asset.ipAddress || ''}"`,
      `"${asset.description}"`,
      asset.riskScore.toString(),
      `"${asset.status}"`,
      asset.lastAssessed.toISOString().split('T')[0],
      `"${asset.complianceFrameworks.join('; ')}"`,
      `"${asset.tags.join('; ')}"`,
      asset.createdAt.toISOString().split('T')[0],
      asset.updatedAt.toISOString().split('T')[0]
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `asset-inventory-export-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

export const generateEnhancedCSVTemplate = (): void => {
  generateCSVTemplate();
};