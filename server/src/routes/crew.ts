import { Router } from 'express';
import prisma from '../prisma';

export const crewRouter = Router();

crewRouter.get('/', async (req, res) => {
  try {
    const { city, shift } = req.query;
    const crew = await prisma.crewMember.findMany({
      where: {
        ...(city && { city: city as any }),
        ...(shift && { shift: shift as any })
      },
      orderBy: { name: 'asc' }
    });
    res.json(crew);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch crew' });
  }
});

crewRouter.get('/:id', async (req, res) => {
  try {
    const member = await prisma.crewMember.findUnique({
      where: { id: req.params.id }
    });
    if (!member) {
      return res.status(404).json({ error: 'Crew member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch crew member' });
  }
});

crewRouter.post('/', async (req, res) => {
  try {
    console.log('Creating crew member with data:', req.body);
    
    const { name, role, shift, city } = req.body;
    if (!name || !role || !shift || !city) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'role', 'shift', 'city']
      });
    }

    const member = await prisma.crewMember.create({
      data: {
        name,
        role,
        shift,
        assigned: req.body.assigned || false,
        city
      }
    });
    
    console.log('Crew member created successfully:', member.id);
    res.status(201).json(member);
  } catch (error: any) {
    console.error('Error creating crew member:', error);
    res.status(500).json({ 
      error: 'Failed to create crew member',
      details: error.message 
    });
  }
});

crewRouter.patch('/:id', async (req, res) => {
  try {
    const member = await prisma.crewMember.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update crew member' });
  }
});

crewRouter.delete('/:id', async (req, res) => {
  try {
    await prisma.crewMember.delete({
      where: { id: req.params.id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete crew member' });
  }
});
