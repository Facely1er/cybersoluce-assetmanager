import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Download, 
  Upload, 
  Filter, 
  Plus, 
  BarChart3, 
  Shield, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  HelpCircle,
  Lightbulb,
  Target,
  Users,
  Database,
  Gift,
  FileText,
  Building2 as Building
} from 'lucide-react';

export const UserManualPage: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['getting-started']));
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Lightbulb,
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Welcome to CyberSoluce™ Asset Manager
            </h4>
            <p className="text-blue-800 dark:text-blue-200 mb-4">
              CyberSoluce™ Asset Manager by ERMITS is a comprehensive asset inventory management platform designed for cybersecurity professionals. 
              This manual will guide you through all the features and help you get the most out of the system.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h5 className="font-medium text-blue-900 dark:text-blue-200 mb-2">Quick Start</h5>
                <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                  <li>1. Import your existing assets via CSV</li>
                  <li>2. Or generate sample data to explore</li>
                  <li>3. Configure compliance frameworks</li>
                  <li>4. Start managing your inventory</li>
                </ol>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h5 className="font-medium text-blue-900 dark:text-blue-200 mb-2">Key Benefits</h5>
                <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                  <li>• Centralized asset tracking</li>
                  <li>• Automated risk assessment</li>
                  <li>• Compliance monitoring</li>
                  <li>• Advanced reporting</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Navigation Overview</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: BarChart3, title: 'Dashboard', desc: 'Overview and key metrics' },
                { icon: Shield, title: 'Assets', desc: 'Manage your inventory' },
                { icon: Database, title: 'Analytics', desc: 'Reports and insights' },
              ].map((item, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center mb-2">
                    <item.icon className="h-5 w-5 text-command-blue-600 dark:text-command-blue-400 mr-2" />
                    <h5 className="font-medium text-gray-900 dark:text-white">{item.title}</h5>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'asset-management',
      title: 'Asset Management',
      icon: Shield,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Plus className="h-5 w-5 mr-2 text-green-600" />
              Adding Assets
            </h4>
            <div className="bg-gray-50 rounded-lg p-6">
              <h5 className="font-medium text-gray-900 mb-3">Manual Asset Creation</h5>
              <ol className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="bg-command-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">1</span>
                  <div>
                    <strong>Click "Add Asset"</strong> button in the main toolbar
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-command-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">2</span>
                  <div>
                    <strong>Fill required fields:</strong> Name, Type, Criticality, Owner, Location
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-command-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">3</span>
                  <div>
                    <strong>Add optional information:</strong> IP Address, Description, Tags, Compliance Frameworks
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-command-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">4</span>
                  <div>
                    <strong>Save the asset</strong> to add it to your inventory
                  </div>
                </li>
              </ol>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2 text-gray-600" />
              Asset Types & Fields
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-3">Supported Asset Types</h5>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Server</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Database</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Application</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Network</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Endpoint</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Cloud Service</li>
                </ul>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-3">Criticality Levels</h5>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>Critical</li>
                  <li className="flex items-center"><span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>High</li>
                  <li className="flex items-center"><span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>Medium</li>
                  <li className="flex items-center"><span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>Low</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'import-export',
      title: 'Data Import & Export',
      icon: Upload,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Upload className="h-5 w-5 mr-2 text-blue-600" />
              Importing Assets
            </h4>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h5 className="font-medium text-blue-900 mb-3">CSV Import Process</h5>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                  <div>
                    <strong className="text-blue-900">Download Template</strong>
                    <p className="text-blue-800 text-sm">Click "Download Template" to get the correct CSV format with examples</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                  <div>
                    <strong className="text-blue-900">Prepare Your Data</strong>
                    <p className="text-blue-800 text-sm">Fill in your asset information using the template format</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                  <div>
                    <strong className="text-blue-900">Upload & Validate</strong>
                    <p className="text-blue-800 text-sm">Upload your CSV file and review the validation results</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
                  <div>
                    <strong className="text-blue-900">Import Assets</strong>
                    <p className="text-blue-800 text-sm">Confirm the import to add assets to your inventory</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Download className="h-5 w-5 mr-2 text-green-600" />
              Exporting Data
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-3">Export Options</h5>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Export all assets</li>
                  <li>• Export filtered results</li>
                  <li>• Export selected assets</li>
                  <li>• Include all asset details</li>
                </ul>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-3">CSV Format</h5>
                <p className="text-sm text-gray-700 mb-2">Exported files include:</p>
                <ul className="space-y-1 text-xs text-gray-600">
                  <li>• All asset properties</li>
                  <li>• Compliance frameworks</li>
                  <li>• Tags and metadata</li>
                  <li>• Timestamps</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              <div>
                <h5 className="font-medium text-yellow-900 mb-1">Important Notes</h5>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Only CSV files are currently supported for import</li>
                  <li>• Excel files must be converted to CSV format</li>
                  <li>• Maximum file size: 10MB</li>
                  <li>• Use semicolons to separate multiple values (tags, compliance frameworks)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'filtering-search',
      title: 'Filtering & Search',
      icon: Filter,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Search className="h-5 w-5 mr-2 text-purple-600" />
              Search Functionality
            </h4>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h5 className="font-medium text-purple-900 mb-3">Global Search</h5>
              <p className="text-purple-800 mb-4">
                The search bar at the top searches across multiple fields simultaneously:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-purple-800">
                <div>• Asset Name</div>
                <div>• Description</div>
                <div>• Owner</div>
                <div>• Location</div>
                <div>• IP Address</div>
                <div>• Tags</div>
                <div>• Compliance Frameworks</div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Filter className="h-5 w-5 mr-2 text-indigo-600" />
              Advanced Filtering
            </h4>
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-3">Filter Categories</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <h6 className="text-sm font-medium text-gray-700 mb-2">Asset Properties</h6>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Asset Types</li>
                      <li>• Criticality Levels</li>
                      <li>• Status</li>
                      <li>• Risk Score Range</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-sm font-medium text-gray-700 mb-2">Organization</h6>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Owners</li>
                      <li>• Locations</li>
                      <li>• Tags</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-sm font-medium text-gray-700 mb-2">Compliance</h6>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Frameworks</li>
                      <li>• Standards</li>
                      <li>• Requirements</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h5 className="font-medium text-indigo-900 mb-2">Filter Tips</h5>
                <ul className="text-sm text-indigo-800 space-y-1">
                  <li>• Combine multiple filters for precise results</li>
                  <li>• Use the risk score slider for range filtering</li>
                  <li>• Clear all filters with one click</li>
                  <li>• Filter panel shows active filter count</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'dashboard-metrics',
      title: 'Dashboard & Metrics',
      icon: BarChart3,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
              Understanding Your Dashboard
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-3">Key Metrics</h5>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Assets</span>
                    <span className="text-sm font-medium text-gray-900">Complete inventory count</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Critical Assets</span>
                    <span className="text-sm font-medium text-red-600">High-priority items</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Risk Score</span>
                    <span className="text-sm font-medium text-orange-600">Overall risk level</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Compliance Rate</span>
                    <span className="text-sm font-medium text-green-600">Framework coverage</span>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-3">Visual Analytics</h5>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                    Asset distribution by type
                  </li>
                  <li className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                    Risk assessment breakdown
                  </li>
                  <li className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                    Compliance status overview
                  </li>
                  <li className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
                    Recent activity timeline
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h4>
            <div className="bg-gradient-to-r from-red-50 to-green-50 border border-gray-200 rounded-lg p-6">
              <h5 className="font-medium text-gray-900 mb-4">Risk Score Calculation</h5>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="w-full bg-red-200 rounded-full h-2 mb-2">
                    <div className="bg-red-600 h-2 rounded-full w-full"></div>
                  </div>
                  <span className="text-xs font-medium text-red-600">Critical (80-100)</span>
                </div>
                <div className="text-center">
                  <div className="w-full bg-orange-200 rounded-full h-2 mb-2">
                    <div className="bg-orange-600 h-2 rounded-full w-3/4"></div>
                  </div>
                  <span className="text-xs font-medium text-orange-600">High (60-79)</span>
                </div>
                <div className="text-center">
                  <div className="w-full bg-yellow-200 rounded-full h-2 mb-2">
                    <div className="bg-yellow-600 h-2 rounded-full w-1/2"></div>
                  </div>
                  <span className="text-xs font-medium text-yellow-600">Medium (40-59)</span>
                </div>
                <div className="text-center">
                  <div className="w-full bg-green-200 rounded-full h-2 mb-2">
                    <div className="bg-green-600 h-2 rounded-full w-1/4"></div>
                  </div>
                  <span className="text-xs font-medium text-green-600">Low (0-39)</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Risk scores are calculated based on asset criticality, vulnerabilities, compliance status, and other factors.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'compliance',
      title: 'Compliance Management',
      icon: CheckCircle,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              Supported Frameworks
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'SOC 2', desc: 'Service Organization Control 2', color: 'blue' },
                { name: 'PCI DSS', desc: 'Payment Card Industry Data Security', color: 'green' },
                { name: 'ISO 27001', desc: 'Information Security Management', color: 'purple' },
                { name: 'GDPR', desc: 'General Data Protection Regulation', color: 'indigo' },
                { name: 'HIPAA', desc: 'Health Insurance Portability', color: 'pink' },
                { name: 'NIST', desc: 'National Institute of Standards', color: 'orange' },
              ].map((framework, index) => (
                <div key={index} className={`bg-${framework.color}-50 border border-${framework.color}-200 rounded-lg p-4`}>
                  <h5 className={`font-medium text-${framework.color}-900 mb-1`}>{framework.name}</h5>
                  <p className={`text-xs text-${framework.color}-700`}>{framework.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Compliance Tracking</h4>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h5 className="font-medium text-gray-900 mb-4">How to Assign Frameworks</h5>
              <ol className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">1</span>
                  <div>
                    <strong>During Asset Creation:</strong> Select applicable frameworks when adding new assets
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">2</span>
                  <div>
                    <strong>Bulk Import:</strong> Include frameworks in your CSV import file
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">3</span>
                  <div>
                    <strong>Edit Existing:</strong> Update assets to add or remove compliance frameworks
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'free-tools',
      title: 'Free Assessment Tools',
      icon: Gift,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#005B96] to-[#33A1DE] rounded-lg p-6 text-white">
            <h4 className="text-lg font-semibold mb-3 flex items-center">
              <Gift className="h-5 w-5 mr-2" />
              Browser-Based Assessment Tools
            </h4>
            <p className="text-white/90 mb-4">
              CyberSoluce provides three free, browser-based tools for cybersecurity assessment. 
              These tools require no installation, work entirely in your browser, and are perfect 
              for getting started with asset management and compliance tracking.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/tools/DataInventoryTool.html"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 hover:bg-white/30 rounded-lg p-4 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5" />
                  <span className="font-semibold">Data Inventory Tool</span>
                  <ExternalLink className="h-4 w-4 ml-auto" />
                </div>
                <p className="text-sm text-white/80">Discover and catalog organizational data</p>
              </a>
              <a
                href="/tools/InformationAssetRegister.html"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 hover:bg-white/30 rounded-lg p-4 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5" />
                  <span className="font-semibold">Asset Register</span>
                  <ExternalLink className="h-4 w-4 ml-auto" />
                </div>
                <p className="text-sm text-white/80">Comprehensive asset management</p>
              </a>
              <a
                href="/tools/VendorRegisterManager.html"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 hover:bg-white/30 rounded-lg p-4 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Building className="h-5 w-5" />
                  <span className="font-semibold">Vendor Register</span>
                  <ExternalLink className="h-4 w-4 ml-auto" />
                </div>
                <p className="text-sm text-white/80">Third-party risk management</p>
              </a>
            </div>
          </div>

          {/* Data Inventory Tool */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-[#005B96] dark:text-[#33A1DE]" />
              Data Inventory Tool
            </h4>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h5 className="font-medium text-gray-900 dark:text-white mb-3">Quick Start</h5>
              <ol className="space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                <li className="flex items-start">
                  <span className="bg-[#005B96] dark:bg-[#33A1DE] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">1</span>
                  <div>Open the tool and click "Add Data" to manually add items, or "Import Inventory" to upload CSV</div>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#005B96] dark:bg-[#33A1DE] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">2</span>
                  <div>Fill required fields: Name, Type, Owner, Location</div>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#005B96] dark:bg-[#33A1DE] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">3</span>
                  <div>Check applicable boxes: Contains PII, Sensitive Data, Regulated Data, Has Backup</div>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#005B96] dark:bg-[#33A1DE] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">4</span>
                  <div>Export your inventory regularly (data is stored in browser only)</div>
                </li>
              </ol>
              
              <div className="bg-[#E6F2FF] dark:bg-[#1a3a5c] border border-[#005B96]/20 dark:border-[#33A1DE]/20 rounded-lg p-4 mb-4">
                <h6 className="font-medium text-[#005B96] dark:text-[#33A1DE] mb-2">Key Features</h6>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• 13 core data fields for comprehensive tracking</li>
                  <li>• PII, Sensitive, and Regulated data flagging</li>
                  <li>• Documentation completeness scoring (8 fields)</li>
                  <li>• 5 interactive dashboards (Inventory, Categories, Locations, Owners, Reports)</li>
                  <li>• 6 export options (Complete, Sensitive, PII, Location, Ownership, JSON)</li>
                  <li>• CSV/JSON import and export</li>
                </ul>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5" />
                  <div>
                    <h6 className="font-medium text-yellow-900 dark:text-yellow-200 mb-1">Important Reminder</h6>
                    <p className="text-sm text-yellow-800 dark:text-yellow-300">
                      Data is stored in browser memory only. Always export your inventory before closing the browser to avoid data loss.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Information Asset Register */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-[#005B96] dark:text-[#33A1DE]" />
              Information Asset Register
            </h4>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h5 className="font-medium text-gray-900 dark:text-white mb-3">Quick Start</h5>
              <ol className="space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                <li className="flex items-start">
                  <span className="bg-[#005B96] dark:bg-[#33A1DE] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">1</span>
                  <div>Open the tool and click "Add Asset" to create new entries</div>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#005B96] dark:bg-[#33A1DE] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">2</span>
                  <div>Assign classification: Public, Internal, Confidential, or Restricted</div>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#005B96] dark:bg-[#33A1DE] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">3</span>
                  <div>Complete the 8-point control checklist for each asset</div>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#005B96] dark:bg-[#33A1DE] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">4</span>
                  <div>Review Gap Analysis tab to identify missing controls</div>
                </li>
              </ol>
              
              <div className="bg-[#E6F2FF] dark:bg-[#1a3a5c] border border-[#005B96]/20 dark:border-[#33A1DE]/20 rounded-lg p-4 mb-4">
                <h6 className="font-medium text-[#005B96] dark:text-[#33A1DE] mb-2">Key Features</h6>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• 20+ asset fields for comprehensive management</li>
                  <li>• 4-level classification system (Public/Internal/Confidential/Restricted)</li>
                  <li>• 8-point control framework with automated gap analysis</li>
                  <li>• Multi-framework compliance tracking (GDPR, CCPA, HIPAA, SOC 2, ISO 27001)</li>
                  <li>• 5 interactive dashboards (Assets, Gap Analysis, Classification, Compliance, Reports)</li>
                  <li>• Automated completeness scoring</li>
                </ul>
              </div>

              <div className="bg-[#E6F2FF] dark:bg-[#1a3a5c] border border-[#005B96]/20 dark:border-[#33A1DE]/20 rounded-lg p-4">
                <h6 className="font-medium text-[#005B96] dark:text-[#33A1DE] mb-2">8-Point Control Checklist</h6>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>1. Data Inventory - Asset cataloged</li>
                  <li>2. Data Mapping - Data flows documented</li>
                  <li>3. Risk Assessment - Risk evaluated</li>
                  <li>4. DPIA - High-risk processing assessed (for Restricted data)</li>
                  <li>5. Retention Schedule - Lifecycle defined</li>
                  <li>6. Access Controls - Access restricted</li>
                  <li>7. Encryption - Data encrypted (for Restricted data)</li>
                  <li>8. Backup Procedure - Data backed up</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Vendor Register Manager */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Building className="h-5 w-5 mr-2 text-[#33A1DE] dark:text-[#5BB8E8]" />
              Vendor Register Manager
            </h4>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h5 className="font-medium text-gray-900 dark:text-white mb-3">Quick Start</h5>
              <ol className="space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                <li className="flex items-start">
                  <span className="bg-[#33A1DE] dark:bg-[#5BB8E8] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">1</span>
                  <div>Click "Import Register" to upload existing vendor data, or "Add Vendor" to start fresh</div>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#33A1DE] dark:bg-[#5BB8E8] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">2</span>
                  <div>Fill vendor details: Name, Type, Criticality, Contact Information</div>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#33A1DE] dark:bg-[#5BB8E8] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">3</span>
                  <div>Complete compliance checklist: SOC 2, ISO 27001, DPA, BAA, Security Assessment</div>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#33A1DE] dark:bg-[#5BB8E8] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">4</span>
                  <div>Review automated risk scoring and gap analysis</div>
                </li>
              </ol>
              
              <div className="bg-[#E6F5FA] dark:bg-[#1a3a5c] border border-[#33A1DE]/20 dark:border-[#5BB8E8]/20 rounded-lg p-4 mb-4">
                <h6 className="font-medium text-[#33A1DE] dark:text-[#5BB8E8] mb-2">Key Features</h6>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• 15+ vendor fields for comprehensive tracking</li>
                  <li>• Automated risk scoring (0-100 scale)</li>
                  <li>• 9-point compliance checklist</li>
                  <li>• Contract lifecycle tracking (start/end dates, renewal reminders)</li>
                  <li>• Automated gap analysis with severity levels</li>
                  <li>• 4 interactive dashboards (Vendors, Risk, Gap Analysis, Reports)</li>
                  <li>• Data access level tracking (None/Low/Moderate/High)</li>
                </ul>
              </div>

              <div className="bg-[#E6F5FA] dark:bg-[#1a3a5c] border border-[#33A1DE]/20 dark:border-[#5BB8E8]/20 rounded-lg p-4">
                <h6 className="font-medium text-[#33A1DE] dark:text-[#5BB8E8] mb-2">Risk Score Factors</h6>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Risk scores are calculated based on:</p>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• Vendor criticality (Critical = +30, High = +20, Medium = +10)</li>
                  <li>• Data access level (High = +25, Moderate = +15, Low = +5)</li>
                  <li>• Missing compliance certifications (-10 each for SOC 2, ISO 27001)</li>
                  <li>• Missing privacy controls (-10 each for DPA, BAA)</li>
                  <li>• Missing security assessment (-10)</li>
                  <li>• Missing contract/SLA (-10 each)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Best Practices */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-yellow-600 dark:text-yellow-400" />
              Best Practices
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 dark:text-white mb-3">Data Management</h5>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span>Export your data regularly (daily recommended)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span>Use consistent naming conventions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span>Keep CSV templates for easy re-import</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span>Document as you discover, not in batches</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 dark:text-white mb-3">Compliance</h5>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span>Flag all PII immediately upon discovery</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span>Complete gap analysis regularly</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span>Review risk scores monthly</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span>Export reports quarterly for audits</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="bg-[#E6F2FF] dark:bg-[#1a3a5c] border border-[#005B96]/20 dark:border-[#33A1DE]/20 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-[#005B96] dark:text-[#33A1DE] mb-3 flex items-center">
              <HelpCircle className="h-5 w-5 mr-2" />
              Additional Resources
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Quick Reference Guides</h5>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• Data Inventory Quick Reference</li>
                  <li>• Asset Register Quick Reference</li>
                  <li>• Vendor Register Quick Reference</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">CSV Templates</h5>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• Data Inventory Template</li>
                  <li>• Asset Register Template</li>
                  <li>• Vendor Register Template</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Integration</h5>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• Import data into CyberSoluce platform</li>
                  <li>• Export to JSON for API integration</li>
                  <li>• Use CSV exports for reporting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: HelpCircle,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <HelpCircle className="h-5 w-5 mr-2 text-orange-600" />
              Common Issues
            </h4>
            <div className="space-y-4">
              {[
                {
                  issue: 'CSV Import Fails',
                  solution: 'Ensure your CSV file follows the template format. Check for required fields and proper data types.',
                  icon: AlertTriangle,
                  color: 'red'
                },
                {
                  issue: 'Search Not Working',
                  solution: 'Clear your search term and try again. Ensure you\'re using valid characters.',
                  icon: Search,
                  color: 'yellow'
                },
                {
                  issue: 'Filters Not Applied',
                  solution: 'Check if you have active filters. Use the "Clear All" button to reset filters.',
                  icon: Filter,
                  color: 'blue'
                },
                {
                  issue: 'Export Issues',
                  solution: 'Ensure you have assets selected or visible. Check your browser\'s download settings.',
                  icon: Download,
                  color: 'green'
                }
              ].map((item, index) => (
                <div key={index} className={`bg-${item.color}-50 border border-${item.color}-200 rounded-lg p-4`}>
                  <div className="flex items-start">
                    <item.icon className={`h-5 w-5 text-${item.color}-600 mr-3 mt-0.5`} />
                    <div>
                      <h5 className={`font-medium text-${item.color}-900 mb-1`}>{item.issue}</h5>
                      <p className={`text-sm text-${item.color}-800`}>{item.solution}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Best Practices</h4>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <ul className="space-y-3 text-green-800">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <span>Regularly update asset information to maintain accuracy</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <span>Use consistent naming conventions for assets and tags</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <span>Assign appropriate criticality levels based on business impact</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <span>Export data regularly for backup and reporting purposes</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <span>Review and update compliance frameworks as requirements change</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Getting Help</h4>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <h5 className="font-medium text-blue-900 mb-2">Support Resources</h5>
                  <ul className="space-y-2 text-blue-800">
                    <li>• Check this user manual for detailed instructions</li>
                    <li>• Use the inventory generator to create sample data for testing</li>
                    <li>• Download CSV templates for proper import formatting</li>
                    <li>• Contact your system administrator for technical issues</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const filteredSections = sections.filter(section => {
    if (searchTerm === '') return true;
    if (section.title.toLowerCase().includes(searchTerm.toLowerCase())) return true;
    
    // Handle children search - children might be a single element or an array
    const children = section.content.props?.children;
    if (!children) return false;
    
    const childrenArray = Array.isArray(children) ? children : [children];
    return childrenArray.some((child: React.ReactNode) => 
      typeof child === 'object' && 
      child !== null && 
      'props' in child && 
      JSON.stringify(child).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-command-blue-600 to-action-cyan-600 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-outfit font-bold mb-2 flex items-center">
              <BookOpen className="h-8 w-8 mr-3" />
              User Manual
            </h1>
            <p className="text-lg opacity-90">
              Complete guide to using CyberSoluce™ Asset Manager by ERMITS
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Users className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search manual..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-command-blue-500 focus:border-command-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
      </div>

      {/* Table of Contents */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <h2 className="text-xl font-outfit font-semibold text-gray-900 dark:text-white mb-4">Table of Contents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                const element = document.getElementById(section.id);
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              <section.icon className="h-5 w-5 text-command-blue-600 dark:text-command-blue-400 mr-3 group-hover:text-command-blue-700 dark:group-hover:text-command-blue-300" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                {section.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Manual Sections */}
      <div className="space-y-6">
        {filteredSections.map((section) => (
          <div
            key={section.id}
            id={section.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center">
                <section.icon className="h-6 w-6 text-command-blue-600 dark:text-command-blue-400 mr-3" />
                <h3 className="text-xl font-outfit font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </h3>
              </div>
              {expandedSections.has(section.id) ? (
                <ChevronDown className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              )}
            </button>
            
            {expandedSections.has(section.id) && (
              <div className="px-6 pb-6 border-t border-gray-100 dark:border-gray-700">
                <div className="pt-6">
                  {section.content}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-outfit font-semibold text-gray-900 dark:text-white mb-2">
          Need Additional Help?
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          If you can't find what you're looking for in this manual, don't hesitate to reach out for support.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="inline-flex items-center px-4 py-2 bg-command-blue-600 text-white rounded-lg hover:bg-command-blue-700 dark:bg-command-blue-500 dark:hover:bg-command-blue-600 transition-colors">
            <ExternalLink className="h-4 w-4 mr-2" />
            Contact Support
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <BookOpen className="h-4 w-4 mr-2" />
            Download PDF Manual
          </button>
        </div>
      </div>
    </div>
  );
};