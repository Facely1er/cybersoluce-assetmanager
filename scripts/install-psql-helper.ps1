# Helper script to install psql (PostgreSQL client)

Write-Host "PostgreSQL Client (psql) Installation Helper" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Check if already installed
try {
    $null = Get-Command psql -ErrorAction Stop
    Write-Host "psql is already installed!" -ForegroundColor Green
    psql --version
    Write-Host ""
    Write-Host "You can now run migrations:" -ForegroundColor Cyan
    Write-Host "  .\scripts\apply-migrations-simple.ps1" -ForegroundColor White
    exit 0
} catch {
    Write-Host "psql not found. Checking installation options..." -ForegroundColor Yellow
}

Write-Host ""

# Check for Chocolatey
$chocoAvailable = $false
try {
    $null = Get-Command choco -ErrorAction Stop
    $chocoAvailable = $true
    Write-Host "Chocolatey found!" -ForegroundColor Green
} catch {
    Write-Host "Chocolatey not found" -ForegroundColor Gray
}

# Check for Winget
$wingetAvailable = $false
try {
    $null = Get-Command winget -ErrorAction Stop
    $wingetAvailable = $true
    Write-Host "Winget found!" -ForegroundColor Green
} catch {
    Write-Host "Winget not found" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Installation Options:" -ForegroundColor Cyan
Write-Host ""

if ($chocoAvailable) {
    Write-Host "[1] Install via Chocolatey (Recommended)" -ForegroundColor Yellow
    Write-Host "    Command: choco install postgresql --params '/Password:postgres'" -ForegroundColor White
    Write-Host ""
}

if ($wingetAvailable) {
    Write-Host "[2] Install via Winget" -ForegroundColor Yellow
    Write-Host "    Command: winget install PostgreSQL.PostgreSQL" -ForegroundColor White
    Write-Host ""
}

Write-Host "[3] Manual Installation" -ForegroundColor Yellow
Write-Host "    1. Download from: https://www.postgresql.org/download/windows/" -ForegroundColor White
Write-Host "    2. Run installer" -ForegroundColor White
Write-Host "    3. Check 'Command Line Tools' and 'Add to PATH'" -ForegroundColor White
Write-Host "    4. Restart PowerShell" -ForegroundColor White
Write-Host ""

# Ask user which method to use
if ($chocoAvailable -or $wingetAvailable) {
    Write-Host "Would you like to install now? (Y/N)" -ForegroundColor Cyan
    $response = Read-Host
    
    if ($response -eq "Y" -or $response -eq "y") {
        if ($chocoAvailable) {
            Write-Host ""
            Write-Host "Installing PostgreSQL via Chocolatey..." -ForegroundColor Yellow
            Write-Host "This may take a few minutes..." -ForegroundColor Gray
            Write-Host ""
            choco install postgresql --params '/Password:postgres' -y
        } elseif ($wingetAvailable) {
            Write-Host ""
            Write-Host "Installing PostgreSQL via Winget..." -ForegroundColor Yellow
            Write-Host "This may take a few minutes..." -ForegroundColor Gray
            Write-Host ""
            winget install PostgreSQL.PostgreSQL
        }
        
        Write-Host ""
        Write-Host "Installation complete!" -ForegroundColor Green
        Write-Host ""
        Write-Host "IMPORTANT: Please restart PowerShell, then run:" -ForegroundColor Yellow
        Write-Host "  .\scripts\apply-migrations-simple.ps1" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "Installation cancelled. You can install manually using the steps above." -ForegroundColor Yellow
    }
} else {
    Write-Host "No package manager found. Please install manually using Option 3 above." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "After installation, restart PowerShell and run:" -ForegroundColor Cyan
    Write-Host "  .\scripts\apply-migrations-simple.ps1" -ForegroundColor White
}

Write-Host ""

