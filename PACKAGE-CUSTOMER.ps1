# ====================================================================
# VAULT PULSE CENTER - CUSTOMER PACKAGE CREATOR
# ====================================================================
# Creates a clean, production-ready ZIP package for customer deployment
# Excludes development docs, node_modules, and sensitive files

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " VAULT PULSE CENTER - Package Creator  " -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$version = Get-Date -Format "yyyy.MM.dd"
$packageName = "vault-pulse-center-v$version"
$tempDir = ".\package-output\temp"
$zipPath = ".\package-output\$packageName.zip"

# Create output directory
Write-Host "[1/5] Preparing directories..." -ForegroundColor Yellow
if (Test-Path ".\package-output") {
    Remove-Item ".\package-output" -Recurse -Force
}
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null
Write-Host "      Done!" -ForegroundColor Green

# ============================================
# COPY ESSENTIAL FILES
# ============================================

Write-Host ""
Write-Host "[2/5] Copying essential files..." -ForegroundColor Yellow

# Root files
Write-Host "      - Configuration files" -ForegroundColor Gray
$rootFiles = @(
    "package.json",
    "vite.config.ts",
    "tsconfig.json",
    "tsconfig.app.json",
    "tsconfig.node.json",
    "tailwind.config.ts",
    "postcss.config.js",
    "components.json",
    "eslint.config.js",
    "index.html",
    "bun.lockb"
)

foreach ($file in $rootFiles) {
    if (Test-Path $file) {
        Copy-Item $file -Destination $tempDir -ErrorAction SilentlyContinue
    }
}

# Customer docs ONLY (NO development docs!)
Write-Host "      - Documentation (customer-facing only)" -ForegroundColor Gray
$customerDocs = @(
    "README.md",
    "QUICKSTART.md", 
    "DEPLOYMENT.md",
    "DATABASE_SETUP.md"
)

foreach ($doc in $customerDocs) {
    if (Test-Path $doc) {
        Copy-Item $doc -Destination $tempDir
    }
}

# Setup scripts
Write-Host "      - Setup scripts" -ForegroundColor Gray
if (Test-Path "setup.ps1") { Copy-Item "setup.ps1" -Destination $tempDir }
if (Test-Path "setup.sh") { Copy-Item "setup.sh" -Destination $tempDir }
if (Test-Path "setup.bat") { Copy-Item "setup.bat" -Destination $tempDir }

# Source code
Write-Host "      - Frontend source (src/)" -ForegroundColor Gray
Copy-Item "src" -Destination $tempDir -Recurse

# Public assets
Write-Host "      - Public assets" -ForegroundColor Gray
Copy-Item "public" -Destination $tempDir -Recurse

# Server (exclude node_modules, dist, .env, logs)
Write-Host "      - Backend server" -ForegroundColor Gray
robocopy "server" "$tempDir\server" /E /XD node_modules dist /XF .env *.log /NFL /NDL /NJH /NJS /NC /NS | Out-Null

# Copy server README
if (Test-Path "server\README.md") {
    Copy-Item "server\README.md" -Destination "$tempDir\server\" -Force
}

Write-Host "      Done!" -ForegroundColor Green

# ============================================
# CREATE ZIP PACKAGE
# ============================================

Write-Host ""
Write-Host "[3/3] Creating ZIP package..." -ForegroundColor Yellow

if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

Compress-Archive -Path "$tempDir\*" -DestinationPath $zipPath -CompressionLevel Optimal

# Cleanup temp
Remove-Item -Recurse -Force $tempDir

Write-Host "      Done!" -ForegroundColor Green

# ============================================
# SUMMARY
# ============================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "    PACKAGE CREATED SUCCESSFULLY!       " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

$zipSize = (Get-Item $zipPath).Length / 1MB
Write-Host "Package: $packageName.zip" -ForegroundColor Cyan
Write-Host "Size:    $([math]::Round($zipSize, 2)) MB" -ForegroundColor Cyan
Write-Host "Path:    $zipPath" -ForegroundColor Cyan
Write-Host ""

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Upload ZIP to cloud storage" -ForegroundColor Gray
Write-Host "  2. Share link with customer" -ForegroundColor Gray
Write-Host "  3. Customer extracts & runs setup.ps1" -ForegroundColor Gray
Write-Host ""

Write-Host "Customer Quick Start:" -ForegroundColor Yellow
Write-Host "  Extract → Run setup.ps1 → Access app!" -ForegroundColor Gray
Write-Host ""

Write-Host "Ready for delivery! " -NoNewline -ForegroundColor Green
Write-Host "Happy deploying!" -ForegroundColor Cyan
Write-Host ""
