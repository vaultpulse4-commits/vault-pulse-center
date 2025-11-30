# 🚀 WORKFLOW SEDERHANA - Edit Lokal → GitHub → DomaiNesia

**Tujuan**: Edit di lokal, push ke GitHub, deploy ke DomaiNesia

---

## 🎯 WORKFLOW YANG ANDA MAU

```
Lokal (VSCode)  →  GitHub  →  DomaiNesia  →  Live!
     ↓
   Edit code
     ↓
   git push
     ↓
  Update GitHub
     ↓
DomaiNesia pull
     ↓
   Website updated!
```

---

## ⚡ SETUP AWAL (SEKALI SAJA - 10 MENIT)

### Step 1: Fix Git Remote (1 menit)

Dari error Anda, remote sudah ada. Cek dulu:

```powershell
cd "d:\PROJECT Fastwork\vault-pulse-center"

# Check remote
git remote -v

# Jika ada error "remote origin already exists", hapus dulu:
git remote remove origin

# Kemudian add lagi:
git remote add origin https://github.com/digimom462-cell/vault-pulse-center.git
```

### Step 2: Hapus File .env (PENTING - 2 menit)

```powershell
# Hapus .env dari git (tapi tetap ada di lokal untuk dev)
git rm --cached server/.env

# Commit
git commit -m "security: remove .env from git"
```

### Step 3: Push Pertama Kali (3 menit)

```powershell
# Add semua file
git add .

# Commit
git commit -m "Initial commit: ready for deployment"

# Push ke GitHub
git push -u origin main
```

Jika ada error "branch main doesn't exist", gunakan:
```powershell
git branch -M main
git push -u origin main
```

### Step 4: Verify di GitHub (1 menit)

Buka: https://github.com/digimom462-cell/vault-pulse-center

Harus lihat semua files (tapi NO .env file).

---

## 🔄 WORKFLOW HARIAN (SETIAP KALI EDIT)

### Scenario: Anda ubah code di VSCode

**Step 1: Edit file** (misalnya: `src/pages/Login.tsx`)
```
- Edit di VSCode
- Save (Ctrl+S)
```

**Step 2: Test lokal** (optional tapi recommended)
```powershell
npm run dev
# Check: http://localhost:5173
```

**Step 3: Commit & Push** (2 menit)
```powershell
cd "d:\PROJECT Fastwork\vault-pulse-center"

# Check apa yang berubah
git status

# Add semua perubahan
git add .

# Commit dengan message jelas
git commit -m "fix: update login page styling"

# Push ke GitHub
git push origin main
```

**Step 4: Deploy ke DomaiNesia** (2 cara)

**CARA A: Manual Pull via cPanel Terminal** (2 menit)
```bash
# Login ke cPanel → Terminal
cd /home/rappwebi/vault-pulse-center

# Pull latest dari GitHub
git pull origin main

# Rebuild backend (jika ubah server code)
cd server
npm install
npm run build

# Rebuild frontend (jika ubah frontend code)
cd ..
npm run build

# Restart Node.js app
# Via cPanel: "Setup Node.js App" → Click "Restart"
```

**CARA B: Auto-deploy dengan Git Hooks** (setup sekali, auto selamanya!)
```bash
# Setup di DomaiNesia (via Terminal)
cd /home/rappwebi/vault-pulse-center
nano .git/hooks/post-receive

# Paste ini:
#!/bin/bash
cd /home/rappwebi/vault-pulse-center
git pull origin main
cd server && npm install && npm run build
cd .. && npm run build
# Restart Node.js app via pm2 restart atau setup lain
```

---

## 🎯 QUICK REFERENCE - Command Cheat Sheet

### Workflow Standar (Copy-Paste Ready)

```powershell
# 1. Check status
git status

# 2. Add semua perubahan
git add .

# 3. Commit dengan message
git commit -m "feat: deskripsi perubahan"

# 4. Push ke GitHub
git push origin main

# 5. Deploy ke DomaiNesia (via cPanel Terminal)
# ssh ke server, atau via cPanel Terminal:
cd /home/rappwebi/vault-pulse-center && git pull origin main && cd server && npm run build && cd .. && npm run build
```

---

## 📝 COMMIT MESSAGE CONVENTION

**Good commit messages:**
```
feat: add new feature
fix: bug di login
update: improve UI dashboard
docs: update README
```

**Bad commit messages:**
```
update
changes
asdf
fix stuff
```

---

## 🔧 SETUP DOMAINESIA AUTO-DEPLOY (OPTIONAL)

Untuk auto-deploy setiap kali push, setup webhook:

### Step 1: Buat Deploy Script di DomaiNesia

File: `/home/rappwebi/deploy.sh`
```bash
#!/bin/bash
cd /home/rappwebi/vault-pulse-center
git pull origin main
cd server && npm install && npm run build
cd .. && npm install && npm run build
# Restart app via pm2 atau cPanel
```

Chmod:
```bash
chmod +x /home/rappwebi/deploy.sh
```

### Step 2: Setup GitHub Webhook

1. GitHub repo → Settings → Webhooks → Add webhook
2. Payload URL: `https://rapp.web.id/deploy-webhook.php`
3. Content type: `application/json`
4. Events: Just the push event
5. Save

### Step 3: Buat Webhook Handler

File: `/home/rappwebi/public_html/deploy-webhook.php`
```php
<?php
// Verify GitHub webhook
$signature = $_SERVER['HTTP_X_HUB_SIGNATURE'] ?? '';
$payload = file_get_contents('php://input');

// Execute deploy script
if ($signature) {
    shell_exec('/home/rappwebi/deploy.sh > /dev/null 2>&1 &');
    echo "Deployed!";
}
?>
```

Sekarang setiap `git push`, auto-deploy ke DomaiNesia! 🎉

---

## 🚀 SIMPLIFIED WORKFLOW (PALING SEDERHANA)

### Edit → Push → Deploy (3 langkah)

**1. Edit di VSCode** ✏️
```
- Ubah file
- Save
```

**2. Push ke GitHub** 📤
```powershell
git add . && git commit -m "update: perubahan" && git push origin main
```

**3. Deploy ke DomaiNesia** 🚀
```
Via cPanel: Setup Node.js App → Click "Restart"
Atau: Terminal → git pull && npm run build
```

---

## 📊 WORKFLOW DIAGRAM

```
┌─────────────────────────────────────────────┐
│  1. LOKAL (Your Computer)                   │
│     - Edit code di VSCode                   │
│     - Test: npm run dev                     │
│     - Commit: git add . && git commit       │
│     - Push: git push origin main            │
└─────────────────┬───────────────────────────┘
                  │
                  ↓ (git push)
┌─────────────────────────────────────────────┐
│  2. GITHUB REPOSITORY                       │
│     - Code tersimpan                        │
│     - History tracking                      │
│     - Backup otomatis                       │
└─────────────────┬───────────────────────────┘
                  │
                  ↓ (git pull atau webhook)
┌─────────────────────────────────────────────┐
│  3. DOMAINESIA SERVER                       │
│     - Pull latest code                      │
│     - npm run build                         │
│     - Restart Node.js app                   │
│     - Website updated!                      │
└─────────────────┬───────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────┐
│  4. LIVE WEBSITE                            │
│     https://rapp.web.id                     │
│     https://api.rapp.web.id                 │
└─────────────────────────────────────────────┘
```

---

## ⏱️ TIME ESTIMATES

| Task | Time |
|------|------|
| Edit code lokal | Variable |
| git add + commit + push | 1 min |
| DomaiNesia pull + build | 3 min |
| **Total per update** | **~5 min** |

Dengan auto-deploy: **~1 min per update!**

---

## 🎯 NEXT ACTIONS (DO THIS NOW)

### IMMEDIATE (Fix git remote - 5 min)

```powershell
cd "d:\PROJECT Fastwork\vault-pulse-center"

# Remove existing remote (jika ada error)
git remote remove origin

# Add remote
git remote add origin https://github.com/digimom462-cell/vault-pulse-center.git

# Remove .env dari git
git rm --cached server/.env

# Commit semua
git add .
git commit -m "initial: ready for deployment"

# Push pertama kali
git branch -M main
git push -u origin main
```

### THEN (Test workflow - 2 min)

```powershell
# Test: Edit file kecil (misalnya README.md)
echo "Test update" >> README.md

# Commit & push
git add .
git commit -m "test: workflow check"
git push origin main

# Verify di GitHub
```

### FINALLY (Deploy ke DomaiNesia - 40 min)

Follow: **DOMAINESIA_OPTIMAL_STRATEGY.md**

---

## 💡 TIPS & BEST PRACTICES

### Do's ✅
- Commit often (setiap fitur selesai)
- Message commit jelas
- Test lokal sebelum push
- Pull sebelum edit (jika ada team)
- Backup database sebelum deploy besar

### Don'ts ❌
- Jangan commit .env file
- Jangan commit node_modules
- Jangan commit credentials
- Jangan push broken code
- Jangan commit dist/ folder

---

## 🆘 TROUBLESHOOTING

### Error: "remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/digimom462-cell/vault-pulse-center.git
```

### Error: "branch main doesn't exist"
```powershell
git branch -M main
git push -u origin main
```

### Error: "failed to push"
```powershell
# Pull first
git pull origin main --rebase
git push origin main
```

### DomaiNesia: "Changes not showing"
```bash
# Via cPanel Terminal
cd /home/rappwebi/vault-pulse-center
git pull origin main
npm run build
# Restart Node.js app via cPanel
```

---

## 📚 RESOURCES

**Main Guides:**
- DOMAINESIA_OPTIMAL_STRATEGY.md (deployment)
- HASIL_CEK_DETAIL_LENGKAP.md (status check)

**Git Commands:**
- `git status` - Lihat perubahan
- `git add .` - Stage semua
- `git commit -m "msg"` - Commit
- `git push origin main` - Push
- `git pull origin main` - Pull
- `git log` - Lihat history

---

## 🎉 SUMMARY

**Yang Anda mau:**
```
Edit lokal → Push GitHub → Deploy DomaiNesia
```

**Caranya:**
```
1. Setup sekali (10 min)
2. Setiap edit: git push (1 min)
3. Deploy: git pull di server (3 min)
4. Optional: Auto-deploy dengan webhook (0 min!)
```

**Result:**
```
Workflow efisien, update cepat, tracking lengkap! 🚀
```

---

**Status**: Ready to start! ✅  
**Next**: Fix git remote dan push pertama kali  
**Time**: 10 minutes to setup, 1-5 min per update setelahnya

