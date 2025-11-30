# Quick Start Guide - Vault Pulse Center

## 🚀 Cara Cepat Running Project

### Step 1: Install Dependencies

```powershell
# Install frontend dependencies (di root folder)
bun install

# Install backend dependencies
cd server
npm install
cd ..
```

### Step 2: Setup Database

**Option A: PostgreSQL Lokal**
```powershell
# Install PostgreSQL dari https://www.postgresql.org/download/windows/
# Atau pakai Docker:
docker run --name vault-postgres -e POSTGRES_PASSWORD=vault123 -e POSTGRES_DB=vault_pulse -p 5432:5432 -d postgres
```

**Option B: PostgreSQL Cloud (Gratis)**
- Daftar di [Supabase](https://supabase.com) (gratis)
- Buat project baru
- Copy connection string dari Settings → Database

### Step 3: Configure Environment

**Frontend (.env)**
```powershell
# Create .env di root folder
echo "VITE_API_URL=http://localhost:3001" > .env
```

**Backend (server/.env)**
```powershell
# Create .env di folder server
cd server
Copy-Item .env.example .env
# Edit .env dan ganti DATABASE_URL dengan connection string kamu
```

### Step 4: Setup Database Schema

```powershell
cd server
npm run prisma:generate
npm run prisma:migrate
cd ..
```

### Step 5: Run Development Servers

**Terminal 1 - Backend:**
```powershell
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
# Di root folder
bun run dev
```

### Step 6: Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/health

## 🎯 Deploy ke Production (AUTO-UPDATE!)

### Quick Deploy (5 menit!)

1. **Push ke GitHub**
   ```powershell
   git add .
   git commit -m "Setup backend API"
   git push origin main
   ```

2. **Deploy Backend (Railway - Gratis)**
   - Buka [railway.app](https://railway.app)
   - Login dengan GitHub
   - "New Project" → "Deploy from GitHub repo"
   - Pilih `vault-pulse-center`
   - Add "PostgreSQL" database
   - **Done!** Auto-deploy setiap push 🎉

3. **Deploy Frontend (Vercel - Gratis)**
   - Buka [vercel.com](https://vercel.com)
   - "New Project" → Import repository
   - Set environment: `VITE_API_URL` = URL Railway kamu
   - **Done!** Auto-deploy setiap push 🎉

4. **Update Backend CORS**
   - Di Railway, buka backend settings
   - Add env var: `FRONTEND_URL` = URL Vercel kamu
   - Done!

## ✅ Verification Checklist

- [ ] Frontend running di http://localhost:5173
- [ ] Backend running di http://localhost:3001
- [ ] Database connected (cek backend console)
- [ ] API health check works: http://localhost:3001/health
- [ ] Frontend dapat connect ke backend
- [ ] Data bisa di-create/edit/delete

## 🐛 Troubleshooting

### Backend tidak bisa connect ke database
```powershell
# Check PostgreSQL running
# Update DATABASE_URL di server/.env
# Run migrations lagi
cd server
npm run prisma:migrate
```

### Frontend tidak bisa connect ke backend
```powershell
# Check VITE_API_URL di .env
# Check backend running
# Check CORS settings di server
```

### Build error
```powershell
# Clear cache dan reinstall
rm -rf node_modules
rm -rf server/node_modules
bun install
cd server && npm install
```

## 📱 Next Steps

Setelah running, kamu bisa:
1. ✅ Test create/edit data di dashboard
2. ✅ Monitor real-time updates
3. ✅ Deploy ke production
4. ✅ Share URL ke customer untuk testing!

## 🆘 Need Help?

Contact developer team untuk support.

---

**Setiap push ke GitHub akan AUTO-DEPLOY ke production! 🚀**
