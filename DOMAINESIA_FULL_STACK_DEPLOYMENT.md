# 🎉 DEPLOY 100% KE DOMAINESIA - FULL STACK!

**Bagus news!** DomaiNesia Anda punya:
- ✅ Node.js (JavaScript runtime)
- ✅ PostgreSQL (database)
- ✅ cPanel + File Manager
- ✅ SSH Access
- ✅ Custom domain (rapp.web.id)

Ini berarti **Anda bisa deploy full aplikasi di DomaiNesia**, tanpa perlu cloud service tambahan! 🚀

---

## 📊 YANG ANDA PUNYA

Dari screenshot DomaiNesia:

**Programming Language:**
- ✅ Node.js
- ✅ Perl Modules
- ✅ PHP PEAR Packages
- ✅ PHP MultiVersion

**Databases:**
- ✅ phpMyAdmin (MySQL)
- ✅ Manage My Databases
- ✅ Remote Database Access
- ⭐ **PostgreSQL Databases** ← Ini yang Anda butuh!
- ⭐ **PostgreSQL Database Wizard**
- ✅ phpPgAdmin (PostgreSQL admin)

---

## 🎯 REKOMENDASI: Deploy 100% di DomaiNesia

### Sekarang Anda punya 2 pilihan LEBIH BAIK:

### PILIHAN 1: Full DomaiNesia Deployment ⭐ RECOMMENDED

**Setup:**
```
Frontend: React static files @ DomaiNesia
Backend: Node.js @ DomaiNesia
Database: PostgreSQL @ DomaiNesia
Domain: rapp.web.id (semuanya di satu tempat!)
```

**Pros:**
- ✅ Semuanya di DomaiNesia (satu dashboard)
- ✅ TIDAK perlu bayar cloud service tambahan ($0 tambahan!)
- ✅ Full control
- ✅ Cepat deployment
- ✅ Support lokal Bahasa Indonesia (jika DomaiNesia affiliated)

**Cons:**
- ⚠️ Perlu akses SSH & command line
- ⚠️ Manual maintenance (process manager)

**Cost:**
- DomaiNesia: (sudah ada, Rp 0 tambahan)
- **Total: Rp 0/bulan (free dengan hosting existing!)**

**Effort**: Medium (1-2 jam setup first time)

---

### PILIHAN 2: Frontend DomaiNesia + Backend Railway (Fallback)

Jika DomaiNesia ada batasan, bisa pakai:
- Frontend: DomaiNesia (free)
- Backend: Railway ($5-20/bulan)

---

## ✅ SAYA PILIH PILIHAN 1: Full DomaiNesia

Mari deploy 100% di DomaiNesia! Ini paling cost-effective.

---

## 📖 STEP-BY-STEP GUIDE - Full DomaiNesia Deployment

### STEP 1: Setup PostgreSQL Database di DomaiNesia

#### 1.1 Login ke cPanel

```
URL: https://rapp.web.id:2083/
atau: https://your-cp.domainesia.com/
Username: rappwebi
Password: (password Anda)
```

#### 1.2 Create PostgreSQL Database

1. Di cPanel, cari **PostgreSQL Database Wizard** atau **PostgreSQL Databases**
2. Click **Create New Database**
3. Isi:
   ```
   Database Name: vault_pulse_db
   ```
4. Click **Create Database**

#### 1.3 Create PostgreSQL User

1. Di cPanel, cari **PostgreSQL Database Wizard**
2. Click **Create New User**
3. Isi:
   ```
   Username: vault_user
   Password: (generate strong password, min 8 chars)
   ```
4. Click **Create User**

#### 1.4 Assign User to Database

1. Di cPanel, cari **PostgreSQL Databases**
2. Select database: `vault_pulse_db`
3. Assign user: `vault_user`
4. Grant permissions: ALL

#### 1.5 Get Connection String

```
postgresql://vault_user:your_password@localhost:5432/vault_pulse_db
```

Simpan untuk nanti (akan digunakan di backend .env)

---

### STEP 2: Setup Node.js & Deploy Backend

#### 2.1 SSH ke Server DomaiNesia

Di PowerShell:

```powershell
ssh rappwebi@36.50.77.60
# atau
ssh -p 22 rappwebi@rapp.web.id

# Password: (password hosting Anda)
```

#### 2.2 Navigate ke Home Directory

```bash
# Login ke server
cd /home/rappwebi

# Atau langsung dari home directory
pwd  # Should show /home/rappwebi
```

#### 2.3 Clone Repository

```bash
# Clone aplikasi Anda
git clone https://github.com/your_username/vault-pulse-center.git
cd vault-pulse-center/server

# atau jika belum ada git:
# Upload files via SFTP/FTP, atau
# scp dari lokal
```

#### 2.4 Install Dependencies

```bash
# Check Node.js version
node --version  # Should be 14+

# Install npm packages
npm install

# or if using Bun:
# bun install
```

#### 2.5 Setup Environment Variables

Buat file `.env`:

```bash
cat > .env << EOF
DATABASE_URL="postgresql://vault_user:your_password@localhost:5432/vault_pulse_db"
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://rapp.web.id
JWT_SECRET=your-random-secret-key-minimum-32-chars-here
EOF
```

#### 2.6 Run Prisma Migrations

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Verify database connected
npm run prisma:db:push
```

#### 2.7 Build Backend

```bash
npm run build
```

#### 2.8 Start Backend dengan Node

```bash
# Simple start:
npm start

# atau gunakan screen/tmux untuk keep running:
screen -S vault-api
npm start
# Press Ctrl+A then D to detach
```

#### 2.9 Verify Backend Running

Di terminal lain (atau local):

```bash
curl http://localhost:3001/health
# Should return: {"status":"ok",...}
```

---

### STEP 3: Setup Nginx as Reverse Proxy (Optional but Recommended)

DomaiNesia sudah punya Nginx, kita bisa gunakan untuk proxy backend.

#### 3.1 Setup Nginx Config untuk Backend

Cek apakah sudah ada:

```bash
# Check Nginx
nginx -v

# Check Nginx config directory
ls -la /etc/nginx/sites-available/
```

#### 3.2 Create Nginx Config (jika perlu)

```bash
# Buat config file
sudo nano /etc/nginx/sites-available/api.rapp.web.id

# Paste ini:
upstream backend {
    server 127.0.0.1:3001;
    keepalive 32;
}

server {
    listen 80;
    server_name api.rapp.web.id;

    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 3.3 Enable Site & Test

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/api.rapp.web.id /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

### STEP 4: Build & Deploy Frontend

#### 4.1 Build React di Lokal

Di local machine Anda:

```bash
cd d:\PROJECT Fastwork\vault-pulse-center

# Update .env.production
cat > .env.production << EOF
VITE_API_URL=https://api.rapp.web.id
VITE_APP_NAME=Vault Pulse Center
EOF

# Build
npm run build
# Output: dist/ folder
```

#### 4.2 Upload Frontend ke public_html

**Opsi A: Via cPanel File Manager**
1. Login cPanel: https://rapp.web.id:2083
2. File Manager → public_html
3. Upload semua files dari dist/
4. Create .htaccess (see step 4.3)

**Opsi B: Via SCP/SFTP**
```bash
# Dari local PowerShell:
scp -r dist/* rappwebi@rapp.web.id:/home/rappwebi/public_html/
```

#### 4.3 Create .htaccess untuk SPA Routing

Di cPanel File Manager, buat file `.htaccess` di public_html:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-f
  
  RewriteRule ^ index.html [QSA,L]
</IfModule>
```

---

### STEP 5: Setup SSL/HTTPS (Let's Encrypt)

#### 5.1 Check cPanel for Let's Encrypt

1. cPanel → Search "Let's Encrypt"
2. Click **AutoSSL** atau **Let's Encrypt**
3. Select domains: `rapp.web.id` dan `api.rapp.web.id`
4. Auto-install SSL

#### 5.2 Verify SSL

```bash
# Test HTTPS
curl -I https://rapp.web.id
curl -I https://api.rapp.web.id/health
```

---

### STEP 6: Setup Process Manager (PM2 atau Supervisor)

Backend butuh stay running 24/7. Ada 2 opsi:

#### Opsi A: PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start backend
cd /home/rappwebi/vault-pulse-center/server
pm2 start npm --name "vault-api" -- start

# Save PM2 config
pm2 save

# Setup auto-start
pm2 startup
# Copy & run output command
```

#### Opsi B: Supervisor

```bash
# Install supervisor
sudo apt install supervisor

# Create config
sudo nano /etc/supervisor/conf.d/vault-api.conf

# Paste:
[program:vault-api]
directory=/home/rappwebi/vault-pulse-center/server
command=npm start
user=rappwebi
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/vault-api.log

# Start
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start vault-api
```

---

### STEP 7: Testing & Verification

#### 7.1 Test Frontend

```
Browser: https://rapp.web.id
```

Should see React app loaded fully.

#### 7.2 Test Backend API

```bash
# Health check
curl https://api.rapp.web.id/health

# Should return:
# {"status":"ok","timestamp":"...","database":"connected"}
```

#### 7.3 Test Database Connection

```bash
# SSH ke server
ssh rappwebi@rapp.web.id

# Test PostgreSQL
psql -U vault_user -d vault_pulse_db -h localhost

# Run query
SELECT COUNT(*) FROM "User";
```

#### 7.4 Test Login

1. Open: https://rapp.web.id
2. Try login dengan test account
3. Check browser console (F12)
4. Should redirect to dashboard

---

### STEP 8: Setup Monitoring & Logs

#### 8.1 Check Backend Logs

```bash
# If using PM2:
pm2 logs vault-api

# If using Supervisor:
tail -f /var/log/vault-api.log
```

#### 8.2 Monitor Resources

```bash
# Check memory/CPU
htop

# Check disk space
df -h

# Check running processes
ps aux | grep node
```

#### 8.3 Setup Automated Backups

```bash
# Create backup script
cat > /home/rappwebi/backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/rappwebi/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

mkdir -p $BACKUP_DIR

# Backup PostgreSQL
pg_dump -U vault_user -d vault_pulse_db > $BACKUP_DIR/vault_pulse_db_$TIMESTAMP.sql
gzip $BACKUP_DIR/vault_pulse_db_$TIMESTAMP.sql

# Keep only last 30 days
find $BACKUP_DIR -type f -mtime +30 -delete

echo "Backup created: $BACKUP_DIR/vault_pulse_db_$TIMESTAMP.sql.gz"
EOF

chmod +x /home/rappwebi/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add line: 0 2 * * * /home/rappwebi/backup-db.sh
```

---

### STEP 9: Setup Domain DNS (jika perlu)

#### 9.1 Check Current DNS

Domain `rapp.web.id` sudah pointing ke DomaiNesia IP.

Verify:

```bash
nslookup rapp.web.id
dig rapp.web.id
```

#### 9.2 Add Subdomain (jika menggunakan api.rapp.web.id)

1. cPanel → Addon Domains / Zone Editor
2. Add A Record:
   ```
   Name: api.rapp.web.id
   Type: A
   Value: 36.50.77.60 (your server IP)
   TTL: 3600
   ```

---

## 📊 FINAL ARCHITECTURE

```
┌─────────────────────────────────────────────────┐
│    VAULT PULSE CENTER - DOMAINESIA 100%         │
├─────────────────────────────────────────────────┤
│                                                 │
│  Domain: rapp.web.id                           │
│  ├── Server: DomaiNesia Shared Hosting         │
│  │   ├── IP: 36.50.77.60                       │
│  │   └── Location: /home/rappwebi/             │
│  │                                              │
│  │   FRONTEND:                                  │
│  │   ├── Location: public_html/                │
│  │   ├── Static files (React built)            │
│  │   ├── .htaccess (SPA routing)               │
│  │   └── HTTPS: Let's Encrypt (auto)           │
│  │   Access: https://rapp.web.id               │
│  │                                              │
│  │   BACKEND:                                   │
│  │   ├── Location: vault-pulse-center/server/  │
│  │   ├── Runtime: Node.js                      │
│  │   ├── Process Manager: PM2/Supervisor       │
│  │   ├── Port: 3001                            │
│  │   └── Proxy: Nginx (optional)               │
│  │   Access: https://api.rapp.web.id           │
│  │            (or https://rapp.web.id/api)     │
│  │                                              │
│  │   DATABASE:                                  │
│  │   ├── Type: PostgreSQL                      │
│  │   ├── Location: DomaiNesia managed          │
│  │   ├── Connection: localhost:5432            │
│  │   ├── Admin: phpPgAdmin                     │
│  │   └── Backups: Automated script (daily)     │
│  │                                              │
│  └── Everything in one place! ✅              │
│                                                 │
└─────────────────────────────────────────────────┘

Cost: Rp 0/bulan (semuanya pakai DomaiNesia existing!)
```

---

## 💰 COST COMPARISON

**Scenario 1: Full DomaiNesia (Anda sekarang)**
```
DomaiNesia hosting: (sudah ada)
Backend: Rp 0 (pakai Node.js hosting)
Database: Rp 0 (pakai PostgreSQL hosting)
─────────────────────────────────────
Total/bulan: Rp 0 (GRATIS!)
Total/tahun: Rp 0 (GRATIS!)
```

**Scenario 2: DomaiNesia + Railway (jika ada masalah)**
```
DomaiNesia: (sudah ada)
Railway: $10/bulan
─────────────────────────────────────
Total/bulan: $10 (~Rp 150k)
```

**Kesimpulan**: **Full DomaiNesia paling murah!** 🎉

---

## ⚡ QUICK START (TL;DR)

**Estimasi waktu: 1-2 jam (first time setup)**

1. **Create PostgreSQL Database di cPanel (5 min)**
   - PostgreSQL Database Wizard
   - Create database: vault_pulse_db
   - Create user: vault_user

2. **SSH & Setup Backend (30 min)**
   ```bash
   ssh rappwebi@rapp.web.id
   git clone <repo>
   cd server
   npm install
   npm run prisma:migrate
   npm start
   ```

3. **Build & Upload Frontend (15 min)**
   ```bash
   npm run build
   Upload dist/ ke public_html
   Create .htaccess
   ```

4. **Setup Process Manager (10 min)**
   ```bash
   npm install -g pm2
   pm2 start npm --name "vault-api" -- start
   pm2 startup
   ```

5. **Setup SSL (5 min)**
   - cPanel → Let's Encrypt
   - Auto-install untuk domain

6. **Test Everything (10 min)**
   ```bash
   https://rapp.web.id (frontend)
   https://api.rapp.web.id/health (backend)
   ```

**Done! 🎉**

---

## 🆚 DIBANDING ALTERNATIF

| Platform | Cost | Effort | Setup Time | Control |
|----------|------|--------|-----------|---------|
| **DomaiNesia Full** | Rp 0 | Medium | 1-2 jam | Full ✅ |
| DomaiNesia + Railway | $10/mo | Low | 30 min | Limited |
| Railway All-in | $10/mo | Low | 15 min | Limited |
| VPS | $3-50/mo | High | 2-3 jam | Full |

**DomaiNesia Full = Best untuk Anda!** 🏆

---

## 🆘 TROUBLESHOOTING

### Backend tidak jalan
```
❌ Problem: npm start error
✅ Solution:
   1. Check Node.js version: node --version
   2. Check npm installed: npm --version
   3. Check dependencies: npm install
   4. Check .env file exist
   5. Check database connection: npm run prisma:db:push
```

### Database tidak terhubung
```
❌ Problem: connection refused error
✅ Solution:
   1. Check PostgreSQL running
   2. Check credentials benar
   3. Check database exist: psql -l
   4. Check user permissions
   5. Test: psql -U vault_user -d vault_pulse_db
```

### Frontend cannot reach backend
```
❌ Problem: API calls 404
✅ Solution:
   1. Check backend running: npm start
   2. Check CORS configured
   3. Check API_URL di .env.production
   4. Rebuild frontend: npm run build
   5. Re-upload to public_html
```

### SSL certificate error
```
❌ Problem: HTTPS error
✅ Solution:
   1. Check Let's Encrypt installed via cPanel
   2. Force HTTPS di cPanel settings
   3. Update all URLs to https://
   4. Wait 5 minutes for propagation
```

---

## 📚 HELPFUL COMMANDS

```bash
# SSH Login
ssh rappwebi@rapp.web.id

# Check Node version
node --version

# Install packages
npm install
# or
bun install

# Run migrations
npm run prisma:migrate

# Build backend
npm run build

# Start backend
npm start

# Check if running
curl http://localhost:3001/health

# Monitor with PM2
pm2 list
pm2 logs vault-api

# Check disk space
df -h

# Check memory
free -h

# View logs
tail -f /var/log/pm2.log

# Restart PM2 app
pm2 restart vault-api

# Create backup
pg_dump -U vault_user -d vault_pulse_db > backup.sql
```

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] PostgreSQL database created
- [ ] PostgreSQL user created & assigned
- [ ] SSH working
- [ ] Repository cloned
- [ ] Dependencies installed (npm install)
- [ ] .env file created with correct values
- [ ] Prisma migrations run
- [ ] Backend builds (npm run build)
- [ ] Backend starts (npm start)
- [ ] Health check responds (curl localhost:3001/health)
- [ ] PM2/Supervisor installed & configured
- [ ] Frontend built (npm run build)
- [ ] dist/ uploaded to public_html
- [ ] .htaccess created in public_html
- [ ] Let's Encrypt SSL installed
- [ ] Frontend loads (https://rapp.web.id)
- [ ] API responds (https://api.rapp.web.id/health)
- [ ] Login works
- [ ] Database backups automated
- [ ] Monitoring setup
- [ ] Done! 🎉

---

## 📞 SUPPORT

**DomaiNesia Documentation:**
- https://knowledge.domainesia.com/
- https://www.domainesia.com/support/

**Node.js:**
- https://nodejs.org/docs/

**PostgreSQL:**
- https://www.postgresql.org/docs/
- phpPgAdmin: built-in di cPanel

**PM2:**
- https://pm2.keymetrics.io/

---

**Last Updated**: November 30, 2024
**Status**: Full Stack Deployment Ready ✅
**Recommended**: Start with this guide - paling cost-effective!
