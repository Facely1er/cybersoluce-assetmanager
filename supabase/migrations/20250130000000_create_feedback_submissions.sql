-- Create feedback_submissions table
CREATE TABLE IF NOT EXISTS public.feedback_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  category TEXT NOT NULL CHECK (category IN (
    'feature-request',
    'bug-report',
    'general-feedback',
    'ui-ux-improvement',
    'performance-issue',
    'documentation-request'
  )),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  context JSONB,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'in-progress', 'resolved')),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance (using IF NOT EXISTS to avoid conflicts)
CREATE INDEX IF NOT EXISTS idx_feedback_submissions_user_id ON public.feedback_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_submissions_status ON public.feedback_submissions(status);
CREATE INDEX IF NOT EXISTS idx_feedback_submissions_created_at ON public.feedback_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_submissions_category ON public.feedback_submissions(category);

-- Drop existing policies if they exist (to avoid conflicts)
DO $$
BEGIN
  -- Drop insert policy if exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'feedback_submissions' 
    AND policyname = 'Users can insert their own feedback'
  ) THEN
    DROP POLICY "Users can insert their own feedback" ON public.feedback_submissions;
  END IF;

  -- Drop select policy if exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'feedback_submissions' 
    AND policyname = 'Users can view their own feedback'
  ) THEN
    DROP POLICY "Users can view their own feedback" ON public.feedback_submissions;
  END IF;
END $$;

-- Enable Row Level Security (only if not already enabled)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'feedback_submissions' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.feedback_submissions ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policies with IF NOT EXISTS check (using DO block for safety)
DO $$
BEGIN
  -- Insert policy: Allow anyone to insert feedback (anonymous feedback allowed)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'feedback_submissions' 
    AND policyname = 'Users can insert their own feedback'
  ) THEN
    CREATE POLICY "Users can insert their own feedback"
      ON public.feedback_submissions
      FOR INSERT
      WITH CHECK (true);
  END IF;

  -- Select policy: Users can view their own feedback or anonymous feedback
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'feedback_submissions' 
    AND policyname = 'Users can view their own feedback'
  ) THEN
    CREATE POLICY "Users can view their own feedback"
      ON public.feedback_submissions
      FOR SELECT
      USING (
        auth.uid() = user_id OR
        user_id IS NULL
      );
  END IF;
END $$;

-- Drop existing trigger if it exists (to avoid conflicts)
DROP TRIGGER IF EXISTS update_feedback_submissions_updated_at ON public.feedback_submissions;

-- Drop existing function if it exists (to avoid conflicts)
DROP FUNCTION IF EXISTS update_feedback_submissions_updated_at();

-- Create function to update updated_at timestamp (NOT security definer - uses current user)
CREATE FUNCTION update_feedback_submissions_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_feedback_submissions_updated_at
  BEFORE UPDATE ON public.feedback_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_feedback_submissions_updated_at();

-- Add comments (using IF EXISTS check would require checking if comment exists, which is complex, so we just set it)
COMMENT ON TABLE public.feedback_submissions IS 'User feedback submissions for CyberSoluce platform';
COMMENT ON COLUMN public.feedback_submissions.category IS 'Type of feedback: feature-request, bug-report, general-feedback, ui-ux-improvement, performance-issue, documentation-request';
COMMENT ON COLUMN public.feedback_submissions.priority IS 'Priority level: low, medium, high, critical';
COMMENT ON COLUMN public.feedback_submissions.status IS 'Status: new, reviewed, in-progress, resolved';
COMMENT ON COLUMN public.feedback_submissions.context IS 'JSON object containing page, route, userAgent, and timestamp';

