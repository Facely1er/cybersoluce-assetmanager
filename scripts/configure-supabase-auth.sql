-- Supabase Authentication Configuration Script
-- Date: December 2025
-- 
-- This script helps configure Supabase authentication settings
-- Run this in Supabase SQL Editor: https://app.supabase.com/project/dfklqsdfycwjlcasfciu/sql/new
--
-- IMPORTANT: Replace YOUR_DEPLOYMENT_URL with your actual Netlify/Vercel deployment URL

-- Step 1: Update Site URL (run this after deployment)
-- Note: This needs to be done via Supabase Dashboard UI, not SQL
-- Go to: https://app.supabase.com/project/dfklqsdfycwjlcasfciu/auth/url-configuration
-- Set Site URL to: https://YOUR_DEPLOYMENT_URL.netlify.app

-- Step 2: Add Redirect URLs (also via Dashboard UI)
-- Add these redirect URLs:
-- - https://YOUR_DEPLOYMENT_URL.netlify.app/**
-- - https://YOUR_DEPLOYMENT_URL.netlify.app/auth/callback
-- - https://YOUR_DEPLOYMENT_URL.netlify.app/*

-- Step 3: Verify Auth Configuration
-- Check that auth is properly configured
SELECT 
  'Auth Configuration Check' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM auth.config 
      WHERE key = 'SITE_URL'
    ) THEN 'Site URL configured'
    ELSE 'Site URL needs configuration'
  END as status;

-- Step 4: Verify Email Provider
-- Check if email provider is enabled
SELECT 
  'Email Provider' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM auth.config 
      WHERE key LIKE '%EMAIL%'
    ) THEN 'Email provider configured'
    ELSE 'Email provider needs configuration'
  END as status;

-- Step 5: List all auth providers
SELECT 
  provider,
  enabled,
  settings
FROM auth.providers
ORDER BY provider;

-- Step 6: Verify RLS policies on auth-related tables
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'auth'
ORDER BY tablename, policyname;

-- Step 7: Check user profiles table RLS
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'profiles';

-- Step 8: Verify profiles table policies
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'profiles'
ORDER BY policyname;

-- Note: Most auth configuration must be done via Supabase Dashboard UI
-- This SQL script is for verification only

