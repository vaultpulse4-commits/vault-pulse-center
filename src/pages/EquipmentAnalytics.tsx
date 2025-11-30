import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Activity, AlertTriangle, TrendingDown, Clock, Wrench, Download, Loader2, DollarSign, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/dateUtils";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface EquipmentAnalytic {
  id: string;
  name: string;
  area: string;
  status: string;
  failureCount: number;
  mtbf: number;
  totalDowntime: number;
  lastFailure: string | null;
  reliability: 'High' | 'Medium' | 'Low';
}

interface EquipmentSummary {
  totalEquipment: number;
  averageMTBF: number;
  totalFailures: number;
  mostProblematic: EquipmentAnalytic[];
}

export default function EquipmentAnalytics() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("jakarta");
  const [equipment, setEquipment] = useState<EquipmentAnalytic[]>([]);
  const [summary, setSummary] = useState<EquipmentSummary>({
    totalEquipment: 0,
    averageMTBF: 0,
    totalFailures: 0,
    mostProblematic: []
  });

  useEffect(() => {
    loadEquipmentAnalytics();
  }, [selectedCity]);

  const loadEquipmentAnalytics = async () => {
    try {
      setLoading(true);
      const data = await api.analytics.getEquipmentAnalytics(selectedCity);
      
      setEquipment(data.equipment);
      setSummary(data.summary);

    } catch (error: any) {
      console.error('Failed to load equipment analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load equipment analytics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getReliabilityColor = (reliability: string) => {
    switch (reliability) {
      case 'High': return 'bg-success text-white';
      case 'Medium': return 'bg-warning text-white';
      case 'Low': return 'bg-destructive text-white';
      default: return 'bg-muted';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Operational': return 'default';
      case 'Maintenance': return 'secondary';
      case 'Faulty': return 'destructive';
      default: return 'outline';
    }
  };

  const exportReport = async () => {
    try {
      toast({
        title: "Exporting Report",
        description: "Generating equipment analytics report...",
        duration: 2000
      });
      
      const result = await api.analytics.exportReport('excel', 'equipment', {
        equipment,
        summary,
        city: selectedCity
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

  // Chart data preparation
  const mtbfChartData = equipment
    .sort((a, b) => a.mtbf - b.mtbf)
    .slice(0, 10)
    .map(eq => ({
      name: eq.name.substring(0, 20),
      mtbf: eq.mtbf,
      reliability: eq.reliability
    }));

  const failureChartData = equipment
    .sort((a, b) => b.failureCount - a.failureCount)
    .slice(0, 10)
    .map(eq => ({
      name: eq.name.substring(0, 20),
      failures: eq.failureCount
    }));

  const downtimeChartData = equipment
    .sort((a, b) => b.totalDowntime - a.totalDowntime)
    .slice(0, 10)
    .map(eq => ({
      name: eq.name.substring(0, 20),
      downtime: eq.totalDowntime
    }));

  const reliabilityDistribution = [
    { name: 'High', value: equipment.filter(e => e.reliability === 'High').length, color: '#10b981' },
    { name: 'Medium', value: equipment.filter(e => e.reliability === 'Medium').length, color: '#f59e0b' },
    { name: 'Low', value: equipment.filter(e => e.reliability === 'Low').length, color: '#ef4444' }
  ];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

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
              <h1 className="text-3xl font-bold">Equipment Analytics</h1>
              <p className="text-muted-foreground">MTBF, reliability, and failure analysis</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jakarta">Jakarta</SelectItem>
                <SelectItem value="bali">Bali</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="secondary" size="sm" onClick={() => navigate('/analytics/financial')}>
              <DollarSign className="h-4 w-4 mr-2" />
              Financial
            </Button>
            <Button variant="secondary" size="sm" onClick={() => navigate('/analytics/team')}>
              <Users className="h-4 w-4 mr-2" />
              Team
            </Button>
            <Button variant="outline" onClick={exportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Equipment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalEquipment}</div>
              <p className="text-xs text-muted-foreground mt-1">Active devices</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average MTBF</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.averageMTBF.toFixed(1)}h</div>
              <p className="text-xs text-muted-foreground mt-1">Mean time between failures</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Failures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{summary.totalFailures}</div>
              <p className="text-xs text-muted-foreground mt-1">Reported incidents</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Reliability Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {summary.totalEquipment > 0 
                  ? ((equipment.filter(e => e.reliability === 'High').length / summary.totalEquipment) * 100).toFixed(1)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">High reliability equipment</p>
            </CardContent>
          </Card>
        </div>

        {/* Most Problematic Equipment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Most Problematic Equipment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary.mostProblematic.map((eq, index) => (
                <div key={eq.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-muted-foreground">#{index + 1}</div>
                    <div>
                      <div className="font-semibold">{eq.name}</div>
                      <div className="text-sm text-muted-foreground">{eq.area}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">{eq.failureCount} Failures</div>
                      <div className="text-xs text-muted-foreground">MTBF: {eq.mtbf.toFixed(1)}h</div>
                    </div>
                    <Badge className={getReliabilityColor(eq.reliability)}>
                      {eq.reliability}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* MTBF Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                MTBF by Equipment (Bottom 10)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mtbfChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" fontSize={12} />
                  <YAxis dataKey="name" type="category" fontSize={10} width={100} />
                  <Tooltip />
                  <Bar dataKey="mtbf" fill="#3b82f6" name="MTBF (hours)">
                    {mtbfChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.reliability === 'Low' ? '#ef4444' : entry.reliability === 'Medium' ? '#f59e0b' : '#10b981'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Failure Count Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                Failure Count (Top 10)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={failureChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={10} angle={-45} textAnchor="end" height={100} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="failures" fill="#ef4444" name="Failures" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Downtime Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Total Downtime (Top 10)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={downtimeChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={10} angle={-45} textAnchor="end" height={100} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(value: any) => `${value}h`} />
                  <Legend />
                  <Bar dataKey="downtime" fill="#f59e0b" name="Downtime (hours)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Reliability Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Reliability Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reliabilityDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Equipment Count">
                    {reliabilityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Equipment Details Table */}
        <Card>
          <CardHeader>
            <CardTitle>Equipment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Equipment Name</th>
                    <th className="text-left py-3 px-4">Area</th>
                    <th className="text-center py-3 px-4">Status</th>
                    <th className="text-right py-3 px-4">MTBF (h)</th>
                    <th className="text-right py-3 px-4">Failures</th>
                    <th className="text-right py-3 px-4">Downtime (h)</th>
                    <th className="text-left py-3 px-4">Last Failure</th>
                    <th className="text-center py-3 px-4">Reliability</th>
                  </tr>
                </thead>
                <tbody>
                  {equipment.map(eq => (
                    <tr key={eq.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{eq.name}</td>
                      <td className="py-3 px-4">{eq.area}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={getStatusColor(eq.status)}>
                          {eq.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right font-mono">{eq.mtbf.toFixed(1)}</td>
                      <td className="py-3 px-4 text-right">
                        <Badge variant={eq.failureCount > 5 ? 'destructive' : 'secondary'}>
                          {eq.failureCount}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right font-mono">{eq.totalDowntime.toFixed(1)}</td>
                      <td className="py-3 px-4">
                        {eq.lastFailure ? formatDate(eq.lastFailure) : '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge className={getReliabilityColor(eq.reliability)}>
                          {eq.reliability}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Insights & Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {summary.averageMTBF < 50 && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="font-semibold text-destructive">Low Average MTBF Detected</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Average MTBF is below 50 hours. Consider preventive maintenance and equipment inspection.
                </p>
              </div>
            )}
            
            {summary.mostProblematic.length > 0 && summary.mostProblematic[0].failureCount > 5 && (
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                <div className="font-semibold text-warning">High Failure Equipment Identified</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {summary.mostProblematic[0].name} has {summary.mostProblematic[0].failureCount} failures. 
                  Consider replacement or major overhaul.
                </p>
              </div>
            )}

            {equipment.filter(e => e.reliability === 'High').length / summary.totalEquipment > 0.7 && (
              <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                <div className="font-semibold text-success">Excellent Equipment Reliability</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Over 70% of equipment shows high reliability. Maintain current maintenance schedule.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
