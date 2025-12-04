# Apply Linter Fixes via psql
# Uses PostgreSQL connection string to apply migration fixes

$connectionString = "postgresql://postgres:K1551d0ug0u@db.dfklqsdfycwjlcasfciu.supabase.co:5432/postgres"
$migrationFile = "supabase\migrations\20250102000000_fix_linter_issues.sql"

Write-Host "`n🔧 Applying Supabase Linter Fixes via psql`n" -ForegroundColor Cyan

# Check if psql is available
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psqlPath) {
    Write-Host "❌ Error: psql not found in PATH" -ForegroundColor Red
    Write-Host "`nPlease install PostgreSQL client or add psql to your PATH" -ForegroundColor Yellow
    Write-Host "Download: https://www.postgresql.org/download/windows/" -ForegroundColor Gray
    exit 1
}

# Check if migration file exists
if (-not (Test-Path $migrationFile)) {
    Write-Host "❌ Error: Migration file not found: $migrationFile" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found migration file: $migrationFile" -ForegroundColor Green
Write-Host "📍 Connection: db.dfklqsdfycwjlcasfciu.supabase.co:5432/postgres`n" -ForegroundColor Gray

# Apply the migration
Write-Host "🚀 Applying linter fixes...`n" -ForegroundColor Yellow

try {
    $env:PGPASSWORD = "K1551d0ug0u"
    $result = & psql $connectionString -f $migrationFile 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Linter fixes applied successfully!`n" -ForegroundColor Green
        Write-Host "📊 Summary of fixes:" -ForegroundColor Cyan
        Write-Host "   - Function search_path security (3 functions)" -ForegroundColor White
        Write-Host "   - Auth RLS performance optimization" -ForegroundColor White
        Write-Host "   - Multiple permissive policies consolidated" -ForegroundColor White
        Write-Host "   - Profiles RLS policies verified`n" -ForegroundColor White
    } else {
        Write-Host "`n❌ Error applying fixes. Exit code: $LASTEXITCODE`n" -ForegroundColor Red
        Write-Host $result -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "`n❌ Error: $_`n" -ForegroundColor Red
    exit 1
} finally {
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
}

Write-Host "✅ Done!`n" -ForegroundColor Green

