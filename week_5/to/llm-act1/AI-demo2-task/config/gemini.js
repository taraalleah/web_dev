const { GoogleGenAI } = require('@google/genai');

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// https://ai.google.dev/gemini-api/docs/models
// "gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.5-flash-lite"
const MODEL_NAME = 'gemini-3.6-flash';

const generateContent = async (prompt) => {
  const contents = [{ role: 'user', parts: [{ text: prompt }] }];

  try {
    const response = await genAI.models.generateContent({
      model: MODEL_NAME,
      contents,
      config: { temperature: 0.1 },
    });

    if (process.env.DEBUG_GEMINI === 'true') {
      console.log('🔍 FULL Gemini SDK response object:', JSON.stringify(response, null, 2));

      if (response?.text) {
        console.log('✅ Gemini .text property:', response.text);
      } else {
        console.warn('⚠ No .text property found on Gemini response');
      }
    }

    return response;
  } catch (err) {
    console.error('❌ Gemini API error:', err);
    throw err;
  }
};

module.exports = generateContent;
