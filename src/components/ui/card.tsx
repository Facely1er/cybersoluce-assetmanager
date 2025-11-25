import * as React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  elevated?: boolean;
  glass?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  className, 
  hoverable = false,
  elevated = false,
  glass = false,
  ...props 
}) => {
  const baseClasses = "rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm transition-smooth border-gray-200 dark:border-gray-700";
  
  const variantClasses = [
    hoverable && "card-hoverable",
    elevated && "card-elevated",
    glass && "glass-card",
  ].filter(Boolean).join(" ");

  return (
    <div
      className={`${baseClasses} ${variantClasses} ${className || ""}`}
      {...props}
    />
  );
};

Card.displayName = "Card";

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
}

const CardHeader: React.FC<CardHeaderProps> = ({ 
  className, 
  noPadding = false,
  ...props 
}) => (
  <div
    className={`flex flex-col space-y-1.5 ${!noPadding ? 'p-6' : ''} ${className || ""}`}
    {...props}
  />
);

CardHeader.displayName = "CardHeader";

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const CardTitle: React.FC<CardTitleProps> = ({ 
  className, 
  as: Component = 'h3',
  ...props 
}) => (
  <Component
    className={`text-2xl font-semibold leading-none tracking-tight ${className || ""}`}
    {...props}
  />
);

CardTitle.displayName = "CardTitle";

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
}

const CardContent: React.FC<CardContentProps> = ({ 
  className, 
  noPadding = false,
  ...props 
}) => (
  <div
    className={`${!noPadding ? 'p-6 pt-0' : ''} ${className || ""}`}
    {...props}
  />
);

CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardContent };

