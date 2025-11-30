/*
  Warnings:

  - You are about to drop the column `lastOrdered` on the `Consumable` table. All the data in the column will be lost.
  - You are about to drop the column `supplier` on the `Consumable` table. All the data in the column will be lost.
  - You are about to drop the column `weeklyUsage` on the `Consumable` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sku]` on the table `Consumable` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "PurchaseOrderStatus" AS ENUM ('Draft', 'Submitted', 'Approved', 'Ordered', 'PartiallyReceived', 'Received', 'Cancelled');

-- CreateEnum
CREATE TYPE "StockMovementType" AS ENUM ('Purchase', 'Usage', 'Adjustment', 'Return', 'Transfer', 'Waste');

-- CreateEnum
CREATE TYPE "SupplierStatus" AS ENUM ('Active', 'Inactive', 'Suspended');

-- AlterTable
ALTER TABLE "Consumable" DROP COLUMN "lastOrdered",
DROP COLUMN "supplier",
DROP COLUMN "weeklyUsage",
ADD COLUMN     "barcode" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "maxStock" INTEGER,
ADD COLUMN     "minStock" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "reorderQty" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sku" TEXT,
ADD COLUMN     "unitCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "currentStock" SET DEFAULT 0,
ALTER COLUMN "currentStock" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "reorderPoint" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "contactPerson" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "city" "City" NOT NULL,
    "taxId" TEXT,
    "paymentTerms" INTEGER NOT NULL DEFAULT 30,
    "rating" DOUBLE PRECISION DEFAULT 0,
    "status" "SupplierStatus" NOT NULL DEFAULT 'Active',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseOrder" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expectedDate" TIMESTAMP(3),
    "receivedDate" TIMESTAMP(3),
    "status" "PurchaseOrderStatus" NOT NULL DEFAULT 'Draft',
    "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "city" "City" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseOrderItem" (
    "id" TEXT NOT NULL,
    "purchaseOrderId" TEXT NOT NULL,
    "consumableId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "receivedQty" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockMovement" (
    "id" TEXT NOT NULL,
    "consumableId" TEXT NOT NULL,
    "type" "StockMovementType" NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "balanceBefore" DOUBLE PRECISION NOT NULL,
    "balanceAfter" DOUBLE PRECISION NOT NULL,
    "unitCost" DOUBLE PRECISION,
    "totalCost" DOUBLE PRECISION,
    "reference" TEXT,
    "notes" TEXT,
    "performedBy" TEXT,
    "city" "City" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockMovement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_code_key" ON "Supplier"("code");

-- CreateIndex
CREATE INDEX "Supplier_city_idx" ON "Supplier"("city");

-- CreateIndex
CREATE INDEX "Supplier_status_idx" ON "Supplier"("status");

-- CreateIndex
CREATE INDEX "Supplier_code_idx" ON "Supplier"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseOrder_orderNumber_key" ON "PurchaseOrder"("orderNumber");

-- CreateIndex
CREATE INDEX "PurchaseOrder_city_idx" ON "PurchaseOrder"("city");

-- CreateIndex
CREATE INDEX "PurchaseOrder_supplierId_idx" ON "PurchaseOrder"("supplierId");

-- CreateIndex
CREATE INDEX "PurchaseOrder_status_idx" ON "PurchaseOrder"("status");

-- CreateIndex
CREATE INDEX "PurchaseOrder_orderNumber_idx" ON "PurchaseOrder"("orderNumber");

-- CreateIndex
CREATE INDEX "PurchaseOrderItem_purchaseOrderId_idx" ON "PurchaseOrderItem"("purchaseOrderId");

-- CreateIndex
CREATE INDEX "PurchaseOrderItem_consumableId_idx" ON "PurchaseOrderItem"("consumableId");

-- CreateIndex
CREATE INDEX "StockMovement_consumableId_idx" ON "StockMovement"("consumableId");

-- CreateIndex
CREATE INDEX "StockMovement_city_idx" ON "StockMovement"("city");

-- CreateIndex
CREATE INDEX "StockMovement_type_idx" ON "StockMovement"("type");

-- CreateIndex
CREATE INDEX "StockMovement_createdAt_idx" ON "StockMovement"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Consumable_sku_key" ON "Consumable"("sku");

-- CreateIndex
CREATE INDEX "Consumable_category_idx" ON "Consumable"("category");

-- CreateIndex
CREATE INDEX "Consumable_sku_idx" ON "Consumable"("sku");

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderItem" ADD CONSTRAINT "PurchaseOrderItem_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderItem" ADD CONSTRAINT "PurchaseOrderItem_consumableId_fkey" FOREIGN KEY ("consumableId") REFERENCES "Consumable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_consumableId_fkey" FOREIGN KEY ("consumableId") REFERENCES "Consumable"("id") ON DELETE CASCADE ON UPDATE CASCADE;
