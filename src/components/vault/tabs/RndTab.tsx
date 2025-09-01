import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useVaultStore } from "@/store/vaultStore";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, Zap, AlertTriangle, CheckCircle, Clock, Edit3 } from "lucide-react";

export function RndTab() {
  const { selectedCity, rndProjects, updateRndProject } = useVaultStore();
  const { toast } = useToast();
  const cityProjects = rndProjects.filter(project => project.city === selectedCity);
  
  const projects = [
    {
      id: 1,
      title: "Resolume Special FX Integration",
      description: "Advanced particle systems and real-time generative content for DJ drops",
      phase: "Pilot",
      progress: 75,
      risks: ["GPU performance under load", "Content sync timing"],
      dependencies: ["New media server", "Timecode integration"],
      lead: "Jordan Kim",
      targetCompletion: "Week 38, 2025",
      budget: 15000000
    },
    {
      id: 2,
      title: "Sensoric Sound Triggers",
      description: "Motion-activated lighting cues based on crowd movement analysis",
      phase: "POC",
      progress: 45,
      risks: ["Privacy concerns", "Sensor accuracy in low light"],
      dependencies: ["Camera installation", "ML model training"],
      lead: "Alex Chen",
      targetCompletion: "Week 42, 2025",
      budget: 35000000
    },
    {
      id: 3,
      title: "Show Control (OSC/MIDI/LTC)",
      description: "Unified control system for synchronized lighting, video, and special effects",
      phase: "Live",
      progress: 100,
      risks: [],
      dependencies: [],
      lead: "Maya Rodriguez",
      targetCompletion: "Completed",
      budget: 45000000
    },
    {
      id: 4,
      title: "Advanced Timecode Workflows",
      description: "Sub-frame precision timing for complex multi-element shows",
      phase: "Idea",
      progress: 15,
      risks: ["Hardware compatibility", "Staff training requirements"],
      dependencies: ["Equipment audit", "Training schedule"],
      lead: "Casey Thompson",
      targetCompletion: "Week 45, 2025",
      budget: 25000000
    }
  ];

  const getPhaseVariant = (phase: string) => {
    switch (phase) {
      case 'Live': return 'default';
      case 'Pilot': return 'secondary';
      case 'POC': return 'outline';
      case 'Idea': return 'outline';
      default: return 'outline';
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'Live': return <CheckCircle className="h-3 w-3" />;
      case 'Pilot': return <Zap className="h-3 w-3" />;
      case 'POC': return <Clock className="h-3 w-3" />;
      case 'Idea': return <Lightbulb className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-success";
    if (progress >= 40) return "text-warning";
    return "text-muted-foreground";
  };

  const formatBudget = (amount: number) => {
    return `${(amount / 1000000).toFixed(1)}M IDR`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">R&D / Improvements</h3>
        <Button variant="outline">
          <Lightbulb className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Phase Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-warning" />
              <div>
                <div className="text-xs text-muted-foreground">Ideas</div>
                <div className="text-lg font-bold">1</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">POC</div>
                <div className="text-lg font-bold">1</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-secondary" />
              <div>
                <div className="text-xs text-muted-foreground">Pilot</div>
                <div className="text-lg font-bold">1</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <div>
                <div className="text-xs text-muted-foreground">Live</div>
                <div className="text-lg font-bold">1</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects */}
      <div className="space-y-4">
        {cityProjects.map((project) => (
          <Card key={project.id} className="bg-gradient-card border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  {project.title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={getPhaseVariant(project.phase)}>
                    {getPhaseIcon(project.phase)}
                    {project.phase}
                  </Badge>
                  <Badge variant="outline">
                    {formatBudget(project.budget)}
                  </Badge>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {project.description}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progress</span>
                  <span className={`text-sm font-medium ${getProgressColor(project.progress)}`}>
                    {project.progress}%
                  </span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Risks */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium">Risks</span>
                  </div>
                  {project.risks.length > 0 ? (
                    <div className="space-y-1">
                      {project.risks.map((risk, index) => (
                        <div key={index} className="text-xs p-2 bg-warning/10 border border-warning/20 rounded">
                          {risk}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-success p-2 bg-success/10 border border-success/20 rounded">
                      No identified risks
                    </div>
                  )}
                </div>

                {/* Dependencies */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Dependencies</span>
                  </div>
                  {project.dependencies.length > 0 ? (
                    <div className="space-y-1">
                      {project.dependencies.map((dep, index) => (
                        <div key={index} className="text-xs p-2 bg-muted/30 border border-border/30 rounded">
                          {dep}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-success p-2 bg-success/10 border border-success/20 rounded">
                      No blocking dependencies
                    </div>
                  )}
                </div>
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm pt-2 border-t border-border/30">
                <div>
                  <span className="text-muted-foreground">Lead:</span>
                  <span className="ml-2 font-medium">{project.lead}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Target:</span>
                  <span className="ml-2">{project.targetCompletion}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Budget:</span>
                  <span className="ml-2 font-medium">{formatBudget(project.budget)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const nextPhase = project.phase === 'Idea' ? 'POC' : 
                                     project.phase === 'POC' ? 'Pilot' : 
                                     project.phase === 'Pilot' ? 'Live' : 'Live';
                    updateRndProject(project.id, { phase: nextPhase });
                    toast({ title: "Success", description: `Project advanced to ${nextPhase}` });
                  }}
                  disabled={project.phase === 'Live'}
                >
                  {project.phase === 'Idea' && 'Move to POC'}
                  {project.phase === 'POC' && 'Move to Pilot'}
                  {project.phase === 'Pilot' && 'Go Live'}
                  {project.phase === 'Live' && 'Live'}
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => {
                    const newProgress = Math.min(100, project.progress + 10);
                    updateRndProject(project.id, { progress: newProgress });
                    toast({ title: "Success", description: "Progress updated" });
                  }}
                >
                  <Edit3 className="h-3 w-3 mr-1" />
                  Update Progress
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}