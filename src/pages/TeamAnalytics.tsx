import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Users, TrendingUp, Award, Target, Clock, Star, Download, Loader2, Activity, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { usePermission } from "@/lib/permissions";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  shiftsCompleted: number;
  averageRating: number;
  specializations: string[];
  incidents: number;
  trainingScore: number;
  attendanceRate: number;
  certifications: string[];
  performanceTrend: 'improving' | 'stable' | 'declining';
}

interface TeamSummary {
  totalMembers: number;
  coverageRate: number;
  totalShifts: number;
  averageRating: number;
  averageTrainingScore: number;
  totalIncidents: number;
}

export default function TeamAnalytics() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const canView = usePermission('view:team_performance');
  const canEdit = usePermission('edit:team_performance');
  
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("jakarta");
  const [timeRange, setTimeRange] = useState("month");
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [summary, setSummary] = useState<TeamSummary>({
    totalMembers: 0,
    coverageRate: 0,
    totalShifts: 0,
    averageRating: 0,
    averageTrainingScore: 0,
    totalIncidents: 0
  });

  useEffect(() => {
    loadTeamAnalytics();
  }, [selectedCity, timeRange]);

  const loadTeamAnalytics = async () => {
    try {
      setLoading(true);
      const data = await api.analytics.getTeamAnalytics(selectedCity, timeRange);
      
      setTeam(data.team);
      setSummary(data.summary);

    } catch (error: any) {
      console.error('Failed to load team analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load team analytics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async () => {
    try {
      toast({
        title: "Exporting Report",
        description: "Generating team analytics report...",
        duration: 2000
      });
      
      const result = await api.analytics.exportReport('excel', 'team', {
        team,
        summary,
        city: selectedCity,
        timeRange
      });
      
      toast({
        title: "Export Complete",
        description: `File ${result.filename} downloaded successfully`,
        duration: 4000
      });
    } catch (error: any) {
      toast({
        title: "Export Failed",
        description: error.message || "Failed to export report",
        variant: "destructive",
        duration: 5000
      });
    }
  };

  const getPerformanceColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-success';
      case 'stable': return 'text-primary';
      case 'declining': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-success';
    if (rating >= 3.5) return 'text-primary';
    return 'text-warning';
  };

  // Chart data preparation
  const performanceChartData = team
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 10)
    .map(member => ({
      name: member.name.split(' ')[0],
      rating: member.averageRating,
      shifts: member.shiftsCompleted
    }));

  const trainingChartData = team
    .sort((a, b) => b.trainingScore - a.trainingScore)
    .slice(0, 10)
    .map(member => ({
      name: member.name.split(' ')[0],
      score: member.trainingScore,
      certifications: member.certifications.length
    }));

  const specializationData = [
    { name: 'Audio', value: team.filter(m => m.specializations.includes('Audio')).length },
    { name: 'Lighting', value: team.filter(m => m.specializations.includes('Lighting')).length },
    { name: 'Video', value: team.filter(m => m.specializations.includes('Video')).length },
    { name: 'Stage', value: team.filter(m => m.specializations.includes('Stage')).length },
    { name: 'Rigging', value: team.filter(m => m.specializations.includes('Rigging')).length }
  ];

  const roleDistribution = [
    { name: 'Technician', value: team.filter(m => m.role === 'Technician').length, color: '#3b82f6' },
    { name: 'Operator', value: team.filter(m => m.role === 'Operator').length, color: '#10b981' },
    { name: 'Engineer', value: team.filter(m => m.role === 'Engineer').length, color: '#f59e0b' },
    { name: 'Supervisor', value: team.filter(m => m.role === 'Supervisor').length, color: '#8b5cf6' }
  ];

  // Performance trend over time (mock monthly data)
  const trendData = [
    { month: 'Jul', avgRating: 4.1, attendance: 92, incidents: 3 },
    { month: 'Aug', avgRating: 4.3, attendance: 94, incidents: 2 },
    { month: 'Sep', avgRating: 4.2, attendance: 91, incidents: 4 },
    { month: 'Oct', avgRating: 4.5, attendance: 95, incidents: 1 },
    { month: 'Nov', avgRating: summary.averageRating, attendance: 96, incidents: summary.totalIncidents }
  ];

  // Top performers radar chart
  const topPerformer = team.sort((a, b) => b.averageRating - a.averageRating)[0];
  const radarData = topPerformer ? [
    { category: 'Performance', value: (topPerformer.averageRating / 5) * 100 },
    { category: 'Training', value: topPerformer.trainingScore },
    { category: 'Attendance', value: topPerformer.attendanceRate },
    { category: 'Experience', value: (topPerformer.shiftsCompleted / 50) * 100 },
    { category: 'Safety', value: 100 - (topPerformer.incidents * 10) }
  ] : [];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  // Check permissions
  if (!canView) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">You don't have permission to view team performance.</p>
          <Button onClick={() => navigate('/')}>Go Back</Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Team Analytics</h1>
              <p className="text-muted-foreground">Performance trends, training, and team insights</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jakarta">Jakarta</SelectItem>
                <SelectItem value="bali">Bali</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="secondary" onClick={() => navigate('/analytics/financial')}>
              <DollarSign className="h-4 w-4 mr-2" />
              Financial
            </Button>
            <Button variant="secondary" onClick={() => navigate('/analytics/equipment')}>
              <Activity className="h-4 w-4 mr-2" />
              Equipment
            </Button>
            {canEdit && (
              <Button variant="default" onClick={() => setIsEditDialogOpen(true)}>
                <Users className="h-4 w-4 mr-2" />
                Edit Team Metrics
              </Button>
            )}
            <Button variant="outline" onClick={exportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Team Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalMembers}</div>
              <p className="text-xs text-muted-foreground mt-1">Active members</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getRatingColor(summary.averageRating)}`}>
                {summary.averageRating.toFixed(2)}★
              </div>
              <p className="text-xs text-muted-foreground mt-1">Out of 5.0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{summary.coverageRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">Shift coverage</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Shifts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalShifts}</div>
              <p className="text-xs text-muted-foreground mt-1">Completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Training</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{summary.averageTrainingScore.toFixed(0)}%</div>
              <p className="text-xs text-muted-foreground mt-1">Avg score</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Incidents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{summary.totalIncidents}</div>
              <p className="text-xs text-muted-foreground mt-1">Total reported</p>
            </CardContent>
          </Card>
        </div>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-warning" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {team
                .sort((a, b) => b.averageRating - a.averageRating)
                .slice(0, 3)
                .map((member, index) => (
                  <div key={member.id} className="p-4 rounded-lg border bg-gradient-card">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`text-3xl ${index === 0 ? 'text-warning' : index === 1 ? 'text-muted-foreground' : 'text-orange-600'}`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </div>
                        <div>
                          <div className="font-semibold">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.role}</div>
                        </div>
                      </div>
                      <Badge className="bg-success text-white">
                        {member.averageRating.toFixed(1)}★
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shifts:</span>
                        <span className="font-medium">{member.shiftsCompleted}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Training:</span>
                        <span className="font-medium">{member.trainingScore}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Attendance:</span>
                        <span className="font-medium">{member.attendanceRate}%</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {member.specializations.map(spec => (
                          <Badge key={spec} variant="outline" className="text-xs">{spec}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Ratings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Performance Ratings (Top 10)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis domain={[0, 5]} fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="rating" fill="#10b981" name="Rating (0-5)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Training Scores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Training Scores (Top 10)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trainingChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis domain={[0, 100]} fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#3b82f6" name="Score (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Specialization Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Specialization Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={specializationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Team Members">
                    {specializationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Role Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Role Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={roleDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Count">
                    {roleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis yAxisId="left" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="avgRating" stroke="#10b981" strokeWidth={2} name="Avg Rating" />
                  <Line yAxisId="right" type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={2} name="Attendance (%)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Performer Radar */}
          {topPerformer && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Top Performer Profile: {topPerformer.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" fontSize={12} />
                    <PolarRadiusAxis domain={[0, 100]} fontSize={12} />
                    <Radar name={topPerformer.name} dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Team Details Table */}
        <Card>
          <CardHeader>
            <CardTitle>Team Member Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Role</th>
                    <th className="text-center py-3 px-4">Rating</th>
                    <th className="text-right py-3 px-4">Shifts</th>
                    <th className="text-right py-3 px-4">Training</th>
                    <th className="text-right py-3 px-4">Attendance</th>
                    <th className="text-center py-3 px-4">Incidents</th>
                    <th className="text-left py-3 px-4">Specializations</th>
                    <th className="text-center py-3 px-4">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {team.map(member => (
                    <tr key={member.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{member.name}</td>
                      <td className="py-3 px-4">{member.role}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={member.averageRating >= 4.5 ? 'default' : 'secondary'}>
                          {member.averageRating.toFixed(1)}★
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right font-mono">{member.shiftsCompleted}</td>
                      <td className="py-3 px-4 text-right font-mono">{member.trainingScore}%</td>
                      <td className="py-3 px-4 text-right font-mono">{member.attendanceRate}%</td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={member.incidents === 0 ? 'default' : 'destructive'}>
                          {member.incidents}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {member.specializations.slice(0, 2).map(spec => (
                            <Badge key={spec} variant="outline" className="text-xs">{spec}</Badge>
                          ))}
                          {member.specializations.length > 2 && (
                            <Badge variant="outline" className="text-xs">+{member.specializations.length - 2}</Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`font-semibold ${getPerformanceColor(member.performanceTrend)}`}>
                          {member.performanceTrend === 'improving' ? '↑' : member.performanceTrend === 'declining' ? '↓' : '→'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Training & Development Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Training & Development Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {summary.averageTrainingScore < 70 && (
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                <div className="font-semibold text-warning">Training Attention Required</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Average training score is below 70%. Consider organizing additional training sessions.
                </p>
              </div>
            )}
            
            {summary.averageRating >= 4.5 && (
              <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                <div className="font-semibold text-success">Excellent Team Performance</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Team average rating is {summary.averageRating.toFixed(2)}/5.0. Outstanding work! Keep up the momentum.
                </p>
              </div>
            )}

            {summary.coverageRate < 90 && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="font-semibold text-destructive">Low Shift Coverage</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Shift coverage is at {summary.coverageRate.toFixed(1)}%. Consider hiring additional team members or optimizing schedules.
                </p>
              </div>
            )}

            {team.filter(m => m.certifications.length === 0).length > 0 && (
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <div className="font-semibold text-primary">Certification Opportunity</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {team.filter(m => m.certifications.length === 0).length} team members have no certifications. 
                  Consider certification programs to improve skills.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
