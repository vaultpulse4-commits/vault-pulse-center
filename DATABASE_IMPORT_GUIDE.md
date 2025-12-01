# 🚀 PANDUAN EXPORT & IMPORT DATABASE KE DOMAINESIA

Last Updated: December 1, 2025

---

## 📋 OVERVIEW

Panduan ini akan membantu Anda:
1. ✅ Export database PostgreSQL lokal
2. ✅ Setup database di DomaiNesia
3. ✅ Test connection ke DomaiNesia
4. ✅ Import data ke DomaiNesia
5. ✅ Verify database siap production

---

## 🎯 STEP 1: SETUP DATABASE DI DOMAINESIA

### 1.1 Login ke cPanel

```
URL: https://rapp.web.id:2083/
Username: rappwebi
Password: (your password)
```

### 1.2 Buat Database PostgreSQL

1. **Go to "PostgreSQL Database Wizard"**
2. **Step 1: Create Database**
   ```
   Database Name: vaultdb
   ```
   (Full name akan jadi: `rappwebi_vaultdb`)

3. **Click "Create Database"**

### 1.3 Buat User Database

4. **Step 2: Create User**
   ```
   Username: vaultuser
   Password: (generate strong password - min 16 chars)
   ```
   ⚠️ **PENTING: SIMPAN PASSWORD INI!**
   
   (Full username akan jadi: `rappwebi_vaultuser`)

5. **Click "Create User"**

### 1.4 Grant Permissions

6. **Step 3: Add User to Database**
   - Select database: `rappwebi_vaultdb`
   - Select user: `rappwebi_vaultuser`
   - **Check ALL PRIVILEGES**

7. **Click "Add User to Database"**

### 1.5 Catat Connection Details

DomaiNesia akan show connection string seperti ini:
```
Host: localhost
Port: 5432
Database: rappwebi_vaultdb
Username: rappwebi_vaultuser
Password: (your password)
```

---

## 🔧 STEP 2: UPDATE ENV FILE

### 2.1 Edit `.env.domainesia`

File sudah dibuat di: `server/.env.domainesia`

Update dengan credentials dari Step 1:

```env
DATABASE_URL="postgresql://rappwebi_vaultuser:YOUR_PASSWORD@localhost:5432/rappwebi_vaultdb"
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://rapp.web.id
JWT_SECRET=your-random-secret-key-minimum-32-chars-change-this
CORS_ORIGIN=https://rapp.web.id
```

⚠️ **Ganti `YOUR_PASSWORD` dengan password yang Anda buat!**

---

## ✅ STEP 3: TEST CONNECTION

### 3.1 Test dari Lokal ke DomaiNesia

```bash
cd server
npm run test:connection
```

**Expected Output:**
```
=== DOMAINESIA DATABASE CONNECTION TEST ===

Test 1: Basic Connection
✓ Connected to database successfully!

Test 2: Query Database Version
✓ PostgreSQL Version: PostgreSQL 16.x

Test 3: Check Tables
⚠ No tables found. Database is empty (migration needed).

Test 4: Query User Table
⚠ User table not found (migration needed)

=== CONNECTION TEST SUCCESSFUL ===
✓ Database is accessible
✓ Credentials are correct
✓ Ready for migration
```

### 3.2 Jika Error

**Error: authentication failed**
- ✗ Username atau password salah
- ✗ Cek lagi di cPanel PostgreSQL Databases

**Error: database does not exist**
- ✗ Database belum dibuat
- ✗ Atau typo di nama database

**Error: connection refused**
- ✗ Host atau port salah
- ✗ PostgreSQL service not running

---

## 📦 STEP 4: EXPORT DATABASE LOKAL (OPTIONAL)

Jika Anda ingin export data dari lokal:

### 4.1 Export Database

```bash
cd server
npm run export:db
```

Atau manual:

```bash
# Windows PowerShell
cd server
.\export-db.ps1
```

Script akan:
1. Export database `vault_pulse_db` ke file `vault_pulse_backup.sql`
2. Show ukuran file
3. Ready untuk import

### 4.2 Verify Export File

```bash
# Check file created
ls vault_pulse_backup.sql

# Should see file with size (KB/MB)
```

---

## 🔄 STEP 5: MIGRATE SCHEMA KE DOMAINESIA

### Option A: Push Schema (Recommended - Mudah)

```bash
cd server
npx prisma db push --skip-generate
```

Ini akan:
- ✅ Create semua tables
- ✅ Create semua relations
- ✅ Create enums
- ✅ Siap untuk seed data

### Option B: Migrate (Production-grade)

```bash
cd server
npx prisma migrate deploy
```

Ini akan:
- ✅ Run semua migrations
- ✅ Create migration history
- ✅ Better untuk production

---

## 🌱 STEP 6: SEED DATA

### 6.1 Seed Database

```bash
cd server
npx prisma db seed
```

Ini akan create:
- ✅ Admin user
- ✅ Test users (Jakarta & Bali)
- ✅ Equipment
- ✅ Maintenance logs
- ✅ Consumables
- ✅ Sample data

### 6.2 Verify Seed

Test connection lagi:

```bash
npm run test:connection
```

Expected:
```
Test 3: Check Tables
✓ Found 21 tables:
  - Area
  - Consumable
  - ConsumableAdjustment
  - Equipment
  - ...

Test 4: Query User Table
✓ Found 3 users in database
```

---

## 📊 STEP 7: VERIFY DI PHPPGADMIN

### 7.1 Login phpPgAdmin

1. cPanel → **phpPgAdmin**
2. Select server: `PostgreSQL`
3. Login:
   - Username: `rappwebi_vaultuser`
   - Password: (your password)

### 7.2 Check Database

1. Click database: `rappwebi_vaultdb`
2. Click `public` schema
3. Check Tables:
   - Should see 21 tables
   - User, Equipment, Consumable, dll

### 7.3 Verify Data

Click table `User`:
- Should see 3 users
- admin@vaultclub.com
- operator1@vaultclub.com
- operator2@vaultclub.com

---

## 🚀 STEP 8: UPDATE ENV FOR DEPLOYMENT

### 8.1 Create `.env` di Server (Production)

Di DomaiNesia, via Terminal atau File Manager:

```bash
cd /home/rappwebi/vault-pulse-center/server
nano .env
```

Paste (ganti PASSWORD):

```env
DATABASE_URL="postgresql://rappwebi_vaultuser:YOUR_PASSWORD@localhost:5432/rappwebi_vaultdb"
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://rapp.web.id
JWT_SECRET=super-secret-key-change-this-to-random-32-chars-min
CORS_ORIGIN=https://rapp.web.id
```

Save: `Ctrl+O`, Enter, `Ctrl+X`

---

## ✅ CHECKLIST COMPLETION

- [ ] Database `rappwebi_vaultdb` created di cPanel
- [ ] User `rappwebi_vaultuser` created dengan password
- [ ] ALL privileges granted
- [ ] `.env.domainesia` updated dengan credentials
- [ ] `npm run test:connection` SUCCESS
- [ ] Schema migrated (`npx prisma db push`)
- [ ] Data seeded (`npx prisma db seed`)
- [ ] Verified di phpPgAdmin (21 tables, 3+ users)
- [ ] `.env` created di production server
- [ ] Ready for deployment! 🎉

---

## 🆘 TROUBLESHOOTING

### Problem: Connection timeout

**Solution:**
- Check firewall rules
- Verify host is `localhost` (not IP address)
- PostgreSQL service running

### Problem: Password authentication failed

**Solution:**
```bash
# Di cPanel, reset password user:
# 1. Go to PostgreSQL Databases
# 2. Current Users section
# 3. Click "Change Password" next to rappwebi_vaultuser
# 4. Generate new password
# 5. Update .env.domainesia
```

### Problem: Database does not exist

**Solution:**
```bash
# Verify database name:
# 1. Go to cPanel PostgreSQL Databases
# 2. Check "Current Databases" section
# 3. Full name should be: rappwebi_vaultdb
# 4. Update DATABASE_URL if different
```

### Problem: Permission denied

**Solution:**
```bash
# Grant permissions again:
# 1. cPanel → PostgreSQL Databases
# 2. Scroll to "Add User To Database"
# 3. Select user: rappwebi_vaultuser
# 4. Select database: rappwebi_vaultdb
# 5. Check ALL PRIVILEGES
# 6. Click "Make Changes"
```

---

## 📞 HELPFUL COMMANDS

```bash
# Test connection to DomaiNesia
npm run test:connection

# Export local database
npm run export:db

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Run migrations
npx prisma migrate deploy

# Seed database
npx prisma db seed

# Open Prisma Studio
npx prisma studio

# Reset database (DANGER!)
npx prisma migrate reset
```

---

## 🔗 REFERENSI

- **DomaiNesia Panduan**: https://www.domainesia.com/panduan/cara-export-dan-import-postgresql/
- **Prisma Docs**: https://www.prisma.io/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

---

**Status**: Ready untuk testing dan deployment! 🚀
