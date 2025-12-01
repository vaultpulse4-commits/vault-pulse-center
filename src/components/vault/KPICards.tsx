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
      title: "Power Incidents", 
      value: metrics.powerIncidents, 
      unit: "incidents", 
      icon: Power, 
      trend: metrics.powerIncidents === 0 ? "up" : "down",
      color: metrics.powerIncidents === 0 ? "text-success" : "text-destructive" 
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
      {kpiData.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <Card key={index} className="bg-gradient-card border-border/50 hover:border-primary/30 transition-colors h-full">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 line-clamp-2">
                <Icon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>{kpi.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-end justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className={`text-lg sm:text-xl lg:text-2xl font-bold ${kpi.color} truncate`}>
                    {kpi.value}
                    <span className="text-xs sm:text-sm text-muted-foreground ml-1">
                      {kpi.unit}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {getTrendIcon(kpi.trend)}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}