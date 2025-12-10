#!/usr/bin/env node
/**
 * Apply Supabase Migrations Directly
 * 
 * This script applies all migration files to the PostgreSQL database
 * using a direct connection string.
 * 
 * Usage: node scripts/apply-migrations-direct.mjs
 * 
 * Date: December 2025
 */

import { Client } from 'pg';
import { readFile, readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database connection string
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:K1551d0ug0u@db.dfklqsdfycwjlcasfciu.supabase.co:5432/postgres';

// Migration directory
const MIGRATIONS_DIR = join(__dirname, '..', 'supabase', 'migrations');

// Migration order (apply in this order)
const MIGRATION_ORDER = [
  '20250801112702_cold_firefly.sql',           // Reports table
  '20250801114506_odd_flower.sql',             // Organizations
  '20250125000000_dependency_manager_features.sql', // Core features
  '20250101000000_create_assets_table.sql',    // Assets table
  '20250115000000_create_signal_history.sql',  // Signal history
  '20250130000000_create_feedback_submissions.sql', // Feedback
  '20250130000001_fix_feedback_linter_issues.sql', // Feedback fixes
  '20250102000000_fix_linter_issues.sql',      // Linter fixes
  '20250102000001_fix_public_profiles_policies.sql', // Profile policies
  '20250102000002_consolidate_org_members_insert_policy.sql', // Org members
];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function createMigrationsTable(client) {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  
  await client.query(createTableSQL);
  log('✅ Migrations tracking table ready', 'green');
}

async function getAppliedMigrations(client) {
  const result = await client.query('SELECT version FROM schema_migrations ORDER BY version');
  return new Set(result.rows.map(row => row.version));
}

async function markMigrationApplied(client, version) {
  await client.query(
    'INSERT INTO schema_migrations (version) VALUES ($1) ON CONFLICT (version) DO NOTHING',
    [version]
  );
}

async function applyMigration(client, filename) {
  const filepath = join(MIGRATIONS_DIR, filename);
  const sql = await readFile(filepath, 'utf-8');
  
  log(`\n📄 Applying: ${filename}`, 'cyan');
  
  try {
    // Execute the migration
    await client.query(sql);
    await markMigrationApplied(client, filename);
    log(`✅ Successfully applied: ${filename}`, 'green');
    return true;
  } catch (error) {
    // Check if it's a "already exists" error (table/column already exists)
    if (error.message.includes('already exists') || 
        error.message.includes('duplicate key') ||
        error.message.includes('relation already exists')) {
      log(`⚠️  Migration already applied (skipping): ${filename}`, 'yellow');
      await markMigrationApplied(client, filename);
      return true;
    }
    
    log(`❌ Error applying ${filename}:`, 'red');
    log(`   ${error.message}`, 'red');
    throw error;
  }
}

async function main() {
  log('🚀 CyberSoluce Migration Application', 'cyan');
  log('=====================================', 'cyan');
  log('');
  
  // Parse connection string
  const url = new URL(DATABASE_URL);
  const client = new Client({
    host: url.hostname,
    port: parseInt(url.port) || 5432,
    database: url.pathname.slice(1) || 'postgres',
    user: url.username,
    password: url.password,
    ssl: {
      rejectUnauthorized: false // Supabase requires SSL but may have self-signed certs
    }
  });
  
  try {
    // Connect to database
    log('🔌 Connecting to database...', 'blue');
    await client.connect();
    log('✅ Connected successfully', 'green');
    
    // Create migrations tracking table
    await createMigrationsTable(client);
    
    // Get already applied migrations
    const appliedMigrations = await getAppliedMigrations(client);
    log(`📋 Found ${appliedMigrations.size} previously applied migrations`, 'blue');
    
    // Get all migration files
    const allFiles = await readdir(MIGRATIONS_DIR);
    const sqlFiles = allFiles.filter(f => f.endsWith('.sql')).sort();
    
    log(`\n📦 Found ${sqlFiles.length} migration files`, 'blue');
    
    // Apply migrations in order
    let applied = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const filename of MIGRATION_ORDER) {
      if (!sqlFiles.includes(filename)) {
        log(`⚠️  Migration file not found: ${filename}`, 'yellow');
        continue;
      }
      
      if (appliedMigrations.has(filename)) {
        log(`⏭️  Skipping (already applied): ${filename}`, 'yellow');
        skipped++;
        continue;
      }
      
      try {
        await applyMigration(client, filename);
        applied++;
      } catch (error) {
        errors++;
        log(`\n❌ Failed to apply migration: ${filename}`, 'red');
        log(`   Error: ${error.message}`, 'red');
        
        // Ask if we should continue
        log('\n⚠️  Migration failed. Check the error above.', 'yellow');
        log('   You may need to fix the migration or database state manually.', 'yellow');
        break; // Stop on error
      }
    }
    
    // Summary
    log('\n=====================================', 'cyan');
    log('📊 Migration Summary', 'cyan');
    log('=====================================', 'cyan');
    log(`✅ Applied: ${applied}`, 'green');
    log(`⏭️  Skipped: ${skipped}`, 'yellow');
    if (errors > 0) {
      log(`❌ Errors: ${errors}`, 'red');
    }
    log('');
    
    if (errors === 0) {
      log('🎉 All migrations completed successfully!', 'green');
    } else {
      log('⚠️  Some migrations failed. Please review the errors above.', 'yellow');
      process.exit(1);
    }
    
  } catch (error) {
    log('\n❌ Fatal error:', 'red');
    log(`   ${error.message}`, 'red');
    if (error.stack) {
      log(`\nStack trace:\n${error.stack}`, 'red');
    }
    process.exit(1);
  } finally {
    await client.end();
    log('\n🔌 Database connection closed', 'blue');
  }
}

// Run the script
main().catch(error => {
  log(`\n❌ Unhandled error: ${error.message}`, 'red');
  process.exit(1);
});
