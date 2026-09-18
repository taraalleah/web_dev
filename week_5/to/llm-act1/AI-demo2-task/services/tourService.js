const generateContent = require('../config/gemini');

/**
 * Service for generating tour recommendations using Gemini AI
 * This version returns markdown-formatted text
 */
async function generateTourRecommendation(travelData) {
  const { destination, duration, budget, season, preferences, travelStyle } = travelData;

  const prompt = `
You are a professional travel advisor. A traveler is planning a trip with the following preferences:

- Destination: ${destination}
- Duration: ${duration}
- Budget: $${budget}
- Preferred Season: ${season}
- Interests: ${preferences}
- Travel Style: ${travelStyle}

Based on this information, recommend a suitable tour.

IMPORTANT: Respond ONLY in valid JSON using the following structure:

{
  "tourName": "",
  "shortDescription": "",
  "highlights": [],
  "whyItMatches": "",
  "estimatedPriceRange": "",
  "bestSeasonToVisit": "",
  "specialTips": []
}

Do not include any text before or after the JSON. Do not wrap it in markdown code blocks.
Fill all fields with appropriate content for this traveler.
  `.trim();

  try {
    const result = await generateContent(prompt);

    const text = result?.text ??
      result?.candidates?.[0]?.content?.parts
        ?.map((part) => part?.text ?? '')
        .join('\n') ??
      'No recommendation returned from Gemini.';

    if (process.env.DEBUG_GEMINI === 'true') {
      console.log('Raw AI Response:', text);
    }

    return text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to generate tour recommendation from AI');
  }
}

module.exports = {
  generateTourRecommendation
};