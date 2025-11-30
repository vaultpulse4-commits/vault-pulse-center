#!/bin/bash

echo "========================================"
echo "Vault Pulse Center - Quick Setup"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js tidak terinstall!"
    echo "Silakan download dan install dari: https://nodejs.org/"
    exit 1
fi

echo "[1/6] Node.js terdeteksi"
node --version
echo ""

# Check if PostgreSQL is running
if ! command -v pg_isready &> /dev/null; then
    echo "WARNING: PostgreSQL tidak terdeteksi"
    echo "Pastikan PostgreSQL sudah terinstall dan berjalan"
    echo ""
fi

# Setup Backend
echo "[2/6] Setup Backend - Installing dependencies..."
cd server

if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo ""
    echo "PENTING: Edit file server/.env dan sesuaikan DATABASE_URL!"
    echo "Contoh: DATABASE_URL=\"postgresql://postgres:password@localhost:5432/vault_pulse_db\""
    echo ""
    read -p "Press enter to continue after editing .env file..."
fi

npm install
if [ $? -ne 0 ]; then
    echo "ERROR: npm install gagal di backend"
    exit 1
fi
echo ""

echo "[3/6] Generating Prisma Client..."
npm run prisma:generate
if [ $? -ne 0 ]; then
    echo "ERROR: Prisma generate gagal"
    echo "Check DATABASE_URL di server/.env"
    exit 1
fi
echo ""

echo "[4/6] Running Database Migrations..."
npm run prisma:migrate
if [ $? -ne 0 ]; then
    echo "ERROR: Migration gagal"
    echo "Pastikan database sudah dibuat dan DATABASE_URL benar"
    exit 1
fi
echo ""

echo "[5/6] Seeding Database with sample data..."
npm run prisma:seed
echo ""

cd ..

# Setup Frontend
echo "[6/6] Setup Frontend - Installing dependencies..."
if [ ! -f .env ]; then
    cp .env.example .env
fi

npm install
if [ $? -ne 0 ]; then
    echo "ERROR: npm install gagal di frontend"
    exit 1
fi
echo ""

echo "========================================"
echo "Setup BERHASIL!"
echo "========================================"
echo ""
echo "Untuk menjalankan aplikasi:"
echo ""
echo "1. Buka terminal pertama, jalankan backend:"
echo "   cd server"
echo "   npm run dev"
echo ""
echo "2. Buka terminal kedua, jalankan frontend:"
echo "   npm run dev"
echo ""
echo "3. Akses aplikasi di browser: http://localhost:5173"
echo ""
echo "Default login:"
echo "   Email: admin@vaultclub.com"
echo "   Password: admin123"
echo ""
echo "========================================"
