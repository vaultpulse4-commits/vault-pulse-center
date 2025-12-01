import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, Download, Calendar, BarChart3, PieChart, Activity, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/dateUtils";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart as RePieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface EventFinancial {
  id: string;
  eventName: string;
  date: string;
  revenue: number;
  costs: {
    equipment: number;
    crew: number;
    venue: number;
    marketing: number;
    other: number;
  };
  totalCost: number;
  profit: number;
  roi: number;
}

export default function FinancialDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");
  const [selectedCity, setSelectedCity] = useState("jakarta");
  const [events, setEvents] = useState<EventFinancial[]>([]);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalCosts: 0,
    totalProfit: 0,
    averageROI: 0,
    eventCount: 0
  });

  useEffect(() => {
    loadFinancialData();
  }, [timeRange, selectedCity]);

  const loadFinancialData = async () => {
    try {
      setLoading(true);
      const data = await api.analytics.getFinancialData(selectedCity, timeRange);
      
      setEvents(data.events);
      setSummary(data.summary);

      /* // Mock data for fallback
      const mockEvents: EventFinancial[] = [
        {
          id: "1",
          eventName: "Summer Festival 2025",
          date: "2025-06-15",
          revenue: 150000000,
          costs: {
            equipment: 25000000,
            crew: 30000000,
            venue: 40000000,
            marketing: 15000000,
            other: 5000000
          },
          totalCost: 115000000,
          profit: 35000000,
          roi: 30.43
        },
        {
          id: "2",
          eventName: "Electronic Night",
          date: "2025-07-20",
          revenue: 80000000,
          costs: {
            equipment: 15000000,
            crew: 18000000,
            venue: 20000000,
            marketing: 8000000,
            other: 3000000
          },
          totalCost: 64000000,
          profit: 16000000,
          roi: 25.0
        },
        {
          id: "3",
          eventName: "Rock Concert",
          date: "2025-08-10",
          revenue: 120000000,
          costs: {
            equipment: 20000000,
            crew: 25000000,
            venue: 30000000,
            marketing: 12000000,
            other: 4000000
          },
          totalCost: 91000000,
          profit: 29000000,
          roi: 31.87
        }
      ];

      setEvents(mockEvents);
      
      const totalRevenue = mockEvents.reduce((sum, e) => sum + e.revenue, 0);
      const totalCosts = mockEvents.reduce((sum, e) => sum + e.totalCost, 0);
      const totalProfit = totalRevenue - totalCosts;
      const averageROI = mockEvents.reduce((sum, e) => sum + e.roi, 0) / mockEvents.length;

      setSummary({
        totalRevenue,
        totalCosts,
        totalProfit,
        averageROI,
        eventCount: mockEvents.length
      });
      */

    } catch (error: any) {
      console.error('Failed to load financial data:', error);
      toast({
        title: "Error",
        description: "Failed to load financial data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const exportReport = async (format: 'excel' | 'pdf') => {
    try {
      toast({
        title: "Exporting Report",
        description: `Generating ${format.toUpperCase()} report...`,
        duration: 2000
      });
      
      const result = await api.analytics.exportReport(format, 'financial', {
        events,
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

  // Chart data preparation
  const revenueVsCostData = events.map(event => ({
    name: event.eventName.substring(0, 15) + '...',
    revenue: event.revenue / 1000000,
    cost: event.totalCost / 1000000,
    profit: event.profit / 1000000
  }));

  const costBreakdownData = events.length > 0 ? [
    { name: 'Equipment', value: events.reduce((sum, e) => sum + e.costs.equipment, 0) },
    { name: 'Crew', value: events.reduce((sum, e) => sum + e.costs.crew, 0) },
    { name: 'Venue', value: events.reduce((sum, e) => sum + e.costs.venue, 0) },
    { name: 'Marketing', value: events.reduce((sum, e) => sum + e.costs.marketing, 0) },
    { name: 'Other', value: events.reduce((sum, e) => sum + e.costs.other, 0) }
  ] : [];

  const roiTrendData = events.map(event => ({
    name: formatDate(event.date, 'MMM dd'),
    roi: event.roi
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Financial Dashboard</h1>
              <p className="text-muted-foreground">Comprehensive financial analytics and reporting</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => navigate('/analytics/equipment')}>
              <Activity className="h-4 w-4 mr-2" />
              Equipment
            </Button>
            <Button variant="secondary" size="sm" onClick={() => navigate('/analytics/team')}>
              <Users className="h-4 w-4 mr-2" />
              Team
            </Button>
            <Button variant="outline" onClick={() => exportReport('excel')}>
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
            <Button variant="outline" onClick={() => exportReport('pdf')}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">City</label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jakarta">Jakarta</SelectItem>
                    <SelectItem value="bali">Bali</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Time Range</label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(summary.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground mt-1">{summary.eventCount} events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Costs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{formatCurrency(summary.totalCosts)}</div>
              <p className="text-xs text-muted-foreground mt-1">All expenses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${summary.totalProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatCurrency(summary.totalProfit)}
              </div>
              <div className="flex items-center gap-1 mt-1">
                {summary.totalProfit >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-success" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <span className="text-xs text-muted-foreground">Profit margin</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average ROI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{summary.averageROI.toFixed(2)}%</div>
              <p className="text-xs text-muted-foreground mt-1">Return on Investment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cost per Event</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(summary.eventCount > 0 ? summary.totalCosts / summary.eventCount : 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Average cost</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue vs Cost Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Revenue vs Cost per Event
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueVsCostData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(value: any) => formatCurrency(value * 1000000)} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#10b981" name="Revenue (M)" />
                  <Bar dataKey="cost" fill="#ef4444" name="Cost (M)" />
                  <Bar dataKey="profit" fill="#3b82f6" name="Profit (M)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Cost Breakdown Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Cost Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RePieChart>
                  <Pie
                    data={costBreakdownData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {costBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatCurrency(value)} />
                </RePieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* ROI Trend */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                ROI Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={roiTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} unit="%" />
                  <Tooltip formatter={(value: any) => `${value}%`} />
                  <Legend />
                  <Line type="monotone" dataKey="roi" stroke="#3b82f6" strokeWidth={2} name="ROI (%)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Event Details Table */}
        <Card>
          <CardHeader>
            <CardTitle>Event Financial Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Event Name</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-right py-3 px-4">Revenue</th>
                    <th className="text-right py-3 px-4">Total Cost</th>
                    <th className="text-right py-3 px-4">Profit</th>
                    <th className="text-right py-3 px-4">ROI</th>
                    <th className="text-center py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map(event => (
                    <tr key={event.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{event.eventName}</td>
                      <td className="py-3 px-4">{formatDate(event.date)}</td>
                      <td className="py-3 px-4 text-right">{formatCurrency(event.revenue)}</td>
                      <td className="py-3 px-4 text-right text-destructive">{formatCurrency(event.totalCost)}</td>
                      <td className={`py-3 px-4 text-right font-semibold ${event.profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {formatCurrency(event.profit)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Badge variant={event.roi >= 25 ? 'default' : 'destructive'}>
                          {event.roi.toFixed(2)}%
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {event.profit >= 0 ? (
                          <Badge variant="default">Profitable</Badge>
                        ) : (
                          <Badge variant="destructive">Loss</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
