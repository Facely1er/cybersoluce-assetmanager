# 🚀 Complete Repository Migration Guide

**Current**: `https://github.com/Facely1er/assetmanager.git`  
**New**: `https://github.com/Facely1er/cybersoluce-assetmanager.git`

---

## 📋 Quick Summary

1. **Create** new GitHub repository
2. **Update** git remote to point to new repo
3. **Push** code to new repository
4. **Update** Netlify to connect to new repo

---

## Step 1: Create New GitHub Repository

### Option A: Via GitHub Website (Recommended)

1. **Go to**: https://github.com/new
2. **Repository name**: `cybersoluce-assetmanager`
3. **Description**: `CyberSoluce™ Asset Manager - Production-ready asset inventory management platform`
4. **Visibility**: Choose Public or Private
5. **⚠️ IMPORTANT**: 
   - ❌ **DO NOT** check "Add a README file"
   - ❌ **DO NOT** check "Add .gitignore"
   - ❌ **DO NOT** choose a license
   - (We already have all of these)
6. Click **"Create repository"**

### Option B: Via GitHub Desktop

1. Open GitHub Desktop
2. File → New Repository
3. Name: `cybersoluce-assetmanager`
4. Don't initialize with README
5. Create repository

---

## Step 2: Update Git Remote and Push

### Option A: Using PowerShell (If Git is in PATH)

```powershell
cd C:\Users\facel\Downloads\GitHub\CyberSoluce-AssetManager

# Check current remote
git remote -v

# Remove old remote
git remote remove origin

# Add new remote
git remote add origin https://github.com/Facely1er/cybersoluce-assetmanager.git

# Verify
git remote -v

# Push to new repository
git push -u origin main
```

### Option B: Using GitHub Desktop

1. Open GitHub Desktop
2. Repository → Repository Settings → Remote
3. Change remote URL to: `https://github.com/Facely1er/cybersoluce-assetmanager.git`
4. Click "Save"
5. Publish branch (or push if already published)

### Option C: Using Migration Script

```powershell
cd C:\Users\facel\Downloads\GitHub\CyberSoluce-AssetManager
.\scripts\migrate-to-new-repo.ps1
```

**Note**: Script will prompt you to confirm you've created the repository first.

---

## Step 3: Update Netlify Connection

### Method 1: Update Existing Site (Recommended)

1. Go to: https://app.netlify.com
2. Select your site
3. **Site settings** → **Build & deploy** → **Continuous Deployment**
4. Click **"Link to a different repository"**
5. Select `cybersoluce-assetmanager` repository
6. Netlify will automatically update

### Method 2: Create New Site

1. Go to: https://app.netlify.com
2. **Add new site** → **Import an existing project**
3. Connect to `cybersoluce-assetmanager` repository
4. Build settings (auto-detected):
   - Build command: `npm ci --include=dev && npm run build`
   - Publish directory: `dist`
5. **Set environment variables** (copy from old site):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_APP_ENV`
   - `VITE_DEBUG_MODE`
   - `VITE_ENABLE_ERROR_REPORTING`
6. Deploy

---

## Step 4: Verify Migration

### Check Repository
- Visit: https://github.com/Facely1er/cybersoluce-assetmanager
- Verify all files are present
- Check README displays correctly

### Check Netlify
- Verify site is connected to new repository
- Check build logs
- Trigger a test deployment

### Test Deployment
- Make a small change (e.g., update README)
- Commit and push
- Verify Netlify auto-deploys from new repo

---

## 🔧 Troubleshooting

### Git Not Found
**Solution**: Use GitHub Desktop or add Git to PATH
- Download: https://git-scm.com/download/win
- Or use GitHub Desktop: https://desktop.github.com/

### Push Fails - Authentication
**Solution**: 
- Use GitHub Desktop (handles auth automatically)
- Or set up GitHub credentials:
  ```powershell
  git config --global user.name "Your Name"
  git config --global user.email "your.email@example.com"
  ```

### Repository Already Exists
**Solution**: 
- Use a different name: `cybersoluce-asset-inventory`
- Or delete the existing repository first

---

## ✅ Migration Checklist

- [ ] New GitHub repository created
- [ ] Git remote updated
- [ ] Code pushed to new repository
- [ ] Netlify connected to new repository
- [ ] Environment variables set in Netlify
- [ ] Test deployment successful
- [ ] Old repository archived/removed (optional)

---

## 📝 After Migration

### Update Documentation
Update any references to the old repository:
- README.md (if it references the repo)
- Documentation files
- CI/CD configurations

### Archive Old Repository (Optional)
1. Go to old repository settings
2. Scroll to "Danger Zone"
3. Click "Archive this repository"

---

**Ready to migrate?** Follow Step 1 first, then proceed with the rest!

