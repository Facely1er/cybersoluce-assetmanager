# Deploy CyberSoluce to Vercel

**Date**: December 2025  
**Estimated Time**: 15 minutes  
**Status**: ✅ Project deployed on Vercel

## Prerequisites

- ✅ Vercel account (sign up at https://vercel.com)
- ✅ Git repository access
- ✅ Environment variables ready

## Deployment Methods

### Option 1: Deploy via Vercel Dashboard (Recommended)

#### 1. Connect Repository

1. Go to: https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your Git repository:
   - Select your Git provider (GitHub, GitLab, Bitbucket)
   - Find and select `CyberSoluce-AssetManager` (or your repo name)
   - Click **"Import"**

#### 2. Configure Project Settings

Vercel should auto-detect settings, but verify:

**Framework Preset**: Vite (auto-detected)

**Build Settings**:
- **Root Directory**: `/` (or leave empty if root)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

**Node.js Version**: 20.x (set in environment variables if needed)

#### 3. Set Environment Variables

**Before deploying**, add environment variables:

1. In the project settings, go to **"Environment Variables"**
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

3. Select environment: **Production**, **Preview**, **Development** (or all)
4. Click **"Save"** for each variable

#### 4. Deploy

1. Click **"Deploy"**
2. Wait for build to complete (~2-3 minutes)
3. Watch build logs for any errors
4. Deployment URL will be: `https://your-project-name.vercel.app`

#### 5. Note Your Deployment URL

After deployment:
- Copy your deployment URL
- You'll need this for Supabase auth configuration

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (first time - will prompt for configuration)
vercel

# Deploy to production
vercel --prod

# Or build and deploy
npm run build
vercel --prod
```

### Option 3: Deploy via Git Push (CI/CD)

1. Connect repository to Vercel (as in Option 1)
2. Set environment variables in Vercel dashboard
3. Push to `main` branch
4. Vercel will automatically deploy

## Vercel Configuration File

Create `vercel.json` in project root (optional):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Post-Deployment

### Verify Deployment

1. Visit your deployment URL: `https://your-project.vercel.app`
2. Check browser console for errors
3. Verify site loads correctly
4. Test navigation

### Custom Domain (Optional)

1. Go to: Project Settings → Domains
2. Click **"Add Domain"**
3. Enter your domain name
4. Follow DNS configuration instructions
5. Wait for SSL certificate (automatic)

### Environment Variables

To update environment variables after deployment:

1. Go to: Project Settings → Environment Variables
2. Add, edit, or remove variables
3. **Redeploy** for changes to take effect:
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"

## Vercel-Specific Features

### Preview Deployments

Every push to a branch creates a preview deployment:
- Preview URL: `https://your-project-git-branch.vercel.app`
- Great for testing before production

### Analytics

Enable Vercel Analytics:
1. Go to: Project Settings → Analytics
2. Enable Web Analytics
3. Add to your code (if needed)

### Edge Functions

If you need serverless functions:
1. Create `api/` directory in project root
2. Add serverless functions
3. Deploy automatically

## Troubleshooting

### Build Fails

**Error: "Build command failed"**
- Solution: Check build logs
- Verify `package.json` has correct scripts
- Ensure Node version is 20

**Error: "Module not found"**
- Solution: Verify all dependencies in `package.json`
- Run `npm install` locally to test
- Check for missing peer dependencies

**Error: "Out of memory"**
- Solution: Increase Node.js memory limit
- Add to environment variables: `NODE_OPTIONS=--max-old-space-size=4096`

### Environment Variables Not Working

- Verify variables start with `VITE_`
- Check for typos in variable names
- Redeploy after adding variables
- Verify variables are set for correct environment (Production/Preview)

### Site Not Loading

- Check deployment succeeded
- Verify `dist` directory exists in build output
- Check Vercel build logs
- Verify `vercel.json` configuration (if using)

### Routing Issues (404 on refresh)

- Add `vercel.json` with rewrites (see above)
- Ensure SPA routing is configured
- Check that `index.html` is in `dist` directory

## Next Steps

After successful deployment:

1. ✅ Note your deployment URL
2. ✅ Proceed to Step 4: Configure Supabase Authentication
3. ✅ Test authentication flow
4. ✅ Verify all features work

## Quick Reference

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Build Logs**: Project → Deployments → [deployment] → Build Logs
- **Environment Variables**: Project Settings → Environment Variables
- **Domain Settings**: Project Settings → Domains
- **Documentation**: https://vercel.com/docs

---

**Last Updated**: December 2025

