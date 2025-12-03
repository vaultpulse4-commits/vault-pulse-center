# ============================================
# Railway PostgreSQL Simple Backup
# ============================================
# Uses COPY command via psql (no version issues)
# ============================================

$ErrorActionPreference = "Stop"

$RAILWAY_HOST = "interchange.proxy.rlwy.net"
$RAILWAY_PORT = "17998"
$RAILWAY_USER = "postgres"
$RAILWAY_PASSWORD = "NBZKefiMdNJhwivSCoLSnafLhdMXapYZ"
$RAILWAY_DB = "railway"

$BACKUP_DIR = "database-backups"
$TIMESTAMP = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Railway Database Backup Tool" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Find psql
$psqlPath = $null
$paths = @(
    "C:\Program Files\PostgreSQL\16\bin\psql.exe",
    "C:\Program Files\PostgreSQL\15\bin\psql.exe",
    "C:\Program Files\PostgreSQL\14\bin\psql.exe"
)

foreach ($path in $paths) {
    if (Test-Path $path) { 
        $psqlPath = $path
        Write-Host "[OK] Found psql: $path" -ForegroundColor Green
        break 
    }
}

if (-not $psqlPath) {
    $cmd = Get-Command psql -ErrorAction SilentlyContinue
    if ($cmd) { 
        $psqlPath = $cmd.Source 
        Write-Host "[OK] Found psql in PATH" -ForegroundColor Green
    }
}

if (-not $psqlPath) {
    Write-Host "[ERROR] psql not found!" -ForegroundColor Red
    Write-Host "Please install PostgreSQL client tools" -ForegroundColor Yellow
    exit 1
}

# Create backup dir
if (-not (Test-Path $BACKUP_DIR)) {
    New-Item -ItemType Directory -Path $BACKUP_DIR | Out-Null
}

Write-Host ""
Write-Host "Fetching database structure and data..." -ForegroundColor Yellow
Write-Host ""

$env:PGPASSWORD = $RAILWAY_PASSWORD

try {
    # Get list of all tables
    Write-Host "Getting table list..." -ForegroundColor Gray
    $query = @"
SELECT schemaname || '.' || tablename 
FROM pg_tables 
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY schemaname, tablename;
"@

    $tables = & $psqlPath `
        -h $RAILWAY_HOST `
        -p $RAILWAY_PORT `
        -U $RAILWAY_USER `
        -d $RAILWAY_DB `
        -t `
        -A `
        -c $query

    if (-not $tables) {
        Write-Host "[WARNING] No tables found or connection failed" -ForegroundColor Yellow
        exit 1
    }

    $tableList = $tables -split "`n" | Where-Object { $_.Trim() -ne "" }
    Write-Host "[OK] Found $($tableList.Count) tables" -ForegroundColor Green
    Write-Host ""

    # Backup each table
    $successCount = 0
    $backupFiles = @()

    foreach ($table in $tableList) {
        $table = $table.Trim()
        if ($table -eq "") { continue }

        $safeName = $table -replace '[^a-zA-Z0-9_]', '_'
        $tableFile = "${BACKUP_DIR}/${TIMESTAMP}_${safeName}.csv"
        
        Write-Host "Backing up: $table" -ForegroundColor Gray -NoNewline
        
        try {
            $copyQuery = "COPY $table TO STDOUT WITH CSV HEADER;"
            & $psqlPath `
                -h $RAILWAY_HOST `
                -p $RAILWAY_PORT `
                -U $RAILWAY_USER `
                -d $RAILWAY_DB `
                -c $copyQuery `
                -o $tableFile `
                2>&1 | Out-Null

            if (Test-Path $tableFile) {
                $size = (Get-Item $tableFile).Length
                Write-Host " - OK ($([math]::Round($size/1KB, 1)) KB)" -ForegroundColor Green
                $backupFiles += $tableFile
                $successCount++
            } else {
                Write-Host " - SKIP (no data)" -ForegroundColor Yellow
            }
        } catch {
            Write-Host " - ERROR" -ForegroundColor Red
        }
    }

    # Also backup schema
    Write-Host ""
    Write-Host "Backing up database schema..." -ForegroundColor Yellow
    
    $schemaFile = "${BACKUP_DIR}/${TIMESTAMP}_schema.sql"
    $schemaQuery = @"
SELECT 
    'CREATE TABLE ' || table_schema || '.' || table_name || ' (' ||
    string_agg(column_name || ' ' || data_type, ', ') || ');'
FROM information_schema.columns
WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
GROUP BY table_schema, table_name;
"@

    & $psqlPath `
        -h $RAILWAY_HOST `
        -p $RAILWAY_PORT `
        -U $RAILWAY_USER `
        -d $RAILWAY_DB `
        -c $schemaQuery `
        -o $schemaFile `
        2>&1 | Out-Null

    Write-Host "[OK] Schema backed up" -ForegroundColor Green

    # Create backup summary
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host "Backup Summary" -ForegroundColor Cyan
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host "Timestamp: $TIMESTAMP" -ForegroundColor White
    Write-Host "Tables backed up: $successCount / $($tableList.Count)" -ForegroundColor White
    Write-Host "Location: $BACKUP_DIR" -ForegroundColor White
    
    # Calculate total size
    $totalSize = 0
    Get-ChildItem "${BACKUP_DIR}/${TIMESTAMP}_*" | ForEach-Object {
        $totalSize += $_.Length
    }
    Write-Host "Total size: $([math]::Round($totalSize/1MB, 2)) MB" -ForegroundColor White
    
    Write-Host ""
    Write-Host "[SUCCESS] Backup completed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Files created:" -ForegroundColor Yellow
    Get-ChildItem "${BACKUP_DIR}/${TIMESTAMP}_*" | ForEach-Object {
        Write-Host "  $($_.Name)" -ForegroundColor Gray
    }
    Write-Host ""

} catch {
    Write-Host ""
    Write-Host "[ERROR] $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
}
