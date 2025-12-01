# Script untuk Export Database PostgreSQL Lokal
# Run: powershell -ExecutionPolicy Bypass -File export-db.ps1

Write-Host "=== VAULT PULSE CENTER - DATABASE EXPORT ===" -ForegroundColor Cyan
Write-Host ""

# Configuration
$pgPath = "C:\Program Files\PostgreSQL\16\bin"
$dbName = "vault_pulse_db"
$username = "postgres"
$backupFile = "vault_pulse_backup.sql"

Write-Host "Exporting database..." -ForegroundColor Yellow
Write-Host "Database: $dbName" -ForegroundColor White
Write-Host "Output: $backupFile" -ForegroundColor White
Write-Host ""

$pgDump = "$pgPath\pg_dump.exe"

if (Test-Path $pgDump) {
    Write-Host "PostgreSQL found!" -ForegroundColor Green
    Write-Host "Running pg_dump (will ask for password)..." -ForegroundColor Cyan
    Write-Host ""
    
    # Export database
    & $pgDump -U $username -d $dbName -f $backupFile -v
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "SUCCESS! Database exported" -ForegroundColor Green
        Write-Host "File: $backupFile" -ForegroundColor White
        
        # Show file size
        if (Test-Path $backupFile) {
            $fileSize = (Get-Item $backupFile).Length / 1KB
            Write-Host "Size: $([math]::Round($fileSize, 2)) KB" -ForegroundColor White
        }
    } else {
        Write-Host ""
        Write-Host "FAILED! Export failed" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "ERROR! PostgreSQL not found at: $pgPath" -ForegroundColor Red
    Write-Host "Update path in script if different" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "NEXT: Setup database di DomaiNesia cPanel" -ForegroundColor Cyan
Write-Host "See DATABASE_IMPORT_GUIDE.md for details" -ForegroundColor White
Write-Host ""
