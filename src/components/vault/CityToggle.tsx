import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useVaultStore, City } from "@/store/vaultStore";
import { MapPin, Clock } from "lucide-react";

export function CityToggle() {
  const { selectedCity, setSelectedCity } = useVaultStore();
  
  const cities = [
    { id: 'jakarta' as City, name: 'Jakarta', timezone: 'WIB (UTC+7)', opsdays: 'Wed–Sat' },
    { id: 'bali' as City, name: 'Bali', timezone: 'WITA (UTC+8)', opsdays: 'Mon, Wed–Sat' }
  ];

  return (
    <div className="flex items-center gap-4 bg-gradient-card rounded-lg p-4 border border-border/50">
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5 text-primary" />
        <span className="text-sm text-muted-foreground">Location</span>
      </div>
      
      <div className="flex gap-2">
        {cities.map((city) => (
          <Button
            key={city.id}
            variant={selectedCity === city.id ? "default" : "outline"}
            onClick={() => setSelectedCity(city.id)}
            className="h-auto p-3 flex flex-col items-start gap-1"
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold">{city.name}</span>
              {selectedCity === city.id && (
                <Badge variant="secondary" className="text-xs">Active</Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs opacity-80">
              <Clock className="h-3 w-3" />
              {city.timezone}
            </div>
            <div className="text-xs opacity-60">
              Ops: {city.opsdays}
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}