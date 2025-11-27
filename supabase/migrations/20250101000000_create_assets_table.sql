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
*/

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
CREATE POLICY "Users can view their own assets"
  ON assets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assets"
  ON assets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assets"
  ON assets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assets"
  ON assets
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for asset_relationships
CREATE POLICY "Users can view relationships for their assets"
  ON asset_relationships
  FOR SELECT
  TO authenticated
  USING (
    asset_id IN (SELECT id FROM assets WHERE user_id = auth.uid()) OR
    related_asset_id IN (SELECT id FROM assets WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create relationships for their assets"
  ON asset_relationships
  FOR INSERT
  TO authenticated
  WITH CHECK (
    asset_id IN (SELECT id FROM assets WHERE user_id = auth.uid()) AND
    related_asset_id IN (SELECT id FROM assets WHERE user_id = auth.uid())
  );

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

CREATE POLICY "Users can delete relationships for their assets"
  ON asset_relationships
  FOR DELETE
  TO authenticated
  USING (
    asset_id IN (SELECT id FROM assets WHERE user_id = auth.uid()) OR
    related_asset_id IN (SELECT id FROM assets WHERE user_id = auth.uid())
  );

-- Create RLS policies for asset_vulnerabilities
CREATE POLICY "Users can view vulnerabilities for their assets"
  ON asset_vulnerabilities
  FOR SELECT
  TO authenticated
  USING (asset_id IN (SELECT id FROM assets WHERE user_id = auth.uid()));

CREATE POLICY "Users can create vulnerabilities for their assets"
  ON asset_vulnerabilities
  FOR INSERT
  TO authenticated
  WITH CHECK (asset_id IN (SELECT id FROM assets WHERE user_id = auth.uid()));

CREATE POLICY "Users can update vulnerabilities for their assets"
  ON asset_vulnerabilities
  FOR UPDATE
  TO authenticated
  USING (asset_id IN (SELECT id FROM assets WHERE user_id = auth.uid()))
  WITH CHECK (asset_id IN (SELECT id FROM assets WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete vulnerabilities for their assets"
  ON asset_vulnerabilities
  FOR DELETE
  TO authenticated
  USING (asset_id IN (SELECT id FROM assets WHERE user_id = auth.uid()));

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER handle_assets_updated_at
  BEFORE UPDATE ON assets
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_asset_relationships_updated_at
  BEFORE UPDATE ON asset_relationships
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_asset_vulnerabilities_updated_at
  BEFORE UPDATE ON asset_vulnerabilities
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

