import { useAuthStore, User } from '../store/authStore';

// Permission types
export type Permission = 
  | 'view:equipment'
  | 'edit:equipment'
  | 'delete:equipment'
  | 'view:events'
  | 'edit:events'
  | 'view:crew'
  | 'edit:crew'
  | 'view:team_performance'
  | 'edit:team_performance'
  | 'view:maintenance'
  | 'edit:maintenance'
  | 'view:incidents'
  | 'create:incidents'
  | 'view:proposals'
  | 'edit:proposals'
  | 'approve:proposals'
  | 'view:rnd'
  | 'edit:rnd'
  | 'view:consumables'
  | 'edit:consumables'
  | 'view:alerts'
  | 'manage:alerts'
  | 'view:kpi'
  | 'edit:kpi'
  | 'manage:users'
  | 'view:all_cities'
  | 'edit:all_cities';

// Role definitions
const rolePermissions: Record<string, Permission[]> = {
  admin: [
    'view:equipment', 'edit:equipment', 'delete:equipment',
    'view:events', 'edit:events',
    'view:crew', 'edit:crew',
    'view:team_performance', 'edit:team_performance',
    'view:maintenance', 'edit:maintenance',
    'view:incidents', 'create:incidents',
    'view:proposals', 'edit:proposals', 'approve:proposals',
    'view:rnd', 'edit:rnd',
    'view:consumables', 'edit:consumables',
    'view:alerts', 'manage:alerts',
    'view:kpi', 'edit:kpi',
    'manage:users',
    'view:all_cities', 'edit:all_cities'
  ],
  manager: [
    'view:equipment', 'edit:equipment',
    'view:events', 'edit:events',
    'view:crew', 'edit:crew',
    'view:team_performance',
    'view:maintenance', 'edit:maintenance',
    'view:incidents', 'create:incidents',
    'view:proposals', 'edit:proposals',
    'view:rnd', 'edit:rnd',
    'view:consumables', 'edit:consumables',
    'view:alerts', 'manage:alerts',
    'view:kpi', 'edit:kpi'
  ],
  operator: [
    'view:equipment',
    'view:events',
    'view:crew',
    'view:team_performance',
    'view:maintenance',
    'view:incidents', 'create:incidents',
    'view:proposals',
    'view:rnd',
    'view:consumables',
    'view:alerts',
    'view:kpi'
  ]
};

// Check if user has permission
export const hasPermission = (user: User | null, permission: Permission): boolean => {
  if (!user) return false;
  
  const permissions = rolePermissions[user.role] || [];
  return permissions.includes(permission);
};

// Check if user can access specific city
export const canAccessCity = (user: User | null, city: string): boolean => {
  if (!user) return false;
  
  // Admin can access all cities
  if (user.role === 'admin') return true;
  
  // Others can only access their assigned cities
  return user.cities.includes(city as any);
};

// React hook for permissions
export const usePermission = (permission: Permission): boolean => {
  const { user } = useAuthStore();
  const result = hasPermission(user, permission);
  
  // Debug permissions
  console.log('usePermission Debug:', { 
    permission, 
    user: user ? { id: user.id, email: user.email, role: user.role } : null,
    result,
    availablePermissions: user ? rolePermissions[user.role] : []
  });
  
  return result;
};

// React hook for multiple permissions (AND)
export const usePermissions = (...permissions: Permission[]): boolean => {
  const { user } = useAuthStore();
  return permissions.every(p => hasPermission(user, p));
};

// React hook for any permission (OR)
export const useAnyPermission = (...permissions: Permission[]): boolean => {
  const { user } = useAuthStore();
  return permissions.some(p => hasPermission(user, p));
};

// React hook for city access
export const useCityAccess = (city: string): boolean => {
  const { user } = useAuthStore();
  return canAccessCity(user, city);
};

// Get user role display name
export const getRoleDisplayName = (role: string): string => {
  const roleNames: Record<string, string> = {
    admin: 'Administrator',
    manager: 'Manager',
    operator: 'Operator'
  };
  return roleNames[role] || role;
};

// Get user role badge color
export const getRoleBadgeVariant = (role: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    admin: 'destructive',
    manager: 'default',
    operator: 'secondary'
  };
  return variants[role] || 'outline';
};
