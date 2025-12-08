# Environment Variables Setup Guide

This guide explains how to configure environment variables for CyberSoluce.

## Quick Start

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Update required variables:**
   - Set `VITE_SUPABASE_URL`
   - Set `VITE_SUPABASE_ANON_KEY`

3. **For production:**
   - Set variables in your deployment platform (Netlify/Vercel)
   - See [Production Deployment](#production-deployment) section

## Environment Variable Reference

### Required Variables

#### `VITE_SUPABASE_URL`
- **Description**: Your Supabase project URL
- **Example**: `https://uvdrwbmhmtgacwzujfzc.supabase.co`
- **Where to get**: Supabase Dashboard → Settings → API → Project URL
- **Required**: Yes (for production)

#### `VITE_SUPABASE_ANON_KEY`
- **Description**: Supabase anonymous/public key (safe for frontend)
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Where to get**: Supabase Dashboard → Settings → API → Project API keys → `anon` `public`
- **Required**: Yes (for production)

### Application Configuration

#### `VITE_APP_ENV`
- **Description**: Application environment
- **Values**: `development` | `preview` | `production`
- **Default**: `development`
- **Required**: No (defaults to development)

#### `VITE_DEBUG_MODE`
- **Description**: Enable debug logging
- **Values**: `true` | `false`
- **Default**: `false`
- **Production**: Set to `false`

### Feature Flags

#### `VITE_ENABLE_OFFLINE_MODE`
- **Description**: Enable offline functionality
- **Values**: `true` | `false`
- **Default**: `false`

#### `VITE_ENABLE_ANALYTICS`
- **Description**: Enable analytics tracking
- **Values**: `true` | `false`
- **Default**: `false`

#### `VITE_ENABLE_ERROR_REPORTING`
- **Description**: Enable error reporting (Sentry)
- **Values**: `true` | `false`
- **Default**: `false`
- **Production**: Recommended `true`

#### `VITE_ENABLE_PWA`
- **Description**: Enable Progressive Web App features
- **Values**: `true` | `false`
- **Default**: `false`

#### `VITE_ENABLE_REAL_TIME`
- **Description**: Enable real-time features (Supabase Realtime)
- **Values**: `true` | `false`
- **Default**: `true`

#### `VITE_CYBERSOLUCE_DEMO_ENABLED`
- **Description**: Enable demo mode (sector demos, sample data)
- **Values**: `true` | `false`
- **Default**: `true`
- **Production**: Set to `false`

### Signal History Store

#### `VITE_HISTORY_STORE_MODE`
- **Description**: Storage mode for signal history
- **Values**: `local` | `backend`
- **Default**: `local`
- **Production**: Set to `backend` (required for CSV import and SBOM upload)

### Optional Integrations

#### `VITE_SENTRY_DSN`
- **Description**: Sentry Data Source Name for error tracking
- **Example**: `https://abc123@o123456.ingest.sentry.io/123456`
- **Where to get**: Sentry Dashboard → Settings → Projects → Client Keys (DSN)
- **Required**: No

#### `VITE_STRIPE_PUBLISHABLE_KEY`
- **Description**: Stripe publishable key (frontend-safe)
- **Example**: `pk_test_...` (test) or `pk_live_...` (production)
- **Where to get**: Stripe Dashboard → Developers → API keys
- **Required**: No

#### `VITE_NMAP_SCANNER_URL`
- **Description**: Base URL for NMAP scanner API
- **Development**: `http://localhost:8080/api`
- **Production**: `https://nmap-scanner.your-domain.com/api`
- **Note**: Disabled in production if not set or uses localhost
- **Required**: No

#### `VITE_PROMETHEUS_URL`
- **Description**: Base URL for Prometheus API
- **Development**: `http://localhost:9090/api/v1`
- **Production**: `https://prometheus.your-domain.com/api/v1`
- **Note**: Disabled in production if not set or uses localhost
- **Required**: No

## Local Development Setup

1. **Create `.env.local` file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Update Supabase credentials:**
   ```bash
   VITE_SUPABASE_URL=https://uvdrwbmhmtgacwzujfzc.supabase.co
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
   ```

3. **Configure for development:**
   ```bash
   VITE_APP_ENV=development
   VITE_DEBUG_MODE=true
   VITE_CYBERSOLUCE_DEMO_ENABLED=true
   VITE_HISTORY_STORE_MODE=local
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## Production Deployment

### Netlify

1. Go to **Site settings** → **Environment variables**
2. Add each variable with its production value
3. Set scope: **Production**, **Deploy previews**, or **Branch deploys**

**Required for Production:**
```bash
VITE_SUPABASE_URL=https://uvdrwbmhmtgacwzujfzc.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
VITE_APP_ENV=production
VITE_DEBUG_MODE=false
VITE_ENABLE_ERROR_REPORTING=true
VITE_CYBERSOLUCE_DEMO_ENABLED=false
VITE_HISTORY_STORE_MODE=backend
```

**Optional (if using):**
```bash
VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_PWA=true
```

### Vercel

1. Go to **Project Settings** → **Environment Variables**
2. Add each variable with its production value
3. Select environments: **Production**, **Preview**, **Development**

Use the same variables as Netlify above.

## Environment Variable Validation

The application validates environment variables at runtime:

- **Supabase**: If not configured, app runs in demo mode (no database persistence)
- **External Services**: If not configured or use localhost in production, integrations are disabled
- **Feature Flags**: Default to safe values if not set

## Security Notes

### Safe to Expose (Frontend)
- `VITE_SUPABASE_ANON_KEY` - Public key, protected by RLS policies
- `VITE_STRIPE_PUBLISHABLE_KEY` - Public key, safe for frontend
- All `VITE_*` variables are exposed in the frontend bundle

### Never Expose
- Supabase service role key (server-side only)
- Stripe secret keys (server-side only)
- Any secrets or private keys

## Troubleshooting

### App runs in demo mode
- **Cause**: Supabase not configured
- **Solution**: Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### CSV import fails
- **Cause**: `VITE_HISTORY_STORE_MODE` not set to `backend`
- **Solution**: Set `VITE_HISTORY_STORE_MODE=backend`

### External integrations disabled
- **Cause**: URLs not configured or use localhost in production
- **Solution**: Set production URLs or leave unset to disable

### Build errors
- **Cause**: Missing required variables
- **Solution**: Check `.env.local` or deployment platform environment variables

## Quick Reference

| Variable | Required | Default | Production Value |
|----------|----------|---------|------------------|
| `VITE_SUPABASE_URL` | Yes* | - | `https://...supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Yes* | - | `eyJ...` |
| `VITE_APP_ENV` | No | `development` | `production` |
| `VITE_DEBUG_MODE` | No | `false` | `false` |
| `VITE_ENABLE_ERROR_REPORTING` | No | `false` | `true` |
| `VITE_CYBERSOLUCE_DEMO_ENABLED` | No | `true` | `false` |
| `VITE_HISTORY_STORE_MODE` | No | `local` | `backend` |

*Required for production (app works in demo mode without them)

## Additional Resources

- [Supabase Dashboard](https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc)
- [Deployment Guide](./docs/deployment/PRODUCTION_DEPLOYMENT_COMPLETE.md)
- [Environment Variables Reference](./docs/deployment/PRODUCTION_DEPLOYMENT_COMPLETE.md#environment-variables-reference)

