import { create } from 'zustand';

export type City = 'jakarta' | 'bali';
export type ShiftType = 'day' | 'night';
export type EquipmentStatus = 'Ready' | 'Degraded' | 'OOS' | 'In_Transit' | 'Spare';
export type RiskLevel = 'Low' | 'Med' | 'High';
export type BriefStatus = 'Draft' | 'Final';
export type EventStatus = 'upcoming' | 'in-progress' | 'completed';

export interface KPIMetrics {
  nightsOpen: number;
  equipmentUptimePercentage: number;
  issuesRaised: number;
  issuesResolved: number;
  powerIncidents: number;
}

export interface Equipment {
  id: string;
  name: string;
  areaId: string | null;
  area?: {
    id: string;
    name: string;
  };
  status: EquipmentStatus;
  lastInspection: string;
  nextDue: string;
  firmware: string;
  photo: string | null;
  description: string;
  city: City;
  createdAt: string;
  updatedAt: string;
}

export interface EventBrief {
  id: string;
  artist: string;
  genre: string;
  setTimes: string;
  stagePlotLink?: string;
  inputListLink?: string;
  monitorNeeds: string;
  ljCueNotes: string;
  vjContentChecklist: string;
  timecodeRouting: string;
  sfxNotes: string; // CO₂/confetti/fog/cold spark
  briefStatus: BriefStatus;
  riskLevel: RiskLevel;
  city: City;
  date: string;
}

export interface MaintenanceLog {
  id: string;
  equipment: string;
  type: 'Preventive' | 'Corrective';
  issue: string;
  status: 'Completed' | 'In Progress' | 'Scheduled';
  mttr: number | null;
  cost: number;
  parts: string[];
  date: string;
  technician: string;
  city: City;
}

export interface Incident {
  id: string;
  type: 'Audio' | 'Lighting' | 'Video' | 'Power' | 'Safety';
  description: string;
  rootCause: string;
  prevention: string;
  impact: string;
  date: string;
  city: City;
}

export interface Proposal {
  id: string;
  title: string;
  type: 'CapEx' | 'OpEx';
  urgency: 'High' | 'Medium' | 'Low';
  estimate: number;
  roi: string;
  vendor: string;
  status: 'Draft' | 'Review' | 'Approved' | 'Ordered' | 'Live';
  targetWeek: string;
  owner: string;
  nextAction: string;
  quotes: number;
  city: City;
}

export interface RndProject {
  id: string;
  title: string;
  description: string;
  phase: 'Idea' | 'POC' | 'Pilot' | 'Live';
  progress: number;
  risks: string[];
  dependencies: string[];
  lead: string;
  targetCompletion: string;
  budget: number;
  city: City;
}

export interface Consumable {
  id: string;
  name: string;
  category: string;
  description: string | null;
  sku: string | null;
  currentStock: number;
  minStock: number;
  maxStock: number | null;
  reorderPoint: number;
  reorderQty: number;
  unit: string;
  unitCost: number;
  location: string | null;
  barcode: string | null;
  image: string | null;
  city: City;
  createdAt: string;
  updatedAt: string;
}

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  shift: ShiftType;
  assigned: boolean;
  city: City;
}


export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  city: City;
}

interface VaultState {
  selectedCity: City;
  selectedWeek: { year: number; month: number; week: number };
  kpiMetrics: Record<City, KPIMetrics>;
  equipment: Equipment[];
  eventBriefs: EventBrief[];
  crewMembers: CrewMember[];
  
  alerts: Alert[];
  maintenanceLogs: MaintenanceLog[];
  incidents: Incident[];
  proposals: Proposal[];
  rndProjects: RndProject[];
  consumables: Consumable[];
  
  // Actions
  setSelectedCity: (city: City) => void;
  setSelectedWeek: (week: { year: number; month: number; week: number }) => void;
  updateEquipmentStatus: (id: string, status: EquipmentStatus) => void;
  acknowledgeAlert: (id: string) => void;
  updateEventBrief: (id: string, updates: Partial<EventBrief>) => void;
  assignCrewMember: (id: string, assigned: boolean) => void;
  addEventBrief: (brief: Omit<EventBrief, 'id'>) => void;
  deleteEventBrief: (id: string) => void;
  addMaintenanceLog: (log: Omit<MaintenanceLog, 'id'>) => void;
  updateMaintenanceLog: (id: string, updates: Partial<MaintenanceLog>) => void;
  deleteMaintenanceLog: (id: string) => void;
  addIncident: (incident: Omit<Incident, 'id'>) => void;
  addProposal: (proposal: Omit<Proposal, 'id'>) => void;
  updateProposal: (id: string, updates: Partial<Proposal>) => void;
  deleteProposal: (id: string) => void;
  addRndProject: (project: Omit<RndProject, 'id'>) => void;
  updateRndProject: (id: string, updates: Partial<RndProject>) => void;
  addConsumable: (consumable: Omit<Consumable, 'id'>) => void;
  updateConsumable: (id: string, updates: Partial<Consumable>) => void;
}

export const useVaultStore = create<VaultState>((set, get) => ({
  selectedCity: 'jakarta',
  selectedWeek: { year: 2025, month: 8, week: 35 },
  
  kpiMetrics: {
    jakarta: {
      nightsOpen: 4, // Wed-Sat
      equipmentUptimePercentage: 97.8,
      issuesRaised: 8,
      issuesResolved: 6,
      powerIncidents: 1,
    },
    bali: {
      nightsOpen: 5, // Mon, Wed-Sat
      equipmentUptimePercentage: 95.4,
      issuesRaised: 12,
      issuesResolved: 10,
      powerIncidents: 2,
    },
  },

  equipment: [
    { id: "1", name: "CDJ 3000 #1", areaId: null, status: "Ready", lastInspection: "2025-08-25", nextDue: "2025-09-01", firmware: "v2.1.4", photo: null, description: "", city: "jakarta", createdAt: "2025-08-25", updatedAt: "2025-08-25" },
    { id: "2", name: "Void Nexus Speakers", areaId: null, status: "Ready", lastInspection: "2025-08-24", nextDue: "2025-08-31", firmware: "v1.8.2", photo: null, description: "", city: "jakarta", createdAt: "2025-08-24", updatedAt: "2025-08-24" },
    { id: "3", name: "LED Wall Controller", areaId: null, status: "Degraded", lastInspection: "2025-08-23", nextDue: "2025-08-30", firmware: "v3.2.1", photo: null, description: "", city: "jakarta", createdAt: "2025-08-23", updatedAt: "2025-08-23" },
    { id: "4", name: "Liquid Smoke Machine", areaId: null, status: "Ready", lastInspection: "2025-08-25", nextDue: "2025-09-02", firmware: "N/A", photo: null, description: "", city: "bali", createdAt: "2025-08-25", updatedAt: "2025-08-25" },
    { id: "5", name: "Pioneer DJM-V10", areaId: null, status: "Ready", lastInspection: "2025-08-24", nextDue: "2025-08-31", firmware: "v1.9.0", photo: null, description: "", city: "bali", createdAt: "2025-08-24", updatedAt: "2025-08-24" },
  ],

  eventBriefs: [
    {
      id: "1",
      artist: "ARTBAT",
      genre: "Melodic Techno",
      setTimes: "22:00 - 02:00",
      stagePlotLink: "#",
      inputListLink: "#",
      monitorNeeds: "2x booth monitors, 1x stage monitor",
      ljCueNotes: "Sync with drop at 23:15, strobes on breakdown",
      vjContentChecklist: "4K content ready, mapping tested",
      timecodeRouting: "LTC from CDJ to Resolume",
      sfxNotes: "CO₂ cannons on main drop, confetti at end",
      briefStatus: "Final",
      riskLevel: "Low",
      city: "jakarta",
      date: "2025-08-28"
    },
    {
      id: "2",
      artist: "Charlotte de Witte",
      genre: "Techno",
      setTimes: "21:30 - 01:30",
      monitorNeeds: "Full booth setup",
      ljCueNotes: "Dark atmosphere, strobes minimal",
      vjContentChecklist: "Draft - pending approval",
      timecodeRouting: "TBD",
      sfxNotes: "Fog throughout, cold sparks on finale",
      briefStatus: "Draft",
      riskLevel: "Med",
      city: "bali",
      date: "2025-08-29"
    },
  ],

  crewMembers: [
    // Jakarta Team
    { id: "1", name: "Chris", role: "Engineer Day", shift: "day", assigned: true, city: "jakarta" },
    { id: "2", name: "Nando", role: "Engineer Night", shift: "night", assigned: true, city: "jakarta" },
    { id: "3", name: "Dhipa", role: "Sound Engineer", shift: "night", assigned: true, city: "jakarta" },
    { id: "4", name: "Jerry", role: "Sound Engineer", shift: "night", assigned: false, city: "jakarta" },
    { id: "5", name: "Ating", role: "Visual Jockey", shift: "night", assigned: true, city: "jakarta" },
    { id: "6", name: "Helmi", role: "Lighting Jockey", shift: "night", assigned: true, city: "jakarta" },
    
    // Bali Team
    { id: "7", name: "Kukuh", role: "Engineer Day", shift: "day", assigned: true, city: "bali" },
    { id: "8", name: "Pungku", role: "Engineer Day", shift: "day", assigned: true, city: "bali" },
    { id: "9", name: "Andra", role: "Engineer Night", shift: "night", assigned: true, city: "bali" },
    { id: "10", name: "Made", role: "Sound Engineer", shift: "night", assigned: true, city: "bali" },
    { id: "11", name: "Slengky", role: "Visual Jockey", shift: "night", assigned: true, city: "bali" },
    { id: "12", name: "Budi", role: "Lighting Jockey", shift: "night", assigned: true, city: "bali" },
    { id: "13", name: "Soon", role: "Technical Asst", shift: "night", assigned: false, city: "bali" },
  ],


  alerts: [
    {
      id: "1",
      type: "critical",
      title: "SPL Violation",
      message: "Sound levels exceeded 110 dB at 23:45. Immediate attention required.",
      timestamp: "15 min ago",
      acknowledged: false,
      city: "jakarta"
    },
    {
      id: "2",
      type: "warning",
      title: "Equipment Maintenance Due",
      message: "LED Wall Controller requires inspection within 2 days.",
      timestamp: "1 hr ago",
      acknowledged: false,
      city: "jakarta"
    },
    {
      id: "3",
      type: "info",
      title: "Training Scheduled",
      message: "Resolume workshop scheduled for crew tomorrow 14:00.",
      timestamp: "2 hrs ago",
      acknowledged: true,
      city: "bali"
    },
  ],

  maintenanceLogs: [
    { id: "1", equipment: "CDJ 3000 #1", type: "Preventive", issue: "Routine cleaning and calibration", status: "Completed", mttr: 1.5, cost: 150000, parts: ["Cleaning kit", "Calibration disc"], date: "2025-08-25", technician: "Chris", city: "jakarta" },
    { id: "2", equipment: "LED Wall Controller", type: "Corrective", issue: "Display artifacts in upper right panel", status: "In Progress", mttr: 4.2, cost: 850000, parts: ["LED Module", "Control board"], date: "2025-08-26", technician: "Nando", city: "jakarta" },
    { id: "3", equipment: "Liquid Smoke Machine", type: "Corrective", issue: "Intermittent power loss", status: "Scheduled", mttr: null, cost: 500000, parts: ["Power supply unit"], date: "2025-08-28", technician: "Made", city: "bali" },
  ],

  incidents: [
    { id: "1", type: "Audio", description: "Speaker dropout during peak hours", rootCause: "Loose power connection", prevention: "Regular connection inspection added to checklist", impact: "Minimal - backup engaged automatically", date: "2025-08-24 23:15", city: "jakarta" },
    { id: "2", type: "Lighting", description: "Strobe malfunction during main set", rootCause: "Overheating due to blocked ventilation", prevention: "Enhanced cooling system maintenance", impact: "Medium - manual override used", date: "2025-08-23 01:30", city: "bali" },
  ],

  proposals: [
    { id: "1", title: "LED Wall Upgrade - 4K Panels", type: "CapEx", urgency: "High", estimate: 125000000, roi: "30% power efficiency, 50% better color accuracy", vendor: "LED Solutions Indonesia", status: "Review", targetWeek: "Week 37, 2025", owner: "Chris", nextAction: "CEO Approval Required", quotes: 3, city: "jakarta" },
    { id: "2", title: "Backup CDJ Units", type: "CapEx", urgency: "Medium", estimate: 45000000, roi: "Eliminate 90% of DJ setup failures", vendor: "Pioneer DJ Indonesia", status: "Approved", targetWeek: "Week 36, 2025", owner: "Kukuh", nextAction: "Procurement", quotes: 2, city: "bali" },
    { id: "3", title: "Preventive Maintenance Contract", type: "OpEx", urgency: "Low", estimate: 24000000, roi: "25% reduction in unexpected downtime", vendor: "TechMaint Services", status: "Draft", targetWeek: "Week 40, 2025", owner: "Nando", nextAction: "Cost analysis", quotes: 1, city: "jakarta" },
  ],

  rndProjects: [
    { id: "1", title: "Resolume Special FX Integration", description: "Advanced particle systems and real-time generative content for DJ drops", phase: "Pilot", progress: 75, risks: ["GPU performance under load", "Content sync timing"], dependencies: ["New media server", "Timecode integration"], lead: "Ating", targetCompletion: "Week 38, 2025", budget: 15000000, city: "jakarta" },
    { id: "2", title: "Sensoric Sound Triggers", description: "Motion-activated lighting cues based on crowd movement analysis", phase: "POC", progress: 45, risks: ["Privacy concerns", "Sensor accuracy in low light"], dependencies: ["Camera installation", "ML model training"], lead: "Slengky", targetCompletion: "Week 42, 2025", budget: 35000000, city: "bali" },
  ],

  consumables: [
    // Consumables now loaded from database via API
  ],

  setSelectedCity: (city) => set({ selectedCity: city }),
  
  setSelectedWeek: (week) => set({ selectedWeek: week }),
  
  updateEquipmentStatus: (id, status) => set((state) => ({
    equipment: state.equipment.map(eq => 
      eq.id === id ? { ...eq, status, lastInspection: new Date().toISOString().split('T')[0] } : eq
    )
  })),
  
  acknowledgeAlert: (id) => set((state) => ({
    alerts: state.alerts.map(alert => 
      alert.id === id ? { ...alert, acknowledged: true } : alert
    )
  })),
  
  updateEventBrief: (id, updates) => set((state) => ({
    eventBriefs: state.eventBriefs.map(brief => 
      brief.id === id ? { ...brief, ...updates } : brief
    )
  })),
  
  assignCrewMember: (id, assigned) => set((state) => ({
    crewMembers: state.crewMembers.map(member => 
      member.id === id ? { ...member, assigned } : member
    )
  })),

  addEventBrief: (brief) => set((state) => ({
    eventBriefs: [...state.eventBriefs, { ...brief, id: Date.now().toString() }]
  })),

  deleteEventBrief: (id) => set((state) => ({
    eventBriefs: state.eventBriefs.filter(brief => brief.id !== id)
  })),

  addMaintenanceLog: (log) => set((state) => ({
    maintenanceLogs: [...state.maintenanceLogs, { ...log, id: Date.now().toString() }]
  })),

  updateMaintenanceLog: (id, updates) => set((state) => ({
    maintenanceLogs: state.maintenanceLogs.map(log => 
      log.id === id ? { ...log, ...updates } : log
    )
  })),

  deleteMaintenanceLog: (id) => set((state) => ({
    maintenanceLogs: state.maintenanceLogs.filter(log => log.id !== id)
  })),

  addIncident: (incident) => set((state) => ({
    incidents: [...state.incidents, { ...incident, id: Date.now().toString() }]
  })),

  addProposal: (proposal) => set((state) => ({
    proposals: [...state.proposals, { ...proposal, id: Date.now().toString() }]
  })),

  updateProposal: (id, updates) => set((state) => ({
    proposals: state.proposals.map(proposal => 
      proposal.id === id ? { ...proposal, ...updates } : proposal
    )
  })),

  deleteProposal: (id) => set((state) => ({
    proposals: state.proposals.filter(proposal => proposal.id !== id)
  })),

  addRndProject: (project) => set((state) => ({
    rndProjects: [...state.rndProjects, { ...project, id: Date.now().toString() }]
  })),

  updateRndProject: (id, updates) => set((state) => ({
    rndProjects: state.rndProjects.map(project => 
      project.id === id ? { ...project, ...updates } : project
    )
  })),

  addConsumable: (consumable) => set((state) => ({
    consumables: [...state.consumables, { ...consumable, id: Date.now().toString() }]
  })),

  updateConsumable: (id, updates) => set((state) => ({
    consumables: state.consumables.map(consumable => 
      consumable.id === id ? { ...consumable, ...updates } : consumable
    )
  })),
}));