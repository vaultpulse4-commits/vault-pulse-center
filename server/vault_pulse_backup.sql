--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: AlertType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AlertType" AS ENUM (
    'critical',
    'warning',
    'info'
);


ALTER TYPE public."AlertType" OWNER TO postgres;

--
-- Name: BriefStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."BriefStatus" AS ENUM (
    'Draft',
    'Final'
);


ALTER TYPE public."BriefStatus" OWNER TO postgres;

--
-- Name: City; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."City" AS ENUM (
    'jakarta',
    'bali'
);


ALTER TYPE public."City" OWNER TO postgres;

--
-- Name: EquipmentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EquipmentStatus" AS ENUM (
    'Ready',
    'Degraded',
    'OOS',
    'In_Transit',
    'Spare'
);


ALTER TYPE public."EquipmentStatus" OWNER TO postgres;

--
-- Name: IncidentType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."IncidentType" AS ENUM (
    'Audio',
    'Lighting',
    'Video',
    'Power',
    'Safety'
);


ALTER TYPE public."IncidentType" OWNER TO postgres;

--
-- Name: MaintenanceStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MaintenanceStatus" AS ENUM (
    'Completed',
    'In_Progress',
    'Scheduled'
);


ALTER TYPE public."MaintenanceStatus" OWNER TO postgres;

--
-- Name: MaintenanceType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MaintenanceType" AS ENUM (
    'Preventive',
    'Corrective'
);


ALTER TYPE public."MaintenanceType" OWNER TO postgres;

--
-- Name: NotificationCategory; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."NotificationCategory" AS ENUM (
    'EQUIPMENT',
    'MAINTENANCE',
    'INVENTORY',
    'EVENT',
    'SYSTEM',
    'APPROVAL'
);


ALTER TYPE public."NotificationCategory" OWNER TO postgres;

--
-- Name: NotificationType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."NotificationType" AS ENUM (
    'CRITICAL',
    'WARNING',
    'INFO',
    'SUCCESS'
);


ALTER TYPE public."NotificationType" OWNER TO postgres;

--
-- Name: ProposalStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ProposalStatus" AS ENUM (
    'Pending',
    'Approved',
    'Rejected',
    'Completed'
);


ALTER TYPE public."ProposalStatus" OWNER TO postgres;

--
-- Name: ProposalType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ProposalType" AS ENUM (
    'CapEx',
    'OpEx'
);


ALTER TYPE public."ProposalType" OWNER TO postgres;

--
-- Name: ProposalUrgency; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ProposalUrgency" AS ENUM (
    'High',
    'Medium',
    'Low'
);


ALTER TYPE public."ProposalUrgency" OWNER TO postgres;

--
-- Name: PurchaseOrderStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PurchaseOrderStatus" AS ENUM (
    'Draft',
    'Submitted',
    'Approved',
    'Ordered',
    'PartiallyReceived',
    'Received',
    'Cancelled'
);


ALTER TYPE public."PurchaseOrderStatus" OWNER TO postgres;

--
-- Name: RiskLevel; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RiskLevel" AS ENUM (
    'Low',
    'Med',
    'High'
);


ALTER TYPE public."RiskLevel" OWNER TO postgres;

--
-- Name: RndPhase; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RndPhase" AS ENUM (
    'Idea',
    'POC',
    'Pilot',
    'Live'
);


ALTER TYPE public."RndPhase" OWNER TO postgres;

--
-- Name: RndStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RndStatus" AS ENUM (
    'Active',
    'OnHold',
    'Completed',
    'Archived'
);


ALTER TYPE public."RndStatus" OWNER TO postgres;

--
-- Name: ShiftType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ShiftType" AS ENUM (
    'day',
    'night'
);


ALTER TYPE public."ShiftType" OWNER TO postgres;

--
-- Name: StockMovementType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."StockMovementType" AS ENUM (
    'Purchase',
    'Usage',
    'Adjustment',
    'Return',
    'Transfer',
    'Waste'
);


ALTER TYPE public."StockMovementType" OWNER TO postgres;

--
-- Name: SupplierStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SupplierStatus" AS ENUM (
    'Active',
    'Inactive',
    'Suspended'
);


ALTER TYPE public."SupplierStatus" OWNER TO postgres;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserRole" AS ENUM (
    'admin',
    'manager',
    'operator'
);


ALTER TYPE public."UserRole" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Alert; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Alert" (
    id text NOT NULL,
    type public."AlertType" NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    acknowledged boolean DEFAULT false NOT NULL,
    city public."City" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Alert" OWNER TO postgres;

--
-- Name: Area; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Area" (
    id text NOT NULL,
    name text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    city public."City",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Area" OWNER TO postgres;

--
-- Name: Consumable; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Consumable" (
    id text NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    "currentStock" double precision DEFAULT 0 NOT NULL,
    "reorderPoint" integer DEFAULT 0 NOT NULL,
    unit text NOT NULL,
    city public."City" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    description text,
    image text,
    location text,
    "maxStock" integer,
    "minStock" integer DEFAULT 0 NOT NULL,
    "reorderQty" integer DEFAULT 0 NOT NULL,
    "unitCost" double precision DEFAULT 0 NOT NULL,
    "supplierId" text
);


ALTER TABLE public."Consumable" OWNER TO postgres;

--
-- Name: CrewMember; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CrewMember" (
    id text NOT NULL,
    name text NOT NULL,
    role text NOT NULL,
    shift public."ShiftType" NOT NULL,
    assigned boolean DEFAULT false NOT NULL,
    city public."City" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CrewMember" OWNER TO postgres;

--
-- Name: Equipment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Equipment" (
    id text NOT NULL,
    name text NOT NULL,
    status public."EquipmentStatus" DEFAULT 'Ready'::public."EquipmentStatus" NOT NULL,
    "lastInspection" timestamp(3) without time zone NOT NULL,
    "nextDue" timestamp(3) without time zone NOT NULL,
    firmware text NOT NULL,
    city public."City" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    photo text,
    "areaId" text
);


ALTER TABLE public."Equipment" OWNER TO postgres;

--
-- Name: EquipmentInspection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EquipmentInspection" (
    id text NOT NULL,
    "equipmentId" text NOT NULL,
    inspector text NOT NULL,
    condition text NOT NULL,
    notes text NOT NULL,
    issues text[],
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."EquipmentInspection" OWNER TO postgres;

--
-- Name: EventBrief; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EventBrief" (
    id text NOT NULL,
    artist text NOT NULL,
    genre text DEFAULT ''::text NOT NULL,
    "setTimes" text DEFAULT ''::text NOT NULL,
    "stagePlotLink" text,
    "inputListLink" text,
    "monitorNeeds" text DEFAULT ''::text NOT NULL,
    "ljCueNotes" text DEFAULT ''::text NOT NULL,
    "vjContentChecklist" text DEFAULT ''::text NOT NULL,
    "timecodeRouting" text DEFAULT ''::text NOT NULL,
    "sfxNotes" text DEFAULT ''::text NOT NULL,
    "briefStatus" public."BriefStatus" DEFAULT 'Draft'::public."BriefStatus" NOT NULL,
    "riskLevel" public."RiskLevel" DEFAULT 'Low'::public."RiskLevel" NOT NULL,
    city public."City" NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "audioOrder" text DEFAULT ''::text NOT NULL,
    "brandMoment" text DEFAULT ''::text NOT NULL,
    "liveSetRecording" text DEFAULT ''::text NOT NULL,
    "specialLightingOrder" text DEFAULT ''::text NOT NULL,
    "visualOrder" text DEFAULT ''::text NOT NULL
);


ALTER TABLE public."EventBrief" OWNER TO postgres;

--
-- Name: Incident; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Incident" (
    id text NOT NULL,
    type public."IncidentType" NOT NULL,
    description text NOT NULL,
    "rootCause" text NOT NULL,
    prevention text NOT NULL,
    impact text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    city public."City" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Incident" OWNER TO postgres;

--
-- Name: KPIMetrics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."KPIMetrics" (
    id text NOT NULL,
    city public."City" NOT NULL,
    "nightsOpen" integer NOT NULL,
    "equipmentUptimePercentage" double precision NOT NULL,
    "issuesRaised" integer NOT NULL,
    "issuesResolved" integer NOT NULL,
    "powerIncidents" integer NOT NULL,
    "weekYear" integer NOT NULL,
    "weekNumber" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."KPIMetrics" OWNER TO postgres;

--
-- Name: MaintenanceLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MaintenanceLog" (
    id text NOT NULL,
    type public."MaintenanceType" NOT NULL,
    issue text NOT NULL,
    status public."MaintenanceStatus" DEFAULT 'Scheduled'::public."MaintenanceStatus" NOT NULL,
    mttr double precision,
    cost double precision NOT NULL,
    parts text[],
    date timestamp(3) without time zone NOT NULL,
    city public."City" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "equipmentId" text,
    notes text DEFAULT ''::text NOT NULL,
    "technicianId" text,
    photo text DEFAULT ''::text NOT NULL,
    "supplierId" text
);


ALTER TABLE public."MaintenanceLog" OWNER TO postgres;

--
-- Name: Notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Notification" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type public."NotificationType" NOT NULL,
    category public."NotificationCategory" NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    data jsonb,
    city public."City",
    read boolean DEFAULT false NOT NULL,
    "readAt" timestamp(3) without time zone,
    "actionUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Notification" OWNER TO postgres;

--
-- Name: Permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Permission" (
    id text NOT NULL,
    name text NOT NULL,
    "displayName" text NOT NULL,
    description text,
    category text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Permission" OWNER TO postgres;

--
-- Name: Proposal; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Proposal" (
    id text NOT NULL,
    title text NOT NULL,
    type public."ProposalType" NOT NULL,
    urgency public."ProposalUrgency" NOT NULL,
    estimate double precision NOT NULL,
    vendor text DEFAULT ''::text NOT NULL,
    status public."ProposalStatus" DEFAULT 'Pending'::public."ProposalStatus" NOT NULL,
    owner text NOT NULL,
    "nextAction" text DEFAULT ''::text NOT NULL,
    city public."City" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    "quotesCount" integer DEFAULT 0 NOT NULL,
    "targetDate" timestamp(3) without time zone,
    "estimateApproved" boolean DEFAULT false NOT NULL,
    "estimateApprovedBy" text,
    "quotesPdfs" text[] DEFAULT ARRAY[]::text[],
    "supplierId" text
);


ALTER TABLE public."Proposal" OWNER TO postgres;

--
-- Name: PurchaseOrder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PurchaseOrder" (
    id text NOT NULL,
    "orderNumber" text NOT NULL,
    "supplierId" text NOT NULL,
    "orderDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "expectedDate" timestamp(3) without time zone,
    "receivedDate" timestamp(3) without time zone,
    status public."PurchaseOrderStatus" DEFAULT 'Draft'::public."PurchaseOrderStatus" NOT NULL,
    "totalAmount" double precision DEFAULT 0 NOT NULL,
    notes text,
    city public."City" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PurchaseOrder" OWNER TO postgres;

--
-- Name: PurchaseOrderItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PurchaseOrderItem" (
    id text NOT NULL,
    "purchaseOrderId" text NOT NULL,
    "consumableId" text NOT NULL,
    quantity double precision NOT NULL,
    "receivedQty" double precision DEFAULT 0 NOT NULL,
    "unitPrice" double precision NOT NULL,
    "totalPrice" double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PurchaseOrderItem" OWNER TO postgres;

--
-- Name: PushSubscription; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PushSubscription" (
    id text NOT NULL,
    "userId" text NOT NULL,
    endpoint text NOT NULL,
    p256dh text NOT NULL,
    auth text NOT NULL,
    "userAgent" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PushSubscription" OWNER TO postgres;

--
-- Name: RndProject; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RndProject" (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    phase public."RndPhase" DEFAULT 'Idea'::public."RndPhase" NOT NULL,
    progress integer DEFAULT 0 NOT NULL,
    risks text[],
    dependencies text[],
    lead text NOT NULL,
    budget double precision NOT NULL,
    city public."City" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "actualCost" double precision DEFAULT 0 NOT NULL,
    "actualLiveDate" timestamp(3) without time zone,
    milestones jsonb DEFAULT '[]'::jsonb NOT NULL,
    notes text DEFAULT ''::text NOT NULL,
    status public."RndStatus" DEFAULT 'Active'::public."RndStatus" NOT NULL,
    "targetDate" timestamp(3) without time zone
);


ALTER TABLE public."RndProject" OWNER TO postgres;

--
-- Name: RolePermission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RolePermission" (
    id text NOT NULL,
    role public."UserRole" NOT NULL,
    "permissionId" text NOT NULL,
    granted boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."RolePermission" OWNER TO postgres;

--
-- Name: StockMovement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StockMovement" (
    id text NOT NULL,
    "consumableId" text NOT NULL,
    type public."StockMovementType" NOT NULL,
    quantity double precision NOT NULL,
    "balanceBefore" double precision NOT NULL,
    "balanceAfter" double precision NOT NULL,
    "unitCost" double precision,
    "totalCost" double precision,
    reference text,
    notes text,
    "performedBy" text,
    city public."City" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."StockMovement" OWNER TO postgres;

--
-- Name: Supplier; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Supplier" (
    id text NOT NULL,
    name text NOT NULL,
    code text NOT NULL,
    "contactPerson" text,
    email text,
    phone text,
    address text,
    city public."City" NOT NULL,
    "taxId" text,
    "paymentTerms" integer DEFAULT 30 NOT NULL,
    rating double precision DEFAULT 0,
    status public."SupplierStatus" DEFAULT 'Active'::public."SupplierStatus" NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Supplier" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    name text NOT NULL,
    role public."UserRole" DEFAULT 'operator'::public."UserRole" NOT NULL,
    cities public."City"[],
    "isActive" boolean DEFAULT true NOT NULL,
    "lastLogin" timestamp(3) without time zone,
    "refreshToken" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: Alert; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Alert" (id, type, title, message, "timestamp", acknowledged, city, "createdAt", "updatedAt") FROM stdin;
179a04dc-499c-4a9a-883f-90c1ea28f0f8	critical	SPL Violation	Sound levels exceeded 110 dB at 23:45. Immediate attention required.	2025-11-28 07:39:36.571	f	jakarta	2025-11-28 07:39:36.572	2025-11-28 07:39:36.572
c9a0c809-4ec2-4d32-85cf-7c47ba55a911	warning	Equipment Maintenance Due	LED Wall Controller requires inspection within 2 days.	2025-11-28 07:39:36.571	f	jakarta	2025-11-28 07:39:36.572	2025-11-28 07:39:36.572
\.


--
-- Data for Name: Area; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Area" (id, name, description, "isActive", city, "createdAt", "updatedAt") FROM stdin;
01cbcc3b-aeaf-4f8e-9b56-a45c1f1e5726	FOH	Front of House	t	\N	2025-11-28 07:39:36.522	2025-11-28 07:39:36.522
9b30a758-aad5-4d95-9aed-41b9efea3a15	Booth	DJ Booth	t	\N	2025-11-28 07:39:36.523	2025-11-28 07:39:36.523
896a95c6-7425-4867-b080-e5129f28f3c2	Stage	Main Stage	t	\N	2025-11-28 07:39:36.525	2025-11-28 07:39:36.525
6a924297-2bac-4da5-86b1-0f34958d8412	DJ Pit	DJ Performance Area	t	\N	2025-11-28 07:39:36.526	2025-11-28 07:39:36.526
6653226d-569b-4c09-b2b4-7f4a83f8e1eb	LED Wall	LED Wall System	t	\N	2025-11-28 07:39:36.527	2025-11-28 07:39:36.527
74b22cc8-abc4-4646-850b-65c526ea4390	Dimmer Room	Dimmer & Power Distribution	t	\N	2025-11-28 07:39:36.528	2025-11-28 07:39:36.528
b8018e3a-289e-4a29-a9f6-1112a07150b4	Amp Rack	Amplifier Rack	t	\N	2025-11-28 07:39:36.529	2025-11-28 07:39:36.529
df2c5132-23a8-4794-89ea-1dbba971b255	Power	Main Power Distribution	t	\N	2025-11-28 07:39:36.53	2025-11-28 07:39:36.53
cf872c14-f186-458d-a0ec-15b969879c07	Backstage	Backstage Area	t	\N	2025-11-28 07:39:36.53	2025-11-28 07:39:36.53
22c4dcc6-2f10-47fc-b597-bc69040d310c	VIP	VIP Section	t	\N	2025-11-28 07:39:36.531	2025-11-28 07:39:36.531
db4e34e6-f3d4-4a47-88c3-41c5f223ba97	Bar	Bar Area	t	\N	2025-11-28 07:39:36.531	2025-11-28 07:39:36.531
525c8190-2738-4217-aa39-d0115bfb288e	Entrance	Main Entrance	t	\N	2025-11-28 07:39:36.532	2025-11-28 07:39:36.532
\.


--
-- Data for Name: Consumable; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Consumable" (id, name, category, "currentStock", "reorderPoint", unit, city, "createdAt", "updatedAt", description, image, location, "maxStock", "minStock", "reorderQty", "unitCost", "supplierId") FROM stdin;
6084469e-a139-432a-8dc9-92d3970ee787	CO₂ Cartridges	SFX	14	15	cartridges	jakarta	2025-11-28 07:39:36.557	2025-11-30 18:09:18.708	High-pressure CO2 cartridges for fog cannons and cryo effects	\N	Warehouse A - Shelf 3	100	12	50	25000	\N
fe213a6a-63d5-41c0-8515-63eb733052ae	RAP Consum	RESTING	30	10	PCS	jakarta	2025-11-30 18:12:32.159	2025-11-30 23:44:05.816	\N	\N	B 2507	1000	10	50	500000	5fbd5f39-f703-4ffe-91f6-a6b2b130e1db
17da7cdd-65dd-4089-8965-a20eb96ac10c	Fog Fluid - High Density	SFX	45	25	liters	jakarta	2025-11-28 07:39:36.557	2025-11-28 07:39:36.557	Professional fog machine fluid for dense, long-lasting fog	\N	Warehouse A - Section B	200	20	100	85000	\N
4dfe5ad6-e273-4ed0-8826-10da68e487b9	Confetti Mix - Metallic	SFX	8	6	kg	jakarta	2025-11-28 07:39:36.557	2025-11-28 07:39:36.557	Biodegradable metallic confetti for confetti cannons	\N	Warehouse A - Shelf 5	30	5	15	450000	\N
0bc5311d-9227-4050-bd7d-f0cdabd3ce6a	DMX Cables - 3m	Lighting	15	12	pieces	jakarta	2025-11-28 07:39:36.557	2025-11-28 07:39:36.557	3-pin DMX cables, 3 meters, professional grade	\N	Tech Room - Drawer 2	50	10	20	75000	\N
3aea3730-b43b-4b76-8328-06b3500ecf74	LED Par Can Filters - CTB	Lighting	25	18	sheets	jakarta	2025-11-28 07:39:36.557	2025-11-28 07:39:36.557	Color correction filters (CTB) for LED Par cans	\N	Tech Room - Cabinet A	100	15	40	35000	\N
2200b44c-abb9-4809-8606-188a97de609c	Gaffer Tape - Black 2"	General	12	10	rolls	jakarta	2025-11-28 07:39:36.557	2025-11-28 07:39:36.557	Professional gaffer tape, black, 2 inch width	\N	General Storage - Bin 1	40	8	24	95000	\N
a7ed9062-000d-4559-a2df-40ab9bfbc074	XLR Cables - 5m	Audio	20	15	pieces	jakarta	2025-11-28 07:39:36.557	2025-11-28 07:39:36.557	Balanced XLR microphone cables, 5 meters	\N	Audio Room - Rack B	60	12	30	125000	\N
ed98f3aa-539f-49c0-8fbc-f3fc72977485	CO₂ Cartridges	SFX	18	12	cartridges	bali	2025-11-28 07:39:36.557	2025-11-28 07:39:36.557	High-pressure CO2 cartridges for fog cannons and cryo effects	\N	Storage - Shelf A	80	10	40	27000	\N
3246fe5a-69c8-4b7c-a748-1d0b545f02e7	Fog Fluid - Standard	SFX	32	20	liters	bali	2025-11-28 07:39:36.557	2025-11-28 07:39:36.557	Standard fog machine fluid	\N	Storage - Section C	150	15	80	78000	\N
dda752f2-c11a-4efa-b95a-8a2b2cebc5b8	Bubble Fluid	SFX	22	12	liters	bali	2025-11-28 07:39:36.557	2025-11-28 07:39:36.557	Professional bubble machine fluid	\N	Storage - Shelf B	60	10	30	65000	\N
addcfcfe-a585-4f21-8ab5-be579867d6c8	DMX Cables - 5m	Lighting	12	10	pieces	bali	2025-11-28 07:39:36.557	2025-11-28 07:39:36.557	3-pin DMX cables, 5 meters	\N	Tech Storage - Box 1	40	8	16	95000	\N
df9d06f2-3661-4425-bc52-89c354514388	Gaffer Tape - White 2"	General	8	6	rolls	bali	2025-11-28 07:39:36.557	2025-11-28 07:39:36.557	Professional gaffer tape, white, 2 inch width	\N	General Storage	30	5	18	95000	\N
f67068f0-2e31-4d16-829e-9ef67f51c1c3	Power Cables - IEC	General	16	12	pieces	bali	2025-11-28 07:39:36.557	2025-11-28 07:39:36.557	Standard IEC power cables, 2 meters	\N	General Storage	50	10	25	45000	\N
6b3074c0-ea62-4d33-8034-38ddbc059605	Battery 9V Alkaline	Audio	74	30	pieces	jakarta	2025-11-28 07:39:36.557	2025-11-30 18:05:03.289	Alkaline 9V batteries for wireless mics	\N	Audio Room - Drawer 3	200	24	100	15000	6b2562ee-f57e-4c89-a125-854a454bd543
\.


--
-- Data for Name: CrewMember; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CrewMember" (id, name, role, shift, assigned, city, "createdAt", "updatedAt") FROM stdin;
fef8c185-aa08-4001-8b41-03b507adfeea	Chris	Engineer Day	day	t	jakarta	2025-11-28 07:39:36.538	2025-11-28 07:39:36.538
50b5e30c-f0e7-4a52-9ca0-e394659c0b7a	Nando	Engineer Night	night	t	jakarta	2025-11-28 07:39:36.538	2025-11-28 07:39:36.538
3b76e93c-14fe-4bcf-a1ae-786699681785	Dhipa	Sound Engineer	night	t	jakarta	2025-11-28 07:39:36.538	2025-11-28 07:39:36.538
58e9935d-e57e-42f9-83ba-34af0e4ecec5	Jerry	Sound Engineer	night	f	jakarta	2025-11-28 07:39:36.538	2025-11-28 07:39:36.538
8ad1c9ff-ac6a-411c-8bda-58e9927e48a1	Ating	Visual Jockey	night	t	jakarta	2025-11-28 07:39:36.538	2025-11-28 07:39:36.538
7ba3feba-dd48-4b44-8ca7-3861861e8237	Helmi	Lighting Jockey	night	t	jakarta	2025-11-28 07:39:36.538	2025-11-28 07:39:36.538
2cedaf79-417a-4404-86dc-c4bb6534d530	Kukuh	Engineer Day	day	t	bali	2025-11-28 07:39:36.538	2025-11-28 07:39:36.538
aa01a4bc-510f-448e-94c2-87386df99e6a	Pungku	Engineer Day	day	t	bali	2025-11-28 07:39:36.538	2025-11-28 07:39:36.538
be50876d-ae9f-4e79-bcd7-bb88d22b5c17	Andra	Engineer Night	night	t	bali	2025-11-28 07:39:36.538	2025-11-28 07:39:36.538
d383f65b-87c5-4dc3-a099-c4e23a297fcd	Made	Sound Engineer	night	t	bali	2025-11-28 07:39:36.538	2025-11-28 07:39:36.538
18eee294-0b0e-4d6f-a219-26713363799c	Slengky	Visual Jockey	night	t	bali	2025-11-28 07:39:36.538	2025-11-28 07:39:36.538
da7102c4-9f91-485e-909c-fe417b06b20e	Budi	Lighting Jockey	night	t	bali	2025-11-28 07:39:36.538	2025-11-28 07:39:36.538
2137f673-dd4c-46b7-942c-20a706e84580	Soon	Technical Asst	night	f	bali	2025-11-28 07:39:36.538	2025-11-28 07:39:36.538
\.


--
-- Data for Name: Equipment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Equipment" (id, name, status, "lastInspection", "nextDue", firmware, city, "createdAt", "updatedAt", description, photo, "areaId") FROM stdin;
163c1ced-3ed9-4411-8e1b-7fd99961ffa7	Void Nexus Speakers	Ready	2025-11-28 14:25:32.909	2025-08-31 00:00:00	v1.8.2	jakarta	2025-11-28 07:39:36.534	2025-11-28 14:25:32.913	Main PA system for front of house	\N	01cbcc3b-aeaf-4f8e-9b56-a45c1f1e5726
f53e9881-88e3-4a98-b49d-831dd500a930	CDJ 3000 #1	Ready	2025-11-28 14:32:54.801	2025-09-01 00:00:00	v2.1.4	jakarta	2025-11-28 07:39:36.534	2025-11-28 14:32:54.806	Professional DJ deck for main booth	\N	6a924297-2bac-4da5-86b1-0f34958d8412
6ce7c515-7fb7-46a4-be83-1477828fef6b	LED Wall Controller	Degraded	2025-08-23 00:00:00	2025-08-30 00:00:00	v3.2.1	jakarta	2025-11-28 07:39:36.534	2025-11-28 07:39:36.534	Main LED wall processing unit - needs calibration	\N	6653226d-569b-4c09-b2b4-7f4a83f8e1eb
7ada0ea8-585d-4aa4-add1-3653819ba848	Liquid Smoke Machine	Ready	2025-08-25 00:00:00	2025-09-02 00:00:00	N/A	bali	2025-11-28 07:39:36.534	2025-11-28 07:39:36.534	Low-lying fog machine for stage effects	\N	896a95c6-7425-4867-b080-e5129f28f3c2
a67e4f69-426b-42b1-a6a5-8c64297e02c6	Pioneer DJM-V10	Ready	2025-08-24 00:00:00	2025-08-31 00:00:00	v1.9.0	bali	2025-11-28 07:39:36.534	2025-11-28 07:39:36.534	6-channel professional DJ mixer	\N	9b30a758-aad5-4d95-9aed-41b9efea3a15
e749e1cb-e85e-4794-9f90-070146841f35	Martin MAC Aura	Ready	2025-08-26 00:00:00	2025-09-03 00:00:00	v2.5.0	jakarta	2025-11-28 07:39:36.534	2025-11-28 07:39:36.534	LED wash moving head fixtures	\N	01cbcc3b-aeaf-4f8e-9b56-a45c1f1e5726
\.


--
-- Data for Name: EquipmentInspection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EquipmentInspection" (id, "equipmentId", inspector, condition, notes, issues, date, "createdAt") FROM stdin;
cb58b2bb-797e-4c12-a401-bc43c5d52f7d	f53e9881-88e3-4a98-b49d-831dd500a930	rap	Good	tes	{trssd}	2025-11-28 14:25:15.067	2025-11-28 14:25:15.067
370c88bc-6da6-4e37-8828-27126c8934bb	163c1ced-3ed9-4411-8e1b-7fd99961ffa7	res	Excellent	tr	{qwer}	2025-11-28 14:25:32.909	2025-11-28 14:25:32.909
c85ab94e-cfe4-48a6-b76a-a9733c16bb5a	f53e9881-88e3-4a98-b49d-831dd500a930	asa	Good	rewq	{qwerty}	2025-11-28 14:32:54.801	2025-11-28 14:32:54.801
\.


--
-- Data for Name: EventBrief; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EventBrief" (id, artist, genre, "setTimes", "stagePlotLink", "inputListLink", "monitorNeeds", "ljCueNotes", "vjContentChecklist", "timecodeRouting", "sfxNotes", "briefStatus", "riskLevel", city, date, "createdAt", "updatedAt", "audioOrder", "brandMoment", "liveSetRecording", "specialLightingOrder", "visualOrder") FROM stdin;
3918811c-401e-422d-879f-a3eab40fbf3d	ARTBAT	Melodic Techno	22:00 - 02:00	#	#	2x booth monitors, 1x stage monitor	Sync with drop at 23:15, strobes on breakdown	4K content ready, mapping tested	LTC from CDJ to Resolume	CO₂ cannons on main drop, confetti at end	Final	Low	jakarta	2025-08-28 00:00:00	2025-11-28 07:39:36.536	2025-11-28 07:39:36.536	Main mix + 2x booth monitors, 1x stage monitor for backup vocals	Logo drop at 00:15, sponsor shout-out during break	Multi-track recording, live stream feed ready	Sync with drop at 23:15, strobes on breakdown, haze throughout	4K content ready, mapping tested, LED wall + floor mapping
6ce494dc-9dee-485d-8d6c-c034f7626232	Charlotte de Witte	Techno	21:30 - 01:30	\N	\N	Full booth setup	Dark atmosphere, strobes minimal	Draft - pending approval	TBD	Fog throughout, cold sparks on finale	Draft	Med	jakarta	2025-09-15 00:00:00	2025-11-28 07:39:36.536	2025-11-28 07:39:36.536	Full booth setup with wedge monitors, IEM backup	Silent brand moment during breakdown	Audio recording only, no video	Dark atmosphere, minimal strobes, low key lighting	Black and white visuals, minimal effects - pending approval
79a687b7-f4fb-4524-a216-bcff235cd20f	FISHER	Tech House	23:00 - 03:00	\N	\N	4x wedge monitors + subs	High energy strobes, sync with drops	Colorful visuals, party vibe	MIDI clock sync from Traktor to LED wall	CO₂ every 30 minutes, confetti finale	Final	High	bali	2025-08-29 00:00:00	2025-11-28 07:39:36.536	2025-11-28 07:39:36.536	4x wedge monitors + 2x sub monitors, DJ booth setup	Logo animation at peak time 01:00	Full HD recording + multi-cam setup	High energy strobes, sync with drops, full color spectrum	Colorful party visuals, crowd reactions, DJ cam feed
0c6d1b34-3adb-4e46-a4a1-387b2a6fafaa	RAP	res	22.00-23.00	\N	\N				dds	Co2	Draft	Med	jakarta	2025-11-29 17:00:00	2025-11-28 08:43:34.053	2025-11-28 08:43:34.053	rea	ww	qq	light	vida
\.


--
-- Data for Name: Incident; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Incident" (id, type, description, "rootCause", prevention, impact, date, city, "createdAt", "updatedAt") FROM stdin;
98874ee1-064e-45b4-9f00-073b6027d7cc	Audio	Speaker dropout during peak hours	Loose power connection	Regular connection inspection added to checklist	Minimal - backup engaged automatically	2025-08-24 16:15:00	jakarta	2025-11-28 07:39:36.547	2025-11-28 07:39:36.547
\.


--
-- Data for Name: KPIMetrics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."KPIMetrics" (id, city, "nightsOpen", "equipmentUptimePercentage", "issuesRaised", "issuesResolved", "powerIncidents", "weekYear", "weekNumber", "createdAt", "updatedAt") FROM stdin;
e4006164-4a30-41b0-b7ea-f80e6a78ddb1	jakarta	4	97.8	8	6	1	2025	35	2025-11-28 07:39:36.575	2025-11-28 07:39:36.575
89b029fd-6f36-4e74-8d5b-f5b038a3181e	bali	5	95.4	12	10	2	2025	35	2025-11-28 07:39:36.575	2025-11-28 07:39:36.575
\.


--
-- Data for Name: MaintenanceLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MaintenanceLog" (id, type, issue, status, mttr, cost, parts, date, city, "createdAt", "updatedAt", "equipmentId", notes, "technicianId", photo, "supplierId") FROM stdin;
9b15dcdb-540d-47ea-9c9f-238e043c5a67	Corrective	Display artifacts in upper right panel	In_Progress	4.2	850000	{"LED Module","Control board"}	2025-08-26 00:00:00	jakarta	2025-11-28 07:39:36.544	2025-11-28 16:22:50.125	6ce7c515-7fb7-46a4-be83-1477828fef6b		50b5e30c-f0e7-4a52-9ca0-e394659c0b7a		6b2562ee-f57e-4c89-a125-854a454bd543
6602b3e0-6b03-4d3a-a702-ac3e1a689c85	Preventive	Routine cleaning and calibration	Completed	1.5	150000	{"Cleaning kit","Calibration disc"}	2025-08-25 00:00:00	jakarta	2025-11-28 07:39:36.544	2025-11-28 16:36:08.849	f53e9881-88e3-4a98-b49d-831dd500a930		fef8c185-aa08-4001-8b41-03b507adfeea		279a17e1-5f88-4e80-8df7-619d79eff260
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Notification" (id, "userId", type, category, title, message, data, city, read, "readAt", "actionUrl", "createdAt") FROM stdin;
\.


--
-- Data for Name: Permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Permission" (id, name, "displayName", description, category, "createdAt", "updatedAt") FROM stdin;
4f0ac41e-ff3d-41c5-bad7-20d47c90e363	view:equipment	View Equipment	View equipment inventory and status	Equipment Management	2025-11-28 07:25:37.942	2025-11-28 07:25:37.942
1338bd40-cb40-43a9-bbbd-570f853593ec	add:equipment	Add Equipment	Add new equipment to inventory	Equipment Management	2025-11-28 07:25:37.959	2025-11-28 07:25:37.959
23a3b91a-443a-4de2-b0f8-1ef1edb01db8	edit:equipment	Edit Equipment	Edit equipment details and status	Equipment Management	2025-11-28 07:25:37.962	2025-11-28 07:25:37.962
b9c00271-30ec-46c0-8a46-6a7dc874ce7e	delete:equipment	Delete Equipment	Remove equipment from inventory	Equipment Management	2025-11-28 07:25:37.964	2025-11-28 07:25:37.964
e56d9c7e-0576-4d01-8792-78967564719f	view:events	View Events	View event briefs and schedules	Event Management	2025-11-28 07:25:37.966	2025-11-28 07:25:37.966
1aa1ce40-40eb-4ded-921f-646d13797895	create:events	Create Events	Create new event briefs	Event Management	2025-11-28 07:25:37.969	2025-11-28 07:25:37.969
782bb5a9-1058-4f07-a215-e6c6fada2a8c	edit:events	Edit Events	Edit event details and briefs	Event Management	2025-11-28 07:25:37.973	2025-11-28 07:25:37.973
394460e1-ac3b-4877-b226-e6d411ac30fc	delete:events	Delete Events	Remove events from schedule	Event Management	2025-11-28 07:25:37.975	2025-11-28 07:25:37.975
44ecf74e-f8d9-4884-babe-b9e8dc3ca3ac	view:crew	View Crew	View crew members and schedules	Team Management	2025-11-28 07:25:37.976	2025-11-28 07:25:37.976
91c2d4e7-84bd-4c88-9f23-6a01a60b90b6	add:crew	Add Crew Members	Add new crew members to team	Team Management	2025-11-28 07:25:37.98	2025-11-28 07:25:37.98
b5c74dc6-f5e7-4748-ad4c-0f4b989f8f76	edit:crew	Edit Crew Schedule	Edit crew member assignments and schedules	Team Management	2025-11-28 07:25:37.982	2025-11-28 07:25:37.982
0c9e3874-ee9c-45e6-bee6-7abf0a570d8c	remove:crew	Remove Crew Members	Remove crew members from team	Team Management	2025-11-28 07:25:37.985	2025-11-28 07:25:37.985
afb64842-b8fc-43cd-9a4e-06914fc86209	view:team_performance	View Team Performance	View team performance metrics and analytics	Team Performance	2025-11-28 07:25:37.987	2025-11-28 07:25:37.987
36753cca-dc1c-489b-a8f0-4b818c1b0732	edit:team_performance	Edit Team Performance	Edit team performance metrics and evaluations	Team Performance	2025-11-28 07:25:37.99	2025-11-28 07:25:37.99
8fb14bc6-4b4e-4a89-8de9-149bcc321740	view:maintenance	View Maintenance Logs	View maintenance history and schedules	Maintenance & Incidents	2025-11-28 07:25:37.992	2025-11-28 07:25:37.992
0a90e39e-7e89-4072-bdb9-941d4a928abd	create:maintenance	Create Maintenance Logs	Create new maintenance logs	Maintenance & Incidents	2025-11-28 07:25:37.995	2025-11-28 07:25:37.995
9791c256-1601-4fc2-b3dc-c676860e7d61	view:incidents	View Incidents	View incident reports	Maintenance & Incidents	2025-11-28 07:25:37.998	2025-11-28 07:25:37.998
7f3bcfeb-7601-4a57-a5e9-d6b0d549b3fe	report:incidents	Report Incidents	Create and report incidents	Maintenance & Incidents	2025-11-28 07:25:38.001	2025-11-28 07:25:38.001
2b6d1bed-cf6d-4c75-bd35-417719006bca	view:proposals	View Proposals	View proposals and budgets	Proposals & R&D	2025-11-28 07:25:38.003	2025-11-28 07:25:38.003
5dff5f63-2e8f-4fea-84a9-0e46b304d0f7	create:proposals	Create Proposals	Create new proposals	Proposals & R&D	2025-11-28 07:25:38.006	2025-11-28 07:25:38.006
bdbc7a01-f8bc-48e8-913e-f9a9a4b92a47	edit:proposals	Edit Proposals	Edit proposal details	Proposals & R&D	2025-11-28 07:25:38.007	2025-11-28 07:25:38.007
d54abb5e-dfdb-4907-8582-3d6671acb651	approve:proposals	Approve Proposals	Approve or reject proposals	Proposals & R&D	2025-11-28 07:25:38.01	2025-11-28 07:25:38.01
9fb1638e-9f6b-47ac-bad5-f874ac7ee444	view:rnd	View R&D Projects	View research and development projects	Proposals & R&D	2025-11-28 07:25:38.011	2025-11-28 07:25:38.011
d7ed57e1-77ba-48c1-8010-92c26dd8ff1f	manage:rnd	Manage R&D Projects	Create and manage R&D projects	Proposals & R&D	2025-11-28 07:25:38.013	2025-11-28 07:25:38.013
f0b8595a-4289-4424-a949-4089143e6b1a	view:consumables	View Consumables	View consumable stock levels	Consumables & Alerts	2025-11-28 07:25:38.016	2025-11-28 07:25:38.016
75e8e346-3c20-403f-a6cd-af37e2dddbb5	update:stock	Update Stock Levels	Update consumable inventory	Consumables & Alerts	2025-11-28 07:25:38.018	2025-11-28 07:25:38.018
c75f49d9-74e7-4278-b653-c7a3fda126d1	view:alerts	View Alerts	View system alerts and notifications	Consumables & Alerts	2025-11-28 07:25:38.02	2025-11-28 07:25:38.02
cbd9e071-5b68-4076-8a7d-1eb3e222bd9d	manage:alerts	Manage Alerts	Create and manage system alerts	Consumables & Alerts	2025-11-28 07:25:38.022	2025-11-28 07:25:38.022
381986a8-d2b3-4ce8-bdc1-4f198f3ec7ea	view:kpi	View KPI Metrics	View KPI dashboards and metrics	KPI & Analytics	2025-11-28 07:25:38.025	2025-11-28 07:25:38.025
3cdbe895-ada3-455f-8298-1c896a3964c9	edit:kpi	Edit KPI Data	Edit and update KPI metrics	KPI & Analytics	2025-11-28 07:25:38.028	2025-11-28 07:25:38.028
06f4004a-8963-4314-85b6-5054dafc6caf	export:reports	Export Reports	Export data and generate reports	KPI & Analytics	2025-11-28 07:25:38.03	2025-11-28 07:25:38.03
1f9045a2-98d3-4506-8f15-07b329b573db	manage:users	Manage Users	Create, edit, and delete users	System & Users	2025-11-28 07:25:38.032	2025-11-28 07:25:38.032
6c2fc7c3-46cd-48d0-add5-5173e3f72371	view:all_cities	View All Cities	Access data from all cities	System & Users	2025-11-28 07:25:38.034	2025-11-28 07:25:38.034
b5786759-af26-45f0-be7b-3309322ffd86	edit:all_cities	Edit All Cities	Modify data across all cities	System & Users	2025-11-28 07:25:38.035	2025-11-28 07:25:38.035
d438c2ce-43f3-4609-973f-a303b2aad7ac	system:config	System Configuration	Modify system settings and configuration	System & Users	2025-11-28 07:25:38.036	2025-11-28 07:25:38.036
\.


--
-- Data for Name: Proposal; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Proposal" (id, title, type, urgency, estimate, vendor, status, owner, "nextAction", city, "createdAt", "updatedAt", description, "quotesCount", "targetDate", "estimateApproved", "estimateApprovedBy", "quotesPdfs", "supplierId") FROM stdin;
897c4e70-b7f1-427e-902c-c63f355f0226	LED Wall Upgrade - 4K Panels	CapEx	High	125000000	LED Solutions Indonesia	Pending	Chris	CEO Approval Required	jakarta	2025-11-28 07:39:36.55	2025-11-28 07:39:36.55	Upgrade existing LED wall to 4K panels for better visual quality	3	2025-12-15 00:00:00	f	\N	{}	\N
a23aeb22-cc47-41c2-b8b9-fe476a7640c6	New DJ Booth Design	CapEx	Medium	45000000	Custom Furniture Co	Approved	Ating	Order materials	jakarta	2025-11-28 07:39:36.55	2025-11-28 07:39:36.55	Custom DJ booth with integrated cable management	2	2026-01-20 00:00:00	t	admin	{}	\N
521cb7ee-c6f1-408f-8fad-eb52ec76ca16	RAPS	CapEx	Medium	5000000	R APP	Pending	Chris	DEMO	jakarta	2025-11-28 15:06:53.724	2025-11-28 16:35:38.408	Aplikasi	5	2025-12-05 17:00:00	f	\N	{"data:application/pdf;base64,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Ci9OYW1lcyAyIDAgUgo+PgplbmRvYmoKMSAwIG9iago8PAovVHlwZSAvUGFnZXMKL0NvdW50IDIKL0tpZHMgWzcgMCBSIDEyIDAgUl0KPj4KZW5kb2JqCjIgMCBvYmoKPDwKL0Rlc3RzIDw8CiAgL05hbWVzIFsKXQo+Pgo+PgplbmRvYmoKeHJlZgowIDE3CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMTgyNCAwMDAwMCBuIAowMDAwMDAxODg4IDAwMDAwIG4gCjAwMDAwMDE3NjIgMDAwMDAgbiAKMDAwMDAwMTc0MSAwMDAwMCBuIAowMDAwMDAwMjM2IDAwMDAwIG4gCjAwMDAwMDAxMTkgMDAwMDAgbiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAxNjM5IDAwMDAwIG4gCjAwMDAwMDE1NDIgMDAwMDAgbiAKMDAwMDAwMTE3NyAwMDAwMCBuIAowMDAwMDAxMDY5IDAwMDAwIG4gCjAwMDAwMDA5NjIgMDAwMDAgbiAKMDAwMDAwMTQ2NiAwMDAwMCBuIAowMDAwMDAxMzgwIDAwMDAwIG4gCjAwMDAwMDE0MDUgMDAwMDAgbiAKMDAwMDAwMTQzMCAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDE3Ci9Sb290IDMgMCBSCi9JbmZvIDEzIDAgUgovSUQgWzwzNmM4MjExNTgxZTE1MDA1OTQ4MGU1NGQ3ODRjOWM5Nj4gPDM2YzgyMTE1ODFlMTUwMDU5NDgwZTU0ZDc4NGM5Yzk2Pl0KPj4Kc3RhcnR4cmVmCjE5MzUKJSVFT0YK","data:application/pdf;base64,JVBERi0xLjMKJf////8KNyAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDEgMCBSCi9NZWRpYUJveCBbMCAwIDU5NS4yOCA4NDEuODldCi9Db250ZW50cyA1IDAgUgovUmVzb3VyY2VzIDYgMCBSCj4+CmVuZG9iago2IDAgb2JqCjw8Ci9Qcm9jU2V0IFsvUERGIC9UZXh0IC9JbWFnZUIgL0ltYWdlQyAvSW1hZ2VJXQovRm9udCA8PAovRjEgOCAwIFIKPj4KL0NvbG9yU3BhY2UgPDwKPj4KPj4KZW5kb2JqCjUgMCBvYmoKPDwKL0xlbmd0aCA4OTYKL0ZpbHRlciAvRmxhdGVEZWNvZGUKPj4Kc3RyZWFtCnicrVfLiutGEN3rK+oHbt96VzcYLebmAVkEkvEuZDGRJQhkAsmF5PdDtzUeP0YeeeKFhNRS1/PUqWoCBIRPBAhZKeUCw3P3+Zvxn9+H8efvH2D42mEiCtdAy5nFuCgBJuZQw5JRCpN5dsBkevKnwNfhz+6vjt7S8bCd1wlYchJHRIOISCawfe4+f0fACNup+2Vj3kNG2Cj1YAgbMx16IKqPyqiig5lyD/grbH/ovt12P61Ri5qyZkSFsEic+UUv+V6vuhcfnXx08eLkA6NSWxmihHpxCWE0dgv0KbiHT4qwCT2x5TyeCi/XugCReiIyRIcQSVn9YOkcIRUvoVHkaR8hRn9y8t+cjmxyYoyBcQ5iNX/n1syvToXb0fadTz6Get7v0XDz0a2Kq3F3CnVzfd0hLMSTULuz1HfjgVFQnEcRIR5F5TRLhkAsqWSF587UDm9/dI/nYWvB2Afs6MuXx/nL45cfO4J/m0iNpKWKJMaUTUrxw2KVvAYehuDFExc9BFtnOIqZ7nSnZDzHslzL95Hh7ykNBA9NFK9YpFmp9kBcIz/VTFYoVtj1IDW33gMbbGqO9vkJq99uqgcqlIJ10QAOfEIhYZGWz9IySlIE7+i9RXKlNe6r+BQSGnKzo5GyLqvaO5rFeBQUEW3ANbE7uqmUiFDPdWstMWU0DPbJvVb1B71b0DB7J5JbEq0VZ4iI39E71mRR/MI76kFP4PpKJ5V+KqT7yvobnbTcSufCyUtZVF5T2PBKfM9EYk6oOV+4asc1GTrDtT3f6phLyjWjC6qEVrpzjTUDgT0SNdKMSCylFH1ZW8uZgWDhyTWfc6aauZqOrV+r2qGelbToYHLFB6qobj4YAkdJ6g5arCLl7/Giu7KQBJsWpOIY2epkcjypcNTmW05HGm4KpjWNwcAME6tedOHRpxuTm5eFXSKoDh67m3mdZVHHnTuI0LI3HyVrKcvWf5wkNa7EZIGCDEFIklwFX7mclE+RZ/slPQZpg95ZdaZ8tq9uOxJM4W3p9YcG8VbQD/+D01xTKRmMIqEfemN5k2rWwftNScZKhh9B8oK4lcPJShBfU/LeYLAS09dUvNedVwL87RzOffB6F0z1PLe/Vh7iWJK51tNU9kSvR5Q8E8DCAYLR54KLcjiaeF9bSf3HfJjnofokdUZQ2RNilbU/nFQg6dEUcQbT/wAPCyLECmVuZHN0cmVhbQplbmRvYmoKMTAgMCBvYmoKKFBERktpdCkKZW5kb2JqCjExIDAgb2JqCihQREZLaXQpCmVuZG9iagoxMiAwIG9iagooRDoyMDI1MTEyMDIzMzE0MlopCmVuZG9iago5IDAgb2JqCjw8Ci9Qcm9kdWNlciAxMCAwIFIKL0NyZWF0b3IgMTEgMCBSCi9DcmVhdGlvbkRhdGUgMTIgMCBSCj4+CmVuZG9iago4IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9CYXNlRm9udCAvSGVsdmV0aWNhCi9TdWJ0eXBlIC9UeXBlMQovRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZwo+PgplbmRvYmoKNCAwIG9iago8PAo+PgplbmRvYmoKMyAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMSAwIFIKL05hbWVzIDIgMCBSCj4+CmVuZG9iagoxIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovQ291bnQgMQovS2lkcyBbNyAwIFJdCj4+CmVuZG9iagoyIDAgb2JqCjw8Ci9EZXN0cyA8PAogIC9OYW1lcyBbCl0KPj4KPj4KZW5kb2JqCnhyZWYKMCAxMwowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDE1NDEgMDAwMDAgbiAKMDAwMDAwMTU5OCAwMDAwMCBuIAowMDAwMDAxNDc5IDAwMDAwIG4gCjAwMDAwMDE0NTggMDAwMDAgbiAKMDAwMDAwMDIzMiAwMDAwMCBuIAowMDAwMDAwMTI1IDAwMDAwIG4gCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMTM2MSAwMDAwMCBuIAowMDAwMDAxMjg2IDAwMDAwIG4gCjAwMDAwMDEyMDAgMDAwMDAgbiAKMDAwMDAwMTIyNSAwMDAwMCBuIAowMDAwMDAxMjUwIDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgMTMKL1Jvb3QgMyAwIFIKL0luZm8gOSAwIFIKL0lEIFs8N2E3Yjc3ZWFiMzVhN2FmZDBhOTk2MWFkZDRiNDMwY2M+IDw3YTdiNzdlYWIzNWE3YWZkMGE5OTYxYWRkNGI0MzBjYz5dCj4+CnN0YXJ0eHJlZgoxNjQ1CiUlRU9GCg==","data:application/pdf;base64,JVBERi0xLjQKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgaHR0cDovL3d3dy5yZXBvcnRsYWIuY29tCjEgMCBvYmoKPDwKL0YxIDIgMCBSIC9GMiAzIDAgUiAvRjMgNCAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL0Jhc2VGb250IC9IZWx2ZXRpY2EgL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcgL05hbWUgL0YxIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRvYmoKMyAwIG9iago8PAovQmFzZUZvbnQgL0hlbHZldGljYS1Cb2xkIC9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nIC9OYW1lIC9GMiAvU3VidHlwZSAvVHlwZTEgL1R5cGUgL0ZvbnQKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0Jhc2VGb250IC9aYXBmRGluZ2JhdHMgL05hbWUgL0YzIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRvYmoKNSAwIG9iago8PAovQ29udGVudHMgOSAwIFIgL01lZGlhQm94IFsgMCAwIDU5NS4yNzU2IDg0MS44ODk4IF0gL1BhcmVudCA4IDAgUiAvUmVzb3VyY2VzIDw8Ci9Gb250IDEgMCBSIC9Qcm9jU2V0IFsgL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSSBdCj4+IC9Sb3RhdGUgMCAvVHJhbnMgPDwKCj4+IAogIC9UeXBlIC9QYWdlCj4+CmVuZG9iago2IDAgb2JqCjw8Ci9QYWdlTW9kZSAvVXNlTm9uZSAvUGFnZXMgOCAwIFIgL1R5cGUgL0NhdGFsb2cKPj4KZW5kb2JqCjcgMCBvYmoKPDwKL0F1dGhvciAoXChhbm9ueW1vdXNcKSkgL0NyZWF0aW9uRGF0ZSAoRDoyMDI1MTAyMjA2NTgzNSswMCcwMCcpIC9DcmVhdG9yIChcKHVuc3BlY2lmaWVkXCkpIC9LZXl3b3JkcyAoKSAvTW9kRGF0ZSAoRDoyMDI1MTAyMjA2NTgzNSswMCcwMCcpIC9Qcm9kdWNlciAoUmVwb3J0TGFiIFBERiBMaWJyYXJ5IC0gd3d3LnJlcG9ydGxhYi5jb20pIAogIC9TdWJqZWN0IChcKHVuc3BlY2lmaWVkXCkpIC9UaXRsZSAoXChhbm9ueW1vdXNcKSkgL1RyYXBwZWQgL0ZhbHNlCj4+CmVuZG9iago4IDAgb2JqCjw8Ci9Db3VudCAxIC9LaWRzIFsgNSAwIFIgXSAvVHlwZSAvUGFnZXMKPj4KZW5kb2JqCjkgMCBvYmoKPDwKL0ZpbHRlciBbIC9BU0NJSTg1RGVjb2RlIC9GbGF0ZURlY29kZSBdIC9MZW5ndGggMTA1NQo+PgpzdHJlYW0KR2F0VTE5bGxkWCZBQHNCbSpYJ08nSTQ2X1NFY25uUmw1N005VWVESSNLO3VMQF9NblE0U2VfVzBPVGlyVmpXUmNKQCwyU0RrQyZcJDNwS0NxNCozPyhFVClALXI6LSkmdVw1TW4/LTNkJTowOkhub1MsVS80cy9LXDszRCY7JlttNSEzcm07TFZPSGcwcWBDck1Rbj86QUliRVhHMSNfMEAhRlItRmFKNmtMOmQhI2BWQjpFMiNSUjYkWz0lPF0na0lAaHJBWEkiKyQ9ZTAwKyxKW05jXj5sVFFpSi9TTk9wOVVWZVVPSzEwZmlJYWgmSj0yRXI8SDlQMFM1JTVNRGk1UShWLmcxPFZJP2dhT0VtLS0rZ045blJFKzosVUxcWTVgMldiNnMsZUBwVjlWUCVFWG9rX2JfSVNWaXROUClZYS9fc1ZqPW5pPk1KOm5VJjk+bWltdV9ZTmpkR1BDV2QzcG9qa0Y1YWwnaExGcFAmQW05N1ArLktzRTxoRmItYjFBbWdZXFdEU0MwRDFBUUpqai45X1dpSVckIj1qXiQvRHAtcXMvZEJiY3MtXW1NZWVcLk9yJEZUZy5PM1IwZmpFamlMaiFuK15jaDVYbT5WbjFcaWpcSkRFVCMpQ1s7YE90U25OZklvRWdAJ3NCZXU+OyIjMlozSCwlKCk+UiM8aD8rSl8/W2xhTT01ZSRLRiY5TW1tI1BOYl1WOV41a1ByPFVTJyQtLFBxUixxKyllaFVvYW4jSl43V1NlRTQmWj5hYUEndDklXE9FSVQuL2hfNE9wOyQzaV1OYl5cO1Y0Ml5SJzZrRTxldCRkVnBFVVxQZixZb0sxYjRNbXNiTWlUUWAtYDxnLSouXitVMUtITlU7cEkkX2kmSlg+VG4iU1VPajhXW1VcM1loLiJrQGxfSHBuXWJsS1NfR3FTRTdbPmc9OmpCaykpNGZYXkFoSD1MPWpoVGIpUiFccVFTTD1pNmM1bShXKitBQy4hY3Q6WGw5dVtNLWo0O3VvRylSZ3EidUdYYG45UnAhbWdpMkRHT1M1MDszU25gX2pUMkZOamVQTlE7YzleZ285ZDdePCc+RExDSWREaiNVSVlWWFtjIUxTM3QqZSdTVChsJG1IZlNcUjBWKE0udVFSInIkJCZtTz81TikoTywmMUhAKUVULjUnSTVINk9XQUtdRmlob1ZbOmYqa1giN1coXEkxdHExOmZtOipMPzFEJmpfNE5VXU5VR1ErJWoxbjFCLzYhJEtPIXJwZnV1dCkqcmpIVzUtSFdLalA1QmpPaC8xZ1klIXMnOEE6WGBuOWRkWF5sTDtsbmokUEo8cyVbVVNYMW4oPEBbTkZzYld0JnJUZlBwU3FWaGBcMikwYjchcjAvKzcjJ18tYEZEMmBMfj5lbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCAxMAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwNzMgMDAwMDAgbiAKMDAwMDAwMDEyNCAwMDAwMCBuIAowMDAwMDAwMjMxIDAwMDAwIG4gCjAwMDAwMDAzNDMgMDAwMDAgbiAKMDAwMDAwMDQyNiAwMDAwMCBuIAowMDAwMDAwNjI5IDAwMDAwIG4gCjAwMDAwMDA2OTcgMDAwMDAgbiAKMDAwMDAwMDk4MCAwMDAwMCBuIAowMDAwMDAxMDM5IDAwMDAwIG4gCnRyYWlsZXIKPDwKL0lEIApbPDM0ZjdkZDg4NjExMTAwMjIzMGM1OTU4OTAxM2ZiYWQ4PjwzNGY3ZGQ4ODYxMTEwMDIyMzBjNTk1ODkwMTNmYmFkOD5dCiUgUmVwb3J0TGFiIGdlbmVyYXRlZCBQREYgZG9jdW1lbnQgLS0gZGlnZXN0IChodHRwOi8vd3d3LnJlcG9ydGxhYi5jb20pCgovSW5mbyA3IDAgUgovUm9vdCA2IDAgUgovU2l6ZSAxMAo+PgpzdGFydHhyZWYKMjE4NQolJUVPRgo=","data:application/pdf;base64,JVBERi0xLjQKJf////8KMSAwIG9iago8PCAvQ3JlYXRvciA8ZmVmZjAwNTAwMDcyMDA2MTAwNzcwMDZlPgovUHJvZHVjZXIgPGZlZmYwMDUwMDA3MjAwNjEwMDc3MDA2ZT4KPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1BhZ2VzIDMgMCBSCi9UeXBlIC9DYXRhbG9nCj4+CmVuZG9iagozIDAgb2JqCjw8IC9Db3VudCAxCi9LaWRzIFs1IDAgUl0KL1R5cGUgL1BhZ2VzCj4+CmVuZG9iago0IDAgb2JqCjw8IC9MZW5ndGggMTA4NDYKPj4Kc3RyZWFtCnEKMC4zIHcKCnEKMTEwLjAgMC4wIDAuMCA3Mi44NDc2OCAyNTEuMCA2NjkuMTUyMzIgY20KL0kxIERvClEKL0RldmljZVJHQiBDUwowLjY2NjY3IDAuNjY2NjcgMC42NjY2NyBTQ04KL0RldmljZVJHQiBjcwowLjQ2NjY3IDAuNDY2NjcgMC40NjY2NyBzY24KMjc2LjAgNjU0LjE1MjMyIG0KMzM2LjAgNjU0LjE1MjMyIGwKMC4yIDAuMiAwLjIgc2NuCgpCVAo2MC4wIDYyNS45MDIzMiBUZAovRjEuMCAxMSBUZgpbPDU5PiA5MS43OTY4OCA8NmY3NTI3NzY2NTIwNjI2NTY1NmUyMDY5NzM3Mzc1NjU2NDIwNjEyMDcyNjU2Njc1NmU2NDIxMjA+IDE3LjU3ODEyIDw1NDY4NjUyMDYxNmQ2Zjc1NmU3NDIwNzc2OTZjNmMyMDYyNjUyMDYzNzI2NTY0Njk3NDY1NjQyMDc0NmYyMDc5NmY3NTcyMjA2MzcyNjU2NDY5NzQyMDYzNjE3MjY0MjA2NTZlNjQ2OTZlNjcyMDc3Njk3NDY4MjAzNzMyMzEzNDJlPl0gVEoKRVQKCgpCVAo2MC4wIDYxMC40NzQzMiBUZAovRjEuMCAxMSBUZgpbPDUxNzU2NTczNzQ2OTZmNmU3MzNmMjA1Nj4gMTcuNTc4MTIgPDY5NzM2OTc0MjA+XSBUSgpFVAoKMC4wIDAuNTMzMzMgMC44IHNjbgowLjAgMC41MzMzMyAwLjggU0NOCgpCVAoxNDIuMjczNjQgNjEwLjQ3NDMyIFRkCi9GMS4wIDExIFRmCjw2ODc0NzQ3MDczM2EyZjJmNzM3NTcwNzA2ZjcyNzQyZTY3Njk3NDY4NzU2MjJlNjM2ZjZkMmY2MzZmNmU3NDYxNjM3ND4gVGoKRVQKCjAuNjY2NjcgMC42NjY2NyAwLjY2NjY3IFNDTgowLjIgMC4yIDAuMiBzY24KCkJUCjMwNy4yMjk2NCA2MTAuNDc0MzIgVGQKL0YxLjAgMTEgVGYKPDJlPiBUagpFVAoKMC4zIHcKMC42NjY2NyAwLjY2NjY3IDAuNjY2NjcgU0NOCgpCVAo2MC4wIDU2OC45NTczMiBUZAovRjEuMCAxMSBUZgo8NDQ2MTc0NjU+IFRqCkVUCgowLjMgdwowLjY2NjY3IDAuNjY2NjcgMC42NjY2NyBTQ04KCkJUCjIwMC4wIDU2OC45NTczMiBUZAovRjIuMCAxMSBUZgo8MzIzMDMyMzUyZDMwMzgyZDMwMzQyMDMwMzQzYTMzMzc1MDRkMjA1MDQ0NTQ+IFRqCkVUCgowLjMgdwowLjg2NjY3IDAuODY2NjcgMC44NjY2NyBTQ04KNjAuMCA1NTcuODY4MzIgbQoyMDAuMCA1NTcuODY4MzIgbApTCltdIDAgZAowLjMgdwowLjY2NjY3IDAuNjY2NjcgMC42NjY2NyBTQ04KCkJUCjYwLjAgNTM4LjUyOTMyIFRkCi9GMS4wIDExIFRmCjw0MTYzNjM2Zjc1NmU3NDIwNjI2OTZjNmM2NTY0PiBUagpFVAoKMC4zIHcKMC44NjY2NyAwLjg2NjY3IDAuODY2NjcgU0NOCjIwMC4wIDU1Ny44NjgzMiBtCjU1Mi4wIDU1Ny44NjgzMiBsClMKW10gMCBkCjAuMyB3CjAuNjY2NjcgMC42NjY2NyAwLjY2NjY3IFNDTgoKQlQKMjAwLjAgNTM4LjUyOTMyIFRkCi9GMi4wIDExIFRmCjw1MjYxNzAzMTM5MzIzMj4gVGoKRVQKCgpCVAoyNDUuMjMyIDUzOC41MjkzMiBUZAovRjEuMCAxMSBUZgo8MjAyODcyNjk3OTYxNmU2MTY3NzU2ZTY3NzA3MjYxNzQ2MTZkNjE0MDY3NmQ2MTY5NmMyZTYzNmY2ZDI5PiBUagpFVAoKMC4zIHcKMC44NjY2NyAwLjg2NjY3IDAuODY2NjcgU0NOCjYwLjAgNTI3LjQ0MDMyIG0KMjAwLjAgNTI3LjQ0MDMyIGwKUwpbXSAwIGQKMC4zIHcKMC42NjY2NyAwLjY2NjY3IDAuNjY2NjcgU0NOCgpCVAo2MC4wIDUwOC4xMDEzMiBUZAovRjEuMCAxMSBUZgpbPDU0PiAzNi42MjEwOSA8NzI2MTZlNzM2MTYzNzQ2OTZmNmUyMDQ5NDQ+XSBUSgpFVAoKMC4zIHcKMC44NjY2NyAwLjg2NjY3IDAuODY2NjcgU0NOCjIwMC4wIDUyNy40NDAzMiBtCjU1Mi4wIDUyNy40NDAzMiBsClMKW10gMCBkCjAuMyB3CjAuNjY2NjcgMC42NjY2NyAwLjY2NjY3IFNDTgoKQlQKMjAwLjAgNTA4LjEwMTMyIFRkCi9GMi4wIDExIFRmCjw3MjY1NWYzMzUyNzM1NDY2MzI0YTQ2NzIzNjQzNDM0ODc3NDk2OTMxNDQ0NjY3MzA2NDYxNTU+IFRqCkVUCgowLjMgdwowLjg2NjY3IDAuODY2NjcgMC44NjY2NyBTQ04KNjAuMCA0OTcuMDEyMzIgbQoyMDAuMCA0OTcuMDEyMzIgbApTCltdIDAgZAowLjMgdwowLjY2NjY3IDAuNjY2NjcgMC42NjY2NyBTQ04KCkJUCjYwLjAgNDc3LjY3MzMyIFRkCi9GMS4wIDExIFRmCls8NTM2MTZjNjUyMD4gMTcuNTc4MTIgPDU0PiAzNi42MjEwOSA8NzI2MTZlNzM2MTYzNzQ2OTZmNmUyMDQ5NDQ+XSBUSgpFVAoKMC4zIHcKMC44NjY2NyAwLjg2NjY3IDAuODY2NjcgU0NOCjIwMC4wIDQ5Ny4wMTIzMiBtCjU1Mi4wIDQ5Ny4wMTIzMiBsClMKW10gMCBkCjAuMyB3CjAuNjY2NjcgMC42NjY2NyAwLjY2NjY3IFNDTgoKQlQKMjAwLjAgNDc3LjY3MzMyIFRkCi9GMi4wIDExIFRmCjw2MzY4NWYzMzUyNzM1NDY2MzI0YTQ2NzIzNjQzNDM0ODc3NDk2OTMxNDM0YzYxMzYzMDM5NTM+IFRqCkVUCgowLjMgdwowLjg2NjY3IDAuODY2NjcgMC44NjY2NyBTQ04KNjAuMCA0NjYuNTg0MzIgbQoyMDAuMCA0NjYuNTg0MzIgbApTCltdIDAgZAowLjMgdwowLjY2NjY3IDAuNjY2NjcgMC42NjY2NyBTQ04KCkJUCjYwLjAgNDQ3LjI0NTMyIFRkCi9GMS4wIDExIFRmCjw1MjY1NjY3NTZlNjQ2NTY0MjA3NDZmPiBUagpFVAoKMC4zIHcKMC44NjY2NyAwLjg2NjY3IDAuODY2NjcgU0NOCjIwMC4wIDQ2Ni41ODQzMiBtCjU1Mi4wIDQ2Ni41ODQzMiBsClMKW10gMCBkCjAuMyB3CjAuNjY2NjcgMC42NjY2NyAwLjY2NjY3IFNDTgoKQlQKMjAwLjAgNDQ3LjI0NTMyIFRkCi9GMi4wIDExIFRmCls8NTY+IDE3LjU3ODEyIDw2OTczNjE+XSBUSgpFVAoKCkJUCjIyMi40MTE2NCA0NDcuMjQ1MzIgVGQKL0YxLjAgMTEgVGYKPDIwMjgzNDJhMmEyYTIwMmEyYTJhMmEyMDJhMmEyYTJhMjAzNzMyMzEzNDI5PiBUagpFVAoKMC4zIHcKMC44NjY2NyAwLjg2NjY3IDAuODY2NjcgU0NOCjYwLjAgNDM2LjE1NjMyIG0KMjAwLjAgNDM2LjE1NjMyIGwKUwpbXSAwIGQKMC4zIHcKMC42NjY2NyAwLjY2NjY3IDAuNjY2NjcgU0NOCgpCVAo2MC4wIDQxNi44MTczMiBUZAovRjEuMCAxMSBUZgpbPDUyNjU2Njc1NmU2NDIwPiA1NC42ODc1IDw0MTZkNmY3NTZlNzQ+XSBUSgpFVAoKMC4zIHcKMC44NjY2NyAwLjg2NjY3IDAuODY2NjcgU0NOCjIwMC4wIDQzNi4xNTYzMiBtCjU1Mi4wIDQzNi4xNTYzMiBsClMKW10gMCBkCjAuMyB3CjAuNjY2NjcgMC42NjY2NyAwLjY2NjY3IFNDTgoKQlQKMjAwLjAgNDE2LjgxNzMyIFRkCi9GMi4wIDExIFRmCjwyNDM2MmUzNzM3MjA1NTUzNDQ+IFRqCkVUCgowLjMgdwowLjg2NjY3IDAuODY2NjcgMC44NjY2NyBTQ04KNjAuMCA0MDUuNzI4MzIgbQoyMDAuMCA0MDUuNzI4MzIgbApTCltdIDAgZAowLjMgdwowLjY2NjY3IDAuNjY2NjcgMC42NjY2NyBTQ04KCkJUCjYwLjAgMzg2LjM4OTMyIFRkCi9GMS4wIDExIFRmCls8NTQ+IDExMC44Mzk4NCA8NmY3NDYxNmM+XSBUSgpFVAoKMC4zIHcKMC44NjY2NyAwLjg2NjY3IDAuODY2NjcgU0NOCjIwMC4wIDQwNS43MjgzMiBtCjU1Mi4wIDQwNS43MjgzMiBsClMKW10gMCBkCjAuMyB3CjAuNjY2NjcgMC42NjY2NyAwLjY2NjY3IFNDTgoKQlQKMjAwLjAgMzg2LjM4OTMyIFRkCi9GMi4wIDExIFRmCjwyNDM2MmUzNzM3MjA1NTUzNDQyYT4gVGoKRVQKCnEKNjAuMCAxNzEuNDgwNzMgbQoyNDAuMCAxNzEuNDgwNzMgbAoyNDAuMCAyMTAuMCBsCjYwLjAgMjEwLjAgbApoClcgbgowLjAgMC4wIDAuMCBzY24KMC45MTI3OCAwLjAgMC4wIDAuOTEyNzggNS4yMzMyNyAxOC4zMTY0MyBjbQoxLjAgMC4wIDAuMCAxLjAgMC4wIDAuMCBjbQpxClEKcQpxCjAuOTQ1MSAwLjk0OTAyIDAuOTQ5MDIgc2NuCjc0LjQgMjAzLjggbQo3NC40IDE3OC4zIGwKNjcuNiAxNzguMyBsCjY3LjYgMjAzLjggbAo2MC4wIDIwMy44IGwKNjAuMCAyMTAuMCBsCjgyLjAgMjEwLjAgbAo4Mi4wIDIwMy44IGwKNzQuNCAyMDMuOCBsCmgKZgpRCnEKMC45NDUxIDAuOTQ5MDIgMC45NDkwMiBzY24KOTEuMyAyMTAuMCBtCjkxLjMgMTk4LjcgbAo5Mi44IDE5OS41IDk0LjUgMjAwLjEgOTYuOCAyMDAuMSBjCjEwMi41IDIwMC4xIDEwNC4yIDE5Ny4xIDEwNC4yIDE5My4wIGMKMTA0LjIgMTc4LjQgbAo5Ny40IDE3OC40IGwKOTcuNCAxOTEuOSBsCjk3LjQgMTkzLjUgOTYuOSAxOTQuNSA5NS4wIDE5NC41IGMKOTMuNCAxOTQuNSA5MS45IDE5My44IDkxLjIgMTkzLjQgYwo5MS4yIDE3OC4zIGwKODQuNCAxNzguMyBsCjg0LjQgMjEwLjAgbAo5MS4zIDIxMC4wIGwKaApmClEKcQowLjk0NTEgMC45NDkwMiAwLjk0OTAyIHNjbgoxMTguNyAxOTMuMSBtCjExOC43IDE5NC4xIDExOC4wIDE5NC42IDExNi4yIDE5NC42IGMKMTEzLjUgMTk0LjYgMTEwLjUgMTkzLjggMTA4LjYgMTkzLjAgYwoxMDguNiAxOTguNyBsCjExMC4wIDE5OS4zIDExMy4yIDIwMC4xIDExNi4yIDIwMC4xIGMKMTIzLjggMjAwLjEgMTI1LjIgMTk2LjkgMTI1LjIgMTkyLjEgYwoxMjUuMiAxNzguNCBsCjEyMS4xIDE3OC40IGwKMTIwLjIgMTgwLjAgbAoxMTguNyAxNzguNiAxMTYuNSAxNzcuOCAxMTQuMCAxNzcuOCBjCjEwOC42IDE3Ny44IDEwNi44IDE4MS4zIDEwNi44IDE4NC41IGMKMTA2LjggMTkwLjIgMTExLjAgMTkxLjAgMTE0LjggMTkxLjQgYwoxMTguNiAxOTEuOCBsCjExOC42IDE5My4xIGwKaAoxMTUuOCAxODcuNyBtCjExMy45IDE4Ny40IDExMy4xIDE4Ni41IDExMy4xIDE4NC45IGMKMTEzLjEgMTgzLjMgMTE0LjEgMTgyLjQgMTE1LjUgMTgyLjQgYwoxMTYuNyAxODIuNCAxMTcuOSAxODIuNyAxMTguNSAxODMuNCBjCjExOC41IDE4OC4xIGwKMTE1LjggMTg3LjcgbApoCmYKUQpxCjAuOTQ1MSAwLjk0OTAyIDAuOTQ5MDIgc2NuCjEzMi44IDE5OS40IG0KMTMzLjYgMTk3LjkgbAoxMzYuMCAxOTkuMyAxMzguNiAyMDAuMCAxNDAuOSAyMDAuMCBjCjE0Ni42IDIwMC4wIDE0OC4zIDE5Ny4wIDE0OC4zIDE5Mi45IGMKMTQ4LjMgMTc4LjMgbAoxNDEuNSAxNzguMyBsCjE0MS41IDE5MS45IGwKMTQxLjUgMTkzLjUgMTQxLjAgMTk0LjUgMTM5LjEgMTk0LjUgYwoxMzcuNSAxOTQuNSAxMzYuMCAxOTMuOCAxMzUuMyAxOTMuNCBjCjEzNS4zIDE3OC4zIGwKMTI4LjUgMTc4LjMgbAoxMjguNSAxOTkuNCBsCjEzMi44IDE5OS40IGwKaApmClEKcQowLjk0NTEgMC45NDkwMiAwLjk0OTAyIHNjbgoxNTguNiAxOTIuNyBtCjE2NC4wIDE5OS41IGwKMTcyLjQgMTk5LjUgbAoxNjQuMiAxOTAuOSBsCjE3My4wIDE3OC40IGwKMTY0LjggMTc4LjQgbAoxNTkuOSAxODYuNCBsCjE1OC41IDE4NS4wIGwKMTU4LjUgMTc4LjUgbAoxNTIuMCAxNzguNSBsCjE1Mi4wIDIxMC4wIGwKMTU4LjUgMjEwLjAgbAoxNTguNSAxOTIuNyBsCmgKZgpRCnEKMC45NDUxIDAuOTQ5MDIgMC45NDkwMiBzY24KMTg4LjkgMTk5LjQgbQoxOTIuNCAxODcuMCBsCjE5NS45IDE5OS40IGwKMjAzLjIgMTk5LjQgbAoxOTEuMSAxNjcuNyBsCjE4My43IDE2Ny43IGwKMTg5LjIgMTc5LjYgbAoxODEuNiAxOTkuMyBsCjE4OC45IDE5OS4zIGwKaApmClEKcQowLjk0NTEgMC45NDkwMiAwLjk0OTAyIHNjbgoyMDQuMCAxODguOSBtCjIwNC4wIDE5NS41IDIwNi4xIDIwMC4wIDIxMy45IDIwMC4wIGMKMjIxLjcgMjAwLjAgMjIzLjggMTk1LjQgMjIzLjggMTg4LjkgYwoyMjMuOCAxODIuMyAyMjEuNyAxNzcuOCAyMTMuOSAxNzcuOCBjCjIwNi4xIDE3Ny44IDIwNC4wIDE4Mi4zIDIwNC4wIDE4OC45IGMKaAoyMTAuOCAxODguOSBtCjIxMC44IDE4NC43IDIxMS42IDE4My4yIDIxNC4wIDE4My4yIGMKMjE2LjQgMTgzLjIgMjE3LjIgMTg0LjcgMjE3LjIgMTg4LjkgYwoyMTcuMiAxOTMuMSAyMTYuNCAxOTQuNiAyMTQuMCAxOTQuNiBjCjIxMS42IDE5NC42IDIxMC44IDE5My4xIDIxMC44IDE4OC45IGMKaApmClEKcQowLjk0NTEgMC45NDkwMiAwLjk0OTAyIHNjbgoyNDIuMiAxNzguMyBtCjI0MS40IDE3OS44IGwKMjM5LjAgMTc4LjQgMjM2LjQgMTc3LjcgMjM0LjEgMTc3LjcgYwoyMjguNCAxNzcuNyAyMjYuNyAxODAuNyAyMjYuNyAxODQuOCBjCjIyNi43IDE5OS40IGwKMjMzLjUgMTk5LjQgbAoyMzMuNSAxODUuOCBsCjIzMy41IDE4NC4yIDIzNC4wIDE4My4yIDIzNS45IDE4My4yIGMKMjM3LjUgMTgzLjIgMjM5LjAgMTgzLjkgMjM5LjcgMTg0LjMgYwoyMzkuNyAxOTkuNCBsCjI0Ni41IDE5OS40IGwKMjQ2LjUgMTc4LjMgbAoyNDIuMiAxNzguMyBsCmgKZgpRCnEKMC45NDUxIDAuOTQ5MDIgMC45NDkwMiBzY24KMjUzLjIgMTg1LjggbQoyNTUuNCAxODUuOCAyNTcuMiAxODQuMCAyNTcuMiAxODEuOCBjCjI1Ny4yIDE3OS41IDI1NS40IDE3Ny44IDI1My4yIDE3Ny44IGMKMjUwLjkgMTc3LjggMjQ5LjIgMTc5LjUgMjQ5LjIgMTgxLjggYwoyNDkuMiAxODQuMCAyNTAuOSAxODUuOCAyNTMuMiAxODUuOCBjCmgKZgpRClEKUQpxCjYwLjAgMTM5LjI5MDU1IG0KMTAwLjAgMTM5LjI5MDU1IGwKMTAwLjAgMTUwLjAgbAo2MC4wIDE1MC4wIGwKaApXIG4KMC4wIDAuMCAwLjAgc2NuCjAuMTQyNiAwLjAgMC4wIDAuMTQyNiA1MS40NDM4NSAxMjguNjA5NjMgY20KMS4wIDAuMCAwLjAgMS4wIDAuMCAwLjAgY20KcQpxCjEuMjUgMC4wIDAuMCAtMS4yNSAtMTUuMCAyMjUuMCBjbQpxCnEKcQpxCnEKMS4wIDAuMCAwLjAgMS4wIDEwNy40NzI3IC00OS4zMzA2IGNtCnEKLTQuNyAxMzUuMSBtCi0yMy40IDEzNS4xIGwKLTIzLjkgMTM1LjEgLTI0LjMgMTM1LjUgLTI0LjMgMTM2LjAgYwotMjQuMyAxNDUuMSBsCi0yNC4zIDE0NS42IC0yMy45IDE0Ni4wIC0yMy40IDE0Ni4wIGMKLTE2LjEgMTQ2LjAgbAotMTYuMSAxNTcuMyBsCi0xNi4xIDE1Ny4zIC0xNy43IDE1Ny45IC0yMi4zIDE1Ny45IGMKLTI3LjYgMTU3LjkgLTM1LjEgMTU1LjkgLTM1LjEgMTM5LjYgYwotMzUuMSAxMjMuMiAtMjcuMyAxMjEuMSAtMjAuMSAxMjEuMSBjCi0xMy44IDEyMS4xIC0xMS4xIDEyMi4yIC05LjMgMTIyLjcgYwotOC44IDEyMi45IC04LjMgMTIyLjMgLTguMyAxMjEuOCBjCi02LjIgMTEzLjAgbAotNi4yIDExMi44IC02LjMgMTEyLjUgLTYuNSAxMTIuMyBjCi03LjIgMTExLjggLTExLjUgMTA5LjQgLTIyLjMgMTA5LjQgYwotMzQuOCAxMDkuNCAtNDcuNiAxMTQuNyAtNDcuNiAxNDAuMiBjCi00Ny42IDE2NS43IC0zMy4wIDE2OS41IC0yMC42IDE2OS41IGMKLTEwLjQgMTY5LjUgLTQuMiAxNjUuMSAtNC4yIDE2NS4xIGMKLTMuOSAxNjUuMCAtMy45IDE2NC42IC0zLjkgMTY0LjQgYwotMy45IDEzNS45IGwKLTMuOCAxMzUuNCAtNC4yIDEzNS4xIC00LjcgMTM1LjEgYwpmClEKUQpRCnEKcQoxLjAgMC4wIDAuMCAxLjAgMjA0LjQ3MjcgLTcxLjk5NzYgY20KcQotNC43IDEzNS4xIG0KLTQuNyAxMzQuNiAtNS4xIDEzNC4yIC01LjYgMTM0LjIgYwotMTYuMSAxMzQuMiBsCi0xNi42IDEzNC4yIC0xNy4wIDEzNC42IC0xNy4wIDEzNS4xIGMKLTE3LjAgMTM1LjEgLTE3LjAgMTU1LjQgLTE3LjAgMTU1LjQgYwotMzMuNCAxNTUuNCBsCi0zMy40IDEzNS4xIGwKLTMzLjQgMTM0LjYgLTMzLjggMTM0LjIgLTM0LjMgMTM0LjIgYwotNDQuOCAxMzQuMiBsCi00NS4zIDEzNC4yIC00NS43IDEzNC42IC00NS43IDEzNS4xIGMKLTQ1LjcgMTkwLjEgbAotNDUuNyAxOTAuNiAtNDUuMyAxOTEuMCAtNDQuOCAxOTEuMCBjCi0zNC4zIDE5MS4wIGwKLTMzLjggMTkxLjAgLTMzLjQgMTkwLjYgLTMzLjQgMTkwLjEgYwotMzMuNCAxNjYuNiBsCi0xNy4wIDE2Ni42IGwKLTE3LjAgMTY2LjYgLTE3LjAgMTkwLjEgLTE3LjAgMTkwLjEgYwotMTcuMCAxOTAuNiAtMTYuNiAxOTEuMCAtMTYuMSAxOTEuMCBjCi01LjYgMTkxLjAgbAotNS4xIDE5MS4wIC00LjcgMTkwLjYgLTQuNyAxOTAuMSBjCi00LjcgMTM1LjEgbApoCmYKUQpRClEKcQpxCjEuMCAwLjAgMC4wIDEuMCAxMjcuNjk0MyAtNjQuNzc5MyBjbQpxCi00LjcgMTM1LjEgbQotNC43IDEzMS4zIC03LjcgMTI4LjMgLTExLjUgMTI4LjMgYwotMTUuMiAxMjguMyAtMTguMyAxMzEuNCAtMTguMyAxMzUuMSBjCi0xOC4zIDEzOC44IC0xNS4zIDE0Mi4wIC0xMS41IDE0Mi4wIGMKLTcuNyAxNDEuOSAtNC43IDEzOC44IC00LjcgMTM1LjEgYwpmClEKUQpRCnEKcQoxLjAgMC4wIDAuMCAxLjAgMTI2Ljk0MjQgLTI4LjU4MyBjbQpxCi00LjcgMTM1LjEgbQotNC43IDEwOS43IGwKLTQuNyAxMDkuMiAtNS4xIDEwOC44IC01LjYgMTA4LjggYwotMTYuMCAxMDguOCBsCi0xNi41IDEwOC44IC0xNi45IDEwOS4zIC0xNi45IDEwOS44IGMKLTE2LjkgMTQ2LjIgbAotMTYuOSAxNDcuMyAtMTYuMiAxNDcuNiAtMTUuNCAxNDcuNiBjCi02LjAgMTQ3LjYgbAotNS4wIDE0Ny42IC00LjcgMTQ3LjEgLTQuNyAxNDYuMiBjCi00LjcgMTM1LjEgbApoCmYKUQpRClEKcQpxCjEuMCAwLjAgMC4wIDEuMCAyNDUuMjc0OSAtNTQuNzc0OSBjbQpxCi00LjcgMTM1LjEgbQotMTUuMSAxMzUuMSBsCi0xNS42IDEzNS4xIC0xNi4wIDEzNS41IC0xNi4wIDEzNi4wIGMKLTE2LjAgMTYzLjAgbAotMTYuMCAxNjMuMCAtMTguNyAxNjQuOSAtMjIuNCAxNjQuOSBjCi0yNi4yIDE2NC45IC0yNy4yIDE2My4yIC0yNy4yIDE1OS41IGMKLTI3LjIgMTM2LjAgbAotMjcuMiAxMzUuNSAtMjcuNiAxMzUuMSAtMjguMSAxMzUuMSBjCi0zOC43IDEzNS4xIGwKLTM5LjIgMTM1LjEgLTM5LjYgMTM1LjUgLTM5LjYgMTM2LjAgYwotMzkuNiAxNjEuMyBsCi0zOS42IDE3Mi4zIC0zMy41IDE3NC45IC0yNS4xIDE3NC45IGMKLTE4LjIgMTc0LjkgLTEyLjcgMTcxLjEgLTEyLjcgMTcxLjEgYwotMTIuNyAxNzEuMSAtMTIuNCAxNzMuMSAtMTIuMyAxNzMuMyBjCi0xMi4yIDE3My41IC0xMS45IDE3My44IC0xMS41IDE3My44IGMKLTQuOCAxNzMuOCBsCi00LjMgMTczLjggLTMuOSAxNzMuNCAtMy45IDE3Mi45IGMKLTMuOSAxMzYuMCBsCi0zLjggMTM1LjQgLTQuMiAxMzUuMSAtNC43IDEzNS4xIGMKZgpRClEKUQpxCnEKMS4wIDAuMCAwLjAgMS4wIDI3MC4yNTA1IC0yNS4wMDg4IGNtCnEKLTQuNyAxMzUuMSBtCi04LjMgMTM1LjAgLTEwLjggMTMzLjMgLTEwLjggMTMzLjMgYwotMTAuOCAxMTUuOSBsCi0xMC44IDExNS45IC04LjQgMTE0LjQgLTUuNCAxMTQuMSBjCi0xLjYgMTEzLjggMi4wIDExNC45IDIuMCAxMjMuOSBjCjIuMCAxMzMuMyAwLjQgMTM1LjIgLTQuNyAxMzUuMSBjCi0wLjYgMTA0LjEgbQotNi41IDEwNC4xIC0xMC42IDEwNi43IC0xMC42IDEwNi43IGMKLTEwLjYgODguMSBsCi0xMC42IDg3LjYgLTExLjAgODcuMiAtMTEuNSA4Ny4yIGMKLTIyLjAgODcuMiBsCi0yMi41IDg3LjIgLTIyLjkgODcuNiAtMjIuOSA4OC4xIGMKLTIyLjkgMTQzLjEgbAotMjIuOSAxNDMuNiAtMjIuNSAxNDQuMCAtMjIuMCAxNDQuMCBjCi0xNC43IDE0NC4wIGwKLTE0LjQgMTQ0LjAgLTE0LjEgMTQzLjggLTEzLjkgMTQzLjUgYwotMTMuNyAxNDMuMiAtMTMuNSAxNDEuMCAtMTMuNSAxNDEuMCBjCi0xMy41IDE0MS4wIC05LjIgMTQ1LjEgLTEuMCAxNDUuMSBjCjguNiAxNDUuMSAxNC4xIDE0MC4yIDE0LjEgMTIzLjMgYwoxNC4yIDEwNi4zIDUuNCAxMDQuMSAtMC42IDEwNC4xIGMKZgpRClEKUQpxCnEKMS4wIDAuMCAwLjAgMS4wIDE1Ni45NzEyIC01NC44NjIzIGNtCnEKLTQuNyAxMzUuMSBtCi0xMi42IDEzNS4xIGwKLTEyLjYgMTM1LjEgLTEyLjYgMTI0LjcgLTEyLjYgMTI0LjcgYwotMTIuNiAxMjQuMyAtMTIuOCAxMjQuMSAtMTMuMyAxMjQuMSBjCi0yNC4wIDEyNC4xIGwKLTI0LjQgMTI0LjEgLTI0LjYgMTI0LjMgLTI0LjYgMTI0LjcgYwotMjQuNiAxMzUuNCBsCi0yNC42IDEzNS40IC0zMC4wIDEzNi43IC0zMC40IDEzNi44IGMKLTMwLjggMTM2LjkgLTMxLjAgMTM3LjIgLTMxLjAgMTM3LjYgYwotMzEuMCAxNDQuNCBsCi0zMS4wIDE0NC45IC0zMC42IDE0NS4zIC0zMC4xIDE0NS4zIGMKLTI0LjYgMTQ1LjMgbAotMjQuNiAxNjEuNiBsCi0yNC42IDE3My43IC0xNi4xIDE3NC45IC0xMC40IDE3NC45IGMKLTcuOCAxNzQuOSAtNC43IDE3NC4xIC00LjEgMTczLjkgYwotMy44IDE3My44IC0zLjYgMTczLjUgLTMuNiAxNzMuMSBjCi0zLjYgMTY1LjYgbAotMy42IDE2NS4xIC00LjAgMTY0LjcgLTQuNSAxNjQuNyBjCi01LjAgMTY0LjcgLTYuMSAxNjQuOSAtNy4zIDE2NC45IGMKLTExLjIgMTY0LjkgLTEyLjUgMTYzLjEgLTEyLjUgMTYwLjggYwotMTIuNSAxNTguNSAtMTIuNSAxNDUuMyAtMTIuNSAxNDUuMyBjCi00LjYgMTQ1LjMgbAotNC4xIDE0NS4zIC0zLjcgMTQ0LjkgLTMuNyAxNDQuNCBjCi0zLjcgMTM1LjkgbAotMy44IDEzNS40IC00LjIgMTM1LjEgLTQuNyAxMzUuMSBjCmYKUQpRClEKUQpRClEKUQpRClEKMC42IDAuNiAwLjYgc2NuCjAuMyB3CjAuNjY2NjcgMC42NjY2NyAwLjY2NjY3IFNDTgoKQlQKNjAuMCAxMTUuODAwNTUgVGQKL0YxLjAgMTAgVGYKPDQ3Njk3NDQ4NzU2MjJjMjA0OTZlNjMyZT4gVGoKRVQKCgpCVAo2MC4wIDEwMi4zMjA1NSBUZAovRjEuMCAxMCBUZgpbPDM4MzgyMDQzNmY2YzY5NmUyMDUwPiAxMjguOTA2MjUgPDJlMjA0YjY1NmM2Yzc5MjA0YTcyPiA1NC42ODc1IDwyZTIwNTM3NDcyNjU2NTc0Pl0gVEoKRVQKCgpCVAo2MC4wIDg4Ljg0MDU1IFRkCi9GMS4wIDEwIFRmCls8NTM2MTZlMjA0NjcyNjE2ZTYzNjk3MzYzNmYyYzIwNDM0MT4gNTQuNjg3NSA8MjAzOTM0MzEzMDM3Pl0gVEoKRVQKCgpCVAo2MC4wIDc1LjM2MDU1IFRkCi9GMS4wIDEwIFRmCjw1NTZlNjk3NDY1NjQyMDUzNzQ2MTc0NjU3Mz4gVGoKRVQKCjAuMyB3CjAuNjY2NjcgMC42NjY2NyAwLjY2NjY3IFNDTgoKQlQKMjEwLjAgMTE1LjgwMDU1IFRkCi9GMS4wIDEwIFRmCjw2ODc0NzQ3MDczM2EyZjJmNzM3NTcwNzA2ZjcyNzQyZTY3Njk3NDY4NzU2MjJlNjM2ZjZkMmY2MzZmNmU3NDYxNjM3ND4gVGoKRVQKCgpCVAo2MC4wIDUwLjAgVGQKL0YxLjAgMTAgVGYKWzwyYTIwNTY+IDczLjczMDQ3IDw0MT4gNzMuNzMwNDcgPDU0MmY0NzUzNTQ+IDE3LjU3ODEyIDwyMDcwNjE2OTY0MjA2NDY5NzI2NTYzNzQ2Yzc5MjA2Mjc5MjA0NzY5NzQ0ODc1NjIyYzIwNzc2ODY1NzI2NTIwNjE3MDcwNmM2OTYzNjE2MjZjNjU+XSBUSgpFVAoKUQoKZW5kc3RyZWFtCmVuZG9iago1IDAgb2JqCjw8IC9Bbm5vdHMgWzkgMCBSXQovQXJ0Qm94IFswIDAgNjEyIDc5Ml0KL0JsZWVkQm94IFswIDAgNjEyIDc5Ml0KL0NvbnRlbnRzIDQgMCBSCi9Dcm9wQm94IFswIDAgNjEyIDc5Ml0KL01lZGlhQm94IFswIDAgNjEyIDc5Ml0KL1BhcmVudCAzIDAgUgovUmVzb3VyY2VzIDw8IC9Gb250IDw8IC9GMS4wIDggMCBSCi9GMi4wIDEwIDAgUgo+PgovUHJvY1NldCBbL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSV0KL1hPYmplY3QgPDwgL0kxIDYgMCBSCj4+Cj4+Ci9UcmltQm94IFswIDAgNjEyIDc5Ml0KL1R5cGUgL1BhZ2UKPj4KZW5kb2JqCjYgMCBvYmoKPDwgL0JpdHNQZXJDb21wb25lbnQgOAovQ29sb3JTcGFjZSAvRGV2aWNlUkdCCi9EZWNvZGVQYXJtcyBbPDwgL0JpdHNQZXJDb21wb25lbnQgOAovQ29sb3JzIDMKL0NvbHVtbnMgMzAyCi9QcmVkaWN0b3IgMTUKPj5dCi9GaWx0ZXIgWy9GbGF0ZURlY29kZV0KL0hlaWdodCAyMDAKL0xlbmd0aCA2Nzc0Ci9TTWFzayA3IDAgUgovU3VidHlwZSAvSW1hZ2UKL1R5cGUgL1hPYmplY3QKL1dpZHRoIDMwMgo+PgpzdHJlYW0KeJztnd9v40aSx9kkLVszGazXmziT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KAWAABoELwAfAAD/2QAA/9oAAP/Z/lX/5gXHABD+bf/xAzsAAAC5AAAAuQL+PzwAwACNAJsArwAGAKgAwAAoAF4AmADJAWoAuQFcALQA1gEeAC4AgAAEALgATADMAf//0QBmAKQArwB0AMIAlQCxAAwAKABtABUATACOASX/egAMAEAATABiAIT/ogAkADgAhgC9ADkAXgCOAO3/qf+zAEAAUgBVAKoAqwDCAMsBIwKxBBP/rv/kAAgAUQB0AIQAqgDR/0z/rwASACwAQgBQAFEAhAC+ASUD2v9oABgAOwCYAJwAnwChAMEA7AGCAbT/aP92/9D/4QACABgAHABTAFMAfQG0AeEDrwSG/5z/6v/+AB8AKAAqAFIAYACTAKMAqgCvAK8AwAEAAUUBawF0AZMBlQJAAoICtASFBRf+/QAGACkARwBHAEgAbwCIALQAuQDEAPIA+QHvAhgDEAN0A8X/Nf/zAAsASwBMAFIAVQBlAHYAdgCHAIcAjgCrALsBBgEwAUMBUAF9AZQBlQHTAioCVQJYAncCeALmA04DXAN5A9MEcwSyBYwFmAYL/vX/u//H/9UAFwAdAFsAcgB+AJwAwgDQAPQA+gEDAQYBHAElATsBQgFeAV4BgAGbArkBoQG5AlABwAHQAqoB3wHjAe8B+wIFAgwCFQIrAnQCkwKrAsICzgNpA5UDmQPfA/UEPgUCBaEF5QYlB9v+Yv6J/s7/O//h//gAAwAIACEAOQBCAE4AXwBhAG8AcAA0AH8AjgCtAK0ArwC9AMQAxQDJAMkAyQDjARwA7QD4APkBAAESARoBMgFNAU0BTgFPAWYBaQGeAboBugG+AeMB7wH2AgACAAIJAhECFwIcAlMCYgJtAoAC1QKAAxsDKgNKA1oDrwOvA8gD1gP7A/sEBQQTBBUERwRJAIwEbQSaBJoEpgSoBLIEzwU5BT4FTgVWBYAFiQWMA2MF0QXWBn4GjgayBu8G8AcoB0wHbweMALQAyQDAAMEAAAAAAAAAAAAAAAAABAEkAK8AMgBuAGMBRAFiAJYBQwGhAWEAigB0AGQBiAHvAXAAKP9dA34DRwIwAKoAvgB7AGIAmgB9AIkDXACh/9gDqgDXAJMAbAAAAIAApwRCAB0FlwAdAIIAMAAqACoAKgAqACoAAAA0ADQAZACGAM4BEAGIAboB2gH+AmwCkgMeA2wD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AwABDAoAAgAMA52pIDE5OTAtMjAwNiBBcHBsZSBDb21wdXRlciBJbmMuIKkgMTk4MSBMaW5vdHlwZSBBRyCpIDE5OTAtOTEgVHlwZSBTb2x1dGlvbnMgSW5jLkhlbHZldGljYVJlZ3VsYXJIZWx2ZXRpY2E7IDcuMGQyMGUxOyAyMDExLTA0LTA1SGVsdmV0aWNhNy4wZDIwZTEyOTcwMGIrSGVsdmV0aWNhSGVsdmV0aWNhIGlzIGEgcmVnaXN0ZXJlZCB0cmFkZW1hcmsgb2YgTGlub3R5cGUgQUdIZWx2ZXRpY2FMaWdhdHVyZXNDb21tb24gTGlnYXR1cmVzTnVtYmVyIFNwYWNpbmdQcm9wb3J0aW9uYWwgTnVtYmVyc01vbm9zcGFjZWQgTnVtYmVyc05vIENoYW5nZUxpZ2F0dXJlc0NvbW1vbiBMaWdhdHVyZXNOdW1iZXIgU3BhY2luZ1Byb3BvcnRpb25hbCBOdW1iZXJzSGVsdmV0aWNhIGVzdCB1bmUgbWFycXVlIGSOcG9zjmUgZGUgTGlub3R5cGUgQUdIZWx2ZXRpY2EgaXN0IGVpbiBlaW5nZXRyYWdlbmVzIFdhcmVuemVpY2hlbiBkZXIgTGlub3R5cGUgQUdIZWx2ZXRpY2EgjyB1biBtYXJjaGlvIHJlZ2lzdHJhdG8gZGkgTGlub3R5cGUgQUdIZWx2ZXRpY2EgaXMgZWVuIGdlcmVnaXN0cmVlcmQgaGFuZGVsc21lcmsgdmFuIExpbm90eXBlIEFHSGVsdmV0aWNhIIpyIGV0dCByZWdpc3RyZXJhdCB2YXJ1bYpya2UgZppyIExpbm90eXBlIEFHSGVsdmV0aWNhIGVzIHVuYSBtYXJjYSByZWdpc3RyYWRhIGRlIExpbm90eXBlIEFHSGVsdmV0aWNhIGVyIGV0IHJlZ2lzdHJlcmV0IHZhcmVtvnJrZSB0aWxov3JlbmRlIExpbm90eXBlIEFHahlulprUAE8AcgBkAGkAbgDmAHIATgBvAHIAbQBhAGwAUgBlAGcAdQBsAGEAcgBOAG8AcgBtAGEAYQBsAGkATgBvAHIAbQBhAGwAUgBlAGcAbwBsAGEAcgBlMOwwrjDlMOkw/Md8vBjMtABSAGUAZwB1AGwAaQBlAHIATgBvAHIAbQBhAGwATgBvAHIAbQBhAGwEHgQx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MSBMaW5vdHlwZSBBRyCpIDE5OTAtOTEgVHlwZSBTb2x1dGlvbnMgSW5jLkhlbHZldGljYUJvbGRIZWx2ZXRpY2EgQm9sZDsgNi4xZDE4ZTE7IDIwMDktMDYtMjlIZWx2ZXRpY2EgQm9sZDYuMWQxOGUxZDRmOTBkK0hlbHZldGljYS1Cb2xkSGVsdmV0aWNhIGlzIGEgcmVnaXN0ZXJlZCB0cmFkZW1hcmsgb2YgTGlub3R5cGUgQUdIZWx2ZXRpY2EgQm9sZABIAGUAbAB2AGUAdABpAGMAYQAgBiMGMwZIBi98l5rUAEYAZQBkAEgAZQBsAHYAZQB0AGkAYwBhACAAZQByACAAZQB0ACAAcgBlAGcAaQBzAHQAcgBlAHIAZQB0ACAAdgBhAHIAZQBtAOYAcgBrAGUAIAB0AGkAbABoAPgAcgBlAG4AZABlACAATABpAG4AbwB0AHkAcABlACAAQQBHAEYAZQB0AHQASABlAGwAdgBlAHQAaQBjAGEAIABGAGUAdAB0AEgAZQBsAHYAZQB0AGkAYwBhACAAaQBzAHQAIABlAGkAbgAgAGUAaQBuAGcAZQB0AHIAYQBnAGUAbgBlAHMAIABXAGEAcgBlAG4AegBlAGkAYwBoAGUAbgAgAGQAZQByACAATABpAG4AbwB0AHkAcABlACAAQQBHAKkAIAAxADkAOQAwAC0AMgAwADAANgAgAEEAcABwAGwAZQAgAEMAbwBtAHAAdQB0AGUAcgAgAEkAbgBjAC4AIACpACAAMQA5ADgAMQAgAEwAaQBuAG8AdAB5AHAAZQAgAEEARwAgAKkAIAAxADkAOQAwAC0AOQAxACAAVAB5AHAAZQAgAFMAbwBsAHUAdABpAG8AbgBzACAASQBuAGMALgBIAGUAbAB2AGUAdABpAGMAYQBCAG8AbABkAEgAZQBsAHYAZQB0AGkAYwBhACAAQgBvAGwAZAA7ACAANgAuADEAZAAxADgAZQAxADsAIAAyADAAMAA5AC0AMAA2AC0AMgA5AEgAZQBsAHYAZQB0AGkAYwBhACAAQgBvAGwAZAA2AC4AMQBkADEAOABlADEASABlAGwAdgBlAHQAaQBjAGEAIABpAHMAIABhACAAcgBlAGcAaQBzAHQAZQByAGUAZAAgAHQAcgBhAGQAZQBtAGEAcgBrACAAbwBmACAATABpAG4AbwB0AHkAcABlACAAQQBHAEgAZQBsAHYAZQB0AGkAYwBhACAAQgBvAGwAZABIAGUAbAB2AGUAdABpAGMAYQAgAE4AZQBnAHIAaQB0AGEASABlAGwAdgBlAHQAaQBjAGEAIABlAHMAIAB1AG4AYQAgAG0AYQByAGMAYQAgAHIAZQBnAGkAcwB0AHIAYQBkAGEAIABkAGUAIABMAGkAbgBvAHQAeQBwAGUAIABBAEcAUAB1AG8AbABpAGwAaQBoAGEAdgBhAEgAZQBsAHYAZQB0AGkAYwBhACAAbABpAGgAYQB2AGEARwByAGEAcwBIAGUAbAB2AGUAdABpAGMAYQAgAEcAcgBhAHMASABlAGwAdgBlAHQAaQBjAGEAIABlAHMAdAAgAHUAbgBlACAAbQBhAHIAcQB1AGUAIABkAOkAcABvAHMA6QBlACAAZABlACAATABpAG4AbwB0AHkAcABlACAAQQBHAEgAZQBsAHYAZQB0AGkAYwBhACAF4gXRBdQARwByAGEAcwBzAGUAdAB0AG8ASABlAGwAdgBlAHQAaQBjAGEAIABnAHIAYQBzAHMAZQB0AHQAbwBIAGUAbAB2AGUAdABpAGMAYQAgAOgAIAB1AG4AIABtAGEAcgBjAGgAaQBvACAAcgBlAGcAaQBzAHQAcgBhAHQAbwAgAGQAaQAgAEwAaQBuAG8AdAB5AHAAZQAgAEEARzDcMPww6zDJvPy03My0AFYAZQB0AEgAZQBsAHYAZQB0AGkAYwBhACAAdgBlAHQASABlAGwAdgBlAHQAaQBjAGEAIABpAHMAIABlAGUAbgAgAGcAZQByAGUAZwBpAHMAdAByAGUAZQByAGQAIABoAGEAbgBkAGUAbABzAG0AZQByAGsAIAB2AGEAbgAgAEwAaQBuAG8AdAB5AHAAZQAgAEEARwBGAGUAdABIAGUAbAB2AGUAdABpAGMAYQAgAEgAYQBsAHYAZgBlAHQATgBlAGcAcgBpAHQAbwBIAGUAbAB2AGUAdABpAGMAYQAgAEMAYQByAHIAZQBnAGEAZABvBBYEOARABD0ESwQ5AEYAZQB0AEgAZQBsAHYAZQB0AGkAYwBhACAARgBlAHQASABlAGwAdgBlAHQAaQBjAGEAIADkAHIAIABlAHQAdAAgAHIAZQBnAGkAcwB0AHIAZQByAGEAdAAgAHYAYQByAHUAbQDkAHIAawBlACAAZgD2AHIAIABMAGkAbgBvAHQAeQBwAGUAIABBAEcASABlAGwAdgBlAHQAaQBjAGEAIAYoBjEGLAYzBioGR3yXT1MATgBlAGcAcgBpAHQAYQAAAAIAAAAAAAD/ZQBlAAAAAAAAAAAAAAAAAAAAAAAAAAAALAAAAAMABwANABAAEQATABQAFQAWABcAGAAZABoAGwAcAB0AJgAnACkAKwAsAC0ALwAwADMANQA2ADcAOAA5AEIARABGAEcASABJAEoASwBMAFMAVQBWAFoAAAplbmRzdHJlYW0KZW5kb2JqCjE2IDAgb2JqCjw8IC9Bc2NlbnQgNzUwCi9DYXBIZWlnaHQgMTQ0NgovRGVzY2VudCAtMTY5Ci9GbGFncyA0Ci9Gb250QkJveCBbLTEwMTcgLTQ4MCAxNDM2IDExNTldCi9Gb250RmlsZTIgMTUgMCBSCi9Gb250TmFtZSAvZDRmOTBkK0hlbHZldGljYS1Cb2xkCi9JdGFsaWNBbmdsZSAwCi9TdGVtViAwCi9UeXBlIC9Gb250RGVzY3JpcHRvcgovWEhlaWdodCAxMDg4Cj4+CmVuZG9iagoxNyAwIG9iago8PCAvTGVuZ3RoIDU5Ngo+PgpzdHJlYW0KL0NJREluaXQgL1Byb2NTZXQgZmluZHJlc291cmNlIGJlZ2luCjEyIGRpY3QgYmVnaW4KYmVnaW5jbWFwCi9DSURTeXN0ZW1JbmZvIDMgZGljdCBkdXAgYmVnaW4KICAvUmVnaXN0cnkgKEFkb2JlKSBkZWYKICAvT3JkZXJpbmcgKFVDUykgZGVmCiAgL1N1cHBsZW1lbnQgMCBkZWYKZW5kIGRlZgovQ01hcE5hbWUgL0Fkb2JlLUlkZW50aXR5LVVDUyBkZWYKL0NNYXBUeXBlIDIgZGVmCjEgYmVnaW5jb2Rlc3BhY2VyYW5nZQo8MDA+PDc3PgplbmRjb2Rlc3BhY2VyYW5nZQo4IGJlZ2luYmZyYW5nZQo8MkQ+PDJFPjwwMDJkPgo8MzA+PDNBPjwwMDMwPgo8NDM+PDQ0PjwwMDQzPgo8NDg+PDRBPjwwMDQ4Pgo8NEM+PDREPjwwMDRjPgo8NTI+PDU2PjwwMDUyPgo8NjM+PDY5PjwwMDYzPgo8NzI+PDczPjwwMDcyPgplbmRiZnJhbmdlCjkgYmVnaW5iZmNoYXIKPDIwPjwwMDIwPgo8MjQ+PDAwMjQ+CjwyQT48MDAyYT4KPDQ2PjwwMDQ2Pgo8NTA+PDAwNTA+Cjw1Rj48MDA1Zj4KPDYxPjwwMDYxPgo8NzA+PDAwNzA+Cjw3Nz48MDA3Nz4KZW5kYmZjaGFyCmVuZGNtYXAKQ01hcE5hbWUgY3VycmVudGRpY3QgL0NNYXAgZGVmaW5lcmVzb3VyY2UgcG9wCmVuZAplbmQKZW5kc3RyZWFtCmVuZG9iagoxOCAwIG9iagpbMjc3IDAgMCAwIDU1NiAwIDAgMCAwIDAgMzg5IDAgMCAzMzMgMjc3IDAgNTU2IDU1NiA1NTYgNTU2IDU1NiA1NTYgNTU2IDU1NiA1NTYgNTU2IDMzMyAwIDAgMCAwIDAgMCAwIDAgNzIyIDcyMiAwIDYxMCAwIDcyMiAyNzcgNTU2IDAgNjEwIDgzMyAwIDAgNjY2IDAgNzIyIDY2NiA2MTAgNzIyIDY2NiAwIDAgMCAwIDAgMCAwIDAgNTU2IDAgNTU2IDAgNTU2IDYxMCA1NTYgMzMzIDYxMCA2MTAgMjc3IDAgMCAwIDAgMCAwIDYxMCAwIDM4OSA1NTYgMCAwIDAgNzc3XQplbmRvYmoKeHJlZgowIDE5CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMTA5IDAwMDAwIG4gCjAwMDAwMDAxNTggMDAwMDAgbiAKMDAwMDAwMDIxNSAwMDAwMCBuIAowMDAwMDExMTE0IDAwMDAwIG4gCjAwMDAwMTE0MzQgMDAwMDAgbiAKMDAwMDAxODQ3MSAwMDAwMCBuIAowMDAwMDIyODA2IDAwMDAwIG4gCjAwMDAwMjI5NzAgMDAwMDAgbiAKMDAwMDAyMzE1NiAwMDAwMCBuIAowMDAwMDIzMzI2IDAwMDAwIG4gCjAwMDAwNDI1MTkgMDAwMDAgbiAKMDAwMDA0MjczMCAwMDAwMCBuIAowMDAwMDQzMzY5IDAwMDAwIG4gCjAwMDAwNDM2ODIgMDAwMDAgbiAKMDAwMDA1OTYzNSAwMDAwMCBuIAowMDAwMDU5ODUyIDAwMDAwIG4gCjAwMDAwNjA1MDAgMDAwMDAgbiAKdHJhaWxlcgo8PCAvSW5mbyAxIDAgUgovUm9vdCAyIDAgUgovU2l6ZSAxOQo+PgpzdGFydHhyZWYKNjA3ODAKJSVFT0YK","data:application/pdf;base64,JVBERi0xLjMKJf////8KMSAwIG9iago8PCAvQ3JlYXRvciA8ZmVmZjAwNTAwMDcyMDA2MTAwNzcwMDZlPgovUHJvZHVjZXIgPGZlZmYwMDUwMDA3MjAwNjEwMDc3MDA2ZT4KPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1BhZ2VzIDMgMCBSCi9UeXBlIC9DYXRhbG9nCj4+CmVuZG9iagozIDAgb2JqCjw8IC9Db3VudCAxCi9LaWRzIFs1IDAgUl0KL1R5cGUgL1BhZ2VzCj4+CmVuZG9iago0IDAgb2JqCjw8IC9MZW5ndGggMTEwOTQKPj4Kc3RyZWFtCnEKMC4zIHcKCnEKODAuMCAwLjAgMC4wIDcwLjU2IDI2Ni4wIDY3MS40NCBjbQovSTEgRG8KUQovRGV2aWNlUkdCIENTCjAuNjY2NjcgMC42NjY2NyAwLjY2NjY3IFNDTgovRGV2aWNlUkdCIGNzCjAuNDY2NjcgMC40NjY2NyAwLjQ2NjY3IHNjbgoyNzYuMCA2NTYuNDQgbQozMzYuMCA2NTYuNDQgbAowLjIgMC4yIDAuMiBzY24KCkJUCjYwLjAgNjI4LjE5IFRkCi9GMS4wIDExIFRmCjw1NDY4NjE2ZTZiNzMyMDY2NmY3MjIwNzk2Zjc1NzIyMDcwNzU3MjYzNjg2MTczNjUyMT4gVGoKRVQKCgpCVAo2MC4wIDYxMi43NjIgVGQKL0YxLjAgMTEgVGYKWzw1MTc1NjU3Mzc0Njk2ZjZlNzMzZjIwNTY+IDE3LjU3ODEyIDw2OTczNjk3NDIwPl0gVEoKRVQKCjAuMCAwLjUzMzMzIDAuOCBzY24KMC4wIDAuNTMzMzMgMC44IFNDTgoKQlQKMTQyLjI3MzY0IDYxMi43NjIgVGQKL0YxLjAgMTEgVGYKPDY4NzQ3NDcwNzMzYTJmMmY3Mzc1NzA3MDZmNzI3NDJlNjc2OTc0Njg3NTYyMmU2MzZmNmQyZjYzNmY2ZTc0NjE2Mzc0PiBUagpFVAoKMC42NjY2NyAwLjY2NjY3IDAuNjY2NjcgU0NOCjAuMiAwLjIgMC4yIHNjbgoKQlQKMzA3LjIyOTY0IDYxMi43NjIgVGQKL0YxLjAgMTEgVGYKPDJlPiBUagpFVAoKMC4zIHcKMC42NjY2NyAwLjY2NjY3IDAuNjY2NjcgU0NOCgpCVAo2MC4wIDU3MS4yNDUgVGQKL0YxLjAgMTEgVGYKPDQ0NjE3NDY1PiBUagpFVAoKMC4zIHcKMC42NjY2NyAwLjY2NjY3IDAuNjY2NjcgU0NOCgpCVAoyMDAuMCA1NzEuMjQ1IFRkCi9GMi4wIDExIFRmCjwzMjMwMzIzNTJkMzAzODJkMzAzNDIwMzEzMjNhMzAzMzUwNGQyMDUwNDQ1ND4gVGoKRVQKCjAuMyB3CjAuODY2NjcgMC44NjY2NyAwLjg2NjY3IFNDTgo2MC4wIDU2MC4xNTYgbQoyMDAuMCA1NjAuMTU2IGwKUwpbXSAwIGQKMC4zIHcKMC42NjY2NyAwLjY2NjY3IDAuNjY2NjcgU0NOCgpCVAo2MC4wIDU0MC44MTcgVGQKL0YxLjAgMTEgVGYKPDQxNjM2MzZmNzU2ZTc0MjA2MjY5NmM2YzY1NjQ+IFRqCkVUCgowLjMgdwowLjg2NjY3IDAuODY2NjcgMC44NjY2NyBTQ04KMjAwLjAgNTYwLjE1NiBtCjU1Mi4wIDU2MC4xNTYgbApTCltdIDAgZAowLjMgdwowLjY2NjY3IDAuNjY2NjcgMC42NjY2NyBTQ04KCkJUCjIwMC4wIDU0MC44MTcgVGQKL0YyLjAgMTEgVGYKPDUyNjE3MDMxMzkzMjMyPiBUagpFVAoKCkJUCjI0NS4yMzIgNTQwLjgxNyBUZAovRjEuMCAxMSBUZgo8MjAyODcyNjk3OTYxNmU2MTY3NzU2ZTY3NzA3MjYxNzQ2MTZkNjE0MDY3NmQ2MTY5NmMyZTYzNmY2ZDI5PiBUagpFVAoKMC4zIHcKMC44NjY2NyAwLjg2NjY3IDAuODY2NjcgU0NOCjYwLjAgNTI5LjcyOCBtCjIwMC4wIDUyOS43MjggbApTCltdIDAgZAowLjMgdwowLjY2NjY3IDAuNjY2NjcgMC42NjY2NyBTQ04KCkJUCjYwLjAgNTEwLjM4OSBUZAovRjEuMCAxMSBUZgpbPDU0PiAzNi42MjEwOSA8NzI2MTZlNzM2MTYzNzQ2OTZmNmUyMDQ5NDQ+XSBUSgpFVAoKMC4zIHcKMC44NjY2NyAwLjg2NjY3IDAuODY2NjcgU0NOCjIwMC4wIDUyOS43MjggbQo1NTIuMCA1MjkuNzI4IGwKUwpbXSAwIGQKMC4zIHcKMC42NjY2NyAwLjY2NjY3IDAuNjY2NjcgU0NOCgpCVAoyMDAuMCA1MTAuMzg5IFRkCi9GMi4wIDExIFRmCjw2MzY4NWYzMzUyNzM1NDY2MzI0YTQ2NzIzNjQzNDM0ODc3NDk2OTMxNDM0YzYxMzYzMDM5NTM+IFRqCkVUCgowLjMgdwowLjg2NjY3IDAuODY2NjcgMC44NjY2NyBTQ04KNjAuMCA0OTkuMyBtCjIwMC4wIDQ5OS4zIGwKUwpbXSAwIGQKMC4zIHcKMC42NjY2NyAwLjY2NjY3IDAuNjY2NjcgU0NOCgpCVAo2MC4wIDQ3OS45NjEgVGQKL0YxLjAgMTEgVGYKPDQzNjg2MTcyNjc2NTY0MjA3NDZmPiBUagpFVAoKMC4zIHcKMC44NjY2NyAwLjg2NjY3IDAuODY2NjcgU0NOCjIwMC4wIDQ5OS4zIG0KNTUyLjAgNDk5LjMgbApTCltdIDAgZAowLjMgdwowLjY2NjY3IDAuNjY2NjcgMC42NjY2NyBTQ04KCkJUCjIwMC4wIDQ3OS45NjEgVGQKL0YyLjAgMTEgVGYKWzw1Nj4gMTcuNTc4MTIgPDY5NzM2MT5dIFRKCkVUCgoKQlQKMjIyLjQxMTY0IDQ3OS45NjEgVGQKL0YxLjAgMTEgVGYKPDIwMjgzNDJhMmEyYTIwMmEyYTJhMmEyMDJhMmEyYTJhMjAzNzMyMzEzNDI5PiBUagpFVAoKMC4zIHcKMC44NjY2NyAwLjg2NjY3IDAuODY2NjcgU0NOCjYwLjAgNDY4Ljg3MiBtCjIwMC4wIDQ2OC44NzIgbApTCltdIDAgZAowLjMgdwowLjY2NjY3IDAuNjY2NjcgMC42NjY2NyBTQ04KCkJUCjYwLjAgNDQ5LjUzMyBUZAovRjIuMCAxMSBUZgo8NDQ2NTczNjM3MjY5NzA3NDY5NmY2ZT4gVGoKRVQKCjAuMyB3CjAuODY2NjcgMC44NjY2NyAwLjg2NjY3IFNDTgoyMDAuMCA0NjguODcyIG0KNTUyLjAgNDY4Ljg3MiBsClMKW10gMCBkCjAuMyB3CjAuNjY2NjcgMC42NjY2NyAwLjY2NjY3IFNDTgoKQlQKMjAwLjAgNDQ5LjUzMyBUZAovRjIuMCAxMSBUZgo8NDE2ZDZmNzU2ZTc0PiBUagpFVAoKMC4zIHcKMC44NjY2NyAwLjg2NjY3IDAuODY2NjcgU0NOCjYwLjAgNDM4LjQ0NCBtCjIwMC4wIDQzOC40NDQgbApTCltdIDAgZAowLjMgdwowLjY2NjY3IDAuNjY2NjcgMC42NjY2NyBTQ04KCkJUCjYwLjAgNDEwLjc3NiBUZAovRjEuMCAxMSBUZgo8NDc2OTc0NDg3NTYyMjA0MzZmNzA2OTZjNmY3NDIwNTA3MjZmMjAyZDIwNmQ2ZjZlNzQ2OD4gVGoKRVQKCjAuMyB3CjAuODY2NjcgMC44NjY2NyAwLjg2NjY3IFNDTgoyMDAuMCA0MzguNDQ0IG0KNTUyLjAgNDM4LjQ0NCBsClMKW10gMCBkCjAuMyB3CjAuNjY2NjcgMC42NjY2NyAwLjY2NjY3IFNDTgowLjMgdwowLjY2NjY3IDAuNjY2NjcgMC42NjY2NyBTQ04KCkJUCjIwMC4wIDQxOS4xMDUgVGQKL0YyLjAgMTEgVGYKPDI0MzYyZTM3MzcyMDU1NTM0ND4gVGoKRVQKCjAuMyB3CjAuNjY2NjcgMC42NjY2NyAwLjY2NjY3IFNDTgowLjM1Mjk0IDAuMzUyOTQgMC4zNTI5NCBzY24KCkJUCjIwMC4wIDQwNS40MjcgVGQKL0YxLjAgMTAgVGYKWzw0MTc1NjcyMDM0MmMyMDMyMzAzMjM1MjAyZDIwPiA1NC42ODc1IDw0MTc1NjcyMDMyMzQyYzIwMzIzMDMyMzU+XSBUSgpFVAoKMC4yIDAuMiAwLjIgc2NuCjAuMyB3CjAuODY2NjcgMC44NjY2NyAwLjg2NjY3IFNDTgo2MC4wIDM5NC41MzYgbQoyMDAuMCAzOTQuNTM2IGwKUwpbXSAwIGQKMC4zIHcKMC42NjY2NyAwLjY2NjY3IDAuNjY2NjcgU0NOCgpCVAo2MC4wIDM3My42MDggVGQKL0YxLjAgMTEgVGYKWzw1ND4gMTEwLjgzOTg0IDw2MTc4Pl0gVEoKRVQKCjAuMyB3CjAuODY2NjcgMC44NjY2NyAwLjg2NjY3IFNDTgoyMDAuMCAzOTQuNTM2IG0KNTUyLjAgMzk0LjUzNiBsClMKW10gMCBkCjAuMyB3CjAuNjY2NjcgMC42NjY2NyAwLjY2NjY3IFNDTgowLjMgdwowLjY2NjY3IDAuNjY2NjcgMC42NjY2NyBTQ04KCkJUCjIwMC4wIDM3NS4xOTcgVGQKL0YyLjAgMTEgVGYKPDI0MzAyZTMwMzAyMDU1NTM0ND4gVGoKRVQKCjAuMyB3CjAuODY2NjcgMC44NjY2NyAwLjg2NjY3IFNDTgo2MC4wIDM2NC4xMDggbQoyMDAuMCAzNjQuMTA4IGwKUwpbXSAwIGQKMC4zIHcKMC42NjY2NyAwLjY2NjY3IDAuNjY2NjcgU0NOCgpCVAo2MC4wIDM0NC43NjkgVGQKL0YxLjAgMTEgVGYKWzw1ND4gMTEwLjgzOTg0IDw2Zjc0NjE2Yz5dIFRKCkVUCgowLjMgdwowLjg2NjY3IDAuODY2NjcgMC44NjY2NyBTQ04KMjAwLjAgMzY0LjEwOCBtCjU1Mi4wIDM2NC4xMDggbApTCltdIDAgZAowLjMgdwowLjY2NjY3IDAuNjY2NjcgMC42NjY2NyBTQ04KCkJUCjIwMC4wIDM0NC43NjkgVGQKL0YyLjAgMTEgVGYKPDI0MzYyZTM3MzcyMDU1NTM0NDJhPiBUagpFVAoKcQo2MC4wIDE3MS40ODA3MyBtCjI0MC4wIDE3MS40ODA3MyBsCjI0MC4wIDIxMC4wIGwKNjAuMCAyMTAuMCBsCmgKVyBuCjAuMCAwLjAgMC4wIHNjbgowLjkxMjc4IDAuMCAwLjAgMC45MTI3OCA1LjIzMzI3IDE4LjMxNjQzIGNtCjEuMCAwLjAgMC4wIDEuMCAwLjAgMC4wIGNtCnEKUQpxCnEKMC45NDUxIDAuOTQ5MDIgMC45NDkwMiBzY24KNzQuNCAyMDMuOCBtCjc0LjQgMTc4LjMgbAo2Ny42IDE3OC4zIGwKNjcuNiAyMDMuOCBsCjYwLjAgMjAzLjggbAo2MC4wIDIxMC4wIGwKODIuMCAyMTAuMCBsCjgyLjAgMjAzLjggbAo3NC40IDIwMy44IGwKaApmClEKcQowLjk0NTEgMC45NDkwMiAwLjk0OTAyIHNjbgo5MS4zIDIxMC4wIG0KOTEuMyAxOTguNyBsCjkyLjggMTk5LjUgOTQuNSAyMDAuMSA5Ni44IDIwMC4xIGMKMTAyLjUgMjAwLjEgMTA0LjIgMTk3LjEgMTA0LjIgMTkzLjAgYwoxMDQuMiAxNzguNCBsCjk3LjQgMTc4LjQgbAo5Ny40IDE5MS45IGwKOTcuNCAxOTMuNSA5Ni45IDE5NC41IDk1LjAgMTk0LjUgYwo5My40IDE5NC41IDkxLjkgMTkzLjggOTEuMiAxOTMuNCBjCjkxLjIgMTc4LjMgbAo4NC40IDE3OC4zIGwKODQuNCAyMTAuMCBsCjkxLjMgMjEwLjAgbApoCmYKUQpxCjAuOTQ1MSAwLjk0OTAyIDAuOTQ5MDIgc2NuCjExOC43IDE5My4xIG0KMTE4LjcgMTk0LjEgMTE4LjAgMTk0LjYgMTE2LjIgMTk0LjYgYwoxMTMuNSAxOTQuNiAxMTAuNSAxOTMuOCAxMDguNiAxOTMuMCBjCjEwOC42IDE5OC43IGwKMTEwLjAgMTk5LjMgMTEzLjIgMjAwLjEgMTE2LjIgMjAwLjEgYwoxMjMuOCAyMDAuMSAxMjUuMiAxOTYuOSAxMjUuMiAxOTIuMSBjCjEyNS4yIDE3OC40IGwKMTIxLjEgMTc4LjQgbAoxMjAuMiAxODAuMCBsCjExOC43IDE3OC42IDExNi41IDE3Ny44IDExNC4wIDE3Ny44IGMKMTA4LjYgMTc3LjggMTA2LjggMTgxLjMgMTA2LjggMTg0LjUgYwoxMDYuOCAxOTAuMiAxMTEuMCAxOTEuMCAxMTQuOCAxOTEuNCBjCjExOC42IDE5MS44IGwKMTE4LjYgMTkzLjEgbApoCjExNS44IDE4Ny43IG0KMTEzLjkgMTg3LjQgMTEzLjEgMTg2LjUgMTEzLjEgMTg0LjkgYwoxMTMuMSAxODMuMyAxMTQuMSAxODIuNCAxMTUuNSAxODIuNCBjCjExNi43IDE4Mi40IDExNy45IDE4Mi43IDExOC41IDE4My40IGMKMTE4LjUgMTg4LjEgbAoxMTUuOCAxODcuNyBsCmgKZgpRCnEKMC45NDUxIDAuOTQ5MDIgMC45NDkwMiBzY24KMTMyLjggMTk5LjQgbQoxMzMuNiAxOTcuOSBsCjEzNi4wIDE5OS4zIDEzOC42IDIwMC4wIDE0MC45IDIwMC4wIGMKMTQ2LjYgMjAwLjAgMTQ4LjMgMTk3LjAgMTQ4LjMgMTkyLjkgYwoxNDguMyAxNzguMyBsCjE0MS41IDE3OC4zIGwKMTQxLjUgMTkxLjkgbAoxNDEuNSAxOTMuNSAxNDEuMCAxOTQuNSAxMzkuMSAxOTQuNSBjCjEzNy41IDE5NC41IDEzNi4wIDE5My44IDEzNS4zIDE5My40IGMKMTM1LjMgMTc4LjMgbAoxMjguNSAxNzguMyBsCjEyOC41IDE5OS40IGwKMTMyLjggMTk5LjQgbApoCmYKUQpxCjAuOTQ1MSAwLjk0OTAyIDAuOTQ5MDIgc2NuCjE1OC42IDE5Mi43IG0KMTY0LjAgMTk5LjUgbAoxNzIuNCAxOTkuNSBsCjE2NC4yIDE5MC45IGwKMTczLjAgMTc4LjQgbAoxNjQuOCAxNzguNCBsCjE1OS45IDE4Ni40IGwKMTU4LjUgMTg1LjAgbAoxNTguNSAxNzguNSBsCjE1Mi4wIDE3OC41IGwKMTUyLjAgMjEwLjAgbAoxNTguNSAyMTAuMCBsCjE1OC41IDE5Mi43IGwKaApmClEKcQowLjk0NTEgMC45NDkwMiAwLjk0OTAyIHNjbgoxODguOSAxOTkuNCBtCjE5Mi40IDE4Ny4wIGwKMTk1LjkgMTk5LjQgbAoyMDMuMiAxOTkuNCBsCjE5MS4xIDE2Ny43IGwKMTgzLjcgMTY3LjcgbAoxODkuMiAxNzkuNiBsCjE4MS42IDE5OS4zIGwKMTg4LjkgMTk5LjMgbApoCmYKUQpxCjAuOTQ1MSAwLjk0OTAyIDAuOTQ5MDIgc2NuCjIwNC4wIDE4OC45IG0KMjA0LjAgMTk1LjUgMjA2LjEgMjAwLjAgMjEzLjkgMjAwLjAgYwoyMjEuNyAyMDAuMCAyMjMuOCAxOTUuNCAyMjMuOCAxODguOSBjCjIyMy44IDE4Mi4zIDIyMS43IDE3Ny44IDIxMy45IDE3Ny44IGMKMjA2LjEgMTc3LjggMjA0LjAgMTgyLjMgMjA0LjAgMTg4LjkgYwpoCjIxMC44IDE4OC45IG0KMjEwLjggMTg0LjcgMjExLjYgMTgzLjIgMjE0LjAgMTgzLjIgYwoyMTYuNCAxODMuMiAyMTcuMiAxODQuNyAyMTcuMiAxODguOSBjCjIxNy4yIDE5My4xIDIxNi40IDE5NC42IDIxNC4wIDE5NC42IGMKMjExLjYgMTk0LjYgMjEwLjggMTkzLjEgMjEwLjggMTg4LjkgYwpoCmYKUQpxCjAuOTQ1MSAwLjk0OTAyIDAuOTQ5MDIgc2NuCjI0Mi4yIDE3OC4zIG0KMjQxLjQgMTc5LjggbAoyMzkuMCAxNzguNCAyMzYuNCAxNzcuNyAyMzQuMSAxNzcuNyBjCjIyOC40IDE3Ny43IDIyNi43IDE4MC43IDIyNi43IDE4NC44IGMKMjI2LjcgMTk5LjQgbAoyMzMuNSAxOTkuNCBsCjIzMy41IDE4NS44IGwKMjMzLjUgMTg0LjIgMjM0LjAgMTgzLjIgMjM1LjkgMTgzLjIgYwoyMzcuNSAxODMuMiAyMzkuMCAxODMuOSAyMzkuNyAxODQuMyBjCjIzOS43IDE5OS40IGwKMjQ2LjUgMTk5LjQgbAoyNDYuNSAxNzguMyBsCjI0Mi4yIDE3OC4zIGwKaApmClEKcQowLjk0NTEgMC45NDkwMiAwLjk0OTAyIHNjbgoyNTMuMiAxODUuOCBtCjI1NS40IDE4NS44IDI1Ny4yIDE4NC4wIDI1Ny4yIDE4MS44IGMKMjU3LjIgMTc5LjUgMjU1LjQgMTc3LjggMjUzLjIgMTc3LjggYwoyNTAuOSAxNzcuOCAyNDkuMiAxNzkuNSAyNDkuMiAxODEuOCBjCjI0OS4yIDE4NC4wIDI1MC45IDE4NS44IDI1My4yIDE4NS44IGMKaApmClEKUQpRCnEKNjAuMCAxMzkuMjkwNTUgbQoxMDAuMCAxMzkuMjkwNTUgbAoxMDAuMCAxNTAuMCBsCjYwLjAgMTUwLjAgbApoClcgbgowLjAgMC4wIDAuMCBzY24KMC4xNDI2IDAuMCAwLjAgMC4xNDI2IDUxLjQ0Mzg1IDEyOC42MDk2MyBjbQoxLjAgMC4wIDAuMCAxLjAgMC4wIDAuMCBjbQpxCnEKMS4yNSAwLjAgMC4wIC0xLjI1IC0xNS4wIDIyNS4wIGNtCnEKcQpxCnEKcQoxLjAgMC4wIDAuMCAxLjAgMTA3LjQ3MjcgLTQ5LjMzMDYgY20KcQotNC43IDEzNS4xIG0KLTIzLjQgMTM1LjEgbAotMjMuOSAxMzUuMSAtMjQuMyAxMzUuNSAtMjQuMyAxMzYuMCBjCi0yNC4zIDE0NS4xIGwKLTI0LjMgMTQ1LjYgLTIzLjkgMTQ2LjAgLTIzLjQgMTQ2LjAgYwotMTYuMSAxNDYuMCBsCi0xNi4xIDE1Ny4zIGwKLTE2LjEgMTU3LjMgLTE3LjcgMTU3LjkgLTIyLjMgMTU3LjkgYwotMjcuNiAxNTcuOSAtMzUuMSAxNTUuOSAtMzUuMSAxMzkuNiBjCi0zNS4xIDEyMy4yIC0yNy4zIDEyMS4xIC0yMC4xIDEyMS4xIGMKLTEzLjggMTIxLjEgLTExLjEgMTIyLjIgLTkuMyAxMjIuNyBjCi04LjggMTIyLjkgLTguMyAxMjIuMyAtOC4zIDEyMS44IGMKLTYuMiAxMTMuMCBsCi02LjIgMTEyLjggLTYuMyAxMTIuNSAtNi41IDExMi4zIGMKLTcuMiAxMTEuOCAtMTEuNSAxMDkuNCAtMjIuMyAxMDkuNCBjCi0zNC44IDEwOS40IC00Ny42IDExNC43IC00Ny42IDE0MC4yIGMKLTQ3LjYgMTY1LjcgLTMzLjAgMTY5LjUgLTIwLjYgMTY5LjUgYwotMTAuNCAxNjkuNSAtNC4yIDE2NS4xIC00LjIgMTY1LjEgYwotMy45IDE2NS4wIC0zLjkgMTY0LjYgLTMuOSAxNjQuNCBjCi0zLjkgMTM1LjkgbAotMy44IDEzNS40IC00LjIgMTM1LjEgLTQuNyAxMzUuMSBjCmYKUQpRClEKcQpxCjEuMCAwLjAgMC4wIDEuMCAyMDQuNDcyNyAtNzEuOTk3NiBjbQpxCi00LjcgMTM1LjEgbQotNC43IDEzNC42IC01LjEgMTM0LjIgLTUuNiAxMzQuMiBjCi0xNi4xIDEzNC4yIGwKLTE2LjYgMTM0LjIgLTE3LjAgMTM0LjYgLTE3LjAgMTM1LjEgYwotMTcuMCAxMzUuMSAtMTcuMCAxNTUuNCAtMTcuMCAxNTUuNCBjCi0zMy40IDE1NS40IGwKLTMzLjQgMTM1LjEgbAotMzMuNCAxMzQuNiAtMzMuOCAxMzQuMiAtMzQuMyAxMzQuMiBjCi00NC44IDEzNC4yIGwKLTQ1LjMgMTM0LjIgLTQ1LjcgMTM0LjYgLTQ1LjcgMTM1LjEgYwotNDUuNyAxOTAuMSBsCi00NS43IDE5MC42IC00NS4zIDE5MS4wIC00NC44IDE5MS4wIGMKLTM0LjMgMTkxLjAgbAotMzMuOCAxOTEuMCAtMzMuNCAxOTAuNiAtMzMuNCAxOTAuMSBjCi0zMy40IDE2Ni42IGwKLTE3LjAgMTY2LjYgbAotMTcuMCAxNjYuNiAtMTcuMCAxOTAuMSAtMTcuMCAxOTAuMSBjCi0xNy4wIDE5MC42IC0xNi42IDE5MS4wIC0xNi4xIDE5MS4wIGMKLTUuNiAxOTEuMCBsCi01LjEgMTkxLjAgLTQuNyAxOTAuNiAtNC43IDE5MC4xIGMKLTQuNyAxMzUuMSBsCmgKZgpRClEKUQpxCnEKMS4wIDAuMCAwLjAgMS4wIDEyNy42OTQzIC02NC43NzkzIGNtCnEKLTQuNyAxMzUuMSBtCi00LjcgMTMxLjMgLTcuNyAxMjguMyAtMTEuNSAxMjguMyBjCi0xNS4yIDEyOC4zIC0xOC4zIDEzMS40IC0xOC4zIDEzNS4xIGMKLTE4LjMgMTM4LjggLTE1LjMgMTQyLjAgLTExLjUgMTQyLjAgYwotNy43IDE0MS45IC00LjcgMTM4LjggLTQuNyAxMzUuMSBjCmYKUQpRClEKcQpxCjEuMCAwLjAgMC4wIDEuMCAxMjYuOTQyNCAtMjguNTgzIGNtCnEKLTQuNyAxMzUuMSBtCi00LjcgMTA5LjcgbAotNC43IDEwOS4yIC01LjEgMTA4LjggLTUuNiAxMDguOCBjCi0xNi4wIDEwOC44IGwKLTE2LjUgMTA4LjggLTE2LjkgMTA5LjMgLTE2LjkgMTA5LjggYwotMTYuOSAxNDYuMiBsCi0xNi45IDE0Ny4zIC0xNi4yIDE0Ny42IC0xNS40IDE0Ny42IGMKLTYuMCAxNDcuNiBsCi01LjAgMTQ3LjYgLTQuNyAxNDcuMSAtNC43IDE0Ni4yIGMKLTQuNyAxMzUuMSBsCmgKZgpRClEKUQpxCnEKMS4wIDAuMCAwLjAgMS4wIDI0NS4yNzQ5IC01NC43NzQ5IGNtCnEKLTQuNyAxMzUuMSBtCi0xNS4xIDEzNS4xIGwKLTE1LjYgMTM1LjEgLTE2LjAgMTM1LjUgLTE2LjAgMTM2LjAgYwotMTYuMCAxNjMuMCBsCi0xNi4wIDE2My4wIC0xOC43IDE2NC45IC0yMi40IDE2NC45IGMKLTI2LjIgMTY0LjkgLTI3LjIgMTYzLjIgLTI3LjIgMTU5LjUgYwotMjcuMiAxMzYuMCBsCi0yNy4yIDEzNS41IC0yNy42IDEzNS4xIC0yOC4xIDEzNS4xIGMKLTM4LjcgMTM1LjEgbAotMzkuMiAxMzUuMSAtMzkuNiAxMzUuNSAtMzkuNiAxMzYuMCBjCi0zOS42IDE2MS4zIGwKLTM5LjYgMTcyLjMgLTMzLjUgMTc0LjkgLTI1LjEgMTc0LjkgYwotMTguMiAxNzQuOSAtMTIuNyAxNzEuMSAtMTIuNyAxNzEuMSBjCi0xMi43IDE3MS4xIC0xMi40IDE3My4xIC0xMi4zIDE3My4zIGMKLTEyLjIgMTczLjUgLTExLjkgMTczLjggLTExLjUgMTczLjggYwotNC44IDE3My44IGwKLTQuMyAxNzMuOCAtMy45IDE3My40IC0zLjkgMTcyLjkgYwotMy45IDEzNi4wIGwKLTMuOCAxMzUuNCAtNC4yIDEzNS4xIC00LjcgMTM1LjEgYwpmClEKUQpRCnEKcQoxLjAgMC4wIDAuMCAxLjAgMjcwLjI1MDUgLTI1LjAwODggY20KcQotNC43IDEzNS4xIG0KLTguMyAxMzUuMCAtMTAuOCAxMzMuMyAtMTAuOCAxMzMuMyBjCi0xMC44IDExNS45IGwKLTEwLjggMTE1LjkgLTguNCAxMTQuNCAtNS40IDExNC4xIGMKLTEuNiAxMTMuOCAyLjAgMTE0LjkgMi4wIDEyMy45IGMKMi4wIDEzMy4zIDAuNCAxMzUuMiAtNC43IDEzNS4xIGMKLTAuNiAxMDQuMSBtCi02LjUgMTA0LjEgLTEwLjYgMTA2LjcgLTEwLjYgMTA2LjcgYwotMTAuNiA4OC4xIGwKLTEwLjYgODcuNiAtMTEuMCA4Ny4yIC0xMS41IDg3LjIgYwotMjIuMCA4Ny4yIGwKLTIyLjUgODcuMiAtMjIuOSA4Ny42IC0yMi45IDg4LjEgYwotMjIuOSAxNDMuMSBsCi0yMi45IDE0My42IC0yMi41IDE0NC4wIC0yMi4wIDE0NC4wIGMKLTE0LjcgMTQ0LjAgbAotMTQuNCAxNDQuMCAtMTQuMSAxNDMuOCAtMTMuOSAxNDMuNSBjCi0xMy43IDE0My4yIC0xMy41IDE0MS4wIC0xMy41IDE0MS4wIGMKLTEzLjUgMTQxLjAgLTkuMiAxNDUuMSAtMS4wIDE0NS4xIGMKOC42IDE0NS4xIDE0LjEgMTQwLjIgMTQuMSAxMjMuMyBjCjE0LjIgMTA2LjMgNS40IDEwNC4xIC0wLjYgMTA0LjEgYwpmClEKUQpRCnEKcQoxLjAgMC4wIDAuMCAxLjAgMTU2Ljk3MTIgLTU0Ljg2MjMgY20KcQotNC43IDEzNS4xIG0KLTEyLjYgMTM1LjEgbAotMTIuNiAxMzUuMSAtMTIuNiAxMjQuNyAtMTIuNiAxMjQuNyBjCi0xMi42IDEyNC4zIC0xMi44IDEyNC4xIC0xMy4zIDEyNC4xIGMKLTI0LjAgMTI0LjEgbAotMjQuNCAxMjQuMSAtMjQuNiAxMjQuMyAtMjQuNiAxMjQuNyBjCi0yNC42IDEzNS40IGwKLTI0LjYgMTM1LjQgLTMwLjAgMTM2LjcgLTMwLjQgMTM2LjggYwotMzAuOCAxMzYuOSAtMzEuMCAxMzcuMiAtMzEuMCAxMzcuNiBjCi0zMS4wIDE0NC40IGwKLTMxLjAgMTQ0LjkgLTMwLjYgMTQ1LjMgLTMwLjEgMTQ1LjMgYwotMjQuNiAxNDUuMyBsCi0yNC42IDE2MS42IGwKLTI0LjYgMTczLjcgLTE2LjEgMTc0LjkgLTEwLjQgMTc0LjkgYwotNy44IDE3NC45IC00LjcgMTc0LjEgLTQuMSAxNzMuOSBjCi0zLjggMTczLjggLTMuNiAxNzMuNSAtMy42IDE3My4xIGMKLTMuNiAxNjUuNiBsCi0zLjYgMTY1LjEgLTQuMCAxNjQuNyAtNC41IDE2NC43IGMKLTUuMCAxNjQuNyAtNi4xIDE2NC45IC03LjMgMTY0LjkgYwotMTEuMiAxNjQuOSAtMTIuNSAxNjMuMSAtMTIuNSAxNjAuOCBjCi0xMi41IDE1OC41IC0xMi41IDE0NS4zIC0xMi41IDE0NS4zIGMKLTQuNiAxNDUuMyBsCi00LjEgMTQ1LjMgLTMuNyAxNDQuOSAtMy43IDE0NC40IGMKLTMuNyAxMzUuOSBsCi0zLjggMTM1LjQgLTQuMiAxMzUuMSAtNC43IDEzNS4xIGMKZgpRClEKUQpRClEKUQpRClEKUQowLjYgMC42IDAuNiBzY24KMC4zIHcKMC42NjY2NyAwLjY2NjY3IDAuNjY2NjcgU0NOCgpCVAo2MC4wIDExNS44MDA1NSBUZAovRjEuMCAxMCBUZgo8NDc2OTc0NDg3NTYyMmMyMDQ5NmU2MzJlPiBUagpFVAoKCkJUCjYwLjAgMTAyLjMyMDU1IFRkCi9GMS4wIDEwIFRmCls8MzgzODIwNDM2ZjZjNjk2ZTIwNTA+IDEyOC45MDYyNSA8MmUyMDRiNjU2YzZjNzkyMDRhNzI+IDU0LjY4NzUgPDJlMjA1Mzc0NzI2NTY1NzQ+XSBUSgpFVAoKCkJUCjYwLjAgODguODQwNTUgVGQKL0YxLjAgMTAgVGYKWzw1MzYxNmUyMDQ2NzI2MTZlNjM2OTczNjM2ZjJjMjA0MzQxPiA1NC42ODc1IDwyMDM5MzQzMTMwMzc+XSBUSgpFVAoKCkJUCjYwLjAgNzUuMzYwNTUgVGQKL0YxLjAgMTAgVGYKPDU1NmU2OTc0NjU2NDIwNTM3NDYxNzQ2NTczPiBUagpFVAoKMC4zIHcKMC42NjY2NyAwLjY2NjY3IDAuNjY2NjcgU0NOCgpCVAoyMTAuMCAxMTUuODAwNTUgVGQKL0YxLjAgMTAgVGYKPDY4NzQ3NDcwNzMzYTJmMmY3Mzc1NzA3MDZmNzI3NDJlNjc2OTc0Njg3NTYyMmU2MzZmNmQyZjYzNmY2ZTc0NjE2Mzc0PiBUagpFVAoKCkJUCjYwLjAgNTAuMCBUZAovRjEuMCAxMCBUZgpbPDJhMjA1Nj4gNzMuNzMwNDcgPDQxPiA3My43MzA0NyA8NTQyZjQ3NTM1ND4gMTcuNTc4MTIgPDIwNzA2MTY5NjQyMDY0Njk3MjY1NjM3NDZjNzkyMDYyNzkyMDQ3Njk3NDQ4NzU2MjJjMjA3NzY4NjU3MjY1MjA2MTcwNzA2YzY5NjM2MTYyNmM2NT5dIFRKCkVUCgpRCgplbmRzdHJlYW0KZW5kb2JqCjUgMCBvYmoKPDwgL0Fubm90cyBbOSAwIFJdCi9BcnRCb3ggWzAgMCA2MTIgNzkyXQovQmxlZWRCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKL0Nyb3BCb3ggWzAgMCA2MTIgNzkyXQovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovUGFyZW50IDMgMCBSCi9SZXNvdXJjZXMgPDwgL0ZvbnQgPDwgL0YxLjAgOCAwIFIKL0YyLjAgMTAgMCBSCj4+Ci9Qcm9jU2V0IFsvUERGIC9UZXh0IC9JbWFnZUIgL0ltYWdlQyAvSW1hZ2VJXQovWE9iamVjdCA8PCAvSTEgNiAwIFIKPj4KPj4KL1RyaW1Cb3ggWzAgMCA2MTIgNzkyXQovVHlwZSAvUGFnZQo+PgplbmRvYmoKNiAwIG9iago8PCAvQml0c1Bl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aCA1NjQKPj4Kc3RyZWFtCi9DSURJbml0IC9Qcm9jU2V0IGZpbmRyZXNvdXJjZSBiZWdpbgoxMiBkaWN0IGJlZ2luCmJlZ2luY21hcAovQ0lEU3lzdGVtSW5mbyAzIGRpY3QgZHVwIGJlZ2luCiAgL1JlZ2lzdHJ5IChBZG9iZSkgZGVmCiAgL09yZGVyaW5nIChVQ1MpIGRlZgogIC9TdXBwbGVtZW50IDAgZGVmCmVuZCBkZWYKL0NNYXBOYW1lIC9BZG9iZS1JZGVudGl0eS1VQ1MgZGVmCi9DTWFwVHlwZSAyIGRlZgoxIGJlZ2luY29kZXNwYWNlcmFuZ2UKPDAwPjw3OT4KZW5kY29kZXNwYWNlcmFuZ2UKMTQgYmVnaW5iZnJhbmdlCjwyMD48MjE+PDAwMjA+CjwyOD48MkE+PDAwMjg+CjwyQz48MzI+PDAwMmM+CjwzND48MzU+PDAwMzQ+CjwzNz48M0E+PDAwMzc+CjwzRj48NDE+PDAwM2Y+Cjw0Mz48NDQ+PDAwNDM+Cjw0Nj48NEI+PDAwNDY+Cjw1MD48NTE+PDAwNTA+Cjw1Mz48NTY+PDAwNTM+Cjw2MT48Njk+PDAwNjE+Cjw2Qj48NzA+PDAwNmI+Cjw3Mj48NzU+PDAwNzI+Cjw3Nz48Nzk+PDAwNzc+CmVuZGJmcmFuZ2UKZW5kY21hcApDTWFwTmFtZSBjdXJyZW50ZGljdCAvQ01hcCBkZWZpbmVyZXNvdXJjZSBwb3AKZW5kCmVuZAplbmRzdHJlYW0KZW5kb2JqCjE0IDAgb2JqClsyNzcgMjc3IDAgMCAwIDAgMCAwIDMzMyAzMzMgMzg5IDAgMjc3IDMzMyAyNzcgMjc3IDU1NiA1NTYgNTU2IDAgNTU2IDU1NiAwIDU1NiA1NTYgNTU2IDI3NyAwIDAgMCAwIDU1NiAxMDE1IDY2NiAwIDcyMiA3MjIgMCA2MTAgNzc3IDcyMiAyNzcgNTAwIDY2NiAwIDAgMCAwIDY2NiA3NzcgMCA2NjYgNjEwIDcyMiA2NjYgMCAwIDAgMCAwIDAgMCAwIDAgMCA1NTYgNTU2IDUwMCA1NTYgNTU2IDI3NyA1NTYgNTU2IDIyMiAwIDUwMCAyMjIgODMzIDU1NiA1NTYgNTU2IDAgMzMzIDUwMCAyNzcgNTU2IDAgNzIyIDUwMCA1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ICBFfWkYRLABYC24AEUsuABEKi24AEYsSyCwAyZTWLCAG7BAWYqKILADJlNYIyGwwIqKG4ojWSCwAyZTWCMhuAEAioobiiNZILADJlNYIyG4AUCKihuKI1kguAADJlNYsAMlRbgBgFBYIyG4AYAjIRuwAyVFIyEjIVkbIVlELbgARyxLU1hFRBshIVktuABILEu4AAlQWLEBAY5ZuAH/hbgARB25AAkAA19eLbgASSwgIEVpRLABYC24AEosuABJKiEtuABLLCBGsAMlRlJYI1kgiiCKSWSKIEYgaGFksAQlRiBoYWRSWCNlilkvILAAU1hpILAAVFghsEBZG2kgsABUWCGwQGVZWTotuABMLCBGsAQlRlJYI4pZIEYgamFksAQlRiBqYWRSWCOKWS/9LbgATSxLILADJlBYUViwgEQbsEBEWRshISBFsMBQWLDARBshWVktuABOLCAgRWlEsAFgICBFfWkYRLABYC24AE8suABOKi24AFAsSyCwAyZTWLCAG7BAWYqKILADJlNYIyGwwIqKG4ojWSCwAyZTWCMhuAEAioobiiNZILADJlNYIyG4AUCKihuKI1kguAADJlNYsAMlRbgBgFBYIyG4AYAjIRuwAyVFIyEjIVkbIVlELbgAUSxLU1hFRBshIVktuABSLEu4AAlQWLEBAY5ZuAH/hbgARB25AAkAA19eLbgAUywgIEVpRLABYC24AFQsuABTKiEtuABVLCBGsAMlRlJYI1kgiiCKSWSKIEYgaGFksAQlRiBoYWRSWCNlilkvILAAU1hpILAAVFghsEBZG2kgsABUWCGwQGVZWTotuABWLCBGsAQlRlJYI4pZIEYgamFksAQlRiBqYWRSWCOKWS/9LbgAVyxLILADJlBYUViwgEQbsEBEWRshISBFsMBQWLDARBshWVktuABYLCAgRWlEsAFgICBFfWkYRLABYC24AFksuABYKi24AFosSyCwAyZTWLBAG7AAWYqKILADJlNYIyGwgIqKG4ojWSCwAyZTWCMhuADAioobiiNZILADJlNYIyG4AQCKihuKI1kgsAMmU1gjIbgBQIqKG4ojWSC4AAMmU1iwAyVFuAGAUFgjIbgBgCMhG7ADJUUjISMhWRshWUQtuABbLEtTWEVEGyEhWS24AFIruABIK7gAPiu4ADQruAAqK7EIQLoBkAAUXfRACQEf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AHAAZQAgAEEARwCpACAAMQA5ADkAMAAtADIAMAAwADYAIABBAHAAcABsAGUAIABDAG8AbQBwAHUAdABlAHIAIABJAG4AYwAuACAAqQAgADEAOQA4ADEAIABMAGkAbgBvAHQAeQBwAGUAIABBAEcAIACpACAAMQA5ADkAMAAtADkAMQAgAFQAeQBwAGUAIABTAG8AbAB1AHQAaQBvAG4AcwAgAEkAbgBjAC4ASABlAGwAdgBlAHQAaQBjAGEAQgBvAGwAZABIAGUAbAB2AGUAdABpAGMAYQAgAEIAbwBsAGQAOwAgADYALgAxAGQAMQA4AGUAMQA7ACAAMgAwADAAOQAtADAANgAtADIAOQBIAGUAbAB2AGUAdABpAGMAYQAgAEIAbwBsAGQANgAuADEAZAAxADgAZQAxAEgAZQBsAHYAZQB0AGkAYwBhACAAaQBzACAAYQAgAHIAZQBnAGkAcwB0AGUAcgBlAGQAIAB0AHIAYQBkAGUAbQBhAHIAawAgAG8AZgAgAEwAaQBuAG8AdAB5AHAAZQAgAEEARwBIAGUAbAB2AGUAdABpAGMAYQAgAEIAbwBsAGQASABlAGwAdgBlAHQAaQBjAGEAIABOAGUAZwByAGkAdABhAEgAZQBsAHYAZQB0AGkAYwBhACAAZQBzACAAdQBuAGEAIABtAGEAcgBjAGEAIAByAGUAZwBpAHMAdAByAGEAZABhACAAZABlACAATABpAG4AbwB0AHkAcABlACAAQQBHAFAAdQBvAGwAaQBsAGkAaABhAHYAYQBIAGUAbAB2AGUAdABpAGMAYQAgAGwAaQBoAGEAdgBhAEcAcgBhAHMASABlAGwAdgBlAHQAaQBjAGEAIABHAHIAYQBzAEgAZQBsAHYAZQB0AGkAYwBhACAAZQBzAHQAIAB1AG4AZQAgAG0AYQByAHEAdQBlACAAZADpAHAAbwBzAOkAZQAgAGQAZQAgAEwAaQBuAG8AdAB5AHAAZQAgAEEARwBIAGUAbAB2AGUAdABpAGMAYQAgBeIF0QXUAEcAcgBhAHMAcwBlAHQAdABvAEgAZQBsAHYAZQB0AGkAYwBhACAAZwByAGEAcwBzAGUAdAB0AG8ASABlAGwAdgBlAHQAaQBjAGEAIADoACAAdQBuACAAbQBhAHIAYwBoAGkAbwAgAHIAZQBnAGkAcwB0AHIAYQB0AG8AIABkAGkAIABMAGkAbgBvAHQAeQBwAGUAIABBAEcw3DD8MOswybz8tNzMtABWAGUAdABIAGUAbAB2AGUAdABpAGMAYQAgAHYAZQB0AEgAZQBsAHYAZQB0AGkAYwBhACAAaQBzACAAZQBlAG4AIABnAGUAcgBlAGcAaQBzAHQAcgBlAGUAcgBkACAAaABhAG4AZABlAGwAcwBtAGUAcgBrACAAdgBhAG4AIABMAGkAbgBvAHQAeQBwAGUAIABBAEcARgBlAHQASABlAGwAdgBlAHQAaQBjAGEAIABIAGEAbAB2AGYAZQB0AE4AZQBnAHIAaQB0AG8ASABlAGwAdgBlAHQAaQBjAGEAIABDAGEAcgByAGUAZwBhAGQAbwQWBDgEQAQ9BEsEOQBGAGUAdABIAGUAbAB2AGUAdABpAGMAYQAgAEYAZQB0AEgAZQBsAHYAZQB0AGkAYwBhACAA5AByACAAZQB0AHQAIAByAGUAZwBpAHMAdAByAGUAcgBhAHQAIAB2AGEAcgB1AG0A5AByAGsAZQAgAGYA9gByACAATABpAG4AbwB0AHkAcABlACAAQQBHAEgAZQBsAHYAZQB0AGkAYwBhACAGKAYxBiwGMwYqBkd8l09TAE4AZQBnAHIAaQB0AGEAAAACAAAAAAAA/2UAZQAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAADAAcADQAQABEAEwAUABUAFgAXABgAGQAaABsAHAAdACQAJgAnACkAKwAsAC0ALwAwADMANQA2ADcAOAA5AEIARABGAEgASQBLAEwAUABRAFIAUwBVAFYAVwBYAFoAAAplbmRzdHJlYW0KZW5kb2JqCjE2IDAgb2JqCjw8IC9Bc2NlbnQgNzUwCi9DYXBIZWlnaHQgMTQ0NgovRGVzY2VudCAtMTY5Ci9GbGFncyA0Ci9Gb250QkJveCBbLTEwMTcgLTQ4MCAxNDM2IDExNTldCi9Gb250RmlsZTIgMTUgMCBSCi9Gb250TmFtZSAvM2ViNTBkK0hlbHZldGljYS1Cb2xkCi9JdGFsaWNBbmdsZSAwCi9TdGVtViAwCi9UeXBlIC9Gb250RGVzY3JpcHRvcgovWEhlaWdodCAxMDg4Cj4+CmVuZG9iagoxNyAwIG9iago8PCAvTGVuZ3RoIDYzOQo+PgpzdHJlYW0KL0NJREluaXQgL1Byb2NTZXQgZmluZHJlc291cmNlIGJlZ2luCjEyIGRpY3QgYmVnaW4KYmVnaW5jbWFwCi9DSURTeXN0ZW1JbmZvIDMgZGljdCBkdXAgYmVnaW4KICAvUmVnaXN0cnkgKEFkb2JlKSBkZWYKICAvT3JkZXJpbmcgKFVDUykgZGVmCiAgL1N1cHBsZW1lbnQgMCBkZWYKZW5kIGRlZgovQ01hcE5hbWUgL0Fkb2JlLUlkZW50aXR5LVVDUyBkZWYKL0NNYXBUeXBlIDIgZGVmCjEgYmVnaW5jb2Rlc3BhY2VyYW5nZQo8MDA+PDc3PgplbmRjb2Rlc3BhY2VyYW5nZQoxMCBiZWdpbmJmcmFuZ2UKPDJEPjwyRT48MDAyZD4KPDMwPjwzQT48MDAzMD4KPDQzPjw0ND48MDA0Mz4KPDQ4Pjw0QT48MDA0OD4KPDRDPjw0RD48MDA0Yz4KPDUyPjw1Nj48MDA1Mj4KPDY1Pjw2Nj48MDA2NT4KPDY4Pjw2OT48MDA2OD4KPDZEPjw3MD48MDA2ZD4KPDcyPjw3NT48MDA3Mj4KZW5kYmZyYW5nZQoxMCBiZWdpbmJmY2hhcgo8MjA+PDAwMjA+CjwyND48MDAyND4KPDJBPjwwMDJhPgo8NDE+PDAwNDE+Cjw0Nj48MDA0Nj4KPDUwPjwwMDUwPgo8NUY+PDAwNWY+Cjw2MT48MDA2MT4KPDYzPjwwMDYzPgo8Nzc+PDAwNzc+CmVuZGJmY2hhcgplbmRjbWFwCkNNYXBOYW1lIGN1cnJlbnRkaWN0IC9DTWFwIGRlZmluZXJlc291cmNlIHBvcAplbmQKZW5kCmVuZHN0cmVhbQplbmRvYmoKMTggMCBvYmoKWzI3NyAwIDAgMCA1NTYgMCAwIDAgMCAwIDM4OSAwIDAgMzMzIDI3NyAwIDU1NiA1NTYgNTU2IDU1NiA1NTYgNTU2IDU1NiA1NTYgNTU2IDU1NiAzMzMgMCAwIDAgMCAwIDAgNzIyIDAgNzIyIDcyMiAwIDYxMCAwIDcyMiAyNzcgNTU2IDAgNjEwIDgzMyAwIDAgNjY2IDAgNzIyIDY2NiA2MTAgNzIyIDY2NiAwIDAgMCAwIDAgMCAwIDAgNTU2IDAgNTU2IDAgNTU2IDAgNTU2IDMzMyAwIDYxMCAyNzcgMCAwIDAgODg5IDYxMCA2MTAgNjEwIDAgMzg5IDU1NiAzMzMgNjEwIDAgNzc3XQplbmRvYmoKeHJlZgowIDE5CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMTA5IDAwMDAwIG4gCjAwMDAwMDAxNTggMDAwMDAgbiAKMDAwMDAwMDIxNSAwMDAwMCBuIAowMDAwMDExMzYyIDAwMDAwIG4gCjAwMDAwMTE2ODIgMDAwMDAgbiAKMDAwMDAxODc1NyAwMDAwMCBuIAowMDAwMDE4OTA2IDAwMDAwIG4gCjAwMDAwMTkwNzAgMDAwMDAgbiAKMDAwMDAxOTI1MiAwMDAwMCBuIAowMDAwMDE5NDIyIDAwMDAwIG4gCjAwMDAwMzg0NzEgMDAwMDAgbiAKMDAwMDAzODY4MiAwMDAwMCBuIAowMDAwMDM5Mjk4IDAwMDAwIG4gCjAwMDAwMzk2MTEgMDAwMDAgbiAKMDAwMDA1NjQ0MCAwMDAwMCBuIAowMDAwMDU2NjU3IDAwMDAwIG4gCjAwMDAwNTczNDggMDAwMDAgbiAKdHJhaWxlcgo8PCAvSW5mbyAxIDAgUgovUm9vdCAyIDAgUgovU2l6ZSAxOQo+PgpzdGFydHhyZWYKNTc2MzYKJSVFT0YK"}	279a17e1-5f88-4e80-8df7-619d79eff260
\.


--
-- Data for Name: PurchaseOrder; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PurchaseOrder" (id, "orderNumber", "supplierId", "orderDate", "expectedDate", "receivedDate", status, "totalAmount", notes, city, "createdAt", "updatedAt") FROM stdin;
99da7434-a619-4410-bc46-6657fd76b530	PO-2025-001	5fbd5f39-f703-4ffe-91f6-a6b2b130e1db	2025-11-20 00:00:00	2025-11-27 00:00:00	\N	Ordered	5250000	Regular monthly stock replenishment	jakarta	2025-11-28 07:39:36.562	2025-11-28 07:39:36.562
6024d319-c1cc-4906-a0c1-310c2fa159c3	PO-2025-002	279a17e1-5f88-4e80-8df7-619d79eff260	2025-11-22 00:00:00	2025-11-25 00:00:00	\N	Submitted	8500000	Urgent fog fluid restock	jakarta	2025-11-28 07:39:36.564	2025-11-28 07:39:36.564
\.


--
-- Data for Name: PurchaseOrderItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PurchaseOrderItem" (id, "purchaseOrderId", "consumableId", quantity, "receivedQty", "unitPrice", "totalPrice", "createdAt", "updatedAt") FROM stdin;
1d685534-d035-4447-9600-b7f4d34478bf	99da7434-a619-4410-bc46-6657fd76b530	6084469e-a139-432a-8dc9-92d3970ee787	50	0	25000	1250000	2025-11-28 07:39:36.566	2025-11-28 07:39:36.566
9e8a9e51-ae0c-4b80-a085-b94467c46384	99da7434-a619-4410-bc46-6657fd76b530	17da7cdd-65dd-4089-8965-a20eb96ac10c	100	0	85000	8500000	2025-11-28 07:39:36.566	2025-11-28 07:39:36.566
6eab3373-f46d-4211-ab09-32d6ee73af42	6024d319-c1cc-4906-a0c1-310c2fa159c3	17da7cdd-65dd-4089-8965-a20eb96ac10c	100	0	85000	8500000	2025-11-28 07:39:36.566	2025-11-28 07:39:36.566
\.


--
-- Data for Name: PushSubscription; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PushSubscription" (id, "userId", endpoint, p256dh, auth, "userAgent", "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: RndProject; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RndProject" (id, title, description, phase, progress, risks, dependencies, lead, budget, city, "createdAt", "updatedAt", "actualCost", "actualLiveDate", milestones, notes, status, "targetDate") FROM stdin;
6391d5cd-f9c3-4cd5-ad0b-fea969feebab	Resolume Special FX Integration	Advanced particle systems and real-time generative content for DJ drops	Pilot	65	{"GPU performance under load","Content sync timing"}	{"New media server","Timecode integration"}	Ating	15000000	jakarta	2025-11-28 07:39:36.551	2025-11-28 07:39:36.551	9500000	\N	[{"title": "Media server setup", "dueDate": "2025-11-15", "completed": true}, {"title": "FX library creation", "dueDate": "2025-12-05", "completed": false}, {"title": "Live testing", "dueDate": "2025-12-18", "completed": false}]	Testing on December 10 with special event	Active	2025-12-20 00:00:00
a1a2826c-c020-414b-8da0-bbaf88548336	LED Ceiling Interactive System	Ceiling-mounted LED panels with motion tracking for immersive effects	POC	35	{"Structural load capacity","Heat dissipation"}	{"Venue structural approval","Motion sensors"}	Chris	45000000	jakarta	2025-11-28 07:39:36.551	2025-11-28 07:39:36.551	12000000	\N	[{"title": "Prototype build", "dueDate": "2025-12-01", "completed": true}, {"title": "Motion tracking integration", "dueDate": "2026-01-15", "completed": false}]	Waiting for venue approval	Active	2026-02-28 00:00:00
7800d6fe-5174-47dc-9dfc-ac1d72744fe0	AI DJ Beat Matching Assistant	Machine learning algorithm to suggest next tracks based on crowd energy	Idea	10	{"Data privacy","Accuracy requirements"}	{"Crowd monitoring cameras","Training dataset"}	Nando	8000000	jakarta	2025-11-28 07:39:36.551	2025-11-28 07:39:36.551	500000	\N	[{"title": "Research phase", "dueDate": "2025-12-31", "completed": false}, {"title": "Algorithm development", "dueDate": "2026-03-31", "completed": false}]	Initial research in progress	Active	2026-06-30 00:00:00
\.


--
-- Data for Name: RolePermission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RolePermission" (id, role, "permissionId", granted, "createdAt", "updatedAt") FROM stdin;
7fc7c1b4-6487-4a6c-96be-3b80ac7905f1	admin	4f0ac41e-ff3d-41c5-bad7-20d47c90e363	t	2025-11-28 07:25:37.952	2025-11-28 07:25:37.952
d390a646-83e4-433f-a5a8-2172af55d581	manager	4f0ac41e-ff3d-41c5-bad7-20d47c90e363	t	2025-11-28 07:25:37.956	2025-11-28 07:25:37.956
d2382476-0fe1-440d-8182-4ff58858881c	operator	4f0ac41e-ff3d-41c5-bad7-20d47c90e363	t	2025-11-28 07:25:37.958	2025-11-28 07:25:37.958
51f82952-f3db-4523-80bc-5e21038528f0	admin	1338bd40-cb40-43a9-bbbd-570f853593ec	t	2025-11-28 07:25:37.96	2025-11-28 07:25:37.96
ac1f3520-aaf2-4c57-9e53-0c2e0a9197af	manager	1338bd40-cb40-43a9-bbbd-570f853593ec	t	2025-11-28 07:25:37.961	2025-11-28 07:25:37.961
478a9642-3fa1-42a4-b743-8d681213045b	admin	23a3b91a-443a-4de2-b0f8-1ef1edb01db8	t	2025-11-28 07:25:37.963	2025-11-28 07:25:37.963
8c6e1fb9-e46b-4a5a-a963-428cfc1aa7c5	manager	23a3b91a-443a-4de2-b0f8-1ef1edb01db8	t	2025-11-28 07:25:37.963	2025-11-28 07:25:37.963
1a97f17c-9de3-4996-ae01-299bdc455212	admin	b9c00271-30ec-46c0-8a46-6a7dc874ce7e	t	2025-11-28 07:25:37.965	2025-11-28 07:25:37.965
bdc8d867-75a0-48d2-97aa-94959400e00a	admin	e56d9c7e-0576-4d01-8792-78967564719f	t	2025-11-28 07:25:37.967	2025-11-28 07:25:37.967
815e3e52-6112-42e8-b0cd-686335a3fc9c	manager	e56d9c7e-0576-4d01-8792-78967564719f	t	2025-11-28 07:25:37.968	2025-11-28 07:25:37.968
14e1679b-d28b-4fce-b534-0f9aa19c29cd	operator	e56d9c7e-0576-4d01-8792-78967564719f	t	2025-11-28 07:25:37.968	2025-11-28 07:25:37.968
338e897d-da57-4bf7-bce3-c95d2dfff96c	admin	1aa1ce40-40eb-4ded-921f-646d13797895	t	2025-11-28 07:25:37.971	2025-11-28 07:25:37.971
ddab98c1-26d7-4679-a0bb-3f15cb340596	manager	1aa1ce40-40eb-4ded-921f-646d13797895	t	2025-11-28 07:25:37.972	2025-11-28 07:25:37.972
938d209c-2c36-43aa-9275-59d96c18a4b3	admin	782bb5a9-1058-4f07-a215-e6c6fada2a8c	t	2025-11-28 07:25:37.974	2025-11-28 07:25:37.974
11374e10-3e76-4b4f-8cb2-4298fdf05e33	manager	782bb5a9-1058-4f07-a215-e6c6fada2a8c	t	2025-11-28 07:25:37.975	2025-11-28 07:25:37.975
f7094a5e-87a5-4181-9901-80bbb7de5802	admin	394460e1-ac3b-4877-b226-e6d411ac30fc	t	2025-11-28 07:25:37.976	2025-11-28 07:25:37.976
06e3921d-b7ae-4d1d-ae1c-2eee15d53300	admin	44ecf74e-f8d9-4884-babe-b9e8dc3ca3ac	t	2025-11-28 07:25:37.977	2025-11-28 07:25:37.977
934dfe3d-c7a7-44b2-9498-89f7a2303214	manager	44ecf74e-f8d9-4884-babe-b9e8dc3ca3ac	t	2025-11-28 07:25:37.978	2025-11-28 07:25:37.978
06d6c8f3-fc32-42d7-96e4-e0749ada6a64	operator	44ecf74e-f8d9-4884-babe-b9e8dc3ca3ac	t	2025-11-28 07:25:37.979	2025-11-28 07:25:37.979
89396f56-c25b-4d9a-a50c-db4627b4ef8d	admin	91c2d4e7-84bd-4c88-9f23-6a01a60b90b6	t	2025-11-28 07:25:37.981	2025-11-28 07:25:37.981
c33952ae-225f-47a3-8b7f-e81c8f4133ee	manager	91c2d4e7-84bd-4c88-9f23-6a01a60b90b6	t	2025-11-28 07:25:37.982	2025-11-28 07:25:37.982
f63cf397-4632-410b-a4d2-b08856fdd1cb	admin	b5c74dc6-f5e7-4748-ad4c-0f4b989f8f76	t	2025-11-28 07:25:37.983	2025-11-28 07:25:37.983
7401c620-1a55-40a0-b9b7-7e00aa5ba2f7	manager	b5c74dc6-f5e7-4748-ad4c-0f4b989f8f76	t	2025-11-28 07:25:37.984	2025-11-28 07:25:37.984
c46faf96-fb46-4e57-9b49-252247faee54	admin	0c9e3874-ee9c-45e6-bee6-7abf0a570d8c	t	2025-11-28 07:25:37.986	2025-11-28 07:25:37.986
94c1d4de-82f5-451b-adf7-37d782d50422	admin	afb64842-b8fc-43cd-9a4e-06914fc86209	t	2025-11-28 07:25:37.988	2025-11-28 07:25:37.988
485cdb0e-dbf6-4e6b-8fc7-c6197c42f52c	manager	afb64842-b8fc-43cd-9a4e-06914fc86209	t	2025-11-28 07:25:37.988	2025-11-28 07:25:37.988
b6d75d0c-4deb-48b6-a412-468c95548fb2	operator	afb64842-b8fc-43cd-9a4e-06914fc86209	t	2025-11-28 07:25:37.989	2025-11-28 07:25:37.989
d1a0cdf5-6409-4cd6-9a3b-a7f6de3f9c0e	admin	36753cca-dc1c-489b-a8f0-4b818c1b0732	t	2025-11-28 07:25:37.991	2025-11-28 07:25:37.991
3d31ce8d-2ac2-4cb2-af59-1b0705d84a39	admin	8fb14bc6-4b4e-4a89-8de9-149bcc321740	t	2025-11-28 07:25:37.993	2025-11-28 07:25:37.993
f056efc7-cbff-45ce-a8f8-67d5e3b4efc6	manager	8fb14bc6-4b4e-4a89-8de9-149bcc321740	t	2025-11-28 07:25:37.993	2025-11-28 07:25:37.993
ac5e236c-acc8-4b16-93d7-8a97058156f7	operator	8fb14bc6-4b4e-4a89-8de9-149bcc321740	t	2025-11-28 07:25:37.994	2025-11-28 07:25:37.994
82450a93-5590-4ac3-8157-5a1251ff4b34	admin	0a90e39e-7e89-4072-bdb9-941d4a928abd	t	2025-11-28 07:25:37.996	2025-11-28 07:25:37.996
a38ae4a6-37aa-4815-8cfd-7fde0b4728d8	manager	0a90e39e-7e89-4072-bdb9-941d4a928abd	t	2025-11-28 07:25:37.997	2025-11-28 07:25:37.997
ab470129-7b5c-42e3-9fd6-1e6f50915b9e	admin	9791c256-1601-4fc2-b3dc-c676860e7d61	t	2025-11-28 07:25:37.999	2025-11-28 07:25:37.999
7fcb0d68-4dac-4c10-92ff-c0ee699202d1	manager	9791c256-1601-4fc2-b3dc-c676860e7d61	t	2025-11-28 07:25:37.999	2025-11-28 07:25:37.999
7816ddef-fea4-4d76-842c-24abcb921adc	operator	9791c256-1601-4fc2-b3dc-c676860e7d61	t	2025-11-28 07:25:38	2025-11-28 07:25:38
f9803cec-f48c-4d86-afbd-261671078564	admin	7f3bcfeb-7601-4a57-a5e9-d6b0d549b3fe	t	2025-11-28 07:25:38.001	2025-11-28 07:25:38.001
7003f867-90cf-4f98-94b7-eb795ca155d4	manager	7f3bcfeb-7601-4a57-a5e9-d6b0d549b3fe	t	2025-11-28 07:25:38.002	2025-11-28 07:25:38.002
e69845bb-74ae-4014-a58b-b9c0b45d7f16	operator	7f3bcfeb-7601-4a57-a5e9-d6b0d549b3fe	t	2025-11-28 07:25:38.003	2025-11-28 07:25:38.003
633eecd9-1995-4edc-a30d-d1e54dfce4c4	admin	2b6d1bed-cf6d-4c75-bd35-417719006bca	t	2025-11-28 07:25:38.004	2025-11-28 07:25:38.004
3fdf2701-67ce-41c1-900d-1c2f1a10bc81	manager	2b6d1bed-cf6d-4c75-bd35-417719006bca	t	2025-11-28 07:25:38.004	2025-11-28 07:25:38.004
6e9e0d08-7ff1-4fac-9d9e-be9a346fb69c	operator	2b6d1bed-cf6d-4c75-bd35-417719006bca	t	2025-11-28 07:25:38.005	2025-11-28 07:25:38.005
0fa35bb9-6e65-41a9-a639-dae8ca5271ad	admin	5dff5f63-2e8f-4fea-84a9-0e46b304d0f7	t	2025-11-28 07:25:38.006	2025-11-28 07:25:38.006
d08fb428-2bbd-4270-99b3-737703e201ba	manager	5dff5f63-2e8f-4fea-84a9-0e46b304d0f7	t	2025-11-28 07:25:38.007	2025-11-28 07:25:38.007
b0a5b8b4-a26a-4b41-9e80-0b7f546583e0	admin	bdbc7a01-f8bc-48e8-913e-f9a9a4b92a47	t	2025-11-28 07:25:38.008	2025-11-28 07:25:38.008
d456c296-2a3c-46ff-bec7-dd6095b21900	manager	bdbc7a01-f8bc-48e8-913e-f9a9a4b92a47	t	2025-11-28 07:25:38.009	2025-11-28 07:25:38.009
ac299048-09c6-4cfd-9bf2-e01e2b3b07d5	admin	d54abb5e-dfdb-4907-8582-3d6671acb651	t	2025-11-28 07:25:38.01	2025-11-28 07:25:38.01
163233ec-f9da-4d90-8b1c-0e2fd337b96f	admin	9fb1638e-9f6b-47ac-bad5-f874ac7ee444	t	2025-11-28 07:25:38.011	2025-11-28 07:25:38.011
164aa995-9260-4c3b-9038-c2f816444758	manager	9fb1638e-9f6b-47ac-bad5-f874ac7ee444	t	2025-11-28 07:25:38.012	2025-11-28 07:25:38.012
6cb9c5a3-d615-4334-8a74-ba42fdb3fed4	operator	9fb1638e-9f6b-47ac-bad5-f874ac7ee444	t	2025-11-28 07:25:38.013	2025-11-28 07:25:38.013
0e73879c-a0e4-4891-be3f-9d033475d7d2	admin	d7ed57e1-77ba-48c1-8010-92c26dd8ff1f	t	2025-11-28 07:25:38.015	2025-11-28 07:25:38.015
42c35394-3528-4a8c-b500-005cbeaf3771	manager	d7ed57e1-77ba-48c1-8010-92c26dd8ff1f	t	2025-11-28 07:25:38.015	2025-11-28 07:25:38.015
b8cdf019-6ab2-48ee-9d85-d9f1d11d5401	admin	f0b8595a-4289-4424-a949-4089143e6b1a	t	2025-11-28 07:25:38.016	2025-11-28 07:25:38.016
e363f510-5c5a-4b5a-b022-01e655d54b01	manager	f0b8595a-4289-4424-a949-4089143e6b1a	t	2025-11-28 07:25:38.017	2025-11-28 07:25:38.017
e80833f2-1b7f-459c-a2e3-0586720256f2	operator	f0b8595a-4289-4424-a949-4089143e6b1a	t	2025-11-28 07:25:38.017	2025-11-28 07:25:38.017
29f3898b-3f28-42a1-b7f4-78f0632db95e	admin	75e8e346-3c20-403f-a6cd-af37e2dddbb5	t	2025-11-28 07:25:38.018	2025-11-28 07:25:38.018
3b07bf3c-28c4-4a9a-abcd-f2dcc86ba42b	manager	75e8e346-3c20-403f-a6cd-af37e2dddbb5	t	2025-11-28 07:25:38.019	2025-11-28 07:25:38.019
8eb2d8c3-df3a-48c3-9d5d-957024ee96b1	admin	c75f49d9-74e7-4278-b653-c7a3fda126d1	t	2025-11-28 07:25:38.021	2025-11-28 07:25:38.021
047b8944-d80e-4d0a-9388-64956df1448f	manager	c75f49d9-74e7-4278-b653-c7a3fda126d1	t	2025-11-28 07:25:38.021	2025-11-28 07:25:38.021
ae3bc982-1d2c-4a22-a184-29767e2b1b50	operator	c75f49d9-74e7-4278-b653-c7a3fda126d1	t	2025-11-28 07:25:38.022	2025-11-28 07:25:38.022
08bbbade-5075-4e2c-89b2-a06b4470c47e	admin	cbd9e071-5b68-4076-8a7d-1eb3e222bd9d	t	2025-11-28 07:25:38.023	2025-11-28 07:25:38.023
1aecb15b-5b6a-4838-a1ac-f9b672a22138	manager	cbd9e071-5b68-4076-8a7d-1eb3e222bd9d	t	2025-11-28 07:25:38.023	2025-11-28 07:25:38.023
e16b8387-9165-4431-83cb-b38373c556aa	admin	381986a8-d2b3-4ce8-bdc1-4f198f3ec7ea	t	2025-11-28 07:25:38.026	2025-11-28 07:25:38.026
cde3761d-0d48-4705-9809-c7da2c3b124b	manager	381986a8-d2b3-4ce8-bdc1-4f198f3ec7ea	t	2025-11-28 07:25:38.026	2025-11-28 07:25:38.026
8c6795be-5f90-41d2-a184-8dd531292bf8	operator	381986a8-d2b3-4ce8-bdc1-4f198f3ec7ea	t	2025-11-28 07:25:38.027	2025-11-28 07:25:38.027
98394858-3583-46d9-837e-947ca48f5ad4	admin	3cdbe895-ada3-455f-8298-1c896a3964c9	t	2025-11-28 07:25:38.029	2025-11-28 07:25:38.029
7f6e803e-4c7d-4225-b785-cc64030aa40d	manager	3cdbe895-ada3-455f-8298-1c896a3964c9	t	2025-11-28 07:25:38.029	2025-11-28 07:25:38.029
4a06315f-81d4-4243-a6b2-4d3e164ce67f	admin	06f4004a-8963-4314-85b6-5054dafc6caf	t	2025-11-28 07:25:38.031	2025-11-28 07:25:38.031
03ac9e22-0614-4013-9f51-7fe7e7b2ddc7	manager	06f4004a-8963-4314-85b6-5054dafc6caf	t	2025-11-28 07:25:38.031	2025-11-28 07:25:38.031
44386027-c244-4c6b-a907-dccbf5f04f1c	admin	1f9045a2-98d3-4506-8f15-07b329b573db	t	2025-11-28 07:25:38.033	2025-11-28 07:25:38.033
a6d813d7-4697-4297-b8c9-dbb39854bdc8	admin	6c2fc7c3-46cd-48d0-add5-5173e3f72371	t	2025-11-28 07:25:38.035	2025-11-28 07:25:38.035
2a51241a-5e34-4dca-9248-67a0664a316d	admin	b5786759-af26-45f0-be7b-3309322ffd86	t	2025-11-28 07:25:38.036	2025-11-28 07:25:38.036
acea3ac3-5c62-46fd-a993-55729ac9660b	admin	d438c2ce-43f3-4609-973f-a303b2aad7ac	t	2025-11-28 07:25:38.037	2025-11-28 07:25:38.037
\.


--
-- Data for Name: StockMovement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."StockMovement" (id, "consumableId", type, quantity, "balanceBefore", "balanceAfter", "unitCost", "totalCost", reference, notes, "performedBy", city, "createdAt") FROM stdin;
51a4b851-fce1-4270-b661-132b3b4f3fd4	17da7cdd-65dd-4089-8965-a20eb96ac10c	Purchase	100	0	100	85000	8500000	PO-2025-000	Initial stock	System	jakarta	2025-11-01 00:00:00
74d784f4-4504-447e-8253-694724375261	17da7cdd-65dd-4089-8965-a20eb96ac10c	Usage	-35	100	65	\N	\N	Event: Weekend Session Nov 15-16	Used for Friday and Saturday night events	Tech Team	jakarta	2025-11-16 00:00:00
6ab50e1a-c130-471d-b5d3-1b26797c4c5b	17da7cdd-65dd-4089-8965-a20eb96ac10c	Usage	-20	65	45	\N	\N	Event: Special Guest DJ	Heavy usage for special event	Tech Team	jakarta	2025-11-22 00:00:00
a840734d-4a27-41ec-96d9-7d943aeb9d2c	6084469e-a139-432a-8dc9-92d3970ee787	Purchase	50	0	50	25000	1250000	PO-2025-000	Initial stock	System	jakarta	2025-11-01 00:00:00
f4a4b9e9-1bd1-4312-8a0c-e858618af72d	6084469e-a139-432a-8dc9-92d3970ee787	Usage	-26	50	24	\N	\N	Event: November Events	CO2 effects throughout November	SFX Team	jakarta	2025-11-20 00:00:00
acac76ef-0adc-4aa0-9451-e2800e805df1	6084469e-a139-432a-8dc9-92d3970ee787	Adjustment	5	24	29	25000	125000			RAE	jakarta	2025-11-28 15:20:21.665
24c16169-dad7-4c64-bef1-4f31bae71679	6b3074c0-ea62-4d33-8034-38ddbc059605	Usage	2	48	50	15000	30000			rea	jakarta	2025-11-28 15:26:25.241
700131fb-0973-4c42-8397-7c5026ac5a65	6b3074c0-ea62-4d33-8034-38ddbc059605	Purchase	1	50	51	15000	15000	r32		res	jakarta	2025-11-30 18:03:08.376
ae47eee3-3b40-49ca-8b7d-06b38ceb801f	6b3074c0-ea62-4d33-8034-38ddbc059605	Usage	11	51	62	15000	165000	234		res	jakarta	2025-11-30 18:04:33.106
caab2110-5cbd-4df5-8c7f-2b646e95ac99	6b3074c0-ea62-4d33-8034-38ddbc059605	Return	12	62	74	15000	180000	243		few	jakarta	2025-11-30 18:05:03.286
3bc7c051-a0f1-4bee-bd1c-910d0738d8a7	6084469e-a139-432a-8dc9-92d3970ee787	Purchase	1	29	30	25000	25000	45y		tew	jakarta	2025-11-30 18:08:30.851
ab818461-013e-4bc3-bfaa-e62fdb650f75	6084469e-a139-432a-8dc9-92d3970ee787	Purchase	1	30	31	25000	25000	4757		rttw	jakarta	2025-11-30 18:08:46.623
7f93bd05-b30a-4648-b701-3279dbac4524	6084469e-a139-432a-8dc9-92d3970ee787	Usage	-11	31	20	25000	275000	32456		ewq	jakarta	2025-11-30 18:09:02.518
427bbe81-d6e2-4d00-bb64-cd05a42d06db	6084469e-a139-432a-8dc9-92d3970ee787	Return	-6	20	14	25000	150000	243546		terwrq	jakarta	2025-11-30 18:09:18.704
c19347a8-b228-4042-86df-10018351d8c6	fe213a6a-63d5-41c0-8515-63eb733052ae	Adjustment	100	0	100	0	0	Initial Stock	Item created with initial stock	System	jakarta	2025-11-30 18:12:32.167
744820a6-943d-489a-83c4-e302dd409929	fe213a6a-63d5-41c0-8515-63eb733052ae	Purchase	10	100	110	500000	5000000	324354		EW	jakarta	2025-11-30 18:14:37.754
83a04533-2250-4f86-b635-d418bc38c395	fe213a6a-63d5-41c0-8515-63eb733052ae	Usage	-20	110	90	500000	10000000	234567		qwer	jakarta	2025-11-30 18:15:01.341
3896931e-a690-4c4f-97f0-81209891aaf1	fe213a6a-63d5-41c0-8515-63eb733052ae	Return	-30	90	60	500000	15000000	12345		REA	jakarta	2025-11-30 18:15:24.644
debb0d34-2fb9-41b0-a036-8c89ee899222	fe213a6a-63d5-41c0-8515-63eb733052ae	Usage	-30	60	30	500000	15000000	324354656		REQ	jakarta	2025-11-30 23:44:05.809
\.


--
-- Data for Name: Supplier; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Supplier" (id, name, code, "contactPerson", email, phone, address, city, "taxId", "paymentTerms", rating, status, notes, "createdAt", "updatedAt") FROM stdin;
5fbd5f39-f703-4ffe-91f6-a6b2b130e1db	Indonesia SFX Supply	SUP-001	Budi Santoso	budi@sfxsupply.co.id	+62 21 555-0101	Jl. Industri No. 45, Jakarta Utara	jakarta	01.234.567.8-901.000	30	4.5	Active	Reliable supplier for SFX consumables	2025-11-28 07:39:36.554	2025-11-28 07:39:36.554
279a17e1-5f88-4e80-8df7-619d79eff260	Haze Pro Jakarta	SUP-002	Andi Wijaya	andi@hazepro.co.id	+62 21 555-0202	Jl. Teater No. 12, Jakarta Selatan	jakarta	02.345.678.9-012.000	14	4.8	Active	\N	2025-11-28 07:39:36.554	2025-11-28 07:39:36.554
ee5102f7-8ef0-4b50-b977-7377a43dfe73	Bali Event Supplies	SUP-003	Made Suryadi	made@balieventsupplies.com	+62 361 555-0303	Jl. Sunset Road No. 88, Bali	bali	03.456.789.0-123.000	30	4.3	Active	\N	2025-11-28 07:39:36.554	2025-11-28 07:39:36.554
6b2562ee-f57e-4c89-a125-854a454bd543	Global Tech Supplies	SUP-004	John Smith	john@globaltech.co.id	+62 21 555-0404	Kawasan Industri MM2100, Bekasi	jakarta	04.567.890.1-234.000	45	4.6	Active	Specializes in audio/lighting equipment consumables	2025-11-28 07:39:36.554	2025-11-28 07:39:36.554
9f30a8ff-7797-4c13-aade-ffc6ba17e33b	Quick Stock Bali	SUP-005	Ketut Agung	ketut@quickstock.bali	+62 361 555-0505	Jl. Bypass Ngurah Rai, Bali	bali	05.678.901.2-345.000	7	4	Active	Fast delivery, emergency supplies	2025-11-28 07:39:36.554	2025-11-28 07:39:36.554
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, password, name, role, cities, "isActive", "lastLogin", "refreshToken", "createdAt", "updatedAt") FROM stdin;
28f4102d-3049-4e73-ab41-fa66f6286d1a	admin@vaultclub.com	$2b$10$vQrVSuDpHjd2YZu0xL/e7.WaeTwMZY3IvKtxYyfaA7zHKQipsKci.	Admin User	admin	{jakarta,bali}	t	2025-11-30 17:50:39.63	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyOGY0MTAyZC0zMDQ5LTRlNzMtYWI0MS1mYTY2ZjYyODZkMWEiLCJlbWFpbCI6ImFkbWluQHZhdWx0Y2x1Yi5jb20iLCJyb2xlIjoiYWRtaW4iLCJjaXRpZXMiOlsiamFrYXJ0YSIsImJhbGkiXSwiaWF0IjoxNzY0NTI1MDM5LCJleHAiOjE3NjUxMjk4Mzl9.MjCOPSeiPLSJGobyHMR5DUxAwwI7IpiiQ4lN46W24So	2025-11-28 07:39:36.517	2025-11-30 17:50:39.631
ab9de0b8-8e5b-44c6-afb2-d526087ab8f6	manager.bali@vaultclub.com	$2b$10$XOD3FHYG1Az1PuE8MZhHxO6bduj0ctwGOREUaWlGahCSMAVF54oVO	Bali Manager	manager	{bali}	t	\N	\N	2025-11-28 07:39:36.517	2025-11-28 07:39:36.517
9ac62f4a-1aac-4e17-a3cc-ca2aee6a69d3	manager.jakarta@vaultclub.com	$2b$10$XOD3FHYG1Az1PuE8MZhHxO6bduj0ctwGOREUaWlGahCSMAVF54oVO	Jakarta Manager	manager	{jakarta}	t	2025-11-28 14:37:03.18	\N	2025-11-28 07:39:36.517	2025-11-28 14:37:10.723
23eb5adb-3bcf-423a-8013-5655bee6fd0a	operator@vaultclub.com	$2b$10$CqAg44FNxu68dQssbJuWDuD0PmBJDoz.Du7CfkY4Dd./eD2pWC4PK	Operator User	operator	{jakarta}	t	2025-11-28 14:37:12.865	\N	2025-11-28 07:39:36.517	2025-11-28 14:37:18.997
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
1fc7e7e6-d654-49cd-a04d-21e3db61a46b	0527b580d9fe0d1a1684f335ef396e09f3acc4e9e286825c6e5b707109e03e81	2025-11-25 08:07:54.689901+07	20251120093235_init	\N	\N	2025-11-25 08:07:54.486091+07	1
eebb9434-f26e-468f-a008-8f47f45e2b54	25cbeb629be71dcdf7a8b1b06e8627bccfeee12d058d151782686647b093c22b	2025-11-25 08:25:40.180865+07	20251125012540_improve_rnd_schema	\N	\N	2025-11-25 08:25:40.151554+07	1
3ebf5260-a8e1-40ca-ade3-4cccce83c5a3	7cf051512108f061c41666ed5b64b05b58f01bb5b6e3109171d436d91053f882	2025-11-25 08:07:54.708195+07	20251120101216_update	\N	\N	2025-11-25 08:07:54.69046+07	1
5ee900e6-bb46-49fd-98b0-b43c28b7b15f	54cac25eadf352413673bc85dcc60cb15c656ea7201b2ebe568382828087a3cd	2025-11-25 08:07:54.710896+07	20251120140211_add_event_brief_defaults	\N	\N	2025-11-25 08:07:54.708706+07	1
d91e2ad4-2db1-4964-aedb-861e16f07596	8831926f3d6182835858bb7450a47b1f1190ab042f041cc75cf2c64033ab4b6a	2025-11-25 08:07:54.741723+07	20251120143540_add_notifications	\N	\N	2025-11-25 08:07:54.711278+07	1
12cf6803-1eeb-4b28-9eb5-4ab07e160910	4bb2407f55d3344027a53fb618ee4f771d632cca0ef6eb189fb7ccc3bbbe33a5	2025-11-25 08:48:39.9389+07	20251125014839_enhanced_consumables_suppliers	\N	\N	2025-11-25 08:48:39.761558+07	1
5abad2a4-cc01-4af9-9ed1-2a842c51eaa7	b45aaa207cefb321807bed60a0809c0b0116aa7c4863673ef26ff09b4a535d5a	2025-11-25 08:07:54.764345+07	20251120144341_add_push_subscriptions	\N	\N	2025-11-25 08:07:54.742112+07	1
e51d0ece-9a23-497d-b9f9-2d2c7e450736	8e6de09fb2298528bb5b48794fb6e2dbd57f2ce2b8ae0ffda220a5f042b17a44	2025-11-25 08:07:54.803081+07	20251120150334_add_permission_system	\N	\N	2025-11-25 08:07:54.764846+07	1
3e3dd235-45e4-42e1-bde5-5386bb8b0d7e	23e799919ff8743de2edb6b0109e8788e12abcf0106c3032d015b02f5637d37a	2025-11-25 08:07:54.856017+07	20251124133545_update_equipment_schema	\N	\N	2025-11-25 08:07:54.803914+07	1
ed1f48ab-23c3-40f0-9c1f-66480e0e0207	09b3f2112136f0983969abb7c7352fe0af4b8ecb4e4e9346c5307d3cf3668ce1	2025-11-28 13:24:22.33421+07	20251128062422_add_event_brief_new_fields	\N	\N	2025-11-28 13:24:22.27736+07	1
638772df-4702-4eb5-b66b-324fed6c1337	122d743a0403e77ad7e0ed9447f5b8826f2fbdbc55612d936eff004dd13c2eec	2025-11-25 08:07:54.858405+07	20251124133554_update_equipment_schema	\N	\N	2025-11-25 08:07:54.856419+07	1
1e21c8f2-b4dd-436b-b19f-067ef509b203	58f5af9e226f0573c5c321d758ba67887c3c6ea334e89e8c99f3cb1b48ec10c3	2025-11-25 08:07:54.89035+07	20251124143001_create_area_table	\N	\N	2025-11-25 08:07:54.859309+07	1
8fc4c48f-3510-43a3-8485-1e06e69cacc8	6d007e14da5bdfe9569aedee0117e72933dbad3ecb57d4d4c626b5119f224e2e	2025-11-25 08:07:54.898449+07	20251124234157_update_maintenance_log	\N	\N	2025-11-25 08:07:54.891163+07	1
3e932a7f-ab46-47f8-88b9-bb589afb8839	963299b3a1633617951796cfacacc4f205eb97920eb2315e739943ca99d6b394	2025-11-28 14:38:09.818301+07	20251128073631_update_proposals_remove_roi_add_multiple_pdfs	\N	\N	2025-11-28 14:38:09.790688+07	1
9ab7e5d7-b38a-418e-9ffe-64851d306d7a	2e105fd79c5f7adbc71a344f38ac03b0bafaf0710cc0a6de853bede2761ea796	2025-11-25 08:07:54.900528+07	20251125000127_remove_description_add_photo	\N	\N	2025-11-25 08:07:54.898887+07	1
61f35a6a-53be-4e38-b166-f10b627f72a4	8993d3909574c315c62e7bfcfa8b057eefb123111ffb726972569fff7a1eacfb	2025-11-25 08:07:54.903237+07	20251125003938_update_proposal_schema	\N	\N	2025-11-25 08:07:54.900866+07	1
146a87cd-4a1a-423e-a94c-514cfb07fa12	387448dbc5ec6f86251451957aee81bc881cfe0760fa3924acd92d173148a4af	2025-11-25 08:07:54.929163+07	20251125010736_simplify_proposal_status	\N	\N	2025-11-25 08:07:54.903758+07	1
2721027b-a5fa-434a-93bd-f28fccd12021	d6955c434230b1155712298fdaf5c786ca0ffb6c1abbdf8990cc5e89359d9b6f	2025-11-28 15:05:10.691489+07	20251128080510_remove_sku_barcode	\N	\N	2025-11-28 15:05:10.678887+07	1
8d6a53b3-7ccf-4634-925d-e41056f9c88e	7f1ef3b70e443eaae800188060042f39814cb5a4eb130be88838d8cd265b1fd2	2025-11-28 23:10:02.503429+07	20251128161002_add_supplier_relations	\N	\N	2025-11-28 23:10:02.406176+07	1
\.


--
-- Name: Alert Alert_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Alert"
    ADD CONSTRAINT "Alert_pkey" PRIMARY KEY (id);


--
-- Name: Area Area_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Area"
    ADD CONSTRAINT "Area_pkey" PRIMARY KEY (id);


--
-- Name: Consumable Consumable_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Consumable"
    ADD CONSTRAINT "Consumable_pkey" PRIMARY KEY (id);


--
-- Name: CrewMember CrewMember_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CrewMember"
    ADD CONSTRAINT "CrewMember_pkey" PRIMARY KEY (id);


--
-- Name: EquipmentInspection EquipmentInspection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EquipmentInspection"
    ADD CONSTRAINT "EquipmentInspection_pkey" PRIMARY KEY (id);


--
-- Name: Equipment Equipment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Equipment"
    ADD CONSTRAINT "Equipment_pkey" PRIMARY KEY (id);


--
-- Name: EventBrief EventBrief_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EventBrief"
    ADD CONSTRAINT "EventBrief_pkey" PRIMARY KEY (id);


--
-- Name: Incident Incident_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Incident"
    ADD CONSTRAINT "Incident_pkey" PRIMARY KEY (id);


--
-- Name: KPIMetrics KPIMetrics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KPIMetrics"
    ADD CONSTRAINT "KPIMetrics_pkey" PRIMARY KEY (id);


--
-- Name: MaintenanceLog MaintenanceLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MaintenanceLog"
    ADD CONSTRAINT "MaintenanceLog_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: Permission Permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permission"
    ADD CONSTRAINT "Permission_pkey" PRIMARY KEY (id);


--
-- Name: Proposal Proposal_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Proposal"
    ADD CONSTRAINT "Proposal_pkey" PRIMARY KEY (id);


--
-- Name: PurchaseOrderItem PurchaseOrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrderItem"
    ADD CONSTRAINT "PurchaseOrderItem_pkey" PRIMARY KEY (id);


--
-- Name: PurchaseOrder PurchaseOrder_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrder"
    ADD CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY (id);


--
-- Name: PushSubscription PushSubscription_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PushSubscription"
    ADD CONSTRAINT "PushSubscription_pkey" PRIMARY KEY (id);


--
-- Name: RndProject RndProject_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RndProject"
    ADD CONSTRAINT "RndProject_pkey" PRIMARY KEY (id);


--
-- Name: RolePermission RolePermission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "RolePermission_pkey" PRIMARY KEY (id);


--
-- Name: StockMovement StockMovement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockMovement"
    ADD CONSTRAINT "StockMovement_pkey" PRIMARY KEY (id);


--
-- Name: Supplier Supplier_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Supplier"
    ADD CONSTRAINT "Supplier_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Alert_acknowledged_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Alert_acknowledged_idx" ON public."Alert" USING btree (acknowledged);


--
-- Name: Alert_city_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Alert_city_idx" ON public."Alert" USING btree (city);


--
-- Name: Area_city_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Area_city_idx" ON public."Area" USING btree (city);


--
-- Name: Area_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Area_isActive_idx" ON public."Area" USING btree ("isActive");


--
-- Name: Area_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Area_name_key" ON public."Area" USING btree (name);


--
-- Name: Consumable_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Consumable_category_idx" ON public."Consumable" USING btree (category);


--
-- Name: Consumable_city_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Consumable_city_idx" ON public."Consumable" USING btree (city);


--
-- Name: Consumable_currentStock_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Consumable_currentStock_idx" ON public."Consumable" USING btree ("currentStock");


--
-- Name: Consumable_supplierId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Consumable_supplierId_idx" ON public."Consumable" USING btree ("supplierId");


--
-- Name: CrewMember_city_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CrewMember_city_idx" ON public."CrewMember" USING btree (city);


--
-- Name: CrewMember_shift_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CrewMember_shift_idx" ON public."CrewMember" USING btree (shift);


--
-- Name: EquipmentInspection_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "EquipmentInspection_date_idx" ON public."EquipmentInspection" USING btree (date);


--
-- Name: EquipmentInspection_equipmentId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "EquipmentInspection_equipmentId_idx" ON public."EquipmentInspection" USING btree ("equipmentId");


--
-- Name: Equipment_areaId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Equipment_areaId_idx" ON public."Equipment" USING btree ("areaId");


--
-- Name: Equipment_city_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Equipment_city_idx" ON public."Equipment" USING btree (city);


--
-- Name: Equipment_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Equipment_status_idx" ON public."Equipment" USING btree (status);


--
-- Name: EventBrief_city_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "EventBrief_city_idx" ON public."EventBrief" USING btree (city);


--
-- Name: EventBrief_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "EventBrief_date_idx" ON public."EventBrief" USING btree (date);


--
-- Name: Incident_city_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Incident_city_idx" ON public."Incident" USING btree (city);


--
-- Name: Incident_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Incident_date_idx" ON public."Incident" USING btree (date);


--
-- Name: KPIMetrics_city_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "KPIMetrics_city_idx" ON public."KPIMetrics" USING btree (city);


--
-- Name: KPIMetrics_city_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "KPIMetrics_city_key" ON public."KPIMetrics" USING btree (city);


--
-- Name: KPIMetrics_weekYear_weekNumber_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "KPIMetrics_weekYear_weekNumber_idx" ON public."KPIMetrics" USING btree ("weekYear", "weekNumber");


--
-- Name: MaintenanceLog_city_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "MaintenanceLog_city_idx" ON public."MaintenanceLog" USING btree (city);


--
-- Name: MaintenanceLog_equipmentId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "MaintenanceLog_equipmentId_idx" ON public."MaintenanceLog" USING btree ("equipmentId");


--
-- Name: MaintenanceLog_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "MaintenanceLog_status_idx" ON public."MaintenanceLog" USING btree (status);


--
-- Name: MaintenanceLog_supplierId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "MaintenanceLog_supplierId_idx" ON public."MaintenanceLog" USING btree ("supplierId");


--
-- Name: MaintenanceLog_technicianId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "MaintenanceLog_technicianId_idx" ON public."MaintenanceLog" USING btree ("technicianId");


--
-- Name: Notification_city_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Notification_city_idx" ON public."Notification" USING btree (city);


--
-- Name: Notification_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Notification_createdAt_idx" ON public."Notification" USING btree ("createdAt");


--
-- Name: Notification_read_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Notification_read_idx" ON public."Notification" USING btree (read);


--
-- Name: Notification_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Notification_userId_idx" ON public."Notification" USING btree ("userId");


--
-- Name: Permission_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Permission_category_idx" ON public."Permission" USING btree (category);


--
-- Name: Permission_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Permission_name_key" ON public."Permission" USING btree (name);


--
-- Name: Proposal_city_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Proposal_city_idx" ON public."Proposal" USING btree (city);


--
-- Name: Proposal_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Proposal_status_idx" ON public."Proposal" USING btree (status);


--
-- Name: Proposal_supplierId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Proposal_supplierId_idx" ON public."Proposal" USING btree ("supplierId");


--
-- Name: PurchaseOrderItem_consumableId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PurchaseOrderItem_consumableId_idx" ON public."PurchaseOrderItem" USING btree ("consumableId");


--
-- Name: PurchaseOrderItem_purchaseOrderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PurchaseOrderItem_purchaseOrderId_idx" ON public."PurchaseOrderItem" USING btree ("purchaseOrderId");


--
-- Name: PurchaseOrder_city_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PurchaseOrder_city_idx" ON public."PurchaseOrder" USING btree (city);


--
-- Name: PurchaseOrder_orderNumber_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PurchaseOrder_orderNumber_idx" ON public."PurchaseOrder" USING btree ("orderNumber");


--
-- Name: PurchaseOrder_orderNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PurchaseOrder_orderNumber_key" ON public."PurchaseOrder" USING btree ("orderNumber");


--
-- Name: PurchaseOrder_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PurchaseOrder_status_idx" ON public."PurchaseOrder" USING btree (status);


--
-- Name: PurchaseOrder_supplierId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PurchaseOrder_supplierId_idx" ON public."PurchaseOrder" USING btree ("supplierId");


--
-- Name: PushSubscription_endpoint_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PushSubscription_endpoint_idx" ON public."PushSubscription" USING btree (endpoint);


--
-- Name: PushSubscription_endpoint_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PushSubscription_endpoint_key" ON public."PushSubscription" USING btree (endpoint);


--
-- Name: PushSubscription_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PushSubscription_userId_idx" ON public."PushSubscription" USING btree ("userId");


--
-- Name: RndProject_city_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "RndProject_city_idx" ON public."RndProject" USING btree (city);


--
-- Name: RndProject_phase_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "RndProject_phase_idx" ON public."RndProject" USING btree (phase);


--
-- Name: RndProject_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "RndProject_status_idx" ON public."RndProject" USING btree (status);


--
-- Name: RolePermission_permissionId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "RolePermission_permissionId_idx" ON public."RolePermission" USING btree ("permissionId");


--
-- Name: RolePermission_role_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "RolePermission_role_idx" ON public."RolePermission" USING btree (role);


--
-- Name: RolePermission_role_permissionId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "RolePermission_role_permissionId_key" ON public."RolePermission" USING btree (role, "permissionId");


--
-- Name: StockMovement_city_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "StockMovement_city_idx" ON public."StockMovement" USING btree (city);


--
-- Name: StockMovement_consumableId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "StockMovement_consumableId_idx" ON public."StockMovement" USING btree ("consumableId");


--
-- Name: StockMovement_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "StockMovement_createdAt_idx" ON public."StockMovement" USING btree ("createdAt");


--
-- Name: StockMovement_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "StockMovement_type_idx" ON public."StockMovement" USING btree (type);


--
-- Name: Supplier_city_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Supplier_city_idx" ON public."Supplier" USING btree (city);


--
-- Name: Supplier_code_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Supplier_code_idx" ON public."Supplier" USING btree (code);


--
-- Name: Supplier_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Supplier_code_key" ON public."Supplier" USING btree (code);


--
-- Name: Supplier_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Supplier_status_idx" ON public."Supplier" USING btree (status);


--
-- Name: User_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_email_idx" ON public."User" USING btree (email);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_role_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_role_idx" ON public."User" USING btree (role);


--
-- Name: Consumable Consumable_supplierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Consumable"
    ADD CONSTRAINT "Consumable_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES public."Supplier"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: EquipmentInspection EquipmentInspection_equipmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EquipmentInspection"
    ADD CONSTRAINT "EquipmentInspection_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES public."Equipment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Equipment Equipment_areaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Equipment"
    ADD CONSTRAINT "Equipment_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES public."Area"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: MaintenanceLog MaintenanceLog_equipmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MaintenanceLog"
    ADD CONSTRAINT "MaintenanceLog_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES public."Equipment"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: MaintenanceLog MaintenanceLog_supplierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MaintenanceLog"
    ADD CONSTRAINT "MaintenanceLog_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES public."Supplier"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: MaintenanceLog MaintenanceLog_technicianId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MaintenanceLog"
    ADD CONSTRAINT "MaintenanceLog_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES public."CrewMember"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Notification Notification_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Proposal Proposal_supplierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Proposal"
    ADD CONSTRAINT "Proposal_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES public."Supplier"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PurchaseOrderItem PurchaseOrderItem_consumableId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrderItem"
    ADD CONSTRAINT "PurchaseOrderItem_consumableId_fkey" FOREIGN KEY ("consumableId") REFERENCES public."Consumable"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PurchaseOrderItem PurchaseOrderItem_purchaseOrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrderItem"
    ADD CONSTRAINT "PurchaseOrderItem_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES public."PurchaseOrder"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PurchaseOrder PurchaseOrder_supplierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrder"
    ADD CONSTRAINT "PurchaseOrder_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES public."Supplier"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PushSubscription PushSubscription_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PushSubscription"
    ADD CONSTRAINT "PushSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RolePermission RolePermission_permissionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES public."Permission"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StockMovement StockMovement_consumableId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockMovement"
    ADD CONSTRAINT "StockMovement_consumableId_fkey" FOREIGN KEY ("consumableId") REFERENCES public."Consumable"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

