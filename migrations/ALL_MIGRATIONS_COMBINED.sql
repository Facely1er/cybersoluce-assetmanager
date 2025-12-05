-- ============================================================
-- CyberSoluce Asset Manager - All Database Migrations
-- ============================================================
-- Apply this entire file via Supabase Dashboard SQL Editor
-- URL: https://app.supabase.com/project/dfklqsdfycwjlcasfciu/sql/new
-- ============================================================
-- 
-- Migration Order:
--   1. Core Assets & Profiles (20250101000000_create_assets_table.sql)
--   2. Signal History (20250115000000_create_signal_history.sql)
--   3. Dependency Manager Features (20250125000000_dependency_manager_features.sql)
--   4. Reports System (20250801112702_cold_firefly.sql)
--   5. Organizations & Multi-tenancy (20250801114506_odd_flower.sql)
--
-- All migrations use IF NOT EXISTS, so safe to re-run
-- ============================================================

-- ============================================================
-- Migration 1: Core Assets & Profiles
-- ============================================================

/*
  # Create Assets Table
  
  This migration creates the core assets table for the asset inventory system.
  
  1. New Tables
    - `assets`
      - Core asset information (id, name, type, criticality, etc.)
      - User ownership (user_id)
      - Compliance and risk tracking
      - Timestamps for tracking
  
  2. Security
    - Enable RLS on `assets` table
    - Add policies for authenticated users to manage their own assets
  
  Note: This migration assumes the `profiles` table exists (typically created by Supabase Auth).
  If profiles table doesn't exist, create it first or update the foreign key reference.
*/

-- Create profiles table if it doesn't exist (basic structure for Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on profiles if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create basic profile policies if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile"
      ON profiles FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON profiles FOR UPDATE
      TO authenticated
      USING (auth.uid() = id);
  END IF;
END $$;

-- Create assets table
CREATE TABLE IF NOT EXISTS assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('Server', 'Database', 'Application', 'Network', 'Endpoint', 'Cloud Service', 'Information Asset', 'Data Repository', 'API', 'File System', 'Document', 'Personal Data', 'Sensitive Data', 'Business Process', 'Third Party Service')),
  criticality text NOT NULL DEFAULT 'Medium' CHECK (criticality IN ('Critical', 'High', 'Medium', 'Low')),
  owner text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  ip_address text,
  description text DEFAULT '',
  compliance_frameworks text[] DEFAULT '{}',
  risk_score integer DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  tags text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Retired', 'Planned')),
  last_assessed timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
);

-- Create asset_relationships table
CREATE TABLE IF NOT EXISTS asset_relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  related_asset_id uuid NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  relationship_type text NOT NULL CHECK (relationship_type IN ('Depends On', 'Connects To', 'Hosts', 'Manages', 'Accesses', 'Processes', 'Stores', 'Transmits', 'Shares', 'Backs Up', 'Replicates', 'Synchronizes')),
  strength text NOT NULL DEFAULT 'Medium' CHECK (strength IN ('Strong', 'Medium', 'Weak')),
  data_flow_direction text DEFAULT 'None' CHECK (data_flow_direction IN ('Inbound', 'Outbound', 'Bidirectional', 'None')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(asset_id, related_asset_id, relationship_type)
);

-- Create asset_vulnerabilities table
CREATE TABLE IF NOT EXISTS asset_vulnerabilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  cve_id text,
  title text NOT NULL,
  description text DEFAULT '',
  severity text NOT NULL CHECK (severity IN ('Critical', 'High', 'Medium', 'Low', 'Info')),
  cvss_score numeric CHECK (cvss_score >= 0 AND cvss_score <= 10),
  status text NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Resolved', 'Risk Accepted')),
  discovered_date timestamptz DEFAULT now(),
  resolved_date timestamptz,
  remediation_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assets_user_id ON assets(user_id);
CREATE INDEX IF NOT EXISTS idx_assets_type ON assets(type);
CREATE INDEX IF NOT EXISTS idx_assets_criticality ON assets(criticality);
CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status);
CREATE INDEX IF NOT EXISTS idx_assets_created_at ON assets(created_at);
CREATE INDEX IF NOT EXISTS idx_asset_relationships_asset_id ON asset_relationships(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_relationships_related_asset_id ON asset_relationships(related_asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_vulnerabilities_asset_id ON asset_vulnerabilities(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_vulnerabilities_severity ON asset_vulnerabilities(severity);
CREATE INDEX IF NOT EXISTS idx_asset_vulnerabilities_status ON asset_vulnerabilities(status);

-- Enable Row Level Security
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_vulnerabilities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for assets
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'assets' AND policyname = 'Users can view their own assets'
  ) THEN
    CREATE POLICY "Users can view their own assets"
      ON assets
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'assets' AND policyname = 'Users can create their own assets'
  ) THEN
    CREATE POLICY "Users can create their own assets"
      ON assets
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'assets' AND policyname = 'Users can update their own assets'
  ) THEN
    CREATE POLICY "Users can update their own assets"
      ON assets
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'assets' AND policyname = 'Users can delete their own assets'
  ) THEN
    CREATE POLICY "Users can delete their own assets"
      ON assets
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create RLS policies for asset_relationships
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'asset_relationships' AND policyname = 'Users can view relationships for their assets'
  ) THEN
    CREATE POLICY "Users can view relationships for their assets"
      ON asset_relationships
      FOR SELECT
      TO authenticated
      USING (
        asset_id IN (SELECT id FROM assets WHERE user_id = auth.uid()) OR
        related_asset_id IN (SELECT id FROM assets WHERE user_id = auth.uid())
      );
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'asset_relationships' AND policyname = 'Users can create relationships for their assets'
  ) THEN
    CREATE POLICY "Users can create relationships for their assets"
      ON asset_relationships
      FOR INSERT
      TO authenticated
      WITH CHECK (
        asset_id IN (SELECT id FROM assets WHERE user_id = auth.uid()) AND
        related_asset_id IN (SELECT id FROM assets WHERE user_id = auth.uid())
      );
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'asset_relationships' AND policyname = 'Users can update relationships for their assets'
  ) THEN
    CREATE POLICY "Users can update relationships for their assets"
      ON asset_relationships
      FOR UPDATE
      TO authenticated
      USING (
        asset_id IN (SELECT id FROM assets WHERE user_id = auth.uid()) OR
        related_asset_id IN (SELECT id FROM assets WHERE user_id = auth.uid())
      )
      WITH CHECK (
        asset_id IN (SELECT id FROM assets WHERE user_id = auth.uid()) AND
        related_asset_id IN (SELECT id FROM assets WHERE user_id = auth.uid())
      );
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'asset_relationships' AND policyname = 'Users can delete relationships for their assets'
  ) THEN
    CREATE POLICY "Users can delete relationships for their assets"
      ON asset_relationships
      FOR DELETE
      TO authenticated
      USING (
        asset_id IN (SELECT id FROM assets WHERE user_id = auth.uid()) OR
        related_asset_id IN (SELECT id FROM assets WHERE user_id = auth.uid())
      );
  END IF;
END $$;

-- Create RLS policies for asset_vulnerabilities
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'asset_vulnerabilities' AND policyname = 'Users can view vulnerabilities for their assets'
  ) THEN
    CREATE POLICY "Users can view vulnerabilities for their assets"
      ON asset_vulnerabilities
      FOR SELECT
      TO authenticated
      USING (asset_id IN (SELECT id FROM assets WHERE user_id = auth.uid()));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'asset_vulnerabilities' AND policyname = 'Users can create vulnerabilities for their assets'
  ) THEN
    CREATE POLICY "Users can create vulnerabilities for their assets"
      ON asset_vulnerabilities
      FOR INSERT
      TO authenticated
      WITH CHECK (asset_id IN (SELECT id FROM assets WHERE user_id = auth.uid()));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'asset_vulnerabilities' AND policyname = 'Users can update vulnerabilities for their assets'
  ) THEN
    CREATE POLICY "Users can update vulnerabilities for their assets"
      ON asset_vulnerabilities
      FOR UPDATE
      TO authenticated
      USING (asset_id IN (SELECT id FROM assets WHERE user_id = auth.uid()))
      WITH CHECK (asset_id IN (SELECT id FROM assets WHERE user_id = auth.uid()));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'asset_vulnerabilities' AND policyname = 'Users can delete vulnerabilities for their assets'
  ) THEN
    CREATE POLICY "Users can delete vulnerabilities for their assets"
      ON asset_vulnerabilities
      FOR DELETE
      TO authenticated
      USING (asset_id IN (SELECT id FROM assets WHERE user_id = auth.uid()));
  END IF;
END $$;

-- Create updated_at trigger function if it doesn't exist
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

-- Add updated_at triggers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'handle_assets_updated_at'
  ) THEN
    CREATE TRIGGER handle_assets_updated_at
      BEFORE UPDATE ON assets
      FOR EACH ROW
      EXECUTE FUNCTION handle_updated_at();
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'handle_asset_relationships_updated_at'
  ) THEN
    CREATE TRIGGER handle_asset_relationships_updated_at
      BEFORE UPDATE ON asset_relationships
      FOR EACH ROW
      EXECUTE FUNCTION handle_updated_at();
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'handle_asset_vulnerabilities_updated_at'
  ) THEN
    CREATE TRIGGER handle_asset_vulnerabilities_updated_at
      BEFORE UPDATE ON asset_vulnerabilities
      FOR EACH ROW
      EXECUTE FUNCTION handle_updated_at();
  END IF;
END $$;

-- ============================================================
-- Migration 2: Signal History
-- ============================================================

/*
  # Create Signal History Tables
  
  This migration creates tables for tracking signal history over time and import batches.
  
  1. New Tables
    - `signal_history` - Time-series snapshots of signals per asset
    - `asset_import_batch` - Tracks CSV and SBOM import batches
  
  2. Indexes
    - Index on asset_id and captured_at for efficient history queries
    - Index on source for filtering by source type
*/

-- Create asset_import_batch table (for CSV & SBOM grouping)
CREATE TABLE IF NOT EXISTS asset_import_batch (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type         text NOT NULL,  -- 'csv-assets' | 'sbom-upload'
  source_label text NOT NULL,  -- e.g. 'CustomerX CSV 2025-12-02', 'Repo foo-service SBOM'
  created_at   timestamptz NOT NULL DEFAULT now(),
  created_by   text NULL       -- identifier for user/tenant if available
);

-- Create signal_history table
CREATE TABLE IF NOT EXISTS signal_history (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id      text NOT NULL,
  captured_at   timestamptz NOT NULL,
  source        text NOT NULL, -- 'cybersoluce' | 'technosoluce' | 'vendorsoluce' | 'demo'
  signals_json  jsonb NOT NULL,
  import_batch_id uuid NULL REFERENCES asset_import_batch(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_signal_history_asset_time
  ON signal_history (asset_id, captured_at DESC);

CREATE INDEX IF NOT EXISTS idx_signal_history_source
  ON signal_history (source);

CREATE INDEX IF NOT EXISTS idx_signal_history_batch
  ON signal_history (import_batch_id)
  WHERE import_batch_id IS NOT NULL;

-- Enable RLS on both tables
ALTER TABLE asset_import_batch ENABLE ROW LEVEL SECURITY;
ALTER TABLE signal_history ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
-- Users can view their own import batches
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'asset_import_batch' AND policyname = 'Users can view own import batches'
  ) THEN
    CREATE POLICY "Users can view own import batches"
      ON asset_import_batch FOR SELECT
      TO authenticated
      USING (true); -- For now, allow all authenticated users to view batches
  END IF;
END $$;

-- Users can create import batches
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'asset_import_batch' AND policyname = 'Users can create import batches'
  ) THEN
    CREATE POLICY "Users can create import batches"
      ON asset_import_batch FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

-- Users can view signal history
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'signal_history' AND policyname = 'Users can view signal history'
  ) THEN
    CREATE POLICY "Users can view signal history"
      ON signal_history FOR SELECT
      TO authenticated
      USING (true); -- For now, allow all authenticated users to view history
  END IF;
END $$;

-- Users can insert signal history
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'signal_history' AND policyname = 'Users can insert signal history'
  ) THEN
    CREATE POLICY "Users can insert signal history"
      ON signal_history FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

-- ============================================================
-- Migration 3: Dependency Manager Features
-- ============================================================

/*
  # DependencyManager Features Migration

  This migration adds tables for:
  1. Mitigation Actions
  2. Business Impact Analysis (Business Functions, Business Impacts, Continuity Plans)
  3. NIST Framework (Controls, Mappings, Assessments)
  4. Framework Phases
  5. Risks (with dependency_id)
*/

-- Mitigation Actions Table
CREATE TABLE IF NOT EXISTS mitigation_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id text DEFAULT '',
  risk_id text NOT NULL,
  asset_id text,
  dependency_id text,
  name text NOT NULL,
  description text DEFAULT '',
  assignee text NOT NULL,
  due_date timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled')),
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  priority text DEFAULT 'Medium' CHECK (priority IN ('Critical', 'High', 'Medium', 'Low')),
  estimated_cost numeric,
  actual_cost numeric,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Business Functions Table
CREATE TABLE IF NOT EXISTS business_functions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id text DEFAULT '',
  name text NOT NULL,
  description text DEFAULT '',
  owner text NOT NULL,
  department text NOT NULL,
  priority text NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Critical', 'High', 'Medium', 'Low')),
  mtd integer NOT NULL DEFAULT 24, -- Maximum Tolerable Downtime in hours
  rto integer NOT NULL DEFAULT 4, -- Recovery Time Objective in hours
  rpo integer NOT NULL DEFAULT 1, -- Recovery Point Objective in hours
  annual_revenue numeric,
  regulatory_requirements text[] DEFAULT '{}',
  dependencies text[] DEFAULT '{}', -- Asset IDs
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Business Impacts Table
CREATE TABLE IF NOT EXISTS business_impacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id text DEFAULT '',
  asset_id text NOT NULL,
  business_function_id uuid NOT NULL REFERENCES business_functions(id) ON DELETE CASCADE,
  financial_impact jsonb DEFAULT '{
    "hourlyRevenueLoss": 0,
    "recoveryCosts": 0,
    "reputationalCosts": 0,
    "penalties": 0
  }',
  operational_impact jsonb DEFAULT '{
    "affectedUsers": 0,
    "affectedProcesses": 0,
    "workaroundAvailable": false,
    "workaroundCost": 0
  }',
  regulatory_impact jsonb DEFAULT '{
    "regulations": [],
    "penaltiesPerDay": 0,
    "reportingRequired": false
  }',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Continuity Plans Table
CREATE TABLE IF NOT EXISTS continuity_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id text DEFAULT '',
  name text NOT NULL,
  description text DEFAULT '',
  business_function_id uuid NOT NULL REFERENCES business_functions(id) ON DELETE CASCADE,
  asset_ids text[] DEFAULT '{}',
  rto integer NOT NULL DEFAULT 4,
  rpo integer NOT NULL DEFAULT 1,
  steps jsonb DEFAULT '[]',
  contacts jsonb DEFAULT '[]',
  resources jsonb DEFAULT '[]',
  test_schedule jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- NIST Controls Table
CREATE TABLE IF NOT EXISTS nist_controls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id text DEFAULT '',
  family text NOT NULL,
  number text NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  priority integer DEFAULT 0,
  baseline_impact text[] DEFAULT '{}',
  related_controls text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'not-implemented' CHECK (status IN ('implemented', 'partially-implemented', 'planned', 'not-implemented')),
  implementation_details text,
  last_assessment timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(family, number, organization_id)
);

-- NIST Mappings Table
CREATE TABLE IF NOT EXISTS nist_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id text DEFAULT '',
  asset_id text NOT NULL,
  functions text[] DEFAULT '{}',
  controls text[] DEFAULT '{}',
  security_categorization jsonb DEFAULT '{
    "confidentiality": "low",
    "integrity": "low",
    "availability": "low"
  }',
  supply_chain_tier integer DEFAULT 1,
  last_review timestamptz DEFAULT now(),
  next_review timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- NIST Assessments Table
CREATE TABLE IF NOT EXISTS nist_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id text DEFAULT '',
  asset_id text NOT NULL,
  date timestamptz DEFAULT now(),
  assessor text NOT NULL,
  overall_score integer DEFAULT 0 CHECK (overall_score >= 0 AND overall_score <= 100),
  function_scores jsonb DEFAULT '{
    "identify": 0,
    "protect": 0,
    "detect": 0,
    "respond": 0,
    "recover": 0
  }',
  findings jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Framework Phases Table
CREATE TABLE IF NOT EXISTS framework_phases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id text DEFAULT '',
  name text NOT NULL CHECK (name IN ('foundation', 'development', 'maturity', 'optimization')),
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  tasks jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(name, organization_id)
);

-- Risks Table (if it doesn't exist, create it; otherwise add dependency_id column)
CREATE TABLE IF NOT EXISTS risks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id text DEFAULT '',
  asset_id text NOT NULL,
  dependency_id text,
  name text NOT NULL,
  description text DEFAULT '',
  likelihood integer DEFAULT 1 CHECK (likelihood >= 1 AND likelihood <= 5),
  impact integer DEFAULT 1 CHECK (impact >= 1 AND impact <= 5),
  risk_score integer DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  level text NOT NULL DEFAULT 'Low' CHECK (level IN ('Critical', 'High', 'Medium', 'Low')),
  category text,
  source text,
  mitigation_status text DEFAULT 'Not Mitigated' CHECK (mitigation_status IN ('Not Mitigated', 'Partially Mitigated', 'Fully Mitigated')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add dependency_id to risks if table exists but column doesn't
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'risks') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'risks' AND column_name = 'dependency_id') THEN
      ALTER TABLE risks ADD COLUMN dependency_id text;
    END IF;
  END IF;
END $$;

-- Enable RLS on all tables
ALTER TABLE mitigation_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_functions ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_impacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE continuity_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE nist_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE nist_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE nist_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE framework_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic policies - adjust based on your auth requirements)
-- Mitigation Actions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'mitigation_actions' AND policyname = 'Users can manage mitigation actions'
  ) THEN
    CREATE POLICY "Users can manage mitigation actions"
      ON mitigation_actions
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'business_functions' AND policyname = 'Users can manage business functions'
  ) THEN
    CREATE POLICY "Users can manage business functions"
      ON business_functions
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'business_impacts' AND policyname = 'Users can manage business impacts'
  ) THEN
    CREATE POLICY "Users can manage business impacts"
      ON business_impacts
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'continuity_plans' AND policyname = 'Users can manage continuity plans'
  ) THEN
    CREATE POLICY "Users can manage continuity plans"
      ON continuity_plans
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'nist_controls' AND policyname = 'Users can manage nist controls'
  ) THEN
    CREATE POLICY "Users can manage nist controls"
      ON nist_controls
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'nist_mappings' AND policyname = 'Users can manage nist mappings'
  ) THEN
    CREATE POLICY "Users can manage nist mappings"
      ON nist_mappings
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'nist_assessments' AND policyname = 'Users can manage nist assessments'
  ) THEN
    CREATE POLICY "Users can manage nist assessments"
      ON nist_assessments
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'framework_phases' AND policyname = 'Users can manage framework phases'
  ) THEN
    CREATE POLICY "Users can manage framework phases"
      ON framework_phases
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'risks' AND policyname = 'Users can manage risks'
  ) THEN
    CREATE POLICY "Users can manage risks"
      ON risks
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mitigation_actions_risk_id ON mitigation_actions(risk_id);
CREATE INDEX IF NOT EXISTS idx_mitigation_actions_asset_id ON mitigation_actions(asset_id);
CREATE INDEX IF NOT EXISTS idx_business_impacts_asset_id ON business_impacts(asset_id);
CREATE INDEX IF NOT EXISTS idx_business_impacts_function_id ON business_impacts(business_function_id);
CREATE INDEX IF NOT EXISTS idx_nist_mappings_asset_id ON nist_mappings(asset_id);
CREATE INDEX IF NOT EXISTS idx_nist_assessments_asset_id ON nist_assessments(asset_id);
CREATE INDEX IF NOT EXISTS idx_risks_asset_id ON risks(asset_id);
CREATE INDEX IF NOT EXISTS idx_risks_dependency_id ON risks(dependency_id);

-- Create updated_at trigger function if it doesn't exist
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

-- Add updated_at triggers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_mitigation_actions_updated_at'
  ) THEN
    CREATE TRIGGER update_mitigation_actions_updated_at BEFORE UPDATE ON mitigation_actions
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_business_functions_updated_at'
  ) THEN
    CREATE TRIGGER update_business_functions_updated_at BEFORE UPDATE ON business_functions
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_business_impacts_updated_at'
  ) THEN
    CREATE TRIGGER update_business_impacts_updated_at BEFORE UPDATE ON business_impacts
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_continuity_plans_updated_at'
  ) THEN
    CREATE TRIGGER update_continuity_plans_updated_at BEFORE UPDATE ON continuity_plans
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_nist_controls_updated_at'
  ) THEN
    CREATE TRIGGER update_nist_controls_updated_at BEFORE UPDATE ON nist_controls
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_nist_mappings_updated_at'
  ) THEN
    CREATE TRIGGER update_nist_mappings_updated_at BEFORE UPDATE ON nist_mappings
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_nist_assessments_updated_at'
  ) THEN
    CREATE TRIGGER update_nist_assessments_updated_at BEFORE UPDATE ON nist_assessments
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_framework_phases_updated_at'
  ) THEN
    CREATE TRIGGER update_framework_phases_updated_at BEFORE UPDATE ON framework_phases
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_risks_updated_at'
  ) THEN
    CREATE TRIGGER update_risks_updated_at BEFORE UPDATE ON risks
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ============================================================
-- Migration 4: Reports System
-- ============================================================

/*
  # Create reports table for team management

  1. New Tables
    - `reports`
      - `id` (uuid, primary key)
      - `organization_id` (text)
      - `created_by` (uuid, foreign key to profiles)
      - `name` (text)
      - `description` (text, optional)
      - `type` (text, report type)
      - `filters` (jsonb, report filters)
      - `schedule` (jsonb, scheduling options)
      - `format` (text, output format)
      - `is_public` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `reports` table
    - Add policy for authenticated users to read/write their own reports
*/

CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id text DEFAULT '',
  created_by uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  type text NOT NULL DEFAULT 'asset_summary',
  filters jsonb DEFAULT '{}',
  schedule jsonb DEFAULT '{}',
  format text NOT NULL DEFAULT 'pdf',
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reports' AND policyname = 'Users can read own reports'
  ) THEN
    CREATE POLICY "Users can read own reports"
      ON reports
      FOR SELECT
      TO authenticated
      USING (auth.uid() = created_by);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reports' AND policyname = 'Users can create own reports'
  ) THEN
    CREATE POLICY "Users can create own reports"
      ON reports
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = created_by);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reports' AND policyname = 'Users can update own reports'
  ) THEN
    CREATE POLICY "Users can update own reports"
      ON reports
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = created_by);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reports' AND policyname = 'Users can delete own reports'
  ) THEN
    CREATE POLICY "Users can delete own reports"
      ON reports
      FOR DELETE
      TO authenticated
      USING (auth.uid() = created_by);
  END IF;
END $$;

-- Add updated_at trigger
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'handle_reports_updated_at'
  ) THEN
    CREATE TRIGGER handle_reports_updated_at
      BEFORE UPDATE ON reports
      FOR EACH ROW
      EXECUTE FUNCTION handle_updated_at();
  END IF;
END $$;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_reports_created_by ON reports(created_by);
CREATE INDEX IF NOT EXISTS idx_reports_organization_id ON reports(organization_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);

-- ============================================================
-- Migration 5: Organizations & Multi-tenancy
-- ============================================================

/*
  # Team Management Schema

  1. New Tables
    - `organizations`
      - `id` (uuid, primary key)
      - `name` (text, organization name)
      - `slug` (text, unique URL slug)
      - `description` (text, optional description)
      - `logo_url` (text, optional logo URL)
      - `settings` (jsonb, organization settings)
      - `plan` (text, subscription plan)
      - `created_by` (uuid, foreign key to profiles)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `organization_members`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, foreign key to organizations)
      - `user_id` (uuid, foreign key to profiles)
      - `role` (text, member role)
      - `invited_by` (uuid, foreign key to profiles)
      - `joined_at` (timestamp)
      - `created_at` (timestamp)

    - `invitations`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, foreign key to organizations)
      - `email` (text, invited email)
      - `role` (text, invited role)
      - `token` (text, invitation token)
      - `invited_by` (uuid, foreign key to profiles)
      - `expires_at` (timestamp)
      - `accepted_at` (timestamp, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for organization-based access control
    - Ensure users can only access their organization data

  3. Foreign Keys
    - organization_members.organization_id -> organizations.id
    - organization_members.user_id -> profiles.id
    - organization_members.invited_by -> profiles.id
    - invitations.organization_id -> organizations.id
    - invitations.invited_by -> profiles.id
    - organizations.created_by -> profiles.id
*/

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  logo_url text,
  settings jsonb DEFAULT '{}',
  plan text DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  created_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create organization_members table
CREATE TABLE IF NOT EXISTS organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'editor', 'viewer', 'member')),
  invited_by uuid REFERENCES profiles(id),
  joined_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

-- Create invitations table
CREATE TABLE IF NOT EXISTS invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'editor', 'viewer', 'member')),
  token text UNIQUE NOT NULL,
  invited_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  accepted_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Add current_organization_id to profiles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'current_organization_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN current_organization_id uuid REFERENCES organizations(id);
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_created_by ON organizations(created_by);
CREATE INDEX IF NOT EXISTS idx_organization_members_org_id ON organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_user_id ON organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_invitations_org_id ON invitations(organization_id);
CREATE INDEX IF NOT EXISTS idx_invitations_email ON invitations(email);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON invitations(token);

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Organizations policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'organizations' AND policyname = 'Users can view organizations they belong to'
  ) THEN
    CREATE POLICY "Users can view organizations they belong to"
      ON organizations
      FOR SELECT
      TO authenticated
      USING (
        id IN (
          SELECT organization_id 
          FROM organization_members 
          WHERE user_id = auth.uid()
        )
      );
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'organizations' AND policyname = 'Users can create organizations'
  ) THEN
    CREATE POLICY "Users can create organizations"
      ON organizations
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = created_by);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'organizations' AND policyname = 'Organization owners can update organizations'
  ) THEN
    CREATE POLICY "Organization owners can update organizations"
      ON organizations
      FOR UPDATE
      TO authenticated
      USING (
        id IN (
          SELECT organization_id 
          FROM organization_members 
          WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
        )
      );
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'organization_members' AND policyname = 'Users can view organization members'
  ) THEN
    CREATE POLICY "Users can view organization members"
      ON organization_members
      FOR SELECT
      TO authenticated
      USING (
        organization_id IN (
          SELECT organization_id 
          FROM organization_members 
          WHERE user_id = auth.uid()
        )
      );
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'organization_members' AND policyname = 'Organization owners can manage members'
  ) THEN
    CREATE POLICY "Organization owners can manage members"
      ON organization_members
      FOR ALL
      TO authenticated
      USING (
        organization_id IN (
          SELECT organization_id 
          FROM organization_members 
          WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
        )
      );
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'organization_members' AND policyname = 'Users can insert themselves into organizations'
  ) THEN
    CREATE POLICY "Users can insert themselves into organizations"
      ON organization_members
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'invitations' AND policyname = 'Organization members can view invitations'
  ) THEN
    CREATE POLICY "Organization members can view invitations"
      ON invitations
      FOR SELECT
      TO authenticated
      USING (
        organization_id IN (
          SELECT organization_id 
          FROM organization_members 
          WHERE user_id = auth.uid()
        )
      );
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'invitations' AND policyname = 'Organization owners can create invitations'
  ) THEN
    CREATE POLICY "Organization owners can create invitations"
      ON invitations
      FOR INSERT
      TO authenticated
      WITH CHECK (
        organization_id IN (
          SELECT organization_id 
          FROM organization_members 
          WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
        )
      );
  END IF;
END $$;

-- Create updated_at trigger for organizations
CREATE OR REPLACE FUNCTION handle_organizations_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'handle_organizations_updated_at'
  ) THEN
    CREATE TRIGGER handle_organizations_updated_at
      BEFORE UPDATE ON organizations
      FOR EACH ROW
      EXECUTE FUNCTION handle_organizations_updated_at();
  END IF;
END $$;

-- ============================================================
-- Migration Complete
-- ============================================================
-- All 5 migrations have been applied successfully!
-- 
-- Created Tables (19 total):
--   1. profiles
--   2. assets
--   3. asset_relationships
--   4. asset_vulnerabilities
--   5. asset_import_batch
--   6. signal_history
--   7. mitigation_actions
--   8. business_functions
--   9. business_impacts
--  10. continuity_plans
--  11. nist_controls
--  12. nist_mappings
--  13. nist_assessments
--  14. framework_phases
--  15. risks
--  16. reports
--  17. organizations
--  18. organization_members
--  19. invitations
--
-- Next Steps:
--   1. Verify tables in Supabase Table Editor
--   2. Test RLS policies with authenticated users
--   3. Get Supabase anon key for application
--   4. Deploy application
-- ============================================================

