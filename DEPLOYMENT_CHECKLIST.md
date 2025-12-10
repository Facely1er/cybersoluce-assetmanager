# 🚀 CyberSoluce Production Deployment Checklist

**Status**: Ready for deployment  
**Last Updated**: December 2025

---

## ✅ Pre-Deployment Verification

### Code Readiness
- [x] Build configuration optimized
- [x] Zero build warnings
- [x] TypeScript compilation passes
- [x] Security headers configured
- [x] Error handling comprehensive
- [x] Environment variables documented
- [x] Meta tags updated with production domain
- [x] robots.txt configured

### Files Ready
- [x] `.env.example` created
- [x] `netlify.toml` configured
- [x] Migration files ready
- [x] Build scripts tested

---

## 🔴 Critical Steps (Must Complete Before Launch)

### Step 1: Supabase Database Setup (15 minutes)

#### 1.1 Access Supabase Project
- [ ] Go to: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc
- [ ] Verify project is active
- [ ] Note project URL: `https://uvdrwbmhmtgacwzujfzc.supabase.co`

#### 1.2 Apply Database Migrations
- [ ] Go to SQL Editor: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/sql/new
- [ ] Apply migrations in this order:

**Migration 1: Reports Table**
```sql
-- File: supabase/migrations/20250801112702_cold_firefly.sql
-- Run this first
```

**Migration 2: Organizations**
```sql
-- File: supabase/migrations/20250801114506_odd_flower.sql
-- Run this second
```

**Migration 3: Core Features**
```sql
-- File: supabase/migrations/20250125000000_dependency_manager_features.sql
-- Run this third (contains all feature tables)
```

**Additional Migrations (if needed):**
- [ ] `20250101000000_create_assets_table.sql`
- [ ] `20250115000000_create_signal_history.sql`
- [ ] `20250130000000_create_feedback_submissions.sql`
- [ ] `20250130000001_fix_feedback_linter_issues.sql`

#### 1.3 Verify Database Setup
- [ ] Check Table Editor: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/editor
- [ ] Verify all tables exist:
  - [ ] `assets`
  - [ ] `organizations`
  - [ ] `reports`
  - [ ] `risks`
  - [ ] `mitigations`
  - [ ] `dependencies`
  - [ ] `bia_functions`
  - [ ] `framework_implementations`
  - [ ] `feedback_submissions`
- [ ] Verify RLS policies are enabled on all tables
- [ ] Test that authenticated users can access their data

#### 1.4 Get Supabase Credentials
- [ ] Go to: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/settings/api
- [ ] Copy the `anon` `public` key
- [ ] Save for Step 2

---

### Step 2: Environment Variables Configuration (10 minutes)

#### 2.1 Local Development (Optional)
- [ ] Copy `.env.example` to `.env.local`
- [ ] Update with your local Supabase credentials (if using local Supabase)

#### 2.2 Production Environment Variables (Netlify/Vercel)
- [ ] Go to deployment platform dashboard
- [ ] Navigate to: Site Settings → Environment Variables
- [ ] Add the following variables:

**Required Variables:**
```
VITE_SUPABASE_URL=https://uvdrwbmhmtgacwzujfzc.supabase.co
VITE_SUPABASE_ANON_KEY=[paste-anon-key-from-step-1.4]
VITE_APP_ENV=production
VITE_DEBUG_MODE=false
VITE_ENABLE_ERROR_REPORTING=true
```

**Optional Variables (if using):**
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

**External Services (if using):**
```
VITE_NMAP_SCANNER_URL=https://nmap-scanner.your-domain.com/api
VITE_PROMETHEUS_URL=https://prometheus.your-domain.com/api/v1
```

- [ ] Verify all variables are set correctly
- [ ] Note: Variables are case-sensitive

---

### Step 3: Deploy to Netlify/Vercel (15 minutes)

#### 3.1 Connect Repository
- [ ] Go to: https://app.netlify.com (or Vercel)
- [ ] Click "Add new site" → "Import an existing project"
- [ ] Connect Git repository: `CyberSoluce-AssetManager`
- [ ] Select branch: `main` (or `master`)

#### 3.2 Configure Build Settings
- [ ] Build command: `npm ci --include=dev && npm run build` (auto-detected from netlify.toml)
- [ ] Publish directory: `dist` (auto-detected)
- [ ] Node version: `20` (auto-detected)
- [ ] Verify settings match `netlify.toml`

#### 3.3 Set Environment Variables
- [ ] Add all environment variables from Step 2.2
- [ ] Verify variables are set for "Production" context
- [ ] Save settings

#### 3.4 Deploy
- [ ] Click "Deploy site"
- [ ] Wait for build to complete (~2-3 minutes)
- [ ] Verify build succeeds (check build logs)
- [ ] Note the deployment URL: `https://your-site-name.netlify.app`

---

### Step 4: Configure Supabase Authentication (10 minutes)

#### 4.1 Configure Redirect URLs
- [ ] Go to: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/auth/url-configuration
- [ ] Set **Site URL**: `https://your-site-name.netlify.app` (from Step 3.4)
- [ ] Add **Redirect URLs**:
  ```
  https://your-site-name.netlify.app/**
  https://your-site-name.netlify.app/auth/callback
  https://your-site-name.netlify.app/*
  ```
- [ ] Save changes

#### 4.2 Configure Email Provider
- [ ] Go to: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/auth/providers
- [ ] Enable Email provider (if not already enabled)
- [ ] Configure SMTP settings (or use Supabase's built-in email service)
- [ ] Test email delivery

#### 4.3 Configure Email Templates
- [ ] Go to: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/auth/templates
- [ ] Customize email templates:
  - [ ] Confirm signup
  - [ ] Reset password
  - [ ] Magic link
  - [ ] Change email address
- [ ] Add branding to emails
- [ ] Test email templates

---

### Step 5: Test Deployment (15 minutes)

#### 5.1 Basic Functionality
- [ ] Visit production URL: `https://your-site-name.netlify.app`
- [ ] Verify site loads without errors
- [ ] Check browser console for errors
- [ ] Verify HTTPS is enabled (SSL certificate active)

#### 5.2 Authentication Flow
- [ ] Test user signup
- [ ] Verify email confirmation works
- [ ] Test user sign in
- [ ] Test password reset
- [ ] Verify session persistence

#### 5.3 Core Features
- [ ] Create a test asset
- [ ] Verify data persists in database
- [ ] Test asset filtering and search
- [ ] Test free tools at `/tools/`
- [ ] Verify navigation works
- [ ] Test dark mode toggle

#### 5.4 Database Connection
- [ ] Verify assets are saved to Supabase
- [ ] Check Table Editor to see test data
- [ ] Verify RLS policies work (users can only see their data)

#### 5.5 Error Handling
- [ ] Test error boundaries
- [ ] Verify error messages are user-friendly
- [ ] Check error reporting (if Sentry configured)

---

## 🟡 Important Steps (Complete Within First Week)

### Step 6: Security Hardening
- [ ] Review RLS policies in Supabase
- [ ] Test organization-based access control
- [ ] Verify CORS settings in Supabase
- [ ] Test CSP headers (check browser console)
- [ ] Review security headers in Netlify
- [ ] Set up rate limiting (if available)

### Step 7: Monitoring & Observability
- [ ] Set up Sentry error tracking (optional)
- [ ] Configure Google Analytics (optional)
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure log aggregation
- [ ] Set up alerts for critical errors

### Step 8: Database Operations
- [ ] Configure automated backups in Supabase
- [ ] Set backup retention policy
- [ ] Test backup restoration process
- [ ] Set up database performance monitoring
- [ ] Configure alerts for slow queries

---

## 🟢 Nice to Have (Post-Launch)

### Step 9: Performance Optimization
- [ ] Run Lighthouse audit
- [ ] Optimize Core Web Vitals
- [ ] Review bundle sizes
- [ ] Implement lazy loading if needed
- [ ] Optimize images

### Step 10: Documentation & Support
- [ ] Create user documentation
- [ ] Set up FAQ page
- [ ] Create support email/chat
- [ ] Set up user feedback mechanism

---

## 📋 Quick Reference

### Supabase Links
- **Dashboard**: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc
- **SQL Editor**: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/sql/new
- **API Settings**: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/settings/api
- **Auth Settings**: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/auth/url-configuration
- **Table Editor**: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/editor

### Deployment Platform
- **Netlify Dashboard**: https://app.netlify.com
- **Vercel Dashboard**: https://vercel.com/dashboard

### Project Files
- **Migration Files**: `supabase/migrations/`
- **Deployment Config**: `netlify.toml`
- **Build Config**: `vite.config.ts`
- **Environment Template**: `.env.example`

---

## ✅ Success Criteria

Deployment is successful when:
1. ✅ Site is accessible at production URL
2. ✅ Authentication (sign up/sign in) works
3. ✅ Can create and view assets
4. ✅ Database connection verified
5. ✅ Free tools accessible at `/tools/`
6. ✅ No console errors in browser
7. ✅ Build completes successfully
8. ✅ SSL certificate active
9. ✅ All environment variables set
10. ✅ Email delivery works

---

## 🆘 Troubleshooting

### Build Fails
- Check build logs in Netlify/Vercel
- Verify Node version is 20
- Check environment variables are set
- Verify `package.json` dependencies

### Authentication Not Working
- Verify Supabase redirect URLs are set correctly
- Check environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- Verify email provider is enabled
- Check Supabase project is active

### Database Connection Issues
- Verify migrations were applied successfully
- Check RLS policies are enabled
- Verify Supabase project URL is correct
- Check network connectivity

### Environment Variables Not Working
- Verify variables start with `VITE_`
- Check variables are set for correct context (production)
- Restart deployment after adding variables
- Verify no typos in variable names

---

**Last Updated**: December 2025  
**Status**: Ready for deployment - follow checklist above

