import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useVaultStore } from "@/store/vaultStore";
import { Eye, Users, AlertTriangle, CheckCircle, X } from "lucide-react";

export function TonightGlance() {
  const { selectedCity, tonightGlance, crewMembers } = useVaultStore();
  const glance = tonightGlance[selectedCity];
  const assignedCrew = crewMembers.filter(member => 
    member.city === selectedCity && member.assigned && member.shift === 'night'
  );

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          Tonight at a Glance - {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Event Brief Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Event Brief Lock Status</span>
            {glance.eventBriefLocked ? (
              <Badge variant="default" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Locked
              </Badge>
            ) : (
              <Badge variant="destructive" className="flex items-center gap-1">
                <X className="h-3 w-3" />
                Draft
              </Badge>
            )}
          </div>
        </div>

        {/* Assigned Crew */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Assigned Crew by Role</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {assignedCrew.length > 0 ? (
              assignedCrew.map((member) => (
                <div key={member.id} className="p-2 bg-muted/30 rounded border border-border/30">
                  <div className="text-sm font-medium">{member.name}</div>
                  <div className="text-xs text-muted-foreground">{member.role}</div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-sm text-muted-foreground italic">
                No crew assigned yet
              </div>
            )}
          </div>
        </div>

        {/* Red/Amber Risks */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <span className="text-sm font-medium">Red/Amber Risks</span>
          </div>
          <div className="space-y-2">
            {glance.redAmberRisks.length > 0 ? (
              glance.redAmberRisks.map((risk, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-destructive/10 border border-destructive/20 rounded">
                  <AlertTriangle className="h-3 w-3 text-destructive" />
                  <span className="text-sm">{risk}</span>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-2 p-2 bg-success/10 border border-success/20 rounded">
                <CheckCircle className="h-3 w-3 text-success" />
                <span className="text-sm">No active risks</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-2 border-t border-border/30">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              View Full Brief
            </Button>
            <Button variant="secondary" size="sm">
              Assign Crew
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}