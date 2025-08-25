import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Bell, CheckCircle, X } from "lucide-react";

interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

const mockAlerts: Alert[] = [
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
];

const getAlertIcon = (type: Alert["type"]) => {
  switch (type) {
    case "critical":
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-warning" />;
    case "info":
      return <Bell className="h-4 w-4 text-primary" />;
  }
};

const getAlertVariant = (type: Alert["type"]) => {
  switch (type) {
    case "critical":
      return "destructive";
    case "warning":
      return "secondary";
    case "info":
      return "outline";
    default:
      return "outline";
  }
};

export function AlertsPanel() {
  const unacknowledgedAlerts = mockAlerts.filter(alert => !alert.acknowledged);
  const criticalAlerts = mockAlerts.filter(alert => alert.type === "critical" && !alert.acknowledged);

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-warning" />
          System Alerts
          {unacknowledgedAlerts.length > 0 && (
            <Badge variant="destructive" className="ml-auto">
              {unacknowledgedAlerts.length} New
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-3 rounded-lg border transition-all ${
              alert.acknowledged 
                ? "bg-muted/20 border-border/30 opacity-60" 
                : alert.type === "critical"
                ? "bg-destructive/10 border-destructive/30 shadow-glow-accent"
                : "bg-muted/30 border-border/30"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                {getAlertIcon(alert.type)}
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-foreground">{alert.title}</h4>
                    <Badge variant={getAlertVariant(alert.type)} className="text-xs">
                      {alert.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{alert.timestamp}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {alert.acknowledged ? (
                  <CheckCircle className="h-4 w-4 text-success" />
                ) : (
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {unacknowledgedAlerts.length > 0 && (
          <Button variant="outline" className="w-full mt-4">
            Acknowledge All Alerts
          </Button>
        )}
      </CardContent>
    </Card>
  );
}