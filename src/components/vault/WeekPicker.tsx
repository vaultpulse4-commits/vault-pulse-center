import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useVaultStore } from "@/store/vaultStore";
import { ChevronLeft, ChevronRight, Calendar, Download } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Card } from "@/components/ui/card";

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
    <Card className="bg-gradient-card border-border/50">
      <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">Week Picker</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            Week {selectedWeek.week}
          </Badge>
        </div>

        {/* Navigation Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
          {/* Month/Year */}
          <div className="text-xs sm:text-sm font-medium whitespace-nowrap">
            {monthName} {selectedWeek.year}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek('prev')}
              className="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 sm:flex-none text-center text-xs sm:text-sm text-muted-foreground bg-muted/30 px-2 sm:px-3 py-1 rounded whitespace-nowrap">
              {start} - {end}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek('next')}
              className="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Generate Report Button */}
          <Button
            onClick={generateWeeklyReport}
            disabled={isGeneratingReport}
            size="sm"
            className="w-full sm:w-auto text-xs sm:text-sm px-2 sm:px-3 h-7 sm:h-8 ml-auto sm:ml-0"
          >
            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
            <span className="hidden sm:inline">Weekly Report</span>
            <span className="sm:hidden">Report</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}