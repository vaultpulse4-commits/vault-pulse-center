import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVaultStore } from "@/store/vaultStore";
import { Lightbulb, Target, AlertTriangle, Clock, DollarSign, User, Plus, TrendingUp } from "lucide-react";
import { useState } from "react";

export function RndTab() {
  const { selectedCity, rndProjects, updateRndProject, addRndProject } = useVaultStore();
  const cityProjects = rndProjects.filter(project => project.city === selectedCity);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    lead: '',
    budget: 0,
    targetCompletion: ''
  });

  const handleCreateProject = () => {
    if (newProject.title && newProject.description) {
      addRndProject({
        ...newProject,
        phase: 'Idea',
        progress: 0,
        risks: [],
        dependencies: [],
        city: selectedCity
      });
      setNewProject({ title: '', description: '', lead: '', budget: 0, targetCompletion: '' });
      setIsNewProjectOpen(false);
    }
  };

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
      case 'Live': return Target;
      case 'Pilot': return TrendingUp;
      case 'POC': return Clock;
      case 'Idea': return Lightbulb;
      default: return Clock;
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
        <h3 className="text-lg font-semibold">R&D Projects - {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}</h3>
        <Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
          <DialogTrigger asChild>
            <Button variant="default">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New R&D Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="projectTitle">Project Title</Label>
                <Input
                  id="projectTitle"
                  value={newProject.title}
                  onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter project title"
                />
              </div>
              <div>
                <Label htmlFor="projectDescription">Description</Label>
                <Textarea
                  id="projectDescription"
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the project goals and scope"
                />
              </div>
              <div>
                <Label htmlFor="projectLead">Project Lead</Label>
                <Input
                  id="projectLead"
                  value={newProject.lead}
                  onChange={(e) => setNewProject(prev => ({ ...prev, lead: e.target.value }))}
                  placeholder="Enter project lead name"
                />
              </div>
              <div>
                <Label htmlFor="projectBudget">Budget (IDR)</Label>
                <Input
                  id="projectBudget"
                  type="number"
                  value={newProject.budget}
                  onChange={(e) => setNewProject(prev => ({ ...prev, budget: Number(e.target.value) }))}
                  placeholder="Enter budget amount"
                />
              </div>
              <div>
                <Label htmlFor="projectTarget">Target Completion</Label>
                <Input
                  id="projectTarget"
                  value={newProject.targetCompletion}
                  onChange={(e) => setNewProject(prev => ({ ...prev, targetCompletion: e.target.value }))}
                  placeholder="e.g., Week 42, 2025"
                />
              </div>
              <Button onClick={handleCreateProject} className="w-full">
                Create Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Phase Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-warning" />
              <div>
                <div className="text-xs text-muted-foreground">Ideas</div>
                <div className="text-lg font-bold">{cityProjects.filter(p => p.phase === 'Idea').length}</div>
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
                <div className="text-lg font-bold">{cityProjects.filter(p => p.phase === 'POC').length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-secondary" />
              <div>
                <div className="text-xs text-muted-foreground">Pilot</div>
                <div className="text-lg font-bold">{cityProjects.filter(p => p.phase === 'Pilot').length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-success" />
              <div>
                <div className="text-xs text-muted-foreground">Live</div>
                <div className="text-lg font-bold">{cityProjects.filter(p => p.phase === 'Live').length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects */}
      <div className="space-y-4">
        {cityProjects.map((project) => {
          const PhaseIcon = getPhaseIcon(project.phase);
          return (
            <Card key={project.id} className="bg-gradient-card border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    {project.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={getPhaseVariant(project.phase)}>
                      <PhaseIcon className="h-3 w-3 mr-1" />
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
                  <Select value={project.phase} onValueChange={(value) => updateRndProject(project.id, { phase: value as any })}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Idea">Idea</SelectItem>
                      <SelectItem value="POC">POC</SelectItem>
                      <SelectItem value="Pilot">Pilot</SelectItem>
                      <SelectItem value="Live">Live</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      const newProgress = Math.min(project.progress + 10, 100);
                      updateRndProject(project.id, { progress: newProgress });
                    }}
                    disabled={project.progress >= 100}
                  >
                    +10% Progress
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}