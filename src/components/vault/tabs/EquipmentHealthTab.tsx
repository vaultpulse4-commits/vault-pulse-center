/**
 * @deprecated This file is NOT USED anymore!
 * 
 * The active version is: EquipmentHealthTab-v2.tsx
 * Import location: src/components/vault/VaultTabs.tsx
 * 
 * This file can be safely deleted.
 * Kept temporarily for reference only.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useVaultStore, EquipmentStatus } from "@/store/vaultStore";
import { useState, useEffect } from "react";
import { Zap, Filter, Calendar, Cpu, Clock, RotateCcw, Plus, Upload, Camera, MapPin, ClipboardList, Wrench } from "lucide-react";
import { api } from "@/lib/api";
import { usePermission } from "@/lib/permissions";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/dateUtils";

interface Area {
  id: string;
  name: string;
  description: string;
  city: string | null;
  isActive: boolean;
}

interface Equipment {
  id: string;
  name: string;
  status: EquipmentStatus;
  lastInspection: string;
  nextDue: string;
  firmware: string;
  photo: string | null;
  description: string;
  areaId: string | null;
  area?: Area;
  city: string;
  createdAt: string;
  updatedAt: string;
  inspections?: Inspection[];
}

interface Inspection {
  id: string;
  equipmentId: string;
  inspector: string;
  condition: string;
  notes: string;
  issues: string[];
  date: string;
}

export function EquipmentHealthTab() {
  const { selectedCity } = useVaultStore();
  const { toast } = useToast();
  const canView = usePermission('view:equipment');
  const canEdit = usePermission('edit:equipment');
  const canDelete = usePermission('delete:equipment');
  
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterArea, setFilterArea] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddEquipmentOpen, setIsAddEquipmentOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [isInspectOpen, setIsInspectOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loadingInspections, setLoadingInspections] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    areaId: '',
    firmware: '',
    description: '',
    photo: ''
  });

  const [inspectionForm, setInspectionForm] = useState({
    inspector: '',
    condition: 'Good',
    notes: '',
    issues: ''
  });

  useEffect(() => {
    if (selectedCity) {
      loadEquipment();
      loadAreas();
    }
  }, [selectedCity]);

  const loadEquipment = async () => {
    try {
      setLoading(true);
      const data = await api.equipment.getAll(selectedCity);
      setEquipment(data);
    } catch (error: any) {
      console.error('Failed to load equipment:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load equipment",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAreas = async () => {
    try {
      const data = await api.areas.getAll();
      // Filter active areas for the selected city or city-agnostic areas
      const filtered = data.filter((area: Area) => 
        area.isActive && (!area.city || area.city === selectedCity)
      );
      setAreas(filtered);
    } catch (error: any) {
      console.error('Failed to load areas:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      areaId: '',
      firmware: '',
      description: '',
      photo: ''
    });
    setEditingEquipment(null);
  };

  const handleEdit = (equip: Equipment) => {
    setEditingEquipment(equip);
    setFormData({
      name: equip.name,
      areaId: equip.areaId || '',
      firmware: equip.firmware,
      description: equip.description || '',
      photo: equip.photo || ''
    });
    setIsAddEquipmentOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.firmware) {
      toast({
        title: "Validation Error",
        description: "Please fill in required fields: Name and Firmware",
        variant: "destructive"
      });
      return;
    }

    try {
      const payload = {
        name: formData.name,
        areaId: formData.areaId || null,
        firmware: formData.firmware,
        description: formData.description || '',
        photo: formData.photo || null,
        city: selectedCity,
        lastInspection: new Date().toISOString(),
        nextDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Ready'
      };

      if (editingEquipment) {
        await api.equipment.update(editingEquipment.id, payload);
        toast({ title: "Success", description: "Equipment updated successfully" });
      } else {
        await api.equipment.create(payload);
        toast({ title: "Success", description: "Equipment added successfully" });
      }

      resetForm();
      setIsAddEquipmentOpen(false);
      loadEquipment();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save equipment",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this equipment?')) return;

    try {
      await api.equipment.delete(id);
      toast({ title: "Success", description: "Equipment deleted successfully" });
      loadEquipment();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete equipment",
        variant: "destructive"
      });
    }
  };

  const handleInspect = (equip: Equipment) => {
    setSelectedEquipment(equip);
    setInspectionForm({
      inspector: '',
      condition: 'Good',
      notes: '',
      issues: ''
    });
    setIsInspectOpen(true);
  };

  const handleViewLogs = async (equip: Equipment) => {
    setSelectedEquipment(equip);
    setIsLogsOpen(true);
    setLoadingInspections(true);
    try {
      const data = await api.equipment.getInspections(equip.id);
      setInspections(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load inspections",
        variant: "destructive"
      });
      setInspections([]);
    } finally {
      setLoadingInspections(false);
    }
  };

  const handleRecordInspection = async () => {
    if (!selectedEquipment || !inspectionForm.inspector || !inspectionForm.notes) {
      toast({
        title: "Validation Error",
        description: "Please fill in Inspector Name and Notes",
        variant: "destructive"
      });
      return;
    }

    try {
      const issuesArray = inspectionForm.issues
        .split('\n')
        .map(i => i.trim())
        .filter(i => i.length > 0);

      await api.equipment.inspect(selectedEquipment.id, {
        inspector: inspectionForm.inspector,
        condition: inspectionForm.condition,
        notes: inspectionForm.notes,
        issues: issuesArray
      });

      toast({ title: "Success", description: "Inspection recorded successfully" });
      setIsInspectOpen(false);
      loadEquipment();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to record inspection",
        variant: "destructive"
      });
    }
  };

  const handleUpdateStatus = async (id: string, status: EquipmentStatus) => {
    try {
      await api.equipment.update(id, { status });
      toast({ title: "Success", description: "Status updated successfully" });
      loadEquipment();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready': return 'bg-success';
      case 'Degraded': return 'bg-warning';
      case 'OOS': return 'bg-destructive';
      case 'In_Transit': return 'bg-primary';
      case 'Spare': return 'bg-muted';
      default: return 'bg-muted';
    }
  };

  const isNearDue = (nextDue: string) => {
    const due = new Date(nextDue);
    const now = new Date();
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 2;
  };

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">You don't have permission to view equipment.</p>
      </div>
    );
  }

  const filteredEquipment = equipment.filter(eq => {
    const areaMatch = filterArea === 'all' || eq.areaId === filterArea;
    const statusMatch = filterStatus === 'all' || eq.status === filterStatus;
    return areaMatch && statusMatch;
  });

  const readyCount = equipment.filter(e => e.status === 'Ready').length;
  const degradedCount = equipment.filter(e => e.status === 'Degraded').length;
  const oosCount = equipment.filter(e => e.status === 'OOS').length;
  const nearDueCount = equipment.filter(e => isNearDue(e.nextDue)).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Equipment Health - {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}</h3>
        {canEdit && (
          <Dialog open={isAddEquipmentOpen} onOpenChange={(open) => { setIsAddEquipmentOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button variant="default">
                <Plus className="h-4 w-4 mr-2" />
                Add Equipment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingEquipment ? 'Edit Equipment' : 'Add New Equipment'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="equipName">Equipment Name *</Label>
                    <Input
                      id="equipName"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., CDJ 3000 #3"
                    />
                  </div>
                  <div>
                    <Label htmlFor="equipArea">Area</Label>
                    <Select 
                      value={formData.areaId} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, areaId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select area (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No Area</SelectItem>
                        {areas.map((area) => (
                          <SelectItem key={area.id} value={area.id}>
                            {area.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="equipFirmware">Firmware Version *</Label>
                    <Input
                      id="equipFirmware"
                      value={formData.firmware}
                      onChange={(e) => setFormData(prev => ({ ...prev, firmware: e.target.value }))}
                      placeholder="e.g., v2.1.4"
                    />
                  </div>
                  <div>
                    <Label htmlFor="equipPhoto">Photo URL</Label>
                    <Input
                      id="equipPhoto"
                      value={formData.photo}
                      onChange={(e) => setFormData(prev => ({ ...prev, photo: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="equipDescription">Description</Label>
                    <Textarea
                      id="equipDescription"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Optional description"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => { setIsAddEquipmentOpen(false); resetForm(); }}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit}>
                    {editingEquipment ? 'Update' : 'Create'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Zap className="h-4 w-4 mr-2 text-success" />
              Ready
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{readyCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2 text-warning" />
              Degraded
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{degradedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Cpu className="h-4 w-4 mr-2 text-destructive" />
              Out of Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{oosCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              Near Due
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{nearDueCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Label>Filter by Area</Label>
          <Select value={filterArea} onValueChange={setFilterArea}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              {areas.map((area) => (
                <SelectItem key={area.id} value={area.id}>
                  {area.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Label>Filter by Status</Label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Ready">Ready</SelectItem>
              <SelectItem value="Degraded">Degraded</SelectItem>
              <SelectItem value="OOS">Out of Service</SelectItem>
              <SelectItem value="In_Transit">In Transit</SelectItem>
              <SelectItem value="Spare">Spare</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Equipment List */}
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="text-muted-foreground">Loading equipment...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEquipment.map((equip) => (
            <Card key={equip.id} className={isNearDue(equip.nextDue) ? 'border-warning' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">{equip.name}</CardTitle>
                    <div className="flex gap-2 mt-1">
                      <Badge className={`text-xs ${getStatusColor(equip.status)}`}>
                        {equip.status.replace(/_/g, ' ')}
                      </Badge>
                      {equip.area && (
                        <Badge variant="outline" className="text-xs flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {equip.area.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Firmware:</span>
                    <span className="font-medium">{equip.firmware}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Inspection:</span>
                    <span>{formatDate(equip.lastInspection)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next Due:</span>
                    <span className={isNearDue(equip.nextDue) ? 'text-warning font-medium' : ''}>
                      {formatDate(equip.nextDue)}
                    </span>
                  </div>
                  {equip.description && (
                    <div className="pt-2 text-xs text-muted-foreground">
                      {equip.description}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {canEdit && (
                    <>
                      <Button size="sm" variant="default" onClick={() => handleInspect(equip)}>
                        <ClipboardList className="h-3 w-3 mr-1" />
                        Inspect
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(equip)}>
                        Edit
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="outline" onClick={() => handleViewLogs(equip)}>
                    <Wrench className="h-3 w-3 mr-1" />
                    Logs ({equip.inspections?.length || 0})
                  </Button>
                  {canEdit && canDelete && (
                    <Button size="sm" variant="outline" onClick={() => handleDelete(equip.id)}>
                      Delete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredEquipment.length === 0 && !loading && (
        <div className="text-center py-12 text-muted-foreground">
          No equipment found. {canEdit && 'Click "Add Equipment" to get started.'}
        </div>
      )}

      {/* Inspect Dialog */}
      <Dialog open={isInspectOpen} onOpenChange={setIsInspectOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Inspect: {selectedEquipment?.name}</DialogTitle>
            <p className="text-sm text-muted-foreground">Record equipment inspection</p>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="inspector">Inspector Name *</Label>
              <Input
                id="inspector"
                placeholder="Your name"
                value={inspectionForm.inspector}
                onChange={(e) => setInspectionForm(prev => ({ ...prev, inspector: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="condition">Condition</Label>
              <Select 
                value={inspectionForm.condition} 
                onValueChange={(value) => setInspectionForm(prev => ({ ...prev, condition: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Poor">Poor</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Notes *</Label>
              <Textarea
                id="notes"
                placeholder="Inspection notes"
                value={inspectionForm.notes}
                onChange={(e) => setInspectionForm(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="issues">Issues Found (one per line)</Label>
              <Textarea
                id="issues"
                placeholder="e.g., Scratched casing&#10;Missing rubber feet"
                value={inspectionForm.issues}
                onChange={(e) => setInspectionForm(prev => ({ ...prev, issues: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsInspectOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleRecordInspection}>
                Record Inspection
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Logs Dialog */}
      <Dialog open={isLogsOpen} onOpenChange={setIsLogsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Maintenance Logs: {selectedEquipment?.name}</DialogTitle>
            <p className="text-sm text-muted-foreground">
              View all maintenance history for this equipment
            </p>
          </DialogHeader>
          
          {loadingInspections ? (
            <div className="flex justify-center py-8">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : inspections.length === 0 ? (
            <div className="text-center py-12">
              <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">No maintenance logs found</p>
              <p className="text-sm text-muted-foreground">
                Create maintenance logs from the Maintenance Logs tab
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Showing maintenance logs and inspection records for {selectedEquipment?.name}
              </p>
              {inspections.map((inspection) => (
                <Card key={inspection.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{inspection.inspector}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(inspection.date)}</p>
                      </div>
                      <Badge variant={
                        inspection.condition === 'Good' ? 'default' :
                        inspection.condition === 'Fair' ? 'secondary' :
                        inspection.condition === 'Poor' ? 'destructive' : 'destructive'
                      }>
                        {inspection.condition}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="text-sm font-medium mb-1">Notes:</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{inspection.notes}</p>
                    </div>
                    {inspection.issues.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-1">Issues Found:</p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {inspection.issues.map((issue, idx) => (
                            <li key={idx}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
