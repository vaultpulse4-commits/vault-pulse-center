/*
  Warnings:

  - You are about to drop the column `technician` on the `MaintenanceLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MaintenanceLog" DROP COLUMN "technician",
ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "notes" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "technicianId" TEXT;

-- CreateIndex
CREATE INDEX "MaintenanceLog_technicianId_idx" ON "MaintenanceLog"("technicianId");

-- AddForeignKey
ALTER TABLE "MaintenanceLog" ADD CONSTRAINT "MaintenanceLog_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "CrewMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;
