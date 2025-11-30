import { Router } from 'express';
import prisma from '../prisma';

export const supplierRouter = Router();

// GET all suppliers
supplierRouter.get('/', async (req, res) => {
  try {
    const { city, status } = req.query;
    
    const suppliers = await prisma.supplier.findMany({
      where: {
        ...(city && { city: city as any }),
        ...(status && { status: status as any })
      },
      include: {
        _count: {
          select: { purchaseOrders: true }
        }
      },
      orderBy: { name: 'asc' }
    });
    
    res.json(suppliers);
  } catch (error: any) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ error: 'Failed to fetch suppliers', details: error.message });
  }
});

// GET single supplier
supplierRouter.get('/:id', async (req, res) => {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id: req.params.id },
      include: {
        purchaseOrders: {
          orderBy: { orderDate: 'desc' },
          take: 10
        },
        _count: {
          select: { purchaseOrders: true }
        }
      }
    });
    
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    
    res.json(supplier);
  } catch (error: any) {
    console.error('Error fetching supplier:', error);
    res.status(500).json({ error: 'Failed to fetch supplier', details: error.message });
  }
});

// POST create supplier
supplierRouter.post('/', async (req, res) => {
  try {
    const { name, code, contactPerson, email, phone, address, city, taxId, paymentTerms, rating, status, notes } = req.body;
    
    if (!name || !code || !city) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'code', 'city']
      });
    }
    
    // Check if code already exists
    const existing = await prisma.supplier.findUnique({
      where: { code }
    });
    
    if (existing) {
      return res.status(400).json({ error: 'Supplier code already exists' });
    }
    
    const supplier = await prisma.supplier.create({
      data: {
        name,
        code,
        contactPerson,
        email,
        phone,
        address,
        city,
        taxId,
        paymentTerms: paymentTerms || 30,
        rating: rating || 0,
        status: status || 'Active',
        notes
      }
    });
    
    res.status(201).json(supplier);
  } catch (error: any) {
    console.error('Error creating supplier:', error);
    res.status(500).json({ error: 'Failed to create supplier', details: error.message });
  }
});

// PATCH update supplier
supplierRouter.patch('/:id', async (req, res) => {
  try {
    const updateData: any = {};
    const allowedFields = ['name', 'code', 'contactPerson', 'email', 'phone', 'address', 'city', 'taxId', 'paymentTerms', 'rating', 'status', 'notes'];
    
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }
    
    // If updating code, check uniqueness
    if (updateData.code) {
      const existing = await prisma.supplier.findFirst({
        where: {
          code: updateData.code,
          NOT: { id: req.params.id }
        }
      });
      
      if (existing) {
        return res.status(400).json({ error: 'Supplier code already exists' });
      }
    }
    
    const supplier = await prisma.supplier.update({
      where: { id: req.params.id },
      data: updateData
    });
    
    res.json(supplier);
  } catch (error: any) {
    console.error('Error updating supplier:', error);
    res.status(500).json({ error: 'Failed to update supplier', details: error.message });
  }
});

// DELETE supplier
supplierRouter.delete('/:id', async (req, res) => {
  try {
    // Check if supplier has any purchase orders
    const orderCount = await prisma.purchaseOrder.count({
      where: { supplierId: req.params.id }
    });
    
    if (orderCount > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete supplier with existing purchase orders',
        orderCount 
      });
    }
    
    await prisma.supplier.delete({
      where: { id: req.params.id }
    });
    
    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ error: 'Failed to delete supplier', details: error.message });
  }
});

// GET supplier statistics
supplierRouter.get('/:id/stats', async (req, res) => {
  try {
    const supplierId = req.params.id;
    
    // Get purchase order stats
    const orders = await prisma.purchaseOrder.findMany({
      where: { supplierId },
      include: {
        items: true
      }
    });
    
    const stats = {
      totalOrders: orders.length,
      totalAmount: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      ordersByStatus: {
        Draft: orders.filter(o => o.status === 'Draft').length,
        Submitted: orders.filter(o => o.status === 'Submitted').length,
        Approved: orders.filter(o => o.status === 'Approved').length,
        Ordered: orders.filter(o => o.status === 'Ordered').length,
        Received: orders.filter(o => o.status === 'Received').length,
        Cancelled: orders.filter(o => o.status === 'Cancelled').length
      },
      avgOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length : 0,
      lastOrderDate: orders.length > 0 ? orders.sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime())[0].orderDate : null
    };
    
    res.json(stats);
  } catch (error: any) {
    console.error('Error fetching supplier stats:', error);
    res.status(500).json({ error: 'Failed to fetch supplier stats', details: error.message });
  }
});
