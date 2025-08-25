import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDashboardStore } from "@/store/dashboardStore";
import { useToast } from "@/hooks/use-toast";
import { 
  Zap, 
  Settings, 
  RefreshCw, 
  AlertTriangle, 
  FileText, 
  Wrench,
  Power,
  Volume2
} from "lucide-react";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  variant: "default" | "secondary" | "destructive" | "outline";
  urgent?: boolean;
  action: () => void;
}

const troubleshootingTips = [
  {
    issue: "Audio Feedback",
    solution: "Lower monitor levels, check mic placement"
  },
  {
    issue: "Lighting Flicker",
    solution: "Check DMX connections, verify power supply"
  },
  {
    issue: "Fog Machine Issues",
    solution: "Check fluid levels, clean heating element"
  },
  {
    issue: "Projection Problems",
    solution: "Clean lens, check input signals, verify cables"
  }
];

export function QuickActions() {
  const { equipment, emergencyStop, restartEquipment, updateEquipmentStatus } = useDashboardStore();
  const { toast } = useToast();

  const handleEmergencyStop = () => {
    emergencyStop();
    toast({
      title: "Emergency Stop Activated",
      description: "All equipment has been stopped immediately",
      variant: "destructive"
    });
  };

  const handleSystemRestart = () => {
    equipment.forEach(eq => {
      if (eq.status === "offline") {
        restartEquipment(eq.id);
      }
    });
    toast({
      title: "System Restart Initiated",
      description: "Restarting all offline equipment",
    });
  };

  const handleLightingPreset = () => {
    const lightingEquipment = equipment.filter(eq => eq.type === "lighting");
    lightingEquipment.forEach(eq => {
      updateEquipmentStatus(eq.id, "online");
    });
    toast({
      title: "Lighting Preset Loaded",
      description: "Event lighting configuration activated",
    });
  };

  const handleSoundCheck = () => {
    const soundEquipment = equipment.filter(eq => eq.type === "sound");
    let onlineCount = 0;
    soundEquipment.forEach(eq => {
      if (eq.status === "offline") {
        updateEquipmentStatus(eq.id, "online");
        onlineCount++;
      }
    });
    toast({
      title: "Sound Check Complete",
      description: `${onlineCount > 0 ? `Activated ${onlineCount} sound systems` : 'All sound systems verified'}`,
    });
  };

  const handleEquipmentCheck = () => {
    toast({
      title: "Equipment Diagnostics Started",
      description: "Running full system diagnostics...",
    });
  };

  const handleMaintenanceLog = () => {
    toast({
      title: "Maintenance Log",
      description: "Opening maintenance records...",
    });
  };

  const quickActions: QuickAction[] = [
    {
      id: "1",
      title: "Emergency Stop",
      description: "Stop all equipment immediately",
      icon: <AlertTriangle className="h-4 w-4" />,
      variant: "destructive",
      urgent: true,
      action: handleEmergencyStop
    },
    {
      id: "2",
      title: "System Restart",
      description: "Restart audio/visual systems",
      icon: <RefreshCw className="h-4 w-4" />,
      variant: "outline",
      action: handleSystemRestart
    },
    {
      id: "3",
      title: "Lighting Preset",
      description: "Load event lighting configuration",
      icon: <Zap className="h-4 w-4" />,
      variant: "default",
      action: handleLightingPreset
    },
    {
      id: "4",
      title: "Sound Check",
      description: "Run automated sound system test",
      icon: <Volume2 className="h-4 w-4" />,
      variant: "secondary",
      action: handleSoundCheck
    },
    {
      id: "5",
      title: "Equipment Check",
      description: "Start full equipment diagnostics",
      icon: <Settings className="h-4 w-4" />,
      variant: "outline",
      action: handleEquipmentCheck
    },
    {
      id: "6",
      title: "Maintenance Log",
      description: "View recent maintenance records",
      icon: <FileText className="h-4 w-4" />,
      variant: "outline",
      action: handleMaintenanceLog
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Action Buttons */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Power className="h-5 w-5 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant={action.variant}
                className={`h-auto p-4 flex flex-col items-start text-left relative transition-all hover:scale-105 ${
                  action.urgent ? "shadow-glow-accent animate-pulse" : ""
                }`}
                onClick={action.action}
              >
                {action.urgent && (
                  <Badge variant="destructive" className="absolute top-2 right-2 text-xs">
                    URGENT
                  </Badge>
                )}
                <div className="flex items-center gap-2 mb-1">
                  {action.icon}
                  <span className="font-medium">{action.title}</span>
                </div>
                <span className="text-xs opacity-80">{action.description}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting Tips */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-secondary" />
            Quick Fixes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {troubleshootingTips.map((tip, index) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => toast({
                title: tip.issue,
                description: tip.solution,
              })}
            >
              <h4 className="font-medium text-foreground text-sm">{tip.issue}</h4>
              <p className="text-xs text-muted-foreground mt-1">{tip.solution}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}