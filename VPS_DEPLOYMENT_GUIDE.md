# 🚀 VPS Linux Deployment Guide - Vault Pulse Center

Panduan lengkap untuk deploy aplikasi Vault Pulse Center ke VPS Linux dengan domain custom.

---

## 📋 RINGKASAN APLIKASI ANDA

### Architecture Overview
```
┌─────────────────────────────────────────────────────────────┐
│                    VAULT PULSE CENTER                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  FRONTEND (React + TypeScript + Vite)                       │
│  ├── Responsive UI dengan Shadcn/UI + Tailwind             │
│  ├── PWA Support (offline, push notifications)             │
│  ├── Real-time WebSocket untuk monitoring                  │
│  └── Port: 5173 (dev) / 3000 (prod)                        │
│                                                               │
│  ↔️  HTTPS/WebSocket Connection                              │
│                                                               │
│  BACKEND (Node.js + Express + TypeScript)                  │
│  ├── REST API dengan Express.js                            │
│  ├── WebSocket real-time updates                           │
│  ├── JWT Authentication + RBAC                             │
│  ├── Prisma ORM untuk database                             │
│  └── Port: 3001                                            │
│                                                               │
│  ↓                                                           │
│                                                               │
│  DATABASE (PostgreSQL)                                      │
│  └── 15+ tables (equipment, crew, maintenance, events, etc) │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Spesifikasi Aplikasi

#### Frontend
- **Build Tool**: Vite
- **Dependencies**: React 18, React Router, Socket.io-client
- **UI Library**: Shadcn/ui + Radix UI
- **State Management**: Zustand
- **Charts**: Recharts
- **Package Manager**: Bun/NPM
- **Build Output**: Static files di folder `dist/`

#### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL dengan Prisma ORM
- **Real-time**: Socket.io
- **Authentication**: JWT + bcryptjs
- **File Generation**: PDF (pdfkit), Excel (exceljs)
- **Port**: 3001

#### Database
- **Type**: PostgreSQL
- **ORM**: Prisma v5.22.0
- **Tables**: 
  - Users (authentication, profiles)
  - Equipment (cdj, speaker, led, lighting)
  - Crew (day/night shifts, jakarta/bali)
  - Maintenance (preventive/corrective)
  - Events & Briefs
  - Incidents, Proposals, R&D Projects
  - Consumables & Suppliers
  - Purchase Orders, Alerts, KPI
  - Areas & Permissions

#### Features yang Diimplementasikan
✅ User Authentication (JWT) & RBAC
✅ Equipment Monitoring & Status Tracking
✅ Real-time WebSocket Updates
✅ Event Brief Management
✅ Crew Scheduling (Day/Night)
✅ Maintenance Logging
✅ Incident Tracking
✅ Proposals & R&D Projects
✅ Inventory Management
✅ Alert System (Critical/Warning/Info)
✅ KPI Dashboard & Analytics
✅ PDF & Excel Report Generation
✅ Push Notifications
✅ PWA (Progressive Web App)
✅ Responsive Mobile Design

---

## 🖥️ REQUIREMENT VPS LINUX

### ⭐ OPTIMAL UNTUK 10-12 USERS (RECOMMENDED)
```
OS: Ubuntu 22.04 LTS
CPU: 1-2 cores
RAM: 1-2 GB
Storage: 20 GB SSD
Bandwidth: Limited OK
Cost: $2.5-5/bulan

Provider: DigitalOcean, Vultr, Linode, Contabo
Contoh: Contabo 4GB RAM = $3-4/bulan
```

### Minimum Specifications (Jika Budget Sangat Terbatas)
```
OS: Ubuntu 20.04+ atau CentOS 7+
CPU: 1 core
RAM: 512 MB - 1 GB
Storage: 10 GB
Network: Static IP, domain name
Cost: $2-3/bulan

⚠️  Warning: Akan agak slow, tapi masih jalan
```

### Recommended untuk Production (100+ users)
```
OS: Ubuntu 22.04 LTS
CPU: 4 cores
RAM: 4-8 GB
Storage: 50 GB SSD
Bandwidth: Unlimited
Cost: $20-50/bulan
```

### Software yang Diperlukan
- Node.js 18+ (LTS)
- PostgreSQL 12+
- Nginx (reverse proxy & SSL)
- PM2 (process manager)
- Git
- SSL/TLS Certificate (Let's Encrypt - gratis)

---

## 📝 STEP-BY-STEP DEPLOYMENT GUIDE

### STEP 1: Persiapan VPS

#### 1.1 SSH ke VPS
```bash
ssh root@your_vps_ip_address
# atau
ssh username@your_vps_ip_address
```

#### 1.2 Update System
```bash
apt update && apt upgrade -y
```

#### 1.3 Install Dependencies
```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs npm

# Git
apt install -y git

# PostgreSQL
apt install -y postgresql postgresql-contrib

# Nginx
apt install -y nginx

# PM2 (process manager)
npm install -g pm2

# SSL Tools
apt install -y certbot python3-certbot-nginx

# Utility
apt install -y curl wget htop
```

#### 1.4 Verifikasi Instalasi
```bash
node --version    # v18.x.x
npm --version     # 9.x.x
psql --version    # PostgreSQL 12+
nginx -v          # nginx/1.18+
```

---

### STEP 2: Konfigurasi PostgreSQL Database

#### 2.1 Setup Database User & Database
```bash
# Login ke PostgreSQL
sudo -u postgres psql

# Jalankan perintah berikut di psql:
CREATE USER vault_user WITH PASSWORD 'your_secure_password_here';
CREATE DATABASE vault_pulse_db OWNER vault_user;

# Grant permissions
GRANT ALL PRIVILEGES ON DATABASE vault_pulse_db TO vault_user;
GRANT CREATE ON SCHEMA public TO vault_user;

# Exit
\q
```

#### 2.2 Test Connection
```bash
psql -U vault_user -d vault_pulse_db -h localhost
```

#### 2.3 Backup Connection String
Simpan connection string ini untuk nanti:
```
postgresql://vault_user:your_secure_password_here@localhost:5432/vault_pulse_db?schema=public
```

---

### STEP 3: Setup Repository & Aplikasi

#### 3.1 Clone Repository
```bash
# Buat directory untuk aplikasi
mkdir -p /var/www/applications
cd /var/www/applications

# Clone dari GitHub
git clone https://github.com/your_username/vault-pulse-center.git
cd vault-pulse-center
```

#### 3.2 Backend Setup
```bash
cd server

# Install dependencies
npm install

# Setup environment variables
cat > .env << EOF
DATABASE_URL="postgresql://vault_user:your_secure_password_here@localhost:5432/vault_pulse_db?schema=public"
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
EOF

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Verify build
npm run build
```

#### 3.3 Frontend Setup
```bash
cd /var/www/applications/vault-pulse-center

# Install dependencies
npm install

# atau jika menggunakan Bun
bun install

# Create .env.production
cat > .env.production << EOF
VITE_API_URL=https://api.your-domain.com
EOF

# Build frontend
npm run build
# atau
bun run build
```

---

### STEP 4: Konfigurasi Nginx

#### 4.1 Buat Nginx Config untuk Backend
```bash
cat > /etc/nginx/sites-available/api.your-domain.com << 'EOF'
upstream backend {
    server 127.0.0.1:3001;
    keepalive 32;
}

server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
        
        # WebSocket support
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
    }
}
EOF
```

#### 4.2 Buat Nginx Config untuk Frontend
```bash
cat > /etc/nginx/sites-available/your-domain.com << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    root /var/www/applications/vault-pulse-center/dist;
    
    index index.html;

    # Cache busting untuk assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing - send all requests to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Deny access to sensitive files
    location ~ /\. {
        deny all;
    }
}
EOF
```

#### 4.3 Enable Sites
```bash
ln -s /etc/nginx/sites-available/your-domain.com /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/api.your-domain.com /etc/nginx/sites-enabled/

# Test config
nginx -t

# Reload Nginx
systemctl reload nginx
```

---

### STEP 5: SSL/TLS Setup dengan Let's Encrypt

#### 5.1 Get Certificates
```bash
# Untuk frontend
certbot certonly --nginx -d your-domain.com -d www.your-domain.com

# Untuk backend API
certbot certonly --nginx -d api.your-domain.com
```

#### 5.2 Update Nginx Config dengan SSL

**Frontend** (`/etc/nginx/sites-available/your-domain.com`):
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    root /var/www/applications/vault-pulse-center/dist;
    index index.html;

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~ /\. {
        deny all;
    }
}
```

**Backend** (`/etc/nginx/sites-available/api.your-domain.com`):
```nginx
server {
    listen 80;
    server_name api.your-domain.com;
    return 301 https://$server_name$request_uri;
}

upstream backend {
    server 127.0.0.1:3001;
    keepalive 32;
}

server {
    listen 443 ssl http2;
    server_name api.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/api.your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.your-domain.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
    }
}
```

#### 5.3 Reload Nginx
```bash
nginx -t
systemctl reload nginx
```

#### 5.4 Auto-Renewal SSL
```bash
# Test renewal
certbot renew --dry-run

# Setup auto-renewal
systemctl enable certbot.timer
systemctl start certbot.timer
```

---

### STEP 6: Setup Process Manager (PM2)

#### 6.1 Start Backend dengan PM2
```bash
cd /var/www/applications/vault-pulse-center/server

# Start application
pm2 start npm --name "vault-pulse-api" -- start

# Save PM2 configuration
pm2 save

# Setup auto-start on reboot
pm2 startup
# Copy dan jalankan output command dari perintah di atas
```

#### 6.2 Verify PM2
```bash
pm2 list
pm2 logs vault-pulse-api
```

---

### STEP 7: Domain Setup

#### 7.1 Point Domain ke VPS
Pada registrar domain Anda (Niagahoster, Cloudflare, GoDaddy, etc):

**A Record:**
```
Type: A
Name: @ (atau your-domain.com)
Value: your_vps_ip_address
TTL: 3600
```

**Subdomain API:**
```
Type: A
Name: api
Value: your_vps_ip_address
TTL: 3600
```

Atau gunakan CNAME jika provider mendukung:
```
Type: CNAME
Name: api
Value: your-domain.com
```

#### 7.2 Verify DNS
```bash
nslookup your-domain.com
nslookup api.your-domain.com

# atau
dig your-domain.com
dig api.your-domain.com
```

Wait 5-30 menit untuk DNS propagation.

---

### STEP 8: Testing & Verification

#### 8.1 Test Frontend
```bash
# Open browser
https://your-domain.com

# Check browser console untuk API connection status
```

#### 8.2 Test Backend
```bash
# Health check
curl https://api.your-domain.com/health

# Should return:
# {"status":"ok","timestamp":"2024-01-15T10:30:45.123Z"}
```

#### 8.3 Test Database Connection
```bash
# Di VPS
psql -U vault_user -d vault_pulse_db -h localhost

# Run query
SELECT * FROM "User" LIMIT 1;
```

#### 8.4 Check Logs
```bash
# Backend logs
pm2 logs vault-pulse-api

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# PostgreSQL logs
tail -f /var/log/postgresql/postgresql.log
```

---

## 🔄 STEP 9: Backup & Monitoring

#### 9.1 Database Backup Script
```bash
cat > /home/backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/postgresql"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILE="$BACKUP_DIR/vault_pulse_db_$TIMESTAMP.sql"

mkdir -p $BACKUP_DIR

pg_dump -U vault_user -d vault_pulse_db > $FILE
gzip $FILE

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup created: $FILE.gz"
EOF

chmod +x /home/backup-db.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /home/backup-db.sh") | crontab -
```

#### 9.2 Monitoring Tools
```bash
# Install htop untuk monitoring
apt install -y htop

# Real-time monitoring
htop

# Check disk space
df -h

# Check memory
free -h
```

#### 9.3 PM2 Monitoring
```bash
# Realtime logs
pm2 logs

# Monitor with web UI
pm2 web
# Akses: http://your-vps-ip:9615
```

---

## 🚀 STEP 10: Update & Deployment Workflow

### Automatic Deployment dengan Git Webhook (Optional)

#### 10.1 Create Deployment Script
```bash
cat > /home/deploy.sh << 'EOF'
#!/bin/bash
cd /var/www/applications/vault-pulse-center

# Pull latest code
git pull origin main

# Backend update
cd server
npm install
npm run build
npm run prisma:migrate
pm2 restart vault-pulse-api

# Frontend update
cd ..
npm install
npm run build

# Reload Nginx
nginx -s reload

echo "Deployment completed at $(date)"
EOF

chmod +x /home/deploy.sh
```

#### 10.2 Setup Webhook (GitHub)
1. Go ke Settings → Webhooks → Add webhook
2. Payload URL: `http://your-vps-ip/webhook`
3. Content type: application/json
4. Event: Push events

---

## 📊 TROUBLESHOOTING & COMMON ISSUES

### Frontend tidak bisa konek ke backend
```bash
# Check backend running
pm2 list

# Check Nginx config
nginx -t

# Check logs
tail -f /var/log/nginx/error.log
pm2 logs vault-pulse-api
```

### Database connection error
```bash
# Verify database running
systemctl status postgresql

# Test connection
psql -U vault_user -d vault_pulse_db -h localhost

# Check .env file
cat /var/www/applications/vault-pulse-center/server/.env
```

### SSL certificate error
```bash
# List certificates
certbot certificates

# Renew certificate
certbot renew --force-renewal -d your-domain.com
```

### Nginx not working
```bash
# Restart Nginx
systemctl restart nginx

# Check status
systemctl status nginx

# Verify config
nginx -t
```

### High memory usage
```bash
# Check processes
ps aux | grep node

# Restart PM2 app
pm2 restart vault-pulse-api

# Increase PM2 max memory
pm2 start npm --name "vault-pulse-api" --max-memory-restart 500M -- start
```

---

## 🎯 ALTERNATIVE SOLUTIONS (RECOMMENDED)

Jika prefer tidak configure VPS manual, ada alternatif lain yang lebih simple:

### Option A: Railway.app (Recommended)
- ✅ Fully managed (no server config needed)
- ✅ Auto-scaling
- ✅ Built-in PostgreSQL
- ✅ Free tier available
- ✅ Auto-deploy dari GitHub
- 💰 $5 credit/month gratis

**Setup: 15 menit, No DevOps needed**

### Option B: Render.com
- ✅ Similar ke Railway
- ✅ Free PostgreSQL tier
- ✅ Auto-SSL
- ✅ Easy deployment

**Setup: 15 menit, Beginner friendly**

### Option C: Vercel + Railway
- ✅ Vercel untuk frontend (free)
- ✅ Railway untuk backend + DB
- ✅ Best performance untuk React apps
- ✅ $5 credit/month

**Setup: 20 menit, Recommended combination**

---

## ✅ POST-DEPLOYMENT CHECKLIST

- [ ] VPS OS updated
- [ ] Node.js, npm, PostgreSQL installed
- [ ] Database created & user configured
- [ ] Repository cloned
- [ ] Backend .env configured
- [ ] Database migrations run
- [ ] Backend built & running (PM2)
- [ ] Frontend built
- [ ] Nginx configured
- [ ] Domain pointing to VPS
- [ ] SSL certificates installed
- [ ] Frontend accessible via HTTPS
- [ ] Backend health check responding
- [ ] Database backups scheduled
- [ ] PM2 auto-startup configured
- [ ] Monitoring setup (htop, PM2)
- [ ] Logs verified

---

## 📞 SUPPORT & RESOURCES

- **Nginx Documentation**: https://nginx.org/en/docs/
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/
- **PM2 Documentation**: https://pm2.keymetrics.io/
- **Let's Encrypt**: https://letsencrypt.org/
- **Socket.io WebSocket**: https://socket.io/docs/

---

**Last Updated**: November 2024
**Version**: 1.0
**Status**: Production Ready ✅
