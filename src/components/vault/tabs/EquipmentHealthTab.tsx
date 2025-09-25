import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useVaultStore, EquipmentArea, EquipmentStatus } from "@/store/vaultStore";
import { useState } from "react";
import { Zap, Filter, Calendar, Cpu, Clock, RotateCcw, Plus, Upload, Camera } from "lucide-react";

export function EquipmentHealthTab() {
  const { selectedCity, equipment, updateEquipmentStatus } = useVaultStore();
  const [filterArea, setFilterArea] = useState<EquipmentArea | 'all'>('all');
  const [isAddEquipmentOpen, setIsAddEquipmentOpen] = useState(false);
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    area: 'FOH' as EquipmentArea,
    firmware: '',
    hoursUsed: 0
  });
  
  const cityEquipment = equipment.filter(eq => eq.city === selectedCity);
  const filteredEquipment = filterArea === 'all' 
    ? cityEquipment 
    : cityEquipment.filter(eq => eq.area === filterArea);

  const getStatusColor = (status: EquipmentStatus) => {
    switch (status) {
      case 'Ready': return 'text-success';
      case 'Degraded': return 'text-warning';
      case 'OOS': return 'text-destructive';
      case 'In-Transit': return 'text-primary';
      case 'Spare': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusVariant = (status: EquipmentStatus) => {
    switch (status) {
      case 'Ready': return 'default';
      case 'Degraded': return 'secondary';
      case 'OOS': return 'destructive';
      case 'In-Transit': return 'outline';
      case 'Spare': return 'outline';
      default: return 'outline';
    }
  };

  const isMaintenanceDue = (nextDue: string) => {
    const due = new Date(nextDue);
    const now = new Date();
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 2;
  };

  const areas: (EquipmentArea | 'all')[] = ['all', 'FOH', 'booth', 'stage', 'DJ pit', 'LED wall', 'dimmer room', 'amp rack', 'power'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Equipment Health - {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}</h3>
        <div className="flex items-center gap-2">
          <Dialog open={isAddEquipmentOpen} onOpenChange={setIsAddEquipmentOpen}>
            <DialogTrigger asChild>
              <Button variant="default">
                <Plus className="h-4 w-4 mr-2" />
                Add Equipment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Equipment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="equipName">Equipment Name</Label>
                  <Input
                    id="equipName"
                    value={newEquipment.name}
                    onChange={(e) => setNewEquipment(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., CDJ 3000 #3"
                  />
                </div>
                <div>
                  <Label htmlFor="equipArea">Area</Label>
                  <Select value={newEquipment.area} onValueChange={(value) => setNewEquipment(prev => ({ ...prev, area: value as EquipmentArea }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.filter(area => area !== 'all').map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="equipFirmware">Firmware Version</Label>
                  <Input
                    id="equipFirmware"
                    value={newEquipment.firmware}
                    onChange={(e) => setNewEquipment(prev => ({ ...prev, firmware: e.target.value }))}
                    placeholder="e.g., v2.1.4"
                  />
                </div>
                <div>
                  <Label htmlFor="equipHours">Hours Used</Label>
                  <Input
                    id="equipHours"
                    type="number"
                    value={newEquipment.hoursUsed}
                    onChange={(e) => setNewEquipment(prev => ({ ...prev, hoursUsed: Number(e.target.value) }))}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Upload Photos & Videos</Label>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Camera className="h-4 w-4 mr-2" />
                      Upload Photos
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Videos
                    </Button>
                  </div>
                </div>
                <Button onClick={() => {
                  // Add equipment logic here
                  setIsAddEquipmentOpen(false);
                  setNewEquipment({ name: '', area: 'FOH', firmware: '', hoursUsed: 0 });
                }} className="w-full">
                  Add Equipment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filterArea} onValueChange={(value) => setFilterArea(value as EquipmentArea | 'all')}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {areas.map((area) => (
                <SelectItem key={area} value={area}>
                  {area === 'all' ? 'All Areas' : area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredEquipment.map((eq) => (
          <Card key={eq.id} className="bg-gradient-card border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  {eq.name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{eq.area}</Badge>
                  <Badge variant={getStatusVariant(eq.status)} className={getStatusColor(eq.status)}>
                    {eq.status}
                  </Badge>
                  {isMaintenanceDue(eq.nextDue) && (
                    <Badge variant="destructive" className="animate-pulse">
                      Maintenance Due
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <div>
                    <div className="text-muted-foreground">Last Inspection</div>
                    <div className="font-medium">{eq.lastInspection}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-warning" />
                  <div>
                    <div className="text-muted-foreground">Next Due</div>
                    <div className={`font-medium ${isMaintenanceDue(eq.nextDue) ? 'text-destructive' : ''}`}>
                      {eq.nextDue}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Cpu className="h-3 w-3 text-muted-foreground" />
                  <div>
                    <div className="text-muted-foreground">Firmware</div>
                    <div className="font-medium">{eq.firmware}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <div>
                    <div className="text-muted-foreground">Hours Used</div>
                    <div className="font-medium">{eq.hoursUsed.toLocaleString()}h</div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4 pt-4 border-t border-border/30">
                <Select value={eq.status} onValueChange={(value) => updateEquipmentStatus(eq.id, value as EquipmentStatus)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ready">Ready</SelectItem>
                    <SelectItem value="Degraded">Degraded</SelectItem>
                    <SelectItem value="OOS">OOS</SelectItem>
                    <SelectItem value="In-Transit">In-Transit</SelectItem>
                    <SelectItem value="Spare">Spare</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="sm">
                  <RotateCcw className="h-3 w-3 mr-2" />
                  Inspect
                </Button>
                
                <Button variant="secondary" size="sm">
                  Log Maintenance
                </Button>
                
                <Button variant="outline" size="sm">
                  <Camera className="h-3 w-3 mr-2" />
                  Photos
                </Button>
                
                <Button variant="outline" size="sm">
                  <Upload className="h-3 w-3 mr-2" />
                  Videos
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}