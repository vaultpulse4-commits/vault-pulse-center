import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventBriefsTab } from "./tabs/EventBriefsTab";
import { ShiftCoverageTab } from "./tabs/ShiftCoverageTab";
import { EquipmentHealthTab } from "./tabs/EquipmentHealthTab";
import { MaintenanceLogsTab } from "./tabs/MaintenanceLogsTab";
import { TeamPerformanceTab } from "./tabs/TeamPerformanceTab";
import { ProposalsTab } from "./tabs/ProposalsTab";
import { RndTab } from "./tabs/RndTab";
import { ConsumablesTab } from "./tabs/ConsumablesTab";

export function VaultTabs() {
  return (
    <Tabs defaultValue="event-briefs" className="w-full">
      <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto p-1">
        <TabsTrigger value="event-briefs" className="text-xs">Event Briefs</TabsTrigger>
        <TabsTrigger value="shift-coverage" className="text-xs">Shift & Coverage</TabsTrigger>
        <TabsTrigger value="equipment-health" className="text-xs">Equipment Health</TabsTrigger>
        <TabsTrigger value="maintenance" className="text-xs">Maintenance</TabsTrigger>
        <TabsTrigger value="team-performance" className="text-xs">Team Performance</TabsTrigger>
        <TabsTrigger value="proposals" className="text-xs">Proposals</TabsTrigger>
        <TabsTrigger value="rnd" className="text-xs">R&D</TabsTrigger>
        <TabsTrigger value="consumables" className="text-xs">Consumables</TabsTrigger>
      </TabsList>
      
      <TabsContent value="event-briefs" className="mt-6">
        <EventBriefsTab />
      </TabsContent>
      
      <TabsContent value="shift-coverage" className="mt-6">
        <ShiftCoverageTab />
      </TabsContent>
      
      <TabsContent value="equipment-health" className="mt-6">
        <EquipmentHealthTab />
      </TabsContent>
      
      <TabsContent value="maintenance" className="mt-6">
        <MaintenanceLogsTab />
      </TabsContent>
      
      <TabsContent value="team-performance" className="mt-6">
        <TeamPerformanceTab />
      </TabsContent>
      
      <TabsContent value="proposals" className="mt-6">
        <ProposalsTab />
      </TabsContent>
      
      <TabsContent value="rnd" className="mt-6">
        <RndTab />
      </TabsContent>
      
      <TabsContent value="consumables" className="mt-6">
        <ConsumablesTab />
      </TabsContent>
    </Tabs>
  );
}