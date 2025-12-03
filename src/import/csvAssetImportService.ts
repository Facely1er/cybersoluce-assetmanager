/**
 * CSV Asset Import Service
 * 
 * Parses CSV files and converts them to AssetContract + signals.
 * 
 * RULES:
 * - No risk scoring or compliance assessment
 * - Only qualitative visibility and factual data
 */

import { CyberSoluceAssetContract, toAssetContract } from '@/contracts/cyberSoluce.asset.contract';
import { AssetSignal } from '@/contracts/cyberSoluce.signal.contract';
import { Asset } from '@/types/asset';

/**
 * Parsed CSV asset row
 */
export interface ParsedCsvAssetRow {
  asset_id: string;
  asset_name: string;
  asset_type?: string;
  business_role?: string;
  vendor_name?: string;
  owner_team?: string;
  environment?: string;
  critical_flag?: string;
}

/**
 * Simple CSV parser
 * Handles basic CSV format with headers
 */
export function parseCsvFile(csvContent: string): ParsedCsvAssetRow[] {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length === 0) {
    return [];
  }

  // Parse header
  const headerLine = lines[0];
  const headers = headerLine.split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));

  // Parse rows
  const rows: ParsedCsvAssetRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCsvLine(line);
    if (values.length === 0) continue;

    const row: Partial<ParsedCsvAssetRow> = {};
    headers.forEach((header, index) => {
      if (values[index] !== undefined) {
        row[header as keyof ParsedCsvAssetRow] = values[index].trim();
      }
    });

    // Only include rows with required fields
    if (row.asset_id && row.asset_name) {
      rows.push(row as ParsedCsvAssetRow);
    }
  }

  return rows;
}

/**
 * Parse a CSV line, handling quoted values
 */
function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  // Add last field
  values.push(current);
  return values;
}

/**
 * Map CSV row to Asset type (internal format)
 */
export function mapCsvRowToAsset(row: ParsedCsvAssetRow): Asset {
  const tags: string[] = [];
  if (row.business_role) {
    tags.push(`role:${row.business_role}`);
  }
  if (row.owner_team) {
    tags.push(`owner:${row.owner_team}`);
  }
  if (row.environment) {
    tags.push(`env:${row.environment}`);
  }
  if (row.vendor_name) {
    tags.push(`vendor:${row.vendor_name}`);
  }

  // Map asset type
  const assetType = mapAssetType(row.asset_type);

  return {
    id: row.asset_id,
    name: row.asset_name,
    type: assetType,
    criticality: 'Medium', // Default, not used for risk assessment
    owner: row.owner_team || 'Unknown',
    location: 'Unknown',
    description: `Asset imported from CSV${row.business_role ? ` - ${row.business_role}` : ''}`,
    complianceFrameworks: [],
    riskScore: 50, // Default placeholder, not used for risk assessment
    lastAssessed: new Date(),
    tags,
    relationships: [],
    vulnerabilities: [],
    status: 'Active',
    createdAt: new Date(),
    updatedAt: new Date(),
    dataClassification: 'Internal',
    dataTypes: [],
    legalBasis: [],
    dataSubjectRights: [],
    crossBorderTransfer: false,
    thirdPartySharing: !!row.vendor_name,
    encryptionStatus: 'Unknown',
    accessControls: [],
    privacyImpactAssessment: null,
    dataBreachHistory: [],
    dependencies: [],
    requirements: [],
  };
}

/**
 * Map CSV asset type to contract asset type
 */
function mapAssetType(csvType?: string): Asset['type'] {
  if (!csvType) return 'Server';

  const normalized = csvType.toLowerCase().trim();
  
  const typeMap: Record<string, Asset['type']> = {
    'server': 'Server',
    'database': 'Database',
    'application': 'Application',
    'app': 'Application',
    'network': 'Network',
    'endpoint': 'Endpoint',
    'cloud service': 'Cloud Service',
    'cloud': 'Cloud Service',
    'information asset': 'Information Asset',
    'data repository': 'Data Repository',
    'api': 'API',
    'file system': 'File System',
    'document': 'Document',
    'personal data': 'Personal Data',
    'sensitive data': 'Sensitive Data',
    'business process': 'Business Process',
    'third party service': 'Third Party Service',
    'third-party service': 'Third Party Service',
    'vendor': 'Third Party Service',
  };

  return typeMap[normalized] || 'Server';
}

/**
 * Build initial signals for CSV-imported asset
 * 
 * Creates qualitative signals indicating visibility establishment and vendor links.
 */
export function buildInitialSignalsForCsvAsset(row: ParsedCsvAssetRow): AssetSignal[] {
  const signals: AssetSignal[] = [];
  const now = new Date().toISOString();

  // Signal: Asset visibility established
  signals.push({
    signalId: `csv-import-${row.asset_id}-${Date.now()}`,
    signalType: 'exposure',
    description: 'Asset imported from CSV inventory – visibility established.',
    confidence: 'medium',
    source: 'import',
    timestamp: now,
    signalDomain: 'governance',
    affectedAssetIds: [row.asset_id],
    concentrationDescription: 'Asset visibility established through CSV import',
  });

  // Signal: Vendor dependency (if vendor name provided)
  if (row.vendor_name) {
    signals.push({
      signalId: `csv-vendor-${row.asset_id}-${Date.now()}`,
      signalType: 'dependency',
      description: `Asset is linked to vendor: ${row.vendor_name}.`,
      confidence: 'medium',
      source: 'import',
      timestamp: now,
      signalDomain: 'vendor',
      affectedAssetIds: [row.asset_id],
      concentrationDescription: `Vendor relationship identified: ${row.vendor_name}`,
    });
  }

  return signals;
}

/**
 * Convert Asset to AssetContract
 */
export function assetToContract(asset: Asset): CyberSoluceAssetContract {
  return toAssetContract(asset);
}

