import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useVaultStore } from "@/store/vaultStore";
import { Users, TrendingUp, Clock, Shield, Edit, Loader2, AlertTriangle, User } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { usePermission } from "@/lib/permissions";
import { useToast } from "@/hooks/use-toast";

export function TeamPerformanceTab() {
  const { selectedCity } = useVaultStore();
  const { toast } = useToast();
  const canView = usePermission('view:team_performance');
  const canEdit = usePermission('edit:team_performance');
  
  const [crewMembers, setCrewMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingMetrics, setIsEditingMetrics] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [memberPerformance, setMemberPerformance] = useState<{[key: string]: any}>({});
  const [teamMetrics, setTeamMetrics] = useState({
    attendance: 92.1,
    completedChecklists: 96.3,
    handoverQuality: 4.2,
    safetyCompliance: 98.5
  });

  useEffect(() => {
    if (selectedCity) {
      loadCrewData();
    }
  }, [selectedCity]);

  const loadCrewData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.crew.getAll(selectedCity);
      setCrewMembers(data);
      
      // Initialize member performance data with realistic random values
      const perfData: {[key: string]: any} = {};
      data.forEach((member: any) => {
        // Generate realistic random performance metrics
        const baseAttendance = 85 + Math.floor(Math.random() * 15); // 85-100%
        const baseTasks = 12 + Math.floor(Math.random() * 8); // 12-20 tasks
        const baseHandover = 3.5 + Math.random() * 1.5; // 3.5-5.0
        const baseSafety = 90 + Math.floor(Math.random() * 10); // 90-100%
        
        perfData[member.id] = {
          attendance: baseAttendance,
          tasksCompleted: baseTasks,
          handoverQuality: Math.round(baseHandover * 10) / 10,
          safetyScore: baseSafety,
          notes: '',
          strengths: '',
          improvements: ''
        };
      });
      setMemberPerformance(perfData);
      
      // Calculate metrics from individual member performance data
      if (data.length > 0) {
        // Calculate average attendance from individual member attendance values
        const avgAttendance = Object.values(perfData).reduce((sum: number, perf: any) => sum + perf.attendance, 0) / data.length;
        
        // Update team metrics for dashboard sync
        const avgTasksCompleted = Object.values(perfData).reduce((sum: number, perf: any) => sum + perf.tasksCompleted, 0) / data.length;
        const avgHandoverQuality = Object.values(perfData).reduce((sum: number, perf: any) => sum + perf.handoverQuality, 0) / data.length;
        const avgSafetyScore = Object.values(perfData).reduce((sum: number, perf: any) => sum + perf.safetyScore, 0) / data.length;
        
        setTeamMetrics({
          attendance: Number(avgAttendance.toFixed(1)),
          completedChecklists: Number(avgTasksCompleted.toFixed(1)),
          handoverQuality: Number(avgHandoverQuality.toFixed(1)),
          safetyCompliance: Number(avgSafetyScore.toFixed(1))
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load crew data');
      toast({
        title: "Error",
        description: err.message || "Failed to load crew data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditMember = (member: any) => {
    setEditingMember(member);
  };

  const handleSaveMemberPerformance = () => {
    // Recalculate team metrics based on all member performance
    const allMembers = Object.values(memberPerformance);
    if (allMembers.length > 0) {
      const avgAttendance = allMembers.reduce((sum: number, perf: any) => sum + perf.attendance, 0) / allMembers.length;
      const avgTasksCompleted = allMembers.reduce((sum: number, perf: any) => sum + perf.tasksCompleted, 0) / allMembers.length;
      const avgHandoverQuality = allMembers.reduce((sum: number, perf: any) => sum + perf.handoverQuality, 0) / allMembers.length;
      const avgSafetyScore = allMembers.reduce((sum: number, perf: any) => sum + perf.safetyScore, 0) / allMembers.length;
      
      setTeamMetrics({
        attendance: Number(avgAttendance.toFixed(1)),
        completedChecklists: Number(avgTasksCompleted.toFixed(1)),
        handoverQuality: Number(avgHandoverQuality.toFixed(1)),
        safetyCompliance: Number(avgSafetyScore.toFixed(1))
      });
    }
    
    toast({
      title: "Success",
      description: `Performance data for ${editingMember.name} has been updated. Team metrics recalculated.`
    });
    setEditingMember(null);
  };

  const getMemberPerformance = (memberId: string) => {
    return memberPerformance[memberId] || {
      attendance: 0,
      tasksCompleted: 0,
      handoverQuality: 0,
      safetyScore: 0,
      notes: '',
      strengths: '',
      improvements: ''
    };
  };

  const updateMemberPerformance = (memberId: string, field: string, value: any) => {
    setMemberPerformance(prev => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [field]: value
      }
    }));
  };

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
          <p className="text-lg font-semibold">Access Denied</p>
          <p className="text-sm text-muted-foreground">You don't have permission to view team performance</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Team Performance - {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}</h3>
        {canEdit && (
          <Dialog open={isEditingMetrics} onOpenChange={setIsEditingMetrics}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Team Metrics
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Team Performance Metrics</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="attendance">Attendance (%)</Label>
                  <Input
                    id="attendance"
                    type="number"
                    value={teamMetrics.attendance}
                    onChange={(e) => setTeamMetrics(prev => ({ ...prev, attendance: Number(e.target.value) }))}
                    step="0.1"
                    max="100"
                  />
                </div>
                <div>
                  <Label htmlFor="checklists">Completed Checklists (%)</Label>
                  <Input
                    id="checklists"
                    type="number"
                    value={teamMetrics.completedChecklists}
                    onChange={(e) => setTeamMetrics(prev => ({ ...prev, completedChecklists: Number(e.target.value) }))}
                    step="0.1"
                    max="100"
                  />
                </div>
                <div>
                  <Label htmlFor="handover">Handover Quality (1-5)</Label>
                  <Input
                    id="handover"
                    type="number"
                    value={teamMetrics.handoverQuality}
                    onChange={(e) => setTeamMetrics(prev => ({ ...prev, handoverQuality: Number(e.target.value) }))}
                    step="0.1"
                    max="5"
                  />
                </div>
                <div>
                  <Label htmlFor="safety">Safety Compliance (%)</Label>
                  <Input
                    id="safety"
                    type="number"
                    value={teamMetrics.safetyCompliance}
                    onChange={(e) => setTeamMetrics(prev => ({ ...prev, safetyCompliance: Number(e.target.value) }))}
                    step="0.1"
                    max="100"
                  />
                </div>
                <Button onClick={() => setIsEditingMetrics(false)} className="w-full">
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Performance Overview */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
      <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Attendance</div>
                <div className="text-lg font-bold">{teamMetrics.attendance}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-success" />
              <div>
                <div className="text-xs text-muted-foreground">Checklists</div>
                <div className="text-lg font-bold">{teamMetrics.completedChecklists}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-warning" />
              <div>
                <div className="text-xs text-muted-foreground">Handover</div>
                <div className="text-lg font-bold">{teamMetrics.handoverQuality}/5</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-success" />
              <div>
                <div className="text-xs text-muted-foreground">Safety</div>
                <div className="text-lg font-bold">{teamMetrics.safetyCompliance}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Team Members ({crewMembers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {crewMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">No team members found</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {crewMembers.map((member) => {
                const perf = getMemberPerformance(member.id);
                return (
                <Card key={member.id} className="bg-muted/30 border-border/30">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.role} • {member.shift} shift</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={member.assigned ? 'default' : 'outline'}>
                          {member.assigned ? 'Active' : 'Standby'}
                        </Badge>
                        {canEdit && (
                          <Button variant="ghost" size="sm" onClick={() => handleEditMember(member)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit {member.name} performance</span>
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <div className="text-muted-foreground text-xs">Attendance</div>
                        <div className="font-medium">{perf.attendance}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-xs">Tasks Done</div>
                        <div className="font-medium">{perf.tasksCompleted}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-xs">Handover</div>
                        <div className="font-medium">{perf.handoverQuality}/5</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-xs">Safety</div>
                        <div className="font-medium">{perf.safetyScore}%</div>
                      </div>
                    </div>
                    
                    {perf.notes && (
                      <div className="mt-3 pt-3 border-t border-border/30">
                        <div className="text-xs text-muted-foreground mb-1">Notes:</div>
                        <div className="text-sm">{perf.notes}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )})}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Member Performance Edit Dialog */}
      {editingMember && (
        <Dialog open={!!editingMember} onOpenChange={(open) => !open && setEditingMember(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Performance - {editingMember.name}</DialogTitle>
              <DialogDescription>{editingMember.role} • {editingMember.shift} shift</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="member-attendance">Attendance (%)</Label>
                  <Input
                    id="member-attendance"
                    type="number"
                    value={getMemberPerformance(editingMember.id).attendance}
                    onChange={(e) => updateMemberPerformance(editingMember.id, 'attendance', Number(e.target.value))}
                    max="100"
                  />
                </div>
                <div>
                  <Label htmlFor="tasks-completed">Tasks Completed</Label>
                  <Input
                    id="tasks-completed"
                    type="number"
                    value={getMemberPerformance(editingMember.id).tasksCompleted}
                    onChange={(e) => updateMemberPerformance(editingMember.id, 'tasksCompleted', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="handover-quality">Handover Quality (1-5)</Label>
                  <Input
                    id="handover-quality"
                    type="number"
                    value={getMemberPerformance(editingMember.id).handoverQuality}
                    onChange={(e) => updateMemberPerformance(editingMember.id, 'handoverQuality', Number(e.target.value))}
                    step="0.1"
                    max="5"
                  />
                </div>
                <div>
                  <Label htmlFor="safety-score">Safety Score (%)</Label>
                  <Input
                    id="safety-score"
                    type="number"
                    value={getMemberPerformance(editingMember.id).safetyScore}
                    onChange={(e) => updateMemberPerformance(editingMember.id, 'safetyScore', Number(e.target.value))}
                    max="100"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="strengths">Strengths</Label>
                <Textarea
                  id="strengths"
                  value={getMemberPerformance(editingMember.id).strengths}
                  onChange={(e) => updateMemberPerformance(editingMember.id, 'strengths', e.target.value)}
                  placeholder="What are their key strengths?"
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="improvements">Areas for Improvement</Label>
                <Textarea
                  id="improvements"
                  value={getMemberPerformance(editingMember.id).improvements}
                  onChange={(e) => updateMemberPerformance(editingMember.id, 'improvements', e.target.value)}
                  placeholder="What needs improvement?"
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="member-notes">Performance Notes</Label>
                <Textarea
                  id="member-notes"
                  value={getMemberPerformance(editingMember.id).notes}
                  onChange={(e) => updateMemberPerformance(editingMember.id, 'notes', e.target.value)}
                  placeholder="General notes about performance..."
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => setEditingMember(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveMemberPerformance}>
                  Save Performance Data
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      </>
      )}
    </div>
  );
}