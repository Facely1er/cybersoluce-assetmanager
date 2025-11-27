# Fix Database Error: Table 'public.assets' Not Found

## Problem
You're seeing this error:
```
Could not find the table 'public.assets' in the schema cache
```

This happens because the database migration hasn't been run in your Supabase project.

## Solution: Run the Migration

### Option 1: Using Supabase Dashboard (Easiest)

1. **Go to your Supabase Dashboard**
   - Visit https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the Migration**
   - Open the file: `supabase/migrations/20250101000000_create_assets_table.sql`
   - Copy ALL the contents
   - Paste into the SQL Editor
   - Click "Run" (or press Ctrl+Enter)

4. **Verify**
   - Go to "Table Editor" in the left sidebar
   - You should see these tables:
     - `profiles`
     - `assets`
     - `asset_relationships`
     - `asset_vulnerabilities`

### Option 2: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# Make sure you're logged in
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### Option 3: Manual Table Creation

If migrations don't work, you can create the table manually:

1. Go to Supabase Dashboard → SQL Editor
2. Run this simplified version:

```sql
-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create assets table
CREATE TABLE IF NOT EXISTS assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  criticality text NOT NULL DEFAULT 'Medium',
  owner text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  ip_address text,
  description text DEFAULT '',
  compliance_frameworks text[] DEFAULT '{}',
  risk_score integer DEFAULT 0,
  tags text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'Active',
  last_assessed timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- Create basic policies
CREATE POLICY "Users can view their own assets"
  ON assets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assets"
  ON assets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assets"
  ON assets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assets"
  ON assets FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
```

## After Running Migration

1. **Refresh your browser** (hard refresh: Ctrl+Shift+R)
2. **Clear browser cache** if errors persist
3. **Check the console** - errors should be gone

## Verify It Worked

1. Navigate to the Assets page in your app
2. Try to add an asset
3. Check browser console - no more "table not found" errors

## Note About StartScreen Design

The StartScreen design changes are **independent** of the database. You should see:
- Blue hero section (`bg-command-blue-600`)
- Animated DomainBackground
- TextCarousel rotating text
- Framer Motion animations

If you don't see these, try:
- Hard refresh: `Ctrl+Shift+R`
- Clear browser cache
- Check browser console for any React errors

