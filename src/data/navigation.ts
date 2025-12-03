// Navigation routes and metadata for CyberSoluce™ Asset Intelligence

export const APP_METADATA = {
  name: 'CyberSoluce™ Asset Intelligence',
  version: '1.0.0',
  description: 'Comprehensive Asset Inventory Management Tool for cybersecurity professionals',
  author: 'ERMITS Corporation',
  license: 'MIT',
  repository: 'https://github.com/ermits-cybersoluce/asset-manager',
  homepage: 'https://www.cybersoluce.com',
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
  dashboard: '/dashboard',
  assets: '/dashboard/assets',
  analytics: '/dashboard/analytics',
  workflow: '/dashboard/workflow',
  compliance: '/dashboard/compliance',
  privacyCompliance: '/dashboard/privacy-compliance',
  dependencies: '/dashboard/dependencies',
  dataProtection: '/dashboard/data-protection',
  vulnerabilities: '/dashboard/vulnerabilities',
  mitigation: '/dashboard/mitigation',
  businessImpact: '/dashboard/business-impact',
  nist: '/dashboard/nist',
  framework: '/dashboard/framework',
  organizations: '/dashboard/organizations',
  users: '/dashboard/users',
  activity: '/dashboard/activity',
  userManual: '/dashboard/user-manual',
  settings: '/dashboard/settings',
  demoScenarios: '/dashboard/demo-scenarios',
  magicalOrchestration: '/dashboard/magical-orchestration',
  aiClassification: '/dashboard/ai-classification',
  magicalDashboard: '/dashboard/magical-dashboard',
  help: '/dashboard/help',
  imports: '/imports'
} as const;

export const EXTERNAL_LINKS = {
  documentation: 'https://www.cybersoluce.com/dashboard/user-manual', // User Manual page
  support: 'https://www.cybersoluce.com', // Main website (can be updated to contact page if exists)
  github: 'https://github.com/ermits-cybersoluce',
  website: 'https://www.cybersoluce.com'
} as const;

