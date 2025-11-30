import { Router } from 'express';
import prisma from '../prisma';
import { authenticateToken, requireRole } from '../middleware/auth';

export const permissionsRouter = Router();

// GET /api/permissions - Get all permissions with role assignments
permissionsRouter.get('/', authenticateToken, async (req, res) => {
  try {
    const permissions = await prisma.permission.findMany({
      include: {
        rolePermissions: {
          select: {
            role: true,
            granted: true
          }
        }
      },
      orderBy: [
        { category: 'asc' },
        { displayName: 'asc' }
      ]
    });

    // Transform to include role assignments
    const permissionsWithRoles = permissions.map(perm => ({
      id: perm.id,
      name: perm.name,
      displayName: perm.displayName,
      description: perm.description,
      category: perm.category,
      roles: {
        admin: perm.rolePermissions.some(rp => rp.role === 'admin' && rp.granted),
        manager: perm.rolePermissions.some(rp => rp.role === 'manager' && rp.granted),
        operator: perm.rolePermissions.some(rp => rp.role === 'operator' && rp.granted)
      }
    }));

    res.json({ permissions: permissionsWithRoles });
  } catch (error) {
    console.error('Get permissions error:', error);
    res.status(500).json({ error: 'Failed to get permissions' });
  }
});

// GET /api/permissions/by-category - Get permissions grouped by category
permissionsRouter.get('/by-category', authenticateToken, async (req, res) => {
  try {
    const permissions = await prisma.permission.findMany({
      include: {
        rolePermissions: {
          select: {
            role: true,
            granted: true
          }
        }
      },
      orderBy: [
        { category: 'asc' },
        { displayName: 'asc' }
      ]
    });

    // Group by category
    const grouped = permissions.reduce((acc, perm) => {
      if (!acc[perm.category]) {
        acc[perm.category] = [];
      }
      acc[perm.category].push({
        id: perm.id,
        name: perm.name,
        displayName: perm.displayName,
        description: perm.description,
        admin: perm.rolePermissions.some(rp => rp.role === 'admin' && rp.granted),
        manager: perm.rolePermissions.some(rp => rp.role === 'manager' && rp.granted),
        operator: perm.rolePermissions.some(rp => rp.role === 'operator' && rp.granted)
      });
      return acc;
    }, {} as Record<string, any[]>);

    res.json({ categories: grouped });
  } catch (error) {
    console.error('Get permissions by category error:', error);
    res.status(500).json({ error: 'Failed to get permissions' });
  }
});

// GET /api/permissions/role/:role - Get permissions for specific role
permissionsRouter.get('/role/:role', authenticateToken, async (req, res) => {
  try {
    const { role } = req.params;

    if (!['admin', 'manager', 'operator'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const rolePermissions = await prisma.rolePermission.findMany({
      where: {
        role: role as any,
        granted: true
      },
      include: {
        permission: true
      }
    });

    const permissions = rolePermissions.map(rp => ({
      id: rp.permission.id,
      name: rp.permission.name,
      displayName: rp.permission.displayName,
      description: rp.permission.description,
      category: rp.permission.category
    }));

    res.json({ role, permissions });
  } catch (error) {
    console.error('Get role permissions error:', error);
    res.status(500).json({ error: 'Failed to get role permissions' });
  }
});

// POST /api/permissions - Create new permission (admin only)
permissionsRouter.post(
  '/',
  authenticateToken,
  requireRole('admin'),
  async (req, res) => {
    try {
      const { name, displayName, description, category, roles } = req.body;

      if (!name || !displayName || !category) {
        return res.status(400).json({ error: 'Name, displayName, and category are required' });
      }

      // Check if permission already exists
      const existing = await prisma.permission.findUnique({ where: { name } });
      if (existing) {
        return res.status(400).json({ error: 'Permission with this name already exists' });
      }

      // Create permission
      const permission = await prisma.permission.create({
        data: {
          name,
          displayName,
          description: description || '',
          category
        }
      });

      // Create role permissions
      if (roles) {
        const roleTypes = ['admin', 'manager', 'operator'] as const;
        for (const role of roleTypes) {
          if (roles[role]) {
            await prisma.rolePermission.create({
              data: {
                role,
                permissionId: permission.id,
                granted: true
              }
            });
          }
        }
      }

      res.json({ message: 'Permission created successfully', permission });
    } catch (error) {
      console.error('Create permission error:', error);
      res.status(500).json({ error: 'Failed to create permission' });
    }
  }
);

// PATCH /api/permissions/:id - Update permission (admin only)
permissionsRouter.patch(
  '/:id',
  authenticateToken,
  requireRole('admin'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { displayName, description, category, roles } = req.body;

      // Update permission details
      const permission = await prisma.permission.update({
        where: { id },
        data: {
          ...(displayName && { displayName }),
          ...(description !== undefined && { description }),
          ...(category && { category })
        }
      });

      // Update role permissions if provided
      if (roles) {
        // Delete existing role permissions
        await prisma.rolePermission.deleteMany({
          where: { permissionId: id }
        });

        // Create new role permissions
        const roleTypes = ['admin', 'manager', 'operator'] as const;
        for (const role of roleTypes) {
          if (roles[role]) {
            await prisma.rolePermission.create({
              data: {
                role,
                permissionId: id,
                granted: true
              }
            });
          }
        }
      }

      res.json({ message: 'Permission updated successfully', permission });
    } catch (error) {
      console.error('Update permission error:', error);
      res.status(500).json({ error: 'Failed to update permission' });
    }
  }
);

// DELETE /api/permissions/:id - Delete permission (admin only)
permissionsRouter.delete(
  '/:id',
  authenticateToken,
  requireRole('admin'),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Delete permission (cascades to role permissions)
      await prisma.permission.delete({
        where: { id }
      });

      res.json({ message: 'Permission deleted successfully' });
    } catch (error) {
      console.error('Delete permission error:', error);
      res.status(500).json({ error: 'Failed to delete permission' });
    }
  }
);

// PATCH /api/permissions/role/:role/:permissionId - Toggle role permission (admin only)
permissionsRouter.patch(
  '/role/:role/:permissionId',
  authenticateToken,
  requireRole('admin'),
  async (req, res) => {
    try {
      const { role, permissionId } = req.params;
      const { granted } = req.body;

      if (!['admin', 'manager', 'operator'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }

      // Check if role permission exists
      const existing = await prisma.rolePermission.findFirst({
        where: {
          role: role as any,
          permissionId
        }
      });

      if (existing) {
        if (granted === false) {
          // Delete if revoking permission
          await prisma.rolePermission.delete({
            where: { id: existing.id }
          });
        } else {
          // Update if already exists
          await prisma.rolePermission.update({
            where: { id: existing.id },
            data: { granted: true }
          });
        }
      } else if (granted !== false) {
        // Create if granting new permission
        await prisma.rolePermission.create({
          data: {
            role: role as any,
            permissionId,
            granted: true
          }
        });
      }

      res.json({ message: 'Role permission updated successfully' });
    } catch (error) {
      console.error('Toggle role permission error:', error);
      res.status(500).json({ error: 'Failed to update role permission' });
    }
  }
);
