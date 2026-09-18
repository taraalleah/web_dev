/**
 * Normalizes tour recommendation data to ensure consistent structure
 * Provides safe defaults for missing or malformed fields
 * 
 * @param {string|object} input - Raw AI response (JSON string or object)
 * @returns {object} Normalized tour plan with guaranteed structure
 */
function normalizeTourPlan(input) {
  // Default structure - what we promise to always return
  const defaultPlan = {
    tourName: "Custom Tour Package",
    shortDescription: "A personalized travel experience tailored to your preferences.",
    highlights: [
      "Explore iconic landmarks and hidden gems",
      "Enjoy local cuisine and cultural experiences",
      "Comfortable accommodations and guided activities"
    ],
    whyItMatches: "This tour is designed based on your specific travel preferences and budget.",
    estimatedPriceRange: "Contact for pricing",
    bestSeasonToVisit: "Year-round availability",
    specialTips: [
      "Book early for best rates",
      "Check visa requirements",
      "Purchase travel insurance"
    ]
  };

  try {
    // Parse input if it's a string
    let parsedInput = input;
    if (typeof input === 'string') {
      parsedInput = JSON.parse(input);
    }

    // Normalize each field with type checking
    return {
      tourName: 
        typeof parsedInput.tourName === 'string' && parsedInput.tourName.trim() 
          ? parsedInput.tourName.trim() 
          : defaultPlan.tourName,
      
      shortDescription: 
        typeof parsedInput.shortDescription === 'string' && parsedInput.shortDescription.trim()
          ? parsedInput.shortDescription.trim()
          : defaultPlan.shortDescription,
      
      highlights: 
        Array.isArray(parsedInput.highlights) && parsedInput.highlights.length > 0
          ? parsedInput.highlights.filter(h => typeof h === 'string' && h.trim()).map(h => h.trim())
          : defaultPlan.highlights,
      
      whyItMatches: 
        typeof parsedInput.whyItMatches === 'string' && parsedInput.whyItMatches.trim()
          ? parsedInput.whyItMatches.trim()
          : defaultPlan.whyItMatches,
      
      estimatedPriceRange: 
        typeof parsedInput.estimatedPriceRange === 'string' && parsedInput.estimatedPriceRange.trim()
          ? parsedInput.estimatedPriceRange.trim()
          : defaultPlan.estimatedPriceRange,
      
      bestSeasonToVisit: 
        typeof parsedInput.bestSeasonToVisit === 'string' && parsedInput.bestSeasonToVisit.trim()
          ? parsedInput.bestSeasonToVisit.trim()
          : defaultPlan.bestSeasonToVisit,
      
      specialTips: 
        Array.isArray(parsedInput.specialTips) && parsedInput.specialTips.length > 0
          ? parsedInput.specialTips.filter(t => typeof t === 'string' && t.trim()).map(t => t.trim())
          : defaultPlan.specialTips
    };

  } catch (error) {
    // If parsing fails completely, return full default
    console.error('Normalization error, returning defaults:', error);
    return defaultPlan;
  }
}

module.exports = {
  normalizeTourPlan
};