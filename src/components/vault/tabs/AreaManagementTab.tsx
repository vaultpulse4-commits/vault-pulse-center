import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Pencil, Trash2, Plus, Power, PowerOff } from "lucide-react";

interface Area {
  id: string;
  name: string;
  description: string;
  city: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    equipment: number;
  };
}

export function AreaManagementTab() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    city: "" as "" | "jakarta" | "bali",
    isActive: true
  });

  useEffect(() => {
    loadAreas();
  }, []);

  const loadAreas = async () => {
    try {
      setLoading(true);
      const data = await api.areas.getAll();
      setAreas(data);
    } catch (error) {
      console.error("Error loading areas:", error);
      toast({
        title: "Error",
        description: "Failed to load areas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Area name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      const submitData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        city: formData.city || undefined,
        isActive: formData.isActive
      };

      if (editingArea) {
        await api.areas.update(editingArea.id, submitData);
        toast({
          title: "Success",
          description: "Area updated successfully"
        });
      } else {
        await api.areas.create(submitData);
        toast({
          title: "Success",
          description: "Area created successfully"
        });
      }

      resetForm();
      setIsAddDialogOpen(false);
      setEditingArea(null);
      loadAreas();
    } catch (error: any) {
      console.error("Error saving area:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save area",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (area: Area) => {
    setEditingArea(area);
    setFormData({
      name: area.name,
      description: area.description,
      city: (area.city || "") as "" | "jakarta" | "bali",
      isActive: area.isActive
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (area: Area) => {
    if (area._count && area._count.equipment > 0) {
      toast({
        title: "Cannot Delete",
        description: `This area is being used by ${area._count.equipment} equipment. Please reassign or delete those equipment first.`,
        variant: "destructive"
      });
      return;
    }

    if (!confirm(`Are you sure you want to delete area "${area.name}"?`)) {
      return;
    }

    try {
      await api.areas.delete(area.id);
      toast({
        title: "Success",
        description: "Area deleted successfully"
      });
      loadAreas();
    } catch (error: any) {
      console.error("Error deleting area:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete area",
        variant: "destructive"
      });
    }
  };

  const handleToggleActive = async (area: Area) => {
    try {
      await api.areas.toggle(area.id);
      toast({
        title: "Success",
        description: `Area ${area.isActive ? 'deactivated' : 'activated'} successfully`
      });
      loadAreas();
    } catch (error: any) {
      console.error("Error toggling area:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to toggle area status",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      city: "",
      isActive: true
    });
    setEditingArea(null);
  };

  const handleDialogClose = (open: boolean) => {
    setIsAddDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  if (loading) {
    return <div className="p-4">Loading areas...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Area Management</h2>
          <p className="text-muted-foreground mt-1">
            Manage equipment areas for your venues
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Area
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingArea ? "Edit Area" : "Add New Area"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Area Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., FOH, Stage, DJ Pit"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City (Optional)</Label>
                <Select 
                  value={formData.city || 'all'} 
                  onValueChange={(value) => setFormData({ ...formData, city: value === 'all' ? '' : value as "" | "jakarta" | "bali" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All cities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    <SelectItem value="jakarta">Jakarta</SelectItem>
                    <SelectItem value="bali">Bali</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="isActive">Active</Label>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingArea ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {areas.map((area) => (
          <Card key={area.id} className={!area.isActive ? "opacity-60" : ""}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {area.name}
                    {!area.isActive && (
                      <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        Inactive
                      </span>
                    )}
                  </CardTitle>
                  {area.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {area.description}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {area.city && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">City:</span>
                    <span className="font-medium capitalize">{area.city}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Equipment:</span>
                  <span className="font-medium">{area._count?.equipment || 0}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleEdit(area)}
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleToggleActive(area)}
                  title={area.isActive ? "Deactivate" : "Activate"}
                >
                  {area.isActive ? (
                    <PowerOff className="h-3 w-3" />
                  ) : (
                    <Power className="h-3 w-3" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(area)}
                  disabled={!!area._count?.equipment}
                  title={area._count?.equipment ? "Cannot delete area in use" : "Delete area"}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {areas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No areas found. Create one to get started.</p>
        </div>
      )}
    </div>
  );
}
