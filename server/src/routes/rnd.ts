import { Router } from 'express';
import prisma from '../prisma';

export const rndRouter = Router();

rndRouter.get('/', async (req, res) => {
  try {
    const { city } = req.query;
    const projects = await prisma.rndProject.findMany({
      where: city ? { city: city as any } : undefined,
      orderBy: { createdAt: 'desc' }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch R&D projects' });
  }
});

rndRouter.get('/:id', async (req, res) => {
  try {
    const project = await prisma.rndProject.findUnique({
      where: { id: req.params.id }
    });
    if (!project) {
      return res.status(404).json({ error: 'R&D project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch R&D project' });
  }
});

rndRouter.post('/', async (req, res) => {
  try {
    console.log('Creating R&D project with data:', req.body);
    
    const { title, description, lead, budget, city } = req.body;
    if (!title || !description || !lead || budget === undefined || !city) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['title', 'description', 'lead', 'budget', 'city']
      });
    }

    const project = await prisma.rndProject.create({
      data: {
        title,
        description,
        phase: req.body.phase || 'Idea',
        progress: req.body.progress || 0,
        status: req.body.status || 'Active',
        risks: req.body.risks || [],
        dependencies: req.body.dependencies || [],
        lead,
        targetDate: req.body.targetDate ? new Date(req.body.targetDate) : null,
        budget: parseFloat(budget),
        actualCost: req.body.actualCost ? parseFloat(req.body.actualCost) : 0,
        milestones: req.body.milestones || [],
        notes: req.body.notes || '',
        city
      }
    });
    
    console.log('R&D project created successfully:', project.id);
    res.status(201).json(project);
  } catch (error: any) {
    console.error('Error creating R&D project:', error);
    res.status(500).json({ 
      error: 'Failed to create R&D project',
      details: error.message 
    });
  }
});

rndRouter.patch('/:id', async (req, res) => {
  try {
    const updateData: any = {};
    
    // Only include fields that are present in the request
    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.phase !== undefined) updateData.phase = req.body.phase;
    if (req.body.progress !== undefined) updateData.progress = req.body.progress;
    if (req.body.status !== undefined) updateData.status = req.body.status;
    if (req.body.risks !== undefined) updateData.risks = req.body.risks;
    if (req.body.dependencies !== undefined) updateData.dependencies = req.body.dependencies;
    if (req.body.lead !== undefined) updateData.lead = req.body.lead;
    if (req.body.targetDate !== undefined) {
      updateData.targetDate = req.body.targetDate ? new Date(req.body.targetDate) : null;
    }
    if (req.body.budget !== undefined) updateData.budget = parseFloat(req.body.budget);
    if (req.body.actualCost !== undefined) updateData.actualCost = parseFloat(req.body.actualCost);
    if (req.body.actualLiveDate !== undefined) {
      updateData.actualLiveDate = req.body.actualLiveDate ? new Date(req.body.actualLiveDate) : null;
    }
    if (req.body.milestones !== undefined) updateData.milestones = req.body.milestones;
    if (req.body.notes !== undefined) updateData.notes = req.body.notes;
    
    const project = await prisma.rndProject.update({
      where: { id: req.params.id },
      data: updateData
    });
    res.json(project);
  } catch (error) {
    console.error('Error updating R&D project:', error);
    res.status(500).json({ error: 'Failed to update R&D project' });
  }
});

rndRouter.delete('/:id', async (req, res) => {
  try {
    await prisma.rndProject.delete({
      where: { id: req.params.id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete R&D project' });
  }
});
