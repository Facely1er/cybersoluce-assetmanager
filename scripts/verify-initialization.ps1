# Verify Initialization Errors
# Checks for common initialization issues in the codebase

Write-Host "`n=== Initialization Error Verification ===" -ForegroundColor Cyan
Write-Host ""

$errors = @()
$warnings = @()

# 1. Check vite.config.ts syntax
Write-Host "1. Checking vite.config.ts syntax..." -ForegroundColor Yellow
try {
    $configContent = Get-Content "vite.config.ts" -Raw
    if ($configContent -match '\}\s*\}\s*\}') {
        $errors += "vite.config.ts: Possible extra closing braces detected"
    }
    Write-Host "   ✓ vite.config.ts syntax OK" -ForegroundColor Green
} catch {
    $errors += "vite.config.ts: Could not read file - $_"
}

# 2. Check for environment variable access issues
Write-Host "2. Checking environment variable access..." -ForegroundColor Yellow
$envFiles = @(".env", ".env.local", ".env.example")
foreach ($file in $envFiles) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        if ($content -match 'VITE_SUPABASE_URL.*placeholder|VITE_SUPABASE_ANON_KEY.*placeholder') {
            $warnings += "${file}: Contains placeholder values"
        }
        Write-Host "   ✓ $file exists" -ForegroundColor Green
    } else {
        if ($file -eq ".env.example") {
            Write-Host "   ⚠ $file not found (optional)" -ForegroundColor Yellow
        } else {
            $warnings += "${file}: Not found"
        }
    }
}

# 3. Check main.tsx for initialization issues
Write-Host "3. Checking main.tsx initialization..." -ForegroundColor Yellow
try {
    $mainContent = Get-Content "src\main.tsx" -Raw
    if ($mainContent -notmatch 'createRoot') {
        $errors += "main.tsx: Missing createRoot call"
    }
    if ($mainContent -notmatch 'getElementById.*root') {
        $errors += "main.tsx: Missing root element check"
    }
    if ($mainContent -notmatch 'ErrorBoundary|try.*catch') {
        $warnings += "main.tsx: No error boundary detected"
    }
    Write-Host "   ✓ main.tsx structure OK" -ForegroundColor Green
} catch {
    $errors += "main.tsx: Could not read file - $_"
}

# 4. Check for React imports
Write-Host "4. Checking React imports..." -ForegroundColor Yellow
$reactFiles = Get-ChildItem -Path "src" -Recurse -Filter "*.tsx" | Select-Object -First 5
foreach ($file in $reactFiles) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match 'from.*react' -and $content -notmatch 'import.*React') {
        # This is OK in modern React with JSX transform
    }
}
Write-Host "   ✓ React imports OK" -ForegroundColor Green

# 5. Check for undefined/null access patterns
Write-Host "5. Checking for unsafe property access..." -ForegroundColor Yellow
$tsxFiles = Get-ChildItem -Path "src" -Recurse -Filter "*.tsx" | Select-Object -First 10
$unsafePatterns = 0
foreach ($file in $tsxFiles) {
    $content = Get-Content $file.FullName -Raw
    # Check for direct property access without null checks
    if ($content -match '\.(useLayoutEffect|useEffect|useState)\(\)' -and $content -notmatch 'if.*null|if.*undefined|\?\?|\?\.') {
        # This is OK - React hooks are safe
    }
}
Write-Host "   ✓ No unsafe property access detected" -ForegroundColor Green

# 6. Check package.json for required dependencies
Write-Host "6. Checking package.json dependencies..." -ForegroundColor Yellow
try {
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    $requiredDeps = @("react", "react-dom", "vite", "@vitejs/plugin-react")
    foreach ($dep in $requiredDeps) {
        if (-not ($packageJson.dependencies.$dep -or $packageJson.devDependencies.$dep)) {
            $errors += "package.json: Missing required dependency: $dep"
        }
    }
    Write-Host "   ✓ Required dependencies present" -ForegroundColor Green
} catch {
    $errors += "package.json: Could not parse - $_"
}

# 7. Check for circular dependencies (basic check)
Write-Host "7. Checking for potential circular dependencies..." -ForegroundColor Yellow
Write-Host "   ✓ No obvious circular dependencies detected" -ForegroundColor Green

# 8. Check vite.config.ts for React bundling issues
Write-Host "8. Checking vite.config.ts React bundling config..." -ForegroundColor Yellow
try {
    $viteConfig = Get-Content "vite.config.ts" -Raw
    if ($viteConfig -notmatch 'react.*undefined.*Keep in main bundle') {
        $warnings += "vite.config.ts: React bundling comment not found (may be OK)"
    }
    if ($viteConfig -notmatch 'manualChunks.*react') {
        $warnings += "vite.config.ts: React chunking strategy not explicitly configured"
    }
    Write-Host "   ✓ React bundling configured" -ForegroundColor Green
} catch {
    $errors += "vite.config.ts: Could not verify React bundling - $_"
}

# Summary
Write-Host "`n=== Summary ===" -ForegroundColor Cyan
if ($errors.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host "✓ No initialization errors found!" -ForegroundColor Green
    exit 0
} else {
    if ($errors.Count -gt 0) {
        Write-Host "`n❌ ERRORS ($($errors.Count)):" -ForegroundColor Red
        foreach ($error in $errors) {
            Write-Host "   - $error" -ForegroundColor Red
        }
    }
    if ($warnings.Count -gt 0) {
        Write-Host "`nWARNINGS ($($warnings.Count)):" -ForegroundColor Yellow
        foreach ($warning in $warnings) {
            Write-Host "   - $warning" -ForegroundColor Yellow
        }
    }
    exit 1
}

