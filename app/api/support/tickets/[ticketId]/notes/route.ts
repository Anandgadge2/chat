import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST to add a note to a ticket
export async function POST(
  request: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const { ticketId } = params;
    const body = await request.json();
    const { note, addedBy } = body;

    if (!note || note.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Note content is required',
      }, { status: 400 });
    }

    // Find the ticket first (by id or ticketId)
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

    const newNote = await prisma.ticketNote.create({
      data: {
        ticketId: ticket.id,
        note: note.trim(),
        addedBy: addedBy || 'Staff Member',
      },
    });

    return NextResponse.json({
      success: true,
      data: newNote,
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding ticket note:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to add note.',
    }, { status: 500 });
  }
}
