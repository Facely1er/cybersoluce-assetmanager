import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white border-t border-gray-800 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <img 
                src="/cybersoluce.png" 
                alt="CyberSoluce Logo" 
                className="h-12 w-12 object-contain"
              />
              <span className="ml-3">
                <span className="block text-xl font-bold text-white">CyberSoluce<sup className="text-xs font-normal text-action-cyan-400">™</sup></span>
                <span className="block text-xs text-gray-400 font-medium">AssetManager</span>
                <span className="block text-xs text-gray-500 font-normal">by ERMITS</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Comprehensive asset inventory management platform for cybersecurity professionals. Track, manage, and secure your digital assets with advanced filtering, compliance mapping, and risk assessment features.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard/assets" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Asset Inventory
                </Link>
              </li>
              <li>
                <Link to="/dashboard/analytics" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Analytics & Reports
                </Link>
              </li>
              <li>
                <Link to="/dashboard/compliance" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Compliance
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard/user-manual" className="text-gray-400 hover:text-white transition-colors text-sm">
                  User Manual
                </Link>
              </li>
              <li>
                <Link to="/dashboard/workflow" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Setup Workflow
                </Link>
              </li>
              <li>
                <Link to="/dashboard/demo-scenarios" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Demo Scenarios
                </Link>
              </li>
              <li>
                <Link to="/tools/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Free Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-400 text-sm">ERMITS Corporation</span>
              </li>
              <li>
                <span className="text-gray-400 text-sm">© 2025 ERMITS LLC.</span>
              </li>
              <li>
                <span className="text-gray-400 text-sm">All rights reserved.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2025 ERMITS LLC. All rights reserved.
            </div>
            <div className="mt-4 md:mt-0">
              <Link 
                to="/dashboard" 
                className="inline-flex items-center px-4 py-2 bg-command-blue-600 hover:bg-command-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
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

