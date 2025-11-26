# 🚀 Deploy via Netlify Dashboard (Recommended)

**Issue**: Local deployment has file lock conflicts.  
**Solution**: Deploy via Netlify Dashboard - builds on their servers (no file locks!)

---

## ✅ Quick Steps

### Step 1: Go to Netlify Dashboard
https://app.netlify.com

### Step 2: Add New Site
1. Click **"Add new site"**
2. Select **"Import an existing project"**
3. Connect your Git provider (GitHub/GitLab/Bitbucket)
4. Select repository: `CyberSoluce-AssetManager`

### Step 3: Configure Build Settings
Netlify will auto-detect:
- **Build command**: `npm install && npm run build`
- **Publish directory**: `dist`

**Verify these are correct**, or set manually if needed.

### Step 4: Set Environment Variables
**Before deploying**, go to **Site settings** → **Environment variables** → **Add variable**

Add these **5 variables**:

```
VITE_SUPABASE_URL = https://uvdrwbmhmtgacwzujfzc.supabase.co
```

```
VITE_SUPABASE_ANON_KEY = [Get from Supabase Dashboard: Settings → API → anon public key]
```

```
VITE_APP_ENV = production
```

```
VITE_DEBUG_MODE = false
```

```
VITE_ENABLE_ERROR_REPORTING = true
```

### Step 5: Deploy
1. Click **"Deploy site"**
2. Wait for build (~2-3 minutes)
3. Your site will be live at: `https://your-site-name.netlify.app`

---

## 📋 After Deployment

### Step 1: Get Your Site URL
After deployment, note your Netlify site URL (e.g., `https://cybersoluce-assetmanager.netlify.app`)

### Step 2: Configure Supabase Authentication
1. Go to: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/auth/url-configuration
2. Set **Site URL**: `https://your-site-name.netlify.app`
3. Add **Redirect URLs**:
   - `https://your-site-name.netlify.app/**`
   - `https://your-site-name.netlify.app/auth/callback`
   - `https://your-site-name.netlify.app/*`

### Step 3: Test Deployment
1. Visit your site
2. Test authentication (sign up/sign in)
3. Create a test asset
4. Verify everything works!

---

## ✅ Advantages of Dashboard Deployment

- ✅ Builds on Netlify servers (no file lock issues)
- ✅ Automatic deployments on Git push
- ✅ Build logs and error tracking
- ✅ Preview deployments for pull requests
- ✅ Easy rollback if needed

---

**Ready?** Go to https://app.netlify.com and follow the steps above!

