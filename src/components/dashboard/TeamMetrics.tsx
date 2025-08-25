import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, TrendingUp, Award } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: "active" | "break" | "setup";
  efficiency: number;
  tasksCompleted: number;
}

const mockTeamData: TeamMember[] = [
  { id: "1", name: "Alex Chen", role: "Lead Lighting", status: "active", efficiency: 94, tasksCompleted: 12 },
  { id: "2", name: "Maya Rodriguez", role: "Sound Engineer", status: "active", efficiency: 88, tasksCompleted: 8 },
  { id: "3", name: "Jordan Kim", role: "Stage Tech", status: "setup", efficiency: 91, tasksCompleted: 15 },
  { id: "4", name: "Casey Thompson", role: "Visual Tech", status: "break", efficiency: 85, tasksCompleted: 6 },
];

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
  const avgEfficiency = Math.round(
    mockTeamData.reduce((sum, member) => sum + member.efficiency, 0) / mockTeamData.length
  );
  const totalTasks = mockTeamData.reduce((sum, member) => sum + member.tasksCompleted, 0);
  const activeMembers = mockTeamData.filter(member => member.status === "active").length;

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
          {mockTeamData.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors"
            >
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
}