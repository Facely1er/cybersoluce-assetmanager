# CyberSoluce-AssetManager - Setup Verification Script
# This script verifies all prerequisites and setup for deployment

Write-Host "🔍 CyberSoluce-AssetManager - Setup Verification" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Get project root (parent of scripts directory)
# Try multiple methods to get script path
$scriptPath = $null
if ($PSCommandPath) { $scriptPath = $PSCommandPath }
if (-not $scriptPath -and $MyInvocation.MyCommand.Path) { $scriptPath = $MyInvocation.MyCommand.Path }
if (-not $scriptPath -and $PSScriptRoot) { $scriptPath = Join-Path $PSScriptRoot "verify-setup.ps1" }

if ($scriptPath) {
    $projectRoot = Split-Path -Parent (Split-Path -Parent $scriptPath)
} else {
    # Fallback: use current directory (assume script is run from project root)
    $projectRoot = (Get-Location).Path
}
$allChecksPassed = $true

# Check Node.js version
Write-Host "📦 Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    $nodeMajor = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($nodeMajor -ge 18) {
        Write-Host "   ✅ Node.js $nodeVersion (Required: 18+)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Node.js $nodeVersion (Required: 18+)" -ForegroundColor Red
        $allChecksPassed = $false
    }
} catch {
    Write-Host "   ❌ Node.js not found" -ForegroundColor Red
    $allChecksPassed = $false
}

# Check npm version
Write-Host ""
Write-Host "📦 Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "   ✅ npm $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ npm not found" -ForegroundColor Red
    $allChecksPassed = $false
}

# Check if node_modules exists
Write-Host ""
Write-Host "📁 Checking dependencies..." -ForegroundColor Yellow
$nodeModulesPath = Join-Path $projectRoot "node_modules"
if (Test-Path $nodeModulesPath) {
    Write-Host "   ✅ node_modules directory exists" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  node_modules not found. Run: npm install" -ForegroundColor Yellow
}

# Check package.json
Write-Host ""
Write-Host "📄 Checking package.json..." -ForegroundColor Yellow
$packageJsonPath = Join-Path $projectRoot "package.json"
if (Test-Path $packageJsonPath) {
    Write-Host "   ✅ package.json found" -ForegroundColor Green
    $packageJson = Get-Content $packageJsonPath | ConvertFrom-Json
    Write-Host "   📦 Project: $($packageJson.name)" -ForegroundColor Gray
    Write-Host "   📦 Version: $($packageJson.version)" -ForegroundColor Gray
} else {
    Write-Host "   ❌ package.json not found" -ForegroundColor Red
    $allChecksPassed = $false
}

# Check migration files
Write-Host ""
Write-Host "🗄️  Checking migration files..." -ForegroundColor Yellow
$migrationsDir = Join-Path $projectRoot "supabase\migrations"
$requiredMigrations = @(
    "20250801112702_cold_firefly.sql",
    "20250801114506_odd_flower.sql",
    "20250125000000_dependency_manager_features.sql"
)

if (Test-Path $migrationsDir) {
    $missingMigrations = @()
    foreach ($migration in $requiredMigrations) {
        $migrationPath = Join-Path $migrationsDir $migration
        if (Test-Path $migrationPath) {
            Write-Host "   ✅ $migration" -ForegroundColor Green
        } else {
            Write-Host "   ❌ $migration (missing)" -ForegroundColor Red
            $missingMigrations += $migration
            $allChecksPassed = $false
        }
    }
} else {
    Write-Host "   ❌ Migrations directory not found" -ForegroundColor Red
    $allChecksPassed = $false
}

# Check netlify.toml
Write-Host ""
Write-Host "🌐 Checking Netlify configuration..." -ForegroundColor Yellow
$netlifyTomlPath = Join-Path $projectRoot "netlify.toml"
if (Test-Path $netlifyTomlPath) {
    Write-Host "   ✅ netlify.toml found" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  netlify.toml not found (optional)" -ForegroundColor Yellow
}

# Check vite.config.ts
Write-Host ""
Write-Host "⚙️  Checking Vite configuration..." -ForegroundColor Yellow
$viteConfigPath = Join-Path $projectRoot "vite.config.ts"
if (Test-Path $viteConfigPath) {
    Write-Host "   ✅ vite.config.ts found" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  vite.config.ts not found" -ForegroundColor Yellow
}

# Check if dist folder exists (build output)
Write-Host ""
Write-Host "📦 Checking build output..." -ForegroundColor Yellow
$distPath = Join-Path $projectRoot "dist"
if (Test-Path $distPath) {
    $distFiles = Get-ChildItem $distPath -Recurse | Measure-Object
    Write-Host "   ✅ dist folder exists ($($distFiles.Count) files)" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  dist folder not found. Run: npm run build" -ForegroundColor Yellow
}

# Check Netlify CLI
Write-Host ""
Write-Host "🔧 Checking Netlify CLI..." -ForegroundColor Yellow
try {
    $netlifyVersion = netlify --version 2>&1
    Write-Host "   ✅ Netlify CLI installed: $netlifyVersion" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Netlify CLI not installed. Install with: npm install -g netlify-cli" -ForegroundColor Yellow
}

# Check Git
Write-Host ""
Write-Host "🔧 Checking Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "   ✅ Git installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Git not found (optional for CLI deployment)" -ForegroundColor Yellow
}

# Summary
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
if ($allChecksPassed) {
    Write-Host "✅ All critical checks passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Ready to deploy!" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "   1. Run: .\scripts\prepare-migrations.ps1" -ForegroundColor White
    Write-Host "   2. Apply migrations to Supabase" -ForegroundColor White
    Write-Host "   3. Run: .\scripts\deploy-to-netlify.ps1" -ForegroundColor White
} else {
    Write-Host "❌ Some checks failed. Please fix the issues above." -ForegroundColor Red
    Write-Host ""
    Write-Host "Common fixes:" -ForegroundColor Yellow
    Write-Host "   - Install Node.js 18+: https://nodejs.org" -ForegroundColor White
    Write-Host "   - Run: npm install" -ForegroundColor White
    Write-Host "   - Run: npm run build" -ForegroundColor White
}
Write-Host ""

