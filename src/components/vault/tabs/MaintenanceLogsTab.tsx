import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVaultStore } from "@/store/vaultStore";
import { useToast } from "@/hooks/use-toast";
import { Wrench, Clock, DollarSign, TrendingUp, AlertTriangle, Plus, Edit3, Trash2, Camera, Upload } from "lucide-react";
import { useState } from "react";

export function MaintenanceLogsTab() {
  const { selectedCity, maintenanceLogs, incidents, addMaintenanceLog, updateMaintenanceLog, deleteMaintenanceLog, addIncident, crewMembers } = useVaultStore();
  const { toast } = useToast();
  
  const cityMaintenanceLogs = maintenanceLogs.filter(log => log.city === selectedCity);
  const cityIncidents = incidents.filter(incident => incident.city === selectedCity);
  const cityTechnicians = crewMembers.filter(member => member.city === selectedCity && (member.role.includes('Engineer') || member.role.includes('Technical')));
  
  const [isNewLogOpen, setIsNewLogOpen] = useState(false);
  const [isNewIncidentOpen, setIsNewIncidentOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<any>(null);
  
  const [newLog, setNewLog] = useState({
    equipment: '',
    type: 'Preventive' as const,
    issue: '',
    status: 'Scheduled' as const,
    mttr: null as number | null,
    cost: 0,
    parts: [] as string[],
    date: '',
    technician: ''
  });
  
  const [newIncident, setNewIncident] = useState({
    type: 'Audio' as const,
    description: '',
    rootCause: '',
    prevention: '',
    impact: '',
    date: ''
  });
  
  const [newPart, setNewPart] = useState('');

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

  const handleCreateLog = () => {
    if (!newLog.equipment || !newLog.issue || !newLog.technician) {
      toast({ title: "Error", description: "Equipment, issue, and technician are required", variant: "destructive" });
      return;
    }
    
    addMaintenanceLog({ ...newLog, city: selectedCity });
    setNewLog({
      equipment: '', type: 'Preventive', issue: '', status: 'Scheduled',
      mttr: null, cost: 0, parts: [], date: '', technician: ''
    });
    setIsNewLogOpen(false);
    toast({ title: "Success", description: "Maintenance log created successfully" });
  };

  const handleCreateIncident = () => {
    if (!newIncident.description || !newIncident.type) {
      toast({ title: "Error", description: "Type and description are required", variant: "destructive" });
      return;
    }
    
    addIncident({ ...newIncident, city: selectedCity });
    setNewIncident({
      type: 'Audio', description: '', rootCause: '', prevention: '', impact: '', date: ''
    });
    setIsNewIncidentOpen(false);
    toast({ title: "Success", description: "Incident logged successfully" });
  };

  const handleUpdateLog = (id: string, updates: any) => {
    updateMaintenanceLog(id, updates);
    toast({ title: "Success", description: "Maintenance log updated" });
  };

  const handleDeleteLog = (id: string) => {
    deleteMaintenanceLog(id);
    toast({ title: "Success", description: "Maintenance log deleted" });
  };

  const addPart = () => {
    if (newPart.trim()) {
      setNewLog({ ...newLog, parts: [...newLog.parts, newPart.trim()] });
      setNewPart('');
    }
  };

  const removePart = (index: number) => {
    setNewLog({ ...newLog, parts: newLog.parts.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Maintenance & Logs - {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}</h3>
        <div className="flex gap-2">
          <Dialog open={isNewLogOpen} onOpenChange={setIsNewLogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Wrench className="h-4 w-4 mr-2" />
                New Work Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Create New Work Order</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="equipment">Equipment *</Label>
                    <Input
                      id="equipment"
                      value={newLog.equipment}
                      onChange={(e) => setNewLog({...newLog, equipment: e.target.value})}
                      placeholder="Equipment name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select value={newLog.type} onValueChange={(value: any) => setNewLog({...newLog, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Preventive">Preventive</SelectItem>
                        <SelectItem value="Corrective">Corrective</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={newLog.status} onValueChange={(value: any) => setNewLog({...newLog, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="technician">Technician *</Label>
                    <Select value={newLog.technician} onValueChange={(value) => setNewLog({...newLog, technician: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select technician" />
                      </SelectTrigger>
                      <SelectContent>
                        {cityTechnicians.map((tech) => (
                          <SelectItem key={tech.id} value={tech.name}>{tech.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newLog.date}
                      onChange={(e) => setNewLog({...newLog, date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost">Cost (IDR)</Label>
                    <Input
                      id="cost"
                      type="number"
                      value={newLog.cost}
                      onChange={(e) => setNewLog({...newLog, cost: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issue">Issue Description *</Label>
                  <Textarea
                    id="issue"
                    value={newLog.issue}
                    onChange={(e) => setNewLog({...newLog, issue: e.target.value})}
                    placeholder="Describe the issue or maintenance task"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Parts Used</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newPart}
                      onChange={(e) => setNewPart(e.target.value)}
                      placeholder="Add part"
                      onKeyPress={(e) => e.key === 'Enter' && addPart()}
                    />
                    <Button type="button" onClick={addPart} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {newLog.parts.map((part, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {part}
                        <button onClick={() => removePart(index)} className="ml-1 text-destructive">×</button>
                      </Badge>
                    ))}
                  </div>
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
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsNewLogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateLog}>Create Work Order</Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isNewIncidentOpen} onOpenChange={setIsNewIncidentOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Log Incident
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log New Incident</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="incident-type">Type *</Label>
                    <Select value={newIncident.type} onValueChange={(value: any) => setNewIncident({...newIncident, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Audio">Audio</SelectItem>
                        <SelectItem value="Lighting">Lighting</SelectItem>
                        <SelectItem value="Video">Video</SelectItem>
                        <SelectItem value="Power">Power</SelectItem>
                        <SelectItem value="Safety">Safety</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="incident-date">Date & Time</Label>
                    <Input
                      id="incident-date"
                      type="datetime-local"
                      value={newIncident.date}
                      onChange={(e) => setNewIncident({...newIncident, date: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={newIncident.description}
                    onChange={(e) => setNewIncident({...newIncident, description: e.target.value})}
                    placeholder="Describe what happened"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rootCause">Root Cause</Label>
                  <Textarea
                    id="rootCause"
                    value={newIncident.rootCause}
                    onChange={(e) => setNewIncident({...newIncident, rootCause: e.target.value})}
                    placeholder="What caused the incident"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prevention">Prevention Measures</Label>
                  <Textarea
                    id="prevention"
                    value={newIncident.prevention}
                    onChange={(e) => setNewIncident({...newIncident, prevention: e.target.value})}
                    placeholder="How to prevent this in the future"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="impact">Impact</Label>
                  <Textarea
                    id="impact"
                    value={newIncident.impact}
                    onChange={(e) => setNewIncident({...newIncident, impact: e.target.value})}
                    placeholder="Impact on operations and audience"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsNewIncidentOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateIncident}>Log Incident</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
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
            {cityMaintenanceLogs.map((order) => (
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
                  
                  <div className="flex gap-2 pt-4 border-t border-border/30">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleUpdateLog(order.id, { 
                        status: order.status === 'Completed' ? 'In Progress' : 'Completed' 
                      })}
                    >
                      {order.status === 'Completed' ? 'Reopen' : 'Mark Complete'}
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Edit3 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDeleteLog(order.id)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="incidents" className="space-y-4 mt-6">
          {cityIncidents.map((incident) => (
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