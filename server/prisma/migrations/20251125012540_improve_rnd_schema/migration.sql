/*
  Warnings:

  - You are about to drop the column `targetCompletion` on the `RndProject` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RndStatus" AS ENUM ('Active', 'OnHold', 'Completed', 'Archived');

-- AlterTable
ALTER TABLE "RndProject" DROP COLUMN "targetCompletion",
ADD COLUMN     "actualCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "actualLiveDate" TIMESTAMP(3),
ADD COLUMN     "milestones" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "notes" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "status" "RndStatus" NOT NULL DEFAULT 'Active',
ADD COLUMN     "targetDate" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "RndProject_status_idx" ON "RndProject"("status");
