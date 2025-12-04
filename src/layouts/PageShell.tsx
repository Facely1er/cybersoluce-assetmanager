import { ReactNode } from 'react';

interface PageShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  maxWidth?: 'default' | 'narrow' | 'wide';
}

/**
 * PageShell component for CyberSoluce
 * Provides consistent page layout with title, subtitle, and content spacing
 * Aligned with shared ERMITS design system
 */
export function PageShell({ title, subtitle, children, maxWidth = 'default' }: PageShellProps) {
  const maxWidthClass = 
    maxWidth === 'narrow' ? 'max-w-3xl' : 
    maxWidth === 'wide' ? 'max-w-7xl' : 
    'max-w-6xl';
  
  return (
    <div className="min-h-screen bg-background">
      <main className={`${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6`}>
        <header className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">
              {subtitle}
            </p>
          )}
        </header>
        {children}
      </main>
    </div>
  );
}

