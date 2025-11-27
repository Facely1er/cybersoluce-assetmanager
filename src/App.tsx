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

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AssetInventoryProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950" role="main">
                {/* Global Toaster */}
                <Toaster 
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    // Enhanced styling for better accessibility
                    style: {
                      background: '#363636',
                      color: '#fff',
                      fontSize: '14px',
                      maxWidth: '400px',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)'
                    },
                    success: {
                      duration: 3000,
                      iconTheme: {
                        primary: '#10B981',
                        secondary: '#fff',
                      },
                      style: {
                        background: '#065F46',
                        color: '#D1FAE5'
                      }
                    },
                    error: {
                      duration: 5000,
                      iconTheme: {
                        primary: '#EF4444',
                        secondary: '#fff',
                      },
                      style: {
                        background: '#7F1D1D',
                        color: '#FEE2E2'
                      }
                    },
                    loading: {
                      duration: Infinity,
                      style: {
                        background: '#1F2937',
                        color: '#F3F4F6'
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
                    <LoadingSpinner size="lg" text="Loading CyberSoluce™ Asset Manager..." />
                  </div>
                }>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<HomePage />} />
                    
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