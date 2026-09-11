/**
 * Query Parser Service
 * Converts natural language property search queries into structured JSON search filters.
 */

const KNOWN_CITIES = [
  'Ghaziabad',
  'Noida',
  'Greater Noida',
  'Delhi',
  'New Delhi',
  'Gurgaon',
  'Gurugram',
  'Bangalore',
  'Bengaluru',
  'Mumbai',
  'Pune',
  'Hyderabad',
  'Kolkata',
  'Chennai',
  'Jaipur',
  'Chandigarh',
  'Faridabad',
  'Lucknow',
];

const AMENITY_ALIASES = {
  parking: ['parking', 'car parking', 'garage', 'vehicle parking'],
  metro: ['metro', 'metro station', 'subway', 'near metro', 'metro connection'],
  furnished: ['furnished', 'fully furnished', 'furnished home', 'furnished flat'],
  gym: ['gym', 'fitness', 'gymnasium', 'workout'],
  pool: ['pool', 'swimming pool', 'swimming'],
  security: ['security', 'gated', '24x7 security', 'cctv', 'guarded'],
  elevator: ['elevator', 'lift'],
  balcony: ['balcony', 'terrace'],
  wifi: ['wifi', 'internet', 'broadband'],
  ac: ['ac', 'air conditioning', 'air conditioner', 'cooling'],
};

/**
 * Parse money text into a numeric value in INR.
 * Example: "20k" -> 20000, "1.5 lakh" -> 150000, "20,000" -> 20000
 */
function parseMoneyValue(str) {
  if (!str) return null;
  const clean = str.replace(/,/g, '').trim().toLowerCase();
  
  if (clean.includes('lakh') || clean.includes('lac') || clean.endsWith('l')) {
    const num = parseFloat(clean.replace(/[^\d.]/g, ''));
    if (!isNaN(num)) return Math.round(num * 100000);
  }
  
  if (clean.endsWith('k')) {
    const num = parseFloat(clean.replace(/[^\d.]/g, ''));
    if (!isNaN(num)) return Math.round(num * 1000);
  }

  const num = parseFloat(clean.replace(/[^\d.]/g, ''));
  return !isNaN(num) ? num : null;
}

/**
 * Main parser function
 */
function parseNaturalLanguageQuery(queryText) {
  if (!queryText || typeof queryText !== 'string') {
    return {
      city: null,
      maxRent: null,
      minRent: null,
      bedrooms: null,
      type: null,
      amenities: [],
      keywords: [],
      rawQuery: '',
    };
  }

  const rawQuery = queryText.trim();
  const lower = rawQuery.toLowerCase();

  const filters = {
    city: null,
    maxRent: null,
    minRent: null,
    bedrooms: null,
    type: null,
    amenities: [],
    keywords: [],
    rawQuery,
  };

  // 1. Extract City
  for (const city of KNOWN_CITIES) {
    const regex = new RegExp(`\\b${city.toLowerCase()}\\b`, 'i');
    if (regex.test(lower)) {
      filters.city = city;
      break;
    }
  }

  // Fallback city extraction: "in [City]" or "near [City]"
  if (!filters.city) {
    const cityMatch = lower.match(/(?:in|near|at|around)\s+([a-z\s]+?)(?=\s+(?:under|below|for|with|around|₹|\d|bhk)|$)/i);
    if (cityMatch && cityMatch[1]) {
      const candidate = cityMatch[1].trim().toLowerCase();
      const nonCityWords = ['the', 'a', 'an', 'my', 'budget', 'metro', 'station', 'park', 'road', 'market', 'hospital', 'school', 'bus', 'stop', 'mall', 'highway'];
      if (candidate.length > 2 && !nonCityWords.includes(candidate)) {
        filters.city = candidate.charAt(0).toUpperCase() + candidate.slice(1);
      }
    }
  }

  // 2. Extract BHK / Bedrooms
  const bhkMatch = lower.match(/(\d+)\s*(?:bhk|bed|bedroom|br)/i);
  if (bhkMatch) {
    filters.bedrooms = parseInt(bhkMatch[1], 10);
  } else if (lower.includes('studio')) {
    filters.bedrooms = 1;
    filters.type = 'studio';
  } else if (lower.includes('single room') || lower.includes('1 room')) {
    filters.bedrooms = 1;
  }

  // 3. Extract Budget / Rent (maxRent / minRent)
  // Pattern A: Range "between 15k and 25k" or "15000 to 25000"
  const rangeMatch = lower.match(/(?:between|from)?\s*₹?\s*(\d+(?:\.\d+)?\s*(?:k|lakh|lac)?)\s*(?:to|-|and)\s*₹?\s*(\d+(?:\.\d+)?\s*(?:k|lakh|lac)?)/i);
  if (rangeMatch) {
    const minVal = parseMoneyValue(rangeMatch[1]);
    const maxVal = parseMoneyValue(rangeMatch[2]);
    if (minVal && maxVal) {
      filters.minRent = Math.min(minVal, maxVal);
      filters.maxRent = Math.max(minVal, maxVal);
    }
  }

  // Pattern B: Under / Below / Less than / Upto / Maximum / Budget of ₹20,000
  if (!filters.maxRent) {
    const maxMatch = lower.match(/(?:under|below|less than|upto|up to|max|maximum|budget|budget of|within|within a budget of)?\s*₹?\s*(\d+(?:[\d,.]*)?\s*(?:k|lakh|lac)?)\s*(?:per month|\/month|\/mo|budget|max|approx)?/i);
    
    // Specific triggers for maxRent
    const underMatch = lower.match(/(?:under|below|less than|upto|up to|max|within|budget of)\s*₹?\s*(\d+(?:[\d,.]*)?\s*(?:k|lakh|lac)?)/i);
    if (underMatch) {
      filters.maxRent = parseMoneyValue(underMatch[1]);
    } else {
      // General money amount mention (e.g., "Ghaziabad 20000")
      const moneyMatch = lower.match(/(?:₹\s*|\b)(\d{4,6}|\d+(?:\.\d+)?\s*k|\d+(?:\.\d+)?\s*lakh)\b/i);
      if (moneyMatch) {
        filters.maxRent = parseMoneyValue(moneyMatch[1]);
      }
    }
  }

  // 4. Extract Property Type
  if (lower.includes('apartment') || lower.includes('flat')) {
    filters.type = 'flat_apartment';
  } else if (lower.includes('independent house') || lower.includes('villa')) {
    filters.type = lower.includes('villa') ? 'villa' : 'independent_house';
  } else if (lower.includes('builder floor') || lower.includes('floor')) {
    filters.type = 'builder_floor';
  } else if (lower.includes('pg') || lower.includes('paying guest') || lower.includes('shared')) {
    filters.type = 'pg_shared';
  } else if (lower.includes('house')) {
    filters.type = 'independent_house';
  }

  // 5. Extract Amenities
  for (const [key, aliases] of Object.entries(AMENITY_ALIASES)) {
    if (aliases.some((alias) => lower.includes(alias))) {
      filters.amenities.push(key);
    }
  }

  // 6. Extract Keywords (e.g. family, affordable, luxury)
  if (lower.includes('family') || lower.includes('families')) {
    filters.keywords.push('family');
  }
  if (lower.includes('affordable') || lower.includes('cheap') || lower.includes('budget')) {
    filters.keywords.push('affordable');
  }
  if (lower.includes('luxury') || lower.includes('premium') || lower.includes('high end')) {
    filters.keywords.push('luxury');
  }

  return filters;
}

module.exports = {
  parseNaturalLanguageQuery,
  KNOWN_CITIES,
};
