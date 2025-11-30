@echo off
echo ========================================
echo Vault Pulse Center - Quick Setup
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js tidak terinstall!
    echo Silakan download dan install dari: https://nodejs.org/
    pause
    exit /b 1
)

echo [1/6] Node.js terdeteksi
node --version
echo.

REM Check if PostgreSQL is running
pg_isready >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: PostgreSQL tidak terdeteksi atau tidak berjalan
    echo Pastikan PostgreSQL sudah terinstall dan berjalan
    echo.
)

REM Setup Backend
echo [2/6] Setup Backend - Installing dependencies...
cd server
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo.
    echo PENTING: Edit file server\.env dan sesuaikan DATABASE_URL!
    echo Contoh: DATABASE_URL="postgresql://postgres:password@localhost:5432/vault_pulse_db"
    echo.
    pause
)

call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install gagal di backend
    pause
    exit /b 1
)
echo.

echo [3/6] Generating Prisma Client...
call npm run prisma:generate
if %errorlevel% neq 0 (
    echo ERROR: Prisma generate gagal
    echo Check DATABASE_URL di server\.env
    pause
    exit /b 1
)
echo.

echo [4/6] Running Database Migrations...
call npm run prisma:migrate
if %errorlevel% neq 0 (
    echo ERROR: Migration gagal
    echo Pastikan database sudah dibuat dan DATABASE_URL benar
    pause
    exit /b 1
)
echo.

echo [5/6] Seeding Database with sample data...
call npm run prisma:seed
echo.

cd ..

REM Setup Frontend
echo [6/6] Setup Frontend - Installing dependencies...
if not exist .env (
    copy .env.example .env
)

call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install gagal di frontend
    pause
    exit /b 1
)
echo.

echo ========================================
echo Setup BERHASIL! 
echo ========================================
echo.
echo Untuk menjalankan aplikasi:
echo.
echo 1. Buka terminal pertama, jalankan backend:
echo    cd server
echo    npm run dev
echo.
echo 2. Buka terminal kedua, jalankan frontend:
echo    npm run dev
echo.
echo 3. Akses aplikasi di browser: http://localhost:5173
echo.
echo Default login:
echo    Email: admin@vaultclub.com
echo    Password: admin123
echo.
echo ========================================
pause
