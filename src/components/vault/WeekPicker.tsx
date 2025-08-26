import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useVaultStore } from "@/store/vaultStore";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

export function WeekPicker() {
  const { selectedWeek, setSelectedWeek } = useVaultStore();
  
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
    </div>
  );
}