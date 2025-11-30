# 🚀 Quick Setup Guide - Vault Pulse Center

**Setup untuk Customer Baru - Extract and Run**

## ⚙️ Prerequisites yang HARUS Diinstall

Sebelum menjalankan project, pastikan sudah terinstall:

1. **Node.js** (versi 18 atau lebih tinggi)
   - Download: https://nodejs.org/
   - Cek instalasi: `node --version`

2. **PostgreSQL** (Database)
   - Download: https://www.postgresql.org/download/
   - Atau gunakan Docker: `docker run --name vault-postgres -e POSTGRES_PASSWORD=123456 -p 5432:5432 -d postgres`
   - Cek instalasi: `psql --version`

3. **npm** (biasanya sudah include dengan Node.js)
   - Cek instalasi: `npm --version`

## 📦 Step-by-Step Setup

### 1️⃣ Extract Project
```bash
# Extract file vault-pulse-center.zip ke folder pilihan Anda
unzip vault-pulse-center.zip
cd vault-pulse-center
```

### 2️⃣ Setup Database PostgreSQL

#### Cara 1: Menggunakan pgAdmin atau psql
```sql
-- Buat database baru
CREATE DATABASE vault_pulse_db;

-- Atau gunakan command line:
-- createdb vault_pulse_db
```

#### Cara 2: Database sudah ada
- Pastikan PostgreSQL berjalan di port 5432
- Note username dan password database Anda

### 3️⃣ Setup Backend (Server)

```bash
# Masuk ke folder server
cd server

# Install dependencies
npm install

# Copy file .env.example menjadi .env
# Windows:
copy .env.example .env
# Mac/Linux:
cp .env.example .env

# Edit file .env dengan text editor
# Sesuaikan DATABASE_URL dengan kredensial database Anda
```

**Edit file `server/.env`:**
```env
DATABASE_URL="postgresql://postgres:123456@localhost:5432/vault_pulse_db?schema=public"
#                        ^^^^^^  ^^^^^^              ^^^^^^^^^^^^^^
#                        user    password            database name

PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Generate Prisma Client dan Run Migration:**
```bash
# Generate Prisma Client
npm run prisma:generate

# Run database migrations (buat tables)
npm run prisma:migrate

# Seed database dengan sample data
npm run prisma:seed
```

✅ Backend setup selesai! Server siap dijalankan.

### 4️⃣ Setup Frontend

Buka terminal/command prompt BARU (jangan tutup terminal server):

```bash
# Kembali ke root folder project
cd ..  # (jika masih di folder server)

# Install dependencies
npm install

# Copy file .env.example menjadi .env
# Windows:
copy .env.example .env
# Mac/Linux:
cp .env.example .env
```

**File `.env` di root sudah OK (default):**
```env
VITE_API_URL=http://localhost:3001
```

✅ Frontend setup selesai!

## ▶️ Running the Application

Anda perlu 2 terminal/command prompt:

### Terminal 1: Backend Server
```bash
cd server
npm run dev
```

✅ Backend running di: **http://localhost:3001**
Anda akan melihat:
```
🚀 Server running on http://localhost:3001
📊 Environment: development
⚡ WebSocket enabled
```

### Terminal 2: Frontend Development Server
```bash
# Di root folder project
npm run dev
```

✅ Frontend running di: **http://localhost:5173**
Anda akan melihat:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## 🎉 Akses Application

Buka browser dan akses: **http://localhost:5173**

### Default Login Credentials:

**Admin Account:**
- Email: `admin@vaultclub.com`
- Password: `admin123`

**Manager Account:**
- Email: `manager.jakarta@vaultclub.com`
- Password: `manager123`

**Operator Account:**
- Email: `operator.bali@vaultclub.com`
- Password: `operator123`

## 🔍 Troubleshooting

### ❌ Error: `npm is not recognized` atau `scripts is disabled` (Windows)

#### Problem 1: `npm : The term 'npm' is not recognized...`

**Solusi 1: Restart PowerShell/Command Prompt**
- Tutup PowerShell/CMD yang sedang terbuka
- Buka PowerShell/CMD baru **sebagai Administrator**
- Coba lagi `npm --version`

**Solusi 2: Refresh PATH di PowerShell**
```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
npm --version
```

**Solusi 3: Reinstall Node.js**
- Uninstall Node.js dari Control Panel
- Download Node.js terbaru: https://nodejs.org/
- Install dengan opsi "Add to PATH" dicentang
- Restart komputer
- Cek instalasi: `node --version` dan `npm --version`

#### Problem 2: `running scripts is disabled on this system`

Error lengkap: `npm.ps1 cannot be loaded because running scripts is disabled...`

**⭐ Solusi Terbaik: Set Execution Policy (RECOMMENDED)**

1. Buka PowerShell **sebagai Administrator** (klik kanan > Run as Administrator)
2. Jalankan command ini:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
3. Ketik `Y` lalu Enter untuk konfirmasi
4. Tutup PowerShell Administrator
5. Buka PowerShell baru (tidak perlu admin)
6. Test: `npm --version`
7. Lanjutkan setup: `npm install`

**✅ Solusi Alternatif: Gunakan Command Prompt (CMD)**

Jika tidak bisa ubah Execution Policy, gunakan **Command Prompt** bukan PowerShell:

1. Tekan `Win + R`, ketik `cmd`, Enter
2. Navigate ke folder project:
   ```cmd
   cd "D:\Project\VAULT\3. INDONESIA\vault-pulse-center-customer\server"
   ```
3. Jalankan:
   ```cmd
   npm install
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   ```

**Solusi Temporary: Bypass Execution Policy (Tidak Recommended)**
```powershell
# Hanya untuk 1 command
powershell -ExecutionPolicy Bypass -Command "npm install"
```

### ❌ Error: `DATABASE_URL` not found
- Pastikan file `.env` ada di folder `server/`
- Check file `.env` sudah diisi dengan benar

### ❌ Error: `Cannot connect to database`
- Pastikan PostgreSQL service berjalan
- Check username, password, dan port di `.env`
- Check database `vault_pulse_db` sudah dibuat

### ❌ Port sudah digunakan
**Backend (3001):**
```bash
# Ubah PORT di server/.env
PORT=3002
```

**Frontend (5173):**
```bash
# Vite otomatis akan pakai port lain jika 5173 sudah terpakai
# Atau paksa port tertentu:
npm run dev -- --port 5174
```

### ❌ Error: `node_modules not found`
```bash
# Jalankan ulang install
npm install          # di root folder
cd server
npm install          # di folder server
```

### ❌ Migration failed
```bash
# Reset database dan run ulang migration
cd server
npx prisma migrate reset
npm run prisma:seed
```

## 📁 File Structure

```
vault-pulse-center/
├── .env                    # Frontend environment variables
├── package.json            # Frontend dependencies
├── src/                    # Frontend source code
├── public/                 # Static assets
└── server/
    ├── .env               # Backend environment variables ⚠️ IMPORTANT
    ├── package.json       # Backend dependencies
    ├── prisma/
    │   ├── schema.prisma  # Database schema
    │   ├── seed.ts        # Sample data
    │   └── migrations/    # Database migrations
    └── src/               # Backend source code
```

## ✅ Quick Checklist

- [ ] Node.js terinstall (`node --version`)
- [ ] PostgreSQL terinstall dan running
- [ ] Database `vault_pulse_db` sudah dibuat
- [ ] File `server/.env` sudah dikonfigurasi dengan benar
- [ ] `npm install` di root folder berhasil
- [ ] `npm install` di folder server berhasil
- [ ] `npm run prisma:migrate` berhasil
- [ ] `npm run prisma:seed` berhasil
- [ ] Backend running di terminal 1 (port 3001)
- [ ] Frontend running di terminal 2 (port 5173)
- [ ] Bisa login di http://localhost:5173

## 🆘 Need Help?

Jika masih ada error:

1. **Check logs** di terminal untuk error message
2. **Pastikan semua prerequisites terinstall**
3. **Jalankan ulang setup dari awal** jika perlu
4. **Check DATABASE_URL** di `server/.env` - ini yang paling sering salah

## 📚 Additional Documentation

- **Full Documentation**: README.md
- **API Documentation**: server/README.md
- **Deployment Guide**: DEPLOYMENT.md
- **Testing Guide**: TESTING_GUIDE.md
- **PWA Features**: PWA_DOCUMENTATION.md

---

**Happy Coding! 🎯**

Jika ada pertanyaan, silakan hubungi tim development.
