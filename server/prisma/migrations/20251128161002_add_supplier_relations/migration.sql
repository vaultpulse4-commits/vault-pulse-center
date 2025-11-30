-- AlterTable
ALTER TABLE "Consumable" ADD COLUMN     "supplierId" TEXT;

-- AlterTable
ALTER TABLE "MaintenanceLog" ADD COLUMN     "supplierId" TEXT;

-- AlterTable
ALTER TABLE "Proposal" ADD COLUMN     "supplierId" TEXT,
ALTER COLUMN "vendor" SET DEFAULT '';

-- CreateIndex
CREATE INDEX "Consumable_supplierId_idx" ON "Consumable"("supplierId");

-- CreateIndex
CREATE INDEX "MaintenanceLog_supplierId_idx" ON "MaintenanceLog"("supplierId");

-- CreateIndex
CREATE INDEX "Proposal_supplierId_idx" ON "Proposal"("supplierId");

-- AddForeignKey
ALTER TABLE "MaintenanceLog" ADD CONSTRAINT "MaintenanceLog_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consumable" ADD CONSTRAINT "Consumable_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
