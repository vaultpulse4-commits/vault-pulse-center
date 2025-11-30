/*
  Warnings:

  - You are about to drop the column `quotes` on the `Proposal` table. All the data in the column will be lost.
  - You are about to drop the column `targetWeek` on the `Proposal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Proposal" DROP COLUMN "quotes",
DROP COLUMN "targetWeek",
ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "quotesCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "quotesPdf" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "targetDate" TIMESTAMP(3),
ALTER COLUMN "nextAction" SET DEFAULT '';
