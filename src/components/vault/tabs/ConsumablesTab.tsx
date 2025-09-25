import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVaultStore, Consumable } from "@/store/vaultStore";
import { useState } from "react";
import { Package, Plus, Edit, Trash2, AlertTriangle, TrendingDown, ShoppingCart, CheckCircle } from "lucide-react";

export function ConsumablesTab() {
  const { selectedCity, consumables, addConsumable, updateConsumable } = useVaultStore();
  const cityConsumables = consumables.filter(consumable => consumable.city === selectedCity);
  const [isNewConsumableOpen, setIsNewConsumableOpen] = useState(false);
  const [editingConsumable, setEditingConsumable] = useState<Consumable | null>(null);
  const [orderStatus, setOrderStatus] = useState<Record<string, 'pending' | 'ordered' | 'delivered'>>({});
  const [newConsumable, setNewConsumable] = useState({
    name: '',
    category: '',
    currentStock: 0,
    weeklyUsage: 0,
    reorderPoint: 0,
    unit: '',
    supplier: '',
    lastOrdered: ''
  });

  const handleCreateConsumable = () => {
    if (newConsumable.name && newConsumable.category) {
      addConsumable({
        ...newConsumable,
        city: selectedCity
      });
      setNewConsumable({
        name: '', category: '', currentStock: 0, weeklyUsage: 0,
        reorderPoint: 0, unit: '', supplier: '', lastOrdered: ''
      });
      setIsNewConsumableOpen(false);
    }
  };

  const handleEditConsumable = (consumable: Consumable) => {
    setEditingConsumable(consumable);
    setNewConsumable({
      name: consumable.name,
      category: consumable.category,
      currentStock: consumable.currentStock,
      weeklyUsage: consumable.weeklyUsage,
      reorderPoint: consumable.reorderPoint,
      unit: consumable.unit,
      supplier: consumable.supplier,
      lastOrdered: consumable.lastOrdered
    });
  };

  const handleSaveEdit = () => {
    if (editingConsumable) {
      updateConsumable(editingConsumable.id, newConsumable);
      setEditingConsumable(null);
      setNewConsumable({
        name: '', category: '', currentStock: 0, weeklyUsage: 0,
        reorderPoint: 0, unit: '', supplier: '', lastOrdered: ''
      });
    }
  };

  const needsReorder = (current: number, reorderPoint: number) => current <= reorderPoint;
  const lowStock = (current: number, reorderPoint: number) => current <= reorderPoint * 1.5 && current > reorderPoint;

  const criticalCount = cityConsumables.filter(c => needsReorder(c.currentStock, c.reorderPoint)).length;
  const lowStockCount = cityConsumables.filter(c => lowStock(c.currentStock, c.reorderPoint)).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Consumables - {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}</h3>
        <Dialog open={isNewConsumableOpen} onOpenChange={setIsNewConsumableOpen}>
          <DialogTrigger asChild>
            <Button variant="default">
              <Plus className="h-4 w-4 mr-2" />
              Add Consumable
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingConsumable ? 'Edit Consumable' : 'Add New Consumable'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newConsumable.name}
                    onChange={(e) => setNewConsumable(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., CO₂ Cartridges"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newConsumable.category}
                    onChange={(e) => setNewConsumable(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., SFX"
                  />
                </div>
                <div>
                  <Label htmlFor="currentStock">Current Stock</Label>
                  <Input
                    id="currentStock"
                    type="number"
                    value={newConsumable.currentStock}
                    onChange={(e) => setNewConsumable(prev => ({ ...prev, currentStock: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="weeklyUsage">Weekly Usage</Label>
                  <Input
                    id="weeklyUsage"
                    type="number"
                    value={newConsumable.weeklyUsage}
                    onChange={(e) => setNewConsumable(prev => ({ ...prev, weeklyUsage: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="reorderPoint">Reorder Point</Label>
                  <Input
                    id="reorderPoint"
                    type="number"
                    value={newConsumable.reorderPoint}
                    onChange={(e) => setNewConsumable(prev => ({ ...prev, reorderPoint: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    value={newConsumable.unit}
                    onChange={(e) => setNewConsumable(prev => ({ ...prev, unit: e.target.value }))}
                    placeholder="e.g., pieces, kg, liters"
                  />
                </div>
                <div>
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input
                    id="supplier"
                    value={newConsumable.supplier}
                    onChange={(e) => setNewConsumable(prev => ({ ...prev, supplier: e.target.value }))}
                    placeholder="Supplier name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastOrdered">Last Ordered</Label>
                  <Input
                    id="lastOrdered"
                    type="date"
                    value={newConsumable.lastOrdered}
                    onChange={(e) => setNewConsumable(prev => ({ ...prev, lastOrdered: e.target.value }))}
                  />
                </div>
              </div>
              <Button 
                onClick={editingConsumable ? handleSaveEdit : handleCreateConsumable} 
                className="w-full"
              >
                {editingConsumable ? 'Save Changes' : 'Add Consumable'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <div>
                <div className="text-xs text-muted-foreground">Critical Stock</div>
                <div className="text-lg font-bold">{criticalCount}</div>
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
                <div className="text-lg font-bold">{lowStockCount}</div>
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
                <div className="text-lg font-bold">{cityConsumables.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-success" />
              <div>
                <div className="text-xs text-muted-foreground">Orders Placed</div>
                <div className="text-lg font-bold">{Object.values(orderStatus).filter(s => s === 'ordered').length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Consumables List */}
      <div className="space-y-4">
        {cityConsumables.map((consumable) => {
          const needsReorderStatus = needsReorder(consumable.currentStock, consumable.reorderPoint);
          const lowStockStatus = lowStock(consumable.currentStock, consumable.reorderPoint);
          
          return (
            <Card key={consumable.id} className="bg-gradient-card border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    {consumable.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={needsReorderStatus ? 'destructive' : lowStockStatus ? 'secondary' : 'default'}>
                      {needsReorderStatus ? 'Reorder Now' : lowStockStatus ? 'Low Stock' : 'In Stock'}
                    </Badge>
                    <Badge variant="outline">
                      {consumable.category}
                    </Badge>
                    {orderStatus[consumable.id] && (
                      <Badge 
                        variant={orderStatus[consumable.id] === 'delivered' ? 'default' : 'secondary'}
                        className={orderStatus[consumable.id] === 'ordered' ? 'animate-pulse' : ''}
                      >
                        {orderStatus[consumable.id] === 'pending' && 'Pending Order'}
                        {orderStatus[consumable.id] === 'ordered' && (
                          <>
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            Ordered
                          </>
                        )}
                        {orderStatus[consumable.id] === 'delivered' && (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Delivered
                          </>
                        )}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-sm">
                    <div className="text-muted-foreground">Current Stock</div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={consumable.currentStock}
                        onChange={(e) => updateConsumable(consumable.id, { currentStock: Number(e.target.value) })}
                        className="w-16 h-6 text-xs"
                      />
                      <span className="text-xs">{consumable.unit}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <div className="text-muted-foreground">Weekly Usage</div>
                    <div className="font-medium">{consumable.weeklyUsage} {consumable.unit}</div>
                  </div>
                  
                  <div className="text-sm">
                    <div className="text-muted-foreground">Reorder Point</div>
                    <div className="font-medium">{consumable.reorderPoint} {consumable.unit}</div>
                  </div>
                  
                  <div className="text-sm">
                    <div className="text-muted-foreground">Supplier</div>
                    <div className="font-medium">{consumable.supplier}</div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4 pt-4 border-t border-border/30">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditConsumable(consumable)}
                  >
                    <Edit className="h-3 w-3 mr-2" />
                    Edit
                  </Button>
                  
                  <Select 
                    value={orderStatus[consumable.id] || 'pending'} 
                    onValueChange={(value) => setOrderStatus(prev => ({ ...prev, [consumable.id]: value as any }))}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="ordered">Ordered</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant={needsReorderStatus ? "destructive" : "default"}
                    size="sm"
                    className={needsReorderStatus ? "animate-pulse" : ""}
                    onClick={() => {
                      setOrderStatus(prev => ({ ...prev, [consumable.id]: 'ordered' }));
                      updateConsumable(consumable.id, { lastOrdered: new Date().toISOString().split('T')[0] });
                    }}
                  >
                    <ShoppingCart className="h-3 w-3 mr-2" />
                    {orderStatus[consumable.id] === 'ordered' ? 'Reorder' : 'Place Order'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit Dialog */}
      {editingConsumable && (
        <Dialog open={!!editingConsumable} onOpenChange={() => setEditingConsumable(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit {editingConsumable.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editName">Name</Label>
                  <Input
                    id="editName"
                    value={newConsumable.name}
                    onChange={(e) => setNewConsumable(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="editCategory">Category</Label>
                  <Input
                    id="editCategory"
                    value={newConsumable.category}
                    onChange={(e) => setNewConsumable(prev => ({ ...prev, category: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="editCurrentStock">Current Stock</Label>
                  <Input
                    id="editCurrentStock"
                    type="number"
                    value={newConsumable.currentStock}
                    onChange={(e) => setNewConsumable(prev => ({ ...prev, currentStock: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="editWeeklyUsage">Weekly Usage</Label>
                  <Input
                    id="editWeeklyUsage"
                    type="number"
                    value={newConsumable.weeklyUsage}
                    onChange={(e) => setNewConsumable(prev => ({ ...prev, weeklyUsage: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="editReorderPoint">Reorder Point</Label>
                  <Input
                    id="editReorderPoint"
                    type="number"
                    value={newConsumable.reorderPoint}
                    onChange={(e) => setNewConsumable(prev => ({ ...prev, reorderPoint: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="editUnit">Unit</Label>
                  <Input
                    id="editUnit"
                    value={newConsumable.unit}
                    onChange={(e) => setNewConsumable(prev => ({ ...prev, unit: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="editSupplier">Supplier</Label>
                  <Input
                    id="editSupplier"
                    value={newConsumable.supplier}
                    onChange={(e) => setNewConsumable(prev => ({ ...prev, supplier: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="editLastOrdered">Last Ordered</Label>
                  <Input
                    id="editLastOrdered"
                    type="date"
                    value={newConsumable.lastOrdered}
                    onChange={(e) => setNewConsumable(prev => ({ ...prev, lastOrdered: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setEditingConsumable(null)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit} className="flex-1">
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}