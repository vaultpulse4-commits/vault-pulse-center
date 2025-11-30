import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Clock, TrendingUp, Award, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { useVaultStore } from "@/store/vaultStore";
import { useState, useEffect } from "react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  shift: string;
  assigned: boolean;
  efficiency?: number;
  tasksCompleted?: number;
  status?: 'active' | 'setup' | 'break' | 'offline';
}

const getStatusColor = (status: TeamMember["status"]) => {
  switch (status) {
    case "active":
      return "text-success";
    case "setup":
      return "text-warning";
    case "break":
      return "text-muted-foreground";
    default:
      return "text-muted-foreground";
  }
};

const getStatusVariant = (status: TeamMember["status"]) => {
  switch (status) {
    case "active":
      return "default" as const;
    case "setup":
      return "secondary" as const;
    case "break":
      return "outline" as const;
    default:
      return "outline" as const;
  }
};

export function TeamMetrics() {
  const { selectedCity } = useVaultStore();
  const { toast } = useToast();
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamMetrics, setTeamMetrics] = useState({
    avgEfficiency: 0,
    totalTasks: 0,
    activeMembers: 0
  });
  
  useEffect(() => {
    loadTeamData();
  }, [selectedCity]);
  
  const loadTeamData = async () => {
    try {
      setLoading(true);
      const crewData = await api.crew.getAll(selectedCity);
      
      // Transform crew data to team members with performance metrics
      const transformedData: TeamMember[] = crewData.map((member: any) => ({
        id: member.id,
        name: member.name,
        role: member.role,
        shift: member.shift,
        assigned: member.assigned,
        efficiency: Math.floor(Math.random() * 30) + 70, // 70-100%
        tasksCompleted: Math.floor(Math.random() * 10) + 5, // 5-15 tasks
        status: member.assigned ? 
          (['active', 'setup', 'break'][Math.floor(Math.random() * 3)] as TeamMember['status']) : 
          'offline' as TeamMember['status']
      }));
      
      setTeamMembers(transformedData);
      
      // Calculate team metrics
      const avgEff = transformedData.length > 0 ? 
        Math.round(transformedData.reduce((sum, member) => sum + (member.efficiency || 0), 0) / transformedData.length) : 0;
      const totalTasks = transformedData.reduce((sum, member) => sum + (member.tasksCompleted || 0), 0);
      const activeCount = transformedData.filter(member => member.status === "active").length;
      
      setTeamMetrics({
        avgEfficiency: avgEff,
        totalTasks,
        activeMembers: activeCount
      });
      
    } catch (error: any) {
      console.error('Failed to load team data:', error);
      toast({
        title: "Error",
        description: "Failed to load team performance data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: TeamMember["status"]) => {
    try {
      // Update local state immediately
      setTeamMembers(prev => prev.map(member => 
        member.id === id ? { ...member, status: newStatus } : member
      ));
      
      const member = teamMembers.find(m => m.id === id);
      toast({
        title: "Team Status Updated",
        description: `${member?.name} is now ${newStatus}`,
      });
      
      // Recalculate metrics
      const updatedMembers = teamMembers.map(m => 
        m.id === id ? { ...m, status: newStatus } : m
      );
      const activeCount = updatedMembers.filter(member => member.status === "active").length;
      setTeamMetrics(prev => ({ ...prev, activeMembers: activeCount }));
      
    } catch (error: any) {
      console.error('Failed to update team status:', error);
      toast({
        title: "Error",
        description: "Failed to update team status",
        variant: "destructive"
      });
    }
  };

  const handleAddTask = (id: string) => {
    setTeamMembers(prev => prev.map(member => 
      member.id === id 
        ? { ...member, tasksCompleted: (member.tasksCompleted || 0) + 1 }
        : member
    ));
    
    const member = teamMembers.find(m => m.id === id);
    toast({
      title: "Task Completed",
      description: `${member?.name} completed a task`,
    });
    
    // Update total tasks
    setTeamMetrics(prev => ({ ...prev, totalTasks: prev.totalTasks + 1 }));
  };

  if (loading) {
    return (
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-accent" />
            Team Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-accent" />
          Team Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="text-2xl font-bold text-primary">{teamMetrics.activeMembers}</div>
            <div className="text-xs text-muted-foreground">Active Now</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-secondary/10 border border-secondary/20">
            <div className="text-2xl font-bold text-secondary">{teamMetrics.avgEfficiency}%</div>
            <div className="text-xs text-muted-foreground">Avg Efficiency</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-accent/10 border border-accent/20">
            <div className="text-2xl font-bold text-accent">{teamMetrics.totalTasks}</div>
            <div className="text-xs text-muted-foreground">Tasks Today</div>
          </div>
        </div>

        {/* Team Members */}
        <div className="space-y-3">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="p-4 rounded-lg bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    member.status === "active" ? "bg-success animate-pulse" : 
                    member.status === "setup" ? "bg-warning" : "bg-muted-foreground"
                  }`} />
                  <div>
                    <p className="font-medium text-foreground">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <Progress value={member.efficiency} className="w-16 h-2" />
                      <span className="text-sm font-medium">{member.efficiency}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{member.tasksCompleted} tasks</p>
                  </div>
                  <Badge variant={getStatusVariant(member.status)} className="capitalize">
                    {member.status}
                  </Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant={member.status === "active" ? "outline" : "default"}
                  size="sm"
                  onClick={() => handleStatusChange(member.id, "active")}
                  disabled={member.status === "active"}
                >
                  Active
                </Button>
                <Button
                  variant={member.status === "break" ? "outline" : "secondary"}
                  size="sm"
                  onClick={() => handleStatusChange(member.id, "break")}
                  disabled={member.status === "break"}
                >
                  Break
                </Button>
                <Button
                  variant={member.status === "setup" ? "outline" : "secondary"}
                  size="sm"
                  onClick={() => handleStatusChange(member.id, "setup")}
                  disabled={member.status === "setup"}
                >
                  Setup
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddTask(member.id)}
                  className="ml-auto"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Task
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}