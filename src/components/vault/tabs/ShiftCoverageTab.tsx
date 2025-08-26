import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useVaultStore } from "@/store/vaultStore";
import { Users, Clock, AlertTriangle, CheckCircle } from "lucide-react";

export function ShiftCoverageTab() {
  const { selectedCity, crewMembers, assignCrewMember } = useVaultStore();
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
        <Button variant="outline">
          <Users className="h-4 w-4 mr-2" />
          Manage Staff
        </Button>
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

      {/* Handover Quality & Safety Checks */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Handover Quality & Safety Checks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Day→Night Handover</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Equipment Status Review:</span>
                  <Badge variant="default">Complete</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Issue Log Transfer:</span>
                  <Badge variant="default">Complete</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Safety Checklist:</span>
                  <Badge variant="secondary">In Progress</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Required Roles Tonight</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>LJ Lead:</span>
                  <Badge variant="default">Covered</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Sound Engineer:</span>
                  <Badge variant="default">Covered</Badge>
                </div>
                <div className="flex justify-between">
                  <span>VJ Tech:</span>
                  <Badge variant="destructive">Missing</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}