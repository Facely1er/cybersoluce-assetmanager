# CyberSoluce Deployment Verification Script
# Date: December 2025
# Purpose: Verify deployment and authentication configuration

param(
    [string]$DeploymentUrl = "",
    [string]$SupabaseUrl = "https://dfklqsdfycwjlcasfciu.supabase.co"
)

Write-Host "🚀 CyberSoluce Deployment Verification" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

if ([string]::IsNullOrEmpty($DeploymentUrl)) {
    $DeploymentUrl = Read-Host "Enter your deployment URL (e.g., https://your-project.vercel.app)"
}

Write-Host "📋 Verifying Deployment Configuration..." -ForegroundColor Yellow
Write-Host ""

# Check deployment URL format
if ($DeploymentUrl -match "^https://.*\.(netlify\.app|vercel\.app)$") {
    Write-Host "✅ Deployment URL format is valid: $DeploymentUrl" -ForegroundColor Green
} else {
    Write-Host "⚠️  Deployment URL format may be incorrect: $DeploymentUrl" -ForegroundColor Yellow
    Write-Host "   Expected format: https://your-project.vercel.app" -ForegroundColor Gray
}

# Test if deployment is accessible
Write-Host ""
Write-Host "🌐 Testing Deployment Accessibility..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $DeploymentUrl -Method Get -TimeoutSec 10 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Deployment is accessible (HTTP $($response.StatusCode))" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Deployment returned HTTP $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Cannot access deployment: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Verify the URL is correct and deployment is complete" -ForegroundColor Gray
}

# Check for environment variables file
Write-Host ""
Write-Host "📋 Checking Environment Configuration..." -ForegroundColor Yellow
if (Test-Path ".env.example") {
    Write-Host "✅ .env.example exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env.example not found" -ForegroundColor Yellow
}

# Verify Supabase URL
Write-Host ""
Write-Host "🔗 Verifying Supabase Configuration..." -ForegroundColor Yellow
Write-Host "   Supabase URL: $SupabaseUrl" -ForegroundColor Gray

try {
    $supabaseResponse = Invoke-WebRequest -Uri "$SupabaseUrl/rest/v1/" -Method Get -TimeoutSec 10 -UseBasicParsing -Headers @{"apikey" = "test"}
    Write-Host "✅ Supabase is accessible" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not verify Supabase accessibility" -ForegroundColor Yellow
    Write-Host "   This is normal if API key is required" -ForegroundColor Gray
}

# Check authentication callback URL
Write-Host ""
Write-Host "🔐 Verifying Authentication Configuration..." -ForegroundColor Yellow
$callbackUrl = "$DeploymentUrl/auth/callback"
Write-Host "   Callback URL: $callbackUrl" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠️  Manual Verification Required:" -ForegroundColor Yellow
Write-Host "   1. Go to: https://app.supabase.com/project/dfklqsdfycwjlcasfciu/auth/url-configuration" -ForegroundColor White
Write-Host "   2. Verify Site URL is set to: $DeploymentUrl" -ForegroundColor White
Write-Host "   3. Verify these Redirect URLs are added:" -ForegroundColor White
Write-Host "      - $DeploymentUrl/**" -ForegroundColor Gray
Write-Host "      - $callbackUrl" -ForegroundColor Gray
Write-Host "      - $DeploymentUrl/*" -ForegroundColor Gray

# Summary
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "📊 Verification Summary" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Verify deployment is accessible" -ForegroundColor White
Write-Host "   2. Configure Supabase authentication (see configure-supabase-auth.md)" -ForegroundColor White
Write-Host "   3. Test authentication flow on deployed site" -ForegroundColor White
Write-Host "   4. Verify all features work correctly" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "   - Deployment: scripts/deploy-to-netlify.md" -ForegroundColor White
Write-Host "   - Auth Config: scripts/configure-supabase-auth.md" -ForegroundColor White
Write-Host ""

