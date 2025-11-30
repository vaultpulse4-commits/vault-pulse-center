import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useVaultStore } from "@/store/vaultStore";
import { useToast } from "@/hooks/use-toast";
import { Wrench, Clock, DollarSign, TrendingUp, AlertTriangle, Plus, Edit3, Trash2, Camera, Upload, Loader2, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { usePermission } from "@/lib/permissions";
import { formatDate } from "@/lib/dateUtils";

// Helper to format status for display
const formatStatus = (status: string) => {
  return status.replace(/_/g, ' ');
};

export function MaintenanceLogsTab() {
  const { selectedCity } = useVaultStore();
  const { toast } = useToast();
  const canViewMaintenance = usePermission('view:maintenance');
  const canEditMaintenance = usePermission('edit:maintenance');
  const canViewIncidents = usePermission('view:incidents');
  const canCreateIncidents = usePermission('create:incidents');
  
  const [maintenanceLogs, setMaintenanceLogs] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [crewMembers, setCrewMembers] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingIncidents, setLoadingIncidents] = useState(true);
  
  const [isNewLogOpen, setIsNewLogOpen] = useState(false);
  const [isNewIncidentOpen, setIsNewIncidentOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<any>(null);
  const [editingIncident, setEditingIncident] = useState<any>(null);
  const [incidentLogs, setIncidentLogs] = useState<{[key: string]: string[]}>({});
  const [newIncidentLog, setNewIncidentLog] = useState('');
  const [addingLogTo, setAddingLogTo] = useState<string | null>(null);
  
  const [newLog, setNewLog] = useState({
    equipmentId: '',
    type: 'Preventive' as const,
    issue: '',
    status: 'Scheduled' as const,
    mttr: null as number | null,
    cost: 0,
    parts: [] as string[],
    date: new Date(),
    technicianId: '',
    supplierId: '',
    notes: '',
    photo: ''
  });
  
  const [newIncident, setNewIncident] = useState({
    type: 'Audio' as const,
    description: '',
    rootCause: '',
    prevention: '',
    impact: '',
    date: new Date()
  });
  
  const [newPart, setNewPart] = useState('');

  // Load data from API
  useEffect(() => {
    loadMaintenanceLogs();
    loadIncidents();
    loadCrewMembers();
    loadEquipment();
    loadSuppliers();
  }, [selectedCity]);

  const loadEquipment = async () => {
    try {
      const data = await api.equipment.getAll(selectedCity);
      setEquipment(data);
    } catch (error) {
      console.error('Failed to load equipment:', error);
    }
  };

  const loadSuppliers = async () => {
    try {
      const data = await api.suppliers.getAll(selectedCity);
      setSuppliers(data);
    } catch (error: any) {
      console.error('Failed to load suppliers:', error);
    }
  };

  const loadMaintenanceLogs = async () => {
    if (!canViewMaintenance) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const data = await api.maintenance.getAll(selectedCity);
      
      // Sort by date (newest first) for better historical view
      const sortedData = data.sort((a: any, b: any) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      setMaintenanceLogs(sortedData);
      
      console.log(`Loaded ${sortedData.length} maintenance logs for ${selectedCity}`);
    } catch (error: any) {
      console.error('Failed to load maintenance logs:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load maintenance logs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadIncidents = async () => {
    if (!canViewIncidents) {
      setLoadingIncidents(false);
      return;
    }
    
    try {
      setLoadingIncidents(true);
      const data = await api.incidents.getAll(selectedCity);
      
      // Sort by date (newest first) for chronological timeline view
      const sortedIncidents = data.sort((a: any, b: any) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      setIncidents(sortedIncidents);
      
      console.log(`Loaded ${sortedIncidents.length} incidents for ${selectedCity}`);
    } catch (error: any) {
      console.error('Failed to load incidents:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load incidents",
        variant: "destructive"
      });
    } finally {
      setLoadingIncidents(false);
    }
  };

  const loadCrewMembers = async () => {
    try {
      const data = await api.crew.getAll(selectedCity);
      // Load all crew members, not just engineers
      setCrewMembers(data);
    } catch (error: any) {
      console.error('Failed to load crew members:', error);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'In_Progress': return 'secondary';
      case 'Scheduled': return 'outline';
      default: return 'outline';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'Preventive' ? 'text-success' : 'text-warning';
  };

  const handleCreateLog = async () => {
    if (!canEditMaintenance) {
      toast({ title: "Error", description: "You don't have permission to create maintenance logs", variant: "destructive" });
      return;
    }
    
    if (!newLog.issue) {
      toast({ title: "Error", description: "Issue description is required", variant: "destructive" });
      return;
    }
    
    try {
      // Convert Date to ISO string
      const { date, ...restLog } = newLog;
      const logData = {
        ...restLog,
        date: date.toISOString(),
        cost: newLog.cost || 0,
        city: selectedCity
      };
      
      console.log('Sending maintenance log data:', logData);
      await api.maintenance.create(logData);
      
      setNewLog({
        equipmentId: '', type: 'Preventive', issue: '', description: '', status: 'Scheduled',
        mttr: null, cost: 0, parts: [], date: new Date(), technicianId: '', supplierId: '', notes: '', photo: ''
      });
      setIsNewLogOpen(false);
      
      toast({ title: "Success", description: "Maintenance log created successfully" });
      loadMaintenanceLogs();
    } catch (error: any) {
      console.error('Failed to create maintenance log:', error);
      toast({ 
        title: "Error", 
        description: error.message || "Failed to create maintenance log", 
        variant: "destructive" 
      });
    }
  };

  const handleCreateIncident = async () => {
    if (!canCreateIncidents) {
      toast({ title: "Error", description: "You don't have permission to log incidents", variant: "destructive" });
      return;
    }
    
    if (!newIncident.description || !newIncident.type) {
      toast({ title: "Error", description: "Type and description are required", variant: "destructive" });
      return;
    }
    
    try {
      // Convert Date to ISO string
      const { date, ...restIncident } = newIncident;
      const incidentData = {
        ...restIncident,
        date: date.toISOString(),
        city: selectedCity
      };
      
      console.log('Sending incident data:', incidentData);
      await api.incidents.create(incidentData);
      
      setNewIncident({
        type: 'Audio', description: '', rootCause: '', prevention: '', impact: '', date: new Date()
      });
      setIsNewIncidentOpen(false);
      
      toast({ title: "Success", description: "Incident logged successfully" });
      loadIncidents();
    } catch (error: any) {
      console.error('Failed to create incident:', error);
      toast({ 
        title: "Error", 
        description: error.message || "Failed to log incident", 
        variant: "destructive" 
      });
    }
  };

  const handleUpdateLog = async (id: string, updates: any) => {
    if (!canEditMaintenance) {
      toast({ title: "Error", description: "You don't have permission to update maintenance logs", variant: "destructive" });
      return;
    }
    
    try {
      await api.maintenance.update(id, updates);
      toast({ title: "Success", description: "Maintenance log updated" });
      loadMaintenanceLogs();
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to update maintenance log", 
        variant: "destructive" 
      });
    }
  };

  const handleDeleteLog = async (id: string) => {
    if (!canEditMaintenance) {
      toast({ title: "Error", description: "You don't have permission to delete maintenance logs", variant: "destructive" });
      return;
    }
    
    if (!confirm('Are you sure you want to delete this maintenance log?')) {
      return;
    }
    
    try {
      await api.maintenance.delete(id);
      toast({ title: "Success", description: "Maintenance log deleted" });
      loadMaintenanceLogs();
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to delete maintenance log", 
        variant: "destructive" 
      });
    }
  };

  const handleEditLog = (log: any) => {
    setEditingLog(log);
    setNewLog({
      equipmentId: log.equipmentId || '',
      type: log.type,
      issue: log.issue,
      status: log.status,
      mttr: log.mttr,
      cost: log.cost,
      parts: log.parts || [],
      date: new Date(log.date),
      technicianId: log.technicianId || '',
      supplierId: log.supplierId || '',
      notes: log.notes || '',
      photo: log.photo || ''
    });
    setIsNewLogOpen(true);
  };

  const handleSaveLog = async () => {
    if (!canEditMaintenance) {
      toast({ title: "Error", description: "You don't have permission to edit maintenance logs", variant: "destructive" });
      return;
    }
    
    if (!newLog.issue) {
      toast({ title: "Error", description: "Issue description is required", variant: "destructive" });
      return;
    }
    
    try {
      const { date, equipmentId, technicianId, ...restLog } = newLog;
      const logData: any = {
        ...restLog,
        date: date.toISOString(),
        cost: newLog.cost || 0,
        city: selectedCity
      };
      
      // Only include equipmentId and technicianId if they have values
      if (equipmentId) {
        logData.equipmentId = equipmentId;
      }
      if (technicianId) {
        logData.technicianId = technicianId;
      }
      
      console.log('Sending maintenance log data:', logData);
      
      if (editingLog) {
        await api.maintenance.update(editingLog.id, logData);
        toast({ title: "Success", description: "Maintenance log updated successfully" });
      } else {
        await api.maintenance.create(logData);
        toast({ title: "Success", description: "Maintenance log created successfully" });
      }
      
      setNewLog({
        equipmentId: '', type: 'Preventive', issue: '', status: 'Scheduled',
        mttr: null, cost: 0, parts: [], date: new Date(), technicianId: '', supplierId: '', notes: '', photo: ''
      });
      setEditingLog(null);
      setIsNewLogOpen(false);
      loadMaintenanceLogs();
    } catch (error: any) {
      console.error('Failed to save maintenance log:', error);
      toast({ 
        title: "Error", 
        description: error.message || "Failed to save maintenance log", 
        variant: "destructive" 
      });
    }
  };

  const handleDeleteIncident = async (id: string) => {
    if (!canCreateIncidents) {
      toast({ title: "Error", description: "You don't have permission to delete incidents", variant: "destructive" });
      return;
    }
    
    if (!confirm('Are you sure you want to delete this incident?')) {
      return;
    }
    
    try {
      await api.incidents.delete(id);
      toast({ title: "Success", description: "Incident deleted" });
      loadIncidents();
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to delete incident", 
        variant: "destructive" 
      });
    }
  };

  const handleEditIncident = (incident: any) => {
    setEditingIncident(incident);
    setNewIncident({
      type: incident.type,
      description: incident.description,
      rootCause: incident.rootCause || '',
      prevention: incident.prevention || '',
      impact: incident.impact || '',
      date: new Date(incident.date)
    });
    setIsNewIncidentOpen(true);
  };

  const handleSaveIncident = async () => {
    if (!canCreateIncidents) {
      toast({ title: "Error", description: "You don't have permission to save incidents", variant: "destructive" });
      return;
    }
    
    if (!newIncident.description || !newIncident.type) {
      toast({ title: "Error", description: "Type and description are required", variant: "destructive" });
      return;
    }
    
    try {
      const { date, ...restIncident } = newIncident;
      const incidentData = {
        ...restIncident,
        date: date.toISOString(),
        city: selectedCity
      };
      
      if (editingIncident) {
        await api.incidents.update(editingIncident.id, incidentData);
        toast({ title: "Success", description: "Incident updated successfully" });
      } else {
        await api.incidents.create(incidentData);
        toast({ title: "Success", description: "Incident logged successfully" });
      }
      
      setNewIncident({
        type: 'Audio', description: '', rootCause: '', prevention: '', impact: '', date: new Date()
      });
      setEditingIncident(null);
      setIsNewIncidentOpen(false);
      loadIncidents();
    } catch (error: any) {
      console.error('Failed to save incident:', error);
      toast({ 
        title: "Error", 
        description: error.message || "Failed to save incident", 
        variant: "destructive" 
      });
    }
  };

  const handleAddIncidentLog = (incidentId: string) => {
    if (newIncidentLog.trim()) {
      const timestamp = new Date().toLocaleString('id-ID');
      const logEntry = `[${timestamp}] ${newIncidentLog.trim()}`;
      
      setIncidentLogs(prev => ({
        ...prev,
        [incidentId]: [...(prev[incidentId] || []), logEntry]
      }));
      
      setNewIncidentLog('');
      setAddingLogTo(null);
      toast({ title: "Success", description: "Log entry added" });
    }
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size must be less than 2MB",
        variant: "destructive"
      });
      return;
    }
    
    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewLog({ ...newLog, photo: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  if (!canViewMaintenance) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-2">
          <AlertTriangle className="h-12 w-12 mx-auto text-destructive" />
          <p className="text-muted-foreground">You don't have permission to view maintenance logs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Maintenance & Logs - {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}</h3>
        <div className="flex gap-2">
          {canEditMaintenance && (
            <Dialog open={isNewLogOpen} onOpenChange={setIsNewLogOpen}>
              <DialogTrigger asChild>
                <Button variant="default">
                  <Wrench className="h-4 w-4 mr-2" />
                  New Work Order
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingLog ? 'Edit Work Order' : 'Create New Work Order'}</DialogTitle>
                <DialogDescription>
                  {editingLog ? 'Update' : 'Create a new'} maintenance work order for equipment in {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="equipmentId">Equipment (Optional)</Label>
                    <Select value={newLog.equipmentId || 'none'} onValueChange={(value) => setNewLog({...newLog, equipmentId: value === 'none' ? '' : value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select equipment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Equipment</SelectItem>
                        {equipment.map((eq) => (
                          <SelectItem key={eq.id} value={eq.id}>{eq.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                        <SelectValue>
                          {formatStatus(newLog.status)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                        <SelectItem value="In_Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="technicianId">Technician (Optional)</Label>
                    <Select value={newLog.technicianId || 'none'} onValueChange={(value) => setNewLog({...newLog, technicianId: value === 'none' ? '' : value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select technician" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Technician</SelectItem>
                        {crewMembers.map((tech) => (
                          <SelectItem key={tech.id} value={tech.id}>{tech.name} - {tech.role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplierId">Supplier (Optional)</Label>
                    <Select value={newLog.supplierId || undefined} onValueChange={(value) => setNewLog({...newLog, supplierId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name} {supplier.code ? `(${supplier.code})` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          {format(newLog.date, "PPP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={newLog.date}
                          onSelect={(date) => date && setNewLog({...newLog, date})}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
                  <div className="space-y-2">
                    <Label htmlFor="mttr">MTTR (Hours)</Label>
                    <Input
                      id="mttr"
                      type="number"
                      step="0.1"
                      value={newLog.mttr || ''}
                      onChange={(e) => setNewLog({...newLog, mttr: e.target.value ? parseFloat(e.target.value) : null})}
                      placeholder="Mean Time To Repair"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issue">Issue/Task *</Label>
                  <Input
                    id="issue"
                    value={newLog.issue}
                    onChange={(e) => setNewLog({...newLog, issue: e.target.value})}
                    placeholder="Brief summary of issue or task"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newLog.notes}
                    onChange={(e) => setNewLog({...newLog, notes: e.target.value})}
                    placeholder="Additional notes or observations"
                    rows={2}
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
                  <Label>Upload Photo</Label>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="cursor-pointer"
                    />
                    {newLog.photo && (
                      <div className="relative">
                        <img src={newLog.photo} alt="Preview" className="w-full h-48 object-cover rounded border" />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => setNewLog({...newLog, photo: ''})}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => {
                  setIsNewLogOpen(false);
                  setEditingLog(null);
                  setNewLog({
                    equipmentId: '', type: 'Preventive', issue: '', status: 'Scheduled',
                    mttr: null, cost: 0, parts: [], date: new Date(), technicianId: '', notes: '', photo: ''
                  });
                }}>Cancel</Button>
                <Button onClick={handleSaveLog}>{editingLog ? 'Update' : 'Create'} Work Order</Button>
              </div>
            </DialogContent>
          </Dialog>
          )}
          
          {canCreateIncidents && (
            <Dialog open={isNewIncidentOpen} onOpenChange={setIsNewIncidentOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Log Incident
                </Button>
              </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingIncident ? 'Edit Incident' : 'Log New Incident'}</DialogTitle>
                <DialogDescription>
                  {editingIncident ? 'Update' : 'Record'} an incident that occurred in {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}
                </DialogDescription>
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
                    <Label htmlFor="incident-date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="incident-date"
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          {format(newIncident.date, "PPP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={newIncident.date}
                          onSelect={(date) => date && setNewIncident({...newIncident, date})}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
                <Button variant="outline" onClick={() => {
                  setIsNewIncidentOpen(false);
                  setEditingIncident(null);
                  setNewIncident({
                    type: 'Audio', description: '', rootCause: '', prevention: '', impact: '', date: new Date()
                  });
                }}>Cancel</Button>
                <Button onClick={handleSaveIncident}>{editingIncident ? 'Update' : 'Log'} Incident</Button>
              </div>
            </DialogContent>
          </Dialog>
          )}
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
                    <div className="text-lg font-bold">
                      {maintenanceLogs.filter(log => log.mttr).length > 0 
                        ? (maintenanceLogs
                            .filter(log => log.mttr)
                            .reduce((sum, log) => sum + (log.mttr || 0), 0) / 
                           maintenanceLogs.filter(log => log.mttr).length
                          ).toFixed(1)
                        : '0'} hrs
                    </div>
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
                    <div className="text-lg font-bold">
                      {maintenanceLogs.filter(log => {
                        const logDate = new Date(log.date);
                        const today = new Date();
                        const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
                        return logDate >= weekStart;
                      }).length} Orders
                    </div>
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
                    <div className="text-lg font-bold">
                      {(maintenanceLogs.reduce((sum, log) => sum + (log.cost || 0), 0) / 1000000).toFixed(1)}M IDR
                    </div>
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
                    <div className="text-lg font-bold">
                      {maintenanceLogs.length > 0
                        ? Math.round((maintenanceLogs.filter(log => log.type === 'Preventive').length / maintenanceLogs.length) * 100)
                        : 0}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Work Orders */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : maintenanceLogs.length === 0 ? (
            <Card className="bg-gradient-card border-border/50">
              <CardContent className="py-12">
                <div className="text-center space-y-2">
                  <Wrench className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">No maintenance logs found for {selectedCity}</p>
                  {canEditMaintenance && (
                    <Button variant="outline" onClick={() => setIsNewLogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Work Order
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
            {maintenanceLogs.map((order) => (
              <Card key={order.id} className="bg-gradient-card border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-primary" />
                      {order.equipment?.name || order.issue}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getTypeColor(order.type)}>
                        {order.type}
                      </Badge>
                      <Badge variant={getStatusVariant(order.status)}>
                        {formatStatus(order.status)}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Created: {formatDate(order.createdAt || order.date)} • 
                    Updated: {formatDate(order.updatedAt || order.date)}
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="text-sm">
                    <strong>Issue:</strong> {order.issue}
                  </div>
                  {order.notes && (
                    <div className="text-sm">
                      <strong>Notes:</strong> {order.notes}
                    </div>
                  )}
                  {order.photo && (
                    <div>
                      <img src={order.photo} alt="Maintenance" className="w-full max-w-md h-48 object-cover rounded border" />
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Date</div>
                      <div className="font-medium">{formatDate(order.date)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Technician</div>
                      <div className="font-medium">{order.technician?.name || 'Not assigned'}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">MTTR</div>
                      <div className="font-medium">
                        {order.mttr 
                          ? `${order.mttr}h` 
                          : (order.status === 'Completed' ? 'Not recorded' : 'In progress')
                        }
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
                  
                  {canEditMaintenance && (
                    <div className="flex gap-2 pt-4 border-t border-border/30">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUpdateLog(order.id, { 
                          status: order.status === 'Completed' ? 'In_Progress' : 'Completed' 
                        })}
                      >
                        {order.status === 'Completed' ? 'Reopen' : 'Mark Complete'}
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => handleEditLog(order)}>
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
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          )}
        </TabsContent>
        
        <TabsContent value="incidents" className="space-y-4 mt-6">
          {loadingIncidents ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !canViewIncidents ? (
            <Card className="bg-gradient-card border-border/50">
              <CardContent className="py-12">
                <div className="text-center space-y-2">
                  <AlertTriangle className="h-12 w-12 mx-auto text-destructive" />
                  <p className="text-muted-foreground">You don't have permission to view incidents</p>
                </div>
              </CardContent>
            </Card>
          ) : incidents.length === 0 ? (
            <Card className="bg-gradient-card border-border/50">
              <CardContent className="py-12">
                <div className="text-center space-y-2">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">No incidents logged for {selectedCity}</p>
                  {canCreateIncidents && (
                    <Button variant="outline" onClick={() => setIsNewIncidentOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Log First Incident
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
            {incidents.map((incident) => (
            <Card key={incident.id} className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  {incident.type} Incident
                  <Badge variant="outline" className="ml-auto text-xs">
                    {formatDate(incident.date)}
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
                
                {/* Timeline Log Section */}
                <div className="border-t border-border/30 pt-3 mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-muted-foreground">Timeline Log:</div>
                    {canCreateIncidents && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAddingLogTo(addingLogTo === incident.id ? null : incident.id)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Log
                      </Button>
                    )}
                  </div>
                  
                  {addingLogTo === incident.id && (
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newIncidentLog}
                        onChange={(e) => setNewIncidentLog(e.target.value)}
                        placeholder="Add timeline entry..."
                        onKeyPress={(e) => e.key === 'Enter' && handleAddIncidentLog(incident.id)}
                      />
                      <Button size="sm" onClick={() => handleAddIncidentLog(incident.id)}>
                        Add
                      </Button>
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    {(incidentLogs[incident.id] || []).length === 0 ? (
                      <div className="text-xs text-muted-foreground italic">No timeline entries yet</div>
                    ) : (
                      (incidentLogs[incident.id] || []).map((log, idx) => (
                        <div key={idx} className="text-xs bg-background/50 p-2 rounded border border-border/30">
                          {log}
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                {canCreateIncidents && (
                  <div className="flex gap-2 pt-3 border-t border-border/30">
                    <Button variant="secondary" size="sm" onClick={() => handleEditIncident(incident)}>
                      <Edit3 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteIncident(incident.id)}>
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}