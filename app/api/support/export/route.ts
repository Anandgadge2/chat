import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { exportTicketsToCSV } from '@/lib/exportTickets';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query params (same filters as standard tickets query, but NO pagination limit)
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';
    const priority = searchParams.get('priority') || '';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const where: any = {};

    if (search) {
      where.OR = [
        { ticketId: { contains: search } },
        { userName: { contains: search } },
        { userEmail: { contains: search } },
        { userMobile: { contains: search } },
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (category) where.category = category;
    if (status) where.status = status;
    if (priority) where.priority = priority;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    // Fetch matching tickets
    const tickets = await prisma.supportTicket.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    // Generate CSV string
    const csvContent = exportTicketsToCSV(tickets);

    // Return as downloadable file attachment
    const response = new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="fsm-tickets-export-${new Date().toISOString().slice(0,10)}.csv"`,
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });

    return response;

  } catch (error) {
    console.error('Error exporting tickets CSV:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to export tickets database.',
    }, { status: 500 });
  }
}
