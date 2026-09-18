const { generateTourRecommendation } = require('../services/tourService');

/**
 * Helper function to extract JSON from AI response
 * AI sometimes wraps JSON in markdown code blocks
 */
function extractJSON(text) {
  // Try to find JSON within markdown code blocks
  const codeBlockMatch = text.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1];
  }
  
  // Try to find raw JSON object
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }
  
  // Return original text if no pattern matches
  return text;
}

/**
 * Controller for generating tour suggestions
 * Handles validation, JSON parsing, and response formatting
 */
async function generateTourSuggestion(req, res) {
  try {
    // Extract input from request body
    const { destination, duration, budget, season, preferences, travelStyle } = req.body;

    // Validate required fields
    if (!destination || !duration || !budget || !season || !preferences || !travelStyle) {
      return res.status(400).json({ 
        error: 'All fields are required',
        required: ['destination', 'duration', 'budget', 'season', 'preferences', 'travelStyle']
      });
    }

    // Call service layer to get AI recommendation
    const rawResponse = await generateTourRecommendation({
      destination,
      duration,
      budget,
      season,
      preferences,
      travelStyle
    });

    // Extract and parse JSON
    const jsonString = extractJSON(rawResponse);
    
    let tourPlan;
    try {
      tourPlan = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw Response:', rawResponse);
      
      return res.status(500).json({
        error: 'Failed to parse AI response as JSON',
        rawResponse: rawResponse.substring(0, 500) // First 500 chars for debugging
      });
    }

    // Return the parsed JSON
    res.status(200).json(tourPlan);

  } catch (error) {
    console.error('Error in tour controller:', error);
    res.status(500).json({ 
      error: 'Failed to generate tour recommendation',
      details: error.message 
    });
  }
}

module.exports = {
  generateTourSuggestion,
  generateText: generateTourSuggestion
};