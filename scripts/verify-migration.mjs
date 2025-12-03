#!/usr/bin/env node
/**
 * Verify Signal History Migration
 * 
 * This script verifies that the signal history migration was applied correctly.
 * 
 * Usage:
 *   node scripts/verify-migration.mjs
 * 
 * Environment Variables:
 *   VITE_SUPABASE_URL - Your Supabase project URL
 *   VITE_SUPABASE_ANON_KEY - Your Supabase anonymous key
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://dfklqsdfycwjlcasfciu.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRma2xxc2RmeWN3amxjYXNmY2l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzODA5OTcsImV4cCI6MjA3OTk1Njk5N30.OiaL5SkKnMlpdfW2Y2L-m2mzmCFA_LgpUq2-m8XF-yQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔍 Verifying Signal History Migration\n');
console.log(`📍 Supabase URL: ${SUPABASE_URL}\n`);

let allChecksPassed = true;

// Check 1: Verify asset_import_batch table exists
console.log('1️⃣  Checking asset_import_batch table...');
try {
  const { data, error } = await supabase
    .from('asset_import_batch')
    .select('*')
    .limit(1);
  
  if (error && error.code === '42P01') {
    console.log('   ❌ Table does not exist');
    allChecksPassed = false;
  } else if (error) {
    console.log(`   ⚠️  Error checking table: ${error.message}`);
    allChecksPassed = false;
  } else {
    console.log('   ✅ Table exists');
  }
} catch (err) {
  console.log(`   ❌ Error: ${err.message}`);
  allChecksPassed = false;
}

// Check 2: Verify signal_history table exists
console.log('\n2️⃣  Checking signal_history table...');
try {
  const { data, error } = await supabase
    .from('signal_history')
    .select('*')
    .limit(1);
  
  if (error && error.code === '42P01') {
    console.log('   ❌ Table does not exist');
    allChecksPassed = false;
  } else if (error) {
    console.log(`   ⚠️  Error checking table: ${error.message}`);
    allChecksPassed = false;
  } else {
    console.log('   ✅ Table exists');
  }
} catch (err) {
  console.log(`   ❌ Error: ${err.message}`);
  allChecksPassed = false;
}

// Check 3: Verify table structure (columns)
console.log('\n3️⃣  Checking table structure...');
try {
  // Check asset_import_batch columns
  const { data: batchData, error: batchError } = await supabase
    .from('asset_import_batch')
    .select('id, type, source_label, created_at, created_by')
    .limit(0);
  
  if (batchError && batchError.code !== 'PGRST116') {
    console.log(`   ⚠️  asset_import_batch structure issue: ${batchError.message}`);
    allChecksPassed = false;
  } else {
    console.log('   ✅ asset_import_batch has correct columns');
  }
  
  // Check signal_history columns
  const { data: historyData, error: historyError } = await supabase
    .from('signal_history')
    .select('id, asset_id, captured_at, source, signals_json, import_batch_id, created_at')
    .limit(0);
  
  if (historyError && historyError.code !== 'PGRST116') {
    console.log(`   ⚠️  signal_history structure issue: ${historyError.message}`);
    allChecksPassed = false;
  } else {
    console.log('   ✅ signal_history has correct columns');
  }
} catch (err) {
  console.log(`   ❌ Error: ${err.message}`);
  allChecksPassed = false;
}

// Check 4: Test insert (with rollback)
console.log('\n4️⃣  Testing insert permissions...');
try {
  // Test inserting into asset_import_batch
  const testBatch = {
    type: 'csv-assets',
    source_label: 'VERIFICATION_TEST',
    created_by: 'verification-script'
  };
  
  const { data: insertData, error: insertError } = await supabase
    .from('asset_import_batch')
    .insert(testBatch)
    .select()
    .single();
  
  if (insertError) {
    console.log(`   ⚠️  Insert test failed: ${insertError.message}`);
    if (insertError.code === '42501') {
      console.log('   ⚠️  RLS policy may not be configured correctly');
    }
    allChecksPassed = false;
  } else {
    console.log('   ✅ Insert permissions work');
    
    // Clean up test record
    if (insertData?.id) {
      await supabase
        .from('asset_import_batch')
        .delete()
        .eq('id', insertData.id);
      console.log('   ✅ Test record cleaned up');
    }
  }
} catch (err) {
  console.log(`   ❌ Error: ${err.message}`);
  allChecksPassed = false;
}

// Check 5: Verify RLS is enabled
console.log('\n5️⃣  Checking RLS status...');
console.log('   ℹ️  RLS status check requires service role key');
console.log('   ℹ️  Run the SQL query below in Supabase SQL Editor to verify');

// Summary
console.log('\n' + '='.repeat(60));
if (allChecksPassed) {
  console.log('✅ All basic checks passed!');
  console.log('\n📋 Next steps:');
  console.log('   1. Run the SQL verification queries below');
  console.log('   2. Set VITE_HISTORY_STORE_MODE=backend in .env.local');
  console.log('   3. Test CSV import and SBOM upload features');
} else {
  console.log('⚠️  Some checks failed. Please review the errors above.');
  console.log('\n💡 Run the SQL verification queries below for more details.');
}
console.log('='.repeat(60));

console.log('\n📝 SQL Verification Queries:');
console.log('\nRun these in Supabase SQL Editor:');
console.log('https://app.supabase.com/project/dfklqsdfycwjlcasfciu/sql/new\n');
console.log('-- Check tables exist');
console.log("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('asset_import_batch', 'signal_history');");
console.log('\n-- Check indexes');
console.log("SELECT indexname, indexdef FROM pg_indexes WHERE tablename IN ('asset_import_batch', 'signal_history');");
console.log('\n-- Check RLS policies');
console.log("SELECT tablename, policyname, permissive, roles, cmd FROM pg_policies WHERE tablename IN ('asset_import_batch', 'signal_history');");
console.log('\n-- Check RLS is enabled');
console.log("SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('asset_import_batch', 'signal_history');");

