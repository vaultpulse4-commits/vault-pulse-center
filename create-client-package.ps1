# 📦 Package untuk Client - Vault Pulse Center
# Script ini akan package semua file untuk deploy ke client

Write-Host "📦 Creating Client Package..." -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Variables
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$packageName = "vault-pulse-center-$timestamp"
$packageDir = ".\package-output\$packageName"

# Create package directory
Write-Host "📁 Creating package directory..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path $packageDir | Out-Null
Write-Host "✅ Created: $packageDir" -ForegroundColor Green
Write-Host ""

# Copy necessary files
Write-Host "📋 Copying files..." -ForegroundColor Yellow

# Root files
Write-Host "  - Root configuration files" -ForegroundColor Cyan
Copy-Item "package.json" -Destination $packageDir
Copy-Item "package-lock.json" -Destination $packageDir -ErrorAction SilentlyContinue
Copy-Item "bun.lockb" -Destination $packageDir -ErrorAction SilentlyContinue
Copy-Item "vite.config.ts" -Destination $packageDir
Copy-Item "tsconfig.json" -Destination $packageDir
Copy-Item "tsconfig.app.json" -Destination $packageDir
Copy-Item "tsconfig.node.json" -Destination $packageDir
Copy-Item "tailwind.config.ts" -Destination $packageDir
Copy-Item "postcss.config.js" -Destination $packageDir
Copy-Item "components.json" -Destination $packageDir
Copy-Item "eslint.config.js" -Destination $packageDir
Copy-Item "index.html" -Destination $packageDir

# Documentation - Only essential files
Write-Host "  - Documentation" -ForegroundColor Cyan
Copy-Item "README.md" -Destination $packageDir

# Scripts
Write-Host "  - Setup scripts" -ForegroundColor Cyan
Copy-Item "setup.ps1" -Destination $packageDir
Copy-Item "setup.sh" -Destination $packageDir -ErrorAction SilentlyContinue
Copy-Item "dev.ps1" -Destination $packageDir -ErrorAction SilentlyContinue
Copy-Item "start-dev.ps1" -Destination $packageDir -ErrorAction SilentlyContinue

# Source code
Write-Host "  - Source code (src/)" -ForegroundColor Cyan
Copy-Item "src" -Destination $packageDir -Recurse

# Public assets
Write-Host "  - Public assets" -ForegroundColor Cyan
Copy-Item "public" -Destination $packageDir -Recurse

# Server
Write-Host "  - Backend server" -ForegroundColor Cyan
Copy-Item "server" -Destination $packageDir -Recurse -Exclude "node_modules","dist",".env"

# Create .env templates
Write-Host "  - Environment templates" -ForegroundColor Cyan
"VITE_API_URL=http://localhost:3001" | Out-File -FilePath "$packageDir\.env.example" -Encoding utf8

# Create installation guide
Write-Host "  - Installation guide" -ForegroundColor Cyan
$installLines = @(
    "VAULT PULSE CENTER - QUICK INSTALL GUIDE",
    "=========================================",
    "",
    "PREREQUISITES:",
    "- Node.js 18+ (https://nodejs.org)",
    "- PostgreSQL 14+ or Supabase account",
    "",
    "QUICK INSTALL - WINDOWS:",
    "-------------------------",
    "1. Extract package",
    "2. Run setup.ps1",
    "3. Follow prompts",
    "",
    "MANUAL SETUP:",
    "-------------",
    "1. Install Dependencies:",
    "   npm install",
    "   cd server",
    "   npm install",
    "   cd ..",
    "",
    "2. Configure Database (server/.env):",
    "   DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/vault_pulse",
    "   JWT_SECRET=your-secret-key-here",
    "   PORT=3001",
    "",
    "3. Initialize Database:",
    "   cd server",
    "   npx prisma generate",
    "   npx prisma db push",
    "   cd ..",
    "",
    "4. Start Application:",
    "   Development:",
    "     Terminal 1: cd server; npm run dev",
    "     Terminal 2: npm run dev",
    "",
    "   Production:",
    "     npm run build",
    "     cd server; npm start",
    "",
    "VERIFY INSTALLATION:",
    "--------------------",
    "- Backend: http://localhost:3001",
    "- Frontend: http://localhost:5173 (dev) or http://localhost:3001 (prod)",
    "",
    "NEW FEATURES:",
    "--------------",
    "1. Weekly Report PDF/Excel - Export from Week Picker",
    "2. Event Brief - Date with day name + 7 new fields",
    "3. Maintenance Logs - MTTR field + Historical view",
    "4. Bug Fixes - RnD/Proposals tabs",
    "",
    "---",
    "Package Date: $timestamp",
    "Version: $(Get-Date -Format 'yyyy.MM.dd')"
)
$installLines -join "`r`n" | Out-File -FilePath "$packageDir\INSTALL.txt" -Encoding utf8

Write-Host "✅ Files copied" -ForegroundColor Green
Write-Host ""

# Create ZIP archive
Write-Host "📦 Creating ZIP archive..." -ForegroundColor Yellow
$zipPath = ".\package-output\$packageName.zip"
Compress-Archive -Path $packageDir -DestinationPath $zipPath -Force
Write-Host "✅ Created: $zipPath" -ForegroundColor Green
Write-Host ""

# Cleanup temporary directory
Write-Host "🧹 Cleaning up..." -ForegroundColor Yellow
Remove-Item -Recurse -Force $packageDir
Write-Host "✅ Cleanup complete" -ForegroundColor Green
Write-Host ""

# Summary
Write-Host "✨ Package Created Successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Package Details:" -ForegroundColor Yellow
Write-Host "  Location: $zipPath" -ForegroundColor Cyan
$zipSize = (Get-Item $zipPath).Length / 1MB
Write-Host "  Size: $([math]::Round($zipSize, 2)) MB" -ForegroundColor Cyan
Write-Host ""
Write-Host "📤 Send to Client:" -ForegroundColor Yellow
Write-Host "  1. Upload $packageName.zip to cloud storage" -ForegroundColor Gray
Write-Host "  2. Share download link with client" -ForegroundColor Gray
Write-Host "  3. Client extracts and runs setup.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "📋 Client Instructions:" -ForegroundColor Yellow
Write-Host "  1. Extract ZIP file" -ForegroundColor Gray
Write-Host "  2. Read INSTALL.md" -ForegroundColor Gray
Write-Host "  3. Run setup script" -ForegroundColor Gray
Write-Host "  4. Configure database in server/.env" -ForegroundColor Gray
Write-Host "  5. Run: cd server && npx prisma db push" -ForegroundColor Gray
Write-Host "  6. Start application" -ForegroundColor Gray
Write-Host ""
Write-Host "Happy Deploying! 🚀" -ForegroundColor Green
