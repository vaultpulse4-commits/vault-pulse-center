import { Router } from 'express';
import prisma from '../prisma';
import { Prisma } from '@prisma/client';

export const consumableRouter = Router();

// GET all consumables
consumableRouter.get('/', async (req, res) => {
  try {
    const { city, category, lowStock } = req.query;
    
    if (lowStock === 'true') {
      // Use raw query for low stock
      const whereConditions = [];
      if (city) whereConditions.push(`"city" = '${city}'`);
      if (category) whereConditions.push(`"category" = '${category}'`);
      
      const whereClause = whereConditions.length > 0 ? `AND ${whereConditions.join(' AND ')}` : '';
      
      const consumables = await prisma.$queryRaw`
        SELECT * FROM "Consumable"
        WHERE "currentStock" <= "reorderPoint"
        ${Prisma.raw(whereClause)}
        ORDER BY "name" ASC
      `;
      
      return res.json(consumables);
    }
    
    const consumables = await prisma.consumable.findMany({
      where: {
        ...(city && { city: city as any }),
        ...(category && { category: category as string })
      },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            code: true,
            contactPerson: true,
            phone: true,
            email: true
          }
        },
        _count: {
          select: { 
            stockMovements: true,
            purchaseOrderItems: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });
    
    res.json(consumables);
  } catch (error: any) {
    console.error('Error fetching consumables:', error);
    res.status(500).json({ error: 'Failed to fetch consumables', details: error.message });
  }
});

// GET single consumable with full details
consumableRouter.get('/:id', async (req, res) => {
  try {
    const consumable = await prisma.consumable.findUnique({
      where: { id: req.params.id },
      include: {
        stockMovements: {
          orderBy: { createdAt: 'desc' },
          take: 20
        },
        purchaseOrderItems: {
          include: {
            purchaseOrder: {
              include: {
                supplier: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });
    
    if (!consumable) {
      return res.status(404).json({ error: 'Consumable not found' });
    }
    
    res.json(consumable);
  } catch (error: any) {
    console.error('Error fetching consumable:', error);
    res.status(500).json({ error: 'Failed to fetch consumable', details: error.message });
  }
});

// POST create consumable
consumableRouter.post('/', async (req, res) => {
  try {
    console.log('Creating consumable with data:', req.body);
    
    const { 
      name, category, description, currentStock, minStock, maxStock, 
      reorderPoint, reorderQty, unit, unitCost, location, image, city, supplierId 
    } = req.body;
    
    if (!name || !category || !unit || !city) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'category', 'unit', 'city']
      });
    }

    const consumable = await prisma.consumable.create({
      data: {
        name,
        category,
        description,
        currentStock: parseFloat(currentStock) || 0,
        minStock: parseInt(minStock) || 0,
        maxStock: maxStock ? parseInt(maxStock) : null,
        reorderPoint: parseInt(reorderPoint) || 0,
        reorderQty: parseInt(reorderQty) || 0,
        unit,
        unitCost: parseFloat(unitCost) || 0,
        location,
        image,
        city,
        supplierId: supplierId || null
      }
    });
    
    // Create initial stock movement if currentStock > 0
    if (consumable.currentStock > 0) {
      await prisma.stockMovement.create({
        data: {
          consumableId: consumable.id,
          type: 'Adjustment',
          quantity: consumable.currentStock,
          balanceBefore: 0,
          balanceAfter: consumable.currentStock,
          unitCost: consumable.unitCost,
          totalCost: consumable.currentStock * consumable.unitCost,
          reference: 'Initial Stock',
          notes: 'Item created with initial stock',
          performedBy: 'System',
          city: consumable.city
        }
      });
    }
    
    console.log('Consumable created successfully:', consumable.id);
    res.status(201).json(consumable);
  } catch (error: any) {
    console.error('Error creating consumable:', error);
    res.status(500).json({ 
      error: 'Failed to create consumable',
      details: error.message 
    });
  }
});

// PATCH update consumable
consumableRouter.patch('/:id', async (req, res) => {
  try {
    const updateData: any = {};
    const allowedFields = [
      'name', 'category', 'description', 'currentStock', 'minStock', 
      'maxStock', 'reorderPoint', 'reorderQty', 'unit', 'unitCost', 
      'location', 'image', 'supplierId'
    ];
    
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (['currentStock', 'unitCost'].includes(field)) {
          updateData[field] = parseFloat(req.body[field]);
        } else if (['minStock', 'reorderPoint', 'reorderQty', 'maxStock'].includes(field)) {
          updateData[field] = req.body[field] !== null ? parseInt(req.body[field]) : null;
        } else {
          updateData[field] = req.body[field];
        }
      }
    }
    
    const consumable = await prisma.consumable.update({
      where: { id: req.params.id },
      data: updateData
    });
    
    res.json(consumable);
  } catch (error: any) {
    console.error('Error updating consumable:', error);
    res.status(500).json({ error: 'Failed to update consumable', details: error.message });
  }
});

// DELETE consumable
consumableRouter.delete('/:id', async (req, res) => {
  try {
    // Check for existing stock movements and PO items (will cascade delete)
    await prisma.consumable.delete({
      where: { id: req.params.id }
    });
    
    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting consumable:', error);
    res.status(500).json({ error: 'Failed to delete consumable', details: error.message });
  }
});

// POST adjust stock (manual adjustment)
consumableRouter.post('/:id/adjust', async (req, res) => {
  try {
    const { quantity, type, reference, notes, performedBy } = req.body;
    
    if (quantity === undefined || !type) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['quantity', 'type']
      });
    }
    
    const consumable = await prisma.consumable.findUnique({
      where: { id: req.params.id }
    });
    
    if (!consumable) {
      return res.status(404).json({ error: 'Consumable not found' });
    }
    
    const balanceBefore = consumable.currentStock;
    
    // Calculate balance based on movement type:
    // - Purchase: ADD to stock (positive quantity in DB)
    // - Usage: SUBTRACT from stock (negative quantity in DB)
    // - Return: SUBTRACT from stock (negative quantity in DB)
    let actualQuantity = quantity;
    let balanceAfter;
    
    if (type === 'Purchase') {
      // Purchase adds to stock - quantity stored as positive
      actualQuantity = Math.abs(quantity);
      balanceAfter = balanceBefore + actualQuantity;
    } else if (type === 'Usage' || type === 'Return') {
      // Usage/Return removes from stock - quantity stored as negative
      actualQuantity = -Math.abs(quantity);
      balanceAfter = balanceBefore + actualQuantity; // Adding negative = subtracting
    } else {
      return res.status(400).json({ error: 'Invalid type. Must be Purchase, Usage, or Return' });
    }
    
    if (balanceAfter < 0) {
      return res.status(400).json({ 
        error: 'Insufficient stock',
        details: `Cannot ${type.toLowerCase()} ${Math.abs(quantity)} units. Current stock: ${balanceBefore}`
      });
    }
    
    // Create stock movement with properly signed quantity
    const movement = await prisma.stockMovement.create({
      data: {
        consumableId: consumable.id,
        type,
        quantity: actualQuantity, // Positive for Purchase, negative for Usage/Return
        balanceBefore,
        balanceAfter,
        unitCost: consumable.unitCost,
        totalCost: Math.abs(actualQuantity) * consumable.unitCost,
        reference,
        notes,
        performedBy,
        city: consumable.city
      }
    });
    
    // Update consumable stock
    const updated = await prisma.consumable.update({
      where: { id: req.params.id },
      data: { currentStock: balanceAfter }
    });
    
    res.json({ consumable: updated, movement });
  } catch (error: any) {
    console.error('Error adjusting stock:', error);
    res.status(500).json({ error: 'Failed to adjust stock', details: error.message });
  }
});

// GET stock movement history
consumableRouter.get('/:id/movements', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    const movements = await prisma.stockMovement.findMany({
      where: { consumableId: req.params.id },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string)
    });
    
    const total = await prisma.stockMovement.count({
      where: { consumableId: req.params.id }
    });
    
    res.json({ movements, total });
  } catch (error: any) {
    console.error('Error fetching stock movements:', error);
    res.status(500).json({ error: 'Failed to fetch stock movements', details: error.message });
  }
});

// GET analytics
consumableRouter.get('/:id/analytics', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days as string));
    
    const movements = await prisma.stockMovement.findMany({
      where: {
        consumableId: req.params.id,
        createdAt: { gte: daysAgo }
      },
      orderBy: { createdAt: 'asc' }
    });
    
    // Calculate analytics correctly:
    // - Usage: negative quantity (e.g., -20 items) → show as positive 20 in analytics
    // - Return: negative quantity (e.g., -10 items) → show as positive 10 in analytics  
    // - Purchase: positive quantity (e.g., +50 items) → show as 50
    
    const totalUsage = movements
      .filter(m => m.type === 'Usage')
      .reduce((sum, m) => sum + Math.abs(m.quantity), 0);
    
    const totalReturns = movements
      .filter(m => m.type === 'Return')
      .reduce((sum, m) => sum + Math.abs(m.quantity), 0);
    
    const totalPurchases = movements
      .filter(m => m.type === 'Purchase')
      .reduce((sum, m) => sum + m.quantity, 0);
    
    const analytics = {
      totalUsage,
      totalReturns,
      totalPurchases,
      totalCost: movements.filter(m => m.totalCost).reduce((sum, m) => sum + (m.totalCost || 0), 0),
      averageUsagePerDay: 0,
      usageByType: movements.reduce((acc, m) => {
        // For Usage and Return: use absolute value since they're stored as negative
        // For Purchase: use as-is since it's positive
        const displayQuantity = (m.type === 'Usage' || m.type === 'Return') 
          ? Math.abs(m.quantity) 
          : m.quantity;
        acc[m.type] = (acc[m.type] || 0) + displayQuantity;
        return acc;
      }, {} as Record<string, number>)
    };
    
    const usageDays = Math.ceil((Date.now() - daysAgo.getTime()) / (1000 * 60 * 60 * 24));
    analytics.averageUsagePerDay = usageDays > 0 ? analytics.totalUsage / usageDays : 0;
    
    res.json(analytics);
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics', details: error.message });
  }
});

// GET low stock items
consumableRouter.get('/alerts/low-stock', async (req, res) => {
  try {
    const { city } = req.query;
    
    const lowStockItems = await prisma.$queryRaw`
      SELECT * FROM "Consumable"
      WHERE "currentStock" <= "reorderPoint"
      ${city ? Prisma.sql`AND "city" = ${city}` : Prisma.empty}
      ORDER BY ("currentStock" - "reorderPoint") ASC
    `;
    
    res.json(lowStockItems);
  } catch (error: any) {
    console.error('Error fetching low stock items:', error);
    res.status(500).json({ error: 'Failed to fetch low stock items', details: error.message });
  }
});

// DELETE movement
consumableRouter.delete('/movements/:movementId', async (req, res) => {
  try {
    const { movementId } = req.params;
    
    // Get movement details before deletion to adjust stock
    const movement = await prisma.stockMovement.findUnique({
      where: { id: movementId },
      include: { consumable: true }
    });
    
    if (!movement) {
      return res.status(404).json({ error: 'Movement not found' });
    }
    
    // Reverse the stock change
    const newStock = movement.consumable.currentStock - movement.quantity;
    
    // Update consumable stock and delete movement in a transaction
    await prisma.$transaction([
      prisma.consumable.update({
        where: { id: movement.consumableId },
        data: { currentStock: newStock }
      }),
      prisma.stockMovement.delete({
        where: { id: movementId }
      })
    ]);
    
    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting movement:', error);
    res.status(500).json({ error: 'Failed to delete movement', details: error.message });
  }
});

export default consumableRouter;