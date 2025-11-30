/*
  Warnings:

  - You are about to drop the column `description` on the `MaintenanceLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MaintenanceLog" DROP COLUMN "description",
ADD COLUMN     "photo" TEXT NOT NULL DEFAULT '';
