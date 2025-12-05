# Deployment Troubleshooting Guide

## Common Deployment Issues

### 1. ❌ Missing Environment Variables

**Symptoms:**
- Blank page
- Console errors about Supabase
- "Cannot read properties" errors

**Solution:**
1. Go to Netlify Dashboard → Your Site → Site Settings → Environment Variables
2. Add these variables:
   - `VITE_SUPABASE_URL` = Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key
3. **Redeploy** after adding variables (trigger a new deployment)

**Note:** The app will work in demo mode without these, but features requiring database won't work.

---

### 2. ❌ Build Failures

**Symptoms:**
- Build fails in Netlify
- "vite is not recognized" error
- Missing dependencies

**Check:**
1. Verify `netlify.toml` has: `command = "npm ci --include=dev && npm run build"`
2. Check `package.json` has all required dependencies
3. Verify Node version (should be 20)

**Solution:**
- Ensure `netlify.toml` uses `npm ci --include=dev` (not just `npm install`)
- Check Netlify build logs for specific errors

---

### 3. ❌ Blank Page / JavaScript Errors

**Symptoms:**
- Page loads but shows blank
- Console shows bundle loading errors
- `useLayoutEffect` or property access errors

**Check:**
1. Open browser DevTools → Console
2. Check Network tab for failed resource loads
3. Look for specific error messages

**Common Fixes:**
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)
- Check if React is in main bundle (not vendor chunk)
- Verify `vite.config.ts` has React bundling fixes

---

### 4. ❌ Routing Issues (404 on Refresh)

**Symptoms:**
- Direct URLs return 404
- Navigation works but refresh breaks

**Solution:**
- Verify `netlify.toml` has SPA redirect rule:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### 5. ❌ CSP (Content Security Policy) Errors

**Symptoms:**
- Console shows CSP violations
- Resources blocked by CSP

**Solution:**
- Check `index.html` CSP meta tag
- Verify `netlify.toml` CSP headers match
- Ensure Supabase domains are allowed: `https://*.supabase.co`

---

## Step-by-Step Debugging

### Step 1: Check Netlify Build Logs
1. Go to Netlify Dashboard → Deploys
2. Click on latest deploy
3. Check "Build log" for errors
4. Look for:
   - Missing dependencies
   - Build command failures
   - Environment variable warnings

### Step 2: Check Browser Console
1. Open deployed site
2. Open DevTools (F12)
3. Check Console tab for errors
4. Check Network tab for failed requests

### Step 3: Verify Environment Variables
1. Netlify Dashboard → Site Settings → Environment Variables
2. Ensure these are set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Values should NOT have quotes around them
4. Values should be actual URLs/keys, not placeholders

### Step 4: Test Local Build
```bash
npm ci --include=dev
npm run build
npm run preview
```
If local build fails, fix those issues first.

### Step 5: Check Bundle Structure
After build, check `dist/` folder:
- Should contain `index.html`
- Should contain `js/` folder with bundles
- Main bundle should include React (check file size)

---

## Quick Fixes

### Fix 1: Force Redeploy
1. Netlify Dashboard → Deploys
2. Click "Trigger deploy" → "Clear cache and deploy site"

### Fix 2: Reset Environment Variables
1. Remove all environment variables
2. Add them back one by one
3. Redeploy

### Fix 3: Check Build Command
Verify `netlify.toml`:
```toml
[build]
  command = "npm ci --include=dev && npm run build"
  publish = "dist"
```

### Fix 4: Verify Node Version
In `netlify.toml`:
```toml
[build.environment]
  NODE_VERSION = "20"
```

---

## What to Check First

1. ✅ **Environment Variables** - Most common issue
2. ✅ **Build Logs** - Check for specific errors
3. ✅ **Browser Console** - Check runtime errors
4. ✅ **Local Build** - Test if build works locally
5. ✅ **Bundle Files** - Verify dist folder structure

---

## Getting Help

If deployment still fails:

1. **Share Build Logs**: Copy error from Netlify build log
2. **Share Console Errors**: Copy errors from browser console
3. **Share Environment Setup**: Which variables are set (without values)
4. **Share netlify.toml**: Current configuration

---

## Expected Behavior

✅ **Working Deployment:**
- Site loads without errors
- No console errors (or only expected warnings)
- Navigation works
- Refresh works (no 404)
- Features load (even if in demo mode without Supabase)

❌ **Broken Deployment:**
- Blank page
- Console errors
- Build failures
- 404 on refresh
- Resources fail to load

