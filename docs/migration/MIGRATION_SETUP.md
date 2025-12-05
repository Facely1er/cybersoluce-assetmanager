# Signal History Migration Setup

## Supabase Project Configuration

**Project ID:** `dfklqsdfycwjlcasfciu`  
**Project URL:** `https://dfklqsdfycwjlcasfciu.supabase.co`  
**SQL Editor:** `https://app.supabase.com/project/dfklqsdfycwjlcasfciu/sql/new`

## Environment Variables

Add these to your `.env.local` file:

```env
VITE_SUPABASE_URL=https://dfklqsdfycwjlcasfciu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRma2xxc2RmeWN3amxjYXNmY2l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzODA5OTcsImV4cCI6MjA3OTk1Njk5N30.OiaL5SkKnMlpdfW2Y2L-m2mzmCFA_LgpUq2-m8XF-yQ
VITE_HISTORY_STORE_MODE=backend
```

## Running the Migration

### Option 1: Via Supabase Dashboard (Recommended)

1. Go to: https://app.supabase.com/project/dfklqsdfycwjlcasfciu/sql/new
2. Copy the entire contents of `migrations-ready/4-20250115000000_create_signal_history.sql`
3. Paste into the SQL Editor
4. Click "Run" to execute

### Option 2: Via psql

```bash
psql "postgresql://postgres:K1551d0ug0u@db.dfklqsdfycwjlcasfciu.supabase.co:5432/postgres" -f supabase/migrations/20250115000000_create_signal_history.sql
```

### Option 3: Via Supabase CLI

```bash
supabase link --project-ref dfklqsdfycwjlcasfciu
supabase db push
```

## Migration Safety

The migration is **safe to run multiple times** because it uses:
- `CREATE TABLE IF NOT EXISTS` - Won't fail if tables already exist
- `CREATE INDEX IF NOT EXISTS` - Won't fail if indexes already exist
- `DO $$ ... IF NOT EXISTS` blocks for policies - Won't fail if policies already exist

## What Gets Created

1. **`asset_import_batch` table** - Tracks CSV and SBOM import batches
2. **`signal_history` table** - Stores time-series signal snapshots per asset
3. **Indexes** - For efficient queries on asset_id, captured_at, and source
4. **RLS Policies** - Row-level security policies for authenticated users

## Conflict Check

The migration creates new tables that should not conflict with existing tables:
- `asset_import_batch` - New table, no conflicts expected
- `signal_history` - New table, no conflicts expected

If you have existing tables with these names, the `IF NOT EXISTS` clauses will prevent errors, but you should verify the schema matches your needs.

## After Migration

1. Set `VITE_HISTORY_STORE_MODE=backend` in your environment
2. Restart your development server
3. Test CSV import and SBOM upload features
4. Verify signal history is being recorded in the database

