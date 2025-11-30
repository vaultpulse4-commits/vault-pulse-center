/*
  Warnings:

  - You are about to drop the column `barcode` on the `Consumable` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `Consumable` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Consumable_sku_idx";

-- DropIndex
DROP INDEX "Consumable_sku_key";

-- AlterTable
ALTER TABLE "Consumable" DROP COLUMN "barcode",
DROP COLUMN "sku";
