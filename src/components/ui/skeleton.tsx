import React from 'react';
import { cn } from '@/utils/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'shimmer' | 'none';
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'rectangular', width, height, animation = 'shimmer', ...props }, ref) => {
    const baseStyles = 'bg-gray-200 dark:bg-gray-700';
    
    const variantStyles = {
      text: 'rounded h-4',
      circular: 'rounded-full',
      rectangular: 'rounded',
      rounded: 'rounded-lg',
    };

    const animationStyles = {
      pulse: 'animate-pulse',
      shimmer: 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]',
      none: '',
    };

    const style: React.CSSProperties = {
      width: width || (variant === 'text' ? '100%' : undefined),
      height: height || (variant === 'text' ? undefined : '1rem'),
      ...props.style,
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          animationStyles[animation],
          className
        )}
        style={style}
        aria-label="Loading..."
        role="status"
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

// Pre-built skeleton components for common use cases
export const SkeletonText = ({ lines = 3, className }: { lines?: number; className?: string }) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        width={i === lines - 1 ? '75%' : '100%'}
        animation="shimmer"
      />
    ))}
  </div>
);

export const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={cn('p-6 border border-gray-200 dark:border-gray-700 rounded-lg', className)}>
    <Skeleton variant="rounded" height={24} width="60%" className="mb-4" />
    <SkeletonText lines={3} />
    <div className="mt-4 flex gap-2">
      <Skeleton variant="rounded" height={36} width={100} />
      <Skeleton variant="rounded" height={36} width={100} />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) => (
  <div className="space-y-2">
    {/* Header */}
    <div className="flex gap-4 pb-2 border-b border-gray-200 dark:border-gray-700">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} variant="text" height={20} width={`${100 / columns}%`} />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex gap-4 py-3">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton
            key={colIndex}
            variant="text"
            height={16}
            width={`${100 / columns}%`}
            className={colIndex === columns - 1 ? 'w-20' : undefined}
          />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonAvatar = ({ size = 40 }: { size?: number }) => (
  <Skeleton
    variant="circular"
    width={size}
    height={size}
    className="flex-shrink-0"
  />
);

export { Skeleton };

