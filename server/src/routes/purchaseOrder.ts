import { Router } from 'express';
import prisma from '../prisma';

export const purchaseOrderRouter = Router();

// GET all purchase orders
purchaseOrderRouter.get('/', async (req, res) => {
  try {
    const { city, status, supplierId } = req.query;
    
    const orders = await prisma.purchaseOrder.findMany({
      where: {
        ...(city && { city: city as any }),
        ...(status && { status: status as any }),
        ...(supplierId && { supplierId: supplierId as string })
      },
      include: {
        supplier: true,
        items: {
          include: {
            consumable: true
          }
        },
        _count: {
          select: { items: true }
        }
      },
      orderBy: { orderDate: 'desc' }
    });
    
    res.json(orders);
  } catch (error: any) {
    console.error('Error fetching purchase orders:', error);
    res.status(500).json({ error: 'Failed to fetch purchase orders', details: error.message });
  }
});

// GET single purchase order
purchaseOrderRouter.get('/:id', async (req, res) => {
  try {
    const order = await prisma.purchaseOrder.findUnique({
      where: { id: req.params.id },
      include: {
        supplier: true,
        items: {
          include: {
            consumable: true
          }
        }
      }
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }
    
    res.json(order);
  } catch (error: any) {
    console.error('Error fetching purchase order:', error);
    res.status(500).json({ error: 'Failed to fetch purchase order', details: error.message });
  }
});

// POST create purchase order
purchaseOrderRouter.post('/', async (req, res) => {
  try {
    const { orderNumber, supplierId, orderDate, expectedDate, status, notes, city, items } = req.body;
    
    if (!orderNumber || !supplierId || !city || !items || items.length === 0) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['orderNumber', 'supplierId', 'city', 'items']
      });
    }
    
    // Check if order number already exists
    const existing = await prisma.purchaseOrder.findUnique({
      where: { orderNumber }
    });
    
    if (existing) {
      return res.status(400).json({ error: 'Order number already exists' });
    }
    
    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0);
    
    // Create order with items
    const order = await prisma.purchaseOrder.create({
      data: {
        orderNumber,
        supplierId,
        orderDate: orderDate ? new Date(orderDate) : new Date(),
        expectedDate: expectedDate ? new Date(expectedDate) : null,
        status: status || 'Draft',
        totalAmount,
        notes,
        city,
        items: {
          create: items.map((item: any) => ({
            consumableId: item.consumableId,
            quantity: parseFloat(item.quantity),
            receivedQty: 0,
            unitPrice: parseFloat(item.unitPrice),
            totalPrice: parseFloat(item.quantity) * parseFloat(item.unitPrice)
          }))
        }
      },
      include: {
        supplier: true,
        items: {
          include: {
            consumable: true
          }
        }
      }
    });
    
    res.status(201).json(order);
  } catch (error: any) {
    console.error('Error creating purchase order:', error);
    res.status(500).json({ error: 'Failed to create purchase order', details: error.message });
  }
});

// PATCH update purchase order
purchaseOrderRouter.patch('/:id', async (req, res) => {
  try {
    const updateData: any = {};
    const allowedFields = ['orderNumber', 'supplierId', 'orderDate', 'expectedDate', 'receivedDate', 'status', 'notes'];
    
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (['orderDate', 'expectedDate', 'receivedDate'].includes(field)) {
          updateData[field] = req.body[field] ? new Date(req.body[field]) : null;
        } else {
          updateData[field] = req.body[field];
        }
      }
    }
    
    const order = await prisma.purchaseOrder.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        supplier: true,
        items: {
          include: {
            consumable: true
          }
        }
      }
    });
    
    res.json(order);
  } catch (error: any) {
    console.error('Error updating purchase order:', error);
    res.status(500).json({ error: 'Failed to update purchase order', details: error.message });
  }
});

// POST receive items
purchaseOrderRouter.post('/:id/receive', async (req, res) => {
  try {
    const { items, performedBy } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items to receive' });
    }
    
    const order = await prisma.purchaseOrder.findUnique({
      where: { id: req.params.id },
      include: {
        items: {
          include: {
            consumable: true
          }
        }
      }
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }
    
    // Process each received item
    for (const receivedItem of items) {
      const poItem = order.items.find(i => i.id === receivedItem.itemId);
      if (!poItem) continue;
      
      const qtyToReceive = parseFloat(receivedItem.quantity);
      const newReceivedQty = poItem.receivedQty + qtyToReceive;
      
      // Update PO item
      await prisma.purchaseOrderItem.update({
        where: { id: poItem.id },
        data: { receivedQty: newReceivedQty }
      });
      
      // Update consumable stock
      const newStock = poItem.consumable.currentStock + qtyToReceive;
      await prisma.consumable.update({
        where: { id: poItem.consumableId },
        data: { currentStock: newStock }
      });
      
      // Create stock movement
      await prisma.stockMovement.create({
        data: {
          consumableId: poItem.consumableId,
          type: 'Purchase',
          quantity: qtyToReceive,
          balanceBefore: poItem.consumable.currentStock,
          balanceAfter: newStock,
          unitCost: poItem.unitPrice,
          totalCost: qtyToReceive * poItem.unitPrice,
          reference: order.orderNumber,
          notes: `Received from PO ${order.orderNumber}`,
          performedBy: performedBy || 'System',
          city: order.city
        }
      });
    }
    
    // Check if all items fully received
    const updatedOrder = await prisma.purchaseOrder.findUnique({
      where: { id: req.params.id },
      include: { items: true }
    });
    
    const allReceived = updatedOrder!.items.every(item => item.receivedQty >= item.quantity);
    const partiallyReceived = updatedOrder!.items.some(item => item.receivedQty > 0);
    
    // Update order status
    let newStatus = order.status;
    if (allReceived) {
      newStatus = 'Received';
    } else if (partiallyReceived) {
      newStatus = 'PartiallyReceived';
    }
    
    const finalOrder = await prisma.purchaseOrder.update({
      where: { id: req.params.id },
      data: { 
        status: newStatus,
        receivedDate: allReceived ? new Date() : order.receivedDate
      },
      include: {
        supplier: true,
        items: {
          include: {
            consumable: true
          }
        }
      }
    });
    
    res.json(finalOrder);
  } catch (error: any) {
    console.error('Error receiving items:', error);
    res.status(500).json({ error: 'Failed to receive items', details: error.message });
  }
});

// DELETE purchase order
purchaseOrderRouter.delete('/:id', async (req, res) => {
  try {
    const order = await prisma.purchaseOrder.findUnique({
      where: { id: req.params.id }
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }
    
    // Only allow deletion of Draft or Cancelled orders
    if (!['Draft', 'Cancelled'].includes(order.status)) {
      return res.status(400).json({ 
        error: 'Can only delete Draft or Cancelled orders',
        currentStatus: order.status
      });
    }
    
    await prisma.purchaseOrder.delete({
      where: { id: req.params.id }
    });
    
    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting purchase order:', error);
    res.status(500).json({ error: 'Failed to delete purchase order', details: error.message });
  }
});
