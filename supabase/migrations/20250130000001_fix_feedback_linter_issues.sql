-- Fix Supabase Linter Issues for feedback_submissions
-- This migration addresses:
-- 1. Function search_path security issue
-- 2. RLS policy performance optimization

-- Fix 1: Set search_path for the function (security fix)
-- Drop trigger first (it depends on the function)
DROP TRIGGER IF EXISTS update_feedback_submissions_updated_at ON public.feedback_submissions;

-- Now drop and recreate the function with search_path set
DROP FUNCTION IF EXISTS update_feedback_submissions_updated_at();

CREATE FUNCTION update_feedback_submissions_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_feedback_submissions_updated_at
  BEFORE UPDATE ON public.feedback_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_feedback_submissions_updated_at();

-- Fix 2: Optimize RLS policy performance (use subquery to avoid re-evaluation per row)
DROP POLICY IF EXISTS "Users can view their own feedback" ON public.feedback_submissions;

CREATE POLICY "Users can view their own feedback"
  ON public.feedback_submissions
  FOR SELECT
  USING (
    (SELECT auth.uid()) = user_id OR
    user_id IS NULL
  );

