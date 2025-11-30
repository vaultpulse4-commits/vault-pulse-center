# ⚡ QUICK START - Cara Paling Simpel

**Tujuan**: Edit lokal → Push GitHub → Deploy DomaiNesia

---

## 🚀 SETUP PERTAMA KALI (5 MENIT)

### Jalankan Script Ini:

```powershell
cd "d:\PROJECT Fastwork\vault-pulse-center"
.\first-time-setup.ps1
```

Script akan:
1. ✅ Fix git remote
2. ✅ Remove .env dari git
3. ✅ Commit semua file
4. ✅ Push ke GitHub

**Done! GitHub setup complete!** 🎉

---

## 📝 SETIAP KALI MAU EDIT & PUSH

### Step 1: Edit Code (di VSCode)
```
- Edit file yang mau diubah
- Save (Ctrl+S)
```

### Step 2: Push ke GitHub (1 command)
```powershell
.\quick-push.ps1
```

Script akan tanya commit message, kemudian:
1. ✅ Stage changes
2. ✅ Commit
3. ✅ Push to GitHub

**Done! Code di GitHub!** 🎉

### Step 3: Deploy ke DomaiNesia (pilih salah satu)

**Option A: Via cPanel (1 click)**
1. Login: https://rapp.web.id:2083/
2. Search: "Setup Node.js App"
3. Click: "Restart" button
4. Done! ✅

**Option B: Via Terminal (1 command)**
```bash
cd /home/rappwebi/vault-pulse-center && git pull && npm run build
```

---

## 🔄 FULL WORKFLOW (SUPER SIMPEL)

```
1. Edit code di VSCode
2. Run: .\quick-push.ps1
3. cPanel → Restart Node.js App
4. Done! Website updated! 🎉
```

**Total time: 2-3 minutes per update!**

---

## 📊 VISUAL WORKFLOW

```
┌──────────────────┐
│  Edit di VSCode  │
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│ .\quick-push.ps1 │  ← 1 command!
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│  GitHub Updated  │
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│ cPanel: Restart  │  ← 1 click!
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│  Website LIVE!   │ ✅
└──────────────────┘
```

---

## 💡 YANG ANDA PUNYA SEKARANG

### 2 Scripts:

**1. first-time-setup.ps1** (jalankan sekali)
- Setup GitHub connection
- Remove .env
- Initial push

**2. quick-push.ps1** (setiap edit)
- Stage → Commit → Push
- 1 command untuk semua!

### Usage:

```powershell
# Pertama kali (setup)
.\first-time-setup.ps1

# Setiap edit
.\quick-push.ps1

# Dengan custom message
.\quick-push.ps1 -message "fix: update login page"
```

---

## 🎯 NEXT ACTIONS

### RIGHT NOW (5 min)
```powershell
cd "d:\PROJECT Fastwork\vault-pulse-center"
.\first-time-setup.ps1
```

Wait for completion, then verify:
https://github.com/digimom462-cell/vault-pulse-center

### THEN (40 min)
Follow: **DOMAINESIA_OPTIMAL_STRATEGY.md**
- Create PostgreSQL database
- Setup Node.js App
- Build frontend
- Setup SSL
- Test

### AFTER THAT (selamanya)
Setiap mau edit:
```
1. Edit code
2. .\quick-push.ps1
3. cPanel restart
4. Done!
```

---

## ⏱️ TIME COMPARISON

### Before (Manual)
```
git status                    (10 sec)
git add .                     (5 sec)
git commit -m "message"       (10 sec)
git push origin main          (20 sec)
───────────────────────────────────
Total: 45 seconds
```

### After (Script)
```
.\quick-push.ps1              (30 sec total)
───────────────────────────────────
Total: 30 seconds
```

**Saved: 15 seconds per push! (33% faster)**

---

## 🆘 TROUBLESHOOTING

### Script not running?
```powershell
# Enable script execution (run as Admin)
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then try again
.\first-time-setup.ps1
```

### Git error?
```powershell
# Check git installed
git --version

# Check remote
git remote -v
```

### Push failed?
```powershell
# Pull first
git pull origin main

# Then push
git push origin main
```

---

## 🎉 SUMMARY

**Anda sekarang punya:**
- ✅ 2 automation scripts
- ✅ 1-command push workflow
- ✅ Simple deployment procedure
- ✅ Complete documentation

**Yang perlu dilakukan:**
1. ✅ Run first-time-setup.ps1 (sekali)
2. ✅ Deploy ke DomaiNesia (sekali)
3. ✅ Use quick-push.ps1 (setiap edit)

**Result:**
- Edit → Push → Deploy dalam **2-3 menit!** ⚡

---

**Start NOW:** `.\first-time-setup.ps1` 🚀
