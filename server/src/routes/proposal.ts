import { Router } from 'express';
import prisma from '../prisma';

export const proposalRouter = Router();

proposalRouter.get('/', async (req, res) => {
  try {
    const { city } = req.query;
    const proposals = await prisma.proposal.findMany({
      where: city ? { city: city as any } : undefined,
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
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(proposals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch proposals' });
  }
});

proposalRouter.get('/:id', async (req, res) => {
  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id: req.params.id },
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
        }
      }
    });
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    res.json(proposal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch proposal' });
  }
});

proposalRouter.post('/', async (req, res) => {
  try {
    console.log('Creating proposal with data:', req.body);
    
    const { 
      title, type, urgency, estimate, vendor, 
      targetDate, owner, nextAction, quotesCount, 
      city, quotesPdfs, description, estimateApproved, estimateApprovedBy, supplierId 
    } = req.body;
    
    if (!title || !type || !urgency || estimate === undefined || !owner || !nextAction || !city) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['title', 'type', 'urgency', 'estimate', 'owner', 'nextAction', 'city']
      });
    }

    const proposal = await prisma.proposal.create({
      data: {
        title,
        type,
        urgency,
        estimate: parseFloat(estimate),
        vendor: vendor || '',
        status: req.body.status || 'Pending',
        targetDate: targetDate ? new Date(targetDate) : null,
        owner,
        nextAction: nextAction || '',
        quotesCount: quotesCount ? parseInt(quotesCount) : 0,
        quotesPdfs: quotesPdfs || [],
        description: description || '',
        estimateApproved: estimateApproved || false,
        estimateApprovedBy: estimateApprovedBy || null,
        city,
        supplierId: supplierId || null
      }
    });
    
    console.log('Proposal created successfully:', proposal.id);
    res.status(201).json(proposal);
  } catch (error: any) {
    console.error('Error creating proposal:', error);
    res.status(500).json({ 
      error: 'Failed to create proposal',
      details: error.message 
    });
  }
});

proposalRouter.patch('/:id', async (req, res) => {
  try {
    const proposal = await prisma.proposal.update({
      where: { id: req.params.id },
      data: req.body,
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
        }
      }
    });
    res.json(proposal);
  } catch (error: any) {
    console.error('Error updating proposal:', error);
    res.status(500).json({ error: 'Failed to update proposal', details: error.message });
  }
});

proposalRouter.delete('/:id', async (req, res) => {
  try {
    await prisma.proposal.delete({
      where: { id: req.params.id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete proposal' });
  }
});
