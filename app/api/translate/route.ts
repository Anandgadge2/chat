import { NextRequest, NextResponse } from 'next/server';
import type { TranslationResponse } from '@/types/support';
import type { ApiResponse } from '@/types/chat';
import { translateText } from '@/lib/translate';
import { isValidLanguage, sanitizeInput } from '@/lib/validators';
import { logError, logInfo } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, targetLanguage, sourceLanguage = 'en' } = body;

    // Validate input
    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Text cannot be empty',
        } as ApiResponse<TranslationResponse>,
        { status: 400 }
      );
    }

    if (!isValidLanguage(targetLanguage)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid target language',
        } as ApiResponse<TranslationResponse>,
        { status: 400 }
      );
    }

    if (sourceLanguage && !isValidLanguage(sourceLanguage)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid source language',
        } as ApiResponse<TranslationResponse>,
        { status: 400 }
      );
    }

    logInfo('Translating text', {
      sourceLanguage,
      targetLanguage,
      textLength: text.length,
    });

    const result = await translateText(text, targetLanguage, sourceLanguage);

    logInfo('Translation completed', { provider: result.provider });

    return NextResponse.json(
      {
        success: true,
        data: result,
      } as ApiResponse<TranslationResponse>,
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError('Error in translate API', { error: errorMessage });

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to translate. Please try again.',
      } as ApiResponse<TranslationResponse>,
      { status: 500 }
    );
  }
}
