import { WeekPicker } from "@/components/vault/WeekPicker";
import { CityToggle } from "@/components/vault/CityToggle";
import { KPICards } from "@/components/vault/KPICards";

import { VaultTabs } from "@/components/vault/VaultTabs";
import { Badge } from "@/components/ui/badge";
import { useVaultStore } from "@/store/vaultStore";
import { Activity, Zap } from "lucide-react";

const Index = () => {
  const { selectedCity, alerts } = useVaultStore();
  const unacknowledgedAlerts = alerts.filter(alert => 
    !alert.acknowledged && alert.city === selectedCity
  ).length;

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
              <Badge variant="outline" className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                System Online
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


        {/* Tabbed Interface */}
        <VaultTabs />
      </main>
    </div>
  );
};

export default Index;
