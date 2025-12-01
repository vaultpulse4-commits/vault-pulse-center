import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';

export class ReportGenerator {
  private static prisma = new PrismaClient();

  // Generate Financial Report
  static async generateFinancialExcel(data: any, res: Response) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Financial Report');

    // Set column widths
    worksheet.columns = [
      { width: 5 },   // No
      { width: 25 },  // Event Name
      { width: 15 },  // Date
      { width: 15 },  // Revenue
      { width: 15 },  // Total Cost
      { width: 15 },  // Profit
      { width: 10 },  // ROI
      { width: 12 },  // Status
    ];

    // Title
    worksheet.mergeCells('A1:H1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'VAULT CLUB - FINANCIAL ANALYTICS REPORT';
    titleCell.font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1e3a8a' }
    };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getRow(1).height = 30;

    // Metadata
    worksheet.mergeCells('A2:H2');
    const metaCell = worksheet.getCell('A2');
    metaCell.value = `City: ${data.city} | Time Range: ${data.timeRange} | Generated: ${new Date().toLocaleString()}`;
    metaCell.alignment = { horizontal: 'center' };
    metaCell.font = { italic: true, size: 10 };
    worksheet.getRow(2).height = 20;

    // Summary Section
    worksheet.addRow([]);
    worksheet.mergeCells('A4:B4');
    worksheet.getCell('A4').value = 'SUMMARY';
    worksheet.getCell('A4').font = { bold: true, size: 12 };
    worksheet.getCell('A4').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFe5e7eb' }
    };

    worksheet.addRow(['Total Revenue', this.formatCurrency(data.summary.totalRevenue)]);
    worksheet.addRow(['Total Costs', this.formatCurrency(data.summary.totalCosts)]);
    worksheet.addRow(['Net Profit', this.formatCurrency(data.summary.totalProfit)]);
    worksheet.addRow(['Average ROI', `${data.summary.averageROI.toFixed(2)}%`]);
    worksheet.addRow(['Event Count', data.summary.eventCount]);

    // Style summary rows
    for (let i = 5; i <= 9; i++) {
      worksheet.getRow(i).getCell(1).font = { bold: true };
      worksheet.getRow(i).getCell(2).alignment = { horizontal: 'right' };
    }

    // Add space
    worksheet.addRow([]);

    // Table Header
    const headerRow = worksheet.addRow([
      'No',
      'Event Name',
      'Date',
      'Revenue',
      'Total Cost',
      'Profit',
      'ROI (%)',
      'Status'
    ]);

    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF3b82f6' }
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 25;

    // Data Rows
    data.events.forEach((event: any, index: number) => {
      const row = worksheet.addRow([
        index + 1,
        event.eventName,
        new Date(event.date).toLocaleDateString('id-ID'),
        this.formatCurrency(event.revenue),
        this.formatCurrency(event.totalCost),
        this.formatCurrency(event.profit),
        event.roi.toFixed(2),
        event.profit >= 0 ? 'Profitable' : 'Loss'
      ]);

      // Alternate row colors
      if (index % 2 === 0) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFf9fafb' }
        };
      }

      // Number alignment
      row.getCell(4).alignment = { horizontal: 'right' };
      row.getCell(5).alignment = { horizontal: 'right' };
      row.getCell(6).alignment = { horizontal: 'right' };
      row.getCell(7).alignment = { horizontal: 'right' };
      row.getCell(8).alignment = { horizontal: 'center' };

      // Profit color
      if (event.profit < 0) {
        row.getCell(6).font = { color: { argb: 'FFef4444' }, bold: true };
      } else {
        row.getCell(6).font = { color: { argb: 'FF10b981' }, bold: true };
      }
    });

    // Add borders to table
    const lastRow = worksheet.lastRow;
    if (lastRow) {
      for (let i = 11; i <= lastRow.number; i++) {
        const row = worksheet.getRow(i);
        for (let j = 1; j <= 8; j++) {
          row.getCell(j).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        }
      }
    }

    // Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=Financial_Report_${data.city}_${Date.now()}.xlsx`
    );

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  }

  // Generate Equipment Analytics Report
  static async generateEquipmentExcel(data: any, res: Response) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Equipment Analytics');

    worksheet.columns = [
      { width: 5 },   // No
      { width: 25 },  // Equipment Name
      { width: 15 },  // Area
      { width: 12 },  // Status
      { width: 12 },  // MTBF
      { width: 10 },  // Failures
      { width: 12 },  // Downtime
      { width: 15 },  // Last Failure
      { width: 12 },  // Reliability
    ];

    // Title
    worksheet.mergeCells('A1:I1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'VAULT CLUB - EQUIPMENT ANALYTICS REPORT';
    titleCell.font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF059669' }
    };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getRow(1).height = 30;

    // Metadata
    worksheet.mergeCells('A2:I2');
    const metaCell = worksheet.getCell('A2');
    metaCell.value = `City: ${data.city} | Generated: ${new Date().toLocaleString()}`;
    metaCell.alignment = { horizontal: 'center' };
    metaCell.font = { italic: true, size: 10 };

    // Summary
    worksheet.addRow([]);
    worksheet.mergeCells('A4:B4');
    worksheet.getCell('A4').value = 'SUMMARY';
    worksheet.getCell('A4').font = { bold: true, size: 12 };

    worksheet.addRow(['Total Equipment', data.summary.totalEquipment]);
    worksheet.addRow(['Average MTBF', `${data.summary.averageMTBF.toFixed(1)} hours`]);
    worksheet.addRow(['Total Failures', data.summary.totalFailures]);
    worksheet.addRow(['Reliability Rate', `${((data.equipment.filter((e: any) => e.reliability === 'High').length / data.summary.totalEquipment) * 100).toFixed(1)}%`]);

    worksheet.addRow([]);

    // Header
    const headerRow = worksheet.addRow([
      'No',
      'Equipment Name',
      'Area',
      'Status',
      'MTBF (h)',
      'Failures',
      'Downtime (h)',
      'Last Failure',
      'Reliability'
    ]);

    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF10b981' }
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 25;

    // Data
    data.equipment.forEach((eq: any, index: number) => {
      const row = worksheet.addRow([
        index + 1,
        eq.name,
        eq.area,
        eq.status,
        eq.mtbf.toFixed(1),
        eq.failureCount,
        eq.totalDowntime.toFixed(1),
        eq.lastFailure ? new Date(eq.lastFailure).toLocaleDateString('id-ID') : '-',
        eq.reliability
      ]);

      if (index % 2 === 0) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFf9fafb' }
        };
      }

      // Reliability color
      const reliabilityCell = row.getCell(9);
      if (eq.reliability === 'High') {
        reliabilityCell.font = { color: { argb: 'FF10b981' }, bold: true };
      } else if (eq.reliability === 'Medium') {
        reliabilityCell.font = { color: { argb: 'FFf59e0b' }, bold: true };
      } else {
        reliabilityCell.font = { color: { argb: 'FFef4444' }, bold: true };
      }
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=Equipment_Analytics_${data.city}_${Date.now()}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  }

  // Generate Team Analytics Report
  static async generateTeamExcel(data: any, res: Response) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Team Analytics');

    worksheet.columns = [
      { width: 5 },   // No
      { width: 25 },  // Name
      { width: 15 },  // Role
      { width: 10 },  // Rating
      { width: 10 },  // Shifts
      { width: 12 },  // Training
      { width: 12 },  // Attendance
      { width: 10 },  // Incidents
      { width: 30 },  // Specializations
      { width: 12 },  // Trend
    ];

    // Title
    worksheet.mergeCells('A1:J1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'VAULT CLUB - TEAM ANALYTICS REPORT';
    titleCell.font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFf59e0b' }
    };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getRow(1).height = 30;

    // Metadata
    worksheet.mergeCells('A2:J2');
    const metaCell = worksheet.getCell('A2');
    metaCell.value = `City: ${data.city} | Time Range: ${data.timeRange} | Generated: ${new Date().toLocaleString()}`;
    metaCell.alignment = { horizontal: 'center' };
    metaCell.font = { italic: true, size: 10 };

    // Summary
    worksheet.addRow([]);
    worksheet.mergeCells('A4:B4');
    worksheet.getCell('A4').value = 'SUMMARY';
    worksheet.getCell('A4').font = { bold: true, size: 12 };

    worksheet.addRow(['Team Size', data.summary.totalMembers]);
    worksheet.addRow(['Average Rating', `${data.summary.averageRating.toFixed(2)} ★`]);
    worksheet.addRow(['Coverage Rate', `${data.summary.coverageRate.toFixed(1)}%`]);
    worksheet.addRow(['Total Shifts', data.summary.totalShifts]);
    worksheet.addRow(['Avg Training Score', `${data.summary.averageTrainingScore.toFixed(0)}%`]);
    worksheet.addRow(['Total Incidents', data.summary.totalIncidents]);

    worksheet.addRow([]);

    // Header
    const headerRow = worksheet.addRow([
      'No',
      'Name',
      'Role',
      'Rating',
      'Shifts',
      'Training',
      'Attendance',
      'Incidents',
      'Specializations',
      'Trend'
    ]);

    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFf59e0b' }
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 25;

    // Data
    data.team.forEach((member: any, index: number) => {
      const row = worksheet.addRow([
        index + 1,
        member.name,
        member.role,
        `${member.averageRating.toFixed(2)} ★`,
        member.shiftsCompleted,
        `${member.trainingScore}%`,
        `${member.attendanceRate}%`,
        member.incidents,
        member.specializations.join(', '),
        member.performanceTrend === 'improving' ? '↑ Improving' : member.performanceTrend === 'declining' ? '↓ Declining' : '→ Stable'
      ]);

      if (index % 2 === 0) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFf9fafb' }
        };
      }

      // Rating color
      const ratingCell = row.getCell(4);
      if (member.averageRating >= 4.5) {
        ratingCell.font = { color: { argb: 'FF10b981' }, bold: true };
      } else if (member.averageRating >= 3.5) {
        ratingCell.font = { color: { argb: 'FF3b82f6' }, bold: true };
      } else {
        ratingCell.font = { color: { argb: 'FFf59e0b' }, bold: true };
      }

      // Trend color
      const trendCell = row.getCell(10);
      if (member.performanceTrend === 'improving') {
        trendCell.font = { color: { argb: 'FF10b981' }, bold: true };
      } else if (member.performanceTrend === 'declining') {
        trendCell.font = { color: { argb: 'FFef4444' }, bold: true };
      }
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=Team_Analytics_${data.city}_${data.timeRange}_${Date.now()}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  }

  // Helper method to format currency
  private static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Helper method to format date range
  private static getWeekDateRange(year: number, week: number): { startDate: Date; endDate: Date } {
    const startDate = new Date(year, 0, 1 + (week - 1) * 7);
    const dow = startDate.getDay();
    const ISOweekStart = startDate;
    if (dow <= 4) {
      ISOweekStart.setDate(startDate.getDate() - dow + 1);
    } else {
      ISOweekStart.setDate(startDate.getDate() + 8 - dow);
    }
    const endDate = new Date(ISOweekStart);
    endDate.setDate(ISOweekStart.getDate() + 6);
    return { startDate: ISOweekStart, endDate };
  }

  // Generate Weekly Excel Report
  static async generateWeeklyExcel(data: { city: string; startDate: string; endDate: string }, res: Response) {
    try {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      
      // Fetch data for the week
      const [equipment, maintenanceLogs, consumables] = await Promise.all([
        this.prisma.equipment.findMany({
          where: { city: data.city as any },
          include: {
            area: true,
            maintenanceLogs: {
              where: {
                createdAt: {
                  gte: startDate,
                  lte: endDate
                }
              }
            },
            inspections: {
              where: {
                date: {
                  gte: startDate,
                  lte: endDate
                }
              }
            }
          }
        }),
        this.prisma.maintenanceLog.findMany({
          where: {
            city: data.city as any,
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          },
          include: {
            equipment: true,
            technician: true
          }
        }),
        this.prisma.consumable.findMany({
          where: {
            city: data.city as any
          },
          include: {
            stockMovements: {
              where: {
                createdAt: {
                  gte: startDate,
                  lte: endDate
                }
              }
            }
          }
        })
      ]);

      const workbook = new ExcelJS.Workbook();
      
      // Equipment Health Sheet
      const equipmentSheet = workbook.addWorksheet('Equipment Health');
      equipmentSheet.columns = [
        { width: 5 },   // No
        { width: 25 },  // Equipment Name
        { width: 15 },  // Area
        { width: 12 },  // Status
        { width: 15 },  // Last Inspection
        { width: 15 },  // Next Due
        { width: 20 },  // Recent Issues
        { width: 12 },  // Maintenance Count
      ];

      // Title
      equipmentSheet.mergeCells('A1:H1');
      const titleCell = equipmentSheet.getCell('A1');
      titleCell.value = `VAULT CLUB - WEEKLY EQUIPMENT HEALTH REPORT`;
      titleCell.font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
      titleCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF059669' }
      };
      titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
      equipmentSheet.getRow(1).height = 30;

      // Metadata
      equipmentSheet.mergeCells('A2:H2');
      const metaCell = equipmentSheet.getCell('A2');
      metaCell.value = `City: ${data.city} | Week: ${data.startDate} to ${data.endDate} | Generated: ${new Date().toLocaleString()}`;
      metaCell.alignment = { horizontal: 'center' };
      metaCell.font = { italic: true, size: 10 };

      equipmentSheet.addRow([]);

      // Equipment Header
      const equipmentHeaderRow = equipmentSheet.addRow([
        'No',
        'Equipment Name',
        'Area',
        'Status',
        'Last Inspection',
        'Next Due',
        'Recent Issues',
        'Maintenance Count'
      ]);

      equipmentHeaderRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      equipmentHeaderRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF10b981' }
      };

      // Equipment Data
      equipment.forEach((eq, index) => {
        const recentIssues = eq.inspections
          .flatMap(inspection => inspection.issues)
          .join(', ') || 'None';
        
        const row = equipmentSheet.addRow([
          index + 1,
          eq.name,
          eq.area?.name || 'N/A',
          eq.status,
          eq.lastInspection ? new Date(eq.lastInspection).toLocaleDateString('id-ID') : 'N/A',
          eq.nextDue ? new Date(eq.nextDue).toLocaleDateString('id-ID') : 'N/A',
          recentIssues.substring(0, 50),
          eq.maintenanceLogs.length
        ]);

        if (index % 2 === 0) {
          row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFf9fafb' }
          };
        }
      });

      // Maintenance Sheet
      const maintenanceSheet = workbook.addWorksheet('Maintenance Logs');
      maintenanceSheet.columns = [
        { width: 5 },   // No
        { width: 20 },  // Equipment
        { width: 12 },  // Type
        { width: 30 },  // Issue
        { width: 12 },  // Status
        { width: 15 },  // Date
        { width: 20 },  // Technician
        { width: 12 },  // Cost
        { width: 10 },  // MTTR
      ];

      // Title
      maintenanceSheet.mergeCells('A1:I1');
      const maintenanceTitleCell = maintenanceSheet.getCell('A1');
      maintenanceTitleCell.value = 'WEEKLY MAINTENANCE LOGS';
      maintenanceTitleCell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
      maintenanceTitleCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF3b82f6' }
      };
      maintenanceTitleCell.alignment = { vertical: 'middle', horizontal: 'center' };

      maintenanceSheet.addRow([]);

      // Maintenance Header
      const maintenanceHeaderRow = maintenanceSheet.addRow([
        'No',
        'Equipment',
        'Type',
        'Issue',
        'Status',
        'Date',
        'Technician',
        'Cost',
        'MTTR (h)'
      ]);

      maintenanceHeaderRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      maintenanceHeaderRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF3b82f6' }
      };

      // Maintenance Data
      maintenanceLogs.forEach((log, index) => {
        const row = maintenanceSheet.addRow([
          index + 1,
          log.equipment?.name || 'N/A',
          log.type,
          log.issue.substring(0, 30),
          log.status,
          new Date(log.date).toLocaleDateString('id-ID'),
          log.technician?.name || 'N/A',
          this.formatCurrency(log.cost),
          log.mttr || 'N/A'
        ]);

        if (index % 2 === 0) {
          row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFf9fafb' }
          };
        }
      });

      // Consumables Sheet
      const consumablesSheet = workbook.addWorksheet('Consumables Status');
      consumablesSheet.columns = [
        { width: 5 },   // No
        { width: 25 },  // Name
        { width: 15 },  // Category
        { width: 12 },  // Current Stock
        { width: 10 },  // Unit
        { width: 12 },  // Min Stock
        { width: 15 },  // Stock Status
        { width: 12 },  // Weekly Movement
      ];

      // Title
      consumablesSheet.mergeCells('A1:H1');
      const consumablesTitleCell = consumablesSheet.getCell('A1');
      consumablesTitleCell.value = 'WEEKLY CONSUMABLES STATUS';
      consumablesTitleCell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
      consumablesTitleCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFf59e0b' }
      };
      consumablesTitleCell.alignment = { vertical: 'middle', horizontal: 'center' };

      consumablesSheet.addRow([]);

      // Consumables Header
      const consumablesHeaderRow = consumablesSheet.addRow([
        'No',
        'Name',
        'Category',
        'Current Stock',
        'Unit',
        'Min Stock',
        'Stock Status',
        'Weekly Movement'
      ]);

      consumablesHeaderRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      consumablesHeaderRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFf59e0b' }
      };

      // Consumables Data
      consumables.forEach((consumable, index) => {
        const weeklyMovement = consumable.stockMovements.reduce((sum, movement) => {
          return movement.type === 'Usage' ? sum + movement.quantity : sum;
        }, 0);

        const stockStatus = consumable.currentStock <= consumable.minStock ? 'Low Stock' :
                           consumable.currentStock <= consumable.reorderPoint ? 'Reorder' : 'OK';

        const row = consumablesSheet.addRow([
          index + 1,
          consumable.name,
          consumable.category,
          consumable.currentStock,
          consumable.unit,
          consumable.minStock,
          stockStatus,
          weeklyMovement
        ]);

        if (index % 2 === 0) {
          row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFf9fafb' }
          };
        }

        // Color code stock status
        const statusCell = row.getCell(7);
        if (stockStatus === 'Low Stock') {
          statusCell.font = { color: { argb: 'FFef4444' }, bold: true };
        } else if (stockStatus === 'Reorder') {
          statusCell.font = { color: { argb: 'FFf59e0b' }, bold: true };
        } else {
          statusCell.font = { color: { argb: 'FF10b981' }, bold: true };
        }
      });

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=Weekly_Report_${data.city}_${data.startDate}_${Date.now()}.xlsx`
      );

      await workbook.xlsx.write(res);
      res.end();

    } catch (error) {
      console.error('Error generating weekly Excel report:', error);
      res.status(500).json({ error: 'Failed to generate weekly Excel report' });
    }
  }

  // Generate Weekly PDF Report
  static async generateWeeklyPDF(data: { city: string; startDate: string; endDate: string }, res: Response) {
    try {
      console.log('Generating weekly PDF for:', data);
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      
      // Fetch data for the week
      const [equipment, maintenanceLogs, consumables] = await Promise.all([
        this.prisma.equipment.findMany({
          where: { city: data.city as any },
          include: {
            area: true,
            inspections: {
              take: 5,
              orderBy: { date: 'desc' }
            }
          }
        }),
        this.prisma.maintenanceLog.findMany({
          where: {
            city: data.city as any,
            date: {
              gte: startDate,
              lte: endDate
            }
          },
          include: {
            equipment: true,
            technician: true,
            supplier: true
          }
        }),
        this.prisma.consumable.findMany({
          where: {
            city: data.city as any
          }
        })
      ]);

      console.log('Data fetched:', {
        equipment: equipment.length,
        maintenanceLogs: maintenanceLogs.length,
        consumables: consumables.length
      });

      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=Weekly_Report_${data.city}_${Date.now()}.pdf`
      );

      const stream = doc.pipe(res);
      
      // Handle stream errors
      stream.on('error', (err) => {
        console.error('Stream error:', err);
      });

      // Header with gradient-like effect
      doc.rect(0, 0, 595, 80).fill('#1e3a8a');
      doc.fontSize(24).fillColor('#ffffff').text('VAULT CLUB', 40, 20, { align: 'center' });
      doc.fontSize(14).fillColor('#e0e7ff').text('Weekly Operations Report', 40, 50, { align: 'center' });
      
      // Metadata bar
      doc.rect(0, 80, 595, 35).fill('#f8fafc');
      const weekStart = new Date(startDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
      const weekEnd = new Date(endDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
      doc.fontSize(9).fillColor('#64748b')
        .text(`Location: ${data.city.toUpperCase()}`, 50, 90)
        .text(`Period: ${weekStart} - ${weekEnd}`, 230, 90)
        .text(`Generated: ${new Date().toLocaleDateString('id-ID')}`, 450, 90);
      
      doc.moveDown(3);

      // Summary Section with cards
      doc.fontSize(16).fillColor('#1e293b').text('EXECUTIVE SUMMARY', 40, 130);
      doc.moveDown(0.8);

      const totalMaintenance = maintenanceLogs.length;
      const criticalEquipment = equipment.filter(eq => eq.status === 'OOS' || eq.status === 'Degraded').length;
      const lowStockItems = consumables.filter(c => c.currentStock <= c.minStock).length;
      const operationalEquipment = equipment.length - criticalEquipment;

      const summaryCards = [
        { label: 'Total Equipment', value: equipment.length.toString(), color: '#3b82f6' },
        { label: 'Operational', value: operationalEquipment.toString(), color: '#10b981' },
        { label: 'Critical Issues', value: criticalEquipment.toString(), color: '#ef4444' },
        { label: 'Maintenance Done', value: totalMaintenance.toString(), color: '#f59e0b' }
      ];

      const cardY = doc.y;
      let cardX = 50;
      summaryCards.forEach((card) => {
        // Draw card background
        doc.rect(cardX, cardY, 115, 50).fill('#ffffff').stroke('#e2e8f0');
        
        // Draw value (large number)
        doc.fontSize(24).fillColor(card.color).text(card.value, cardX + 10, cardY + 8, { width: 95, align: 'center' });
        
        // Draw label (small text)
        doc.fontSize(8).fillColor('#64748b').text(card.label, cardX + 10, cardY + 35, { width: 95, align: 'center' });
        
        cardX += 125;
      });

      doc.moveDown(3.5);
      
      // Alert box if critical issues
      if (criticalEquipment > 0 || lowStockItems > 0) {
        doc.rect(40, doc.y, 515, 30).fill('#fef3c7').stroke('#f59e0b');
        doc.fontSize(10).fillColor('#92400e').font('Helvetica-Bold')
          .text(`ATTENTION: ${criticalEquipment} critical equipment issues & ${lowStockItems} low stock items require immediate action`, 50, doc.y + 10, { width: 495 });
        doc.font('Helvetica').moveDown(2);
      }
      
      doc.moveDown(1);

      // Equipment Health Section
      doc.fontSize(14).fillColor('#1e293b').text('EQUIPMENT HEALTH STATUS', { underline: false });
      doc.moveDown(0.3);
      doc.fontSize(8).fillColor('#64748b').text(`Showing ${Math.min(equipment.length, 15)} of ${equipment.length} equipment`);
      doc.moveDown(0.5);

      if (doc.y > 650) {
        doc.addPage();
      }

      const equipmentTableTop = doc.y;
      const equipmentCols = [25, 140, 75, 70, 75, 145];
      const equipmentHeaders = ['#', 'Equipment Name', 'Area', 'Status', 'Next Due', 'Recent Issues'];
      
      let xPos = 40;
      doc.fontSize(8).fillColor('#ffffff').font('Helvetica-Bold');
      doc.rect(40, equipmentTableTop, 515, 22).fill('#10b981');
      
      equipmentHeaders.forEach((header, i) => {
        doc.text(header, xPos + 3, equipmentTableTop + 6, { width: equipmentCols[i], align: 'left' });
        xPos += equipmentCols[i];
      });

      doc.font('Helvetica').moveDown(1.5);

      equipment.slice(0, 15).forEach((eq, index) => {
        if (doc.y > 700) {
          doc.addPage();
        }

        const rowTop = doc.y;
        xPos = 40;

        if (index % 2 === 0) {
          doc.rect(40, rowTop, 515, 20).fillAndStroke('#f9fafb', '#e5e7eb');
        }

        doc.fillColor('#000000').fontSize(8);
        
        const recentIssues = eq.inspections && eq.inspections.length > 0
          ? eq.inspections
              .flatMap(inspection => inspection.issues || [])
              .filter(issue => issue && issue.trim())
              .join(', ') || 'None'
          : 'None';

        const rowData = [
          (index + 1).toString(),
          eq.name.substring(0, 20),
          eq.area?.name?.substring(0, 12) || 'N/A',
          eq.status,
          eq.nextDue ? new Date(eq.nextDue).toLocaleDateString('id-ID') : 'N/A',
          recentIssues.substring(0, 25)
        ];

        rowData.forEach((text, i) => {
          doc.text(text, xPos + 3, rowTop + 3, { width: equipmentCols[i] - 3, align: i === 0 ? 'center' : 'left' });
          xPos += equipmentCols[i];
        });

        doc.moveDown(1.1);
      });

      doc.moveDown(1);

      // Maintenance Activities Section  
      if (doc.y > 600) {
        doc.addPage();
      }

      doc.fontSize(14).fillColor('#1e293b').text('MAINTENANCE ACTIVITIES', { underline: false });
      doc.moveDown(0.3);
      doc.fontSize(8).fillColor('#64748b').text(`${maintenanceLogs.length} maintenance activities recorded this week`);
      doc.moveDown(0.5);

      if (doc.y > 650) {
        doc.addPage();
      }

      const maintenanceTableTop = doc.y;
      const maintenanceCols = [25, 115, 75, 105, 80, 120];
      const maintenanceHeaders = ['#', 'Equipment', 'Type', 'Issue Description', 'Status', 'Date'];
      
      xPos = 40;
      doc.fontSize(8).fillColor('#ffffff').font('Helvetica-Bold');
      doc.rect(40, maintenanceTableTop, 515, 22).fill('#3b82f6');
      
      maintenanceHeaders.forEach((header, i) => {
        doc.text(header, xPos + 3, maintenanceTableTop + 6, { width: maintenanceCols[i], align: 'left' });
        xPos += maintenanceCols[i];
      });

      doc.font('Helvetica').moveDown(1.5);

      maintenanceLogs.slice(0, 12).forEach((log, index) => {
        if (doc.y > 700) {
          doc.addPage();
        }

        const rowTop = doc.y;
        xPos = 40;

        if (index % 2 === 0) {
          doc.rect(40, rowTop, 515, 20).fillAndStroke('#f9fafb', '#e5e7eb');
        }

        doc.fillColor('#000000').fontSize(8);
        
        const rowData = [
          (index + 1).toString(),
          (log as any).equipment?.name?.substring(0, 18) || 'N/A',
          log.type,
          log.issue.substring(0, 20),
          log.status,
          new Date(log.date).toLocaleDateString('id-ID')
        ];

        rowData.forEach((text, i) => {
          doc.text(text, xPos + 3, rowTop + 3, { width: maintenanceCols[i] - 3, align: i === 0 ? 'center' : 'left' });
          xPos += maintenanceCols[i];
        });

        doc.moveDown(1.1);
      });

      doc.moveDown(1);

      // Consumables Section
      if (doc.y > 600) {
        doc.addPage();
      }

      doc.fontSize(14).fillColor('#1e293b').text('CONSUMABLES INVENTORY', { underline: false });
      doc.moveDown(0.3);
      const lowStock = consumables.filter(c => c.currentStock <= c.minStock).length;
      doc.fontSize(8).fillColor('#64748b').text(`${consumables.length} items tracked | ${lowStock} items below minimum stock`);
      doc.moveDown(0.5);

      const consumablesTableTop = doc.y;
      const consumablesCols = [25, 130, 75, 65, 55, 55, 120];
      const consumablesHeaders = ['#', 'Item Name', 'Category', 'Current', 'Unit', 'Min', 'Status'];
      
      xPos = 40;
      doc.fontSize(8).fillColor('#ffffff').font('Helvetica-Bold');
      doc.rect(40, consumablesTableTop, 515, 22).fill('#f59e0b');
      
      consumablesHeaders.forEach((header, i) => {
        doc.text(header, xPos + 3, consumablesTableTop + 6, { width: consumablesCols[i], align: 'left' });
        xPos += consumablesCols[i];
      });

      doc.font('Helvetica').moveDown(1.5);

      consumables.slice(0, 15).forEach((item, index) => {
        if (doc.y > 700) {
          doc.addPage();
        }

        const rowTop = doc.y;
        xPos = 40;

        if (index % 2 === 0) {
          doc.rect(40, rowTop, 515, 20).fillAndStroke('#f9fafb', '#e5e7eb');
        }

        const stockStatus = item.currentStock <= item.minStock ? 'LOW' :
                           item.currentStock <= item.reorderPoint ? 'REORDER' : 'OK';

        doc.fillColor('#000000').fontSize(8);
        
        const rowData = [
          (index + 1).toString(),
          item.name.substring(0, 20),
          item.category.substring(0, 12),
          item.currentStock.toString(),
          item.unit,
          item.minStock.toString(),
          stockStatus
        ];

        rowData.forEach((text, i) => {
          if (i === 6) { // Status column - add color
            if (stockStatus === 'LOW') {
              doc.fillColor('#ef4444');
            } else if (stockStatus === 'REORDER') {
              doc.fillColor('#f59e0b');
            } else {
              doc.fillColor('#10b981');
            }
          }
          doc.text(text, xPos + 3, rowTop + 3, { width: consumablesCols[i] - 3, align: i === 0 ? 'center' : 'left' });
          if (i === 6) doc.fillColor('#000000'); // Reset color
          xPos += consumablesCols[i];
        });

        doc.moveDown(1.1);
      });

      // Professional Footer
      doc.rect(0, 770, 595, 30).fill('#f1f5f9');
      doc.fontSize(7).fillColor('#64748b')
        .text('Generated by Vault Pulse Center', 40, 780)
        .text(`Page ${doc.bufferedPageRange().count}`, 0, 780, { align: 'center', width: 595 })
        .text(new Date().toLocaleTimeString('id-ID'), 500, 780);

      console.log('Finalizing PDF document...');
      
      // Wait for the document to finish writing
      await new Promise<void>((resolve, reject) => {
        doc.on('finish', () => {
          console.log('PDF document finished writing');
          resolve();
        });
        
        doc.on('error', (err) => {
          console.error('PDF document error:', err);
          reject(err);
        });
        
        doc.end();
      });
      
      console.log('Weekly PDF generated successfully');

    } catch (error: any) {
      console.error('Error generating weekly PDF report:', error);
      console.error('Error stack:', error.stack);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to generate weekly PDF report', details: error.message });
      }
    }
  }

  // ============= PDF GENERATORS =============

  // Generate Financial Report PDF
  static async generateFinancialPDF(data: any, res: Response) {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=Financial_Report_${data.city}_${Date.now()}.pdf`
    );

    doc.pipe(res);

    // Header
    doc.fontSize(20).fillColor('#1e3a8a').text('VAULT CLUB', { align: 'center' });
    doc.fontSize(16).text('Financial Analytics Report', { align: 'center' });
    doc.moveDown(0.5);
    
    // Metadata
    doc.fontSize(10).fillColor('#666666')
      .text(`City: ${data.city} | Time Range: ${data.timeRange} | Generated: ${new Date().toLocaleString('id-ID')}`, {
        align: 'center'
      });
    
    doc.moveDown(1);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(1);

    // Summary Section
    doc.fontSize(14).fillColor('#000000').text('SUMMARY', { underline: true });
    doc.moveDown(0.5);

    const summaryData = [
      ['Total Revenue', this.formatCurrency(data.summary.totalRevenue)],
      ['Total Costs', this.formatCurrency(data.summary.totalCosts)],
      ['Net Profit', this.formatCurrency(data.summary.totalProfit)],
      ['Average ROI', `${data.summary.averageROI.toFixed(2)}%`],
      ['Event Count', data.summary.eventCount.toString()]
    ];

    summaryData.forEach(([label, value]) => {
      doc.fontSize(11).fillColor('#000000').text(label, 70, doc.y, { continued: true, width: 200 });
      doc.text(value, { align: 'right' });
      doc.moveDown(0.3);
    });

    doc.moveDown(1);

    // Events Table
    doc.fontSize(14).fillColor('#000000').text('EVENT DETAILS', { underline: true });
    doc.moveDown(0.5);

    // Table headers
    const tableTop = doc.y;
    const colWidths = [30, 150, 80, 80, 80, 75];
    const headers = ['No', 'Event Name', 'Revenue', 'Costs', 'Profit', 'ROI'];
    
    let xPos = 50;
    doc.fontSize(10).fillColor('#ffffff');
    doc.rect(50, tableTop, 495, 20).fill('#3b82f6');
    
    headers.forEach((header, i) => {
      doc.text(header, xPos + 5, tableTop + 5, { width: colWidths[i], align: 'left' });
      xPos += colWidths[i];
    });

    doc.moveDown(1.5);

    // Table rows
    data.events.forEach((event: any, index: number) => {
      if (doc.y > 700) {
        doc.addPage();
      }

      const rowTop = doc.y;
      xPos = 50;

      // Alternate row colors
      if (index % 2 === 0) {
        doc.rect(50, rowTop, 495, 20).fillAndStroke('#f9fafb', '#e5e7eb');
      }

      doc.fillColor('#000000').fontSize(9);
      
      const rowData = [
        (index + 1).toString(),
        event.eventName.substring(0, 25) + (event.eventName.length > 25 ? '...' : ''),
        this.formatCurrency(event.revenue),
        this.formatCurrency(event.totalCost),
        this.formatCurrency(event.profit),
        `${event.roi.toFixed(1)}%`
      ];

      rowData.forEach((text, i) => {
        doc.text(text, xPos + 5, rowTop + 5, { width: colWidths[i] - 5, align: i === 0 ? 'center' : 'left' });
        xPos += colWidths[i];
      });

      doc.moveDown(1.2);
    });

    // Footer
    doc.fontSize(8).fillColor('#999999')
      .text(`Generated by Vault Pulse Center | Page ${doc.bufferedPageRange().count}`, 50, 750, {
        align: 'center'
      });

    doc.end();
  }

  // Generate Equipment Analytics PDF
  static async generateEquipmentPDF(data: any, res: Response) {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=Equipment_Analytics_${data.city}_${Date.now()}.pdf`
    );

    doc.pipe(res);

    // Header
    doc.fontSize(20).fillColor('#059669').text('VAULT CLUB', { align: 'center' });
    doc.fontSize(16).text('Equipment Analytics Report', { align: 'center' });
    doc.moveDown(0.5);
    
    doc.fontSize(10).fillColor('#666666')
      .text(`City: ${data.city} | Generated: ${new Date().toLocaleString('id-ID')}`, {
        align: 'center'
      });
    
    doc.moveDown(1);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(1);

    // Summary
    doc.fontSize(14).fillColor('#000000').text('SUMMARY', { underline: true });
    doc.moveDown(0.5);

    const summaryData = [
      ['Total Equipment', data.summary.totalEquipment.toString()],
      ['Average MTBF', `${data.summary.averageMTBF.toFixed(1)} hours`],
      ['Total Failures', data.summary.totalFailures.toString()],
      ['High Reliability', `${data.equipment.filter((e: any) => e.reliability === 'High').length} units`]
    ];

    summaryData.forEach(([label, value]) => {
      doc.fontSize(11).fillColor('#000000').text(label, 70, doc.y, { continued: true, width: 200 });
      doc.text(value, { align: 'right' });
      doc.moveDown(0.3);
    });

    doc.moveDown(1);

    // Equipment Table
    doc.fontSize(14).fillColor('#000000').text('EQUIPMENT DETAILS', { underline: true });
    doc.moveDown(0.5);

    const tableTop = doc.y;
    const colWidths = [30, 150, 80, 60, 70, 105];
    const headers = ['No', 'Equipment', 'Status', 'MTBF', 'Failures', 'Reliability'];
    
    let xPos = 50;
    doc.fontSize(10).fillColor('#ffffff');
    doc.rect(50, tableTop, 495, 20).fill('#10b981');
    
    headers.forEach((header, i) => {
      doc.text(header, xPos + 5, tableTop + 5, { width: colWidths[i], align: 'left' });
      xPos += colWidths[i];
    });

    doc.moveDown(1.5);

    // Rows
    data.equipment.forEach((eq: any, index: number) => {
      if (doc.y > 700) {
        doc.addPage();
      }

      const rowTop = doc.y;
      xPos = 50;

      if (index % 2 === 0) {
        doc.rect(50, rowTop, 495, 20).fillAndStroke('#f9fafb', '#e5e7eb');
      }

      doc.fillColor('#000000').fontSize(9);
      
      const rowData = [
        (index + 1).toString(),
        eq.name.substring(0, 25),
        eq.status,
        `${eq.mtbf.toFixed(1)}h`,
        eq.failureCount.toString(),
        eq.reliability
      ];

      rowData.forEach((text, i) => {
        doc.text(text, xPos + 5, rowTop + 5, { width: colWidths[i] - 5, align: i === 0 ? 'center' : 'left' });
        xPos += colWidths[i];
      });

      doc.moveDown(1.2);
    });

    doc.fontSize(8).fillColor('#999999')
      .text(`Generated by Vault Pulse Center | Page ${doc.bufferedPageRange().count}`, 50, 750, {
        align: 'center'
      });

    doc.end();
  }

  // Generate Team Analytics PDF
  static async generateTeamPDF(data: any, res: Response) {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=Team_Analytics_${data.city}_${Date.now()}.pdf`
    );

    doc.pipe(res);

    // Header
    doc.fontSize(20).fillColor('#f59e0b').text('VAULT CLUB', { align: 'center' });
    doc.fontSize(16).text('Team Analytics Report', { align: 'center' });
    doc.moveDown(0.5);
    
    doc.fontSize(10).fillColor('#666666')
      .text(`City: ${data.city} | Time Range: ${data.timeRange} | Generated: ${new Date().toLocaleString('id-ID')}`, {
        align: 'center'
      });
    
    doc.moveDown(1);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(1);

    // Summary
    doc.fontSize(14).fillColor('#000000').text('SUMMARY', { underline: true });
    doc.moveDown(0.5);

    const summaryData = [
      ['Team Size', data.summary.totalMembers.toString()],
      ['Average Rating', `${data.summary.averageRating.toFixed(2)} ★`],
      ['Coverage Rate', `${data.summary.coverageRate.toFixed(1)}%`],
      ['Total Shifts', data.summary.totalShifts.toString()],
      ['Avg Training Score', `${data.summary.averageTrainingScore.toFixed(0)}%`]
    ];

    summaryData.forEach(([label, value]) => {
      doc.fontSize(11).fillColor('#000000').text(label, 70, doc.y, { continued: true, width: 200 });
      doc.text(value, { align: 'right' });
      doc.moveDown(0.3);
    });

    doc.moveDown(1);

    // Team Table
    doc.fontSize(14).fillColor('#000000').text('TEAM MEMBERS', { underline: true });
    doc.moveDown(0.5);

    const tableTop = doc.y;
    const colWidths = [30, 130, 80, 60, 60, 135];
    const headers = ['No', 'Name', 'Role', 'Rating', 'Training', 'Trend'];
    
    let xPos = 50;
    doc.fontSize(10).fillColor('#ffffff');
    doc.rect(50, tableTop, 495, 20).fill('#f59e0b');
    
    headers.forEach((header, i) => {
      doc.text(header, xPos + 5, tableTop + 5, { width: colWidths[i], align: 'left' });
      xPos += colWidths[i];
    });

    doc.moveDown(1.5);

    // Rows
    data.team.forEach((member: any, index: number) => {
      if (doc.y > 700) {
        doc.addPage();
      }

      const rowTop = doc.y;
      xPos = 50;

      if (index % 2 === 0) {
        doc.rect(50, rowTop, 495, 20).fillAndStroke('#f9fafb', '#e5e7eb');
      }

      doc.fillColor('#000000').fontSize(9);
      
      const trendSymbol = member.performanceTrend === 'improving' ? '↑' : 
                         member.performanceTrend === 'declining' ? '↓' : '→';
      
      const rowData = [
        (index + 1).toString(),
        member.name,
        member.role,
        `${member.averageRating.toFixed(1)} ★`,
        `${member.trainingScore}%`,
        `${trendSymbol} ${member.performanceTrend}`
      ];

      rowData.forEach((text, i) => {
        doc.text(text, xPos + 5, rowTop + 5, { width: colWidths[i] - 5, align: i === 0 ? 'center' : 'left' });
        xPos += colWidths[i];
      });

      doc.moveDown(1.2);
    });

    doc.fontSize(8).fillColor('#999999')
      .text(`Generated by Vault Pulse Center | Page ${doc.bufferedPageRange().count}`, 50, 750, {
        align: 'center'
      });

    doc.end();
  }
}
