# 🚀 DEPLOY KE NIAGAHOSTER - STEP BY STEP

Anda sudah punya Niagahoster hosting! Bagus! Ini panduan lengkap untuk deploy Vault Pulse Center ke hosting Niagahoster + domain.

---

## 📋 YANG ANDA PUNYA

Dari screenshot DomaiNesia (Niagahoster):
- ✅ Hosting account (login: rappwebi)
- ✅ Domain: `rapp.web.id`
- ✅ Shared IP: 36.50.77.60
- ✅ Home Directory: `/home/rappwebi`
- ✅ SSH Access available (How to Access SSH)
- ✅ cPanel/File Manager access

---

## ⚠️ PROBLEM: Hosting Niagahoster ≠ VPS

Penting dipahami dulu:

### Niagahoster Anda adalah **Shared Hosting** (bukan VPS)

**Shared Hosting artinya:**
- ❌ Tidak bisa install Node.js
- ❌ Tidak bisa install PostgreSQL
- ❌ Tidak bisa run backend server
- ❌ Tidak bisa full control

**Apa yang BISA dilakukan di Shared Hosting:**
- ✅ Upload static files (HTML, CSS, JS)
- ✅ Run PHP (sudah ada)
- ✅ Run Python scripts
- ✅ Cron jobs
- ✅ Limited database (MySQL/MariaDB)

---

## 🎯 SOLUSI UNTUK ANDA

Ada 3 pilihan:

### PILIHAN 1: Frontend di Niagahoster + Backend di Cloud (RECOMMENDED)

**Setup:**
- Frontend (React) → Deploy ke Niagahoster (static files)
- Backend (Node.js) → Deploy ke Railway.app atau cloud service ($5-20/bulan)
- Database (PostgreSQL) → Railway.app (included)

**Pros:**
- ✅ Pakai hosting yang sudah ada
- ✅ Hanya tambah backend service ($5-20/bulan)
- ✅ Total cost: ~$10-25/bulan
- ✅ Flexible & scalable

**Cons:**
- ⚠️ Domain jadi 2 bagian:
  - `https://rapp.web.id` (frontend)
  - `https://api.rapp.web.id` (backend - di Railway)

**Effort**: Medium (15-30 menit setup)

---

### PILIHAN 2: Upgrade ke VPS Niagahoster

Niagahoster juga jual VPS:
- https://www.niagahoster.co.id/cloud-hosting

**Keuntungan:**
- ✅ Satu dashboard Niagahoster
- ✅ Support lokal Bahasa Indonesia
- ✅ Semua di satu tempat

**Biaya:**
- VPS StartUp: Rp 19k/bulan (1GB RAM - agak tight)
- VPS Standard: Rp 38k/bulan (2GB RAM - comfortable)
- VPS Professional: Rp 65k/bulan (4GB RAM - recommended)

**Effort**: Medium-High (2-3 jam setup)

---

### PILIHAN 3: Pakai Shared Hosting 100% (Backend di Niagahoster)

**Cara:**
- Build backend sebagai static files + serverless functions
- Deploy semua ke Niagahoster

**Cons:**
- ❌ Very complicated
- ❌ Limited functionality
- ❌ Performance akan sangat jelek
- ❌ Tidak scalable

**Effort**: Very High (bukan recommended)

---

## ✅ REKOMENDASI SAYA

Untuk situasi Anda:

### **PILIHAN 1**: Frontend Niagahoster + Backend Railway.app

**Alasan:**
- Pakai hosting yang sudah ada (Rp 0 tambahan untuk frontend)
- Backend di managed service yang murah ($5-20/bulan)
- Setup cepat (15-30 menit)
- Scalable & flexible
- Total cost: Rp ~200k/bulan (vs VPS)

**Timeline:**
1. Build frontend (10 menit)
2. Deploy ke Niagahoster (5 menit)
3. Deploy backend ke Railway (10 menit)
4. Setup domain & DNS (10 menit)
5. Done! (~35 menit total)

---

## 📖 STEP-BY-STEP GUIDE

### STEP 1: Build Frontend untuk Production

#### 1.1 Build React
```bash
cd d:\PROJECT Fastwork\vault-pulse-center

# Build frontend
npm run build
# atau
bun run build

# Output: folder "dist/" akan dibuat
# Isinya: index.html + assets
```

#### 1.2 Set API URL yang benar
Sebelum build, update `.env.production`:

```bash
# File: .env.production
VITE_API_URL=https://api.rapp.web.id
# atau
VITE_API_URL=https://railway-app-url.com/api
```

---

### STEP 2: Upload Frontend ke Niagahoster

#### 2.1 Login ke cPanel
1. Buka: https://rapp.web.id/cpanel
2. Login dengan username: `rappwebi`
3. Password: (sesuai hosting Anda)

#### 2.2 Akses File Manager
1. Di cPanel, cari **File Manager**
2. Pilih **public_html** folder
3. Upload semua files dari folder `dist/`

**Cara upload:**
```
Opsi A: Drag & drop
- Buka File Manager
- Select semua file di folder dist/
- Drag & drop ke public_html

Opsi B: Upload ZIP
- Zip folder dist/
- Upload zip ke public_html
- Extract di cPanel
```

#### 2.3 Buat file `.htaccess` untuk routing SPA

Buat file `.htaccess` di public_html/:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Jika file/folder exists, serve it
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Otherwise, rewrite to index.html (untuk SPA routing)
  RewriteRule ^ index.html [QSA,L]
</IfModule>
```

**Cara buat:**
1. Di File Manager, klik Create New File
2. Nama: `.htaccess`
3. Paste code di atas
4. Save

#### 2.4 Test Frontend
```
Buka di browser: https://rapp.web.id
Seharusnya aplikasi React muncul
```

---

### STEP 3: Deploy Backend ke Railway.app

#### 3.1 Siapkan Backend untuk Railway

Buat file `railway.json` di folder `server/`:

```json
{
  "build": {
    "builder": "nixpacks"
  }
}
```

Update `package.json` di server/ untuk production:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate deploy"
  }
}
```

#### 3.2 Push ke GitHub

```bash
cd d:\PROJECT Fastwork\vault-pulse-center

# Add files
git add .

# Commit
git commit -m "Ready for Railway deployment"

# Push
git push origin main
```

#### 3.3 Deploy ke Railway

1. Buka: https://railway.app
2. Login dengan GitHub
3. New Project → Deploy from GitHub repo
4. Select: `vault-pulse-center` repo
5. Select service: `server` directory
6. Configure:
   - **Build command**: `npm run build && npm run prisma:migrate`
   - **Start command**: `npm start`
7. Add variables:
   ```
   DATABASE_URL = (Railway akan auto-generate)
   PORT = 3001
   NODE_ENV = production
   FRONTEND_URL = https://rapp.web.id
   JWT_SECRET = (generate random string)
   ```
8. Deploy!

#### 3.4 Get Railway API URL
Setelah deploy:
1. Buka Railway dashboard
2. Copy domain: `your-railway-app.up.railway.app`
3. Backend URL akan seperti: `https://your-railway-app.up.railway.app`

---

### STEP 4: Setup Domain & DNS

#### 4.1 Update DNS Records di Niagahoster

1. Login ke cPanel Niagahoster
2. Pilih **Addon Domains** atau **Manage DNS**
3. Untuk subdomain `api.rapp.web.id`:

**Option A: Jika menggunakan Railway**
```
Subdomain: api
Type: CNAME
Value: your-railway-app.up.railway.app
TTL: 3600
```

**Option B: Manual redirect dengan htaccess**
```apache
# Di public_html/.htaccess
RewriteEngine On
RewriteCond %{HTTP_HOST} ^api\.rapp\.web\.id$ [NC]
RewriteRule ^(.*)$ https://your-railway-app.up.railway.app/$1 [P,L]
```

#### 4.2 Update Frontend .env

Edit `.env.production` di frontend:

```
VITE_API_URL=https://api.rapp.web.id
```

Rebuild & re-upload ke Niagahoster

---

### STEP 5: Testing

#### 5.1 Test Frontend
```bash
# Browser:
https://rapp.web.id
# Should show aplikasi React dengan normal
```

#### 5.2 Test Backend API
```bash
# Test health check:
curl https://api.rapp.web.id/health
# Should return: {"status":"ok",...}

# Atau di browser:
https://api.rapp.web.id/health
```

#### 5.3 Test Database Connection
```bash
# Di Railway dashboard, test database
# atau run query dari aplikasi
```

---

## 🔐 SECURITY CHECKLIST

- [ ] Update JWT_SECRET di Railway (random string)
- [ ] Update DATABASE_PASSWORD di Railway
- [ ] Enable HTTPS (Niagahoster sudah auto-provide)
- [ ] Update CORS di backend untuk domain: `https://rapp.web.id`
- [ ] Disable development mode di backend
- [ ] Test login functionality
- [ ] Test API security (JWT validation)

---

## 📊 ARCHITECTURE FINAL

```
┌─────────────────────────────────────────────────┐
│           VAULT PULSE CENTER - PRODUCTION       │
├─────────────────────────────────────────────────┤
│                                                 │
│  https://rapp.web.id (Frontend)                │
│  ├── Hosted: Niagahoster Shared Hosting       │
│  ├── Static files (HTML, CSS, JS)             │
│  └── Domain: rapp.web.id                      │
│                                                 │
│  ↕️  HTTPS                                       │
│                                                 │
│  https://api.rapp.web.id (Backend)            │
│  ├── Hosted: Railway.app                      │
│  ├── Node.js + Express server                 │
│  ├── WebSocket real-time                      │
│  └── Connected to Railway PostgreSQL          │
│                                                 │
│  Database: PostgreSQL @ Railway               │
│  └── Automatic backups                        │
│                                                 │
└─────────────────────────────────────────────────┘

Cost:
- Niagahoster hosting: Rp 19-120k/bulan (sudah ada)
- Railway backend: $5-20/bulan
- Domain: Rp 0 (sudah ada)
───────────────────────────────
Total: Rp ~200-400k/bulan
```

---

## 💰 COST BREAKDOWN

**Scenario 1: Frontend Niagahoster + Backend Railway**
```
Niagahoster (sudah ada):  Rp 0 (sudah bayar)
Railway ($10/bulan):      Rp 150k/bulan
Domain (sudah ada):       Rp 0
─────────────────────────────
Total/bulan:              Rp 150k (~$10 USD)
Total/tahun:              Rp 1.8jt (~$120 USD)
```

**Scenario 2: Upgrade ke VPS Niagahoster**
```
VPS Standard (2GB):       Rp 38k/bulan
Domain (sudah ada):       Rp 0
─────────────────────────────
Total/bulan:              Rp 38k (~$2.5 USD)
Total/tahun:              Rp 456k (~$30 USD)
```

**Scenario 3: Cloud Hosting (Railway all-in)**
```
Railway Frontend:         Free (Vercel)
Railway Backend:          $10/bulan
Railway Database:         Included
─────────────────────────────
Total/bulan:              $10
Total/tahun:              ~$120 USD
```

---

## ⚡ QUICK REFERENCE

### File yang perlu diubah/buat:

**1. Frontend (.env.production)**
```
VITE_API_URL=https://api.rapp.web.id
```

**2. Backend (server/.env di Railway)**
```
DATABASE_URL=postgresql://...
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://rapp.web.id
JWT_SECRET=random_secret_string
```

**3. Niagahoster (.htaccess)**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [QSA,L]
</IfModule>
```

**4. CORS (backend/src/index.ts)**
```typescript
const cors = require('cors');
app.use(cors({
  origin: ['https://rapp.web.id', 'https://api.rapp.web.id'],
  credentials: true
}));
```

---

## 🆚 OPSI TERBAIK UNTUK ANDA

### Sekarang (Quick Deployment):
**Frontend: Niagahoster + Backend: Railway**
- Time: ~30 menit
- Cost: Rp 150k/bulan
- Effort: Medium
- ✅ Best untuk start sekarang

### Jangka Panjang (Jika punya budget):
**VPS Niagahoster Standard**
- Time: ~2 jam (setup first time)
- Cost: Rp 38k/bulan
- Effort: Medium-High
- ✅ Better untuk long-term

### Future (Jika scalable):
**Cloud Hosting (Railway atau Vercel)**
- Time: ~15 menit
- Cost: $10/bulan
- Effort: Low
- ✅ Best untuk modern deployment

---

## 🆘 TROUBLESHOOTING

### Frontend tidak muncul
```
Problem: 404 di https://rapp.web.id
Solution:
1. Check public_html folder punya index.html
2. Check .htaccess sudah di-upload
3. Check rewrite module enabled di cPanel
```

### Backend tidak terhubung
```
Problem: API call error
Solution:
1. Check Railway deployment status
2. Check CORS di backend config
3. Check API URL di .env.production benar
4. Check DNS propagation (wait 5-30 min)
```

### HTTPS error
```
Problem: SSL certificate error
Solution:
1. Check domain SSL auto-renew di Niagahoster
2. Force HTTPS di cPanel settings
3. Update .env.production URL ke https://
```

---

## 📞 SUPPORT LINKS

**Niagahoster:**
- Portal: https://rapp.web.id/cpanel
- File Manager: https://rapp.web.id/cpanel (pilih File Manager)
- Support: https://www.niagahoster.co.id/support

**Railway:**
- Deploy Guide: https://docs.railway.app/
- Dashboard: https://railway.app/dashboard

**DNS Propagation:**
- Check: https://www.whatsmydns.net/

---

## ✅ FINAL CHECKLIST

- [ ] Build frontend (npm run build)
- [ ] Set .env.production dengan API URL benar
- [ ] Upload dist/ ke public_html Niagahoster
- [ ] Create .htaccess di public_html
- [ ] Test frontend di https://rapp.web.id
- [ ] Push code ke GitHub
- [ ] Create Railway project
- [ ] Deploy backend di Railway
- [ ] Get Railway API URL
- [ ] Setup DNS/CNAME untuk api.rapp.web.id
- [ ] Test backend di https://api.rapp.web.id/health
- [ ] Test login functionality
- [ ] Setup monitoring & backups
- [ ] Update security headers
- [ ] Done! 🎉

---

## 🚀 MULAI DARI MANA?

**Jika ingin online hari ini:**

1. **Build frontend**:
   ```bash
   npm run build
   ```

2. **Upload ke Niagahoster**:
   - Login cPanel
   - File Manager
   - Upload dist/ files

3. **Deploy backend ke Railway**:
   - https://railway.app
   - Connect GitHub
   - Deploy

4. **Setup DNS**:
   - Add CNAME api.rapp.web.id → Railway URL
   - Wait 5-30 minutes

5. **Test**:
   - https://rapp.web.id (frontend)
   - https://api.rapp.web.id/health (backend)

**Total time: ~1 hour**

---

**Last Updated**: November 2024
**For**: Niagahoster Hosting Users
**Status**: Ready for Deployment ✅
