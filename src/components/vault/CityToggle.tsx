import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useVaultStore, City } from "@/store/vaultStore";
import { MapPin, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

export function CityToggle() {
  const { selectedCity, setSelectedCity } = useVaultStore();
  
  const cities = [
    { id: 'jakarta' as City, name: 'Jakarta', timezone: 'WIB (UTC+7)', opsdays: 'Wed–Sat' },
    { id: 'bali' as City, name: 'Bali', timezone: 'WITA (UTC+8)', opsdays: 'Mon, Wed–Sat' }
  ];

  return (
    <Card className="bg-gradient-card border-border/50">
      <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium text-muted-foreground">Location</span>
        </div>
        
        {/* City Toggle Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {cities.map((city) => (
            <Button
              key={city.id}
              variant={selectedCity === city.id ? "default" : "outline"}
              onClick={() => setSelectedCity(city.id)}
              className="h-auto p-2 sm:p-3 flex flex-col items-start gap-1.5 text-left"
            >
              <div className="flex items-center gap-2 w-full justify-between">
                <span className="font-semibold text-xs sm:text-sm">{city.name}</span>
                {selectedCity === city.id && (
                  <Badge variant="secondary" className="text-xs flex-shrink-0">Active</Badge>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs opacity-80 w-full">
                <Clock className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{city.timezone}</span>
              </div>
              <div className="text-xs opacity-60 w-full">
                Ops: {city.opsdays}
              </div>
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}