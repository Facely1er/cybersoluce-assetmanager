import React, { useState } from 'react';
import { Sparkles, Brain, Zap, ArrowRight } from 'lucide-react';
import AIClassificationEngine from './AIClassificationEngine';
import MagicalOrchestrationEngine from './MagicalOrchestrationEngine';

type MagicalView = 'overview' | 'orchestration' | 'classification';

const MagicalDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<MagicalView>('overview');

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 text-white p-12 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-green-600/20 animate-pulse"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <Sparkles className="w-16 h-16 text-yellow-300" />
            <div>
              <h1 className="text-5xl font-bold mb-2">Magical AI Command Center</h1>
              <p className="text-2xl text-blue-100">
                Autonomous Intelligence for Asset & Security Management
              </p>
            </div>
          </div>
          <p className="text-xl text-blue-100 max-w-4xl">
            Experience the future of cybersecurity management with AI-powered automation that transforms 
            your data into actionable intelligence. No configuration required—just pure magic.
          </p>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Orchestration Engine Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-shadow">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-6">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-10 h-10 text-yellow-300" />
              <h2 className="text-3xl font-bold text-white">Magical Orchestration Engine</h2>
            </div>
            <p className="text-blue-100 text-lg">
              Import anything. Get everything. Automatically.
            </p>
          </div>
          
          <div className="p-6 space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">What It Does:</h3>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Automatically detects assets, vendors, and data from ANY format</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Auto-enriches with vulnerability intelligence and risk scores</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Creates relationships and cross-references automatically</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Transforms static data into a living intelligence platform</span>
              </li>
            </ul>
            
            <div className="pt-4">
              <button
                onClick={() => setActiveView('orchestration')}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Launch Orchestration Engine
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* AI Classification Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-shadow">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
            <div className="flex items-center gap-3 mb-3">
              <Brain className="w-10 h-10 text-yellow-300" />
              <h2 className="text-3xl font-bold text-white">AI Classification Engine</h2>
            </div>
            <p className="text-blue-100 text-lg">
              Intelligent asset routing powered by machine learning
            </p>
          </div>
          
          <div className="p-6 space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">What It Does:</h3>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Automatically classifies assets by type, risk, and business impact</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Routes assets to optimal ERMITS products (TechnoSoluce, VendorSoluce, etc.)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Provides AI-generated insights and recommendations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Learns from patterns to improve accuracy over time</span>
              </li>
            </ul>
            
            <div className="pt-4">
              <button
                onClick={() => setActiveView('classification')}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <Brain className="w-5 h-5" />
                Launch Classification Engine
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-orange-900 dark:text-orange-300 mb-4">
          ✨ "It Just Works" Philosophy
        </h2>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-4xl mb-2">📊</div>
            <h3 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">Upload Anything</h3>
            <p className="text-sm text-orange-700 dark:text-orange-400">
              Spreadsheets, contracts, inventories—AI understands them all
            </p>
          </div>
          <div>
            <div className="text-4xl mb-2">🤖</div>
            <h3 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">AI Does Everything</h3>
            <p className="text-sm text-orange-700 dark:text-orange-400">
              Automatic detection, enrichment, analysis, and recommendations
            </p>
          </div>
          <div>
            <div className="text-4xl mb-2">🚀</div>
            <h3 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">Get Results Instantly</h3>
            <p className="text-sm text-orange-700 dark:text-orange-400">
              Complete cybersecurity command center in seconds
            </p>
          </div>
        </div>
        <p className="text-center text-orange-900 dark:text-orange-300 mt-6 text-lg font-semibold">
          No configuration. No training. No manual work. Pure magic. ✨
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Back Button (only show when not on overview) */}
      {activeView !== 'overview' && (
        <div className="mb-6">
          <button
            onClick={() => setActiveView('overview')}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            ← Back to Overview
          </button>
        </div>
      )}

      {/* Content */}
      {activeView === 'overview' && renderOverview()}
      {activeView === 'orchestration' && <MagicalOrchestrationEngine />}
      {activeView === 'classification' && <AIClassificationEngine />}
    </div>
  );
};

export default MagicalDashboard;

