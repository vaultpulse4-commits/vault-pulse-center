# 🔧 GITHUB REPOSITORY SETUP - Untuk Deployment ke DomaiNesia

Ini adalah langkah penting sebelum deploy ke DomaiNesia! Mari kita setup GitHub repository dengan benar.

---

## 📋 YANG ANDA LIHAT

Screenshot menunjukkan GitHub "Create a new repository" form dengan setting:

```
Owner: digimom462-cell
Repository name: vault-pulse-center
Visibility: Private
```

---

## ⚙️ SETTING YANG DISARANKAN

Dari screenshot, berikut rekomendasi setting untuk aplikasi Anda:

### 1️⃣ GENERAL SETTINGS

```
Owner: digimom462-cell ✅
Repository name: vault-pulse-center ✅
Description: Pengerjaan Project ✅
Visibility: Private ✅ (keep private untuk production app)
```

**Penjelasan:**
- **Owner**: Akun GitHub Anda (digimom462-cell)
- **Repository name**: vault-pulse-center (sudah tepat!)
- **Private**: Baik untuk security (hanya Anda yang bisa akses)

---

### 2️⃣ CONFIGURATION SETTINGS

**Add README:**
- ✅ On (recommended)

**Add .gitignore:**
- Select: **Node.js** (sudah ada di project Anda)

**Add license:**
- MIT License (recommended untuk open-source)
- Atau: No license (jika tidak ingin share)

---

## 🎯 LANGKAH SETUP LENGKAP

### STEP 1: Setup Repository di GitHub

#### 1.1 Fill GitHub Form Sesuai Ini:

```
General:
├─ Owner: digimom462-cell
├─ Repository name: vault-pulse-center
├─ Description: Pengerjaan Project
└─ Visibility: Private ✅

Configuration:
├─ Add README: On ✅
├─ Add .gitignore: Node.js ✅
└─ Add license: MIT License (optional)
```

#### 1.2 Click "Create repository"

GitHub akan create repository baru dengan:
- Blank repo (atau dengan README + .gitignore)
- SSH/HTTPS URL untuk clone

#### 1.3 Copy Repository URL

Ada 2 opsi:
```
HTTPS: https://github.com/digimom462-cell/vault-pulse-center.git
SSH: git@github.com:digimom462-cell/vault-pulse-center.git
```

Gunakan **HTTPS** jika belum setup SSH keys.

---

### STEP 2: Push Code dari Lokal ke GitHub

Di PowerShell (dari folder project Anda):

```powershell
cd d:\PROJECT Fastwork\vault-pulse-center

# Initialize git (jika belum)
git init

# Add remote GitHub
git remote add origin https://github.com/digimom462-cell/vault-pulse-center.git

# Create .gitignore untuk Node.js
cat > .gitignore << EOF
# Dependencies
node_modules/
package-lock.json
bun.lockb

# Build outputs
dist/
build/
out/
.next

# Environment variables
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*

# Misc
.cache/
temp/
tmp/
EOF

# Add all files
git add .

# Commit
git commit -m "Initial commit: Vault Pulse Center - Production Ready"

# Push ke GitHub
git push -u origin main
```

---

### STEP 3: Verify di GitHub

1. Buka: https://github.com/digimom462-cell/vault-pulse-center
2. Seharusnya bisa lihat:
   - ✅ Semua files sudah ter-upload
   - ✅ .gitignore applied
   - ✅ Commit message "Initial commit"

---

## 📊 REPOSITORY STRUCTURE YANG BAIK

Pastikan struktur folder seperti ini:

```
vault-pulse-center/
├── server/                    # Backend (Node.js)
│   ├── src/
│   ├── dist/
│   ├── prisma/
│   ├── package.json          ✅
│   ├── tsconfig.json
│   ├── .env.example          (jangan push .env asli!)
│   └── ...
│
├── src/                       # Frontend (React)
│   ├── components/
│   ├── pages/
│   ├── App.tsx
│   ├── main.tsx
│   └── ...
│
├── public/                    # Static assets
│   ├── manifest.json
│   ├── sw.js
│   └── ...
│
├── package.json              ✅
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── .gitignore               ✅
├── .env.example             (environment template, tanpa secrets)
├── README.md                ✅
└── ...
```

---

## ⚠️ IMPORTANT: .env Files

### JANGAN Push ke GitHub:
- ❌ `.env` (production secrets)
- ❌ `.env.local`
- ❌ `.env.production`
- ❌ Private keys
- ❌ API secrets

### BOLEH Push:
- ✅ `.env.example` (template without real values)

**Contoh .env.example:**
```
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Server
PORT=3001
NODE_ENV=development

# Frontend
VITE_API_URL=http://localhost:3001

# Auth
JWT_SECRET=your-secret-key-here
```

---

## 🔐 SECURITY BEST PRACTICES

### 1. Repository Privacy
- ✅ Gunakan **Private** (only you bisa access)
- ❌ Jangan gunakan **Public** (untuk production app)

### 2. Secrets Management
- ❌ JANGAN commit `.env` dengan real values
- ✅ Gunakan GitHub Secrets untuk deployment
- ✅ Store secrets di DomaiNesia secara manual

### 3. Branches
- `main` - production ready code
- `develop` - development branch
- `feature/*` - feature branches

### 4. Commit Messages
```
✅ Good:
- "feat: add equipment monitoring"
- "fix: database connection issue"
- "docs: update deployment guide"

❌ Bad:
- "update"
- "fix stuff"
- "asdf"
```

---

## 🚀 NEXT STEPS SETELAH GITHUB SETUP

### 1. Create .env.example

```bash
# File: .env.example (push ke GitHub)
DATABASE_URL="postgresql://vault_user:password@localhost:5432/vault_pulse_db"
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://rapp.web.id
JWT_SECRET=change-this-to-random-string
CORS_ORIGIN=https://rapp.web.id
```

### 2. Create README.md

```markdown
# Vault Pulse Center

Professional equipment management system dengan real-time monitoring.

## Tech Stack
- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express
- Database: PostgreSQL
- Real-time: Socket.io

## Deployment
See: DOMAINESIA_OPTIMAL_STRATEGY.md

## Setup
1. npm install
2. Create .env from .env.example
3. npm run dev
```

### 3. Create server/.env (Local Only)

```bash
# File: server/.env (DO NOT COMMIT!)
DATABASE_URL="postgresql://vault_user:your_password@localhost:5432/vault_pulse_db"
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://rapp.web.id
JWT_SECRET=your-secret-key-32-chars-minimum
CORS_ORIGIN=https://rapp.web.id
```

### 4. Push ke GitHub

```bash
git add README.md .env.example
git commit -m "docs: add environment template and README"
git push origin main
```

---

## ✅ GITHUB SETUP CHECKLIST

- [ ] Create repository di GitHub
- [ ] Repository name: vault-pulse-center
- [ ] Set to Private ✅
- [ ] Clone atau push existing code
- [ ] Create .gitignore (Node.js)
- [ ] Create .env.example (without secrets)
- [ ] Create README.md
- [ ] Push initial commit
- [ ] Verify di GitHub (all files visible)
- [ ] Copy repository URL (HTTPS)
- [ ] Ready for DomaiNesia deployment!

---

## 📝 UNTUK DOMAINESIA DEPLOYMENT

Setelah GitHub setup, siapkan untuk DomaiNesia:

### In server/package.json:
```json
{
  "name": "vault-pulse-api",
  "version": "1.0.0",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate deploy"
  }
}
```

### In DomaiNesia Setup Node.js App:
```
Application root: /home/rappwebi/vault-pulse-center/server/
Application startup file: dist/index.js
Node.js version: 18.x
```

DomaiNesia akan:
1. ✅ Clone repo dari GitHub
2. ✅ Run npm install
3. ✅ Run npm run build
4. ✅ Run npm run prisma:migrate
5. ✅ Start dengan: npm start

---

## 🔗 USEFUL GITHUB COMMANDS

```bash
# Clone repository (jika start baru)
git clone https://github.com/digimom462-cell/vault-pulse-center.git
cd vault-pulse-center

# Check status
git status

# Add files
git add .

# Commit
git commit -m "message"

# Push
git push origin main

# Pull latest
git pull origin main

# Create branch
git checkout -b feature/new-feature

# Switch branch
git checkout main

# Merge
git merge feature/new-feature
```

---

## 📞 AFTER GITHUB SETUP

1. ✅ Copy GitHub URL:
   ```
   https://github.com/digimom462-cell/vault-pulse-center.git
   ```

2. ✅ Go to DomaiNesia cPanel

3. ✅ Click "Setup Node.js App"

4. ✅ Paste GitHub URL

5. ✅ Follow DOMAINESIA_OPTIMAL_STRATEGY.md

---

## 💡 RECOMMENDED SETTINGS SUMMARY

| Setting | Value | Reason |
|---------|-------|--------|
| Owner | digimom462-cell | Your account |
| Name | vault-pulse-center | Clear name |
| Description | Pengerjaan Project | For reference |
| Visibility | Private | Security |
| README | Yes | Documentation |
| .gitignore | Node.js | Ignore node_modules |
| License | MIT (optional) | Usage rights |
| Branches | main + develop | Best practice |

---

## 🎯 NEXT ACTION

1. **Create Repository di GitHub** dengan setting di atas
2. **Push code** dari lokal
3. **Verify** semua files ada di GitHub
4. **Copy URL**: `https://github.com/digimom462-cell/vault-pulse-center.git`
5. **Then go to DomaiNesia** dan follow DOMAINESIA_OPTIMAL_STRATEGY.md

---

**Last Updated**: November 30, 2024
**Status**: Ready for GitHub & DomaiNesia Deployment ✅
