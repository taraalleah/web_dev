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

Based on this information, create a detailed tour recommendation.

Please include:
1. Tour Name
2. Short Description
3. Highlights (list 4-5 key activities)
4. Why this tour matches their preferences
5. Estimated price range
6. Best season to visit
7. Special tips for travelers

Format your response in clear markdown with headings and bullet points.
  `.trim();

  try {
    const result = await generateContent(prompt);

    const text = result?.text ?? result?.candidates?.[0]?.content?.parts
      ?.map(part => part?.text ?? '')
      .join('\n') ?? 'No recommendation returned from Gemini.';

    return text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to generate tour recommendation from AI');
  }
}

module.exports = {
  generateTourRecommendation
};