# Vault Tabs Components

This folder contains all tab components for the Vault Dashboard.

## Active Components (✅ Currently Used)

### EquipmentHealthTab-v2.tsx ✅
**Status:** ACTIVE - Used in production  
**Import:** `src/components/vault/VaultTabs.tsx`  
**Features:**
- Equipment listing with status badges
- Inspection recording (Inspector, Condition, Notes, Issues)
- Inspection logs viewer
- Equipment CRUD operations
- Area filtering
- Real-time WebSocket updates

### ShiftCoverageTab.tsx ✅
**Status:** ACTIVE  
**Features:**
- Shift scheduling and coverage
- Team assignment

### EventBriefsTab.tsx ✅
**Status:** ACTIVE  
**Features:**
- Event brief management
- PDF export with enhanced date format (FRIDAY, 5 DEC 2026)
- 7 new fields: Audio Order, Special Lighting Order, Visual Order, Timecode, Brand Moment, Live Set Recording, SFX Notes

### MaintenanceLogsTab.tsx ✅
**Status:** ACTIVE  
**Features:**
- Maintenance work orders
- MTTR tracking
- Historical chronological view
- Incident tracking

### ConsumablesTab.tsx ✅
**Status:** ACTIVE  
**Features:**
- Consumable inventory tracking
- Stock management

### SuppliersTab.tsx ✅
**Status:** ACTIVE  
**Features:**
- Supplier management
- Contact information

### AreasTab.tsx ✅
**Status:** ACTIVE  
**Features:**
- Area/location management
- City-based filtering

### ProposalsTab.tsx ✅
**Status:** ACTIVE  
**Features:**
- Project proposals
- Quote management
- Status tracking

### RnDTab.tsx ✅
**Status:** ACTIVE  
**Features:**
- R&D project tracking
- Innovation pipeline

## Deprecated Components (❌ NOT Used)

### EquipmentHealthTab.tsx ❌
**Status:** DEPRECATED - DO NOT USE  
**Reason:** Replaced by EquipmentHealthTab-v2.tsx  
**Action:** Can be safely deleted (kept temporarily for reference)

---

## Important Notes

1. **Always check VaultTabs.tsx** to see which components are actually imported
2. **v2 versions** typically indicate enhanced/refactored versions
3. **Do not edit deprecated files** - they are not in use
4. When adding new features to Equipment Health, edit **EquipmentHealthTab-v2.tsx**

## File Naming Convention

- `ComponentName.tsx` - Standard component
- `ComponentName-v2.tsx` - Enhanced/refactored version
- If both exist, **-v2 is the active one**

## Need to Update?

Check the import in `src/components/vault/VaultTabs.tsx` to confirm which version is active.
