# ============================================
# Railway PostgreSQL Backup via Docker
# ============================================
# Uses Docker PostgreSQL image to avoid version mismatch
# ============================================

$ErrorActionPreference = "Stop"

$RAILWAY_URL = "postgresql://postgres:NBZKefiMdNJhwivSCoLSnafLhdMXapYZ@interchange.proxy.rlwy.net:17998/railway"
$BACKUP_DIR = "database-backups"
$TIMESTAMP = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$BACKUP_FILE = "railway_${TIMESTAMP}.sql"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Railway Backup via Docker" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
Write-Host "Checking for Docker..." -ForegroundColor Yellow
$dockerCmd = Get-Command docker -ErrorAction SilentlyContinue
if (-not $dockerCmd) {
    Write-Host "[ERROR] Docker not found!" -ForegroundColor Red
    Write-Host "Please install Docker Desktop: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] Docker found" -ForegroundColor Green

# Create backup directory
if (-not (Test-Path $BACKUP_DIR)) {
    New-Item -ItemType Directory -Path $BACKUP_DIR | Out-Null
    Write-Host "[OK] Created backup directory: $BACKUP_DIR" -ForegroundColor Green
}

Write-Host ""
Write-Host "Starting backup using Docker PostgreSQL 17..." -ForegroundColor Yellow
Write-Host "This will download ~100MB if first time running" -ForegroundColor Gray
Write-Host ""

$currentPath = Get-Location
$backupPath = Join-Path $currentPath $BACKUP_DIR

try {
    # Run pg_dump using Docker with PostgreSQL 17
    docker run --rm `
        -v "${backupPath}:/backup" `
        postgres:17-alpine `
        pg_dump `
        --host=interchange.proxy.rlwy.net `
        --port=17998 `
        --username=postgres `
        --dbname=railway `
        --file="/backup/$BACKUP_FILE" `
        --no-owner `
        --no-acl `
        --verbose
    
    if ($LASTEXITCODE -eq 0) {
        $fullPath = Join-Path $BACKUP_DIR $BACKUP_FILE
        $size = (Get-Item $fullPath).Length / 1MB
        Write-Host ""
        Write-Host "[SUCCESS] Backup completed!" -ForegroundColor Green
        Write-Host "File: $fullPath" -ForegroundColor White
        Write-Host "Size: $([math]::Round($size, 2)) MB" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "[ERROR] Backup failed!" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host ""
    Write-Host "[ERROR] $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
