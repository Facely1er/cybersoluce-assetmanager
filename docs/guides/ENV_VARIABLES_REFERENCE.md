# Environment Variables Reference

This file documents all environment variables used by CyberSoluce.  
**Create a `.env.local` file in the project root with these variables for local development.**  
**For production, set these in your deployment platform (Netlify, Vercel, etc.).**

---

## Required Variables (Must Set in Production)

### Supabase Configuration
```bash
# Get these from: https://app.supabase.com/project/YOUR_PROJECT/settings/api
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Application Configuration
```bash
# Application environment: production, preview, development
VITE_APP_ENV=production

# Debug mode: true for development, false for production
VITE_DEBUG_MODE=false

# Enable error reporting: true to enable, false to disable
VITE_ENABLE_ERROR_REPORTING=true
```

---

## Optional Variables (Set if Using Feature)

### Stripe Configuration
```bash
# Only required if using Stripe for payments
# Get from: https://dashboard.stripe.com/apikeys
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
VITE_STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Stripe Product/Price IDs (optional, defaults provided in code)
VITE_STRIPE_PRICE_PROFESSIONAL=price_professional_monthly
VITE_STRIPE_PRODUCT_PROFESSIONAL=prod_professional_monthly
VITE_STRIPE_PRICE_ENTERPRISE=price_enterprise_monthly
VITE_STRIPE_PRODUCT_ENTERPRISE=prod_enterprise_monthly
VITE_STRIPE_PRICE_TOOLKIT=price_toolkit_one_time
VITE_STRIPE_PRODUCT_TOOLKIT=prod_toolkit_one_time
VITE_STRIPE_PRICE_VCISO_STARTER=price_vciso_starter
VITE_STRIPE_PRODUCT_VCISO_STARTER=prod_vciso_starter
VITE_STRIPE_PRICE_VCISO_PROFESSIONAL=price_vciso_professional
VITE_STRIPE_PRODUCT_VCISO_PROFESSIONAL=prod_vciso_professional
VITE_STRIPE_PRICE_DASHBOARD_TEMPLATE=price_dashboard_template
VITE_STRIPE_PRODUCT_DASHBOARD_TEMPLATE=prod_dashboard_template
```

### Error Tracking (Sentry)
```bash
# Only required if using Sentry for error tracking
# Get from: https://sentry.io/settings/YOUR_ORG/projects/YOUR_PROJECT/keys/
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/your-project-id
```

### External Service Integrations
```bash
# Only required if using these external services
# These default to localhost in development but MUST be set for production
# or the integrations will be automatically disabled

# NMAP Scanner API URL (for network asset discovery)
# Production URL example: https://nmap-scanner.your-domain.com/api
VITE_NMAP_SCANNER_URL=http://localhost:8080/api

# Prometheus Monitoring API URL (for performance metrics)
# Production URL example: https://prometheus.your-domain.com/api/v1
VITE_PROMETHEUS_URL=http://localhost:9090/api/v1
```

### Demo Mode
```bash
# Enable/disable demo mode features
# Set to 'false' to disable demo mode in production
VITE_CYBERSOLUCE_DEMO_ENABLED=true
```

---

## Quick Setup Guide

### For Local Development:
1. Copy this file content
2. Create `.env.local` in project root
3. Paste and fill in your values
4. Start development server: `npm run dev`

### For Production (Netlify):
1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add each variable from the Required section above
3. Add optional variables if using those features
4. Redeploy site

### For Production (Vercel):
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add each variable from the Required section above
3. Add optional variables if using those features
4. Redeploy site

---

## Security Notes

1. **All `VITE_*` variables are exposed to client-side code**
   - Never put sensitive secrets in `VITE_*` variables
   - Use server-side environment variables for secrets (e.g., Stripe webhook secrets)

2. **External Service URLs**
   - In production, URLs that default to localhost will be automatically disabled
   - Set production URLs or leave unset to disable integrations

3. **Supabase Keys**
   - The `anon` key is safe to expose (it's public by design)
   - Never expose the `service_role` key (server-side only)

4. **Demo Mode**
   - Demo mode allows the app to run without Supabase
   - Disable in production: `VITE_CYBERSOLUCE_DEMO_ENABLED=false`

---

## Example .env.local File

```bash
# Required
VITE_SUPABASE_URL=https://uvdrwbmhmtgacwzujfzc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_APP_ENV=development
VITE_DEBUG_MODE=true
VITE_ENABLE_ERROR_REPORTING=true

# Optional - Stripe (if using)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Optional - Sentry (if using)
VITE_SENTRY_DSN=https://...

# Optional - External Services (development only)
VITE_NMAP_SCANNER_URL=http://localhost:8080/api
VITE_PROMETHEUS_URL=http://localhost:9090/api/v1

# Demo Mode
VITE_CYBERSOLUCE_DEMO_ENABLED=true
```

---

**Last Updated**: December 4, 2025

