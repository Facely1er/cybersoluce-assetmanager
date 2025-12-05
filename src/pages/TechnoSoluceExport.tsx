/**
 * TechnoSoluce Export Page
 * 
 * Page for exporting assets and signals to TechnoSoluce for SBOM analysis.
 */

import { TechnoSoluceExportPanel } from '../features/technoSoluce/TechnoSoluceExportPanel';
import { MainLayout } from '../components/MainLayout';

export default function TechnoSoluceExportPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Export to TechnoSoluce
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Export software assets and signals for SBOM analysis and component visibility assessment.
          </p>
        </div>
        <TechnoSoluceExportPanel />
      </div>
    </MainLayout>
  );
}

