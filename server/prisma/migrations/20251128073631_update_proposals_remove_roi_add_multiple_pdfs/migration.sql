/*
  Warnings:

  - You are about to drop the column `quotesPdf` on the `Proposal` table. All the data in the column will be lost.
  - You are about to drop the column `roi` on the `Proposal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Proposal" DROP COLUMN "quotesPdf",
DROP COLUMN "roi",
ADD COLUMN     "estimateApproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "estimateApprovedBy" TEXT,
ADD COLUMN     "quotesPdfs" TEXT[] DEFAULT ARRAY[]::TEXT[];
