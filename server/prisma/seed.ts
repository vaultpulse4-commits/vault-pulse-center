import { PrismaClient, EquipmentStatus, City } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.stockMovement.deleteMany();
  await prisma.purchaseOrderItem.deleteMany();
  await prisma.purchaseOrder.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.kPIMetrics.deleteMany();
  await prisma.consumable.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.rndProject.deleteMany();
  await prisma.proposal.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.maintenanceLog.deleteMany();
  await prisma.crewMember.deleteMany();
  await prisma.eventBrief.deleteMany();
  await prisma.equipmentInspection.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.area.deleteMany();
  await prisma.user.deleteMany();

  // Seed Users
  console.log('Seeding users...');
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const managerPassword = await bcrypt.hash('Manager123!', 10);
  const operatorPassword = await bcrypt.hash('Operator123!', 10);

  await prisma.user.createMany({
    data: [
      {
        email: 'admin@vaultclub.com',
        password: adminPassword,
        name: 'Admin User',
        role: 'admin',
        cities: ['jakarta', 'bali'],
        isActive: true
      },
      {
        email: 'manager.jakarta@vaultclub.com',
        password: managerPassword,
        name: 'Jakarta Manager',
        role: 'manager',
        cities: ['jakarta'],
        isActive: true
      },
      {
        email: 'manager.bali@vaultclub.com',
        password: managerPassword,
        name: 'Bali Manager',
        role: 'manager',
        cities: ['bali'],
        isActive: true
      },
      {
        email: 'operator@vaultclub.com',
        password: operatorPassword,
        name: 'Operator User',
        role: 'operator',
        cities: ['jakarta'],
        isActive: true
      }
    ]
  });

  // Seed Areas
  console.log('Seeding areas...');
  const areasFOH = await prisma.area.create({
    data: { name: 'FOH', description: 'Front of House', isActive: true }
  });
  const areasBooth = await prisma.area.create({
    data: { name: 'Booth', description: 'DJ Booth', isActive: true }
  });
  const areasStage = await prisma.area.create({
    data: { name: 'Stage', description: 'Main Stage', isActive: true }
  });
  const areasDJPit = await prisma.area.create({
    data: { name: 'DJ Pit', description: 'DJ Performance Area', isActive: true }
  });
  const areasLEDWall = await prisma.area.create({
    data: { name: 'LED Wall', description: 'LED Wall System', isActive: true }
  });
  const areasDimmerRoom = await prisma.area.create({
    data: { name: 'Dimmer Room', description: 'Dimmer & Power Distribution', isActive: true }
  });
  const areasAmpRack = await prisma.area.create({
    data: { name: 'Amp Rack', description: 'Amplifier Rack', isActive: true }
  });
  const areasPower = await prisma.area.create({
    data: { name: 'Power', description: 'Main Power Distribution', isActive: true }
  });
  const areasBackstage = await prisma.area.create({
    data: { name: 'Backstage', description: 'Backstage Area', isActive: true }
  });
  const areasVIP = await prisma.area.create({
    data: { name: 'VIP', description: 'VIP Section', isActive: true }
  });
  const areasBar = await prisma.area.create({
    data: { name: 'Bar', description: 'Bar Area', isActive: true }
  });
  const areasEntrance = await prisma.area.create({
    data: { name: 'Entrance', description: 'Main Entrance', isActive: true }
  });

  // Seed Equipment
  console.log('Seeding equipment...');
  const equipmentData = [
    {
      name: 'CDJ 3000 #1',
      areaId: areasDJPit.id,
      status: 'Ready',
      description: 'Professional DJ deck for main booth',
      lastInspection: new Date('2025-08-25'),
      nextDue: new Date('2025-09-01'),
      firmware: 'v2.1.4',
      city: 'jakarta'
    },
    {
      name: 'Void Nexus Speakers',
      areaId: areasFOH.id,
      status: 'Ready',
      description: 'Main PA system for front of house',
      lastInspection: new Date('2025-08-24'),
      nextDue: new Date('2025-08-31'),
      firmware: 'v1.8.2',
      city: 'jakarta'
    },
    {
      name: 'LED Wall Controller',
      areaId: areasLEDWall.id,
      status: 'Degraded',
      description: 'Main LED wall processing unit - needs calibration',
      lastInspection: new Date('2025-08-23'),
      nextDue: new Date('2025-08-30'),
      firmware: 'v3.2.1',
      city: 'jakarta'
    },
    {
      name: 'Liquid Smoke Machine',
      areaId: areasStage.id,
      status: 'Ready',
      description: 'Low-lying fog machine for stage effects',
      lastInspection: new Date('2025-08-25'),
      nextDue: new Date('2025-09-02'),
      firmware: 'N/A',
      city: 'bali'
    },
    {
      name: 'Pioneer DJM-V10',
      areaId: areasBooth.id,
      status: 'Ready',
      description: '6-channel professional DJ mixer',
      lastInspection: new Date('2025-08-24'),
      nextDue: new Date('2025-08-31'),
      firmware: 'v1.9.0',
      city: 'bali'
    },
    {
      name: 'Martin MAC Aura',
      areaId: areasFOH.id,
      status: 'Ready',
      description: 'LED wash moving head fixtures',
      lastInspection: new Date('2025-08-26'),
      nextDue: new Date('2025-09-03'),
      firmware: 'v2.5.0',
      city: 'jakarta'
    }
  ];

  await prisma.equipment.createMany({
    data: equipmentData.map(equipment => ({
      ...equipment,
      status: equipment.status as EquipmentStatus,
      city: equipment.city as City
    }))
  });

  // Seed Event Briefs
  console.log('Seeding event briefs...');
  await prisma.eventBrief.createMany({
    data: [
      {
        artist: 'ARTBAT',
        genre: 'Melodic Techno',
        setTimes: '22:00 - 02:00',
        stagePlotLink: '#',
        inputListLink: '#',
        // Legacy fields for compatibility
        monitorNeeds: '2x booth monitors, 1x stage monitor',
        ljCueNotes: 'Sync with drop at 23:15, strobes on breakdown',
        vjContentChecklist: '4K content ready, mapping tested',
        // New fields
        audioOrder: 'Main mix + 2x booth monitors, 1x stage monitor for backup vocals',
        specialLightingOrder: 'Sync with drop at 23:15, strobes on breakdown, haze throughout',
        visualOrder: '4K content ready, mapping tested, LED wall + floor mapping',
        timecodeRouting: 'LTC from CDJ to Resolume',
        brandMoment: 'Logo drop at 00:15, sponsor shout-out during break',
        liveSetRecording: 'Multi-track recording, live stream feed ready',
        sfxNotes: 'CO₂ cannons on main drop, confetti at end',
        briefStatus: 'Final',
        riskLevel: 'Low',
        city: 'jakarta',
        date: new Date('2025-08-28')
      },
      {
        artist: 'Charlotte de Witte',
        genre: 'Techno',
        setTimes: '21:30 - 01:30',
        // Legacy fields for compatibility
        monitorNeeds: 'Full booth setup',
        ljCueNotes: 'Dark atmosphere, strobes minimal',
        vjContentChecklist: 'Draft - pending approval',
        // New fields
        audioOrder: 'Full booth setup with wedge monitors, IEM backup',
        specialLightingOrder: 'Dark atmosphere, minimal strobes, low key lighting',
        visualOrder: 'Black and white visuals, minimal effects - pending approval',
        timecodeRouting: 'TBD',
        brandMoment: 'Silent brand moment during breakdown',
        liveSetRecording: 'Audio recording only, no video',
        sfxNotes: 'Fog throughout, cold sparks on finale',
        briefStatus: 'Draft',
        riskLevel: 'Med',
        city: 'jakarta',
        date: new Date('2025-09-15')
      },
      {
        artist: 'FISHER',
        genre: 'Tech House',
        setTimes: '23:00 - 03:00',
        // Legacy fields for compatibility
        monitorNeeds: '4x wedge monitors + subs',
        ljCueNotes: 'High energy strobes, sync with drops',
        vjContentChecklist: 'Colorful visuals, party vibe',
        // New fields
        audioOrder: '4x wedge monitors + 2x sub monitors, DJ booth setup',
        specialLightingOrder: 'High energy strobes, sync with drops, full color spectrum',
        visualOrder: 'Colorful party visuals, crowd reactions, DJ cam feed',
        timecodeRouting: 'MIDI clock sync from Traktor to LED wall',
        brandMoment: 'Logo animation at peak time 01:00',
        liveSetRecording: 'Full HD recording + multi-cam setup',
        sfxNotes: 'CO₂ every 30 minutes, confetti finale',
        briefStatus: 'Final',
        riskLevel: 'High',
        city: 'bali',
        date: new Date('2025-08-29')
      }
    ]
  });

  // Seed Crew Members
  console.log('Seeding crew members...');
  await prisma.crewMember.createMany({
    data: [
      { name: 'Chris', role: 'Engineer Day', shift: 'day', assigned: true, city: 'jakarta' },
      { name: 'Nando', role: 'Engineer Night', shift: 'night', assigned: true, city: 'jakarta' },
      { name: 'Dhipa', role: 'Sound Engineer', shift: 'night', assigned: true, city: 'jakarta' },
      { name: 'Jerry', role: 'Sound Engineer', shift: 'night', assigned: false, city: 'jakarta' },
      { name: 'Ating', role: 'Visual Jockey', shift: 'night', assigned: true, city: 'jakarta' },
      { name: 'Helmi', role: 'Lighting Jockey', shift: 'night', assigned: true, city: 'jakarta' },
      { name: 'Kukuh', role: 'Engineer Day', shift: 'day', assigned: true, city: 'bali' },
      { name: 'Pungku', role: 'Engineer Day', shift: 'day', assigned: true, city: 'bali' },
      { name: 'Andra', role: 'Engineer Night', shift: 'night', assigned: true, city: 'bali' },
      { name: 'Made', role: 'Sound Engineer', shift: 'night', assigned: true, city: 'bali' },
      { name: 'Slengky', role: 'Visual Jockey', shift: 'night', assigned: true, city: 'bali' },
      { name: 'Budi', role: 'Lighting Jockey', shift: 'night', assigned: true, city: 'bali' },
      { name: 'Soon', role: 'Technical Asst', shift: 'night', assigned: false, city: 'bali' }
    ]
  });

  // Seed Maintenance Logs
  console.log('Seeding maintenance logs...');
  const cdj = await prisma.equipment.findFirst({ where: { name: 'CDJ 3000 #1' } });
  const ledWall = await prisma.equipment.findFirst({ where: { name: 'LED Wall Controller' } });
  const voidSpeakers = await prisma.equipment.findFirst({ where: { name: 'Void Nexus Speakers' } });
  const martinAura = await prisma.equipment.findFirst({ where: { name: 'Martin MAC Aura' } });
  const chris = await prisma.crewMember.findFirst({ where: { name: 'Chris' } });
  const nando = await prisma.crewMember.findFirst({ where: { name: 'Nando' } });
  
  await prisma.maintenanceLog.createMany({
    data: [
      // Recent maintenance logs for testing
      {
        equipmentId: cdj?.id,
        type: 'Preventive',
        issue: 'Routine cleaning and calibration',
        status: 'Completed',
        mttr: 1.5,
        cost: 150000,
        parts: ['Cleaning kit', 'Calibration disc'],
        date: new Date('2025-11-28'),
        technicianId: chris?.id,
        city: 'jakarta',
        photo: ''
      },
      {
        equipmentId: ledWall?.id,
        type: 'Corrective',
        issue: 'Display artifacts in upper right panel',
        status: 'Completed',
        mttr: 4.2,
        cost: 850000,
        parts: ['LED Module', 'Control board'],
        date: new Date('2025-11-29'),
        technicianId: nando?.id,
        city: 'jakarta',
        photo: ''
      },
      {
        equipmentId: voidSpeakers?.id,
        type: 'Preventive',
        issue: 'Driver inspection and firmware update',
        status: 'Completed',
        mttr: 2.0,
        cost: 250000,
        parts: ['Firmware update'],
        date: new Date('2025-11-30'),
        technicianId: chris?.id,
        city: 'jakarta',
        photo: ''
      },
      {
        equipmentId: martinAura?.id,
        type: 'Corrective',
        issue: 'Pan motor grinding noise',
        status: 'In_Progress',
        mttr: 3.5,
        cost: 450000,
        parts: ['Motor assembly', 'Bearing kit'],
        date: new Date('2025-12-01'),
        technicianId: nando?.id,
        city: 'jakarta',
        photo: ''
      },
      // Old maintenance logs (historical data)
      {
        equipmentId: cdj?.id,
        type: 'Preventive',
        issue: 'Annual service check',
        status: 'Completed',
        mttr: 1.0,
        cost: 100000,
        parts: ['Cleaning supplies'],
        date: new Date('2025-08-25'),
        technicianId: chris?.id,
        city: 'jakarta',
        photo: ''
      },
      {
        equipmentId: ledWall?.id,
        type: 'Corrective',
        issue: 'Panel calibration drift',
        status: 'Completed',
        mttr: 2.5,
        cost: 350000,
        parts: ['Calibration tools'],
        date: new Date('2025-08-26'),
        technicianId: nando?.id,
        city: 'jakarta',
        photo: ''
      }
    ]
  });

  // Seed Incidents
  console.log('Seeding incidents...');
  await prisma.incident.createMany({
    data: [
      {
        type: 'Audio',
        description: 'Speaker dropout during peak hours',
        rootCause: 'Loose power connection',
        prevention: 'Regular connection inspection added to checklist',
        impact: 'Minimal - backup engaged automatically',
        date: new Date('2025-08-24T23:15:00'),
        city: 'jakarta'
      }
    ]
  });

  // Seed Proposals
  console.log('Seeding proposals...');
  await prisma.proposal.createMany({
    data: [
      {
        title: 'LED Wall Upgrade - 4K Panels',
        type: 'CapEx',
        urgency: 'High',
        estimate: 125000000,
        vendor: 'LED Solutions Indonesia',
        status: 'Pending',
        targetDate: new Date('2025-12-15'),
        owner: 'Chris',
        nextAction: 'CEO Approval Required',
        quotesCount: 3,
        quotesPdfs: [],
        description: 'Upgrade existing LED wall to 4K panels for better visual quality',
        estimateApproved: false,
        city: 'jakarta'
      },
      {
        title: 'New DJ Booth Design',
        type: 'CapEx',
        urgency: 'Medium',
        estimate: 45000000,
        vendor: 'Custom Furniture Co',
        status: 'Approved',
        targetDate: new Date('2026-01-20'),
        owner: 'Ating',
        nextAction: 'Order materials',
        quotesCount: 2,
        quotesPdfs: [],
        description: 'Custom DJ booth with integrated cable management',
        estimateApproved: true,
        estimateApprovedBy: 'admin',
        city: 'jakarta'
      }
    ]
  });

  // Seed R&D Projects
  console.log('Seeding R&D projects...');
  await prisma.rndProject.createMany({
    data: [
      {
        title: 'Resolume Special FX Integration',
        description: 'Advanced particle systems and real-time generative content for DJ drops',
        phase: 'Pilot',
        status: 'Active',
        progress: 65,
        risks: ['GPU performance under load', 'Content sync timing'],
        dependencies: ['New media server', 'Timecode integration'],
        lead: 'Ating',
        targetDate: new Date('2025-12-20'),
        budget: 15000000,
        actualCost: 9500000,
        milestones: [
          { title: 'Media server setup', dueDate: '2025-11-15', completed: true },
          { title: 'FX library creation', dueDate: '2025-12-05', completed: false },
          { title: 'Live testing', dueDate: '2025-12-18', completed: false }
        ],
        notes: 'Testing on December 10 with special event',
        city: 'jakarta'
      },
      {
        title: 'LED Ceiling Interactive System',
        description: 'Ceiling-mounted LED panels with motion tracking for immersive effects',
        phase: 'POC',
        status: 'Active',
        progress: 35,
        risks: ['Structural load capacity', 'Heat dissipation'],
        dependencies: ['Venue structural approval', 'Motion sensors'],
        lead: 'Chris',
        targetDate: new Date('2026-02-28'),
        budget: 45000000,
        actualCost: 12000000,
        milestones: [
          { title: 'Prototype build', dueDate: '2025-12-01', completed: true },
          { title: 'Motion tracking integration', dueDate: '2026-01-15', completed: false }
        ],
        notes: 'Waiting for venue approval',
        city: 'jakarta'
      },
      {
        title: 'AI DJ Beat Matching Assistant',
        description: 'Machine learning algorithm to suggest next tracks based on crowd energy',
        phase: 'Idea',
        status: 'Active',
        progress: 10,
        risks: ['Data privacy', 'Accuracy requirements'],
        dependencies: ['Crowd monitoring cameras', 'Training dataset'],
        lead: 'Nando',
        targetDate: new Date('2026-06-30'),
        budget: 8000000,
        actualCost: 500000,
        milestones: [
          { title: 'Research phase', dueDate: '2025-12-31', completed: false },
          { title: 'Algorithm development', dueDate: '2026-03-31', completed: false }
        ],
        notes: 'Initial research in progress',
        city: 'jakarta'
      }
    ]
  });

  // Seed Suppliers
  console.log('Seeding suppliers...');
  const suppliers = await prisma.supplier.createMany({
    data: [
      {
        name: 'Indonesia SFX Supply',
        code: 'SUP-001',
        contactPerson: 'Budi Santoso',
        email: 'budi@sfxsupply.co.id',
        phone: '+62 21 555-0101',
        address: 'Jl. Industri No. 45, Jakarta Utara',
        city: 'jakarta',
        taxId: '01.234.567.8-901.000',
        paymentTerms: 30,
        rating: 4.5,
        status: 'Active',
        notes: 'Reliable supplier for SFX consumables'
      },
      {
        name: 'Haze Pro Jakarta',
        code: 'SUP-002',
        contactPerson: 'Andi Wijaya',
        email: 'andi@hazepro.co.id',
        phone: '+62 21 555-0202',
        address: 'Jl. Teater No. 12, Jakarta Selatan',
        city: 'jakarta',
        taxId: '02.345.678.9-012.000',
        paymentTerms: 14,
        rating: 4.8,
        status: 'Active'
      },
      {
        name: 'Bali Event Supplies',
        code: 'SUP-003',
        contactPerson: 'Made Suryadi',
        email: 'made@balieventsupplies.com',
        phone: '+62 361 555-0303',
        address: 'Jl. Sunset Road No. 88, Bali',
        city: 'bali',
        taxId: '03.456.789.0-123.000',
        paymentTerms: 30,
        rating: 4.3,
        status: 'Active'
      },
      {
        name: 'Global Tech Supplies',
        code: 'SUP-004',
        contactPerson: 'John Smith',
        email: 'john@globaltech.co.id',
        phone: '+62 21 555-0404',
        address: 'Kawasan Industri MM2100, Bekasi',
        city: 'jakarta',
        taxId: '04.567.890.1-234.000',
        paymentTerms: 45,
        rating: 4.6,
        status: 'Active',
        notes: 'Specializes in audio/lighting equipment consumables'
      },
      {
        name: 'Quick Stock Bali',
        code: 'SUP-005',
        contactPerson: 'Ketut Agung',
        email: 'ketut@quickstock.bali',
        phone: '+62 361 555-0505',
        address: 'Jl. Bypass Ngurah Rai, Bali',
        city: 'bali',
        taxId: '05.678.901.2-345.000',
        paymentTerms: 7,
        rating: 4.0,
        status: 'Active',
        notes: 'Fast delivery, emergency supplies'
      }
    ]
  });

  // Get supplier IDs for relations
  const allSuppliers = await prisma.supplier.findMany();
  const jakartaSuppliers = allSuppliers.filter(s => s.city === 'jakarta');
  const baliSuppliers = allSuppliers.filter(s => s.city === 'bali');

  // Seed Consumables
  console.log('Seeding consumables...');
  const consumables = await prisma.consumable.createMany({
    data: [
      // Jakarta Consumables
      {
        name: 'CO₂ Cartridges',
        category: 'SFX',
        description: 'High-pressure CO2 cartridges for fog cannons and cryo effects',

        currentStock: 24,
        minStock: 12,
        maxStock: 100,
        reorderPoint: 15,
        reorderQty: 50,
        unit: 'cartridges',
        unitCost: 25000,
        location: 'Warehouse A - Shelf 3',
        city: 'jakarta'
      },
      {
        name: 'Fog Fluid - High Density',
        category: 'SFX',
        description: 'Professional fog machine fluid for dense, long-lasting fog',

        currentStock: 45,
        minStock: 20,
        maxStock: 200,
        reorderPoint: 25,
        reorderQty: 100,
        unit: 'liters',
        unitCost: 85000,
        location: 'Warehouse A - Section B',
        city: 'jakarta'
      },
      {
        name: 'Confetti Mix - Metallic',
        category: 'SFX',
        description: 'Biodegradable metallic confetti for confetti cannons',

        currentStock: 8,
        minStock: 5,
        maxStock: 30,
        reorderPoint: 6,
        reorderQty: 15,
        unit: 'kg',
        unitCost: 450000,
        location: 'Warehouse A - Shelf 5',
        city: 'jakarta'
      },
      {
        name: 'DMX Cables - 3m',
        category: 'Lighting',
        description: '3-pin DMX cables, 3 meters, professional grade',

        currentStock: 15,
        minStock: 10,
        maxStock: 50,
        reorderPoint: 12,
        reorderQty: 20,
        unit: 'pieces',
        unitCost: 75000,
        location: 'Tech Room - Drawer 2',
        city: 'jakarta'
      },
      {
        name: 'LED Par Can Filters - CTB',
        category: 'Lighting',
        description: 'Color correction filters (CTB) for LED Par cans',

        currentStock: 25,
        minStock: 15,
        maxStock: 100,
        reorderPoint: 18,
        reorderQty: 40,
        unit: 'sheets',
        unitCost: 35000,
        location: 'Tech Room - Cabinet A',
        city: 'jakarta'
      },
      {
        name: 'Gaffer Tape - Black 2"',
        category: 'General',
        description: 'Professional gaffer tape, black, 2 inch width',

        currentStock: 12,
        minStock: 8,
        maxStock: 40,
        reorderPoint: 10,
        reorderQty: 24,
        unit: 'rolls',
        unitCost: 95000,
        location: 'General Storage - Bin 1',
        city: 'jakarta'
      },
      {
        name: 'XLR Cables - 5m',
        category: 'Audio',
        description: 'Balanced XLR microphone cables, 5 meters',

        currentStock: 20,
        minStock: 12,
        maxStock: 60,
        reorderPoint: 15,
        reorderQty: 30,
        unit: 'pieces',
        unitCost: 125000,
        location: 'Audio Room - Rack B',
        city: 'jakarta'
      },
      {
        name: 'Battery 9V Alkaline',
        category: 'Audio',
        description: 'Alkaline 9V batteries for wireless mics',

        currentStock: 48,
        minStock: 24,
        maxStock: 200,
        reorderPoint: 30,
        reorderQty: 100,
        unit: 'pieces',
        unitCost: 15000,
        location: 'Audio Room - Drawer 3',
        city: 'jakarta'
      },
      
      // Bali Consumables
      {
        name: 'CO₂ Cartridges',
        category: 'SFX',
        description: 'High-pressure CO2 cartridges for fog cannons and cryo effects',

        currentStock: 18,
        minStock: 10,
        maxStock: 80,
        reorderPoint: 12,
        reorderQty: 40,
        unit: 'cartridges',
        unitCost: 27000,
        location: 'Storage - Shelf A',
        city: 'bali'
      },
      {
        name: 'Fog Fluid - Standard',
        category: 'SFX',
        description: 'Standard fog machine fluid',

        currentStock: 32,
        minStock: 15,
        maxStock: 150,
        reorderPoint: 20,
        reorderQty: 80,
        unit: 'liters',
        unitCost: 78000,
        location: 'Storage - Section C',
        city: 'bali'
      },
      {
        name: 'Bubble Fluid',
        category: 'SFX',
        description: 'Professional bubble machine fluid',

        currentStock: 22,
        minStock: 10,
        maxStock: 60,
        reorderPoint: 12,
        reorderQty: 30,
        unit: 'liters',
        unitCost: 65000,
        location: 'Storage - Shelf B',
        city: 'bali'
      },
      {
        name: 'DMX Cables - 5m',
        category: 'Lighting',
        description: '3-pin DMX cables, 5 meters',

        currentStock: 12,
        minStock: 8,
        maxStock: 40,
        reorderPoint: 10,
        reorderQty: 16,
        unit: 'pieces',
        unitCost: 95000,
        location: 'Tech Storage - Box 1',
        city: 'bali'
      },
      {
        name: 'Gaffer Tape - White 2"',
        category: 'General',
        description: 'Professional gaffer tape, white, 2 inch width',

        currentStock: 8,
        minStock: 5,
        maxStock: 30,
        reorderPoint: 6,
        reorderQty: 18,
        unit: 'rolls',
        unitCost: 95000,
        location: 'General Storage',
        city: 'bali'
      },
      {
        name: 'Power Cables - IEC',
        category: 'General',
        description: 'Standard IEC power cables, 2 meters',

        currentStock: 16,
        minStock: 10,
        maxStock: 50,
        reorderPoint: 12,
        reorderQty: 25,
        unit: 'pieces',
        unitCost: 45000,
        location: 'General Storage',
        city: 'bali'
      }
    ]
  });

  // Get consumable IDs for stock movements
  const allConsumables = await prisma.consumable.findMany();
  
  // Create sample purchase orders
  console.log('Seeding purchase orders...');
  const po1 = await prisma.purchaseOrder.create({
    data: {
      orderNumber: 'PO-2025-001',
      supplierId: jakartaSuppliers[0].id,
      orderDate: new Date('2025-11-20'),
      expectedDate: new Date('2025-11-27'),
      status: 'Ordered',
      totalAmount: 5250000,
      notes: 'Regular monthly stock replenishment',
      city: 'jakarta'
    }
  });

  const po2 = await prisma.purchaseOrder.create({
    data: {
      orderNumber: 'PO-2025-002',
      supplierId: jakartaSuppliers[1].id,
      orderDate: new Date('2025-11-22'),
      expectedDate: new Date('2025-11-25'),
      status: 'Submitted',
      totalAmount: 8500000,
      notes: 'Urgent fog fluid restock',
      city: 'jakarta'
    }
  });

  // Add PO items
  const fogFluidJkt = allConsumables.find(c => c.name === 'Fog Fluid - High Density');
  const co2Jkt = allConsumables.find(c => c.name === 'CO₂ Cartridges');
  
  if (fogFluidJkt && co2Jkt) {
    await prisma.purchaseOrderItem.createMany({
      data: [
        {
          purchaseOrderId: po1.id,
          consumableId: co2Jkt.id,
          quantity: 50,
          receivedQty: 0,
          unitPrice: 25000,
          totalPrice: 1250000
        },
        {
          purchaseOrderId: po1.id,
          consumableId: fogFluidJkt.id,
          quantity: 100,
          receivedQty: 0,
          unitPrice: 85000,
          totalPrice: 8500000
        },
        {
          purchaseOrderId: po2.id,
          consumableId: fogFluidJkt.id,
          quantity: 100,
          receivedQty: 0,
          unitPrice: 85000,
          totalPrice: 8500000
        }
      ]
    });
  }

  // Create stock movement history
  console.log('Seeding stock movements...');
  await prisma.stockMovement.createMany({
    data: [
      {
        consumableId: fogFluidJkt?.id || allConsumables[0].id,
        type: 'Purchase',
        quantity: 100,
        balanceBefore: 0,
        balanceAfter: 100,
        unitCost: 85000,
        totalCost: 8500000,
        reference: 'PO-2025-000',
        notes: 'Initial stock',
        performedBy: 'System',
        city: 'jakarta',
        createdAt: new Date('2025-11-01')
      },
      {
        consumableId: fogFluidJkt?.id || allConsumables[0].id,
        type: 'Usage',
        quantity: -35,
        balanceBefore: 100,
        balanceAfter: 65,
        reference: 'Event: Weekend Session Nov 15-16',
        notes: 'Used for Friday and Saturday night events',
        performedBy: 'Tech Team',
        city: 'jakarta',
        createdAt: new Date('2025-11-16')
      },
      {
        consumableId: fogFluidJkt?.id || allConsumables[0].id,
        type: 'Usage',
        quantity: -20,
        balanceBefore: 65,
        balanceAfter: 45,
        reference: 'Event: Special Guest DJ',
        notes: 'Heavy usage for special event',
        performedBy: 'Tech Team',
        city: 'jakarta',
        createdAt: new Date('2025-11-22')
      },
      {
        consumableId: co2Jkt?.id || allConsumables[1].id,
        type: 'Purchase',
        quantity: 50,
        balanceBefore: 0,
        balanceAfter: 50,
        unitCost: 25000,
        totalCost: 1250000,
        reference: 'PO-2025-000',
        notes: 'Initial stock',
        performedBy: 'System',
        city: 'jakarta',
        createdAt: new Date('2025-11-01')
      },
      {
        consumableId: co2Jkt?.id || allConsumables[1].id,
        type: 'Usage',
        quantity: -26,
        balanceBefore: 50,
        balanceAfter: 24,
        reference: 'Event: November Events',
        notes: 'CO2 effects throughout November',
        performedBy: 'SFX Team',
        city: 'jakarta',
        createdAt: new Date('2025-11-20')
      }
    ]
  });

  // Seed Alerts
  console.log('Seeding alerts...');
  await prisma.alert.createMany({
    data: [
      {
        type: 'critical',
        title: 'SPL Violation',
        message: 'Sound levels exceeded 110 dB at 23:45. Immediate attention required.',
        timestamp: new Date(),
        acknowledged: false,
        city: 'jakarta'
      },
      {
        type: 'warning',
        title: 'Equipment Maintenance Due',
        message: 'LED Wall Controller requires inspection within 2 days.',
        timestamp: new Date(),
        acknowledged: false,
        city: 'jakarta'
      }
    ]
  });

  // Seed KPI Metrics
  console.log('Seeding KPI metrics...');
  await prisma.kPIMetrics.createMany({
    data: [
      {
        city: 'jakarta',
        nightsOpen: 4,
        equipmentUptimePercentage: 97.8,
        issuesRaised: 8,
        issuesResolved: 6,
        powerIncidents: 1,
        weekYear: 2025,
        weekNumber: 35
      },
      {
        city: 'bali',
        nightsOpen: 5,
        equipmentUptimePercentage: 95.4,
        issuesRaised: 12,
        issuesResolved: 10,
        powerIncidents: 2,
        weekYear: 2025,
        weekNumber: 35
      }
    ]
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
