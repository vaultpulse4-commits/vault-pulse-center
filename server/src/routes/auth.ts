import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../prisma';
import { hashPassword, comparePassword, validatePasswordStrength } from '../utils/password';
import { 
  generateAccessToken, 
  generateRefreshToken,
  authenticateToken,
  requireRole,
  JWTPayload
} from '../middleware/auth';
import jwt from 'jsonwebtoken';

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'vault-pulse-secret-key-change-in-production';

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('name').trim().isLength({ min: 2 }),
  body('role').optional().isIn(['admin', 'manager', 'operator']),
  body('cities').isArray().notEmpty()
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

// POST /auth/register - Create new user (admin only)
authRouter.post(
  '/register',
  authenticateToken,
  requireRole('admin'),
  registerValidation,
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name, role, cities } = req.body;

      // Check password strength
      const passwordCheck = validatePasswordStrength(password);
      if (!passwordCheck.valid) {
        return res.status(400).json({ 
          error: 'Weak password', 
          details: passwordCheck.errors 
        });
      }

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: role || 'operator',
          cities
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          cities: true,
          isActive: true,
          createdAt: true
        }
      });

      res.status(201).json({ 
        message: 'User created successfully',
        user 
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ error: 'Failed to register user' });
    }
  }
);

// POST /auth/login - Login user
authRouter.post('/login', loginValidation, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is inactive' });
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const tokenPayload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      cities: user.cities
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Save refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        refreshToken,
        lastLogin: new Date()
      }
    });

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        cities: user.cities
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /auth/refresh - Refresh access token
authRouter.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as JWTPayload;

    // Check if refresh token matches stored one
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is inactive' });
    }

    // Generate new access token
    const tokenPayload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      cities: user.cities
    };

    const accessToken = generateAccessToken(tokenPayload);

    res.json({ 
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        cities: user.cities
      }
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Refresh token expired' });
    }
    res.status(403).json({ error: 'Invalid refresh token' });
  }
});

// POST /auth/logout - Logout user
authRouter.post('/logout', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Clear refresh token
    await prisma.user.update({
      where: { id: req.user.userId },
      data: { refreshToken: null }
    });

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// GET /auth/me - Get current user
authRouter.get('/me', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        cities: true,
        isActive: true,
        lastLogin: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// GET /auth/users - List all users (admin only)
authRouter.get(
  '/users', 
  authenticateToken, 
  requireRole('admin'),
  async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          cities: true,
          isActive: true,
          lastLogin: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json({ users });
    } catch (error) {
      console.error('List users error:', error);
      res.status(500).json({ error: 'Failed to list users' });
    }
  }
);

// PATCH /auth/users/:id - Update user (admin only)
authRouter.patch(
  '/users/:id',
  authenticateToken,
  requireRole('admin'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, role, cities, isActive } = req.body;

      const user = await prisma.user.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(role && { role }),
          ...(cities && { cities }),
          ...(isActive !== undefined && { isActive })
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          cities: true,
          isActive: true,
          updatedAt: true
        }
      });

      res.json({ 
        message: 'User updated successfully',
        user 
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  }
);

// POST /auth/change-password - Change own password (authenticated users)
authRouter.post(
  '/change-password',
  authenticateToken,
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current and new password are required' });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
      }

      // Get user with password
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Verify current password
      const validPassword = await comparePassword(currentPassword, user.password);
      if (!validPassword) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);

      // Update password
      await prisma.user.update({
        where: { id: req.user.userId },
        data: { password: hashedPassword }
      });

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ error: 'Failed to change password' });
    }
  }
);

// DELETE /auth/users/:id - Delete user (admin only)
authRouter.delete(
  '/users/:id',
  authenticateToken,
  requireRole('admin'),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Prevent deleting self
      if (req.user?.userId === id) {
        return res.status(400).json({ error: 'Cannot delete your own account' });
      }

      await prisma.user.delete({
        where: { id }
      });

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  }
);
