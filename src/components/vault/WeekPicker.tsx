import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useVaultStore } from "@/store/vaultStore";
import { ChevronLeft, ChevronRight, Calendar, Download, CalendarRange } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, isThisWeek } from "date-fns";

type WeekMode = 'current' | 'custom';

export function WeekPicker() {
  const { selectedWeek, setSelectedWeek, selectedCity } = useVaultStore();
  const { toast } = useToast();
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [weekMode, setWeekMode] = useState<WeekMode>('current');
  
  // Current week auto mode (Monday to Sunday)
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [currentWeekEnd, setCurrentWeekEnd] = useState<Date>(endOfWeek(new Date(), { weekStartsOn: 1 }));
  
  // Custom mode
  const [customStartDate, setCustomStartDate] = useState<Date>();
  const [customEndDate, setCustomEndDate] = useState<Date>();
  
  // Update current week automatically every day
  useEffect(() => {
    const updateCurrentWeek = () => {
      const now = new Date();
      setCurrentWeekStart(startOfWeek(now, { weekStartsOn: 1 }));
      setCurrentWeekEnd(endOfWeek(now, { weekStartsOn: 1 }));
    };
    
    updateCurrentWeek();
    const interval = setInterval(updateCurrentWeek, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);
  
  // Quick week navigation in current mode
  const navigateCurrentWeek = (direction: 'prev' | 'next') => {
    if (direction === 'next') {
      setCurrentWeekStart(addWeeks(currentWeekStart, 1));
      setCurrentWeekEnd(addWeeks(currentWeekEnd, 1));
    } else {
      setCurrentWeekStart(subWeeks(currentWeekStart, 1));
      setCurrentWeekEnd(subWeeks(currentWeekEnd, 1));
    }
  };
  
  // Get active date range based on mode
  const getActiveDateRange = () => {
    if (weekMode === 'current') {
      return {
        start: currentWeekStart,
        end: currentWeekEnd
      };
    } else {
      return {
        start: customStartDate || currentWeekStart,
        end: customEndDate || currentWeekEnd
      };
    }
  };
  
  const { start: startDate, end: endDate } = getActiveDateRange();
  const isCurrentWeek = isThisWeek(startDate, { weekStartsOn: 0 });

  const generateWeeklyReport = async () => {
    if (isGeneratingReport) return;
    
    const { start, end } = getActiveDateRange();
    
    setIsGeneratingReport(true);
    
    try {
      toast({
        title: "Generating Report",
        description: "Creating weekly report with equipment, maintenance & consumables data...",
        duration: 3000
      });

      const reportData = {
        city: selectedCity,
        startDate: start.toISOString(),
        endDate: new Date(end.getTime() + 86399999).toISOString() // End of day
      };

      console.log('Sending weekly report request:', reportData);
      await api.analytics.exportReport('pdf', 'weekly', reportData);
      
      toast({
        title: "Report Generated",
        description: `Weekly report (${format(start, 'MMM d')} - ${format(end, 'MMM d')}) downloaded`,
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

  const { start: activeStart, end: activeEnd } = getActiveDateRange();
  const isCurrentWeekActive = isThisWeek(activeStart, { weekStartsOn: 1 });

  return (
    <Card className="bg-gradient-card border-border/50">
      <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
        {/* Header with Mode Tabs */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">Week Picker</span>
          </div>
          <Tabs value={weekMode} onValueChange={(v) => setWeekMode(v as WeekMode)}>
            <TabsList className="h-7">
              <TabsTrigger value="current" className="text-xs h-6">Current Week</TabsTrigger>
              <TabsTrigger value="custom" className="text-xs h-6">Custom Range</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Tabs value={weekMode} onValueChange={(v) => setWeekMode(v as WeekMode)}>
          {/* Current Week Mode */}
          <TabsContent value="current" className="mt-0 space-y-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              {/* Navigation Buttons */}
              <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateCurrentWeek(-1)}
                  disabled={isGeneratingReport}
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex-1 sm:flex-none text-center text-xs sm:text-sm text-muted-foreground bg-muted/30 px-2 sm:px-3 py-1 rounded whitespace-nowrap">
                  {format(activeStart, 'MMM d')} - {format(activeEnd, 'MMM d, yyyy')}
                  {isCurrentWeekActive && (
                    <span className="ml-2 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      Now
                    </span>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateCurrentWeek(1)}
                  disabled={isGeneratingReport || isCurrentWeekActive}
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
                {isGeneratingReport ? (
                  <>
                    <div className="h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                    <span className="hidden sm:inline">Generating...</span>
                    <span className="sm:hidden">Wait</span>
                  </>
                ) : (
                  <>
                    <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                    <span className="hidden sm:inline">Weekly Report</span>
                    <span className="sm:hidden">Report</span>
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Custom Range Mode */}
          <TabsContent value="custom" className="mt-0 space-y-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              {/* Date Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full sm:w-auto justify-start text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3"
                  >
                    <CalendarRange className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                    {format(activeStart, 'MMM d')} - {format(activeEnd, 'MMM d, yyyy')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={customStartDate}
                    onSelect={(date) => {
                      if (date) {
                        const weekStart = startOfWeek(date, { weekStartsOn: 1 });
                        const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
                        setCustomStartDate(weekStart);
                        setCustomEndDate(weekEnd);
                      }
                    }}
                    initialFocus
                  />
                  <div className="p-3 border-t text-xs text-muted-foreground">
                    Click any date to select its full week (Mon-Sun)
                  </div>
                </PopoverContent>
              </Popover>

              {/* Generate Report Button */}
              <Button
                onClick={generateWeeklyReport}
                disabled={isGeneratingReport}
                size="sm"
                className="w-full sm:w-auto text-xs sm:text-sm px-2 sm:px-3 h-7 sm:h-8 ml-auto sm:ml-0"
              >
                {isGeneratingReport ? (
                  <>
                    <div className="h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                    <span className="hidden sm:inline">Generating...</span>
                    <span className="sm:hidden">Wait</span>
                  </>
                ) : (
                  <>
                    <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                    <span className="hidden sm:inline">Weekly Report</span>
                    <span className="sm:hidden">Report</span>
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}