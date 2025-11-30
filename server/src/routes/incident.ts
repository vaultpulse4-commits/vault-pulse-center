import { Router } from 'express';
import prisma from '../prisma';

export const incidentRouter = Router();

incidentRouter.get('/', async (req, res) => {
  try {
    const { city } = req.query;
    const incidents = await prisma.incident.findMany({
      where: city ? { city: city as any } : undefined,
      orderBy: { date: 'desc' }
    });
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
});

incidentRouter.get('/:id', async (req, res) => {
  try {
    const incident = await prisma.incident.findUnique({
      where: { id: req.params.id }
    });
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    res.json(incident);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch incident' });
  }
});

incidentRouter.post('/', async (req, res) => {
  try {
    console.log('Creating incident with data:', req.body);
    
    // Validate required fields
    const { type, description, date, city } = req.body;
    if (!type || !description || !date || !city) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['type', 'description', 'date', 'city']
      });
    }

    const incident = await prisma.incident.create({
      data: {
        type,
        description,
        rootCause: req.body.rootCause || '',
        prevention: req.body.prevention || '',
        impact: req.body.impact || '',
        date: new Date(date),
        city
      }
    });
    
    console.log('Incident created successfully:', incident.id);
    res.status(201).json(incident);
  } catch (error: any) {
    console.error('Error creating incident:', error);
    res.status(500).json({ 
      error: 'Failed to create incident',
      details: error.message 
    });
  }
});

incidentRouter.patch('/:id', async (req, res) => {
  try {
    const incident = await prisma.incident.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(incident);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update incident' });
  }
});

incidentRouter.delete('/:id', async (req, res) => {
  try {
    await prisma.incident.delete({
      where: { id: req.params.id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete incident' });
  }
});
