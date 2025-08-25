import { create } from 'zustand';

export interface Equipment {
  id: string;
  name: string;
  type: "lighting" | "sound" | "projector" | "stage";
  status: "online" | "maintenance" | "offline" | "warning";
  lastChecked: string;
  power?: number;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  setup: string;
  capacity: number;
  techRequirements: string[];
  status: "upcoming" | "in-progress" | "completed";
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: "active" | "break" | "setup";
  efficiency: number;
  tasksCompleted: number;
}

export interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

interface DashboardState {
  equipment: Equipment[];
  events: Event[];
  teamMembers: TeamMember[];
  alerts: Alert[];
  
  // Actions
  updateEquipmentStatus: (id: string, status: Equipment['status']) => void;
  updateEquipmentPower: (id: string, power: number) => void;
  acknowledgeAlert: (id: string) => void;
  acknowledgeAllAlerts: () => void;
  updateTeamMemberStatus: (id: string, status: TeamMember['status']) => void;
  addTask: (memberId: string) => void;
  restartEquipment: (id: string) => void;
  emergencyStop: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  equipment: [
    { id: "1", name: "Main Sound System", type: "sound", status: "online", lastChecked: "2 min ago", power: 85 },
    { id: "2", name: "LED Wall Array", type: "lighting", status: "online", lastChecked: "1 min ago", power: 92 },
    { id: "3", name: "Stage Fog Machine", type: "stage", status: "maintenance", lastChecked: "15 min ago" },
    { id: "4", name: "Projection Mapping", type: "projector", status: "warning", lastChecked: "5 min ago", power: 67 },
    { id: "5", name: "Laser Light Show", type: "lighting", status: "online", lastChecked: "30 sec ago", power: 95 },
    { id: "6", name: "Monitor Speakers", type: "sound", status: "offline", lastChecked: "1 hr ago" },
  ],

  events: [
    {
      id: "1",
      name: "Electric Friday",
      date: "Today",
      time: "22:00",
      setup: "20:00",
      capacity: 850,
      techRequirements: ["Full LED Wall", "Laser Show", "Fog Effects"],
      status: "in-progress"
    },
    {
      id: "2",
      name: "Saturday Night Fever",
      date: "Tomorrow",
      time: "21:30",
      setup: "19:30",
      capacity: 1200,
      techRequirements: ["Projection Mapping", "LED Strips", "Sound Enhancement"],
      status: "upcoming"
    },
    {
      id: "3",
      name: "Sunday Sessions",
      date: "Sun, Dec 29",
      time: "20:00",
      setup: "18:00",
      capacity: 600,
      techRequirements: ["Ambient Lighting", "Chill Sound Setup"],
      status: "upcoming"
    }
  ],

  teamMembers: [
    { id: "1", name: "Alex Chen", role: "Lead Lighting", status: "active", efficiency: 94, tasksCompleted: 12 },
    { id: "2", name: "Maya Rodriguez", role: "Sound Engineer", status: "active", efficiency: 88, tasksCompleted: 8 },
    { id: "3", name: "Jordan Kim", role: "Stage Tech", status: "setup", efficiency: 91, tasksCompleted: 15 },
    { id: "4", name: "Casey Thompson", role: "Visual Tech", status: "break", efficiency: 85, tasksCompleted: 6 },
  ],

  alerts: [
    {
      id: "1",
      type: "critical",
      title: "Monitor Speakers Offline",
      message: "Main monitor speakers have lost connection. Check power and network cables.",
      timestamp: "2 min ago",
      acknowledged: false
    },
    {
      id: "2",
      type: "warning",
      title: "Fog Machine Low Fluid",
      message: "Stage fog machine fluid level below 20%. Refill recommended before next event.",
      timestamp: "15 min ago",
      acknowledged: false
    },
    {
      id: "3",
      type: "info",
      title: "Scheduled Maintenance",
      message: "LED wall calibration scheduled for tomorrow at 14:00.",
      timestamp: "1 hr ago",
      acknowledged: true
    },
    {
      id: "4",
      type: "warning",
      title: "High Temperature Alert",
      message: "Amplifier rack temperature above normal range (65°C).",
      timestamp: "45 min ago",
      acknowledged: false
    }
  ],

  updateEquipmentStatus: (id, status) => set((state) => ({
    equipment: state.equipment.map(eq => 
      eq.id === id 
        ? { ...eq, status, lastChecked: "just now" }
        : eq
    )
  })),

  updateEquipmentPower: (id, power) => set((state) => ({
    equipment: state.equipment.map(eq => 
      eq.id === id 
        ? { ...eq, power, lastChecked: "just now" }
        : eq
    )
  })),

  acknowledgeAlert: (id) => set((state) => ({
    alerts: state.alerts.map(alert => 
      alert.id === id 
        ? { ...alert, acknowledged: true }
        : alert
    )
  })),

  acknowledgeAllAlerts: () => set((state) => ({
    alerts: state.alerts.map(alert => ({ ...alert, acknowledged: true }))
  })),

  updateTeamMemberStatus: (id, status) => set((state) => ({
    teamMembers: state.teamMembers.map(member => 
      member.id === id 
        ? { ...member, status }
        : member
    )
  })),

  addTask: (memberId) => set((state) => ({
    teamMembers: state.teamMembers.map(member => 
      member.id === memberId 
        ? { 
            ...member, 
            tasksCompleted: member.tasksCompleted + 1,
            efficiency: Math.min(100, member.efficiency + Math.floor(Math.random() * 3))
          }
        : member
    )
  })),

  restartEquipment: (id) => set((state) => ({
    equipment: state.equipment.map(eq => 
      eq.id === id 
        ? { 
            ...eq, 
            status: eq.status === "offline" ? "online" : eq.status,
            lastChecked: "just now",
            power: eq.power ? Math.min(100, eq.power + 10) : undefined
          }
        : eq
    )
  })),

  emergencyStop: () => set((state) => ({
    equipment: state.equipment.map(eq => ({
      ...eq,
      status: "offline" as const,
      lastChecked: "just now",
      power: 0
    })),
    alerts: [
      {
        id: `emergency-${Date.now()}`,
        type: "critical" as const,
        title: "Emergency Stop Activated",
        message: "All equipment has been stopped via emergency protocol.",
        timestamp: "just now",
        acknowledged: false
      },
      ...state.alerts
    ]
  }))
}));