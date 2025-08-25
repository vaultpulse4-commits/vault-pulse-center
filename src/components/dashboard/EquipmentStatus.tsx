import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock, Zap } from "lucide-react";

interface Equipment {
  id: string;
  name: string;
  type: "lighting" | "sound" | "projector" | "stage";
  status: "online" | "maintenance" | "offline" | "warning";
  lastChecked: string;
  power?: number;
}

const mockEquipment: Equipment[] = [
  { id: "1", name: "Main Sound System", type: "sound", status: "online", lastChecked: "2 min ago", power: 85 },
  { id: "2", name: "LED Wall Array", type: "lighting", status: "online", lastChecked: "1 min ago", power: 92 },
  { id: "3", name: "Stage Fog Machine", type: "stage", status: "maintenance", lastChecked: "15 min ago" },
  { id: "4", name: "Projection Mapping", type: "projector", status: "warning", lastChecked: "5 min ago", power: 67 },
  { id: "5", name: "Laser Light Show", type: "lighting", status: "online", lastChecked: "30 sec ago", power: 95 },
  { id: "6", name: "Monitor Speakers", type: "sound", status: "offline", lastChecked: "1 hr ago" },
];

const getStatusIcon = (status: Equipment["status"]) => {
  switch (status) {
    case "online":
      return <CheckCircle className="h-4 w-4 text-success" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-warning" />;
    case "maintenance":
      return <Clock className="h-4 w-4 text-warning" />;
    case "offline":
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
  }
};

const getStatusVariant = (status: Equipment["status"]) => {
  switch (status) {
    case "online":
      return "default";
    case "warning":
      return "secondary";
    case "maintenance":
      return "outline";
    case "offline":
      return "destructive";
    default:
      return "default";
  }
};

export function EquipmentStatus() {
  const onlineCount = mockEquipment.filter(eq => eq.status === "online").length;
  const totalCount = mockEquipment.length;

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Equipment Status
          <Badge variant="outline" className="ml-auto">
            {onlineCount}/{totalCount} Online
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockEquipment.map((equipment) => (
          <div
            key={equipment.id}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              {getStatusIcon(equipment.status)}
              <div>
                <p className="font-medium text-foreground">{equipment.name}</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {equipment.type} • {equipment.lastChecked}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {equipment.power && (
                <span className="text-sm text-muted-foreground">
                  {equipment.power}%
                </span>
              )}
              <Badge variant={getStatusVariant(equipment.status)}>
                {equipment.status}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}