#!/usr/bin/env node
/**
 * Apply Linter Fixes to Supabase Database
 * Uses Supabase Management API to execute SQL
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://dfklqsdfycwjlcasfciu.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY is required');
  console.error('\nSet it as:');
  console.error('  $env:SUPABASE_SERVICE_ROLE_KEY = "your-service-role-key"');
  process.exit(1);
}

console.log('🔧 Applying Supabase Linter Fixes\n');
console.log(`📍 Supabase URL: ${SUPABASE_URL}\n`);

/**
 * Execute SQL using Supabase Management API
 */
async function executeSQL(sql) {
  try {
    // Use Supabase Management API to execute SQL
    // Note: This requires the Management API which may not be directly accessible
    // Alternative: Use psql or Supabase Dashboard
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ query: sql })
    });

    if (response.ok) {
      return { success: true };
    } else {
      const errorText = await response.text();
      throw new Error(`SQL execution failed: ${response.status} ${errorText}`);
    }
  } catch (error) {
    // Management API may not be available - provide manual instructions
    throw error;
  }
}

/**
 * Main function
 */
async function applyFixes() {
  const migrationFile = join(projectRoot, 'supabase', 'migrations', '20250102000000_fix_linter_issues.sql');
  
  try {
    const sql = readFileSync(migrationFile, 'utf-8');
    
    console.log('📄 Migration file loaded');
    console.log(`   Size: ${(sql.length / 1024).toFixed(2)} KB\n`);
    
    console.log('⚠️  Note: Direct SQL execution via REST API is limited.');
    console.log('   The fix migration needs to be applied via Supabase Dashboard.\n');
    
    console.log('📋 To apply the fix:\n');
    console.log('   1. Go to: https://app.supabase.com/project/dfklqsdfycwjlcasfciu/sql/new');
    console.log('   2. Open: supabase/migrations/20250102000000_fix_linter_issues.sql');
    console.log('   3. Copy entire contents and paste into SQL Editor');
    console.log('   4. Click "Run" to apply fixes\n');
    
    console.log('✅ Fix migration file is ready to apply\n');
    console.log('🔍 Issues that will be fixed:');
    console.log('   - Function search_path security (3 functions)');
    console.log('   - Auth RLS performance optimization');
    console.log('   - Multiple permissive policies consolidation');
    console.log('   - Profiles RLS policies verification\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

applyFixes().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

