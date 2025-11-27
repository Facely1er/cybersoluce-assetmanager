/**
 * Upgrade Prompt Component for CyberSoluce AssetManager
 * Uses shared upgrade prompt component
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UpgradePrompt as SharedUpgradePrompt, InlineUpgradePrompt as SharedInlinePrompt, UsageLimitBanner as SharedUsageBanner } from '../../../shared-utils/upgrade-prompt';

interface UpgradePromptProps {
  title: string;
  message: string;
  suggestedTier: string;
  features: string[];
  ctaText: string;
  currentTier?: string;
  onDismiss: () => void;
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  title,
  message,
  suggestedTier,
  features,
  ctaText,
  currentTier,
  onDismiss,
}) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate(`/pricing?upgrade=${suggestedTier}`);
  };

  return (
    <SharedUpgradePrompt
      title={title}
      message={message}
      suggestedTier={suggestedTier}
      features={features}
      ctaText={ctaText}
      onUpgrade={handleUpgrade}
      onDismiss={onDismiss}
      currentTier={currentTier}
      pricingUrl="/pricing"
    />
  );
};

interface InlineUpgradePromptProps {
  message: string;
  ctaText: string;
  className?: string;
}

export const InlineUpgradePrompt: React.FC<InlineUpgradePromptProps> = ({
  message,
  ctaText,
  className,
}) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  return (
    <SharedInlinePrompt
      message={message}
      ctaText={ctaText}
      onUpgrade={handleUpgrade}
      className={className}
    />
  );
};

interface UsageLimitBannerProps {
  resource: string;
  currentUsage: number;
  limit: number;
}

export const UsageLimitBanner: React.FC<UsageLimitBannerProps> = ({
  resource,
  currentUsage,
  limit,
}) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  return (
    <SharedUsageBanner
      resource={resource}
      currentUsage={currentUsage}
      limit={limit}
      onUpgrade={handleUpgrade}
    />
  );
};

