-- CreateEnum
CREATE TYPE "City" AS ENUM ('jakarta', 'bali');

-- CreateEnum
CREATE TYPE "ShiftType" AS ENUM ('day', 'night');

-- CreateEnum
CREATE TYPE "EquipmentArea" AS ENUM ('FOH', 'booth', 'stage', 'DJ_pit', 'LED_wall', 'dimmer_room', 'amp_rack', 'power');

-- CreateEnum
CREATE TYPE "EquipmentStatus" AS ENUM ('Ready', 'Degraded', 'OOS', 'In_Transit', 'Spare');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('Low', 'Med', 'High');

-- CreateEnum
CREATE TYPE "BriefStatus" AS ENUM ('Draft', 'Final');

-- CreateEnum
CREATE TYPE "MaintenanceType" AS ENUM ('Preventive', 'Corrective');

-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('Completed', 'In_Progress', 'Scheduled');

-- CreateEnum
CREATE TYPE "IncidentType" AS ENUM ('Audio', 'Lighting', 'Video', 'Power', 'Safety');

-- CreateEnum
CREATE TYPE "ProposalType" AS ENUM ('CapEx', 'OpEx');

-- CreateEnum
CREATE TYPE "ProposalUrgency" AS ENUM ('High', 'Medium', 'Low');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('Draft', 'Review', 'Approved', 'Ordered', 'Live');

-- CreateEnum
CREATE TYPE "RndPhase" AS ENUM ('Idea', 'POC', 'Pilot', 'Live');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('critical', 'warning', 'info');

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "area" "EquipmentArea" NOT NULL,
    "status" "EquipmentStatus" NOT NULL DEFAULT 'Ready',
    "lastInspection" TIMESTAMP(3) NOT NULL,
    "nextDue" TIMESTAMP(3) NOT NULL,
    "firmware" TEXT NOT NULL,
    "hoursUsed" INTEGER NOT NULL,
    "city" "City" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventBrief" (
    "id" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "setTimes" TEXT NOT NULL,
    "stagePlotLink" TEXT,
    "inputListLink" TEXT,
    "monitorNeeds" TEXT NOT NULL,
    "ljCueNotes" TEXT NOT NULL,
    "vjContentChecklist" TEXT NOT NULL,
    "timecodeRouting" TEXT NOT NULL,
    "sfxNotes" TEXT NOT NULL,
    "briefStatus" "BriefStatus" NOT NULL DEFAULT 'Draft',
    "riskLevel" "RiskLevel" NOT NULL DEFAULT 'Low',
    "city" "City" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventBrief_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrewMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "shift" "ShiftType" NOT NULL,
    "assigned" BOOLEAN NOT NULL DEFAULT false,
    "city" "City" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrewMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceLog" (
    "id" TEXT NOT NULL,
    "equipment" TEXT NOT NULL,
    "type" "MaintenanceType" NOT NULL,
    "issue" TEXT NOT NULL,
    "status" "MaintenanceStatus" NOT NULL DEFAULT 'Scheduled',
    "mttr" DOUBLE PRECISION,
    "cost" DOUBLE PRECISION NOT NULL,
    "parts" TEXT[],
    "date" TIMESTAMP(3) NOT NULL,
    "technician" TEXT NOT NULL,
    "city" "City" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaintenanceLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Incident" (
    "id" TEXT NOT NULL,
    "type" "IncidentType" NOT NULL,
    "description" TEXT NOT NULL,
    "rootCause" TEXT NOT NULL,
    "prevention" TEXT NOT NULL,
    "impact" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "city" "City" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "ProposalType" NOT NULL,
    "urgency" "ProposalUrgency" NOT NULL,
    "estimate" DOUBLE PRECISION NOT NULL,
    "roi" TEXT NOT NULL,
    "vendor" TEXT NOT NULL,
    "status" "ProposalStatus" NOT NULL DEFAULT 'Draft',
    "targetWeek" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "nextAction" TEXT NOT NULL,
    "quotes" INTEGER NOT NULL,
    "city" "City" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RndProject" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "phase" "RndPhase" NOT NULL DEFAULT 'Idea',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "risks" TEXT[],
    "dependencies" TEXT[],
    "lead" TEXT NOT NULL,
    "targetCompletion" TEXT NOT NULL,
    "budget" DOUBLE PRECISION NOT NULL,
    "city" "City" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RndProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consumable" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "currentStock" INTEGER NOT NULL,
    "weeklyUsage" INTEGER NOT NULL,
    "reorderPoint" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "lastOrdered" TIMESTAMP(3) NOT NULL,
    "city" "City" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Consumable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "type" "AlertType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledged" BOOLEAN NOT NULL DEFAULT false,
    "city" "City" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KPIMetrics" (
    "id" TEXT NOT NULL,
    "city" "City" NOT NULL,
    "nightsOpen" INTEGER NOT NULL,
    "equipmentUptimePercentage" DOUBLE PRECISION NOT NULL,
    "issuesRaised" INTEGER NOT NULL,
    "issuesResolved" INTEGER NOT NULL,
    "powerIncidents" INTEGER NOT NULL,
    "weekYear" INTEGER NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KPIMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Equipment_city_idx" ON "Equipment"("city");

-- CreateIndex
CREATE INDEX "Equipment_status_idx" ON "Equipment"("status");

-- CreateIndex
CREATE INDEX "EventBrief_city_idx" ON "EventBrief"("city");

-- CreateIndex
CREATE INDEX "EventBrief_date_idx" ON "EventBrief"("date");

-- CreateIndex
CREATE INDEX "CrewMember_city_idx" ON "CrewMember"("city");

-- CreateIndex
CREATE INDEX "CrewMember_shift_idx" ON "CrewMember"("shift");

-- CreateIndex
CREATE INDEX "MaintenanceLog_city_idx" ON "MaintenanceLog"("city");

-- CreateIndex
CREATE INDEX "MaintenanceLog_status_idx" ON "MaintenanceLog"("status");

-- CreateIndex
CREATE INDEX "Incident_city_idx" ON "Incident"("city");

-- CreateIndex
CREATE INDEX "Incident_date_idx" ON "Incident"("date");

-- CreateIndex
CREATE INDEX "Proposal_city_idx" ON "Proposal"("city");

-- CreateIndex
CREATE INDEX "Proposal_status_idx" ON "Proposal"("status");

-- CreateIndex
CREATE INDEX "RndProject_city_idx" ON "RndProject"("city");

-- CreateIndex
CREATE INDEX "RndProject_phase_idx" ON "RndProject"("phase");

-- CreateIndex
CREATE INDEX "Consumable_city_idx" ON "Consumable"("city");

-- CreateIndex
CREATE INDEX "Consumable_currentStock_idx" ON "Consumable"("currentStock");

-- CreateIndex
CREATE INDEX "Alert_city_idx" ON "Alert"("city");

-- CreateIndex
CREATE INDEX "Alert_acknowledged_idx" ON "Alert"("acknowledged");

-- CreateIndex
CREATE UNIQUE INDEX "KPIMetrics_city_key" ON "KPIMetrics"("city");

-- CreateIndex
CREATE INDEX "KPIMetrics_city_idx" ON "KPIMetrics"("city");

-- CreateIndex
CREATE INDEX "KPIMetrics_weekYear_weekNumber_idx" ON "KPIMetrics"("weekYear", "weekNumber");
