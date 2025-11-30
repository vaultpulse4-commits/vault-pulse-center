import { Router } from 'express';
import prisma from '../prisma';

export const maintenanceRouter = Router();

maintenanceRouter.get('/', async (req, res) => {
  try {
    const { city } = req.query;
    const logs = await prisma.maintenanceLog.findMany({
      where: city ? { city: city as any } : undefined,
      include: {
        equipment: true,
        technician: true,
        supplier: {
          select: {
            id: true,
            name: true,
            code: true,
            contactPerson: true,
            phone: true,
            email: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch maintenance logs' });
  }
});

maintenanceRouter.get('/:id', async (req, res) => {
  try {
    const log = await prisma.maintenanceLog.findUnique({
      where: { id: req.params.id },
      include: {
        equipment: true,
        technician: true,
        supplier: {
          select: {
            id: true,
            name: true,
            code: true,
            contactPerson: true,
            phone: true,
            email: true
          }
        }
      }
    });
    if (!log) {
      return res.status(404).json({ error: 'Maintenance log not found' });
    }
    res.json(log);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch maintenance log' });
  }
});

maintenanceRouter.post('/', async (req, res) => {
  try {
    console.log('Creating maintenance log with data:', req.body);
    
    // Validate required fields
    const { equipmentId, type, issue, cost, date, technicianId, city, notes, photo, status, parts, supplierId } = req.body;
    if (!type || !issue || cost === undefined || !date || !city) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['type', 'issue', 'cost', 'date', 'city']
      });
    }

    const log = await prisma.maintenanceLog.create({
      data: {
        equipmentId: equipmentId || null,
        type,
        issue,
        status: status || 'Scheduled',
        mttr: req.body.mttr ? parseFloat(req.body.mttr) : null,
        cost: parseFloat(cost),
        parts: parts || [],
        date: new Date(date),
        technicianId: technicianId || null,
        notes: notes || '',
        photo: photo || '',
        city,
        supplierId: supplierId || null
      },
      include: {
        equipment: true,
        technician: true,
        supplier: {
          select: {
            id: true,
            name: true,
            code: true,
            contactPerson: true,
            phone: true,
            email: true
          }
        }
      }
    });
    
    console.log('Maintenance log created successfully:', log.id);
    res.status(201).json(log);
  } catch (error: any) {
    console.error('Error creating maintenance log:', error);
    res.status(500).json({ 
      error: 'Failed to create maintenance log',
      details: error.message 
    });
  }
});

maintenanceRouter.patch('/:id', async (req, res) => {
  try {
    const log = await prisma.maintenanceLog.update({
      where: { id: req.params.id },
      data: req.body,
      include: {
        equipment: true,
        technician: true,
        supplier: {
          select: {
            id: true,
            name: true,
            code: true,
            contactPerson: true,
            phone: true,
            email: true
          }
        }
      }
    });
    res.json(log);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update maintenance log' });
  }
});

maintenanceRouter.delete('/:id', async (req, res) => {
  try {
    await prisma.maintenanceLog.delete({
      where: { id: req.params.id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete maintenance log' });
  }
});
