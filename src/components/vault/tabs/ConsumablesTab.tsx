import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { Package, Plus, Edit, Trash2, AlertTriangle, TrendingDown, TrendingUp, History, BarChart3, ShoppingCart } from "lucide-react";
import { api } from "@/lib/api";
import { usePermission } from "@/lib/permissions";
import { useToast } from "@/hooks/use-toast";
import { useVaultStore } from "@/store/vaultStore";

interface Consumable {
  id: string;
  name: string;
  category: string;
  description: string | null;
  currentStock: number;
  minStock: number;
  maxStock: number | null;
  reorderPoint: number;
  reorderQty: number;
  unit: string;
  unitCost: number;
  location: string | null;
  image: string | null;
  city: string;
  createdAt: string;
  updatedAt: string;
}

interface StockMovement {
  id: string;
  type: string;
  quantity: number;
  balanceBefore: number;
  balanceAfter: number;
  unitCost: number | null;
  totalCost: number | null;
  reference: string | null;
  notes: string | null;
  performedBy: string | null;
  createdAt: string;
}

interface StockAnalytics {
  totalUsage: number;
  totalReturns: number;
  totalPurchases: number;
  totalCost: number;
  averageUsagePerDay: number;
  usageByType: Record<string, number>;
}

export function ConsumablesTab() {
  const { selectedCity } = useVaultStore();
  const { toast } = useToast();
  const canView = usePermission('view:consumables');
  const canEdit = usePermission('edit:consumables');
  
  const [consumables, setConsumables] = useState<Consumable[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConsumable, setEditingConsumable] = useState<Consumable | null>(null);
  const [selectedConsumable, setSelectedConsumable] = useState<Consumable | null>(null);
  const [showMovements, setShowMovements] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showStockAdjust, setShowStockAdjust] = useState(false);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [analytics, setAnalytics] = useState<StockAnalytics | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    reorderPoint: 0,
    reorderQty: 0,
    unit: '',
    unitCost: 0,
    location: '',
    supplierId: ''
  });

  const [adjustData, setAdjustData] = useState({
    quantity: 0,
    type: 'Purchase',
    reference: '',
    notes: '',
    performedBy: ''
  });

  useEffect(() => {
    if (selectedCity) {
      loadConsumables();
      loadSuppliers();
    }
  }, [selectedCity]);

  const loadConsumables = async () => {
    try {
      setLoading(true);
      const data = await api.consumables.getAll(selectedCity);
      setConsumables(data);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to load consumables",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSuppliers = async () => {
    try {
      const data = await api.suppliers.getAll(selectedCity);
      setSuppliers(data);
    } catch (err: any) {
      console.error("Failed to load suppliers:", err);
    }
  };

  const loadMovements = async (id: string) => {
    try {
      const data = await api.consumables.getMovements(id, 1, 20);
      setMovements(data.movements || data);
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to load stock movements",
        variant: "destructive"
      });
    }
  };

  const loadAnalytics = async (id: string) => {
    try {
      const data = await api.consumables.getAnalytics(id);
      setAnalytics(data);
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to load analytics",
        variant: "destructive"
      });
    }
  };

  const deleteMovement = async (movementId: string) => {
    if (!confirm('Are you sure you want to delete this movement? This will affect stock calculations.')) {
      return;
    }
    
    try {
      await api.consumables.deleteMovement(movementId);
      toast({ title: "Success", description: "Movement deleted successfully" });
      if (selectedConsumable) {
        loadMovements(selectedConsumable.id);
        loadConsumables(); // Reload to update stock levels
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete movement",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', category: '', description: '',
      currentStock: 0, minStock: 0, maxStock: 0, reorderPoint: 0,
      reorderQty: 0, unit: '', unitCost: 0, location: '', supplierId: ''
    });
    setEditingConsumable(null);
  };

  const handleEdit = (consumable: Consumable) => {
    setEditingConsumable(consumable);
    setFormData({
      name: consumable.name,
      category: consumable.category,
      description: consumable.description || '',
      currentStock: consumable.currentStock,
      minStock: consumable.minStock,
      maxStock: consumable.maxStock || 0,
      reorderPoint: consumable.reorderPoint,
      reorderQty: consumable.reorderQty,
      unit: consumable.unit,
      unitCost: consumable.unitCost,
      location: consumable.location || '',
      supplierId: (consumable as any).supplierId || ''
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.category || !formData.unit) {
      toast({
        title: "Validation Error",
        description: "Please fill in required fields: Name, Category, and Unit",
        variant: "destructive"
      });
      return;
    }

    try {
      const payload = {
        ...formData,
        city: selectedCity,
        description: formData.description || null,
        maxStock: formData.maxStock || null,
        location: formData.location || null,
        supplierId: formData.supplierId || null
      };

      if (editingConsumable) {
        await api.consumables.update(editingConsumable.id, payload);
        toast({ title: "Success", description: "Consumable updated successfully" });
      } else {
        await api.consumables.create(payload);
        toast({ title: "Success", description: "Consumable added successfully" });
      }
      
      resetForm();
      setIsDialogOpen(false);
      loadConsumables();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to save consumable",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this consumable?')) return;
    
    try {
      await api.consumables.delete(id);
      toast({ title: "Success", description: "Consumable deleted successfully" });
      loadConsumables();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete consumable",
        variant: "destructive"
      });
    }
  };

  const handleStockAdjust = async () => {
    if (!selectedConsumable || !adjustData.performedBy) {
      toast({
        title: "Validation Error",
        description: "Please provide performed by name",
        variant: "destructive"
      });
      return;
    }

    try {
      await api.consumables.adjustStock(selectedConsumable.id, adjustData);
      toast({ title: "Success", description: "Stock adjusted successfully" });
      setShowStockAdjust(false);
      setAdjustData({ quantity: 0, type: 'Purchase', reference: '', notes: '', performedBy: '' });
      loadConsumables();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to adjust stock",
        variant: "destructive"
      });
    }
  };

  const handleViewMovements = (consumable: Consumable) => {
    setSelectedConsumable(consumable);
    loadMovements(consumable.id);
    setShowMovements(true);
  };

  const handleViewAnalytics = (consumable: Consumable) => {
    setSelectedConsumable(consumable);
    loadAnalytics(consumable.id);
    setShowAnalytics(true);
  };

  const handleAdjustStock = (consumable: Consumable) => {
    setSelectedConsumable(consumable);
    setShowStockAdjust(true);
  };

  const getStockStatus = (consumable: Consumable) => {
    if (consumable.currentStock <= consumable.reorderPoint) {
      return { label: 'Critical', color: 'bg-destructive' };
    } else if (consumable.currentStock <= consumable.minStock) {
      return { label: 'Low', color: 'bg-warning' };
    } else {
      return { label: 'Good', color: 'bg-success' };
    }
  };

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">You don't have permission to view consumables.</p>
      </div>
    );
  }

  const criticalStock = consumables.filter(c => c.currentStock <= c.reorderPoint).length;
  const lowStock = consumables.filter(c => c.currentStock > c.reorderPoint && c.currentStock <= c.minStock).length;
  const totalValue = consumables.reduce((sum, c) => sum + (c.currentStock * c.unitCost), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Consumables - {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}</h3>
        {canEdit && (
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button variant="default">
                <Plus className="h-4 w-4 mr-2" />
                Add Consumable
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingConsumable ? 'Edit Consumable' : 'Add New Consumable'}</DialogTitle>
                <DialogDescription>
                  {editingConsumable ? 'Update consumable details' : 'Add a new consumable to inventory'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., CO₂ Cartridges"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="e.g., SFX, Audio, Lighting"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Optional description"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentStock">Current Stock</Label>
                    <Input
                      id="currentStock"
                      type="number"
                      step="0.01"
                      value={formData.currentStock}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentStock: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit">Unit *</Label>
                    <Input
                      id="unit"
                      value={formData.unit}
                      onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                      placeholder="e.g., pcs, liters, kg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="minStock">Min Stock</Label>
                    <Input
                      id="minStock"
                      type="number"
                      value={formData.minStock}
                      onChange={(e) => setFormData(prev => ({ ...prev, minStock: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxStock">Max Stock</Label>
                    <Input
                      id="maxStock"
                      type="number"
                      value={formData.maxStock}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxStock: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reorderPoint">Reorder Point</Label>
                    <Input
                      id="reorderPoint"
                      type="number"
                      value={formData.reorderPoint}
                      onChange={(e) => setFormData(prev => ({ ...prev, reorderPoint: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reorderQty">Reorder Quantity</Label>
                    <Input
                      id="reorderQty"
                      type="number"
                      value={formData.reorderQty}
                      onChange={(e) => setFormData(prev => ({ ...prev, reorderQty: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="unitCost">Unit Cost (IDR)</Label>
                    <Input
                      id="unitCost"
                      type="number"
                      step="0.01"
                      value={formData.unitCost}
                      onChange={(e) => setFormData(prev => ({ ...prev, unitCost: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g., Warehouse A, Shelf B3"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="supplier">Supplier (Optional)</Label>
                    <Select
                      value={formData.supplierId || undefined}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, supplierId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier (optional)..." />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map(supplier => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name} {supplier.code ? `(${supplier.code})` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit}>
                    {editingConsumable ? 'Update' : 'Create'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Total Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consumables.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-destructive" />
              Critical Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{criticalStock}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingDown className="h-4 w-4 mr-2 text-warning" />
              Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{lowStock}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Total Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {totalValue.toLocaleString('id-ID')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Consumables List */}
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="text-muted-foreground">Loading consumables...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {consumables.map((consumable) => {
            const status = getStockStatus(consumable);
            return (
              <Card key={consumable.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base">{consumable.name}</CardTitle>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{consumable.category}</Badge>
                        <Badge className={`text-xs ${status.color}`}>{status.label}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1 text-sm">
                    {consumable.sku && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">SKU:</span>
                        <span className="font-medium">{consumable.sku}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current Stock:</span>
                      <span className="font-bold">{consumable.currentStock} {consumable.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Min / Reorder:</span>
                      <span>{consumable.minStock} / {consumable.reorderPoint}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Unit Cost:</span>
                      <span>Rp {consumable.unitCost.toLocaleString('id-ID')}</span>
                    </div>
                    {consumable.location && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span>{consumable.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {canEdit && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleAdjustStock(consumable)}>
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Adjust
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(consumable)}>
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(consumable.id)}>
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="outline" onClick={() => handleViewMovements(consumable)}>
                      <History className="h-3 w-3 mr-1" />
                      History
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleViewAnalytics(consumable)}>
                      <BarChart3 className="h-3 w-3 mr-1" />
                      Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Stock Adjustment Dialog */}
      <Dialog open={showStockAdjust} onOpenChange={setShowStockAdjust}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Stock - {selectedConsumable?.name}</DialogTitle>
            <DialogDescription>
              Current stock: {selectedConsumable?.currentStock} {selectedConsumable?.unit}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="adjustQuantity">Quantity *</Label>
              <Input
                id="adjustQuantity"
                type="number"
                step="0.01"
                min="0"
                value={adjustData.quantity}
                onChange={(e) => setAdjustData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                placeholder="Enter amount (always positive number)"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {adjustData.type === 'Purchase' && '✓ Will ADD to stock'}
                {adjustData.type === 'Usage' && '✗ Will REMOVE from stock'}
                {adjustData.type === 'Return' && '✗ Will REMOVE from stock'}
              </p>
            </div>
            <div>
              <Label htmlFor="adjustType">Type</Label>
              <Select value={adjustData.type} onValueChange={(value) => setAdjustData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Purchase">Purchase</SelectItem>
                  <SelectItem value="Usage">Usage</SelectItem>
                  <SelectItem value="Return">Return</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="adjustReference">Reference</Label>
              <Input
                id="adjustReference"
                value={adjustData.reference}
                onChange={(e) => setAdjustData(prev => ({ ...prev, reference: e.target.value }))}
                placeholder="e.g., PO-001, Event Name"
              />
            </div>
            <div>
              <Label htmlFor="adjustNotes">Notes</Label>
              <Textarea
                id="adjustNotes"
                value={adjustData.notes}
                onChange={(e) => setAdjustData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Optional notes"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="adjustPerformedBy">Performed By *</Label>
              <Input
                id="adjustPerformedBy"
                value={adjustData.performedBy}
                onChange={(e) => setAdjustData(prev => ({ ...prev, performedBy: e.target.value }))}
                placeholder="Your name"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowStockAdjust(false)}>Cancel</Button>
              <Button onClick={handleStockAdjust}>Adjust Stock</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Movements Dialog */}
      <Dialog open={showMovements} onOpenChange={setShowMovements}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Stock Movements - {selectedConsumable?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {movements.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No movements yet</p>
            ) : (
              movements.map((movement) => (
                <Card key={movement.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge>{movement.type}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(movement.createdAt).toLocaleString('id-ID')}
                          </span>
                          {canEdit && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteMovement(movement.id)}
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Quantity: </span>
                          <span className={movement.quantity >= 0 ? 'text-success' : 'text-destructive'}>
                            {movement.quantity >= 0 ? '+' : ''}{movement.quantity}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Balance: {movement.balanceBefore} → {movement.balanceAfter}
                        </div>
                        {movement.reference && (
                          <div className="text-sm"><span className="font-medium">Reference:</span> {movement.reference}</div>
                        )}
                        {movement.notes && (
                          <div className="text-sm"><span className="font-medium">Notes:</span> {movement.notes}</div>
                        )}
                        {movement.performedBy && (
                          <div className="text-sm text-muted-foreground">By: {movement.performedBy}</div>
                        )}
                      </div>
                      {movement.totalCost && (
                        <div className="text-right">
                          <div className="text-sm font-medium">Rp {movement.totalCost.toLocaleString('id-ID')}</div>
                          {movement.unitCost && (
                            <div className="text-xs text-muted-foreground">@ Rp {movement.unitCost.toLocaleString('id-ID')}</div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Analytics Dialog */}
      <Dialog open={showAnalytics} onOpenChange={setShowAnalytics}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Analytics - {selectedConsumable?.name}</DialogTitle>
            <DialogDescription>Last 30 days statistics</DialogDescription>
          </DialogHeader>
          {analytics ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-destructive">Total Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-destructive">{analytics.totalUsage || 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-success">Total Purchased</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-success">{analytics.totalPurchases || 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-warning">Total Returns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-warning">{analytics.totalReturns || 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Avg Daily Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{(analytics.averageUsagePerDay || 0).toFixed(2)}</div>
                  </CardContent>
                </Card>
                <Card className="col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Total Cost</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Rp {(analytics.totalCost || 0).toLocaleString('id-ID')}</div>
                  </CardContent>
                </Card>
              </div>
              {analytics.usageByType && Object.keys(analytics.usageByType).length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Usage Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {Object.entries(analytics.usageByType).map(([type, qty]) => (
                        <div key={type} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{type}:</span>
                          <span className="font-medium">{qty}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">Loading analytics...</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
