/*
 Navicat Premium Data Transfer

 Source Server         : VAULT-PULSE-RAILWAY
 Source Server Type    : PostgreSQL
 Source Server Version : 170007 (170007)
 Source Host           : interchange.proxy.rlwy.net:17998
 Source Catalog        : railway
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 170007 (170007)
 File Encoding         : 65001

 Date: 03/12/2025 23:40:32
*/


-- ----------------------------
-- Type structure for AlertType
-- ----------------------------
DROP TYPE IF EXISTS "public"."AlertType";
CREATE TYPE "public"."AlertType" AS ENUM (
  'critical',
  'warning',
  'info'
);
ALTER TYPE "public"."AlertType" OWNER TO "postgres";

-- ----------------------------
-- Type structure for BriefStatus
-- ----------------------------
DROP TYPE IF EXISTS "public"."BriefStatus";
CREATE TYPE "public"."BriefStatus" AS ENUM (
  'Draft',
  'Final'
);
ALTER TYPE "public"."BriefStatus" OWNER TO "postgres";

-- ----------------------------
-- Type structure for City
-- ----------------------------
DROP TYPE IF EXISTS "public"."City";
CREATE TYPE "public"."City" AS ENUM (
  'jakarta',
  'bali'
);
ALTER TYPE "public"."City" OWNER TO "postgres";

-- ----------------------------
-- Type structure for EquipmentStatus
-- ----------------------------
DROP TYPE IF EXISTS "public"."EquipmentStatus";
CREATE TYPE "public"."EquipmentStatus" AS ENUM (
  'Ready',
  'Degraded',
  'OOS',
  'In_Transit',
  'Spare'
);
ALTER TYPE "public"."EquipmentStatus" OWNER TO "postgres";

-- ----------------------------
-- Type structure for IncidentType
-- ----------------------------
DROP TYPE IF EXISTS "public"."IncidentType";
CREATE TYPE "public"."IncidentType" AS ENUM (
  'Audio',
  'Lighting',
  'Video',
  'Power',
  'Safety'
);
ALTER TYPE "public"."IncidentType" OWNER TO "postgres";

-- ----------------------------
-- Type structure for MaintenanceStatus
-- ----------------------------
DROP TYPE IF EXISTS "public"."MaintenanceStatus";
CREATE TYPE "public"."MaintenanceStatus" AS ENUM (
  'Completed',
  'In_Progress',
  'Scheduled'
);
ALTER TYPE "public"."MaintenanceStatus" OWNER TO "postgres";

-- ----------------------------
-- Type structure for MaintenanceType
-- ----------------------------
DROP TYPE IF EXISTS "public"."MaintenanceType";
CREATE TYPE "public"."MaintenanceType" AS ENUM (
  'Preventive',
  'Corrective'
);
ALTER TYPE "public"."MaintenanceType" OWNER TO "postgres";

-- ----------------------------
-- Type structure for NotificationCategory
-- ----------------------------
DROP TYPE IF EXISTS "public"."NotificationCategory";
CREATE TYPE "public"."NotificationCategory" AS ENUM (
  'EQUIPMENT',
  'MAINTENANCE',
  'INVENTORY',
  'EVENT',
  'SYSTEM',
  'APPROVAL'
);
ALTER TYPE "public"."NotificationCategory" OWNER TO "postgres";

-- ----------------------------
-- Type structure for NotificationType
-- ----------------------------
DROP TYPE IF EXISTS "public"."NotificationType";
CREATE TYPE "public"."NotificationType" AS ENUM (
  'CRITICAL',
  'WARNING',
  'INFO',
  'SUCCESS'
);
ALTER TYPE "public"."NotificationType" OWNER TO "postgres";

-- ----------------------------
-- Type structure for ProposalStatus
-- ----------------------------
DROP TYPE IF EXISTS "public"."ProposalStatus";
CREATE TYPE "public"."ProposalStatus" AS ENUM (
  'Pending',
  'Approved',
  'Rejected',
  'Completed'
);
ALTER TYPE "public"."ProposalStatus" OWNER TO "postgres";

-- ----------------------------
-- Type structure for ProposalType
-- ----------------------------
DROP TYPE IF EXISTS "public"."ProposalType";
CREATE TYPE "public"."ProposalType" AS ENUM (
  'CapEx',
  'OpEx'
);
ALTER TYPE "public"."ProposalType" OWNER TO "postgres";

-- ----------------------------
-- Type structure for ProposalUrgency
-- ----------------------------
DROP TYPE IF EXISTS "public"."ProposalUrgency";
CREATE TYPE "public"."ProposalUrgency" AS ENUM (
  'High',
  'Medium',
  'Low'
);
ALTER TYPE "public"."ProposalUrgency" OWNER TO "postgres";

-- ----------------------------
-- Type structure for PurchaseOrderStatus
-- ----------------------------
DROP TYPE IF EXISTS "public"."PurchaseOrderStatus";
CREATE TYPE "public"."PurchaseOrderStatus" AS ENUM (
  'Draft',
  'Submitted',
  'Approved',
  'Ordered',
  'PartiallyReceived',
  'Received',
  'Cancelled'
);
ALTER TYPE "public"."PurchaseOrderStatus" OWNER TO "postgres";

-- ----------------------------
-- Type structure for RiskLevel
-- ----------------------------
DROP TYPE IF EXISTS "public"."RiskLevel";
CREATE TYPE "public"."RiskLevel" AS ENUM (
  'Low',
  'Med',
  'High'
);
ALTER TYPE "public"."RiskLevel" OWNER TO "postgres";

-- ----------------------------
-- Type structure for RndPhase
-- ----------------------------
DROP TYPE IF EXISTS "public"."RndPhase";
CREATE TYPE "public"."RndPhase" AS ENUM (
  'Idea',
  'POC',
  'Pilot',
  'Live'
);
ALTER TYPE "public"."RndPhase" OWNER TO "postgres";

-- ----------------------------
-- Type structure for RndStatus
-- ----------------------------
DROP TYPE IF EXISTS "public"."RndStatus";
CREATE TYPE "public"."RndStatus" AS ENUM (
  'Active',
  'OnHold',
  'Completed',
  'Archived'
);
ALTER TYPE "public"."RndStatus" OWNER TO "postgres";

-- ----------------------------
-- Type structure for ShiftType
-- ----------------------------
DROP TYPE IF EXISTS "public"."ShiftType";
CREATE TYPE "public"."ShiftType" AS ENUM (
  'day',
  'night'
);
ALTER TYPE "public"."ShiftType" OWNER TO "postgres";

-- ----------------------------
-- Type structure for StockMovementType
-- ----------------------------
DROP TYPE IF EXISTS "public"."StockMovementType";
CREATE TYPE "public"."StockMovementType" AS ENUM (
  'Purchase',
  'Usage',
  'Adjustment',
  'Return',
  'Transfer',
  'Waste'
);
ALTER TYPE "public"."StockMovementType" OWNER TO "postgres";

-- ----------------------------
-- Type structure for SupplierStatus
-- ----------------------------
DROP TYPE IF EXISTS "public"."SupplierStatus";
CREATE TYPE "public"."SupplierStatus" AS ENUM (
  'Active',
  'Inactive',
  'Suspended'
);
ALTER TYPE "public"."SupplierStatus" OWNER TO "postgres";

-- ----------------------------
-- Type structure for UserRole
-- ----------------------------
DROP TYPE IF EXISTS "public"."UserRole";
CREATE TYPE "public"."UserRole" AS ENUM (
  'admin',
  'manager',
  'operator'
);
ALTER TYPE "public"."UserRole" OWNER TO "postgres";

-- ----------------------------
-- Table structure for Alert
-- ----------------------------
DROP TABLE IF EXISTS "public"."Alert";
CREATE TABLE "public"."Alert" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "type" "public"."AlertType" NOT NULL,
  "title" text COLLATE "pg_catalog"."default" NOT NULL,
  "message" text COLLATE "pg_catalog"."default" NOT NULL,
  "timestamp" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "acknowledged" bool NOT NULL DEFAULT false,
  "city" "public"."City" NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Records of Alert
-- ----------------------------
INSERT INTO "public"."Alert" VALUES ('1cd1c6be-a4c6-4fe0-84f4-8860352ef690', 'critical', 'SPL Violation', 'Sound levels exceeded 110 dB at 23:45. Immediate attention required.', '2025-12-01 08:20:21.122', 'f', 'jakarta', '2025-12-01 08:20:21.124', '2025-12-01 08:20:21.124');
INSERT INTO "public"."Alert" VALUES ('b9ce450c-21f3-443f-9e7e-868d4d3037e5', 'warning', 'Equipment Maintenance Due', 'LED Wall Controller requires inspection within 2 days.', '2025-12-01 08:20:21.122', 'f', 'jakarta', '2025-12-01 08:20:21.124', '2025-12-01 08:20:21.124');

-- ----------------------------
-- Table structure for Area
-- ----------------------------
DROP TABLE IF EXISTS "public"."Area";
CREATE TABLE "public"."Area" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::text,
  "isActive" bool NOT NULL DEFAULT true,
  "city" "public"."City",
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Records of Area
-- ----------------------------
INSERT INTO "public"."Area" VALUES ('58fbcc63-e4bb-4522-952a-4a620271fd25', 'FOH', 'Front of House', 't', NULL, '2025-12-01 08:20:02.884', '2025-12-01 08:20:02.884');
INSERT INTO "public"."Area" VALUES ('2da75b8c-87fd-4b0c-9e88-f813cc137477', 'VIP', 'VIP Section', 't', NULL, '2025-12-01 08:20:05.456', '2025-12-01 08:20:05.456');
INSERT INTO "public"."Area" VALUES ('5ba76e16-eeff-4f11-b34c-6676bc16ab83', 'The Banks', '', 't', 'bali', '2025-12-03 06:56:54.615', '2025-12-03 06:56:54.615');
INSERT INTO "public"."Area" VALUES ('54b55de6-7aa5-4d0a-949d-1babe549e81b', 'DJ Booth', 'DJ Booth', 't', NULL, '2025-12-01 08:20:03.383', '2025-12-03 06:57:48.76');
INSERT INTO "public"."Area" VALUES ('2f4009db-c119-42bb-a775-11d6b320581b', 'LED Screen', 'LED Screen & System', 't', NULL, '2025-12-01 08:20:04.14', '2025-12-03 06:59:47.163');
INSERT INTO "public"."Area" VALUES ('36ab67de-82d4-4b50-b91c-3ec9c482dc94', 'Panel Room AVL', 'Dimmer & Power Distribution for AVL', 't', NULL, '2025-12-01 08:20:04.391', '2025-12-03 07:00:08.862');
INSERT INTO "public"."Area" VALUES ('2191b765-8ba0-45fc-a103-c6e7cfabed71', 'Sunken VIP', 'VIP Area', 't', 'bali', '2025-12-03 07:00:10.458', '2025-12-03 07:00:38.179');
INSERT INTO "public"."Area" VALUES ('ea4f17f2-32a8-4575-8f72-b4909118644e', 'Panel Room Club', 'Dimmer & Power Distribution for Club', 't', NULL, '2025-12-03 06:57:31.386', '2025-12-03 07:00:42.846');
INSERT INTO "public"."Area" VALUES ('16c193a7-46fd-474f-9c07-f69df73fffff', 'Storage Banks', 'For Equipment and Material. Must be have a lock and dry', 't', 'bali', '2025-12-01 08:20:03.637', '2025-12-03 07:04:45.975');
INSERT INTO "public"."Area" VALUES ('aff3ef3d-9605-40ae-acc7-b0f4798080c2', 'Storage Bunker', 'For Decoration, Furniture, Big equipment and Working area', 't', 'bali', '2025-12-03 07:06:05.624', '2025-12-03 07:06:05.624');
INSERT INTO "public"."Area" VALUES ('908d8433-ecf1-4a91-9bc5-23c6f57a89fa', 'General Furnitures', 'Sofas, Tables, Cabinets, Queue line, Signage & etc', 't', NULL, '2025-12-03 10:59:52.677', '2025-12-03 11:51:01.882');
INSERT INTO "public"."Area" VALUES ('b73540ac-3cbd-4583-8613-507b0d2e4fb8', 'Entrance VIP', 'Queue line, Receptionist and Tunnel', 't', 'bali', '2025-12-03 07:51:32.837', '2025-12-03 07:51:32.837');
INSERT INTO "public"."Area" VALUES ('d1939f5d-7c27-40a6-8b03-d21d8d459277', 'Exit General', 'Black Box & Tunnel', 't', 'bali', '2025-12-03 07:52:03.011', '2025-12-03 07:52:03.011');
INSERT INTO "public"."Area" VALUES ('b3c3ff36-791b-4ee9-94fa-cc793d4e4a69', 'Entrance General', 'Receptionist, Tunnel, Black Box & FDC room', 't', 'bali', '2025-12-03 07:07:47.648', '2025-12-03 07:52:19.642');
INSERT INTO "public"."Area" VALUES ('142f8ec8-a2f0-4bcb-aaea-12818d3c5114', 'Storage Lobby', 'Near Exit Tunnel', 't', 'bali', '2025-12-03 07:52:57.612', '2025-12-03 07:52:57.612');
INSERT INTO "public"."Area" VALUES ('cfa31c47-309e-4447-8da9-7b1af2f5cbbc', 'BAR', 'BAR and liquor storage area', 't', NULL, '2025-12-01 08:20:05.703', '2025-12-03 08:05:43.326');
INSERT INTO "public"."Area" VALUES ('d9efd962-c30e-4750-9d0b-7722d52630fa', 'Toilet General', 'Man and Woman', 't', NULL, '2025-12-03 08:06:45.008', '2025-12-03 08:06:45.008');
INSERT INTO "public"."Area" VALUES ('499cbe94-a223-401b-a036-f051eb349624', 'Toilet VIP', 'Man and Woman', 't', NULL, '2025-12-03 08:06:59.713', '2025-12-03 08:06:59.713');
INSERT INTO "public"."Area" VALUES ('48e90342-40bd-4396-abc4-0d1d23ed7598', 'Speakers & Audio System', '', 't', NULL, '2025-12-03 10:21:35.78', '2025-12-03 10:22:31.743');
INSERT INTO "public"."Area" VALUES ('96755097-46dc-4b49-b26f-c487479d90a1', 'Office', 'Purchasing Office, HR Office & Finance room', 't', 'bali', '2025-12-03 08:01:28.969', '2025-12-03 10:23:07.725');
INSERT INTO "public"."Area" VALUES ('51de3877-beb1-47e2-b963-b5b31c0a772b', 'Visual, Laser Animation and System', '', 't', NULL, '2025-12-03 10:29:07.989', '2025-12-03 10:29:07.989');
INSERT INTO "public"."Area" VALUES ('ad110538-1bca-4aae-8181-026dfee415ea', 'Special Lighting, Led Strips & System', '', 't', NULL, '2025-12-03 10:28:31.921', '2025-12-03 10:29:40.339');
INSERT INTO "public"."Area" VALUES ('67062f6a-5fed-4950-9757-60ce06f6a1aa', 'Special FX', '', 't', NULL, '2025-12-03 10:31:19.902', '2025-12-03 10:31:19.902');
INSERT INTO "public"."Area" VALUES ('f0dbd817-30e0-45ba-8251-6e845fd88420', 'Interior lighting', 'Led strips, spotlight, neon light & Sign', 't', NULL, '2025-12-03 11:03:46.3', '2025-12-03 11:03:46.3');

-- ----------------------------
-- Table structure for Consumable
-- ----------------------------
DROP TABLE IF EXISTS "public"."Consumable";
CREATE TABLE "public"."Consumable" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "category" text COLLATE "pg_catalog"."default" NOT NULL,
  "currentStock" float8 NOT NULL DEFAULT 0,
  "reorderPoint" int4 NOT NULL DEFAULT 0,
  "unit" text COLLATE "pg_catalog"."default" NOT NULL,
  "city" "public"."City" NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "image" text COLLATE "pg_catalog"."default",
  "location" text COLLATE "pg_catalog"."default",
  "maxStock" int4,
  "minStock" int4 NOT NULL DEFAULT 0,
  "reorderQty" int4 NOT NULL DEFAULT 0,
  "unitCost" float8 NOT NULL DEFAULT 0,
  "supplierId" text COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of Consumable
-- ----------------------------
INSERT INTO "public"."Consumable" VALUES ('542866b5-bf71-4a9e-8ea9-f9715e4a4a9f', 'CO₂ Cartridges', 'SFX', 24, 15, 'cartridges', 'jakarta', '2025-12-01 08:20:16.885', '2025-12-01 08:20:16.885', 'High-pressure CO2 cartridges for fog cannons and cryo effects', NULL, 'Warehouse A - Shelf 3', 100, 12, 50, 25000, NULL);
INSERT INTO "public"."Consumable" VALUES ('3098343d-a407-489d-8db5-6e28a6e00dc6', 'Fog Fluid - High Density', 'SFX', 45, 25, 'liters', 'jakarta', '2025-12-01 08:20:16.885', '2025-12-01 08:20:16.885', 'Professional fog machine fluid for dense, long-lasting fog', NULL, 'Warehouse A - Section B', 200, 20, 100, 85000, NULL);
INSERT INTO "public"."Consumable" VALUES ('337e6b7c-c3a4-4205-a54f-9342eabd3c71', 'Confetti Mix - Metallic', 'SFX', 8, 6, 'kg', 'jakarta', '2025-12-01 08:20:16.885', '2025-12-01 08:20:16.885', 'Biodegradable metallic confetti for confetti cannons', NULL, 'Warehouse A - Shelf 5', 30, 5, 15, 450000, NULL);
INSERT INTO "public"."Consumable" VALUES ('06415752-62ba-46f1-9dd6-e72049f33679', 'DMX Cables - 3m', 'Lighting', 15, 12, 'pieces', 'jakarta', '2025-12-01 08:20:16.885', '2025-12-01 08:20:16.885', '3-pin DMX cables, 3 meters, professional grade', NULL, 'Tech Room - Drawer 2', 50, 10, 20, 75000, NULL);
INSERT INTO "public"."Consumable" VALUES ('786cca33-2209-4976-8658-2c131a416e32', 'LED Par Can Filters - CTB', 'Lighting', 25, 18, 'sheets', 'jakarta', '2025-12-01 08:20:16.885', '2025-12-01 08:20:16.885', 'Color correction filters (CTB) for LED Par cans', NULL, 'Tech Room - Cabinet A', 100, 15, 40, 35000, NULL);
INSERT INTO "public"."Consumable" VALUES ('b0c3a499-3c6b-4140-b576-5467ade077e2', 'Gaffer Tape - Black 2"', 'General', 12, 10, 'rolls', 'jakarta', '2025-12-01 08:20:16.885', '2025-12-01 08:20:16.885', 'Professional gaffer tape, black, 2 inch width', NULL, 'General Storage - Bin 1', 40, 8, 24, 95000, NULL);
INSERT INTO "public"."Consumable" VALUES ('d8e8d630-a52e-4c65-974c-6428bd10f9b7', 'XLR Cables - 5m', 'Audio', 20, 15, 'pieces', 'jakarta', '2025-12-01 08:20:16.885', '2025-12-01 08:20:16.885', 'Balanced XLR microphone cables, 5 meters', NULL, 'Audio Room - Rack B', 60, 12, 30, 125000, NULL);
INSERT INTO "public"."Consumable" VALUES ('55a2c63a-1efe-4c67-b6b2-b6e02aec3928', 'Battery 9V Alkaline', 'Audio', 48, 30, 'pieces', 'jakarta', '2025-12-01 08:20:16.885', '2025-12-01 08:20:16.885', 'Alkaline 9V batteries for wireless mics', NULL, 'Audio Room - Drawer 3', 200, 24, 100, 15000, NULL);
INSERT INTO "public"."Consumable" VALUES ('55a53687-cdd3-45e4-99cd-43b0f5f3cfda', 'Fog Fluid - Standard', 'SFX', 32, 20, 'liters', 'bali', '2025-12-01 08:20:16.885', '2025-12-01 08:20:16.885', 'Standard fog machine fluid', NULL, 'Storage - Section C', 150, 15, 80, 78000, NULL);
INSERT INTO "public"."Consumable" VALUES ('2224bd06-9aad-43e2-a2f2-18bded706252', 'DMX Cables - 5m', 'Lighting', 12, 10, 'pieces', 'bali', '2025-12-01 08:20:16.885', '2025-12-01 08:20:16.885', '3-pin DMX cables, 5 meters', NULL, 'Tech Storage - Box 1', 40, 8, 16, 95000, NULL);
INSERT INTO "public"."Consumable" VALUES ('9aec298b-7320-4d5e-a183-ded1c94d6bb7', 'Gaffer Tape - White 2"', 'General', 8, 6, 'rolls', 'bali', '2025-12-01 08:20:16.885', '2025-12-01 08:20:16.885', 'Professional gaffer tape, white, 2 inch width', NULL, 'General Storage', 30, 5, 18, 95000, NULL);
INSERT INTO "public"."Consumable" VALUES ('e784157c-73ff-425c-b2e3-f5518f450711', 'Power Cables - IEC', 'General', 16, 12, 'pieces', 'bali', '2025-12-01 08:20:16.885', '2025-12-01 08:20:16.885', 'Standard IEC power cables, 2 meters', NULL, 'General Storage', 50, 10, 25, 45000, NULL);
INSERT INTO "public"."Consumable" VALUES ('2ac5a1d4-2d12-4a0d-b1df-338fce800f21', 'CO₂ Tube', 'SFX', 4, 4, 'cartridges', 'bali', '2025-12-01 08:20:16.885', '2025-12-03 11:43:25.329', 'High-pressure CO2 tube for fog cannons and cryo effects', NULL, 'Storage Bar Back', 12, 4, 8, 250000, NULL);

-- ----------------------------
-- Table structure for CrewMember
-- ----------------------------
DROP TABLE IF EXISTS "public"."CrewMember";
CREATE TABLE "public"."CrewMember" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "role" text COLLATE "pg_catalog"."default" NOT NULL,
  "shift" "public"."ShiftType" NOT NULL,
  "assigned" bool NOT NULL DEFAULT false,
  "city" "public"."City" NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Records of CrewMember
-- ----------------------------
INSERT INTO "public"."CrewMember" VALUES ('1087e347-c716-4938-ac47-99f5627380fd', 'Chris', 'Engineer Day', 'day', 't', 'jakarta', '2025-12-01 08:20:08.201', '2025-12-01 08:20:08.201');
INSERT INTO "public"."CrewMember" VALUES ('dac2f71d-328b-4b77-8526-49170ce61635', 'Nando', 'Engineer Night', 'night', 't', 'jakarta', '2025-12-01 08:20:08.201', '2025-12-01 08:20:08.201');
INSERT INTO "public"."CrewMember" VALUES ('90068f8c-f8d3-4a06-a48d-69c5042127a8', 'Andra', 'Engineer Night', 'night', 't', 'bali', '2025-12-01 08:20:08.201', '2025-12-01 08:20:08.201');
INSERT INTO "public"."CrewMember" VALUES ('dd5f00c0-31a1-47a1-834a-8457f979030a', 'Budi', 'Lighting Jockey', 'night', 't', 'bali', '2025-12-01 08:20:08.201', '2025-12-01 08:20:08.201');
INSERT INTO "public"."CrewMember" VALUES ('68e91714-edc7-4a14-abc1-2a5a18f0a65c', 'Ating', 'Visual Jockey', 'night', 't', 'jakarta', '2025-12-01 08:20:08.201', '2025-12-01 14:16:50.389');
INSERT INTO "public"."CrewMember" VALUES ('f4bc636d-f013-4c88-8c79-70856b6d88ac', 'Pungky', 'Engineer Day', 'day', 't', 'bali', '2025-12-01 08:20:08.201', '2025-12-03 06:23:28.299');
INSERT INTO "public"."CrewMember" VALUES ('3ace69ee-d0a4-47aa-ad6d-18855832b6e1', 'Kojek', 'Visual Jockey', 'night', 't', 'bali', '2025-12-03 06:24:04.883', '2025-12-03 06:25:51.485');
INSERT INTO "public"."CrewMember" VALUES ('f05c187c-f3c8-46af-ab39-3718505d6b5e', 'Made', 'Sound Engineer', 'night', 't', 'bali', '2025-12-01 08:20:08.201', '2025-12-03 06:25:57.383');
INSERT INTO "public"."CrewMember" VALUES ('7496d417-92f9-40bb-adf2-04c35ea8ce2c', 'Iki', 'Lighting Jockey', 'night', 't', 'jakarta', '2025-12-01 08:20:08.201', '2025-12-03 06:52:31.189');
INSERT INTO "public"."CrewMember" VALUES ('02b9f5e3-1a77-4d11-9bfc-87d4c66a2c46', 'Dhipa', 'Sound Engineer', 'night', 'f', 'jakarta', '2025-12-01 08:20:08.201', '2025-12-03 06:52:36.756');
INSERT INTO "public"."CrewMember" VALUES ('3f465c2d-bffd-4256-94f7-9a027aec44a3', 'Jerry', 'Sound Engineer', 'night', 't', 'jakarta', '2025-12-01 08:20:08.201', '2025-12-03 06:52:39.516');
INSERT INTO "public"."CrewMember" VALUES ('d7059725-528c-4a52-9982-9ba8abe3d9d3', 'Kukuh', 'Engineer Day', 'day', 'f', 'bali', '2025-12-01 08:20:08.201', '2025-12-03 06:52:50.061');
INSERT INTO "public"."CrewMember" VALUES ('9c15bdd0-4b91-432a-9cd4-06af48612f1f', 'Slengky', 'Technical Assistance', 'night', 't', 'bali', '2025-12-01 08:20:08.201', '2025-12-03 06:53:43.331');

-- ----------------------------
-- Table structure for Equipment
-- ----------------------------
DROP TABLE IF EXISTS "public"."Equipment";
CREATE TABLE "public"."Equipment" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "status" "public"."EquipmentStatus" NOT NULL DEFAULT 'Ready'::"EquipmentStatus",
  "lastInspection" timestamp(3) NOT NULL,
  "nextDue" timestamp(3) NOT NULL,
  "firmware" text COLLATE "pg_catalog"."default" NOT NULL,
  "city" "public"."City" NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL,
  "description" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::text,
  "photo" text COLLATE "pg_catalog"."default",
  "areaId" text COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of Equipment
-- ----------------------------
INSERT INTO "public"."Equipment" VALUES ('2ccc3eee-be49-4c51-812f-31d51b115702', 'Void Nexus Speakers', 'Ready', '2025-08-24 00:00:00', '2025-08-31 00:00:00', 'v1.8.2', 'jakarta', '2025-12-01 08:20:06.209', '2025-12-01 08:20:06.209', 'Main PA system for front of house', NULL, '58fbcc63-e4bb-4522-952a-4a620271fd25');
INSERT INTO "public"."Equipment" VALUES ('5f753c5f-48fa-449b-989c-9d1d44ec5853', 'Martin MAC Aura', 'Ready', '2025-08-26 00:00:00', '2025-09-03 00:00:00', 'v2.5.0', 'jakarta', '2025-12-01 08:20:06.209', '2025-12-01 08:20:06.209', 'LED wash moving head fixtures', NULL, '58fbcc63-e4bb-4522-952a-4a620271fd25');
INSERT INTO "public"."Equipment" VALUES ('3ce2b107-e700-415b-b646-3e782f29008b', 'Speakers VIP ', 'Ready', '2025-12-01 00:00:00', '2026-01-01 00:00:00', 'N/A', 'bali', '2025-12-03 08:10:51.093', '2025-12-03 10:33:41.734', '', NULL, '48e90342-40bd-4396-abc4-0d1d23ed7598');
INSERT INTO "public"."Equipment" VALUES ('4a56f9cd-3934-43e2-8e5c-a41513ab7517', 'CDJ-3000 #3 ', 'Ready', '2025-12-01 00:00:00', '2026-01-01 00:00:00', 'N/A', 'bali', '2025-12-03 07:31:14.538', '2025-12-03 10:25:59.499', '', NULL, '48e90342-40bd-4396-abc4-0d1d23ed7598');
INSERT INTO "public"."Equipment" VALUES ('c6ae0112-2eb7-47df-bc3f-53f8a253f67d', 'CDJ-3000 #2 ', 'Ready', '2025-12-01 00:00:00', '2026-01-01 00:00:00', 'N/A', 'bali', '2025-12-03 07:30:40.095', '2025-12-03 10:26:56.585', '', NULL, '48e90342-40bd-4396-abc4-0d1d23ed7598');
INSERT INTO "public"."Equipment" VALUES ('19eb83e2-73a5-4046-b605-571d9d2657c8', 'Speakers The Banks ', 'Ready', '2025-12-01 00:00:00', '2026-01-01 00:00:00', 'N/A', 'bali', '2025-12-03 10:14:27.901', '2025-12-03 10:24:44.833', '', NULL, '48e90342-40bd-4396-abc4-0d1d23ed7598');
INSERT INTO "public"."Equipment" VALUES ('c408b133-beea-4796-ae8c-1b072de32198', 'CDJ 3000 #1', 'Ready', '2025-08-25 00:00:00', '2025-09-01 00:00:00', 'v2.1.4', 'jakarta', '2025-12-01 08:20:06.209', '2025-12-03 11:57:39.513', 'Professional DJ deck for main booth', '', '48e90342-40bd-4396-abc4-0d1d23ed7598');
INSERT INTO "public"."Equipment" VALUES ('ac4cfee3-c1df-451f-9379-7d4a9a7b6c8c', 'Cabinet', 'Ready', '2025-12-01 00:00:00', '2026-01-01 00:00:00', 'N/A', 'bali', '2025-12-03 07:36:51.973', '2025-12-03 11:03:52.145', 'All cabinet VIP', NULL, '908d8433-ecf1-4a91-9bc5-23c6f57a89fa');
INSERT INTO "public"."Equipment" VALUES ('1ec573d2-8440-4230-a067-d58ea79087db', 'Parled', 'Ready', '2025-12-01 00:00:00', '2026-01-01 00:00:00', 'N/A', 'bali', '2025-12-03 07:22:37.279', '2025-12-03 10:45:18.922', '9 units', NULL, 'ad110538-1bca-4aae-8181-026dfee415ea');
INSERT INTO "public"."Equipment" VALUES ('b0d9a4f7-4f89-4f21-9206-b09453a2ca1a', 'Atomic Lamp', 'Ready', '2025-12-01 00:00:00', '2026-01-01 00:00:00', 'N/A', 'bali', '2025-12-03 07:13:09.004', '2025-12-03 10:50:59.842', '', NULL, 'ad110538-1bca-4aae-8181-026dfee415ea');
INSERT INTO "public"."Equipment" VALUES ('27f9940b-af0e-4e68-a316-e7855962280a', 'Sign Age', 'Ready', '2025-12-01 00:00:00', '2026-01-01 00:00:00', 'N/A', 'bali', '2025-12-03 11:08:53.803', '2025-12-03 11:08:53.803', 'All sign age', NULL, '908d8433-ecf1-4a91-9bc5-23c6f57a89fa');
INSERT INTO "public"."Equipment" VALUES ('0626c280-8d99-4c39-a5d4-20ccd908fb42', 'Appliances & Hardware Electronic', 'Ready', '2025-12-01 00:00:00', '2026-01-01 00:00:00', 'N/A', 'bali', '2025-12-03 10:39:52.724', '2025-12-03 10:39:52.724', 'Chiller, freezer, printer, POS', NULL, 'cfa31c47-309e-4447-8da9-7b1af2f5cbbc');
INSERT INTO "public"."Equipment" VALUES ('cc5fae7b-45e3-4bfb-8cd1-22494c77055a', 'Speakers Sunken', 'Ready', '2025-12-03 00:00:00', '2025-12-10 00:00:00', 'N/A', 'bali', '2025-12-03 10:23:03.526', '2025-12-03 10:29:15.259', '', NULL, '48e90342-40bd-4396-abc4-0d1d23ed7598');
INSERT INTO "public"."Equipment" VALUES ('be007f03-b45a-4f29-91b0-2fbdfd5a903b', 'Pioneer DJM-A9 ', 'Ready', '2025-12-01 00:00:00', '2026-01-01 00:00:00', 'v1.9.0', 'bali', '2025-12-01 08:20:06.209', '2025-12-03 10:25:05.05', '4-channel professional DJ mixer', NULL, '48e90342-40bd-4396-abc4-0d1d23ed7598');
INSERT INTO "public"."Equipment" VALUES ('1a9fe865-6197-43f8-965c-8eb5bb7a91d4', 'Line Array ', 'Ready', '2025-12-01 00:00:00', '2026-01-01 00:00:00', 'N/A', 'bali', '2025-12-03 08:13:50.398', '2025-12-03 10:30:06.645', '2 units VOID Nexus 6', NULL, '48e90342-40bd-4396-abc4-0d1d23ed7598');
INSERT INTO "public"."Equipment" VALUES ('a8fc3e7c-ab13-44ed-9fa7-ef6c6c8b86ce', 'Mixer Audio ', 'Ready', '2025-12-01 00:00:00', '2026-01-01 00:00:00', 'N/A', 'bali', '2025-12-03 07:38:50.096', '2025-12-03 10:30:28.834', 'Yamaha DM3, ASUS Laptop, UPS, Amplifire Rack', NULL, '48e90342-40bd-4396-abc4-0d1d23ed7598');
INSERT INTO "public"."Equipment" VALUES ('70b167a3-9bc5-4f02-9d7b-691643ec37b7', 'CDJ-3000 #4 ', 'Ready', '2025-12-01 00:00:00', '2026-01-01 00:00:00', 'N/A', 'bali', '2025-12-03 07:31:15.737', '2025-12-03 10:27:18.492', '', NULL, '48e90342-40bd-4396-abc4-0d1d23ed7598');
INSERT INTO "public"."Equipment" VALUES ('a1f0b28e-8daa-4aec-bf1b-70a20e01c139', 'CDJ - 3000 #1 ', 'Ready', '2025-12-01 00:00:00', '2026-01-01 00:00:00', 'N/A', 'bali', '2025-12-03 06:55:01.299', '2025-12-03 10:25:41.316', '', NULL, '48e90342-40bd-4396-abc4-0d1d23ed7598');
INSERT INTO "public"."Equipment" VALUES ('b614d2e4-9e32-4cac-a09c-fcba4293d156', 'Speaker Monitor ', 'Ready', '2025-12-01 00:00:00', '2026-01-01 00:00:00', 'N/A', 'bali', '2025-12-03 08:02:19.322', '2025-12-03 10:27:54.313', '2 items Void monitor sounds & 1 sub monitor ', NULL, '48e90342-40bd-4396-abc4-0d1d23ed7598');
INSERT INTO "public"."Equipment" VALUES ('a549ebb3-fa09-4fb1-9dcf-27c63d996e88', 'Sub Woofer ', 'Ready', '2025-12-01 00:00:00', '2026-01-01 00:00:00', 'N/A', 'bali', '2025-12-03 07:32:17.123', '2025-12-03 10:28:32.835', '4 units VOID Stasys XV2', NULL, '48e90342-40bd-4396-abc4-0d1d23ed7598');
INSERT INTO "public"."Equipment" VALUES ('e841cce1-859c-48bf-b2d0-b38438d5fae2', 'Appliances & Electronic Hardware ', 'Ready', '2025-12-01 00:00:00', '2026-01-01 00:00:00', 'N/A', 'bali', '2025-12-03 10:39:56.014', '2025-12-03 10:41:30.306', 'Chiller, freezer, printer, POS', NULL, 'cfa31c47-309e-4447-8da9-7b1af2f5cbbc');
INSERT INTO "public"."Equipment" VALUES ('04373796-0af7-4ec3-accc-7083a106039b', 'Laser Spot Light', 'Ready', '2025-12-01 00:00:00', '2026-01-01 00:00:00', 'N/A', 'bali', '2025-12-03 07:15:58.929', '2025-12-03 10:50:23.061', '1 unit in above DJ', NULL, '51de3877-beb1-47e2-b963-b5b31c0a772b');
INSERT INTO "public"."Equipment" VALUES ('bacbb3af-4741-4438-9a5e-74758ac93a2e', 'Furniture', 'Ready', '2025-12-01 00:00:00', '2026-01-01 00:00:00', 'N/A', 'bali', '2025-12-03 10:39:53.979', '2025-12-03 10:43:17.145', 'sink, table', NULL, 'cfa31c47-309e-4447-8da9-7b1af2f5cbbc');
INSERT INTO "public"."Equipment" VALUES ('ef8690e4-7690-4e93-bf8e-b7452905fa6f', 'Co2 Machine', 'Ready', '2025-12-03 00:00:00', '2025-12-10 00:00:00', 'N/A', 'bali', '2025-12-03 07:11:09.036', '2025-12-03 10:44:25.25', '2 units left n right', NULL, '67062f6a-5fed-4950-9757-60ce06f6a1aa');
INSERT INTO "public"."Equipment" VALUES ('57b849bc-0771-4b5f-8907-6b939a98062b', 'LED Strip Madrix', 'Ready', '2025-12-01 00:00:00', '2026-01-01 00:00:00', 'N/A', 'bali', '2025-12-03 07:12:35.001', '2025-12-03 10:45:30.897', '', NULL, 'ad110538-1bca-4aae-8181-026dfee415ea');
INSERT INTO "public"."Equipment" VALUES ('de8e6123-4d5f-459c-a7c3-6ddcfd39e815', 'Smoke Machine', 'Ready', '2025-12-01 00:00:00', '2026-01-01 00:00:00', 'N/A', 'bali', '2025-12-03 07:09:47.751', '2025-12-03 10:46:20.084', '', NULL, '67062f6a-5fed-4950-9757-60ce06f6a1aa');
INSERT INTO "public"."Equipment" VALUES ('b9e3bb11-313c-4ec8-a470-f8bdcae667b2', 'Cage Dancer', 'Ready', '2025-12-01 00:00:00', '2026-01-01 00:00:00', 'N/A', 'bali', '2025-12-03 07:27:50.354', '2025-12-03 10:47:04.66', '2 units left and right', NULL, 'ad110538-1bca-4aae-8181-026dfee415ea');
INSERT INTO "public"."Equipment" VALUES ('2d078bd3-6547-4d9f-a0c2-c1cb5202f2c6', 'LED Screen', 'Ready', '2025-12-01 00:00:00', '2026-01-01 00:00:00', 'P 3.9 (UP) , P 7.8 (RIGHT)', 'bali', '2025-12-03 07:07:39.667', '2025-12-03 10:50:43.678', '1800x1080px , 4 Sides', NULL, '51de3877-beb1-47e2-b963-b5b31c0a772b');
INSERT INTO "public"."Equipment" VALUES ('f13b612f-a61f-4819-b11b-ab9309cfa2f3', 'Spot Light Lamp', 'Ready', '2025-12-01 00:00:00', '2026-01-01 00:00:00', 'N/A', 'bali', '2025-12-03 07:18:14.161', '2025-12-03 10:51:11.498', 'in above DJ', NULL, 'ad110538-1bca-4aae-8181-026dfee415ea');
INSERT INTO "public"."Equipment" VALUES ('fa283006-395d-4c8a-9477-63d89dfe8e35', 'Laser Bar', 'Ready', '2025-12-01 00:00:00', '2026-01-01 00:00:00', 'N/A', 'bali', '2025-12-03 07:20:32.003', '2025-12-03 10:51:27.758', '12 units ', NULL, 'ad110538-1bca-4aae-8181-026dfee415ea');
INSERT INTO "public"."Equipment" VALUES ('901ff19f-cd38-4ab5-8f79-1bf002a679f6', 'Liquid Smoke Machine', 'Ready', '2025-12-01 00:00:00', '2026-01-01 00:00:00', 'N/A', 'bali', '2025-12-01 08:20:06.209', '2025-12-03 10:54:51.667', 'Low-lying fog machine for stage effects', NULL, 'ad110538-1bca-4aae-8181-026dfee415ea');
INSERT INTO "public"."Equipment" VALUES ('6f7173bb-ad0d-4032-9336-7981ac7ba139', 'Sofa', 'Ready', '2025-12-01 00:00:00', '2026-01-01 00:00:00', 'N/A', 'bali', '2025-12-03 07:35:32.933', '2025-12-03 11:02:42.739', 'Sofa all VIP', NULL, '908d8433-ecf1-4a91-9bc5-23c6f57a89fa');
INSERT INTO "public"."Equipment" VALUES ('ebc05ba4-728c-4595-a873-235dde3e1ff1', 'Table', 'Ready', '2025-12-01 00:00:00', '2026-01-01 00:00:00', 'N/A', 'bali', '2025-12-03 07:34:48.932', '2025-12-03 11:03:13.629', 'Table all VIP', NULL, '908d8433-ecf1-4a91-9bc5-23c6f57a89fa');
INSERT INTO "public"."Equipment" VALUES ('e443c0d8-553a-4ebf-ae44-7998665bbe62', 'Queue Line', 'Ready', '2025-12-03 00:00:00', '2025-12-10 00:00:00', 'N/A', 'bali', '2025-12-03 11:06:16.785', '2025-12-03 11:08:20.29', 'all Queue line ', NULL, '908d8433-ecf1-4a91-9bc5-23c6f57a89fa');
INSERT INTO "public"."Equipment" VALUES ('fc980937-14d1-4faf-80bf-7ee203222681', 'Sign ', 'Ready', '2025-12-01 00:00:00', '2026-01-01 00:00:00', 'N/A', 'bali', '2025-12-03 11:11:34.827', '2025-12-03 11:11:34.827', 'All sign ', NULL, 'f0dbd817-30e0-45ba-8251-6e845fd88420');
INSERT INTO "public"."Equipment" VALUES ('dde5daf6-049a-457b-bb86-bcb51d3546a0', 'Spotlight', 'Ready', '2025-12-01 00:00:00', '2026-01-01 00:00:00', 'N/A', 'bali', '2025-12-03 11:15:27.355', '2025-12-03 11:15:27.355', 'All spotlight', NULL, 'f0dbd817-30e0-45ba-8251-6e845fd88420');
INSERT INTO "public"."Equipment" VALUES ('f3f10e76-a081-4d08-85d4-4bb4428ec20a', 'Neon Light', 'Ready', '2025-12-01 00:00:00', '2026-01-01 00:00:00', 'N/A', 'bali', '2025-12-03 11:16:46.671', '2025-12-03 11:16:46.671', 'All neon light', NULL, 'f0dbd817-30e0-45ba-8251-6e845fd88420');
INSERT INTO "public"."Equipment" VALUES ('1a2311ea-f83b-428c-a0e2-36ad78816942', 'LED Wall Controller', 'Degraded', '2025-08-23 00:00:00', '2025-08-30 00:00:00', 'v3.2.1', 'jakarta', '2025-12-01 08:20:06.209', '2025-12-03 11:19:22.239', 'Main LED wall processing unit - needs calibration', NULL, NULL);
INSERT INTO "public"."Equipment" VALUES ('ad39917d-0582-419a-a0c0-08077df806d1', 'Receptionist', 'Ready', '2025-12-01 00:00:00', '2026-01-01 00:00:00', 'N/A', 'bali', '2025-12-03 11:31:17.982', '2025-12-03 11:31:17.982', '', NULL, 'b3c3ff36-791b-4ee9-94fa-cc793d4e4a69');
INSERT INTO "public"."Equipment" VALUES ('032b35b3-1503-4cb4-906f-0cf199049ff5', 'Laser Dance Floor', 'Ready', '2025-12-01 00:00:00', '2026-01-01 00:00:00', 'N/A', 'bali', '2025-12-03 07:13:53.446', '2025-12-03 15:00:29.586', '4 Units Lasers 6Watt', NULL, '51de3877-beb1-47e2-b963-b5b31c0a772b');
INSERT INTO "public"."Equipment" VALUES ('b15ae8e8-f456-40ae-810c-395d0af5d104', 'Tunnel', 'Ready', '2025-12-01 00:00:00', '2026-01-01 00:00:00', 'N/A', 'bali', '2025-12-03 11:32:01.684', '2025-12-03 11:32:01.684', '', NULL, 'b3c3ff36-791b-4ee9-94fa-cc793d4e4a69');
INSERT INTO "public"."Equipment" VALUES ('3d2ed3e4-50fc-4b38-ab34-a0282278d787', 'LED Strips (Interior)', 'Ready', '2025-12-01 00:00:00', '2026-01-01 00:00:00', 'N/A', 'bali', '2025-12-03 11:13:19.874', '2025-12-03 11:36:56.173', 'All led strips', NULL, 'f0dbd817-30e0-45ba-8251-6e845fd88420');

-- ----------------------------
-- Table structure for EquipmentInspection
-- ----------------------------
DROP TABLE IF EXISTS "public"."EquipmentInspection";
CREATE TABLE "public"."EquipmentInspection" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "equipmentId" text COLLATE "pg_catalog"."default" NOT NULL,
  "inspector" text COLLATE "pg_catalog"."default" NOT NULL,
  "condition" text COLLATE "pg_catalog"."default" NOT NULL,
  "notes" text COLLATE "pg_catalog"."default" NOT NULL,
  "issues" text[] COLLATE "pg_catalog"."default",
  "date" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of EquipmentInspection
-- ----------------------------

-- ----------------------------
-- Table structure for EventBrief
-- ----------------------------
DROP TABLE IF EXISTS "public"."EventBrief";
CREATE TABLE "public"."EventBrief" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "artist" text COLLATE "pg_catalog"."default" NOT NULL,
  "genre" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::text,
  "setTimes" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::text,
  "stagePlotLink" text COLLATE "pg_catalog"."default",
  "inputListLink" text COLLATE "pg_catalog"."default",
  "monitorNeeds" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::text,
  "ljCueNotes" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::text,
  "vjContentChecklist" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::text,
  "timecodeRouting" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::text,
  "sfxNotes" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::text,
  "briefStatus" "public"."BriefStatus" NOT NULL DEFAULT 'Draft'::"BriefStatus",
  "riskLevel" "public"."RiskLevel" NOT NULL DEFAULT 'Low'::"RiskLevel",
  "city" "public"."City" NOT NULL,
  "date" timestamp(3) NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL,
  "audioOrder" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::text,
  "brandMoment" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::text,
  "liveSetRecording" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::text,
  "specialLightingOrder" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::text,
  "visualOrder" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::text
)
;

-- ----------------------------
-- Records of EventBrief
-- ----------------------------
INSERT INTO "public"."EventBrief" VALUES ('dc8a2757-e0c0-4f03-944c-2cbde2522cdd', 'RICHTANNER', 'Hip Hop RnB', '00:00 - 02:00', NULL, NULL, '4x wedge monitors + subs', 'High energy strobes, sync with drops', 'Colorful visuals, party vibe', '-', 'CO₂ every 30 minutes', 'Final', 'High', 'bali', '2025-12-02 16:00:00', '2025-12-01 08:20:07.197', '2025-12-01 15:04:45.27', '4x wedge monitors + 2x sub monitors, DJ booth setup', 'Heineken : 00:00-00:02 (with sound)
Prime Vodka : 00:02-00:03 (no sound)', 'Full HD recording + multi-cam setup', 'High energy strobes, sync with drops, full color spectrum
Color Theme : PURPLE & RED', 'Colorful party visuals, crowd reactions, crowd cam feed
Color Theme : PURPLE & RED');

-- ----------------------------
-- Table structure for Incident
-- ----------------------------
DROP TABLE IF EXISTS "public"."Incident";
CREATE TABLE "public"."Incident" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "type" "public"."IncidentType" NOT NULL,
  "description" text COLLATE "pg_catalog"."default" NOT NULL,
  "rootCause" text COLLATE "pg_catalog"."default" NOT NULL,
  "prevention" text COLLATE "pg_catalog"."default" NOT NULL,
  "impact" text COLLATE "pg_catalog"."default" NOT NULL,
  "date" timestamp(3) NOT NULL,
  "city" "public"."City" NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Records of Incident
-- ----------------------------
INSERT INTO "public"."Incident" VALUES ('95f35a93-426f-4572-893a-78f12efec69a', 'Audio', 'Speaker dropout during peak hours', 'Loose power connection', 'Regular connection inspection added to checklist', 'Minimal - backup engaged automatically', '2025-08-24 16:15:00', 'jakarta', '2025-12-01 08:20:12.414', '2025-12-01 08:20:12.414');

-- ----------------------------
-- Table structure for KPIMetrics
-- ----------------------------
DROP TABLE IF EXISTS "public"."KPIMetrics";
CREATE TABLE "public"."KPIMetrics" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "city" "public"."City" NOT NULL,
  "nightsOpen" int4 NOT NULL,
  "equipmentUptimePercentage" float8 NOT NULL,
  "issuesRaised" int4 NOT NULL,
  "issuesResolved" int4 NOT NULL,
  "powerIncidents" int4 NOT NULL,
  "weekYear" int4 NOT NULL,
  "weekNumber" int4 NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Records of KPIMetrics
-- ----------------------------
INSERT INTO "public"."KPIMetrics" VALUES ('360bb43f-87f1-4fba-bd24-a3a16d9743d2', 'jakarta', 4, 97.8, 8, 6, 1, 2025, 35, '2025-12-01 08:20:22.112', '2025-12-01 08:20:22.112');
INSERT INTO "public"."KPIMetrics" VALUES ('a0b18163-dabf-4b71-aeae-28b798980719', 'bali', 5, 95.4, 12, 10, 2, 2025, 35, '2025-12-01 08:20:22.112', '2025-12-01 08:20:22.112');

-- ----------------------------
-- Table structure for MaintenanceLog
-- ----------------------------
DROP TABLE IF EXISTS "public"."MaintenanceLog";
CREATE TABLE "public"."MaintenanceLog" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "type" "public"."MaintenanceType" NOT NULL,
  "issue" text COLLATE "pg_catalog"."default" NOT NULL,
  "status" "public"."MaintenanceStatus" NOT NULL DEFAULT 'Scheduled'::"MaintenanceStatus",
  "mttr" float8,
  "cost" float8 NOT NULL,
  "parts" text[] COLLATE "pg_catalog"."default",
  "date" timestamp(3) NOT NULL,
  "city" "public"."City" NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL,
  "equipmentId" text COLLATE "pg_catalog"."default",
  "notes" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::text,
  "technicianId" text COLLATE "pg_catalog"."default",
  "photo" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::text,
  "supplierId" text COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of MaintenanceLog
-- ----------------------------
INSERT INTO "public"."MaintenanceLog" VALUES ('9268649d-a450-43ce-b38f-35b814bd1b93', 'Preventive', 'Routine cleaning and calibration', 'Completed', 1.5, 150000, '{"Cleaning kit","Calibration disc"}', '2025-11-28 00:00:00', 'jakarta', '2025-12-01 08:20:11.412', '2025-12-01 08:20:11.412', 'c408b133-beea-4796-ae8c-1b072de32198', '', '1087e347-c716-4938-ac47-99f5627380fd', '', NULL);
INSERT INTO "public"."MaintenanceLog" VALUES ('869ff450-52c7-4e95-995d-560bab645a0b', 'Corrective', 'Display artifacts in upper right panel', 'Completed', 4.2, 850000, '{"LED Module","Control board"}', '2025-11-29 00:00:00', 'jakarta', '2025-12-01 08:20:11.412', '2025-12-01 08:20:11.412', '1a2311ea-f83b-428c-a0e2-36ad78816942', '', 'dac2f71d-328b-4b77-8526-49170ce61635', '', NULL);
INSERT INTO "public"."MaintenanceLog" VALUES ('1d2b693f-9d26-4aeb-9722-6d320eafa428', 'Preventive', 'Driver inspection and firmware update', 'Completed', 2, 250000, '{"Firmware update"}', '2025-11-30 00:00:00', 'jakarta', '2025-12-01 08:20:11.412', '2025-12-01 08:20:11.412', '2ccc3eee-be49-4c51-812f-31d51b115702', '', '1087e347-c716-4938-ac47-99f5627380fd', '', NULL);
INSERT INTO "public"."MaintenanceLog" VALUES ('2e1c8c1b-daf1-4789-8564-bf3bfb98984e', 'Corrective', 'Pan motor grinding noise', 'In_Progress', 3.5, 450000, '{"Motor assembly","Bearing kit"}', '2025-12-01 00:00:00', 'jakarta', '2025-12-01 08:20:11.412', '2025-12-01 08:20:11.412', '5f753c5f-48fa-449b-989c-9d1d44ec5853', '', 'dac2f71d-328b-4b77-8526-49170ce61635', '', NULL);
INSERT INTO "public"."MaintenanceLog" VALUES ('dc21b0b2-0779-4bde-b7ee-8f0faac470a4', 'Preventive', 'Annual service check', 'Completed', 1, 100000, '{"Cleaning supplies"}', '2025-08-25 00:00:00', 'jakarta', '2025-12-01 08:20:11.412', '2025-12-01 08:20:11.412', 'c408b133-beea-4796-ae8c-1b072de32198', '', '1087e347-c716-4938-ac47-99f5627380fd', '', NULL);
INSERT INTO "public"."MaintenanceLog" VALUES ('69ae1d51-288d-4746-ae49-c3df9c43a84a', 'Corrective', 'Panel calibration drift', 'Completed', 2.5, 350000, '{"Calibration tools"}', '2025-08-26 00:00:00', 'jakarta', '2025-12-01 08:20:11.412', '2025-12-01 08:20:11.412', '1a2311ea-f83b-428c-a0e2-36ad78816942', '', 'dac2f71d-328b-4b77-8526-49170ce61635', '', NULL);
INSERT INTO "public"."MaintenanceLog" VALUES ('3537aeff-594e-4a9c-b814-e5038ac1395f', 'Preventive', 'Cleaning', 'Scheduled', 2, 0, '{}', '2025-12-05 16:00:00', 'bali', '2025-12-03 10:19:54.612', '2025-12-03 10:19:54.612', '19eb83e2-73a5-4046-b605-571d9d2657c8', 'cleaning venu 6 and subs', 'f05c187c-f3c8-46af-ab39-3718505d6b5e', '', NULL);
INSERT INTO "public"."MaintenanceLog" VALUES ('c6c9b131-39cd-466d-a994-f75042677b88', 'Corrective', 'VIP Tunnel Flooring LED strips', 'Scheduled', 120, 0, '{}', '2025-12-03 16:00:00', 'bali', '2025-12-03 11:40:48.398', '2025-12-03 11:40:48.398', '3d2ed3e4-50fc-4b38-ab34-a0282278d787', 'Estimate the qty of housing and price ', '9c15bdd0-4b91-432a-9cd4-06af48612f1f', '', NULL);

-- ----------------------------
-- Table structure for Notification
-- ----------------------------
DROP TABLE IF EXISTS "public"."Notification";
CREATE TABLE "public"."Notification" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "userId" text COLLATE "pg_catalog"."default" NOT NULL,
  "type" "public"."NotificationType" NOT NULL,
  "category" "public"."NotificationCategory" NOT NULL,
  "title" text COLLATE "pg_catalog"."default" NOT NULL,
  "message" text COLLATE "pg_catalog"."default" NOT NULL,
  "data" jsonb,
  "city" "public"."City",
  "read" bool NOT NULL DEFAULT false,
  "readAt" timestamp(3),
  "actionUrl" text COLLATE "pg_catalog"."default",
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of Notification
-- ----------------------------

-- ----------------------------
-- Table structure for Permission
-- ----------------------------
DROP TABLE IF EXISTS "public"."Permission";
CREATE TABLE "public"."Permission" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "displayName" text COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "category" text COLLATE "pg_catalog"."default" NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Records of Permission
-- ----------------------------

-- ----------------------------
-- Table structure for Proposal
-- ----------------------------
DROP TABLE IF EXISTS "public"."Proposal";
CREATE TABLE "public"."Proposal" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "title" text COLLATE "pg_catalog"."default" NOT NULL,
  "type" "public"."ProposalType" NOT NULL,
  "urgency" "public"."ProposalUrgency" NOT NULL,
  "estimate" float8 NOT NULL,
  "vendor" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::text,
  "status" "public"."ProposalStatus" NOT NULL DEFAULT 'Pending'::"ProposalStatus",
  "owner" text COLLATE "pg_catalog"."default" NOT NULL,
  "nextAction" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::text,
  "city" "public"."City" NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL,
  "description" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::text,
  "quotesCount" int4 NOT NULL DEFAULT 0,
  "targetDate" timestamp(3),
  "estimateApproved" bool NOT NULL DEFAULT false,
  "estimateApprovedBy" text COLLATE "pg_catalog"."default",
  "quotesPdfs" text[] COLLATE "pg_catalog"."default" DEFAULT ARRAY[]::text[],
  "supplierId" text COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of Proposal
-- ----------------------------
INSERT INTO "public"."Proposal" VALUES ('729591a2-9e84-4cd4-a308-750921ac570a', 'LED Wall Upgrade - 4K Panels', 'CapEx', 'High', 125000000, 'LED Solutions Indonesia', 'Pending', 'Chris', 'CEO Approval Required', 'jakarta', '2025-12-01 08:20:13.403', '2025-12-01 08:20:13.403', 'Upgrade existing LED wall to 4K panels for better visual quality', 3, '2025-12-15 00:00:00', 'f', NULL, '{}', NULL);
INSERT INTO "public"."Proposal" VALUES ('9b35e47b-3ad1-46df-95b0-514df934e9c8', 'New DJ Booth Design', 'CapEx', 'Medium', 45000000, 'Custom Furniture Co', 'Pending', 'Ating', 'Order materials', 'jakarta', '2025-12-01 08:20:13.403', '2025-12-03 06:25:51.03', 'Custom DJ booth with integrated cable management', 2, '2026-01-20 00:00:00', 't', 'admin', '{}', NULL);

-- ----------------------------
-- Table structure for PurchaseOrder
-- ----------------------------
DROP TABLE IF EXISTS "public"."PurchaseOrder";
CREATE TABLE "public"."PurchaseOrder" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "orderNumber" text COLLATE "pg_catalog"."default" NOT NULL,
  "supplierId" text COLLATE "pg_catalog"."default" NOT NULL,
  "orderDate" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expectedDate" timestamp(3),
  "receivedDate" timestamp(3),
  "status" "public"."PurchaseOrderStatus" NOT NULL DEFAULT 'Draft'::"PurchaseOrderStatus",
  "totalAmount" float8 NOT NULL DEFAULT 0,
  "notes" text COLLATE "pg_catalog"."default",
  "city" "public"."City" NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Records of PurchaseOrder
-- ----------------------------
INSERT INTO "public"."PurchaseOrder" VALUES ('a4fd8eda-5bb5-4172-9921-a9758bdd2dd9', 'PO-2025-001', 'bc71c46e-6e0b-46d3-8aab-002052ee8e26', '2025-11-20 00:00:00', '2025-11-27 00:00:00', NULL, 'Ordered', 5250000, 'Regular monthly stock replenishment', 'jakarta', '2025-12-01 08:20:18.39', '2025-12-01 08:20:18.39');
INSERT INTO "public"."PurchaseOrder" VALUES ('82e34a86-4e22-4afe-a320-59e0340d489e', 'PO-2025-002', '7a655977-1034-4c21-a0ab-9546c40436b0', '2025-11-22 00:00:00', '2025-11-25 00:00:00', NULL, 'Submitted', 8500000, 'Urgent fog fluid restock', 'jakarta', '2025-12-01 08:20:18.893', '2025-12-01 08:20:18.893');

-- ----------------------------
-- Table structure for PurchaseOrderItem
-- ----------------------------
DROP TABLE IF EXISTS "public"."PurchaseOrderItem";
CREATE TABLE "public"."PurchaseOrderItem" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "purchaseOrderId" text COLLATE "pg_catalog"."default" NOT NULL,
  "consumableId" text COLLATE "pg_catalog"."default" NOT NULL,
  "quantity" float8 NOT NULL,
  "receivedQty" float8 NOT NULL DEFAULT 0,
  "unitPrice" float8 NOT NULL,
  "totalPrice" float8 NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Records of PurchaseOrderItem
-- ----------------------------
INSERT INTO "public"."PurchaseOrderItem" VALUES ('6da604e5-cae5-4641-ab01-c93678acc375', 'a4fd8eda-5bb5-4172-9921-a9758bdd2dd9', '542866b5-bf71-4a9e-8ea9-f9715e4a4a9f', 50, 0, 25000, 1250000, '2025-12-01 08:20:19.146', '2025-12-01 08:20:19.146');
INSERT INTO "public"."PurchaseOrderItem" VALUES ('abfa01d1-1a4c-407f-a176-7aeca087333b', 'a4fd8eda-5bb5-4172-9921-a9758bdd2dd9', '3098343d-a407-489d-8db5-6e28a6e00dc6', 100, 0, 85000, 8500000, '2025-12-01 08:20:19.146', '2025-12-01 08:20:19.146');
INSERT INTO "public"."PurchaseOrderItem" VALUES ('cbb8fead-961e-479d-ae61-6b151b89743a', '82e34a86-4e22-4afe-a320-59e0340d489e', '3098343d-a407-489d-8db5-6e28a6e00dc6', 100, 0, 85000, 8500000, '2025-12-01 08:20:19.146', '2025-12-01 08:20:19.146');

-- ----------------------------
-- Table structure for PushSubscription
-- ----------------------------
DROP TABLE IF EXISTS "public"."PushSubscription";
CREATE TABLE "public"."PushSubscription" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "userId" text COLLATE "pg_catalog"."default" NOT NULL,
  "endpoint" text COLLATE "pg_catalog"."default" NOT NULL,
  "p256dh" text COLLATE "pg_catalog"."default" NOT NULL,
  "auth" text COLLATE "pg_catalog"."default" NOT NULL,
  "userAgent" text COLLATE "pg_catalog"."default",
  "isActive" bool NOT NULL DEFAULT true,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Records of PushSubscription
-- ----------------------------

-- ----------------------------
-- Table structure for RndProject
-- ----------------------------
DROP TABLE IF EXISTS "public"."RndProject";
CREATE TABLE "public"."RndProject" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "title" text COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default" NOT NULL,
  "phase" "public"."RndPhase" NOT NULL DEFAULT 'Idea'::"RndPhase",
  "progress" int4 NOT NULL DEFAULT 0,
  "risks" text[] COLLATE "pg_catalog"."default",
  "dependencies" text[] COLLATE "pg_catalog"."default",
  "lead" text COLLATE "pg_catalog"."default" NOT NULL,
  "budget" float8 NOT NULL,
  "city" "public"."City" NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL,
  "actualCost" float8 NOT NULL DEFAULT 0,
  "actualLiveDate" timestamp(3),
  "milestones" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "notes" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::text,
  "status" "public"."RndStatus" NOT NULL DEFAULT 'Active'::"RndStatus",
  "targetDate" timestamp(3)
)
;

-- ----------------------------
-- Records of RndProject
-- ----------------------------
INSERT INTO "public"."RndProject" VALUES ('4b5879d2-7a6a-47df-86a1-cf2b00a38bf7', 'AI DJ Beat Matching Assistant', 'Machine learning algorithm to suggest next tracks based on crowd energy', 'Idea', 10, '{"Data privacy","Accuracy requirements"}', '{"Crowd monitoring cameras","Training dataset"}', 'Nando', 8000000, 'jakarta', '2025-12-01 08:20:14.396', '2025-12-01 08:20:14.396', 500000, NULL, '[{"title": "Research phase", "dueDate": "2025-12-31", "completed": false}, {"title": "Algorithm development", "dueDate": "2026-03-31", "completed": false}]', 'Initial research in progress', 'Active', '2026-06-30 00:00:00');
INSERT INTO "public"."RndProject" VALUES ('f1720fc9-0c50-4a13-8cdc-7f6c914f2066', 'LED Ceiling Interactive System', 'Ceiling-mounted LED panels with motion tracking for immersive effects', 'Idea', 0, '{"Structural load capacity","Heat dissipation"}', '{"Venue structural approval","Motion sensors"}', 'Chris', 45000000, 'jakarta', '2025-12-01 08:20:14.396', '2025-12-03 06:15:45.181', 12000000, NULL, '[{"title": "Prototype build", "dueDate": "2025-12-01", "completed": true}, {"title": "Motion tracking integration", "dueDate": "2026-01-15", "completed": false}]', 'Waiting for venue approval', 'Active', '2026-02-28 00:00:00');
INSERT INTO "public"."RndProject" VALUES ('8bbb7eec-d429-440e-9074-6419769cebfc', 'Resolume Special FX Integration', 'Advanced particle systems and real-time generative content for DJ drops', 'Idea', 0, '{"GPU performance under load","Content sync timing"}', '{"New media server","Timecode integration"}', 'Ating', 15000000, 'jakarta', '2025-12-01 08:20:14.396', '2025-12-03 06:15:49.98', 9500000, NULL, '[{"title": "Media server setup", "dueDate": "2025-11-15", "completed": true}, {"title": "FX library creation", "dueDate": "2025-12-05", "completed": false}, {"title": "Live testing", "dueDate": "2025-12-18", "completed": false}]', 'Testing on December 10 with special event', 'Active', '2025-12-20 00:00:00');

-- ----------------------------
-- Table structure for RolePermission
-- ----------------------------
DROP TABLE IF EXISTS "public"."RolePermission";
CREATE TABLE "public"."RolePermission" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "role" "public"."UserRole" NOT NULL,
  "permissionId" text COLLATE "pg_catalog"."default" NOT NULL,
  "granted" bool NOT NULL DEFAULT true,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Records of RolePermission
-- ----------------------------

-- ----------------------------
-- Table structure for StockMovement
-- ----------------------------
DROP TABLE IF EXISTS "public"."StockMovement";
CREATE TABLE "public"."StockMovement" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "consumableId" text COLLATE "pg_catalog"."default" NOT NULL,
  "type" "public"."StockMovementType" NOT NULL,
  "quantity" float8 NOT NULL,
  "balanceBefore" float8 NOT NULL,
  "balanceAfter" float8 NOT NULL,
  "unitCost" float8,
  "totalCost" float8,
  "reference" text COLLATE "pg_catalog"."default",
  "notes" text COLLATE "pg_catalog"."default",
  "performedBy" text COLLATE "pg_catalog"."default",
  "city" "public"."City" NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of StockMovement
-- ----------------------------
INSERT INTO "public"."StockMovement" VALUES ('8d19e185-2097-4f34-9fcc-b51a6ae3391c', '3098343d-a407-489d-8db5-6e28a6e00dc6', 'Purchase', 100, 0, 100, 85000, 8500000, 'PO-2025-000', 'Initial stock', 'System', 'jakarta', '2025-11-01 00:00:00');
INSERT INTO "public"."StockMovement" VALUES ('151bda99-a0a3-4259-82f0-33532ec2a2c8', '3098343d-a407-489d-8db5-6e28a6e00dc6', 'Usage', -35, 100, 65, NULL, NULL, 'Event: Weekend Session Nov 15-16', 'Used for Friday and Saturday night events', 'Tech Team', 'jakarta', '2025-11-16 00:00:00');
INSERT INTO "public"."StockMovement" VALUES ('d3336a89-db62-4414-bfe1-5ea85069c26f', '3098343d-a407-489d-8db5-6e28a6e00dc6', 'Usage', -20, 65, 45, NULL, NULL, 'Event: Special Guest DJ', 'Heavy usage for special event', 'Tech Team', 'jakarta', '2025-11-22 00:00:00');
INSERT INTO "public"."StockMovement" VALUES ('c7b84c15-864e-4d33-82c5-b021a2533f45', '542866b5-bf71-4a9e-8ea9-f9715e4a4a9f', 'Purchase', 50, 0, 50, 25000, 1250000, 'PO-2025-000', 'Initial stock', 'System', 'jakarta', '2025-11-01 00:00:00');
INSERT INTO "public"."StockMovement" VALUES ('8e7c0bf9-60a2-47aa-a4c4-ad1de5f12ce6', '542866b5-bf71-4a9e-8ea9-f9715e4a4a9f', 'Usage', -26, 50, 24, NULL, NULL, 'Event: November Events', 'CO2 effects throughout November', 'SFX Team', 'jakarta', '2025-11-20 00:00:00');

-- ----------------------------
-- Table structure for Supplier
-- ----------------------------
DROP TABLE IF EXISTS "public"."Supplier";
CREATE TABLE "public"."Supplier" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "code" text COLLATE "pg_catalog"."default" NOT NULL,
  "contactPerson" text COLLATE "pg_catalog"."default",
  "email" text COLLATE "pg_catalog"."default",
  "phone" text COLLATE "pg_catalog"."default",
  "address" text COLLATE "pg_catalog"."default",
  "city" "public"."City" NOT NULL,
  "taxId" text COLLATE "pg_catalog"."default",
  "paymentTerms" int4 NOT NULL DEFAULT 30,
  "rating" float8 DEFAULT 0,
  "status" "public"."SupplierStatus" NOT NULL DEFAULT 'Active'::"SupplierStatus",
  "notes" text COLLATE "pg_catalog"."default",
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Records of Supplier
-- ----------------------------
INSERT INTO "public"."Supplier" VALUES ('bc71c46e-6e0b-46d3-8aab-002052ee8e26', 'Indonesia SFX Supply', 'SUP-001', 'Budi Santoso', 'budi@sfxsupply.co.id', '+62 21 555-0101', 'Jl. Industri No. 45, Jakarta Utara', 'jakarta', '01.234.567.8-901.000', 30, 4.5, 'Active', 'Reliable supplier for SFX consumables', '2025-12-01 08:20:15.386', '2025-12-01 08:20:15.386');
INSERT INTO "public"."Supplier" VALUES ('7a655977-1034-4c21-a0ab-9546c40436b0', 'Haze Pro Jakarta', 'SUP-002', 'Andi Wijaya', 'andi@hazepro.co.id', '+62 21 555-0202', 'Jl. Teater No. 12, Jakarta Selatan', 'jakarta', '02.345.678.9-012.000', 14, 4.8, 'Active', NULL, '2025-12-01 08:20:15.386', '2025-12-01 08:20:15.386');
INSERT INTO "public"."Supplier" VALUES ('c3f6bc12-d628-4838-a1fc-72d19487a76a', 'Global Tech Supplies', 'SUP-004', 'John Smith', 'john@globaltech.co.id', '+62 21 555-0404', 'Kawasan Industri MM2100, Bekasi', 'jakarta', '04.567.890.1-234.000', 45, 4.6, 'Active', 'Specializes in audio/lighting equipment consumables', '2025-12-01 08:20:15.386', '2025-12-01 08:20:15.386');
INSERT INTO "public"."Supplier" VALUES ('13b51bbc-b616-4ebf-9b4c-c13ce7af07d1', 'Fantasy Work', 'SUP-003', 'Made Suryadi', 'made@balieventsupplies.com', '+62 361 555-0303', 'Jl. Sunset Road No. 88, Bali', 'bali', '03.456.789.0-123.000', 30, 5, 'Active', '', '2025-12-01 08:20:15.386', '2025-12-03 11:49:10.174');

-- ----------------------------
-- Table structure for User
-- ----------------------------
DROP TABLE IF EXISTS "public"."User";
CREATE TABLE "public"."User" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "email" text COLLATE "pg_catalog"."default" NOT NULL,
  "password" text COLLATE "pg_catalog"."default" NOT NULL,
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "role" "public"."UserRole" NOT NULL DEFAULT 'operator'::"UserRole",
  "cities" "public"."City"[],
  "isActive" bool NOT NULL DEFAULT true,
  "lastLogin" timestamp(3),
  "refreshToken" text COLLATE "pg_catalog"."default",
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Records of User
-- ----------------------------
INSERT INTO "public"."User" VALUES ('59127e74-e727-404c-b82f-bde6295f3534', 'manager.bali@vaultclub.com', '$2b$10$2xQoIVJMNRHOBhbTEzEGkuzMq.MQ1YulF2aabF4kUAKuT9nRAaXF2', 'Bali Manager', 'manager', '{bali}', 't', NULL, NULL, '2025-12-01 08:20:01.873', '2025-12-01 08:20:01.873');
INSERT INTO "public"."User" VALUES ('7c2ea39b-2b67-4308-ba29-02ad8d247f4e', 'operator@vaultclub.com', '$2b$10$tYGjnIJElQ4c4sBoLug2s.79KRuteqVA0dB9xlGrJ0A3Pp4xXaqK6', 'Operator User', 'operator', '{jakarta}', 't', '2025-12-03 16:01:25.892', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3YzJlYTM5Yi0yYjY3LTQzMDgtYmEyOS0wMmFkOGQyNDdmNGUiLCJlbWFpbCI6Im9wZXJhdG9yQHZhdWx0Y2x1Yi5jb20iLCJyb2xlIjoib3BlcmF0b3IiLCJjaXRpZXMiOlsiamFrYXJ0YSJdLCJpYXQiOjE3NjQ3Nzc2ODUsImV4cCI6MTc2NTM4MjQ4NX0.ZfzbVWu0RfhyXzEGgVC125sryxNX1a2YL2Cge8sDrK4', '2025-12-01 08:20:01.873', '2025-12-03 16:01:25.893');
INSERT INTO "public"."User" VALUES ('4de8fbdb-5927-4cab-a37e-a38434559b5e', 'admin@vaultclub.com', '$2b$10$f6wPyywaIVNzMRtl.hLF6Oc54PD1CnB9uWFg.wLQGfMz2TUIl66CK', 'Admin User', 'admin', '{jakarta,bali}', 't', '2025-12-03 10:01:04.045', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0ZGU4ZmJkYi01OTI3LTRjYWItYTM3ZS1hMzg0MzQ1NTliNWUiLCJlbWFpbCI6ImFkbWluQHZhdWx0Y2x1Yi5jb20iLCJyb2xlIjoiYWRtaW4iLCJjaXRpZXMiOlsiamFrYXJ0YSIsImJhbGkiXSwiaWF0IjoxNzY0NzU2MDY0LCJleHAiOjE3NjUzNjA4NjR9.WQ-AElA-GSnivG03MbXv13q0qkVhSkK0LNUqd22vhak', '2025-12-01 08:20:01.873', '2025-12-03 10:01:04.046');
INSERT INTO "public"."User" VALUES ('e2ebd061-87a9-4318-bf39-2b1df171e78e', 'manager.jakarta@vaultclub.com', '$2b$10$2xQoIVJMNRHOBhbTEzEGkuzMq.MQ1YulF2aabF4kUAKuT9nRAaXF2', 'Jakarta Manager', 'manager', '{jakarta}', 't', '2025-12-03 14:58:34.297', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlMmViZDA2MS04N2E5LTQzMTgtYmYzOS0yYjFkZjE3MWU3OGUiLCJlbWFpbCI6Im1hbmFnZXIuamFrYXJ0YUB2YXVsdGNsdWIuY29tIiwicm9sZSI6Im1hbmFnZXIiLCJjaXRpZXMiOlsiamFrYXJ0YSJdLCJpYXQiOjE3NjQ3NzM5MTQsImV4cCI6MTc2NTM3ODcxNH0.10mWqfhbPINR2G2YiqvlnaHFZ6XJd_ne5rd-xmrWLak', '2025-12-01 08:20:01.873', '2025-12-03 14:58:34.298');

-- ----------------------------
-- Indexes structure for table Alert
-- ----------------------------
CREATE INDEX "Alert_acknowledged_idx" ON "public"."Alert" USING btree (
  "acknowledged" "pg_catalog"."bool_ops" ASC NULLS LAST
);
CREATE INDEX "Alert_city_idx" ON "public"."Alert" USING btree (
  "city" "pg_catalog"."enum_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table Alert
-- ----------------------------
ALTER TABLE "public"."Alert" ADD CONSTRAINT "Alert_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table Area
-- ----------------------------
CREATE INDEX "Area_city_idx" ON "public"."Area" USING btree (
  "city" "pg_catalog"."enum_ops" ASC NULLS LAST
);
CREATE INDEX "Area_isActive_idx" ON "public"."Area" USING btree (
  "isActive" "pg_catalog"."bool_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "Area_name_key" ON "public"."Area" USING btree (
  "name" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table Area
-- ----------------------------
ALTER TABLE "public"."Area" ADD CONSTRAINT "Area_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table Consumable
-- ----------------------------
CREATE INDEX "Consumable_category_idx" ON "public"."Consumable" USING btree (
  "category" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "Consumable_city_idx" ON "public"."Consumable" USING btree (
  "city" "pg_catalog"."enum_ops" ASC NULLS LAST
);
CREATE INDEX "Consumable_currentStock_idx" ON "public"."Consumable" USING btree (
  "currentStock" "pg_catalog"."float8_ops" ASC NULLS LAST
);
CREATE INDEX "Consumable_supplierId_idx" ON "public"."Consumable" USING btree (
  "supplierId" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table Consumable
-- ----------------------------
ALTER TABLE "public"."Consumable" ADD CONSTRAINT "Consumable_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table CrewMember
-- ----------------------------
CREATE INDEX "CrewMember_city_idx" ON "public"."CrewMember" USING btree (
  "city" "pg_catalog"."enum_ops" ASC NULLS LAST
);
CREATE INDEX "CrewMember_shift_idx" ON "public"."CrewMember" USING btree (
  "shift" "pg_catalog"."enum_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table CrewMember
-- ----------------------------
ALTER TABLE "public"."CrewMember" ADD CONSTRAINT "CrewMember_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table Equipment
-- ----------------------------
CREATE INDEX "Equipment_areaId_idx" ON "public"."Equipment" USING btree (
  "areaId" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "Equipment_city_idx" ON "public"."Equipment" USING btree (
  "city" "pg_catalog"."enum_ops" ASC NULLS LAST
);
CREATE INDEX "Equipment_status_idx" ON "public"."Equipment" USING btree (
  "status" "pg_catalog"."enum_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table Equipment
-- ----------------------------
ALTER TABLE "public"."Equipment" ADD CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table EquipmentInspection
-- ----------------------------
CREATE INDEX "EquipmentInspection_date_idx" ON "public"."EquipmentInspection" USING btree (
  "date" "pg_catalog"."timestamp_ops" ASC NULLS LAST
);
CREATE INDEX "EquipmentInspection_equipmentId_idx" ON "public"."EquipmentInspection" USING btree (
  "equipmentId" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table EquipmentInspection
-- ----------------------------
ALTER TABLE "public"."EquipmentInspection" ADD CONSTRAINT "EquipmentInspection_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table EventBrief
-- ----------------------------
CREATE INDEX "EventBrief_city_idx" ON "public"."EventBrief" USING btree (
  "city" "pg_catalog"."enum_ops" ASC NULLS LAST
);
CREATE INDEX "EventBrief_date_idx" ON "public"."EventBrief" USING btree (
  "date" "pg_catalog"."timestamp_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table EventBrief
-- ----------------------------
ALTER TABLE "public"."EventBrief" ADD CONSTRAINT "EventBrief_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table Incident
-- ----------------------------
CREATE INDEX "Incident_city_idx" ON "public"."Incident" USING btree (
  "city" "pg_catalog"."enum_ops" ASC NULLS LAST
);
CREATE INDEX "Incident_date_idx" ON "public"."Incident" USING btree (
  "date" "pg_catalog"."timestamp_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table Incident
-- ----------------------------
ALTER TABLE "public"."Incident" ADD CONSTRAINT "Incident_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table KPIMetrics
-- ----------------------------
CREATE INDEX "KPIMetrics_city_idx" ON "public"."KPIMetrics" USING btree (
  "city" "pg_catalog"."enum_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "KPIMetrics_city_key" ON "public"."KPIMetrics" USING btree (
  "city" "pg_catalog"."enum_ops" ASC NULLS LAST
);
CREATE INDEX "KPIMetrics_weekYear_weekNumber_idx" ON "public"."KPIMetrics" USING btree (
  "weekYear" "pg_catalog"."int4_ops" ASC NULLS LAST,
  "weekNumber" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table KPIMetrics
-- ----------------------------
ALTER TABLE "public"."KPIMetrics" ADD CONSTRAINT "KPIMetrics_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table MaintenanceLog
-- ----------------------------
CREATE INDEX "MaintenanceLog_city_idx" ON "public"."MaintenanceLog" USING btree (
  "city" "pg_catalog"."enum_ops" ASC NULLS LAST
);
CREATE INDEX "MaintenanceLog_equipmentId_idx" ON "public"."MaintenanceLog" USING btree (
  "equipmentId" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "MaintenanceLog_status_idx" ON "public"."MaintenanceLog" USING btree (
  "status" "pg_catalog"."enum_ops" ASC NULLS LAST
);
CREATE INDEX "MaintenanceLog_supplierId_idx" ON "public"."MaintenanceLog" USING btree (
  "supplierId" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "MaintenanceLog_technicianId_idx" ON "public"."MaintenanceLog" USING btree (
  "technicianId" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table MaintenanceLog
-- ----------------------------
ALTER TABLE "public"."MaintenanceLog" ADD CONSTRAINT "MaintenanceLog_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table Notification
-- ----------------------------
CREATE INDEX "Notification_city_idx" ON "public"."Notification" USING btree (
  "city" "pg_catalog"."enum_ops" ASC NULLS LAST
);
CREATE INDEX "Notification_createdAt_idx" ON "public"."Notification" USING btree (
  "createdAt" "pg_catalog"."timestamp_ops" ASC NULLS LAST
);
CREATE INDEX "Notification_read_idx" ON "public"."Notification" USING btree (
  "read" "pg_catalog"."bool_ops" ASC NULLS LAST
);
CREATE INDEX "Notification_userId_idx" ON "public"."Notification" USING btree (
  "userId" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table Notification
-- ----------------------------
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table Permission
-- ----------------------------
CREATE INDEX "Permission_category_idx" ON "public"."Permission" USING btree (
  "category" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "Permission_name_key" ON "public"."Permission" USING btree (
  "name" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table Permission
-- ----------------------------
ALTER TABLE "public"."Permission" ADD CONSTRAINT "Permission_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table Proposal
-- ----------------------------
CREATE INDEX "Proposal_city_idx" ON "public"."Proposal" USING btree (
  "city" "pg_catalog"."enum_ops" ASC NULLS LAST
);
CREATE INDEX "Proposal_status_idx" ON "public"."Proposal" USING btree (
  "status" "pg_catalog"."enum_ops" ASC NULLS LAST
);
CREATE INDEX "Proposal_supplierId_idx" ON "public"."Proposal" USING btree (
  "supplierId" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table Proposal
-- ----------------------------
ALTER TABLE "public"."Proposal" ADD CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table PurchaseOrder
-- ----------------------------
CREATE INDEX "PurchaseOrder_city_idx" ON "public"."PurchaseOrder" USING btree (
  "city" "pg_catalog"."enum_ops" ASC NULLS LAST
);
CREATE INDEX "PurchaseOrder_orderNumber_idx" ON "public"."PurchaseOrder" USING btree (
  "orderNumber" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "PurchaseOrder_orderNumber_key" ON "public"."PurchaseOrder" USING btree (
  "orderNumber" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "PurchaseOrder_status_idx" ON "public"."PurchaseOrder" USING btree (
  "status" "pg_catalog"."enum_ops" ASC NULLS LAST
);
CREATE INDEX "PurchaseOrder_supplierId_idx" ON "public"."PurchaseOrder" USING btree (
  "supplierId" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table PurchaseOrder
-- ----------------------------
ALTER TABLE "public"."PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table PurchaseOrderItem
-- ----------------------------
CREATE INDEX "PurchaseOrderItem_consumableId_idx" ON "public"."PurchaseOrderItem" USING btree (
  "consumableId" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "PurchaseOrderItem_purchaseOrderId_idx" ON "public"."PurchaseOrderItem" USING btree (
  "purchaseOrderId" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table PurchaseOrderItem
-- ----------------------------
ALTER TABLE "public"."PurchaseOrderItem" ADD CONSTRAINT "PurchaseOrderItem_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table PushSubscription
-- ----------------------------
CREATE INDEX "PushSubscription_endpoint_idx" ON "public"."PushSubscription" USING btree (
  "endpoint" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "PushSubscription_endpoint_key" ON "public"."PushSubscription" USING btree (
  "endpoint" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "PushSubscription_userId_idx" ON "public"."PushSubscription" USING btree (
  "userId" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table PushSubscription
-- ----------------------------
ALTER TABLE "public"."PushSubscription" ADD CONSTRAINT "PushSubscription_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table RndProject
-- ----------------------------
CREATE INDEX "RndProject_city_idx" ON "public"."RndProject" USING btree (
  "city" "pg_catalog"."enum_ops" ASC NULLS LAST
);
CREATE INDEX "RndProject_phase_idx" ON "public"."RndProject" USING btree (
  "phase" "pg_catalog"."enum_ops" ASC NULLS LAST
);
CREATE INDEX "RndProject_status_idx" ON "public"."RndProject" USING btree (
  "status" "pg_catalog"."enum_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table RndProject
-- ----------------------------
ALTER TABLE "public"."RndProject" ADD CONSTRAINT "RndProject_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table RolePermission
-- ----------------------------
CREATE INDEX "RolePermission_permissionId_idx" ON "public"."RolePermission" USING btree (
  "permissionId" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "RolePermission_role_idx" ON "public"."RolePermission" USING btree (
  "role" "pg_catalog"."enum_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "RolePermission_role_permissionId_key" ON "public"."RolePermission" USING btree (
  "role" "pg_catalog"."enum_ops" ASC NULLS LAST,
  "permissionId" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table RolePermission
-- ----------------------------
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table StockMovement
-- ----------------------------
CREATE INDEX "StockMovement_city_idx" ON "public"."StockMovement" USING btree (
  "city" "pg_catalog"."enum_ops" ASC NULLS LAST
);
CREATE INDEX "StockMovement_consumableId_idx" ON "public"."StockMovement" USING btree (
  "consumableId" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "StockMovement_createdAt_idx" ON "public"."StockMovement" USING btree (
  "createdAt" "pg_catalog"."timestamp_ops" ASC NULLS LAST
);
CREATE INDEX "StockMovement_type_idx" ON "public"."StockMovement" USING btree (
  "type" "pg_catalog"."enum_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table StockMovement
-- ----------------------------
ALTER TABLE "public"."StockMovement" ADD CONSTRAINT "StockMovement_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table Supplier
-- ----------------------------
CREATE INDEX "Supplier_city_idx" ON "public"."Supplier" USING btree (
  "city" "pg_catalog"."enum_ops" ASC NULLS LAST
);
CREATE INDEX "Supplier_code_idx" ON "public"."Supplier" USING btree (
  "code" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "Supplier_code_key" ON "public"."Supplier" USING btree (
  "code" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "Supplier_status_idx" ON "public"."Supplier" USING btree (
  "status" "pg_catalog"."enum_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table Supplier
-- ----------------------------
ALTER TABLE "public"."Supplier" ADD CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table User
-- ----------------------------
CREATE INDEX "User_email_idx" ON "public"."User" USING btree (
  "email" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "User_email_key" ON "public"."User" USING btree (
  "email" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "User_role_idx" ON "public"."User" USING btree (
  "role" "pg_catalog"."enum_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table User
-- ----------------------------
ALTER TABLE "public"."User" ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table Consumable
-- ----------------------------
ALTER TABLE "public"."Consumable" ADD CONSTRAINT "Consumable_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "public"."Supplier" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table Equipment
-- ----------------------------
ALTER TABLE "public"."Equipment" ADD CONSTRAINT "Equipment_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "public"."Area" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table EquipmentInspection
-- ----------------------------
ALTER TABLE "public"."EquipmentInspection" ADD CONSTRAINT "EquipmentInspection_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "public"."Equipment" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table MaintenanceLog
-- ----------------------------
ALTER TABLE "public"."MaintenanceLog" ADD CONSTRAINT "MaintenanceLog_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "public"."Equipment" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."MaintenanceLog" ADD CONSTRAINT "MaintenanceLog_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "public"."Supplier" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."MaintenanceLog" ADD CONSTRAINT "MaintenanceLog_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "public"."CrewMember" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table Notification
-- ----------------------------
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table Proposal
-- ----------------------------
ALTER TABLE "public"."Proposal" ADD CONSTRAINT "Proposal_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "public"."Supplier" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table PurchaseOrder
-- ----------------------------
ALTER TABLE "public"."PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "public"."Supplier" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table PurchaseOrderItem
-- ----------------------------
ALTER TABLE "public"."PurchaseOrderItem" ADD CONSTRAINT "PurchaseOrderItem_consumableId_fkey" FOREIGN KEY ("consumableId") REFERENCES "public"."Consumable" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."PurchaseOrderItem" ADD CONSTRAINT "PurchaseOrderItem_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "public"."PurchaseOrder" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table PushSubscription
-- ----------------------------
ALTER TABLE "public"."PushSubscription" ADD CONSTRAINT "PushSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table RolePermission
-- ----------------------------
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "public"."Permission" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table StockMovement
-- ----------------------------
ALTER TABLE "public"."StockMovement" ADD CONSTRAINT "StockMovement_consumableId_fkey" FOREIGN KEY ("consumableId") REFERENCES "public"."Consumable" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
