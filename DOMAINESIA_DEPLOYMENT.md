# 🚀 DEPLOY KE DOMAINESIA - STEP BY STEP

Anda menggunakan DomaiNesia (bukan Niagahoster)! Ini panduan lengkap untuk deploy Vault Pulse Center ke hosting DomaiNesia + domain rapp.web.id.

---

## 📋 YANG ANDA PUNYA (DomaiNesia)

Dari screenshot DomaiNesia:
- ✅ Hosting account (login: rappwebi)
- ✅ Domain: `rapp.web.id`
- ✅ Shared IP: 36.50.77.60
- ✅ Home Directory: `/home/rappwebi`
- ✅ SSH Access available (How to Access SSH)
- ✅ cPanel/File Manager access
- ✅ Tools tersedia: Let's Encrypt, Nginx Cache, PHP MultiVersion, Redis, Memcached

---

## ⚠️ PENTING: DomaiNesia = Shared Hosting (BUKAN VPS)

**Apa yang DomaiNesia tawari:**
- ❌ Tidak bisa install Node.js (runtime tidak tersedia)
- ❌ Tidak bisa install PostgreSQL (database tidak tersedia)
- ❌ Tidak bisa run server backend custom
- ❌ Tidak bisa full control

**Apa yang BISA dilakukan di DomaiNesia:**
- ✅ Upload static files (HTML, CSS, JS)
- ✅ Run PHP (built-in)
- ✅ Run Python scripts (jika ada)
- ✅ MySQL/MariaDB (terbatas)
- ✅ Cron jobs
- ✅ Let's Encrypt SSL (gratis, auto)

---

## 🎯 SOLUSI TERBAIK UNTUK ANDA

Ada 2 pilihan praktis:

### ✅ PILIHAN 1: Frontend DomaiNesia + Backend Railway.app (RECOMMENDED)

**Setup:**
```
Frontend: Upload static files ke DomaiNesia
Backend: Deploy di Railway.app ($5-20/bulan)
Database: Railway PostgreSQL (included)
Domain: rapp.web.id → DomaiNesia (frontend)
        api.rapp.web.id → Railway (backend)
```

**Pros:**
- ✅ Pakai hosting yang sudah ada (Rp 0 tambahan untuk frontend)
- ✅ Backend di managed cloud service ($5-20/bulan)
- ✅ Setup cepat (~30 menit)
- ✅ Scalable & flexible
- ✅ Auto-backup & monitoring

**Cons:**
- ⚠️ Domain 2 bagian (tapi itu normal)
- ⚠️ Perlu setup subdomain DNS

**Cost:**
- DomaiNesia: (sudah ada)
- Railway: $5-20/bulan
- **Total: Rp 75-300k/bulan (~$5-20 USD)**

**Effort**: Medium (30 menit)

---

### 🔵 PILIHAN 2: Full Cloud Hosting (Railway all-in)

**Setup:**
- Frontend & Backend: Railway.app
- Database: Railway PostgreSQL
- Domain: rapp.web.id → Railway

**Pros:**
- ✅ Paling mudah setup
- ✅ Everything in one place
- ✅ Auto-scaling & monitoring
- ✅ No DomaiNesia involvement needed

**Cons:**
- ⚠️ DomaiNesia tidak digunakan
- ⚠️ Cost ~$10-20/bulan (tapi comprehensive)

**Effort**: Low (15 menit)

---

## ✅ REKOMENDASI SAYA

**Untuk situasi Anda (sudah punya DomaiNesia):**

### **PILIHAN 1**: Frontend DomaiNesia + Backend Railway

**Alasan:**
- Maksimalkan hosting yang sudah ada
- Hanya perlu tambah backend service ($5-20/bulan)
- Total cost tetap rendah
- Tidak perlu ganti provider
- Setup straightforward

**Timeline:**
1. Build frontend: 10 menit
2. Upload ke DomaiNesia: 5 menit
3. Deploy backend ke Railway: 10 menit
4. Setup DNS: 5 menit
5. Test: 5 menit
**Total: ~35 menit**

---

## 📖 STEP-BY-STEP GUIDE

### STEP 1: Build Frontend untuk Production

#### 1.1 Build React Application

```bash
cd d:\PROJECT Fastwork\vault-pulse-center

# Build production files
npm run build

# Output: folder "dist/" dibuat dengan:
# - index.html
# - assets/ (CSS, JS, images)
```

#### 1.2 Set API URL yang Benar

Sebelum build, pastikan `.env.production` sudah benar:

```bash
# File: .env.production
VITE_API_URL=https://api.rapp.web.id
```

Jika tidak ada file `.env.production`, buat baru:

```bash
# Create di root folder
cat > .env.production << EOF
VITE_API_URL=https://api.rapp.web.id
VITE_APP_NAME=Vault Pulse Center
EOF
```

---

### STEP 2: Upload Frontend ke DomaiNesia

#### 2.1 Login ke cPanel DomaiNesia

```
URL: https://rapp.web.id:2083/
atau: https://your-cpanel-url/
Username: rappwebi
Password: (password Anda)
```

#### 2.2 Akses File Manager

**Langkah:**
1. Login ke cPanel
2. Cari "File Manager" di menu
3. Pilih "public_html" folder
4. Ini folder yang akan serve website Anda

#### 2.3 Upload Files dari Folder dist/

**Opsi A: Drag & Drop (Paling mudah)**
1. Buka File Manager cPanel
2. Buka folder `public_html`
3. Di lokal komputer, buka folder `dist/`
4. Select semua files (index.html, assets, dll)
5. Drag & drop ke cPanel window

**Opsi B: Upload ZIP (Jika file banyak)**
```bash
# Di lokal:
# 1. Zip folder dist/
# 2. Upload zip ke public_html via cPanel
# 3. Extract zip di cPanel

# Di cPanel:
# Right-click zip → Extract
```

**Opsi C: Gunakan FTP**
1. Di cPanel → FTP Accounts
2. Create FTP account
3. Gunakan FTP client (FileZilla, WinSCP)
4. Upload files via FTP

#### 2.4 Buat File `.htaccess` untuk SPA Routing

React Router butuh `.htaccess` untuk routing SPA.

**Cara buat:**
1. Di cPanel File Manager, buka `public_html`
2. Right-click → Create New File
3. Nama: `.htaccess`
4. Paste code di bawah:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # If the requested filename is not a directory
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # If the requested filename is not a file
  RewriteCond %{REQUEST_FILENAME} !-f
  
  # Rewrite any other request to index.html (untuk React Router)
  RewriteRule ^ index.html [QSA,L]
</IfModule>
```

#### 2.5 Test Frontend

Buka di browser:
```
https://rapp.web.id
```

Seharusnya:
- ✅ React app muncul
- ⚠️ API error (normal, backend belum deploy)
- ⚠️ Console error tentang API connection (akan fixed di step berikutnya)

---

### STEP 3: Deploy Backend ke Railway.app

#### 3.1 Persiapan Backend untuk Railway

**Update `package.json` di folder `server/`:**

```json
{
  "name": "vault-pulse-api",
  "version": "1.0.0",
  "description": "Vault Pulse Center API",
  "main": "dist/index.js",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate deploy",
    "prisma:seed": "ts-node prisma/seed.ts"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {
    "express": "^4.21.0",
    "prisma": "^5.22.0",
    "@prisma/client": "^5.22.0",
    "jsonwebtoken": "^9.1.2",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.4.5",
    "cors": "^2.8.5",
    "socket.io": "^4.8.0"
  }
}
```

**Buat file `railway.json` di root folder:**

```json
{
  "build": {
    "builder": "nixpacks"
  }
}
```

#### 3.2 Push Code ke GitHub

```bash
cd d:\PROJECT Fastwork\vault-pulse-center

# Pastikan repo sudah ada
git status

# Add all files
git add .

# Commit
git commit -m "Ready for Railway deployment"

# Push
git push origin main
```

#### 3.3 Deploy ke Railway.app

**Langkah:**

1. Buka: https://railway.app
2. Sign up dengan GitHub (jika belum ada account)
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Select repository: `vault-pulse-center`
6. Railway akan auto-detect services

**Configure Backend:**

1. Select `server` service (bukan root)
2. Set Build Command:
   ```
   npm run build && npm run prisma:migrate
   ```
3. Set Start Command:
   ```
   npm start
   ```

**Add Environment Variables:**

1. Click "Variables"
2. Add:
   ```
   PORT=3001
   NODE_ENV=production
   FRONTEND_URL=https://rapp.web.id
   JWT_SECRET=your-random-secret-key-here-minimum-32-chars
   ```

**Database (PostgreSQL):**

1. Railway akan auto-create PostgreSQL
2. `DATABASE_URL` akan auto-generated
3. Verify di Variables tab

3. Click "Deploy"
4. Wait for deployment complete (~2-3 menit)

#### 3.4 Get Railway Backend URL

1. Di Railway dashboard, cari deployed service
2. Copy public URL (akan seperti: `https://vault-pulse-api-prod.up.railway.app`)
3. Simpan untuk step DNS

---

### STEP 4: Setup DNS & Domain

#### 4.1 Update DNS Records di DomaiNesia

**Untuk subdomain `api.rapp.web.id`:**

1. Login ke DomaiNesia cPanel
2. Cari "Addon Domains" atau "Manage DNS"
3. Pilih domain: `rapp.web.id`
4. Edit DNS Records

**Tambah Record:**

```
Type: CNAME
Name: api
Value: vault-pulse-api-prod.up.railway.app
TTL: 3600 (atau default)

atau

Type: A
Name: api
Value: (Railway provided IP)
TTL: 3600
```

> ℹ️ Biasanya CNAME lebih mudah. Tanyakan ke Railway support jika tidak jelas.

#### 4.2 Wait untuk DNS Propagation

DNS butuh waktu 5-30 menit untuk propagate.

**Check status:**
```bash
# Terminal/PowerShell:
nslookup api.rapp.web.id
# atau
ping api.rapp.web.id
```

Atau online: https://www.whatsmydns.net/

---

### STEP 5: Update Frontend Config

#### 5.1 Update Environment File

Update `.env.production`:

```
VITE_API_URL=https://api.rapp.web.id
```

#### 5.2 Rebuild Frontend

```bash
npm run build
```

#### 5.3 Re-upload ke DomaiNesia

Upload folder `dist/` baru ke `public_html`:

1. Delete files lama (atau overwrite)
2. Upload files baru
3. Verify `.htaccess` masih ada

---

### STEP 6: Testing & Verification

#### 6.1 Test Frontend

```
Browser: https://rapp.web.id
```

Should show:
- ✅ React app fully loaded
- ✅ No API errors in console
- ✅ Can see dashboard/pages

#### 6.2 Test Backend Health

```
Browser: https://api.rapp.web.id/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2024-11-30T10:30:45.123Z",
  "database": "connected"
}
```

Atau di PowerShell:
```bash
curl https://api.rapp.web.id/health
```

#### 6.3 Test Login

1. Open: https://rapp.web.id
2. Try login dengan test account (dari dokumentasi)
3. Check console for errors
4. Should redirect to dashboard

#### 6.4 Check Console Logs

**Frontend (Browser DevTools):**
- F12 → Console
- Check untuk errors
- Verify API requests going to `https://api.rapp.web.id`

**Backend (Railway Dashboard):**
- Open Railway project
- Click service
- Tab "Logs"
- Check untuk errors

---

## 🔐 SECURITY CHECKLIST

- [ ] Update JWT_SECRET di Railway (random, min 32 chars)
- [ ] Update DATABASE_PASSWORD di Railway
- [ ] Enable HTTPS (DomaiNesia & Railway auto-provide)
- [ ] Update CORS di backend untuk: `https://rapp.web.id`
- [ ] Disable debug mode (`NODE_ENV=production`)
- [ ] Test login security (password hashing)
- [ ] Test API authentication (JWT validation)
- [ ] Check database connection string (no hardcoded passwords)

---

## 📊 FINAL ARCHITECTURE

```
┌──────────────────────────────────────────────────────┐
│         VAULT PULSE CENTER - PRODUCTION              │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Domain: rapp.web.id (Primary)                     │
│  ├── Frontend: DomaiNesia Shared Hosting          │
│  │   ├── Location: /home/rappwebi/public_html     │
│  │   ├── Static files (HTML, CSS, JS)             │
│  │   ├── .htaccess (SPA routing)                  │
│  │   └── HTTPS: Let's Encrypt (auto-renew)        │
│  │                                                 │
│  │   Access: https://rapp.web.id                  │
│  │                                                 │
│  Subdomain: api.rapp.web.id (Backend)             │
│  ├── Backend: Railway.app (Cloud)                 │
│  │   ├── Service: Node.js + Express               │
│  │   ├── Runtime: Node.js 18+                     │
│  │   ├── Port: 3001                               │
│  │   └── HTTPS: Auto (Railway managed)            │
│  │                                                 │
│  │   Access: https://api.rapp.web.id              │
│  │                                                 │
│  Database: PostgreSQL @ Railway                    │
│  ├── Auto-backups                                 │
│  ├── High availability                            │
│  └── Monitoring dashboard                         │
│                                                    │
└──────────────────────────────────────────────────────┘

Communication Flow:
1. User → https://rapp.web.id (DomaiNesia)
2. Browser loads React app (static)
3. App makes API calls to https://api.rapp.web.id (Railway)
4. Backend queries PostgreSQL @ Railway
5. Response back to frontend
6. User sees data
```

---

## 💰 COST BREAKDOWN

**Scenario: DomaiNesia + Railway**
```
DomaiNesia hosting:        (sudah ada, tidak ada biaya tambahan)
Railway backend ($10/mo):  Rp 150,000/bulan
Domain rapp.web.id:        (sudah ada)
─────────────────────────────────────
Total/bulan:              Rp 150,000 (~$10 USD)
Total/tahun:              Rp 1,800,000 (~$120 USD)
```

**vs Alternatif: Full Railway (tanpa DomaiNesia)**
```
Railway frontend (free):    Rp 0
Railway backend:           Rp 150,000/bulan
─────────────────────────────────────
Total/bulan:              Rp 150,000 (~$10 USD)
Total/tahun:              Rp 1,800,000 (~$120 USD)
(tapi tidak pakai DomaiNesia yang sudah ada)
```

---

## 🆚 OPSI TERBAIK UNTUK ANDA

### ✅ Sekarang (Quick & Praktis):
**DomaiNesia Frontend + Railway Backend**
- Time: ~30-45 menit
- Cost: Rp 150k/bulan
- Effort: Medium
- Best: Maximize existing hosting

### 🔵 Alternatif (Paling Mudah):
**Railway All-in-One**
- Time: ~15 menit
- Cost: Rp 150k/bulan
- Effort: Low
- Best: Simpler management

### 🟣 Future (Long-term):
**VPS Niagahoster**
- Time: ~2 jam (one-time)
- Cost: Rp 38k/bulan
- Effort: Medium-High
- Best: Full control, cheaper long-term

---

## 🆘 TROUBLESHOOTING

### Frontend tidak muncul
```
❌ Problem: 404 di https://rapp.web.id
✅ Solution:
   1. Verify index.html ada di public_html
   2. Verify .htaccess ada & correct
   3. Check cPanel "Rewrite Module" enabled
   4. Refresh browser (Ctrl+F5)
```

### Backend API tidak accessible
```
❌ Problem: https://api.rapp.web.id/health → timeout/error
✅ Solution:
   1. Check Railway deployment status (complete?)
   2. Wait 5-10 min for DNS propagation
   3. Verify CNAME record di DomaiNesia DNS
   4. Check Railway logs for errors
```

### CORS error
```
❌ Problem: Console → "Access to XMLHttpRequest blocked by CORS"
✅ Solution:
   1. Update CORS di backend:
      cors({ origin: 'https://rapp.web.id', credentials: true })
   2. Rebuild backend
   3. Wait for Railway to auto-redeploy
```

### SSL/HTTPS error
```
❌ Problem: "SSL certificate not valid" atau "mixed content"
✅ Solution:
   1. DomaiNesia: Check "Force HTTPS" di cPanel
   2. Railway: SSL auto-managed (no action needed)
   3. Update all URLs ke https:// (no http)
```

---

## 📞 HELPFUL LINKS

**DomaiNesia:**
- cPanel Login: https://rapp.web.id:2083/
- File Manager: https://rapp.web.id:2083/cpsess.../frontend/paper_lantern/filemanager/
- Support: https://www.domainesia.com/support/
- Docs: https://knowledge.domainesia.com/

**Railway.app:**
- Dashboard: https://railway.app/dashboard
- Docs: https://docs.railway.app/
- Support: Discord community (linked in dashboard)

**DNS Check:**
- Tool: https://www.whatsmydns.net/
- Tool: https://mxtoolbox.com/
- Command: `nslookup api.rapp.web.id`

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] Build frontend (npm run build)
- [ ] Update .env.production dengan API URL benar
- [ ] Upload dist/ ke DomaiNesia public_html
- [ ] Create .htaccess di public_html
- [ ] Test frontend di https://rapp.web.id (load page)
- [ ] Push code ke GitHub
- [ ] Create Railway project
- [ ] Configure environment variables di Railway
- [ ] Deploy backend service di Railway
- [ ] Wait for Railway deployment complete
- [ ] Copy Railway API URL
- [ ] Update DNS CNAME di DomaiNesia
- [ ] Wait 5-30 min for DNS propagation
- [ ] Test backend health: https://api.rapp.web.id/health
- [ ] Rebuild & re-upload frontend to DomaiNesia
- [ ] Test full app functionality
- [ ] Test login with real account
- [ ] Check console for errors (frontend & backend)
- [ ] Enable monitoring (Railway dashboard)
- [ ] Setup auto-backups (Railway default: on)
- [ ] Done! 🎉

---

## 🚀 QUICK START (Langsung Action)

**Estimasi waktu: ~45 menit total**

1. **Build Frontend (5 min)**
   ```bash
   npm run build
   ```

2. **Upload ke DomaiNesia (10 min)**
   - cPanel File Manager
   - Upload dist/ files
   - Create .htaccess

3. **Deploy Backend (15 min)**
   - GitHub push
   - Railway new project
   - Set environment variables
   - Deploy

4. **Setup DNS (5 min)**
   - DomaiNesia DNS: Add CNAME
   - Copy Railway URL

5. **Test & Verify (10 min)**
   - https://rapp.web.id (frontend)
   - https://api.rapp.web.id/health (backend)
   - Test login

**Then you're done! 🎉**

---

## 📌 KEY DIFFERENCES: DomaiNesia vs Niagahoster

| Aspek | DomaiNesia | Niagahoster |
|-------|-----------|------------|
| cPanel | Ya | Ya |
| File Manager | Ya | Ya |
| SSH Access | Ya | Ya |
| Node.js Support | ❌ No | ❌ No |
| PostgreSQL | ❌ No | ❌ No |
| Let's Encrypt | ✅ Yes | ✅ Yes |
| Uptime | 99.9% | 99.9% |
| Support Language | English | Indonesian |

**Kesimpulan**: Keduanya shared hosting, tidak bisa run Node.js. Pilihan terbaik tetap **Frontend DomaiNesia + Backend Railway**.

---

**Last Updated**: November 30, 2024
**For**: DomaiNesia Users
**Status**: Ready for Production ✅
