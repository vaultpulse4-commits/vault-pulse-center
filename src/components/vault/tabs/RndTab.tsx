import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVaultStore } from "@/store/vaultStore";
import { Lightbulb, Target, AlertTriangle, Clock, DollarSign, User, Plus, TrendingUp, Loader2, Edit3, Trash2, CheckCircle, Calendar as CalendarIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { usePermission } from "@/lib/permissions";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export function RndTab() {
  const { selectedCity } = useVaultStore();
  const { toast } = useToast();
  const canView = usePermission('view:rnd');
  const canEdit = usePermission('edit:rnd');
  
  const [projects, setProjects] = useState<any[]>([]);
  const [crew, setCrew] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [deletingProject, setDeletingProject] = useState<any | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    lead: '',
    budget: 0,
    targetDate: null as Date | null,
    phase: 'Idea' as 'Idea' | 'POC' | 'Pilot' | 'Live',
    status: 'Active' as 'Active' | 'OnHold' | 'Completed' | 'Archived',
    risks: [] as string[],
    dependencies: [] as string[],
    notes: ''
  });

  const [newRisk, setNewRisk] = useState('');
  const [newDependency, setNewDependency] = useState('');

  useEffect(() => {
    if (selectedCity) {
      loadProjects();
      loadCrew();
    }
  }, [selectedCity]);

  const loadCrew = async () => {
    try {
      const data = await api.crew.getAll(selectedCity);
      setCrew(data);
    } catch (err: any) {
      console.error('Failed to load crew:', err);
      // Don't show error toast for crew loading, just log it
    }
  };

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.rnd.getAll(selectedCity);
      setProjects(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load R&D projects');
      toast({
        title: "Error",
        description: err.message || "Failed to load R&D projects",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProject.title || !newProject.description || !newProject.lead) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Title, Description, Lead)",
        variant: "destructive"
      });
      return;
    }

    try {
      await api.rnd.create({
        ...newProject,
        targetDate: newProject.targetDate ? newProject.targetDate.toISOString() : null,
        progress: getPhaseProgress(newProject.phase).min,
        city: selectedCity
      });
      toast({
        title: "Success",
        description: "R&D project created successfully"
      });
      resetForm();
      setIsNewProjectOpen(false);
      loadProjects();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to create project",
        variant: "destructive"
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!editingProject) return;

    try {
      await api.rnd.update(editingProject.id, {
        ...editingProject,
        targetDate: editingProject.targetDate ? new Date(editingProject.targetDate).toISOString() : null
      });
      toast({
        title: "Success",
        description: "Project updated successfully"
      });
      setEditingProject(null);
      loadProjects();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update project",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProject = async (id: string, title: string) => {
    try {
      await api.rnd.delete(id);
      toast({
        title: "Success",
        description: `Project "${title}" deleted`
      });
      setDeletingProject(null);
      loadProjects();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete project",
        variant: "destructive"
      });
    }
  };

  const handlePhaseChange = async (projectId: string, newPhase: string) => {
    const progressRange = getPhaseProgress(newPhase);
    try {
      await api.rnd.update(projectId, { 
        phase: newPhase,
        progress: progressRange.min
      });
      toast({
        title: "Success",
        description: `Phase updated to ${newPhase}`
      });
      loadProjects();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update phase",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setNewProject({
      title: '',
      description: '',
      lead: '',
      budget: 0,
      targetDate: null,
      phase: 'Idea',
      status: 'Active',
      risks: [],
      dependencies: [],
      notes: ''
    });
    setNewRisk('');
    setNewDependency('');
  };

  const getPhaseProgress = (phase: string) => {
    switch (phase) {
      case 'Idea': return { min: 0, max: 25 };
      case 'POC': return { min: 25, max: 50 };
      case 'Pilot': return { min: 50, max: 75 };
      case 'Live': return { min: 75, max: 100 };
      default: return { min: 0, max: 100 };
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Live': return 'bg-green-500/20 text-green-500 border-green-500/50';
      case 'Pilot': return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
      case 'POC': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
      case 'Idea': return 'bg-purple-500/20 text-purple-500 border-purple-500/50';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500/20 text-green-500 border-green-500/50';
      case 'OnHold': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
      case 'Completed': return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
      case 'Archived': return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'Live': return <Target className="h-4 w-4" />;
      case 'Pilot': return <TrendingUp className="h-4 w-4" />;
      case 'POC': return <Clock className="h-4 w-4" />;
      case 'Idea': return <Lightbulb className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatBudget = (amount: number) => {
    return `${(amount / 1000000).toFixed(1)}M IDR`;
  };

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
          <p className="text-lg font-semibold">Access Denied</p>
          <p className="text-sm text-muted-foreground">You don't have permission to view R&D projects</p>
        </div>
      </div>
    );
  }

  const filteredProjects = selectedPhase === 'all' 
    ? projects 
    : projects.filter(p => p.phase === selectedPhase);

  const summaryMetrics = {
    ideaCount: projects.filter(p => p.phase === 'Idea' && p.status === 'Active').length,
    pocCount: projects.filter(p => p.phase === 'POC' && p.status === 'Active').length,
    pilotCount: projects.filter(p => p.phase === 'Pilot' && p.status === 'Active').length,
    liveCount: projects.filter(p => p.phase === 'Live').length,
    totalBudget: projects.filter(p => p.status !== 'Archived').reduce((sum, p) => sum + p.budget, 0),
    totalActualCost: projects.reduce((sum, p) => sum + (p.actualCost || 0), 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">R&D Projects - {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}</h3>
        {canEdit && (
          <Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
            <DialogTrigger asChild>
              <Button variant="default">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New R&D Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="title">Project Title *</Label>
                    <Input
                      id="title"
                      value={newProject.title}
                      onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., LED Ceiling Interactive System"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={newProject.description}
                      onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the project goals and scope"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lead">Project Lead *</Label>
                    <Select value={newProject.lead} onValueChange={(value) => setNewProject(prev => ({ ...prev, lead: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project lead" />
                      </SelectTrigger>
                      <SelectContent>
                        {crew.map((member) => (
                          <SelectItem key={member.id} value={member.name}>
                            {member.name} - {member.role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="budget">Budget (IDR)</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={newProject.budget}
                      onChange={(e) => setNewProject(prev => ({ ...prev, budget: parseFloat(e.target.value) || 0 }))}
                      placeholder="15000000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phase">Initial Phase</Label>
                    <Select value={newProject.phase} onValueChange={(value: any) => setNewProject(prev => ({ ...prev, phase: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Idea">💡 Idea</SelectItem>
                        <SelectItem value="POC">🔬 POC</SelectItem>
                        <SelectItem value="Pilot">🚀 Pilot</SelectItem>
                        <SelectItem value="Live">✅ Live</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Target Completion Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newProject.targetDate ? format(newProject.targetDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={newProject.targetDate || undefined}
                          onSelect={(date) => setNewProject(prev => ({ ...prev, targetDate: date || null }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="col-span-2">
                    <Label>Risks</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newRisk}
                        onChange={(e) => setNewRisk(e.target.value)}
                        placeholder="Add a risk..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newRisk.trim()) {
                            setNewProject(prev => ({ ...prev, risks: [...prev.risks, newRisk.trim()] }));
                            setNewRisk('');
                          }
                        }}
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          if (newRisk.trim()) {
                            setNewProject(prev => ({ ...prev, risks: [...prev.risks, newRisk.trim()] }));
                            setNewRisk('');
                          }
                        }}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {newProject.risks.map((risk, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {risk}
                          <button
                            onClick={() => setNewProject(prev => ({ ...prev, risks: prev.risks.filter((_, i) => i !== idx) }))}
                            className="ml-1 text-muted-foreground hover:text-foreground"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Label>Dependencies</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newDependency}
                        onChange={(e) => setNewDependency(e.target.value)}
                        placeholder="Add a dependency..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newDependency.trim()) {
                            setNewProject(prev => ({ ...prev, dependencies: [...prev.dependencies, newDependency.trim()] }));
                            setNewDependency('');
                          }
                        }}
                      />
                      <Button 
                        variant="outline"
                        onClick={() => {
                          if (newDependency.trim()) {
                            setNewProject(prev => ({ ...prev, dependencies: [...prev.dependencies, newDependency.trim()] }));
                            setNewDependency('');
                          }
                        }}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {newProject.dependencies.map((dep, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {dep}
                          <button
                            onClick={() => setNewProject(prev => ({ ...prev, dependencies: prev.dependencies.filter((_, i) => i !== idx) }))}
                            className="ml-1 text-muted-foreground hover:text-foreground"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newProject.notes}
                      onChange={(e) => setNewProject(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Additional notes or context..."
                      rows={2}
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => {
                    setIsNewProjectOpen(false);
                    resetForm();
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateProject}>Create Project</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-purple-500" />
              <div>
                <div className="text-xs text-muted-foreground">Ideas</div>
                <div className="text-lg font-bold">{summaryMetrics.ideaCount}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <div>
                <div className="text-xs text-muted-foreground">POC</div>
                <div className="text-lg font-bold">{summaryMetrics.pocCount}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-xs text-muted-foreground">Pilot</div>
                <div className="text-lg font-bold">{summaryMetrics.pilotCount}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-green-500" />
              <div>
                <div className="text-xs text-muted-foreground">Live</div>
                <div className="text-lg font-bold">{summaryMetrics.liveCount}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Budget</div>
                <div className="text-lg font-bold">{formatBudget(summaryMetrics.totalBudget)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-warning" />
              <div>
                <div className="text-xs text-muted-foreground">Spent</div>
                <div className="text-lg font-bold">{formatBudget(summaryMetrics.totalActualCost)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Phase Filter */}
      <div className="flex gap-2">
        <Button 
          variant={selectedPhase === 'all' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setSelectedPhase('all')}
        >
          All Projects
        </Button>
        <Button 
          variant={selectedPhase === 'Idea' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setSelectedPhase('Idea')}
        >
          💡 Ideas
        </Button>
        <Button 
          variant={selectedPhase === 'POC' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setSelectedPhase('POC')}
        >
          🔬 POC
        </Button>
        <Button 
          variant={selectedPhase === 'Pilot' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setSelectedPhase('Pilot')}
        >
          🚀 Pilot
        </Button>
        <Button 
          variant={selectedPhase === 'Live' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setSelectedPhase('Live')}
        >
          ✅ Live
        </Button>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold">No projects found</p>
            <p className="text-sm text-muted-foreground">
              {selectedPhase === 'all' ? 'Create your first R&D project' : `No ${selectedPhase} projects yet`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="bg-gradient-card border-border/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 mb-2">
                      {getPhaseIcon(project.phase)}
                      {project.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select 
                      value={project.phase} 
                      onValueChange={(value) => handlePhaseChange(project.id, value)}
                      disabled={!canEdit}
                    >
                      <SelectTrigger className={`w-[130px] ${getPhaseColor(project.phase)}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Idea">💡 Idea</SelectItem>
                        <SelectItem value="POC">🔬 POC</SelectItem>
                        <SelectItem value="Pilot">🚀 Pilot</SelectItem>
                        <SelectItem value="Live">✅ Live</SelectItem>
                      </SelectContent>
                    </Select>
                    <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-bold">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {project.phase} phase: {getPhaseProgress(project.phase).min}% - {getPhaseProgress(project.phase).max}%
                  </div>
                </div>

                {/* Project Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/30">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Lead:</span>
                      <span className="font-medium">{project.lead}</span>
                      {crew.find(member => member.name === project.lead) && (
                        <Badge variant="outline" className="text-xs ml-1">
                          {crew.find(member => member.name === project.lead)?.role}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Target:</span>
                      <span className="font-medium">
                        {project.targetDate ? format(new Date(project.targetDate), "PPP") : 'Not set'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Budget:</span>
                      <span className="font-medium">{formatBudget(project.budget)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-3 w-3 text-warning" />
                      <span className="text-muted-foreground">Spent:</span>
                      <span className="font-medium">{formatBudget(project.actualCost || 0)}</span>
                      <span className="text-xs text-muted-foreground">
                        ({Math.round((project.actualCost || 0) / project.budget * 100)}%)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {project.risks && project.risks.length > 0 && (
                      <div className="text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle className="h-3 w-3 text-warning" />
                          <span className="text-muted-foreground">Risks:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {project.risks.slice(0, 2).map((risk: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">{risk}</Badge>
                          ))}
                          {project.risks.length > 2 && (
                            <Badge variant="outline" className="text-xs">+{project.risks.length - 2}</Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Milestones */}
                {project.milestones && project.milestones.length > 0 && (
                  <div className="pt-4 border-t border-border/30">
                    <div className="text-sm font-medium mb-2">Milestones</div>
                    <div className="space-y-1">
                      {project.milestones.map((milestone: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          {milestone.completed ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          ) : (
                            <Clock className="h-3 w-3 text-muted-foreground" />
                          )}
                          <span className={milestone.completed ? 'line-through text-muted-foreground' : ''}>
                            {milestone.title}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({milestone.dueDate})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-border/30 flex-wrap">
                  {canEdit && (
                    <>
                      <Button variant="secondary" size="sm" onClick={() => setEditingProject(project)}>
                        <Edit3 className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => setDeletingProject(project)}
                        disabled={project.status === 'Completed'}
                        title={project.status === 'Completed' ? 'Cannot delete completed projects' : 'Delete project'}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      {editingProject && (
        <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Project - {editingProject.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="edit-title">Project Title</Label>
                  <Input
                    id="edit-title"
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingProject.description}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-lead">Project Lead</Label>
                  <Select value={editingProject.lead} onValueChange={(value) => setEditingProject({ ...editingProject, lead: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project lead" />
                    </SelectTrigger>
                    <SelectContent>
                      {crew.map((member) => (
                        <SelectItem key={member.id} value={member.name}>
                          {member.name} - {member.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-budget">Budget (IDR)</Label>
                  <Input
                    id="edit-budget"
                    type="number"
                    value={editingProject.budget}
                    onChange={(e) => setEditingProject({ ...editingProject, budget: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-actualCost">Actual Cost (IDR)</Label>
                  <Input
                    id="edit-actualCost"
                    type="number"
                    value={editingProject.actualCost || 0}
                    onChange={(e) => setEditingProject({ ...editingProject, actualCost: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-progress">Progress (%)</Label>
                  <Input
                    id="edit-progress"
                    type="number"
                    min={getPhaseProgress(editingProject.phase).min}
                    max={getPhaseProgress(editingProject.phase).max}
                    value={editingProject.progress}
                    onChange={(e) => setEditingProject({ ...editingProject, progress: parseInt(e.target.value) || 0 })}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Range for {editingProject.phase}: {getPhaseProgress(editingProject.phase).min}% - {getPhaseProgress(editingProject.phase).max}%
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={editingProject.status} onValueChange={(value) => setEditingProject({ ...editingProject, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">✅ Active</SelectItem>
                      <SelectItem value="OnHold">⏸️ On Hold</SelectItem>
                      <SelectItem value="Completed">🎉 Completed</SelectItem>
                      <SelectItem value="Archived">📦 Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Target Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editingProject.targetDate ? format(new Date(editingProject.targetDate), "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={editingProject.targetDate ? new Date(editingProject.targetDate) : undefined}
                        onSelect={(date) => setEditingProject({ ...editingProject, targetDate: date ? date.toISOString() : null })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="edit-notes">Notes</Label>
                  <Textarea
                    id="edit-notes"
                    value={editingProject.notes || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, notes: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditingProject(null)}>Cancel</Button>
                <Button onClick={handleSaveEdit}>Save Changes</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation */}
      {deletingProject && (
        <Dialog open={!!deletingProject} onOpenChange={() => setDeletingProject(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Project</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{deletingProject.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-2 justify-end mt-4">
              <Button variant="outline" onClick={() => setDeletingProject(null)}>Cancel</Button>
              <Button 
                variant="destructive" 
                onClick={() => handleDeleteProject(deletingProject.id, deletingProject.title)}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
