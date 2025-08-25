import { EquipmentStatus } from "@/components/dashboard/EquipmentStatus";
import { EventTimeline } from "@/components/dashboard/EventTimeline";
import { TeamMetrics } from "@/components/dashboard/TeamMetrics";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Badge } from "@/components/ui/badge";
import { Activity, Zap } from "lucide-react";

const Index = () => {
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
                <h1 className="text-2xl font-bold text-foreground">Vault Tech Dashboard</h1>
                <p className="text-sm text-muted-foreground">Technical Operations Control Center</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                System Online
              </Badge>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">Friday, Dec 27</p>
                <p className="text-xs text-muted-foreground">21:45 EST</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <EquipmentStatus />
            <EventTimeline />
            <TeamMetrics />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <AlertsPanel />
            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
