import type { MatchIssueResponse } from '@/types/support';
import { getCompactIssueList } from './supportIssues';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Helper: build the full Gemini generateContent URL for the configured model.
 */
function getGeminiUrl(): string {
  return `${GEMINI_BASE_URL}/${GEMINI_MODEL}:generateContent`;
}

/**
 * Helper: common headers for all Gemini requests.
 */
function getGeminiHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'x-goog-api-key': GEMINI_API_KEY!,
  };
}

export async function matchIssueWithGemini(
  userMessage: string,
  selectedLanguage: string
): Promise<MatchIssueResponse> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  const systemPrompt = `You are a support issue matching assistant for the PugArch FSM mobile app.
Your only job is to match the user's message to one of the predefined support issue codes.

Rules:
- Match based on semantic meaning, spelling mistakes, short messages, Hinglish, and regional language input.
- Do not invent new issue codes.
- Do not provide a solution.
- Do not answer general questions.
- Return only valid JSON.
- If no confident match is found, return matchedCode as "NONE".

Return JSON in this format only:
{
  "matchedCode": "A1 | A2 | B1 | B2 | B3 | B4 | C1 | C2 | C3 | C4 | C5 | D1 | D2 | D3 | E1 | NONE",
  "confidence": 0.0,
  "detectedLanguage": "language-code",
  "needsEscalation": true,
  "reason": "short internal reason"
}`;

  const userPrompt = `User message:
"${userMessage}"

Selected language:
"${selectedLanguage}"

Known support issues:
${getCompactIssueList()}

Match the user message to the nearest known support issue.
Return only JSON. Do not include any other text.`;

  try {
    const response = await fetch(getGeminiUrl(), {
      method: 'POST',
      headers: getGeminiHeaders(),
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          {
            parts: [{ text: userPrompt }],
          },
        ],
        generation_config: {
          temperature: 0.1,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 300,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();

    // Extract text from Gemini response
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textContent) {
      throw new Error('No text response from Gemini');
    }

    // Parse JSON from response
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in Gemini response');
    }

    const result = JSON.parse(jsonMatch[0]);

    return {
      matchedCode: result.matchedCode || 'NONE',
      confidence: parseFloat(result.confidence) || 0,
      detectedLanguage: result.detectedLanguage || selectedLanguage,
      needsEscalation: result.needsEscalation || false,
      reason: result.reason,
    };
  } catch (error) {
    console.error('Error matching issue with Gemini:', error);
    throw error;
  }
}

export async function translateWithGemini(
  text: string,
  targetLanguage: string
): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  const prompt = `You are a translator for the PugArch FSM mobile app support system.
Translate the following text into ${targetLanguage}.
Keep the meaning exact and simple.
Maintain technical terms accurately.
Do not add or remove information.
Return only the translated text, no explanations.

Text to translate:
${text}`;

  try {
    const response = await fetch(getGeminiUrl(), {
      method: 'POST',
      headers: getGeminiHeaders(),
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generation_config: {
          temperature: 0.1,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2000,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API full error:', errorData);
      throw new Error(`Gemini translation API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const translatedText =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!translatedText) {
      throw new Error('Gemini returned empty translation');
    }

    return translatedText;
  } catch (error) {
    console.error('Error translating with Gemini:', error);
    throw error;
  }
}

export async function formatSolutionWithAI(
  issueTitle: string,
  possibleReason: string,
  solutionSteps: string[],
  targetLanguage: string
): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  const systemPrompt = `You are a premium customer support specialist for the PugArch FSM mobile app.
Your task is to take a support issue, its possible reason, and its troubleshooting steps, and format them into a highly professional, easy-to-read response in the requested target language.

Format instructions:
1. Provide a very brief, empathetic acknowledgment of the problem (1 sentence).
2. State the possible cause clearly: "Possible Reason: [cause]" (translate the prefix correctly if target language is not English).
3. List the steps to resolve: "Steps to resolve:" (translate the prefix correctly).
4. Provide the steps as a numbered list (1., 2., etc.). Keep each step brief, actionable, and clear.
5. Do NOT add any extra conversational fluff at the end.
6. The entire response must be written directly in the requested target language. Do not output English if the target language is different.`;

  const userPrompt = `Issue: "${issueTitle}"
Possible Reason: "${possibleReason}"
Original Steps:
${solutionSteps.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}

Target Language: "${targetLanguage}"

Generate the formatted support response directly in the target language.`;

  try {
    const response = await fetch(getGeminiUrl(), {
      method: 'POST',
      headers: getGeminiHeaders(),
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          {
            parts: [{ text: userPrompt }],
          },
        ],
        generation_config: {
          temperature: 0.2,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 1000,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API full error:', errorData);
      throw new Error(`Gemini solution format API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const formattedText =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!formattedText) {
      throw new Error('Empty response from Gemini solution format');
    }

    return formattedText.trim();
  } catch (error) {
    console.error('Error formatting solution with Gemini:', error);
    // Fallback if AI formatting fails
    let fallback = `Possible Reason: ${possibleReason}\n\nSteps to resolve:\n`;
    solutionSteps.forEach((step) => {
      fallback += `${step}\n`;
    });
    return fallback;
  }
}
