# 🔧 DOMAINESIA TOOLS ANALYSIS & OPTIMAL DEPLOYMENT STRATEGY

Berdasarkan semua tools yang tersedia di DomaiNesia Anda, ini adalah deployment strategy terbaik:

---

## 📊 TOOLS YANG RELEVAN UNTUK APLIKASI ANDA

### ✅ TOOLS YANG ANDA GUNAKAN

**Programming & Runtime:**
- ✅ **Node.js** - Untuk backend Express.js
- ✅ **Nodejs** / **Setup Node.js App** - Easy deployment
- ✅ **Perl Modules**, **PHP PEAR Packages** - Extra languages

**Database:**
- ✅ **PostgreSQL Databases** - Main database
- ✅ **PostgreSQL Database Wizard** - Easy setup
- ✅ **phpPgAdmin** - Database management UI
- ✅ **Manage My Databases** - Full control

**Web Server & Performance:**
- ✅ **Nginx Cache** - Cache static files
- ✅ **MultiPHP Version** - Select PHP version
- ✅ **Apache Handlers** - Configure handlers

**Domain & SSL:**
- ✅ **Let's Encrypt** - FREE SSL/HTTPS
- ✅ **Force to HTTPS** - Auto redirect
- ✅ **SSL/TLS** - Certificate management
- ✅ **Zone Editor** - DNS management
- ✅ **Domains** - Domain settings

**Deployment & Version Control:**
- ✅ **Git™ Version Control** - Deploy from Git
- ✅ **Setup Node.js App** - Automated Node setup
- ✅ **Softaculous Apps Installer** - Auto-install apps
- ✅ **Backup Wizard** - Auto backups
- ✅ **JetBackup 5** - Advanced backup

**Monitoring & Maintenance:**
- ✅ **Resource Usage** - Monitor CPU/Memory
- ✅ **Bandwidth** - Check traffic
- ✅ **Errors** - View error logs
- ✅ **Raw Access** - Server logs
- ✅ **Cron Jobs** - Scheduled tasks
- ✅ **Terminal** - SSH commands

**Security:**
- ✅ **SSH Access** - Command line access
- ✅ **IP Blocker** - Firewall
- ✅ **Two-Factor Authentication** - 2FA
- ✅ **ModSecurity** - Web application firewall
- ✅ **Imunify360** - Advanced security

---

## 🎯 OPTIMAL DEPLOYMENT STRATEGY

Dengan tools yang tersedia, ini strategi terbaik:

### PILIHAN 1: "Setup Node.js App" (PALING MUDAH) ⭐⭐⭐

**Tools yang digunakan:**
- Setup Node.js App
- PostgreSQL Database Wizard
- Let's Encrypt
- Force to HTTPS
- Git Version Control

**Keuntungan:**
- ✅ Automated setup (DomaiNesia handle PM2, reverse proxy, etc)
- ✅ Paling mudah (UI-based, no command line)
- ✅ Auto-restart jika crash
- ✅ Built-in monitoring

**Timeline:** 30 menit

**Effort:** Low (pemula OK)

---

### PILIHAN 2: Manual SSH + Git (LEBIH KONTROL) ⭐⭐⭐⭐

**Tools yang digunakan:**
- Terminal / SSH Access
- Git Version Control
- PostgreSQL Databases
- Let's Encrypt
- Cron Jobs (untuk backup & monitoring)
- Resource Usage (monitoring)

**Keuntungan:**
- ✅ Full control
- ✅ Custom configuration
- ✅ Better understanding
- ✅ Easier to debug

**Timeline:** 1-2 jam

**Effort:** Medium (perlu Linux basic)

---

### PILIHAN 3: Hybrid (BEST OF BOTH) ⭐⭐⭐⭐⭐

**Tools yang digunakan:**
- Setup Node.js App (untuk initial setup)
- Terminal (untuk custom config)
- Git Version Control (untuk updates)
- PostgreSQL Database Wizard (setup DB)
- Nginx Cache (performance)
- Let's Encrypt (SSL)
- JetBackup 5 (automated backups)

**Keuntungan:**
- ✅ Easy initial setup
- ✅ Custom optimization later
- ✅ Best performance
- ✅ Automated backups

**Timeline:** 45 menit

**Effort:** Medium

---

## 🚀 REKOMENDASI: PILIHAN 1 "Setup Node.js App"

Untuk situasi Anda, **"Setup Node.js App"** adalah pilihan terbaik karena:

1. ✅ **Paling mudah** - DomaiNesia handle kompleksitas
2. ✅ **Paling cepat** - 30 menit online
3. ✅ **Paling aman** - Automated security updates
4. ✅ **Paling reliable** - Auto-restart, monitoring
5. ✅ **Tidak perlu DevOps skills** - UI-based

Mari kita gunakan tool ini!

---

## 📖 STEP-BY-STEP: "Setup Node.js App"

### STEP 1: Siapkan Repository di GitHub

#### 1.1 Push Code ke GitHub

Di lokal machine:

```bash
cd d:\PROJECT Fastwork\vault-pulse-center

# Initialize git (jika belum)
git init

# Add remote
git remote add origin https://github.com/your_username/vault-pulse-center.git

# Add files
git add .

# Commit
git commit -m "Ready for DomaiNesia deployment"

# Push
git push -u origin main
```

#### 1.2 Create .gitignore (jika belum ada)

```
node_modules/
dist/
.env
.env.local
.env.production
.DS_Store
*.log
.next
build/
out/
```

#### 1.3 Ensure package.json ada di root & server/

**Root package.json** - untuk monorepo management
**server/package.json** - untuk Node.js app

---

### STEP 2: Setup PostgreSQL Database

#### 2.1 Login ke cPanel

```
URL: https://rapp.web.id:2083/
Username: rappwebi
Password: (your password)
```

#### 2.2 Go to "PostgreSQL Database Wizard"

1. Click **PostgreSQL Database Wizard** di Databases section
2. Step 1: Create Database
   ```
   Database Name: vault_pulse_db
   ```
3. Click **Create Database**
4. Step 2: Create User
   ```
   Username: vault_user
   Password: (generate strong password, min 16 chars)
   ```
5. Click **Create User**
6. Step 3: Add User to Database
   - Select database: vault_pulse_db
   - Select user: vault_user
   - Grant ALL permissions
7. Click **Add User to Database**

#### 2.3 Save Connection String

DomaiNesia akan show connection string:
```
postgresql://vault_user:your_password@localhost:5432/vault_pulse_db
```

Simpan untuk nanti.

---

### STEP 3: Create Environment File di DomaiNesia

#### 3.1 Via File Manager

1. Login cPanel
2. File Manager
3. Navigate ke repo folder: `/home/rappwebi/vault-pulse-center/server/`
4. Create New File: `.env`
5. Edit, paste:

```env
DATABASE_URL="postgresql://vault_user:your_password@localhost:5432/vault_pulse_db"
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://rapp.web.id
JWT_SECRET=your-random-secret-key-minimum-32-chars-here-change-this
CORS_ORIGIN=https://rapp.web.id
```

---

### STEP 4: Setup Node.js App di cPanel

#### 4.1 Go to "Setup Node.js App"

1. cPanel → Search "Setup Node.js App"
2. Click **Setup Node.js App**

#### 4.2 Create Application

Fill form:
```
Node.js version: 18.x (or latest LTS)
Application root: /home/rappwebi/vault-pulse-center/server/
Application startup file: dist/index.js
                         (or: index.js jika belum build)
Application mode: production
Domain: api.rapp.web.id
```

#### 4.3 Install Dependencies

1. DomaiNesia akan auto-run `npm install`
2. Wait untuk complete (2-5 menit)

#### 4.4 Start Application

1. Click **Start Application**
2. DomaiNesia akan:
   - Install npm packages
   - Start Node.js server
   - Setup reverse proxy
   - Configure SSL (automatic)
   - Create monitoring

Done! Backend sekarang running di `https://api.rapp.web.id` 🎉

---

### STEP 5: Build & Deploy Frontend

#### 5.1 Build React di Lokal

```bash
cd d:\PROJECT Fastwork\vault-pulse-center

# Update .env.production
cat > .env.production << EOF
VITE_API_URL=https://api.rapp.web.id
VITE_APP_NAME=Vault Pulse Center
EOF

# Build
npm run build
# Output: dist/ folder created
```

#### 5.2 Upload Frontend ke public_html

**Option A: Via cPanel File Manager**
1. cPanel → File Manager
2. Go to `/home/rappwebi/public_html/`
3. Upload all files from `dist/`

**Option B: Via FTP (faster for large files)**
1. cPanel → FTP Accounts
2. Create FTP account
3. Use FileZilla / WinSCP
4. Upload dist/ contents

**Option C: Via Git**
```bash
# Create separate branch for frontend
git checkout -b frontend

# Push only dist files
git add dist/
git commit -m "Frontend build"
git push origin frontend

# Then in cPanel Terminal:
cd /home/rappwebi/public_html
git clone -b frontend <repo> .
```

#### 5.3 Create .htaccess untuk SPA Routing

1. cPanel File Manager → `/home/rappwebi/public_html/`
2. Create New File: `.htaccess`
3. Paste:

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
```

#### 5.4 Test Frontend

```
Browser: https://rapp.web.id
Should load React app successfully
```

---

### STEP 6: Setup Let's Encrypt SSL (Auto HTTPS)

#### 6.1 Go to Let's Encrypt

1. cPanel → Search "Let's Encrypt"
2. Click **AutoSSL** or **Let's Encrypt**
3. Select domains:
   - rapp.web.id
   - api.rapp.web.id
   - www.rapp.web.id
4. Click **Install SSL**

Wait 2-5 minutes for installation.

#### 6.2 Force HTTPS

1. cPanel → Search "Force to HTTPS"
2. Click **Force to HTTPS**
3. Select domains to force
4. Apply

---

### STEP 7: Verify Everything Working

#### 7.1 Test Frontend

```
https://rapp.web.id
```

Should see:
- React app loaded
- No certificate errors
- Responsive design

#### 7.2 Test Backend API

```bash
# Health check
curl https://api.rapp.web.id/health

# Should return:
# {"status":"ok","database":"connected",...}
```

Or in browser:
```
https://api.rapp.web.id/health
```

#### 7.3 Test Login

1. Go to https://rapp.web.id
2. Try login with test account
3. Check browser console (F12) for errors
4. Should redirect to dashboard

#### 7.4 Test Database Connection

Via cPanel **phpPgAdmin**:
1. cPanel → phpPgAdmin
2. Select database: vault_pulse_db
3. Select table: "User"
4. Should see data

---

### STEP 8: Setup Automated Backups

#### 8.1 Via JetBackup 5 (Recommended)

1. cPanel → **JetBackup 5**
2. Create backup schedule:
   - Frequency: Daily at 2 AM
   - Include: Database + Files
   - Retention: 30 days

#### 8.2 Via Backup Wizard (Simple)

1. cPanel → **Backup Wizard**
2. Full Backup
3. Schedule weekly backups

#### 8.3 Manual Database Backup

```bash
# Via Terminal:
pg_dump -U vault_user -d vault_pulse_db > /home/rappwebi/backup-`date +%Y%m%d`.sql
```

---

### STEP 9: Setup Monitoring

#### 9.1 Check Resource Usage

cPanel → **Resource Usage**
- Monitor CPU, Memory, Disk
- Set alerts if exceeds threshold

#### 9.2 Check Error Logs

cPanel → **Errors**
- Monitor application errors
- Check for issues

#### 9.3 Monitor Node.js App

In "Setup Node.js App":
- Click on your app
- View logs
- Check restart history
- Monitor performance

---

### STEP 10: Setup Cron Jobs (Optional - Advanced)

#### 10.1 Database Backup Cron

cPanel → **Cron Jobs**

Add new cron:
```
Time: 0 2 * * * (every day at 2 AM)
Command: pg_dump -U vault_user -d vault_pulse_db > /home/rappwebi/backups/db_`date +\%Y\%m\%d`.sql
```

---

## 📊 FINAL ARCHITECTURE

```
┌─────────────────────────────────────────────────┐
│    VAULT PULSE CENTER @ DOMAINESIA              │
│    (Using "Setup Node.js App")                  │
├─────────────────────────────────────────────────┤
│                                                 │
│  https://rapp.web.id (Frontend)                │
│  ├── cPanel: public_html/                      │
│  ├── Static React files                        │
│  ├── .htaccess (SPA routing)                   │
│  ├── SSL: Let's Encrypt (auto)                │
│  └── Cache: Nginx Cache                        │
│                                                 │
│  https://api.rapp.web.id (Backend)            │
│  ├── cPanel: Setup Node.js App                │
│  ├── Runtime: Node.js 18+                      │
│  ├── Reverse Proxy: Nginx (auto)              │
│  ├── Port: 3001 (internal)                     │
│  ├── SSL: Let's Encrypt (auto)                │
│  ├── Monitoring: DomaiNesia dashboard          │
│  └── Auto-restart: Enabled                     │
│                                                 │
│  PostgreSQL Database                          │
│  ├── Name: vault_pulse_db                      │
│  ├── User: vault_user                          │
│  ├── Admin: phpPgAdmin                         │
│  └── Backup: JetBackup 5 (daily)              │
│                                                 │
│  Management:                                   │
│  ├── All via cPanel UI (no command line)      │
│  ├── Monitoring: Resource Usage dashboard     │
│  ├── Backups: Automated daily                 │
│  ├── SSL: Auto-renew (Let's Encrypt)          │
│  └── Logs: Error logs accessible              │
│                                                 │
└─────────────────────────────────────────────────┘

Cost: Rp 0/bulan (semuanya pakai DomaiNesia existing!)
Maintenance: Minimal (DomaiNesia handle most)
Reliability: Very High (managed service)
```

---

## ⚡ QUICK SUMMARY

**Dengan "Setup Node.js App", Anda get:**

| Feature | Status |
|---------|--------|
| Easy Setup | ✅ Auto |
| Node.js Runtime | ✅ Auto |
| Express Server | ✅ Running |
| PostgreSQL Database | ✅ Connected |
| Reverse Proxy | ✅ Nginx |
| SSL/HTTPS | ✅ Let's Encrypt |
| Auto-restart | ✅ Yes |
| Monitoring | ✅ Dashboard |
| Backup | ✅ JetBackup 5 |
| Performance | ✅ Optimized |
| Process Manager | ✅ Built-in |
| Scaling | ⚠️ Limited (shared hosting) |

---

## 🆚 "SETUP NODE.JS APP" vs Manual SSH

| Aspek | Setup Node App | Manual SSH |
|-------|----------------|-----------|
| Ease | ⭐⭐⭐⭐⭐ Easy | ⭐⭐⭐ Medium |
| Time | 30 min | 1-2 hours |
| Control | Limited | Full |
| Maintenance | Minimal | Manual |
| Reliability | Very High | High |
| Learning | Low | High |
| Recommended | ✅ YES | Advanced users |

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] Code pushed to GitHub
- [ ] PostgreSQL database created
- [ ] PostgreSQL user created
- [ ] .env file created in server/
- [ ] Setup Node.js App configured
- [ ] npm install running
- [ ] Backend started
- [ ] Health check responding
- [ ] Frontend built
- [ ] dist/ uploaded to public_html
- [ ] .htaccess created
- [ ] Let's Encrypt SSL installed
- [ ] Force to HTTPS enabled
- [ ] Frontend loads successfully
- [ ] Backend API responding
- [ ] Login works
- [ ] Database backups scheduled
- [ ] Monitoring setup
- [ ] Done! 🎉

---

## 🚀 START HERE

**Timeline: ~30-45 minutes**

1. **Push code to GitHub** (5 min)
2. **Create PostgreSQL database** (5 min)
3. **Setup Node.js App** (10 min)
4. **Build & upload frontend** (10 min)
5. **Setup Let's Encrypt** (5 min)
6. **Test everything** (5 min)

**Total: Online in less than 1 hour!** ⏱️

---

## 📞 HELPFUL LINKS

**DomaiNesia cPanel:**
- Login: https://rapp.web.id:2083/
- Documentation: https://knowledge.domainesia.com/
- Support: https://www.domainesia.com/support/

**Node.js:**
- Docs: https://nodejs.org/

**PostgreSQL:**
- Docs: https://www.postgresql.org/docs/

---

**Last Updated**: November 30, 2024
**Recommendation**: Use "Setup Node.js App" - Easiest & Best! ✅
**Status**: Ready for Production 🚀
