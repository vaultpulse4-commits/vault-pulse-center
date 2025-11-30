# Setup Script for Vault Pulse Center

Write-Host "🎯 Vault Pulse Center - Setup Script" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Step 1: Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found! Please install from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check Bun (optional)
try {
    $bunVersion = bun --version
    Write-Host "✅ Bun installed: $bunVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Bun not found. Will use npm instead." -ForegroundColor Yellow
    Write-Host "   To install Bun: https://bun.sh" -ForegroundColor Cyan
}

# Check Git
try {
    $gitVersion = git --version
    Write-Host "✅ Git installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Git not found. Install from https://git-scm.com" -ForegroundColor Yellow
}

Write-Host ""

# Step 2: Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
Write-Host ""

# Frontend
Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
try {
    bun install
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Bun failed, trying npm..." -ForegroundColor Yellow
    npm install
    Write-Host "✅ Frontend dependencies installed with npm" -ForegroundColor Green
}

Write-Host ""

# Backend
Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
Set-Location server
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "❌ Backend installation failed!" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Set-Location ..

Write-Host ""

# Step 3: Setup environment files
Write-Host "🔧 Setting up environment files..." -ForegroundColor Yellow

# Frontend .env
if (-not (Test-Path ".env")) {
    "VITE_API_URL=http://localhost:3001" | Out-File -FilePath ".env" -Encoding utf8
    Write-Host "✅ Created .env for frontend" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env already exists, skipping" -ForegroundColor Yellow
}

# Backend .env
if (-not (Test-Path "server/.env")) {
    Copy-Item "server/.env.example" "server/.env"
    Write-Host "✅ Created server/.env from template" -ForegroundColor Green
    Write-Host "⚠️  IMPORTANT: Edit server/.env with your database credentials!" -ForegroundColor Red
} else {
    Write-Host "⚠️  server/.env already exists, skipping" -ForegroundColor Yellow
}

Write-Host ""

# Step 4: Database setup instructions
Write-Host "💾 Database Setup Instructions:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Option 1: Local PostgreSQL" -ForegroundColor Cyan
Write-Host "  - Download: https://www.postgresql.org/download/windows/" -ForegroundColor Gray
Write-Host "  - Or use Docker: docker run --name vault-postgres -e POSTGRES_PASSWORD=vault123 -e POSTGRES_DB=vault_pulse -p 5432:5432 -d postgres" -ForegroundColor Gray
Write-Host ""
Write-Host "Option 2: Supabase (Free Cloud)" -ForegroundColor Cyan
Write-Host "  1. Sign up at https://supabase.com" -ForegroundColor Gray
Write-Host "  2. Create new project" -ForegroundColor Gray
Write-Host "  3. Copy connection string from Settings → Database" -ForegroundColor Gray
Write-Host "  4. Paste into server/.env (DATABASE_URL)" -ForegroundColor Gray
Write-Host ""

Write-Host "After database setup, run:" -ForegroundColor Yellow
Write-Host "  cd server" -ForegroundColor Cyan
Write-Host "  npm run prisma:generate" -ForegroundColor Cyan
Write-Host "  npm run prisma:migrate" -ForegroundColor Cyan
Write-Host "  cd .." -ForegroundColor Cyan
Write-Host ""

# Step 5: Summary
Write-Host "✨ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Edit server/.env with your database credentials" -ForegroundColor Gray
Write-Host "  2. Run database migrations (see instructions above)" -ForegroundColor Gray
Write-Host "  3. Start development servers: .\dev.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host "  - Quick Start: QUICKSTART.md" -ForegroundColor Gray
Write-Host "  - Deployment: DEPLOYMENT.md" -ForegroundColor Gray
Write-Host "  - Backend API: server/README.md" -ForegroundColor Gray
Write-Host ""
Write-Host "Happy coding! 🚀" -ForegroundColor Green
