-- AlterTable
ALTER TABLE "Proposal" ADD COLUMN     "proposalPlanFiles" TEXT[] DEFAULT ARRAY[]::TEXT[];
