# 📦 Installing psql (PostgreSQL Client) on Windows

## Quick Installation Options

### Option 1: Install Full PostgreSQL (Recommended)
**Includes:** PostgreSQL server + psql client + pgAdmin

1. **Download PostgreSQL:**
   - Go to: https://www.postgresql.org/download/windows/
   - Click "Download the installer"
   - Choose latest version (16.x recommended)

2. **Run Installer:**
   - Run the downloaded `.exe` file
   - **Important:** During installation, make sure to check:
     - ✅ "Command Line Tools" (includes psql)
     - ✅ "Add to PATH" (so psql is accessible from anywhere)

3. **Verify Installation:**
   ```powershell
   psql --version
   ```

4. **If psql not found after installation:**
   - Add PostgreSQL bin to PATH manually:
     - Usually: `C:\Program Files\PostgreSQL\16\bin`
     - Add to System Environment Variables → Path

---

### Option 2: Standalone psql Client (Lighter)

**Using Chocolatey (if installed):**
```powershell
choco install postgresql --params '/Password:postgres'
```

**Or download standalone:**
- Visit: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
- Download "Command Line Tools" only

---

### Option 3: Use Docker (If Docker is installed)

```powershell
docker run -it --rm postgres:16 psql --version
```

Then use Docker to run psql commands.

---

## After Installation

### Test Connection
```powershell
psql "postgresql://postgres:K1551d0ug0u@db.uvdrwbmhmtgacwzujfzc.supabase.co:5432/postgres" -c "SELECT version();"
```

### Apply Migrations
```powershell
cd C:\Users\facel\Downloads\GitHub\CyberSoluce-AssetManager
.\scripts\apply-migrations-simple.ps1
```

---

## Troubleshooting

### psql not found after installation
1. **Restart PowerShell** (required to refresh PATH)
2. **Check PATH:**
   ```powershell
   $env:PATH -split ';' | Select-String -Pattern "PostgreSQL"
   ```
3. **Add manually if missing:**
   ```powershell
   $pgPath = "C:\Program Files\PostgreSQL\16\bin"
   if (Test-Path $pgPath) {
       $env:PATH += ";$pgPath"
   }
   ```

### Connection Issues
- Verify database URL is correct
- Check Supabase project is active
- Ensure firewall allows connection

---

## Quick Links

- **PostgreSQL Download**: https://www.postgresql.org/download/windows/
- **EnterpriseDB Download**: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
- **Chocolatey**: https://chocolatey.org/install

---

**After installation, run:**
```powershell
.\scripts\apply-migrations-simple.ps1
```

