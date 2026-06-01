const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf-8');
const match = envContent.match(/GEMINI_API_KEY=(.*)/);
const GEMINI_API_KEY = match ? match[1].trim() : '';

const GEMINI_MODEL = 'gemini-1.5-flash';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

async function testTranslation() {
  console.log("Testing with GEMINI_API_KEY:", GEMINI_API_KEY ? "exists" : "missing");
  
  const systemPrompt = `You are a translator for the PugArch FSM mobile app support system.
Translate the provided text into the target language.
Return only the translated text, no explanations.`;

  const userPrompt = `Translate "Hi! Welcome to PugArch FSM Support" into Marathi (mr).`;

  try {
    const response = await fetch(
      `${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: [
            {
              parts: [{ text: userPrompt }],
            },
          ],
          generation_config: {
            temperature: 0.1,
            maxOutputTokens: 2000,
          },
        }),
      }
    );

    console.log("Response status:", response.status);
    const data = await response.json();
    if (!response.ok) {
      console.error("Error data:", JSON.stringify(data, null, 2));
    } else {
      console.log("Success data:", JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

testTranslation();
