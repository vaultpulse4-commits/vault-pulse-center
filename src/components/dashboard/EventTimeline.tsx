import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users } from "lucide-react";

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  setup: string;
  capacity: number;
  techRequirements: string[];
  status: "upcoming" | "in-progress" | "completed";
}

const mockEvents: Event[] = [
  {
    id: "1",
    name: "Electric Friday",
    date: "Today",
    time: "22:00",
    setup: "20:00",
    capacity: 850,
    techRequirements: ["Full LED Wall", "Laser Show", "Fog Effects"],
    status: "in-progress"
  },
  {
    id: "2",
    name: "Saturday Night Fever",
    date: "Tomorrow",
    time: "21:30",
    setup: "19:30",
    capacity: 1200,
    techRequirements: ["Projection Mapping", "LED Strips", "Sound Enhancement"],
    status: "upcoming"
  },
  {
    id: "3",
    name: "Sunday Sessions",
    date: "Sun, Dec 29",
    time: "20:00",
    setup: "18:00",
    capacity: 600,
    techRequirements: ["Ambient Lighting", "Chill Sound Setup"],
    status: "upcoming"
  }
];

const getStatusColor = (status: Event["status"]) => {
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

export function EventTimeline() {
  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-secondary" />
          Event Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockEvents.map((event, index) => (
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
        ))}
      </CardContent>
    </Card>
  );
}