import { WeekPicker } from "@/components/vault/WeekPicker";
import { CityToggle } from "@/components/vault/CityToggle";
import { VaultTabs } from "@/components/vault/VaultTabs";
import { NotificationCenter } from "@/components/NotificationCenter";
import { MobileNavigation } from "@/components/MobileNavigation";
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
      <header className="border-b border-border/50 bg-gradient-card sticky top-0 z-50">
        <div className="container mx-auto px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 md:py-4">
          <div className="flex items-center justify-between gap-1.5 sm:gap-2 md:gap-4">
            {/* Mobile Menu */}
            <div className="lg:hidden flex-shrink-0">
              <MobileNavigation />
            </div>

            {/* Logo & Title */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-1 min-w-0">
              <div className="p-1 sm:p-1.5 md:p-2 rounded-lg bg-gradient-primary flex-shrink-0">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xs sm:text-sm md:text-base lg:text-2xl font-bold text-foreground truncate">Vault Club</h1>
                <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground hidden md:block">Control Center</p>
              </div>
            </div>

            {/* Desktop User Menu - Hidden on Mobile */}
            <div className="hidden lg:flex lg:items-center lg:gap-2">
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs lg:text-sm px-1 sm:px-2 lg:px-3 py-1">
                      <User className="h-3 w-3 lg:h-4 lg:w-4" />
                      <span className="hidden xl:inline">{user.name}</span>
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
            </div>

            {/* Right Side: Notifications & Status - Mobile Compact, Desktop Full */}
            <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2 lg:gap-3 flex-shrink-0">
              <NotificationCenter />
              <Badge variant="outline" className="hidden sm:hidden md:flex items-center gap-1 text-xs px-2 py-1">
                <div className={`w-2 h-2 rounded-full ${connected ? 'bg-success' : 'bg-destructive'} animate-pulse`} />
                <span className="hidden lg:inline text-xs">{connected ? 'Online' : 'Connecting...'}</span>
              </Badge>
              {unacknowledgedAlerts > 0 && (
                <Badge variant="destructive" className="flex items-center gap-1 text-xs px-1.5 sm:px-2 py-1">
                  <Activity className="h-3 w-3" />
                  <span className="hidden sm:inline text-xs">{unacknowledgedAlerts}</span>
                </Badge>
              )}
              <div className="hidden lg:text-right lg:block">
                <p className="text-xs font-medium text-foreground whitespace-nowrap">{getCurrentTime()}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="hidden md:hidden lg:flex items-center gap-1 text-xs px-2 py-1 h-8"
              >
                <LogOut className="h-3 w-3" />
                <span className="hidden lg:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="container mx-auto px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 md:py-4 lg:py-6 space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-6">
        {/* Top Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
          <WeekPicker />
          <CityToggle />
        </div>

        {/* Quick Analytics Access */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
          <Card 
            className="cursor-pointer hover:border-primary transition-all hover:shadow-lg"
            onClick={() => navigate('/analytics/financial')}
          >
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="p-2 sm:p-3 rounded-lg bg-primary/10 flex-shrink-0">
                    <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base md:text-lg">Financial Analytics</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Revenue, costs, and ROI</p>
                  </div>
                </div>
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:border-primary transition-all hover:shadow-lg"
            onClick={() => navigate('/analytics/equipment')}
          >
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="p-2 sm:p-3 rounded-lg bg-success/10 flex-shrink-0">
                    <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base md:text-lg">Equipment Analytics</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">MTBF, reliability</p>
                  </div>
                </div>
                <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:border-primary transition-all hover:shadow-lg sm:col-span-2 lg:col-span-1"
            onClick={() => navigate('/analytics/team')}
          >
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="p-2 sm:p-3 rounded-lg bg-warning/10 flex-shrink-0">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-warning" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base md:text-lg">Team Analytics</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Performance insights</p>
                  </div>
                </div>
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground flex-shrink-0" />
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
