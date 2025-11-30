import { Router } from 'express';
import prisma from '../prisma';

export const alertRouter = Router();

alertRouter.get('/', async (req, res) => {
  try {
    const { city, acknowledged } = req.query;
    const alerts = await prisma.alert.findMany({
      where: {
        ...(city && { city: city as any }),
        ...(acknowledged !== undefined && { acknowledged: acknowledged === 'true' })
      },
      orderBy: { timestamp: 'desc' }
    });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

alertRouter.get('/:id', async (req, res) => {
  try {
    const alert = await prisma.alert.findUnique({
      where: { id: req.params.id }
    });
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alert' });
  }
});

alertRouter.post('/', async (req, res) => {
  try {
    const alert = await prisma.alert.create({
      data: req.body
    });
    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

alertRouter.patch('/:id', async (req, res) => {
  try {
    const alert = await prisma.alert.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update alert' });
  }
});

alertRouter.delete('/:id', async (req, res) => {
  try {
    await prisma.alert.delete({
      where: { id: req.params.id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete alert' });
  }
});
