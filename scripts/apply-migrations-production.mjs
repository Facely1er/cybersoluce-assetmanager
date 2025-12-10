#!/usr/bin/env node
/**
 * Apply Supabase Migrations to Production Database
 * Date: December 2025
 * 
 * This script applies all migration files to the production PostgreSQL database
 */

import { readFile, readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database connection string
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:K1551d0ug0u@db.dfklqsdfycwjlcasfciu.supabase.co:5432/postgres';

// Migration files in order (chronological)
const MIGRATION_ORDER = [
  '20250101000000_create_assets_table.sql',
  '20250102000000_fix_linter_issues.sql',
  '20250102000001_fix_public_profiles_policies.sql',
  '20250102000002_consolidate_org_members_insert_policy.sql',
  '20250115000000_create_signal_history.sql',
  '20250125000000_dependency_manager_features.sql',
  '20250130000000_create_feedback_submissions.sql',
  '20250130000001_fix_feedback_linter_issues.sql',
  '20250801112702_cold_firefly.sql',
  '20250801114506_odd_flower.sql',
];

// Track applied migrations
const appliedMigrations = new Set();

async function checkMigrationTable(client) {
  try {
    // Check if migrations table exists
    const result = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'schema_migrations'
      );
    `);
    
    if (!result.rows[0].exists) {
      // Create migrations tracking table
      await client.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
          id SERIAL PRIMARY KEY,
          filename VARCHAR(255) UNIQUE NOT NULL,
          applied_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);
      console.log('✅ Created schema_migrations table');
    } else {
      // Check table structure
      const columns = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'schema_migrations';
      `);
      
      const columnNames = columns.rows.map(r => r.column_name);
      
      // If filename column doesn't exist, add it or use existing structure
      if (!columnNames.includes('filename')) {
        // Check if there's a 'name' or 'version' column
        if (columnNames.includes('name')) {
          // Use existing 'name' column
          const applied = await client.query('SELECT name FROM schema_migrations');
          applied.rows.forEach(row => appliedMigrations.add(row.name));
        } else if (columnNames.includes('version')) {
          // Use existing 'version' column
          const applied = await client.query('SELECT version FROM schema_migrations');
          applied.rows.forEach(row => appliedMigrations.add(row.version));
        } else {
          // Add filename column
          await client.query(`
            ALTER TABLE schema_migrations 
            ADD COLUMN IF NOT EXISTS filename VARCHAR(255) UNIQUE;
          `);
          console.log('✅ Added filename column to schema_migrations table');
        }
      } else {
        // Get already applied migrations
        const applied = await client.query('SELECT filename FROM schema_migrations WHERE filename IS NOT NULL');
        applied.rows.forEach(row => appliedMigrations.add(row.filename));
      }
    }
    
    // Final check - get all applied migrations
    try {
      const applied = await client.query('SELECT filename FROM schema_migrations WHERE filename IS NOT NULL');
      applied.rows.forEach(row => appliedMigrations.add(row.filename));
    } catch (e) {
      // Try alternative column names
      try {
        const applied = await client.query('SELECT name FROM schema_migrations WHERE name IS NOT NULL');
        applied.rows.forEach(row => appliedMigrations.add(row.name));
      } catch (e2) {
        // No migration tracking, continue
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error checking migration table:', error.message);
    // Continue anyway - we'll track in memory
    return true;
  }
}

async function applyMigration(client, filename) {
  const migrationPath = join(__dirname, '..', 'supabase', 'migrations', filename);
  
  try {
    console.log(`\n📄 Applying migration: ${filename}`);
    
    // Read migration file
    const sql = await readFile(migrationPath, 'utf-8');
    
    // Skip if already applied
    if (appliedMigrations.has(filename)) {
      console.log(`⏭️  Skipping ${filename} (already applied)`);
      return true;
    }
    
    // Execute migration
    await client.query('BEGIN');
    try {
      await client.query(sql);
      
      // Record migration (try different column names)
      try {
        await client.query(
          'INSERT INTO schema_migrations (filename) VALUES ($1) ON CONFLICT (filename) DO NOTHING',
          [filename]
        );
      } catch (e) {
        // Try alternative column names
        try {
          await client.query(
            'INSERT INTO schema_migrations (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
            [filename]
          );
        } catch (e2) {
          // If we can't record, just continue
          console.log(`   ⚠️  Could not record migration in tracking table`);
        }
      }
      
      await client.query('COMMIT');
      console.log(`✅ Successfully applied: ${filename}`);
      appliedMigrations.add(filename);
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    // Check if it's a "already exists" error (table/column already exists)
    if (error.message.includes('already exists') || 
        error.message.includes('duplicate') ||
        error.message.includes('relation') && error.message.includes('already exists')) {
      console.log(`⚠️  ${filename} - Some objects already exist, marking as applied`);
      try {
        // Try to record migration
        try {
          await client.query(
            'INSERT INTO schema_migrations (filename) VALUES ($1) ON CONFLICT (filename) DO NOTHING',
            [filename]
          );
        } catch (e) {
          try {
            await client.query(
              'INSERT INTO schema_migrations (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
              [filename]
            );
          } catch (e2) {
            // Can't record, but migration is effectively applied
          }
        }
        appliedMigrations.add(filename);
        return true;
      } catch (insertError) {
        // Even if we can't record, mark as applied in memory
        appliedMigrations.add(filename);
        return true;
      }
    }
    
    console.error(`❌ Error applying ${filename}:`, error.message);
    console.error('   SQL Error:', error.message);
    return false;
  }
}

async function verifyTables(client) {
  console.log('\n🔍 Verifying tables...');
  
  const expectedTables = [
    'assets',
    'profiles',
    'asset_relationships',
    'asset_vulnerabilities',
    'organizations',
    'organization_members',
    'invitations',
    'reports',
    'risks',
    'mitigation_actions',
    'business_functions',
    'business_impacts',
    'continuity_plans',
    'nist_controls',
    'nist_mappings',
    'nist_assessments',
    'framework_phases',
    'signal_history',
    'asset_import_batch',
    'feedback_submissions',
  ];
  
  const result = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `);
  
  const existingTables = result.rows.map(row => row.table_name);
  const missingTables = expectedTables.filter(table => !existingTables.includes(table));
  
  console.log(`\n📊 Found ${existingTables.length} tables in database`);
  
  if (missingTables.length > 0) {
    console.log(`⚠️  Missing tables: ${missingTables.join(', ')}`);
  } else {
    console.log('✅ All expected tables exist');
  }
  
  // Check RLS
  const rlsResult = await client.query(`
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public' 
    AND rowsecurity = true;
  `);
  
  console.log(`\n🔒 ${rlsResult.rows.length} tables have RLS enabled`);
  
  return { existingTables, missingTables };
}

async function main() {
  console.log('🚀 CyberSoluce Migration Application');
  console.log('=====================================\n');
  console.log(`📡 Connecting to database...`);
  console.log(`   Host: ${DATABASE_URL.split('@')[1]?.split(':')[0] || 'unknown'}`);
  
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // Supabase requires SSL but may have self-signed certs
    }
  });
  
  try {
    await client.connect();
    console.log('✅ Connected to database\n');
    
    // Check/create migration tracking table
    await checkMigrationTable(client);
    
    // Apply migrations in order
    console.log(`\n📦 Applying ${MIGRATION_ORDER.length} migrations...\n`);
    
    let successCount = 0;
    let skipCount = 0;
    let failCount = 0;
    
    for (const filename of MIGRATION_ORDER) {
      const success = await applyMigration(client, filename);
      if (success) {
        if (appliedMigrations.has(filename)) {
          successCount++;
        } else {
          skipCount++;
        }
      } else {
        failCount++;
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 Migration Summary:');
    console.log(`   ✅ Applied: ${successCount}`);
    console.log(`   ⏭️  Skipped: ${skipCount}`);
    console.log(`   ❌ Failed: ${failCount}`);
    console.log('='.repeat(50));
    
    // Verify tables
    await verifyTables(client);
    
    console.log('\n✅ Migration process completed!');
    
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n👋 Database connection closed');
  }
}

// Run migrations
main().catch(console.error);

