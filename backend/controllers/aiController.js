/**
 * AI Controller
 * Manages natural language property search and tenant recommendation endpoints.
 */

const { parseNaturalLanguageQuery } = require('../services/queryParserService');
const { searchProperties } = require('../services/propertySearchService');
const { getTenantRecommendations } = require('../services/recommendationService');
const { generateLlmResponse } = require('../services/aiLlmService');

/**
 * @desc    Process natural language property search query
 * @route   POST /api/ai/property-search
 * @access  Public / Optional Auth
 */
exports.searchPropertiesAI = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search message',
      });
    }

    // 1. Intelligent Query Parsing
    const parsedFilters = parseNaturalLanguageQuery(message);

    // 2. Database Search with Fallback Handling
    const searchResults = await searchProperties(parsedFilters);

    // 3. Optional LLM Integration or Rule-Based Natural Response
    let replyText = await generateLlmResponse(
      message,
      searchResults.properties,
      parsedFilters,
      searchResults.isFallback
    );

    if (!replyText) {
      replyText = buildNaturalReply(parsedFilters, searchResults);
    }

    return res.status(200).json({
      success: true,
      reply: replyText,
      parsedFilters,
      properties: searchResults.properties,
      isFallback: searchResults.isFallback,
      fallbackReason: searchResults.fallbackReason,
      suggestions: searchResults.suggestions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get AI personalized recommendations for logged-in tenant
 * @route   GET /api/ai/recommendations
 * @access  Private (Tenant)
 */
exports.getRecommendationsAI = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const recommendations = await getTenantRecommendations(userId, 6);

    return res.status(200).json({
      success: true,
      count: recommendations.length,
      recommendations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Construct human-friendly response string from search results
 */
function buildNaturalReply(parsedFilters, searchResults) {
  const { properties, isFallback, fallbackReason } = searchResults;

  if (isFallback) {
    return fallbackReason || "I couldn't find an exact match for your criteria, but here are top verified properties available on RentEase.";
  }

  const count = properties.length;
  const parts = [];

  if (parsedFilters.bedrooms) {
    parts.push(`${parsedFilters.bedrooms} BHK`);
  }

  if (parsedFilters.city) {
    parts.push(`in ${parsedFilters.city}`);
  }

  if (parsedFilters.maxRent) {
    parts.push(`within your ₹${parsedFilters.maxRent.toLocaleString('en-IN')} budget`);
  }

  const descriptor = parts.length > 0 ? parts.join(' ') : 'matching';

  if (count === 1) {
    return `I found 1 available ${descriptor} property for you.`;
  }

  return `I found ${count} available ${descriptor} properties for you.`;
}
