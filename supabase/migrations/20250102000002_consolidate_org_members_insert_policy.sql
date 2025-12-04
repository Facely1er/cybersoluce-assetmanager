/*
  # Consolidate Organization Members INSERT Policy
  
  Fixes multiple permissive policies warning by consolidating two INSERT policies
  into a single policy that handles both cases:
  1. Users inserting themselves
  2. Organization owners/admins inserting other members
*/

DO $$
BEGIN
  -- Drop the two separate INSERT policies
  DROP POLICY IF EXISTS "Organization owners can add members" ON public.organization_members;
  DROP POLICY IF EXISTS "Users can insert themselves into organizations" ON public.organization_members;
  
  -- Create a single consolidated INSERT policy that handles both cases
  CREATE POLICY "Users can insert into organization members"
    ON public.organization_members
    FOR INSERT
    TO authenticated
    WITH CHECK (
      -- Allow if user is inserting themselves
      (select auth.uid()) = user_id
      OR
      -- OR if user is an owner/admin of the organization
      organization_id IN (
        SELECT organization_id 
        FROM organization_members 
        WHERE user_id = (select auth.uid()) AND role IN ('owner', 'admin')
      )
    );
END $$;

