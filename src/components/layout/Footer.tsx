import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Database, 
  BarChart3, 
  Shield, 
  Book, 
  Workflow, 
  Play, 
  Wrench,
  FileText,
  Lock,
  Cookie,
  ShieldAlert
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white border-t border-gray-800 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
          
          {/* Company Info - Left Side */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-3">
              <div className="relative flex-shrink-0 mr-3 z-10">
                <img 
                  src="/cybersoluce.png" 
                  alt="CyberSoluce Logo" 
                  className="h-12 w-12 object-contain drop-shadow-2xl"
                  loading="eager"
                  style={{ display: 'block', opacity: 1, filter: 'brightness(1.1) contrast(1.1)' }}
                  onError={(e) => {
                    console.error('Logo failed to load');
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
              <div className="flex flex-col">
                {/* Line 1: CyberSoluce™ */}
                <div className="flex items-baseline gap-0.5 leading-none">
                  <span className="font-outfit text-lg font-bold tracking-tight bg-gradient-to-r from-white via-action-cyan-200 to-action-cyan-400 bg-clip-text text-transparent">
                    CyberSoluce
                  </span>
                  <sup className="font-outfit text-[10px] font-bold text-action-cyan-400 leading-none relative -top-1">™</sup>
                </div>
                {/* Line 2: AssetManager */}
                <span className="font-inter text-xs font-semibold text-gray-300 tracking-wide mt-0.5">AssetManager</span>
                {/* Line 3: by ERMITS */}
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-[8px] text-gray-500 font-medium">by</span>
                  <span className="font-inter text-[10px] font-bold text-action-cyan-400 uppercase tracking-wider">ERMITS</span>
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              Track, manage, and secure your digital assets with advanced filtering and compliance mapping.
            </p>
          </div>

          {/* Navigation Columns - Centered/Balanced */}
          <div className="md:col-span-3 md:ml-8 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            {/* Product */}
            <div>
              <h3 className="text-base font-semibold mb-2 text-white">Product</h3>
              <ul className="space-y-1">
                <li>
                  <Link to="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs group">
                    <LayoutDashboard className="h-3 w-3 group-hover:text-action-cyan-400 transition-colors" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/assets" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs group">
                    <Database className="h-3 w-3 group-hover:text-action-cyan-400 transition-colors" />
                    Asset Inventory
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/analytics" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs group">
                    <BarChart3 className="h-3 w-3 group-hover:text-action-cyan-400 transition-colors" />
                    Analytics & Reports
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/compliance" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs group">
                    <Shield className="h-3 w-3 group-hover:text-action-cyan-400 transition-colors" />
                    Compliance
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-base font-semibold mb-2 text-white">Resources</h3>
              <ul className="space-y-1">
                <li>
                  <Link to="/dashboard/user-manual" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs group">
                    <Book className="h-3 w-3 group-hover:text-action-cyan-400 transition-colors" />
                    User Manual
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/workflow" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs group">
                    <Workflow className="h-3 w-3 group-hover:text-action-cyan-400 transition-colors" />
                    Setup Workflow
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/demo-scenarios" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs group">
                    <Play className="h-3 w-3 group-hover:text-action-cyan-400 transition-colors" />
                    Demo Scenarios
                  </Link>
                </li>
                <li>
                  <a href="/tools/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs group">
                    <Wrench className="h-3 w-3 group-hover:text-action-cyan-400 transition-colors" />
                    Free Tools
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-base font-semibold mb-2 text-white">Legal</h3>
              <ul className="space-y-1">
                <li>
                  <Link to="/legal/privacy" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs group">
                    <Lock className="h-3 w-3 group-hover:text-action-cyan-400 transition-colors" />
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/legal/terms" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs group">
                    <FileText className="h-3 w-3 group-hover:text-action-cyan-400 transition-colors" />
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/legal/cookies" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs group">
                    <Cookie className="h-3 w-3 group-hover:text-action-cyan-400 transition-colors" />
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link to="/legal/acceptable-use" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs group">
                    <ShieldAlert className="h-3 w-3 group-hover:text-action-cyan-400 transition-colors" />
                    Acceptable Use Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-4 pt-3">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-xs">
              © 2025 ERMITS LLC. All rights reserved.
            </div>
            <div className="mt-2 md:mt-0">
              <Link 
                to="/dashboard" 
                className="inline-flex items-center px-2 py-1 bg-command-blue-600 hover:bg-command-blue-700 text-white rounded-lg transition-colors text-xs font-medium"
              >
                Access Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

