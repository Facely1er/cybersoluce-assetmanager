// Navigation routes and metadata for CyberSoluce™ Asset Manager

export const APP_METADATA = {
  name: 'CyberSoluce™ Asset Manager',
  version: '1.0.0',
  description: 'Comprehensive Asset Inventory Management Tool for cybersecurity professionals',
  author: 'ERMITS Corporation',
  license: 'MIT',
  repository: 'https://github.com/ermits-cybersoluce/asset-manager',
  homepage: 'https://cybersoluce.ermits.com',
  keywords: [
    'asset-inventory',
    'cybersecurity',
    'risk-management',
    'compliance',
    'vulnerability-management',
    'IT-assets',
    'NIST',
    'GDPR',
    'SOC-2'
  ]
} as const;

export const NAVIGATION_ROUTES = {
  dashboard: '/',
  assets: '/assets',
  analytics: '/analytics',
  workflow: '/workflow',
  compliance: '/compliance',
  privacyCompliance: '/privacy-compliance',
  dependencies: '/dependencies',
  dataProtection: '/data-protection',
  vulnerabilities: '/vulnerabilities',
  mitigation: '/mitigation',
  businessImpact: '/business-impact',
  nist: '/nist',
  framework: '/framework',
  organizations: '/organizations',
  users: '/users',
  activity: '/activity',
  userManual: '/user-manual',
  settings: '/settings',
  demoScenarios: '/demo-scenarios',
  help: '/help'
} as const;

export const EXTERNAL_LINKS = {
  documentation: 'https://docs.cybersoluce.ermits.com',
  support: 'https://support.cybersoluce.ermits.com',
  github: 'https://github.com/ermits-cybersoluce',
  website: 'https://cybersoluce.ermits.com'
} as const;

