# Deploy CyberSoluce to Netlify

**Date**: December 2025  
**Estimated Time**: 15 minutes

## Prerequisites

- ✅ Netlify account (sign up at https://app.netlify.com)
- ✅ Git repository access
- ✅ Environment variables ready (from Step 2)

## Step-by-Step Deployment

### Option 1: Deploy via Netlify Dashboard (Recommended)

#### 1. Connect Repository

1. Go to: https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose your Git provider (GitHub, GitLab, Bitbucket)
4. Select repository: `CyberSoluce-AssetManager` (or your repo name)
5. Select branch: `main` (or `master`)

#### 2. Configure Build Settings

Netlify should auto-detect settings from `netlify.toml`, but verify:

- **Build command**: `npm ci --include=dev && npm run build`
- **Publish directory**: `dist`
- **Node version**: `20`

If auto-detection doesn't work, manually set:
- Base directory: `/` (root)
- Build command: `npm ci --include=dev && npm run build`
- Publish directory: `dist`

#### 3. Set Environment Variables

Before deploying, add environment variables:

1. Click **"Show advanced"** → **"New variable"**
2. Add each variable:

**Required:**
```
VITE_SUPABASE_URL = https://dfklqsdfycwjlcasfciu.supabase.co
VITE_SUPABASE_ANON_KEY = [your-anon-key-here]
VITE_APP_ENV = production
VITE_DEBUG_MODE = false
VITE_ENABLE_ERROR_REPORTING = true
```

**Optional (if using):**
```
VITE_STRIPE_PUBLISHABLE_KEY = pk_live_...
VITE_SENTRY_DSN = https://...
VITE_GOOGLE_ANALYTICS_ID = G-...
```

3. Verify all variables are set
4. Click **"Deploy site"**

#### 4. Wait for Deployment

- Build typically takes 2-3 minutes
- Watch build logs for any errors
- Deployment URL will be: `https://[random-name].netlify.app`

#### 5. Note Your Deployment URL

After deployment completes:
- Copy your deployment URL
- You'll need this for Supabase auth configuration (Step 4)

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site (if first time)
netlify init

# Deploy
netlify deploy --prod

# Or build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### Option 3: Deploy via Git Push (CI/CD)

1. Connect repository to Netlify (as in Option 1)
2. Set environment variables in Netlify dashboard
3. Push to `main` branch
4. Netlify will automatically deploy

## Post-Deployment

### Verify Deployment

1. Visit your deployment URL
2. Check browser console for errors
3. Verify site loads correctly
4. Test navigation

### Custom Domain (Optional)

1. Go to: Site Settings → Domain management
2. Click "Add custom domain"
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic)

## Troubleshooting

### Build Fails

**Error: Node version mismatch**
- Solution: Set NODE_VERSION = "20" in environment variables

**Error: Missing dependencies**
- Solution: Ensure `npm ci --include=dev` is used (not `npm install`)

**Error: Build command fails**
- Solution: Check build logs, verify `package.json` scripts

### Environment Variables Not Working

- Verify variables start with `VITE_`
- Check for typos in variable names
- Restart deployment after adding variables
- Verify variables are set for "Production" context

### Site Not Loading

- Check build succeeded
- Verify `dist` directory exists
- Check Netlify build logs
- Verify `netlify.toml` redirect rules

## Next Steps

After successful deployment:

1. ✅ Note your deployment URL
2. ✅ Proceed to Step 4: Configure Supabase Authentication
3. ✅ Test authentication flow
4. ✅ Verify all features work

## Quick Reference

- **Netlify Dashboard**: https://app.netlify.com
- **Build Logs**: Site → Deploys → [deployment] → Build log
- **Environment Variables**: Site Settings → Environment variables
- **Domain Settings**: Site Settings → Domain management

---

**Last Updated**: December 2025

