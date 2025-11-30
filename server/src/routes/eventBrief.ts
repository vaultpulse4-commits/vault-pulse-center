import { Router } from 'express';
import prisma from '../prisma';
import PDFDocument from 'pdfkit';
import { format } from 'date-fns';

export const eventBriefRouter = Router();

eventBriefRouter.get('/', async (req, res) => {
  try {
    const { city } = req.query;
    const briefs = await prisma.eventBrief.findMany({
      where: city ? { city: city as any } : undefined,
      orderBy: { date: 'desc' }
    });
    res.json(briefs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event briefs' });
  }
});

eventBriefRouter.get('/:id', async (req, res) => {
  try {
    const brief = await prisma.eventBrief.findUnique({
      where: { id: req.params.id }
    });
    if (!brief) {
      return res.status(404).json({ error: 'Event brief not found' });
    }
    res.json(brief);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event brief' });
  }
});

eventBriefRouter.post('/', async (req, res) => {
  try {
    const { artist, date, city, ...optionalFields } = req.body;
    
    // Validate required fields
    if (!artist || !date || !city) {
      return res.status(400).json({ 
        error: 'Artist, date, and city are required' 
      });
    }

    // Parse date to ISO format if needed
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const brief = await prisma.eventBrief.create({
      data: {
        artist,
        date: parsedDate,
        city,
        genre: optionalFields.genre || '',
        setTimes: optionalFields.setTimes || '',
        stagePlotLink: optionalFields.stagePlotLink || null,
        inputListLink: optionalFields.inputListLink || null,
        // Legacy fields (for backward compatibility)
        monitorNeeds: optionalFields.monitorNeeds || '',
        ljCueNotes: optionalFields.ljCueNotes || '',
        vjContentChecklist: optionalFields.vjContentChecklist || '',
        // New fields
        audioOrder: optionalFields.audioOrder || '',
        specialLightingOrder: optionalFields.specialLightingOrder || '',
        visualOrder: optionalFields.visualOrder || '',
        timecodeRouting: optionalFields.timecodeRouting || '',
        brandMoment: optionalFields.brandMoment || '',
        liveSetRecording: optionalFields.liveSetRecording || '',
        sfxNotes: optionalFields.sfxNotes || '',
        briefStatus: optionalFields.briefStatus || 'Draft',
        riskLevel: optionalFields.riskLevel || 'Low'
      }
    });
    res.status(201).json(brief);
  } catch (error: any) {
    console.error('Event brief creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create event brief',
      details: error.message 
    });
  }
});

eventBriefRouter.patch('/:id', async (req, res) => {
  try {
    const brief = await prisma.eventBrief.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(brief);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event brief' });
  }
});

eventBriefRouter.delete('/:id', async (req, res) => {
  try {
    await prisma.eventBrief.delete({
      where: { id: req.params.id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event brief' });
  }
});

// Export event brief as PDF
eventBriefRouter.get('/:id/export-pdf', async (req, res) => {
  try {
    const brief = await prisma.eventBrief.findUnique({
      where: { id: req.params.id }
    });

    if (!brief) {
      return res.status(404).json({ error: 'Event brief not found' });
    }

    // Create PDF document
    const doc = new PDFDocument({ margin: 50 });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=event-brief-${brief.artist.replace(/\s+/g, '-')}.pdf`);
    
    // Pipe PDF to response
    doc.pipe(res);

    // Add header
    doc.fontSize(24).font('Helvetica-Bold').text('EVENT BRIEF', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica').text(`Generated: ${format(new Date(), 'PPP')}`, { align: 'center' });
    doc.moveDown(2);

    // Artist & Event Info
    doc.fontSize(18).font('Helvetica-Bold').text('Event Information');
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica');
    
    const addField = (label: string, value: string) => {
      doc.font('Helvetica-Bold').text(label + ': ', { continued: true })
         .font('Helvetica').text(value || 'N/A');
      doc.moveDown(0.3);
    };

    addField('Artist', brief.artist);
    addField('Genre', brief.genre);
    addField('Date', format(new Date(brief.date), 'EEEE, d MMM yyyy').toUpperCase());
    addField('Set Times', brief.setTimes);
    addField('City', brief.city.charAt(0).toUpperCase() + brief.city.slice(1));
    addField('Risk Level', brief.riskLevel);
    addField('Status', brief.briefStatus);
    
    doc.moveDown(1);

    // Technical Requirements
    doc.fontSize(18).font('Helvetica-Bold').text('Technical Requirements');
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica');

    const addSection = (title: string, content: string) => {
      doc.font('Helvetica-Bold').text(title);
      doc.font('Helvetica').text(content || 'N/A', { indent: 20 });
      doc.moveDown(0.8);
    };

    addSection('Audio Order', brief.audioOrder || brief.monitorNeeds);
    addSection('Special Lighting Order', brief.specialLightingOrder || brief.ljCueNotes);
    addSection('Visual Order', brief.visualOrder || brief.vjContentChecklist);
    addSection('Timecode', brief.timecodeRouting);
    addSection('Brand Moment', brief.brandMoment);
    addSection('Live Set Recording', brief.liveSetRecording);
    addSection('SFX Notes', brief.sfxNotes);

    // Add footer
    doc.moveDown(2);
    doc.fontSize(8).font('Helvetica').text(
      'Vault Pulse Center - Event Brief',
      50,
      doc.page.height - 50,
      { align: 'center' }
    );

    // Finalize PDF
    doc.end();
  } catch (error: any) {
    console.error('PDF generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate PDF',
      details: error.message 
    });
  }
});
