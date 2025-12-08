# Environment Configuration - Quick Setup

## ✅ Extracted from Your Connection String

**Project Reference**: `dfklqsdfycwjlcasfciu`  
**Supabase URL**: `https://dfklqsdfycwjlcasfciu.supabase.co`

## ⚠️ CRITICAL SECURITY WARNING

**DO NOT use the database connection string in the frontend!**

The connection string you provided contains a database password that should **ONLY** be used for:
- Server-side operations
- Database migrations
- Backend services

**For the frontend, you need:**
- Supabase URL (extracted above)
- Supabase Anon Key (get from dashboard - see below)

## Quick Setup Steps

### Step 1: Get Your Supabase Anon Key

1. Visit: https://app.supabase.com/project/dfklqsdfycwjlcasfciu/settings/api
2. Scroll to **"Project API keys"** section
3. Copy the **`anon` `public`** key (starts with `eyJ...`)

### Step 2: Create `.env.local` File

Create a file named `.env.local` in the project root with:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://dfklqsdfycwjlcasfciu.supabase.co
VITE_SUPABASE_ANON_KEY=paste-your-anon-key-here

# Application Settings
VITE_APP_ENV=development
VITE_DEBUG_MODE=true
VITE_CYBERSOLUCE_DEMO_ENABLED=true
VITE_HISTORY_STORE_MODE=local

# Optional: Feature Flags
VITE_ENABLE_ERROR_REPORTING=false
VITE_ENABLE_OFFLINE_MODE=false
VITE_ENABLE_ANALYTICS=false
```

### Step 3: Verify Setup

```bash
npm run dev
```

Check the browser console - you should see:
- ✅ "Supabase configured - database persistence enabled"

If you see "Running in demo mode", check your environment variables.

## Production Environment Variables

For deployment to Netlify/Vercel, set these:

```bash
VITE_SUPABASE_URL=https://dfklqsdfycwjlcasfciu.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_APP_ENV=production
VITE_DEBUG_MODE=false
VITE_ENABLE_ERROR_REPORTING=true
VITE_CYBERSOLUCE_DEMO_ENABLED=false
VITE_HISTORY_STORE_MODE=backend
```

## Database Connection String (Server-Side Only)

Your connection string:
```
postgresql://postgres:K1551d0ug0u@db.dfklqsdfycwjlcasfciu.supabase.co:5432/postgres
```

**Use this ONLY for:**
- Running migrations via Supabase SQL Editor
- Server-side database operations
- Backend services

**Never expose in:**
- Frontend code
- Browser-accessible environment variables
- Client-side JavaScript

## Useful Links

- **Project Dashboard**: https://app.supabase.com/project/dfklqsdfycwjlcasfciu
- **API Settings** (get anon key): https://app.supabase.com/project/dfklqsdfycwjlcasfciu/settings/api
- **SQL Editor** (run migrations): https://app.supabase.com/project/dfklqsdfycwjlcasfciu/sql/new
- **Auth Settings**: https://app.supabase.com/project/dfklqsdfycwjlcasfciu/auth/url-configuration

## Next Steps

1. ✅ Get anon key from Supabase dashboard
2. ✅ Create `.env.local` with the values above
3. ✅ Test locally with `npm run dev`
4. ✅ Apply database migrations (see deployment guide)
5. ✅ Deploy to production

See [ENV_SETUP_INSTRUCTIONS.md](./ENV_SETUP_INSTRUCTIONS.md) for detailed instructions.

