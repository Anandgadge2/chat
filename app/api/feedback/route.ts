import { NextRequest, NextResponse } from 'next/server';
import type { FeedbackEntry } from '@/types/support';
import type { ApiResponse } from '@/types/chat';
import { isValidLanguage } from '@/lib/validators';
import { logError, logInfo } from '@/lib/logger';

// In-memory storage for feedback (in production, use a database)
const feedbackStorage: FeedbackEntry[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, issueCode, helpful, selectedLanguage } = body;

    // Validate input
    if (!sessionId || !issueCode) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        } as ApiResponse<FeedbackEntry>,
        { status: 400 }
      );
    }

    if (typeof helpful !== 'boolean') {
      return NextResponse.json(
        {
          success: false,
          error: 'Helpful must be a boolean',
        } as ApiResponse<FeedbackEntry>,
        { status: 400 }
      );
    }

    if (!isValidLanguage(selectedLanguage)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid language',
        } as ApiResponse<FeedbackEntry>,
        { status: 400 }
      );
    }

    const feedbackEntry: FeedbackEntry = {
      id: `feedback_${Date.now()}_${Math.random()}`,
      sessionId,
      issueCode,
      helpful,
      language: selectedLanguage,
      timestamp: new Date(),
    };

    feedbackStorage.push(feedbackEntry);

    logInfo('Feedback recorded', {
      issueCode,
      helpful,
      language: selectedLanguage,
    });

    return NextResponse.json(
      {
        success: true,
        data: feedbackEntry,
      } as ApiResponse<FeedbackEntry>,
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError('Error in feedback API', { error: errorMessage });

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to record feedback',
      } as ApiResponse<FeedbackEntry>,
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      data: feedbackStorage,
    },
    { status: 200 }
  );
}
