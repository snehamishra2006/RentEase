const express = require('express');
const router = express.Router();
const { searchPropertiesAI, getRecommendationsAI } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// Natural Language AI Property Search
router.post('/property-search', searchPropertiesAI);

// Smart AI Personalized Recommendations for Logged-In Tenants
router.get('/recommendations', protect, getRecommendationsAI);

module.exports = router;
