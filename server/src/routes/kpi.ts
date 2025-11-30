import { Router } from 'express';
import prisma from '../prisma';

export const kpiRouter = Router();

kpiRouter.get('/', async (req, res) => {
  try {
    const { city } = req.query;
    const kpis = await prisma.kPIMetrics.findMany({
      where: city ? { city: city as any } : undefined,
      orderBy: [{ weekYear: 'desc' }, { weekNumber: 'desc' }]
    });
    res.json(kpis);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch KPI metrics' });
  }
});

kpiRouter.get('/:city/current', async (req, res) => {
  try {
    const { city } = req.params;
    const kpi = await prisma.kPIMetrics.findUnique({
      where: { city: city as any }
    });
    if (!kpi) {
      return res.status(404).json({ error: 'KPI metrics not found for this city' });
    }
    res.json(kpi);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch KPI metrics' });
  }
});

kpiRouter.post('/', async (req, res) => {
  try {
    const kpi = await prisma.kPIMetrics.create({
      data: req.body
    });
    res.status(201).json(kpi);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create KPI metrics' });
  }
});

kpiRouter.patch('/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const kpi = await prisma.kPIMetrics.update({
      where: { city: city as any },
      data: req.body
    });
    res.json(kpi);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update KPI metrics' });
  }
});
