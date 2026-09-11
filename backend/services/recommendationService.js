/**
 * Smart Recommendation Service
 * Transparent scoring algorithm to generate personalized property recommendations for tenants.
 */

const Property = require('../models/Property');
const Favorite = require('../models/Favorite');
const Application = require('../models/Application');

/**
 * Generate property recommendations for a specific tenant user.
 * @param {String} userId - MongoDB ObjectId of the tenant user
 * @param {Number} limit - Maximum number of recommendations to return
 */
async function getTenantRecommendations(userId, limit = 6) {
  // 1. Fetch user's historical interactions
  const [favorites, applications] = await Promise.all([
    Favorite.find({ tenant: userId }).populate('property'),
    Application.find({ tenant: userId }).populate('property'),
  ]);

  // Extract referenced properties
  const interactedProperties = [];
  favorites.forEach((fav) => fav.property && interactedProperties.push(fav.property));
  applications.forEach((app) => app.property && interactedProperties.push(app.property));

  // IDs of properties user already favorited or applied to (to avoid redundant primary recommendations or to rank)
  const interactedIds = new Set(interactedProperties.map((p) => p._id.toString()));

  // 2. Build tenant preference profile from history
  const profile = buildPreferenceProfile(interactedProperties);

  // 3. Query all available and verified properties
  const candidateProperties = await Property.find({
    status: 'available',
    verificationStatus: 'approved',
  }).populate('owner', 'name email phone avatar');

  if (candidateProperties.length === 0) {
    return [];
  }

  // 4. Calculate recommendation score & explanation for each candidate
  const scoredRecommendations = candidateProperties.map((property) => {
    const { matchScore, matches } = calculateMatchScore(property, profile);
    const explanation = generateExplanation(matches, property, profile);

    return {
      property,
      matchScore,
      explanation,
      matches,
      isFavorite: favorites.some((f) => f.property && f.property._id.toString() === property._id.toString()),
      hasApplied: applications.some((a) => a.property && a.property._id.toString() === property._id.toString()),
    };
  });

  // 5. Sort by match score descending and limit results
  scoredRecommendations.sort((a, b) => b.matchScore - a.matchScore);

  return scoredRecommendations.slice(0, limit);
}

/**
 * Build average preference profile based on tenant's saved and applied properties
 */
function buildPreferenceProfile(properties) {
  if (!properties || properties.length === 0) {
    return {
      hasHistory: false,
      preferredCities: {},
      avgBudget: 25000,
      preferredBHK: {},
      preferredTypes: {},
      preferredAmenities: new Set(),
    };
  }

  const cities = {};
  const bhks = {};
  const types = {};
  const amenitiesCount = {};
  let totalRent = 0;

  properties.forEach((p) => {
    if (p.address && p.address.city) {
      const cityKey = p.address.city.toLowerCase();
      cities[cityKey] = (cities[cityKey] || 0) + 1;
    }

    if (p.rentAmount) {
      totalRent += p.rentAmount;
    }

    if (p.bedrooms) {
      bhks[p.bedrooms] = (bhks[p.bedrooms] || 0) + 1;
    }

    if (p.type) {
      types[p.type] = (types[p.type] || 0) + 1;
    }

    if (Array.isArray(p.amenities)) {
      p.amenities.forEach((a) => {
        const lowerA = a.toLowerCase();
        amenitiesCount[lowerA] = (amenitiesCount[lowerA] || 0) + 1;
      });
    }
  });

  const avgBudget = Math.round(totalRent / properties.length);

  return {
    hasHistory: true,
    preferredCities: cities,
    avgBudget,
    preferredBHK: bhks,
    preferredTypes: types,
    preferredAmenities: new Set(Object.keys(amenitiesCount)),
  };
}

/**
 * Calculate match score (0 to 100) based on weighted factors
 */
function calculateMatchScore(property, profile) {
  if (!profile.hasHistory) {
    // Default fallback scoring for users without history (based on completeness & premium features)
    let score = 75;
    const matches = [];

    if (property.verificationStatus === 'approved') {
      score += 10;
      matches.push('Verified Listing');
    }
    if (property.rentAmount <= 25000) {
      score += 10;
      matches.push('Affordable Budget');
    }
    if (property.bedrooms === 2) {
      matches.push('Popular 2 BHK');
    }

    return { matchScore: Math.min(score, 98), matches };
  }

  let totalPoints = 0;
  const matches = [];

  // Factor 1: Location Match (30 points)
  if (property.address && property.address.city) {
    const cityKey = property.address.city.toLowerCase();
    if (profile.preferredCities[cityKey]) {
      totalPoints += 30;
      matches.push(`Preferred Location (${property.address.city})`);
    }
  }

  // Factor 2: Budget Match (25 points)
  if (property.rentAmount && profile.avgBudget) {
    const ratio = property.rentAmount / profile.avgBudget;
    if (ratio >= 0.75 && ratio <= 1.25) {
      totalPoints += 25;
      matches.push(`Matches Target Budget (₹${property.rentAmount.toLocaleString('en-IN')})`);
    } else if (ratio >= 0.5 && ratio <= 1.5) {
      totalPoints += 15;
      matches.push('Within Flexible Budget');
    }
  }

  // Factor 3: BHK Match (20 points)
  if (property.bedrooms && profile.preferredBHK[property.bedrooms]) {
    totalPoints += 20;
    matches.push(`Matches ${property.bedrooms} BHK Preference`);
  }

  // Factor 4: Property Type Match (15 points)
  if (property.type && profile.preferredTypes[property.type]) {
    totalPoints += 15;
    matches.push('Preferred Property Layout');
  }

  // Factor 5: Amenities Match (10 points)
  if (Array.isArray(property.amenities) && profile.preferredAmenities.size > 0) {
    const matchingAmenities = property.amenities.filter((a) =>
      profile.preferredAmenities.has(a.toLowerCase())
    );
    if (matchingAmenities.length > 0) {
      totalPoints += Math.min(10, matchingAmenities.length * 4);
      matches.push(`Has Preferred Amenities (${matchingAmenities.slice(0, 2).join(', ')})`);
    }
  }

  const finalScore = Math.max(60, Math.min(totalPoints, 99));
  return { matchScore: finalScore, matches };
}

/**
 * Human-readable match explanation string
 */
function generateExplanation(matches, property, profile) {
  if (!profile.hasHistory) {
    return 'Recommended based on high tenant popularity and verified landlord status.';
  }

  if (matches.length > 0) {
    return `Recommended because it matches your ${matches.slice(0, 3).join(', ').toLowerCase()}.`;
  }

  return `Recommended option in ${property.address.city} within your preferred price range.`;
}

module.exports = {
  getTenantRecommendations,
  buildPreferenceProfile,
  calculateMatchScore,
};
