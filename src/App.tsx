import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { AssetInventoryProvider } from './contexts/AssetInventoryContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthGuard } from './components/auth/AuthGuard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { MainLayout } from './components/MainLayout';
import HomePage from './pages/HomePage';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { PrivacyPolicy } from './pages/legal/PrivacyPolicy';
import { TermsOfService } from './pages/legal/TermsOfService';
import { CookiePolicy } from './pages/legal/CookiePolicy';
import { Compliance } from './pages/legal/Compliance';
import { AcceptableUsePolicy } from './pages/legal/AcceptableUsePolicy';
import ToolsPage from './pages/ToolsPage';
import Pricing from './pages/Pricing';
import VcisoStarterKit from './pages/VcisoStarterKit';
import VcisoProfessionalKit from './pages/VcisoProfessionalKit';
import ExecutiveDashboardTemplate from './pages/ExecutiveDashboardTemplate';
import { SectorDemoLauncher } from './demo/SectorDemoLauncher';
import { SectorDemoOrchestratorWrapper } from './features/demo/SectorDemoOrchestratorWrapper';
import { HowAssetIntelligenceWorks } from './pages/HowAssetIntelligenceWorks';
import DataImports from './pages/DataImports';
import CyberCautionPreCheck from './pages/CyberCautionPreCheck';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AssetInventoryProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950" role="main">
                {/* Global Toaster - Theme Aware */}
                <Toaster 
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    // Theme-aware styling
                    className: 'toast-theme-aware',
                    style: {
                      fontSize: '14px',
                      maxWidth: '400px',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
                      // Default colors (will be overridden by CSS)
                      background: 'var(--toast-bg, #363636)',
                      color: 'var(--toast-text, #fff)',
                    },
                    success: {
                      duration: 3000,
                      iconTheme: {
                        primary: '#10B981',
                        secondary: '#fff',
                      },
                      style: {
                        background: 'var(--toast-success-bg, #065F46)',
                        color: 'var(--toast-success-text, #D1FAE5)'
                      }
                    },
                    error: {
                      duration: 5000,
                      iconTheme: {
                        primary: '#EF4444',
                        secondary: '#fff',
                      },
                      style: {
                        background: 'var(--toast-error-bg, #7F1D1D)',
                        color: 'var(--toast-error-text, #FEE2E2)'
                      }
                    },
                    loading: {
                      duration: Infinity,
                      style: {
                        background: 'var(--toast-loading-bg, #1F2937)',
                        color: 'var(--toast-loading-text, #F3F4F6)'
                      }
                    },
                  }}
                  // Accessibility improvements
                  containerStyle={{
                    top: '1rem',
                    right: '1rem'
                  }}
                />
                
                {/* Application Content with Suspense */}
                <Suspense fallback={
                  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <LoadingSpinner size="lg" text="Loading CyberSoluce™ Asset Intelligence..." />
                  </div>
                }>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={
                      <>
                        <Header />
                        <HomePage />
                        <Footer />
                      </>
                    } />
                    <Route path="/pricing" element={
                      <>
                        <Header />
                        <Pricing />
                        <Footer />
                      </>
                    } />
                    
                    {/* Dashboard route - redirects to dashboard view */}
                    <Route 
                      path="/dashboard" 
                      element={
                        <AuthGuard 
                          requireAuth={false}
                          fallback={
                            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                              <LoadingSpinner size="lg" text="Initializing..." />
                            </div>
                          }
                        >
                          <MainLayout />
                        </AuthGuard>
                      } 
                    />
                    
                    {/* All dashboard sub-routes */}
                    <Route 
                      path="/dashboard/:view" 
                      element={
                        <AuthGuard 
                          requireAuth={false}
                          fallback={
                            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                              <LoadingSpinner size="lg" text="Initializing..." />
                            </div>
                          }
                        >
                          <MainLayout />
                        </AuthGuard>
                      } 
                    />
                    
                    {/* Legal pages */}
                    <Route 
                      path="/legal/privacy" 
                      element={<PrivacyPolicy />} 
                    />
                    <Route 
                      path="/legal/terms" 
                      element={<TermsOfService />} 
                    />
                    <Route 
                      path="/legal/cookies" 
                      element={<CookiePolicy />} 
                    />
                    <Route 
                      path="/legal/compliance" 
                      element={<Compliance />} 
                    />
                    <Route 
                      path="/legal/acceptable-use" 
                      element={<AcceptableUsePolicy />} 
                    />
                    
                    {/* Demo launcher route */}
                    <Route 
                      path="/demo/sector" 
                      element={
                        <>
                          <Header />
                          <SectorDemoLauncher />
                          <Footer />
                        </>
                      } 
                    />
                    
                    {/* Demo orchestrator route */}
                    <Route 
                      path="/demo/orchestrator" 
                      element={
                        <>
                          <Header />
                          <SectorDemoOrchestratorWrapper />
                          <Footer />
                        </>
                      } 
                    />
                    
                    {/* How Asset Intelligence Works page */}
                    <Route 
                      path="/how-asset-intelligence-works" 
                      element={<HowAssetIntelligenceWorks />} 
                    />
                    
                    {/* Data Imports route */}
                    <Route 
                      path="/imports" 
                      element={
                        <AuthGuard 
                          requireAuth={false}
                          fallback={
                            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                              <LoadingSpinner size="lg" text="Initializing..." />
                            </div>
                          }
                        >
                          <>
                            <Header />
                            <DataImports />
                            <Footer />
                          </>
                        </AuthGuard>
                      } 
                    />
                    
                    {/* CyberCaution Pre-Check route */}
                    <Route 
                      path="/cybercaution/precheck" 
                      element={
                        <AuthGuard 
                          requireAuth={false}
                          fallback={
                            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                              <LoadingSpinner size="lg" text="Initializing..." />
                            </div>
                          }
                        >
                          <MainLayout />
                        </AuthGuard>
                      } 
                    />
                    
                    {/* VendorSoluce Watchlist route */}
                    <Route 
                      path="/vendorsoluce/watchlist" 
                      element={
                        <AuthGuard 
                          requireAuth={false}
                          fallback={
                            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                              <LoadingSpinner size="lg" text="Initializing..." />
                            </div>
                          }
                        >
                          <MainLayout />
                        </AuthGuard>
                      } 
                    />
                    
                    {/* ERMITS Advisory Visibility Annex route */}
                    <Route 
                      path="/ermits-advisory/visibility-annex" 
                      element={
                        <AuthGuard 
                          requireAuth={false}
                          fallback={
                            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                              <LoadingSpinner size="lg" text="Initializing..." />
                            </div>
                          }
                        >
                          <MainLayout />
                        </AuthGuard>
                      } 
                    />
                    
                    {/* Tools page - handles both /tools and /tools/ */}
                    <Route 
                      path="/tools/*" 
                      element={
                        <>
                          <Header />
                          <ToolsPage />
                          <Footer />
                        </>
                      } 
                    />
                    
                    {/* Product pages */}
                    <Route 
                      path="/products/vciso-starter" 
                      element={
                        <>
                          <Header />
                          <VcisoStarterKit />
                          <Footer />
                        </>
                      } 
                    />
                    <Route 
                      path="/products/vciso-professional" 
                      element={
                        <>
                          <Header />
                          <VcisoProfessionalKit />
                          <Footer />
                        </>
                      } 
                    />
                    <Route 
                      path="/products/dashboard-template" 
                      element={
                        <>
                          <Header />
                          <ExecutiveDashboardTemplate />
                          <Footer />
                        </>
                      } 
                    />
                    
                    {/* Fallback route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </div>
            </BrowserRouter>
          </AssetInventoryProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;