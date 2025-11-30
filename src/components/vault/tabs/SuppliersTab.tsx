import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useVaultStore } from "@/store/vaultStore";
import { useState, useEffect } from "react";
import { Building2, Plus, Edit, Trash2, TrendingUp, ShoppingCart, Phone, Mail, MapPin, Star, DollarSign, Package } from "lucide-react";
import { api } from "@/lib/api";
import { usePermission } from "@/lib/permissions";
import { useToast } from "@/hooks/use-toast";

interface Supplier {
  id: string;
  name: string;
  code: string;
  contactPerson: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string;
  taxId: string | null;
  paymentTerms: string | null;
  rating: number | null;
  status: 'Active' | 'Inactive' | 'Suspended';
  notes: string | null;
  _count?: {
    purchaseOrders: number;
  };
}

interface SupplierStats {
  totalOrders: number;
  totalAmount: number;
  ordersByStatus: Record<string, number>;
  averageOrderValue: number;
  lastOrderDate: Date | null;
}

export function SuppliersTab() {
  const { selectedCity } = useVaultStore();
  const { toast } = useToast();
  const canView = usePermission('view:consumables'); // Using consumables permission for now
  const canEdit = usePermission('edit:consumables');
  
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [supplierStats, setSupplierStats] = useState<SupplierStats | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [relatedConsumables, setRelatedConsumables] = useState<any[]>([]);
  const [relatedProposals, setRelatedProposals] = useState<any[]>([]);
  const [relatedMaintenance, setRelatedMaintenance] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: selectedCity,
    taxId: '',
    paymentTerms: 'Net 30',
    rating: 5,
    status: 'Active' as 'Active' | 'Inactive' | 'Suspended',
    notes: ''
  });

  useEffect(() => {
    if (selectedCity) {
      loadSuppliers();
    }
  }, [selectedCity, statusFilter]);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.suppliers.getAll(
        selectedCity, 
        statusFilter === 'all' ? undefined : statusFilter
      );
      setSuppliers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load suppliers');
      toast({
        title: "Error",
        description: err.message || 'Failed to load suppliers',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSupplierStats = async (supplierId: string) => {
    try {
      const stats = await api.suppliers.getStats(supplierId);
      setSupplierStats(stats);
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to load supplier statistics",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.code) {
      toast({
        title: "Validation Error",
        description: "Name and code are required fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const payload = {
        ...formData,
        city: selectedCity
      };
      
      if (editingSupplier) {
        await api.suppliers.update(editingSupplier.id, payload);
        toast({
          title: "Success",
          description: "Supplier updated successfully"
        });
      } else {
        await api.suppliers.create(payload);
        toast({
          title: "Success",
          description: "Supplier created successfully"
        });
      }
      
      setIsNewDialogOpen(false);
      setEditingSupplier(null);
      resetForm();
      loadSuppliers();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || 'Failed to save supplier',
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this supplier?')) return;
    
    try {
      await api.suppliers.delete(id);
      toast({
        title: "Success",
        description: "Supplier deleted successfully"
      });
      loadSuppliers();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || 'Failed to delete supplier',
        variant: "destructive"
      });
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      code: supplier.code,
      contactPerson: supplier.contactPerson || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || '',
      city: supplier.city as any,
      taxId: supplier.taxId || '',
      rating: supplier.rating || 5,
      status: supplier.status,
      notes: supplier.notes || ''
    });
    setIsNewDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      city: selectedCity,
      taxId: '',
      rating: 5,
      status: 'Active',
      notes: ''
    });
  };

  const handleViewDetails = async (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    loadSupplierStats(supplier.id);
    
    // Load related data using proper relations
    try {
      // Load consumables supplied by this supplier
      const consumables = await api.consumables.getAll(selectedCity);
      setRelatedConsumables(consumables.filter((c: any) => c.supplierId === supplier.id));
      
      // Load proposals where this supplier is used
      const proposals = await api.proposals.getAll(selectedCity);
      setRelatedProposals(proposals.filter((p: any) => p.supplierId === supplier.id));
      
      // Load maintenance records handled by this supplier
      const maintenance = await api.maintenance.getAll(selectedCity);
      setRelatedMaintenance(maintenance.filter((m: any) => m.supplierId === supplier.id));
    } catch (err: any) {
      console.error('Failed to load related data:', err);
    }
  };

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">You don't have permission to view suppliers.</p>
      </div>
    );
  }

  const activeSuppliers = suppliers.filter(s => s.status === 'Active').length;
  const totalOrders = suppliers.reduce((sum, s) => sum + (s._count?.purchaseOrders || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliers.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeSuppliers} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Purchase orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {suppliers.length > 0
                ? (suppliers.reduce((sum, s) => sum + (s.rating || 0), 0) / suppliers.length).toFixed(1)
                : '0.0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Out of 5 stars
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {canEdit && (
          <Dialog open={isNewDialogOpen} onOpenChange={(open) => {
            setIsNewDialogOpen(open);
            if (!open) {
              setEditingSupplier(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Supplier
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
                <DialogDescription>
                  {editingSupplier ? 'Update supplier information' : 'Create a new supplier for inventory management'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Supplier Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Indonesia SFX Supply"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">Supplier Code *</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="SUP-001"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+62 812 3456 7890"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="supplier@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxId">Tax ID / NPWP</Label>
                    <Input
                      id="taxId"
                      value={formData.taxId}
                      onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                      placeholder="00.000.000.0-000.000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Jl. Supplier No. 123"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating (1-5)</Label>
                    <Select 
                      value={String(formData.rating)} 
                      onValueChange={(value) => setFormData({ ...formData, rating: Number(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Star</SelectItem>
                        <SelectItem value="2">2 Stars</SelectItem>
                        <SelectItem value="3">3 Stars</SelectItem>
                        <SelectItem value="4">4 Stars</SelectItem>
                        <SelectItem value="5">5 Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes about this supplier"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsNewDialogOpen(false);
                      setEditingSupplier(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingSupplier ? 'Update' : 'Create'} Supplier
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Suppliers List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Loading suppliers...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-destructive">{error}</p>
        </div>
      ) : suppliers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">No suppliers found</p>
            {canEdit && (
              <Button onClick={() => setIsNewDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Supplier
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suppliers.map((supplier) => (
            <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{supplier.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{supplier.code}</p>
                  </div>
                  <Badge variant={
                    supplier.status === 'Active' ? 'default' :
                    supplier.status === 'Suspended' ? 'destructive' : 'secondary'
                  }>
                    {supplier.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {supplier.contactPerson && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{supplier.contactPerson}</span>
                  </div>
                )}
                {supplier.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{supplier.email}</span>
                  </div>
                )}
                {supplier.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{supplier.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{supplier.city}</span>
                </div>
                {supplier.rating && (
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span>{supplier.rating}/5</span>
                  </div>
                )}
                {supplier._count && (
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>{supplier._count.purchaseOrders} purchase orders</span>
                  </div>
                )}

                {canEdit && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleViewDetails(supplier)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(supplier)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(supplier.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Supplier Details Dialog */}
      <Dialog open={!!selectedSupplier} onOpenChange={(open) => {
        if (!open) {
          setSelectedSupplier(null);
          setRelatedConsumables([]);
          setRelatedProposals([]);
          setRelatedMaintenance([]);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedSupplier?.name}</DialogTitle>
            <DialogDescription>Supplier details and related items</DialogDescription>
          </DialogHeader>
          {selectedSupplier && (
            <div className="space-y-6">
              {/* Statistics */}
              {supplierStats && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">Purchase Statistics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{supplierStats.totalOrders}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          Rp {(supplierStats.totalAmount / 1000).toFixed(0)}K
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Avg Order</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {supplierStats.averageOrderValue && supplierStats.averageOrderValue > 0
                            ? `Rp ${(supplierStats.averageOrderValue / 1000).toFixed(0)}K`
                            : 'N/A'}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Last Order</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm font-medium">
                          {supplierStats.lastOrderDate 
                            ? new Date(supplierStats.lastOrderDate).toLocaleDateString()
                            : 'N/A'}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {Object.keys(supplierStats.ordersByStatus).length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 text-sm">Orders by Status</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(supplierStats.ordersByStatus).map(([status, count]) => (
                          <div key={status} className="flex justify-between p-2 bg-secondary rounded text-sm">
                            <span>{status}</span>
                            <span className="font-bold">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Related Consumables */}
              <div>
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Related Consumables ({relatedConsumables.length})
                </h4>
                {relatedConsumables.length === 0 ? (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">No consumables found for this supplier</p>
                    <p className="text-xs text-muted-foreground italic">Tip: Mention supplier name or code in consumable notes/description</p>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {relatedConsumables.map((item: any) => (
                      <Card key={item.id}>
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-sm">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{item.category}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {item.currentStock} {item.unit}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Related Proposals */}
              <div>
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Related Proposals ({relatedProposals.length})
                </h4>
                {relatedProposals.length === 0 ? (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">No proposals found for this supplier</p>
                    <p className="text-xs text-muted-foreground italic">Tip: Use supplier name or code in proposal vendor field</p>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {relatedProposals.map((proposal: any) => (
                      <Card key={proposal.id}>
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-sm">{proposal.title}</p>
                              <p className="text-xs text-muted-foreground">{proposal.type}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="text-xs mb-1">
                                {proposal.status}
                              </Badge>
                              <p className="text-xs font-medium">
                                Rp {(proposal.estimate / 1000000).toFixed(1)}M
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Related Maintenance */}
              <div>
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Related Maintenance ({relatedMaintenance.length})
                </h4>
                {relatedMaintenance.length === 0 ? (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">No maintenance records found for this supplier</p>
                    <p className="text-xs text-muted-foreground italic">Tip: Mention supplier name or code in maintenance notes/performed by</p>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {relatedMaintenance.map((maint: any) => (
                      <Card key={maint.id}>
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-sm">{maint.type}</p>
                              <p className="text-xs text-muted-foreground">
                                {maint.date ? new Date(maint.date).toLocaleDateString() : 'No date'}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {maint.status?.replace(/_/g, ' ')}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
