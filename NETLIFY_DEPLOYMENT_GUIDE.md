# 🚀 Complete Netlify Deployment Guide

**Status**: Ready to deploy  
**Method**: Dashboard deployment (recommended)

---

## 📋 Prerequisites

- ✅ Code is in a GitHub repository
- ✅ `netlify.toml` configured
- ✅ Supabase project ready
- ✅ Environment variables ready

---

## 🎯 Method 1: Deploy via Netlify Dashboard (Recommended)

### Step 1: Go to Netlify Dashboard
1. Visit: https://app.netlify.com
2. Sign in with your GitHub account (or create account)

### Step 2: Add New Site
1. Click **"Add new site"** button (top right)
2. Select **"Import an existing project"**
3. Choose **GitHub** as your Git provider
4. Authorize Netlify if prompted
5. Select repository: `cybersoluce-assetmanager` (or `CyberSoluce-AssetManager`)

### Step 3: Configure Build Settings
Netlify should auto-detect from `netlify.toml`:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: Auto-detected

**Verify these settings** match your `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"
```

### Step 4: Set Environment Variables ⚠️ CRITICAL
**Before clicking "Deploy site"**, set environment variables:

1. In the deployment setup, click **"Show advanced"**
2. Click **"New variable"** and add each:

| Variable Name | Value | Where to Get |
|--------------|-------|--------------|
| `VITE_SUPABASE_URL` | `https://uvdrwbmhmtgacwzujfzc.supabase.co` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | `[Your anon key]` | Supabase Dashboard → Settings → API → anon public |
| `VITE_APP_ENV` | `production` | Set to production |
| `VITE_DEBUG_MODE` | `false` | Disable debug in production |
| `VITE_ENABLE_ERROR_REPORTING` | `true` | Enable error tracking |

**Or set after deployment:**
1. Go to **Site settings** → **Environment variables**
2. Add each variable
3. Trigger a new deploy

### Step 5: Deploy!
1. Click **"Deploy site"**
2. Watch the build logs (takes ~2-3 minutes)
3. ✅ Your site will be live at: `https://your-site-name.netlify.app`

---

## 🎯 Method 2: Deploy via Netlify CLI

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Login to Netlify
```bash
netlify login
```
This opens your browser to authorize.

### Step 3: Initialize Site (First Time Only)
```bash
cd C:\Users\facel\Downloads\GitHub\CyberSoluce-AssetManager
netlify init
```

Follow prompts:
- **Create & configure a new site**: Yes
- **Team**: Select your team
- **Site name**: `cybersoluce-assetmanager` (or auto-generated)
- **Build command**: `npm run build` (or press Enter to use default)
- **Directory to deploy**: `dist` (or press Enter to use default)

### Step 4: Set Environment Variables
```bash
netlify env:set VITE_SUPABASE_URL "https://uvdrwbmhmtgacwzujfzc.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "your-anon-key-here"
netlify env:set VITE_APP_ENV "production"
netlify env:set VITE_DEBUG_MODE "false"
netlify env:set VITE_ENABLE_ERROR_REPORTING "true"
```

### Step 5: Deploy
```bash
netlify deploy --prod
```

For preview deployments (not production):
```bash
netlify deploy
```

---

## ✅ After Deployment

### Step 1: Configure Supabase Authentication URLs

1. **Get your Netlify site URL**:
   - Format: `https://your-site-name.netlify.app`
   - Found in Netlify Dashboard → Site overview

2. **Configure Supabase**:
   - Go to: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/auth/url-configuration
   - Set **Site URL**: `https://your-site-name.netlify.app`
   - Add **Redirect URLs**:
     ```
     https://your-site-name.netlify.app/**
     https://your-site-name.netlify.app/auth/callback
     https://your-site-name.netlify.app/*
     ```

### Step 2: Test Your Deployment

1. **Visit your site**: `https://your-site-name.netlify.app`
2. **Test authentication**:
   - Sign up a new account
   - Sign in
   - Sign out
3. **Test features**:
   - Create an asset
   - View dashboard
   - Test all major features

### Step 3: Verify Build Logs

1. Go to Netlify Dashboard → **Deploys**
2. Click on your latest deploy
3. Check for any warnings or errors
4. Verify build completed successfully

---

## 🔄 Continuous Deployment

Once connected to GitHub, Netlify automatically:
- ✅ Deploys on every push to `main` branch
- ✅ Creates preview deployments for pull requests
- ✅ Shows build status in GitHub

**To configure**:
1. Netlify Dashboard → Site settings → **Build & deploy**
2. **Continuous Deployment** should be enabled
3. **Production branch**: `main` (or your default branch)
4. **Build command**: `npm run build`
5. **Publish directory**: `dist`

---

## 🛠️ Troubleshooting

### Build Fails: "vite: not found"
**Solution**: Ensure `netlify.toml` has:
```toml
[build]
  command = "npm run build"
```
And `NODE_ENV` is NOT set to `production` in build environment (dev dependencies needed).

### Build Fails: Environment Variables Missing
**Solution**: 
1. Go to Site settings → Environment variables
2. Add all required `VITE_*` variables
3. Trigger a new deploy

### Authentication Not Working
**Solution**:
1. Verify Supabase redirect URLs are set correctly
2. Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
3. Check browser console for errors

### Site Shows "Page Not Found"
**Solution**:
1. Verify `publish = "dist"` in `netlify.toml`
2. Check `dist` folder exists after build
3. Verify `_redirects` file in `public/` folder (if using SPA routing)

---

## 📋 Quick Reference

### Environment Variables Checklist
- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] `VITE_APP_ENV`
- [ ] `VITE_DEBUG_MODE`
- [ ] `VITE_ENABLE_ERROR_REPORTING`

### Post-Deployment Checklist
- [ ] Site is accessible
- [ ] Supabase auth URLs configured
- [ ] Authentication works
- [ ] Database connections work
- [ ] All features functional
- [ ] Build logs show no errors

---

## 🎉 You're Done!

Your CyberSoluce Asset Manager is now live on Netlify!

**Next Steps**:
- Monitor deployments in Netlify Dashboard
- Set up custom domain (optional)
- Configure analytics (optional)
- Set up form handling (if needed)

---

**Need Help?**
- Netlify Docs: https://docs.netlify.com
- Netlify Support: https://www.netlify.com/support

