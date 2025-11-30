# 📦 Pre-Deployment Checklist

**Checklist sebelum mengirim project ke customer baru**

## ✅ File Konfigurasi Essential

- [x] `.env.example` - Frontend environment template
- [x] `server/.env.example` - Backend environment template (dengan JWT_SECRET)
- [x] `.gitignore` - Exclude sensitive files
- [x] `server/.gitignore` - Exclude node_modules, .env, dll

## ✅ Documentation Files

- [x] `README.md` - Main documentation
- [x] `server/README.md` - Backend API documentation
- [x] `SETUP_INSTRUCTIONS.md` - Quick setup guide untuk customer
- [x] `DEPLOYMENT.md` - Deployment guide
- [x] `TESTING_GUIDE.md` - Testing documentation
- [x] `PWA_DOCUMENTATION.md` - PWA features

## ✅ Setup Scripts

- [x] `setup.bat` - Windows automatic setup script
- [x] `setup.sh` - Mac/Linux automatic setup script
- [x] `start-dev.bat` - Windows development runner
- [x] `start-dev.sh` - Mac/Linux development runner

## ✅ Database Files

- [x] `server/prisma/schema.prisma` - Database schema
- [x] `server/prisma/seed.ts` - Sample data seeder
- [x] `server/prisma/migrations/` - All migration files

## ✅ Package Files

- [x] `package.json` - Frontend dependencies
- [x] `server/package.json` - Backend dependencies
- [x] `bun.lockb` or `package-lock.json` - Lock files

## ⚠️ Files to EXCLUDE (Check .customerignore file)

### 🚫 CRITICAL - DO NOT SEND:
- [ ] `.env` - JANGAN include file .env asli!
- [ ] `server/.env` - JANGAN include file .env asli!
- [ ] `node_modules/` - Akan di-install ulang oleh customer
- [ ] `server/node_modules/` - Akan di-install ulang oleh customer
- [ ] `dist/`, `build/`, `out/` - Build outputs
- [ ] `server/dist/` - Build output
- [ ] `.git/` - Git repository
- [ ] `*.log` - Log files

### 📝 Internal Documentation (EXCLUDE - Development Only):
- [ ] `COMMIT_SUMMARY.md` - Development commit history
- [ ] `IMPLEMENTATION_STATUS.md` - Internal implementation tracking
- [ ] `AUTH_COMPLETE.md` - Internal auth implementation notes
- [ ] `AUTH_IMPLEMENTATION_COMPLETE.md` - Internal auth docs
- [ ] `BACKEND_COMPLETE.md` - Internal backend completion notes
- [ ] `SETUP_COMPLETE.md` - Internal setup notes
- [ ] `EVENT_BRIEFS_IMPLEMENTATION.md` - Internal implementation details
- [ ] `SHIFT_MAINTENANCE_IMPLEMENTATION.md` - Internal implementation details
- [ ] `TESTING_CHECKLIST.md` - Internal testing checklist
- [ ] `PRE_DEPLOYMENT_CHECKLIST.md` - This file (internal only)
- [ ] `server/SETUP_COMPLETE.md` - Internal server setup notes
- [ ] `.customerignore` - Internal file list (optional exclude)

### ✅ Documentation to KEEP (Send to Customer):
- [x] `README.md` - Main project documentation
- [x] `SETUP_INSTRUCTIONS.md` - Step-by-step setup guide
- [x] `QUICKSTART.md` - Quick start guide
- [x] `DATABASE_SETUP.md` - Database setup instructions
- [x] `DEPLOYMENT.md` - Production deployment guide
- [x] `TESTING_GUIDE.md` - How to test the application
- [x] `PWA_DOCUMENTATION.md` - PWA features documentation
- [x] `PWA_SUMMARY.md` - PWA overview
- [x] `PWA_TEST_GUIDE.md` - PWA testing guide
- [x] `server/README.md` - Backend API documentation

### 🔧 Editor/IDE Files (OPTIONAL - Usually exclude):
- [ ] `.vscode/` - VS Code settings
- [ ] `.idea/` - IntelliJ settings
- [ ] `.DS_Store` - Mac system files
- [ ] `Thumbs.db` - Windows system files

## 🔍 Pre-Zip Verification

### 1. Check .env.example Files
```bash
# Frontend .env.example harus ada:
VITE_API_URL=http://localhost:3001

# Backend server/.env.example harus ada:
DATABASE_URL="postgresql://postgres:123456@localhost:5432/vault_pulse_db?schema=public"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=vault-pulse-secret-key-change-this-in-production-use-long-random-string
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_EXPIRES_IN=7d
```

### 2. Check Schema & Migrations
```bash
cd server
# Pastikan schema.prisma lengkap dengan semua models:
# - User, Equipment, EventBrief, Crew, Maintenance, Incident
# - Proposal, RnD, Consumable, Supplier, PurchaseOrder, StockMovement
# - Alert, KpiMetric, Notification, PushSubscription, Permission

# Check migrations folder ada dan lengkap
ls prisma/migrations/
```

### 3. Check Dependencies
```bash
# Frontend
cat package.json  # Check all dependencies listed

# Backend
cd server
cat package.json  # Check all dependencies listed
```

### 4. Clean Build Artifacts
```bash
# Remove build folders
rm -rf dist/
rm -rf server/dist/

# Remove node_modules (customer akan install sendiri)
rm -rf node_modules/
rm -rf server/node_modules/

# Remove .env files (gunakan .env.example)
rm .env
rm server/.env
```

### 5. Test Setup Process
```bash
# Simulate customer setup:
# 1. Extract zip
# 2. Run setup script
./setup.sh  # atau setup.bat di Windows

# 3. Coba running
cd server && npm run dev  # Terminal 1
npm run dev              # Terminal 2

# 4. Test login di http://localhost:5173
# Email: admin@vaultclub.com
# Password: admin123
```

## 📝 Delivery Notes untuk Customer

### Sertakan informasi ini:

**Prerequisites:**
- Node.js 18+ (https://nodejs.org/)
- PostgreSQL 14+ (https://www.postgresql.org/)

**Quick Start:**
1. Extract vault-pulse-center.zip
2. Windows: Jalankan `setup.bat` | Mac/Linux: `./setup.sh`
3. Edit `server/.env` dengan kredensial database Anda
4. Windows: `start-dev.bat` | Mac/Linux: `./start-dev.sh`
5. Akses http://localhost:5173

**Default Login:**
- Email: admin@vaultclub.com
- Password: admin123

**Documentation:**
- Setup lengkap: SETUP_INSTRUCTIONS.md
- API docs: server/README.md
- Main docs: README.md

## 🎯 Final Checklist

- [ ] Semua file documentation ada
- [ ] `.env.example` files complete dan valid
- [ ] Setup scripts tested dan berfungsi
- [ ] Database schema lengkap dengan migrations
- [ ] Seed data tersedia
- [ ] No `.env` files included
- [ ] No `node_modules` folders included
- [ ] No sensitive data included
- [ ] README.md updated
- [ ] Tested fresh setup dari zip

## 📦 Create Zip Package

### Windows (PowerShell):
```powershell
# Method 1: Using .customerignore file
$exclude = Get-Content .customerignore | Where-Object { $_ -notmatch '^#' -and $_ -notmatch '^\s*$' }

# Manual exclusion (recommended for accuracy)
Compress-Archive -Path vault-pulse-center -DestinationPath vault-pulse-center.zip `
  -Force `
  -CompressionLevel Optimal

# Then manually verify and remove unwanted files, or use 7-Zip:
# 7z a -tzip vault-pulse-center.zip vault-pulse-center\ `
#   -xr!node_modules -xr!.git -xr!dist -xr!.env `
#   -x!COMMIT_SUMMARY.md -x!IMPLEMENTATION_STATUS.md `
#   -x!AUTH_COMPLETE.md -x!AUTH_IMPLEMENTATION_COMPLETE.md `
#   -x!BACKEND_COMPLETE.md -x!SETUP_COMPLETE.md `
#   -x!EVENT_BRIEFS_IMPLEMENTATION.md `
#   -x!SHIFT_MAINTENANCE_IMPLEMENTATION.md `
#   -x!TESTING_CHECKLIST.md -x!PRE_DEPLOYMENT_CHECKLIST.md `
#   -x!server/SETUP_COMPLETE.md -x!.customerignore
```

### Mac/Linux:
```bash
# Using exclusion list
zip -r vault-pulse-center.zip vault-pulse-center \
  -x "*/node_modules/*" \
  -x "*/.git/*" \
  -x "*/.env" \
  -x "*/dist/*" \
  -x "*/build/*" \
  -x "*/*.log" \
  -x "*/.DS_Store" \
  -x "*/Thumbs.db" \
  -x "*/.vscode/*" \
  -x "*/COMMIT_SUMMARY.md" \
  -x "*/IMPLEMENTATION_STATUS.md" \
  -x "*/AUTH_COMPLETE.md" \
  -x "*/AUTH_IMPLEMENTATION_COMPLETE.md" \
  -x "*/BACKEND_COMPLETE.md" \
  -x "*/SETUP_COMPLETE.md" \
  -x "*/EVENT_BRIEFS_IMPLEMENTATION.md" \
  -x "*/SHIFT_MAINTENANCE_IMPLEMENTATION.md" \
  -x "*/TESTING_CHECKLIST.md" \
  -x "*/PRE_DEPLOYMENT_CHECKLIST.md" \
  -x "*/server/SETUP_COMPLETE.md" \
  -x "*/.customerignore"
```

---

✅ **Ready to deliver when all items checked!**
