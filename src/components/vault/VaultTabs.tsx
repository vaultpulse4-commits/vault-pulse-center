import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventBriefsTab } from "./tabs/EventBriefsTab";
import { ShiftCoverageTab } from "./tabs/ShiftCoverageTab";
import { EquipmentHealthTab } from "./tabs/EquipmentHealthTab-v2";
import { MaintenanceLogsTab } from "./tabs/MaintenanceLogsTab";
import { TeamPerformanceTab } from "./tabs/TeamPerformanceTab";
import { ProposalsTab } from "./tabs/ProposalsTab";
import { RndTab } from "./tabs/RndTab";
import { ConsumablesTab } from "./tabs/ConsumablesTab";
import { SuppliersTab } from "./tabs/SuppliersTab";
import { AreaManagementTab } from "./tabs/AreaManagementTab";

export function VaultTabs() {
  return (
    <Tabs defaultValue="event-briefs" className="w-full">
      <TabsList>
        <TabsTrigger value="event-briefs">Event Briefs</TabsTrigger>
        <TabsTrigger value="shift-coverage">Shift & Coverage</TabsTrigger>
        <TabsTrigger value="equipment-health">Equipment Health</TabsTrigger>
        <TabsTrigger value="areas">Areas</TabsTrigger>
        <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        <TabsTrigger value="team-performance">Team Performance</TabsTrigger>
        <TabsTrigger value="proposals">Proposals</TabsTrigger>
        <TabsTrigger value="rnd">R&D</TabsTrigger>
        <TabsTrigger value="consumables">Consumables</TabsTrigger>
        <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
      </TabsList>
      
      <TabsContent value="event-briefs" className="mt-2 sm:mt-3 md:mt-4">
        <EventBriefsTab />
      </TabsContent>
      
      <TabsContent value="shift-coverage" className="mt-2 sm:mt-3 md:mt-4">
        <ShiftCoverageTab />
      </TabsContent>
      
      <TabsContent value="equipment-health" className="mt-2 sm:mt-3 md:mt-4">
        <EquipmentHealthTab />
      </TabsContent>
      
      <TabsContent value="areas" className="mt-2 sm:mt-3 md:mt-4">
        <AreaManagementTab />
      </TabsContent>
      
      <TabsContent value="maintenance" className="mt-2 sm:mt-3 md:mt-4">
        <MaintenanceLogsTab />
      </TabsContent>
      
      <TabsContent value="team-performance" className="mt-2 sm:mt-3 md:mt-4">
        <TeamPerformanceTab />
      </TabsContent>
      
      <TabsContent value="proposals" className="mt-2 sm:mt-3 md:mt-4">
        <ProposalsTab />
      </TabsContent>
      
      <TabsContent value="rnd" className="mt-2 sm:mt-3 md:mt-4">
        <RndTab />
      </TabsContent>
      
      <TabsContent value="consumables" className="mt-2 sm:mt-3 md:mt-4">
        <ConsumablesTab />
      </TabsContent>
      
      <TabsContent value="suppliers" className="mt-2 sm:mt-3 md:mt-4">
        <SuppliersTab />
      </TabsContent>
    </Tabs>
  );
}