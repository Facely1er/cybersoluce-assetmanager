# CyberSoluce-AssetManager - Netlify Deployment Script
# This script automates the Netlify deployment process

param(
    [string]$SupabaseUrl = "https://uvdrwbmhmtgacwzujfzc.supabase.co",
    [string]$SupabaseAnonKey = "",
    [switch]$SkipBuild = $false,
    [switch]$Preview = $false
)

Write-Host "🚀 CyberSoluce-AssetManager - Netlify Deployment" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Netlify CLI is installed
Write-Host "📦 Checking Netlify CLI installation..." -ForegroundColor Yellow
try {
    $netlifyVersion = netlify --version 2>&1
    Write-Host "✅ Netlify CLI found: $netlifyVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Netlify CLI not found. Installing..." -ForegroundColor Red
    npm install -g netlify-cli
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Netlify CLI" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Netlify CLI installed successfully" -ForegroundColor Green
}

# Check if logged in to Netlify
Write-Host ""
Write-Host "🔐 Checking Netlify authentication..." -ForegroundColor Yellow
try {
    $whoami = netlify status 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  Not logged in. Please login..." -ForegroundColor Yellow
        netlify login
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Login failed" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "✅ Already logged in to Netlify" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Please login to Netlify..." -ForegroundColor Yellow
    netlify login
}

# Get project root (parent of scripts directory)
$scriptPath = $MyInvocation.MyCommand.Path
if (-not $scriptPath) {
    $scriptPath = $PSCommandPath
}
if ($scriptPath) {
    $projectRoot = Split-Path -Parent (Split-Path -Parent $scriptPath)
} else {
    # Fallback: assume we're in the project root
    $projectRoot = Get-Location
}

# Navigate to project directory
Set-Location $projectRoot
Write-Host ""
Write-Host "📁 Project directory: $projectRoot" -ForegroundColor Cyan

# Build the project (unless skipped)
if (-not $SkipBuild) {
    Write-Host ""
    Write-Host "🔨 Building project..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Build failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Build completed successfully" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "⏭️  Skipping build (--SkipBuild flag set)" -ForegroundColor Yellow
}

# Check if .netlify folder exists (site already initialized)
if (-not (Test-Path ".netlify")) {
    Write-Host ""
    Write-Host "🔧 Initializing Netlify site..." -ForegroundColor Yellow
    Write-Host "   (This will prompt you to link to an existing site or create a new one)" -ForegroundColor Gray
    netlify init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Netlify initialization failed" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host ""
    Write-Host "✅ Netlify site already initialized" -ForegroundColor Green
}

# Set environment variables
Write-Host ""
Write-Host "🔐 Setting environment variables..." -ForegroundColor Yellow

if ($SupabaseAnonKey -eq "") {
    Write-Host "⚠️  Supabase Anon Key not provided. Please enter it:" -ForegroundColor Yellow
    $SupabaseAnonKey = Read-Host "Enter Supabase Anon Key"
}

$envVars = @{
    "VITE_SUPABASE_URL" = $SupabaseUrl
    "VITE_SUPABASE_ANON_KEY" = $SupabaseAnonKey
    "VITE_APP_ENV" = "production"
    "VITE_DEBUG_MODE" = "false"
    "VITE_ENABLE_ERROR_REPORTING" = "true"
}

foreach ($key in $envVars.Keys) {
    Write-Host "   Setting $key..." -ForegroundColor Gray
    netlify env:set $key $envVars[$key] --context production
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ $key set" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Failed to set $key (may already exist)" -ForegroundColor Yellow
    }
}

# Deploy
Write-Host ""
if ($Preview) {
    Write-Host "🚀 Deploying preview..." -ForegroundColor Yellow
    netlify deploy
} else {
    Write-Host "🚀 Deploying to production..." -ForegroundColor Yellow
    netlify deploy --prod
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Configure Supabase authentication redirect URLs" -ForegroundColor White
Write-Host "   2. Test the deployed site" -ForegroundColor White
Write-Host "   3. Set up custom domain (optional)" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Get your site URL:" -ForegroundColor Cyan
netlify status

