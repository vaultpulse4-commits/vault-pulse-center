# 🗄️ PostgreSQL Database Setup

## 📋 Database Information

```
Database Name: vault_pulse_db
Username: postgres
Password: 123456
Host: localhost
Port: 5432
```

## 🔧 Setup Instructions

### Option 1: Using pgAdmin (GUI)

1. **Open pgAdmin**
2. **Create User:**
   - Right-click on "Login/Group Roles" → Create → Login/Group Role
   - Name: `vault_admin`
   - Password tab: `VaultPulse2025!Secure`
   - Privileges tab: Check "Can login"
   - Save

3. **Create Database:**
   - Right-click on "Databases" → Create → Database
   - Database: `vault_pulse_db`
   - Owner: `vault_admin`
   - Save

### Option 2: Using psql (Command Line)

```powershell
# 1. Connect to PostgreSQL as superuser
psql -U postgres

# 2. Run these SQL commands:
```

```sql
-- Create user
CREATE USER vault_admin WITH PASSWORD 'VaultPulse2025!Secure';

-- Create database
CREATE DATABASE vault_pulse_db WITH OWNER vault_admin;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE vault_pulse_db TO vault_admin;

-- Connect to the database
\c vault_pulse_db

-- Grant schema privileges (PostgreSQL 15+)
GRANT ALL ON SCHEMA public TO vault_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO vault_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO vault_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO vault_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO vault_admin;

-- Exit
\q
```

### Option 3: Using SQL Shell

1. Open **SQL Shell (psql)** dari Start Menu
2. Login sebagai `postgres` user
3. Copy-paste SQL commands di atas

## ✅ Verify Connection

Test koneksi database:

```powershell
# Test connection
psql -U vault_admin -d vault_pulse_db -h localhost

# Should connect successfully
# Type \q to exit
```

## 🚀 After Database Created

Setelah database dibuat, jalankan migrations:

```powershell
# 1. Navigate to server folder
cd server

# 2. Install dependencies (if not yet)
npm install

# 3. Generate Prisma Client
npm run prisma:generate

# 4. Run migrations (create tables)
npm run prisma:migrate

# 5. Seed sample data (optional)
npm run prisma:seed
```

## 🔍 View Database

**Using Prisma Studio:**
```powershell
cd server
npm run prisma:studio
```
Opens: http://localhost:5555

**Using pgAdmin:**
- Connect to `vault_pulse_db` database
- Browse tables under `public` schema

## 🐛 Troubleshooting

### Connection refused
```powershell
# Check if PostgreSQL is running
# Windows Services → PostgreSQL → Start

# Or check status
pg_isready -h localhost -p 5432
```

### Permission denied
```sql
-- Reconnect as postgres and grant permissions
GRANT ALL PRIVILEGES ON DATABASE vault_pulse_db TO vault_admin;
```

### Cannot create tables
```sql
-- Grant schema permissions
\c vault_pulse_db
GRANT ALL ON SCHEMA public TO vault_admin;
```

### Wrong password
- Check .env file: `server/.env`
- Verify DATABASE_URL matches your credentials

## 📝 Connection String Format

```
postgresql://[USERNAME]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]?schema=public
```

**Current connection string:**
```
postgresql://postgres:123456@localhost:5432/vault_pulse_db?schema=public
```

## 🔐 Security Notes

- Password sudah di `.env` file
- `.env` file di-ignore oleh git (aman)
- Untuk production, gunakan password yang lebih kuat
- Jangan commit `.env` ke repository

## 💡 Tips

- Gunakan Prisma Studio untuk view data dengan mudah
- Backup database: `pg_dump -U vault_admin vault_pulse_db > backup.sql`
- Restore database: `psql -U vault_admin vault_pulse_db < backup.sql`
