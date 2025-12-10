# Commit and Push Deployment Updates
# Date: December 2025
# Purpose: Commit all deployment-related changes and trigger Vercel redeploy

Write-Host "🚀 CyberSoluce - Commit and Push Deployment Updates" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is available
try {
    $gitVersion = git --version 2>&1
    Write-Host "✅ Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed or not in PATH" -ForegroundColor Red
    Write-Host "   Please install Git or add it to your PATH" -ForegroundColor Yellow
    Write-Host "   Download from: https://git-scm.com/downloads" -ForegroundColor Gray
    exit 1
}

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "❌ Not a git repository" -ForegroundColor Red
    Write-Host "   Please run this script from the repository root" -ForegroundColor Yellow
    exit 1
}

# Show current status
Write-Host "📋 Checking repository status..." -ForegroundColor Yellow
Write-Host ""
git status --short

Write-Host ""
$confirm = Read-Host "Do you want to commit and push these changes? (y/n)"

if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "❌ Cancelled" -ForegroundColor Yellow
    exit 0
}

# Add all changes
Write-Host ""
Write-Host "📦 Adding files to staging..." -ForegroundColor Yellow
git add .

# Show what will be committed
Write-Host ""
Write-Host "📝 Files to be committed:" -ForegroundColor Yellow
git status --short

Write-Host ""
$commitMessage = Read-Host "Enter commit message (or press Enter for default)"

if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = @"
feat: Add Vercel deployment configuration and documentation

- Add vercel.json with SPA routing and security headers
- Add comprehensive deployment documentation
- Add migration scripts and guides
- Add Supabase authentication configuration guides
- Update README with deployment information
- Add verification scripts for deployment

Completes Steps 3 & 4 of deployment checklist
"@
}

# Commit
Write-Host ""
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m $commitMessage

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Commit failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Changes committed" -ForegroundColor Green

# Check current branch
$currentBranch = git branch --show-current
Write-Host ""
Write-Host "🌿 Current branch: $currentBranch" -ForegroundColor Cyan

# Ask for confirmation before pushing
Write-Host ""
$pushConfirm = Read-Host "Push to remote repository? (y/n)"

if ($pushConfirm -ne "y" -and $pushConfirm -ne "Y") {
    Write-Host "⚠️  Changes committed locally but not pushed" -ForegroundColor Yellow
    Write-Host "   Run 'git push origin $currentBranch' to push manually" -ForegroundColor Gray
    exit 0
}

# Push
Write-Host ""
Write-Host "🚀 Pushing to remote repository..." -ForegroundColor Yellow
git push origin $currentBranch

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Push failed" -ForegroundColor Red
    Write-Host "   Check your git remote configuration" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "✅ Successfully pushed to remote repository!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Check Vercel dashboard for auto-deployment" -ForegroundColor White
Write-Host "   2. Verify build succeeds in Vercel" -ForegroundColor White
Write-Host "   3. Test deployed site" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Vercel Dashboard: https://vercel.com/dashboard" -ForegroundColor Gray
Write-Host ""

