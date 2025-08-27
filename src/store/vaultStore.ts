import { create } from 'zustand';

export type City = 'jakarta' | 'bali';
export type ShiftType = 'day' | 'night';
export type EquipmentArea = 'FOH' | 'booth' | 'stage' | 'DJ pit' | 'LED wall' | 'dimmer room' | 'amp rack' | 'power';
export type EquipmentStatus = 'Ready' | 'Degraded' | 'OOS' | 'In-Transit' | 'Spare';
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
  area: EquipmentArea;
  status: EquipmentStatus;
  lastInspection: string;
  nextDue: string;
  firmware: string;
  hoursUsed: number;
  city: City;
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

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  shift: ShiftType;
  assigned: boolean;
  city: City;
}

export interface TonightGlance {
  eventBriefLocked: boolean;
  assignedCrew: CrewMember[];
  redAmberRisks: string[];
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
  tonightGlance: Record<City, TonightGlance>;
  alerts: Alert[];
  
  // Actions
  setSelectedCity: (city: City) => void;
  setSelectedWeek: (week: { year: number; month: number; week: number }) => void;
  updateEquipmentStatus: (id: string, status: EquipmentStatus) => void;
  acknowledgeAlert: (id: string) => void;
  updateEventBrief: (id: string, updates: Partial<EventBrief>) => void;
  assignCrewMember: (id: string, assigned: boolean) => void;
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
    { id: "1", name: "CDJ 3000 #1", area: "DJ pit", status: "Ready", lastInspection: "2025-08-25", nextDue: "2025-09-01", firmware: "v2.1.4", hoursUsed: 1247, city: "jakarta" },
    { id: "2", name: "Void Nexus Speakers", area: "FOH", status: "Ready", lastInspection: "2025-08-24", nextDue: "2025-08-31", firmware: "v1.8.2", hoursUsed: 2156, city: "jakarta" },
    { id: "3", name: "LED Wall Controller", area: "LED wall", status: "Degraded", lastInspection: "2025-08-23", nextDue: "2025-08-30", firmware: "v3.2.1", hoursUsed: 897, city: "jakarta" },
    { id: "4", name: "Liquid Smoke Machine", area: "stage", status: "Ready", lastInspection: "2025-08-25", nextDue: "2025-09-02", firmware: "N/A", hoursUsed: 324, city: "bali" },
    { id: "5", name: "Pioneer DJM-V10", area: "DJ pit", status: "Ready", lastInspection: "2025-08-24", nextDue: "2025-08-31", firmware: "v1.9.0", hoursUsed: 1564, city: "bali" },
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

  tonightGlance: {
    jakarta: {
      eventBriefLocked: true,
      assignedCrew: [],
      redAmberRisks: ["LED Wall Controller degraded", "VJ Tech not assigned"]
    },
    bali: {
      eventBriefLocked: false,
      assignedCrew: [],
      redAmberRisks: ["Event brief still draft", "High SPL risk venue"]
    }
  },

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
}));