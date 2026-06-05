import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET ticket details including status history and notes
export async function GET(
  request: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const { ticketId } = params;

    // Search by either database ID or the unique generated ticketId
    const ticket = await prisma.supportTicket.findFirst({
      where: {
        OR: [
          { id: ticketId },
          { ticketId: ticketId }
        ]
      },
      include: {
        notes: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        statusHistory: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({
        success: false,
        error: 'Support ticket not found',
      }, { status: 404 });
    }

    const staff = await prisma.supportStaff.findMany({
      where: { active: true },
    });

    return NextResponse.json({
      success: true,
      data: ticket,
      staff,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching ticket details:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve ticket details.',
    }, { status: 500 });
  }
}

// PATCH to update ticket status, priority, assignee, or resolution comments
export async function PATCH(
  request: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const { ticketId } = params;
    const body = await request.json();
    const { status, priority, assignedTo, resolutionComment, changedBy } = body;

    // Find ticket first to check its current status
    const ticket = await prisma.supportTicket.findFirst({
      where: {
        OR: [
          { id: ticketId },
          { ticketId: ticketId }
        ]
      },
    });

    if (!ticket) {
      return NextResponse.json({
        success: false,
        error: 'Support ticket not found',
      }, { status: 404 });
    }

    // Check if status is changing
    const isStatusChanged = status && ticket.status !== status;
    const oldStatus = ticket.status;

    // Build update object
    const updateData: any = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo;
    if (resolutionComment !== undefined) updateData.resolutionComment = resolutionComment;

    // Handle resolution timestamps
    if (isStatusChanged) {
      if (status === 'Resolved' || status === 'Closed') {
        updateData.resolvedAt = new Date();
      } else {
        updateData.resolvedAt = null;
      }
    }

    // Perform update and log history in transaction
    const updatedTicket = await prisma.$transaction(async (tx) => {
      const updated = await tx.supportTicket.update({
        where: { id: ticket.id },
        data: updateData,
      });

      if (isStatusChanged) {
        await tx.ticketStatusHistory.create({
          data: {
            ticketId: ticket.id,
            oldStatus,
            newStatus: status,
            changedBy: changedBy || 'Admin',
          },
        });
      }

      return updated;
    });

    return NextResponse.json({
      success: true,
      data: updatedTicket,
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating ticket:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update ticket.',
    }, { status: 500 });
  }
}
