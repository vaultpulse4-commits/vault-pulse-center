import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDashboardStore, TeamMember } from "@/store/dashboardStore";
import { Users, Clock, TrendingUp, Award, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
      return "default";
    case "setup":
      return "secondary";
    case "break":
      return "outline";
    default:
      return "outline";
  }
};

export function TeamMetrics() {
  const { teamMembers, updateTeamMemberStatus, addTask } = useDashboardStore();
  const { toast } = useToast();

  const avgEfficiency = Math.round(
    teamMembers.reduce((sum, member) => sum + member.efficiency, 0) / teamMembers.length
  );
  const totalTasks = teamMembers.reduce((sum, member) => sum + member.tasksCompleted, 0);
  const activeMembers = teamMembers.filter(member => member.status === "active").length;

  const handleStatusChange = (id: string, newStatus: TeamMember["status"]) => {
    updateTeamMemberStatus(id, newStatus);
    const member = teamMembers.find(m => m.id === id);
    toast({
      title: "Team Status Updated",
      description: `${member?.name} is now ${newStatus}`,
    });
  };

  const handleAddTask = (id: string) => {
    addTask(id);
    const member = teamMembers.find(m => m.id === id);
    toast({
      title: "Task Completed",
      description: `${member?.name} completed a task`,
    });
  };

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
            <div className="text-2xl font-bold text-primary">{activeMembers}</div>
            <div className="text-xs text-muted-foreground">Active Now</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-secondary/10 border border-secondary/20">
            <div className="text-2xl font-bold text-secondary">{avgEfficiency}%</div>
            <div className="text-xs text-muted-foreground">Avg Efficiency</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-accent/10 border border-accent/20">
            <div className="text-2xl font-bold text-accent">{totalTasks}</div>
            <div className="text-xs text-muted-foreground">Tasks Done</div>
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