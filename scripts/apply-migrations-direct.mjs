#!/usr/bin/env node
/**
 * Apply Database Migrations Directly to Supabase
 * Uses Supabase REST API to execute SQL statements
 */

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://dfklqsdfycwjlcasfciu.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY is required');
  process.exit(1);
}

console.log('🚀 Applying Database Migrations\n');
console.log(`📍 Supabase URL: ${SUPABASE_URL}\n`);

/**
 * Execute SQL using Supabase REST API
 */
async function executeSQL(sql) {
  try {
    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => {
        const trimmed = s.trim();
        return trimmed.length > 0 && 
               !trimmed.startsWith('--') && 
               !trimmed.startsWith('/*') &&
               !trimmed.match(/^\s*\/\*/) &&
               !trimmed.match(/^\s*\*\//);
      });

    const results = [];
    
    for (const statement of statements) {
      if (statement.length < 10) continue; // Skip very short statements
      
      try {
        // Use Supabase REST API to execute SQL via PostgREST
        // Note: Direct SQL execution requires using the Postgres connection
        // For now, we'll use the REST API with RPC if available
        
        // Try using the REST API with a custom RPC function
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({ query: statement })
        });

        if (response.ok) {
          results.push({ success: true, statement: statement.substring(0, 50) });
        } else {
          // If RPC doesn't exist, we need to use psql or manual method
          console.warn(`⚠️  Statement may need manual execution (RPC not available)`);
          results.push({ success: false, statement: statement.substring(0, 50) });
        }
      } catch (error) {
        // RPC method not available - need to use alternative
        results.push({ success: false, error: error.message });
      }
    }

    return results;
  } catch (error) {
    throw new Error(`SQL execution failed: ${error.message}`);
  }
}

/**
 * Apply migration file
 */
async function applyMigration(filePath, fileName) {
  console.log(`\n📄 Applying: ${fileName}`);
  console.log('─'.repeat(60));
  
  try {
    const sql = readFileSync(filePath, 'utf-8');
    const results = await executeSQL(sql);
    
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;
    
    if (successCount > 0) {
      console.log(`✅ Processed ${successCount} statements`);
    }
    if (failCount > 0) {
      console.log(`⚠️  ${failCount} statements need manual execution`);
    }
    
    // Since direct SQL execution via REST API is limited,
    // we'll provide the SQL for manual execution
    console.log(`\n📋 SQL Content (${(sql.length / 1024).toFixed(2)} KB):`);
    console.log('─'.repeat(60));
    console.log(sql.substring(0, 500) + (sql.length > 500 ? '...' : ''));
    console.log('─'.repeat(60));
    
    return { success: true, fileName, size: sql.length };
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return { success: false, fileName, error: error.message };
  }
}

/**
 * Main function
 */
async function runMigrations() {
  const migrationsDir = join(projectRoot, 'supabase', 'migrations');
  
  const migrationFiles = [
    '20250101000000_create_assets_table.sql',
    '20250115000000_create_signal_history.sql',
    '20250125000000_dependency_manager_features.sql',
    '20250801112702_cold_firefly.sql',
    '20250801114506_odd_flower.sql'
  ];
  
  console.log(`📁 Found ${migrationFiles.length} migration file(s)\n`);
  
  const results = [];
  
  for (let i = 0; i < migrationFiles.length; i++) {
    const fileName = migrationFiles[i];
    const filePath = join(migrationsDir, fileName);
    
    if (!readFileSync(filePath, 'utf-8')) {
      console.error(`❌ File not found: ${filePath}`);
      continue;
    }
    
    const result = await applyMigration(filePath, fileName);
    results.push(result);
    
    // Small delay between migrations
    if (i < migrationFiles.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Migration Summary');
  console.log('='.repeat(60));
  
  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;
  
  console.log(`✅ Successfully processed: ${successCount}`);
  console.log(`⚠️  Need manual execution: ${failCount}`);
  
  console.log('\n💡 Note: Due to Supabase security restrictions,');
  console.log('   migrations should be applied via Supabase Dashboard SQL Editor:');
  console.log(`   https://app.supabase.com/project/dfklqsdfycwjlcasfciu/sql/new\n`);
  
  // Save combined migration file for easy copy-paste
  const combinedSQL = results
    .filter(r => r.success)
    .map(r => {
      const filePath = join(migrationsDir, r.fileName);
      return `-- ${r.fileName}\n${readFileSync(filePath, 'utf-8')}\n`;
    })
    .join('\n-- ============================================================\n\n');
  
  const outputPath = join(projectRoot, 'ALL_MIGRATIONS_COMBINED.sql');
  require('fs').writeFileSync(outputPath, combinedSQL, 'utf-8');
  console.log(`📄 Combined migration file saved: ${outputPath}`);
  console.log('   You can copy this entire file to Supabase SQL Editor\n');
}

runMigrations().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

