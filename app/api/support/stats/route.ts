import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { VALID_CATEGORIES, VALID_STATUSES, VALID_PRIORITIES } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Core ticket counts
    const totalTickets = await prisma.supportTicket.count();
    
    // Status counts
    const statusCountsRaw = await prisma.supportTicket.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    const statusCounts: Record<string, number> = {};
    VALID_STATUSES.forEach(s => { statusCounts[s] = 0; });
    statusCountsRaw.forEach(item => {
      statusCounts[item.status] = item._count.id;
    });

    // Priority counts
    const priorityCountsRaw = await prisma.supportTicket.groupBy({
      by: ['priority'],
      _count: { id: true },
    });

    const priorityCounts: Record<string, number> = {};
    VALID_PRIORITIES.forEach(p => { priorityCounts[p] = 0; });
    priorityCountsRaw.forEach(item => {
      priorityCounts[item.priority] = item._count.id;
    });

    // Category counts
    const categoryCountsRaw = await prisma.supportTicket.groupBy({
      by: ['category'],
      _count: { id: true },
    });

    const categoryCounts: Record<string, number> = {};
    VALID_CATEGORIES.forEach(c => { categoryCounts[c] = 0; });
    categoryCountsRaw.forEach(item => {
      categoryCounts[item.category] = item._count.id;
    });

    // High Priority count (High + Critical)
    const highPriorityTickets = (priorityCounts['High'] || 0) + (priorityCounts['Critical'] || 0);

    // Today's tickets
    const todayTickets = await prisma.supportTicket.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    });

    // 2. Average Resolution Time
    const resolvedTickets = await prisma.supportTicket.findMany({
      where: {
        resolvedAt: {
          not: null,
        },
      },
      select: {
        createdAt: true,
        resolvedAt: true,
      },
    });

    let averageResolutionTimeStr = 'N/A';
    if (resolvedTickets.length > 0) {
      let totalMs = 0;
      resolvedTickets.forEach((t) => {
        if (t.resolvedAt) {
          totalMs += t.resolvedAt.getTime() - t.createdAt.getTime();
        }
      });
      const avgMs = totalMs / resolvedTickets.length;
      const avgHours = avgMs / (1000 * 60 * 60);
      
      if (avgHours < 1) {
        const avgMins = Math.round(avgMs / (1000 * 60));
        averageResolutionTimeStr = `${avgMins} mins`;
      } else {
        averageResolutionTimeStr = `${avgHours.toFixed(1)} hrs`;
      }
    }

    // 3. Repeated issues count
    const repeatedIssuesRaw = await prisma.supportTicket.groupBy({
      by: ['repeatedGroup'],
      where: {
        repeatedGroup: {
          not: null,
        },
      },
      _count: { id: true },
    });
    const totalRepeatedIssuesCount = repeatedIssuesRaw.length;

    // 4. Daily Issue Trend (Last 7 Days)
    const dailyTrend: { date: string; count: number }[] = [];
    const dateNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      
      const startOfDay = new Date(d);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(d);
      endOfDay.setHours(23, 59, 59, 999);

      const count = await prisma.supportTicket.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      const dayName = dateNames[startOfDay.getDay()];
      const dayNum = String(startOfDay.getDate()).padStart(2, '0');
      const monthNum = String(startOfDay.getMonth() + 1).padStart(2, '0');
      
      dailyTrend.push({
        date: `${dayName} ${dayNum}/${monthNum}`,
        count,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        totalTickets,
        openTickets: statusCounts['Open'] || 0,
        inProgressTickets: statusCounts['In Progress'] || 0,
        pendingTickets: statusCounts['Pending'] || 0,
        resolvedTickets: statusCounts['Resolved'] || 0,
        closedTickets: statusCounts['Closed'] || 0,
        archivedTickets: statusCounts['Archived'] || 0,
        highPriorityTickets,
        todayTickets,
        repeatedIssues: totalRepeatedIssuesCount,
        averageResolutionTime: averageResolutionTimeStr,
        categoryCounts,
        statusCounts,
        priorityCounts,
        dailyTrend,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch support statistics.',
    }, { status: 500 });
  }
}
