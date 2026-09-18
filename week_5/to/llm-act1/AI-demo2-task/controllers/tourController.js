const { generateTourRecommendation } = require('../services/tourService');

/**
 * Controller for generating tour suggestions
 * Handles validation and response formatting
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
    const recommendation = await generateTourRecommendation({
      destination,
      duration,
      budget,
      season,
      preferences,
      travelStyle
    });

    // Return the markdown response
    res.status(200).json({
      success: true,
      recommendation: recommendation
    });

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