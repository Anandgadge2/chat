import { NextRequest, NextResponse } from 'next/server';
import type { SupportTicket, ChatMessage } from '@/types/support';
import type { ApiResponse } from '@/types/chat';
import {
  validateFullName,
  validateContactNumber,
  validateDepartment,
  validateDesignation,
  validateIssueDescription,
  sanitizeInput,
} from '@/lib/validators';
import { logError, logInfo } from '@/lib/logger';

// In-memory storage for support tickets (in production, use a database)
const ticketStorage: SupportTicket[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      fullName,
      contactNumber,
      designation,
      department,
      issueDescription,
      matchedIssueCode,
      conversationHistory = [],
    } = body;

    // Validate required fields
    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Session ID is required',
        } as ApiResponse<SupportTicket>,
        { status: 400 }
      );
    }

    // Validate user details
    if (!validateFullName(fullName)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid full name',
        } as ApiResponse<SupportTicket>,
        { status: 400 }
      );
    }

    if (!validateContactNumber(contactNumber)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid contact number',
        } as ApiResponse<SupportTicket>,
        { status: 400 }
      );
    }

    if (!validateDesignation(designation)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid designation',
        } as ApiResponse<SupportTicket>,
        { status: 400 }
      );
    }

    if (!validateDepartment(department)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid department',
        } as ApiResponse<SupportTicket>,
        { status: 400 }
      );
    }

    if (!validateIssueDescription(issueDescription)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Issue description must be at least 10 characters',
        } as ApiResponse<SupportTicket>,
        { status: 400 }
      );
    }

    const ticket: SupportTicket = {
      id: `ticket_${Date.now()}_${Math.random()}`,
      sessionId,
      fullName: sanitizeInput(fullName),
      contactNumber: sanitizeInput(contactNumber),
      designation: sanitizeInput(designation),
      department: sanitizeInput(department),
      issueDescription: sanitizeInput(issueDescription),
      matchedIssueCode: matchedIssueCode || undefined,
      conversationHistory: conversationHistory as ChatMessage[],
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    ticketStorage.push(ticket);

    logInfo('Support ticket created', {
      ticketId: ticket.id,
      matchedIssueCode,
      departmentLength: department.length,
    });

    return NextResponse.json(
      {
        success: true,
        data: ticket,
      } as ApiResponse<SupportTicket>,
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError('Error in support-ticket API', { error: errorMessage });

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create support ticket',
      } as ApiResponse<SupportTicket>,
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      data: ticketStorage,
    },
    { status: 200 }
  );
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticketId, status } = body;

    if (!ticketId || !status) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        } as ApiResponse<SupportTicket>,
        { status: 400 }
      );
    }

    const ticket = ticketStorage.find((t) => t.id === ticketId);

    if (!ticket) {
      return NextResponse.json(
        {
          success: false,
          error: 'Ticket not found',
        } as ApiResponse<SupportTicket>,
        { status: 404 }
      );
    }

    ticket.status = status;
    ticket.updatedAt = new Date();

    logInfo('Support ticket updated', { ticketId, newStatus: status });

    return NextResponse.json(
      {
        success: true,
        data: ticket,
      } as ApiResponse<SupportTicket>,
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError('Error updating ticket', { error: errorMessage });

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update ticket',
      } as ApiResponse<SupportTicket>,
      { status: 500 }
    );
  }
}
