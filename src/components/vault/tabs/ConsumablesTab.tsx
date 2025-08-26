import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Package, TrendingDown, AlertTriangle, Phone, Calendar } from "lucide-react";

export function ConsumablesTab() {
  const consumables = [
    {
      id: 1,
      name: "CO₂ Cartridges",
      currentStock: 45,
      weeklyUsage: 12,
      reorderPoint: 20,
      unit: "cartridges",
      supplier: "Gas Solutions Jakarta",
      lastOrdered: "2025-08-20",
      leadTime: "3 days"
    },
    {
      id: 2,
      name: "Fog Fluid (Hazer)",
      currentStock: 15,
      weeklyUsage: 8,
      reorderPoint: 10,
      unit: "liters",
      supplier: "Stage Effects Indo",
      lastOrdered: "2025-08-18",
      leadTime: "2 days"
    },
    {
      id: 3,
      name: "Confetti Mix",
      currentStock: 8,
      weeklyUsage: 5,
      reorderPoint: 12,
      unit: "kg",
      supplier: "Party Supplies Bali",
      lastOrdered: "2025-08-15",
      leadTime: "5 days"
    },
    {
      id: 4,
      name: "CDJ Accessories Kit",
      currentStock: 3,
      weeklyUsage: 1,
      reorderPoint: 2,
      unit: "kits",
      supplier: "DJ Pro Indonesia",
      lastOrdered: "2025-08-10",
      leadTime: "7 days"
    },
    {
      id: 5,
      name: "Cleaning Supplies",
      currentStock: 25,
      weeklyUsage: 6,
      reorderPoint: 15,
      unit: "units",
      supplier: "CleanTech Solutions",
      lastOrdered: "2025-08-22",
      leadTime: "1 day"
    }
  ];

  const vendors = [
    {
      name: "Gas Solutions Jakarta",
      contact: "+62 21 1234-5678",
      email: "orders@gassolutions.id",
      sla: "Same day delivery within Jakarta",
      rating: 4.8
    },
    {
      name: "Stage Effects Indo",
      contact: "+62 21 2345-6789",
      email: "sales@stageeffects.co.id",
      sla: "2-day delivery, bulk discounts available",
      rating: 4.6
    },
    {
      name: "Party Supplies Bali",
      contact: "+62 361 789-123",
      email: "bali@partysupplies.id",
      sla: "5-day inter-island shipping",
      rating: 4.3
    },
    {
      name: "DJ Pro Indonesia",
      contact: "+62 21 3456-7890",
      email: "support@djpro.id",
      sla: "Weekly delivery, technical support included",
      rating: 4.9
    },
    {
      name: "CleanTech Solutions",
      contact: "+62 21 4567-8901",
      email: "orders@cleantech.id",
      sla: "Daily delivery, emergency 4-hour service",
      rating: 4.7
    }
  ];

  const getStockStatus = (current: number, reorder: number) => {
    const percentage = (current / reorder) * 100;
    if (current <= reorder) return { variant: 'destructive', text: 'Reorder Now', color: 'text-destructive' };
    if (percentage <= 150) return { variant: 'secondary', text: 'Low Stock', color: 'text-warning' };
    return { variant: 'default', text: 'Good Stock', color: 'text-success' };
  };

  const getWeeksRemaining = (current: number, weekly: number) => {
    return Math.floor(current / weekly);
  };

  const getStockPercentage = (current: number, reorder: number) => {
    return Math.min(100, (current / (reorder * 2)) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Consumables & Vendors</h3>
        <Button variant="outline">
          <Package className="h-4 w-4 mr-2" />
          Place Order
        </Button>
      </div>

      {/* Stock Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <div>
                <div className="text-xs text-muted-foreground">Critical Stock</div>
                <div className="text-lg font-bold">2 Items</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-warning" />
              <div>
                <div className="text-xs text-muted-foreground">Low Stock</div>
                <div className="text-lg font-bold">1 Item</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Total Items</div>
                <div className="text-lg font-bold">5</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-success" />
              <div>
                <div className="text-xs text-muted-foreground">Orders This Week</div>
                <div className="text-lg font-bold">3</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Consumables List */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Stock Levels & Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {consumables.map((item) => {
              const status = getStockStatus(item.currentStock, item.reorderPoint);
              const weeksRemaining = getWeeksRemaining(item.currentStock, item.weeklyUsage);
              const stockPercentage = getStockPercentage(item.currentStock, item.reorderPoint);
              
              return (
                <div key={item.id} className="p-4 bg-muted/30 rounded border border-border/30">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.currentStock} {item.unit} available • {item.weeklyUsage} {item.unit}/week usage
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={status.variant as any}>
                        {status.text}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        {weeksRemaining} weeks left
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Stock Level</span>
                      <span className={status.color}>
                        {item.currentStock}/{item.reorderPoint * 2} {item.unit}
                      </span>
                    </div>
                    <Progress value={stockPercentage} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 pt-3 border-t border-border/30 text-sm">
                    <div>
                      <span className="text-muted-foreground">Supplier:</span>
                      <span className="ml-2">{item.supplier}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Last Ordered:</span>
                      <span className="ml-2">{item.lastOrdered}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Lead Time:</span>
                      <span className="ml-2">{item.leadTime}</span>
                    </div>
                  </div>
                  
                  {item.currentStock <= item.reorderPoint && (
                    <div className="mt-3 pt-3 border-t border-destructive/30">
                      <Button variant="destructive" size="sm" className="w-full">
                        <AlertTriangle className="h-3 w-3 mr-2" />
                        Reorder Now - {item.reorderPoint * 2} {item.unit}
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Vendor Contacts */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            Vendor Contacts & SLA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {vendors.map((vendor, index) => (
              <div key={index} className="p-3 bg-muted/30 rounded border border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{vendor.name}</div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-warning">★</span>
                    <span className="text-sm font-medium">{vendor.rating}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="ml-2">{vendor.contact}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <span className="ml-2">{vendor.email}</span>
                  </div>
                </div>
                
                <div className="text-sm mt-2">
                  <span className="text-muted-foreground">SLA:</span>
                  <span className="ml-2">{vendor.sla}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}