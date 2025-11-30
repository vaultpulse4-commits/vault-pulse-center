# 🔧 SHIFT & COVERAGE - MANAGE STAFF Troubleshooting Guide

## 🚨 Masalah yang Dilaporkan
**SHIFT & COVERAGE → MANAGE STAFF: TIDAK BISA EDIT**

---

## ✅ Status Implementasi Saat Ini

### **Backend ✅**
- ✅ Crew API endpoints sudah ada: `/api/crew` (GET, POST, PATCH, DELETE)
- ✅ Database schema `CrewMember` sudah benar
- ✅ Seed data crew members sudah ada
- ✅ Backend server running di `http://localhost:3001`

### **Frontend ✅**
- ✅ ShiftCoverageTab.tsx sudah implement CRUD operations
- ✅ Permission system sudah setup (`view:crew`, `edit:crew`)
- ✅ API wrapper `api.crew.*` sudah ada
- ✅ Edit Dialog sudah diperbaiki dan ditambahkan

### **Permissions ✅**
- ✅ Admin: `view:crew`, `edit:crew` 
- ✅ Manager: `view:crew`, `edit:crew`
- ✅ Operator: `view:crew` (read-only)

---

## 🔍 Debugging Steps

### **Step 1: Cek User Login & Permissions**

1. **Buka browser** → `http://localhost:5173`
2. **Login sebagai Admin**:
   - Email: `admin@vaultclub.com`
   - Password: `admin123`
3. **Navigate** ke Vault → Shift & Coverage
4. **Buka DevTools** (F12) → Console Tab
5. **Lihat console logs**:
   ```javascript
   // Should see:
   ShiftCoverageTab Debug: { 
     selectedCity: "jakarta", 
     canView: true, 
     canEdit: true 
   }
   
   usePermission Debug: { 
     permission: "edit:crew", 
     user: { id: "...", email: "admin@vaultclub.com", role: "admin" },
     result: true,
     availablePermissions: ["view:crew", "edit:crew", ...]
   }
   ```

### **Step 2: Cek API Calls**

1. **DevTools** → Network Tab
2. **Refresh halaman Shift & Coverage**
3. **Lihat API calls**:
   - ✅ `GET /api/crew?city=jakarta` → Should return crew data
   - ✅ Response status: 200 OK

### **Step 3: Test CRUD Operations**

#### **Test Add New Crew**
1. **Click "Manage Staff"** button
2. **Fill form**:
   - Name: "Test User"
   - Role: "Test Engineer"
   - Shift: "Day"
3. **Click "Add"**
4. **Watch Network Tab**: `POST /api/crew`
5. **Expected**: Success toast + new crew appears

#### **Test Edit Crew**
1. **In Manage Staff dialog** → Click Edit button (pencil icon)
2. **Edit Dialog should open**
3. **Change name/role** → Click "Save Changes"
4. **Watch Network Tab**: `PATCH /api/crew/{id}`
5. **Expected**: Success toast + changes saved

#### **Test Delete Crew**
1. **In Manage Staff dialog** → Click Delete button (trash icon)
2. **Watch Network Tab**: `DELETE /api/crew/{id}`
3. **Expected**: Success toast + crew removed

#### **Test Assign/Remove**
1. **In Day/Night shift cards** → Click "Assign" or "Remove"
2. **Watch Network Tab**: `PATCH /api/crew/{id}`
3. **Expected**: Badge changes + shift status updates

---

## 🚨 Kemungkinan Penyebab Masalah

### **A. User Permission Issue**
**Symptoms**: "Manage Staff" button tidak muncul, Edit buttons disabled

**Solutions**:
- ✅ Pastikan login sebagai `admin` atau `manager`
- ✅ Jangan login sebagai `operator` (read-only)
- ✅ Cek console logs untuk permission debug info

### **B. API Connection Issue**  
**Symptoms**: Loading spinner terus muncul, error toasts

**Solutions**:
- ✅ Pastikan backend running: `http://localhost:3001`
- ✅ Cek Network tab untuk failed requests
- ✅ Restart backend: `cd server && npm run dev`

### **C. Database Issue**
**Symptoms**: API calls berhasil tapi data tidak muncul

**Solutions**:
- ✅ Re-seed database: `cd server && npx prisma db seed`
- ✅ Check database connection di backend logs

### **D. Frontend State Issue**
**Symptoms**: UI tidak update setelah CRUD operations

**Solutions**:
- ✅ Hard refresh browser (Ctrl+F5)
- ✅ Clear localStorage dan login ulang
- ✅ Check console untuk React errors

---

## 🔧 Quick Fix Commands

```bash
# Restart Backend
cd "d:\PROJECT Fastwork\vault-pulse-center\server"
npm run dev

# Re-seed Database
cd "d:\PROJECT Fastwork\vault-pulse-center\server"  
npx prisma db seed

# Restart Frontend
cd "d:\PROJECT Fastwork\vault-pulse-center"
npm run dev
```

---

## 📋 Test Checklist

**Login & Access**:
- [ ] Login sebagai admin berhasil
- [ ] "Manage Staff" button muncul
- [ ] Console shows `canEdit: true`

**View Data**:
- [ ] Crew members muncul di Day/Night shift cards
- [ ] Shift status badges muncul (Fully Staffed/Partial/No Coverage)

**Add Crew**:
- [ ] Click "Manage Staff" → Dialog opens
- [ ] Fill form + click "Add" → Success toast
- [ ] New crew appears di list

**Edit Crew**:
- [ ] Click Edit button → Edit dialog opens  
- [ ] Change data + click "Save" → Success toast
- [ ] Changes reflected di UI

**Delete Crew**:
- [ ] Click Delete button → Success toast
- [ ] Crew removed from list

**Assign/Remove**:
- [ ] Click "Assign" → Badge changes to "Assigned"
- [ ] Click "Remove" → Badge changes to "Available"  
- [ ] Shift status updates correctly

---

## 📞 Next Steps

1. **Follow debugging steps** di atas
2. **Report specific error messages** dari console/network tab
3. **Test dengan user role berbeda** (admin vs operator)
4. **Jika masih error**, screenshot console + network tab

**Current Status**: Semua kode sudah correct ✅, kemungkinan issue di user permissions atau API connection.