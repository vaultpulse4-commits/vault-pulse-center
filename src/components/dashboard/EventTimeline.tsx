import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDashboardStore } from "@/store/dashboardStore";
import { Calendar, Clock, Users } from "lucide-react";

export function EventTimeline() {
  const { events } = useDashboardStore();
  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-secondary" />
          Event Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.map((event, index) => {
          const getStatusColor = (status: "upcoming" | "in-progress" | "completed") => {
            switch (status) {
              case "in-progress":
                return "bg-gradient-primary";
              case "upcoming":
                return "bg-gradient-secondary";
              case "completed":
                return "bg-muted";
              default:
                return "bg-muted";
            }
          };

          return (
          <div
            key={event.id}
            className="relative flex gap-4 p-4 rounded-lg bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors"
          >
            <div className={`w-1 h-full rounded-full ${getStatusColor(event.status)}`} />
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-foreground">{event.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {event.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Setup: {event.setup} | Event: {event.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {event.capacity}
                    </span>
                  </div>
                </div>
                <Badge 
                  variant={event.status === "in-progress" ? "default" : "outline"}
                  className={event.status === "in-progress" ? "bg-primary text-primary-foreground" : ""}
                >
                  {event.status === "in-progress" ? "Live" : "Upcoming"}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1">
                {event.techRequirements.map((req, reqIndex) => (
                  <Badge
                    key={reqIndex}
                    variant="secondary"
                    className="text-xs bg-secondary/20 text-secondary"
                  >
                    {req}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          );
        })}
      </CardContent>
    </Card>
  );
}