import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useDashboardStore, Equipment } from "@/store/dashboardStore";
import { AlertTriangle, CheckCircle, Clock, Zap, Power, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const { equipment, updateEquipmentStatus, updateEquipmentPower, restartEquipment } = useDashboardStore();
  const { toast } = useToast();

  const onlineCount = equipment.filter(eq => eq.status === "online").length;
  const totalCount = equipment.length;

  const handleStatusChange = (id: string, newStatus: Equipment["status"]) => {
    updateEquipmentStatus(id, newStatus);
    const equipment_item = equipment.find(eq => eq.id === id);
    toast({
      title: "Equipment Status Updated",
      description: `${equipment_item?.name} is now ${newStatus}`,
    });
  };

  const handlePowerChange = (id: string, power: number[]) => {
    updateEquipmentPower(id, power[0]);
  };

  const handleRestart = (id: string) => {
    restartEquipment(id);
    const equipment_item = equipment.find(eq => eq.id === id);
    toast({
      title: "Equipment Restarted",
      description: `${equipment_item?.name} has been restarted`,
    });
  };

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
        {equipment.map((equipment_item) => (
          <div
            key={equipment_item.id}
            className="p-4 rounded-lg bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(equipment_item.status)}
                <div>
                  <p className="font-medium text-foreground">{equipment_item.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {equipment_item.type} • {equipment_item.lastChecked}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {equipment_item.power !== undefined && (
                  <span className="text-sm text-muted-foreground min-w-[40px]">
                    {equipment_item.power}%
                  </span>
                )}
                <Badge variant={getStatusVariant(equipment_item.status)}>
                  {equipment_item.status}
                </Badge>
              </div>
            </div>

            {/* Power Control */}
            {equipment_item.power !== undefined && equipment_item.status !== "offline" && (
              <div className="flex items-center gap-4">
                <Power className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <Slider
                    value={[equipment_item.power]}
                    onValueChange={(value) => handlePowerChange(equipment_item.id, value)}
                    max={100}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant={equipment_item.status === "online" ? "outline" : "default"}
                size="sm"
                onClick={() => handleStatusChange(equipment_item.id, "online")}
                disabled={equipment_item.status === "online"}
              >
                Online
              </Button>
              <Button
                variant={equipment_item.status === "maintenance" ? "outline" : "secondary"}
                size="sm"
                onClick={() => handleStatusChange(equipment_item.id, "maintenance")}
                disabled={equipment_item.status === "maintenance"}
              >
                Maintenance
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRestart(equipment_item.id)}
                className="ml-auto"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Restart
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}