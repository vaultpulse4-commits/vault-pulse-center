# 🚀 DEPLOYMENT GUIDE - DOMAINESIA

**Database Info:**
- Database: `rappwebi_vault_pulse_db`
- Username: `rappwebi_user`
- Password: (yang Anda buat di cPanel)

---

## 📋 STEP 2: SETUP NODE.JS APP DI CPANEL

### 2.1 Login ke cPanel

```
URL: https://rapp.web.id:2083/
Username: rappwebi
Password: (your cPanel password)
```

### 2.2 Go to "Setup Node.js App"

1. Di cPanel, cari **"Setup Node.js App"**
2. Click untuk buka

### 2.3 Create Application

Click **"Create Application"** dan isi form:

```
Node.js version: 18.20.4 (pilih LTS terbaru yang tersedia)

Application mode: Production

Application root: vault-pulse-center/server
(Ini folder dimana package.json backend berada)

Application URL: api.rapp.web.id
(Atau subdomain yang Anda inginkan untuk backend API)

Application startup file: dist/index.js
(File yang akan dijalankan setelah build)
```

### 2.4 Click "Create"

DomaiNesia akan:
- Setup Node.js environment
- Create application directory
- Configure reverse proxy
- Setup passenger untuk auto-restart

**⏱️ Wait 1-2 minutes...**

---

## 📦 STEP 3: CLONE REPOSITORY

Setelah app dibuat, Anda akan lihat tombol **"Run JavaScript script"**.

### 3.1 Stop Application (jika running)

Click **"Stop App"** button

### 3.2 Go to Terminal

cPanel → **Terminal** (atau SSH)

### 3.3 Navigate & Clone

```bash
cd /home/rappwebi

# Remove folder jika sudah ada
rm -rf vault-pulse-center

# Clone repository
git clone https://github.com/digimom462-cell/vault-pulse-center.git

# Verify
ls -la vault-pulse-center
```

Expected output: Folder dengan `server/` dan `src/` directory

---

## 🔧 STEP 4: SETUP BACKEND

### 4.1 Navigate to Server

```bash
cd /home/rappwebi/vault-pulse-center/server
```

### 4.2 Create .env File

```bash
nano .env
```

Paste (ganti `YOUR_PASSWORD_HERE`):

```env
DATABASE_URL="postgresql://rappwebi_user:YOUR_PASSWORD_HERE@localhost:5432/rappwebi_vault_pulse_db"
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://rapp.web.id
JWT_SECRET=vault-pulse-super-secret-jwt-key-change-this-to-random-32-chars-minimum
CORS_ORIGIN=https://rapp.web.id
```

**Save:** `Ctrl+O`, Enter, `Ctrl+X`

### 4.3 Install Dependencies

```bash
npm install
```

**⏱️ Wait 2-5 minutes...**

Expected: `node_modules/` created dengan semua dependencies

### 4.4 Generate Prisma Client

```bash
npx prisma generate
```

Expected: Prisma Client generated successfully

### 4.5 Build TypeScript

```bash
npm run build
```

Expected: `dist/` folder created dengan compiled JavaScript

### 4.6 Migrate Database

```bash
npx prisma db push
```

Expected: 
```
✔ Database synchronized with schema
✔ 21 tables created
```

### 4.7 Seed Database

```bash
npx prisma db seed
```

Expected:
```
✔ Admin user created
✔ Equipment created
✔ Maintenance logs created
✔ Consumables created
```

---

## ▶️ STEP 5: START BACKEND

### 5.1 Go Back to Setup Node.js App

cPanel → **Setup Node.js App** → Click your app

### 5.2 Verify Settings

Check:
- ✅ Application root: `vault-pulse-center/server`
- ✅ Application startup file: `dist/index.js`
- ✅ Node.js version: 18.x
- ✅ Application mode: Production

### 5.3 Start Application

Click **"Start App"** atau **"Restart"**

**⏱️ Wait 10-30 seconds...**

### 5.4 Check Status

Status should show: **"Running"** (green)

---

## ✅ STEP 6: TEST BACKEND API

### 6.1 Test Health Endpoint

Di browser atau terminal:

```bash
curl https://api.rapp.web.id/health
```

**Expected response:**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-12-01T..."
}
```

### 6.2 Test Login

```bash
curl -X POST https://api.rapp.web.id/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@vaultclub.com",
    "password": "admin123"
  }'
```

**Expected:** JWT token returned

---

## 🌐 STEP 7: DEPLOY FRONTEND

### 7.1 Build Frontend di Lokal

Di local machine:

```bash
cd D:\PROJECT Fastwork\vault-pulse-center

# Create production env
echo VITE_API_URL=https://api.rapp.web.id > .env.production

# Build
npm run build
```

Expected: `dist/` folder created dengan React app

### 7.2 Upload ke public_html

**Option A: Via File Manager**

1. cPanel → **File Manager**
2. Go to `/home/rappwebi/public_html/`
3. Delete semua file lama (jika ada)
4. Upload **semua files dari `dist/`**
5. Extract jika ZIP

**Option B: Via Terminal**

```bash
# Di local, zip dist folder
cd D:\PROJECT Fastwork\vault-pulse-center
Compress-Archive -Path dist\* -DestinationPath frontend.zip

# Upload via cPanel File Manager ke /home/rappwebi/

# Di server terminal:
cd /home/rappwebi/public_html
unzip ../frontend.zip
```

### 7.3 Create .htaccess

```bash
cd /home/rappwebi/public_html
nano .htaccess
```

Paste:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Skip if file exists
  RewriteCond %{REQUEST_FILENAME} !-f
  
  # Skip if directory exists
  RewriteCond %{REQUEST_FILENAME} !-d

  # Route all requests to index.html (SPA routing)
  RewriteRule ^ index.html [QSA,L]
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Cache static files
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

**Save:** `Ctrl+O`, Enter, `Ctrl+X`

---

## 🔒 STEP 8: SETUP SSL (HTTPS)

### 8.1 Go to Let's Encrypt

cPanel → Search **"SSL/TLS Status"** atau **"Let's Encrypt"**

### 8.2 Install SSL

1. Select domains:
   - ✅ rapp.web.id
   - ✅ api.rapp.web.id
   - ✅ www.rapp.web.id

2. Click **"Install SSL Certificate"** atau **"Issue"**

**⏱️ Wait 2-5 minutes...**

### 8.3 Force HTTPS

1. Go to **"Force HTTPS Redirect"**
2. Enable for all selected domains
3. Apply

---

## 🎉 STEP 9: FINAL TESTING

### 9.1 Test Frontend

Browser: `https://rapp.web.id`

Expected:
- ✅ Login page loads
- ✅ No console errors
- ✅ HTTPS (padlock icon)

### 9.2 Test Login

1. Email: `admin@vaultclub.com`
2. Password: `admin123`
3. Click Login

Expected:
- ✅ Redirect to dashboard
- ✅ Data loads (equipment, consumables, etc)

### 9.3 Test Features

- ✅ Equipment list loads
- ✅ Consumables list loads
- ✅ Can create new equipment
- ✅ Calendar icon visible (Chrome)
- ✅ Consumables stock calculation correct
- ✅ Weekly report generates (with maintenance data)

---

## 📊 STEP 10: MONITORING & MAINTENANCE

### 10.1 Check Application Logs

cPanel → **Setup Node.js App** → Click app → **"Logs"**

Or via Terminal:
```bash
tail -f /home/rappwebi/vault-pulse-center/server/logs/error.log
```

### 10.2 Setup Backup

cPanel → **JetBackup 5**

Schedule:
- Daily backups at 2 AM
- Include database + files
- Retention: 30 days

### 10.3 Monitor Resource Usage

cPanel → **Resource Usage**

Watch for:
- CPU usage
- Memory usage
- Entry processes

---

## 🆘 TROUBLESHOOTING

### Backend tidak start

**Check logs:**
```bash
cd /home/rappwebi/vault-pulse-center/server
cat logs/error.log
```

**Common issues:**
- Database connection failed → Check .env DATABASE_URL
- Port already in use → Restart app
- Build failed → Run `npm run build` again

### Frontend tidak load

**Check:**
- Files uploaded ke `/home/rappwebi/public_html/`
- `.htaccess` file exists
- Browser console for errors

### Login failed

**Check:**
- Backend running (`curl https://api.rapp.web.id/health`)
- Database seeded (user exists)
- CORS settings correct in .env

### Database connection error

**Verify:**
```bash
cd /home/rappwebi/vault-pulse-center/server

# Test connection
npx prisma db pull
```

If fails:
- Check password in .env
- Verify database exists in cPanel
- Verify user has permissions

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] Step 1: Code pushed to GitHub ✅ (DONE)
- [ ] Step 2: Setup Node.js App di cPanel
- [ ] Step 3: Repository cloned
- [ ] Step 4: Backend setup (.env, dependencies, build)
- [ ] Step 5: Database migrated & seeded
- [ ] Step 6: Backend started & tested
- [ ] Step 7: Frontend built & uploaded
- [ ] Step 8: SSL installed & forced HTTPS
- [ ] Step 9: Final testing (login, features)
- [ ] Step 10: Backups scheduled

---

## 📞 QUICK COMMANDS REFERENCE

```bash
# Backend
cd /home/rappwebi/vault-pulse-center/server
npm install
npm run build
npx prisma generate
npx prisma db push
npx prisma db seed
pm2 restart all  # or use Setup Node.js App restart button

# Check logs
tail -f logs/error.log

# Database
npx prisma studio  # Open database GUI (if needed)

# Git updates
cd /home/rappwebi/vault-pulse-center
git pull origin main
cd server
npm install
npm run build
# Restart app via cPanel
```

---

**Status:** Step 1 DONE ✅ | Ready for Step 2 🚀  
**Next:** Login ke cPanel dan mulai Setup Node.js App!
