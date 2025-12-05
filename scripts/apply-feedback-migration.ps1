# Apply Feedback Submissions Migration
# This script applies the feedback_submissions table migration

param(
    [string]$DatabaseUrl = ""
)

Write-Host "🗄️  Applying Feedback Submissions Migration" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Get database URL from parameter or environment variable
if ([string]::IsNullOrEmpty($DatabaseUrl)) {
    $DatabaseUrl = $env:DATABASE_URL
    if ([string]::IsNullOrEmpty($DatabaseUrl)) {
        Write-Host "❌ Database URL not provided!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Please provide database URL:" -ForegroundColor Yellow
        Write-Host "  1. As parameter: -DatabaseUrl 'postgresql://user:pass@host:port/db'" -ForegroundColor White
        Write-Host "  2. Or set environment variable: `$env:DATABASE_URL = 'postgresql://...'" -ForegroundColor White
        Write-Host ""
        Write-Host "Get connection string from Supabase Dashboard:" -ForegroundColor Cyan
        Write-Host "  https://app.supabase.com/project/_/settings/database" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Or apply manually via Supabase SQL Editor:" -ForegroundColor Yellow
        Write-Host "  https://app.supabase.com/project/_/sql/new" -ForegroundColor Cyan
        exit 1
    }
}

# Get project root
$currentDir = (Get-Location).Path
if ($currentDir -like "*\scripts") {
    $projectRoot = Split-Path -Parent $currentDir
} else {
    $projectRoot = $currentDir
}

$migrationFile = Join-Path $projectRoot "supabase\migrations\20250130000000_create_feedback_submissions.sql"

if (-not (Test-Path $migrationFile)) {
    Write-Host "❌ Migration file not found: $migrationFile" -ForegroundColor Red
    exit 1
}

Write-Host "📄 Migration file: $migrationFile" -ForegroundColor Gray
Write-Host ""

# Test database connection
Write-Host "🔌 Testing database connection..." -ForegroundColor Yellow
try {
    $testResult = psql $DatabaseUrl -c "SELECT version();" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database connection successful" -ForegroundColor Green
    } else {
        Write-Host "❌ Database connection failed" -ForegroundColor Red
        Write-Host $testResult
        exit 1
    }
} catch {
    Write-Host "❌ Error connecting to database: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🚀 Applying migration..." -ForegroundColor Yellow
Write-Host ""

# Apply migration
try {
    $result = psql $DatabaseUrl -f $migrationFile 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Migration applied successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Verifying table creation..." -ForegroundColor Yellow
        
        # Verify table exists
        $verifyResult = psql $DatabaseUrl -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'feedback_submissions';" 2>&1
        if ($verifyResult -match "feedback_submissions") {
            Write-Host "✅ Table 'feedback_submissions' created successfully!" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Table verification inconclusive. Please check manually." -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Migration failed!" -ForegroundColor Red
        Write-Host $result
        exit 1
    }
} catch {
    Write-Host "❌ Error applying migration: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Migration complete!" -ForegroundColor Green

