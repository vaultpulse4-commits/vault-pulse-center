import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wrench, Clock, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";

export function MaintenanceLogsTab() {
  const maintenanceData = [
    {
      id: 1,
      equipment: "CDJ 3000 #1",
      type: "Preventive",
      issue: "Routine cleaning and calibration",
      status: "Completed",
      mttr: 1.5,
      cost: 150000,
      parts: ["Cleaning kit", "Calibration disc"],
      date: "2025-08-25",
      technician: "Alex Chen"
    },
    {
      id: 2,
      equipment: "LED Wall Controller",
      type: "Corrective",
      issue: "Display artifacts in upper right panel",
      status: "In Progress",
      mttr: 4.2,
      cost: 850000,
      parts: ["LED Module", "Control board"],
      date: "2025-08-26",
      technician: "Jordan Kim"
    },
    {
      id: 3,
      equipment: "Void Nexus Speaker #2",
      type: "Corrective",
      issue: "Intermittent power loss",
      status: "Scheduled",
      mttr: null,
      cost: 500000,
      parts: ["Power supply unit"],
      date: "2025-08-28",
      technician: "Maya Rodriguez"
    }
  ];

  const incidents = [
    {
      id: 1,
      type: "Audio",
      description: "Speaker dropout during peak hours",
      rootCause: "Loose power connection",
      prevention: "Regular connection inspection added to checklist",
      impact: "Minimal - backup engaged automatically",
      date: "2025-08-24 23:15"
    },
    {
      id: 2,
      type: "Lighting",
      description: "Strobe malfunction during main set",
      rootCause: "Overheating due to blocked ventilation",
      prevention: "Enhanced cooling system maintenance",
      impact: "Medium - manual override used",
      date: "2025-08-23 01:30"
    }
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'In Progress': return 'secondary';
      case 'Scheduled': return 'outline';
      default: return 'outline';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'Preventive' ? 'text-success' : 'text-warning';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Maintenance & Logs</h3>
        <Button variant="outline">
          <Wrench className="h-4 w-4 mr-2" />
          New Work Order
        </Button>
      </div>

      <Tabs defaultValue="work-orders" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="work-orders">Work Orders</TabsTrigger>
          <TabsTrigger value="incidents">Incident Timeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="work-orders" className="space-y-4 mt-6">
          {/* KPI Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Avg MTTR</div>
                    <div className="text-lg font-bold">2.8 hrs</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <div>
                    <div className="text-sm text-muted-foreground">This Week</div>
                    <div className="text-lg font-bold">8 Orders</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-warning" />
                  <div>
                    <div className="text-sm text-muted-foreground">Total Cost</div>
                    <div className="text-lg font-bold">1.5M IDR</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Preventive %</div>
                    <div className="text-lg font-bold">65%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Work Orders */}
          <div className="space-y-4">
            {maintenanceData.map((order) => (
              <Card key={order.id} className="bg-gradient-card border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-primary" />
                      {order.equipment}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getTypeColor(order.type)}>
                        {order.type}
                      </Badge>
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="text-sm">
                    <strong>Issue:</strong> {order.issue}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Date</div>
                      <div className="font-medium">{order.date}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Technician</div>
                      <div className="font-medium">{order.technician}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">MTTR</div>
                      <div className="font-medium">
                        {order.mttr ? `${order.mttr}h` : 'Pending'}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Cost</div>
                      <div className="font-medium">{order.cost.toLocaleString()} IDR</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Parts Used:</div>
                    <div className="flex gap-1 flex-wrap">
                      {order.parts.map((part, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {part}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="incidents" className="space-y-4 mt-6">
          {incidents.map((incident) => (
            <Card key={incident.id} className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  {incident.type} Incident
                  <Badge variant="outline" className="ml-auto text-xs">
                    {incident.date}
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground mb-1">Description:</div>
                    <div>{incident.description}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Audience Impact:</div>
                    <div>{incident.impact}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Root Cause:</div>
                    <div>{incident.rootCause}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Prevention:</div>
                    <div>{incident.prevention}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}