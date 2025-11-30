# 🚀 Start Development Servers

Write-Host "🚀 Starting Vault Pulse Center..." -ForegroundColor Green
Write-Host ""

# Check if backend is already running
$backendRunning = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue

if ($backendRunning) {
    Write-Host "✅ Backend already running on port 3001" -ForegroundColor Green
} else {
    Write-Host "Starting backend server..." -ForegroundColor Yellow
    # Backend will start in background
}

Write-Host ""
Write-Host "✨ Access Points:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor Gray
Write-Host "   Backend API: http://localhost:3001" -ForegroundColor Gray
Write-Host "   Health Check: http://localhost:3001/health" -ForegroundColor Gray
Write-Host "   Prisma Studio: npm run prisma:studio (in server folder)" -ForegroundColor Gray
Write-Host ""
Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Yellow
Write-Host ""

# Start backend in background job if not running
if (-not $backendRunning) {
    $backend = Start-Job -ScriptBlock {
        Set-Location $using:PWD/server
        npm run dev
    }
    Write-Host "✅ Backend started" -ForegroundColor Green
    Start-Sleep -Seconds 2
}

# Start frontend
Write-Host "Starting frontend..." -ForegroundColor Yellow

try {
    if (Get-Command bun -ErrorAction SilentlyContinue) {
        bun run dev
    } else {
        npm run dev
    }
}
finally {
    if ($backend) {
        Write-Host ""
        Write-Host "🛑 Stopping backend..." -ForegroundColor Red
        Stop-Job -Job $backend -ErrorAction SilentlyContinue
        Remove-Job -Job $backend -ErrorAction SilentlyContinue
        Write-Host "✅ Backend stopped" -ForegroundColor Green
    }
}
