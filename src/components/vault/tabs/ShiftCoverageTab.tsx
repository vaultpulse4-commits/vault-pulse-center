import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVaultStore, CrewMember, ShiftType } from "@/store/vaultStore";
import { Users, Clock, AlertTriangle, CheckCircle, Plus, Edit } from "lucide-react";
import { useState } from "react";

export function ShiftCoverageTab() {
  const { selectedCity, crewMembers, assignCrewMember } = useVaultStore();
  const [isManageStaffOpen, setIsManageStaffOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<CrewMember | null>(null);
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    shift: 'day' as ShiftType,
    assigned: false
  });
  const cityCrew = crewMembers.filter(member => member.city === selectedCity);
  
  const dayCrew = cityCrew.filter(member => member.shift === 'day');
  const nightCrew = cityCrew.filter(member => member.shift === 'night');

  const getShiftStatus = (crew: typeof cityCrew) => {
    const assigned = crew.filter(member => member.assigned).length;
    const total = crew.length;
    if (assigned === total) return { variant: 'default', text: 'Fully Staffed', icon: CheckCircle };
    if (assigned === 0) return { variant: 'destructive', text: 'No Coverage', icon: AlertTriangle };
    return { variant: 'secondary', text: 'Partial Coverage', icon: AlertTriangle };
  };

  const dayStatus = getShiftStatus(dayCrew);
  const nightStatus = getShiftStatus(nightCrew);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Shift & Coverage - {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}</h3>
        <Dialog open={isManageStaffOpen} onOpenChange={setIsManageStaffOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
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
                <Button onClick={() => {
                  // Add logic to create new crew member
                  setNewMember({ name: '', role: '', shift: 'day', assigned: false });
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {cityCrew.map((member) => (
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Day Shift */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Day Shift (10:00 - 18:00)
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
                  <Button
                    variant={member.assigned ? 'outline' : 'default'}
                    size="sm"
                    onClick={() => assignCrewMember(member.id, !member.assigned)}
                  >
                    {member.assigned ? 'Remove' : 'Assign'}
                  </Button>
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
                Night Shift (18:00 - 06:00)
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
                  <Button
                    variant={member.assigned ? 'outline' : 'default'}
                    size="sm"
                    onClick={() => assignCrewMember(member.id, !member.assigned)}
                  >
                    {member.assigned ? 'Remove' : 'Assign'}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}