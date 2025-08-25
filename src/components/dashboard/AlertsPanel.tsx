import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/store/dashboardStore";
import { AlertTriangle, Bell, CheckCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AlertsPanel() {
  const { alerts, acknowledgeAlert, acknowledgeAllAlerts } = useDashboardStore();
  const { toast } = useToast();

  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);

  const getAlertIcon = (type: "critical" | "warning" | "info") => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "info":
        return <Bell className="h-4 w-4 text-primary" />;
    }
  };

  const getAlertVariant = (type: "critical" | "warning" | "info") => {
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

  const handleAcknowledge = (id: string) => {
    acknowledgeAlert(id);
    toast({
      title: "Alert Acknowledged",
      description: "Alert has been marked as acknowledged",
    });
  };

  const handleAcknowledgeAll = () => {
    acknowledgeAllAlerts();
    toast({
      title: "All Alerts Acknowledged",
      description: `${unacknowledgedAlerts.length} alerts have been acknowledged`,
    });
  };

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-warning" />
          System Alerts
          {unacknowledgedAlerts.length > 0 && (
            <Badge variant="destructive" className="ml-auto animate-pulse">
              {unacknowledgedAlerts.length} New
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
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
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 hover:bg-destructive/20"
                    onClick={() => handleAcknowledge(alert.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {unacknowledgedAlerts.length > 0 && (
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={handleAcknowledgeAll}
          >
            Acknowledge All Alerts ({unacknowledgedAlerts.length})
          </Button>
        )}

        {alerts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No alerts at this time</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}