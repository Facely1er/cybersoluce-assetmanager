import React from 'react';
import { LucideIcon, Package, Search, Filter } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/utils/cn';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  image?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  image,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      {image && (
        <img
          src={image}
          alt=""
          className="w-48 h-48 mb-6 opacity-50 dark:opacity-30"
          aria-hidden="true"
        />
      )}
      
      {Icon && !image && (
        <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
          <Icon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
        </div>
      )}

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mb-6">
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {action && (
            <Button
              onClick={action.onClick}
              variant={action.variant || 'default'}
            >
              {action.label}
            </Button>
          )}
          
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="outline"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

// Pre-built empty states for common scenarios
export const EmptyAssets: React.FC<{ onCreateAsset: () => void; onImport?: () => void }> = ({
  onCreateAsset,
  onImport,
}) => (
  <EmptyState
    icon={Package}
    title="No assets found"
    description="Get started by adding your first asset or importing existing data."
    action={{
      label: 'Add Asset',
      onClick: onCreateAsset,
    }}
    secondaryAction={onImport ? {
      label: 'Import Assets',
      onClick: onImport,
    } : undefined}
  />
);

export const EmptySearch: React.FC<{ searchTerm: string; onClear: () => void }> = ({
  searchTerm,
  onClear,
}) => (
  <EmptyState
    icon={Search}
    title={`No results for "${searchTerm}"`}
    description="Try adjusting your search terms or filters to find what you're looking for."
    action={{
      label: 'Clear Filters',
      onClick: onClear,
      variant: 'outline',
    }}
  />
);

export const EmptyFilters: React.FC<{ onClearFilters: () => void }> = ({ onClearFilters }) => (
  <EmptyState
    icon={Filter}
    title="No items match your filters"
    description="Try adjusting your filters or clear them to see all items."
    action={{
      label: 'Clear Filters',
      onClick: onClearFilters,
      variant: 'outline',
    }}
  />
);

