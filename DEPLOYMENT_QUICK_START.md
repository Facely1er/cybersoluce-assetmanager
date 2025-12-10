# 🚀 CyberSoluce Quick Deployment Guide

**Date**: December 2025  
**Estimated Time**: 30-45 minutes

This is a condensed version of the full deployment checklist. For detailed steps, see [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md).

---

## Prerequisites

- ✅ Supabase project access: `uvdrwbmhmtgacwzujfzc`
- ✅ Netlify/Vercel account
- ✅ Git repository access

---

## Quick Steps

### 1. Apply Database Migrations (10 min)

1. Go to: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/sql/new
2. Apply these migrations in order:
   - `supabase/migrations/20250801112702_cold_firefly.sql`
   - `supabase/migrations/20250801114506_odd_flower.sql`
   - `supabase/migrations/20250125000000_dependency_manager_features.sql`
3. Verify in Table Editor that tables exist

### 2. Get Supabase Credentials (2 min)

1. Go to: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/settings/api
2. Copy the `anon` `public` key

### 3. Deploy to Netlify (10 min)

1. Go to: https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Build settings (auto-detected):
   - Build command: `npm ci --include=dev && npm run build`
   - Publish directory: `dist`
5. Add environment variables:
   ```
   VITE_SUPABASE_URL=https://uvdrwbmhmtgacwzujfzc.supabase.co
   VITE_SUPABASE_ANON_KEY=[paste-anon-key]
   VITE_APP_ENV=production
   VITE_DEBUG_MODE=false
   VITE_ENABLE_ERROR_REPORTING=true
   ```
6. Click "Deploy site"
7. Note your deployment URL: `https://your-site.netlify.app`

### 4. Configure Supabase Auth (5 min)

1. Go to: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/auth/url-configuration
2. Set **Site URL**: `https://your-site.netlify.app`
3. Add **Redirect URLs**:
   ```
   https://your-site.netlify.app/**
   https://your-site.netlify.app/auth/callback
   ```

### 5. Test Deployment (5 min)

1. Visit your production URL
2. Test user signup
3. Create a test asset
4. Verify data persists

---

## Environment Variables Reference

### Required
```bash
VITE_SUPABASE_URL=https://uvdrwbmhmtgacwzujfzc.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_APP_ENV=production
VITE_DEBUG_MODE=false
VITE_ENABLE_ERROR_REPORTING=true
```

### Optional
```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_SENTRY_DSN=https://...
VITE_GOOGLE_ANALYTICS_ID=G-...
```

---

## Quick Links

- **Supabase Dashboard**: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc
- **SQL Editor**: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/sql/new
- **API Settings**: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/settings/api
- **Auth Settings**: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/auth/url-configuration
- **Netlify Dashboard**: https://app.netlify.com

---

## Troubleshooting

### Build Fails
- Check Node version is 20
- Verify environment variables are set
- Check build logs in Netlify

### Auth Not Working
- Verify redirect URLs in Supabase
- Check environment variables
- Verify Supabase project is active

### Database Issues
- Verify migrations were applied
- Check RLS policies are enabled
- Verify Supabase URL is correct

---

## Success Criteria

✅ Site accessible at production URL  
✅ Authentication works (signup/signin)  
✅ Can create assets  
✅ Data persists in database  
✅ No console errors  

---

**For detailed instructions, see [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)**

**Last Updated**: December 2025

