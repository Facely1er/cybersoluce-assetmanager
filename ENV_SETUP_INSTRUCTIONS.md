# Environment Setup Instructions

## ⚠️ IMPORTANT SECURITY NOTE

The PostgreSQL connection string you provided contains **sensitive credentials** that should **NEVER** be used in the frontend application.

**DO NOT:**
- ❌ Put the connection string in `.env.local` or any frontend code
- ❌ Commit the connection string to version control
- ❌ Use the database password in the frontend

**DO:**
- ✅ Use the Supabase URL and anon key for frontend
- ✅ Keep the connection string secure (server-side only)
- ✅ Use it only for database migrations or server-side operations

## Extracted Information

From your connection string, I've identified:
- **Project Reference**: `dfklqsdfycwjlcasfciu`
- **Supabase URL**: `https://dfklqsdfycwjlcasfciu.supabase.co`

## Next Steps

### 1. Get Your Supabase Anon Key

1. Go to: https://app.supabase.com/project/dfklqsdfycwjlcasfciu/settings/api
2. Find the **"Project API keys"** section
3. Copy the **`anon` `public`** key (it starts with `eyJ...`)
4. This is the key you'll use in `VITE_SUPABASE_ANON_KEY`

### 2. Create `.env.local` File

```bash
# Copy the example file
cp .env.example .env.local
```

### 3. Update `.env.local` with Your Values

```bash
# Required for frontend
VITE_SUPABASE_URL=https://dfklqsdfycwjlcasfciu.supabase.co
VITE_SUPABASE_ANON_KEY=paste-your-anon-key-here

# Application settings
VITE_APP_ENV=development
VITE_DEBUG_MODE=true
VITE_CYBERSOLUCE_DEMO_ENABLED=true
VITE_HISTORY_STORE_MODE=local
```

### 4. For Production Deployment

When deploying to Netlify/Vercel, set these environment variables:

**Required:**
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

The connection string you provided:
```
postgresql://postgres:K1551d0ug0u@db.dfklqsdfycwjlcasfciu.supabase.co:5432/postgres
```

**Use this ONLY for:**
- Database migrations (via Supabase SQL Editor or psql)
- Server-side scripts
- Backend services (if any)

**Never use in:**
- Frontend code
- Environment variables exposed to the browser
- Client-side JavaScript

## Quick Reference

| What | Where to Get | Used For |
|------|--------------|----------|
| **Supabase URL** | Connection string or Dashboard | Frontend API calls |
| **Anon Key** | Dashboard → Settings → API | Frontend API calls (safe) |
| **Connection String** | Dashboard → Settings → Database | Server-side only |

## Supabase Dashboard Links

- **Project Dashboard**: https://app.supabase.com/project/dfklqsdfycwjlcasfciu
- **API Settings**: https://app.supabase.com/project/dfklqsdfycwjlcasfciu/settings/api
- **SQL Editor**: https://app.supabase.com/project/dfklqsdfycwjlcasfciu/sql/new
- **Database Settings**: https://app.supabase.com/project/dfklqsdfycwjlcasfciu/settings/database
- **Auth Settings**: https://app.supabase.com/project/dfklqsdfycwjlcasfciu/auth/url-configuration

## Verification

After setting up your `.env.local`:

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Check the console:**
   - Should see: "Supabase configured - database persistence enabled"
   - If you see "Running in demo mode", check your environment variables

3. **Test authentication:**
   - Try signing up/signing in
   - Verify data persists to database

## Security Checklist

- [ ] `.env.local` is in `.gitignore` (already configured)
- [ ] Never committed connection string to git
- [ ] Using anon key (not database password) in frontend
- [ ] Connection string only used for server-side operations
- [ ] Production environment variables set in deployment platform

## Need Help?

- See [ENV_SETUP.md](./ENV_SETUP.md) for detailed documentation
- See [Deployment Guide](./docs/deployment/PRODUCTION_DEPLOYMENT_COMPLETE.md) for production setup

