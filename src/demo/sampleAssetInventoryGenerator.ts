/**
 * DEMO-ONLY:
 * Generates synthetic asset inventories for trials and demos.
 * Data is fictional and must never be used as real evidence.
 */

import { Asset } from '../types/asset';
import { CyberSoluceAssetContract, toAssetContract } from '../contracts/cyberSoluce.asset.contract';

export type SectorKey =
  | 'healthcare'
  | 'financial'
  | 'saas'
  | 'manufacturing'
  | 'education'
  | 'publicSector';

export type OrgSize = 'small' | 'medium' | 'large';

export type DemoAsset = Asset & {
  demo: true;
  demoNote: 'DEMO_ONLY_NOT_REAL';
};

interface SectorTemplate {
  sector: SectorKey;
  owners: string[];
  businessFunctions: string[];
  vendors: string[];
  assetArchetypes: Array<{
    assetType: string;
    category: 'Application' | 'Database' | 'Endpoint' | 'Network' | 'Vendor' | 'SaaS';
    defaultDataSensitivity: 'Public' | 'Internal' | 'Confidential' | 'Restricted';
    defaultCriticality: 'Critical' | 'High' | 'Medium' | 'Low';
    baseNames: string[];
    typicalTags: string[];
    typicalLocation: 'On-Prem' | 'Cloud' | 'Hybrid';
  }>;
}

const SECTOR_TEMPLATES: Record<SectorKey, SectorTemplate> = {
  healthcare: {
    sector: 'healthcare',
    owners: ['CIO', 'CMIO', 'Clinical IT Lead', 'Security Operations'],
    businessFunctions: ['Clinical Care', 'Radiology', 'Billing', 'Pharmacy', 'Lab Operations'],
    vendors: ['Epic', 'Cerner', 'Philips', 'GE Healthcare', 'MedTech Cloud'],
    assetArchetypes: [
      {
        assetType: 'Electronic Health Record (EHR)',
        category: 'Application',
        defaultDataSensitivity: 'Restricted',
        defaultCriticality: 'Critical',
        baseNames: ['EHR Core', 'Outpatient EHR', 'Inpatient EHR'],
        typicalTags: ['PHI', 'Clinical', 'Patient-Data'],
        typicalLocation: 'Cloud',
      },
      {
        assetType: 'PACS Imaging System',
        category: 'Application',
        defaultDataSensitivity: 'Confidential',
        defaultCriticality: 'High',
        baseNames: ['Radiology PACS', 'Cardiology Imaging Repository'],
        typicalTags: ['Imaging', 'DICOM', 'PHI'],
        typicalLocation: 'Hybrid',
      },
      {
        assetType: 'Medication Dispensing Cabinet',
        category: 'Endpoint',
        defaultDataSensitivity: 'Confidential',
        defaultCriticality: 'High',
        baseNames: ['MedCart-Cluster-1', 'Pharmacy-Dispense-01'],
        typicalTags: ['IoT', 'Medication', 'Clinical-Device'],
        typicalLocation: 'On-Prem',
      },
      {
        assetType: 'Clinical Data Warehouse',
        category: 'Database',
        defaultDataSensitivity: 'Restricted',
        defaultCriticality: 'High',
        baseNames: ['Clinical-DW', 'Population-Health-DW'],
        typicalTags: ['Analytics', 'PHI', 'Reporting'],
        typicalLocation: 'Cloud',
      },
      {
        assetType: 'Patient Portal',
        category: 'SaaS',
        defaultDataSensitivity: 'Confidential',
        defaultCriticality: 'High',
        baseNames: ['MyHealth Portal', 'Patient Access Portal'],
        typicalTags: ['External-Facing', 'PHI', 'WebApp'],
        typicalLocation: 'Cloud',
      },
    ],
  },

  financial: {
    sector: 'financial',
    owners: ['CIO', 'CTO', 'Head of Trading IT', 'CISO'],
    businessFunctions: ['Payments', 'Core Banking', 'Trading', 'Risk & Compliance', 'Treasury'],
    vendors: ['FIS', 'Fiserv', 'Temenos', 'Bloomberg', 'SWIFT'],
    assetArchetypes: [
      {
        assetType: 'Core Banking Platform',
        category: 'Application',
        defaultDataSensitivity: 'Restricted',
        defaultCriticality: 'Critical',
        baseNames: ['CoreBank-Prod', 'Retail-Core', 'Corporate-Core'],
        typicalTags: ['Payments', 'Core', 'Customer-Data'],
        typicalLocation: 'Hybrid',
      },
      {
        assetType: 'Payment Switch',
        category: 'Application',
        defaultDataSensitivity: 'Confidential',
        defaultCriticality: 'Critical',
        baseNames: ['Card-Switch-01', 'Payments-Hub-Prod'],
        typicalTags: ['Card', 'Payments', 'RealTime'],
        typicalLocation: 'On-Prem',
      },
      {
        assetType: 'Trading Platform',
        category: 'Application',
        defaultDataSensitivity: 'Confidential',
        defaultCriticality: 'High',
        baseNames: ['Trading-Equities', 'Trading-FixedIncome'],
        typicalTags: ['Trading', 'Market-Data', 'FrontOffice'],
        typicalLocation: 'Hybrid',
      },
      {
        assetType: 'Customer Data Warehouse',
        category: 'Database',
        defaultDataSensitivity: 'Restricted',
        defaultCriticality: 'High',
        baseNames: ['Customer360-DW', 'KYC-Repository'],
        typicalTags: ['KYC', 'AML', 'Analytics'],
        typicalLocation: 'Cloud',
      },
      {
        assetType: 'Mobile Banking App',
        category: 'SaaS',
        defaultDataSensitivity: 'Confidential',
        defaultCriticality: 'High',
        baseNames: ['MobileBanking-iOS', 'MobileBanking-Android'],
        typicalTags: ['External-Facing', 'Consumer', 'App'],
        typicalLocation: 'Cloud',
      },
    ],
  },

  saas: {
    sector: 'saas',
    owners: ['CTO', 'Head of Platform', 'Head of SRE', 'Head of Product'],
    businessFunctions: ['Core Platform', 'Billing', 'Support', 'Analytics'],
    vendors: ['AWS', 'Azure', 'GCP', 'Stripe', 'Auth0'],
    assetArchetypes: [
      {
        assetType: 'Multi-tenant Web API',
        category: 'Application',
        defaultDataSensitivity: 'Confidential',
        defaultCriticality: 'Critical',
        baseNames: ['Public-API-Gateway', 'Core-API-Service'],
        typicalTags: ['API', 'MultiTenant', 'External'],
        typicalLocation: 'Cloud',
      },
      {
        assetType: 'PostgreSQL Production Cluster',
        category: 'Database',
        defaultDataSensitivity: 'Confidential',
        defaultCriticality: 'High',
        baseNames: ['Prod-DB-Cluster-A', 'Tenant-Data-Cluster'],
        typicalTags: ['RDS', 'Database', 'PaaS'],
        typicalLocation: 'Cloud',
      },
      {
        assetType: 'Authentication Service',
        category: 'Application',
        defaultDataSensitivity: 'Confidential',
        defaultCriticality: 'High',
        baseNames: ['Auth-Service', 'Identity-Gateway'],
        typicalTags: ['Auth', 'SSO', 'JWT'],
        typicalLocation: 'Cloud',
      },
      {
        assetType: 'CI/CD Pipeline',
        category: 'Application',
        defaultDataSensitivity: 'Internal',
        defaultCriticality: 'Medium',
        baseNames: ['CI-Pipeline-Main', 'Deploy-Orchestrator'],
        typicalTags: ['DevOps', 'CI/CD', 'Automation'],
        typicalLocation: 'Cloud',
      },
      {
        assetType: 'Customer Support Platform',
        category: 'SaaS',
        defaultDataSensitivity: 'Confidential',
        defaultCriticality: 'Medium',
        baseNames: ['Zendesk-Instance', 'Support-Portal'],
        typicalTags: ['Support', 'Tickets', 'Customer-Data'],
        typicalLocation: 'Cloud',
      },
    ],
  },

  manufacturing: {
    sector: 'manufacturing',
    owners: ['Plant IT Lead', 'OT Security', 'CIO'],
    businessFunctions: ['Production', 'Supply Chain', 'Quality', 'Maintenance'],
    vendors: ['Siemens', 'Rockwell', 'Schneider Electric', 'SAP'],
    assetArchetypes: [
      {
        assetType: 'MES (Manufacturing Execution System)',
        category: 'Application',
        defaultDataSensitivity: 'Internal',
        defaultCriticality: 'High',
        baseNames: ['MES-Plant-1', 'MES-Global'],
        typicalTags: ['OT', 'Production', 'SCADA'],
        typicalLocation: 'On-Prem',
      },
      {
        assetType: 'SCADA Server',
        category: 'Application',
        defaultDataSensitivity: 'Internal',
        defaultCriticality: 'Critical',
        baseNames: ['SCADA-Plant-1', 'SCADA-Control-Room'],
        typicalTags: ['SCADA', 'Control', 'OT'],
        typicalLocation: 'On-Prem',
      },
      {
        assetType: 'PLC Network Segment',
        category: 'Network',
        defaultDataSensitivity: 'Internal',
        defaultCriticality: 'High',
        baseNames: ['PLC-Line-1', 'PLC-Packaging'],
        typicalTags: ['PLC', 'Network', 'OT'],
        typicalLocation: 'On-Prem',
      },
      {
        assetType: 'ERP System',
        category: 'Application',
        defaultDataSensitivity: 'Confidential',
        defaultCriticality: 'High',
        baseNames: ['SAP-ERP-Prod', 'ERP-Global'],
        typicalTags: ['ERP', 'SupplyChain', 'Finance'],
        typicalLocation: 'Hybrid',
      },
    ],
  },

  education: {
    sector: 'education',
    owners: ['CIO', 'Registrar IT', 'Learning Systems Lead'],
    businessFunctions: ['Teaching', 'Research', 'Student Services', 'Administration'],
    vendors: ['Canvas', 'Moodle', 'Blackboard', 'Ellucian'],
    assetArchetypes: [
      {
        assetType: 'Learning Management System (LMS)',
        category: 'Application',
        defaultDataSensitivity: 'Confidential',
        defaultCriticality: 'High',
        baseNames: ['LMS-Core', 'Online-Courses-Portal'],
        typicalTags: ['Students', 'Courses', 'Exams'],
        typicalLocation: 'Cloud',
      },
      {
        assetType: 'Student Information System (SIS)',
        category: 'Application',
        defaultDataSensitivity: 'Confidential',
        defaultCriticality: 'High',
        baseNames: ['SIS-Prod', 'Student-Records'],
        typicalTags: ['Grades', 'Enrollment', 'Student-Data'],
        typicalLocation: 'Hybrid',
      },
      {
        assetType: 'Research Data Storage',
        category: 'Database',
        defaultDataSensitivity: 'Confidential',
        defaultCriticality: 'Medium',
        baseNames: ['Research-Cluster', 'Lab-Data-Store'],
        typicalTags: ['Research', 'Data', 'Science'],
        typicalLocation: 'Hybrid',
      },
    ],
  },

  publicSector: {
    sector: 'publicSector',
    owners: ['CIO', 'Digital Services Lead', 'Records Management'],
    businessFunctions: ['Citizen Services', 'Permits', 'Records', 'Finance'],
    vendors: ['Tyler Tech', 'SAP', 'Oracle', 'CivicPlus'],
    assetArchetypes: [
      {
        assetType: 'Citizen Portal',
        category: 'SaaS',
        defaultDataSensitivity: 'Confidential',
        defaultCriticality: 'High',
        baseNames: ['Citizen-Services-Portal', 'Online-Permits'],
        typicalTags: ['Citizen', 'Portal', 'Forms'],
        typicalLocation: 'Cloud',
      },
      {
        assetType: 'Records Management System',
        category: 'Application',
        defaultDataSensitivity: 'Confidential',
        defaultCriticality: 'High',
        baseNames: ['Records-Core', 'Document-Repository'],
        typicalTags: ['Records', 'Archival', 'Legal'],
        typicalLocation: 'Hybrid',
      },
      {
        assetType: 'Finance & Budget System',
        category: 'Application',
        defaultDataSensitivity: 'Confidential',
        defaultCriticality: 'High',
        baseNames: ['Municipal-Finance', 'Budget-Planning'],
        typicalTags: ['Finance', 'Budget', 'ERP'],
        typicalLocation: 'Hybrid',
      },
    ],
  },
};

function randomChoice<T>(arr: T[]): T {
  if (arr.length === 0) {
    throw new Error('randomChoice: array cannot be empty');
  }
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function randomIp(): string {
  return `10.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(
    Math.random() * 256
  )}`;
}

function sizeToCount(size: OrgSize): number {
  switch (size) {
    case 'small':
      return 25;
    case 'medium':
      return 55;
    case 'large':
      return 100;
    default:
      return 30;
  }
}

function generateRiskScore(criticality: Asset['criticality']): number {
  const baseScores: Record<Asset['criticality'], [number, number]> = {
    'Critical': [70, 95],
    'High': [50, 80],
    'Medium': [30, 60],
    'Low': [10, 40]
  };
  
  const [min, max] = baseScores[criticality] || [10, 40];
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function mapCategoryToAssetType(category: SectorTemplate['assetArchetypes'][0]['category']): Asset['type'] {
  const mapping: Record<string, Asset['type']> = {
    'Application': 'Application',
    'Database': 'Database',
    'Endpoint': 'Endpoint',
    'Network': 'Network',
    'Vendor': 'Third Party Service',
    'SaaS': 'Cloud Service',
  };
  return mapping[category] || 'Application';
}

function mapDataSensitivity(sensitivity: SectorTemplate['assetArchetypes'][0]['defaultDataSensitivity']): Asset['dataClassification'] {
  const mapping: Record<string, Asset['dataClassification']> = {
    'Public': 'Public',
    'Internal': 'Internal',
    'Confidential': 'Confidential',
    'Restricted': 'Restricted',
  };
  return mapping[sensitivity] || 'Internal';
}

// Compliance frameworks by sector
const COMPLIANCE_FRAMEWORKS: Record<SectorKey, string[]> = {
  healthcare: ['HIPAA', 'SOC 2', 'ISO 27001', 'HITECH'],
  financial: ['PCI DSS', 'SOX', 'FFIEC', 'ISO 27001', 'SOC 2'],
  saas: ['SOC 2', 'ISO 27001', 'GDPR'],
  manufacturing: ['ISO 27001', 'NIST', 'IEC 62443'],
  education: ['FERPA', 'SOC 2', 'ISO 27001', 'NIST'],
  publicSector: ['FISMA', 'NIST', 'FedRAMP', 'CJIS'],
};

let demoIdCounter = 1;

export function generateDemoAssets(sector: SectorKey, size: OrgSize = 'small'): DemoAsset[] {
  const template = SECTOR_TEMPLATES[sector];
  const count = sizeToCount(size);
  const assets: DemoAsset[] = [];

  while (assets.length < count) {
    const archetype = randomChoice(template.assetArchetypes);
    const baseName = randomChoice(archetype.baseNames);
    const owner = randomChoice(template.owners);
    const businessFunction = randomChoice(template.businessFunctions);
    const vendor = Math.random() < 0.6 ? randomChoice(template.vendors) : undefined;

    const assetName = `${baseName}-${assets.length + 1}`;
    const now = Date.now();
    const daysAgo = Math.floor(Math.random() * 365);
    const createdAt = new Date(now - daysAgo * 24 * 60 * 60 * 1000);
    const updatedAt = new Date(now - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
    const lastAssessed = new Date(now - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000);

    const asset: DemoAsset = {
      id: `DEMO-${demoIdCounter++}`,
      name: assetName,
      type: mapCategoryToAssetType(archetype.category),
      criticality: archetype.defaultCriticality,
      owner,
      location: archetype.typicalLocation,
      ipAddress: archetype.category === 'Endpoint' || archetype.category === 'Network'
        ? randomIp()
        : undefined,
      description: `${archetype.assetType} - DEMO asset for ${sector} sector. Business function: ${businessFunction}`,
      complianceFrameworks: COMPLIANCE_FRAMEWORKS[sector].slice(0, Math.floor(Math.random() * 3) + 1),
      riskScore: generateRiskScore(archetype.defaultCriticality),
      lastAssessed,
      tags: [...archetype.typicalTags, template.sector, businessFunction],
      relationships: [],
      vulnerabilities: [],
      status: 'Active',
      createdAt,
      updatedAt,
      dataClassification: mapDataSensitivity(archetype.defaultDataSensitivity),
      dataTypes: [],
      legalBasis: ['Legitimate Interest', 'Contract', 'Consent'],
      dataSubjectRights: ['Access', 'Rectification', 'Erasure'],
      crossBorderTransfer: Math.random() < 0.2,
      thirdPartySharing: vendor ? Math.random() < 0.3 : false,
      encryptionStatus: Math.random() < 0.7 ? 'Encrypted' : Math.random() < 0.5 ? 'Partially Encrypted' : 'Not Encrypted',
      accessControls: [],
      privacyImpactAssessment: null,
      dataBreachHistory: [],
      dependencies: [],
      requirements: [],
      demo: true,
      demoNote: 'DEMO_ONLY_NOT_REAL',
    };

    assets.push(asset);
  }

  // Generate relationships between assets
  assets.forEach(asset => {
    const relationshipCount = Math.floor(Math.random() * 3);
    const potentialRelated = assets.filter(a => a.id !== asset.id);
    
    for (let i = 0; i < relationshipCount && i < potentialRelated.length; i++) {
      const relatedAsset = randomChoice(potentialRelated);
      const relationshipTypes: Asset['relationships'][0]['relationshipType'][] = [
        'Depends On',
        'Connects To',
        'Hosts',
        'Manages',
        'Accesses',
      ];
      
      asset.relationships.push({
        id: `rel-${asset.id}-${relatedAsset.id}-${i}`,
        relatedAssetId: relatedAsset.id,
        relatedAssetName: relatedAsset.name,
        relationshipType: randomChoice(relationshipTypes),
        strength: randomChoice(['Strong', 'Medium', 'Weak'] as ('Strong' | 'Medium' | 'Weak')[]),
        dataFlowDirection: randomChoice(['Inbound', 'Outbound', 'Bidirectional', 'None'] as ('Inbound' | 'Outbound' | 'Bidirectional' | 'None')[]),
        isPersonalData: Math.random() < 0.2,
        purpose: 'DEMO relationship',
      });
    }
  });

  return assets;
}

/**
 * Generate sector demo assets wrapped in contracts
 * 
 * This function ensures demo assets conform to AssetContract and strips
 * any forbidden fields (score, rating, compliance status, etc.)
 * 
 * @param sectorId - Sector identifier
 * @param orgSize - Organization size
 * @returns Array of assets conforming to AssetContract
 */
export function generateSectorDemoAssets(
  sectorId: SectorKey,
  orgSize: OrgSize
): CyberSoluceAssetContract[] {
  // Generate demo assets using existing generator
  const demoAssets = generateDemoAssets(sectorId, orgSize);
  
  // Convert to contract format (this strips forbidden fields)
  return demoAssets.map(asset => toAssetContract(asset));
}
