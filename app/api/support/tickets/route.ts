import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateNextTicketId } from '@/lib/ticketId';
import { detectRepeatedGroup } from '@/lib/repeatedIssueDetector';
import { validateTicketInput, sanitizeTicketInput } from '@/lib/validations';
import { sendSupportAlertEmail } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

// Handle POST request to create a support ticket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate ticket inputs
    const { isValid, errors } = validateTicketInput(body);
    if (!isValid) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // Sanitize ticket input
    const sanitized = sanitizeTicketInput(body);

    // Generate ticket ID (e.g. FSM-2026-0001)
    const ticketId = await generateNextTicketId();

    // Detect repeated issue group
    const repeatedGroup = detectRepeatedGroup(
      sanitized.title,
      sanitized.description,
      sanitized.category
    );

    // Prepare transcript string
    let chatTranscriptStr = '';
    if (sanitized.chatTranscript) {
      chatTranscriptStr = typeof sanitized.chatTranscript === 'string' 
        ? sanitized.chatTranscript 
        : JSON.stringify(sanitized.chatTranscript);
    }

    // Save ticket and history within a transaction
    const ticket = await prisma.$transaction(async (tx) => {
      // 1. Create support ticket
      const newTicket = await tx.supportTicket.create({
        data: {
          ticketId,
          userName: sanitized.userName,
          userMobile: sanitized.userMobile,
          userEmail: sanitized.userEmail,
          category: sanitized.category,
          title: sanitized.title,
          description: sanitized.description,
          priority: sanitized.priority || 'Medium',
          status: 'Open',
          language: sanitized.language || 'en',
          screenshotUrl: sanitized.screenshotUrl,
          chatTranscript: chatTranscriptStr,
          repeatedGroup,
        },
      });

      // 2. Add status history entry
      await tx.ticketStatusHistory.create({
        data: {
          ticketId: newTicket.id,
          oldStatus: null,
          newStatus: 'Open',
          changedBy: 'System',
        },
      });

      return newTicket;
    });

    // Send email alert async (errors inside will be caught internally by sendSupportAlertEmail)
    // We do NOT await to optimize API response time, or we can await but handle failures gracefully.
    // Let's run it and log without blocking the client.
    sendSupportAlertEmail({
      ticketId: ticket.ticketId,
      userName: ticket.userName,
      userMobile: ticket.userMobile,
      userEmail: ticket.userEmail,
      category: ticket.category,
      priority: ticket.priority,
      title: ticket.title,
      description: ticket.description,
      createdAt: ticket.createdAt,
    }).catch((err) => console.error('SMTP Alert run failed:', err));

    return NextResponse.json({
      success: true,
      data: {
        id: ticket.id,
        ticketId: ticket.ticketId,
      },
      message: `Your issue has been submitted successfully. Your Ticket ID is ${ticket.ticketId}. Our support team will contact you soon.`,
    }, { status: 201 });

  } catch (error) {
    console.error('Error submitting support ticket:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal Server Error. Failed to create support ticket.',
    }, { status: 500 });
  }
}

// Handle GET request to query support tickets with filters, search, and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query params
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';
    const priority = searchParams.get('priority') || '';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Calculate skip pagination offset
    const skip = (page - 1) * limit;

    // Build Prisma query condition
    const where: any = {};

    // Keyword Search (User Name, Email, Ticket ID, Mobile, Title, Description)
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

    // Filters
    if (category) {
      where.category = category;
    }
    if (status) {
      where.status = status;
    }
    if (priority) {
      where.priority = priority;
    }

    // Date range filter
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        // Adjust end date to cover the full day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    // Fetch list and count
    const [tickets, total] = await Promise.all([
      prisma.supportTicket.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      prisma.supportTicket.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      tickets,
      total,
      page,
      limit,
      totalPages,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching support tickets:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve tickets.',
    }, { status: 500 });
  }
}
