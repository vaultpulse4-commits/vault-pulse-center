import prisma from '../prisma';

interface PermissionDef {
  name: string;
  displayName: string;
  description: string;
  category: string;
  roles: {
    admin: boolean;
    manager: boolean;
    operator: boolean;
  };
}

const permissions: PermissionDef[] = [
  // Equipment Management
  {
    name: 'view:equipment',
    displayName: 'View Equipment',
    description: 'View equipment inventory and status',
    category: 'Equipment Management',
    roles: { admin: true, manager: true, operator: true }
  },
  {
    name: 'add:equipment',
    displayName: 'Add Equipment',
    description: 'Add new equipment to inventory',
    category: 'Equipment Management',
    roles: { admin: true, manager: true, operator: false }
  },
  {
    name: 'edit:equipment',
    displayName: 'Edit Equipment',
    description: 'Edit equipment details and status',
    category: 'Equipment Management',
    roles: { admin: true, manager: true, operator: false }
  },
  {
    name: 'delete:equipment',
    displayName: 'Delete Equipment',
    description: 'Remove equipment from inventory',
    category: 'Equipment Management',
    roles: { admin: true, manager: false, operator: false }
  },
  
  // Event Management
  {
    name: 'view:events',
    displayName: 'View Events',
    description: 'View event briefs and schedules',
    category: 'Event Management',
    roles: { admin: true, manager: true, operator: true }
  },
  {
    name: 'create:events',
    displayName: 'Create Events',
    description: 'Create new event briefs',
    category: 'Event Management',
    roles: { admin: true, manager: true, operator: false }
  },
  {
    name: 'edit:events',
    displayName: 'Edit Events',
    description: 'Edit event details and briefs',
    category: 'Event Management',
    roles: { admin: true, manager: true, operator: false }
  },
  {
    name: 'delete:events',
    displayName: 'Delete Events',
    description: 'Remove events from schedule',
    category: 'Event Management',
    roles: { admin: true, manager: false, operator: false }
  },
  
  // Team Management
  {
    name: 'view:crew',
    displayName: 'View Crew',
    description: 'View crew members and schedules',
    category: 'Team Management',
    roles: { admin: true, manager: true, operator: true }
  },
  {
    name: 'add:crew',
    displayName: 'Add Crew Members',
    description: 'Add new crew members to team',
    category: 'Team Management',
    roles: { admin: true, manager: true, operator: false }
  },
  {
    name: 'edit:crew',
    displayName: 'Edit Crew Schedule',
    description: 'Edit crew member assignments and schedules',
    category: 'Team Management',
    roles: { admin: true, manager: true, operator: false }
  },
  {
    name: 'remove:crew',
    displayName: 'Remove Crew Members',
    description: 'Remove crew members from team',
    category: 'Team Management',
    roles: { admin: true, manager: false, operator: false }
  },
  
  // Team Performance
  {
    name: 'view:team_performance',
    displayName: 'View Team Performance',
    description: 'View team performance metrics and analytics',
    category: 'Team Performance',
    roles: { admin: true, manager: true, operator: true }
  },
  {
    name: 'edit:team_performance',
    displayName: 'Edit Team Performance',
    description: 'Edit team performance metrics and evaluations',
    category: 'Team Performance',
    roles: { admin: true, manager: false, operator: false }
  },
  
  // Maintenance & Incidents
  {
    name: 'view:maintenance',
    displayName: 'View Maintenance Logs',
    description: 'View maintenance history and schedules',
    category: 'Maintenance & Incidents',
    roles: { admin: true, manager: true, operator: true }
  },
  {
    name: 'create:maintenance',
    displayName: 'Create Maintenance Logs',
    description: 'Create new maintenance logs',
    category: 'Maintenance & Incidents',
    roles: { admin: true, manager: true, operator: false }
  },
  {
    name: 'view:incidents',
    displayName: 'View Incidents',
    description: 'View incident reports',
    category: 'Maintenance & Incidents',
    roles: { admin: true, manager: true, operator: true }
  },
  {
    name: 'report:incidents',
    displayName: 'Report Incidents',
    description: 'Create and report incidents',
    category: 'Maintenance & Incidents',
    roles: { admin: true, manager: true, operator: true }
  },
  
  // Proposals & R&D
  {
    name: 'view:proposals',
    displayName: 'View Proposals',
    description: 'View proposals and budgets',
    category: 'Proposals & R&D',
    roles: { admin: true, manager: true, operator: true }
  },
  {
    name: 'create:proposals',
    displayName: 'Create Proposals',
    description: 'Create new proposals',
    category: 'Proposals & R&D',
    roles: { admin: true, manager: true, operator: false }
  },
  {
    name: 'edit:proposals',
    displayName: 'Edit Proposals',
    description: 'Edit proposal details',
    category: 'Proposals & R&D',
    roles: { admin: true, manager: true, operator: false }
  },
  {
    name: 'approve:proposals',
    displayName: 'Approve Proposals',
    description: 'Approve or reject proposals',
    category: 'Proposals & R&D',
    roles: { admin: true, manager: false, operator: false }
  },
  {
    name: 'view:rnd',
    displayName: 'View R&D Projects',
    description: 'View research and development projects',
    category: 'Proposals & R&D',
    roles: { admin: true, manager: true, operator: true }
  },
  {
    name: 'manage:rnd',
    displayName: 'Manage R&D Projects',
    description: 'Create and manage R&D projects',
    category: 'Proposals & R&D',
    roles: { admin: true, manager: true, operator: false }
  },
  
  // Consumables & Alerts
  {
    name: 'view:consumables',
    displayName: 'View Consumables',
    description: 'View consumable stock levels',
    category: 'Consumables & Alerts',
    roles: { admin: true, manager: true, operator: true }
  },
  {
    name: 'update:stock',
    displayName: 'Update Stock Levels',
    description: 'Update consumable inventory',
    category: 'Consumables & Alerts',
    roles: { admin: true, manager: true, operator: false }
  },
  {
    name: 'view:alerts',
    displayName: 'View Alerts',
    description: 'View system alerts and notifications',
    category: 'Consumables & Alerts',
    roles: { admin: true, manager: true, operator: true }
  },
  {
    name: 'manage:alerts',
    displayName: 'Manage Alerts',
    description: 'Create and manage system alerts',
    category: 'Consumables & Alerts',
    roles: { admin: true, manager: true, operator: false }
  },
  
  // KPI & Analytics
  {
    name: 'view:kpi',
    displayName: 'View KPI Metrics',
    description: 'View KPI dashboards and metrics',
    category: 'KPI & Analytics',
    roles: { admin: true, manager: true, operator: true }
  },
  {
    name: 'edit:kpi',
    displayName: 'Edit KPI Data',
    description: 'Edit and update KPI metrics',
    category: 'KPI & Analytics',
    roles: { admin: true, manager: true, operator: false }
  },
  {
    name: 'export:reports',
    displayName: 'Export Reports',
    description: 'Export data and generate reports',
    category: 'KPI & Analytics',
    roles: { admin: true, manager: true, operator: false }
  },
  
  // System & Users
  {
    name: 'manage:users',
    displayName: 'Manage Users',
    description: 'Create, edit, and delete users',
    category: 'System & Users',
    roles: { admin: true, manager: false, operator: false }
  },
  {
    name: 'view:all_cities',
    displayName: 'View All Cities',
    description: 'Access data from all cities',
    category: 'System & Users',
    roles: { admin: true, manager: false, operator: false }
  },
  {
    name: 'edit:all_cities',
    displayName: 'Edit All Cities',
    description: 'Modify data across all cities',
    category: 'System & Users',
    roles: { admin: true, manager: false, operator: false }
  },
  {
    name: 'system:config',
    displayName: 'System Configuration',
    description: 'Modify system settings and configuration',
    category: 'System & Users',
    roles: { admin: true, manager: false, operator: false }
  }
];

async function seedPermissions() {
  console.log('🌱 Starting permission seeding...');
  
  try {
    // Clear existing permissions
    await prisma.rolePermission.deleteMany({});
    await prisma.permission.deleteMany({});
    console.log('✅ Cleared existing permissions');
    
    let createdCount = 0;
    let rolePermissionCount = 0;
    
    for (const perm of permissions) {
      // Create permission
      const permission = await prisma.permission.create({
        data: {
          name: perm.name,
          displayName: perm.displayName,
          description: perm.description,
          category: perm.category
        }
      });
      createdCount++;
      
      // Create role permissions
      const roleTypes = ['admin', 'manager', 'operator'] as const;
      for (const role of roleTypes) {
        if (perm.roles[role]) {
          await prisma.rolePermission.create({
            data: {
              role: role,
              permissionId: permission.id,
              granted: true
            }
          });
          rolePermissionCount++;
        }
      }
    }
    
    console.log(`✅ Created ${createdCount} permissions`);
    console.log(`✅ Created ${rolePermissionCount} role-permission mappings`);
    console.log('🎉 Permission seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding permissions:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedPermissions();
