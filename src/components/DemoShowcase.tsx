import React, { useState } from 'react';
import {
  Play,
  Clock,
  Users,
  Shield,
  Building2,
  Zap,
  ChevronRight,
  CheckCircle,
  Target,
  FileText,
  Gift,
  ExternalLink
} from 'lucide-react';
import { DEMO_SCENARIOS } from '../data/demoScenarios';
import { getQuickStartScenarios, getIndustryScenarios } from '../data/demoDataGenerator';

interface DemoShowcaseProps {
  onStartDemo: (scenarioId: string) => void;
  onViewDemo: (scenarioId: string) => void;
}

export const DemoShowcase: React.FC<DemoShowcaseProps> = ({ onStartDemo, onViewDemo }) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'scenarios' | 'quickstart' | 'industries'>('scenarios');

  const filteredScenarios = DEMO_SCENARIOS.filter(scenario => {
    const industryMatch = selectedIndustry === 'all' || scenario.industry === selectedIndustry;
    const difficultyMatch = selectedDifficulty === 'all' || scenario.riskProfile.level.toLowerCase() === selectedDifficulty;
    return industryMatch && difficultyMatch;
  });

  const quickStartScenarios = getQuickStartScenarios();
  const industryScenarios = getIndustryScenarios();

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getIndustryIcon = (industry: string) => {
    switch (industry) {
      case 'Healthcare': return Shield;
      case 'Financial Services': return Building2;
      case 'Technology': return Zap;
      case 'Manufacturing': return Target;
      case 'Government': return Users;
      case 'Education': return FileText;
      default: return Building2;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-command-blue-600 to-action-cyan-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-outfit font-bold mb-4">
              Demo Scenarios & Use Cases
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
              Explore realistic scenarios across different industries and organizational sizes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onStartDemo('healthcare-hospital')}
                className="inline-flex items-center px-6 py-3 bg-white text-command-blue-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Healthcare Demo
              </button>
              <button
                onClick={() => onStartDemo('financial-bank')}
                className="inline-flex items-center px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-command-blue-600 transition-colors font-semibold"
              >
                <Building2 className="h-5 w-5 mr-2" />
                Start Financial Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'scenarios', label: 'Full Scenarios', icon: Target },
              { id: 'quickstart', label: 'Quick Start', icon: Zap },
              { id: 'industries', label: 'By Industry', icon: Building2 }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? 'border-command-blue-500 text-command-blue-600 dark:text-command-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        {activeTab === 'scenarios' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Industry
                </label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-command-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Industries</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Financial Services">Financial Services</option>
                  <option value="Technology">Technology</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Government">Government</option>
                  <option value="Education">Education</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Risk Level
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-command-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Risk Levels</option>
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                  <option value="critical">Critical Risk</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {activeTab === 'scenarios' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredScenarios.map((scenario) => {
              const IndustryIcon = getIndustryIcon(scenario.industry);
              return (
                <div key={scenario.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-command-blue-100 dark:bg-command-blue-900/20 rounded-lg">
                          <IndustryIcon className="h-6 w-6 text-command-blue-600 dark:text-command-blue-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{scenario.industry}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(scenario.riskProfile.level)}`}>
                        {scenario.riskProfile.level} Risk
                      </span>
                    </div>

                    <h3 className="text-lg font-outfit font-semibold text-gray-900 dark:text-white mb-2">
                      {scenario.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                      {scenario.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Users className="h-4 w-4 mr-2" />
                        {scenario.companySize} • {scenario.assets.length} assets
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-2" />
                        {scenario.demoSteps.reduce((total, step) => total + parseInt(step.duration), 0)} min demo
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {scenario.complianceRequirements.slice(0, 3).map((framework) => (
                        <span key={framework} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                          {framework}
                        </span>
                      ))}
                      {scenario.complianceRequirements.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                          +{scenario.complianceRequirements.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => onStartDemo(scenario.id)}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-command-blue-600 dark:bg-command-blue-500 text-white rounded-lg hover:bg-command-blue-700 dark:hover:bg-command-blue-600 transition-colors text-sm font-medium"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Demo
                      </button>
                      <button
                        onClick={() => onViewDemo(scenario.id)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'quickstart' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickStartScenarios.map((scenario) => (
              <div key={scenario.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                      {scenario.difficulty}
                    </span>
                  </div>

                  <h3 className="text-lg font-outfit font-semibold text-gray-900 dark:text-white mb-2">
                    {scenario.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {scenario.description}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <Clock className="h-4 w-4 mr-2" />
                    {scenario.duration}
                  </div>

                  <div className="space-y-2 mb-4">
                    {scenario.steps.map((step, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500 dark:text-green-400" />
                        {step}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => onStartDemo(scenario.id)}
                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors text-sm font-medium"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Quick Demo
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'industries' && (
          <div className="space-y-8">
            {industryScenarios.map((industry) => (
              <div key={industry.industry} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-command-blue-100 dark:bg-command-blue-900/20 rounded-lg">
                      {React.createElement(getIndustryIcon(industry.industry), { className: "h-6 w-6 text-command-blue-600 dark:text-command-blue-400" })}
                    </div>
                    <h3 className="text-xl font-outfit font-semibold text-gray-900 dark:text-white">
                      {industry.industry}
                    </h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {industry.scenarios.map((scenario) => (
                      <div key={scenario.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">{scenario.name}</h4>
                        <button
                          onClick={() => onStartDemo(scenario.id)}
                          className="inline-flex items-center text-command-blue-600 dark:text-command-blue-400 hover:text-command-blue-700 dark:hover:text-command-blue-300 text-sm font-medium"
                        >
                          Start Demo
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Free Tools Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
              <Gift className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-outfit font-bold text-gray-900 dark:text-white mb-2">
              Free Browser-Based Tools
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Start your cybersecurity journey with our professional asset evaluation tools. No installation, no account required.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <a
              href="/tools/DataInventoryTool.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-command-blue-100 dark:bg-command-blue-900/20 rounded-lg">
                  <FileText className="h-5 w-5 text-command-blue-600 dark:text-command-blue-400" />
                </div>
                <span className="font-medium text-gray-900 dark:text-white">Data Inventory Tool</span>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-command-blue-600 dark:group-hover:text-command-blue-400" />
            </a>
            <a
              href="/tools/InformationAssetRegister.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-command-blue-100 dark:bg-command-blue-900/20 rounded-lg">
                  <Target className="h-5 w-5 text-command-blue-600 dark:text-command-blue-400" />
                </div>
                <span className="font-medium text-gray-900 dark:text-white">Asset Register</span>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-command-blue-600 dark:group-hover:text-command-blue-400" />
            </a>
            <a
              href="/tools/VendorRegisterManager.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-action-cyan-100 dark:bg-action-cyan-900/20 rounded-lg">
                  <Building2 className="h-5 w-5 text-action-cyan-600 dark:text-action-cyan-400" />
                </div>
                <span className="font-medium text-gray-900 dark:text-white">Vendor Register</span>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-action-cyan-600 dark:group-hover:text-action-cyan-400" />
            </a>
          </div>
          <div className="text-center">
            <a
              href="/tools/"
              className="inline-flex items-center text-command-blue-600 dark:text-command-blue-400 hover:text-command-blue-700 dark:hover:text-command-blue-300 font-medium"
            >
              View All Free Tools
              <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 bg-gradient-to-r from-command-blue-600 to-action-cyan-600 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-outfit font-bold mb-4">
            Ready to See CyberSoluce™ Asset Manager in Action?
          </h2>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            Choose a demo scenario that matches your industry and see how our platform can help with your asset inventory management needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onStartDemo('healthcare-hospital')}
              className="inline-flex items-center px-6 py-3 bg-white text-command-blue-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              <Shield className="h-5 w-5 mr-2" />
              Healthcare Demo
            </button>
            <button
              onClick={() => onStartDemo('financial-bank')}
              className="inline-flex items-center px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-command-blue-600 transition-colors font-semibold"
            >
              <Building2 className="h-5 w-5 mr-2" />
              Financial Demo
            </button>
            <button
              onClick={() => onStartDemo('tech-startup')}
              className="inline-flex items-center px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-command-blue-600 transition-colors font-semibold"
            >
              <Zap className="h-5 w-5 mr-2" />
              Startup Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};