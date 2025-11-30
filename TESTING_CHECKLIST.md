# 🧪 Testing Checklist - Vault Pulse Center

## Test Environment
- **Frontend**: http://localhost:5174
- **Backend**: http://localhost:3001
- **Date**: November 20, 2025

---

## ✅ Pre-Test Setup

### 1. Start Backend Server
```powershell
cd server
npm run dev
```
**Expected**: Backend running on port 3001

### 2. Start Frontend Server  
```powershell
npm run dev
```
**Expected**: Frontend running on port 5173 or 5174

### 3. Verify Backend Health
Open browser: http://localhost:3001/health
**Expected**: `{"status":"ok","timestamp":"..."}`

---

## 🔐 Authentication Tests

### Test 1: Login Page
1. Open http://localhost:5174
2. Should redirect to /login if not authenticated
3. **Expected**: Login form with email & password fields

### Test 2: Login with Admin
**Credentials**: 
- Email: `admin@vaultpulse.com`
- Password: `admin123`

**Expected**:
- ✅ Successful login
- ✅ Redirect to dashboard (/)
- ✅ JWT token stored in cookies
- ✅ User menu shows "Admin User"

### Test 3: Login with Different Roles
Test these accounts:
- **Manager**: `manager.jakarta@vaultpulse.com` / `manager123`
- **Operator**: `operator.jakarta@vaultpulse.com` / `operator123`

---

## 📊 Dashboard Tests (Index Page)

### Test 4: Dashboard Overview
1. Login as Admin
2. Navigate to main dashboard
3. **Expected**:
   - ✅ KPI Cards (4 cards: Uptime, Active Shows, Incidents, Efficiency)
   - ✅ Alerts Panel (right side)
   - ✅ Equipment Status cards
   - ✅ Event Timeline
   - ✅ Quick Actions buttons
   - ✅ Team Metrics

### Test 5: City Toggle
1. Click city selector (Jakarta/Bali)
2. Switch between cities
3. **Expected**:
   - ✅ All data updates per city
   - ✅ KPIs reflect city-specific data
   - ✅ Alerts filtered by city

---

## 🗂️ Vault Tabs Tests

### Test 6: Event Briefs Tab
**Permission Required**: `view:events`, `edit:events`

**Test Steps**:
1. Click "VAULT" in sidebar
2. Select "Event Briefs" tab
3. **Test Loading State**: Should show spinner while loading
4. **Test Empty State**: If no data, shows "Create First Brief" button
5. **Test Create Brief** (Admin/Manager only):
   - Click "+ New Brief"
   - Fill form: Artist Name, Show Date, Technical Requirements
   - Click "Create Brief"
   - **Expected**: Success toast, brief appears in list
6. **Test Edit Brief** (Admin/Manager only):
   - Click "Edit" on existing brief
   - Modify fields
   - Click "Save Changes"
   - **Expected**: Success toast, changes reflected
7. **Test Lock/Unlock**:
   - Click "Lock Brief" button
   - **Expected**: Status changes to "Locked"
8. **Test Delete Brief** (Admin/Manager only):
   - Click "Delete" button
   - **Expected**: Confirmation, brief removed

**Operator Test**: Login as operator
- **Expected**: Can VIEW only, no edit/create/delete buttons

---

### Test 7: Shift Coverage Tab
**Permission Required**: `view:crew`, `edit:crew`

**Test Steps**:
1. Select "Shift Coverage" tab
2. **Test Day/Night Tabs**: Switch between shifts
3. **Test Coverage Metrics**:
   - ✅ Total Crew count
   - ✅ Day Shift assigned count
   - ✅ Night Shift assigned count
   - ✅ Available crew count
4. **Test Assign Crew** (Admin/Manager only):
   - Click "Assign to Shift" on unassigned crew
   - **Expected**: Crew moves to assigned section
5. **Test Remove from Shift** (Admin/Manager only):
   - Click "Remove from Shift"
   - **Expected**: Crew moves to available section
6. **Test Add New Crew** (Admin/Manager only):
   - Click "+ Add Crew Member"
   - Fill form: Name, Role, Shift
   - **Expected**: New crew member appears

---

### Test 8: Maintenance Logs Tab
**Permission Required**: `view:maintenance`, `edit:maintenance`, `view:incidents`, `create:incidents`

**Test Steps**:
1. Select "Maintenance Logs" tab
2. **Test KPI Cards**:
   - ✅ Open Work Orders
   - ✅ Completed This Week
   - ✅ Incidents Reported
   - ✅ Avg Resolution Time
3. **Test Work Orders Sub-tab**:
   - View work orders list
   - Click "Create Work Order"
   - Fill equipment, description, priority
   - **Expected**: WO created successfully
4. **Test Incidents Sub-tab**:
   - Switch to "Incidents" tab
   - Click "Report Incident"
   - Fill incident details, severity
   - **Expected**: Incident created
5. **Test Complete Work Order**:
   - Click "Complete" on pending WO
   - **Expected**: Status changes to "Completed"

---

### Test 9: Proposals Tab
**Permission Required**: `view:proposals`, `edit:proposals`, `approve:proposals`

**Test Steps**:
1. Select "Proposals" tab
2. **Test Summary Metrics**:
   - ✅ Total Pending (IDR)
   - ✅ Approved Count
   - ✅ Review Count
   - ✅ Draft Count
3. **Test Create Proposal** (Admin/Manager only):
   - Click "+ New Proposal"
   - Fill: Title, Type (CapEx/OpEx), Amount, Description
   - **Expected**: Proposal created in "Draft" status
4. **Test Approval Workflow**:
   - **Draft → Review**: Click "Submit for Review"
   - **Review → Approved** (Admin only): Click "Approve Proposal"
   - **Approved → Ordered**: Click "Mark Ordered"
   - **Ordered → Live**: Click "Mark Live"
   - **Expected**: Status progresses through workflow
5. **Test Permission Checks**:
   - Login as Manager: Can create, edit, submit
   - Login as Admin: Can approve proposals
   - Login as Operator: View only, no actions

---

### Test 10: R&D Tab
**Permission Required**: `view:rnd`, `edit:rnd`

**Test Steps**:
1. Select "R&D" tab
2. **Test Phase Summary**:
   - ✅ Idea Count
   - ✅ POC Count
   - ✅ Pilot Count
   - ✅ Live Count
3. **Test Create Project** (Admin/Manager only):
   - Click "+ New Project"
   - Fill: Title, Description, Lead, Budget, Target Date
   - **Expected**: Project created in "Idea" phase
4. **Test Phase Progression**:
   - Change phase dropdown: Idea → POC → Pilot → Live
   - **Expected**: Phase changes, summary updates
5. **Test Progress Updates**:
   - Click "+10% Progress" button
   - **Expected**: Progress bar increases
6. **Test Milestones**:
   - If project has milestones, check/uncheck completion
   - **Expected**: Milestone status toggles
7. **Test Edit Project**:
   - Click "Edit" button
   - Modify project details
   - **Expected**: Changes saved successfully

---

### Test 11: Consumables Tab
**Permission Required**: `view:consumables`, `edit:consumables`

**Test Steps**:
1. Select "Consumables" tab
2. **Test Summary Metrics**:
   - ✅ Critical Stock (items ≤ reorder point)
   - ✅ Low Stock (items ≤ 1.5x reorder point)
   - ✅ Total Items
   - ✅ Orders Placed
3. **Test Add Consumable** (Admin/Manager only):
   - Click "+ Add Consumable"
   - Fill: Name (e.g., "CO₂ Cartridges"), Category, Stock, Weekly Usage, Reorder Point, Unit, Supplier
   - **Expected**: Consumable added to inventory
4. **Test Update Stock** (Admin/Manager only):
   - Edit current stock inline
   - **Expected**: Stock value updates in real-time
5. **Test Stock Alerts**:
   - Find item with stock ≤ reorder point
   - **Expected**: Shows "Reorder Now" badge with red color
   - **Expected**: Shows blinking "Place Order" button
6. **Test Place Order**:
   - Click "Place Order" button
   - **Expected**: Order status changes to "Ordered"
   - **Expected**: Last Ordered date updates
7. **Test Order Status Workflow**:
   - Change status dropdown: Pending → Ordered → Delivered
   - **Expected**: Status badge updates accordingly

---

### Test 12: Team Performance Tab
**Permission Required**: `view:crew`, `edit:crew`

**Test Steps**:
1. Select "Team Performance" tab
2. **Test Performance Metrics**:
   - ✅ Attendance % (calculated from crew data)
   - ✅ Completed Checklists %
   - ✅ Handover Quality (1-5)
   - ✅ Safety Compliance %
   - ✅ Training Progress %
   - ✅ Commendations count
3. **Test Team Members List**:
   - View all crew members with roles and shifts
   - **Expected**: Shows crew count in header
   - **Expected**: Each member shows Active/Standby badge
4. **Test Training Matrix**:
   - View 10 skills with progress bars
   - **Expected**: Required skills have "Required" badge
   - **Expected**: Progress color-coded (green ≥80%, yellow ≥60%, red <60%)
5. **Test Edit Metrics** (Admin/Manager only):
   - Click "Edit Metrics"
   - Modify performance values
   - **Expected**: Metrics update immediately
6. **Test Attendance Calculation**:
   - Add/remove crew from shifts in Shift Coverage tab
   - Return to Team Performance
   - **Expected**: Attendance % recalculates automatically

---

## 🔒 RBAC (Role-Based Access Control) Tests

### Test 13: Admin Role Permissions
Login as: `admin@vaultpulse.com`

**Expected Permissions**:
- ✅ View ALL tabs
- ✅ Edit ALL tabs
- ✅ Approve proposals
- ✅ Access User Management (/users)
- ✅ Access Permission Matrix (/permissions)
- ✅ Create/Edit/Delete all resources

### Test 14: Manager Role Permissions
Login as: `manager.jakarta@vaultpulse.com`

**Expected Permissions**:
- ✅ View ALL tabs (for assigned cities)
- ✅ Edit most tabs
- ✅ Submit proposals (cannot approve)
- ❌ NO access to User Management
- ❌ NO access to Permission Matrix
- ✅ Can create/edit crew, events, maintenance, R&D, consumables

### Test 15: Operator Role Permissions
Login as: `operator.jakarta@vaultpulse.com`

**Expected Permissions**:
- ✅ View-only for most tabs
- ❌ NO edit buttons visible
- ❌ NO create buttons visible
- ❌ NO delete buttons visible
- ❌ NO access to User Management
- ❌ NO access to Permission Matrix
- ✅ Can view dashboard, KPIs, alerts
- ✅ Can view crew shifts (but cannot modify)

---

## 🚀 Performance Tests

### Test 16: Loading States
1. Clear browser cache (Ctrl+Shift+Delete)
2. Reload page
3. Navigate between tabs quickly
4. **Expected**:
   - ✅ Loading spinners appear during data fetch
   - ✅ No "white screen of death"
   - ✅ Smooth transitions between tabs

### Test 17: Error Handling
1. Stop backend server temporarily
2. Try to create/edit resources
3. **Expected**:
   - ✅ Error toast notifications appear
   - ✅ User-friendly error messages
   - ✅ No console errors breaking UI

### Test 18: Empty States
1. Select a city with no data (e.g., switch to Bali if Jakarta has data)
2. Navigate through tabs
3. **Expected**:
   - ✅ Each tab shows friendly empty state
   - ✅ "Create First..." buttons available (if user has edit permission)
   - ✅ No crashes or blank screens

---

## 📱 PWA Tests

### Test 19: PWA Installation
1. Open Chrome/Edge
2. Click address bar install icon (⊕)
3. Click "Install"
4. **Expected**:
   - ✅ App installs as standalone window
   - ✅ App icon appears on desktop/start menu

### Test 20: Offline Functionality
1. Install PWA
2. Open DevTools → Application → Service Workers
3. Check "Offline" checkbox
4. Reload app
5. **Expected**:
   - ✅ App loads offline.html fallback
   - ✅ Shows "You're offline" message
   - ✅ No critical errors

### Test 21: Service Worker Caching
1. Open DevTools → Application → Cache Storage
2. Check "workbox-precache" cache
3. **Expected**:
   - ✅ Static assets cached (JS, CSS, images)
   - ✅ index.html cached

---

## 🎯 End-to-End Workflow Tests

### Test 22: Complete Event Management Flow
1. **Create Event Brief** (as Manager)
   - Add new artist event
   - Fill technical requirements
2. **Assign Crew** (Shift Coverage tab)
   - Assign crew to event day/night shift
3. **Create Maintenance Check** (Maintenance Logs tab)
   - Pre-event equipment check
   - Complete work order
4. **Check Consumables** (Consumables tab)
   - Verify CO₂, fog fluid stock
   - Place orders if needed
5. **View Team Performance**
   - Check crew attendance
   - Verify training completion
6. **Monitor Dashboard**
   - Check KPIs updated
   - Review alerts

**Expected**: Complete workflow without errors

### Test 23: Proposal Approval Flow
1. **Create Proposal** (as Manager)
   - CapEx proposal for new equipment
   - Amount: 50M IDR
2. **Submit for Review**
   - Status: Draft → Review
3. **Logout & Login as Admin**
4. **Approve Proposal**
   - Status: Review → Approved
5. **Mark as Ordered**
   - Status: Approved → Ordered
6. **Mark as Live**
   - Status: Ordered → Live
7. **Verify Summary Metrics**
   - Approved count increases
   - Total pending updates

**Expected**: Full approval workflow completes successfully

---

## ✅ Testing Summary

### Pass Criteria
- [ ] All authentication tests pass
- [ ] All 8 Vault tabs load without errors
- [ ] CRUD operations work for all tabs
- [ ] RBAC permissions enforced correctly
- [ ] Loading/error/empty states display properly
- [ ] PWA installs and works offline
- [ ] End-to-end workflows complete successfully

### Known Issues
_(Document any issues found during testing)_

---

## 🛠️ Troubleshooting

### Backend Not Starting
```powershell
cd server
npm install
npm run dev
```

### Frontend Port Conflict
If port 5173 is in use, Vite will auto-select 5174

### Database Connection Error
```powershell
cd server
npx prisma generate
npx prisma db push
npm run seed
```

### Clear Browser Cache
Ctrl+Shift+Delete → Clear all data

---

**Testing Date**: _________________
**Tested By**: _________________
**Overall Status**: ⬜ Pass  ⬜ Fail  ⬜ Partial
