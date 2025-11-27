# 🚀 Production Deployment Guide - CyberSoluce Asset Manager

**Last Updated**: November 2025  
**Status**: Ready for Production Deployment

This guide provides step-by-step instructions for deploying CyberSoluce Asset Manager to production.

---

## 📋 Pre-Deployment Checklist

### Prerequisites
- [x] Node.js 18+ installed
- [x] npm 9+ installed
- [x] Git repository cloned
- [ ] Supabase project created
- [ ] Netlify/Vercel account created
- [ ] Domain name ready (optional)

---

## Step 1: Supabase Database Setup (15 minutes)

### 1.1 Access Supabase Project

1. Go to your Supabase project dashboard:
   - **Project URL**: `https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc`
   - **Project Reference**: `uvdrwbmhmtgacwzujfzc`
   - **Supabase URL**: `https://uvdrwbmhmtgacwzujfzc.supabase.co`

### 1.2 Apply Database Migrations

Navigate to SQL Editor: `https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/sql/new`

Apply migrations in **this exact order**:

#### Migration 1: Reports Table
```sql
-- File: supabase/migrations/20250801112702_cold_firefly.sql
-- Copy entire contents and run
```

#### Migration 2: Organizations Table
```sql
-- File: supabase/migrations/20250801114506_odd_flower.sql
-- Copy entire contents and run
```

#### Migration 3: All Feature Tables
```sql
-- File: supabase/migrations/20250125000000_dependency_manager_features.sql
-- Copy entire contents and run
```

### 1.3 Verify Migrations

Go to **Table Editor** and verify these tables exist:
- ✅ `assets`
- ✅ `risks`
- ✅ `mitigations`
- ✅ `dependencies`
- ✅ `organizations`
- ✅ `reports`
- ✅ `nist_assessments`
- ✅ `business_impacts`
- ✅ `frameworks`

### 1.4 Get Supabase Credentials

1. Go to **Settings** → **API**: `https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/settings/api`
2. Copy the **`anon` `public` key** (starts with `eyJ...`)
3. Note your **Project URL**: `https://uvdrwbmhmtgacwzujfzc.supabase.co`

**✅ Checkpoint**: Database ready, credentials obtained

---

## Step 2: Configure Supabase Authentication (10 minutes)

### 2.1 Set Site URL

1. Go to **Authentication** → **URL Configuration**: 
   `https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/auth/url-configuration`

2. Set **Site URL** to your production domain:
   - Example: `https://your-site-name.netlify.app`
   - Or: `https://yourdomain.com` (if using custom domain)

### 2.2 Add Redirect URLs

Add these redirect URLs (replace with your actual domain):
- `https://your-site-name.netlify.app/**`
- `https://your-site-name.netlify.app/auth/callback`
- `https://your-site-name.netlify.app/*`

### 2.3 Configure Email Provider (Optional but Recommended)

1. Go to **Authentication** → **Settings**
2. Configure SMTP settings or use Supabase's built-in email service
3. Test email delivery

**✅ Checkpoint**: Authentication configured

---

## Step 3: Deploy to Netlify (15 minutes)

### Option A: Via Netlify Dashboard (Recommended)

#### 3.1 Connect Repository

1. Go to: `https://app.netlify.com`
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your Git provider (GitHub/GitLab/Bitbucket)
4. Select `CyberSoluce-AssetManager` repository

#### 3.2 Configure Build Settings

Netlify should auto-detect from `netlify.toml`:
- **Build command**: `npm ci --include=dev && npm run build`
- **Publish directory**: `dist`
- **Node version**: `20`

If not auto-detected, set manually:
- Build command: `npm ci --include=dev && npm run build`
- Publish directory: `dist`

#### 3.3 Set Environment Variables

Go to **Site settings** → **Environment variables** → **Add variable**

Add these **required** variables:

```bash
VITE_SUPABASE_URL=https://uvdrwbmhmtgacwzujfzc.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-from-step-1.4
VITE_APP_ENV=production
VITE_DEBUG_MODE=false
VITE_ENABLE_ERROR_REPORTING=true
```

**Optional** variables (for monitoring):
```bash
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

#### 3.4 Deploy

1. Click **"Deploy site"**
2. Wait for build to complete (~2-3 minutes)
3. Note your site URL: `https://your-site-name.netlify.app`

**✅ Checkpoint**: Site deployed successfully

### Option B: Via Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Navigate to project
cd C:\Users\facel\Downloads\GitHub\CyberSoluce-AssetManager

# Initialize Netlify (first time only)
netlify init

# Set environment variables
netlify env:set VITE_SUPABASE_URL "https://uvdrwbmhmtgacwzujfzc.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "your-anon-key-here"
netlify env:set VITE_APP_ENV "production"
netlify env:set VITE_DEBUG_MODE "false"
netlify env:set VITE_ENABLE_ERROR_REPORTING "true"

# Deploy to production
netlify deploy --prod
```

---

## Step 4: Configure Custom Domain (Optional - 10 minutes)

### 4.1 Add Domain in Netlify

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain name (e.g., `cybersoluce.com`)

### 4.2 Configure DNS

Add these DNS records in your domain registrar:

**For apex domain** (e.g., `cybersoluce.com`):
- Type: `A`
- Name: `@`
- Value: Netlify IP (provided in Netlify dashboard)

**For www subdomain** (e.g., `www.cybersoluce.com`):
- Type: `CNAME`
- Name: `www`
- Value: `your-site-name.netlify.app`

### 4.3 Update Supabase Redirect URLs

After DNS propagates, update Supabase redirect URLs to include your custom domain:
- `https://cybersoluce.com/**`
- `https://cybersoluce.com/auth/callback`
- `https://www.cybersoluce.com/**`

**✅ Checkpoint**: Custom domain configured (if applicable)

---

## Step 5: Test Deployment (15 minutes)

### 5.1 Basic Functionality Tests

1. **Visit Production Site**
   - Go to: `https://your-site-name.netlify.app`
   - Verify site loads without errors
   - Check browser console for errors

2. **Test Authentication**
   - Click "Sign Up" or "Sign In"
   - Create a test account
   - Verify email confirmation (if enabled)
   - Sign in successfully

3. **Test Core Features**
   - Navigate to Dashboard
   - Create an asset
   - Verify asset appears in list
   - Check database connection (verify in Supabase Table Editor)

### 5.2 Free Tools Verification

1. Navigate to `/tools/`
2. Verify landing page loads
3. Test each tool:
   - `/tools/DataInventoryTool.html`
   - `/tools/InformationAssetRegister.html`
   - `/tools/VendorRegisterManager.html`
4. Verify dark mode works
5. Test export functionality

### 5.3 Demo Scenarios

1. Navigate to `/dashboard/demo-scenarios`
2. Test loading a demo scenario
3. Verify demo data loads correctly

**✅ Checkpoint**: All features working

---

## Step 6: Post-Deployment Configuration (30 minutes)

### 6.1 Set Up Monitoring (Optional but Recommended)

#### Sentry Error Tracking

1. Create account at `https://sentry.io`
2. Create a new project (React)
3. Copy DSN
4. Add to Netlify environment variables:
   ```bash
   VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id
   ```
5. Redeploy site

#### Google Analytics

1. Create account at `https://analytics.google.com`
2. Create a new property
3. Copy Measurement ID (format: `G-XXXXXXXXXX`)
4. Add to Netlify environment variables:
   ```bash
   VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
   ```
5. Redeploy site

### 6.2 Set Up Uptime Monitoring

Recommended services:
- **UptimeRobot**: `https://uptimerobot.com` (free tier available)
- **Pingdom**: `https://pingdom.com`
- **StatusCake**: `https://statuscake.com`

Configure to monitor:
- Main site URL
- API endpoints (if any)
- Set up alerts for downtime

### 6.3 Configure Automated Backups

1. Go to Supabase Dashboard → **Settings** → **Database**
2. Enable **Daily Backups**
3. Set retention policy (recommended: 30 days)
4. Test backup restoration process

**✅ Checkpoint**: Monitoring and backups configured

---

## Step 7: Security Hardening (20 minutes)

### 7.1 Review RLS Policies

1. Go to Supabase Dashboard → **Authentication** → **Policies**
2. Review Row Level Security policies on all tables
3. Verify organization-based access control works
4. Test with multiple user accounts

### 7.2 Security Headers Verification

Verify security headers are working:
1. Visit production site
2. Open browser DevTools → Network tab
3. Check response headers for:
   - `X-Frame-Options: DENY`
   - `X-Content-Type-Options: nosniff`
   - `Strict-Transport-Security`
   - `Content-Security-Policy`

### 7.3 Rate Limiting

Configure rate limiting in Supabase (if available):
1. Go to **Settings** → **API**
2. Configure rate limits
3. Set up DDoS protection (handled by Netlify)

**✅ Checkpoint**: Security hardened

---

## 🎯 Success Criteria

Your deployment is successful when:

- ✅ Site is accessible at production URL
- ✅ Authentication (sign up/sign in) works
- ✅ Can create and view assets
- ✅ Database connection verified (data persists)
- ✅ Free tools accessible at `/tools/`
- ✅ Demo scenarios work
- ✅ No console errors in browser
- ✅ Build completes successfully
- ✅ Security headers present
- ✅ HTTPS enabled (automatic with Netlify)

---

## 🔧 Troubleshooting

### Build Fails

**Symptoms**: Build fails in Netlify

**Solutions**:
1. Check Node.js version (must be 18+)
2. Verify environment variables are set correctly
3. Check build logs in Netlify dashboard
4. Try building locally: `npm run build`
5. Clear build cache in Netlify

### Database Connection Issues

**Symptoms**: App can't connect to Supabase

**Solutions**:
1. Verify `VITE_SUPABASE_URL` matches: `https://uvdrwbmhmtgacwzujfzc.supabase.co`
2. Check `VITE_SUPABASE_ANON_KEY` is correct
3. Verify migrations were applied
4. Check Supabase project is active
5. Verify RLS policies allow access

### Authentication Not Working

**Symptoms**: Can't sign up/sign in

**Solutions**:
1. Check redirect URLs in Supabase dashboard
2. Verify Site URL matches your Netlify domain
3. Check email configuration if using email auth
4. Verify RLS policies are enabled
5. Check browser console for errors

### 404 Errors on Routes

**Symptoms**: Routes return 404

**Solutions**:
1. Verify `netlify.toml` redirect rules are correct
2. Check SPA routing is configured (catch-all redirect)
3. Verify `dist/index.html` exists
4. Clear Netlify cache

### Free Tools Not Loading

**Symptoms**: `/tools/` returns 404

**Solutions**:
1. Verify `public/tools/` directory exists
2. Check files are copied to `dist/tools/` during build
3. Verify file paths are correct
4. Check browser console for errors

---

## 📊 Quick Reference

### Supabase Links
- **Dashboard**: `https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc`
- **SQL Editor**: `https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/sql/new`
- **API Settings**: `https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/settings/api`
- **Auth Settings**: `https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/auth/url-configuration`
- **Table Editor**: `https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/editor`

### Netlify Links
- **Dashboard**: `https://app.netlify.com`
- **Documentation**: `https://docs.netlify.com`

### Project Files
- **Migration Files**: `supabase/migrations/`
- **Deployment Config**: `netlify.toml`
- **Build Config**: `vite.config.ts`
- **Environment Template**: `.env.example`

---

## 📝 Post-Launch Checklist

### First Day
- [ ] Monitor error logs in Netlify dashboard
- [ ] Test all major user flows
- [ ] Verify authentication works
- [ ] Check database connections
- [ ] Monitor performance metrics

### First Week
- [ ] Set up error tracking (Sentry)
- [ ] Run Lighthouse audit
- [ ] Monitor performance metrics
- [ ] Set up uptime monitoring
- [ ] Review security logs

### First Month
- [ ] Perform security audit
- [ ] Optimize based on usage patterns
- [ ] Set up automated backups
- [ ] Document operational procedures
- [ ] Configure monitoring dashboards

---

## 🎉 Deployment Complete!

Your CyberSoluce Asset Manager is now live in production!

**Next Steps**:
1. Share the URL with your team
2. Set up monitoring (Sentry, Analytics)
3. Configure custom domain (if applicable)
4. Set up CI/CD for automatic deployments
5. Document deployment process for team

---

**Estimated Total Time**: 1.5 - 2 hours  
**Status**: Ready to deploy! 🚀  
**Last Updated**: November 2025

