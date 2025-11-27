# 🚀 Deploy CyberSoluce Asset Manager - Quick Start Guide

**Date**: November 2025  
**Status**: Ready to Deploy!

---

## ⚡ Quick Deployment (Choose One Method)

### Method 1: Netlify Dashboard (Recommended - Easiest)

**Time**: 10 minutes

1. **Go to Netlify Dashboard**
   - Visit: https://app.netlify.com
   - Sign in or create account

2. **Connect Repository**
   - Click **"Add new site"** → **"Import an existing project"**
   - Connect GitHub/GitLab/Bitbucket
   - Select `CyberSoluce-AssetManager` repository

3. **Build Settings** (Auto-detected from `netlify.toml`)
   - Build command: `npm ci --include=dev && npm run build`
   - Publish directory: `dist`
   - ✅ These should auto-detect!

4. **Set Environment Variables**
   - Go to **Site settings** → **Environment variables**
   - Add these variables:
   
   ```
   VITE_SUPABASE_URL=https://uvdrwbmhmtgacwzujfzc.supabase.co
   VITE_SUPABASE_ANON_KEY=[Get from Supabase Dashboard]
   VITE_APP_ENV=production
   VITE_DEBUG_MODE=false
   VITE_ENABLE_ERROR_REPORTING=true
   ```

5. **Deploy!**
   - Click **"Deploy site"**
   - Wait 2-3 minutes
   - Your site will be live! 🎉

---

### Method 2: Netlify CLI (If Already Logged In)

**Time**: 5 minutes

```bash
# 1. Login (if not already logged in)
netlify login

# 2. Initialize site (first time only)
netlify init

# 3. Set environment variables
netlify env:set VITE_SUPABASE_URL "https://uvdrwbmhmtgacwzujfzc.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "your-anon-key-here"
netlify env:set VITE_APP_ENV "production"
netlify env:set VITE_DEBUG_MODE "false"
netlify env:set VITE_ENABLE_ERROR_REPORTING "true"

# 4. Deploy to production
netlify deploy --prod
```

---

## 📋 Pre-Deployment Checklist

### Before Deploying:

- [ ] **Supabase Database Setup**
  - [ ] Applied all migrations (see below)
  - [ ] Got Supabase anon key
  - [ ] Verified database connection

- [ ] **Environment Variables Ready**
  - [ ] `VITE_SUPABASE_URL` (already known)
  - [ ] `VITE_SUPABASE_ANON_KEY` (need to get)

- [ ] **Build Tested Locally**
  - [x] ✅ Build successful (`npm run build` passed)

---

## 🗄️ Database Setup (Do This First!)

### Step 1: Apply Supabase Migrations

1. Go to Supabase SQL Editor:
   https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/sql/new

2. Apply migrations in **this exact order**:

   **Migration 1**: `20250101000000_create_assets_table.sql`
   - Copy entire file contents
   - Paste into SQL Editor
   - Click "Run"

   **Migration 2**: `20250801112702_cold_firefly.sql` (reports)
   - Copy entire file contents
   - Paste into SQL Editor
   - Click "Run"

   **Migration 3**: `20250801114506_odd_flower.sql` (organizations)
   - Copy entire file contents
   - Paste into SQL Editor
   - Click "Run"

   **Migration 4**: `20250125000000_dependency_manager_features.sql` (all features)
   - Copy entire file contents
   - Paste into SQL Editor
   - Click "Run"

3. **Verify Tables Created**:
   - Go to Table Editor
   - Verify these tables exist:
     - ✅ `assets`
     - ✅ `risks`
     - ✅ `mitigations`
     - ✅ `dependencies`
     - ✅ `organizations`
     - ✅ `reports`
     - ✅ `nist_assessments`
     - ✅ `business_impacts`
     - ✅ `frameworks`

### Step 2: Get Supabase Anon Key

1. Go to: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/settings/api
2. Copy the **`anon` `public` key** (starts with `eyJ...`)
3. Save it - you'll need it for Netlify environment variables

### Step 3: Configure Supabase Auth URLs

**After deployment**, update Supabase redirect URLs:

1. Go to: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/auth/url-configuration
2. Set **Site URL** to: `https://your-site-name.netlify.app`
3. Add redirect URLs:
   - `https://your-site-name.netlify.app/**`
   - `https://your-site-name.netlify.app/auth/callback`
   - `https://your-site-name.netlify.app/*`

---

## 🎯 Post-Deployment Steps

### 1. Test Your Site

- [ ] Visit production URL
- [ ] Test sign up/sign in
- [ ] Create a test asset
- [ ] Verify data persists
- [ ] Test free tools at `/tools/`

### 2. Configure Custom Domain (Optional)

- [ ] Add domain in Netlify dashboard
- [ ] Update DNS records
- [ ] Update Supabase redirect URLs

### 3. Set Up Monitoring (Recommended)

- [ ] Configure error tracking (Sentry)
- [ ] Set up uptime monitoring
- [ ] Configure analytics (Google Analytics)

---

## 🆘 Troubleshooting

### Build Fails
- Check Node.js version (must be 18+)
- Verify environment variables are set
- Check build logs in Netlify dashboard

### Database Connection Issues
- Verify `VITE_SUPABASE_URL` is correct
- Check `VITE_SUPABASE_ANON_KEY` is correct
- Ensure migrations were applied

### Authentication Not Working
- Check Supabase redirect URLs match Netlify domain
- Verify Site URL in Supabase matches production domain
- Check browser console for errors

---

## ✅ Success Criteria

Your deployment is successful when:

- ✅ Site is accessible at Netlify URL
- ✅ Authentication works (sign up/sign in)
- ✅ Can create and view assets
- ✅ Database connection verified
- ✅ Free tools accessible at `/tools/`
- ✅ No console errors

---

## 🎉 You're Ready!

**Next Step**: Choose your deployment method above and follow the steps!

**Estimated Time**: 15-20 minutes total (including database setup)

**Status**: ✅ Ready to deploy! 🚀

---

**Last Updated**: November 2025

