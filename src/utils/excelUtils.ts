import { Asset } from '../types/asset';

export interface ExcelParseResult {
  success: boolean;
  assets: Partial<Asset>[];
  errors: string[];
  warnings: string[];
}

// Enhanced Excel/CSV parsing with better error handling and validation
export const parseExcelContent = async (file: File): Promise<ExcelParseResult> => {
  try {
    // Check file type first
    const fileName = file.name.toLowerCase();
    
    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      return {
        success: false,
        assets: [],
        errors: [
          'Excel files (.xlsx, .xls) are not currently supported.',
          'Please convert your Excel file to CSV format and try again.',
          'You can do this by opening your Excel file and using "Save As" → "CSV (Comma delimited)"'
        ],
        warnings: ['Use the CSV template download for the correct format.']
      };
    }
    
    if (!fileName.endsWith('.csv')) {
      return {
        success: false,
        assets: [],
        errors: ['Only CSV files are currently supported. Please upload a .csv file.'],
        warnings: []
      };
    }

    // Parse CSV file
    const content = await readFileAsText(file);
    return parseCSVContent(content);
    
  } catch (error) {
    return {
      success: false,
      assets: [],
      errors: [`Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`],
      warnings: []
    };
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

const parseCSVContent = (content: string): ExcelParseResult => {
  try {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    
    if (lines.length < 2) {
      return {
        success: false,
        assets: [],
        errors: ['File must contain at least a header row and one data row'],
        warnings: []
      };
    }

    // Parse header and detect column mapping
    const headers = parseCSVLine(lines[0]);
    const columnMapping = detectColumnMapping(headers);
    
    if (!columnMapping.isValid) {
      return {
        success: false,
        assets: [],
        errors: columnMapping.errors,
        warnings: []
      };
    }

    // Parse data rows
    const assets: Partial<Asset>[] = [];
    const errors: string[] = [];
    const warnings: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = parseCSVLine(lines[i]);
        const asset = parseAssetFromRow(values, columnMapping.mapping, i + 1);
        
        if (asset) {
          assets.push(asset);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Parse error';
        errors.push(`Row ${i + 1}: ${errorMessage}`);
      }
    }

    // Generate warnings for common issues
    if (assets.length === 0) {
      errors.push('No valid assets found in the file');
    }

    if (errors.length > 0 && assets.length > 0) {
      warnings.push(`${errors.length} rows were skipped due to validation errors`);
    }

    return {
      success: assets.length > 0,
      assets,
      errors: assets.length === 0 ? errors : [],
      warnings: [...warnings, ...(assets.length > 0 ? errors : [])]
    };
  } catch (error) {
    return {
      success: false,
      assets: [],
      errors: [`Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`],
      warnings: []
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

interface ColumnMapping {
  isValid: boolean;
  mapping: Map<string, number>;
  errors: string[];
}

const detectColumnMapping = (headers: string[]): ColumnMapping => {
  const mapping = new Map<string, number>();
  const errors: string[] = [];
  
  // Normalize headers and create mapping
  headers.forEach((header, index) => {
    const normalizedHeader = normalizeHeader(header);
    if (normalizedHeader) {
      mapping.set(normalizedHeader, index);
    }
  });

  // Check for required columns
  const requiredColumns = ['name', 'type', 'criticality', 'owner', 'location'];
  const missingColumns = requiredColumns.filter(col => !mapping.has(col));
  
  if (missingColumns.length > 0) {
    errors.push(`Missing required columns: ${missingColumns.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    mapping,
    errors
  };
};

const normalizeHeader = (header: string): string | null => {
  const normalized = header.toLowerCase().trim().replace(/['"]/g, '');
  
  // Map various header formats to standard field names
  const headerMappings: Record<string, string> = {
    'name': 'name',
    'asset name': 'name',
    'asset_name': 'name',
    'hostname': 'name',
    'device name': 'name',
    
    'type': 'type',
    'asset type': 'type',
    'asset_type': 'type',
    'category': 'type',
    'device type': 'type',
    
    'criticality': 'criticality',
    'priority': 'criticality',
    'importance': 'criticality',
    'risk level': 'criticality',
    
    'owner': 'owner',
    'responsible': 'owner',
    'assigned to': 'owner',
    'contact': 'owner',
    
    'location': 'location',
    'site': 'location',
    'facility': 'location',
    'datacenter': 'location',
    'data center': 'location',
    
    'ip address': 'ipAddress',
    'ip_address': 'ipAddress',
    'ip': 'ipAddress',
    'address': 'ipAddress',
    
    'description': 'description',
    'notes': 'description',
    'comments': 'description',
    
    'risk score': 'riskScore',
    'risk_score': 'riskScore',
    'score': 'riskScore',
    
    'status': 'status',
    'state': 'status',
    
    'compliance': 'complianceFrameworks',
    'compliance frameworks': 'complianceFrameworks',
    'frameworks': 'complianceFrameworks',
    
    'tags': 'tags',
    'labels': 'tags',
    'keywords': 'tags'
  };

  return headerMappings[normalized] || null;
};

const parseAssetFromRow = (values: string[], mapping: Map<string, number>, rowNumber: number): Partial<Asset> | null => {
  const getValue = (fieldName: string): string => {
    const index = mapping.get(fieldName);
    if (index === undefined || index >= values.length) return '';
    return values[index].replace(/"/g, '').trim();
  };

  // Required fields
  const name = getValue('name');
  if (!name) {
    throw new Error('Asset name is required');
  }

  const type = getValue('type') as Asset['type'];
  const validTypes: Asset['type'][] = ['Server', 'Database', 'Application', 'Network', 'Endpoint', 'Cloud Service'];
  
  // Try to map common type variations
  const typeMapping: Record<string, Asset['type']> = {
    'server': 'Server',
    'database': 'Database',
    'db': 'Database',
    'application': 'Application',
    'app': 'Application',
    'network': 'Network',
    'networking': 'Network',
    'endpoint': 'Endpoint',
    'workstation': 'Endpoint',
    'laptop': 'Endpoint',
    'desktop': 'Endpoint',
    'cloud': 'Cloud Service',
    'cloud service': 'Cloud Service',
    'saas': 'Cloud Service'
  };

  const normalizedType = typeMapping[type.toLowerCase()] || type;
  if (!validTypes.includes(normalizedType as Asset['type'])) {
    throw new Error(`Invalid type: ${type}. Must be one of: ${validTypes.join(', ')}`);
  }

  const criticality = getValue('criticality') as Asset['criticality'];
  const validCriticalities: Asset['criticality'][] = ['Critical', 'High', 'Medium', 'Low'];
  
  // Try to map common criticality variations
  const criticalityMapping: Record<string, Asset['criticality']> = {
    'critical': 'Critical',
    'high': 'High',
    'medium': 'Medium',
    'med': 'Medium',
    'low': 'Low',
    '1': 'Critical',
    '2': 'High',
    '3': 'Medium',
    '4': 'Low'
  };

  const normalizedCriticality = criticalityMapping[criticality.toLowerCase()] || criticality;
  if (!validCriticalities.includes(normalizedCriticality as Asset['criticality'])) {
    throw new Error(`Invalid criticality: ${criticality}. Must be one of: ${validCriticalities.join(', ')}`);
  }

  const owner = getValue('owner');
  if (!owner) {
    throw new Error('Owner is required');
  }

  const location = getValue('location');
  if (!location) {
    throw new Error('Location is required');
  }

  // Optional fields with defaults
  const riskScoreStr = getValue('riskScore');
  let riskScore = 50; // Default value
  if (riskScoreStr) {
    const parsed = parseInt(riskScoreStr);
    if (isNaN(parsed) || parsed < 0 || parsed > 100) {
      throw new Error('Risk Score must be a number between 0 and 100');
    }
    riskScore = parsed;
  }

  const status = getValue('status') as Asset['status'] || 'Active';
  const validStatuses: Asset['status'][] = ['Active', 'Inactive', 'Retired', 'Planned'];
  
  const statusMapping: Record<string, Asset['status']> = {
    'active': 'Active',
    'inactive': 'Inactive',
    'retired': 'Retired',
    'planned': 'Planned',
    'decommissioned': 'Retired',
    'offline': 'Inactive'
  };

  const normalizedStatus = statusMapping[status.toLowerCase()] || status;
  if (!validStatuses.includes(normalizedStatus as Asset['status'])) {
    throw new Error(`Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}`);
  }

  // Parse arrays (semicolon or comma separated)
  const complianceFrameworks = getValue('complianceFrameworks')
    .split(/[;,]/)
    .map(f => f.trim())
    .filter(f => f);

  const tags = getValue('tags')
    .split(/[;,]/)
    .map(t => t.trim())
    .filter(t => t);

  const ipAddress = getValue('ipAddress') || undefined;

  return {
    name,
    type: normalizedType as Asset['type'],
    criticality: normalizedCriticality as Asset['criticality'],
    owner,
    location,
    ipAddress,
    description: getValue('description') || `Imported ${normalizedType.toLowerCase()} asset`,
    riskScore,
    status: normalizedStatus as Asset['status'],
    complianceFrameworks,
    tags,
    relationships: [],
    vulnerabilities: [],
    lastAssessed: new Date()
  };
};

// Generate enhanced CSV template with examples
export const generateEnhancedCSVTemplate = (): void => {
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
      'Production Web Server 01',
      'Server',
      'Critical',
      'DevOps Team',
      'Data Center Primary',
      '192.168.1.10',
      'Primary web server hosting customer applications',
      '85',
      'Active',
      'SOC 2; PCI DSS; ISO 27001',
      'production; web-server; customer-facing; high-availability'
    ],
    [
      'Customer Database Cluster',
      'Database',
      'Critical',
      'Database Team',
      'Data Center Primary',
      '192.168.1.20',
      'Primary customer data repository with encryption',
      '92',
      'Active',
      'SOC 2; PCI DSS; GDPR; HIPAA',
      'production; database; customer-data; encrypted; clustered'
    ],
    [
      'Office Network Core Switch',
      'Network',
      'High',
      'Network Team',
      'Office Building A - Floor 2',
      '192.168.100.1',
      'Core network switch providing connectivity to all office devices',
      '65',
      'Active',
      'ISO 27001',
      'network; infrastructure; office; core-switch'
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
  link.setAttribute('download', 'ermits-asset-import-template.csv');
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};