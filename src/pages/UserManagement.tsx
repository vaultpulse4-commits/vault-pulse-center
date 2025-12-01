import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Users, Plus, Edit, Trash2, UserCheck, UserX, Loader2, Shield, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { getRoleDisplayName, getRoleBadgeVariant } from "@/lib/permissions";
import { useAuthStore } from "@/store/authStore";
import { Navigate, useNavigate } from "react-router-dom";
import { formatDate } from "@/lib/dateUtils";

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'operator';
  cities: ('jakarta' | 'bali')[];
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export default function UserManagement() {
  const { user: currentUser } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'operator' as 'admin' | 'manager' | 'operator',
    cities: [] as string[],
  });

  // Only admins can access this page
  if (currentUser?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await api.auth.getUsers();
      setUsers(response.users);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      if (!formData.email || !formData.password || !formData.name || formData.cities.length === 0) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      await api.auth.register(formData);
      toast({
        title: "Success",
        description: "User created successfully"
      });
      setIsCreateOpen(false);
      setFormData({ email: '', password: '', name: '', role: 'operator', cities: [] });
      loadUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive"
      });
    }
  };

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    try {
      await api.auth.updateUser(userId, updates);
      toast({
        title: "Success",
        description: "User updated successfully"
      });
      loadUsers();
      setEditingUser(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await api.auth.deleteUser(userId);
      toast({
        title: "Success",
        description: "User deleted successfully"
      });
      loadUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive"
      });
    }
  };

  const toggleCitySelection = (city: string) => {
    setFormData(prev => ({
      ...prev,
      cities: prev.cities.includes(city)
        ? prev.cities.filter(c => c !== city)
        : [...prev.cities, city]
    }));
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    admins: users.filter(u => u.role === 'admin').length,
    managers: users.filter(u => u.role === 'manager').length,
    operators: users.filter(u => u.role === 'operator').length,
  };

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                className="mr-1 sm:mr-2 flex-shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-primary flex-shrink-0">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground truncate">User Management</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">Manage users and their permissions</p>
              </div>
            </div>
            
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                  <DialogDescription>Add a new user to the system</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="user@vaultclub.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Min. 8 characters"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Must contain uppercase, lowercase, and number
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select value={formData.role} onValueChange={(value: any) => setFormData(prev => ({ ...prev, role: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="operator">Operator</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>City Access</Label>
                    <div className="flex gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={formData.cities.includes('jakarta')}
                          onCheckedChange={() => toggleCitySelection('jakarta')}
                        />
                        <Label>Jakarta</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={formData.cities.includes('bali')}
                          onCheckedChange={() => toggleCitySelection('bali')}
                        />
                        <Label>Bali</Label>
                      </div>
                    </div>
                  </div>
                  <Button onClick={handleCreateUser} className="w-full">
                    Create User
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="pb-2">
              <CardDescription>Total Users</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="pb-2">
              <CardDescription>Active</CardDescription>
              <CardTitle className="text-3xl text-success">{stats.active}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="pb-2">
              <CardDescription>Admins</CardDescription>
              <CardTitle className="text-3xl text-destructive">{stats.admins}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="pb-2">
              <CardDescription>Managers</CardDescription>
              <CardTitle className="text-3xl text-primary">{stats.managers}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="pb-2">
              <CardDescription>Operators</CardDescription>
              <CardTitle className="text-3xl text-muted-foreground">{stats.operators}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[180px] md:min-w-auto">User</TableHead>
                    <TableHead className="min-w-[100px] md:min-w-auto">Role</TableHead>
                    <TableHead className="min-w-[120px] md:min-w-auto hidden sm:table-cell">Cities</TableHead>
                    <TableHead className="min-w-[100px] md:min-w-auto">Status</TableHead>
                    <TableHead className="min-w-[120px] md:min-w-auto hidden md:table-cell">Last Login</TableHead>
                    <TableHead className="min-w-[180px] md:min-w-auto text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm sm:text-base">{user.name}</div>
                          <div className="text-xs sm:text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs sm:text-sm">
                          {getRoleDisplayName(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {user.cities.map(city => (
                            <Badge key={city} variant="outline" className="text-xs">
                              {city}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.isActive ? (
                          <Badge variant="default" className="bg-success text-xs sm:text-sm">
                            <UserCheck className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">Active</span>
                            <span className="sm:hidden">On</span>
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs sm:text-sm">
                            <UserX className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">Inactive</span>
                            <span className="sm:hidden">Off</span>
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm text-muted-foreground hidden md:table-cell">
                        {user.lastLogin 
                          ? formatDate(user.lastLogin)
                          : 'Never'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateUser(user.id, { isActive: !user.isActive })}
                            disabled={user.id === currentUser?.id}
                          >
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                                disabled={user.id === currentUser?.id}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {user.name}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="bg-destructive text-destructive-foreground"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
