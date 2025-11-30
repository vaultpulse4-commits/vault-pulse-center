import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVaultStore, ShiftType } from "@/store/vaultStore";
import { Users, Clock, AlertTriangle, CheckCircle, Plus, Edit, Loader2, Trash2, UserCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { usePermission } from "@/lib/permissions";
import { useToast } from "@/hooks/use-toast";

export function ShiftCoverageTab() {
  const { selectedCity } = useVaultStore();
  const { toast } = useToast();
  const canView = usePermission('view:crew');
  const canEdit = usePermission('edit:crew');
  
  // Debug permissions
  console.log('ShiftCoverageTab Debug:', { 
    selectedCity, 
    canView, 
    canEdit 
  });
  
  const [crewMembers, setCrewMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isManageStaffOpen, setIsManageStaffOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    shift: 'day' as ShiftType,
    assigned: false
  });

  // Load crew members from API
  useEffect(() => {
    loadCrewMembers();
  }, [selectedCity]);

  const loadCrewMembers = async () => {
    if (!canView) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const data = await api.crew.getAll(selectedCity);
      setCrewMembers(data);
    } catch (error: any) {
      console.error('Failed to load crew members:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load crew members",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const dayCrew = crewMembers.filter(member => member.shift === 'day');
  const nightCrew = crewMembers.filter(member => member.shift === 'night');

  const getShiftStatus = (crew: any[]) => {
    const assigned = crew.filter(member => member.assigned).length;
    const total = crew.length;
    if (assigned === total) return { variant: 'default', text: 'Fully Staffed', icon: CheckCircle };
    if (assigned === 0) return { variant: 'destructive', text: 'No Coverage', icon: AlertTriangle };
    return { variant: 'secondary', text: 'Partial Coverage', icon: AlertTriangle };
  };

  const handleCreateCrewMember = async () => {
    if (!canEdit) {
      toast({ title: "Error", description: "You don't have permission to add crew members", variant: "destructive" });
      return;
    }
    
    if (!newMember.name || !newMember.role) {
      toast({ title: "Error", description: "Name and role are required", variant: "destructive" });
      return;
    }
    
    try {
      await api.crew.create({ 
        ...newMember, 
        city: selectedCity 
      });
      
      setNewMember({ name: '', role: '', shift: 'day', assigned: false });
      toast({ title: "Success", description: "Crew member added successfully" });
      loadCrewMembers();
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to add crew member", 
        variant: "destructive" 
      });
    }
  };

  const handleUpdateCrewMember = async (id: string, updates: any) => {
    if (!canEdit) {
      toast({ title: "Error", description: "You don't have permission to update crew members", variant: "destructive" });
      return;
    }
    
    try {
      await api.crew.update(id, updates);
      toast({ title: "Success", description: "Crew member updated successfully" });
      loadCrewMembers();
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to update crew member", 
        variant: "destructive" 
      });
    }
  };

  const handleDeleteCrewMember = async (id: string, name: string) => {
    if (!canEdit) {
      toast({ title: "Error", description: "You don't have permission to delete crew members", variant: "destructive" });
      return;
    }
    
    try {
      await api.crew.delete(id);
      toast({ title: "Success", description: `${name} removed from crew` });
      loadCrewMembers();
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to delete crew member", 
        variant: "destructive" 
      });
    }
  };

  const handleToggleAssignment = async (member: any) => {
    if (!canEdit) {
      toast({ title: "Error", description: "You don't have permission to assign crew members", variant: "destructive" });
      return;
    }
    
    try {
      await api.crew.update(member.id, { assigned: !member.assigned });
      toast({ 
        title: "Success", 
        description: `${member.name} ${!member.assigned ? 'assigned' : 'unassigned'}` 
      });
      loadCrewMembers();
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to update assignment", 
        variant: "destructive" 
      });
    }
  };

  const dayStatus = getShiftStatus(dayCrew);
  const nightStatus = getShiftStatus(nightCrew);

  if (!canView) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-2">
          <AlertTriangle className="h-12 w-12 mx-auto text-destructive" />
          <p className="text-muted-foreground">You don't have permission to view crew schedules</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Shift & Coverage - {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}</h3>
        {canEdit && (
          <Dialog open={isManageStaffOpen} onOpenChange={setIsManageStaffOpen}>
            <DialogTrigger asChild>
              <Button variant="default">
                <Users className="h-4 w-4 mr-2" />
                Manage Staff
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Manage Staff - {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4 p-4 bg-muted/30 rounded">
                <Input
                  placeholder="Name"
                  value={newMember.name}
                  onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  placeholder="Role"
                  value={newMember.role}
                  onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                />
                <Select value={newMember.shift} onValueChange={(value) => setNewMember(prev => ({ ...prev, shift: value as ShiftType }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="night">Night</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleCreateCrewMember}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {crewMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-background rounded border">
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">{member.role} • {member.shift} shift</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={member.assigned ? 'default' : 'outline'}>
                        {member.assigned ? 'Assigned' : 'Available'}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => setEditingMember(member)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteCrewMember(member.id, member.name)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : crewMembers.length === 0 ? (
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="py-12">
            <div className="text-center space-y-2">
              <Users className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">No crew members found for {selectedCity}</p>
              {canEdit && (
                <Button variant="outline" onClick={() => setIsManageStaffOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Crew Member
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Day Shift */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Day Shift
              </div>
              <Badge variant={dayStatus.variant as any}>
                <dayStatus.icon className="h-3 w-3 mr-1" />
                {dayStatus.text}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              <strong>Focus:</strong> Equipment inspection, maintenance review, setup preparation
            </div>
            
            {dayCrew.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/30">
                <div>
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-muted-foreground">{member.role}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={member.assigned ? 'default' : 'outline'}>
                    {member.assigned ? 'Assigned' : 'Available'}
                  </Badge>
                  {canEdit && (
                    <Button
                      variant={member.assigned ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => handleToggleAssignment(member)}
                    >
                      {member.assigned ? 'Remove' : 'Assign'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Night Shift */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Night Shift
              </div>
              <Badge variant={nightStatus.variant as any}>
                <nightStatus.icon className="h-3 w-3 mr-1" />
                {nightStatus.text}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              <strong>Focus:</strong> Event execution, live monitoring, emergency response
            </div>
            
            {nightCrew.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/30">
                <div>
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-muted-foreground">{member.role}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={member.assigned ? 'default' : 'outline'}>
                    {member.assigned ? 'Assigned' : 'Available'}
                  </Badge>
                  {canEdit && (
                    <Button
                      variant={member.assigned ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => handleToggleAssignment(member)}
                    >
                      {member.assigned ? 'Remove' : 'Assign'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      )}

      {/* Edit Crew Member Dialog */}
      {editingMember && (
        <Dialog open={!!editingMember} onOpenChange={() => setEditingMember(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Crew Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({...editingMember, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Input
                  id="edit-role"
                  value={editingMember.role}
                  onChange={(e) => setEditingMember({...editingMember, role: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-shift">Shift</Label>
                <Select value={editingMember.shift} onValueChange={(value) => setEditingMember({...editingMember, shift: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="night">Night</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditingMember(null)}>Cancel</Button>
                <Button onClick={async () => {
                  if (!editingMember.name || !editingMember.role) {
                    toast({ title: "Error", description: "Name and role are required", variant: "destructive" });
                    return;
                  }
                  await handleUpdateCrewMember(editingMember.id, {
                    name: editingMember.name,
                    role: editingMember.role,
                    shift: editingMember.shift
                  });
                  setEditingMember(null);
                }}>Save Changes</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}