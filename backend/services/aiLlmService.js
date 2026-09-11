/**
 * Modular AI LLM Service Layer
 * Supports external LLM providers (Google Gemini / OpenAI) if an API key is configured.
 * Seamlessly falls back to local intelligent rule-based search if no API key is set.
 */


/**
 * Check whether an external AI API key is configured in process.env
 */
function isLlmConfigured() {
  return Boolean(
    process.env.AI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.OPENAI_API_KEY
  );
}

/**
 * Optional LLM Response Generator
 * Generates a polished conversational response from LLM if configured.
 * @param {String} userMessage - Original user query
 * @param {Array} properties - List of matching properties found
 * @param {Object} parsedFilters - Filters extracted by rule parser
 * @param {Boolean} isFallback - Whether fallback mode was activated
 */
async function generateLlmResponse(userMessage, properties, parsedFilters, isFallback) {
  if (!isLlmConfigured()) {
    return null; // Return null so controller uses rule-based text formatter
  }

  const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      // Call Google Gemini API (v1beta model: gemini-1.5-flash or gemini-2.0-flash)
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      
      const prompt = `You are RentEase AI, an intelligent real estate assistant for rental properties in India.
User query: "${userMessage}"
Parsed filters: ${JSON.stringify(parsedFilters)}
Found properties count: ${properties.length}
Fallback mode: ${isFallback}

Sample properties found: ${JSON.stringify(
        properties.slice(0, 3).map((p) => ({
          title: p.title,
          city: p.address?.city,
          rent: p.rentAmount,
          bhk: p.bedrooms,
        }))
      )}

Generate a helpful, friendly 1-2 sentence response summarizing the search result for the user. Do not include markdown code blocks.`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      const data = await response.json();
      const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (generatedText) {
        return generatedText.trim();
      }
    } catch (err) {
      console.warn('External LLM API call skipped or timed out, using rule-based response:', err.message);
    }
  }

  return null;
}

module.exports = {
  isLlmConfigured,
  generateLlmResponse,
};
