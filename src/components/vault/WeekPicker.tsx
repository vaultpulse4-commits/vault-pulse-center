import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useVaultStore } from "@/store/vaultStore";
import { ChevronLeft, ChevronRight, Calendar, Download } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function WeekPicker() {
  const { selectedWeek, setSelectedWeek, selectedCity } = useVaultStore();
  const { toast } = useToast();
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
  const getWeekDates = (year: number, month: number, week: number) => {
    // Calculate first day of the week (Sunday)
    const startDate = new Date(year, month - 1, (week - 1) * 7 + 1);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    return {
      start: startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      end: endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const { year, month, week } = selectedWeek;
    if (direction === 'next') {
      if (week >= 4) {
        setSelectedWeek({ year, month: month + 1, week: 1 });
      } else {
        setSelectedWeek({ year, month, week: week + 1 });
      }
    } else {
      if (week <= 1) {
        setSelectedWeek({ year, month: month - 1, week: 4 });
      } else {
        setSelectedWeek({ year, month, week: week - 1 });
      }
    }
  };

  const { start, end } = getWeekDates(selectedWeek.year, selectedWeek.month, selectedWeek.week);
  const monthName = new Date(selectedWeek.year, selectedWeek.month - 1).toLocaleDateString('en-US', { month: 'long' });

  const generateWeeklyReport = async () => {
    if (isGeneratingReport) return;
    
    setIsGeneratingReport(true);
    
    try {
      toast({
        title: "Generating Report",
        description: "Creating weekly report with equipment, maintenance & consumables data...",
        duration: 3000
      });

      // Calculate actual date range for the selected week
      const startDate = new Date(selectedWeek.year, selectedWeek.month - 1, (selectedWeek.week - 1) * 7 + 1);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999); // End of day

      const reportData = {
        city: selectedCity,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };

      console.log('Sending weekly report request:', reportData);
      await api.analytics.exportReport('pdf', 'weekly', reportData);
      
      toast({
        title: "Report Generated",
        description: `Weekly report for ${monthName} Week ${selectedWeek.week} has been downloaded`,
        duration: 4000
      });
    } catch (error: any) {
      console.error('Error generating weekly report:', error);
      toast({
        title: "Export Failed", 
        description: error.message || "Failed to generate weekly report",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="flex items-center gap-4 bg-gradient-card rounded-lg p-4 border border-border/50">
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-primary" />
        <span className="text-sm text-muted-foreground">Week Picker</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateWeek('prev')}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2 px-4">
          <Badge variant="outline" className="font-mono">
            {selectedWeek.year}
          </Badge>
          <Badge variant="outline">
            {monthName}
          </Badge>
          <Badge variant="secondary">
            Week {selectedWeek.week}
          </Badge>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateWeek('next')}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="text-sm text-muted-foreground">
        {start} - {end}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={generateWeeklyReport}
        disabled={isGeneratingReport}
        className="ml-auto flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        {isGeneratingReport ? "Generating..." : "Weekly Report"}
      </Button>
    </div>
  );
}