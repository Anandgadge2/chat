import { NextRequest, NextResponse } from 'next/server';
import type { MatchIssueResponse } from '@/types/support';
import type { ApiResponse, Language } from '@/types/chat';
import { matchIssueWithGemini } from '@/lib/gemini';
import { validateUserMessage, isValidLanguage, sanitizeInput } from '@/lib/validators';
import { logError, logInfo } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, selectedLanguage } = body;

    // Validate input
    const messageValidation = validateUserMessage(message);
    if (!messageValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: messageValidation.error,
        } as ApiResponse<MatchIssueResponse>,
        { status: 400 }
      );
    }

    if (!isValidLanguage(selectedLanguage)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid language',
        } as ApiResponse<MatchIssueResponse>,
        { status: 400 }
      );
    }

    const sanitizedMessage = sanitizeInput(message);
    logInfo('Matching issue', { message: sanitizedMessage, language: selectedLanguage });

    const result = await matchIssueWithGemini(
      sanitizedMessage,
      selectedLanguage as Language
    );

    logInfo('Issue matched', { result });

    return NextResponse.json(
      {
        success: true,
        data: result,
      } as ApiResponse<MatchIssueResponse>,
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError('Error in match-issue API', { error: errorMessage });

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to match issue. Please try again.',
      } as ApiResponse<MatchIssueResponse>,
      { status: 500 }
    );
  }
}
