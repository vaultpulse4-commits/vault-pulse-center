# ============================================
# Railway PostgreSQL Restore Script
# ============================================
# This script restores a backup to Railway PostgreSQL database
# Created: December 3, 2025
# ============================================

$ErrorActionPreference = "Stop"

# Railway Database Connection
$RAILWAY_HOST = "interchange.proxy.rlwy.net"
$RAILWAY_PORT = "17998"
$RAILWAY_USER = "postgres"
$RAILWAY_PASSWORD = "NBZKefiMdNJhwivSCoLSnafLhdMXapYZ"
$RAILWAY_DB = "railway"

$BACKUP_DIR = "database-backups"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Railway PostgreSQL Restore Tool" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if backup directory exists
if (-not (Test-Path $BACKUP_DIR)) {
    Write-Host "✗ Backup directory not found: $BACKUP_DIR" -ForegroundColor Red
    Write-Host "Please run backup-railway-db.ps1 first to create backups" -ForegroundColor Yellow
    exit 1
}

# List available backups
Write-Host "Available backups:" -ForegroundColor Yellow
$backups = Get-ChildItem $BACKUP_DIR -Filter "*.sql", "*.dump" | Sort-Object LastWriteTime -Descending
if ($backups.Count -eq 0) {
    Write-Host "✗ No backup files found in $BACKUP_DIR" -ForegroundColor Red
    exit 1
}

for ($i = 0; $i -lt $backups.Count; $i++) {
    $backup = $backups[$i]
    $size = $backup.Length / 1MB
    $age = (Get-Date) - $backup.LastWriteTime
    Write-Host "  [$($i+1)] $($backup.Name)" -ForegroundColor White
    Write-Host "      Size: $([math]::Round($size, 2)) MB | Age: $([math]::Round($age.TotalHours, 1)) hours ago" -ForegroundColor Gray
}

Write-Host ""
$selection = Read-Host "Select backup number to restore (or 'q' to quit)"

if ($selection -eq 'q') {
    Write-Host "Restore cancelled." -ForegroundColor Yellow
    exit 0
}

$selectedIndex = [int]$selection - 1
if ($selectedIndex -lt 0 -or $selectedIndex -ge $backups.Count) {
    Write-Host "✗ Invalid selection!" -ForegroundColor Red
    exit 1
}

$backupFile = $backups[$selectedIndex].FullName
$backupName = $backups[$selectedIndex].Name

Write-Host ""
Write-Host "WARNING: This will REPLACE all data in Railway database!" -ForegroundColor Red
Write-Host "Selected backup: $backupName" -ForegroundColor Yellow
Write-Host ""
$confirm = Read-Host "Are you sure you want to continue? (type 'YES' to confirm)"

if ($confirm -ne "YES") {
    Write-Host "Restore cancelled." -ForegroundColor Yellow
    exit 0
}

# Check for PostgreSQL tools
Write-Host ""
Write-Host "Checking for PostgreSQL tools..." -ForegroundColor Yellow
$pgRestorePath = $null
$psqlPath = $null

$possiblePaths = @(
    "C:\Program Files\PostgreSQL\16\bin",
    "C:\Program Files\PostgreSQL\15\bin",
    "C:\Program Files\PostgreSQL\14\bin",
    "C:\Program Files (x86)\PostgreSQL\16\bin",
    "C:\Program Files (x86)\PostgreSQL\15\bin",
    "C:\Program Files (x86)\PostgreSQL\14\bin"
)

foreach ($path in $possiblePaths) {
    if (Test-Path "$path\pg_restore.exe") {
        $pgRestorePath = "$path\pg_restore.exe"
        $psqlPath = "$path\psql.exe"
        Write-Host "✓ Found PostgreSQL tools at: $path" -ForegroundColor Green
        break
    }
}

if (-not $pgRestorePath) {
    $pgRestoreInPath = Get-Command pg_restore -ErrorAction SilentlyContinue
    $psqlInPath = Get-Command psql -ErrorAction SilentlyContinue
    if ($pgRestoreInPath -and $psqlInPath) {
        $pgRestorePath = $pgRestoreInPath.Source
        $psqlPath = $psqlInPath.Source
        Write-Host "✓ Found PostgreSQL tools in PATH" -ForegroundColor Green
    } else {
        Write-Host "✗ PostgreSQL tools not found!" -ForegroundColor Red
        exit 1
    }
}

$env:PGPASSWORD = $RAILWAY_PASSWORD

try {
    Write-Host ""
    Write-Host "Starting restore process..." -ForegroundColor Yellow
    
    if ($backupFile -like "*.sql") {
        Write-Host "Restoring from SQL file..." -ForegroundColor Yellow
        
        & $psqlPath `
            --host=$RAILWAY_HOST `
            --port=$RAILWAY_PORT `
            --username=$RAILWAY_USER `
            --dbname=$RAILWAY_DB `
            --file=$backupFile
        
    } elseif ($backupFile -like "*.dump") {
        Write-Host "Restoring from custom format file..." -ForegroundColor Yellow
        
        & $pgRestorePath `
            --host=$RAILWAY_HOST `
            --port=$RAILWAY_PORT `
            --username=$RAILWAY_USER `
            --dbname=$RAILWAY_DB `
            --clean `
            --if-exists `
            --no-owner `
            --no-acl `
            --verbose `
            $backupFile
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✓ Restore completed successfully!" -ForegroundColor Green
        Write-Host "Database has been restored from: $backupName" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "⚠ Restore completed with warnings" -ForegroundColor Yellow
        Write-Host "Check the output above for details" -ForegroundColor Yellow
    }

} catch {
    Write-Host ""
    Write-Host "✗ Error during restore: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
}

Write-Host ""
