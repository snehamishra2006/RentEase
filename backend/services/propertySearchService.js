/**
 * Property Search Service
 * Executes MongoDB queries based on parsed search filters with intelligent fallback handling.
 */

const Property = require('../models/Property');

/**
 * Perform property search in MongoDB using parsed parameters
 */
async function searchProperties(parsedFilters) {
  const baseQuery = {
    status: 'available',
    verificationStatus: 'approved',
  };

  const query = buildMongoQuery(parsedFilters, baseQuery);

  let properties = await Property.find(query)
    .populate('owner', 'name email phone avatar')
    .sort({ createdAt: -1 });

  let isFallback = false;
  let fallbackReason = null;
  const suggestions = [];

  // Fallback Phase 1: Relax amenity requirement if 0 results
  if (properties.length === 0 && parsedFilters.amenities && parsedFilters.amenities.length > 0) {
    const relaxedFilters = { ...parsedFilters, amenities: [] };
    const relaxedQuery = buildMongoQuery(relaxedFilters, baseQuery);
    properties = await Property.find(relaxedQuery)
      .populate('owner', 'name email phone avatar')
      .sort({ createdAt: -1 });

    if (properties.length > 0) {
      isFallback = true;
      fallbackReason = 'No exact matches with all specified amenities, but found properties matching your budget and location.';
      suggestions.push('Try removing amenity constraints');
    }
  }

  // Fallback Phase 2: Relax budget limit by 20% if still 0 results
  if (properties.length === 0 && parsedFilters.maxRent) {
    const expandedBudgetFilters = {
      ...parsedFilters,
      maxRent: Math.round(parsedFilters.maxRent * 1.25),
      amenities: [],
    };
    const expandedQuery = buildMongoQuery(expandedBudgetFilters, baseQuery);
    properties = await Property.find(expandedQuery)
      .populate('owner', 'name email phone avatar')
      .sort({ createdAt: -1 });

    if (properties.length > 0) {
      isFallback = true;
      fallbackReason = `No properties found under ₹${parsedFilters.maxRent.toLocaleString('en-IN')}, but here are options up to ₹${expandedBudgetFilters.maxRent.toLocaleString('en-IN')}.`;
      suggestions.push(`Increase budget to ₹${expandedBudgetFilters.maxRent.toLocaleString('en-IN')}`);
    }
  }

  // Fallback Phase 3: Relax BHK or City requirement if still 0 results
  if (properties.length === 0) {
    // Search general available properties in city or overall
    let generalQuery = { ...baseQuery };
    if (parsedFilters.city) {
      generalQuery['address.city'] = new RegExp(parsedFilters.city, 'i');
    }

    properties = await Property.find(generalQuery)
      .populate('owner', 'name email phone avatar')
      .limit(4)
      .sort({ createdAt: -1 });

    if (properties.length > 0) {
      isFallback = true;
      fallbackReason = `No exact matches for your query. Showing top recommended properties ${parsedFilters.city ? `in ${parsedFilters.city}` : 'available on RentEase'}.`;
    } else {
      // Return top available overall if city has no listings
      properties = await Property.find(baseQuery)
        .populate('owner', 'name email phone avatar')
        .limit(4)
        .sort({ createdAt: -1 });
      
      isFallback = true;
      fallbackReason = 'No listings match your exact location and budget criteria yet. Here are other active verified homes.';
    }

    if (parsedFilters.maxRent) {
      suggestions.push(`Consider a budget above ₹${parsedFilters.maxRent.toLocaleString('en-IN')}`);
    }
    if (parsedFilters.city) {
      suggestions.push(`Explore neighboring areas near ${parsedFilters.city}`);
    }
    if (parsedFilters.bedrooms) {
      suggestions.push(`Check ${parsedFilters.bedrooms - 1 > 0 ? parsedFilters.bedrooms - 1 : 1} BHK or ${parsedFilters.bedrooms + 1} BHK alternatives`);
    }
  }

  // Fetch other top available properties (excluding primary matches) to show comprehensive options
  const matchedIds = properties.map((p) => p._id);
  const otherProperties = await Property.find({
    ...baseQuery,
    _id: { $nin: matchedIds },
  })
    .populate('owner', 'name email phone avatar')
    .limit(3)
    .sort({ createdAt: -1 });

  if (otherProperties.length > 0) {
    // Combine primary matches with other available options
    properties = [...properties, ...otherProperties];
  }

  return {
    properties,
    isFallback,
    fallbackReason,
    suggestions,
  };
}

/**
 * Build Mongoose query object from parsed filter structure
 */
function buildMongoQuery(filters, baseQuery = {}) {
  const query = { ...baseQuery };

  // City matching
  if (filters.city) {
    query['address.city'] = new RegExp(filters.city, 'i');
  }

  // Rent Amount matching
  if (filters.maxRent || filters.minRent) {
    query.rentAmount = {};
    if (filters.maxRent) query.rentAmount.$lte = filters.maxRent;
    if (filters.minRent) query.rentAmount.$gte = filters.minRent;
  }

  // Bedrooms matching
  if (filters.bedrooms) {
    query.bedrooms = filters.bedrooms;
  }

  // Property type matching
  if (filters.type) {
    // Map simplified types to schema enum values
    const typeEnumMap = {
      flat_apartment: ['flat_apartment', 'apartment'],
      independent_house: ['independent_house', 'house'],
      builder_floor: ['builder_floor'],
      villa: ['villa'],
      studio: ['studio'],
      pg_shared: ['pg_shared'],
    };

    if (typeEnumMap[filters.type]) {
      query.type = { $in: typeEnumMap[filters.type] };
    } else {
      query.type = filters.type;
    }
  }

  // Amenities matching (case-insensitive substring match)
  if (filters.amenities && filters.amenities.length > 0) {
    const amenityRegexes = filters.amenities.map((a) => new RegExp(a, 'i'));
    query.amenities = { $all: amenityRegexes };
  }

  // Keywords (family / luxury / affordable) search in description or title if present
  if (filters.keywords && filters.keywords.length > 0 && !filters.city && !filters.bedrooms) {
    const keywordRegexes = filters.keywords.map((k) => new RegExp(k, 'i'));
    query.$or = [
      { title: { $in: keywordRegexes } },
      { description: { $in: keywordRegexes } },
    ];
  }

  return query;
}

module.exports = {
  searchProperties,
  buildMongoQuery,
};
