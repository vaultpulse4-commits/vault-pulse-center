import { WeekPicker } from "@/components/vault/WeekPicker";
import { CityToggle } from "@/components/vault/CityToggle";
import { KPICards } from "@/components/vault/KPICards";
import { VaultTabs } from "@/components/vault/VaultTabs";
import { NotificationCenter } from "@/components/NotificationCenter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useVaultStore } from "@/store/vaultStore";
import { useAuthStore } from "@/store/authStore";
import { useWebSocket } from "@/contexts/WebSocketContext";
import { Activity, Zap, LogOut, User, Users, Shield, BarChart3, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const { selectedCity, alerts } = useVaultStore();
  const { user, logout } = useAuthStore();
  const { connected } = useWebSocket();
  const navigate = useNavigate();
  
  const unacknowledgedAlerts = alerts.filter(alert => 
    !alert.acknowledged && alert.city === selectedCity
  ).length;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getCurrentTime = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: selectedCity === 'jakarta' ? 'Asia/Jakarta' : 'Asia/Makassar'
    };
    return now.toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-gradient-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Vault Club Dashboard</h1>
                <p className="text-sm text-muted-foreground">Technical Operations Control Center</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{user.name}</span>
                      <Badge variant="secondary" className="text-xs">{user.role}</Badge>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="h-4 w-4 mr-2" />
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/analytics/financial')}>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Financial Analytics
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/analytics/equipment')}>
                      <Activity className="h-4 w-4 mr-2" />
                      Equipment Analytics
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/analytics/team')}>
                      <Users className="h-4 w-4 mr-2" />
                      Team Analytics
                    </DropdownMenuItem>
                    {user.role === 'admin' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/users')}>
                          <Users className="h-4 w-4 mr-2" />
                          User Management
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/permissions')}>
                          <Shield className="h-4 w-4 mr-2" />
                          Permission Matrix
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <NotificationCenter />
              <Badge variant="outline" className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${connected ? 'bg-success' : 'bg-destructive'} animate-pulse`} />
                {connected ? 'System Online' : 'Connecting...'}
              </Badge>
              {unacknowledgedAlerts > 0 && (
                <Badge variant="destructive" className="flex items-center gap-2">
                  <Activity className="h-3 w-3" />
                  {unacknowledgedAlerts} Alerts
                </Badge>
              )}
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{getCurrentTime()}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedCity === 'jakarta' ? 'WIB (UTC+7)' : 'WITA (UTC+8)'}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="container mx-auto px-6 py-6 space-y-6">
        {/* Top Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <WeekPicker />
          <CityToggle />
        </div>

        {/* KPI Cards */}
        <KPICards />

        {/* Quick Analytics Access */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card 
            className="cursor-pointer hover:border-primary transition-all hover:shadow-lg"
            onClick={() => navigate('/analytics/financial')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Financial Analytics</h3>
                    <p className="text-sm text-muted-foreground">Revenue, costs, and ROI tracking</p>
                  </div>
                </div>
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:border-primary transition-all hover:shadow-lg"
            onClick={() => navigate('/analytics/equipment')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-success/10">
                    <Activity className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Equipment Analytics</h3>
                    <p className="text-sm text-muted-foreground">MTBF, reliability, and failures</p>
                  </div>
                </div>
                <Activity className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:border-primary transition-all hover:shadow-lg"
            onClick={() => navigate('/analytics/team')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-warning/10">
                    <Users className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Team Analytics</h3>
                    <p className="text-sm text-muted-foreground">Performance and training insights</p>
                  </div>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Interface */}
        <VaultTabs />
      </main>
    </div>
  );
};

export default Index;
