import { Router } from 'express';
import prisma from '../prisma';
import { emitUpdate } from '../websocket';

export const equipmentRouter = Router();

// Get all equipment (with optional city filter)
equipmentRouter.get('/', async (req, res) => {
  try {
    const { city, page = '1', limit = '50' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    
    const equipment = await prisma.equipment.findMany({
      where: city ? { city: city as any } : undefined,
      include: {
        area: true,
        maintenanceLogs: {
          orderBy: { date: 'desc' },
          take: 5
        },
        inspections: {
          orderBy: { date: 'desc' },
          take: 5
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: limitNum,
      skip: (pageNum - 1) * limitNum
    });
    
    const total = await prisma.equipment.count({
      where: city ? { city: city as any } : undefined
    });
    
    res.json({
      data: equipment,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch equipment' });
  }
});

// Get single equipment
equipmentRouter.get('/:id', async (req, res) => {
  try {
    const equipment = await prisma.equipment.findUnique({
      where: { id: req.params.id },
      include: {
        area: true,
        maintenanceLogs: {
          orderBy: { date: 'desc' }
        },
        inspections: {
          orderBy: { date: 'desc' }
        }
      }
    });
    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch equipment' });
  }
});

// Create equipment
equipmentRouter.post('/', async (req, res) => {
  try {
    console.log('Creating equipment with data:', req.body);
    
    // Validate required fields
    const { name, areaId, lastInspection, nextDue, firmware, city, description, photo, status } = req.body;
    if (!name || !lastInspection || !nextDue || !firmware || !city) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'lastInspection', 'nextDue', 'firmware', 'city']
      });
    }

    const equipment = await prisma.equipment.create({
      data: {
        name,
        status: status || 'Ready',
        lastInspection: new Date(lastInspection),
        nextDue: new Date(nextDue),
        firmware,
        description: description || '',
        photo: photo || null,
        areaId: areaId || null,
        city
      },
      include: {
        area: true
      }
    });
    
    console.log('Equipment created successfully:', equipment.id);
    res.status(201).json(equipment);
  } catch (error: any) {
    console.error('Error creating equipment:', error);
    res.status(500).json({ 
      error: 'Failed to create equipment',
      details: error.message 
    });
  }
});

// Update equipment
equipmentRouter.patch('/:id', async (req, res) => {
  try {
    const updateData = req.body;
    
    // Update equipment
    const equipment = await prisma.equipment.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        area: true
      }
    });
    
    // Fetch updated equipment with area
    const updatedEquipment = await prisma.equipment.findUnique({
      where: { id: req.params.id },
      include: {
        area: true
      }
    });
    
    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      emitUpdate(io, 'equipment:updated', updatedEquipment, equipment.city);
      
      // Create notification if status changed to critical
      if (equipment.status === 'OOS' || equipment.status === 'Degraded') {
        await prisma.notification.create({
          data: {
            userId: (req as any).user?.userId || 'system',
            type: equipment.status === 'OOS' ? 'CRITICAL' : 'WARNING',
            category: 'EQUIPMENT',
            title: `Equipment ${equipment.status}`,
            message: `${equipment.name} is now ${equipment.status}`,
            city: equipment.city,
            actionUrl: '/vault?tab=equipment'
          }
        });
      }
    }
    
    res.json(updatedEquipment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update equipment' });
  }
});

// Delete equipment
equipmentRouter.delete('/:id', async (req, res) => {
  try {
    await prisma.equipment.delete({
      where: { id: req.params.id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete equipment' });
  }
});

// Create equipment inspection
equipmentRouter.post('/:id/inspections', async (req, res) => {
  try {
    const { inspector, condition, notes, issues } = req.body;
    
    if (!inspector || !condition || !notes) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['inspector', 'condition', 'notes']
      });
    }

    const inspection = await prisma.equipmentInspection.create({
      data: {
        equipmentId: req.params.id,
        inspector,
        condition,
        notes,
        issues: issues || []
      }
    });
    
    // Update equipment lastInspection date
    await prisma.equipment.update({
      where: { id: req.params.id },
      data: { lastInspection: inspection.date }
    });
    
    res.status(201).json(inspection);
  } catch (error: any) {
    console.error('Error creating inspection:', error);
    res.status(500).json({ 
      error: 'Failed to create inspection',
      details: error.message 
    });
  }
});

// Get equipment inspections
equipmentRouter.get('/:id/inspections', async (req, res) => {
  try {
    const inspections = await prisma.equipmentInspection.findMany({
      where: { equipmentId: req.params.id },
      orderBy: { date: 'desc' }
    });
    res.json(inspections);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inspections' });
  }
});

// Get equipment maintenance logs
equipmentRouter.get('/:id/maintenance', async (req, res) => {
  try {
    const logs = await prisma.maintenanceLog.findMany({
      where: { equipmentId: req.params.id },
      orderBy: { date: 'desc' }
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch maintenance logs' });
  }
});
