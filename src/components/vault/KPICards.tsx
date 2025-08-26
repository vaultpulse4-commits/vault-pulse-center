import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useVaultStore } from "@/store/vaultStore";
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Play, 
  Clock, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Timer, 
  Activity,
  Target,
  Headphones,
  Power,
  Volume2,
  Users,
  GraduationCap
} from "lucide-react";

export function KPICards() {
  const { selectedCity, kpiMetrics } = useVaultStore();
  const metrics = kpiMetrics[selectedCity];

  const kpiData = [
    { 
      title: "Nights Open", 
      value: metrics.nightsOpen, 
      unit: "nights", 
      icon: Calendar, 
      trend: "stable",
      color: "text-foreground" 
    },
    { 
      title: "Events Executed", 
      value: metrics.eventsExecuted, 
      unit: "events", 
      icon: Play, 
      trend: "up",
      color: "text-success" 
    },
    { 
      title: "On-time Start", 
      value: metrics.onTimeStartPercentage, 
      unit: "%", 
      icon: Clock, 
      trend: metrics.onTimeStartPercentage >= 90 ? "up" : "down",
      color: metrics.onTimeStartPercentage >= 90 ? "text-success" : "text-warning" 
    },
    { 
      title: "Equipment Uptime", 
      value: metrics.equipmentUptimePercentage, 
      unit: "%", 
      icon: Zap, 
      trend: metrics.equipmentUptimePercentage >= 95 ? "up" : "down",
      color: metrics.equipmentUptimePercentage >= 95 ? "text-success" : "text-warning" 
    },
    { 
      title: "Issues Raised", 
      value: metrics.issuesRaised, 
      unit: "issues", 
      icon: AlertTriangle, 
      trend: "neutral",
      color: "text-warning" 
    },
    { 
      title: "Issues Resolved", 
      value: metrics.issuesResolved, 
      unit: "resolved", 
      icon: CheckCircle, 
      trend: "up",
      color: "text-success" 
    },
    { 
      title: "Avg MTTR", 
      value: metrics.avgMTTR, 
      unit: "hrs", 
      icon: Timer, 
      trend: metrics.avgMTTR <= 3 ? "up" : "down",
      color: metrics.avgMTTR <= 3 ? "text-success" : "text-warning" 
    },
    { 
      title: "MTBF", 
      value: metrics.mtbf, 
      unit: "days", 
      icon: Activity, 
      trend: metrics.mtbf >= 40 ? "up" : "down",
      color: metrics.mtbf >= 40 ? "text-success" : "text-warning" 
    },
    { 
      title: "Cue Accuracy (LJ/VJ)", 
      value: metrics.cueAccuracy, 
      unit: "%", 
      icon: Target, 
      trend: metrics.cueAccuracy >= 95 ? "up" : "down",
      color: metrics.cueAccuracy >= 95 ? "text-success" : "text-warning" 
    },
    { 
      title: "Soundcheck On-time", 
      value: metrics.soundcheckOnTimePercentage, 
      unit: "%", 
      icon: Headphones, 
      trend: metrics.soundcheckOnTimePercentage >= 90 ? "up" : "down",
      color: metrics.soundcheckOnTimePercentage >= 90 ? "text-success" : "text-warning" 
    },
    { 
      title: "Power Incidents", 
      value: metrics.powerIncidents, 
      unit: "incidents", 
      icon: Power, 
      trend: metrics.powerIncidents === 0 ? "up" : "down",
      color: metrics.powerIncidents === 0 ? "text-success" : "text-destructive" 
    },
    { 
      title: "Noise Complaints", 
      value: metrics.noiseComplaints, 
      unit: "complaints", 
      icon: Volume2, 
      trend: metrics.noiseComplaints === 0 ? "up" : "down",
      color: metrics.noiseComplaints === 0 ? "text-success" : "text-destructive" 
    },
    { 
      title: "Staff Attendance", 
      value: metrics.staffAttendancePercentage, 
      unit: "%", 
      icon: Users, 
      trend: metrics.staffAttendancePercentage >= 90 ? "up" : "down",
      color: metrics.staffAttendancePercentage >= 90 ? "text-success" : "text-warning" 
    },
    { 
      title: "Training Hours", 
      value: metrics.trainingHours, 
      unit: "hrs", 
      icon: GraduationCap, 
      trend: "up",
      color: "text-primary" 
    },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-success" />;
      case "down":
        return <TrendingDown className="h-3 w-3 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {kpiData.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <Card key={index} className="bg-gradient-card border-border/50 hover:border-primary/30 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground flex items-center gap-1">
                <Icon className="h-3 w-3" />
                {kpi.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-end justify-between">
                <div>
                  <div className={`text-xl font-bold ${kpi.color}`}>
                    {kpi.value}
                    <span className="text-xs text-muted-foreground ml-1">
                      {kpi.unit}
                    </span>
                  </div>
                </div>
                {getTrendIcon(kpi.trend)}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}