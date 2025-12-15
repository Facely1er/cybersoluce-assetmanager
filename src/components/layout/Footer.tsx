import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { 
  LayoutDashboard, 
  Database, 
  BarChart3, 
  Book, 
  Play, 
  Wrench,
  FileText,
  Lock,
  Cookie,
  AlertTriangle,
  Network,
  Shield
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
          
          {/* Company Info - Left Side */}
          <div className="md:col-span-1">
            <div className="mb-3">
              <Logo size="md" showText={true} />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
              Track, manage, and secure your digital assets with advanced filtering and compliance mapping.
            </p>
          </div>

          {/* Navigation Columns - Simplified */}
          <div className="md:col-span-3 md:ml-8 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            {/* Product - Essential links including critical security */}
            <div>
              <h3 className="text-base font-semibold mb-2 text-gray-900 dark:text-white">Product</h3>
              <ul className="space-y-1">
                <li>
                  <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-xs group">
                    <LayoutDashboard className="h-3 w-3 group-hover:text-action-cyan-400 transition-colors" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/assets" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-xs group">
                    <Database className="h-3 w-3 group-hover:text-action-cyan-400 transition-colors" />
                    Assets
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/vulnerabilities" className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors text-xs group font-medium">
                    <AlertTriangle className="h-3 w-3 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors" />
                    Vulnerabilities
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/dependencies" className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors text-xs group font-medium">
                    <Network className="h-3 w-3 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors" />
                    Dependencies
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/analytics" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-xs group">
                    <BarChart3 className="h-3 w-3 group-hover:text-action-cyan-400 transition-colors" />
                    Analytics
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources - Essential links only */}
            <div>
              <h3 className="text-base font-semibold mb-2 text-gray-900 dark:text-white">Resources</h3>
              <ul className="space-y-1">
                <li>
                  <Link to="/dashboard/user-manual" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-xs group">
                    <Book className="h-3 w-3 group-hover:text-action-cyan-400 transition-colors" />
                    User Manual
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/demo-scenarios" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-xs group">
                    <Play className="h-3 w-3 group-hover:text-action-cyan-400 transition-colors" />
                    Demo Scenarios
                  </Link>
                </li>
                <li>
                  <a href="/tools/" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-xs group">
                    <Wrench className="h-3 w-3 group-hover:text-action-cyan-400 transition-colors" />
                    Free Tools
                  </a>
                </li>
                <li>
                  <Link to="/how-asset-intelligence-works" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-xs group">
                    <Book className="h-3 w-3 group-hover:text-action-cyan-400 transition-colors" />
                    How Asset Intelligence Works
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal - Essential links only */}
            <div>
              <h3 className="text-base font-semibold mb-2 text-gray-900 dark:text-white">Legal</h3>
              <ul className="space-y-1">
                <li>
                  <Link to="/legal/privacy" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-xs group">
                    <Lock className="h-3 w-3 group-hover:text-action-cyan-400 transition-colors" />
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/legal/terms" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-xs group">
                    <FileText className="h-3 w-3 group-hover:text-action-cyan-400 transition-colors" />
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/legal/cookies" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-xs group">
                    <Cookie className="h-3 w-3 group-hover:text-action-cyan-400 transition-colors" />
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link to="/legal/acceptable-use" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-xs group">
                    <Shield className="h-3 w-3 group-hover:text-action-cyan-400 transition-colors" />
                    Acceptable Use Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-4 pt-3">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 dark:text-gray-400 text-xs">
              <div>CyberSoluce™ v1.0 – Asset Intelligence & Dependency Visibility</div>
              <div className="mt-1">© 2025 ERMITS. All rights reserved.</div>
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

