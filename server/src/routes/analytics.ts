import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { PrismaClient, City } from '@prisma/client';
import { ReportGenerator } from '../utils/reportGenerator';

const prisma = new PrismaClient();

const router = express.Router();

// Get financial data for events
router.get('/financial', authenticateToken, async (req, res) => {
  try {
    const { city, timeRange } = req.query;
    
    // Calculate date range based on timeRange parameter
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    // Get event briefs with financial data
    const events = await prisma.eventBrief.findMany({
      where: {
        city: city as City,
        date: {
          gte: startDate,
          lte: now
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    // Calculate financial metrics for each event
    const financialData = events.map((event: any) => {
      // Mock cost calculation - replace with actual cost data from your database
      const equipmentCost = Math.random() * 30000000;
      const crewCost = Math.random() * 40000000;
      const venueCost = Math.random() * 50000000;
      const marketingCost = Math.random() * 20000000;
      const otherCost = Math.random() * 10000000;
      
      const totalCost = equipmentCost + crewCost + venueCost + marketingCost + otherCost;
      const revenue = totalCost * (1 + Math.random() * 0.5); // 0-50% profit margin
      const profit = revenue - totalCost;
      const roi = (profit / totalCost) * 100;

      return {
        id: event.id,
        eventName: event.artist,
        date: event.date,
        revenue,
        costs: {
          equipment: equipmentCost,
          crew: crewCost,
          venue: venueCost,
          marketing: marketingCost,
          other: otherCost
        },
        totalCost,
        profit,
        roi
      };
    });

    // Calculate summary
    const totalRevenue = financialData.reduce((sum: number, e: any) => sum + e.revenue, 0);
    const totalCosts = financialData.reduce((sum: number, e: any) => sum + e.totalCost, 0);
    const totalProfit = totalRevenue - totalCosts;
    const averageROI = financialData.length > 0 
      ? financialData.reduce((sum: number, e: any) => sum + e.roi, 0) / financialData.length 
      : 0;

    res.json({
      events: financialData,
      summary: {
        totalRevenue,
        totalCosts,
        totalProfit,
        averageROI,
        eventCount: financialData.length
      }
    });
  } catch (error) {
    console.error('Error fetching financial data:', error);
    res.status(500).json({ error: 'Failed to fetch financial data' });
  }
});

// Get equipment analytics (MTBF, problematic equipment)
router.get('/equipment', authenticateToken, async (req, res) => {
  try {
    const { city } = req.query;
    
    // Get all equipment for the city
    const equipment = await prisma.equipment.findMany({
      where: {
        city: city as City
      }
    });

    // Mock maintenance logs for realistic data
    // TODO: Replace with actual maintenance log query when model is created
    const equipmentAnalytics = equipment.map((eq: any) => {
      // Generate realistic failure data based on equipment status
      let failureCount = 0;
      let totalDowntime = 0;
      
      if (eq.status === 'Faulty') {
        failureCount = Math.floor(Math.random() * 8) + 5; // 5-12 failures
        totalDowntime = Math.floor(Math.random() * 40) + 20; // 20-60 hours
      } else if (eq.status === 'Maintenance') {
        failureCount = Math.floor(Math.random() * 5) + 2; // 2-6 failures
        totalDowntime = Math.floor(Math.random() * 20) + 5; // 5-25 hours
      } else {
        failureCount = Math.floor(Math.random() * 3); // 0-2 failures
        totalDowntime = Math.floor(Math.random() * 10); // 0-10 hours
      }
      
      // Calculate operational hours (30 days * 24 hours)
      const operationalHours = 720;
      
      // MTBF = Operational Hours / Number of Failures
      const mtbf = failureCount > 0 ? operationalHours / failureCount : operationalHours;
      
      // Determine reliability based on MTBF
      let reliability: 'High' | 'Medium' | 'Low';
      if (mtbf > 120) {
        reliability = 'High';
      } else if (mtbf > 60) {
        reliability = 'Medium';
      } else {
        reliability = 'Low';
      }
      
      // Generate last failure date if there were failures
      let lastFailure = null;
      if (failureCount > 0) {
        const daysAgo = Math.floor(Math.random() * 30) + 1;
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        lastFailure = date.toISOString();
      }
      
      return {
        id: eq.id,
        name: eq.name,
        area: eq.area,
        status: eq.status,
        failureCount,
        mtbf: Math.round(mtbf * 10) / 10,
        totalDowntime: Math.round(totalDowntime * 10) / 10,
        lastFailure,
        reliability
      };
    });

    // Sort by failure count to find most problematic
    const sortedByFailures = [...equipmentAnalytics].sort((a, b) => b.failureCount - a.failureCount);

    res.json({
      equipment: equipmentAnalytics,
      summary: {
        totalEquipment: equipment.length,
        averageMTBF: equipmentAnalytics.reduce((sum: number, e: any) => sum + e.mtbf, 0) / equipmentAnalytics.length,
        totalFailures: equipmentAnalytics.reduce((sum: number, e: any) => sum + e.failureCount, 0),
        mostProblematic: sortedByFailures.slice(0, 5)
      }
    });
  } catch (error) {
    console.error('Error fetching equipment analytics:', error);
    res.status(500).json({ error: 'Failed to fetch equipment analytics' });
  }
});

// Get team analytics
router.get('/team', authenticateToken, async (req, res) => {
  try {
    const { city, timeRange } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    // Generate realistic team data
    const roles = ['Technician', 'Operator', 'Engineer', 'Supervisor'];
    const specializations = ['Audio', 'Lighting', 'Video', 'Stage', 'Rigging'];
    const certifications = ['Safety Level 1', 'Safety Level 2', 'Advanced Audio', 'Lighting Design', 'Video Engineering'];
    const names = [
      'Ahmad Hidayat', 'Budi Santoso', 'Chandra Wijaya', 'Dedi Kurniawan', 'Eko Prasetyo',
      'Fajar Ramadhan', 'Gunawan Setiawan', 'Hendra Saputra', 'Indra Kusuma', 'Joko Susilo',
      'Krisna Mahendra', 'Lukman Hakim', 'Made Suryawan', 'Nanda Pratama', 'Oscar Firmansyah',
      'Putra Aditya', 'Rizki Fauzi', 'Surya Dinata', 'Taufik Rahman', 'Umar Basuki'
    ];

    const teamMembers = names.map((name, index) => {
      // Generate role based on index
      const role = roles[index % roles.length];
      
      // Generate performance metrics
      const shiftsCompleted = Math.floor(Math.random() * 30) + 15; // 15-45 shifts
      const averageRating = Math.random() * 1.5 + 3.5; // 3.5-5.0 rating
      const trainingScore = Math.floor(Math.random() * 30) + 70; // 70-100%
      const attendanceRate = Math.floor(Math.random() * 15) + 85; // 85-100%
      const incidents = Math.floor(Math.random() * 4); // 0-3 incidents
      
      // Generate specializations (1-3 per person)
      const numSpecs = Math.floor(Math.random() * 3) + 1;
      const memberSpecs = [...specializations]
        .sort(() => Math.random() - 0.5)
        .slice(0, numSpecs);
      
      // Generate certifications (0-3 per person)
      const numCerts = Math.floor(Math.random() * 4);
      const memberCerts = [...certifications]
        .sort(() => Math.random() - 0.5)
        .slice(0, numCerts);
      
      // Determine performance trend
      let performanceTrend: 'improving' | 'stable' | 'declining';
      if (averageRating >= 4.5) {
        performanceTrend = Math.random() > 0.7 ? 'improving' : 'stable';
      } else if (averageRating < 3.8) {
        performanceTrend = Math.random() > 0.6 ? 'declining' : 'stable';
      } else {
        const rand = Math.random();
        performanceTrend = rand > 0.6 ? 'stable' : rand > 0.3 ? 'improving' : 'declining';
      }
      
      return {
        id: `team-${index}`,
        name,
        role,
        shiftsCompleted,
        averageRating: Math.round(averageRating * 100) / 100,
        specializations: memberSpecs,
        incidents,
        trainingScore,
        attendanceRate,
        certifications: memberCerts,
        performanceTrend
      };
    });

    // Calculate summary metrics
    const totalMembers = teamMembers.length;
    const totalShifts = teamMembers.reduce((sum, m) => sum + m.shiftsCompleted, 0);
    const averageRating = teamMembers.reduce((sum, m) => sum + m.averageRating, 0) / totalMembers;
    const averageTrainingScore = teamMembers.reduce((sum, m) => sum + m.trainingScore, 0) / totalMembers;
    const totalIncidents = teamMembers.reduce((sum, m) => sum + m.incidents, 0);
    const coverageRate = 95 + Math.random() * 5; // 95-100% coverage

    res.json({
      team: teamMembers,
      summary: {
        totalMembers,
        coverageRate: Math.round(coverageRate * 10) / 10,
        totalShifts,
        averageRating: Math.round(averageRating * 100) / 100,
        averageTrainingScore: Math.round(averageTrainingScore),
        totalIncidents
      }
    });
  } catch (error) {
    console.error('Error fetching team analytics:', error);
    res.status(500).json({ error: 'Failed to fetch team analytics' });
  }
});

// Export report - Generate Excel or PDF file
router.post('/export', authenticateToken, async (req, res) => {
  try {
    const { format, reportType, data } = req.body;
    
    console.log('Export request received:', { format, reportType, data });
    
    // Increase timeout for large reports
    req.setTimeout(300000); // 5 minutes
    res.setTimeout(300000);
    
    if (!['excel', 'pdf'].includes(format)) {
      return res.status(400).json({ error: 'Invalid format. Use "excel" or "pdf"' });
    }

    // Generate report based on format and type
    if (format === 'excel') {
      switch (reportType) {
        case 'financial':
          await ReportGenerator.generateFinancialExcel(data, res);
          break;
        case 'equipment':
          await ReportGenerator.generateEquipmentExcel(data, res);
          break;
        case 'team':
          await ReportGenerator.generateTeamExcel(data, res);
          break;
        case 'weekly':
          await ReportGenerator.generateWeeklyExcel(data, res);
          break;
        default:
          return res.status(400).json({ error: 'Invalid report type' });
      }
    } else if (format === 'pdf') {
      switch (reportType) {
        case 'financial':
          await ReportGenerator.generateFinancialPDF(data, res);
          return; // Don't send any JSON after PDF
        case 'equipment':
          await ReportGenerator.generateEquipmentPDF(data, res);
          return; // Don't send any JSON after PDF
        case 'team':
          await ReportGenerator.generateTeamPDF(data, res);
          return; // Don't send any JSON after PDF
        case 'weekly':
          await ReportGenerator.generateWeeklyPDF(data, res);
          return; // Don't send any JSON after PDF
        default:
          return res.status(400).json({ error: 'Invalid report type' });
      }
    }
  } catch (error: any) {
    console.error('Error exporting report:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to export report',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export { router as analyticsRouter };
