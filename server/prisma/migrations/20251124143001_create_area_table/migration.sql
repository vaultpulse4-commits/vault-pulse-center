/*
  Warnings:

  - You are about to drop the `EquipmentArea` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EquipmentArea" DROP CONSTRAINT "EquipmentArea_equipmentId_fkey";

-- AlterTable
ALTER TABLE "Equipment" ADD COLUMN     "areaId" TEXT;

-- DropTable
DROP TABLE "EquipmentArea";

-- CreateTable
CREATE TABLE "Area" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "city" "City",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Area_name_key" ON "Area"("name");

-- CreateIndex
CREATE INDEX "Area_isActive_idx" ON "Area"("isActive");

-- CreateIndex
CREATE INDEX "Area_city_idx" ON "Area"("city");

-- CreateIndex
CREATE INDEX "Equipment_areaId_idx" ON "Equipment"("areaId");

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE SET NULL ON UPDATE CASCADE;
