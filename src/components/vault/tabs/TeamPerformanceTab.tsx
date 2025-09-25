import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useVaultStore } from "@/store/vaultStore";
import { Users, TrendingUp, Clock, Shield, Award, GraduationCap, Edit } from "lucide-react";
import { useState } from "react";

export function TeamPerformanceTab() {
  const { selectedCity, crewMembers } = useVaultStore();
  const cityCrew = crewMembers.filter(member => member.city === selectedCity);
  const [isEditingMetrics, setIsEditingMetrics] = useState(false);
  const [teamMetrics, setTeamMetrics] = useState({
    attendance: 92.1,
    completedChecklists: 96.3,
    handoverQuality: 4.2,
    safetyCompliance: 98.5,
    trainingProgress: 78.5,
    commendations: 12
  });

  const trainingMatrix = [
    { skill: "Audio Systems (SE)", level: "Advanced", progress: 85, required: true },
    { skill: "Visual Setup & Cues (LJ/VJ)", level: "Intermediate", progress: 72, required: true },
    { skill: "Equipment Maintenance (GE)", level: "Advanced", progress: 91, required: true },
    { skill: "Troubleshooting Basics", level: "Basic", progress: 88, required: true },
    { skill: "Show Control Systems", level: "Advanced", progress: 65, required: false },
    { skill: "Resolume & Special Effects", level: "Advanced", progress: 58, required: false },
    { skill: "MA2 Lighting Software", level: "Advanced", progress: 44, required: false },
    { skill: "Electrical Safety", level: "Basic", progress: 94, required: true },
    { skill: "Customer Service", level: "Basic", progress: 76, required: true },
    { skill: "Leadership Skills", level: "Intermediate", progress: 62, required: false }
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-success";
    if (progress >= 60) return "text-warning";
    return "text-destructive";
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Basic': return 'text-primary';
      case 'Intermediate': return 'text-warning';
      case 'Advanced': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Team Performance - {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}</h3>
        <div className="flex gap-2">
          <Dialog open={isEditingMetrics} onOpenChange={setIsEditingMetrics}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Metrics
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
                <div>
                  <Label htmlFor="training">Training Progress (%)</Label>
                  <Input
                    id="training"
                    type="number"
                    value={teamMetrics.trainingProgress}
                    onChange={(e) => setTeamMetrics(prev => ({ ...prev, trainingProgress: Number(e.target.value) }))}
                    step="0.1"
                    max="100"
                  />
                </div>
                <div>
                  <Label htmlFor="commendations">Commendations</Label>
                  <Input
                    id="commendations"
                    type="number"
                    value={teamMetrics.commendations}
                    onChange={(e) => setTeamMetrics(prev => ({ ...prev, commendations: Number(e.target.value) }))}
                  />
                </div>
                <Button onClick={() => setIsEditingMetrics(false)} className="w-full">
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <GraduationCap className="h-4 w-4 mr-2" />
            Schedule Training
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
        
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Training</div>
                <div className="text-lg font-bold">{teamMetrics.trainingProgress}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-warning" />
              <div>
                <div className="text-xs text-muted-foreground">Awards</div>
                <div className="text-lg font-bold">{teamMetrics.commendations}</div>
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
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {cityCrew.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/30">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">{member.role} • {member.shift} shift</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={member.assigned ? 'default' : 'outline'}>
                    {member.assigned ? 'Active' : 'Standby'}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    92% attendance
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Training Matrix */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Training Matrix & Skill Development
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trainingMatrix.map((training, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{training.skill}</span>
                    <Badge variant="outline" className={getLevelColor(training.level)}>
                      {training.level}
                    </Badge>
                    {training.required && (
                      <Badge variant="destructive" className="text-xs">
                        Required
                      </Badge>
                    )}
                  </div>
                  <span className={`text-sm font-medium ${getProgressColor(training.progress)}`}>
                    {training.progress}%
                  </span>
                </div>
                <Progress value={training.progress} className="h-2" />
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-border/30">
            <div className="flex gap-2">
              <Button variant="default" size="sm">
                Schedule Group Training
              </Button>
              <Button variant="outline" size="sm">
                Individual Assessments
              </Button>
              <Button variant="secondary" size="sm">
                Export Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}