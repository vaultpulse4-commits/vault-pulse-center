-- AlterTable
ALTER TABLE "EventBrief" ADD COLUMN     "audioOrder" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "brandMoment" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "liveSetRecording" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "specialLightingOrder" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "visualOrder" TEXT NOT NULL DEFAULT '';
