/**
 * Stripe Configuration for CyberSoluce AssetManager
 * Asset inventory and risk management platform monetization
 */

export const STRIPE_CONFIG = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  webhookSecret: import.meta.env.VITE_STRIPE_WEBHOOK_SECRET || '',
  apiVersion: '2023-10-16' as const,
  currency: 'usd',
};

// Product and pricing configuration
export const PRODUCTS = {
  free: {
    name: 'Free',
    priceId: null,
    productId: null,
    price: 0,
    interval: null,
    description: 'Perfect for small teams getting started with asset management',
    features: [
      'Up to 50 assets',
      'Basic asset inventory',
      'Asset categorization',
      'Basic risk tracking',
      'Export to CSV',
      'Community support',
      'Basic reporting',
    ],
    limits: {
      assets: 50,
      users: 1,
      risk_assessments: 5,
      compliance_reports: 0,
      api_access: false,
      custom_integrations: false,
      advanced_analytics: false,
      priority_support: false,
    },
  },
  professional: {
    name: 'Professional',
    priceId: import.meta.env.VITE_STRIPE_PRICE_PROFESSIONAL || 'price_professional_monthly',
    productId: import.meta.env.VITE_STRIPE_PRODUCT_PROFESSIONAL || 'prod_professional_monthly',
    price: 99,
    interval: 'month' as const,
    description: 'Complete asset management for growing organizations',
    features: [
      'Unlimited assets',
      'Advanced risk analysis',
      'Compliance reporting (NIST, ISO 27001)',
      'Automated risk scoring',
      'Custom risk frameworks',
      'Export to PDF, Excel, CSV',
      'Up to 10 team members',
      'API access (10,000 calls/month)',
      'Email support (24hr response)',
      'Advanced analytics dashboard',
      'Asset relationship mapping',
      'Vulnerability tracking',
    ],
    limits: {
      assets: -1, // Unlimited
      users: 10,
      risk_assessments: -1,
      compliance_reports: -1,
      api_access: true,
      api_calls: 10000,
      custom_integrations: false,
      advanced_analytics: true,
      priority_support: false,
    },
  },
  enterprise: {
    name: 'Enterprise',
    priceId: import.meta.env.VITE_STRIPE_PRICE_ENTERPRISE || 'price_enterprise_monthly',
    productId: import.meta.env.VITE_STRIPE_PRODUCT_ENTERPRISE || 'prod_enterprise_monthly',
    price: 299,
    interval: 'month' as const,
    description: 'Enterprise-grade asset management with advanced features',
    features: [
      'Everything in Professional, plus:',
      'Unlimited users',
      'Unlimited API access',
      'Custom integrations (Jira, ServiceNow, etc.)',
      'SSO/SAML authentication',
      'Advanced threat intelligence',
      'Automated compliance monitoring',
      'Custom branding',
      'Dedicated account manager',
      'Priority support (4hr response)',
      'SLA guarantees',
      'On-premise deployment option',
      'White-label options',
      'Custom feature development',
    ],
    limits: {
      assets: -1,
      users: -1,
      risk_assessments: -1,
      compliance_reports: -1,
      api_access: true,
      api_calls: -1,
      custom_integrations: true,
      advanced_analytics: true,
      priority_support: true,
    },
  },
};

// One-time products
export const ONE_TIME_PRODUCTS = {
  assetToolkit: {
    name: 'Asset Inventory Toolkit',
    priceId: import.meta.env.VITE_STRIPE_PRICE_TOOLKIT || 'price_toolkit_one_time',
    productId: import.meta.env.VITE_STRIPE_PRODUCT_TOOLKIT || 'prod_toolkit_one_time',
    price: 199,
    description: 'Complete offline asset management toolkit (lifetime access)',
    features: [
      'Asset inventory templates',
      'Risk assessment frameworks',
      'Compliance checklists',
      'Export to PDF/Excel',
      'Offline access (no cloud required)',
      'Lifetime updates',
      'Custom report templates',
    ],
  },
  vcisoStarterKit: {
    name: 'vCISO Starter Kit',
    priceId: import.meta.env.VITE_STRIPE_PRICE_VCISO_STARTER || 'price_vciso_starter',
    productId: import.meta.env.VITE_STRIPE_PRODUCT_VCISO_STARTER || 'prod_vciso_starter',
    price: 299,
    description: 'Self-service toolkit with 27 professional templates, playbooks, and delivery guides for vCISO practitioners',
    features: [
      '27 Professional Templates',
      '4 Template Categories',
      'Security Policies (10 Documents)',
      'Incident Response Playbooks (5 Documents)',
      'Board Materials (4 Documents)',
      'Compliance Checklists (8 Documents)',
      'Instant Digital Download',
      'Lifetime updates',
    ],
  },
  vcisoProfessionalKit: {
    name: 'vCISO Professional Kit',
    priceId: import.meta.env.VITE_STRIPE_PRICE_VCISO_PROFESSIONAL || 'price_vciso_professional',
    productId: import.meta.env.VITE_STRIPE_PRODUCT_VCISO_PROFESSIONAL || 'prod_vciso_professional',
    price: 499,
    description: 'Complete vCISO toolkit with 37+ templates, full delivery workflow guide, service delivery methodology, and ERMITS platform integration workflows',
    features: [
      'Everything in Starter Kit ($299 value)',
      'Complete 4-step Delivery Workflow',
      'Service Delivery Methodology',
      'Client Engagement Templates',
      'ERMITS Integration Workflows',
      'Pricing & Scoping Guides',
      'Instant Digital Download',
      'Lifetime updates',
    ],
  },
  executiveDashboardTemplate: {
    name: 'Executive Security Dashboard Template',
    priceId: import.meta.env.VITE_STRIPE_PRICE_DASHBOARD_TEMPLATE || 'price_dashboard_template',
    productId: import.meta.env.VITE_STRIPE_PRODUCT_DASHBOARD_TEMPLATE || 'prod_dashboard_template',
    price: 79,
    description: 'Professional HTML/CSS template for security executives to visualize risk, metrics, and strategic actions',
    features: [
      'HTML/CSS/JS Template',
      'White-Label Ready',
      'CSV Data Import',
      'Professional Charts (Chart.js)',
      'Fully Responsive',
      'Dark/Light Modes',
      'Complete Documentation',
      'Lifetime license',
    ],
  },
};

// Annual pricing discount (2 months free = ~16.7% discount)
export const ANNUAL_DISCOUNT = 0.167;

// Feature flags based on subscription tier
export const FEATURE_FLAGS = {
  free: [
    'basic_inventory',
    'asset_categorization',
    'basic_risk_tracking',
    'csv_export',
    'basic_reporting',
  ],
  professional: [
    'all_free_features',
    'unlimited_assets',
    'advanced_risk_analysis',
    'compliance_reporting',
    'api_access',
    'advanced_analytics',
    'team_collaboration',
  ],
  enterprise: [
    'all_features',
    'unlimited_users',
    'custom_integrations',
    'sso_saml',
    'dedicated_support',
    'sla_guarantees',
    'on_premise_deployment',
    'white_label',
  ],
};

// Helper functions
export function getPlanByPriceId(priceId: string) {
  return Object.entries(PRODUCTS).find(
    ([, product]) => product.priceId === priceId
  )?.[0] as keyof typeof PRODUCTS | undefined;
}

export function canAccessFeature(userTier: keyof typeof PRODUCTS, feature: string): boolean {
  const flags = FEATURE_FLAGS[userTier];
  
  if (!flags || !Array.isArray(flags)) {
    return false;
  }
  
  if (flags.includes('all_features') || flags.includes('all_free_features')) {
    return true;
  }
  
  return flags.includes(feature);
}

export function getUsageLimit(userTier: keyof typeof PRODUCTS, resource: keyof typeof PRODUCTS['free']['limits']): number | boolean {
  return PRODUCTS[userTier].limits[resource];
}

// Stripe checkout session configuration
export function getCheckoutConfig(plan: keyof typeof PRODUCTS, isAnnual: boolean = false) {
  const product = PRODUCTS[plan];
  
  if (!product.priceId) {
    throw new Error(`No price ID configured for plan: ${plan}`);
  }

  return {
    mode: 'subscription' as const,
    lineItems: [
      {
        price: product.priceId,
        quantity: 1,
      },
    ],
    successUrl: `${typeof window !== 'undefined' && window.location ? window.location.origin : 'https://www.cybersoluce.com'}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${typeof window !== 'undefined' && window.location ? window.location.origin : 'https://www.cybersoluce.com'}/pricing`,
    allowPromotionCodes: true,
    metadata: {
      plan,
      billing: isAnnual ? 'annual' : 'monthly',
      source: 'website',
    },
  };
}

// One-time product checkout configuration
export function getOneTimeCheckoutConfig(productKey: keyof typeof ONE_TIME_PRODUCTS) {
  const product = ONE_TIME_PRODUCTS[productKey];
  
  if (!product.priceId) {
    throw new Error(`No price ID configured for product: ${productKey}`);
  }

  return {
    mode: 'payment' as const,
    lineItems: [
      {
        price: product.priceId,
        quantity: 1,
      },
    ],
    successUrl: `${typeof window !== 'undefined' && window.location ? window.location.origin : 'https://www.cybersoluce.com'}/dashboard?success=true&product=${productKey}`,
    cancelUrl: `${typeof window !== 'undefined' && window.location ? window.location.origin : 'https://www.cybersoluce.com'}/pricing`,
    allowPromotionCodes: true,
    metadata: {
      product: productKey,
      type: 'one_time',
      source: 'website',
    },
  };
}

export default STRIPE_CONFIG;

