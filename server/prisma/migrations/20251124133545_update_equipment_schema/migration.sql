/*
  Warnings:

  - You are about to drop the column `area` on the `Equipment` table. All the data in the column will be lost.
  - You are about to drop the column `hoursUsed` on the `Equipment` table. All the data in the column will be lost.
  - You are about to drop the column `equipment` on the `MaintenanceLog` table. All the data in the column will be lost.

*/

-- Step 1: Create temporary table to store area data
CREATE TEMP TABLE temp_equipment_areas AS
SELECT id, area::text as area_name
FROM "Equipment"
WHERE area IS NOT NULL;

-- Step 2: Add new columns first
ALTER TABLE "Equipment" 
ADD COLUMN "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN "photo" TEXT;

-- Step 3: Drop the area column and enum (order matters!)
ALTER TABLE "Equipment" DROP COLUMN "area";
DROP TYPE "EquipmentArea";

-- Step 4: Add equipmentId to MaintenanceLog (nullable for now)
ALTER TABLE "MaintenanceLog" 
ADD COLUMN "equipmentId" TEXT;

-- Step 5: Create new tables (now safe since enum is gone)
CREATE TABLE "EquipmentArea" (
    "id" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "areaName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EquipmentArea_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EquipmentInspection" (
    "id" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "inspector" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "issues" TEXT[],
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EquipmentInspection_pkey" PRIMARY KEY ("id")
);

-- Step 6: Migrate existing area data from temp table to EquipmentArea table
INSERT INTO "EquipmentArea" ("id", "equipmentId", "areaName", "createdAt")
SELECT gen_random_uuid(), id, area_name, NOW()
FROM temp_equipment_areas;

-- Step 7: Try to match MaintenanceLog equipment names to Equipment IDs
UPDATE "MaintenanceLog" ml
SET "equipmentId" = e.id
FROM "Equipment" e
WHERE ml.equipment = e.name;

-- Step 8: Drop old equipment column from MaintenanceLog
ALTER TABLE "MaintenanceLog" DROP COLUMN "equipment";

-- Step 9: Drop hoursUsed column
ALTER TABLE "Equipment" DROP COLUMN "hoursUsed";

-- Step 10: Create indexes
CREATE INDEX "EquipmentArea_equipmentId_idx" ON "EquipmentArea"("equipmentId");
CREATE INDEX "EquipmentInspection_equipmentId_idx" ON "EquipmentInspection"("equipmentId");
CREATE INDEX "EquipmentInspection_date_idx" ON "EquipmentInspection"("date");
CREATE INDEX "MaintenanceLog_equipmentId_idx" ON "MaintenanceLog"("equipmentId");

-- Step 11: Add foreign keys
ALTER TABLE "EquipmentArea" ADD CONSTRAINT "EquipmentArea_equipmentId_fkey" 
FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "EquipmentInspection" ADD CONSTRAINT "EquipmentInspection_equipmentId_fkey" 
FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MaintenanceLog" ADD CONSTRAINT "MaintenanceLog_equipmentId_fkey" 
FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
