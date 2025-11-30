import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Shield, Users, Key, ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import { getRoleDisplayName, getRoleBadgeVariant } from "@/lib/permissions";
import { useAuthStore } from "@/store/authStore";
import { Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface PermissionGroup {
  name: string;
  permissions: {
    id: string;
    name: string;
    displayName: string;
    admin: boolean;
    manager: boolean;
    operator: boolean;
  }[];
}

export default function PermissionMatrix() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);

  // Only admins can access this page
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      setLoading(true);
      const response = await api.permissions.getByCategory();
      
      // Transform to PermissionGroup format
      const groups: PermissionGroup[] = Object.entries(response.categories).map(([name, perms]: [string, any]) => ({
        name,
        permissions: perms
      }));
      
      setPermissionGroups(groups);
    } catch (error: any) {
      console.error('Failed to load permissions:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load permissions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPermissions();
    setRefreshing(false);
    toast({
      title: "Refreshed",
      description: "Permission matrix updated"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading permissions...</p>
        </div>
      </div>
    );
  }

  const roles = [
    { key: 'admin', name: 'Administrator', variant: getRoleBadgeVariant('admin') },
    { key: 'manager', name: 'Manager', variant: getRoleBadgeVariant('manager') },
    { key: 'operator', name: 'Operator', variant: getRoleBadgeVariant('operator') },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                className="mr-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Permission Matrix</h1>
                <p className="text-muted-foreground">Role-based access control overview</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </div>

        {/* Role Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {roles.map((role) => (
            <Card key={role.key} className="bg-gradient-card border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{role.name}</CardTitle>
                  </div>
                  <Badge variant={role.variant}>{role.key}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {role.key === 'admin' && (
                    <>
                      <p className="text-muted-foreground">Full system access</p>
                      <p className="text-success">✓ All cities access</p>
                      <p className="text-success">✓ User management</p>
                      <p className="text-success">✓ All CRUD operations</p>
                    </>
                  )}
                  {role.key === 'manager' && (
                    <>
                      <p className="text-muted-foreground">City-specific management</p>
                      <p className="text-warning">○ Assigned cities only</p>
                      <p className="text-success">✓ Most CRUD operations</p>
                      <p className="text-muted-foreground">✗ Limited deletions</p>
                    </>
                  )}
                  {role.key === 'operator' && (
                    <>
                      <p className="text-muted-foreground">Read-only access</p>
                      <p className="text-warning">○ View-only permissions</p>
                      <p className="text-success">✓ Report incidents</p>
                      <p className="text-muted-foreground">✗ No edit/delete</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Permission Matrix Tables */}
        <div className="space-y-6">
          {permissionGroups.map((group) => (
            <Card key={group.name} className="bg-gradient-card border-border/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-primary" />
                  <CardTitle>{group.name}</CardTitle>
                </div>
                <CardDescription>
                  Permissions for {group.permissions.length} actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50%]">Permission</TableHead>
                      <TableHead className="text-center">
                        <Badge variant="destructive">Admin</Badge>
                      </TableHead>
                      <TableHead className="text-center">
                        <Badge variant="default">Manager</Badge>
                      </TableHead>
                      <TableHead className="text-center">
                        <Badge variant="secondary">Operator</Badge>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.permissions.map((permission) => (
                      <TableRow key={permission.id}>
                        <TableCell className="font-medium">{permission.displayName}</TableCell>
                        <TableCell className="text-center">
                          {permission.admin ? (
                            <Check className="h-5 w-5 text-success mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground mx-auto" />
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {permission.manager ? (
                            <Check className="h-5 w-5 text-success mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground mx-auto" />
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {permission.operator ? (
                            <Check className="h-5 w-5 text-success mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground mx-auto" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Legend */}
        <Card className="mt-8 bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Legend</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-success" />
              <span>Permission granted</span>
            </div>
            <div className="flex items-center gap-2">
              <X className="h-5 w-5 text-muted-foreground" />
              <span>Permission denied</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>Protected by RBAC</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
