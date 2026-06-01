import type { TranslationResponse } from '@/types/support';
import { translateWithGemini } from './gemini';

type TranslationCache = {
  [key: string]: string;
};

const translationCache: TranslationCache = {};

function getCacheKey(text: string, language: string): string {
  return `${language}_${text.substring(0, 50)}`;
}

export async function translateText(
  text: string,
  targetLanguage: string,
  sourceLanguage: string = 'en'
): Promise<TranslationResponse> {
  // If target is English, no need to translate
  if (targetLanguage === 'en' || sourceLanguage === targetLanguage) {
    return {
      translatedText: text,
      provider: 'local',
      language: targetLanguage,
    };
  }

  // Check cache
  const cacheKey = getCacheKey(text, targetLanguage);
  if (translationCache[cacheKey]) {
    return {
      translatedText: translationCache[cacheKey],
      provider: 'local',
      language: targetLanguage,
    };
  }

  // Try LibreTranslate if configured
  const libreTranslateUrl = process.env.LIBRETRANSLATE_URL;
  if (libreTranslateUrl) {
    try {
      const response = await fetch(`${libreTranslateUrl}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.LIBRETRANSLATE_API_KEY && {
            Authorization: `Bearer ${process.env.LIBRETRANSLATE_API_KEY}`,
          }),
        },
        body: JSON.stringify({
          q: text,
          source: sourceLanguage,
          target: targetLanguage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const translatedText = data.translatedText || text;
        translationCache[cacheKey] = translatedText;
        return {
          translatedText,
          provider: 'libretranslate',
          language: targetLanguage,
        };
      }
    } catch (error) {
      console.error('LibreTranslate error, falling back to Gemini:', error);
    }
  }

  // Try Gemini translation
  try {
    const translatedText = await translateWithGemini(text, targetLanguage);
    translationCache[cacheKey] = translatedText;
    return {
      translatedText,
      provider: 'gemini',
      language: targetLanguage,
    };
  } catch (error) {
    console.error('Gemini translation error, returning fallback:', error);
    return {
      translatedText: text,
      provider: 'fallback',
      language: sourceLanguage,
    };
  }
}

export function clearTranslationCache(): void {
  Object.keys(translationCache).forEach((key) => delete translationCache[key]);
}

export function getCacheSize(): number {
  return Object.keys(translationCache).length;
}
