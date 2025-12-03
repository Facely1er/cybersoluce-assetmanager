-- Migration 4
-- Source: 20250115000000_create_signal_history.sql
-- Copy this entire file to Supabase SQL Editor
-- URL: https://app.supabase.com/project/dfklqsdfycwjlcasfciu/sql/new

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

