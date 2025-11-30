# User Management & RBAC Testing Guide

## 🎯 Fitur yang Sudah Diimplementasi

### 1. ✅ Permission Matrix Page (`/permissions`)
- Visual matrix menampilkan semua permission untuk setiap role
- 3 role: Admin, Manager, Operator
- 8 kategori permission: Equipment, Events, Team, Maintenance, Proposals, R&D, Consumables, System
- Hanya bisa diakses oleh **Admin**

### 2. ✅ User Management Page (`/users`)
- List semua user dengan detail lengkap
- Create user baru dengan role dan city assignment
- Activate/Deactivate user
- Delete user
- Stats dashboard (total users, active, per role)
- Hanya bisa diakses oleh **Admin**

### 3. ✅ User Profile Page (`/profile`)
- View profile information (name, email, role, cities, last login)
- Edit nama
- Change password dengan validasi
- Bisa diakses oleh **semua authenticated users**

### 4. ✅ Navigation Menu
- Dropdown menu di header Index.tsx
- Menu items:
  - **My Profile** → `/profile` (semua user)
  - **User Management** → `/users` (admin only)
  - **Permission Matrix** → `/permissions` (admin only)

---

## 🧪 Panduan Testing

### Prerequisites
Pastikan kedua server running:
```bash
# Terminal 1 - Backend
cd server
npm run dev
# ✅ Server running on http://localhost:3001

# Terminal 2 - Frontend  
npm run dev
# ✅ Local: http://localhost:5173/
```

### Demo Accounts (Already Seeded)

| Role | Email | Password | City Access | Use Case |
|------|-------|----------|-------------|----------|
| Admin | admin@vaultclub.com | Admin123! | Jakarta, Bali | Full access to all features |
| Manager | manager.jakarta@vaultclub.com | Manager123! | Jakarta | City-specific management |
| Manager | manager.bali@vaultclub.com | Manager123! | Bali | City-specific management |
| Operator | operator@vaultclub.com | Operator123! | Jakarta, Bali | Read-only + incident reporting |

---

## Test Scenarios

### Test 1: Login & Authentication ✅
1. Buka http://localhost:5173
2. Klik "Quick Login: Admin" atau masukkan credentials manual
3. **Expected**: Redirect ke dashboard, header menampilkan nama + role badge
4. Klik dropdown menu di header (nama user)
5. **Expected**: Menu muncul dengan "My Profile", "User Management", "Permission Matrix" (untuk admin)

### Test 2: Permission Matrix (Admin Only) ✅
1. Login sebagai **Admin**
2. Klik dropdown → "Permission Matrix"
3. **Expected**: 
   - Halaman `/permissions` terbuka
   - 3 role summary cards: Admin, Manager, Operator
   - Tabel matrix dengan checkmark (✓) dan X (✗) untuk setiap permission
   - Total 50+ permissions ditampilkan
4. Logout → Login sebagai **Operator**
5. Coba akses `/permissions` langsung di URL
6. **Expected**: Redirect ke `/` (permission denied)

### Test 3: User Management - Create User (Admin Only) ✅
1. Login sebagai **Admin**
2. Klik dropdown → "User Management"
3. **Expected**: 
   - Halaman `/users` terbuka
   - Stats cards: Total Users (4), Active, Admins, Managers, Operators
   - Tabel menampilkan 4 seeded users
4. Klik tombol "Add User"
5. Isi form:
   - **Name**: Test User
   - **Email**: test@vaultclub.com
   - **Password**: Test123!
   - **Role**: Operator
   - **Cities**: Jakarta (toggle on)
6. Klik "Create User"
7. **Expected**: 
   - Toast notification "User created successfully"
   - Dialog tertutup
   - User baru muncul di tabel
   - Stats "Total Users" bertambah jadi 5

### Test 4: User Management - Activate/Deactivate ✅
1. Di halaman User Management
2. Pilih salah satu user (bukan current user sendiri)
3. Klik tombol "Deactivate"
4. **Expected**: 
   - Toast "User updated successfully"
   - Badge status berubah dari "Active" (green) ke "Inactive" (gray)
   - Stats "Active" berkurang 1
5. Klik tombol "Activate"
6. **Expected**: Status kembali "Active"

### Test 5: User Management - Delete User ✅
1. Di halaman User Management
2. Klik tombol delete (trash icon) pada user test yang baru dibuat
3. **Expected**: Alert dialog muncul dengan konfirmasi
4. Klik "Delete"
5. **Expected**: 
   - Toast "User deleted successfully"
   - User hilang dari tabel
   - Stats "Total Users" kembali ke 4
6. **Note**: Button delete untuk current user sendiri disabled

### Test 6: User Profile - View & Edit Name ✅
1. Login sebagai **Manager**
2. Klik dropdown → "My Profile"
3. **Expected**: 
   - Halaman `/profile` terbuka
   - Menampilkan: name, email, role badge (Manager), cities (Jakarta/Bali), last login
   - Section "Security Settings" dengan password
   - Account info: created date, user ID
4. Klik tombol "Edit" di samping nama
5. Ganti nama menjadi "Manager Jakarta Updated"
6. Klik "Save"
7. **Expected**: 
   - Toast "Name updated successfully"
   - Nama di profile berubah
   - Nama di header dropdown juga berubah (refresh user data)
8. Klik "Cancel" tanpa save
9. **Expected**: Kembali ke display mode tanpa perubahan

### Test 7: User Profile - Change Password ✅
1. Di halaman Profile
2. Scroll ke section "Security Settings"
3. Klik "Change Password"
4. **Expected**: Form expand dengan 3 input fields
5. Isi:
   - **Current Password**: Manager123!
   - **New Password**: Manager456!
   - **Confirm New Password**: Manager456!
6. Klik "Update Password"
7. **Expected**: 
   - Toast "Password changed successfully"
   - Form collapse kembali
8. Test password mismatch:
   - Isi New Password: Test123!
   - Isi Confirm: Test456! (berbeda)
   - **Expected**: Toast error "Passwords do not match"
9. Test password terlalu pendek:
   - New Password: Test1
   - **Expected**: Toast error "Password must be at least 8 characters"

### Test 8: RBAC - Access Control ✅
**Operator tidak bisa akses admin features:**
1. Logout → Login sebagai **Operator**
2. Klik dropdown menu
3. **Expected**: 
   - Hanya ada menu "My Profile"
   - TIDAK ADA "User Management" dan "Permission Matrix"
4. Coba akses langsung via URL: http://localhost:5173/users
5. **Expected**: Redirect ke `/` (Navigate component di UserManagement.tsx)
6. Coba akses: http://localhost:5173/permissions
7. **Expected**: Redirect ke `/` (Navigate component di PermissionMatrix.tsx)

**Manager juga tidak bisa akses admin features:**
1. Logout → Login sebagai **Manager**
2. Klik dropdown menu
3. **Expected**: Menu sama seperti Operator (hanya Profile)
4. Akses `/users` dan `/permissions`
5. **Expected**: Redirect ke `/`

### Test 9: Integration dengan Equipment Tab ✅
1. Login sebagai **Admin**
2. Di dashboard, buka tab "Equipment Health"
3. Klik "Add Equipment"
4. **Expected**: Form muncul (karena admin punya permission `create:equipment`)
5. Create equipment baru, Edit status, Delete
6. **Expected**: Semua operasi berhasil
7. Logout → Login sebagai **Operator**
8. Buka tab "Equipment Health"
9. **Expected**: 
   - Data equipment load dari API
   - TIDAK ADA button "Add Equipment"
   - Dropdown status disabled (read-only)
   - Tombol delete disabled/hidden
10. **Reason**: Operator tidak punya permission `edit:equipment` dan `delete:equipment`

### Test 10: Logout & Session ✅
1. Login sebagai Admin
2. Klik tombol "Logout" di header
3. **Expected**: 
   - Redirect ke `/login`
   - LocalStorage cleared
   - Access token dihapus
4. Coba akses `/` langsung
5. **Expected**: Redirect ke `/login` (ProtectedRoute)
6. Login lagi
7. **Expected**: Token baru di localStorage, user data restored

---

## 🐛 Known Issues & Future Improvements

### Backend TODO:
- [ ] Implement password change endpoint yang verify current password
- [ ] Add rate limiting untuk login attempts
- [ ] Add email verification untuk new users
- [ ] Add audit log untuk user management actions

### Frontend TODO:
- [ ] Add search/filter di User Management table
- [ ] Add pagination untuk user list (jika > 20 users)
- [ ] Add role filter chips di User Management
- [ ] Add export CSV untuk user list
- [ ] Add profile photo upload
- [ ] Add 2FA settings di profile

### Optimization:
- [ ] Connect remaining tabs (Event Briefs, Crew, Maintenance, dll) ke backend API
- [ ] Add loading skeleton di User Management table
- [ ] Add debounce untuk search input
- [ ] Add optimistic updates untuk user CRUD

---

## 📊 API Endpoints yang Digunakan

### Auth Endpoints:
```
POST   /api/auth/login          - Login user
POST   /api/auth/logout         - Logout user
POST   /api/auth/refresh        - Refresh access token
GET    /api/auth/me             - Get current user data
POST   /api/auth/register       - Create new user (admin only)
GET    /api/auth/users          - List all users (admin only)
PATCH  /api/auth/users/:id      - Update user (admin only)
DELETE /api/auth/users/:id      - Delete user (admin only)
```

### Protected Endpoints (Equipment Example):
```
GET    /api/equipment           - List equipment (requires auth)
POST   /api/equipment           - Create equipment (requires `create:equipment`)
PATCH  /api/equipment/:id       - Update equipment (requires `edit:equipment`)
DELETE /api/equipment/:id       - Delete equipment (requires `delete:equipment`)
```

---

## ✅ Success Criteria

Semua test scenarios di atas harus pass dengan hasil expected. Testing dianggap berhasil jika:

1. ✅ Admin bisa akses semua pages (`/`, `/profile`, `/users`, `/permissions`)
2. ✅ Manager & Operator hanya bisa akses `/` dan `/profile`
3. ✅ CRUD operations di User Management berfungsi sempurna
4. ✅ Profile update (name, password) berfungsi dengan validasi
5. ✅ Navigation menu conditional rendering sesuai role
6. ✅ Protected routes redirect ke `/` atau `/login` sesuai auth state
7. ✅ Equipment tab CRUD operations respect RBAC permissions
8. ✅ Logout clear session dan redirect ke login

---

## 🎉 Next Steps

Setelah testing selesai:
1. Connect remaining tabs (Event Briefs, Crew, Maintenance, Proposals, R&D, Consumables) ke backend API
2. Follow pattern dari `EquipmentHealthTab.tsx`:
   - Load data dengan `useEffect(() => { api.[module].getAll() })`
   - Add permission checks: `const canEdit = usePermission('edit:[module]')`
   - Conditional rendering untuk buttons/forms: `{canEdit && <Button>Add</Button>}`
3. Test RBAC untuk setiap tab
4. Implement remaining features dari TODO list
