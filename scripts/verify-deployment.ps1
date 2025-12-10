# CyberSoluce Deployment Verification Script
# Date: December 2025
# Purpose: Verify deployment configuration and readiness

Write-Host "🚀 CyberSoluce Deployment Verification" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.example exists
Write-Host "📋 Checking Environment Configuration..." -ForegroundColor Yellow
if (Test-Path ".env.example") {
    Write-Host "✅ .env.example exists" -ForegroundColor Green
} else {
    Write-Host "❌ .env.example not found" -ForegroundColor Red
    exit 1
}

# Check if netlify.toml exists
Write-Host "📋 Checking Deployment Configuration..." -ForegroundColor Yellow
if (Test-Path "netlify.toml") {
    Write-Host "✅ netlify.toml exists" -ForegroundColor Green
} else {
    Write-Host "❌ netlify.toml not found" -ForegroundColor Red
    exit 1
}

# Check if migration files exist
Write-Host "📋 Checking Migration Files..." -ForegroundColor Yellow
$migrationDir = "supabase\migrations"
if (Test-Path $migrationDir) {
    $migrations = Get-ChildItem -Path $migrationDir -Filter "*.sql"
    Write-Host "✅ Found $($migrations.Count) migration files" -ForegroundColor Green
    foreach ($migration in $migrations) {
        Write-Host "   - $($migration.Name)" -ForegroundColor Gray
    }
} else {
    Write-Host "❌ Migration directory not found" -ForegroundColor Red
    exit 1
}

# Check if package.json exists
Write-Host "📋 Checking Build Configuration..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    Write-Host "✅ package.json exists" -ForegroundColor Green
    
    # Check for required scripts
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    $requiredScripts = @("build", "dev", "preview")
    foreach ($script in $requiredScripts) {
        if ($packageJson.scripts.$script) {
            Write-Host "   ✅ Script '$script' found" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  Script '$script' not found" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "❌ package.json not found" -ForegroundColor Red
    exit 1
}

# Check if node_modules exists (optional)
Write-Host "📋 Checking Dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✅ node_modules exists (dependencies installed)" -ForegroundColor Green
} else {
    Write-Host "⚠️  node_modules not found (run 'npm install' first)" -ForegroundColor Yellow
}

# Check if dist directory exists (optional)
Write-Host "📋 Checking Build Output..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Write-Host "✅ dist directory exists (build completed)" -ForegroundColor Green
} else {
    Write-Host "⚠️  dist directory not found (run 'npm run build' first)" -ForegroundColor Yellow
}

# Check for required files
Write-Host "📋 Checking Required Files..." -ForegroundColor Yellow
$requiredFiles = @(
    "index.html",
    "vite.config.ts",
    "tsconfig.json",
    "tailwind.config.js"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "   ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $file not found" -ForegroundColor Red
    }
}

# Check deployment checklist
Write-Host "📋 Checking Documentation..." -ForegroundColor Yellow
if (Test-Path "DEPLOYMENT_CHECKLIST.md") {
    Write-Host "✅ DEPLOYMENT_CHECKLIST.md exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  DEPLOYMENT_CHECKLIST.md not found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "✅ Verification Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Review DEPLOYMENT_CHECKLIST.md" -ForegroundColor White
Write-Host "2. Apply Supabase migrations" -ForegroundColor White
Write-Host "3. Set environment variables in Netlify/Vercel" -ForegroundColor White
Write-Host "4. Deploy to hosting platform" -ForegroundColor White
Write-Host ""

