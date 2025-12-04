/*
  # Fix Supabase Linter Issues
  
  This migration fixes security and performance issues identified by Supabase linter:
  
  1. Function Search Path Mutable - Add SET search_path to functions
  2. Auth RLS Initialization Plan - Optimize auth.uid() calls
  3. Multiple Permissive Policies - Consolidate overlapping policies
  4. RLS Enabled No Policy - Ensure profiles has policies
*/

-- ============================================================
-- Fix 1: Function Search Path Mutable
-- ============================================================

-- Fix handle_updated_at function
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix handle_organizations_updated_at function
CREATE OR REPLACE FUNCTION handle_organizations_updated_at()
RETURNS trigger 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================
-- Fix 2: Auth RLS Initialization Plan (Performance)
-- Replace auth.uid() with (select auth.uid()) for better performance
-- ============================================================

-- Fix organization_members policies to use (select auth.uid())
DO $$
BEGIN
  -- Drop and recreate "Organization owners can manage members" policy
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'organization_members' AND policyname = 'Organization owners can manage members'
  ) THEN
    DROP POLICY IF EXISTS "Organization owners can manage members" ON organization_members;
    
    CREATE POLICY "Organization owners can manage members"
      ON organization_members
      FOR ALL
      TO authenticated
      USING (
        organization_id IN (
          SELECT organization_id 
          FROM organization_members 
          WHERE user_id = (select auth.uid()) AND role IN ('owner', 'admin')
        )
      )
      WITH CHECK (
        organization_id IN (
          SELECT organization_id 
          FROM organization_members 
          WHERE user_id = (select auth.uid()) AND role IN ('owner', 'admin')
        )
      );
  END IF;
  
  -- Fix "Users can insert themselves into organizations" policy
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'organization_members' AND policyname = 'Users can insert themselves into organizations'
  ) THEN
    DROP POLICY IF EXISTS "Users can insert themselves into organizations" ON organization_members;
    
    CREATE POLICY "Users can insert themselves into organizations"
      ON organization_members
      FOR INSERT
      TO authenticated
      WITH CHECK ((select auth.uid()) = user_id);
  END IF;
END $$;

-- ============================================================
-- Fix 3: Multiple Permissive Policies
-- Consolidate organization_members policies to avoid duplicates
-- ============================================================

-- Drop duplicate policies and create consolidated ones
DO $$
BEGIN
  -- Drop "Organization owners can manage members" (will recreate below)
  DROP POLICY IF EXISTS "Organization owners can manage members" ON organization_members;
  
  -- Drop "Users can view organization members" (will recreate below)
  DROP POLICY IF EXISTS "Users can view organization members" ON organization_members;
  
  -- Drop "Users can insert themselves into organizations" (will recreate below)
  DROP POLICY IF EXISTS "Users can insert themselves into organizations" ON organization_members;
  
  -- Drop any other duplicate policies
  DROP POLICY IF EXISTS "Organization owners can delete members" ON organization_members;
  DROP POLICY IF EXISTS "Organization owners can update members" ON organization_members;
  DROP POLICY IF EXISTS "Users can insert into organizations" ON organization_members;
  
  -- Create consolidated SELECT policy
  CREATE POLICY "Users can view organization members"
    ON organization_members
    FOR SELECT
    TO authenticated
    USING (
      organization_id IN (
        SELECT organization_id 
        FROM organization_members 
        WHERE user_id = (select auth.uid())
      )
    );
  
  -- Create consolidated INSERT policy (for self-insertion)
  CREATE POLICY "Users can insert themselves into organizations"
    ON organization_members
    FOR INSERT
    TO authenticated
    WITH CHECK ((select auth.uid()) = user_id);
  
  -- Create consolidated UPDATE/DELETE policy (for owners/admins only)
  CREATE POLICY "Organization owners can manage members"
    ON organization_members
    FOR UPDATE
    TO authenticated
    USING (
      organization_id IN (
        SELECT organization_id 
        FROM organization_members 
        WHERE user_id = (select auth.uid()) AND role IN ('owner', 'admin')
      )
    )
    WITH CHECK (
      organization_id IN (
        SELECT organization_id 
        FROM organization_members 
        WHERE user_id = (select auth.uid()) AND role IN ('owner', 'admin')
      )
    );
  
  CREATE POLICY "Organization owners can delete members"
    ON organization_members
    FOR DELETE
    TO authenticated
    USING (
      organization_id IN (
        SELECT organization_id 
        FROM organization_members 
        WHERE user_id = (select auth.uid()) AND role IN ('owner', 'admin')
      )
    );
  
  -- Allow owners/admins to insert other members
  CREATE POLICY "Organization owners can add members"
    ON organization_members
    FOR INSERT
    TO authenticated
    WITH CHECK (
      organization_id IN (
        SELECT organization_id 
        FROM organization_members 
        WHERE user_id = (select auth.uid()) AND role IN ('owner', 'admin')
      )
    );
END $$;

-- ============================================================
-- Fix 4: RLS Enabled No Policy for profiles
-- Ensure profiles table has proper policies
-- ============================================================

DO $$
BEGIN
  -- Verify profiles policies exist, create if missing
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile"
      ON profiles FOR SELECT
      TO authenticated
      USING ((select auth.uid()) = id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON profiles FOR UPDATE
      TO authenticated
      USING ((select auth.uid()) = id);
  END IF;
  
  -- Add INSERT policy if missing
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile"
      ON profiles FOR INSERT
      TO authenticated
      WITH CHECK ((select auth.uid()) = id);
  END IF;
END $$;

-- ============================================================
-- Optional: Optimize other auth.uid() calls for performance
-- ============================================================

-- Update assets policies to use (select auth.uid()) for better performance
DO $$
BEGIN
  -- Update "Users can view their own assets"
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'assets' AND policyname = 'Users can view their own assets'
  ) THEN
    DROP POLICY IF EXISTS "Users can view their own assets" ON assets;
    CREATE POLICY "Users can view their own assets"
      ON assets FOR SELECT
      TO authenticated
      USING ((select auth.uid()) = user_id);
  END IF;
  
  -- Update "Users can create their own assets"
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'assets' AND policyname = 'Users can create their own assets'
  ) THEN
    DROP POLICY IF EXISTS "Users can create their own assets" ON assets;
    CREATE POLICY "Users can create their own assets"
      ON assets FOR INSERT
      TO authenticated
      WITH CHECK ((select auth.uid()) = user_id);
  END IF;
  
  -- Update "Users can update their own assets"
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'assets' AND policyname = 'Users can update their own assets'
  ) THEN
    DROP POLICY IF EXISTS "Users can update their own assets" ON assets;
    CREATE POLICY "Users can update their own assets"
      ON assets FOR UPDATE
      TO authenticated
      USING ((select auth.uid()) = user_id)
      WITH CHECK ((select auth.uid()) = user_id);
  END IF;
  
  -- Update "Users can delete their own assets"
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'assets' AND policyname = 'Users can delete their own assets'
  ) THEN
    DROP POLICY IF EXISTS "Users can delete their own assets" ON assets;
    CREATE POLICY "Users can delete their own assets"
      ON assets FOR DELETE
      TO authenticated
      USING ((select auth.uid()) = user_id);
  END IF;
END $$;

-- Update reports policies
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reports' AND policyname = 'Users can read own reports'
  ) THEN
    DROP POLICY IF EXISTS "Users can read own reports" ON reports;
    CREATE POLICY "Users can read own reports"
      ON reports FOR SELECT
      TO authenticated
      USING ((select auth.uid()) = created_by);
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reports' AND policyname = 'Users can create own reports'
  ) THEN
    DROP POLICY IF EXISTS "Users can create own reports" ON reports;
    CREATE POLICY "Users can create own reports"
      ON reports FOR INSERT
      TO authenticated
      WITH CHECK ((select auth.uid()) = created_by);
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reports' AND policyname = 'Users can update own reports'
  ) THEN
    DROP POLICY IF EXISTS "Users can update own reports" ON reports;
    CREATE POLICY "Users can update own reports"
      ON reports FOR UPDATE
      TO authenticated
      USING ((select auth.uid()) = created_by);
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reports' AND policyname = 'Users can delete own reports'
  ) THEN
    DROP POLICY IF EXISTS "Users can delete own reports" ON reports;
    CREATE POLICY "Users can delete own reports"
      ON reports FOR DELETE
      TO authenticated
      USING ((select auth.uid()) = created_by);
  END IF;
END $$;

-- Update organizations policies
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'organizations' AND policyname = 'Users can view organizations they belong to'
  ) THEN
    DROP POLICY IF EXISTS "Users can view organizations they belong to" ON organizations;
    CREATE POLICY "Users can view organizations they belong to"
      ON organizations FOR SELECT
      TO authenticated
      USING (
        id IN (
          SELECT organization_id 
          FROM organization_members 
          WHERE user_id = (select auth.uid())
        )
      );
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'organizations' AND policyname = 'Users can create organizations'
  ) THEN
    DROP POLICY IF EXISTS "Users can create organizations" ON organizations;
    CREATE POLICY "Users can create organizations"
      ON organizations FOR INSERT
      TO authenticated
      WITH CHECK ((select auth.uid()) = created_by);
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'organizations' AND policyname = 'Organization owners can update organizations'
  ) THEN
    DROP POLICY IF EXISTS "Organization owners can update organizations" ON organizations;
    CREATE POLICY "Organization owners can update organizations"
      ON organizations FOR UPDATE
      TO authenticated
      USING (
        id IN (
          SELECT organization_id 
          FROM organization_members 
          WHERE user_id = (select auth.uid()) AND role IN ('owner', 'admin')
        )
      );
  END IF;
END $$;

