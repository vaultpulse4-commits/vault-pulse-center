import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
}

const quickActions: QuickAction[] = [
  {
    id: "1",
    title: "Emergency Stop",
    description: "Stop all equipment immediately",
    icon: <AlertTriangle className="h-4 w-4" />,
    variant: "destructive",
    urgent: true
  },
  {
    id: "2",
    title: "System Restart",
    description: "Restart audio/visual systems",
    icon: <RefreshCw className="h-4 w-4" />,
    variant: "outline"
  },
  {
    id: "3",
    title: "Lighting Preset",
    description: "Load event lighting configuration",
    icon: <Zap className="h-4 w-4" />,
    variant: "default"
  },
  {
    id: "4",
    title: "Sound Check",
    description: "Run automated sound system test",
    icon: <Volume2 className="h-4 w-4" />,
    variant: "secondary"
  },
  {
    id: "5",
    title: "Equipment Check",
    description: "Start full equipment diagnostics",
    icon: <Settings className="h-4 w-4" />,
    variant: "outline"
  },
  {
    id: "6",
    title: "Maintenance Log",
    description: "View recent maintenance records",
    icon: <FileText className="h-4 w-4" />,
    variant: "outline"
  }
];

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
                className={`h-auto p-4 flex flex-col items-start text-left relative ${
                  action.urgent ? "shadow-glow-accent" : ""
                }`}
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
              className="p-3 rounded-lg bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors"
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