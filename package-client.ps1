# Package Client Script
# Creates a clean ZIP package for client deployment

$ErrorActionPreference = "Stop"

# Configuration
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$packageName = "vault-pulse-center-$timestamp"
$outputDir = ".\package-output"
$packageDir = "$outputDir\$packageName"
$zipPath = "$outputDir\$packageName.zip"

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "  Creating Client Package" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Create output directory
if (Test-Path $outputDir) {
    Write-Host "Cleaning old packages..." -ForegroundColor Yellow
    Remove-Item "$outputDir\*" -Recurse -Force -ErrorAction SilentlyContinue
}
New-Item -ItemType Directory -Path $packageDir -Force | Out-Null
Write-Host "[OK] Created package directory" -ForegroundColor Green

# Copy files
Write-Host ""
Write-Host "Copying files..." -ForegroundColor Yellow

# Root files
Write-Host "  - Root config files" -ForegroundColor Gray
$rootFiles = @(
    "package.json",
    "vite.config.ts",
    "tsconfig.json",
    "tsconfig.app.json",
    "tsconfig.node.json",
    "tailwind.config.ts",
    "postcss.config.js",
    "components.json",
    "index.html",
    "README.md"
)
foreach ($file in $rootFiles) {
    if (Test-Path $file) {
        Copy-Item $file -Destination $packageDir -ErrorAction SilentlyContinue
    }
}

# Setup script
Write-Host "  - Setup scripts" -ForegroundColor Gray
if (Test-Path "setup.ps1") {
    Copy-Item "setup.ps1" -Destination $packageDir
}

# Source code
Write-Host "  - Source code" -ForegroundColor Gray
if (Test-Path "src") {
    Copy-Item "src" -Destination $packageDir -Recurse
}

# Public assets
Write-Host "  - Public assets" -ForegroundColor Gray
if (Test-Path "public") {
    Copy-Item "public" -Destination $packageDir -Recurse
}

# Server (exclude node_modules, dist, .env)
Write-Host "  - Backend server" -ForegroundColor Gray
if (Test-Path "server") {
    New-Item -ItemType Directory -Path "$packageDir\server" -Force | Out-Null
    
    # Copy server files
    Copy-Item "server\package.json" -Destination "$packageDir\server" -ErrorAction SilentlyContinue
    Copy-Item "server\tsconfig.json" -Destination "$packageDir\server" -ErrorAction SilentlyContinue
    Copy-Item "server\README.md" -Destination "$packageDir\server" -ErrorAction SilentlyContinue
    
    # Copy server directories
    if (Test-Path "server\src") {
        Copy-Item "server\src" -Destination "$packageDir\server" -Recurse
    }
    if (Test-Path "server\prisma") {
        Copy-Item "server\prisma" -Destination "$packageDir\server" -Recurse
    }
}

# Create .env template
Write-Host "  - Environment template" -ForegroundColor Gray
"VITE_API_URL=http://localhost:3001" | Out-File -FilePath "$packageDir\.env.example" -Encoding utf8

# Create simple install guide
Write-Host "  - Installation guide" -ForegroundColor Gray
$guide = @"
VAULT PULSE CENTER - INSTALLATION GUIDE
========================================

REQUIREMENTS:
- Node.js 18 or higher
- PostgreSQL 14 or higher (or Supabase)

INSTALLATION STEPS:

1. Install Dependencies
   npm install
   cd server
   npm install
   cd ..

2. Setup Environment
   Copy .env.example to .env
   Edit .env with your database connection

3. Setup Database
   cd server
   npx prisma generate
   npx prisma db push
   cd ..

4. Run Application
   
   Development Mode:
   - Terminal 1: cd server; npm run dev
   - Terminal 2: npm run dev
   
   Production Mode:
   - npm run build
   - cd server; npm start

5. Access Application
   - Development: http://localhost:5173
   - Production: http://localhost:3001

NEW FEATURES IN THIS VERSION:
- Weekly Report PDF/Excel export
- Event Brief enhancements (date format + 7 new fields)
- Maintenance Logs improvements (MTTR field)

SUPPORT:
Read README.md for more details

Package created: $timestamp
"@
$guide | Out-File -FilePath "$packageDir\INSTALL.txt" -Encoding utf8

Write-Host "[OK] All files copied" -ForegroundColor Green

# Create ZIP
Write-Host ""
Write-Host "Creating ZIP archive..." -ForegroundColor Yellow
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}
Compress-Archive -Path $packageDir -DestinationPath $zipPath -Force
Write-Host "[OK] ZIP created" -ForegroundColor Green

# Cleanup temp directory
Write-Host ""
Write-Host "Cleaning up..." -ForegroundColor Yellow
Remove-Item $packageDir -Recurse -Force
Write-Host "[OK] Cleanup complete" -ForegroundColor Green

# Summary
$zipSize = (Get-Item $zipPath).Length / 1MB
Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "  PACKAGE READY!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "File: $zipPath" -ForegroundColor Cyan
Write-Host "Size: $([math]::Round($zipSize, 2)) MB" -ForegroundColor Cyan
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Upload ZIP to cloud storage" -ForegroundColor Gray
Write-Host "2. Send download link to client" -ForegroundColor Gray
Write-Host "3. Client extracts and reads INSTALL.txt" -ForegroundColor Gray
Write-Host "4. Client runs: npm install" -ForegroundColor Gray
Write-Host ""
