# ============================================
# Railway PostgreSQL Backup - Quick Run
# ============================================
# Simple one-click backup without prompts
# ============================================

$ErrorActionPreference = "Stop"

$RAILWAY_HOST = "interchange.proxy.rlwy.net"
$RAILWAY_PORT = "17998"
$RAILWAY_USER = "postgres"
$RAILWAY_PASSWORD = "NBZKefiMdNJhwivSCoLSnafLhdMXapYZ"
$RAILWAY_DB = "railway"

$BACKUP_DIR = "database-backups"
$TIMESTAMP = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$BACKUP_FILE = "${BACKUP_DIR}/railway_${TIMESTAMP}.sql"

Write-Host "Quick Backup Starting..." -ForegroundColor Cyan

# Find pg_dump
$pgDump = $null
$paths = @(
    "C:\Program Files\PostgreSQL\16\bin\pg_dump.exe",
    "C:\Program Files\PostgreSQL\15\bin\pg_dump.exe",
    "C:\Program Files\PostgreSQL\14\bin\pg_dump.exe"
)

foreach ($path in $paths) {
    if (Test-Path $path) { $pgDump = $path; break }
}

if (-not $pgDump) {
    $cmd = Get-Command pg_dump -ErrorAction SilentlyContinue
    if ($cmd) { $pgDump = $cmd.Source }
}

if (-not $pgDump) {
    Write-Host "[ERROR] pg_dump not found! Install PostgreSQL first." -ForegroundColor Red
    exit 1
}

# Create backup dir
if (-not (Test-Path $BACKUP_DIR)) {
    New-Item -ItemType Directory -Path $BACKUP_DIR | Out-Null
}

$env:PGPASSWORD = $RAILWAY_PASSWORD

try {
    Write-Host "Backing up Railway database..." -ForegroundColor Yellow
    
    & $pgDump `
        --host=$RAILWAY_HOST `
        --port=$RAILWAY_PORT `
        --username=$RAILWAY_USER `
        --dbname=$RAILWAY_DB `
        --file=$BACKUP_FILE `
        --no-owner `
        --no-acl
    
    if ($LASTEXITCODE -eq 0) {
        $size = (Get-Item $BACKUP_FILE).Length / 1MB
        Write-Host "[SUCCESS] Backup complete!" -ForegroundColor Green
        Write-Host "   File: $BACKUP_FILE" -ForegroundColor Gray
        Write-Host "   Size: $([math]::Round($size, 2)) MB" -ForegroundColor Gray
    } else {
        Write-Host "[ERROR] Backup failed!" -ForegroundColor Red
        exit 1
    }
} finally {
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
}
