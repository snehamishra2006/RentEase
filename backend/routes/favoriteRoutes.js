const express = require('express');
const { getFavorites, toggleFavorite } = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', protect, authorize('tenant'), getFavorites);
router.post('/:propertyId', protect, authorize('tenant'), toggleFavorite);

module.exports = router;
