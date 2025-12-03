# ============================================
# Railway PostgreSQL Backup Script
# ============================================
# This script backs up your Railway PostgreSQL database to local files
# Created: December 3, 2025
# ============================================

$ErrorActionPreference = "Stop"

# Railway Database Connection
$RAILWAY_HOST = "interchange.proxy.rlwy.net"
$RAILWAY_PORT = "17998"
$RAILWAY_USER = "postgres"
$RAILWAY_PASSWORD = "NBZKefiMdNJhwivSCoLSnafLhdMXapYZ"
$RAILWAY_DB = "railway"
$RAILWAY_URL = "postgresql://${RAILWAY_USER}:${RAILWAY_PASSWORD}@${RAILWAY_HOST}:${RAILWAY_PORT}/${RAILWAY_DB}"

# Backup Configuration
$BACKUP_DIR = "database-backups"
$TIMESTAMP = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$BACKUP_FILE = "${BACKUP_DIR}/railway_backup_${TIMESTAMP}.sql"
$BACKUP_CUSTOM = "${BACKUP_DIR}/railway_backup_${TIMESTAMP}.dump"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Railway PostgreSQL Backup Tool" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if pg_dump is available
Write-Host "Checking for PostgreSQL tools..." -ForegroundColor Yellow
$pgDumpPath = $null

# Common PostgreSQL installation paths
$possiblePaths = @(
    "C:\Program Files\PostgreSQL\16\bin\pg_dump.exe",
    "C:\Program Files\PostgreSQL\15\bin\pg_dump.exe",
    "C:\Program Files\PostgreSQL\14\bin\pg_dump.exe",
    "C:\Program Files (x86)\PostgreSQL\16\bin\pg_dump.exe",
    "C:\Program Files (x86)\PostgreSQL\15\bin\pg_dump.exe",
    "C:\Program Files (x86)\PostgreSQL\14\bin\pg_dump.exe"
)

foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        $pgDumpPath = $path
        Write-Host "✓ Found pg_dump at: $path" -ForegroundColor Green
        break
    }
}

if (-not $pgDumpPath) {
    # Try to find in PATH
    $pgDumpInPath = Get-Command pg_dump -ErrorAction SilentlyContinue
    if ($pgDumpInPath) {
        $pgDumpPath = $pgDumpInPath.Source
        Write-Host "✓ Found pg_dump in PATH: $pgDumpPath" -ForegroundColor Green
    } else {
        Write-Host "✗ PostgreSQL pg_dump not found!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Please install PostgreSQL or add pg_dump to PATH:" -ForegroundColor Yellow
        Write-Host "Download from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
        Write-Host ""
        exit 1
    }
}

# Create backup directory if not exists
if (-not (Test-Path $BACKUP_DIR)) {
    New-Item -ItemType Directory -Path $BACKUP_DIR | Out-Null
    Write-Host "✓ Created backup directory: $BACKUP_DIR" -ForegroundColor Green
}

Write-Host ""
Write-Host "Backup Configuration:" -ForegroundColor Cyan
Write-Host "  Database: railway" -ForegroundColor White
Write-Host "  Host: $RAILWAY_HOST" -ForegroundColor White
Write-Host "  Port: $RAILWAY_PORT" -ForegroundColor White
Write-Host "  Backup Dir: $BACKUP_DIR" -ForegroundColor White
Write-Host ""

# Ask user what format they want
Write-Host "Select backup format:" -ForegroundColor Yellow
Write-Host "  1. SQL format (plain text, human readable, larger size)" -ForegroundColor White
Write-Host "  2. Custom format (compressed, faster restore, smaller size)" -ForegroundColor White
Write-Host "  3. Both formats" -ForegroundColor White
Write-Host ""
$choice = Read-Host "Enter choice (1/2/3)"

$env:PGPASSWORD = $RAILWAY_PASSWORD

try {
    if ($choice -eq "1" -or $choice -eq "3") {
        Write-Host ""
        Write-Host "Creating SQL backup..." -ForegroundColor Yellow
        Write-Host "File: $BACKUP_FILE" -ForegroundColor Gray
        
        & $pgDumpPath `
            --host=$RAILWAY_HOST `
            --port=$RAILWAY_PORT `
            --username=$RAILWAY_USER `
            --dbname=$RAILWAY_DB `
            --file=$BACKUP_FILE `
            --verbose `
            --no-owner `
            --no-acl
        
        if ($LASTEXITCODE -eq 0) {
            $fileSize = (Get-Item $BACKUP_FILE).Length / 1MB
            Write-Host "✓ SQL backup completed successfully!" -ForegroundColor Green
            Write-Host "  Size: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Green
            Write-Host "  Location: $BACKUP_FILE" -ForegroundColor Green
        } else {
            Write-Host "✗ SQL backup failed!" -ForegroundColor Red
        }
    }

    if ($choice -eq "2" -or $choice -eq "3") {
        Write-Host ""
        Write-Host "Creating custom format backup..." -ForegroundColor Yellow
        Write-Host "File: $BACKUP_CUSTOM" -ForegroundColor Gray
        
        & $pgDumpPath `
            --host=$RAILWAY_HOST `
            --port=$RAILWAY_PORT `
            --username=$RAILWAY_USER `
            --dbname=$RAILWAY_DB `
            --file=$BACKUP_CUSTOM `
            --format=custom `
            --verbose `
            --no-owner `
            --no-acl
        
        if ($LASTEXITCODE -eq 0) {
            $fileSize = (Get-Item $BACKUP_CUSTOM).Length / 1MB
            Write-Host "✓ Custom backup completed successfully!" -ForegroundColor Green
            Write-Host "  Size: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Green
            Write-Host "  Location: $BACKUP_CUSTOM" -ForegroundColor Green
        } else {
            Write-Host "✗ Custom backup failed!" -ForegroundColor Red
        }
    }

    Write-Host ""
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host "Backup Summary" -ForegroundColor Cyan
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host "Timestamp: $TIMESTAMP" -ForegroundColor White
    Write-Host "Backup Location: $BACKUP_DIR" -ForegroundColor White
    
    # List all backups
    Write-Host ""
    Write-Host "Available backups:" -ForegroundColor Yellow
    Get-ChildItem $BACKUP_DIR | Sort-Object LastWriteTime -Descending | Select-Object -First 10 | ForEach-Object {
        $size = $_.Length / 1MB
        Write-Host "  $($_.Name) - $([math]::Round($size, 2)) MB" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "✓ Backup process completed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "To restore this backup, use:" -ForegroundColor Yellow
    Write-Host "  .\restore-railway-db.ps1" -ForegroundColor Cyan
    Write-Host ""

} catch {
    Write-Host ""
    Write-Host "✗ Error during backup: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    # Clear password from environment
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
}
