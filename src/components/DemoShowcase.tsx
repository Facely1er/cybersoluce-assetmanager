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
import { getQuickStartScenarios, getIndustryScenarios, getDemoScenarioAssetCount } from '../data/demoDataGenerator';

interface DemoShowcaseProps {
  onStartDemo: (scenarioId: string) => void;
  onViewDemo: (scenarioId: string) => void;
}

const DemoShowcaseComponent: React.FC<DemoShowcaseProps> = ({ onStartDemo, onViewDemo }) => {
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
      case 'Low': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'Medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'High': return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      case 'Critical': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
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
    <div className="w-full -mx-4 sm:-mx-6 lg:-mx-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-command-blue-600 via-command-blue-700 to-action-cyan-600 dark:from-command-blue-800 dark:via-command-blue-900 dark:to-action-cyan-800 text-white py-12 md:py-16 shadow-lg">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-outfit font-bold mb-4 text-white">
              Demo Scenarios & Use Cases
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl opacity-90 dark:opacity-95 mb-8 max-w-3xl mx-auto text-white">
              Explore realistic scenarios across different industries and organizational sizes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onStartDemo('healthcare-hospital')}
                className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-100 text-command-blue-600 dark:text-command-blue-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-200 transition-colors font-semibold shadow-lg hover:shadow-xl"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Healthcare Demo
              </button>
              <button
                onClick={() => onStartDemo('financial-bank')}
                className="inline-flex items-center justify-center px-6 py-3 bg-transparent border-2 border-white dark:border-gray-200 text-white dark:text-gray-100 rounded-lg hover:bg-white dark:hover:bg-gray-100 hover:text-command-blue-600 dark:hover:text-command-blue-700 transition-colors font-semibold"
              >
                <Building2 className="h-5 w-5 mr-2" />
                Start Financial Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto">
            {[
              { id: 'scenarios', label: 'Full Scenarios', icon: Target },
              { id: 'quickstart', label: 'Quick Start', icon: Zap },
              { id: 'industries', label: 'By Industry', icon: Building2 }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === id
                    ? 'border-command-blue-500 text-command-blue-600 dark:text-command-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Icon className="h-5 w-5 mr-2 flex-shrink-0" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Filters */}
        {activeTab === 'scenarios' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="industry-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Industry
                </label>
                <select
                  id="industry-filter"
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-command-blue-500 dark:focus:ring-command-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  aria-label="Filter by industry"
                >
                  <option value="all" className="bg-white dark:bg-gray-700">All Industries</option>
                  <option value="Healthcare" className="bg-white dark:bg-gray-700">Healthcare</option>
                  <option value="Financial Services" className="bg-white dark:bg-gray-700">Financial Services</option>
                  <option value="Technology" className="bg-white dark:bg-gray-700">Technology</option>
                  <option value="Manufacturing" className="bg-white dark:bg-gray-700">Manufacturing</option>
                  <option value="Government" className="bg-white dark:bg-gray-700">Government</option>
                  <option value="Education" className="bg-white dark:bg-gray-700">Education</option>
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor="risk-level-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Risk Level
                </label>
                <select
                  id="risk-level-filter"
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-command-blue-500 dark:focus:ring-command-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  aria-label="Filter by risk level"
                >
                  <option value="all" className="bg-white dark:bg-gray-700">All Risk Levels</option>
                  <option value="low" className="bg-white dark:bg-gray-700">Low Risk</option>
                  <option value="medium" className="bg-white dark:bg-gray-700">Medium Risk</option>
                  <option value="high" className="bg-white dark:bg-gray-700">High Risk</option>
                  <option value="critical" className="bg-white dark:bg-gray-700">Critical Risk</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {activeTab === 'scenarios' && (
          <>
            {filteredScenarios.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                <Target className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No scenarios found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your filters to see more scenarios.
                </p>
                <button
                  onClick={() => {
                    setSelectedIndustry('all');
                    setSelectedDifficulty('all');
                  }}
                  className="inline-flex items-center px-4 py-2 bg-command-blue-600 dark:bg-command-blue-500 text-white rounded-lg hover:bg-command-blue-700 dark:hover:bg-command-blue-600 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        {scenario.companySize} • {getDemoScenarioAssetCount(scenario.id)} assets
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
          </>
        )}

        {activeTab === 'quickstart' && (
          <>
            {quickStartScenarios.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                <Zap className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No quick start scenarios available
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Quick start scenarios are being prepared.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quickStartScenarios.map((scenario) => {
                  // Map quick start IDs to actual scenario IDs
                  const scenarioIdMap: Record<string, string> = {
                    'healthcare-quick': 'healthcare-hospital',
                    'financial-quick': 'financial-bank',
                    'startup-quick': 'tech-startup'
                  };
                  const actualScenarioId = scenarioIdMap[scenario.id] || scenario.id;
                  
                  return (
                    <div key={scenario.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-lg transition-all duration-200">
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
                            <div key={index} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => onStartDemo(actualScenarioId)}
                          className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors text-sm font-medium"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Quick Demo
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTab === 'industries' && (
          <>
            {industryScenarios.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                <Building2 className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No industry scenarios available
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Industry scenarios are being prepared.
                </p>
              </div>
            ) : (
              <div className="space-y-6 md:space-y-8">
                {industryScenarios.map((industry) => (
                  <div key={industry.industry} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-command-blue-100 dark:bg-command-blue-900/20 rounded-lg flex-shrink-0">
                          {React.createElement(getIndustryIcon(industry.industry), { className: "h-5 w-5 md:h-6 md:w-6 text-command-blue-600 dark:text-command-blue-400" })}
                        </div>
                        <h3 className="text-lg md:text-xl font-outfit font-semibold text-gray-900 dark:text-white">
                          {industry.industry}
                        </h3>
                      </div>
                    </div>
                    <div className="p-4 md:p-6">
                      {industry.scenarios.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                          No scenarios available for this industry.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {industry.scenarios.map((scenario) => (
                            <div key={scenario.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                              <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm md:text-base">{scenario.name}</h4>
                              <button
                                onClick={() => onStartDemo(scenario.id)}
                                className="inline-flex items-center text-command-blue-600 dark:text-command-blue-400 hover:text-command-blue-700 dark:hover:text-command-blue-300 text-sm font-medium transition-colors"
                              >
                                Start Demo
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Free Tools Section */}
        <div className="mt-8 md:mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
              <Gift className="h-6 w-6 md:h-8 md:w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl md:text-2xl font-outfit font-bold text-gray-900 dark:text-white mb-2">
              Free Browser-Based Tools
            </h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Start your cybersecurity journey with our professional asset evaluation tools. No installation, no account required.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
        <div className="mt-6 md:mt-8 bg-gradient-to-r from-command-blue-600 via-command-blue-700 to-action-cyan-600 dark:from-command-blue-800 dark:via-command-blue-900 dark:to-action-cyan-800 rounded-xl p-6 md:p-8 text-white text-center shadow-lg">
          <h2 className="text-xl md:text-2xl font-outfit font-bold mb-3 md:mb-4 text-white">
            Ready to See CyberSoluce™ Asset Manager in Action?
          </h2>
          <p className="text-base md:text-lg opacity-90 dark:opacity-95 mb-4 md:mb-6 max-w-2xl mx-auto text-white">
            Choose a demo scenario that matches your industry and see how our platform can help with your asset inventory management needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <button
              onClick={() => onStartDemo('healthcare-hospital')}
              className="inline-flex items-center justify-center px-5 md:px-6 py-2.5 md:py-3 bg-white dark:bg-gray-100 text-command-blue-600 dark:text-command-blue-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-200 transition-colors font-semibold shadow-lg hover:shadow-xl"
            >
              <Shield className="h-5 w-5 mr-2" />
              Healthcare Demo
            </button>
            <button
              onClick={() => onStartDemo('financial-bank')}
              className="inline-flex items-center justify-center px-5 md:px-6 py-2.5 md:py-3 bg-transparent border-2 border-white dark:border-gray-200 text-white dark:text-gray-100 rounded-lg hover:bg-white dark:hover:bg-gray-100 hover:text-command-blue-600 dark:hover:text-command-blue-700 transition-colors font-semibold"
            >
              <Building2 className="h-5 w-5 mr-2" />
              Financial Demo
            </button>
            <button
              onClick={() => onStartDemo('tech-startup')}
              className="inline-flex items-center justify-center px-5 md:px-6 py-2.5 md:py-3 bg-transparent border-2 border-white dark:border-gray-200 text-white dark:text-gray-100 rounded-lg hover:bg-white dark:hover:bg-gray-100 hover:text-command-blue-600 dark:hover:text-command-blue-700 transition-colors font-semibold"
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

// Named export for direct imports
export const DemoShowcase = DemoShowcaseComponent;

// Default export for lazy loading compatibility
export default DemoShowcaseComponent;