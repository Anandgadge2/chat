import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse } from '@/types/chat';
import { formatSolutionWithAI } from '@/lib/gemini';
import { isValidLanguage, sanitizeInput } from '@/lib/validators';
import { logError, logInfo } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { issueTitle, possibleReason, solutionSteps, targetLanguage } = body;

    // Validate inputs
    if (!issueTitle || !solutionSteps || !Array.isArray(solutionSteps)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input parameters',
        } as ApiResponse<string>,
        { status: 400 }
      );
    }

    if (!isValidLanguage(targetLanguage)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid target language',
        } as ApiResponse<string>,
        { status: 400 }
      );
    }

    logInfo('Formatting solution with AI', {
      issueTitle: sanitizeInput(issueTitle),
      targetLanguage,
      stepsCount: solutionSteps.length,
    });

    const result = await formatSolutionWithAI(
      issueTitle,
      possibleReason || '',
      solutionSteps,
      targetLanguage
    );

    logInfo('Solution formatted successfully');

    return NextResponse.json(
      {
        success: true,
        data: result,
      } as ApiResponse<string>,
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError('Error in format-solution API', { error: errorMessage });

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to format solution with AI',
      } as ApiResponse<string>,
      { status: 500 }
    );
  }
}
