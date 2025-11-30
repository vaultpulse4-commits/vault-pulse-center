# 📦 PANDUAN INSTALL KE CLIENT

## 🚀 Quick Install (Recommended)

### **Windows:**
```powershell
# 1. Download project
git pull origin main

# 2. Install & Setup (Otomatis)
.\setup.ps1
```

### **Linux/Mac:**
```bash
# 1. Download project
git pull origin main

# 2. Install & Setup (Otomatis)
chmod +x setup.sh
./setup.sh
```

---

## 📋 Manual Install (Jika script gagal)

### **Step 1: Install Dependencies**

#### Backend:
```bash
cd server
npm install
```

#### Frontend:
```bash
cd ..
npm install
```

### **Step 2: Database Setup**

```bash
cd server
npx prisma generate
npx prisma db push
```

### **Step 3: Environment Variables**

Pastikan file `.env` di folder `server/` ada dengan isi:
```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/vault_pulse"
JWT_SECRET="your-secret-key-here"
PORT=3001
NODE_ENV=production
```

### **Step 4: Run Application**

#### Development Mode:
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

#### Production Mode:
```bash
# Build Frontend
npm run build

# Run Backend (akan serve frontend juga)
cd server
npm start
```

---

## 🔄 Update Existing Installation

### **Option 1: Git Pull + Setup (Otomatis)**
```powershell
git pull origin main
.\setup.ps1
```

### **Option 2: Manual Update**
```bash
# 1. Pull latest code
git pull origin main

# 2. Update backend dependencies
cd server
npm install
npx prisma generate
npx prisma db push

# 3. Update frontend dependencies
cd ..
npm install

# 4. Restart aplikasi
```

---

## 📦 Production Deployment

### **Option 1: Using PM2 (Recommended)**

```bash
# Install PM2 globally
npm install -g pm2

# Build frontend
npm run build

# Start backend dengan PM2
cd server
pm2 start npm --name "vault-pulse-backend" -- start

# Check status
pm2 status
pm2 logs vault-pulse-backend
```

### **Option 2: Using Docker**

```bash
# Build & Run
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## ✅ Verification Checklist

Setelah install, pastikan:

- [ ] Backend running di `http://localhost:3001`
- [ ] Frontend accessible di `http://localhost:5173` (dev) atau `http://localhost:3001` (prod)
- [ ] Database connected (check terminal logs)
- [ ] Login page muncul
- [ ] Bisa login dengan credentials

---

## 🆕 New Features yang Ditambahkan

### **1. Weekly Report PDF/Excel**
- Location: Week Picker component
- Button: "📄 Weekly Report PDF"
- Content: Equipment Health, Maintenance, Consumables

### **2. Event Brief Improvements**
- Date format: **FRIDAY, 5 DEC 2026**
- New fields:
  - Audio Order
  - Special Lighting Order
  - Visual Order
  - Timecode
  - Brand Moment
  - Live Set Recording
  - SFX Notes

### **3. Maintenance Logs**
- MTTR field di form
- Historical chronological view
- Incident timeline

### **4. RnD Tab Fixes**
- Project lead dengan crew role badge
- Syntax fixes

### **5. Proposals Tab Fixes**
- Quotes count badge
- Form structure fixes

---

## 🐛 Troubleshooting

### **Port sudah digunakan:**
```bash
# Windows - Kill process di port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3001 | xargs kill -9
```

### **Database connection error:**
1. Pastikan PostgreSQL running
2. Check credentials di `.env`
3. Test connection: `npx prisma db pull`

### **Build errors:**
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Server
cd server
rm -rf node_modules package-lock.json
npm install
```

### **Prisma errors:**
```bash
cd server
npx prisma generate
npx prisma db push --force-reset
```

---

## 📞 Support

Jika ada masalah saat install:
1. Check terminal logs untuk error messages
2. Verify semua dependencies ter-install
3. Pastikan database credentials benar
4. Contact support dengan screenshot error

---

## 🎯 Quick Commands Reference

```bash
# Development
npm run dev                 # Frontend dev server
cd server && npm run dev    # Backend dev server

# Production
npm run build              # Build frontend
cd server && npm start     # Start production server

# Database
cd server
npx prisma studio          # Open database GUI
npx prisma generate        # Generate Prisma client
npx prisma db push         # Push schema changes

# PM2
pm2 start/stop/restart vault-pulse-backend
pm2 logs vault-pulse-backend
pm2 monit
```
