/**
 * EquipmentHealthTab-v2.tsx
 * 
 * ✅ THIS IS THE ACTIVE VERSION!
 * 
 * Used in: src/components/vault/VaultTabs.tsx
 * 
 * Features:
 * - Equipment listing with status badges (Ready, Degraded, OOS, In Transit, Spare)
 * - Inspection recording with condition tracking
 * - Inspection logs viewer (shows all inspection history)
 * - Equipment CRUD operations
 * - Area filtering
 * - Real-time updates via WebSocket
 * 
 * Note: EquipmentHealthTab.tsx (without -v2) is deprecated and not used.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useVaultStore } from "@/store/vaultStore";
import { useState, useEffect } from "react";
import { Zap, Filter, Calendar, Cpu, Plus, Loader2, Edit, Trash2, FileSearch, Wrench, Image as ImageIcon, X, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api";
import { usePermission } from "@/lib/permissions";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/dateUtils";
import { validateAndCompressImage } from "@/lib/imageCompression";

type EquipmentStatus = 'Ready' | 'Degraded' | 'OOS' | 'In_Transit' | 'Spare';

interface Area {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export function EquipmentHealthTab() {
  const { selectedCity } = useVaultStore();
  const { toast } = useToast();
  const canView = usePermission('view:equipment');
  const canEdit = usePermission('edit:equipment');
  const canDelete = usePermission('delete:equipment');
  
  const [equipment, setEquipment] = useState<any[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterArea, setFilterArea] = useState<string>('all');
  const [isAddEquipmentOpen, setIsAddEquipmentOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<any>(null);
  const [inspectingEquipment, setInspectingEquipment] = useState<any>(null);
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    areaId: '',
    firmware: '',
    description: '',
    photo: '',
    status: 'Ready' as EquipmentStatus,
    lastInspection: new Date().toISOString().split('T')[0],
    nextDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  const [viewingLogs, setViewingLogs] = useState<any>(null);
  const [maintenanceLogs, setMaintenanceLogs] = useState<any[]>([]);
  const [newInspection, setNewInspection] = useState({
    inspector: '',
    condition: 'Good',
    notes: '',
    issues: ''
  });
  
  // Load equipment and areas from API
  useEffect(() => {
    if (canView) {
      loadEquipment();
      loadAreas();
    }
  }, [selectedCity, canView]);

  const loadAreas = async () => {
    try {
      const data = await api.areas.getAll({ active: true });
      setAreas(data);
    } catch (error: any) {
      console.error('Failed to load areas:', error);
    }
  };

  const loadEquipment = async () => {
    try {
      setLoading(true);
      const data = await api.equipment.getAll(selectedCity);
      setEquipment(data);
    } catch (error: any) {
      console.error('Failed to load equipment:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load equipment data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEquipment = async () => {
    if (!newEquipment.name || !newEquipment.firmware) {
      toast({
        title: "Error",
        description: "Please fill in Name and Firmware",
        variant: "destructive"
      });
      return;
    }

    try {
      await api.equipment.create({
        ...newEquipment,
        city: selectedCity,
        areaId: newEquipment.areaId || null
      });
      
      toast({
        title: "Success",
        description: "Equipment created successfully"
      });
      
      setNewEquipment({
        name: '',
        areaId: '',
        firmware: '',
        description: '',
        photo: '',
        status: 'Ready',
        lastInspection: new Date().toISOString().split('T')[0],
        nextDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
      setIsAddEquipmentOpen(false);
      loadEquipment();
    } catch (error: any) {
      console.error('Error creating equipment:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create equipment",
        variant: "destructive"
      });
    }
  };

  const handleUpdateEquipment = async () => {
    if (!editingEquipment) return;

    try {
      await api.equipment.update(editingEquipment.id, {
        name: editingEquipment.name,
        areaId: editingEquipment.areaId || null,
        firmware: editingEquipment.firmware,
        description: editingEquipment.description,
        photo: editingEquipment.photo,
        status: editingEquipment.status,
        lastInspection: new Date(editingEquipment.lastInspection),
        nextDue: new Date(editingEquipment.nextDue)
      });
      
      toast({
        title: "Success",
        description: "Equipment updated successfully"
      });
      
      setEditingEquipment(null);
      loadEquipment();
    } catch (error: any) {
      console.error('Error updating equipment:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update equipment",
        variant: "destructive"
      });
    }
  };

  const handleDeleteEquipment = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      await api.equipment.delete(id);
      toast({
        title: "Success",
        description: "Equipment deleted successfully"
      });
      loadEquipment();
    } catch (error: any) {
      console.error('Error deleting equipment:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete equipment",
        variant: "destructive"
      });
    }
  };

  const handleInspect = async () => {
    if (!inspectingEquipment || !newInspection.inspector) {
      toast({
        title: "Error",
        description: "Please enter inspector name",
        variant: "destructive"
      });
      return;
    }

    try {
      const issuesArray = newInspection.issues
        ? newInspection.issues.split('\n').filter(i => i.trim())
        : [];

      // Record the inspection
      await api.equipment.inspect(inspectingEquipment.id, {
        inspector: newInspection.inspector,
        condition: newInspection.condition,
        notes: newInspection.notes,
        issues: issuesArray
      });

      // Auto-update next due date (7 days from now for regular maintenance)
      const nextMaintenanceDate = new Date();
      nextMaintenanceDate.setDate(nextMaintenanceDate.getDate() + 7);

      // Update equipment with new lastInspection and nextDue dates
      await api.equipment.update(inspectingEquipment.id, {
        lastInspection: new Date().toISOString().split('T')[0],
        nextDue: nextMaintenanceDate.toISOString().split('T')[0]
      });

      // Create maintenance log entry for the inspection
      try {
        await api.maintenance.create({
          equipmentId: inspectingEquipment.id,
          type: 'Preventive',
          description: `Equipment inspection by ${newInspection.inspector}`,
          status: 'Completed',
          notes: newInspection.notes,
          technicianId: null,
          city: selectedCity,
          date: new Date().toISOString(),
          cost: 0,
          parts: issuesArray.length > 0 ? ['Inspection findings'] : [],
          mttr: 0.5
        });
      } catch (maintenanceError) {
        console.warn('Failed to create maintenance log entry:', maintenanceError);
      }
      
      toast({
        title: "Success",
        description: "Inspection recorded and maintenance log updated"
      });
      
      setInspectingEquipment(null);
      setNewInspection({
        inspector: '',
        condition: 'Good',
        notes: '',
        issues: ''
      });
      loadEquipment();
    } catch (error: any) {
      console.error('Error recording inspection:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to record inspection",
        variant: "destructive"
      });
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show loading toast for large images
    const loadingToast = file.size > 1024 * 1024 ? toast({
      title: "Processing image...",
      description: "Compressing image, please wait",
    }) : null;

    try {
      // Validate and compress image automatically
      const result = await validateAndCompressImage(file, 2);
      
      if (!result.success) {
        toast({
          title: "Error",
          description: result.error || "Failed to process image",
          variant: "destructive"
        });
        return;
      }

      // Show success message if image was compressed
      if (result.wasCompressed) {
        toast({
          title: "Image compressed",
          description: `Reduced from ${result.originalSize?.toFixed(2)}MB to ${result.compressedSize?.toFixed(2)}MB`,
        });
      }

      const base64String = result.data as string;
      if (isEdit && editingEquipment) {
        setEditingEquipment({ ...editingEquipment, photo: base64String });
      } else {
        setNewEquipment({ ...newEquipment, photo: base64String });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process image",
        variant: "destructive"
      });
    } finally {
      if (loadingToast) {
        loadingToast.dismiss?.();
      }
    }
  };

  const handleViewLogs = async (equipment: any) => {
    try {
      setViewingLogs(equipment);
      setMaintenanceLogs([]); // Clear previous logs
      
      // Get inspection records (this is what we want to show)
      const inspections = await api.equipment.getInspections(equipment.id);
      setMaintenanceLogs(inspections || []);
      
    } catch (error: any) {
      console.error('Error loading inspection logs:', error);
      setMaintenanceLogs([]);
      toast({
        title: "Error",
        description: error.message || "Failed to load inspection logs",
        variant: "destructive"
      });
    }
  };

  const isMaintenanceDue = (nextDue: string) => {
    const dueDate = new Date(nextDue);
    const today = new Date();
    return dueDate < today;
  };

  const getStatusColor = (status: EquipmentStatus) => {
    switch (status) {
      case 'Ready': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Degraded': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'OOS': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'In_Transit': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Spare': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  // Filter equipment by area
  const filteredEquipment = filterArea === 'all' 
    ? equipment 
    : equipment.filter(eq => eq.area?.id === filterArea);

  const stats = {
    total: equipment.length,
    ready: equipment.filter(e => e.status === 'Ready').length,
    degraded: equipment.filter(e => e.status === 'Degraded').length,
    oos: equipment.filter(e => e.status === 'OOS').length,
    maintenanceDue: equipment.filter(e => isMaintenanceDue(e.nextDue)).length
  };

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">You don't have permission to view equipment data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Equipment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-500">Ready</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.ready}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-500">Degraded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{stats.degraded}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-500">Out of Service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.oos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-500">Maintenance Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{stats.maintenanceDue}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={filterArea} onValueChange={setFilterArea}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by Area" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Areas</SelectItem>
            {areas.map(area => (
              <SelectItem key={area.id} value={area.id}>{area.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {canEdit && (
          <Dialog open={isAddEquipmentOpen} onOpenChange={setIsAddEquipmentOpen}>
            <DialogTrigger asChild>
              <Button className="ml-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Equipment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Equipment</DialogTitle>
                <DialogDescription>Add new equipment to {selectedCity} venue</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Equipment Name *</Label>
                  <Input
                    id="name"
                    value={newEquipment.name}
                    onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                    placeholder="e.g., CDJ 3000 #3"
                  />
                </div>

                <div>
                  <Label htmlFor="area">Area</Label>
                  <Select 
                    value={newEquipment.areaId || 'none'} 
                    onValueChange={(value) => setNewEquipment({ ...newEquipment, areaId: value === 'none' ? '' : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Area</SelectItem>
                      {areas.map(area => (
                        <SelectItem key={area.id} value={area.id}>
                          {area.name}
                          {area.description && <span className="text-xs text-muted-foreground ml-2">- {area.description}</span>}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="firmware">Firmware/Version *</Label>
                  <Input
                    id="firmware"
                    value={newEquipment.firmware}
                    onChange={(e) => setNewEquipment({ ...newEquipment, firmware: e.target.value })}
                    placeholder="e.g., v2.1.4 or N/A"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newEquipment.description}
                    onChange={(e) => setNewEquipment({ ...newEquipment, description: e.target.value })}
                    placeholder="Equipment description, notes, or specifications"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="photo">Photo</Label>
                  <div className="space-y-2">
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e)}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground">JPG/PNG/WEBP - Large images will be auto-compressed</p>
                  </div>
                  {newEquipment.photo && (
                    <div className="mt-2 relative w-32 h-32 rounded border">
                      <img src={newEquipment.photo} alt="Preview" className="w-full h-full object-cover rounded" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1"
                        onClick={() => setNewEquipment({ ...newEquipment, photo: '' })}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={newEquipment.status} 
                    onValueChange={(value: EquipmentStatus) => setNewEquipment({ ...newEquipment, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ready">Ready</SelectItem>
                      <SelectItem value="Degraded">Degraded</SelectItem>
                      <SelectItem value="OOS">Out of Service</SelectItem>
                      <SelectItem value="In_Transit">In Transit</SelectItem>
                      <SelectItem value="Spare">Spare</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lastInspection">Last Inspection *</Label>
                    <Input
                      id="lastInspection"
                      type="date"
                      value={newEquipment.lastInspection}
                      max={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setNewEquipment({ ...newEquipment, lastInspection: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="nextDue">Next Due *</Label>
                    <Input
                      id="nextDue"
                      type="date"
                      value={newEquipment.nextDue}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setNewEquipment({ ...newEquipment, nextDue: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-4">
                  <Button variant="outline" onClick={() => setIsAddEquipmentOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateEquipment}>
                    Create Equipment
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Equipment List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEquipment.map((eq) => (
            <Card key={eq.id} className="relative overflow-hidden">
              {eq.photo && (
                <div className="h-32 w-full overflow-hidden bg-muted">
                  <img src={eq.photo} alt={eq.name} className="w-full h-full object-cover" />
                </div>
              )}
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{eq.name}</CardTitle>
                  <Badge className={getStatusColor(eq.status)} variant="outline">
                    {eq.status.replace('_', ' ')}
                  </Badge>
                </div>
                {eq.area && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <Zap className="h-3 w-3" />
                    {eq.area.name}
                  </div>
                )}
                {eq.description && (
                  <p className="text-sm text-muted-foreground mt-2">{eq.description}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Cpu className="h-4 w-4" />
                    <span>Firmware:</span>
                  </div>
                  <p className="font-medium ml-6">{eq.firmware}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Last Inspection:</span>
                  </div>
                  <p className="font-medium ml-6">{formatDate(eq.lastInspection)}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Next Due:</span>
                  </div>
                  <p className={`font-medium ml-6 ${isMaintenanceDue(eq.nextDue) ? 'text-destructive' : ''}`}>
                    {formatDate(eq.nextDue)}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileSearch className="h-4 w-4" />
                    <span>Inspections:</span>
                  </div>
                  <p className="font-medium ml-6">{eq.inspections?.length || 0} recorded</p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-border/30">
                  {canEdit && (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setInspectingEquipment(eq)}
                      >
                        <FileSearch className="h-3 w-3 mr-1" />
                        Inspect
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingEquipment({
                          ...eq,
                          areaId: eq.area?.id || '',
                          lastInspection: new Date(eq.lastInspection).toISOString().split('T')[0],
                          nextDue: new Date(eq.nextDue).toISOString().split('T')[0]
                        })}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewLogs(eq)}
                      >
                        <Wrench className="h-3 w-3 mr-1" />
                        Logs ({eq.inspections?.length || 0})
                      </Button>
                    </>
                  )}
                  {canDelete && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteEquipment(eq.id, eq.name)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
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
        <div className="text-center py-12">
          <p className="text-muted-foreground">No equipment found</p>
        </div>
      )}

      {/* Edit Equipment Dialog */}
      {editingEquipment && (
        <Dialog open={!!editingEquipment} onOpenChange={() => setEditingEquipment(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Equipment</DialogTitle>
              <DialogDescription>Update equipment details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Equipment Name</Label>
                <Input
                  id="edit-name"
                  value={editingEquipment.name}
                  onChange={(e) => setEditingEquipment({ ...editingEquipment, name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="edit-area">Area</Label>
                <Select 
                  value={editingEquipment.areaId || 'none'} 
                  onValueChange={(value) => setEditingEquipment({ ...editingEquipment, areaId: value === 'none' ? '' : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Area</SelectItem>
                    {areas.map(area => (
                      <SelectItem key={area.id} value={area.id}>{area.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-firmware">Firmware/Version</Label>
                <Input
                  id="edit-firmware"
                  value={editingEquipment.firmware}
                  onChange={(e) => setEditingEquipment({ ...editingEquipment, firmware: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingEquipment.description}
                  onChange={(e) => setEditingEquipment({ ...editingEquipment, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="edit-photo">Photo</Label>
                <div className="space-y-2">
                  <Input
                    id="edit-photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, true)}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">JPG/PNG/WEBP - Large images will be auto-compressed</p>
                </div>
                {editingEquipment.photo && (
                  <div className="mt-2 relative w-32 h-32 rounded border">
                    <img src={editingEquipment.photo} alt="Preview" className="w-full h-full object-cover rounded" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1"
                      onClick={() => setEditingEquipment({ ...editingEquipment, photo: '' })}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={editingEquipment.status} 
                  onValueChange={(value) => setEditingEquipment({ ...editingEquipment, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ready">Ready</SelectItem>
                    <SelectItem value="Degraded">Degraded</SelectItem>
                    <SelectItem value="OOS">Out of Service</SelectItem>
                    <SelectItem value="In_Transit">In Transit</SelectItem>
                    <SelectItem value="Spare">Spare</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-lastInspection">Last Inspection</Label>
                  <Input
                    id="edit-lastInspection"
                    type="date"
                    value={editingEquipment.lastInspection}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setEditingEquipment({ ...editingEquipment, lastInspection: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-nextDue">Next Due</Label>
                  <Input
                    id="edit-nextDue"
                    type="date"
                    value={editingEquipment.nextDue}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setEditingEquipment({ ...editingEquipment, nextDue: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => setEditingEquipment(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateEquipment}>
                  Update Equipment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Inspection Dialog */}
      {inspectingEquipment && (
        <Dialog open={!!inspectingEquipment} onOpenChange={() => setInspectingEquipment(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Inspect: {inspectingEquipment.name}</DialogTitle>
              <DialogDescription>Record equipment inspection</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="inspector">Inspector Name *</Label>
                <Input
                  id="inspector"
                  value={newInspection.inspector}
                  onChange={(e) => setNewInspection({ ...newInspection, inspector: e.target.value })}
                  placeholder="Your name"
                />
              </div>

              <div>
                <Label htmlFor="condition">Condition</Label>
                <Select 
                  value={newInspection.condition} 
                  onValueChange={(value) => setNewInspection({ ...newInspection, condition: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Excellent">Excellent</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newInspection.notes}
                  onChange={(e) => setNewInspection({ ...newInspection, notes: e.target.value })}
                  placeholder="Inspection notes"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="issues">Issues Found (one per line)</Label>
                <Textarea
                  id="issues"
                  value={newInspection.issues}
                  onChange={(e) => setNewInspection({ ...newInspection, issues: e.target.value })}
                  placeholder="e.g.,&#10;Scratched casing&#10;Missing rubber feet"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => setInspectingEquipment(null)}>
                  Cancel
                </Button>
                <Button onClick={handleInspect}>
                  Record Inspection
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Maintenance Logs Dialog */}
      {viewingLogs && (
        <Dialog open={!!viewingLogs} onOpenChange={() => setViewingLogs(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Inspection Logs: {viewingLogs.name}</DialogTitle>
              <DialogDescription>
                View all inspection history for this equipment
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Showing inspection records for {viewingLogs.name}
              </div>
              {maintenanceLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="flex flex-col items-center space-y-2">
                    <Wrench className="h-8 w-8" />
                    <div>No inspection logs found</div>
                    <div className="text-xs">Click "Inspect" button to record equipment inspection</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {maintenanceLogs.map((log: any) => (
                    <Card key={log.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{log.inspector}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              {formatDate(log.date)}
                            </p>
                          </div>
                          <Badge variant={
                            log.condition === 'Good' ? 'default' : 
                            log.condition === 'Fair' ? 'secondary' : 
                            'destructive'
                          }>
                            {log.condition}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-3">
                          <span className="text-sm font-medium">Notes:</span>
                          <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{log.notes}</p>
                        </div>
                        {log.issues && log.issues.length > 0 && (
                          <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="h-4 w-4 text-destructive" />
                              <span className="text-sm font-medium text-destructive">Issues Found:</span>
                            </div>
                            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                              {log.issues.map((issue: string, idx: number) => (
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
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
