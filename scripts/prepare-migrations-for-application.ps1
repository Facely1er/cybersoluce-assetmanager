# Prepare Migrations for Application
# This script prepares all migration files in the correct order for manual application

$projectRoot = (Get-Location).Path
$migrationsDir = Join-Path $projectRoot "supabase\migrations"
$outputDir = Join-Path $projectRoot "migrations-ready"

Write-Host "📋 Preparing Database Migrations" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Create output directory
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
    Write-Host "✅ Created output directory: $outputDir" -ForegroundColor Green
}

# Migration files in correct order
$migrations = @(
    @{
        File = "20250101000000_create_assets_table.sql"
        Name = "Migration 1: Core Assets & Profiles"
        Description = "Creates profiles, assets, asset_relationships, and asset_vulnerabilities tables"
    },
    @{
        File = "20250115000000_create_signal_history.sql"
        Name = "Migration 2: Signal History"
        Description = "Creates asset_import_batch and signal_history tables for time-series tracking"
    },
    @{
        File = "20250125000000_dependency_manager_features.sql"
        Name = "Migration 3: Dependency Manager Features"
        Description = "Creates mitigation_actions, business_functions, business_impacts, continuity_plans, nist_controls, nist_mappings, nist_assessments, framework_phases, and risks tables"
    },
    @{
        File = "20250801112702_cold_firefly.sql"
        Name = "Migration 4: Reports System"
        Description = "Creates reports table for automated reporting"
    },
    @{
        File = "20250801114506_odd_flower.sql"
        Name = "Migration 5: Organizations & Multi-tenancy"
        Description = "Creates organizations, organization_members, and invitations tables"
    }
)

Write-Host "📁 Migration Files:" -ForegroundColor Yellow
Write-Host ""

$index = 1
$allMigrationsContent = @"
-- ============================================================
-- CyberSoluce Asset Manager - Database Migrations
-- ============================================================
-- Apply these migrations in order via Supabase Dashboard SQL Editor
-- URL: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/sql/new
-- ============================================================
-- 
-- Migration Order:
--   1. Core Assets & Profiles
--   2. Signal History
--   3. Dependency Manager Features
--   4. Reports System
--   5. Organizations & Multi-tenancy
--
-- All migrations use IF NOT EXISTS, so safe to re-run
-- ============================================================

"@

foreach ($migration in $migrations) {
    $migrationPath = Join-Path $migrationsDir $migration.File
    
    if (-not (Test-Path $migrationPath)) {
        Write-Host "  [$index/5] ❌ NOT FOUND: $($migration.File)" -ForegroundColor Red
        $index++
        continue
    }
    
    $fileInfo = Get-Item $migrationPath
    $sizeKB = [math]::Round($fileInfo.Length / 1KB, 2)
    $lineCount = (Get-Content $migrationPath | Measure-Object -Line).Lines
    
    Write-Host "  [$index/5] ✅ $($migration.Name)" -ForegroundColor Green
    Write-Host "       File: $($migration.File)" -ForegroundColor Gray
    Write-Host "       Size: $sizeKB KB | Lines: $lineCount" -ForegroundColor Gray
    Write-Host "       Description: $($migration.Description)" -ForegroundColor Gray
    Write-Host ""
    
    # Copy to output directory
    $outputFile = Join-Path $outputDir $migration.File
    Copy-Item $migrationPath $outputFile -Force
    
    # Add to combined file
    $migrationContent = Get-Content $migrationPath -Raw
    $allMigrationsContent += @"

-- ============================================================
-- Migration $index : $($migration.Name)
-- File: $($migration.File)
-- ============================================================

$migrationContent

"@
    
    $index++
}

# Save combined migration file
$combinedFile = Join-Path $outputDir "ALL_MIGRATIONS_COMBINED.sql"
$allMigrationsContent | Out-File -FilePath $combinedFile -Encoding UTF8

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "✅ Migration Preparation Complete" -ForegroundColor Green
Write-Host ""
Write-Host "📁 Output Location: $outputDir" -ForegroundColor Yellow
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Option 1: Apply Individual Migrations (Recommended)" -ForegroundColor Yellow
Write-Host "  1. Go to: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/sql/new" -ForegroundColor White
Write-Host "  2. Open each migration file from: $outputDir" -ForegroundColor White
Write-Host "  3. Copy and paste into SQL Editor" -ForegroundColor White
Write-Host "  4. Click 'Run' for each migration in order" -ForegroundColor White
Write-Host ""
Write-Host "Option 2: Apply All Migrations at Once" -ForegroundColor Yellow
Write-Host "  1. Go to: https://app.supabase.com/project/uvdrwbmhmtgacwzujfzc/sql/new" -ForegroundColor White
Write-Host "  2. Open: $combinedFile" -ForegroundColor White
Write-Host "  3. Copy entire contents and paste into SQL Editor" -ForegroundColor White
Write-Host "  4. Click 'Run' to apply all migrations" -ForegroundColor White
Write-Host ""
Write-Host "📝 Files Prepared:" -ForegroundColor Cyan
Get-ChildItem $outputDir -Filter "*.sql" | ForEach-Object {
    $sizeKB = [math]::Round($_.Length / 1KB, 2)
    Write-Host "  - $($_.Name) ($sizeKB KB)" -ForegroundColor Gray
}
Write-Host ""

