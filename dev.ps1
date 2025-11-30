# Development Scripts

Write-Host "🚀 Starting Vault Pulse Center Development Servers..." -ForegroundColor Green
Write-Host ""

# Check if backend dependencies are installed
if (-not (Test-Path "server/node_modules")) {
    Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location server
    npm install
    Set-Location ..
}

# Check if frontend dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
    bun install
}

# Check if .env exists
if (-not (Test-Path "server/.env")) {
    Write-Host "⚠️  WARNING: server/.env not found!" -ForegroundColor Red
    Write-Host "📝 Copying .env.example to .env..." -ForegroundColor Yellow
    Copy-Item "server/.env.example" "server/.env"
    Write-Host "✏️  Please edit server/.env with your database credentials" -ForegroundColor Yellow
    Write-Host "Press any key to continue..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating frontend .env..." -ForegroundColor Yellow
    "VITE_API_URL=http://localhost:3001" | Out-File -FilePath ".env" -Encoding utf8
}

Write-Host ""
Write-Host "✨ Starting servers..." -ForegroundColor Green
Write-Host "   Backend will run on http://localhost:3001" -ForegroundColor Cyan
Write-Host "   Frontend will run on http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow
Write-Host ""

# Start backend in background job
$backend = Start-Job -ScriptBlock {
    Set-Location $using:PWD/server
    npm run dev
}

# Wait a bit for backend to start
Start-Sleep -Seconds 2

# Start frontend in background job
$frontend = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    bun run dev
}

# Monitor jobs
try {
    while ($true) {
        $backendOutput = Receive-Job -Job $backend
        $frontendOutput = Receive-Job -Job $frontend
        
        if ($backendOutput) {
            Write-Host "[BACKEND] $backendOutput" -ForegroundColor Blue
        }
        if ($frontendOutput) {
            Write-Host "[FRONTEND] $frontendOutput" -ForegroundColor Magenta
        }
        
        Start-Sleep -Milliseconds 100
    }
}
finally {
    Write-Host ""
    Write-Host "🛑 Stopping servers..." -ForegroundColor Red
    Stop-Job -Job $backend, $frontend
    Remove-Job -Job $backend, $frontend
    Write-Host "✅ Servers stopped" -ForegroundColor Green
}
